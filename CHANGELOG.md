# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

