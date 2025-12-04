/**
 * JsDelayer class for managing script loading based on user interaction or timeout.
 */
class JsDelayer {

    static _addListenerPatched = false;
    static captureEvents = ["readystatechange", "DOMContentLoaded", "load"];
    static captured = {
        readystatechange: [],
        DOMContentLoaded: [],
        load: []
    };
    static capturing = false;

    static nativeAdd     = EventTarget.prototype.addEventListener;
    static nativeWinAdd  = window.addEventListener;
    static nativeDocAdd  = document.addEventListener;

    static patchedAddEventListener(type, listener, options) {
        if (
            JsDelayer.capturing &&
            JsDelayer.captureEvents.includes(type) &&
            window.speed_js_vars &&
            window.speed_js_vars.trigger_native_events === "true"
        ) {
            JsDelayer.captured[type].push({
                target: this,
                listener,
                options
            });
            return;
        }

        if (this === window) {
            return JsDelayer.nativeWinAdd.call(window, type, listener, options);
        }

        if (this === document) {
            return JsDelayer.nativeDocAdd.call(document, type, listener, options);
        }

        return JsDelayer.nativeAdd.call(this, type, listener, options);
    }

    static ensurePatchedAddListener() {
        if (JsDelayer._addListenerPatched) return;
        JsDelayer._addListenerPatched = true;
        EventTarget.prototype.addEventListener = JsDelayer.patchedAddEventListener;
        window.addEventListener = JsDelayer.patchedAddEventListener;
        document.addEventListener = JsDelayer.patchedAddEventListener;
    }

    /**
     * Constructs a JsDelayer instance.
     * @param {string} load_first - Scripts to load first, separated by newline.
     * @param {string} load_last - Scripts to load last, separated by newline.
     * @param {number} timeout - Timeout in seconds to wait before loading scripts.
     * @param {boolean} debug - Enable or disable debugging.
     */
    constructor(load_first = "", load_last = "", timeout = 3, callback = false, debug = false) {
        this.loadFirst = new Set(this.parseList(load_first));
        this.loadLast = new Set(this.parseList(load_last));
        this.timeout = timeout * 1000;
        this.debug = debug;
        this.callback = callback;
        this.callback_run = false;
        this.hasTriggeredEvents = false;
        this._loading = false;

        this.savedClicks = new Set();
        this.savedMouseovers = new Set();

        this.interactionEvents = ["click","mouseover", "keydown", "touchstart", "touchmove", "wheel"];

        this.init();
    }

    /**
     * Parses a list of items separated by newline.
     * @param {string} listString - String containing items separated by newline.
     * @returns {Array} - Array of parsed items.
     */
    parseList(listString) {
        const list = listString.split("\n").filter((item) => item.trim() !== "");
        if (this.debug) {
            console.log("Parsed list:", list);
        }
        return list;
    }

    /**
     * Initializes the JsDelayer and sets up event listeners.
     */
    init() {

        if (this.debug) {
            console.log("JsDelayer initialized.");
            console.log("Load first scripts:", Array.from(this.loadFirst));
            console.log("Load last scripts:", Array.from(this.loadLast));
            console.log("Timeout set to:", this.timeout / 1000, "seconds");
        }

        //Setup bound functions, necessary for adding and removing 
        //listeners
        this.bound_start = this.startLoading.bind(this);
        this.boundTrackUserInteractions = this.trackUserInteractions.bind(this);

        //Add event listeners for our interaction events
        this.interactionEvents.forEach((event) => {
            window.addEventListener(event, this.bound_start, { passive: true });
        });

        //Track these events for replaying later
        if (window.speed_js_vars && window.speed_js_vars.trigger_replays === 'true') {
            if (this.debug) {
                console.log("Enabling replay tracking...");
            }
            window.addEventListener("click", this.boundTrackUserInteractions, { passive: true });
            window.addEventListener("mouseover", this.boundTrackUserInteractions, { passive: true });
        }

        // Set up timeout for delayed start
        setTimeout(this.bound_start, this.timeout);

    }
    
