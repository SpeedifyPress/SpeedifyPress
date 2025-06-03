# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

