<script setup>
defineProps({ iconclass: String })
</script>

<template>
  <div class="text-left text-md">
    <h4 class="text-lg font-bold text-raisin dark:text-white">Server Config</h4>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      These snippets let your web server help SpeedifyPress serve cached pages. First, block direct access to the cache files. If you want to go further, you can also let the server deliver eligible cached pages without starting WordPress. That second step is optional and needs a little extra care.
    </p>

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Protect cache files</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Use this rule to stop visitors opening cache files directly by URL. SpeedifyPress can still read and use those files. Choose the snippet for the server handling your site, then add it where the instructions say.
    </p>

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Direct server delivery (advanced)</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Want to avoid starting WordPress for cache hits? Enable this only if you understand how your server and cache work. The rules serve only GET requests without a query string, and send requests with known session, cart, or other personalisation cookies to WordPress instead. They also fall back to WordPress if there is no cache file or an update is pending.
    </p>

    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal pt-4">
      Direct delivery does not run PHP's cache-expiry checks or response-header logic. Before enabling it, set the page-cache lifetime to <strong>Never Expires</strong> and make sure page changes reliably clear the cache. Clear the cache after changing server rules or cache settings, then test excluded pages, logged-in sessions, cart pages, and Cloudflare updates. If anything serves the wrong content, remove the direct-delivery rules; the normal SpeedifyPress cache will keep working.
    </p>

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Applying the snippets</h5>
    <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
      <li>Not sure which server to choose? The detected server is a suggestion; your host or a reverse proxy may affect what actually handles requests.</li>
      <li>For Apache or LiteSpeed, put the rules in the WordPress root <code>.htaccess</code>, above the standard WordPress rewrite rules. Your host must allow these rewrite rules.</li>
      <li>For Nginx Direct Server Delivery, copy the <code>nginx.conf (http block)</code> snippet into the main <code>http {}</code> block. Add the <code>Site config (/etc/nginx/sites-available)</code> snippet to your existing site's <code>server {}</code> block; don't create a second one.</li>
      <li>After changing the URL or user-agent exclusions in SpeedifyPress, copy the snippets again so your server rules stay in sync. For Nginx, validate the config and reload Nginx. Keep a backup, and ask your host for help if you're unsure.</li>
    </ul>
  </div>
</template>