    /**
     * Ensure any delayed <template>-wrapped DOM has been restored
     * before we start executing deferred JS.
     */
    ensureTemplatesRestored() {
        // Only check when there are candidates that could still be templates
        const needsRestore = !!document.querySelector('.unused-invisible > template');
        if (!needsRestore) {
            return;
        }

        if (this.debug) {
            console.log("Ensuring templates are restored before loading scripts...");
        }

        try {
            if (typeof window.restoreTemplateContentAndImages === "function") {
                // Prefer the existing helper if present
                window.restoreTemplateContentAndImages();
                return;
            }

            // Minimal inline fallback if helper is not available yet
            document.querySelectorAll('.unused-invisible').forEach((element) => {
                const firstChild = element.children[0];
                if (firstChild && firstChild.tagName === 'TEMPLATE') {
                    element.style.contentVisibility = '';
                    element.style.containIntrinsicSize = '';
                    const templateContent = firstChild.content.cloneNode(true);
                    element.replaceChild(templateContent, firstChild);
                }
            });
        } catch (err) {
            if (this.debug) {
                console.error("Error while restoring templates before JS load:", err);
            }
        }
    }    

    /**
     * Tracks user interactions and saves click or mouseover events.
     * @param {Event} event - User interaction event.
     */
    trackUserInteractions(event) {
        if (typeof event == "undefined") {
            return;
        }

        if (!window.speed_js_vars || window.speed_js_vars.trigger_replays !== 'true') {
            return;
        }        

        if (this.debug) {
            console.log("Tracking user interaction:", event);
        }

        if (event.type == "mouseover") {
            this.savedMouseovers.add(event);
        }

        if (event.type == "click") {
            this.savedClicks.add(event);
        }
    }

    /**
     * Starts the script loading process and preloads scripts.
     * @param {Event} event - User interaction event.
     */
    startLoading(event) {

        if (this._loading) return;     // prevent concurrent runs

        if (this.debug) {
            console.log("Starting script loading process...", event);
        }

        //If this is a mouseover that can't exist, ignore
        if(typeof event != "undefined" && event.type == "mouseover" && matchMedia('(hover: hover)').matches == false) {
            return;
        }

        // Defer only while the document is *loading*. "interactive" is fine (DOMContentLoaded has fired).
        const domReady = document.readyState === "complete" || document.readyState === "interactive";
        if (!domReady) {
            if (!this._pendingDomReady) {
                this._pendingDomReady = true;
                if (this.debug) {
                    console.log("DOM not ready yet; waiting for DOMContentLoaded before loading scripts.");
                }
                document.addEventListener("DOMContentLoaded", this.bound_start, { once: true });
            }
            return;
        }  

        // Ensure templates are restored before running any deferred JS on the DOM.
        this.ensureTemplatesRestored();        
        
        this._loading = true; //prevent re-runs

        this.interactionEvents.forEach((event) => {
            window.removeEventListener(event, this.bound_start, { passive: true });
        });

        this.preloadScripts();
        this.loadScripts();
    }

    /**
     * Preloads scripts by adding link elements to the document head.
     */
    preloadScripts() {

        const scripts = this.getScriptOrder();
        if(scripts.length == 0) return;

        scripts.forEach((script) => {

            if (script.tagName === 'LINK') {

                const href = script.getAttribute('data-href');
                if (!href) return;

                if (this.debug) console.log('Restoring modulepreload:', href);

                script.setAttribute('href', href);
                script.removeAttribute('data-href');                

                if (script.hasAttribute('data-rel')) {
                    script.setAttribute('rel', script.getAttribute('data-rel'));
                    script.removeAttribute('data-rel');
                }                
            }

            if (script.tagName === 'SCRIPT') {

                const isModule = (script.getAttribute('type') || '').toLowerCase() === 'module';
                
                const src = script.getAttribute("data-src");
                if (!src || src === 'null' || src === 'undefined') return;

                // No point preloading inline data: URIs
                if (src.indexOf("data:") === 0) {
                    return;
                }                

                const link = document.createElement("link");

                if (isModule) {

                    link.rel = 'modulepreload';
                    link.href = src;

                    // Carry over attrs so fetch mode/credentials match the eventual module load
                    ['crossorigin', 'integrity', 'referrerpolicy'].forEach((attr) => {
                        if (script.hasAttribute(attr)) {
                            link.setAttribute(attr, script.getAttribute(attr));
                        }
                    });

                    if (this.debug) {
                        console.log('Modulepreloading:', src);
                    }

                } else {

                    link.rel = "preload";
                    link.as = "script";
                    link.href = src;

                    if (this.debug) {
                        console.log("Preloading scriptz:", src);
                    }

                }

                document.head.appendChild(link);

            }
        });
    }

