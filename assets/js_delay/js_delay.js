/**
 * JsDelayer class for managing script loading based on user interaction or timeout.
 */
class JsDelayer {
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
        window.addEventListener("click", this.boundTrackUserInteractions, { passive: true });
        window.addEventListener("mouseover", this.boundTrackUserInteractions, { passive: true });

        // Set up timeout for delayed start
        setTimeout(this.bound_start, this.timeout);

    }
    

    /**
     * Tracks user interactions and saves click or mouseover events.
     * @param {Event} event - User interaction event.
     */
    trackUserInteractions(event) {
        if (typeof event == "undefined") {
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

        if (this.debug) {
            console.log("Starting script loading process...", event);
        }

        //If this is a mouseover that can't exist, ignore
        if(typeof event != "undefined" && event.type == "mouseover" && matchMedia('(hover: hover)').matches == false) {
            return;
        }

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
            const src = script.getAttribute("data-src");
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "script";
            link.href = src;

            if (this.debug) {
                console.log("Preloading script:", src);
            }

            document.head.appendChild(link);
        });
    }

    /**
     * Loads scripts in a specific order based on user configuration.
     */
    loadScripts() {

        const scriptsToLoad = this.getScriptOrder();
        if(scriptsToLoad.length == 0) return;

        this.loadScriptsSequentially(scriptsToLoad);
    }

    /**
     * Determines the order of scripts to process based on `loadFirst` and `loadLast`.
     * @returns {Array} - Ordered list of script elements.
     */
    getScriptOrder() {
        const allScripts = [...document.querySelectorAll("script[data-src]")];

        const firstScripts = allScripts.filter((script) => {
            const dataSrc = script.getAttribute("data-src");
            if (!dataSrc) return false;

            // Match any name in `this.loadFirst` against the full URL
            return Array.from(this.loadFirst).some((name) => dataSrc.includes(name));
        });

        const lastScripts = allScripts.filter((script) => {
            const dataSrc = script.getAttribute("data-src");
            if (!dataSrc) return false;

            // Match any name in `this.loadLast` against the full URL
            return Array.from(this.loadLast).some((name) => dataSrc.includes(name));
        });

        const otherScripts = allScripts.filter((script) => {
            const dataSrc = script.getAttribute("data-src");
            if (!dataSrc) return false;

            // Exclude scripts matched in `firstScripts` and `lastScripts`
            return !Array.from(this.loadFirst).some((name) => dataSrc.includes(name)) &&
                !Array.from(this.loadLast).some((name) => dataSrc.includes(name));
        });

        const scriptsToLoad = [...firstScripts, ...otherScripts, ...lastScripts];

        if (this.debug) {
            console.log("First scripts", firstScripts, this.loadFirst);
            console.log("Last scripts", lastScripts, this.loadLast);
            console.log("Scripts to load in order:", scriptsToLoad.map((script) => script.getAttribute("data-src")));
        }


        return scriptsToLoad || 0;
    }


    /**
     * Loads scripts sequentially and triggers events after loading.
     * @param {Array} scripts - Array of script elements to load.
     */
    loadScriptsSequentially(scripts) {

        const processScript = (index) => {
            if (index >= scripts.length) {
                if (this.debug) {
                    console.log("All scripts loaded. Triggering events and replaying saved events...");
                }
                this.triggerEvents().then(() => {

                    setTimeout(() => {
                        window.removeEventListener("mouseover", this.boundTrackUserInteractions, { passive: true });
                        window.removeEventListener("click", this.boundTrackUserInteractions, { passive: true });        
                        this.replaySavedEvents();
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

            const script = scripts[index];
            const src = script.getAttribute("data-src");

            if (this.debug) {
                console.log("Loading script:", src);
            }

            script.onload = () => {
                if (this.debug) {
                    console.log("Script loaded:", src);
                }
                processScript(index + 1);
            };

            script.onerror = () => {
                console.error(`Failed to load script: ${src}`);
                processScript(index + 1);
            };

            script.src = src;
            script.removeAttribute("data-src");
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

            const events = ["ready", "DOMContentLoaded", "load"];
            events.forEach((eventName) => {
                const event = new Event(eventName);
                if (this.debug) {
                    console.log("Triggering event:", eventName);
                }
                window.dispatchEvent(event);
            });

            if (window.jQuery) {
                const jqueryEvents = jQuery._data(jQuery(document).get(0), "events");

                if (jqueryEvents && jqueryEvents.ready) {
                    jqueryEvents.ready.forEach(({ handler }) => {
                        if (this.debug) {
                            console.log("Triggering jQuery ready handler:", handler);
                        }
                        handler(document);
                    });
                }

                if (jqueryEvents && jqueryEvents.load) {
                    jqueryEvents.load.forEach(({ handler }) => {
                        if (this.debug) {
                            console.log("Triggering jQuery load handler:", handler);
                        }
                        handler(document);
                    });
                }
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

        this.savedClicks.forEach((clickEvent) => {
            this.savedClicks.delete(clickEvent);
            const target = clickEvent.target;
            if (this.debug) {
                console.log("Replaying click event for target:", target);
            }
            if (target) {
                const newEvent = new MouseEvent("click", {
                    view: clickEvent.view,
                    bubbles: true,
                    cancelable: true,
                });
                target.dispatchEvent(newEvent);
            }
        });

        this.savedMouseovers.forEach((mouseoverEvent) => {
            this.savedMouseovers.delete(mouseoverEvent);
            const target = mouseoverEvent.target;
            if (this.debug) {
                console.log("Replaying mouseover event for target:", target);
            }
            if (target) {
                const newEvent = new MouseEvent("mouseover", {
                    view: mouseoverEvent.view,
                    bubbles: true,
                    cancelable: true,
                });
                target.dispatchEvent(newEvent);
            }
        });

        this.savedClicks.clear();
        this.savedMouseovers.clear();
    }
}
window.JsDelayer = new JsDelayer((window.speed_js_vars.script_load_first || ''),(window.speed_js_vars.script_load_last || ''),(window.speed_js_vars.delay_seconds || 6),(window.speed_js_vars.delay_callback || false),false);