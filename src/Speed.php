<?php

namespace SPRESS;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use SPRESS\Speed\CSS;
use SPRESS\Speed\Cache;
use SPRESS\Speed\Unused;
use SPRESS\Speed\JS;
use SPRESS\AdvancedCache;

use SPRESS\App\Config;
use SPRESS\Dependencies\simplehtmldom\HtmlDocument;
use SPRESS\Dependencies\MatthiasMullie\Minify;
use SPRESS\Dependencies\Wa72\Url\Url;

/**
 * The `Speed` class handles performance optimizations and output rewriting 
 * for the plugin. It manages CSS rewriting. 
 * 
 * @package SPRESS
 */
class Speed {

    //The directory where unused CSS will be stored
    //will be a subdirectory of wp-content/cache
    public static $cache_directory = "speedify-spress";

    //The hostname of the current site
    public static $hostname;     

    //An array to holder uids, preventing duplicates
    public static $spuid_holder = array();     

    //Used to overwrite the dected URL, if required
    public static $injected_url;

    // array to hold URLs already purged this session
    public static $done_purge = array();           
    
    // start time for performance tracking
    public static $start_time;

    // set the name
    public static $csrf_name = "spdy_csrfToken";

    // allow OB debugging
    public static $debug_output_buffer = false;

    /**
     * Basic text sanitization that is safe before full WordPress bootstrap.
     *
     * @param mixed $value Raw value.
     * @return string
     */
    public static function sanitize_bootstrap_text($value) {
        if (!is_string($value)) {
            return '';
        }
        $value = stripslashes($value);
        $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?: '';
        return trim($value);
    }

    /**
     * Basic URL sanitization that is safe before full WordPress bootstrap.
     *
     * @param mixed $value Raw URL value.
     * @return string
     */
    public static function sanitize_bootstrap_url($value) {
        $value = self::sanitize_bootstrap_text($value);
        if ($value === '') {
            return '';
        }
        $value = filter_var($value, FILTER_SANITIZE_URL);
        return is_string($value) ? trim($value) : '';
    }

    /**
     * Read and sanitize a value from $_SERVER.
     *
     * @param string $key Server key.
     * @param string $default Default value.
     * @return string
     */
    public static function server_var($key, $default = '') {
        if (!is_string($key) || $key === '') {
            return $default;
        }

        $value = filter_input(INPUT_SERVER, $key, FILTER_UNSAFE_RAW);
        if (!is_string($value) || $value === '') {
            return $default;
        }

        return self::sanitize_bootstrap_text($value);
    }

    /**
     * Parse URL in both early bootstrap and normal runtime.
     *
     * @param string $url URL string.
     * @param int $component Optional component constant.
     * @return mixed
     */
    public static function safe_parse_url($url, $component = -1) {
        if (!function_exists('wp_parse_url')) {
            // phpcs:ignore WordPress.WP.AlternativeFunctions.parse_url_parse_url -- Runs before WordPress is loaded.
            return ($component === -1) ? parse_url($url) : parse_url($url, $component);
        }
        return wp_parse_url($url, $component);
    }

    /**
     * Delete file in a way that's compatible with both early 
     * and normal bootstrap.
     *
     * @param string $path File path.
     * @return bool
     */
    public static function delete_file_compat($path) {
        if (!is_string($path) || $path === '') {
            return false;
        }

        if (!file_exists($path)) {
            return true;
        }

        if (function_exists('wp_delete_file')) {
            wp_delete_file($path);
            return !file_exists($path);
        }

        // phpcs:ignore WordPress.WP.AlternativeFunctions.unlink_unlink -- Runs before WordPress is loaded.
        return @unlink($path);
    }

    /**
     * Returns parsed query args from the current request URI.
     *
     * @return array<string,mixed>
     */
    public static function get_query_args() {
        static $cached_query_args = null;
        if (is_array($cached_query_args)) {
            return $cached_query_args;
        }

        $cached_query_args = array();
        $request_uri = self::server_var('REQUEST_URI', '/');
        $query = self::safe_parse_url($request_uri, PHP_URL_QUERY);
        if (!is_string($query) || $query === '') {
            return $cached_query_args;
        }

        parse_str($query, $parsed_query);
        if (!is_array($parsed_query)) {
            return $cached_query_args;
        }

        foreach ($parsed_query as $query_key => $query_value) {
            $key = strtolower(preg_replace('/[^a-z0-9_\-]/i', '', (string) $query_key));
            if ($key !== '') {
                $cached_query_args[$key] = $query_value;
            }
        }

        return $cached_query_args;
    }

    /**
     * Checks whether a query arg exists in the current request URI.
     *
     * @param string $key Query arg key.
     * @return bool
     */
    public static function request_has_query_arg($key) {
        $query_args = self::get_query_args();
        $needle = strtolower(preg_replace('/[^a-z0-9_\-]/i', '', (string) $key));
        return $needle !== '' && array_key_exists($needle, $query_args);
    }

    /**
     * Detect whether the current request is actually cron transport.
     *
     * Some plugins define DOING_CRON during normal front-end renders. Treat the
     * flag as valid only when the request itself looks like wp-cron transport.
     *
     * @param string $request_uri Optional request URI override.
     * @param string $script_name Optional script name override.
     * @return bool
     */
    public static function is_cron_request($request_uri = '', $script_name = '') {
        if ( ! (defined('DOING_CRON') && DOING_CRON) ) {
            return false;
        }

        $request_uri = $request_uri !== '' ? $request_uri : self::server_var('REQUEST_URI', '');
        $script_name = $script_name !== '' ? $script_name : self::server_var('SCRIPT_NAME', '');

        return (stripos($request_uri, 'wp-cron.php') !== false)
            || (stripos($script_name, 'wp-cron.php') !== false);
    }

    /**
     * Detect whether a request should bypass cache before runtime-specific checks.
     *
     * This is safe for early bootstrap and shared by the advanced-cache loader
     * and runtime cache code to avoid duplicated request rules.
     *
     * @param string $request_uri Optional request URI override.
     * @param string $script_name Optional script name override.
     * @param string $cache_logged_in_users Cache policy flag.
     * @param string $bypass_cookies Line-separated bypass cookie fragments.
     * @param string $bypass_useragents Line-separated bypass user agent fragments.
     * @return string|false Reason string when bypassing, false otherwise.
     */
    public static function request_should_bypass_cache($request_uri = '', $script_name = '', $cache_logged_in_users = '', $bypass_cookies = '', $bypass_useragents = '') {
        $request_uri = $request_uri !== '' ? $request_uri : self::server_var('REQUEST_URI', '');
        $script_name = $script_name !== '' ? $script_name : self::server_var('SCRIPT_NAME', '');
        $request_method = self::server_var('REQUEST_METHOD', '');
        $requested_with = self::server_var('HTTP_X_REQUESTED_WITH', '');
        $http_user_agent = self::server_var('HTTP_USER_AGENT', '');

        // Only cache GET or HEAD requests.
        if ( ! in_array($request_method, array('GET', 'HEAD'), true) ) {
            return 'Not a GET or HEAD request';
        }

        // AJAX traffic is not page-cache traffic.
        if (strtolower($requested_with) === 'xmlhttprequest' || (defined('DOING_AJAX') && DOING_AJAX)) {
            return 'AJAX request';
        }

        // Allow explicit cache busting from the request string.
        if (self::request_has_query_arg('speedify_cache_bust')) {
            return 'Cache bust parameter';
        }

        // Legacy nocache requests should also skip caching.
        if (stripos($request_uri, 'nocache') !== false || stripos($script_name, 'nocache') !== false) {
            return 'Nocache querystring';
        }

        // Skip non-200 responses so we never cache errors or redirects.
        if (function_exists('http_response_code') && http_response_code() !== 200) {
            return 'HTTP response code';
        }

        // REST and XML-RPC requests are not page-cache candidates.
        if ( (defined('REST_REQUEST') && REST_REQUEST) || (defined('XMLRPC_REQUEST') && XMLRPC_REQUEST) ) {
            return 'REST or XMLRPC request';
        }

        // Exclude known transport and admin endpoints early.
        $disallowed = array('wp-cron.php', 'xmlrpc.php', 'wp-login.php', 'wp-admin');
        foreach ($disallowed as $file) {
            if (stripos($request_uri, $file) !== false || stripos($script_name, $file) !== false) {
                return $file;
            }
        }

        // wp-json is API traffic, not front-end HTML.
        if (stripos($request_uri, '/wp-json') !== false || stripos($script_name, '/wp-json') !== false) {
            return 'REST API request';
        }

        // Skip file-type endpoints that should not be cached as HTML.
        $path = self::safe_parse_url($request_uri, PHP_URL_PATH);
        if ($path) {
            $exts = array('.ico', '.txt', '.xml', '.xsl');
            foreach ($exts as $ext) {
                if (substr($path, -strlen($ext)) === $ext) {
                    return 'Disallowed extension';
                }
            }
        }

        // Cookie policy can still force a bypass in bootstrap/runtime.
        if ($cache_logged_in_users !== 'true') {
            foreach ((array) $_COOKIE as $cookie_name => $cookie_value) {
                if (stripos((string) $cookie_name, 'wordpress_logged_in') === 0) {
                    return 'Logged-in cookie';
                }
            }
        }

        if ($bypass_cookies !== '' && !empty($_COOKIE)) {
            $cookie_rules = array_filter(array_map('trim', explode("\n", $bypass_cookies)));
            foreach ($cookie_rules as $cookie_rule) {
                foreach ((array) $_COOKIE as $cookie_name => $cookie_value) {
                    if (stripos((string) $cookie_name, $cookie_rule) !== false) {
                        return 'Cookie: ' . $cookie_name;
                    }
                }
            }
        }

        if ($bypass_useragents !== '' && $http_user_agent !== '') {
            $useragent_rules = array_filter(array_map('trim', explode("\n", $bypass_useragents)));
            foreach ($useragent_rules as $useragent_rule) {
                if (stripos($http_user_agent, $useragent_rule) !== false) {
                    return 'Bypass User Agent: ' . $http_user_agent;
                }
            }
        }

        // Only treat DOING_CRON as real cron when the transport matches wp-cron.
        if (self::is_cron_request($request_uri, $script_name)) {
            return 'Cron';
        }

        // AMP pages get their own output path.
        if (stripos($request_uri, '/amp') !== false || self::request_has_query_arg('amp')) {
            return 'AMP page';
        }

        return false;
    }

    /**
     * Initializes the Speed class by setting up output buffering, CSS optimizations,
     * HTML rewriting, and registering filters and actions for third-party plugins.
     */
    public static function init() {

        //Check for a REQUEST_URI request csrf token
        self::serve_csrf_token();

        //Set the hostname
        self::$hostname = wp_parse_url(site_url(), PHP_URL_HOST);

        // Initialize Cache speed optimizations
        Cache::init();        

        // Initialize CSS  speed optimizations
        CSS::init();

        // Initialize JS  speed optimizations
        JS::init();        
        
        // Start output buffering and process output
        // Hook to init to ensure it runs before other plugins
        if(Speed::is_frontend() === true) {
            add_action(
                'init',function() {
                    ob_start(array(__CLASS__, 'process_output'));
            });      
        }

        //Cron action
        add_action('run_gtag_cron', array(__CLASS__,'run_gtag_cron'));

		//Include pluggable files
		if(Config::get( 'speed_cache', 'replace_ajax_nonces' ) === 'true') {
			require_once( dirname(__FILE__) . '/App/Pluggable/check_ajax_referer.php' );
		}        


    }

