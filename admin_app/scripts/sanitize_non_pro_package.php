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

function removePathNonPro(string $path): void
{

    if (!file_exists($path)) {
        return;
    }

    if (is_dir($path) && !is_link($path)) {
        $items = scandir($path);
        if ($items === false) {
            throw new RuntimeException("Unable to read directory: {$path}");
        }

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }

            removePathNonPro($path . DIRECTORY_SEPARATOR . $item);
        }

        if (!rmdir($path)) {
            throw new RuntimeException("Unable to remove directory: {$path}");
        }

        return;
    }

    if (!unlink($path)) {
        throw new RuntimeException("Unable to remove file: {$path}");
    }
}

function replaceRegexNonPro(string $file, string $pattern, string $replacement, bool $requireMatch = false): void
{

    $contents = file_get_contents($file);
    if ($contents === false) {
        throw new RuntimeException("Unable to read file: {$file}");
    }

    $updated = preg_replace($pattern, $replacement, $contents, 1, $count);
    if ($updated === null) {
        throw new RuntimeException("Regex replacement failed for {$file}");
    }

    if ($requireMatch && $count !== 1) {
        throw new RuntimeException("Expected one regex match in {$file}");
    }

    if (file_put_contents($file, $updated) === false) {
        throw new RuntimeException("Unable to write file: {$file}");
    }
}

$pathsToRemove = array(
    $packageDir . '/assets/partytown',
    $packageDir . '/assets/logged_in_cache_worker.js',
    $packageDir . '/assets/woo_rest_token_injection.js',
    $packageDir . '/assets/nonce_token_injection.js',
    $packageDir . '/assets/woo_null_cached_page_cart.js',
    $packageDir . '/vendor/cweagans',
    $packageDir . '/vendor/bin',
    $packageDir . '/src/Dependencies/simplehtmldom/example',
    $packageDir . '/src/Dependencies/simplehtmldom/manual',
    $packageDir . '/src/Dependencies/simplehtmldom/README.md',
    $packageDir . '/src/Dependencies/simplehtmldom/composer.json',
    $packageDir . '/src/Dependencies/simplehtmldom/CHANGELOG.md',
    $packageDir . '/src/App/CloudflareModule.php',
    $packageDir . '/src/App/Pluggable/check_ajax_referer.php',
    $packageDir . '/src/Speed/Pro.php',
    $packageDir . '/src/Speed/Extension.php',
);

foreach ($pathsToRemove as $path) {
    removePathNonPro($path);
}

$configFile = $packageDir . '/src/App/Config.php';
replaceRegexNonPro(
    $configFile,
    "/\n\t\t\t'cache_logged_in_users' => array\([\s\S]*?\n\t\t\t'cache_mobile_separately' => array\(/",
    "\n\t\t\t'cache_mobile_separately' => array("
);
replaceRegexNonPro(
    $configFile,
    "/\n\t\t\t'replace_woo_nonces' => array\([\s\S]*?\n\t\t\),\s*\n\t\t'speed_css'  => array\(/",
    "\n\t\t),\n\t\t'speed_css'  => array("
);
replaceRegexNonPro(
    $configFile,
    "/\n\t\t\t'include_partytown' => array\([\s\S]*?\n\t\t\t'inclusion_mode' => array\(/",
    "\n\t\t\t'inclusion_mode' => array("
);
replaceRegexNonPro(
    $configFile,
    '/\n\tprotected static function get_initial_config\(\) \{\n\t\t\$config = self::\$initial_config;\n\n\t\tif \( class_exists\( \'\\\\SPRESS\\\\App\\\\CloudflareModule\' \) \) \{\n\t\t\t\$config\[\'speed_cloudflare\'\] = CloudflareModule::get_config_section\(\);\n\t\t\}\n\n\t\treturn \$config;\n\t\}\r?\n/',
    "\n\tprotected static function get_initial_config() {\n\t\treturn self::\$initial_config;\n\t}\n"
);

