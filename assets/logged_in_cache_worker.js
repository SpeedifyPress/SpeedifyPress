  (function(){
    // Step 1: kick off the fetch in a worker immediately
    const blob = new Blob([`
      self.addEventListener('message', e => {
        fetch(e.data, { credentials: 'same-origin' })
          .then(r => r.text())
          .then(html => self.postMessage({ html }))
          .catch(err => self.postMessage({ error: err.message }));
      });
    `], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));

    // build & send no-cache URL
    let url = window.location.href.split('#')[0];
    url += (url.includes('?') ? '&' : '?') + 'nocache=' + Date.now();
    worker.postMessage(url);

    // Step 2: promise that resolves when worker returns the HTML
    const htmlPromise = new Promise((resolve, reject) => {
      worker.addEventListener('message', e => {
        if (e.data.error) {
          console.error('Worker fetch error:', e.data.error);
          reject(e.data.error);
        } else {
          resolve(e.data.html);
        }
        worker.terminate();
      });
    });

    // Step 3: promise that resolves on DOMContentLoaded (or immediately if already ready)
    const domPromise = new Promise(res => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', res);
      } else {
        res();
      }
    });

    // Step 4: once both HTML & DOM are ready, parse & update via data-splog-uid
    Promise.all([htmlPromise, domPromise])
      .then(([fetchedHtml]) => {
        // parse the fetched page
        const parser = new DOMParser();
        const doc = parser.parseFromString(fetchedHtml, 'text/html');
        window.doc_lc = doc;

        //console.log(fetchedHtml);

        // find all the markers in the live DOM
        function updateExceptions(force_all=false) {

          document.querySelectorAll('.logged_in_exception')
          .forEach(el => {
            
            const uid = el.getAttribute('data-splog-uid');
            //console.log(uid);
            if (!uid) return;

            const has_delay = el.classList.contains('spress_do_delay_js');
            if (force_all === false && has_delay) { 
              //console.log("delayed");
              return;
            }

            const fetchedEl = doc.querySelector(`[data-splog-uid="${uid}"]`);
            //console.log(fetchedEl);
            //console.log(uid);
            if (!fetchedEl) {
               //console.log("no fetched");
                // gone in the new version
                el.remove();
                return;
            }

            if (fetchedEl.childElementCount === 0
                && fetchedEl.textContent != ''
                && el.textContent != ''
            ) {
                // only text: update textContent
                //console.log("only text");
                el.textContent = fetchedEl.textContent;
            } else {
                //console.log("complex node");
                // complex node: replace the whole element
                const newEl = fetchedEl.cloneNode(true);
                newEl.classList.remove('logged_in_exception');
                el.replaceWith(newEl);
            }

            el.classList.remove('logged_in_exception');

          });

        }

        updateExceptions(false);
        document.dispatchEvent(new Event('loggedInExceptionsDone'));

        // If .spress_do_delay_js is on the page and we have delayable scripts, wait for delayedJSLoaded
        if (document.querySelector('.spress_do_delay_js') && (document.querySelectorAll('script[data-src]').length)>0) {
          document.addEventListener('delayedJSLoaded', updateExceptions, { once: true });
        } else if((document.querySelector('.spress_do_delay_js') && (document.querySelectorAll('script[data-src]').length)==0)) {
          updateExceptions(true);
        } else {
          updateExceptions();
        }        

      })
      .catch(() => {
        // errors already logged above
      });
  })();