    /**
     * Serves the CSRF token as a JSON response.
     *
     * This function is only invoked if the original URI is '/_csrf'. It generates
     * a CSRF token using SPEED::generate_csrf_token() and serves it as a JSON
     * response with Content-Type 'application/json' and Cache-Control 'no-store,
     * no-cache, must-revalidate, max-age=0'. The response is also marked with
     * the 'Pragma: no-cache' header.
     *
     * @param array $headers An array of extra headers to add to the response.
     *
     * @return void
     */
    public static function serve_csrf_token($headers=array()) {
        
        $request_uri = self::server_var('REQUEST_URI', '/');
        $path = self::safe_parse_url($request_uri, PHP_URL_PATH);
        if ($path === '/_csrf' || basename($path) === '_csrf') {

            // Ensure a binding exists BEFORE generating the token
            $guest_cookie = isset($_COOKIE['spdy_guest']) ? self::sanitize_bootstrap_text($_COOKIE['spdy_guest']) : '';
            if ( $guest_cookie === '' ) {
                Cache::generate_guest_cookie();
            }            

            $page_url = SPEED::get_url();
            $header_url = self::sanitize_bootstrap_url(self::server_var('HTTP_X_PAGE_URL', ''));
            if ($header_url) {
                $site_host = self::get_current_host();
                if ($site_host && strpos($site_host, ':') !== false) {
                    $site_host = explode(':', $site_host, 2)[0];
                }
                $header_host = self::safe_parse_url($header_url, PHP_URL_HOST);
                $header_scheme = self::safe_parse_url($header_url, PHP_URL_SCHEME);
                if ($site_host && $header_host && strcasecmp($header_host, $site_host) === 0
                    && in_array($header_scheme, ['http', 'https'], true)
                ) {
                    $page_url = $header_url;
                }
            }
            $csrf_token = Speed::generate_csrf_token($page_url);

            header('X-CSRF-Token: ' . $csrf_token);
            header('X-Content-Type-Options: nosniff');
            header_remove('ETag');
            header_remove('Last-Modified');            
            header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
            header('Pragma: no-cache');
            header('Content-Type: text/plain; charset=utf-8');

            //Add extra headers from $headers
            foreach($headers as $key=>$header) {
                header($key.': '.$header);
            }

            // For HEAD, no body needed
            http_response_code(204); // No Content

            exit;

        }

    }


    /**
     * Retrieves the best matching blog ID for the current URL.
     *
     * This method takes the full current URL and normalizes it by stripping the
     * protocol and query/fragment parts, and ensuring a trailing slash.
     *
     * It then checks the configured multisite identifiers against the normalized
     * URL and returns the best matching blog ID. The best match is determined by
     * the longest matching URL prefix.
     *
     * If no multisite identifiers are configured, the default blog ID (1) is
     * returned.
     *
     * @return int The best matching blog ID.
     */
    public static function get_multisite_identifier() {

        $url = Speed::get_url(); // full current URL
        $url = preg_replace('#^https?://#i', '', $url); 

        // Normalize: strip query/fragment, ensure trailing slash
        $url = strtok($url, '?#');
        $url = rtrim($url, '/') . '/';        

        if ( ! defined( 'SPRESS_MULTISITE_IDENTIFIER' ) ) {
            return 1;
        }
        // Decode the JSON-encoded identifier map.  If decoding fails or the
        // result is not an array, default to an empty array.
        $decoded = json_decode( SPRESS_MULTISITE_IDENTIFIER, true );
        $ident   = is_array( $decoded ) ? $decoded : array();        

        //Check for the best match (longest wins)
        if (is_array($ident)) {
            $bestId = 1;
            $bestLen = 0;
            foreach ($ident as $url_start => $blog_number) {
                $key = rtrim($url_start, '/') . '/';
                if (strpos($url, $key) === 0 && strlen($key) > $bestLen) {
                    $bestLen = strlen($key);
                    $bestId  = (int) $blog_number;
                }
            }
            return $bestId;
        }

        return 1; // default blog ID
    }


    /**
     * Returns an associative array containing URL prefixes to blog IDs.
     *
     * The returned array contains URL prefixes as keys and blog IDs as values.
     * The URL prefixes are constructed by concatenating the domain and path of the blogs
     * in the multisite installation. The blog IDs are the IDs of the respective blogs
     * in the multisite installation.
     *
     * The method first checks if the constant SPRESS_MULTISITE_IDENTIFIER is defined. If it
     * is, it unserializes the constant and assigns the result to the $ident variable. If
     * it is not, it initializes the $ident variable to an empty array.
     *
     * It then checks if the current WordPress installation is a multisite installation. If
     * it is, it retrieves the current blog details using the get_blog_details() function and
     * assigns the result to the $blog variable. It then constructs the URL prefix by
     * concatenating the domain and path of the blog and assigns the current blog ID to the
     * corresponding element of the $ident array with the constructed URL prefix as the key.
     *
     * Finally, it returns the $ident array.
     *
     * @return array An associative array containing URL prefixes to blog IDs.
     */
    public static function get_multisite_definition() {

        if ( ! defined( 'SPRESS_MULTISITE_IDENTIFIER' ) || ! function_exists( 'get_blog_details' ) ) {
            return array();
        }

        // Decode the JSON string from the constant into an associative array.  If the
        // constant is empty or decoding fails, start with an empty array.
        if ( SPRESS_MULTISITE_IDENTIFIER ) {
            $decoded = json_decode( SPRESS_MULTISITE_IDENTIFIER, true );
            $ident   = is_array( $decoded ) ? $decoded : array();
        } else {
            $ident = array();
        }

        $blog = get_blog_details( get_current_blog_id() );

        // get the current blog id
        if(is_multisite()) {
            $blog = get_blog_details( get_current_blog_id() );
            $ident[$blog->domain.$blog->path] =  get_current_blog_id();    
        }        

        return $ident;

    }

    /**
     * Retrieves the root cache directory.
     *
     * This function takes the configured cache directory and appends the result of
     * get_multisite_identifier() to it. This allows the cache to be separated by
     * site if running a multisite installation.
     *
     * @return string The root cache directory.
     */
    public static function get_cache_directory() {
        
        $cache_directory = self::$cache_directory . "-" . self::get_multisite_identifier();
        return $cache_directory;
        
    }

    /**
     * Retrieves the root cache directory.
     *
     * This function checks a setting in the speed_cache config group to determine
     * whether the cache directory should be placed in the uploads folder or in the
     * standard cache folder. If the setting is true, the uploads folder is used.
     *
     * @return string The root cache directory.
     */
    public static function get_cache_root() {

        $switch_cache_path = (defined('SPRESS_CACHE_PATH_UPLOADS') ? SPRESS_CACHE_PATH_UPLOADS : Config::get('speed_cache','cache_path_uploads'));
        $dir = "";
        if($switch_cache_path === 'true') {
            $dir = "uploads";
        } else {
            $dir = "cache";
        }

        return $dir;

    }

    /**
     * Retrieves the cache path that won't get cleared
     *
     * @return string The cache path
     */
    public static function get_pre_cache_path() {

        return ABSPATH . "wp-content/" . self::get_cache_root() . "/". self::get_cache_directory();

    }

    /**
     * A cache URL that isnt' deleted on cache clear
     *
     * @return string The root cache URL.
     */
    public static function get_pre_cache_url() {

        return site_url() . "/wp-content/" . self::get_cache_root() . "/". self::get_cache_directory();

    }       

    /**
     * Retrieves the root cache path.
     *
     * @return string The root cache path.
     */
    public static function get_root_cache_path() {

        $switch_cache_path = (defined('SPRESS_CACHE_PATH_UPLOADS') ? SPRESS_CACHE_PATH_UPLOADS : Config::get('speed_cache','cache_path_uploads'));
        $dir = "";
        if($switch_cache_path === 'true') {
            $dir = "uploads";
        } else {
            $dir = "cache";
        }

        return ABSPATH . "wp-content/". $dir . "/". self::get_cache_directory() ."/" . self::$hostname;

    }

    /**
     * Retrieves the root cache URL.
     *
     * @return string The root cache URL.
     */
    public static function get_root_cache_url() {

        return site_url() . "/wp-content/" . self::get_cache_root()  . "/". self::get_cache_directory() ."/" . self::$hostname;

    }    

    /**
     * Processes the final output before it's sent to the browser.
     * This includes rewriting CSS and HTML.
     *
     * @param string $output The buffered output.
     * @return string The modified output.
     */
    public static function process_output($output) {

        // Check if this is an HTML document
        if (preg_match('/^\s*<\?xml\b/i', $output) || !preg_match('/<html[\s>]/i', $output)) {
            return $output;
        }        


        try {
            
        //Start time
        self::$start_time = microtime(true);

        $output = self::rewrite_html($output);     // Rewrite HTML content for optimizations, add tags first

        $output = CSS::rewrite_css($output); // Rewrite CSS for performance improvements

        $output = JS::rewrite_js($output); // Rewrite JS for performance improvements

        //Run again to replace in new output
        $output = self::find_replace($output);

        //Remove comments
        $output = str_replace(['@@@replaced@@@', '@@@/replaced@@@'], '', $output);
        $output = str_replace([base64_encode('@@@replaced@@@'), base64_encode('@@@/replaced@@@'), base64_encode('@@@replaced@@@@@@/replaced@@@')], '', $output);

        //Save ouput to cache
        $output = Cache::do_cache($output); 
        $output = preg_replace("@-->(\n)?<!--@","",$output);

        $output = CSS::do_html_cache($output);

        } catch (\Exception $e) {
            // Handle exception here if necessary, but PHP may not fully respect try-catch within ob_start callback
            if(current_user_can( 'manage_options' )
            && self::$debug_output_buffer === true) {
                echo '<!--Caught exception: ' . esc_html( $e->getMessage() ) . '-->';
            }
        }


        return $output;

    }

    /**
     * Tags the output HTML with comments for easier debugging.
     * 
     * @param string $html The HTML output.
     * @return string The modified HTML output.
     */
    private static function tag_html($dom, $object_id) {                        

        // Define display elements we want to tag
        $displayElements = [
            'div', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'style', 'link'
        ];

        // Start traversal from the <html> element
        $html = $dom->find('html', 0); // Find the <html> tag

        // Start from the body or root element
        $depthThreshold = 13;
        self::traverse_and_tag($html, 0, $depthThreshold, $displayElements);

        //Add object id after the title
        $title = $dom->find('title', 0);
        if($title) {
            $title->outertext = $title->outertext . '<template id="spdy-head-' . $object_id . '"></template>';
        }

        //Add object id at doc end
        $body = $dom->find('body', 0);
        $scriptElement = $dom->createElement('template');
        $scriptElement->outertext = '<template id="spdy-body-' . $object_id . '"></template>';
        $body->appendChild($scriptElement);            


        return $dom;
         
    }

