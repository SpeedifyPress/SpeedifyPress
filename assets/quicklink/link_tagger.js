(function () {
  const init = async () => {
    const src = window.spdy_cached_uris;
    if (!src) { console.warn('window.spdy_cached_uris is not set.'); return; }

    const norm = (u) => {
      const x = new URL(u, location.origin);
      x.hash = '';
      if (x.pathname.length > 1 && x.pathname.endsWith('/')) x.pathname = x.pathname.slice(0, -1);
      return x.origin + x.pathname + x.search;
    };

    let list;
    try {
      const r = await fetch(src, { cache: 'no-cache', credentials: 'same-origin' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      list = Array.isArray(j) ? j : Object.keys(j || {});
    } catch (e) {
      //console.error('Failed to fetch cached URIs:', e);
      return;
    }

    const cached = new Set(list.filter(Boolean).map(norm));
    let tagged = 0;
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.toLowerCase().startsWith('javascript:')) return;
      try { if (cached.has(norm(href))) { a.setAttribute('data-no-instant', ''); tagged++; } } catch {}
    });

    if (typeof window.quicklink !== 'object') {
      console.warn('quicklink is not loaded.'); 
      return;
    }
    window.quicklink.listen({ throttle: 5, prerender: true, el: document.querySelectorAll('a[data-no-instant]') });
  };

  // Defer until page is fully loaded or prerendered page is activated.
  const start = () => (document.readyState === 'complete' || document.readyState === 'interactive') ? init() : window.addEventListener('load', init, { once: true });

  if ('prerendering' in document && document.prerendering) {
    // Wait until prerendered page becomes visible/active.
    document.addEventListener('prerenderingchange', start, { once: true });
  } else {
    start();
  }
})();