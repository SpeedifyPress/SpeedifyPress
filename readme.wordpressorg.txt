=== SpeedifyCSS ===
Contributors: acid-drop
Tags: unused css, css optimization, page cache, performance
Requires at least: 6.4
Tested up to: {{TESTED_UP_TO}}
Requires PHP: 8.0
Stable tag: 0.81.3
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Reduce unused CSS and optionally cache pages for faster repeat visits.

== Description ==

SpeedifyCSS generates page-specific CSS by collecting the styles used in your browser. Subsequent visits use optimized stylesheets or inline CSS, with optional page caching to reduce server work.

Features:

* Page-specific unused CSS removal, including inline styles
* Inline, grouped inline or external CSS delivery
* Include rules for dynamic content and CSS exclusions
* Optional page caching with URL, cookie and user-agent exclusions
* Cache lifetime and page preloading
* CSS generation and cache status, with cache-clearing controls
* CSS usage statistics by plugin, URL path and post type

CSS optimization works independently of page caching. Both use shared exclusion rules. Use only one full-page cache at a time; external cache compatibility depends on its output processing and purge integration.

For developers, human-readable admin source and build instructions are available at:
https://github.com/SpeedifyPress/SpeedifyPress/
The WordPress.org build uses the shared admin_app/src/App.vue with build-time feature exclusions and package:wordpressorg.

== Installation ==

1. Install SpeedifyCSS through WordPress or upload its ZIP.
2. Deactivate SpeedifyPress if installed; it already includes these features.
3. Activate SpeedifyCSS and open SpeedifyCSS in the admin menu.
4. Enable processing, then configure CSS and optional page caching.
5. Visit pages as a logged-out visitor to collect used styles. Subsequent visits use optimized CSS once generation completes.

== Frequently Asked Questions ==

= What does CSS optimization do? =

It collects used selectors and fonts in your browser, then builds page-specific CSS. Add include rules for content that appears later through interaction or JavaScript.

= Does CSS require the Page Cache? =

No. CSS stores its own HTML snapshot and optimized files. Cache exclusions also affect whether that snapshot can be generated.

= What does the Page Cache do? =

It stores optimized HTML so repeat requests can avoid generating the page again in WordPress.

= Can I use another page cache? =

Leave SpeedifyCSS page caching disabled when another page cache is active. CSS completion purges supported external caches; unsupported caches may need manual purging after generation or CSS changes.

= Can I use SpeedifyCSS alongside SpeedifyPress? =

No. SpeedifyPress includes the same CSS and Cache features. Deactivate one before activating the other.

= Does it require a licence or an external account? =

No. CSS processing runs on your own server. Stylesheet processing may fetch same-host stylesheet URLs; fonts referenced by your site's CSS may still load from their original providers. No analytics or external account service is included.

== Screenshots ==

1. Dashboard
2. CSS settings
3. Cache settings

== Changelog ==

{{CHANGELOG}}

== Upgrade Notice ==

= 0.81.3 =

SpeedifyCSS provides page-specific CSS optimization and optional page caching.