    /**
     *
     * 
     * @param \simple_html_dom $dom The DOM structure to modify.
     * @return \simple_html_dom The modified DOM structure with the stand-in
     *                          script included.
     */
    private static function add_template_image_restore_js($dom) {
        
        //Set file
        $template_js = file_get_contents(SPRESS_PLUGIN_DIR . '/assets/restore_template_content.js');

        //Minify it
        $minifier = new Minify\JS($template_js);
        $template_js = $minifier->minify();

        // Create a new script element
        $scriptElement = $dom->createElement('script');
        $scriptElement->setAttribute('rel', 'js-extra spress_template_restore');//
        $scriptElement->innertext = $template_js;

        // Append the script element directly to the head
        $headElement = $dom->find('head', 0);
        if($headElement) {
            $headElement->children(0)->outertext = $scriptElement->outertext . $headElement->children(0)->outertext;        
        }

        //Always exclude
        JS::$delay_exclude .= "\n" . "spress_template_restore";

        return $dom;

    }
   

    /**
     * Embeds a minified jQuery stand-in script into the provided DOM structure.
     * This function reads the stand-in script, minifies it, and appends it to
     * the <head> element of the DOM, ensuring basic jQuery functionalities are
     * available before the actual jQuery library loads.
     *
     * @param \simple_html_dom $dom The DOM structure to modify.
     * @return \simple_html_dom The modified DOM structure with the stand-in
     *                          script included.
     */
    private static function add_jquery_standin($dom) {
     
        //Set file
        $simple_jquery_standin = file_get_contents(SPRESS_PLUGIN_DIR . '/assets/simple_jquery_standin.js');

        //Minify it
        $minifier = new Minify\JS($simple_jquery_standin);
        $simple_jquery_standin = $minifier->minify();

        // Create a new script element
        $scriptElement = $dom->createElement('script');
        $scriptElement->setAttribute('rel', 'js-extra spress_jquery_standin');
        $scriptElement->innertext = $simple_jquery_standin;

        // Append the script element directly to the head
        $headElement = $dom->find('head', 0);
        if($headElement) {
            $headElement->children(0)->outertext = $scriptElement->outertext . $headElement->children(0)->outertext;        
        }

        //Always exclude
        JS::$delay_exclude .= "\n" . "spress_jquery_standin";

        return $dom;

    }    

    private static function add_gtag($dom) {

        //Find all script elememts in DOM
        $scripts = $dom->find('script');

        // Iterate over each <script> tag
        foreach ((array)$scripts as $script) {

            if(strstr($script->outertext,"/gtag/")) {                 
                
                preg_match("@((https?:\/\/)?www\.googletagmanager\.com\/gtag\/js[^\"']+)@",$script->outertext,$matches);
                if(!empty($matches[1])) {
                    
                    $file = self::download_gtag($matches[1]);

                    if($file) {
                        
                        //Replace the file
                        $script->outertext = str_replace($matches[1],$file,$script->outertext);
                        //Add preload
                        if(Config::get('external_scripts', 'preload_gtag') === "true") {                            

                            $link = $dom->createElement('link');
                            $link->setAttribute('rel','preload');
                            $link->setAttribute('href',$file);
                            $link->setAttribute('as','script');

                            //Add as first child of head
                            $headElement = $dom->find('head', 0);
                            if($headElement) {
                                $headElement->children(0)->outertext = $link->outertext . $headElement->children(0)->outertext;                              
                            }


                        }

                    }

                }
                

            }


        }



        return $dom;

    }

	public static function download_gtag( $remote_file = null, $force_version_update = false ) {

        //Set the directory
        $path = self::get_pre_cache_path() . "/local_tag/";

        // 1) Determine $tag_id
        $tag_id = null;
        if ($remote_file && preg_match('/[?&]id=([^&]+)/', $remote_file, $m)) {
            $tag_id = preg_replace('/[^A-Za-z0-9_\-\.]/', '_', $m[1]); // FS-safe
        }

        // If remote is null but we're forcing an update, pick an existing tag_id
        if (!$tag_id && $force_version_update) {
            $candidates = glob($path . "version-*.json") ?: [];
            if (!empty($candidates)) {
                // choose the most recently modified version file
                usort($candidates, function ($a, $b) { return filemtime($b) - filemtime($a); });
                if (preg_match('/version-(.+)\.json$/', basename($candidates[0]), $mm)) {
                    $tag_id = $mm[1];
                }
            }
        }

        if (!$tag_id) {
            $tag_id = 'default';
        }        
     

        //Set the version file
        $version_file = self::get_pre_cache_path() . "/local_tag/version-" . $tag_id . ".json";

        //For debugging
        $error_file = self::get_pre_cache_path() . "/local_tag/error-" . $tag_id . ".log";

        //Set the filename
        $local_filename = "local_tag-" . $tag_id . ".js";

        //Set the file
        $js_file = self::get_pre_cache_path() . "/local_tag/" . $local_filename;

        //Set the URL
        $url = self::get_pre_cache_url() . "/local_tag/";

        //Return if found
        if(file_exists($js_file) && $force_version_update == false) {
            $filename = basename($js_file);
            $version = (array)json_decode(file_get_contents($version_file));
            return $url . $filename . "?v=" . $version['version'] ?? 0;
        }

        //If remote not passed, use previously downloaded one
        if(!$remote_file && file_exists($version_file)) {
            $version = (array)json_decode(file_get_contents($version_file));
            $remote_file = ($version['remote'] ?? '');
        }   

        //No remote found
        if(!$remote_file) {
            //Write error log
            file_put_contents($error_file, gmdate("Y-m-d H:i:s") . " No remote file specified and no previous download found.\n",FILE_APPEND);
            return false;
        }

        //Get new file contents
		$file_contents = wp_remote_get( $remote_file );

        //Could not download
        if ( is_wp_error( $file_contents ) ) {
            $error_message = $file_contents->get_error_message();
            //Write error log
            file_put_contents($error_file, gmdate("Y-m-d H:i:s") . " Could not download remote file. Error: $error_message\n",FILE_APPEND);        
            return false;
        }

        //Get the contents
        $file_contents = $file_contents[ 'body' ];

        //Make sure contents OK
        if(!strstr($file_contents,"Google")) {
            //Write error log
            file_put_contents($error_file, gmdate("Y-m-d H:i:s") . " Could not download remote file. Error: Could not find 'Google' string in " . $file_contents . "\n",FILE_APPEND);
            return false;
        }

        //Minify the JS
        $minifier = new Minify\JS($file_contents);
        $file_contents = $minifier->minify();        

        //Get the version
        if(file_exists($version_file)) {
            $version = file_get_contents($version_file);
            $version = (array)json_decode($version);
        } else {
            $version = array('remote'=>$remote_file,'version'=>0);
        }

        //Increase version
        $version['version']++;
        $dir = self::get_pre_cache_path() . "/local_tag/";
                
        // Create the cache directory if it does not exist
        !is_dir($dir) && wp_mkdir_p($dir);  

        //Write new version
        file_put_contents($version_file,json_encode($version));

        //Write the file
        $path =  $dir . $local_filename;
        file_put_contents($path, $file_contents, LOCK_EX);

		return $url . $local_filename . "?v=".$version['version'];

	}     

    public static function handle_gtag_update($value) {

        //Schedule the cron
        if($value == "true") {

            if (!wp_next_scheduled('run_gtag_cron')) {
                wp_schedule_event(time(), 'twicedaily', 'run_gtag_cron');
            }


        } else {
        //Remove the cron

            if (wp_next_scheduled('run_gtag_cron')) {
                wp_clear_scheduled_hook('run_gtag_cron');
            }        

        }
    }

    public static function run_gtag_cron() {

        self::download_gtag( null, true);

    }

    public static function add_invisible_elements($dom) {        

        //Get current URL
        $current_url = self::get_url();

        //See if there is a lookup file
        $lookup_file = CSS::get_lookup_file( $current_url );
        if(!file_exists($lookup_file)) {
            return $dom;
        }

        //Check if we have a lookup file
        $contents = @file_get_contents($lookup_file);
        $data_object = ($contents !== false && ($decoded = json_decode($contents)) && json_last_error() === JSON_ERROR_NONE && is_object($decoded))
            ? $decoded
            : (object)[];        

        //Mark invisible elements
        if(isset($data_object->invisible) && isset($data_object->invisible->elements) && count($data_object->invisible->elements) >0 ) {

            // Get elements with paths
            $elements = $data_object->invisible->elements;             
            
            // Get original viewport
            $originalViewport = $data_object->invisible->viewport;                

            foreach ($elements as $element) {

                if(!isset($element->tag)) {
                    $element->tag = "";
                }

                //Get an element height to fit all screens                                
                $average_vp_width = 1536;
                $diff = $originalViewport->width / $average_vp_width;
                if($diff < 1) {
                    $diff = $diff * 1.2;   
                } else {
                    $diff = $diff / 1.2;
                }
                if(isset($element->height)) {
                    $element_height  = $element->height * $diff;                    
                } else {
                    $element_height  = 100;                    
                }
                
                //Get element and current spuid
                $spuid = $element->spuid ?? false;  

                if($spuid && $element->tag != 'style' && $element->tag != 'link') {

                    $element = $dom->find('[data-spuid="' . $spuid . '"]', 0);
                    if($element) {
                        $element->addClass('unused-invisible');
                        $element->style .= ' ;content-visibility: auto; contain-intrinsic-size: auto ' . (int)$element_height . 'px;';

                        $template = $dom->createElement('template');
                        $template->innertext = $element->innertext;
                        $templater_filler = $template->outertext;
                        $element->outertext  = str_replace($element->innertext,$templater_filler,$element->outertext);
                    }

                    
                }

            }


        }



        return $dom;

    }

