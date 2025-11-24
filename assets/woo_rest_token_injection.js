(() => {
  const _fetch = window.fetch;

/**
 * Returns true if the given URL is a same-origin request 
 * to the WooCommerce store endpoint.
 * @param {URL} u - The URL to check.
 * @returns {boolean} True if the URL should have a token added, false otherwise.
 */
  function shouldAdd(u) {
    if (u.origin !== location.origin) return false;

    // Woo Store API
    if (window.spdy_replaceWooNonces && u.pathname.startsWith('/wp-json/wc/store/')) {
      return true;
    }

    // Woo wc-ajax endpoints, e.g. /?wc-ajax=get_wc_coupon_message
    if (window.spdy_replaceWooNonces && typeof u.search === 'string' && u.search.indexOf('wc-ajax=') !== -1) {
      return true;
    }

    // Core/WP admin-ajax
    if (window.spdy_replaceAjaxNonces && u.pathname === '/wp-admin/admin-ajax.php') {
      return true;
    }

    return false;
  }

  function getSpdyToken() {
    const fromCookie = (document.cookie.match(/(?:^|;\s*)spdy_csrf=([^;]+)/) || [])[1] || '';
    return fromCookie || window.spdy_csrfToken || '';
  }

/**
 * A monkey-patched version of the window.fetch function which adds
 * the CSRF token to requests to the WooCommerce store endpoint.
 *
 * @param {string|Request} input - The URL or Request object to fetch.
 * @param {object} [init] - Optional initialization object.
 * @returns {Promise} A promise that resolves to the response of the fetch.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
  window.fetch = function(input, init) {
    // Normalize to a Request
    let req = (input instanceof Request) ? input : new Request(String(input), init);
    const u = new URL(req.url, location.href);

    if (shouldAdd(u)) {
      const token = getSpdyToken();
      if (token) {
        const headers = new Headers(req.headers);
        headers.set('X-SPDY-CSRF', token);
        const opts = { headers, credentials: 'same-origin' };
        if (req.mode === 'no-cors') return _fetch.call(this, req); // header would be stripped anyway
        req = new Request(req, opts);
      }
    }

    return _fetch.call(this, req);
  };

  const _xhrOpen = XMLHttpRequest.prototype.open;
  const _xhrSend = XMLHttpRequest.prototype.send;

  /**
   * A monkey-patched version of the XMLHttpRequest.open method which adds
   * the CSRF token to requests to the WooCommerce store endpoint.
   *
   * @param {string} method - The HTTP method to use for the request.
   * @param {string} url - The URL to make the request to.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
   */
  XMLHttpRequest.prototype.open = function(method, url) {
    try {
      this._spdyUrl = new URL(String(url), location.href);
    } catch (e) {
      this._spdyUrl = null;
    }
    return _xhrOpen.apply(this, arguments);
  };

  /**
   * A monkey-patched version of the XMLHttpRequest.send method which adds
   * the CSRF token to requests to the WooCommerce store endpoint.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
   * @param {string|Document|Blob|ArrayBufferView|FormData|URLSearchParams} body
   * @return {?Promise<void>}
   */
  XMLHttpRequest.prototype.send = function(body) {
    try {
      if (this._spdyUrl && shouldAdd(this._spdyUrl)) {
        const token = getSpdyToken();
        if (token) {
          this.setRequestHeader('X-SPDY-CSRF', token);
        }
      }
    } catch (e) {}
    return _xhrSend.apply(this, arguments);
  };

})();
