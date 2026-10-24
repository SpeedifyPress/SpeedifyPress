#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
OUTPUT_ROOT="$(cd "${PLUGIN_ROOT}/.." && pwd)"
BUILD_ROOT="${PLUGIN_ROOT}/build/wordpressorg"
ZIP_SLUG="speedifycss"
STAGING_DIR="${BUILD_ROOT}/${ZIP_SLUG}"
BUILD_DIR_OUTPUT="${SPRESS_BUILD_OUTPUT_DIR:-${OUTPUT_ROOT}/speedify_press_plugin}"

# Refuse cleanup targets that could contain the source or the staging package itself.
BUILD_DIR_OUTPUT="$(realpath -m "${BUILD_DIR_OUTPUT}")"
case "${PLUGIN_ROOT}/" in
  "${BUILD_DIR_OUTPUT}/"*) echo "Unsafe package output directory: ${BUILD_DIR_OUTPUT}" >&2; exit 1 ;;
esac
case "${BUILD_DIR_OUTPUT}/" in
  "${PLUGIN_ROOT}/"*) echo "Package output must be outside the source directory" >&2; exit 1 ;;
esac

rm -rf "${BUILD_ROOT}"
mkdir -p "${STAGING_DIR}"

rsync -a "${PLUGIN_ROOT}/" "${STAGING_DIR}/" \
  --exclude '.git/' \
  --exclude '.gitignore' \
  --exclude 'admin_app/licensing/' \
  --exclude 'admin_app/node_modules/' \
  --exclude 'admin_app/dist/' \
  --exclude 'admin_app/src/proAdminItems.js' \
  --exclude 'admin_app/src/components/FindReplace.vue' \
  --exclude 'admin_app/src/components/CodeInsertion.vue' \
  --exclude 'admin_app/src/components/CloudflareSettings.vue' \
  --exclude 'admin_app/src/components/docs/FindReplaceDoc.vue' \
  --exclude 'admin_app/src/components/docs/CodeInsertionDoc.vue' \
  --exclude 'admin_app/src/components/docs/CloudflareSettingsDoc.vue' \
  --exclude 'node_modules/' \
  --exclude 'build/' \
  --exclude '*.zip' \
  --exclude 'feature-suggestions.md' \
  --exclude 'CHANGELOG.md' \
  --exclude 'CHANGELOG.community.md' \
  --exclude 'CHANGELOG.pro.md' \
  --exclude 'CHANGELOG.wordpressorg.md' \
  --exclude 'RELEASE-NOTES-*.md' \
  --exclude 'font_example.txt' \
  --exclude 'README.md' \
  --exclude 'SUPPORT.md' \
  --exclude 'release.json' \
  --exclude 'readme.wordpressorg.txt' \
  --exclude 'assets/speedify_banner.jpg' \
  --exclude 'src/App/CloudflareModule.php' \
  --exclude 'src/App/LicenseIntegration.php' \
  --exclude 'src/App/LicenseService.php' \
  --exclude '*Pro.php' \
  --exclude '*Extension.php'

php "${SCRIPT_DIR}/render_wordpressorg_readme.php" \
  "${PLUGIN_ROOT}/readme.wordpressorg.txt" \
  "${PLUGIN_ROOT}/CHANGELOG.wordpressorg.md" \
  "${PLUGIN_ROOT}/release.json" \
  "${STAGING_DIR}/readme.txt"

sed -i -E 's/^(Version:[[:space:]]*[0-9.]+)(-pro)?([[:space:]]*)$/\1\3/' "${STAGING_DIR}/speedify_press.php"

php "${SCRIPT_DIR}/strip_marked_blocks.php" "${STAGING_DIR}"
php "${SCRIPT_DIR}/sanitize_non_pro_package.php" "${STAGING_DIR}" wordpressorg
php "${SCRIPT_DIR}/sanitize_wordpressorg_package.php" "${STAGING_DIR}"
php "${SCRIPT_DIR}/embed_package_patches.php" "${STAGING_DIR}" "${PLUGIN_ROOT}/vendor/patches"

# Use Community build settings when packaging from the full source repository.
# A Community export already has these settings as package.json and vite.config.js.
if [[ -f "${PLUGIN_ROOT}/admin_app/package.community.json" ]]; then
  cp "${PLUGIN_ROOT}/admin_app/package.community.json" "${STAGING_DIR}/admin_app/package.json"
fi
if [[ -f "${PLUGIN_ROOT}/admin_app/vite.config.community.js" ]]; then
  cp "${PLUGIN_ROOT}/admin_app/vite.config.community.js" "${STAGING_DIR}/admin_app/vite.config.js"
fi

# Build from the stripped Vue source, then ship runtime files only.
node "${SCRIPT_DIR}/strip_pro_vue.mjs" "${STAGING_DIR}/admin_app/src"
(
  ln -s "${PLUGIN_ROOT}/admin_app/node_modules" "${STAGING_DIR}/admin_app/node_modules"
  trap 'rm -f "${STAGING_DIR}/admin_app/node_modules"; rm -rf "${STAGING_DIR}/admin_app/dist"' EXIT
  cd "${STAGING_DIR}/admin_app"
  npm run build:wordpressorg
)
rm -rf "${STAGING_DIR}/admin_app"

(
  cd "${STAGING_DIR}"
  composer dump-autoload -o --no-dev
)

rm -f "${STAGING_DIR}/.gitignore"
rm -f "${STAGING_DIR}/composer.lock"

bash "${SCRIPT_DIR}/verify_wordpressorg_package.sh" "${STAGING_DIR}"

(
  cd "${BUILD_ROOT}"
  zip -qr speedifycss.zip "${ZIP_SLUG}"
)

mkdir -p "${BUILD_DIR_OUTPUT}"
find "${BUILD_DIR_OUTPUT}" -mindepth 1 -not -name '.git' -not -path "${BUILD_DIR_OUTPUT}/.git/*" -exec rm -rf {} +
rsync -a "${STAGING_DIR}/" "${BUILD_DIR_OUTPUT}/" --exclude '.git/'
cp "${BUILD_ROOT}/speedifycss.zip" "${BUILD_DIR_OUTPUT}/speedifycss.zip"
