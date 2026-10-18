# Community Changelog

Release notes for changes included in the SpeedifyPress Community edition. The complete repository history, including Pro-only changes, is in [CHANGELOG.md](CHANGELOG.md).

### 0.81.3 - 2026-10-18

- Added CSS Stats to the Community admin interface, including its documentation and dashboard access.
- Included the human-readable Community admin source and instructions for rebuilding its interface.
- Stripped Pro-only Vue interface branches from Community packages during packaging.
- Prevented SpeedifyPress and SpeedifyCSS from being active together and added a clear activation warning.
- Protected other plugins' `advanced-cache.php` drop-ins and report conflicts before enabling page caching.
- Aligned cache exclusions between the early cache drop-in and normal plugin runtime.
- Bounded decompression of submitted CSS data.

### 0.81.2 - 2026-10-05

- Improved page-cache bypass handling, bootstrap request parsing, and cache-path safety.
- Fixed cache behavior on subdirectory installations and prevented zlib output-buffer shutdown notices.
- Improved CSS processing, inline-style tracking, font handling, and deferred icon rendering.
- Fixed admin navigation and missing Community configuration values in the admin interface.
- Updated dependency patches and escaping for WordPress coding-standard compatibility.
- Improved Community packaging, documentation, and runtime file cleanup.

### 0.80.5 - 2026-01-27
- Tightened URL-fetch safety for unused CSS processing.

### 0.80.2 - 2026-01-23
- Fixed template and content loading order.

### 0.80.1 - 2026-01-22
- Made font loading interaction-driven and fixed delayed JavaScript running before template restoration.
- Updated Community licensing and disabled the plugin in the Customizer.

### 0.80.0 - 2026-01-17
- Added the Bloat remover and introduced Community and Pro editions.
- Added per-script JavaScript delay times and the option to force scripts inline.
- Fixed CSRF token delivery when page caching is disabled.

### 0.78.7 - 2026-01-10
- Reduced the admin sidebar width.

### 0.78.6 - 2026-01-10
- Allowed CSRF tokens to be served by the main plugin.

### 0.78.5 - 2026-01-08
- Added individual delay times for scripts.

### 0.78.4 - 2025-12-16
- Fixed disappearing JavaScript delay options and addressed notices and deprecations.
- Improved documentation and permalink warnings.

### 0.78.3 - 2025-12-11
- Restored replay triggers for delayed JavaScript.

### 0.78.2 - 2025-12-11
- Adjusted default completion triggers and fixed checkbox values.

### 0.78.1 - 2025-12-11
- Adjusted default completion triggers.

### 0.78.0 - 2025-12-11
- Added flexible, backwards-compatible JavaScript completion triggers.

### 0.77.6 - 2025-12-05
- Prevented data URIs from being preloaded.

### 0.77.5 - 2025-12-04
- Reworked delayed JavaScript handling.

### 0.77.4 - 2025-12-04
- Adjusted captured-event load order.

### 0.77.3 - 2025-12-04
- Improved captured event handling with a patched event listener.

### 0.77.2 - 2025-12-03
- Fixed duplicate event replay on document load.

### 0.77.1 - 2025-12-03
- Prevented completion triggers from running more than once.

### 0.77.0 - 2025-12-03
- Added configurable JavaScript completion events and triggers.

### 0.76.0 - 2025-12-02
- Added a document-load setting for delayed JavaScript and reduced CSRF request frequency.
- Updated documentation and streamlined package size.

### 0.75.2 - 2025-12-01
- Removed the patching library from production packages.

### 0.75.1 - 2025-11-30
- Added logging when no LCP image is found.

### 0.75.0 - 2025-11-29
- Avoided DOMDocument processing that could cause segmentation faults.

### 0.74.0 - 2025-11-28
- Added the CompressX easy-install option.

### 0.73.0 - 2025-11-25
- Added an expandable main panel for easier code editing.

### 0.72.3 - 2025-11-24
- Improved older JavaScript compatibility, CSS request limits, page-template tags, and cached-URI tracking.
- Allowed custom icon-font filenames.

### 0.72.1 - 2025-11-20
- Fixed CSRF handling on sites installed in subdirectories.

### 0.71.0 - 2025-11-20
- Updated Community licensing.

### 0.70.2 - 2025-11-18
- Improved icon-font identification.

### 0.70.1 - 2025-11-17
- Added a cookie fallback for CSRF tokens.

### 0.70.0 - 2025-11-14
- Improved CSRF token generation and ensured templates are restored before JavaScript runs.
- Added page preloads and prerenders and updated the bundled CSS parser.

### 0.67.0 - 2025-10-23
- Improved unused CSS handling for malformed or glitched stylesheets.

### 0.67.0 - 2025-10-22
- Added page preloading and forced lazy-loading for selected images.
- Restructured the admin menu.

### 0.66.7 - 2025-10-17
- Fixed unused-font handling.

### 0.66.5 - 2025-10-16
- Fixed mobile font behavior and improved activation compatibility checks.

### 0.66.4 - 2025-10-15
- Improved unused-CSS debugging and protocol-relative Google Fonts handling.

### 0.66.3 - 2025-10-15
- Fixed REST nonce expiry handling.

### 0.66.2 - 2025-10-14
- Fixed unused-CSS processing, cache purging on post save, and REST nonce handling.

### 0.66.1 - 2025-10-14
- Fixed nonce expiry and a regression after page-header removal.

### 0.65.0 - 2025-10-06
- Added nonce checks and tightened security practices.

### 0.64.7 - 2025-10-06
- Fixed page-cache, JavaScript, and CSS issues.

### 0.64.5 - 2025-10-02
- Fixed CSS variables, JavaScript module delays, and LCP image preloading.

