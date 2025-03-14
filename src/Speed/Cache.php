<?php

namespace SPRESS\Speed;

use SPRESS\App\Config;
use SPRESS\Speed;
use Wa72\Url\Url;
use MatthiasMullie\Minify;

/**
 * Class Cache
 *
 * Provides methods to determine if a page should be cached,
 * to write HTML output to a cache file, and to manage the cache directory.
 * 
 * @package SPRESS
 */
class Cache {

    // Configuration properties (set in self::init)
    public static $cache_mode;              // string: either 'enabled' or 'disabled'
    public static $bypass_cookies;          // line separated list of (partial) cookie names
    public static $bypass_urls;             // line separated list of (partial) URLs
    public static $ignore_querystrings;     // line separated list of query string keys
    public static $bypass_useragents;       // line separated list of (partial) user agents
    public static $separate_cookie_cache;   // line separated list of (partial) cookie names
    public static $cache_logged_in_users;   // string: 'true' or 'false'
    public static $cache_mobile_separately; // string: 'true' or 'false'
    public static $cache_lifetime;          // string: 0,2,6,12,24

    /**
     * Initializes the cache settings from configuration.
     * If caching is disabled via the config, further processing is skipped.
     */
    public static function init() {

        // Get the cache configuration settings
        $config = Config::get('speed_cache');

        // Set individual settings from configuration
        foreach ($config as $key => $value) {
            if (isset($value['value'])) {
                self::$$key = $value['value'];
            }
        }

        // Register activation and uninstall hooks for advanced-cache.php.
        // Use SPRESS_FILE_NAME (a constant defined in the plugin's root file) as the main plugin file.
        if (defined('SPRESS_FILE_NAME')) {
            register_activation_hook(SPRESS_FILE_NAME, array(__CLASS__, 'install'));
            register_uninstall_hook(SPRESS_FILE_NAME, array(__CLASS__, 'uninstall'));
        }

        //Register purging hooks
        add_action( 'wp_trash_post',           array(__CLASS__, 'purge_by_post' ));
        add_action( 'delete_post',             array(__CLASS__, 'purge_by_post' ));
        add_action( 'clean_post_cache',        array(__CLASS__, 'purge_by_post' ));
        add_action( 'wp_update_comment_count', array(__CLASS__, 'purge_by_post' ));

    }

    /**
     * Checks the HTML output and saves it into the cache if it qualifies.
     *
     * Performs multiple checks:
     * - Only caches GET requests with a 200 response code.
     * - Skips WordPress admin pages, AJAX calls, and URIs with disallowed file extensions.
     * - Ensures that the HTML contains a proper doctype and closing </html> tag.
     * - Skips amp endpoints and password-protected posts.
     * - Verifies that no bypass cookie, URL or user agent rule applies.
     * - If the user is logged in and caching for logged in users isn't enabled, no cache is saved.
     *
     * Saves BOTH an uncompressed version (index.html) and, if supported, a gzipped version (index.html.gz).
     *
     * @param string $html The complete HTML output of the page.
     * @return string Returns the original HTML (even if caching was skipped).
     */
    public static function do_cache($html) {

        //Get original URL
        $url = Speed::get_url();

        //Get modified URI
        $modified_url = Speed::get_url(false);

        // Only cache if caching mode is enabled
        if (self::$cache_mode !== 'enabled') {
            return $html;
        }

        // Only cache GET requests
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            return $html;
        }

        // Check that the HTTP response code is 200.
        if (function_exists('http_response_code')) {
            $response_code = http_response_code();
            if ($response_code !== 200) {
                return $html;
            }
        }

        // Skip AJAX requests.
        if (defined('DOING_AJAX') && DOING_AJAX) {
            return $html;
        }

        // Skip admin pages (if is_admin() is available).
        if (function_exists('is_admin') && is_admin()) {
            return $html;
        }

        // Skip if the URL has disallowed extensions (e.g. .txt, .xml, or .php).
        $disallowed_extensions = ['.txt', '.xml', '.php'];
        foreach ($disallowed_extensions as $ext) {
            if (substr($url, -strlen($ext)) === $ext) {
                return $html;
            }
        }