    /**
     * Loads scripts in a specific order based on user configuration.
     */
    loadScripts() {

        // Only pass runnable <script> nodes to the final loader
        const scriptsToLoad = this.getScriptOrder().filter((n) => n.tagName === 'SCRIPT');
        if(scriptsToLoad.length == 0) return;        

        this.loadScriptsSequentially(scriptsToLoad);
    }

    /**
     * Determines the order of scripts to process based on `loadFirst` and `loadLast`.
     * @returns {Array} - Ordered list of script elements.
     */
    getScriptOrder() {
        const allScripts = [...document.querySelectorAll("script[data-src],link[data-rel='modulepreload']")];

        const firstScripts = allScripts.filter((script) => {
            const dataSrc = script.getAttribute("data-src") || script.getAttribute("data-href");
            if (!dataSrc) return false;

            // Match any name in `this.loadFirst` against the full URL
            return Array.from(this.loadFirst).some((name) => dataSrc.includes(name));
        });

        const lastScripts = allScripts.filter((script) => {
            const dataSrc = script.getAttribute("data-src") || script.getAttribute("data-href");
            if (!dataSrc) return false;

            // Match any name in `this.loadLast` against the full URL
            return Array.from(this.loadLast).some((name) => dataSrc.includes(name));
        });

        const otherScripts = allScripts.filter((script) => {
            const dataSrc = script.getAttribute("data-src") || script.getAttribute("data-href");
            if (!dataSrc) return false;

            // Exclude scripts matched in `firstScripts` and `lastScripts`
            return !Array.from(this.loadFirst).some((name) => dataSrc.includes(name)) &&
                !Array.from(this.loadLast).some((name) => dataSrc.includes(name));
        });

        const scriptsToLoad = [...firstScripts, ...otherScripts, ...lastScripts];

        if (this.debug) {
            console.log("First scripts", firstScripts, this.loadFirst);
            console.log("Last scripts", lastScripts, this.loadLast);
            console.log("Scripts to load in order:", scriptsToLoad.map((script) => (script.getAttribute("data-src") || script.getAttribute("data-href"))));
        }


        return scriptsToLoad || 0;
    }


