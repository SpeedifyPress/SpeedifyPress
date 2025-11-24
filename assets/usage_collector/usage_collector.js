/**
 * CSSUsageCollector class is responsible for collecting and processing CSS rules
 * from stylesheets on the current page. It supports options to conditionally log warnings,
 * include specific classes based on regex patterns, and run when the browser is idle.
 */
class CSSUsageCollector {
    /**
     * @param {boolean} logWarnings - Whether to log warnings to the console. Defaults to true.
     * @param {Array<RegExp>} includePatterns - An array of regex patterns. Selectors matching these patterns will always be included.
     */
    constructor(logWarnings = true, includePatterns = []) {

        /**
         * Object to store collected CSS rules, keyed by stylesheet href.
         * @type {Object<string, string>}
         */
        this.stylesheetsCSS = {};

        /**
         * Object to store collected CSS selectorTexts
         * @type {Object<string, string>}
         */
        this.selectorTexts = {};        
        this.selectorTexts['rules'] = {};
        this.selectorTexts['keyframes'] = {};
        this.selectorTexts['fonts'] = {};

        /**
         * The host of the current document.
         * @type {string}
         */
        this.currentHost = window.location.host;

        /**
         * classes already present in server-provided includes
         * @type {Set<string>}
         */
        this.alreadyIncluded = new Set(
            Array.isArray(window.speed_css_vars?.force_includes) ? window.speed_css_vars.force_includes : []
        );        

        /**
         * Whether to log warnings to the console.
         * @type {boolean}
         */
        this.logWarnings = logWarnings;

        /**
         * An array of regex patterns. Selectors matching these patterns will always be included.
         * @type {Array<RegExp>}
         */
        this.includePatterns = includePatterns;

        /**
         * Total length of CSS processed.
         * @type {number}
         */
        this.totalOriginalLength = 0;

        /**
         * Total length of CSS after filtering.
         * @type {number}
         */
        this.totalFilteredLength = 0;

        /**
         * Whether or not the user has collected
         * @type {boolean}
         */
        this.has_collected = false;

        /**
         * True once the first config POST has returned
         * @type {boolean}
         */
        this.initialUpdateSent = false;        

        /**
         *  Observed class signatures (sorted, deduped space-joined classList)
         * @type {Set<string>}
         */
        this.observedClasses = new Set();

        /**
         * Font families used in the dom
         * @type {Set<string>}
         */
        this.foundFamilies = new Set();

        /**
         * Font rules that get used and should be
         * preloaded
         * @type {Set<string>}
         */
        this.usedFontRules = new Set();          

        /**
         * Classes used in the dom
         * @type {Set<string>}
         */
        this.usedKeyframes = new Set();              

        /**
         * keep a strong ref so it never gets GC'd
         * @type {MutationObserver|null}
         */
        this.classObserver = null;     

        /**
         * debounce timer for incremental updates        
         * @type {number|null}
         */
        this.classUpdateTimer = null;  

        /**
         * Add a string here to debug selectors
         * @type <string>
         */
        this.debug_selector = "";

        /**
         * General debugging enabled or not
         * @type <bool>
         */
        this.debug = false;

    }

    /**
     * Collects CSS usage when the browser is in an idle state. This is useful for cases
     * where you want to avoid collecting CSS usage while the user is actively interacting
     * with the page.
     */
    collect_when_idle() {

        if (typeof this.scrollListener !== "undefined") {
            window.removeEventListener('scroll', this.scrollListener); 
        }

        // Only run the collector when idle
        requestIdleCallback(() => {
            if(this.has_collected == false) {
                if(this.debug) {
                    console.log("Collecting after idle");
                }
                this.flash_scroll();
                this.collect();                
            }            
        });

    }    

