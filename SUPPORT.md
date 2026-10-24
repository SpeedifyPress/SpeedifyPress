# 📚 Support 

The community version of SpeedifyPress comes with no support, but plenty of docs. If you need help and would like to talk to an expert, then see our paid version at [https://speedifypress.com/devs-and-agencies/](https://speedifypress.com/devs-and-agencies/). Otherwise, you can dive into the docs below.

# 📚 Documentation 

## Table of Contents

- [ Cache Settings](#cache-settings)
   - [Mode Selection](#mode-selection)
   - [Filters](#filters)
   - [Cache Outputs](#cache-outputs)
- [ Server Config](#server-config)
- [ CSS Settings](#css-settings)
   - [Mode Selection](#mode-selection)
   - [Filters](#filters)
- [ Javascript Settings](#javascript-settings)
   - [Delay JavaScript](#delay-javascript)
- [ Image Settings](#image-settings)
- [ Font Settings](#font-settings)
   - [Google options](#google-options)
   - [Advanced options](#advanced-options)
- [ External Scripts](#external-scripts)
- [ Bloat Settings](#bloat-settings)
   - [Core Frontend](#core-frontend)
   - [Admin Interface](#admin-interface)
   - [Media](#media)
   - [Discussion](#discussion)
   - [WooCommerce](#woocommerce)
- [ CSS Stats](#css-stats)
##  Cache Settings

### Mode Selection

*Choose the Cache Mode*

When you first install the plugin, the mode setting will be set to 
      Fully Disabled. 
      This means that no caching will take place until you enable it and update the mode

*Choose the page preload mode*

Here you can choose how the plugin should perform page preloading. This is when the page for the user's next visit is preloaded before they visit it.

- "On hover" will prefetch the page when the user hovers over the link on desktop. On mobile it'll start the prefetch when they touch the link (before releasing it). Uses prefetch and will fetch all links (cached or not)
- "Intelligent" will prerender links as soon as they enter the viewport (or prefetch if that's not supported). It uses sensible throttles and will only preload links that are in the cache. Non-cached links default to the onhover method.

*Choose the cache lifetime*

This decides how long your cached files will last for being automatically deleted. *Never Expires* is the recommended but it's possible you could run into issues with expired nonce (in which case, set to 6hrs)

### Filters

*Bypass When Cookies Present*

Enter a line seprate list of (partial) cookie names that, if detected, will prevent caching from taking place. For example:

- 🔑 *wordpress_logged_in_* → Excludes logged-in users.
- 🛒 *woocommerce_cart_hash* → Excludes users with an item in their cart.

*Bypass URLs*

Specify a line separated list of (partial) URLs where no caching should take place.

*Bypass User Agents*

Specify a line separated list of (partial) user agents for which no caching should take place

*Ignore Querystrings*

Specify a line separated list of querystrings that should be ignored for caching. 
      For example, to ensure that users arriving from a Klaviyo newsletter all get the cached content *nb_klid* is necessary here. An extensive default list comes with the plugin.

### Cache Outputs

*Device Paths*

Allows you to create separate caches for:

- Cookies

**Switch the Cache Path** will change the cache path from /wp-content/cache/ to /wp-content/upload. The is sometimes necessary for compatibility with other plugins and some hosts.
##  Server Config

These snippets let your web server help SpeedifyPress serve cached pages. First, block direct access to the cache files. If you want to go further, you can also let the server deliver eligible cached pages without starting WordPress. That second step is optional and needs a little extra care.

*Protect cache files*

Use this rule to stop visitors opening cache files directly by URL. SpeedifyPress can still read and use those files. Choose the snippet for the server handling your site, then add it where the instructions say.

*Direct server delivery (advanced)*

Want to avoid starting WordPress for cache hits? Enable this only if you understand how your server and cache work. The rules serve only GET requests without a query string, and send requests with known session, cart, or other personalisation cookies to WordPress instead. They also fall back to WordPress if there is no cache file or an update is pending.

Direct delivery does not run PHP's cache-expiry checks or response-header logic. Before enabling it, set the page-cache lifetime to **Never Expires** and make sure page changes reliably clear the cache. Clear the cache after changing server rules or cache settings, then test excluded pages, logged-in sessions, cart pages, and Cloudflare updates. If anything serves the wrong content, remove the direct-delivery rules; the normal SpeedifyPress cache will keep working.

*Applying the snippets*

- Not sure which server to choose? The detected server is a suggestion; your host or a reverse proxy may affect what actually handles requests.
- For Apache or LiteSpeed, put the rules in the WordPress root .htaccess, above the standard WordPress rewrite rules. Your host must allow these rewrite rules.
- For Nginx Direct Server Delivery, copy the nginx.conf (http block) snippet into the main http {} block. Add the Site config (/etc/nginx/sites-available) snippet to your existing site's server {} block; don't create a second one.
- After changing the URL or user-agent exclusions in SpeedifyPress, copy the snippets again so your server rules stay in sync. For Nginx, validate the config and reload Nginx. Keep a backup, and ask your host for help if you're unsure.
##  CSS Settings

### Mode Selection

*Choose the Unused CSS Mode*

When you first install the plugin, the CSS setting will be set to 
      Preview Mode. 
      This allows you to test the plugin as an admin and ensure that unused CSS is removed as expected.

- **Visit some pages** on your site.
- **Scroll and wait** a few seconds on each page.
- Keep [The Dashboard](#) open in another tab.
- Monitor the **Cache Status**—the number of files & pages should increase.
- **Revisit the pages**—they should now load with optimized CSS.
- ⚠️ If not, try clearing your page cache (most caches should update automatically).

*Choose the Inclusion Method*

Decide how your optimized CSS is loaded:

- ⚡ **Inline CSS:** Inserts all styles at the top of the document, improving Google PageSpeed Insights scores.
- 📁 **External CSS Files:** Loads individual CSS files, making navigation smoother by caching CSS across multiple pages.

### Filters

*Force Include Selectors*

Use this option to always include specific CSS selectors. If elements lose their styling, it’s likely because JavaScript dynamically adds the CSS.

- Ensure that **Preview Mode** is enabled.
- Open an incognito tab and visit the same page where styling is incorrect.
- Right-click the affected element and select **Inspect**.
- Find the CSS class responsible for applying the correct styles.
- Add that class to the **Force Include Selectors** list.
- ♻️ Clear the cache and check if the issue is resolved.

*Force Ignore URLs*

Specify URLs where **no CSS optimization** should occur. Supports **full URLs** and **regular expressions**.

*Force Ignore Cookies*

Exclude CSS processing based on cookie values.  
      Example:

- 🔑 *wordpress_logged_in_* → Excludes logged-in users.
- 🛒 *woocommerce_cart_hash* → Excludes users with an item in their cart.
##  Javascript Settings

### Delay JavaScript

Ticking the Delay JavaScript textbox will delay the loading of JavaScript until either:

- The user interacts with the page in any way 🖱️
- A certain number of seconds (as configured) elapses ⏳

This is a more aggressive method of deferring JavaScript and can sometimes cause issues with pages, depending on how exactly the JavaScript works.  
                For this reason, there are several further options available to configure the way this works:

*Exclude scripts from delay*

Enter any script name or partial script names here to have them excluded from deferring. It will match against the entire script block, including tags such as *rel* and the script contents.  
                Useful for scripts that need to run immediately.

*Exclude URLs from delay*

Enter any full or partial URLs here. If matched, no JavaScript delay will take place on that URL.  
                Helps avoid breaking key functionality. 🚧

*Load JavaScript First*

Enter any script name or partial script names here to bring them to the front of the load order.  
                Ideal for high-priority scripts. 🎯

*Load JavaScript Last*

Enter any script name or partial script names here to push them to the end of the load order.  
                This can improve perceived page speed. 🚀

*JavaScript to run on completion*

Enter JavaScript here that should be run after all the scripts have finished loading.  
                Enter complete JavaScript with no script tags.
##  Image Settings

*Preload Image*

This is a recommended feature for every site. Adding an image here will activate image lazy loading and set a default image to be displayed before the real image is loaded. 
                It's recommended that you choose a very lightweight SVG image here.

*Skip Lazyloading*

Allows you to skip the lazyloading of certain images. This would normally be for images that are shown above the fold. For example, you should skip lazyloading of your logo. 
                Any images that are added here will be preloaded by default.

*Force Lazyloading*

Allows you to force the lazyloading of certain images. This would normally be for images that have been identified as an LCP image at desktop but are shown above the fold at mobile.

*Image Optimisation*

We hook into the CompressX plugin by [https://compressx.io/](https://compressx.io/) for image optimisation. We have no connection with them and they are not endorsed by us. 
                We just really like their plugin! So we decided to make it extra easy to install and configure within SpeedifyPress. Just follow the Wizard and you're good to go.
##  Font Settings

### Google options

*Locally host Google fonts*

Select this to serve Google Fonts locally, rather than downloading them from the Google website.

### Advanced options

*Lazy load icon fonts*

Recommended if you have icon fonts below the fold and they're causing render blocking. Will load in the icon fonts upon user interaction with the page.

*Use system fonts on mobile*

Recommended for every site.  Instead of font files, system fonts are used on mobile which is much quicker. To overwrite the system fonts,
                just replace the "--spdy-ui-font" for the selector in question. For example, this would replace H1 and H2 on mobile with Times New Roman:
                
                     @media (max-width: 800px) {
                              h1, h2 {
                                    --spdy-ui-font: "Times New Roman", serif !important;
                              }
                     }

*Preload fonts intelligently*

The system will automatically detect fonts and preload them. However, it won't preload icons fonts and it won't preload fonts on mobile.
##  External Scripts

*Locally host gtag.js*

If you are using the standard Google Analytics tag then this generally results in a performance hit. One way to improve things is to host the file locally. 
                Ticking this option will download the remote file and setup a cron job to ensure it's always kept up to date. 
                This is the recommended method for most sites using GA.
##  Bloat Settings

### Core Frontend

*Remove Emojis*

Disables WordPress emoji support (scripts, styles and TinyMCE plugin) to reduce frontend payload.

*Disable jQuery Migrate*

Removes the jQuery Migrate compatibility layer on the frontend. Only enable if your theme and plugins do not rely on legacy jQuery APIs.

*Disable RSS/Atom feeds*

Disables core RSS/Atom endpoints and removes feed discovery links from the page head. Use this if you do not provide feeds to subscribers.

*Disable oEmbed functionality*

Removes oEmbed discovery and related endpoints. Plain URLs will no longer auto-convert into embeds unless you use embed blocks/shortcodes.

*Limit Heartbeat API*

Reduces background Heartbeat polling by increasing the interval to 60 seconds. This can reduce admin AJAX activity while keeping post locking and session checks working.

### Admin Interface

*Increase autosave interval*

Increases the editor autosave interval to reduce database writes during editing. Useful on busy editorial sites.

*Limit post revisions*

Limits saved revisions to 3 per post to reduce database bloat in wp_posts and wp_postmeta.

*Disable the block editor*

Disables Gutenberg and forces the classic editor UI. Only enable if you are not using the block editor.

### Media

*Disable XML-RPC*

Disables XML-RPC to reduce brute force and abuse surface. Do not enable if you rely on integrations that require XML-RPC (some Jetpack features and legacy remote publishing).

*Disable attachment pages*

Redirects attachment pages to the original file URL (or parent content) to avoid thin pages that add little value.

*Disable core XML sitemaps*

Disables WordPress core sitemaps at /wp-sitemap.xml. Enable this if an SEO plugin already provides sitemaps to avoid duplication.

### Discussion

*Disable comments sitewide*

Disables commenting across the site and removes comment UI where possible. Use this if you do not accept comments.

*Disable pingbacks/trackbacks*

Disables pingbacks and trackbacks, removes related head links/headers, and reduces spam and attack surface.

### WooCommerce

*Disable WooCommerce cart fragments*

Disables wc-cart-fragments to reduce sitewide JS and AJAX requests. Only enable if you do not need live cart count updates in the header.
##  CSS Stats

**CSS Stats** provide valuable insights into how CSS is being generated across your site and which plugins contribute to it.

- The **Unused** column shows the number of CSS files generated but **not used** on any page.
- The **Used** column displays the CSS files that are actively in use.
- Click on a row for a **detailed breakdown** of how CSS is applied across your site.

*By Plugin Folder*

View a breakdown of **CSS files generated per 📂 plugin folder**. This helps identify which plugins contribute the most to your site's styles.

*By Path*

Displays CSS caching stats **for each 🔍 page path**. This helps pinpoint where CSS is stored and how it's being utilized across different URLs.

*By Post Types*

Groups CSS stats by **📝 Post Type**, allowing you to analyze **which plugins affect different content types**.

- If certain post types **only** fill the **Unused** column, they likely don’t need those styles—optimizing them can improve performance.
