  // Main logic
  window.restoreTemplateContentAndImages = function(selector = '.unused-invisible') {
    //console.log("[restoreTemplateContentAndImages] Starting...",selector);

    try {
      const elementsWithVisibility = document.querySelectorAll(selector);
      //console.log(`[restoreTemplateContentAndImages] Found ${elementsWithVisibility.length} elements with selector "${selector}"`);

      elementsWithVisibility.forEach((element, index) => {
        const firstChild = element.children[0];
        if (firstChild && firstChild.tagName === 'TEMPLATE') {
          //console.log(`[Element ${index}] Found <template>, restoring content`);

          // Remove special styles
          element.style.contentVisibility = '';
          element.style.containIntrinsicSize = '';

          // Clone template content into element
          const templateContent = firstChild.content.cloneNode(true);
          element.replaceChild(templateContent, firstChild);
        } else {
          //console.log(`[Element ${index}] No <template> found`);
        }
      });

      // Fix lazy-loaded images
      const lazyImages = document.querySelectorAll('img[data-lazy-src]');
      //console.log(`[restoreTemplateContentAndImages] Found ${lazyImages.length} lazy images`);

      lazyImages.forEach((img, i) => {
        const dataLazySrc = img.getAttribute('data-lazy-src');
        const dataLazySrcSet = img.getAttribute('data-lazy-srcset');

        if (dataLazySrcSet) {
          img.setAttribute('srcset', dataLazySrcSet);
          img.removeAttribute('data-lazy-srcset');
          //console.log(`[Image ${i}] Restored srcset: ${dataLazySrcSet}`);
        }

        if (dataLazySrc) {
          img.setAttribute('src', dataLazySrc);
          img.removeAttribute('data-lazy-src');
          //console.log(`[Image ${i}] Restored src: ${dataLazySrc}`);
        }
      });

      //console.log("[restoreTemplateContentAndImages] Done.");

    } catch (err) {
      console.error("[restoreTemplateContentAndImages] Error occurred:", err);
    }
  };

  // Run our restore *after* the browser has restored scroll on refresh/back/forward.
  window.addEventListener('pageshow', () => {

      setTimeout(() => {
        const scrolledDownPosition = window.scrollY || window.pageYOffset;
        //console.log(scrolledDownPosition);
        if(scrolledDownPosition > 100) {
          //console.log("restoring template content");
          window.restoreTemplateContentAndImages();
        }          
      },250);

  });