(function () {
  // Utility: Wait for DOM to be ready (robust)
  function onDomReady(callback) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      //console.log("[onDomReady] DOM already ready");
      callback();
    } else {
      //console.log("[onDomReady] Waiting for DOMContentLoaded");
      document.addEventListener("DOMContentLoaded", () => {
        //console.log("[onDomReady] DOMContentLoaded fired");
        callback();
      });
    }
  }

  // Run when DOM is ready
  onDomReady(() => {
    //console.log("[main] DOM is ready, running restoreTemplateContentAndImages()");
    window.restoreTemplateContentAndImages();
  });
})();
