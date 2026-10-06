# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### 0.81.1 - 2026-09-30

#### Added
- Updated bundled dependency runtime files:
  - Sabberworm exception-message escaping and preservation of integer parser line numbers.
  - MatthiasMullie Minify exception-message escaping, while retaining native file and URL operations with PHPCS annotations.
  - simplehtmldom diagnostic-output escaping and direct-access guards, while retaining its native HTTP loaders.
  - Wa72's native `parse_url()` call is unchanged; its only change is a PHPCS annotation, not a URL-parsing fix.
- Added `LicenseIntegration` to centralize licensing routes, dashboard data, activation checks, plugin-details hooks, and update notifications. Renamed the existing `License` service to `LicenseService` and updated its callers.
- Added bootstrap-safe request helpers in `Speed`:
  - `sanitize_bootstrap_text()`
  - `sanitize_bootstrap_url()`
  - `server_var()`
  - `safe_parse_url()`
  - `delete_file_compat()`
  - `get_query_args()`
  - `request_has_query_arg()`
  - `get_current_host()`
  - `is_same_origin_url()`
  - `make_absolute_host_url()`
- Added extension hook dispatch model in `Speed`:
  - `call_extension()` + `__callStatic()` fallback, replacing hard-coded Pro-method wrappers.
- Added direct-access guards (`if ( ! defined('ABSPATH') ) exit;`) across additional plugin runtime classes.
- Added inline CSS reduction metadata to lookup output so rewritten inline styles can carry `data-spred` with the reduction percentage.
- Added browser-side collection of `icon_selectors` alongside icon-font families. Exact class or ID selectors for icon-bearing elements are deduplicated, submitted with usage data, and stored in the page's CSS lookup.
- Added selector-based hiding for lazily loaded inline icon fonts, using `visibility: hidden` to preserve layout. The deferred interaction template carries both the real font CSS and the script that sets `spress-icon-fonts-ready` to reveal those elements.
- Added a shared request bypass classifier in `Speed` for request methods, response codes, AJAX, REST/XML-RPC, admin and transport endpoints, AMP, excluded extensions, logged-in cookies, and optional cookie/user-agent rules. It returns a bypass reason or `false`, retaining diagnostic output rather than only a boolean result.

#### Changed
- Separated generic AJAX nonce replacement from WooCommerce cart handling. A shared `add_nonce_token_injection()` method and neutrally named script handle request tokens for either option; `add_woo_injects()` now runs only for WooCommerce cart cleanup.
- Separated licensing integration from license-service logic:
  - `/check_license` registration moved behind `LicenseIntegration::register_rest_routes()`.
  - `check_license()` now delegates to `LicenseIntegration` when available.
  - Plugin-enable flow validates licensing via integration module when present.
- Hardened public CSS update endpoint:
  - Required non-empty Origin and Referer headers and checked their hostnames against the current site host.
  - Validated the submitted URL and checked its hostname against the current site host. These checks reject unsupported schemes but do not compare scheme and port as a strict browser-origin check would.
  - Added early skip response when URL lookup already processed.
  - Improved client IP sanitization for rate limiting.