### 0.64.3 - 2025-09-30
- Improved icon-font discovery.

### 0.64.1 - 2025-09-28
- Updated footer display.

### 0.64.0 - 2025-09-27
- Added multisite compatibility and icon-font lazy-loading.
- Improved CSS selector force-includes and cache rules.

### 0.63.2 - 2025-09-08
- Fixed usage collection in private browsing.

### 0.63.1 - 2025-09-08
- Fixed conditional font display and usage collection in private browsing.

### 0.63.0 - 2025-09-08
- Added local Google Fonts hosting and video poster-image preloading.
- Saved font definitions together to support desktop-only preloading.

### 0.62.4 - 2025-08-28
- Fixed cache clearing with integrations.

### 0.62.3 - 2025-08-28
- Fixed CSRF expiry.

### 0.62.2 - 2025-08-28
- Fixed gzip output.

### 0.62.1 - 2025-08-28
- Fixed cache-directory handling.

### 0.62.0 - 2025-08-28
- Added cache-directory selection and optional gzip output.
- Improved cache clearing.

### 0.61.0 - 2025-08-28
- Added CSS security options and corrected Google Analytics filename handling.

### 0.60.0 - 2025-08-07
- Improved cache writing, sidebar behavior, and XML request handling.
- Removed reliance on the `text/html` request header for cache decisions.

### 0.58.0 - 2025-07-11
- Improved licensing, intersection-observer behavior, JavaScript delay, builder detection, and cache deletion.
- Disabled usage-collector debugging by default.

### 0.57.1 - 2025-06-10
- Fixed Community licensing issues.

### 0.57.0 - 2025-06-10
- Improved template restoration, usage collection, REST handling, CSS reliability, and font-variable handling.

### 0.56.1 - 2025-06-04
- Fixed Community licensing issues.

### 0.56.0 - 2025-06-04
- Made stylesheet media attributes part of CSS processing.
- Introduced the free Community plan.

### 0.55.0 - 2025-05-27
- Fixed code placement, protocol-relative stylesheet URLs, allowed-host handling, and CSRF token expiry.

### 0.54.2 - 2025-05-08
- Fixed cache clearing so empty directories are removed.

### 0.54.0 - 2025-05-08
- Fixed Community license handling.

### 0.53.0 - 2025-05-07
- Fixed cache query-string handling.
- Updated documentation.

### 0.52.0 - 2025-05-06
- Updated usage collection for inline CSS.

### 0.51.0 - 2025-05-06
- Fixed PHP warnings.

### 0.50.0 - 2025-05-06
- Allowed Unicode text in settings fields.

### 0.49.0 - 2025-04-27
- Improved documentation and settings usability.

### 0.48.0 - 2025-04-25
- Hardened plugin security.

### 0.47.0, 0.47.1, 0.47.2 - 2025-04-17
- Updated the README.

### 0.45.0 - 2025-04-10
- Added inline and grouped CSS modes.
- Improved onload behavior, CSS cache purging, and inline-animation detection.

### 0.44.0 - 2025-04-07
- Fixed cache-clear buttons.

### 0.42.1
- Improved font detection.

### 0.42.0
- Added an option to prevent icon fonts from preloading.

### 0.41.0
- Fixed CSRF handling for unused-CSS processing.

### 0.40.0
- Moved unused-CSS processing to the backend.

### 0.39.1
- Improved font preloading.

### 0.39.0
- Added font-preloading options.

### 0.38.1
- Added full and partial plugin disabling to the advanced-cache drop-in.

### 0.38
- Added full and partial plugin disabling.

### 0.37
- Fixed advanced-cache installation and autoloader checks, CSS variable updates, image preloading, and inline-style replacement.

### 0.36
- Added the page-cache class and settings.

### 0.35.1
- Updated Community licensing.

### 0.35.0
- Updated Community licensing.

### 0.33.0
- Completed the SpeedifyPress rename and added Community licensing.
- Fixed admin UI state and updated documentation.

### 0.32.0
- Renamed the plugin to SpeedifyPress.

### 0.31.0
- Added CSS generation at selected resolutions.

### 0.30.0
- Added performance and reliability improvements.

### 0.28.0
- Reorganized the plugin and added font and LCP-image preloading.

### 0.27.0
- Added an onload callback.

### 0.26.0
- Added JavaScript defer and delay controls.

### 0.25.0
- Improved element tagging.

### 0.24.0
- Improved font collection.

### 0.23.0
- Added optimization options.

### 0.22.0
- Added nested CSS-variable resolution.

### 0.21.0
- Improved templates and onload behavior.

### 0.20.0
- Corrected onload ordering.

### 0.19.0
- Improved script stand-ins and Google Analytics replacement.

### 0.18.0
- Improved jQuery stand-in behavior and onload placement.

### 0.17.0
- Improved CSS optimization.

### 0.16.0
- Improved CSS handling.

### 0.15.0
- Changed local file paths and filenames.

### 0.14.0
- Added local Google Analytics handling.

### 0.13.0
- Added automatic content lazy rendering.

### 0.12.0
- Added a jQuery stand-in.

### 0.11.0
- Added inline CSS and improved document tagging.

### 0.10.0
- Made intersection-observer loading immediate.

### 0.09.0
- Added intrinsic-size constraints and admin UI improvements.

### 0.08.0
- Added URL and cookie exclusions for CSS processing.

### 0.07.0
- Fixed URL counts for slug-based paths.

### 0.06.0
- Improved the statistics area and admin presentation.

### 0.05.0
- Updated lookup counters instead of replacing them.

### 0.04.0
- Unminified PHP source.

### 0.03.0
- Updated the logo and minified PHP.

### 0.02.0
- Corrected image width.

### 0.01.0
- Initial release.