    /**
     * Adds a CSRF token to the document that can be used to secure a form from
     * cross-site request forgery attacks.
     *
     * The token is a base64-encoded string that contains a 30-second
     * expiration timestamp and a 6-byte random value. The token is
     * signed using the HMAC-SHA256 algorithm and the NONCE_SALT secret
     * key.
     *
     * A mini worker is used to fetch the token. The worker is created
     * using the URL.createObjectURL method and is passed the path to the
     * token endpoint. The worker then fetches the token and posts it back
     * to the main thread.
     *
     * The mini worker is also responsible for refreshing the token when
     * the tab is visible or the user focuses on the tab.
     *
     * @param \simple_html_dom $dom The document to modify.
     *
     * @return \simple_html_dom The modified document with the CSRF token
     *                          included.
     */
    private static function add_csrf_token($dom) {  

        // Create a new script element
        $scriptElement = $dom->createElement('script');
        $scriptElement->setAttribute('id', self::$csrf_name);

        //Generate token
        $csrf_token = self::generate_csrf_token(self::get_url());

        //Mini worker to fetch token
        $mini_worker = '
        var _spdyInflight=false,_spdyLast=0,_spdyMinInterval=60000;

        var _w=new Worker(URL.createObjectURL(new Blob(["onmessage=e=>{var d=e.data||{},u=d.u,p=d.p;if(!u)return;fetch(u,{method:\'HEAD\',credentials:\'same-origin\',headers:{\'X-Page-URL\':p||\'\',Accept:\'application/json\'}}).then(r=>postMessage(r.headers.get(\'X-CSRF-Token\')||\'\')).catch(()=>postMessage(\'\'))}"],{type:"text/javascript"})));
        window.spdy_csrfToken=null;

        // set once (not per call)
        _w.onmessage=e=>{
        var t=e.data;
        _spdyInflight=false;
            if(t){
                window.spdy_csrfToken=t;
                document.cookie = \'spdy_csrf=\' + encodeURIComponent(t) + \'; Path=/; Secure; SameSite=Lax\';
                document.dispatchEvent(new CustomEvent("spdy:csrf-updated",{detail:{token:t}}))
            }
        };        

        function spdyFetchCsrf(path) {
        if (typeof path !== \'string\' || !path) path = \'_csrf\';

        var now = Date.now();
        if (_spdyInflight || now - _spdyLast < _spdyMinInterval) return

        _spdyInflight = true;
        _spdyLast = now;

        var u = new URL(path, location.href).href;
        _w.postMessage({ u, p: location.href });
        }

        spdyFetchCsrf();
        addEventListener("visibilitychange",()=>{!document.hidden&&spdyFetchCsrf()});
        addEventListener("focus",spdyFetchCsrf);
        addEventListener("pageshow",e=>{e.persisted&&spdyFetchCsrf()});
        '; 

        //Minify it
        $minifier = new Minify\JS($mini_worker);
        $mini_worker = $minifier->minify();                    

        $scriptElement->innertext = $mini_worker;
                            
        //Add after head
        $headElement = $dom->find('head', 0);
        if($headElement) {
            $headElement->children(0)->outertext = $scriptElement->outertext . $headElement->children(0)->outertext;        
        }        

        return $dom;

    }

    
    private static function set_onload($dom) {  

        // Create a new script element
        $scriptElement = $dom->createElement('script');
        $scriptElement->setAttribute('ref', 'onload.min.js ');
        $scriptElement->setAttribute('id', 'onload-main');
        $scriptElement->src = SPRESS_PLUGIN_URL . 'assets/onload/onload.min.js?v=' . SPRESS_VER;

        //Add after head
        $headElement = $dom->find('head', 0);
        if($headElement) {
            $headElement->children(0)->outertext = $scriptElement->outertext . $headElement->children(0)->outertext;        
        }        

        return $dom;

    }


    /**
     * Adds a minified Intersection Observer script to the provided DOM structure.
     * This function checks for the presence of <template> tags in the DOM, and
     * if found, reads and minifies the Intersection Observer script, then appends
     * it directly after the last <template> tag. The script is intended to handle
     * lazy-loading or other intersection-based operations on elements within the
     * DOM.
     *
     * @param \simple_html_dom $dom The DOM structure to modify.
     * @return \simple_html_dom The modified DOM structure with the Intersection
     *                          Observer script included if templates are present.
     */
    private static function add_intersection_observer($dom) {      
     

        //Set file
        $intersection_observer = file_get_contents(SPRESS_PLUGIN_DIR . '/assets/intersection_observer.js');
        
        //Minify it
        $minifier = new Minify\JS($intersection_observer);
        $intersection_observer = $minifier->minify();
        
        // Create a new script element
        $scriptElement = $dom->createElement('script');
        $scriptElement->setAttribute('rel', 'js-extra spress_intersection_observer');
        $scriptElement->innertext = $intersection_observer;

        //Add before body end
        $body = $dom->find('body', 0);
        $body->appendChild($scriptElement);

        //Always exclude
        JS::$delay_exclude .= "\n" . "spress_intersection_observer";        

        return $dom;

    }    

    /**
     * Traverses an HTML DOM element and its children, adding data-spuid attributes
     * to elements that match the specified display elements and depth threshold.
     * 
     * @param \simple_html_dom_node $element The current element to traverse.
     * @param int $currentDepth The current depth of the traversal.
     * @param int $depthThreshold The maximum depth to traverse.
     * @param array $displayElements An array of display elements to match.
     * @param string $parentKey The stable key of the parent element.
     * @return void
     * 
     */
    private static function traverse_and_tag($element, $currentDepth, $depthThreshold, $displayElements, $parentKey = '') {

        // Check if this element is one of our target display elements at the desired depth
        if ($currentDepth < $depthThreshold && in_array($element->tag, $displayElements)) {
    
            // Create a canonical representation for the element: tag, sorted attributes, and normalized inner text
            $canonical = $element->tag . '|' . self::get_canonical_attributes($element) . '|' . trim($currentDepth);
            
            // Combine with parent's stable key to generate the hash source
            $hashSource = $parentKey . '>' . $canonical;
            $ident = substr(md5($hashSource), 0, 8);

            //Add to holder array
            self::$spuid_holder[$ident][] = $hashSource;
            
            // Construct a spuid
            $spuid = 'd' . $currentDepth . '-' . $ident . '-' . count(self::$spuid_holder[$ident]);
            $element->setAttribute('data-spuid', $spuid);
            //$element->setAttribute('data-spudepth', $currentDepth);

            //For style tags, give a content ID
            if($element->tag == "style") {
                $content_id = md5($element->innertext);
                $element->setAttribute('data-spcid', $content_id);
            }
    
            // Use the current element's UID as the new parent key for children
            $parentKey = $spuid;
        }
    
        // Recursively tag child elements, passing along the current stable key
        foreach ($element->children as $child) {
            self::traverse_and_tag($child, $currentDepth + 1, $depthThreshold, $displayElements, $parentKey);
        }
    }
    
    // Helper function to get a canonical, sorted string of the element's attributes
    private static function get_canonical_attributes($element) {
        $attrs = $element->getAllAttributes();
        ksort($attrs);
        $attrStr = '';
        foreach ($attrs as $key => $value) {
            $attrStr .= $key . '=' . $value . ';';
        }
        return $attrStr;
    }
    
      
    /**
     * Whether the current request is a front-end request.
     * 
     * @return bool True if the request is a front-end request, false otherwise.
     * 
    */
    public static function is_frontend() {

        // Check if it's an admin area or an AJAX request or cron
        $script_name = isset( $_SERVER['SCRIPT_NAME'] ) ? sanitize_text_field( wp_unslash( $_SERVER['SCRIPT_NAME'] ) ) : '';
        if (is_admin() || wp_doing_ajax() || self::is_cron_request()
        || (stripos( $script_name, 'wp-login.php' ) !== false)
        || (stripos( $script_name, 'wp-cron.php' ) !== false)
        ) {
            return false;
        }
        
        //Intregrations
        if ( self::request_has_query_arg('elementor-preview') ) {
            return false;
        }

        // Check if it's a REST API request by looking at the URI
        $request_uri = self::get_url();
        if (strpos($request_uri, '/wp-json/') === 0) {
            return false;
        }
    
        // If none of the above conditions match, it's a front-end request
        return true;
    }    

    /**
     * Rewrites the HTML output by inserting custom head and body code, and performs 
     * find-and-replace operations defined in the configuration.
     *
     * @param string $html The HTML output.
     * @return string The modified HTML output.
     */
    public static function rewrite_html($html) {

        // Check if this is an HTML document
        if (!strstr($html, '<html')) {
            return $html;
        }

		// Detect non-HTML.
		if ( ! isset( $html ) || trim( $html ) === '' || strcasecmp( substr( $html, 0, 5 ), '<?xml' ) === 0 || trim( $html )[0] !== '<' ) {
			return $html;
        }

        //Builders
        if (
            self::request_has_query_arg('fb-edit') ||
            self::request_has_query_arg('builder') ||
            self::request_has_query_arg('auth0') ||
            self::request_has_query_arg('et_fb') ||
            self::request_has_query_arg('ct_builder')
        ) {
            return $html;
        }

        $request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';
		if ( strstr( $request_uri, 'wp-json' ) ) {
			return $html;
		}

		if ( is_404() ) {
			return $html;
		}        

        if(self::is_frontend()) {

            $start_time = microtime(true);

            // Perform find-and-replace operations 
            // do this first so new html can be worked on below
            $html = self::find_replace($html);              

            // simple_html_dom.
            $dom = (new HtmlDocument(""))->load($html,true, false);     

            //add id tags to HTML
            //Get current page/post ID from WordPress
            $obj = function_exists('get_queried_object') ? get_queried_object() : null;
            if ( $obj ) {
                $base = strtolower( str_replace( 'WP_', '', get_class( $obj ) ) );
                $object_id = $base . '-' . get_queried_object_id(); // e.g. post-123, term-7909, user-5
            } else {
                $object_id = 'none-0';
            }

            $dom = self::tag_html($dom,$object_id);

            //Do google fonts
            if(Config::get('external_scripts','gfonts_locally') === "true") {
                $dom = self::proxy_google_fonts($dom);
            }
            //add jquery standing
            $dom = self::add_jquery_standin($dom);

            //add template and image restore JS
            //if delay JS is active 
            //(otherwise it'll hide elements JS relies on)
            if(Config::get('speed_js','delay_js') === "true" || Config::get('speed_code','preload_image') != "") {
                $dom = self::add_template_image_restore_js($dom);                
            }            

            //Force system fonts for mobile
            if(Config::get('speed_code', 'system_fonts') === 'true') {
                $dom = self::add_mobile_system_fonts($dom);
            }                   

            //Do code insertions
            $dom = self::code_insertions($dom);        

            //Do page preloaders
            $dom = self::add_page_preloaders($dom);
            
            //Refresh dom so gtag can process and code insertions
            $dom = self::refresh_dom($dom);            

            //add self hosted gtag
            if(Config::get('external_scripts','gtag_locally') === "true") {
                $dom = self::add_gtag($dom);
            }     

            //add invisible elements and ensure their onload restoration
            //if delay JS is active 
            //(otherwise it'll hide elements JS relies on)
            if(Config::get('speed_js','delay_js') === "true" || Config::get('speed_code','preload_image') != "") {
                
                //Don't add them in if we have non-delayed scripts that might need that HTML immediately
                if(trim(Config::get('speed_js','delay_exclude')) == "js-extra" || Config::get('speed_js','delay_exclude') == "") {
                    $dom = self::add_invisible_elements($dom);  
                }
                
                //Ensure onload restore of content and images
                $dom = self::set_onload($dom);            
            }
            
            //add intersection
            $dom = self::add_intersection_observer($dom);            
            
            //Add CRF token
            $dom = self::add_csrf_token($dom);                 
            
            //Refresh dom
            $dom = self::refresh_dom($dom);
            //Add image lazy loading //requires dom refresh
            $dom = self::add_image_lazyload($dom);       
            
            //Make sure viewport is declared before preloads
            $dom = self::move_viewport_to_top($dom);

            $html = $dom->outertext;

            $end_time = microtime(true);
            $elapsed_time = $end_time - $start_time;
            $html .=  "<!-- Optimised By                                                        
   _______  ___________  __________  _____  ___  ____________
  / __/ _ \/ __/ __/ _ \/  _/ __/\ \/ / _ \/ _ \/ __/ __/ __/
 _\ \/ ___/ _// _// // // // _/   \  / ___/ , _/ _/_\ \_\ \  
/___/_/  /___/___/____/___/_/     /_/_/  /_/|_/___/___/___/  v" . SPRESS_VER . "

Performance optimization toolkit | speedifypress.com                                                               
----
HTML " . number_format($elapsed_time,2) . "-->";

        } 


        return $html;

    }

    /**
     * Add page preloading to the HTML output.
     *
     * Will either add instant page preloading, or quicklink preloading, depending on the settings.
     *
     * Instant page preloading will preload all links on hover, while quicklink preloading will only preload cached links and do so in an intelligent manner, using a throttle and only preloading links that are in the viewport.
     *
     * @param HtmlDocument $dom The HTML output.
     * @return HtmlDocument The modified HTML output.
     */
    public static function add_page_preloaders($dom) {
        
        $preloader_mode = Config::get('speed_cache', 'page_preload_mode');
        if($preloader_mode == "disabled") {
            return $dom;
        }

        //Both modes use instant page
        $prefetch_src = SPRESS_PLUGIN_URL . 'assets/instant_page/instant_page.min.js';
        
        //Add before body end
        $body = $dom->find('body', 0);
        $scriptElement = $dom->createElement('script');
        $scriptElement->src = $prefetch_src;
        $scriptElement->setAttribute('type', 'module');
        $scriptElement->setAttribute('rel', 'js-instantpage');//            
        $body->appendChild($scriptElement);           
  
        
        //Preload in viewport with throttle and only cached links
        if($preloader_mode == "intelligent") {

            $prerender_src = SPRESS_PLUGIN_URL . 'assets/quicklink/quicklink.umd.js';
            $link_tagger_js = file_get_contents(SPRESS_PLUGIN_DIR . '/assets/quicklink/link_tagger.js');
            $cached_uri_list = Speed::get_root_cache_url() . '/'. Cache::get_cached_uris_filename() . "?" . time();

            //Minify it
            $minifier = new Minify\JS($link_tagger_js);
            $link_tagger_js = $minifier->minify();            
            
            //Add before body end
            $body = $dom->find('body', 0);
            $scriptElement = $dom->createElement('script');
            $scriptElement->src = $prerender_src;
            $scriptElement->setAttribute('rel', 'js-quicklink');
            $body->appendChild($scriptElement);      

            $scriptElement = $dom->createElement('script');
            $scriptElement->setAttribute('rel', 'js-quicklink');
            $scriptElement->innertext = "window.spdy_cached_uris = '" . ($cached_uri_list) . "';" . $link_tagger_js;
            $body->appendChild($scriptElement);

            
        }

        return $dom;

    }

    
    /**
     * Rewrites <link> tags that point to Google Fonts, by fetching the CSS, 
     * rewriting the font URLs to local files, storing both CSS and fonts, 
     * and then swapping the href to the locally cached CSS.
     * 
     * @param HtmlDocument $dom The HTML document.
     * @return HtmlDocument The modified HTML document.
     */
    private static function proxy_google_fonts($dom) {

        // Find all <link rel="stylesheet" href="https://fonts.googleapis.com/...">
        foreach ($dom->find('link') as $link) {
            $rel  = strtolower($link->getAttribute('rel') ?? '');
            $href = $link->getAttribute('href') ?? '';

            // allow empty/missing rel  and preload-as-style
            if (!$href) continue;
            $as = strtolower($link->getAttribute('as') ?? '');
            if ($rel && $rel !== 'stylesheet' && !($rel === 'preload' && $as === 'style')) continue;

            // accept protocol-relative URLs too: //fonts.googleapis.com/...
            if (!preg_match('@^(https?:)?//fonts\.googleapis\.com/@i', $href)) continue;

            // normalize protocol-relative to https for caching consistency
            if (strpos($href, '//') === 0) {
                $href = 'https:' . $href;
            }

            // Build (or reuse) a local CSS file for this exact Google CSS URL
            $localCssUrl = self::build_local_gfonts_css($href);
            if ($localCssUrl) {
                // Swap the href to your locally cached CSS
                $link->setAttribute('href', $localCssUrl);
                if ($rel === 'preload') {
                    $link->setAttribute('rel', 'stylesheet');
                    $link->removeAttribute('as');
                }                
                
                // Remove any preconnects or dns-prefetch to Google's font hosts
                foreach ($dom->find('link') as $plink) {
                    $preRel = strtolower($plink->getAttribute('rel') ?? '');
                    $preHref = $plink->getAttribute('href') ?? '';
                    if (($preRel === 'preconnect' || $preRel === 'dns-prefetch' || $preRel === 'preload') && preg_match('@fonts\.(gstatic|googleapis)\.com@i', $preHref)) {
                        $plink->outertext = '';
                    }
                }
            }
        }

        return $dom;
    }


    /**
     * Given a Google Fonts CSS URL, build a local version of that CSS by
     * fetching the CSS, rewriting the font URLs to local files, storing both
     * CSS and fonts, and then returning the locally cached CSS URL.
     *
     * @param string $remoteCssUrl The Google Fonts CSS URL (e.g. https://fonts.googleapis.com/css?family=...)
     * @return string The locally cached CSS URL, or null if failed to fetch
     */
    private static function build_local_gfonts_css(string $remoteCssUrl) {
        // Cache directories
        $basePath = self::get_pre_cache_path() . '/gfonts';
        $baseUrl  = self::get_pre_cache_url()  . '/gfonts';

        // Ensure directory
        if (!is_dir($basePath)) {
            @wp_mkdir_p($basePath);
        }

        // Include UA in the key because Google Fonts serves different CSS per UA
        $ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
        $key = md5($remoteCssUrl . '::' . $ua);

        $cssFilename = "gf-$key.css";
        $cssPath     = "$basePath/$cssFilename";
        $cssUrl      = "$baseUrl/$cssFilename";

        // Short-circuit if exists
        if (file_exists($cssPath)) {
            return $cssUrl;
        }

        // Fetch remote CSS (preserve UA & Accept to get same content the browser would)
        $args = [
            'headers' => [
                'User-Agent' => $ua,
                'Accept'     => 'text/css,*/*;q=0.1'
            ],
            'timeout' => 15,
        ];
        $resp = wp_remote_get($remoteCssUrl, $args);
        if (is_wp_error($resp)) return null;

        $css = wp_remote_retrieve_body($resp);
        if (!$css || stripos($css, '@font-face') === false) return null;

        // Rewrite: download each fonts.gstatic.com URL to local .woff/.woff2 and swap URL in CSS
        $rewrittenCss = self::rewrite_gfonts_css_urls($css, $basePath, $baseUrl);

        // Force font-display:swap on all @font-face rules.
        $rewrittenCss = preg_replace(
            '/font-display\s*:\s*[^;}\s]+(\s*!important)?\s*([;}])/i',
            'font-display:swap$1$2',
            $rewrittenCss
        );        

        // Optionally force display=swap if not already in the CSS
        if (strpos($rewrittenCss, 'font-display:') === false) {
            // lightweight injection just after each @font-face {
            $rewrittenCss = preg_replace('/(@font-face\s*{)/i', "$1font-display:swap;", $rewrittenCss);
        }

        // Minify and write CSS
        $minifier = new Minify\CSS($rewrittenCss);
        $minified = $minifier->minify();
        file_put_contents($cssPath, $minified, LOCK_EX);

        return $cssUrl;
    }

    /**
     * Finds url(https://fonts.gstatic.com/...) entries, downloads locally, and returns CSS with local URLs.
     */
    private static function rewrite_gfonts_css_urls(string $css, string $basePath, string $baseUrl): string {

        // Make sure font directory exists
        $fontDir  = "$basePath/files";
        $fontUrl  = "$baseUrl/files";
        if (!is_dir($fontDir)) {
            @wp_mkdir_p($fontDir);
        }

        // Match url(...) capturing .woff2 or .woff
        $pattern = '/url\(\s*(["\']?)(https?:\/\/fonts\.gstatic\.com\/[^)\'"]+\.(?:woff2?|ttf))(?:\?[^)\'"]*)?\1\s*\)/i';

        $rewritten = preg_replace_callback($pattern, function ($m) use ($fontDir, $fontUrl) {
            $remote = $m[2];

            // Build deterministic local filename (preserve extension)
            $ext = strtolower(pathinfo(wp_parse_url($remote, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'woff2');
            $name = 'gf-' . md5($remote) . '.' . $ext;
            $localPath = "$fontDir/$name";
            $localUrl  = "$fontUrl/$name";

            // Download if missing
            if (!file_exists($localPath)) {
                $args = [
                    'headers' => [
                        // No referer required; include UA to avoid weird variants
                        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                        'Accept'     => 'font/woff2,*/*;q=0.1'
                    ],
                    'timeout' => 20,
                ];
                $resp = wp_remote_get($remote, $args);
                if (!is_wp_error($resp)) {
                    $body = wp_remote_retrieve_body($resp);
                    if ($body) {
                        file_put_contents($localPath, $body, LOCK_EX);
                        // Try to set correct mime via .htaccess or headers (see notes below)
                    }
                }
            }

            // Replace original URL with local URL (quote as in original)
            $quote = $m[1] ?: '"';
            return 'url(' . $quote . $localUrl . $quote . ')';
        }, $css);

        return $rewritten;
    }


    /**
     * Add mobile system fonts to the document. This adds a style to the head of the document
     * which sets the font-family of all h1-5, p and non-icon elements to the browser's
     * default sans-serif font. This is useful for performance optimization on mobile devices.
     *
     * @param \simplehtmldom\HtmlDocument $dom
     * @return void
     */
    public static function add_mobile_system_fonts($dom) {

        // Create a new style element
        $styleElement = $dom->createElement('style');
        $mobile_opt_css = ':root {
            --spdy-ui-font: -apple-system, system-ui, BlinkMacSystemFont,"Segoe UI", Roboto, "Helvetica Neue", Arial,"Noto Sans", "Liberation Sans", sans-serif;
            }

            @layer spdy-ui-mobile {

                @media (max-width: 800px){

                    /* Apply to common *textual* elements only, with broad exclusions */
                    :where(
                        h1, h2, h3, h4, h5, h6,
                        [class*="heading" i],
                        p, small, strong, em, mark,
                        ul, ol, li, dl, dt, dd,
                        blockquote, figcaption,
                        table, th, td,
                        a, span, label,
                        button, input, select, textarea
                    ):not(
                        /* exclude icon/glyph fonts */
                        .fa, [class^="fa-"], [class*=" fa-"],
                        .material-icons, [class*="material-"],
                        .mdi, [class^="mdi-"], [class*=" mdi-"],
                        .bi, [class^="bi-"], [class*=" bi-"],
                        .ri, [class^="ri-"], [class*=" ri-"],
                        .ti, [class^="ti-"], [class*=" ti-"],
                        .bx, [class^="bx-"], [class*=" bx-"],
                        .lnr, [class^="lnr-"], [class*=" lnr-"],
                        .oi, [class^="oi-"], [class*=" oi-"],
                        .ai, [class^="ai-"], [class*=" ai-"],
                        .wi, [class^="wi-"], [class*=" wi-"],
                        [class^="pe-7s"], [class*=" pe-7s"],
                        .iconfont, [class*="iconfont"],
                        /* generic catch-alls (last) */
                        [class^="icon-"], [class*=" icon-"], [class$="-icon"], [class*="-icon "], [class*="-icon-"],
                        /* exclusions */
                        code, pre, kbd, samp, svg, math
                    ) {
                        font-family: var(--spdy-ui-font) !important;
                        text-rendering: optimizeLegibility;
                        -webkit-text-size-adjust: 100%;
                    }

                    /* Preserve monospace where it matters */
                    :where(code, pre, kbd, samp) {
                        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas,"Liberation Mono", "Courier New", monospace;
                    }

                }
            }';

        $minifier = new Minify\CSS($mobile_opt_css);
        $mobile_opt_css = $minifier->minify();             

        $styleElement->innertext = $mobile_opt_css;

        // Append the script element directly to the head
        $headElement = $dom->find('head', 0);
        if($headElement) {
            $headElement->children(0)->outertext = $styleElement->outertext . $headElement->children(0)->outertext;        
        }        

        return $dom;

    }    

    /**
     * Refreshes the simple_html_dom object
     *
     * It appears that simple_html_dom does not allow you to modify the DOM
     * once it has been loaded. This function works around this limitation by
     * extracting the HTML from the current DOM, and then loading it back into
     * a new simple_html_dom object.
     *
     * @param object $dom The simple_html_dom object to be refreshed
     * @return object The refreshed simple_html_dom object
     */
    private static function refresh_dom($dom) {
        
        $html = $dom->outertext;
        $dom = (new HtmlDocument(""))->load($html,true, false);   

        return $dom;

    }

    /**
     * Ensure <meta name="viewport"> is the first child of <head>, before any preloads.
     *
     * @param \simplehtmldom\HtmlDocument $dom
     * @return \simplehtmldom\HtmlDocument
     */
    private static function move_viewport_to_top($dom) {

        $head = $dom->find('head', 0);
        if (!$head) return $dom;

        // Capture existing viewport meta (if any), remove all occurrences
        $viewportHtml = '';
        foreach ((array)$dom->find('meta') as $m) {
            $nameAttr = strtolower(trim($m->getAttribute('name') ?? ''));
            if ($nameAttr === 'viewport') {
                if ($viewportHtml === '') {
                    $viewportHtml = $m->outertext; // keep the first found as source
                }

                $dom->outertext = str_replace($viewportHtml, '', $dom->outertext);                

            }
        }

        if($viewportHtml) {
            $dom->outertext = preg_replace("@<head( ([^>]+))?>@", "<head$2>" . $viewportHtml, $dom->outertext, 1);
        }

        return $dom;
    }


    /**
     * Adds lazy loading to images in the given HTML.
     *
     * This function is only applied if the 'preload_image' config option is set.
     * It will add lazy loading to all images except those that are skipped
     * according to the 'skip_lazyload' config option.
     *
     * @param object $dom The HTML DOM object to be modified.
     * @return object The modified HTML DOM object.
     */
    private static function add_image_lazyload($dom) {

        //Only continue if placeholder set
        $placeholder = Config::get('speed_code', 'preload_image');
        if(!$placeholder) {
            return $dom;
        }   

        //Get images forced to be lazyload
        $force_lazyload = trim(Config::get('speed_code', 'force_lazyload'));
        $forced_file_names = ($force_lazyload !== '') ? preg_split('/\r\n|\r|\n/', $force_lazyload) : array();

        //Get lcp image if exists
        $lcp_image = CSS::get_lcp_image();

        $images = $dom->find('img');
        $preload = array();
        foreach ($images as $image) {

            //preload and skipped the configured images
            $do_skip = false;
            $skipped = trim(Config::get('speed_code', 'skip_lazyload'));
            if($skipped || $lcp_image) {
                $file_names = ($skipped !== '') ? preg_split('/\r\n|\r|\n/', $skipped) : array();

                //Add in the LCP image if exists
                if($lcp_image) {
                    $file_names[] = basename($lcp_image);
                }                

                // normalize attributes (avoid null warnings)
                $imgSrc    = isset($image->src) ? (string) $image->src : '';
                $imgSrcset = isset($image->srcset) ? (string) $image->srcset : '';

                foreach ((array) $file_names as $file_name) {
                    $file_name = trim((string) $file_name);
                    if ($file_name === '') {
                        continue;
                    }

                    //Make sure doesn't match one of the $forced_file_names
                    $skip_eager_load = false;
                    foreach ($forced_file_names as $forced_file_name) {
                        $forced_file_name = trim((string) $forced_file_name);
                        if(strstr(strtolower($file_name), strtolower($forced_file_name))) {
                            $skip_eager_load = true;
                        }
                    }
                    if($skip_eager_load) {
                        continue;
                    }

                    // Strip common WP size suffixes like -360x240 before matching
                    $srcset_no_sizes = $imgSrcset !== ''
                        ? preg_replace('@-[0-9]+x[0-9]+(?=\.)@', '', $imgSrcset)
                        : '';                                         

                    if (
                        ($imgSrc !== '' && stripos($imgSrc, $file_name) !== false) ||
                        ($imgSrcset !== '' && stripos($imgSrcset, $file_name) !== false) ||
                        ($srcset_no_sizes !== '' && stripos($srcset_no_sizes, $file_name) !== false)
                    ) {
                        $preload[$imgSrc] = array(
                            "src"          => $imgSrc,
                            "imagesrcset"  => ($imgSrcset !== '' ? $imgSrcset : null),
                        );
                        $do_skip = true;
                        $image->setAttribute('loading', 'eager');
                        $image->setAttribute('fetchpriority', 'high');
                        $image->setAttribute('decoding', 'async');
                        break; // already matched, no need to check other names
                    }
                }


            }

            if($do_skip == true) {
                continue;
            }
            
            // get src attribute
            $src = $image->src;

            //Skip if no src
            if(!$src) {
                continue;
            }            

            //Not needed for SVG
            if(self::is_svg($src)) {
                continue;
            }

            //Not needed for logged in exception images
            if($image->hasClass('logged_in_exception')) {
                continue;
            }

            //Add a class that allows these to be skipped
            if($image->hasClass('lazyload_exception')) {
                continue;
            }            

            // Get width and height
            $dimensions = self::get_dimensions($src, $image);

            //Get aspect ratio
            $width = $dimensions['width'] ?? false;
            $height = $dimensions['height'] ?? false;

            //No height found
            if($height != false && $height <= 0) {
                continue;
            }

            //Add image attributes           
            $image->setAttribute('data-lazy-src',$image->src);
            $image->src = $placeholder;
            if(!$image->width && $width == true) {
                $image->width = $width;
            }
            if(!$image->height && $height == true) {
                $image->height = $height;
            }
            $image->setAttribute('data-lazy-srcset',$image->srcset);
            $image->setAttribute('srcset','');
            $image->setAttribute('loading','lazy');
            $image->setAttribute('fetchpriority','low');

            //Add preload
            $preload[$placeholder] = array("src"=>$placeholder,"imagesrcset"=>$image->srcset ?? null);

        }

        //Add the preloads
        $preload_html = "";
        foreach($preload AS $src=>$image) {

           $preload_html .= "\n<link rel='preload' href='" . $image['src'] . "' as='image' fetchpriority='high' imagesrcset='" . $image['imagesrcset'] ."' imagesizes='' />";

        }

        // Add directly after the *first* </title>
        $dom->outertext = preg_replace(
            '/<\/title>/',
            '</title>' . $preload_html,
            $dom->outertext,
            1
        );

        return $dom;

    }

    /**
     * Attempts to extract dimensions from a given image URL or file path.
     *
     * Checks for the following in order:
     * 1. Dimensions in the file name (e.g. image-800x600.jpg)
     * 2. Local file in /wp-content/uploads/ (uses getimagesize() if not SVG)
     * 3. URL (uses getimagesize() if possible)
     * 4. Data URL (uses getimagesizefromstring() if possible)
     *
     * @param string $src The URL or file path of the image
     *
     * @return array|null An array with 'width' and 'height' keys with integer values, 
     * or null if no dimensions could be determined
     */
    private static function get_dimensions($src, $image) {

        //Check if already has width and height
        if(isset($image->width) && isset($image->height)) {
            return [
                'width' => (int)$image->width,
                'height' => (int)$image->height
            ];
        }

        // Check if dimensions can be extracted from the file name
        if (preg_match('/(\d+)x(\d+)/', $src, $matches)) {
            return [
                'width' => (int)$matches[1],
                'height' => (int)$matches[2]
            ];
        }
    
        // Handle local files in /wp-content/uploads/
        $upload_dir_parts =  wp_get_upload_dir();
        $uploads_dir = str_replace(ABSPATH,"",$upload_dir_parts['basedir']); //just the wp-content/uploads bit
        
        //get relative path of the image
        $image_relative_path = wp_parse_url($src, PHP_URL_PATH);        

        //Remove the wp-content/uploads 
        $image_relative_path = str_replace($uploads_dir,"",$image_relative_path);

        //Add onto the full path for the wp-uploads dir (which contains wp-content/uploads)
        $local_path = $upload_dir_parts['basedir'] . $image_relative_path;
        
        if (file_exists($local_path)) {
            $size = getimagesize($local_path);
            if ($size) {
                return [
                    'width' => $size[0],
                    'height' => $size[1]
                ];
            }
        }
    
        // Handle URLs
        /*if (filter_var($src, FILTER_VALIDATE_URL)) {

            try {
                $size = getimagesize($src);
                if ($size) {
                    return [
                        'width' => $size[0],
                        'height' => $size[1]
                    ];
                }
            } catch (Exception $e) {
                return null;
            }

        }*/ //too slow! needs caching
    
        // Handle data URLs
        if (strpos($src, 'data:image') === 0) {
            $data = explode(',', $src);
            if (isset($data[1])) {
                $image_data = base64_decode($data[1]);
                $size = getimagesizefromstring($image_data);
                if ($size) {
                    return [
                        'width' => $size[0],
                        'height' => $size[1]
                    ];
                }
            }
        }
    
        // Return null if no dimensions could be determined
        return null;
    }
    
    /**
     * Checks if the given string is an SVG file or data URL.
     * @param string $src The string to check.
     * @return bool True if the string is an SVG file or data URL.
     */
    private static function is_svg($src) {
        return preg_match('/\.svg$/i', $src) || strpos($src, 'image/svg+xml') !== false;
    }
    

	/**
	 * Save an image from a data URL to a file
	 *
	 * @param string $dataUrl The data URL, e.g. "data:image/png;base64,iVBORw0KGg..."
	 * @param string $outputPath The path to save the image to, e.g. "/path/to/image.png"
	 * @return string The saved file path, or throw an Exception on error
	 * @throws Exception If the data URL is invalid, the output path is invalid, or the file cannot be written
	 */
	public static function save_data_image($dataUrl, $outputDirectory) {

		// Validate the data URL
		if (preg_match('/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,/', $dataUrl, $type)) {

			$data = substr($dataUrl, strpos($dataUrl, ',') + 1);
			$type = strtolower($type[1]); // Extract the image type (e.g., jpg, png, svg+xml)
	
			// Decode the base64 data
			$data = base64_decode($data);
	
			if ($data === false) {
				throw new \Exception('Base64 decode failed.');
			}
	
			// Normalize file type for SVG
			if ($type === 'svg+xml') {
				$type = 'svg';
			}
	
			// Validate the file type
			if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
				throw new \Exception('Invalid image type.');
			}
	
			// Ensure the output directory exists
			if (!is_dir($outputDirectory)) {
				if (!wp_mkdir_p($outputDirectory)) {
					throw new \Exception(esc_html("Failed to create directory: $outputDirectory"));
				}
			}

            // -------------------------------------------------------------------
            // Simple validation: ensure the output directory resolves inside the
            // plugin's pre-cache path.  This prevents directory traversal or writes
            // outside of the intended cache.  realpath() resolves symlinks and
            // relative components; if resolution fails or the path doesn't start
            // with the allowed base, throw an exception.
            if ( $outputDirectory ) {
                $resolved_dir = realpath( $outputDirectory );
                $allowed_base = realpath( self::get_pre_cache_path() );
                if (
                    $resolved_dir === false ||
                    $allowed_base === false ||
                    strpos( $resolved_dir, rtrim( $allowed_base, DIRECTORY_SEPARATOR ) ) !== 0
                ) {
                    throw new \Exception( esc_html( 'Invalid output directory: ' . $outputDirectory ) );
                }
            }
            // -------------------------------------------------------------------

			// Generate a unique file name with the appropriate extension
			$fileName = uniqid('image_', true) . '.' . $type;
			$outputPath = rtrim($outputDirectory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;
	
			// Save the file
			if (file_put_contents($outputPath, $data)) {
				return $outputPath; // Return the saved file path
			} else {
				throw new \Exception(esc_html("Failed to write file: $outputPath"));
			}
		} else {
			return $dataUrl;
		}
	}

    /**
     * Retrieves the current uri
     *
     * @return string The full URL, with ignored query strings removed.
     */
    public static function get_uri($get_original=true) {

        //Get the request URI before plugins may have messed with it
        if(class_exists("SPRESS\\AdvancedCache")
        && isset(AdvancedCache::$original_uri)
        && $get_original) {
            $raw = AdvancedCache::$original_uri;
        } else {
            //Directly grab from $_SERVER, cast to string, default to “/” if missing
            $raw = self::server_var('REQUEST_URI', '/');
        }
    
        $safe = self::get_sanitized_uri($raw);
    
        return $safe;


    }

    /**
     * Cleans an arbitrary URL fragment  and returns
     * a fully-qualified, sanitized URL pointing to this site.
     *
     * @param  string $raw  The raw URL or URI fragment to sanitize.
     * @return string       A full, safe URI fragment.
     */
    public static function get_sanitized_uri(string $raw): string
    {
        // 1. Strip null bytes and ASCII control characters
        $raw = preg_replace('/[\x00-\x1F\x7F]/u', '', $raw) ?: '';
    
        // 2. Parse into components so we only ever honor path + query
        $parts = self::safe_parse_url($raw);
        $path  = $parts['path']  ?? '/';
        $query = isset($parts['query']) ? '?' . $parts['query'] : '';
        $hadTrailingSlash = ($path !== '/' && substr($path, -1) === '/');
    
        // 3. Normalize percent-encoding
        //    a) Decode once
        $path = rawurldecode($path);
        //    b) Replace backslashes and collapse "../" and "." segments
        $path = str_replace('\\', '/', $path);
        $segments = explode('/', ltrim($path, '/'));
        $normalized = [];
        foreach ($segments as $seg) {
            if ($seg === '' || $seg === '.') {
                continue;
            }
            if ($seg === '..') {
                array_pop($normalized);
            } else {
                $normalized[] = $seg;
            }
        }
        //    c) Re-encode each segment to block sneaky bytes
        $encoded = array_map('rawurlencode', $normalized);
        $path    = '/' . implode('/', $encoded);
        if ($hadTrailingSlash && $path !== '/') {
            $path .= '/';
        }
    
        // 4. Rebuild the relative URL
        $relative = $path . $query;
    
        // 5. Final sanitization for output (HTML headers, attributes, etc.)
        //    - FILTER_SANITIZE_URL strips invalid URL chars
        $relative = filter_var($relative, FILTER_SANITIZE_URL);
        return $relative;
    }
    

    /**
     * Retrieves the current full url, optionally removing ignored query strings.
     *
     * If self::$ignore_querystrings is set, the method parses the query string
     * and removes any key specified in the list.
     * 
     * @param bool $get_original whether to use the original url before anything may have modded it
     *
     * @return string The full URL, with ignored query strings removed.
     */
    public static function get_url($get_original=true) {

        //Allow URL overrides 
        if(isset(self::$injected_url)) {
            return self::$injected_url;
        }

        $request_uri = self::get_uri($get_original);

        // Determine protocol and host.
        $https    = strtolower(self::server_var('HTTPS', ''));
        $protocol = ($https !== '' && $https !== 'off') ? "https://" : "http://";
        $host     = self::server_var('HTTP_HOST', '');
        $full_url = $protocol . $host . $request_uri;


        // Remove query strings that should be ignored.
        if (!empty(Cache::$ignore_querystrings)) {
            $ignore_keys = array_filter(array_map('trim', explode("\n", Cache::$ignore_querystrings)));
            $parsed_url = self::safe_parse_url($full_url);
            if ($parsed_url === false) { $parsed_url = []; } // avoid "array offset on bool"
            $query = [];
            if (isset($parsed_url['query'])) {
                parse_str($parsed_url['query'], $query);
                foreach ($ignore_keys as $key) {
                    if (isset($query[$key])) {
                        unset($query[$key]);
                    }
                }
            }
            // Rebuild the query string.
            $query_string = http_build_query($query);
            $full_url = $protocol . $host . ($parsed_url['path'] ?? '') . ($query_string ? '?' . $query_string : '');

        }
        return $full_url;
    }    

    /**
     * Retrieves the cache path for a given URL.
     *
     * @param string $url The URL for which to retrieve the cache path.
     * @return string The cache path for the given URL.
     */
    public static function get_cache_dir_from_url($url) {

        // Remove any unnecessary query strings using get_clean_url().
        $clean_url = self::get_clean_url($url);
    
        // Extract the relative path from the clean URL.
        $relative_path = self::safe_parse_url($clean_url, PHP_URL_PATH);
        $relative_path = is_string($relative_path) ? $relative_path : '';
        // Normalize and sanitize path segments
        $relative_path = self::get_sanitized_uri($relative_path);
        $relative_path = trim($relative_path, '/') ? trim($relative_path, '/') : "";
    
        // Parse the query parameters from the clean URL.
        $parsed_url = self::safe_parse_url($clean_url);
        $query_array = [];
        if (isset($parsed_url['query'])) {
            parse_str($parsed_url['query'], $query_array);
        }
    
        // Remove any ignored keys.
        $ignore_keys = array_filter(array_map('trim', explode("\n", (string) (Cache::$ignore_querystrings ?? ''))), 'strlen');
        $query_strings = array_diff_key($query_array, array_flip($ignore_keys));    
        
        // Build a directory-safe string from the remaining query parameters.
        $query_dir = "";
        if (!empty($query_strings)) {
            $safe_query_parts = [];
            foreach ($query_strings as $key => $value) {
                // Sanitize both key and value to allow only alphanumerics, underscores, and dashes.
                $safe_key = preg_replace('/[^A-Za-z0-9_\-]/', '', $key);
                $safe_value = preg_replace('/[^A-Za-z0-9_\-]/', '', $value);
                $safe_query_parts[] = $safe_value !== '' ? $safe_key . '-' . $safe_value : $safe_key;
            }
            // Join the parts with a dash.
            $query_dir = implode('-', $safe_query_parts);
        }
    
        // Build the base cache directory from the root.
        $base = rtrim(Speed::get_root_cache_path(), '/');
        // If there's a relative path, append it; otherwise, use the base as-is.
        $cache_dir = $relative_path !== "" ? $base . '/' . $relative_path : $base;
        // If query parameters exist, add them as an extra directory.
        if ($query_dir !== "") {
            $cache_dir .= '/' . $query_dir;
        }

        //Ensure ends with trailing slash
        $cache_dir = rtrim($cache_dir, '/') . '/';

        return $cache_dir;
  
    }   


     
    /**
     * Build and return the full URL after stripping ignored query strings.
     *
     * @return string The cleaned full URL.
     */
    public static function get_clean_url($full_url = null, $ignore_querystrings=null) {

        //Allow ignore querystrings to be passed
        if(!$ignore_querystrings) {
            $ignore_querystrings = Cache::$ignore_querystrings;
        }

        if (!$full_url) {
            $https       = strtolower(self::server_var('HTTPS', ''));
            $protocol    = ($https !== '' && $https !== 'off') ? 'https://' : 'http://';
            $host        = self::server_var('HTTP_HOST', '');
            $request_uri = self::server_var('REQUEST_URI', '');
            $request_uri = self::get_sanitized_uri($request_uri);
            $full_url    = $protocol . $host . $request_uri;
        } else {
            $parsed = self::safe_parse_url($full_url);
            $protocol = isset($parsed['scheme']) ? $parsed['scheme'] . '://' : 'http://';
            $host = isset($parsed['host']) ? $parsed['host'] : '';
        }
    
        // Remove ignored query strings.
        if (!empty($ignore_querystrings)) {
            $ignore_keys = array_filter(array_map('trim', explode("\n", $ignore_querystrings)));
            $parsed_url  = self::safe_parse_url($full_url);
            $query       = [];
            if (isset($parsed_url['query'])) {
                parse_str($parsed_url['query'], $query);
                foreach ($ignore_keys as $key) {
                    if (isset($query[$key])) {
                        unset($query[$key]);
                    }
                }
            }
            $query_string = http_build_query($query);
            $path = isset($parsed_url['path']) ? $parsed_url['path'] : '';
            $full_url = $protocol . $host . $path . ($query_string ? '?' . $query_string : '');
        }
        return $full_url;
    }
    

    /**
     * Purges the cache file(s) for a given URL.
     *
     *
     * @param string $url The URL for which to purge the cache.
     */
    public static function purge_cache($url, $file_types = array("html", "gz")) {

        // Check not already purged
        if (isset(Speed::$done_purge[$url.implode('',$file_types)])) {
            return;
        }
    
        // Get the file path from the URL
        $cache_path = self::get_cache_dir_from_url($url);
    
    
        // Delete files
        Speed::deleteSpecificFiles($cache_path, $file_types);
    
        // Additionally, check the lookup_uris.json for modified URLs corresponding to the original URL.
        $lookup_file = Speed::get_root_cache_path() . "/lookup_uris.json";
        if (file_exists($lookup_file)) {
            $contents = file_get_contents($lookup_file);
            $current_lookup = $contents ? json_decode($contents, true) : [];

            // If the lookup contains our original URL as a key...
            if (isset($current_lookup[$url]) && is_array($current_lookup[$url])) {
                foreach ($current_lookup[$url] as $modified_url => $flag) {
                    // Get the cache directory for the modified URL.
                    if($modified_url) {
                        $modified_cache_path = self::get_cache_dir_from_url($modified_url);
                        Speed::deleteSpecificFiles($modified_cache_path, $file_types);
                    }
                }
            }
        }
    
        // Save as purged
        Speed::$done_purge[$url.implode('',$file_types)] = true;


    }
    

    /**
     * Deletes all files and subfolders in a given directory.
     *
     * @param string $dir The path to the directory to delete.
     * @param array $extensions array of extensions to delete
     *
     * @return void
     */
    public static function deleteSpecificFiles($dir, $patterns,  $recursive = false) {

        // Normalize and validate the directory path. Resolve any symlinks and
        // ensure it is within an expected cache directory. Using realpath()
        // mitigates directory-traversal attempts (e.g., "../../").
        $resolved_dir = realpath( $dir );
        if ( $resolved_dir === false || ! is_dir( $resolved_dir ) ) {
            return;
        }
        $root_cache = realpath( Speed::get_root_cache_path() );
        $pre_cache  = realpath( Speed::get_pre_cache_path() );
        if ( $root_cache === false || $pre_cache === false ) {
            return;
        }
        // Ensure the directory is within one of the allowed cache directories.
        if ( strpos( $resolved_dir, $root_cache ) !== 0 && strpos( $resolved_dir, $pre_cache ) !== 0 ) {
            return;
        }
        // Use the resolved path for subsequent operations.
        $dir = $resolved_dir;

        // Normalize patterns for case-insensitive matching
        $patterns = array_map('strtolower', $patterns);

        if ($recursive) {
            // Iterate children first so we can remove empty directories
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($dir, \RecursiveDirectoryIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::CHILD_FIRST
            );
        } else {
            // Non-recursive iteration
            $iterator = new \FilesystemIterator($dir, \FilesystemIterator::SKIP_DOTS);
        }        

        foreach ($iterator as $fileInfo) {
            $path = $fileInfo->getRealPath();

            if ($fileInfo->isFile()) {
                $filename = strtolower($fileInfo->getFilename());

                // Delete files matching any of the patterns
                foreach ($patterns as $pattern) {
                    if (substr($filename, -strlen($pattern)) === $pattern) {
                        @wp_delete_file($path);
                        break;
                    }
                }

            } elseif ($fileInfo->isDir()) {
                $subPath = $fileInfo->getRealPath();
                $entries = [];
                // Gather remaining items in this directory
                foreach (new \FilesystemIterator($subPath, \FilesystemIterator::SKIP_DOTS) as $entry) {
                    $entries[] = $entry;
                }

                // If only one file named "update_required", remove it and the folder
                if (count($entries) === 1
                    && $entries[0]->isFile()
                    && strtolower($entries[0]->getFilename()) === 'update_required'
                ) {
                    @wp_delete_file($entries[0]->getRealPath());
                    self::remove_cache_directory($subPath);

                // Else if completely empty, just remove the folder
                } elseif (empty($entries)) {
                    self::remove_cache_directory($subPath);
                }
            }
        }

    }

    /**
     * Removes a cache directory via WP_Filesystem when available.
     *
     * @param string $path Directory path.
     * @return void
     */
    protected static function remove_cache_directory($path) {
        if (!is_string($path) || $path === '' || !is_dir($path)) {
            return;
        }

        global $wp_filesystem;
        if (!function_exists('WP_Filesystem')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }
        if (function_exists('WP_Filesystem')) {
            WP_Filesystem();
        }
        if (is_object($wp_filesystem) && method_exists($wp_filesystem, 'rmdir')) {
            $wp_filesystem->rmdir($path, false);
        }
    }
        
    /**
     * Generates a CSRF token that can be used to secure a form from
     * cross-site request forgery attacks.
     *
     * The token is a base64-encoded string that contains a 30-second
     * expiration timestamp and a 16-byte random value. The token is
     * signed using the HMAC-SHA256 algorithm and the NONCE_SALT secret
     * key.
     *
     * @return string A base64-encoded CSRF token.
     */
    public static function generate_csrf_token($url) {

        //Get token expiry time       
        if ( ! defined( 'SPRESS_CSRF_EXPIRY_SECONDS' ) ) {
            $csrf_expiry_seconds = Config::get('speed_css','csrf_expiry_seconds') ?? 30;
        } else {
            $csrf_expiry_seconds = SPRESS_CSRF_EXPIRY_SECONDS;
        }

        $secret_key = NONCE_SALT;

        //CSS token expiry
        $expiry = time() + $csrf_expiry_seconds; // Token expiry

        //Long token exiry (replacing woo tokens)
        $default_nonce_life = defined('DAY_IN_SECONDS') ? DAY_IN_SECONDS : 86400;
        $long_expiry = time() + (function_exists('apply_filters')
            ? (
                // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
                apply_filters('nonce_life', $default_nonce_life)
            )
            : $default_nonce_life);

        // Generate a random string
        $random = bin2hex(random_bytes(6)); 
        
        // Include a simple session binding .
        $session_binding = Cache::spdy_rest_session_identifier();       
        
        // Create an exact URL hash
        $url1 = Url::parse($url);        
        $reconstructedUrl1 = $url1->getScheme() . '://' . $url1->getHost() . rtrim($url1->getPath(), '/');
        $url_hash = substr(hash('sha256', $reconstructedUrl1), 0, 8); // short hash

        //Combine into single string
        $data = $expiry . ':' . $long_expiry . ':' . $random . ":" . $url_hash . ':' . $session_binding;

        // Create a signature using HMAC-SHA256.
        // Trim the signature to 32 bytes.
        $signature = substr(hash_hmac('sha256', $data, NONCE_SALT), 0, 32);
        // Concatenate the data and the signature.
        $token = $data . ':' . $signature;
        // Base64 encode the token so it can be safely included in HTML.
        
        return base64_encode($token);
    }

    /**
     * Decodes and verifies a CSRF token.
     *
     * The token is expected to be a base64-encoded string in the format:
     *   expiry:random:url:signature
     * where the URL may itself contain colons.
     *
     * @param string $token The base64-encoded CSRF token.
     * @return array|false Returns an associative array with keys 'expiry', 'random', 'url', and 'signature'
     *                     if the token is valid and not expired. Returns false otherwise.
     */
    public static function decode_csrf_token($token, $expiry_type='short') {

        //Check token
        if(empty($token)) {
            return false;
        }

        //Set fail message
        $fail_message = "";

        // Decode the token from base64.
        $decoded = base64_decode($token, true);
        if ($decoded === false) {
            return false; // Invalid base64 encoding.
        }
        
        // Split the decoded string on colons.
        $parts = explode(':', $decoded);
        
        // We need at least 5 parts: expiry, random, url, uid, signature.
        if (count($parts) < 5) {
            $fail_message = "Malformed token";
        }
        
        // Extract the first part as expiry and the second as random.
        $expiry = array_shift($parts);
        $long_expiry = array_shift($parts);
        $random = array_shift($parts);
        $url = array_shift($parts);
        
        // The signature is the last element; the session binding is everything in between
        // safer if the url has a colon
        $signature = array_pop($parts);
        $token_session_binding = implode(':', $parts);
        
        //Test against current session
        $current_session_binding  = Cache::spdy_rest_session_identifier();

        // Check if the expiry is numeric and not in the past.
        if($expiry_type != "short") {
            $expiry_test = $long_expiry;
        } else {
            $expiry_test = $expiry;
        }

        //Test expiry
        if (!is_numeric($expiry_test) || time() > (int)$expiry_test) {
            $fail_message = "Token expired";
        }

        // Recompute the signature including the session binding.
        $data = $expiry . ':' . $long_expiry . ':' . $random . ':' . $url . ':' . $current_session_binding;

        //Get expected signature
        $expected_signature = substr(hash_hmac('sha256', $data, NONCE_SALT), 0, 32);
        
        // Use hash_equals to mitigate timing attacks.
        if (!hash_equals($expected_signature, $signature)) {

            //It's possible we've moved from a guest session to a logged in session
            //only the same page, no refresh, if so validate    
            // Recompute the signature with the old session binding.
            $guest_cookie = isset( $_COOKIE['spdy_guest'] ) ? sanitize_text_field( wp_unslash( $_COOKIE['spdy_guest'] ) ) : '';
            $data = $expiry . ':' . $long_expiry . ':' . $random . ':' . $url . ':' .  hash('sha256', 'sg:'. $guest_cookie);
            $expected_signature = substr(hash_hmac('sha256', $data, NONCE_SALT), 0, 32);

            if (!hash_equals($expected_signature, $signature)) {
                $fail_message = "Invalid signature ";
            }
        }
        
        // Return the token components if everything checks out.
        return [
            'expiry'         => (int)$expiry,
            'long_expiry'    => (int)$long_expiry,
            'random'         => $random,
            'url'            => $url,
            'signature'      => $signature,
            'fail_message'   => $fail_message
        ];
    }

    /**
     * Get the current request host without port, using server vars to avoid WP dependencies.
     *
     * @return string
     */
    public static function get_current_host() {
        $host = self::server_var('HTTP_HOST', self::server_var('SERVER_NAME', ''));
        if ($host && strpos($host, ':') !== false) {
            $host = explode(':', $host, 2)[0];
        }
        if ($host === '' && function_exists('site_url')) {
            $host = self::safe_parse_url(site_url(), PHP_URL_HOST) ?: '';
        }
        return $host;
    }

    /**
     * Check if a URL is same-origin as the current host (or a provided host).
     *
     * Allows relative URLs; rejects non-http(s) schemes.
     *
     * @param string $url
     * @param string|null $base_host
     * @return bool
     */
    public static function is_same_origin_url($url, $base_host = null) {
        if (!is_string($url) || $url === '') {
            return false;
        }
        $parts = self::safe_parse_url($url);
        if ($parts === false) {
            return false;
        }
        $scheme = $parts['scheme'] ?? '';
        if ($scheme && !in_array($scheme, ['http', 'https'], true)) {
            return false;
        }
        $host = $parts['host'] ?? '';
        if ($host === '') {
            return true; // relative URL
        }
        if ($host && strpos($host, ':') !== false) {
            $host = explode(':', $host, 2)[0];
        }
        $base = $base_host ?: self::get_current_host();
        if ($base === '') {
            return false;
        }
        return strcasecmp($host, $base) === 0;
    }

    /**
     * Normalize a URL to an absolute URL on the provided
     * origin
     *
     * @param string $url
     * @return string
     */
    public static function make_absolute_host_url($url, $host = null) {
        $parts = self::safe_parse_url($url);
        if ($parts === false) {
            return $url;
        }
        if (!empty($parts['scheme']) && !empty($parts['host'])) {
            return $url;
        }
        $host = $host ?: self::get_current_host();
        if ($host === '') {
            return $url;
        }
        $https = strtolower(self::server_var('HTTPS', ''));
        $scheme = ($https !== '' && $https !== 'off') ? 'https' : 'http';
        if (strpos($url, '//') === 0) {
            return $scheme . ':' . $url;
        }
        $path = ($url && $url[0] === '/') ? $url : '/' . ltrim($url, '/');
        return $scheme . '://' . $host . $path;
    }    

    ////////////////////////////
    /**
     * Optional extension hooks.
     *
     * Undefined calls for known extension methods are dispatched
     * to the extension class when available, otherwise they fall
     * back to the first argument (usually $html/$dom).
     */
    ////////////////////////////

    /**
     * Calls a method on the extension class if it exists, otherwise returns 
     * the given fallback value.
     *
     * @param string $method The name of the method to call.
     * @param array $args The arguments to pass to the method.
     * @param mixed $fallback The value to return if the method does not exist.
     * @return mixed The result of calling the method, or the fallback value.
     */
    private static function call_extension(string $method, array $args, $fallback) {

        $extension_class = \SPRESS\Speed\Extension::class;

        // is_callable covers both "class exists" and "method exists"
        if (is_callable([$extension_class, $method])) {
            return $extension_class::$method(...$args);
        }

        return $fallback;
    }

    public static function __callStatic($method, $args) {
        $fallback = array_key_exists(0, $args) ? $args[0] : null;
        return self::call_extension((string) $method, (array) $args, $fallback);
    }

}
