(function () {

  const lazyImages = document.querySelectorAll('img[data-lazy-src]');

  /**
   * Creates an IntersectionObserver instance that observes the image elements with
   * data-lazy-src attribute and restores the src when they enter the viewport
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
   * Observes all elements
   */
  lazyImages.forEach(element => {
      intersectionObserver.observe(element);
  });

})();