        // Validate that the HTML contains a doctype and closing </html> tag.
        if (!preg_match('/<!DOCTYPE\s+html/i', $html) || !preg_match('/<\/html\s*>/i', $html)) {
            return $html;
        }

        // Do not cache amp endpoints (either via URL path or query parameter).
        if (stripos($url, '/amp') !== false || isset($_GET['amp'])) {
            return $html;
        }

        // --- New Check: Do not cache REST API endpoints ---
        if (stripos($url, '/wp-json') !== false) {
            return $html;
        }

        // Skip password-protected posts.
        if (function_exists('post_password_required') && post_password_required()) {
            return $html;
        }

        // Check bypass rules (cookies, URLs, user agents).
        if (!self::is_url_cacheable($url)) {
            return $html;
        }

        // If the user is logged in but caching for logged-in users is not enabled, skip caching.
        if (function_exists('is_user_logged_in') && is_user_logged_in() && self::$cache_logged_in_users !== 'true') {
            return $html;
        }

        // Determine the base file path for caching 
        // Based on the origingal SERVER_URI before anything may
        // have changed it
        $cache_file = self::get_cache_filepath($url);


        // If the original and modified URL differ, save in a lookup
        if ($url != $modified_url) {
            $lookup_file = Speed::get_root_cache_path() . "/lookup_uris.json";
            
            // Initialize current lookup as an array.
            $current_lookup = [];
            
            if (file_exists($lookup_file)) {
                $contents = @file_get_contents($lookup_file);
                if ($contents !== false) {
                    $decoded = json_decode($contents, true);
                    if (is_array($decoded)) {
                        $current_lookup = $decoded;
                    }
                }
            }
            
            // Ensure the key for the modified URL is an array.
            if (!isset($current_lookup[$modified_url]) || !is_array($current_lookup[$modified_url])) {
                $current_lookup[$modified_url] = [];
            }
            
            // Save the original URL under the modified URL key.
            $current_lookup[$modified_url][$url] = true;
            
            // Write back the lookup data.
            file_put_contents($lookup_file, json_encode($current_lookup));
            
        }

        //Save to cache
        $html = self::save_cache($cache_file,$html);

