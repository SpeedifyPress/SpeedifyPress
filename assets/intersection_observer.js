(function () {

  const lazyImages = document.querySelectorAll('img[data-lazy-src]');

  /**
   * Creates an IntersectionObserver instance that observes the elements with
   * class "unused-invisible" and removes their content-visibility and
   * contain-intrinsic-size styles when they enter the viewport.
   */
  const intersectionObserver = new IntersectionObserver((entries, observer) => {

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element has entered the viewport
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

          // Unobserve the element since we've already removed the styles
          observer.unobserve(img);
        }
      });
    });

  /**
   * Observes all elements with class "unused-invisible" with the IntersectionObserver.
   */
  lazyImages.forEach(element => {
      intersectionObserver.observe(element);
  });

})();
