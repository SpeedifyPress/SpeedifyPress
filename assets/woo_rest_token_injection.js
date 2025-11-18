(() => {
  const _fetch = window.fetch;

/**
 * Returns true if the given URL is a same-origin request 
 * to the WooCommerce store endpoint.
 * @param {URL} u - The URL to check.
 * @returns {boolean} True if the URL should have a token added, false otherwise.
 */
  function shouldAdd(u) {
    return u.origin === location.origin && u.pathname.startsWith('/wp-json/wc/store/');
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
    const headers = new Headers(req.headers);
    // Fast sources available even during prefetch/prerender
    const fromCookie = (document.cookie.match(/(?:^|;\s*)spdy_csrf=([^;]+)/) || [])[1] || '';
    const token = fromCookie || window.spdy_csrfToken || '';
    // Only set header if we actually have a value (avoid sending empty header)
    if (token) {
      headers.set('X-SPDY-CSRF', token);
      // Make sure credentials are included so cookie fallback also works
      const opts = { headers, credentials: 'same-origin' };
      if (req.mode === 'no-cors') return _fetch.call(this, req); // header would be stripped anyway
      req = new Request(req, opts);
    }
  }

    return _fetch.call(this, req);
  };
})();
