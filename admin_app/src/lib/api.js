// src/lib/api.js
import axios from 'axios';

let currentRestNonce = window.spress_namespace?.restNonce;
let refreshing = null;

async function refreshNonce() {
  if (!refreshing) {
    const ajaxUrl =
      (typeof ajaxurl !== 'undefined' && ajaxurl) ||
      window.ajaxurl ||
      '/wp-admin/admin-ajax.php';

    refreshing = fetch(ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ action: 'sip_get_rest_nonce' }).toString(),
    })
      .then(async (r) => {
        const json = await r.json().catch(() => null);
        if (!r.ok || !json?.success) {
          const err = new Error(json?.data?.message || 'Nonce refresh failed');
          err.status = r.status || json?.data?.status || 401;
          throw err;
        }
        currentRestNonce = json.data.nonce;
        return currentRestNonce;
      })
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

export const api = axios.create();

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers['X-WP-Nonce'] = currentRestNonce;
  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    const isNonceError = (status === 401 || status === 403) && (code === 'rest_cookie_invalid_nonce' || code === 'rest_forbidden');

    const original = error.config || {};
    if (isNonceError && !original.__retried) {
      await refreshNonce();              // throws if session truly died
      original.__retried = true;
      return api(original);
    }
    throw error;
  }
);
