class LoggedInExceptionsRefresher {
  constructor() {
    this.doc = null;
    this.updateExceptions = () => {};
    this.observer = null;

    // delay handling
    this._hasDelayClass = false;
    this._canProcessDelayed = false;
    this._pendingFetchOnReady = false;

    // fetch coalescing
    this._inFlight = false;
    this._seq = 0;
    this._lastAppliedUrl = null;
  }

  // Run delay gating and potential fetch immediately; set up mutations once DOM exists.
  run() {
    this._setupDelayAndKick();                 // immediate
  }

  // --- startup / delay gating ---

  _setupDelayAndKick() {
    this._hasDelayClass = !!document.querySelector('.spress_do_delay_js');
    const delayedScripts = document.querySelectorAll('script[data-src]').length;

    if (this._hasDelayClass && delayedScripts > 0) {
      this._canProcessDelayed = false;
      document.addEventListener('delayedJSLoaded', () => {
        this._canProcessDelayed = true;
        this._refetchAndUpdate({ forceAll: true });
      }, { once: true });
      return; // do not fetch yet
    }

    if (this._hasDelayClass && delayedScripts === 0) {
      this._canProcessDelayed = true;
      this._refetchAndUpdate({ forceAll: true });
      return;
    }

    this._canProcessDelayed = true;
    this._refetchAndUpdate({ forceAll: false });
  }

  // --- fetch + parse + apply ---

  // Only fetch if there are elements we can actually process right now.
  async _refetchAndUpdate({ forceAll = this._canProcessDelayed } = {}) {

    // Always fetch; we'll apply once DOM is ready.
    if (this._inFlight) { this._pendingFetchOnReady = true; return; }
    this._inFlight = true;

    try {
      const html = await this._fetchInWorker(this._noCacheUrl());
      this._parse(html);
      this._buildUpdater();
      await this._domReady();
      this.updateExceptions(forceAll);
      this._lastAppliedUrl = true; // marker only; value not used downstream
      document.dispatchEvent(new Event('loggedInExceptionsDone'));
    } finally {
      this._inFlight = false;
      if (this._pendingFetchOnReady) {
        this._pendingFetchOnReady = false;
        this._refetchAndUpdate({ forceAll: this._canProcessDelayed });
      }
    }
  }

  _noCacheUrl() {
    this._seq += 1;
    const base = window.location.href.split('#')[0];
    const u = new URL(base);
    u.searchParams.set('nocache', `${Date.now()}-${this._seq}`);
    return u.toString();
  }

  _fetchInWorker(url) {
    const blob = new Blob([`
      self.addEventListener('message', e => {
        const target = e.data;
        if (typeof target !== 'string' || !/^https?:\\/\\//.test(target)) {
          self.postMessage({ error: 'Invalid URL for fetch' });
          return;
        }
        fetch(target, { credentials: 'same-origin' })
          .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
          .then(html => self.postMessage({ html }))
          .catch(err => self.postMessage({ error: err.message }));
      });
    `], { type: 'application/javascript' });

    const urlObj = URL.createObjectURL(blob);
    const worker = new Worker(urlObj);

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        worker.removeEventListener('message', onMsg);
        worker.removeEventListener('error', onErr);
        worker.terminate();
        URL.revokeObjectURL(urlObj);
      };
      const onMsg = e => {
        const data = e.data;
        if (data && data.error) reject(data.error);
        else resolve(data.html);
        cleanup();
      };
      const onErr = e => { reject(e); cleanup(); };
      worker.addEventListener('message', onMsg);
      worker.addEventListener('error', onErr);
      worker.postMessage(url);
    });
  }

  _parse(html) {
    const parser = new DOMParser();
    this.doc = parser.parseFromString(html, 'text/html');
    window.doc_lc = this.doc;
  }

  _buildUpdater() {
    if (!this.doc) { this.updateExceptions = () => {}; return; }
    const source = this.doc;

    this.updateExceptions = (forceAll = this._canProcessDelayed) => {
      const shouldProcessDelayed = !!forceAll || this._canProcessDelayed;
      document.querySelectorAll('.logged_in_exception').forEach(el => {
        const uid = el.getAttribute('data-splog-uid');
        if (!uid) return;

        const delayed = el.classList.contains('spress_do_delay_js');
        if (delayed && !shouldProcessDelayed) return;

        const fresh = source.querySelector(`[data-splog-uid="${uid}"]`);
        if (!fresh) { el.remove(); return; }

        // If the node itself is a <script>, recreate it so it executes.
        if (fresh.tagName === 'SCRIPT') {
          const newScript = this._cloneScriptForExecution(fresh);
          // ensure the replacement does not keep the marker class
          newScript.classList.remove('logged_in_exception');
          el.replaceWith(newScript);          
          return;
        }        

        const isTextOnly =
          fresh.childElementCount === 0 &&
          fresh.textContent !== '' &&
          el.textContent !== '';

        if (isTextOnly) {
          if (el.textContent !== fresh.textContent) el.textContent = fresh.textContent;
        } else {
          const clone = fresh.cloneNode(true);
          clone.classList.remove('logged_in_exception');
          el.replaceWith(clone);
          // Recreate any descendant <script> tags so they actually run.
          this._rehydrateScripts(clone);          
        }
        el.classList.remove('logged_in_exception');
      });
    };
  }

  // Recreate <script> tags under root so they execute in document order.
  _rehydrateScripts(root) {
    const scripts = Array.from(root.querySelectorAll('script'));
    for (const oldS of scripts) {
      const newS = this._cloneScriptForExecution(oldS);
      // Replace node-by-node to keep relative order.
      oldS.replaceWith(newS);
    }
  }

  // Create an executable copy of a <script> element, preserving attributes.
  _cloneScriptForExecution(srcScript) {
    const s = document.createElement('script');
    // Copy attributes verbatim
    for (const { name, value } of Array.from(srcScript.attributes)) {
      // Setting async below; copy others as-is.
      if (name.toLowerCase() !== 'async') s.setAttribute(name, value);
    }
    // Never carry over the logged_in_exception marker
    s.classList.remove('logged_in_exception');
    // Preserve execution ordering for classic scripts unless async explicitly present.
    const type = (srcScript.getAttribute('type') || '').toLowerCase();
    const isModule = type === 'module';
    if (!srcScript.hasAttribute('async') && !isModule) s.async = false;
    // Inline code
    if (!srcScript.src && srcScript.textContent) {
      s.textContent = srcScript.textContent;
    }
    return s;
  }  

  // --- DOM readiness ---

  _domReady() {
    if (document.readyState === 'loading') {
      return new Promise(res => document.addEventListener('DOMContentLoaded', res, { once: true }));
    }
    return Promise.resolve();
  }

}

// usage
new LoggedInExceptionsRefresher().run();