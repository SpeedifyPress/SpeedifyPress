(function() {

    /**
     * Patch a given element that contains a JSON data blob with a
     * woocommerce state object. If the state object contains a cart
     * object, it will be zeroed out (items and items_count set to 0,
     * and totals.total_items set to "0"). The patched data blob is then
     * written back to the element.
     *
     * @param {Element} el - The element containing the JSON data blob
     * @return {boolean} True if the element was successfully patched, false otherwise
     */
    function patch(el) {
        try {
            var data = JSON.parse(el.textContent || el.innerHTML);
            if (data && data.state && data.state.woocommerce) {
                // optional: also force 0 count so cached pages don't leak others' carts
                if (data.state.woocommerce.cart) {
                    data.state.woocommerce.cart.items = [];
                    data.state.woocommerce.cart.items_count = 0;
                    if (data.state.woocommerce.cart.totals) data.state.woocommerce.cart.totals.total_items = "0";
                }
                el.textContent = JSON.stringify(data);
                return true;
            }
        } catch (e) {}
        return false;
    }

    // patch any interactivity data blobs already on the page
    var nodes = document.querySelectorAll('script[type="application/json"][id^="wp-script-module-data-"]');
    for (var i = 0; i < nodes.length; i++) {
        if (patch(nodes[i])) break;
    }

    // if they show up later, catch and patch immediately
    new MutationObserver(function(muts, obs) {
        for (var m of muts)
            for (var n2 of m.addedNodes) {
                if (n2.nodeType === 1 && n2.tagName === 'SCRIPT' && n2.type === 'application/json' && /^wp-script-module-data-/.test(n2.id)) {
                    if (patch(n2)) {
                        obs.disconnect();
                        return;
                    }
                }
            }
    }).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();