    /**
     * Initiates the CSS collection process by iterating over all stylesheets
     * and processing each one that matches the criteria.
     * @returns {Promise<Object<string, string>>} - The collected CSS rules organized by stylesheet href.
     */
    async collect() {

        if(this.debug) {
            console.log("Start collect");
        }

        if(this.has_collected == true) {
            if(this.debug) {
                console.log("Already collected");
            }
            return;
        }

        //Show any hidden or template contained areas
        if(typeof window.restoreTemplateContentAndImages === "function") {
            window.restoreTemplateContentAndImages();
        }

        // Abort if no LCP shows up (Incognito / hard reload / cross-origin cases)
        const hasLcp = await this.waitForLcpOrTimeout(1000);
        if (!hasLcp) {
            if (this.debug) console.warn('No LCP entries found; continuing without LCP payload.');
            this.has_collected = true;            
            this.initialUpdateSent = true;   
            return;       
        }

        this.has_collected = true;      

        var bodyClass = document.body.className;
        var classList = bodyClass.split(/\s+/);
        var regex = /^(rtl|home|blog|privacy-policy|archive|date|search(-[a-zA-Z0-9-_]+)?|paged|attachment|error404|[a-zA-Z0-9-__]+-template|single(-[a-zA-Z0-9-_]+)?|page(-[a-zA-Z0-9-_]+)?|post-type-archive(-[a-zA-Z0-9-_]+)?|author(-[a-zA-Z0-9-_]+)?|category(-[a-zA-Z0-9-_]+)?|tag(-[a-zA-Z0-9-_]+)?|tax(-[a-zA-Z0-9-_]+)?|term(-[a-zA-Z0-9-_]+)?)$/;
        var post_types = classList.filter(function(cls) {
            return regex.test(cls);
        });

        if(this.debug) {
            console.log("Set vars 1");
        } 

        var invisibleElements = this.getAllInvisibleElements();

        if(this.debug) {
            console.log("Got invisible element");
        }

        await this.getLcpImage().then((image) => {

            const toSend = [...this.observedClasses].filter(c => !this.alreadyIncluded.has(c));
            
            this.updateConfig({ csrf: window.spdy_csrfToken, 
                                force_includes: toSend, 
                                url: document.location.href, 
                                post_id: (document.body.className.split(' ').find(cls => cls.startsWith('postid-') || cls.startsWith('page-id-'))?.replace(/(postid-|page-id-)/, '') || null), 
                                post_types: post_types,
                                invisible: {elements: invisibleElements, viewport: { width:window.innerWidth, height: window.innerHeight }},
                                usedFontRules: [...this.getFontsDownloaded()].join("|"),
                                icon_fonts: this.getIconFontFamilies(),
                                lcp_image: image
                            }
                           );                      

        });

    }


