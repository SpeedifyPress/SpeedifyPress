(function () {
  // --- tiny debug switch (opt-in) ---
  const DEBUG = !!(window.__lazyImgDebug || localStorage.getItem('lazyimg:debug') === '1');
  const dlog = (...a) => { if (DEBUG) console.log('[lazyimg]', ...a); };

  const intersectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const dataLazySrc = img.getAttribute('data-lazy-src');
        const dataLazySrcSet = img.getAttribute('data-lazy-srcset');

        if (dataLazySrcSet) {
          img.setAttribute('srcset', dataLazySrcSet);
          img.removeAttribute('data-lazy-srcset');
        }

        if (dataLazySrc) {
          img.setAttribute('src', dataLazySrc);
          img.removeAttribute('data-lazy-src');
        }

        dlog('loaded', img);
        observer.unobserve(img);
      }
    });
  });

  // Observe existing images initially
  const observeLazyImage = (img) => {
    if (img.tagName === 'IMG' && (img.hasAttribute('data-lazy-src') || img.hasAttribute('data-lazy-srcset'))) {
      intersectionObserver.observe(img);
      dlog('observing', img);
    }
  };

  document.querySelectorAll('img[data-lazy-src], img[data-lazy-srcset]').forEach(observeLazyImage);

  // Observe DOM for added images (+ attribute changes)
  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.tagName === 'IMG') {
              observeLazyImage(node);
            } else {
              node.querySelectorAll && node.querySelectorAll('img[data-lazy-src], img[data-lazy-srcset]').forEach(observeLazyImage);
            }
          } else if (node.nodeType === 11) { // DocumentFragment
            node.querySelectorAll && node.querySelectorAll('img[data-lazy-src], img[data-lazy-srcset]').forEach(observeLazyImage);
          }
        });
      } else if (mutation.type === 'attributes') {
        const t = mutation.target;
        if (t && t.tagName === 'IMG') observeLazyImage(t);
      }
    });
  });

  mutationObserver.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-lazy-src', 'data-lazy-srcset']
  });
})();