- Updated `handle_compressx()` to use `WP_REST_Request` params instead of raw `$_GET`.
- Updated cache/bootstrap flow to use sanitized server/request accessors and compatibility helpers in advanced cache context.
- Updated cache/bootstrap flow to use the shared bypass classifier instead of duplicated request-shape and cookie checks.
- Updated config update flow for `preload_fonts_intelligently` so dependent keys are expanded before save loop (fixes shortcut persistence timing issue).
- Updated path/file operations toward WP-compatible functions where applicable (`wp_mkdir_p`, `wp_delete_file`, filesystem-backed directory removal helper).
- Added an explicit GPLv3-or-later license declaration to the plugin header. Updated the plugin header and release metadata version to `0.81.01`.
- Updated release metadata to declare PHP 7.4 as the minimum version and WordPress 7.0 as the tested version.
- Updated cache bypass globals and naming for safer namespace isolation (e.g. `spress_bypass_reason`, `spress_cache_purging`, `spress_start_time`).
- Updated many URL parsing calls to `wp_parse_url` (or compatibility wrapper in early bootstrap paths).
- Updated timestamp/log usage in multiple paths to GMT (`gmdate`) consistency.
- Restricted initial remote CSS fetch URLs to the site's hostname and normalized relative or protocol-relative URLs before fetching. Added an `ABSPATH` prefix check to resolved local stylesheet paths.
- Changed unused-CSS debug logging to append with `FILE_APPEND | LOCK_EX` and serialize markup, variables, and font-finder diagnostics as JSON.
- Gave the usage collector its own `-collector` script handle, localized its data using that handle, and added removal of matching collector and Turnstile script tags once a page has a CSS lookup.
- Updated inline style discovery and rewriting to handle single-quoted `data-spcid` values and recover edge-case markup with DOM fallback only when the fast regex count disagrees.
- Reduced unnecessary inline-style regex capture work and normalized lookup identifiers so existing `id-` prefixes are not duplicated.
- Expanded icon-font detection beyond the usual private-use range to recognize escaped pseudo-element content and glyphs in the `FB00-FDFF` and `FE70-FEFF` ranges, including Gutenverse's GTN fonts.
- Consolidated icon-family and selector detection into a shared scan, with sorted, deduplicated results.
- Removed the animation-frame/idle delay from blank icon-font registration and expanded its declared Unicode ranges. The blank font remains alongside selector-based hiding.
- Clarified that icon fonts are loaded on user interaction and that separate-cookie caches may require additional force-included CSS selectors.
- Hardened DOM rewriting so viewport/preload insertion no longer mutates `HtmlDocument` properties, avoiding PHP 8.2 dynamic property deprecations.
- Normalized and capped individual URL-path, query-string, cookie-name, and role fragments used in cache paths. Long fragments retain a short readable prefix plus a hash.
- Added hash-based shortening for oversized URL-derived cache directories and query-string directory names to address long-path write failures.
- Encoded the admin bootstrap payload with `wp_json_encode()` instead of manually interpolating JavaScript, and escaped REST nonces inserted into inline scripts.
- Escaped admin-bar selector and icon values while preserving the data-URL menu icon.
- Replaced bloat-removal redirects with `wp_safe_redirect()` for attachment-page and disabled-comments redirects.
- Corrected the license updater's dialog title to use the `speedify-press` translation text domain.

#### Removed
- Excluded `composer.json`, `composer.lock`, and `patches.lock.json` from Community Lite after regenerating the runtime autoloader. The required `vendor/autoload.php` and `vendor/composer/` files remain included.
- Removed Partytown assets, configuration, enqueue methods, script-delay exemption, and analytics-processing branches from this Community build.
- Removed logged-in cache worker and Woo nonce helper assets, together with logged-in caching and nonce-replacement configuration and HTML-injection branches, from this Community build.
- Removed the Cloudflare worker-download REST route and its fetch method from the Community runtime.
- Excluded the Pro-only AJAX nonce checker override, its include, and the shared nonce-token injection asset from non-Pro packages.
- Replaced the old `License` entries in both Composer autoload maps with `LicenseIntegration` and `LicenseService`.
- Removed large simplehtmldom bundled non-runtime docs/examples/manual content from shipped tree.
- Removed the output-buffer callback's custom error-handler override and its matching `restore_error_handler()` call from the distributed runtime.

#### Fixed
- Avoided zlib output-compression notices at shutdown by flushing only removable output buffers when a zlib buffer is present, leaving protected buffers for PHP shutdown.
- Fixed blank admin views from "Change Settings" links by keeping navigation identifiers independent of edition-specific sidebar labels and ignoring unavailable destinations.
- Fixed trailing slash handling regression in sanitized URI normalization.
- Fixed admin cache settings accessors so missing non-pro keys no longer throw `undefined.value` errors in the community build.
- Shortened oversized URL-derived cache paths to address `mkdir(): File name too long` and `file_put_contents(...): File name too long` errors.
- Capped individual cookie-name and logged-in role fragments used in cache filename suffixes.
- Fixed false cron bypasses on normal page requests when another plugin or theme defines `DOING_CRON`. Cron detection now also requires `wp-cron.php` in the request URI or script name, and front-end detection uses the same helper.
- Centralized `speedify_cache_bust` and legacy `nocache` handling so both bootstrap and runtime caching recognize bypass requests.
- Made shared URL parsing and file deletion fall back to native PHP before WordPress functions are available. Added a numeric nonce-lifetime default when `DAY_IN_SECONDS` is not yet defined.
- Restricted the CSRF endpoint's optional `X-Page-URL` override to HTTP(S) URLs matching the current host, and corrected the advanced-cache `X-CSRF-Source` header to use a key/value pair.
- Preserved integer line-number arguments in Sabberworm parser exceptions while adding escaping to their message and token arguments.
- Added escaping for dependency exception messages and diagnostic output, while retaining native parsing and filesystem operations where required by the libraries.
- Added a guarded, fully qualified reference to the optional `SPRESS\App\CloudflareModule` when preparing collector configuration; it is not called when the module is absent.
- Updated dashboard license data to use `LicenseIntegration`, with a fallback when the integration is unavailable. Community Lite retains Community licensing rather than adopting WordPress.org's license-free activation flow.
- Preserved raw cached HTML and gzip response bytes rather than HTML-escaping them; these deliberate response-output paths are documented with targeted PHPCS exceptions.