    /**
     * Sends the collected CSS data to the server via a POST request.
     * @param {Object} data - The data to send, typically containing CSS and the current page URL.
     */
    updateConfig(data) {

        if(this.debug) {
            console.log("Update config with ",data);
        }        

        (async () => {
            try {
                // Convert the input data to a JSON string and compress it
                const inputStr = JSON.stringify(data);
                const base64CompressedData = await this.compressAndBase64Encode(inputStr);

                if(base64CompressedData == false) {
                    console.warn('Unable to update CSS on this browser');
                    return;
                }
        
                // Send the compressed data via fetch
                const response = await fetch(window.speed_css_vars.resturl + 'speedifypress/update_css', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ compressedData: base64CompressedData }), // Wrap in an object if needed
                });

                // Flag first update sent 
                if (!this.initialUpdateSent) this.initialUpdateSent = true;
        
                // Handle the response
                const responseData = await response.json();
                console.log('Successfully updated CSS:', responseData);
            } catch (error) {
                console.log('Error updating config:', error);
            }
        })();
        
    }

    /**
     * Finds all font URLs from CSS and checks which ones are in the 
     * Performance entries as downloaded resources.
     * 
     * @returns {Set<string>} - A set of font URLs that have been downloaded.
     */
    getFontsDownloaded() {

        if (!'getEntriesByType' in performance) {
            return new Set();
        }        

        const fontUrls = new Set();

        // Helper function to normalize URLs, resolving relative paths against a base URL
        const normalizeUrl = (url, base) => {
            try {
                return new URL(url, base).href; // Resolve against the base URL
            } catch (e) {
                return url; // Return original if normalization fails
            }
        };
    
        // Find all font URLs from CSS
        for (const sheet of document.styleSheets) {
            try {
                const baseHref = sheet.href || document.baseURI; // Use stylesheet's href or document's base URI
                for (const rule of sheet.cssRules) {
                    if (rule.type === CSSRule.FONT_FACE_RULE) {
                        const src = rule.style.getPropertyValue('src');
                        if (src) {
                            const matches = src.match(/url\(([^)]+)\)/g);
                            if (matches) {
                                matches.forEach((url) => {
                                    const cleanUrl = url.replace(/url\(|\)|'|"/g, '').trim();
                                    const normalized = normalizeUrl(cleanUrl, baseHref);
                                    fontUrls.add(normalized);
                                });
                            }
                        }
                    }
                }
            } catch (e) {
            }
        }
    
        // Check which URLs are in the Performance entries
        const downloadedFonts = new Set();
        performance.getEntriesByType('resource').forEach((entry) => {
            const normalizedEntry = normalizeUrl(entry.name, document.baseURI);
            if (fontUrls.has(normalizedEntry)) {
                downloadedFonts.add(entry.name);
            }
        });
        
        return downloadedFonts;


    }

    /**
     * Scans the DOM for icon-like pseudo-elements (::before/::after) whose
     * computed `content` looks like a unicode escape or Private Use Area glyph,
     * and returns a de-duplicated, sorted array of the font-family names used.
     * @returns {string[]}
     */
    getIconFontFamilies() {
        const fonts = new Set();
        const pseudos = ["::before", "::after"];

        const hasUnicodeEscape = (s) => /\\[0-9a-fA-F]{1,6}\s?/.test(s || "");
        const hasPUAGlyph = (s = "") => {
            for (const ch of s) {
                const cp = ch.codePointAt(0);
                if ((cp >= 0xE000 && cp <= 0xF8FF) || (cp >= 0xF0000 && cp <= 0xFFFFD) || (cp >= 0x100000 && cp <= 0x10FFFD)) {
                    return true;
                }
            }
            return false;
        };
        const stripQuotes = (s) => (s && /^['"].*['"]$/.test(s) ? s.slice(1, -1) : s);

        document.querySelectorAll("*").forEach((el) => {
            pseudos.forEach((pseudo) => {
                const cs = getComputedStyle(el, pseudo);
                let content = cs.getPropertyValue("content") || "";
                const raw = content;
                content = stripQuotes(content);

                if (!content || content === "none" || content === "normal") return;
                if (!(hasPUAGlyph(content) || hasUnicodeEscape(raw))) return;

                const ff = cs.getPropertyValue("font-family") || "";
                ff.split(",")
                    .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
                    .filter(Boolean)
                    .forEach((name) => fonts.add(name));
            });
        });

        return Array.from(fonts).sort((a, b) => a.localeCompare(b));
    }    

    // Returns true if at least one LCP entry appears within maxWaitMs
    async  waitForLcpOrTimeout(maxWaitMs = 3000) {
        return new Promise((resolve) => {
            let done = false;
            let po;

            const finish = (ok) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            po?.disconnect();
            resolve(ok);
            };

            try {
                if ('PerformanceObserver' in window &&
                    PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
                    po = new PerformanceObserver((list) => {
                    if (list.getEntries().length) finish(true);
                    });
                    // `buffered: true` delivers any already-recorded LCP entries immediately
                    po.observe({ type: 'largest-contentful-paint', buffered: true });
                } else {
                    // LCP not supported → just time out
                    // (you could feature-detect differently if you want)
                }
            } catch {
            // ignore and let the timeout resolve false
            }

            const timer = setTimeout(() => finish(false), maxWaitMs);
        });
    }

    /**
     * Retrieves the URL of the LCP (Largest Contentful Paint) image.
     * Returns a promise that resolves with the URL of the LCP image or 
     * an empty string if no LCP image is found.
     * 
     * @returns {Promise<string>}
     */        
    getLcpImage() {

        return new Promise((resolve) => {
            if (
                !("PerformanceObserver" in window) ||
                !PerformanceObserver.supportedEntryTypes ||
                !PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint")
            ) {
                resolve("");
                return;
            }

            let lcp = "";
            const timeoutDuration = 500;

            const po = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const el = entry.element || null;

                    // Prefer element when exposed
                    if (el && el.tagName === "IMG") {
                        lcp = el.currentSrc || el.src || lcp;
                    } else if (el && el.tagName === "VIDEO" && el.poster) {
                        lcp = el.poster || lcp;
                    }

                    // Fall back to entry.url for cross-origin/background-image LCP
                    if (!lcp && entry.url) {
                        lcp = entry.url;
                    }
                }

                if (lcp) {
                    resolve(lcp);
                    po.disconnect();
                }
            });

            try {
                po.observe({
                    type: "largest-contentful-paint",
                    buffered: true
                });
            } catch {
                try {
                    po.observe({
                        entryTypes: ["largest-contentful-paint"]
                    });
                } catch {
                    resolve("");
                    return;
                }
            }

            setTimeout(() => {
                po.disconnect();
                resolve(lcp || "");
            }, timeoutDuration);
        });
    }


    /**
     * Logs a warning to the console if logging is enabled.
     * @param  {...any} args - Arguments to pass to console.warn.
     */
    warn(...args) {
        if (this.logWarnings) {
            console.warn(...args);
        }
    }


    /**
     * Compress a string and return a base64-encoded compressed result.
     *
     * @param {string} inputString
     * @returns {Promise<string>} Base64 encoded compressed string
     */
    async  compressAndBase64Encode(inputString) {
        try {
        // Encode the input string to a Uint8Array
        const encoder = new TextEncoder();
        const inputData = encoder.encode(inputString);
    
        // Create a stream from the Uint8Array
        const stream = new Blob([inputData]).stream();
    
        // Create a compressed stream using GZIP
        const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));
    
        // Create a reader to read the compressed stream
        const reader = compressedStream.getReader();
    
        // Read all chunks from the reader
        const chunks = [];
        let done, value;
        while (true) {
            ({ done, value } = await reader.read());
            if (done) break;
            chunks.push(value);
        }
    
        // Concatenate the chunks into a single Uint8Array
        const compressedData = this.concatUint8Arrays(chunks);
    
        // Convert the Uint8Array to a binary string for base64 encoding
        let binaryString = '';
        for (let i = 0; i < compressedData.length; i++) {
            binaryString += String.fromCharCode(compressedData[i]);
        }
    
        // Base64-encode the binary string
        const base64String = btoa(binaryString);
    
        return base64String;
        } catch (error) {
        return false;
        }
    }
  
    /**
     * Concatenate an array of Uint8Arrays into a single Uint8Array.
     *
     * @param {Uint8Array[]} arrays
     * @returns {Uint8Array}
     */
    concatUint8Arrays(arrays) {
        let totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
        let result = new Uint8Array(totalLength);
        let offset = 0;
        for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
        }
        return result;
    } 

    /**
     * Recursively traverses the DOM tree rooted at the given element, and
     * collects all elements that are outside the viewport and have non-zero
     * width and height. The collected elements are returned in an array, with
     * each element represented as an object with the following properties:
     *
     *   - path: a unique string path to the element in the DOM, e.g.
     *     "div > p:nth-child(2) > span:nth-child(1)";
     *   - width: the width of the element in pixels;
     *   - height: the height of the element in pixels.
     *
     * @param {Element} [root=document.body] - the root element to start traversing
     *   from; defaults to `document.body` if not provided.
     * @returns {Object[]} an array of objects, each representing an invisible
     *   element in the DOM.
     */    
    getAllInvisibleElements(root = document.body) {

        const invisibleElementsData = [];
        const SPEED_JS_MARKER = 'var speed_js_vars =';

        // Function to get element's position relative to the document
        function getElementDocumentPosition(element) {
            let x = 0, y = 0;
            let currentElement = element;

            while (currentElement) {
                x += currentElement.offsetLeft - currentElement.scrollLeft + (parseFloat(window.getComputedStyle(currentElement).borderLeftWidth) || 0);
                y += currentElement.offsetTop - currentElement.scrollTop + (parseFloat(window.getComputedStyle(currentElement).borderTopWidth) || 0);
                currentElement = currentElement.offsetParent;
            }

            return { x: x, y: y };
        }

        // Exclude any element that contains "var speed_js_vars =" within itself or its descendants
        function containsSpeedVars(el) {
            if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
            if (el.tagName === 'SCRIPT' && el.textContent && el.textContent.includes(SPEED_JS_MARKER)) return true;
            if (typeof el.innerHTML === 'string' && el.innerHTML.includes(SPEED_JS_MARKER)) return true;
            const scripts = el.getElementsByTagName('script');
            for (let s of scripts) {
                if (s.textContent && s.textContent.includes(SPEED_JS_MARKER)) return true;
            }
            return false;
        }

        function checkVisibility(element) {
            if (element !== document.body) {
                const position = getElementDocumentPosition(element);
                const style = window.getComputedStyle(element);
                const hasDimensions = element.offsetWidth > 0 && element.offsetHeight > 0;

                // Define the initial viewport coordinates in the document coordinate system
                const viewportTop = 0;
                const viewportBottom = 1366;
                const viewportLeft = 0;
                const viewportRight = 1024;

                const elemTop = position.y;
                const elemBottom = elemTop + element.offsetHeight;
                const elemLeft = position.x;
                const elemRight = elemLeft + element.offsetWidth;

                // Check if element is outside the initial viewport at position (0,0)
                const isOutsideInitialViewport = (
                    elemBottom <= viewportTop || // Above the viewport
                    elemTop >= viewportBottom  // Below the viewport
                );

                // Exclude elements with position: fixed or position: sticky
                const isStickyFixed = (style.position === 'fixed' || style.position === 'sticky');

                const isVisuallyHidden = (
                    style.visibility === 'hidden' ||
                    style.opacity === '0' ||
                    style.display === 'none' ||
                    style.clip === 'rect(1px, 1px, 1px, 1px)' || // Hidden via clip
                    style.clipPath === 'inset(50%)' || // Hidden via clip-path
                    (parseFloat(style.width) <= 1 && parseFloat(style.height) <= 1) || // Tiny elements
                    (style.overflow === 'hidden' && parseFloat(style.height) <= 1)     // Tiny element in hidden overflow
                );

                if (
                    isOutsideInitialViewport &&
                    hasDimensions &&
                    !isVisuallyHidden &&
                    !isStickyFixed &&
                    !containsSpeedVars(element)
                ) {
                    invisibleElementsData.push({
                        spuid: element.dataset.spuid,
                        /*width: element.offsetWidth,
                        height: element.offsetHeight,
                        element: element,
                        position: {elemTop,elemRight,elemBottom,elemLeft},
                        viewport: {viewportTop,viewportRight,viewportBottom,viewportLeft}*/
                    });
                    return;
                }
            }

            // Continue checking child elements
            for (let child of element.children) {
                checkVisibility(child);
            }
        }

        checkVisibility(root);
        return invisibleElementsData;
    }

    
    /**
     * Schedules an update of the observed classes to be sent to the server after a short delay.
     * This is used to batch up class updates and reduce the number of requests sent to the server.
     * The update is sent with a POST request to the server, with the following data:
     * - csrf: the current CSRF token
     * - url: the current URL
     * - force_includes: an array of the currently observed classes
     * The delay is 300 milliseconds.
     */
    scheduleClassUpdate() {
        if (!this.initialUpdateSent) return; // bail until first payload done
        clearTimeout(this.classUpdateTimer);
        this.classUpdateTimer = setTimeout(() => {
            try {
                const toSend = [...this.observedClasses].filter(c => !this.alreadyIncluded.has(c));
                if (!toSend.length) return;
                this.updateConfig({
                    csrf: window.spdy_csrfToken,
                    url: document.location.href,
                    force_includes: [...this.observedClasses],
                    force_includes_only: true
                });
                toSend.forEach(c => this.alreadyIncluded.add(c)); //don't resend ones already sent
            } catch (_) {}
        }, 1000);
    }

    

    /**
     * Returns a sorted, unique list of class values from the given element.
     * The list is constructed by iterating over the element's classList,
     * converting it to an array, and then using a Set to remove duplicates.
     * The resulting array is then filtered to remove any empty strings, sorted
     * alphabetically, and joined into a single string with spaces separating
     * each class value.
     * @param {Element} el - the element from which to retrieve the class values
     * @returns {string} - the sorted, unique list of class values as a single string
     */
    _getSortedUniqueClassValue(el) {
        return Array.from(new Set(Array.from(el.classList))).filter(Boolean).sort().join(' ');
    }    

    /**
     * Initializes a MutationObserver to track and collect newly added CSS
     * classes in the DOM. The observer listens for attribute changes on
     * all elements within the document body, specifically monitoring for
     * changes to the 'class' attribute. When a new class is detected that
     * is not already in the set of observed classes, it is added to the set.
     */
    start_collect_added_classes() {

        // Create a MutationObserver instance
        this.classObserver = new MutationObserver((mutationsList) => {

            let anyAdded = false; //aggregate across all mutations in this callback

            for (const mutation of mutationsList) {

                // Check if the mutation is an attribute change and if the attribute is 'class'
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {

                    // Previous tokens from oldValue (
                    const prev = mutation.oldValue ? mutation.oldValue.trim().split(/\s+/).filter(Boolean) : [];
                    const prevSet = new Set(prev);

                    // Diff: tokens now present that were not in the previous value
                    const newClasses = Array.from(mutation.target.classList).filter(c => !prevSet.has(c));

                    if (newClasses.length) {
                        let localAdded = false;
                        for (const cls of newClasses) {
                            if (!this.observedClasses.has(cls)) {
                                this.observedClasses.add(cls); // e.g. "fadeInUp"
                                localAdded = true;
                            }
                        }
                        if (localAdded) anyAdded = true;
                    }


                }

            }

            if (anyAdded) this.scheduleClassUpdate(); // schedule even if later mutations are empty

        });        

        // Configure the observer to watch for attribute changes in the whole document
        this.classObserver.observe(document.body, {
            attributes: true, // Listen for attribute changes
            subtree: true,     // Observe all elements within the document body
            attributeFilter: ['class'],
            attributeOldValue: true,
        });

    }


    /**
     * Adds an event listener to the window scroll event to debounce CSS usage collection
     * until the user has stopped scrolling for 1 second.
     * 
     * This method is useful for cases where you want to only collect CSS usage after
     * the user has finished scrolling.
     */
    collect_after_scroll(debug=false) {

        if(debug) {
            this.debug = true;
        }

        // Collect added classes
        this.start_collect_added_classes();      

        // Define the scroll listener function to debounce collection after scroll activity
        this.scrollListener = () => {

            // Debounce to wait for idle state after scrolling
            clearTimeout(window.scrollIdleTimeout);

            window.scrollIdleTimeout = setTimeout(() => {
                if(this.debug) {
                    console.log("Collecting after scroll");
                }
                this.collect_when_idle();
            }, 1000);  // 1000ms delay after scroll ends


        };

        setTimeout(() => {
            if(this.debug) {
                console.log("Collecting after timeout");
            }
            window.removeEventListener('scroll', this.scrollListener);
            this.collect_when_idle();
        }, 5000);  // 5000ms delay to collect anyway

        // Add the scroll event listener
        window.addEventListener('scroll', this.scrollListener);  


    }

    /**
     * Flash the scroll position to full document height 
     * and back to the original position.
     * 
     * This method is useful for triggering scroll event listeners, such 
     * as those that lazy load content, without actually changing the user's 
     * scroll position.
     */
    flash_scroll() {

        // Save the current scroll position
        const originalScrollPosition = window.scrollY;
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'instant' // No smooth scroll, so it’s not noticeable
        });

        // Scroll to bottom
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'instant' // No smooth scroll, so it’s not noticeable
        });

        // Dispatch the scroll event to ensure listeners respond to the new position
        window.dispatchEvent(new Event('scroll'));

        // Revert back to the original scroll position immediately
        window.scrollTo({
            top: originalScrollPosition,
            behavior: 'instant'
        });

    }



}

