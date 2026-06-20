=== SpeedifyPress ===
Contributors: acid-drop
Tags: cache, page cache, unused css, javascript optimization, image lazy load
Requires at least: 6.4
Tested up to: 6.9
Requires PHP: 8.0
Stable tag: 0.80.07
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

SpeedifyPress boosts WordPress speed with page cache, CSS/JS optimization, lazy loading, and font performance controls.

== Description ==

SpeedifyPress helps improve WordPress speed with practical frontend optimization tools for caching, CSS delivery, JavaScript loading, images, fonts, and local analytics script handling.

Included features:

* Unused CSS handling
* Advanced page caching
* JavaScript delay controls
* Local Google Analytics support
* Image lazyloading and preload controls
* HTML lazyloading
* Font loading controls
* WordPress bloat cleanup tools
* Local analytics script controls

External services:

* If you enable local Google Analytics support, the plugin rewrites Google Analytics script loading for your own site.
* If you use local CSS/JS optimization features on external assets, the plugin may fetch those asset URLs to process them.
* If you choose to install CompressX from the dashboard, WordPress.org plugin installation APIs are used to download and install that plugin.

Pro features are available separately from the plugin dashboard.

For developers, a build with human-readable admin source code is available on GitHub:
https://github.com/SpeedifyPress/SpeedifyPress/

== Installation ==

1. Upload the plugin to `/wp-content/plugins/` or install it through the WordPress admin.
2. Activate the plugin through the `Plugins` screen in WordPress.
3. Open `SpeedifyPress` in the admin menu.
4. Configure the features you want to use.

== Frequently Asked Questions ==

= Does this plugin require a license? =

No. It works without a separate license.

= Does this include all Pro features? =

No. Some advanced features are only available in the separate Pro edition.

= What does the Page Cache do? =

It stores optimized page output so repeat visits can be served faster with less server processing.

= What does Unused CSS handling do? =

It analyzes used styles for a page and reduces unused CSS so browsers render faster.

= What do JavaScript delay controls do? =

They postpone selected scripts until user interaction or chosen triggers to improve initial load speed.

= What do image lazyload and preload controls do? =

They delay off-screen images and let you prioritize key images for faster perceived loading.

= What do font loading controls do? =

They help optimize webfont delivery and loading behavior to reduce layout shifts and render delay.

= What do bloat cleanup tools do? =

They let you disable unnecessary WordPress frontend features and requests that can slow pages down.

= What do local analytics script controls do? =

They let you host Google Analytics script resources locally and control how they are loaded.

== Screenshots ==

1. Dashboard
2. Cache settings
3. CSS settings
4. JavaScript settings
5. Image settings
6. Bloat settings

== Changelog ==

{{CHANGELOG}}

== Upgrade Notice ==

= 0.80.07 =

Update to get the latest fixes and improvements.