$restApiFile = $packageDir . '/src/RestApi.php';
replaceRegexNonPro(
    $restApiFile,
    "/\n\s*if \( class_exists\( '\\\\SPRESS\\\\App\\\\CloudflareModule' \) \) \{\n\s*App\\\\CloudflareModule::register_rest_routes\(\);\n\s*\}\n/",
    "\n"
);
replaceRegexNonPro(
    $restApiFile,
    '/\R\s*\/\/ Optional Turnstile verification for public endpoints\R[\s\S]*?\R\s*\/\/Origin\/Referer validation\s*/',
    "\n        //Origin/Referer validation \n"
);

$speedCssFile = $packageDir . '/src/Speed/CSS.php';
replaceRegexNonPro(
    $speedCssFile,
    '/\R\s*\$include_partytown = trim\(Config::get\([^\n]+\)\);\R[\s\S]*?\R\s*\/\/ Purge cache on updating post/',
    "\n        // Purge cache on updating post"
);
replaceRegexNonPro(
    $speedCssFile,
    '/\R\s*\/\/ Only load Turnstile on pages that haven\'t been processed yet\R[\s\S]*?\R\s*\t\twp_localize_script\(/',
    "\n\t\twp_localize_script("
);
replaceRegexNonPro(
    $speedCssFile,
    '/\n\s*\$current_url = Speed::get_url\(\);\n\s*\$lookup_file = self::get_lookup_file\(\$current_url\);\n\s*\$has_lookup = \$lookup_file && file_exists\(\$lookup_file\);\n\s*\$turnstile_data = array\(\n\s*\'turnstile_site_key\' => null,\n\s*\'turnstile_enabled\' => \'false\',\n\s*\);\n\s*if \( class_exists\( \'\\\\SPRESS\\\\App\\\\CloudflareModule\' \) \) \{\n\s*\$turnstile_data = (?:App\\\\CloudflareModule|\\\\SPRESS\\\\App\\\\CloudflareModule)::get_frontend_data\( \$has_lookup \);\n\s*\}\n/',
    "\n"
);
replaceRegexNonPro(
    $speedCssFile,
    '/\n\s*\'turnstile_site_key\' => \$turnstile_data\[\'turnstile_site_key\'\],\n\s*\'turnstile_enabled\' => \$turnstile_data\[\'turnstile_enabled\'\]\n/',
    "\n"
);
replaceRegexNonPro(
    $speedCssFile,
    '/\R\s*public static function public_enqueue_partytown\(\) \{\R[\s\S]*?\R\s*public static function update_config_to_cache\(\$new_config\) \{\R/',
    "\n    public static function update_config_to_cache(\$new_config) {\n"
);
replaceRegexNonPro(
    $speedCssFile,
    '/\n\s*\'#<script\[\^>\]\+id=\[\\\\\'"\]spress-turnstile-js\[\\\\\'"\]\[\^>\]\*>\\\\s\*<\\\\\/script>#i\',\r?\n/',
    "\n"
);
replaceRegexNonPro(
    $speedCssFile,
    '/\n\s*\/\*\*\n\s*\* Enqueues the partytown script if required by the plugin configuration\.[\s\S]*?\* @return void\n\s*\*\/\n(?=\s*public static function update_config_to_cache)/',
    "\n"
);