(function() {

    //Test to see if run or not at this resolution
    let resolutions = speed_css_vars.generation_res ?? 'desktop';

    const width = window.innerWidth;
    let deviceType;

    if (width <= 768) {
        deviceType = 'mobile';
    } else if (width > 768 && width <= 1024) {
        deviceType = 'tablet';
    } else {
        deviceType = 'desktop';
    }    

    let num_inlined = document.querySelectorAll("style[rel='spress-inlined']").length;

    let num_to_process = document.querySelectorAll('link[rel="stylesheet"][href]:not([data-spress-processed="true"])').length;
    let currentDomain = new URL(window.location.href).hostname;
    Array.prototype.forEach.call(document.querySelectorAll('link[rel="stylesheet"][href]:not([data-spress-processed="true"])'), function(link) {
    let linkDomain = new URL(link.href).hostname;
        if (linkDomain !== currentDomain) {
            num_to_process--;
        }
    });    

    //Don't collect if logged in exceptions
    //let num_logged_in_exceptions = document.querySelectorAll('.logged_in_exception').length;
    /* Re-enabled, but the CSS must be added to the custom preload for this to work properly */

    if(resolutions[deviceType] === 'true') {
        var includePatterns = JSON.parse(speed_css_vars.include_patterns); // patterns to always include
        includePatterns = includePatterns.map(pattern => new RegExp(pattern.replace(/\\\\/g, '\\')));
        const collector = new CSSUsageCollector(false, includePatterns); // Pass false to disable warning logging

        if( num_inlined === 0 && num_to_process > 0) {         
            collector.collect_after_scroll(false);
        } 

    } 
})();

