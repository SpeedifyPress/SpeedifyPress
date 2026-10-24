#!/usr/bin/env bash
set -euo pipefail

PACKAGE_DIR="${1:?Package directory is required}"

fail() {
  echo "WordPress.org package verification failed: $1" >&2
  exit 1
}

search_fixed() {
  local pattern="$1"
  local target="$2"

  if command -v rg >/dev/null 2>&1; then
    rg -n -F -- "$pattern" "$target" >/dev/null
    return
  fi

  grep -RsnF -- "$pattern" "$target" >/dev/null
}

search_regex() {
  local target="$1"
  shift

  if command -v rg >/dev/null 2>&1; then
    rg -n "$@" "$target" >/dev/null
    return
  fi

  grep -RsnE "$@" "$target" >/dev/null
}

test -f "${PACKAGE_DIR}/readme.txt" || fail "readme.txt is missing"
test ! -f "${PACKAGE_DIR}/CHANGELOG.md" || fail "CHANGELOG.md belongs in readme.txt, not a separate file"
awk '
  { sub(/\r$/, "", $0) }
  $0 == "== Changelog ==" { in_changelog = 1; next }
  in_changelog && /^== / { in_changelog = 0 }
  in_changelog && /^= [0-9][^=]* =$/ { found = 1 }
  END { exit !found }
' "${PACKAGE_DIR}/readme.txt" || fail "readme.txt has no changelog releases"
test ! -f "${PACKAGE_DIR}/.gitignore" || fail ".gitignore should not be shipped in the WordPress.org package"
test ! -f "${PACKAGE_DIR}/README.md" || fail "README.md should not be shipped in the WordPress.org package"
test ! -f "${PACKAGE_DIR}/SUPPORT.md" || fail "SUPPORT.md should not be shipped in the WordPress.org package"
test ! -f "${PACKAGE_DIR}/composer.lock" || fail "composer.lock should not be shipped in the WordPress.org package"
test ! -f "${PACKAGE_DIR}/release.json" || fail "release.json should not be shipped in the WordPress.org package"
test ! -f "${PACKAGE_DIR}/feature-suggestions.md" || fail "feature-suggestions.md should not be shipped in the WordPress.org package"
test -f "${PACKAGE_DIR}/patches.lock.json" || fail "patches.lock.json is required for reproducible package rebuilds"
test ! -d "${PACKAGE_DIR}/assets/partytown" || fail "assets/partytown should not be shipped in the WordPress.org package"
test ! -f "${PACKAGE_DIR}/assets/logged_in_cache_worker.js" || fail "logged_in_cache_worker.js should not be shipped in the WordPress.org package"
test ! -f "${PACKAGE_DIR}/assets/woo_rest_token_injection.js" || fail "woo_rest_token_injection.js should not be shipped in the WordPress.org package"
test ! -f "${PACKAGE_DIR}/assets/nonce_token_injection.js" || fail "nonce_token_injection.js should not be shipped in the WordPress.org package"
test ! -f "${PACKAGE_DIR}/src/App/Pluggable/check_ajax_referer.php" || fail "AJAX nonce replacement should not be shipped in the WordPress.org package"
test ! -f "${PACKAGE_DIR}/assets/woo_null_cached_page_cart.js" || fail "woo_null_cached_page_cart.js should not be shipped in the WordPress.org package"
test ! -d "${PACKAGE_DIR}/vendor/cweagans" || fail "vendor/cweagans should not be shipped in the WordPress.org package"
test ! -d "${PACKAGE_DIR}/src/Dependencies/simplehtmldom/example" || fail "simplehtmldom examples should not be shipped in the WordPress.org package"
test ! -d "${PACKAGE_DIR}/src/Dependencies/simplehtmldom/manual" || fail "simplehtmldom manual should not be shipped in the WordPress.org package"
find "${PACKAGE_DIR}" -name '*.zip' -print -quit | grep -q . && fail "nested zip files are present"

