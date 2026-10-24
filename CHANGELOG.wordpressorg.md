# SpeedifyCSS Changelog

Release notes for the SpeedifyCSS WordPress.org edition. The complete repository history, including Community and Pro changes, is in [CHANGELOG.md](CHANGELOG.md).

### 0.81.4 - 2026-10-24

- Added Apache/LiteSpeed and Nginx server configuration snippets to protect cache files or optionally deliver eligible cached pages directly.
- Added server-config documentation, syntax-highlighted editors, and warnings when URL or user-agent exclusions change.
- Limited Direct Server Delivery snippets to GET requests and aligned response headers and exclusion handling.
- Kept SpeedifyCSS settings in the shared configuration option so switching between editions retains saved settings.
- Blocked direct public requests to SpeedifyCSS cache paths, including when the cache is under uploads.

### 0.81.3 - 2026-10-18

- Rebranded the WordPress.org edition as SpeedifyCSS, focused on unused CSS optimization and optional page caching.
- Added CSS Stats to the SpeedifyCSS admin interface.
- Prevented SpeedifyPress and SpeedifyCSS from being active together, with an activation warning instead of an autoloader collision.
- Protected other plugins' `advanced-cache.php` drop-ins and report conflicts before enabling page caching.
- Bounded compressed CSS request processing to reject oversized payloads safely.

### 0.81.2 - 2026-10-05

- Improved unused CSS processing, inline-style tracking, CSS statistics, and deferred icon rendering.
- Improved optional page-cache bypass handling, bootstrap request parsing, and cache-path safety.
- Fixed cache behavior on subdirectory installations and prevented zlib output-buffer shutdown notices.
- Updated bundled dependency patches and escaping for WordPress coding-standard compatibility.
- Improved the SpeedifyCSS admin interface, documentation, and WordPress.org package verification.

### 0.80.5 - 2026-01-27
- Tightened URL-fetch safety in the unused-CSS pipeline.

### 0.80.2 - 2026-01-23
- Fixed template and content loading order for optimized pages.

### 0.80.0 - 2026-01-17
- Fixed CSRF delivery when page caching is disabled.

### 0.78.6 - 2026-01-10
- Allowed CSRF handling to be served by the main plugin.

### 0.76.0 - 2025-12-02
- Reduced CSRF request frequency.

### 0.75.0 - 2025-11-29
- Avoided DOMDocument processing that could cause segmentation faults.

### 0.72.3 - 2025-11-24
- Increased CSS request limits and improved page-template tags and cached-URI tracking.

### 0.72.1 - 2025-11-20
- Fixed CSRF handling on installations in subdirectories.

### 0.70.1 - 2025-11-17
- Added a cookie fallback for CSRF tokens.

### 0.67.0 - 2025-10-23
- Improved unused CSS handling for malformed or glitched stylesheets.

### 0.67.0 - 2025-10-22
- Added page preloading.

### 0.66.4 - 2025-10-15
- Improved unused-CSS debugging and protocol-relative stylesheet handling.

### 0.66.2 - 2025-10-14
- Fixed unused-CSS processing and cache purging on post save.

### 0.64.7 - 2025-10-06
- Fixed page-cache and CSS processing issues.

### 0.64.5 - 2025-10-02
- Fixed CSS variable handling.

### 0.64.3 - 2025-09-30
- Improved icon-font discovery for CSS optimization.

### 0.64.0 - 2025-09-27
- Added multisite compatibility.
- Improved CSS selector force-includes and cache rules.

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
- Added CSS security options.

### 0.60.0 - 2025-08-07
- Improved advanced-cache writing and XML request handling.
- Removed reliance on the `text/html` request header for cache decisions.

### 0.55.0 - 2025-05-27
- Fixed code placement, stylesheet URLs, allowed-host handling, and CSRF token expiry.

### 0.54.2 - 2025-05-08
- Fixed cache clearing so empty directories are removed.

### 0.53.0 - 2025-05-07
- Fixed cache query-string handling.

### 0.52.0 - 2025-05-06
- Updated usage collection for inline CSS.

### 0.48.0 - 2025-04-25
- Hardened plugin security.

### 0.45.0 - 2025-04-10
- Added inline and grouped CSS modes.
- Improved CSS cache purging and inline-animation detection.

### 0.44.0 - 2025-04-07
- Fixed cache-clear buttons.

### 0.41.0
- Fixed CSRF handling for unused-CSS processing.

### 0.40.0
- Moved unused-CSS processing to the backend.

### 0.38.1
- Added full and partial plugin disabling to the advanced-cache drop-in.

### 0.38
- Added full and partial plugin disabling.

### 0.37
- Fixed advanced-cache installation and autoloader checks and cache updates.

### 0.36
- Added the page-cache class and settings.

### 0.31.0
- Added CSS generation at selected resolutions.

### 0.30.0
- Added performance and reliability improvements.

### 0.23.0
- Added CSS optimization options.

### 0.22.0
- Added nested CSS-variable resolution.

### 0.17.0
- Improved CSS optimization.

### 0.16.0
- Improved CSS handling.

### 0.11.0
- Added inline CSS processing and improved document tagging.

### 0.08.0
- Added URL and cookie exclusions for CSS processing.

### 0.06.0
- Improved the statistics area and admin presentation.

### 0.05.0
- Updated lookup counters instead of replacing them.

### 0.01.0
- Initial release.