        return $html;
    }

    public static function save_cache($cache_file,$html,$msg='') {

        $end_time = microtime(true);
        $elapsed_time = isset(Speed::$start_time) ? $end_time - Speed::$start_time : 0;

        $formatted_time = date('D, d M Y H:i:s');
        if($msg) {
            $html .= "<!-- " . $msg . " -->";        
        } else {
            $html .= "<!-- Cached by SpeedifyPress at " . $formatted_time . " in " . number_format($elapsed_time,2) . " -->";        
        }
    
        // Ensure the cache directory exists.
        $dir = dirname($cache_file);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        //if .gz get base
        if(strstr($cache_file,'.gz')) {
            $cache_file = substr($cache_file,0,-3);
        }

        // Save the uncompressed version.
        file_put_contents($cache_file, $html);

        // If gzip is accepted, save a gzipped version separately as "index.html.gz"
        if (self::gzip_accepted()) {
            $gz_file = $cache_file . '.gz';
            file_put_contents($gz_file, gzencode($html));
        }

        return $html;

    }

    /**
     * Checks if the client accepts gzip encoding, taking into account PHP's zlib output compression.
     *
     * If zlib.output_compression is enabled, PHP is already handling compression,
     * so this method returns false to avoid double-compression.
     *
     * @return bool True if gzip is accepted and zlib compression is off, false otherwise.
     */
    public static function gzip_accepted() {
        // Use filter_var to correctly interpret values like "Off", "On", "1", etc.
        $zlib_enabled = filter_var(ini_get('zlib.output_compression'), FILTER_VALIDATE_BOOLEAN);
        if ($zlib_enabled) {
            return false;
        }
        return !empty($_SERVER['HTTP_ACCEPT_ENCODING']) && strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') !== false;
    }

    /**
     * Determines whether the current url is cacheable.
     *
     * Evaluates the following:
     * - If any cookie in the request matches (even partially) one of the strings
     *   specified in self::$bypass_cookies.
     * - If the current url contains any of the bypass URL strings.
     * - If the HTTP user agent matches any bypass user agent strings.
     *
     * @return bool Returns false if any bypass condition is met; otherwise, true.
     */
    public static function is_url_cacheable($url) {

        // Check if any cookie matches the bypass rules.
        if (!empty(self::$bypass_cookies) && !empty($_COOKIE)) {
            $bypass_cookies = array_filter(array_map('trim', explode("\n", self::$bypass_cookies)));
            foreach ($bypass_cookies as $cookie_bypass) {
                foreach ((array)$_COOKIE as $cookie_name => $cookie_value) {
                    if (stripos($cookie_name, $cookie_bypass) !== false) {
                        return false;
                    }
                }
            }
        }

        // Check if the URI contains any bypass URL strings.
        if (!empty(self::$bypass_urls)) {
            $bypass_urls = array_filter(array_map('trim', explode("\n", self::$bypass_urls)));
            foreach ($bypass_urls as $bypass_url) {
                if (stripos($url, $bypass_url) !== false) {
                    return false;
                }
            }
        }

        // Check if the HTTP user agent matches any bypass rules.
        if (!empty(self::$bypass_useragents) && isset($_SERVER['HTTP_USER_AGENT'])) {
            $bypass_useragents = array_filter(array_map('trim', explode("\n", self::$bypass_useragents)));
            foreach ($bypass_useragents as $bypass_ua) {
                if (stripos($_SERVER['HTTP_USER_AGENT'], $bypass_ua) !== false) {
                    return false;
                }
            }
        }

        return true;
    }



    /**
     * Retrieves the complete path to the cache file for the current URL.
     *
     * Determines the file name (starting with "index") and appends suffixes based on:
     * - Append cookie-based suffixes if any cookie name matches the substrings in self::$separate_cookie_cache.
     * - If caching for logged-in users is enabled and the user is logged in,
     *   compute the user’s role and set a cookie "speedify_press_logged_in_roles".
     * - Append a hash of remaining query strings (if any remain).
     * - Append a mobile suffix if separate mobile caching is enabled.
     * - End with ".html" (the base file name always ends with ".html"; the gzipped version is saved separately).
     *
     * @return string The full file path where the uncompressed cached HTML should be saved.
     */
    public static function get_cache_filepath($url,$extension="gz",$separate_cookie_cache=null, $cache_logged_in_users=null, $cache_mobile_separately=null) {

        if(!$separate_cookie_cache) {
            $separate_cookie_cache = self::$separate_cookie_cache;
        }

        if(!$cache_logged_in_users) {
            $cache_logged_in_users = self::$cache_logged_in_users;
        }

        if(!$cache_mobile_separately) {
            $cache_mobile_separately = self::$cache_mobile_separately;
        }

        $cache_dir  = Speed::get_cache_dir_from_url($url);
        $filename   = self::get_cache_filename($extension,$separate_cookie_cache, $cache_logged_in_users, $cache_mobile_separately);
        return $cache_dir .  $filename;        

    }

    /**
     * Builds the cache filename based on the current request variables.
     *
     * This method appends cookie-based suffixes, user role (if enabled),
     * a hash of remaining query strings, and a mobile suffix. Finally,
     * it appends the base extension ".html" and conditionally ".gz" if gzip is accepted.
     *
     * @return string The computed cache filename.
     */
    public static function get_cache_filename($extension, $separate_cookie_cache, $cache_logged_in_users, $cache_mobile_separately) {
        // Start with a base filename.
        $filename = 'index';

        // Append cookie-based suffix if any cookie matches configured substrings.
        if (!empty($separate_cookie_cache)) {
            $patterns = array_filter(array_map('trim', explode("\n", $separate_cookie_cache)));
            $matched = [];
            foreach ($_COOKIE as $name => $value) {
                foreach ($patterns as $partial) {
                    if (stripos($name, $partial) !== false) {
                        $matched[] = preg_replace('/[^A-Za-z0-9_\-]/', '', $name);
                        break;
                    }
                }
            }
            if (!empty($matched)) {
                $filename .= '-' . implode('-', $matched);
            }
        }

        // Append logged-in user role if caching for logged-in users is enabled.
        if ($cache_logged_in_users === 'true' && function_exists('is_user_logged_in') && is_user_logged_in()) {
            // Get the user role using wp_get_current_user.
            $user = wp_get_current_user();
            if ($user && !empty($user->roles)) {
                $role = implode('-', $user->roles);
                $safe_role = preg_replace('/[^A-Za-z0-9_\-]/', '', $role);
                // Set a cookie for advanced-cache naming.
                setcookie('speedify_press_logged_in_roles', $safe_role, time() + 3600, COOKIEPATH, COOKIE_DOMAIN);
                $_COOKIE['speedify_press_logged_in_roles'] = $safe_role; //immediately add to global COOKIE
            }
        }        

        // Append logged-in user role if enabled and available.
        if ($cache_logged_in_users === 'true' && isset($_COOKIE['speedify_press_logged_in_roles'])) {
            $filename .= '-' . preg_replace('/[^A-Za-z0-9_\-]/', '', $_COOKIE['speedify_press_logged_in_roles']);
        }

        // Append mobile suffix if separate mobile caching is enabled.
        if (!empty($cache_mobile_separately) && $cache_mobile_separately === 'true') {
            if (isset($_SERVER['HTTP_USER_AGENT']) &&
                preg_match('/Mobile|Android|Silk\/|Kindle|BlackBerry|Opera (Mini|Mobi)/', $_SERVER['HTTP_USER_AGENT'])) {
                $filename .= '-mobile';
            }
        }

        // Append the base file extension.
        $filename .= '.html';

        // Check if gzip is accepted (and if zlib.output_compression is off).
        $zlib_enabled = filter_var(ini_get('zlib.output_compression'), FILTER_VALIDATE_BOOLEAN);
        if (!$zlib_enabled && isset($_SERVER['HTTP_ACCEPT_ENCODING']) &&
            strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') !== false
            && $extension == "gz"
            ) {
            $filename .= '.gz';
        }

        return $filename;
    }    



    /**
     * Scans the cache directory and returns statistics about the cached files.
     *
     * The statistics include:
     * - Total number of cached files.
     * - The average age of the cached files (in seconds).
     * - The age newest cached file
     * - The age of oldest cached file
     *
     * @return array Associative array with keys: count, average_age, newest, oldest.
     */
    public static function get_cache_data() {
        
        $cache_dir = Speed::get_root_cache_path();
        $unique_files = [];
    
        $rii = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($cache_dir));
        foreach ($rii as $file) {
            if (!$file->isDir() && preg_match('/\.(html|html\.gz)$/', $file->getFilename())) {
                $full_path = $file->getPathname();
                // Normalize: if file ends with .gz, use the base filename without .gz.
                $base = (substr($full_path, -3) === '.gz') ? substr($full_path, 0, -3) : $full_path;
                if (isset($unique_files[$base])) {
                    // Prefer the uncompressed version if available.
                    if (substr($unique_files[$base], -3) === '.gz' && substr($full_path, -3) !== '.gz') {
                        $unique_files[$base] = $full_path;
                    }
                } else {
                    $unique_files[$base] = $full_path;
                }
            }
        }
    
        $count = count($unique_files);
        if ($count === 0) {
            return [
                'count'       => 0,
                'average_age' => '0h 0m',
                'newest'      => '0h 0m',
                'oldest'      => '0h 0m',
            ];
        }
    
        $total_age_seconds = 0;
        $first = true;
        foreach ($unique_files as $base => $file_path) {
            $mtime = filemtime($file_path);
            $total_age_seconds += (time() - $mtime);
            if ($first) {
                $newest_time = $mtime;
                $oldest_time = $mtime;
                $first = false;
            } else {
                if ($mtime > $newest_time) {
                    $newest_time = $mtime;
                }
                if ($mtime < $oldest_time) {
                    $oldest_time = $mtime;
                }
            }
        }
    
        // Helper function to format seconds into hours and minutes.
        $format_age = function($seconds) {
            $hours = floor($seconds / 3600);
            $minutes = floor(($seconds % 3600) / 60);
            return $hours . 'h ' . $minutes . 'm';
        };
    
        $average_age_seconds = $total_age_seconds / $count;
        $newest_age_seconds  = time() - $newest_time;
        $oldest_age_seconds  = time() - $oldest_time;
    
        return [
            'count'       => $count,
            'average_age' => $format_age($average_age_seconds),
            'newest'      => $format_age($newest_age_seconds),
            'oldest'      => $format_age($oldest_age_seconds),
        ];
    }
    

    /**
     * Purges cache files related to a specific post.
     *
     * This method purges:
     * - The cache for the post's permalink.
     * - If the post type is "post", it also purges the homepage, category, and tag archives.
     *
     * @param int $post_id The ID of the post.
     */
    public static function purge_by_post($post_id, $post = null) {

        //Check not already purged
        if(isset(Speed::$done_purge[$post_id])) {
            return;
        }

        // Purge cache for the individual post.
        $permalink = get_permalink($post_id);
        Speed::purge_cache($permalink);

        // If this is a post, also purge pages that list posts.
        if (get_post_type($post_id) === 'post') {

            // Purge homepage.
            Speed::purge_cache(home_url('/'));

            // Purge category archives.
            $categories = get_the_category($post_id);
            if ($categories && !is_wp_error($categories)) {
                foreach ($categories as $cat) {
                    Speed::purge_cache(get_category_link($cat->term_id));
                }
            }

            // Purge tag archives.
            $tags = get_the_tags($post_id);
            if ($tags && !is_wp_error($tags)) {
                foreach ($tags as $tag) {
                    Speed::purge_cache(get_tag_link($tag->term_id));
                }
            }
        }

        //Save as purged
        Speed::$done_purge[$post_id] = true;

    }    
    

    /**
     * Clears the cache by deleting all cached files (HTML and gzipped versions)
     * within the root cache directory.
     *
     * If the FLYING_PRESS_CACHE_DIR constant is defined, this method
     * will also delete all files and subfolders in that directory.
     *
     * @return void
     */
    public static function clear_cache() {

        if (Speed::$hostname) {
            $dir = Speed::get_root_cache_path();
            // Speed::deleteSpecificFiles is assumed to recursively remove files matching the extensions.
            Speed::deleteSpecificFiles($dir, array("html", "gz"));
        }
    }

    /**
     * Updates wp-config.php to ensure WP_CACHE is defined.
     *
     * Searches for wp-config.php in common locations and, if the WP_CACHE constant is not defined,
     * inserts a line to define it as true along with a unique marker.
     *
     * @return bool True if WP_CACHE is defined or successfully updated; false on failure.
     */
    public static function update_wp_config_cache_constant() {
        // Try common locations: ABSPATH/wp-config.php and dirname(ABSPATH).'/wp-config.php'
        $paths = [
            rtrim(ABSPATH, '/') . '/wp-config.php',
            dirname(ABSPATH) . '/wp-config.php'
        ];
        $wp_config_path = null;
        foreach ($paths as $path) {
            if (file_exists($path)) {
                $wp_config_path = $path;
                break;
            }
        }
        if (!$wp_config_path) {
            return false; // wp-config.php not found
        }
        $config_contents = file_get_contents($wp_config_path);
        if (strpos($config_contents, "define('WP_CACHE'") !== false || strpos($config_contents, 'define("WP_CACHE"') !== false) {
            return true; // Already defined
        }
        // Insert our marker and definition after the opening <?php tag.
        $wp_cache_definition = "/* SPEEDIFYPRESS WP_CACHE marker */\ndefine('WP_CACHE', true);" . PHP_EOL;
        $updated_contents = preg_replace('/^(<\?php\s*)/', "$1" . $wp_cache_definition, $config_contents, 1);
        return file_put_contents($wp_config_path, $updated_contents) !== false;
    }

    /**
     * Removes our WP_CACHE definition from wp-config.php.
     *
     * Searches for our unique marker and removes the WP_CACHE definition line if present.
     *
     * @return bool True if successfully removed or not found; false on failure.
     */
    public static function remove_wp_config_cache_constant() {
        $paths = [
            rtrim(ABSPATH, '/') . '/wp-config.php',
            dirname(ABSPATH) . '/wp-config.php'
        ];
        $wp_config_path = null;
        foreach ($paths as $path) {
            if (file_exists($path)) {
                $wp_config_path = $path;
                break;
            }
        }
        if (!$wp_config_path) {
            return false;
        }
        $contents = file_get_contents($wp_config_path);
        // Remove our marker and WP_CACHE definition.
        $updated = preg_replace('/\/\* SPEEDIFYPRESS WP_CACHE marker \*\/\s*define\([\'"]WP_CACHE[\'"],\s*true\);\s*/', '', $contents);
        return file_put_contents($wp_config_path, $updated) !== false;
    }

    /**
     * Writes the advanced-cache.php file into the wp-content directory.
     *
     * This method reads a shell template file (stored in the plugin's /assets/ folder),
     * replaces placeholders with configuration values, updates wp-config.php to define WP_CACHE,
     * and writes the result to WP_CONTENT_DIR . '/advanced-cache.php'. The advanced-cache.php file is used by
     * WordPress to serve cached pages early in the load process.
     *
     * @return bool|int Returns the number of bytes written, or false on failure.
     */
    public static function write_advanced_cache() {
        // Update wp-config.php to ensure WP_CACHE is defined.
        self::update_wp_config_cache_constant();

        // Path to the advanced-cache.php template in the plugin's assets folder.
        $template_path = SPRESS_PLUGIN_DIR . 'assets/advanced-cache.php';
        if (!file_exists($template_path)) {
            return false;
        }
        $template = file_get_contents($template_path);

        // Prepare configuration replacements.
        $replacements = array(
            '%%SPRESS_CACHE_ROOT%%'              => Speed::get_root_cache_path(),
            '%%SPRESS_SEPARATE_COOKIE_CACHE%%'   => self::$separate_cookie_cache,
            '%%SPRESS_CACHE_LOGGED_IN_USERS%%'   => self::$cache_logged_in_users,
            '%%SPRESS_CACHE_MOBILE_SEPARATELY%%' => self::$cache_mobile_separately,
            '%%SPRESS_IGNORE_QUERYSTRINGS%%'     => self::$ignore_querystrings,
            '%%SPRESS_CACHE_LIFETIME%%'          => self::$cache_lifetime,
            '%%SPRESS_DIR_NAME%%'                => SPRESS_DIR_NAME
        );

        // Replace placeholders in the template with actual configuration values.
        $advanced_cache_code = str_replace(array_keys($replacements), array_values($replacements), $template);

        // Write the resulting code into advanced-cache.php in the wp-content directory.
        $advanced_cache_path = WP_CONTENT_DIR . '/advanced-cache.php';
        return file_put_contents($advanced_cache_path, $advanced_cache_code);
    }

    /**
     * Installs the caching system.
     *
     * This method should be called on plugin activation.
     * It writes the advanced-cache.php file and updates wp-config.php to define WP_CACHE.
     *
     * @return bool True if installation steps succeed.
     */
    public static function install() {
        self::init();
        $written = self::write_advanced_cache();
        return $written !== false;
    }

    /**
     * Uninstalls the caching system.
     *
     * This method should be called on plugin uninstall.
     * It removes the advanced-cache.php file and removes our WP_CACHE definition from wp-config.php.
     *
     * @return bool True if uninstallation steps succeed.
     */
    public static function uninstall() {
        // Remove advanced-cache.php from wp-content.
        $advanced_cache_path = WP_CONTENT_DIR . '/advanced-cache.php';
        if (file_exists($advanced_cache_path)) {
            unlink($advanced_cache_path);
        }
        // Remove our WP_CACHE definition from wp-config.php.
        return self::remove_wp_config_cache_constant();
    }

}
