# SpeedifyCSS

<img src="assets/logo.svg" alt="SpeedifyCSS" width="200">

## Getting Started

When you first install the Plugin it will start in Preview Mode. This allows you to test the plugin as an admin and ensure that Unused CSS is being removed as expected. You should:

-   Visit some pages on your site.
-   On each page you visit you should scroll and then wait a few seconds
-   In a separate browser tab, keep open The Dashboard
-   Keep an eye on the Cache Status. You should see the number of files & pages increasing
-   Revisit the pages they should now load with reduced CSS (check the page source to confirm)
-   If not, try clearning your page cache (for most caches, it should be automatic)

## Display Problems?

When you visit pages, you may find that the CSS is not displaying correctly for some elements. This is usually because the CSS is added by JavaScript or some other external process and therefore isn't captured. How to fix:

-   These instructions are for Chrome 
-   First, make sure that Preview Mode is enabled in this plugin
-   Open a tab with the incorrect CSS displaying. In a new  incognito tab, open the same page.
-   On each page, right click the element which isn't displaying correctly and select "Inspect".
-   Look for the CSS class that causes the correct CSS to be loaded
-   Add that CSS class to the list of Force Include Seletors on the Settings Page.
-   Clear the cache and repeat

## Using the Stats

The stats section allows you to explore how different plugins inject CSS across your site.

-   View by plugin folder, path or post type.
-   Click column headers to sort
-   Click a row for detailed usage information

 ## High traffic site? Need Expert help?

Optimising high traffic  WordPress sites and WooCommerce stores is not easy. If your business needs an expert to guide you then get in touch and let's talk.