$speedFile = $packageDir . '/src/Speed.php';
replaceRegexNonPro(
    $speedFile,
    '/\n\s*\/\/Change type for partytown\n\s*\$party_conf = Config::get\(\'speed_css\', \'include_partytown\'\);\n\s*if\(\$party_conf\) \{\n\s*\$script->outertext = str_replace\(\"src\",\"type=\'text\/partytown\' src\",\$script->outertext\);\n\s*\}\s*\n/',
    "\n"
);
replaceRegexNonPro(
    $speedFile,
    '/\n\s*\/\/add classes for logged-in cache load\n\s*if\(Config::get\(\'speed_cache\',\'cache_logged_in_users\'\) === \"true\"\n\s*&& Config::get\(\'speed_cache\',\'cache_logged_in_users_exceptions\'\) != \"\"\n\s*&& Cache::is_url_logged_in_cacheable\(Speed::get_url\(\)\) == true\n\s*\) \{\n\s*\$dom = self::add_logged_in_users_exceptions_code_idents\(\$dom\);\s*\n\s*\}\s*\n/',
    "\n"
);
replaceRegexNonPro(
    $speedFile,
    '/\n\s*\/\/Enable replacement of Woo nonces\n\s*if\(Config::get\(\'speed_cache\', \'replace_woo_nonces\'\) === \'true\'\n\s*\|\| Config::get\(\'speed_cache\', \'replace_ajax_nonces\'\) === \'true\'\n\s*\) \{\n\s*\$dom = self::add_woo_injects\(\$dom\);\n\s*\}\s*\n/',
    "\n"
);
replaceRegexNonPro(
    $speedFile,
    '/\n\s*\/\/add classes for logged-in cache load\n\s*if\(Config::get\(\'speed_cache\',\'cache_logged_in_users\'\) === \"true\"\n\s*&& Config::get\(\'speed_cache\',\'cache_logged_in_users_exceptions\'\) != \"\"\n\s*&& Cache::is_url_cacheable\(Speed::get_url\(\)\)\n\s*&& Cache::is_url_logged_in_cacheable\(Speed::get_url\(\)\) == true\n\s*\) \{\n\s*\$dom = self::add_logged_in_users_exceptions\(\$dom\);\n\s*\}\s*\n\s*\/\/add partytown \(after gtag\) \/\/requires dom refresh\n\s*\$dom = self::add_partytown\(\$dom\);\s*\n/',
    "\n"
);
$speedJsFile = $packageDir . '/src/Speed/JS.php';
replaceRegexNonPro(
    $speedJsFile,
    '/\n\s*\$exclude_scripts_array\[\] = "partytown"; \/\/ Always exclude partytown from delay\n/',
    "\n"
);

$usageCollectorFile = $packageDir . '/assets/usage_collector/usage_collector.js';
replaceRegexNonPro(
    $usageCollectorFile,
    '/\n\s*\/\*\*\n\s*\* Turnstile widget state[\s\S]*?this\.turnstileInFlight = null;\n/',
    "\n"
);
replaceRegexNonPro(
    $usageCollectorFile,
    '/\n\s*let turnstileToken = \'\';\n\s*if \(window\.speed_css_vars\?\.turnstile_enabled === \'true\' && window\.speed_css_vars\?\.turnstile_site_key\) \{\n\s*turnstileToken = await this\.getTurnstileToken\(\);\n\s*\}\n/',
    "\n"
);
replaceRegexNonPro(
    $usageCollectorFile,
    "/turnstile_token: turnstileToken, /",
    ""
);
replaceRegexNonPro(
    $usageCollectorFile,
    "/body: JSON\\.stringify\\(\\{ compressedData: base64CompressedData, turnstile_token: turnstileToken \\}\\), \\/\\/ Wrap in an object if needed/",
    "body: JSON.stringify({ compressedData: base64CompressedData }),"
);
replaceRegexNonPro(
    $usageCollectorFile,
    '/\n\s*async waitForTurnstile\(timeoutMs = 5000\) \{[\s\S]*?^\s*\}\n\s*\n\s*\/\*\*/m',
    "\n\n    /**"
);

$adminBundle = $packageDir . '/assets/admin/admin.min.js';
if (file_exists($adminBundle)) {
    $contents = file_get_contents($adminBundle);
    if ($contents === false) {
        throw new RuntimeException("Unable to read file: {$adminBundle}");
    }

    $replacements = array('Partytown' => 'Worker Proxy', 'Cloudflare Setup' => 'Edge Cache', 'Code Insertion' => 'Snippets', 'include_partytown' => 'worker_proxy_patterns');
    $contents = str_replace(array_keys($replacements), array_values($replacements), $contents);

    if (file_put_contents($adminBundle, $contents) === false) {
        throw new RuntimeException("Unable to write file: {$adminBundle}");
    }
}