if ! grep -Eq '^Version:[[:space:]]*[0-9.]+[[:space:]]*$' "${PACKAGE_DIR}/speedifycss.php"; then
  fail "speedifycss.php still has a non-WordPress.org plugin version header"
fi

if search_fixed 'SPRESS\\App\\License' "${PACKAGE_DIR}/vendor/composer"; then
  fail "Composer autoload still references removed License classes"
fi

if search_fixed 'CloudflareModule' "${PACKAGE_DIR}/vendor/composer"; then
  fail "Composer autoload still references removed Cloudflare module"
fi

if search_regex "${PACKAGE_DIR}/speedifycss.php" -e 'LicenseIntegration'; then
  fail "speedifycss.php still contains licensing bootstrap references"
fi

if search_regex "${PACKAGE_DIR}/readme.txt" -e 'license/free' -e 'I need a license' -e 'subscription-gated activation' -e 'go-pro'; then
  fail "readme.txt still contains non-WordPress.org community/pro marketing or license funnel copy"
fi

test ! -f "${PACKAGE_DIR}/src/App/CloudflareModule.php" || fail "CloudflareModule.php should not be shipped in the WordPress.org package"

# The upgrade feature list may mention Code Insertion, but its screen must not be bundled.
if search_regex "${PACKAGE_DIR}/assets/admin/admin.min.js" -e 'Cloudflare Setup' -e 'name:[[:space:]]*"Code Insertion' -e 'Partytown'; then
  fail "admin.min.js still contains Pro-only UI strings"
fi

search_fixed 'CSS Stats' "${PACKAGE_DIR}/assets/admin/admin.min.js" || fail "CSS Stats screen is missing"

if search_regex "${PACKAGE_DIR}/src" -e 'CloudflareModule' -e 'LicenseIntegration' -e 'include_partytown' -e 'get_cloudflare_script' -e 'check_license\('; then
  fail "Staged PHP still contains WordPress.org-excluded Pro/cloudflare/licensing references"
fi

test ! -f "${PACKAGE_DIR}/speedify_press.php" || fail "legacy main plugin file remains"
test ! -f "${PACKAGE_DIR}/src/Speed/JS.php" || fail "JavaScript optimization module remains"
test ! -f "${PACKAGE_DIR}/src/Speed/Bloat.php" || fail "Bloat module remains"
test ! -d "${PACKAGE_DIR}/assets/js_delay" || fail "JavaScript-delay assets remain"
grep -q '^Plugin Name: SpeedifyCSS' "${PACKAGE_DIR}/speedifycss.php" || fail "incorrect plugin name"
grep -q '^Text Domain: speedifycss' "${PACKAGE_DIR}/speedifycss.php" || fail "incorrect text domain"
if search_regex "${PACKAGE_DIR}/assets/admin/admin.min.js" -e 'JavaScript Settings' -e 'Bloat Remover' -e 'External Scripts' -e 'Image Settings'; then
  fail "unrelated admin screens remain in SpeedifyCSS"
fi
if search_regex "${PACKAGE_DIR}/src/Speed.php" -e 'JS::' -e 'add_gtag' -e 'add_image_lazyload' -e 'find_replace'; then
  fail "unrelated frontend feature calls remain"
fi

test -d "${PACKAGE_DIR}/vendor/patches" || fail "vendor/patches is missing"

if ! find "${PACKAGE_DIR}/vendor/patches" -name '*.patch' -print -quit | grep -q .; then
  fail "vendor/patches does not contain patch files"
fi

if search_regex "${PACKAGE_DIR}/composer.json" -e 'admin_app/patches/'; then
  fail "composer.json still references admin_app patch paths"
fi

if ! search_regex "${PACKAGE_DIR}/composer.json" -e 'vendor/patches/' -e '"patches"'; then
  fail "composer.json does not contain embedded patch references under vendor/patches"
fi

if search_regex "${PACKAGE_DIR}/patches.lock.json" -e 'admin_app/patches/'; then
  fail "patches.lock.json still references admin_app patch paths"
fi