#### Security / Compliance
- Tightened request sanitization throughout cache/bootstrap paths (`$_SERVER`, cookies, headers, query parsing).
- Added hostname validation to the public CSS update endpoint and optional CSRF page-URL override.
- Added direct file access protection in additional dependency/runtime files.
- Added PHPCS annotations for retained dependency URL/file/HTTP operations, diagnostic functions, and legacy global names. These annotations suppress lint findings; they do not replace those operations with WordPress APIs.
- Continued replacement of raw superglobal access patterns with validated/sanitized wrappers for WP.org review readiness.

#### Developer Notes
- Community Lite ships the patched dependency runtime and generated autoloader, not Composer manifests, lock files, or patch sources. Dependency rebuilding requires the source repository.
- Added `.gitignore` rules for environment files, ZIP archives, build output, and editor artifacts.

### 0.80.6 - 2026-01-28
- Strip collector + Turnstile scripts and hints on processed pages

### 0.80.5 - 2026-01-27
- Add Turnstile protection for public CSS update endpoint with admin UI + docs
- Enforce same-origin, Origin+Referer checks, and skip redundant update_css processing
- Harden CSRF token header handling for advanced cache context
- Tighten URL fetch safety in Unused CSS pipeline

### 0.80.4 - 2026-01-25
- Fix bug in calling is_shop

### 0.80.3 - 2026-01-23
- Fix dates in changelog

### 0.80.2 - 2026-01-23
- Fix template/content loading order

### 0.80.1 - 2026-01-22
- Make font lazy load interaction only
- Fix undelayed JS loading before template restore
- License tweaks
- Disable plugin in customizer

### 0.80.0 - 2026-01-17
- Add Bloat remover
- Create community/pro editions
- Update Cloudflare worker
- Update licensing DB sructure
- Refactor JSDelayer, add ability to set individual delay times on scripts
- Add ability to force JS inline
- Add Bloat Removal
- Fix non serving of CSRF if cache not enabled

### 0.78.7 - 2026-01-10
- Minimize sidebar width

### 0.78.6 - 2026-01-10
- Allow CSRF to be served from main plugin

### 0.78.5 - 2026-01-08
- Allow individual scripts to have diff delay times

### 0.78.4 - 2025-12-16
- JS checkbox options disappearing
- Notice/deprecation messages
- Permalinks warning isn't shown anywhere
- Docs Updates

### 0.78.3 - 2025-12-11
- Restore replays trigger

### 0.78.2 - 2025-12-11
- Adjust default completion triggers
- Fix checkbox booleans

### 0.78.1 - 2025-12-11
- Adjust default completion triggers

### 0.78.0 - 2025-12-11
- Full flexibility and backwards compat for completion triggers

### 0.77.6 - 2025-12-05
- Don't preload data URIs

### 0.77.5 - 2025-12-04
- Rework of JS delay script

### 0.77.4 - 2025-12-04
- Tweak load order for captured events

### 0.77.3 - 2025-12-04
- Tighten up captured event firing with patched event listener

### 0.77.2 - 2025-12-03
- Fix double replay with document load

### 0.77.1 - 2025-12-03
- Only run triggers if not already run

### 0.77.0 - 2025-12-03
- Add configurable events and triggers

### 0.76.0 - 2025-12-02
- Updates to Readme
- Slimming package size
- Add document onload setting to JS
- Tidy Cloudflare docs
- Reduce CSRF request frequency

### 0.75.2 - 2025-12-01
- Remove patching lib from production release

### 0.75.1 - 2025-11-30
- Log when no LCP found

### 0.75.0 - 2025-11-29
- Prevent use of DOMDocument (segfault)

### 0.74.0 - 2025-11-28
- Add CompressX easy install

### 0.73.0 - 2025-11-25
- Add main panel expand for easier code editing

### 0.72.3 - 2025-11-24
- JS old version compatibility
- Increase CSS request limit 
- Add page template tags
- Improve cached uris list
- Allow user to add font filenames

### 0.72.2 - 2025-11-20
- Allow CSS to be collected even with logged in caching

### 0.72.1 - 2025-11-20
- Fix CSRF for domains in subfolders

### 0.72.0 - 2025-11-20
- Allow turning off of all AJAX nonces

### 0.71.0 - 2025-11-20
- Update to licensing system

