(function() {
    'use strict';

    if (typeof(window.jQuery) !== 'undefined') {
        return;
    }

    var doc = document,
        win = window;

    // Define the Cash constructor
    var Cash = function(selector, context) {
        if (!selector) return this;
        
        if (selector instanceof Cash) return selector; // If already a Cash instance, return it
                
        // If selector is a string, use querySelectorAll; if it's a Node, wrap it in an array
        this.elements = (typeof selector === 'string')
            ? (context || doc).querySelectorAll(selector)
            : selector instanceof Node
                ? [selector]
                : selector; // This allows NodeLists or arrays of nodes to be passed directly

        this.length = this.elements.length;
        return this; // Ensure that `Cash` instances are returned
    };

    var fn = Cash.prototype,
        cash = function(selector, context) { return new Cash(selector, context); };

    cash.fn = cash.prototype = fn;

    // Implement _data to always return false
    cash._data = function() {
        return false;
    };    

    // Utility function for iterating over elements
    function each(arr, callback) {
        for (var i = 0; i < arr.length; i++) {
            if (callback.call(arr[i], i, arr[i]) === false) return arr;
        }
        return arr;
    }

    cash.each = each;

    // Event binding utility
    fn.on = function(eventType, callback) {
        return this.each(function(_, element) {
            element.addEventListener(eventType, callback);
        });
    };

    // Shortcut for 'click' event
    fn.click = function(callback) {
        return this.on('click', callback);
    };

    // Ensuring `each` works on Cash instances
    fn.each = function(callback) {
        return each(this.elements, callback);
    };

    // DOM ready function
    fn.ready = function(callback) {
        var cb = function() { setTimeout(callback, 0, cash); };
        if (doc.readyState !== 'loading') cb();
        else doc.addEventListener('DOMContentLoaded', cb);
        return this;
    };

    fn.addClass = function(className) {
        return this.each(function(_, el) { el.classList.add(className); });
    };

    fn.removeClass = function(className) {
        return this.each(function(_, el) { el.classList.remove(className); });
    };

    fn.toggleClass = function(className) {
        return this.each(function(_, el) { el.classList.toggle(className); });
    };

    fn.css = function(property, value) {
        if (value === undefined) return getComputedStyle(this.elements[0])[property];
        return this.each(function(_, el) { el.style[property] = value; });
    };

    fn.width = function(value) {
        if (value === undefined) return this.elements[0].clientWidth;
        return this.each(function(_, el) { el.style.width = `${value}px`; });
    };

    fn.height = function(value) {
        if (value === undefined) return this.elements[0].clientHeight;
        return this.each(function(_, el) { el.style.height = `${value}px`; });
    };


    // Assign `cash` to `window.jQuery` for use as a jQuery replacement
    win['jQuery'] = cash;

})();
