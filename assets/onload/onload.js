(function () {
  // Main logic to restore template content and fix image placeholders
  function restoreTemplateContentAndImages(selector = '.unused-invisible') {
    const elementsWithVisibility = document.querySelectorAll(selector);

    elementsWithVisibility.forEach(element => {
      // Check if the element has a child element that is a <template>
      if (element.children.length > 0 && element.children[0].tagName === 'TEMPLATE') {
        // Remove content-visibility and contain-intrinsic-size properties
        element.style.contentVisibility = '';
        element.style.containIntrinsicSize = '';

        // Get the template element
        const templateElement = element.children[0];

        // Restore the contents of the template to the DOM
        const templateContent = templateElement.content.cloneNode(true);
        element.replaceChild(templateContent, templateElement);
      }
    });

    // Restore correct src and srcset for images with data-lazy-src
    const lazyImages = document.querySelectorAll('img[data-lazy-src]');
    lazyImages.forEach(img => {
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

    });
  }

  // Check if the DOM is already loaded
  if (document.readyState === "loading") {
    // DOM is still loading, wait for DOMContentLoaded
    document.addEventListener("DOMContentLoaded", () => {
      restoreTemplateContentAndImages();
    });
  } else {
    // DOM is already loaded, run immediately
    restoreTemplateContentAndImages();
  }
})();