### 0.70.2 - 2025-11-18
- Tweak to icon font identification

### 0.70.1 - 2025-11-17
- Add cookie fallback for CSRF token

### 0.70.0 - 2025-11-14
- Remove CSRF replacement from CF worker
- Add Woo nonce replacement
- Add improvements to CSRF token generation
- Ensure templates are replaced before JS runs
- Add page preloads/prerenders
- Update Sabberworm version
- Move vendor to dependencies
- Create patch for HtmlNode charset    

### 0.67.0 - 2025-10-23
- Unused CSS tweaks to handle glitched CSS

### 0.67.0 - 2025-10-22
- Add page preloading
- Fix double find replace
- Forced image lazyloads
- Admin menu restructure

### 0.66.7 - 2025-10-17
- Unused fonts fixes

### 0.66.5 - 2025-10-16
- Mobile font fixes
- Activation compatibility checks

### 0.66.4 - 2025-10-15
- Fix debugging in Unused
- Fix admin bar nonce timeout
- Fix protocol relative Google fonts

### 0.66.3 - 2025-10-15
- Fixes for rest nonce expiring

### 0.66.2 - 2025-10-14
- Fixes to Unused class
- Fixes for purging on post save
- Fixes for rest nonce

### 0.66.1 - 2025-10-14
- Fix nonce expiry
- Correct bug after removal of page headers

### 0.66.0 - 2025-10-12
- Add code insertion

### 0.65.1 - 2025-10-11
- Tweaks to Find/Replace

### 0.65.0 - 2025-10-06
- Add nonces and tighten security practices

### 0.64.7 - 2025-10-06
- Big fixes to caching. JS, CSS

### 0.64.6 - 2025-10-04
- Allow find/replace by CSS selector

### 0.64.5 - 2025-10-02
- Fixes for CSS vars
- Fixes for JS modules delay
- Fixes for LCP preloading

### 0.64.4 - 2025-09-30
- Tweaks to code editor display

### 0.64.3 - 2025-09-30
- Tweaks to icon font finding

### 0.64.2 - 2025-09-28
- Tweaks to find/replace display

### 0.64.1 - 2025-09-28
- Updates to footer display

### 0.64.0 - 2025-09-27
- Fixes for CF worker redirect handling
- Add code highlighting
- Improvements and fixes for logged-in caching
- Add Multisite Compatibility
- Add icon font lazyloading
- Improve CSS selector force includes handling
- Tighten up caching rules

### 0.63.2 - 2025-09-08
- Fixes for usage collector on incongnito

### 0.63.1 - 2025-09-08
- Fixes for conditional font display
- Fixes for usage collector on incongnito

### 0.63.0 - 2025-09-08
- Add local hosting of Google fonts
- Add preloading of poster image for videos
- Fix license expiry incorrectly stored
- Save all font definitions in single file to allow for desktop only preload

### 0.62.4 - 2025-08-28
- Cache clearance with integrations fix

### 0.62.3 - 2025-08-28
- CSRF expiry bug fix

### 0.62.2 - 2025-08-28
- Gzip output bug fix

### 0.62.1 - 2025-08-28
- Cache directory bug fix

### 0.62.0 - 2025-08-28
- Allow change to cache directory
- Allow optional gzip output
- Optimise cache clearance

### 0.61.0 - 2025-08-28
- Addition of CSS security options
- Add ID to google gtag filename

### 0.60.1 - 2025-08-17
- Further tweaks to Cloudflare worker

### 0.60.0 - 2025-08-07
- Improvements to logged-in user cache 
- Further tweaks to Cloudflare worker
- Collapseable sidebar
- Remove reliance on text/html request header
- Correct writing to advanced cache
- Don't parse XML documents

### 0.59.0 - 2025-08-04
- Cloudflare worker improvements

### 0.58.0 - 2025-07-11
- Licensing tweaks
- Improvements to intersection observer
- Minor bug fixes to delay.js
- Turn off debugging on usage collector
- Better disable for builder keywords
- Better View Details link in plugin display
- Improved cache deletion

### 0.57.1 - 2025-06-10
- Licensing hotfixes

### 0.57.0 - 2025-06-10
- Fixes:
    - Licensing text
    - Template content restoration reliability
    - Usage collector ignoring external styles
    - RestAPI typo
    - CSS increased reliability
    - Kinsta increased reliability
    - UnusedCSS better handle font variables

### 0.56.1 - 2025-06-04
- Fix: minor licensing fixes

### 0.56.0 - 2025-06-04
- Fix: Stylesheet media attributes should be taken into account
- Feat: A free plan is required

