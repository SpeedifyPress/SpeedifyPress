<?php

namespace SPRESS\Speed;

use SPRESS\App\Config;
use SPRESS\Speed;
use SPRESS\Dependencies\Wa72\Url\Url;
use SPRESS\Dependencies\MatthiasMullie\Minify;

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
    public static $cache_mode;                           // string: either 'enabled' or 'disabled'
    public static $page_preload_mode;                    // string: 'hover', 'intelligent' or 'disabled'
    public static $bypass_cookies;                       // line separated list of (partial) cookie names
    public static $bypass_urls;                          // line separated list of (partial) URLs
    public static $ignore_querystrings;                  // line separated list of query string keys
    public static $bypass_useragents;                    // line separated list of (partial) user agents
    public static $separate_cookie_cache;                // line separated list of (partial) cookie names
    public static $cache_logged_in_users;                // string: 'true' or 'false'
    public static $cache_logged_in_users_exceptions;     //line separated list of css selectors
    public static $cache_logged_in_users_exclusively_on; //line separated list of URLs
    public static $cache_mobile_separately;              // string: 'true' or 'false'
    public static $cache_path_uploads;                   // string: 'true' or 'false'
    public static $force_gzipped_output;                 // string: 'true' or 'false'    
    public static $csrf_expiry_seconds;                  // int
    public static $cache_lifetime;                       // string: 0,2,6,12,24
    public static $plugin_mode;                          // string: 'enabled', 'disabled', 'partial'
    public static $disable_urls;                         // line separated list of (partial) URLs
    public static $preload_fonts_desktop_only;           //string: 'true' or 'false'
    public static $multisite_identifier;                 //string: blogid or empty
    public static $replace_woo_nonces;                   //string: 'true' or 'false'

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
        self::$plugin_mode = Config::get('plugin','plugin_mode');
        self::$disable_urls = Config::get('plugin','disable_urls');
        self::$preload_fonts_desktop_only = Config::get('speed_code','preload_fonts_desktop_only');
        self::$cache_logged_in_users_exclusively_on = Config::get('speed_cache','cache_logged_in_users_exclusively_on');
        self::$csrf_expiry_seconds = Config::get('speed_css','csrf_expiry_seconds');
        self::$multisite_identifier = wp_json_encode( Speed::get_multisite_definition() );        

        //Ensure the "CF-SPU-Browser" querystring is always in the $ignore_querystrings var, as we use it to ensure our Cloudflare
        //HEAD checks are never cached
        if (strpos(self::$ignore_querystrings, 'CF-SPU-Browser') === false) {
            self::$ignore_querystrings .= "\nCF-SPU-Browser";
        }        

        // Append logged-in user role if caching for logged-in users is enabled.
        add_action("init",function() {
            if (self::$cache_logged_in_users === 'true' && function_exists('is_user_logged_in') && is_user_logged_in() && Speed::is_frontend() === true) {
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
        });

        //On logout remove the logged_in_roles cookie
        add_action('wp_logout', function () {
            if (isset($_COOKIE['speedify_press_logged_in_roles'])) {
                unset($_COOKIE['speedify_press_logged_in_roles']);
                setcookie('speedify_press_logged_in_roles', '', time() - 3600, COOKIEPATH, COOKIE_DOMAIN);
            }
        });

        // Register activation and deactivation hooks for advanced-cache.php.
        // Use SPRESS_FILE_NAME (a constant defined in the plugin's root file) as the main plugin file.
        if (defined('SPRESS_FILE_NAME')) {
            register_activation_hook(SPRESS_FILE_NAME, array(__CLASS__, 'install'));
            register_deactivation_hook(SPRESS_FILE_NAME, array(__CLASS__, 'uninstall'));
            add_action('upgrader_process_complete', array(__CLASS__, 'install'), 10, 2);
        }

        //Register purging hooks
        add_action( 'wp_trash_post',           array(__CLASS__, 'purge_by_post' ));
        add_action( 'delete_post',             array(__CLASS__, 'purge_by_post' ));
        add_action( 'clean_post_cache',        array(__CLASS__, 'purge_by_post' ));
        add_action( 'wp_update_comment_count', array(__CLASS__, 'purge_by_post' ));

        //Register purge hook, more careful with this one
        add_action( 'post_updated',            array( __CLASS__, 'purge_if_core_fields_changed' ), 10, 3 );

        //Turn off Woo nonces
        if(self::$replace_woo_nonces === 'true') {
            
            //Disable Woo nonces
            add_filter('woocommerce_store_api_disable_nonce_check', '__return_true');

            //Add our own to REST dispatch
            add_filter('rest_pre_dispatch', array(__CLASS__, 'custom_rest_pre_dispatch'), 10, 3);

            //Prevent createPreloadingMiddleware from storing carts
            add_action( 'wp_print_footer_scripts', function () {

                if ( ! Speed::is_frontend() ) {
                    return;
                }

                $scripts = wp_scripts();
                if ( ! $scripts ) return;

                $handle = 'wc-settings';
                $reg    = $scripts->registered[ $handle ] ?? null;
                if ( ! $reg ) return;

                $before = $reg->extra['before'] ?? [];
                if ( empty( $before ) ) return;

                // Merge to a single blob, strip the preloading middleware, put it back.
                $inline = preg_replace(
                    '#;?\s*wp\.apiFetch\.use\s*\(.*?createPreloadingMiddleware.*?\)\s*;\s*#s',
                    '',
                    implode( " ", $before )
                );

                // Only write back if we actually changed something.
                if ( $inline !== implode( " ", $before ) ) {
                    $reg->extra['before']         = [ $inline ];
                    $scripts->registered[$handle] = $reg;
                }                
                
            }, 2 );              

        }

    }

    /**
     * Custom REST pre dispatch hook.
     *
     * Prevents all non-GET requests to the Store API from being processed,
     * unless they have a valid CSRF token in the X-SPDY-CSRF header.
     *
     * This hook is used to prevent CSRF attacks on the Store API.
     *
     * @param WP_REST_Response $result The response to be processed.
     * @param WP_REST_Server $server The REST server object.
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response to be processed, or an error if the request is invalid.
     */
    public static function custom_rest_pre_dispatch($result, \WP_REST_Server $server, \WP_REST_Request $request) {

        $route = $request->get_route();                 // e.g. /wc/store/v1/cart/add-item
        $method = $request->get_method();               // POST/PUT/PATCH/DELETE/GET
        if (strpos($route, '/wc/store/') !== 0) {
            return $result; // not the Store API
        }
        if (in_array($method, ['GET','HEAD','OPTIONS'], true)) {
            return $result; // read-only
        }

        // Basic Origin/Referer check (keeps CSRF robust even if token leaks)
        $host = (is_ssl() ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $referer = $_SERVER['HTTP_REFERER'] ?? '';
        if ($origin && stripos($origin, $host) !== 0) {
            return new \WP_Error('spdy_csrf_origin', 'Invalid origin', ['status' => 403]);
        }
        if (!$origin && $referer && stripos($referer, $host) !== 0) {
            return new \WP_Error('spdy_csrf_referer', 'Invalid referer', ['status' => 403]);
        }

        // Get token from our header
        $token = $_SERVER['HTTP_X_SPDY_CSRF'] ?? '';
        if ($token === '') {
            return new \WP_Error('spdy_csrf_missing', 'CSRF token missing', ['status' => 403]);
        }

        // Verify token against current request/session
        $decoded = Speed::decode_csrf_token( $token, 'long' );        
        if ( !empty($decoded['fail_message'])) {
            return new \WP_Error(
                'invalid_request',
                'Invalid CSRF token or missing URL. ' . $decoded['fail_message'],
                [ 'status' => 403 ]
            );
        }            
        

        return $result;

    }

    /**
     * Returns a unique identifier for the current user session.
     * This is used for caching pages when the user is logged in.
     * The identifier is based on the user's login token, Woo session ID, or
     * a fallback value if none of the above are available.
     * @return string the unique identifier for the current user session.
     */
    public static function spdy_rest_session_identifier(): string {

        // 1) Logged-in cookie: wordpress_logged_in_* = login|exp|token|hmac → use token
        foreach ($_COOKIE as $k => $v) {
            if (strpos($k, 'wordpress_logged_in_') === 0) {
                $parts = explode('|', rawurldecode($v), 4);
                if (!empty($parts[2])) {
                    return hash('sha256', 'wp:' . $parts[2]);
                    //return 'wp:' . $parts[2];
                }
            }
        }

        // 2) Woo guest session cookie: wp_woocommerce_session_<COOKIEHASH> = "<sid>||<exp>"
        foreach ($_COOKIE as $k => $v) {
            if (strpos($k, 'wp_woocommerce_session_') === 0) {
                $sid = explode('||', rawurldecode($v))[0] ?? '';
                if ($sid !== '') {
                    return hash('sha256', 'wc:' . $sid);   
                    //return 'wc2:' . $sid;   
                }
            }
        }

        // 3) Our guest cookie
        if (empty($_COOKIE['spdy_guest'])) {
            //Cookies must have been deleted, regen
            self::generate_guest_cookie();            
        }
        
        return hash('sha256', 'sg:'.$_COOKIE['spdy_guest']);


    }


    /**
     * Generates a guest cookie if none exists.
     *
     * This function sets a cookie named 'spdy_guest' with a random 32-byte value.
     * The cookie is set to expire after 24 hours and is marked as secure
     * (HTTPS only) and httponly (JS doesn't need to read it).
     *
     * If the cookie already exists, it will not be regenerated.
     *
     * @return void
     */
    public static function generate_guest_cookie() {
        
        $val = bin2hex(random_bytes(32));
        // make it visible to this request too
        $_COOKIE['spdy_guest'] = $val;

        $https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie('spdy_guest', $val, [
            'expires'  => time() + 24*60*60,
            'path'     => '/',
            'secure'   => $https,
            'httponly' => true,        // JS doesn’t need to read it
            'samesite' => 'Lax',
        ]);

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
            return $html . "\n<!-- Cache skipped DISABLED-->";
        }

        // Various tests and checks 
        if (self::meets_html_requirements($html) === false) {
            return $html . "\n<!-- Cache skipped NOT HTML-->";
        }

        // Check bypass rules (cookies, URLs, user agents).
        if (!self::is_url_cacheable($url)) {
            global $bypass_reason;
            return $html . "\n<!-- Cache skipped BYPASS $bypass_reason -->";;
        }

        // If the user is logged in but caching for logged-in users is not enabled, skip caching.
        if (function_exists('is_user_logged_in') && is_user_logged_in() && 
        (self::$cache_logged_in_users !== 'true' || Cache::is_url_logged_in_cacheable(Speed::get_url()) == false)
        ) {
            return $html . "\n<!-- Cache skipped LOGGED IN -->";
        }

        // Determine the base file path for caching 
        // Based on the origingal SERVER_URI before anything may
        // have changed it
        $cache_file = self::get_cache_filepath($url);


        // If the original and modified URL differ, save in a lookup
        // so we can purge both when required
        if ($url != $modified_url) {
            $lookup_file = Speed::get_root_cache_path() . '/'. Cache::get_cached_uris_filename();
            
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
            $json = wp_json_encode( $current_lookup );
            if ( json_last_error() === JSON_ERROR_NONE ) {
                file_put_contents($lookup_file, $json, LOCK_EX);
            }            
            
        }

        //Save to cache
        $html = self::save_cache($cache_file,$html);
        
        //$url has now been cached, update links index
        self::write_cached_uri($url);

        return $html;

    }

    /**
     * Writes a cached URL to the cache index
     *
     * @param string $url The URL that has been cached.
     * @return void
     */
    public static function write_cached_uri($url) {

        //Write URIs not URLs
        $uri = Speed::get_sanitized_uri($url);

        $lookup_file = Speed::get_root_cache_path() . '/'. Cache::get_cached_uris_filename();
        
        // Initialize current lookup as an array.
        $current_lookup = [];
        
        //Decode
        if (file_exists($lookup_file)) {
            $contents = @file_get_contents($lookup_file);
            if ($contents !== false) {
                $decoded = json_decode($contents, true);
                if (is_array($decoded)) {
                    $current_lookup = $decoded;
                }
            }
        }
        
        // Save the original URL under the modified URL key.
        $current_lookup[$uri] = 1;

        //Sort by length of the keys and cap at max 30
        uksort($current_lookup, function($a, $b) {
            return strlen($a) - strlen($b);
        });
        $current_lookup = array_slice($current_lookup, 0, 30);
        
        // Write back the lookup data.
        $json = wp_json_encode( $current_lookup );
        if ( json_last_error() === JSON_ERROR_NONE ) {
            file_put_contents($lookup_file, $json, LOCK_EX);
        }   


    }

    /**
     * Remove a cached URI from the lookup table.
     *
     * @param string $url The URL to remove from the lookup table.
     *
     * @return void
     */
    public static function remove_cached_uri($url) {
        
        //Write URIs not URLs
        $uri = Speed::get_sanitized_uri($url);

        //Set lookup directory
        $lookup_dir = Speed::get_root_cache_url();

        //Get all files that end with "cached_uris.json"
        $files = glob($lookup_dir . '/*cached_uris.json');
        
        //Run through the files
        foreach ($files as $file) {
            
            $lookup_file = $file;
            
            //Decode
            if (file_exists($lookup_file)) {
                $contents = @file_get_contents($lookup_file);
                if ($contents !== false) {
                    $decoded = json_decode($contents, true);
                    if (is_array($decoded)) {
                        $current_lookup = $decoded;
                    }
                }
            }
            
            // Save the original URL under the modified URL key.
            unset($current_lookup[$uri]);
            
            // Write back the lookup data.
            $json = wp_json_encode( $current_lookup );
            if ( json_last_error() === JSON_ERROR_NONE ) {
                file_put_contents($lookup_file, $json, LOCK_EX);
            }   

        }


    }

    public static function meets_html_requirements($html) {

        // Validate that the HTML contains a doctype and closing </html> tag.
        if (!preg_match('/<!DOCTYPE\s+html/i', $html) || !preg_match('/<\/html\s*>/i', $html)) {
            return false;
        }

        return true;


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

        global $bypass_reason;

        //Get URL path from $url
        $path = parse_url($url, PHP_URL_PATH);

        // Check if any cookie matches the bypass rules.
        if (!empty(self::$bypass_cookies) && !empty($_COOKIE)) {
            $bypass_cookies = array_filter(array_map('trim', explode("\n", self::$bypass_cookies)));
            foreach ($bypass_cookies as $cookie_bypass) {
                foreach ((array)$_COOKIE as $cookie_name => $cookie_value) {
                    if (stripos($cookie_name, $cookie_bypass) !== false) {
                        $bypass_reason = 'Cookie: ' . $cookie_name;
                        return false;
                    }
                }
            }
        }

        // Check if the URI contains any bypass URL strings.
        if (!empty(self::$bypass_urls)) {
            $bypass_urls = array_filter(array_map('trim', explode("\n", self::$bypass_urls)));
            foreach ($bypass_urls as $bypass_url) {

                if($bypass_url === "/") {
                    if($path === "/") {
                        $bypass_reason = 'Bypass URL: ' . $bypass_url;
                        return false;        
                    }                    
                } else {
                    if (stripos($url, $bypass_url) !== false) {
                        $bypass_reason = 'Bypass URL: ' . $bypass_url;
                        return false;
                    }                    
                }   
            }
        }

        // Check if the HTTP user agent matches any bypass rules.
        if (!empty(self::$bypass_useragents) && isset($_SERVER['HTTP_USER_AGENT'])) {
            $bypass_useragents = array_filter(array_map('trim', explode("\n", self::$bypass_useragents)));
            foreach ($bypass_useragents as $bypass_ua) {
                if (stripos($_SERVER['HTTP_USER_AGENT'], $bypass_ua) !== false) {
                    $bypass_reason = 'Bypass User Agent: ' . $_SERVER['HTTP_USER_AGENT'];
                    return false;
                }
            }
        }

        // Skip if the URL has disallowed extensions (e.g. .txt, .xml, or .php).
        $disallowed_extensions = ['.txt', '.xml', '.php'];
        foreach ($disallowed_extensions as $ext) {
            if (substr($url, -strlen($ext)) === $ext) {
                $bypass_reason = "Disallowed extension";
                return false;
            }
        }        

        //Check if we have the nocache querystring
        if (stripos($url, 'nocache') !== false) {
            $bypass_reason = 'Nocache querystring';
            return false;
        }

        //Don't cache AJAX request
        if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            $bypass_reason = 'AJAX request';
            return false;
        }        

        // Skip AJAX requests.
        if (defined('DOING_AJAX') && DOING_AJAX) {
            $bypass_reason = 'AJAX request';
            return false;
        }        

        // Process only GET and HEAD requests.
        if ( !isset($_SERVER['REQUEST_METHOD']) || !in_array($_SERVER['REQUEST_METHOD'], ['GET','HEAD']) ) {
            $bypass_reason = 'Not a GET or HEAD request';
            return false;
        }

        // Check for a 200 response code, if available.
        if ( function_exists('http_response_code') && http_response_code() !== 200 ) {
            $bypass_reason = 'HTTP response code: ' . http_response_code();
            return false;
        }        

        // Disallow caching for REST API requests (wp-json).
        $request_uri = Speed::get_url();
        if (stripos($request_uri, '/wp-json') !== false) {
            $bypass_reason = 'REST API request';
            return false;
        }            

        // Do not serve cache during cron.
        if (defined('DOING_CRON') && DOING_CRON) {
            $bypass_reason = 'Cron';
            return false;
        }

        // Exit for AMP pages.
        if (stripos($request_uri, '/amp') !== false || isset($_GET['amp'])) {
            $bypass_reason = 'AMP page';
            return false;
        }

        // Skip admin pages (if is_admin() is available).
        if (function_exists('is_admin') && is_admin()) {
            $bypass_reason = 'ADMIN page';
            return false;
        }

        // Skip password-protected posts.
        if (function_exists('post_password_required') && post_password_required()) {
            $bypass_reason = 'Password protected';
            return false;
        }


        return true;
    }    

    public static function save_cache($cache_file,$html,$msg='',$gz_only=false) {

        $end_time = microtime(true);
        $elapsed_time = isset(Speed::$start_time) ? $end_time - Speed::$start_time : 0;

        $formatted_time = date('D, d M Y H:i:s');
        if($msg) {
            $html .= "<!-- " . $msg . " -->";        
        } else {
            $html .= "<!-- on " . $formatted_time . " " . number_format($elapsed_time,2) . " total -->";        
        }

        $html = preg_replace("@--><!--@","",$html);
    
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
        if($gz_only === false) {
            file_put_contents($cache_file, $html, LOCK_EX);
        }

        // If gzip is accepted, save a gzipped version separately as .gz
        if (self::gzip_accepted() || $gz_only === true) {
            $gz_file = $cache_file . '.gz';
            file_put_contents($gz_file, gzencode($html), LOCK_EX);
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
     * Checks if the current URL is cacheable for logged in users.
     *
     * If the setting "Cache logged in users only on these URLs" is filled in,
     * checks if the current URL contains any of the entered strings.
     * If a match is found, the URL is considered cacheable.
     * If no match is found, the URL is not cacheable.
     * If the setting is empty, all URLs are considered cacheable.
     *
     * @param string $url The URL of the page.
     * @return boolean True if the URL is cacheable, false otherwise.
     */
    public static function is_url_logged_in_cacheable($url) {

        //Get URL path from $url
        $path = parse_url($url, PHP_URL_PATH);
        
        // Check if the URI contains any force URL strings.
        if (!empty(self::$cache_logged_in_users_exclusively_on)) {
            $force_urls = array_filter(array_map('trim', explode("\n", self::$cache_logged_in_users_exclusively_on)));

            foreach ($force_urls as $pattern) {
                if (@preg_match('@' . str_replace('/', '\/', trim($pattern)) . '$@', $path)) {
                    return true;   
                }
            }

        } else {
            
            //Nothing entered, everything passed
            return true;

        }

        //Something entered, but no match
        return false;

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
     * Returns the filename for the cached URIs list.
     *
     * If cache_logged_in_users is enabled and the user is logged in, the filename
     * will be suffixed with the user's role (e.g. "administrator-cached_uris.json").
     *
     * @return string The computed filename.
     */
    public static function get_cached_uris_filename() {

        $filename = 'cached_uris.json';

        // Append logged-in user role if enabled and available.
        if (self::$cache_logged_in_users === 'true' && isset($_COOKIE['speedify_press_logged_in_roles'])) {
            $filename = preg_replace('/[^A-Za-z0-9_\-]/', '', $_COOKIE['speedify_press_logged_in_roles']) . "-" . $filename;
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
            if (!$file->isDir() && preg_match('/index(.*?)\.(html|html\.gz)$/', $file->getFilename())) {
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
     * Searches through all cached HTML files in the cache directory, applies a regex search and replace,
     * and updates both the uncompressed (.html) and its gzipped version (.html.gz) only if a replacement was made.
     *
     * @param string $find    The regex pattern to search for.
     * @param string $replace The replacement string.
     * @return void
     */
    public static function search_replace_in_cache($find, $replace) {
        // Get the root cache directory.
        $cache_dir = Speed::get_root_cache_path();
        
        // Use a recursive iterator to traverse the cache directory.
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($cache_dir));
        
        foreach ($iterator as $file) {
            // Only process files ending in .html (skip .html.gz files).
            if ($file->isFile() && preg_match('/\.html$/', $file->getFilename())) {
                $filepath = $file->getPathname();
                
                // Read the content of the HTML file.
                $content = file_get_contents($filepath);
                $newContent = preg_replace($find, $replace, $content);
                
                if ($newContent === null) {
                    // There was an error with the regex replacement; skip this file.
                    continue;
                }
                
                // Only update if a replacement was made.
                if ($newContent !== $content) {
                    // Write the updated content back to the .html file.
                    file_put_contents($filepath, $newContent, LOCK_EX);
                    
                    // Update the gzipped version.
                    $gzFile = $filepath . '.gz';
                    $newCompressed = gzencode($newContent);
                    file_put_contents($gzFile, $newCompressed, LOCK_EX);
                }
            }
        }
    }

    public static function update_config_to_cache($config_vars,$new_config,$variable_name) {

        //See if one of our vars has been updated
        $do_update = false;
        foreach($config_vars AS $key=>$value) {

            if(isset($new_config[$key])) {
                $do_update = true;
            }

        }

        if($do_update) {

            //Search through all the files in the cache and replace
            $html = "var $variable_name = " . wp_json_encode($new_config, JSON_UNESCAPED_SLASHES) . ";";

            //Pattern to search for 
            $pattern = '@\bvar\s+' . preg_quote($variable_name, '@') . '\s*=\s*\{(?:[^{}]++|(?0))*\}\s*;@s';

            Cache::search_replace_in_cache($pattern,$html);

        }

    }       

    
    /**
     * Purge the cache for a post if any of its core fields have changed.
     *
     * @param int $post_ID The ID of the post to check.
     * @param WP_Post $post_after The post object after saving.
     * @param WP_Post $post_before The post object before saving.
     *
     * Checks if any of the core fields of the post have changed and if so, purges the cache for that post.
     */
    public static function purge_if_core_fields_changed( $post_ID, $post_after, $post_before ) {
        if ( wp_is_post_autosave( $post_ID ) || wp_is_post_revision( $post_ID ) ) return;
        if ( 'publish' !== get_post_status( $post_ID ) ) return;

        $changed =
            $post_after->post_title   !== $post_before->post_title   ||
            $post_after->post_name    !== $post_before->post_name    ||
            $post_after->post_excerpt !== $post_before->post_excerpt ||
            $post_after->post_parent  !== $post_before->post_parent  ||
            (int) $post_after->menu_order !== (int) $post_before->menu_order;

        if ( $changed ) {
            self::purge_by_post( $post_ID );
        }
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

        // Get permalink
        $permalink = get_permalink($post_id);

        //Purge for indivdual post
        Speed::purge_cache($permalink);

        //Purge CSS cache too
        Speed::purge_cache($permalink,array("lookup.json")); //don't clear the CSS files though as they are shared

        //Remove cached URI
        self::remove_cached_uri($permalink);

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
     * @return void
     */
    public static function clear_cache( $integations_only = false, $post_id = null ) {

        if (Speed::$hostname) {

            //Clear our own cache
            if($integations_only == false) {
            
                $dir = Speed::get_root_cache_path();
                // Speed::deleteSpecificFiles is wil recursively remove files matching the extensions.
                Speed::deleteSpecificFiles($dir, array("html", "gz","cached_uris.json"),true);

            }

            //Clear integrated caches
            if( empty( $GLOBALS['_my_cache_purging'] ) ) {

                $GLOBALS['_my_cache_purging'] = true; //prevent loop
                if($post_id) {
                    Speed::$done_purge[$post_id] = true; //prevent internal CSS purging if triggered
                }

                //Flyingpress
                if(defined('FLYING_PRESS_CACHE_DIR')) {
                    Speed::deleteSpecificFiles(FLYING_PRESS_CACHE_DIR,array("html","gz"),true);
                }

                //Kinsta cache
                global $kinsta_cache;
                if ( ! empty( $kinsta_cache->kinsta_cache_purge ) ) {
                    // Flush full-page + edge + CDN caches
                    $kinsta_cache->kinsta_cache_purge->purge_complete_site_cache();
                }

                //WordKeeper
                if ( class_exists('\WordKeeper\System\Purge') ) {

                    // Force purge this post + its related URLs (categories, archives, feeds, etc.)
                    if($post_id) {
                        \WordKeeper\System\Purge::purge_post($post_id, true);
                        \WordKeeper\System\Purge::purge_by_url();
                    } else {
                        \WordKeeper\System\Purge::purge_all();
                    }                

                }

                //Try to hit others such as Nginx helper
                if ( $post_id ) {
                    
                    $post_object = get_post( (int) $post_id );
                    do_action( 'transition_post_status', 'publish', 'publish', $post_object );
                    
                }   
                
                unset( $GLOBALS['_my_cache_purging'] );

            }

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
            '%%SPRESS_MULTISITE_IDENTIFIER%%'        => self::$multisite_identifier,
            '%%SPRESS_SEPARATE_COOKIE_CACHE%%'       => self::$separate_cookie_cache,
            '%%SPRESS_CACHE_PATH_UPLOADS%%'          => self::$cache_path_uploads,
            '%%SPRESS_FORCE_GZIPPED_OUTPUT%%'        => self::$force_gzipped_output,
            '%%SPRESS_CSRF_EXPIRY_SECONDS%%'         => self::$csrf_expiry_seconds,            
            '%%SPRESS_CACHE_LOGGED_IN_USERS%%'       => self::$cache_logged_in_users,
            '%%SPRESS_CACHE_MOBILE_SEPARATELY%%'     => self::$cache_mobile_separately,
            '%%SPRESS_IGNORE_QUERYSTRINGS%%'         => self::$ignore_querystrings,
            '%%SPRESS_CACHE_LIFETIME%%'              => self::$cache_lifetime,
            '%%SPRESS_DIR_NAME%%'                    => SPRESS_DIR_NAME,
            '%%SPRESS_PLUGIN_MODE%%'                 => self::$plugin_mode,
            '%%SPRESS_DISABLE_URLS%%'                => self::$disable_urls,
            '%%SPRESS_PRELOAD_FONTS_DESKTOP_ONLY%%'  => self::$preload_fonts_desktop_only,

            
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
