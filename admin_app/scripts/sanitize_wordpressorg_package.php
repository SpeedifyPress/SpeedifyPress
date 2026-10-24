<?php

declare(strict_types=1);

if ($argc < 2) {
    fwrite(STDERR, "Package directory is required.\n");
    exit(1);
}

$packageDir = rtrim($argv[1], DIRECTORY_SEPARATOR);

if (!is_dir($packageDir)) {
    fwrite(STDERR, "Package directory does not exist: {$packageDir}\n");
    exit(1);
}

function replaceRegexWordPressOrg(string $file, string $pattern, string $replacement, bool $requireMatch = false): void
{

    $contents = file_get_contents($file);
    if ($contents === false) {
        throw new RuntimeException("Unable to read file: {$file}");
    }

    $updated = preg_replace($pattern, $replacement, $contents, -1, $count);
    if ($updated === null) {
        throw new RuntimeException("Regex replacement failed for {$file}");
    }

    if ($requireMatch && $count < 1) {
        throw new RuntimeException("Expected at least one regex match in {$file}");
    }

    if (file_put_contents($file, $updated) === false) {
        throw new RuntimeException("Unable to write file: {$file}");
    }
}

$speedifyPressFile = $packageDir . '/speedify_press.php';
replaceRegexWordPressOrg(
    $speedifyPressFile,
    "/\n\/\/Run the init functions for Rest API and edition-specific licensing\nSPRESS\\\\RestApi::init\(\);\nif \( class_exists\( '\\\\SPRESS\\\\App\\\\LicenseIntegration' \) \) \{\n\tSPRESS\\\\App\\\\LicenseIntegration::init\(\);\n\}\n/",
    "\n//Run the init functions for Rest API\nSPRESS\\RestApi::init();\n",
    true
);

$dashboardFile = $packageDir . '/src/App/Dashboard.php';
replaceRegexWordPressOrg(
    $dashboardFile,
    "/\n\s*\\\$data\\['license_data'\\] = class_exists\( '\\\\SPRESS\\\\App\\\\LicenseIntegration' \)\n\s*\? LicenseIntegration::get_dashboard_data\(\)\n\s*: array\(\n\s*'license_status' => 'inactive',\n\s*'license_ends_days' => '',\n\s*'allowed_hosts' => '0',\n\s*'license_status_verb' => '',\n\s*'license_number' => '',\n\s*\);\n/",
    "\n    \$data['license_data'] = array(\n      'license_status' => 'inactive',\n      'license_ends_days' => '',\n      'allowed_hosts' => '0',\n      'license_status_verb' => '',\n      'license_number' => '',\n    );\n",
    true
);

$restApiFile = $packageDir . '/src/RestApi.php';
replaceRegexWordPressOrg(
    $restApiFile,
    '/\R\s*if\s*\(\s*class_exists\(\s*[\'"]\\\\SPRESS\\\\App\\\\LicenseIntegration[\'"]\s*\)\s*\)\s*\{\R\s*App\\\\LicenseIntegration::register_rest_routes\(\);\R\s*\}\R/s',
    "\n"
);
replaceRegexWordPressOrg(
    $restApiFile,
    '/\R\s*if\s*\(\s*class_exists\(\s*[\'"]\\\\SPRESS\\\\App\\\\LicenseIntegration[\'"]\s*\)\s*\)\s*\{\R\s*\$licensing_check\s*=\s*App\\\\LicenseIntegration::validate_plugin_enable\(\);\R\s*if\s*\(\s*is_wp_error\(\s*\$licensing_check\s*\)\s*\)\s*\{\R\s*return\s+\$licensing_check;\R\s*\}\R\s*\}\R/s',
    "\n"
);

