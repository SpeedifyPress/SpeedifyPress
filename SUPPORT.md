# 📚 Support 

The community version of SpeedifyPress comes with no support, but plenty of docs. If you need help and would like to talk to an expert, then see our paid version at [https://speedifypress.com/devs-and-agencies/](https://speedifypress.com/devs-and-agencies/). Otherwise, you can dive into the docs below.

# 📚 Documentation 

## Table of Contents

- [ Cache Settings](#cache-settings)
   - [Mode Selection](#mode-selection)
   - [Choose the Cache Mode](#choose-the-cache-mode)
   - [Choose the page preload mode](#choose-the-page-preload-mode)
   - [Choose the cache lifetime](#choose-the-cache-lifetime)
   - [Cache Outputs](#cache-outputs)
   - [Device Paths & Compression](#device-paths-compression)
   - [Logged in users (BETA)](#logged-in-users-beta)
   - [Filters](#filters)
   - [Bypass When Cookies Present](#bypass-when-cookies-present)
   - [Bypass URLs](#bypass-urls)
   - [Bypass User Agents](#bypass-user-agents)
   - [Ignore Querystrings](#ignore-querystrings)
- [ Cloudflare Settings](#cloudflare-settings)
   - [Getting Started](#getting-started)
   - [Get Your Zone ID and API Key](#get-your-zone-id-and-api-key)
   - [Add Your Secrets](#add-your-secrets)
   - [Add A Worker](#add-a-worker)
   - [Bind the Secrets](#bind-the-secrets)
   - [Edit The Worker](#edit-the-worker)
   - [Worker Route](#worker-route)
   - [Test The Worker](#test-the-worker)
   - [Lazy Preload](#lazy-preload)
   - [Multiple Sites](#multiple-sites)
   - [Zstd Compression](#zstd-compression)
- [ Code Insertion](#code-insertion)
   - [Head Code](#head-code)
   - [Body Code](#body-code)
- [ CSS Settings](#css-settings)
   - [Mode Selection](#mode-selection)
   - [Choose the Unused CSS Mode](#choose-the-unused-css-mode)
   - [Choose the Inclusion Method](#choose-the-inclusion-method)
   - [Filters](#filters)
   - [Force Include Selectors](#force-include-selectors)
   - [Force Include URLs](#force-include-urls)
   - [Force Ignore Cookies](#force-ignore-cookies)
   - [Generation by Screen Resolution](#generation-by-screen-resolution)
   - [Security Config](#security-config)
   - [CSRF Expiry](#csrf-expiry)
   - [Force Include Limit](#force-include-limit)
- [ CSS Stats](#css-stats)
   - [By Plugin Folder](#by-plugin-folder)
   - [By Path](#by-path)
   - [By Post Types](#by-post-types)
- [ External Scripts](#external-scripts)
   - [Locally host gtag.js](#locally-host-gtagjs)
   - [Preload gtag.js](#preload-gtagjs)
   - [Add scripts to Partytown](#add-scripts-to-partytown)
- [ Find Replace](#find-replace)
   - [Add Row](#add-row)
   - [Choose Scope](#choose-scope)
- [ Font Settings](#font-settings)
   - [Google options](#google-options)
   - [Locally host Google fonts](#locally-host-google-fonts)
   - [Preload options](#preload-options)
   - [Preload fonts](#preload-fonts)
   - [Don't preload icon fonts](#dont-preload-icon-fonts)
   - [Don't preload fonts on mobile](#dont-preload-fonts-on-mobile)
   - [Advanced options](#advanced-options)
   - [Lazy load icon fonts](#lazy-load-icon-fonts)
   - [Use system fonts on mobile](#use-system-fonts-on-mobile)
- [ Image Settings](#image-settings)
   - [Preload Image](#preload-image)
   - [Skip Lazyloading](#skip-lazyloading)
   - [Force Lazyloading](#force-lazyloading)
   - [Image Optimisation](#image-optimisation)
- [ Javascript Settings](#javascript-settings)
   - [Defer JavaScript](#defer-javascript)
   - [Exclude scripts from defer](#exclude-scripts-from-defer)
   - [Exclude URLs from defer](#exclude-urls-from-defer)
   - [Delay JavaScript](#delay-javascript)
   - [Exclude scripts from delay](#exclude-scripts-from-delay)
   - [Exclude URLs from delay](#exclude-urls-from-delay)
   - [Load JavaScript First](#load-javascript-first)
   - [Load JavaScript Last](#load-javascript-last)
   - [JavaScript to run on completion](#javascript-to-run-on-completion)
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

### Cache Outputs

*Device Paths & Compression*

Allows you to create separate caches for:

- Mobile users. Use this if mobile users are shown a different site (rather than a responsive site)
- Cookies
- Logged in users, by user role. Note that logged in users with the same role will see the same content, unless you use *Bypass URLs* to prevent that or exclude certain page areas from caching.

Also allows you to force gzipped compressed output if this (or brotli) hasn't already been setup on the server.

*Logged in users (BETA)*

This BETA feature allows you to exclude certain areas from logged-in caching. The options work as follows:

- Area. Use a CSS selector to define the area or areas of the page not to be cached
- Skeleton. Area will be hidden with a skeleton while they are loaded in. Choose the skeleton type to use.
- Delay JS Execution. Selecting this option will ensure that any JS applied to the replacement areas will run properly, as all JS will only run after the swap. Will only work is Delay JS is enabled for the page.

### Filters

*Bypass When Cookies Present*

Enter a line seprate list of (partial) cookie names that, if detected, will prevent caching from taking place. For example:

- 🔑 *wordpress_logged_in_* → Excludes logged-in users.
- 🛒 *woocommerce_cart_hash* → Excludes users with an item in their cart.

*Bypass URLs*

Specify a line separated list of (partial) URLs where no caching should take place. For example, if you're caching logged in users you might want to add *my-account* here

*Bypass User Agents*

Specify a line separated list of (partial) user agents for which no caching should take place

*Ignore Querystrings*

Specify a line separated list of querystrings that should be ignored for caching. 
      For example, to ensure that users arriving from a Klaviyo newsletter all get the cached content *nb_klid* is necessary here. An extensive default list comes with the plugin.
##  Cloudflare Settings

### Getting Started

Your worker will need to be able to clear the Cloudflare cache. To do this, it needs to know your Zone ID and to have a Cloudflare API token with Cache Purge permissions.

*Get Your Zone ID and API Key*

- Select the site you want to cache in the account home
- Look in the right bar and make note of the **Zone ID**
- Click 'Get your API token' just below that
- Click 'Create Token' then 'Create Custom Token' > 'Get Started'
- Add CF_API_TOKEN for the Token name
- For Permissions, we only need to add one permission: Zone | Cache Purge | Purge
- Leave the other options and Click 'Continue to Summary'
- Click Create Token and **make note of the token**

*Add Your Secrets*

- Now click back on the Cloudflare logo and choose your account
- Click 'Storage & Databases' > 'Secrets Store'
- Click **Create Secret**
- *Name:* ZONE_ID | *Value:* the Zone ID you've already made note of | *Permission scope:* Workers
- Save
- Click Create Secret
- *Name:* CF_API_TOKEN | *Value:* the token you've already made note of | *Permission scope:* Workers
- Click **Create Secret**

*Add A Worker*

Log into your Cloudflare account and click Compute (Workers) in the left bar

- Click **Click Application**
- Click **Start with Hello World**
- Click **Deploy**

*Bind the Secrets*

- Click **Click +Binding**
- Click **Click Secrets Store**
- Click **Click Add Binding, Variable Name CF_API_TOKEN, choose CF_API_TOKEN as the secret name**
- Click **Click Add Binding, Variable Name ZONE_ID, choose ZONE_ID as the secret name**

*Edit The Worker*

Now click "Edit Code" and edit the worker code.

- Replace the entire code in the left window with the worker script here
- Click Deploy

### Worker Route

Your Worker is now setup, but we need to tell Cloudflare where to find it.

- Click on the worker name (on current screen or via Compute > Worker Name)
- Click **Settings**
- Click **+ Add**
- Click **Route**
- In the **Zone** dropdown choose your domain.
- In the **Route** textbox write *domainName.com/** to serve the worker from all pages on the domain
- Add another Route and in the **Route** textbox write **.domainName.com/** to serve the worker from all subdomains too
- If you'd prefer to test first, choose a specific URL to test on, e.g *domainName.com/test-page*
- Choose **Fail open (proceed)**
- Click Add Route

### Test The Worker

Now it's time to test the worker is running OK

- Go to your test page
- Look at the document Response Headers in the console
- When hitting a cachable page for the first time the *x-spdy-status* header should say SAVED (plus random number)
- When revisiting the page, the *x-spdy-status* header should say HIT

### Lazy Preload

The Cloudflare cache works with a lazy preload. This means that when the cache is cleared (manually, or after a page update), the next page load will load from the cache but update in the background. 
      This means users will never get the slower, uncached page BUT you may need to reload a page twice to see the latest version.

### Multiple Sites

This worker will work fine with multiple wordpress sites on the same domain (or subdomains).

### Zstd Compression

Zstd compression will get the best results in terms of TTFB. To enable go to Rules > Compressions Rules > Create  and Choose "Enable Zstandard (Zstd) Compression" for the default content types.
##  Code Insertion

**Code Insertion** provides a quick and easy way to insert code into the start of the document <HEAD> or the end of the document <BODY>

*Head Code*

Code added here will go at the start of the document <HEAD>. Use this for any stylesheets, scripts, meta tags, etc.

*Body Code*

Code added here will go at the end of the document <BODY>. Use this for any scripts you'd like to run here.

Any scripts added to either section will get delayed by JavaScript delay, unless you add them as an exception.
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

*Force Include URLs*

Specify URLs where **no CSS optimization** should occur. Supports **full URLs** and **regular expressions**.

*Force Ignore Cookies*

Exclude CSS processing based on cookie values.  
      Example:

- 🔑 *wordpress_logged_in_* → Excludes logged-in users.
- 🛒 *woocommerce_cart_hash* → Excludes users with an item in their cart.

*Generation by Screen Resolution*

Generates optimized CSS at specific screen resolutions while using the same CSS for all resolutions.  
      Useful when page content significantly varies across different screen sizes.

### Security Config

*CSRF Expiry*

This changes the expiry time for the **CSRF nonce**. You may need to change this if your host uses their own caching solution and you're not using Cloudflare. In this case, set the expiry value to the same as the host's cache expiry time.

*Force Include Limit*

The maximum number of CSS classes to force include that can be generated per page. This limit prevents file-stuffing attacks.
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
##  External Scripts

*Locally host gtag.js*

If you are using the standard Google Analytics tag then this generally results in a performance hit. One way to improve things is to host the file locally. 
                Ticking this option will download the remote file and setup a cron job to ensure it's always kept up to date. 
                This is the recommended method for most sites using GA.

*Preload gtag.js*

Adds a preload in for the locally hosted gtag.js. You won't generally see a performance increase from this, but it can be worth testing.

*Add scripts to Partytown*

🎉 Partytown is an experimental feature that allows you load certain scripts via a web worker and therefore not in the main JavaScript thread. 
                It was developed by [https://partytown.builder.io/](https://partytown.builder.io/). To add the locally hosted gtag here, just enter "local_tag" to the box. 
                This will generally give a performance boost of a few points, but may affect the amount of sessions reported. It's therefore most suited to new sites.
##  Find Replace

**Find/Replace** is an advanced feature that allows you to directly **search and replace** text in the HTML of all pages on your site.

*Add Row*

Start by clicking **"Add Row"** and entering either the text to find and replace or the CSS selector for an element to find/replace. Advanced selectors are not supported.
            **Important:** Regular expressions are **not supported**, and replacements are **case-sensitive**.

*Choose Scope*

Choose how replacements are applied:

- **Scope: all text** - Apply the replacement **everywhere** on the page.
- **Scope: first first** - Replace **only the first occurrence** of the text.
- **Scope: first element** - The find text is a CSS selector and will replace just the **first** matching element.
- **Scope: all elements** - The find text is a CSS selector and will replace **all** matching elements.
##  Font Settings

### Google options

*Locally host Google fonts*

Select this to serve Google Fonts locally, rather than downloading them from the Google website. You should select this in order for the "Only preload fonts on desktop" option to work properly.

### Preload options

*Preload fonts*

This is a recommended feature for every site. It will prevent the flash of unstyled fonts that can happen on page load.

*Don't preload icon fonts*

Recommended for every site. It's generally not necessary to preload these, as they don't flash and the preload can be render blocking.

*Don't preload fonts on mobile*

Recommended for every site. Font files on mobile are generally too heavy and preloading them will prevent high pagespeed scores.

### Advanced options

*Lazy load icon fonts*

Recommended if you have icon fonts below the fold and they're causing render blocking. Will load in the icon fonts upon user interaction with the page.

*Use system fonts on mobile*

Recommended for every site, in conjunction with "Only preload fonts on desktop". Instead of font files, system fonts are used on mobile which is much quicker. To overwrite the system fonts,
                just replace the "--spdy-ui-font" for the selector in question. For example, this would replace H1 and H2 on mobile with Times New Roman:
                
                     @media (max-width: 800px) {
                              h1, h2 {
                                    --spdy-ui-font: "Times New Roman", serif !important;
                              }
                     }
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
##  Javascript Settings

### Defer JavaScript

Ticking the Defer JavaScript textbox will add the *defer* attribute to the script tag. This will defer the loading of the JavaScript until after the DOM has finished parsing (but before the DOM content is ready).  
                Try this one first and see what the effect is on page speed. ⚡

*Exclude scripts from defer*

Enter any script name or partial script names here to have them excluded from deferring. It will match against the entire script block, including tags such as *rel* and the script contents.  
                This can help prevent conflicts with essential scripts.

*Exclude URLs from defer*

JavaScript will not be deferred on any URLs that match strings or regular expressions entered here.  
                Useful for ensuring key functionality remains intact.

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
