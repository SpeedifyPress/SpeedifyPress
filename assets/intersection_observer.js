(function () {
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

        observer.unobserve(img);
      }
    });
  });

  // Observe existing images initially
  const observeLazyImage = (img) => {
    if (img.tagName === 'IMG' && (img.hasAttribute('data-lazy-src') || img.hasAttribute('data-lazy-srcset'))) {
      intersectionObserver.observe(img);
    }
  };

  document.querySelectorAll('img[data-lazy-src], img[data-lazy-srcset]').forEach(observeLazyImage);

  // Observe DOM for added images
  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.tagName === 'IMG') {
            observeLazyImage(node);
          } else {
            node.querySelectorAll?.('img[data-lazy-src], img[data-lazy-srcset]').forEach(observeLazyImage);
          }
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

})();