// Exclude features outside CSS and Cache, using the existing WordPress.org packaging pipeline.
/** Replace or remove named methods using PHP tokens, not brace-sensitive regexes. */
function specializeMethods(string $file, array $methods): void {

    $source = file_get_contents($file);
    $lineEnding = strpos($source, "\r\n") !== false ? "\r\n" : "\n";
    $tokens = token_get_all($source);
    $offsets = [];
    $offset = 0;
    foreach ($tokens as $token) {
        $offsets[] = $offset;
        $offset += strlen(is_array($token) ? $token[1] : $token);
    }
    $edits = [];
    foreach ($tokens as $index => $token) {
        if (!is_array($token) || $token[0] !== T_FUNCTION) continue;
        $nameIndex = $index + 1;
        while (isset($tokens[$nameIndex]) && is_array($tokens[$nameIndex]) && $tokens[$nameIndex][0] === T_WHITESPACE) ++$nameIndex;
        $name = is_array($tokens[$nameIndex] ?? null) ? $tokens[$nameIndex][1] : '';
        if (!array_key_exists($name, $methods)) continue;

        // Remove the associated docblock too, so excluded features leave no misleading method docs.
        $previous = $index - 1;
        while ($previous >= 0 && is_array($tokens[$previous]) && in_array($tokens[$previous][0], [T_WHITESPACE, T_PUBLIC, T_PRIVATE, T_PROTECTED, T_STATIC, T_FINAL, T_ABSTRACT, T_DOC_COMMENT, T_COMMENT], true)) --$previous;
        $start = $offsets[$previous + 1];
        $body = $nameIndex;
        while (isset($tokens[$body]) && $tokens[$body] !== '{') ++$body;
        $depth = 0;
        for ($end = $body; isset($tokens[$end]); ++$end) {
            $item = $tokens[$end];
            if ($item === '{' || (is_array($item) && in_array($item[0], [T_CURLY_OPEN, T_DOLLAR_OPEN_CURLY_BRACES], true))) ++$depth;
            if ($item === '}' && --$depth === 0) break;
        }
        if (!isset($tokens[$end])) throw new RuntimeException("Unbalanced method {$name} in {$file}");

        // Nowdoc replacements inherit this script's line endings; match the target file instead.
        $replacement = str_replace("\r\n", "\n", "\n\n" . $methods[$name] . "\n");
        $replacement = str_replace("\n", $lineEnding, $replacement);
        $edits[] = [$start, $offsets[$end] + 1 - $start, $replacement];
        unset($methods[$name]);
    }
    if ($methods) throw new RuntimeException('Missing methods: ' . implode(', ', array_keys($methods)));
    usort($edits, static function ($a, $b) { return $b[0] <=> $a[0]; });
    foreach ($edits as [$start, $length, $replacement]) $source = substr_replace($source, $replacement, $start, $length);
    file_put_contents($file, $source);
}

/** Make required substitutions fail visibly if source structure has changed. */
function specializeReplace(string $file, string $pattern, $replacement): void {

    $source = file_get_contents($file);
    $updated = preg_replace_callback($pattern, is_callable($replacement) ? $replacement : static function () use ($replacement) { return $replacement; }, $source, -1, $count);
    if ($updated === null || $count === 0) throw new RuntimeException("Required specialization did not match: {$file}: {$pattern}");
    file_put_contents($file, $updated);
}

/** Remove packaged files recursively without touching their source counterparts. */
function specializeRemove(string $path): void {

    if (!file_exists($path)) return;
    if (is_dir($path) && !is_link($path)) {
        foreach (new FilesystemIterator($path, FilesystemIterator::SKIP_DOTS) as $item) specializeRemove($item->getPathname());
        if (!rmdir($path)) throw new RuntimeException("Unable to remove {$path}");
    } elseif (!unlink($path)) {
        throw new RuntimeException("Unable to remove {$path}");
    }
}

// Evaluate only the already-sanitized literal defaults; do not initialize WordPress configuration.
require $packageDir . '/src/App/Config.php';
$defaults = (new ReflectionClass(\SPRESS\App\Config::class))->getDefaultProperties()['initial_config'];
$defaults = array_intersect_key($defaults, array_flip(['speed_cache', 'speed_css', 'speed_code', 'plugin']));
// CSS still needs the known icon-font names, but optional font-delivery features are excluded.
$defaults['speed_code'] = array_intersect_key($defaults['speed_code'], ['icon_font_names' => true]);
$configFile = $packageDir . '/src/App/Config.php';
specializeReplace($configFile, '/protected static \$initial_config = array\([\s\S]*?\R\t\);/', 'protected static $initial_config = ' . var_export($defaults, true) . ';');
specializeReplace($configFile, '/self::\$config = self::array_merge_recursive_unique\( \$initial_config, self::\$config \);/', static function ($match) {
    return $match[0] . "\n\t\t// Discard settings outside this package, including saved settings from the full plugin.\n\t\tself::\$config = array_intersect_key(self::\$config, \$initial_config);\n\t\tforeach (\$initial_config as \$section => \$fields) {\n\t\t\tself::\$config[\$section] = array_intersect_key(self::\$config[\$section], \$fields);\n\t\t}";
});
specializeReplace($configFile, '/\s*\/\/Custom methods for updates here[\s\S]*?(?=\s*\/\/If disabling page cache)/', "\n");
specializeReplace($configFile, '/\s*\/\/ special case: HTML find\/replace array passes raw[\s\S]*?(?=\s*\/\/ array field:)/', "\n");