### 0.55.0 - 2025-05-27
- Fix: Code incorrectly being added to the head #20
- Fix: Unused CSS missing URLs that don't start with http(s) #21
- Fix: Correctly set allowed hosts to 0 when required #22
- Fix: CSRF token should expire after 30 seconds #23

### 0.54.2 - 2025-05-08
- Fix: Cache clear should remove empty dirs

### 0.54.1 - 2025-05-08
- Fix: dates should be added to changelog

### 0.54.0 - 2025-05-08
- Fix: fixes required for license handling

### 0.53.0 - 2025-05-07
- Feat: Cloudflare worker should ignore kinsta uptime bot 
- Fix: Cache should correctly strip querystrings 
- Tidy: README amends

### 0.52.0 - 2025-05-06
- Update usage collecttor for inline CSS

### 0.51.0 - 2025-05-06
- Fix PHP Warnings

### 0.50.0 - 2025-05-06
- Allow Unicode text to be saved from settings fields

### 0.49.0 - 2025-04-27
- Add quick copy for Cloudflare settings
- Improvements to documentation

### 0.48.0 - 2025-04-25
- Various improvements to harden plugin security

### 0.47.0, 0.47.1, 0.47.2 - 2025-04-17
- Update README.md

### 0.46.0 - 2025-04-15
- Check license by invoice number, not email

### 0.45.0 - 2025-04-10
- Add Inline, grouped CSS setting
- Update Cloudflare worker to ignore API paths
- Improve onload to handle down-page loads
- Fix CSS cache purge issue
- Improve inline CSS animation detection

### 0.44.0 - 2025-04-07
- Fixes to clear buttons not always working

### 0.43.0
- Add number of hosts to licensing check

### 0.42.1
- Tweak font detection function

### 0.42.0
- Add option to prevent icon fonts from preloading

### 0.41.0
- csrf fixes for Unused CSS function

### 0.40.0
- Move Unused processing to backend

### 0.39.1
- Font preloading tweaks

### 0.39.0
- Font preloading options

### 0.38.1
- Full and partial disabling of plugin also in advanced-cache.php

### 0.38
- Allow full and partial disabling of plugin

### 0.37
-  Fixes:
    - Uninstall doesn't remove advanced-cache.php
    - Advanced-cache should exit if autoload not found
    - speed_css_vars should be updated in cached files when changhed
    - When you save a skip reload image it removes the Current image from preload
    - Find/replace not working to replace in spress-inlined

### 0.36
-  Add page caching class and options

### 0.35.1
-  Further updates to licence system

### 0.35.0
-  Update to licence system

### 0.34.0
-  Version bump

### 0.33.0
-  Rename to SpeedifyPress complete
-  Add licensing functionality
-  Fixes to backend UI maintaining global data
-  Updates to docs

### 0.32.0
-  Rename to SpeedifyPress

### 0.31.0
-  Add ability to generate at specific resolutions

### 0.30.0
-  Various fixes and improvements

### 0.29.0
-  Add global find/replace functionality

### 0.28.0
-  Reorganise structure, add font and lcp image preloading

### 0.27.0
-  Add onload callback

### 0.26.0
-  Add Javascript defer and delay

### 0.25.0
-  Improve tagging function

### 0.24.0
-  Improvements to font collection

### 0.23.0
-  Add additional optimisation options

### 0.22.0
-  Resolve nested CSS variables

### 0.21.0
-  Improve templates and onload

### 0.20.0
-  Sort correct onload position

### 0.19.0
-  Further standin improvements, better gtag replacement

### 0.18.0
-  Improvements to jQuery standin, onload script runs correct place

### 0.17.0
-  Improvements to CSS optimisation code

### 0.16.0
-  Improve CSS handling

### 0.15.0
-  Change local file folder and filename

### 0.14.0
-  Add local gtag handling

### 0.13.0
-  Add automatic content lazy rendering

### 0.12.0
-  Add jQuery standin, only load partytown if required

### 0.11.0
-  Add partytown, inline CSS and improved document taggins

### 0.10.0
-  Make intersection obsever immediate load

### 0.10.0
-  Cleanup, improve scroll collect 

### 0.09.0
-  Add constrain intrinsic, admin UI improvements

### 0.08.0
-  Add ability to ignore certain URLs or cookies for CSS

### 0.07.0
-  Fix count of {slug} URLs

### 0.06.0
- Improvements to the stats area, cosmetic changes

### 0.05.0
- Increment lookups rather than replace

### 0.04.0
- Unminify PHP

### 0.03.0
- Update logo, minify PHP

### 0.02.0
- Set correct image width

### 0.01.0
- Initial commit