    /**
     * Loads scripts sequentially and triggers events after loading.
     * @param {Array} scripts - Array of script elements to load.
     */
    loadScriptsSequentially(scripts) {

        // replay captured DOM ready/load listeners
        const replayCapturedListeners = () => {
            if (window.speed_js_vars && window.speed_js_vars.trigger_native_events === "true") {

                JsDelayer.capturing = false;
                JsDelayer.captureEvents.forEach((eventName) => {
                    JsDelayer.captured[eventName].forEach(({ target, listener }) => {
                        try {
                            const ev = new Event(eventName, {
                                bubbles: true,
                                cancelable: true
                            });
                            listener.call(target, ev);
                            if (this.debug) {
                                console.log("Triggered", eventName, "listener for", listener, "on", target);
                            }
                        } catch (err) {
                            if (this.debug) {
                                console.error("Error executing", eventName, "listener:", err);
                            }
                        }
                    });
                    JsDelayer.captured[eventName] = [];
                });

            }
        }

        const processScript = (index) => {
            if (index >= scripts.length) {
                //Dispatch event back to logged_in_exceptions worker
                document.dispatchEvent(new Event('delayedJSLoaded'));
                if (this.debug) {
                    console.log("All scripts loaded. Triggering events and replaying saved events...");
                }

                // now all delayed scripts have run, replay
                replayCapturedListeners();

                this.triggerEvents().then(() => {                    

                    setTimeout(() => {
                        if (window.speed_js_vars && window.speed_js_vars.trigger_replays === 'true') {
                            if (this.debug) {
                                console.log("Replaying saved events...");
                            }
                            window.removeEventListener("mouseover", this.boundTrackUserInteractions, { passive: true });
                            window.removeEventListener("click", this.boundTrackUserInteractions, { passive: true });        
                            this.replaySavedEvents();
                        }
                    },100);
                    //Run the oncompleted JS
                    if(this.callback && this.callback_run === false) {
                        const callback = new Function(this.callback);
                        if(typeof callback === 'function') {
                            callback();
                            this.callback_run = true;
                        }
                    }
                    //Run again as it's possible new scripts have been added
                    var num_scripts = this.getScriptOrder().length;
                    if (this.debug) {
                        console.log("Rerunning script loader...",num_scripts);
                    }                
                    if(num_scripts > 0) {
                        this.bound_start(); 
                    }                    
                });  
                return;              
            }

            const node = scripts[index];

            // Skip anything that's not a <script>
            if (!node || node.tagName !== 'SCRIPT') {
                processScript(index + 1);
                return;
            }

            const src = node.getAttribute('data-src');

            // If we don't have a usable URL, skip WITHOUT writing back
            if (!src || src === 'null' || src === 'undefined') {
                if (this.debug) console.warn('Skipping script with invalid data-src:', node, src);
                processScript(index + 1);
                return;
            }

            node.onload  = () => {
                JsDelayer.capturing = false;
                processScript(index + 1);
            };
            node.onerror = () => {
                JsDelayer.capturing = false;
                processScript(index + 1);
            };

            JsDelayer.capturing = true;
            node.src = src;
            node.removeAttribute('data-src');
        };

        processScript(0);
    }

    /**
     * Triggers custom events and jQuery events if jQuery is available.
     */
    triggerEvents() {

        return new Promise((resolve) => {

            if (this.hasTriggeredEvents) {
                if (this.debug) {
                    console.log("triggerEvents already executed. Skipping...");
                }
                resolve();
                return;
            }

            this.hasTriggeredEvents = true;

            if (window.jQuery && typeof jQuery(document).get === "function" && window.speed_js_vars && window.speed_js_vars.trigger_jquery_events === 'true') {

                const run = el => {
                    const ev = jQuery._data(el, "events");
                    ["ready", "load"].forEach(t => {
                        ev && ev[t] && ev[t].forEach(({ handler }) => {
                            if (this.debug) console.log("Triggering jQuery handler:", t, handler);
                            handler(el);
                        });
                    });
                };
                run(document);
                run(window);

            }

            resolve(); // Signal that triggerEvents has finished

        });

    }

    /**
     * Replays saved user interaction events.
     */
    replaySavedEvents() {

        if (this.debug) {
            console.log("Replaying clicks", this.savedClicks);
            console.log("Replaying mouseovers", this.savedMouseovers);
        }

        const replay = (events, type) => {
            events.forEach((event) => {
                events.delete(event);
                const target = event.target;
                if (this.debug) {
                    console.log("Replaying " + type + " event for target:", target);
                }
                if (target) {
                    const newEvent = new MouseEvent(type, {
                        view: event.view,
                        bubbles: true,
                        cancelable: true,
                    });
                    target.dispatchEvent(newEvent);
                }
            });
            events.clear();
        };

        replay(this.savedClicks, "click");
        replay(this.savedMouseovers, "mouseover");

    }
}

JsDelayer.ensurePatchedAddListener();

(function(){
  const startDelayer = () => {
    window.JsDelayer = new JsDelayer(
      (window.speed_js_vars.script_load_first  || ''),
      (window.speed_js_vars.script_load_last   || ''),
      (window.speed_js_vars.delay_seconds      || 6),
      (window.speed_js_vars.delay_callback     || false),
      false
    );
  };

  if(document.querySelectorAll(".spress_do_delay_js").length > 0) {
    // wait until your other script signals it’s done
    window.speed_js_vars.delay_seconds = 0.1;
    document.addEventListener('loggedInExceptionsDone', startDelayer, { once: true });
  } else {
    // fire immediately
    if (document.prerendering === true) {
        window.speed_js_vars.delay_seconds = 0;
    }
    startDelayer();
  }
})();