$speedFile = $packageDir . '/src/Speed.php';
$remove = ['add_jquery_standin', 'add_gtag', 'download_gtag', 'handle_gtag_update', 'run_gtag_cron', 'proxy_google_fonts', 'build_local_gfonts_css', 'rewrite_gfonts_css_urls', 'add_mobile_system_fonts', 'add_image_lazyload', 'get_dimensions', 'is_svg', 'save_data_image', 'add_invisible_elements', 'set_onload', 'add_intersection_observer', 'add_template_image_restore_js', 'call_extension', '__callStatic'];
specializeMethods($speedFile, array_merge(array_fill_keys($remove, ''), ['rewrite_html' => <<<'PHP'
    public static function rewrite_html($html) {
        if (!self::is_frontend() || is_404() || !preg_match('/<html[\s>]/i', $html)) return $html;
        $dom = (new HtmlDocument(''))->load($html, true, false);
        $object = get_queried_object();
        $object_id = $object ? strtolower(str_replace('WP_', '', get_class($object))) . '-' . get_queried_object_id() : 'none-0';
        $dom = self::tag_html($dom, $object_id);
        $dom = self::add_page_preloaders($dom);
        $dom = self::add_csrf_token($dom);
        $dom = self::move_viewport_to_top($dom);
        return $dom->outertext;
    }
PHP
]));
specializeReplace($speedFile, '/^.*' . preg_quote('use SPRESS\\Speed\\JS;', '/') . '.*\R/m', '');
specializeReplace($speedFile, '/^.*(?:JS::init\(\);|JS::rewrite_js\(\$output\);|\$output = self::find_replace\(\$output\);).*\R/m', '');
specializeReplace($speedFile, '/^.*add_action\(\'run_gtag_cron\'.*\R/m', '');

$cssFile = $packageDir . '/src/Speed/CSS.php';
specializeReplace($cssFile, '/\s*\/\/Add invisible elements[\s\S]*?(?=\s*\/\/Resave cache file)/', "\n");
specializeReplace($cssFile, '/\(\$lcp_image && Config::get\(\'speed_code\', \'preload_image\'\) == \'\'\)[^\n]*/', '$lcp_image');

$restFile = $packageDir . '/src/RestApi.php';
specializeReplace($restFile, '/^\s*\/\/ Route for (?:clearing gfonts cache|compressX actions|getting info on installed plugins)[^\r\n]*\R/m', '');
specializeMethods($restFile, array_fill_keys(['clear_gfonts_cache', 'get_compressx_data', 'handle_compressx'], ''));
specializeReplace($restFile, '/\R\s*register_rest_route\(\s*\'speedifypress\',\s*\'\/(?:clear_gfonts_cache|handle_compressx|get_compressx_data)\/\?\',[\s\S]*?\R\s*\);/', "\n");
specializeReplace($restFile, '/^.*' . preg_quote('Speed\\JS::update_config_to_cache($config);', '/') . '.*\R/m', '');
specializeReplace($restFile, '/if \( ! is_array\( \$config \) \) \{/', "if ( ! is_array( \$config ) || empty( \$config['config_key'] ) ) {");
$cacheFile = $packageDir . '/src/Speed/Cache.php';
file_put_contents($cacheFile, str_replace('SPEEDIFYPRESS WP_CACHE marker', 'SPEEDIFYCSS WP_CACHE marker', file_get_contents($cacheFile)));

// Narrow the bootstrap and remove entire unrelated runtime modules/assets from the package.
specializeReplace($packageDir . '/speedify_press.php', '/^' . preg_quote('SPRESS\\Speed\\Bloat::init();', '/') . '\R/m', '');
foreach (['src/Speed/JS.php', 'src/Speed/Bloat.php', 'assets/js_delay', 'assets/onload', 'assets/restore_template_content.js', 'assets/simple_jquery_standin.js', 'assets/intersection_observer.js', 'assets/preload_image.svg'] as $path) {
    specializeRemove($packageDir . '/' . $path);
}

// Keep settings shared across editions while giving SpeedifyCSS its own cache namespace.
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($packageDir . '/src', FilesystemIterator::SKIP_DOTS));
foreach ($iterator as $file) {
    if (!$file->isFile() || $file->getExtension() !== 'php' || strpos($file->getPathname(), '/Dependencies/') !== false || $file->getFilename() === 'plugin-conflicts.php') continue;
    $contents = str_replace(['SpeedifyPress', "'speedify_press'", "'speedify-press'", 'spress_advanced_cache_signature', 'speedify-spress'], ['SpeedifyCSS', "'speedifycss'", "'speedifycss'", 'speedifycss_advanced_cache_signature', 'speedifycss'], file_get_contents($file->getPathname()));
    file_put_contents($file->getPathname(), $contents);
}
$main = file_get_contents($packageDir . '/speedify_press.php');
$main = str_replace(['Plugin Name: SpeedifyPress', 'Suite of tools and utilities to optimise WordPress sites', 'Text Domain: speedify-press'], ['Plugin Name: SpeedifyCSS', 'Page-specific CSS optimization and optional page caching', 'Text Domain: speedifycss'], $main);
file_put_contents($packageDir . '/speedify_press.php', $main);
rename($packageDir . '/speedify_press.php', $packageDir . '/speedifycss.php');
$dropin = $packageDir . '/assets/advanced-cache.php';
file_put_contents($dropin, str_replace('Advanced Cache for SpeedifyPress', 'Advanced Cache for SpeedifyCSS', file_get_contents($dropin)));
