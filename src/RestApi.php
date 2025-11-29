<?php

namespace SPRESS;

use SPRESS\Speed;
use SPRESS\Dependencies\Wa72\Url\Url;

use WP_REST_Server;

/**
 * This `RestApi` class handles the registration and processing of custom REST API endpoints
 * for the SPRESS plugin.
 * 
 * @package SPRESS
 */
class RestApi {


    /**
     * Maximum allowed size (in bytes) for the compressed CSS payload.  If the
     * base64-decoded string exceeds this size, the request will be rejected
     * to protect the server from resource-exhaustion attacks.
     *
     * @var int
     */
    private static $max_css_compressed_bytes = 1048576; // 1 MB

    /**
     * Maximum allowed size (in bytes) for the uncompressed CSS payload after
     * gzdecode().  If the decompressed JSON exceeds this size, the request
     * will be rejected.  This helps prevent zip-bomb-style attacks that
     * expand to enormous sizes.
     *
     * @var int
     */
    private static $max_css_uncompressed_bytes = 2097152; // 2 MB

    /**
     * Initializes the class by registering the REST API routes.
     * Hooks into 'rest_api_init' to define all custom API endpoints.
     */
    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_rest_apis'));
    }

    /**
     * Registers the custom REST API routes. 
     * 
     */
    public static function register_rest_apis() {

        // REST route to update CSS submitted from the public side
        register_rest_route(
            'speedifypress',
            '/update_css/?',
            array(
                'methods' => 'POST',
                'callback' => array(__CLASS__, 'update_css'),
                'permission_callback' => '__return_true', // Public access
            )
        );

        // Restrict access to certain routes to authorized users
        if (!Auth::is_allowed()) {
            return;
        }

        // Register admin-only REST API routes for data retrieval
        $get_data_functions = array('dashboard','css');
        foreach ($get_data_functions as $data_type) {
            register_rest_route(
                'speedifypress',
                '/get_' . $data_type . '_data/?',
                array(
                    'methods' => array('GET', 'POST'),
                    'callback' => array(__CLASS__, 'get_' . $data_type . '_data'),
                    'permission_callback' => array('SPRESS\\Auth', 'admin_permission_callback'),
                )
            );
        }

        // Route for updating configuration by admin users
        register_rest_route(
            'speedifypress',
            '/update_config/?',
            array(
                'methods' => 'POST',
                'callback' => array(__CLASS__, 'update_config'),
                'permission_callback' => array('SPRESS\\Auth', 'admin_permission_callback'),
            )
        );

        // Route for clearing gfonts cache
        register_rest_route(
            'speedifypress',
            '/clear_gfonts_cache/?',
            array(
                'methods' => array('GET'),
                'callback' => array(__CLASS__, 'clear_gfonts_cache'),
                'permission_callback' => array('SPRESS\\Auth', 'admin_permission_callback'),
            )
        );   
        
        // Route for compressX actions
        register_rest_route(
            'speedifypress',
            '/handle_compressx/?',
            array(
                'methods' => array('GET'),
                'callback' => array(__CLASS__, 'handle_compressx'),
                'permission_callback' => array('SPRESS\\Auth', 'admin_permission_callback'),
            )
        );                      

        // Route for getting info on installed plugins
        register_rest_route(
            'speedifypress',
            '/get_compressx_data/?',
            array(
                'methods' => array('GET'),
                'callback' => array(__CLASS__, 'get_compressx_data'),
                'permission_callback' => array('SPRESS\\Auth', 'admin_permission_callback'),
            )
        );                   

        // Route for clearing unused CSS cache
        register_rest_route(
            'speedifypress',
            '/clear_css_cache/?',
            array(
                'methods' => array('GET'),
                'callback' => array(__CLASS__, 'clear_css_cache'),
                'permission_callback' => array('SPRESS\\Auth', 'admin_permission_callback'),
            )
        );  

        // Route for clearing page cache
        register_rest_route(
            'speedifypress',
            '/clear_page_cache/?',
            array(
                'methods' => array('GET'),
                'callback' => array(__CLASS__, 'clear_page_cache'),
                'permission_callback' => array('SPRESS\\Auth', 'admin_permission_callback'),
            )
        );  
        
        
        // Route for clearing unused CSS cache
        register_rest_route(
            'speedifypress',
            '/check_license/?',
            array(
                'methods' => array('POST'),
                'callback' => array(__CLASS__, 'check_license'),
                'permission_callback' => array('SPRESS\\Auth', 'admin_permission_callback'),
            )
        );          

        // Route for getting Cloudflare worker script
        register_rest_route(
            'speedifypress',
            '/get_cloudflare_script/?',
            array(
                'methods' => array('GET'),
                'callback' => array(__CLASS__, 'get_cloudflare_script'),
                'permission_callback' => array('SPRESS\\Auth', 'admin_permission_callback'),
            )
        );           

    }

    /**
     * Handles updating configuration settings.
     *
     * @param WP_REST_Request $request The request object containing config data.
     */
    public static function update_config($request) {

        $config = $request->get_json_params();

        // Validate that we received an array.  Malformed input yields a 400 error.
        if ( ! is_array( $config ) ) {
            return new \WP_Error(
                'invalid_config',
                'Invalid configuration data.',
                [ 'status' => 400 ]
            );
        }

        $config = self::transform_btoa($config);

        //Test and sanitize
        $config = App\Config::ensure_valid($config);

        //Test for array
        if ( ! is_array( $config ) ) {
            return new \WP_Error(
                'invalid_config',
                'Configuration validation failed.',
                [ 'status' => 400 ]
            );
        }        

        //See if allowed to enable
        if($config['config_key'] == "plugin"
            && ($config['plugin_mode'] == "enabled" || $config['plugin_mode'] == "partial")
        ) {
            
            //Check can download
            $can_download = App\License::get_download_link();
            if(!$can_download) {
                //Throw error
                return new \WP_Error(
                    'no_license',
                    'No license found. Please sign up for a free license to activate the plugin.',
                    [ 'status' => 403 ]
                );
            }

            // Check required PHP extensions when enabling the plugin.
            // mbstring: used by functions like mb_str_split() and mb_ord().
            if (!function_exists('mb_str_split') || !function_exists('mb_ord')) {
                return new \WP_Error(
                    'missing_mbstring',
                    'The PHP mbstring extension must be enabled to activate the plugin.',
                    ['status' => 500]
                );
            }
            // iconv: used by the Simple HTML DOM parser for character conversion.
            if (!function_exists('iconv')) {
                return new \WP_Error(
                    'missing_iconv',
                    'The PHP iconv extension must be enabled to activate the plugin.',
                    ['status' => 500]
                );
            }
            // zlib: required by gzdecode() to decompress CSS payloads.
            if (!function_exists('gzdecode')) {
                return new \WP_Error(
                    'missing_zlib',
                    'The PHP zlib extension (gzdecode) must be enabled to activate the plugin.',
                    ['status' => 500]
                );
            }            

            //Check permalinks enabled
            if(!get_option('permalink_structure')) {
                //Throw error
                return new \WP_Error(
                    'no_permalinks',
                    'Permalinks must be enabled to activate the plugin.',
                    [ 'status' => 403 ]
                );
            }

        }

        //Save the config
        App\Config::update_config($config);

        //If the config contains vars written
        //to the doc, update cache files
        Speed\CSS::update_config_to_cache($config);        
        Speed\JS::update_config_to_cache($config);   
        
    }


    /**
     * Retrieves dashboard data for admin users.
     *
     * @return array Dashboard data.
     */
    public static function get_dashboard_data() {
        $data = App\Dashboard::get_data();
        return $data;
    }


    public static function get_cloudflare_script() {

        $location = App\License::get_download_link(true);
        
        if ( $location ) {
            // Protect against SSRF by validating the host. Only allow the official domain.
            $host = parse_url( $location, PHP_URL_HOST );
            if ( $host !== 'speedifypress.com' ) {
                return false;
            }
            // Fetch the worker script using the WordPress HTTP API with a timeout.
            $response = wp_remote_get( $location, array( 'timeout' => 10 ) );
            if ( is_wp_error( $response ) ) {
                return false;
            }
            $contents = wp_remote_retrieve_body( $response );

            if ( strstr( $contents, 'this.csrf_salt' ) ) {
                // Replace this.csrf_salt = '{salt}'; with NONCE_SALT using preg_replace
                $contents = preg_replace('/this\.csrf_salt = \'(.*)\';/', 'this.csrf_salt = \'' . NONCE_SALT . '\';', $contents);
            }
            return $contents;

        }

        return false;
        
    }

    /**
     * Retrieves data on the unused CSS cache
     *
     * @return array Cache data.
     */
    public static function get_css_data() {
        $data['cache_data'] = Speed\CSS::get_cache_data();
        $data['stats_data'] = Speed\CSS::get_stats_data();        
        return $data;
    }

     /**
     * Clears the Google fonts cache directory.
     *
     * @return array Empty array (no data returned).
     */
    public static function clear_gfonts_cache() {      

        $basePath = Speed::get_pre_cache_path() . '/gfonts';
        Speed::deleteSpecificFiles($basePath,array("css","woff","woff2"),true);     
        return true;

    }

     /**
     * Info on installed plugins
     *
     * @return array 
     */
    public static function get_compressx_data() {     

        //Check multisite
        if(is_multisite()) {
            return new \WP_Error(
                'multisite_unsupported',
                'Multisite is not supported',
                [ 'status' => 403 ]
            );              
        }
        
        $plugin_file = 'compressx/compressx.php';
        $status = '';
        $version = '';

        //Get currently installed plugins
        $plugins = get_plugins();

        if(!empty($plugins[$plugin_file])) {

            $status = "deactivated";
            //See if plugin is activated
            if(is_plugin_active($plugin_file)) {
                $status = "activated";
            }

            $activation_url = "";
            if($status == 'deactivated') {

                //Get activation URL
                $action_url = wp_nonce_url(
                    self_admin_url(
                        'plugins.php?action=activate&plugin=' . rawurlencode( $plugin_file )
                    ),
                    'activate-plugin_' . $plugin_file
                );

            } else {

                //Get deactivation URL
                $action_url = wp_nonce_url(
                    self_admin_url(
                        'plugins.php?action=deactivate&plugin=' . rawurlencode( $plugin_file )
                    ),
                    'deactivate-plugin_' . $plugin_file
                );

            }

            //Get version
            $version = $plugins[$plugin_file]['Version'];
            

        }

        //Check if configured with our preferred options
        $compressx_auto_optimize = get_option('compressx_auto_optimize');
        $compressx_quality = get_option('compressx_quality');
        if(!empty($compressx_auto_optimize) && !empty($compressx_quality)) {
            $status = 'configured';
        }
    
        
        //Check rewrites OK
        $can_rewrite = false;
        if(($status == 'activated' || $status == 'configured') && defined('COMPRESSX_DIR')) {

            //Get rewrite info
             include_once COMPRESSX_DIR . '/includes/class-compressx-rewrite-checker.php';
             $test = new \CompressX_Rewrite_Checker();
             $can_rewrite=$test->test();

            //Get CompressX admin url, like /wp-admin/admin.php?page=CompressX
            if(!is_multisite())  {
                $admin_url = admin_url('admin.php?page=' . COMPRESSX_SLUG);
            } else  {
                $admin_url = network_admin_url('admin.php?page=' . COMPRESSX_SLUG);
            }   

        }

        return array("status"=>$status,"version"=>$version,"action_url"=>str_replace("&amp;","&",$action_url),"admin_url"=>$admin_url,"can_rewrite"=>$can_rewrite);

        
        
    }

     /**
     * Configures  CompressX
     *
     */
    public static function configure_compressx() {   
        
        

    }

     /**
     * Installs  CompressX
     *
     * @return array Empty array (no data returned).
     */
    public static function handle_compressx() {      

        //COnfigure the plugin
        if($_GET['action'] == 'configure') {

            //Set standard WordPress options
            update_option('compressx_auto_optimize',1);
            update_option('compressx_quality',array("quality"=>"lossy_super"));
            return 1;

        } else if ($_GET['action'] == 'install') {
            

            include_once ABSPATH . 'wp-admin/includes/plugin.php';

            $plugin_file = 'compressx/compressx.php';

            // Already active, nothing to do.
            if ( is_plugin_active( $plugin_file ) ) {
                return;
            }

            // Install if not present yet.
            if ( ! file_exists( WP_PLUGIN_DIR . '/' . $plugin_file ) ) {

                require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
                require_once ABSPATH . 'wp-admin/includes/file.php';
                require_once ABSPATH . 'wp-admin/includes/misc.php';
                require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

                $api = plugins_api(
                    'plugin_information',
                    array(
                        'slug'   => 'compressx',
                        'fields' => array(
                            'sections' => false,
                        ),
                    )
                );

                if ( is_wp_error( $api ) ) {
                    $message = $api->get_error_message();
                    return new \WP_Error(
                        'install_failed',
                        $message,
                        [ 'status' => 403 ]
                    );   
                }

                $skin     = new \Automatic_Upgrader_Skin();
                $upgrader = new \Plugin_Upgrader( $skin );
                $result   = $upgrader->install( $api->download_link );

                if ( is_wp_error( $result ) ) {
                    $message = $result->get_error_message();
                    return new \WP_Error(
                        'install_failed',
                        $message,
                        [ 'status' => 403 ]
                    );   
                }

            }        

            return true;

        }

    }

    

    /**
     * Clears the CSS cache directory.
     *
     * @return array Empty array (no data returned).
     */
    public static function clear_css_cache() {          

        //Start a timer
        $start_time = microtime(true);        

        //Clear the cache
        $count = 1;
        $counter = 0;
        while($count > 0 & $counter < 10) {

            $data = Speed\CSS::clear_cache();
            $cache_data = Speed\CSS::get_cache_data();
            $count = $cache_data['num_css_files'];
            $counter++;

        }

        $elapsed_time = microtime(true) - $start_time;

        //If elapsed time is less than 1 second, sleep for remainder using usleep
        if ($elapsed_time < 1.0) {
            $micros = (int) max(0, round((1.0 - $elapsed_time) * 1000000));
            if ($micros > 0) {
                usleep($micros);
            }
        }

        return $data;        

    }

    /**
     * Clears the page cache directory.
     *
     * @return array Empty array (no data returned).
     */
    public static function clear_page_cache() {          

        //Start a timer
        $start_time = microtime(true);        

        //Clear the cache        
        $count = 1;
        $counter = 0;
        while($count > 0 & $counter < 10) {
            
            $data = Speed\Cache::clear_cache();

            //Check if the cache was cleared        
            $page_cache_data = Speed\Cache::get_cache_data();
            $count = $page_cache_data['count'];

            $counter++; //add this to ensure no infinte loops
        }

        $elapsed_time = microtime(true) - $start_time;

        //If elapsed time is less than 1 second, sleep for remainder using usleep
        if ($elapsed_time < 1.0) {
            $micros = (int) max(0, round((1.0 - $elapsed_time) * 1000000));
            if ($micros > 0) {
                usleep($micros);
            }
        }

        return $data;

    }    

    /**
     * Checks the user's license
     *
     * @return array Empty array (no data returned).
     */
    public static function check_license($request) {          

        $json = $request->get_json_params();
        $data = array();

        //Decode from base64; handle missing or invalid license number
        $license_number = self::get_decoded( $json, 'license_number' );
        if ( $license_number === null ) {
            return new \WP_Error(
                'invalid_license',
                'License number is missing or invalid.',
                [ 'status' => 400 ]
            );
        }
        $license = App\License::check_license( $license_number );

        if(isset($license['error'])
        && $license['error'] != '') {
            return new \WP_Error(
                'license_failed',
                $license['error'],
                [ 'status' => 403 ]
            );            
        } else {
            $data['success'] = $license;
            $data['allowed_hosts'] = App\License::$allowed_hosts;
            $data['num_current_hosts'] = App\License::$num_current_hosts;
        }
        return $data;

    }    



    /**
     * Public-facing API to update CSS.  Intended to be rate-limited to prevent
     * abuse.  For each unique client IP, count the number of calls within the
     * last minute.  If the count exceeds five, return a 429 Too Many Requests
     * error.
     *
     * The endpoint takes a JSON payload containing the following fields:
     *
     * - `compressedData`: a base64-encoded string containing the gzipped
     *   CSS payload.
     *
     * The function performs the following steps:
     *
     * 1. Base64 decode the compressed payload.
     * 2. GZIP decompress the decoded payload (suppress PHP warnings).
     * 3. JSON parse the decompressed payload.
     * 4. Validate the CSRF token and URL.
     *
     * If any step fails, an appropriate error response will be returned.
     *
     * @param \WP_REST_Request $request The request object containing the JSON
     *     payload.
     *
     * @return array|WP_Error
     */
    public static function get_public_data(  \WP_REST_Request $request, $sent_compressed = true ) {

        /**
         * Simple rate limiting: throttle calls to this endpoint to prevent
         * abuse or accidental repeated heavy requests.  For each unique
         * client IP, count the number of calls within the last minute.  If
         * the count exceeds five, return a 429 Too Many Requests error.
         *
         */        
        $client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $rate_key  = 'spress_update_css_' . md5( $client_ip );
        $request_count = (int) get_transient( $rate_key );
        $request_count++;

        //Set request limit
        $request_limit = 10;

        // Store/update the count with a one-minute expiry.  Each call
        // resets the expiry, effectively sliding the window forward.
        set_transient( $rate_key, $request_count, MINUTE_IN_SECONDS );
        if ( $request_count > $request_limit ) {
            return new \WP_Error(
                'too_many_requests',
                'Too many requests (' . $request_count . '), please slow down.',
                [ 'status' => 429 ]
            );
        }

        $json = $request->get_json_params();
    
        // 1) Base64 decode
        $b64 = self::get_decoded( $json, 'compressedData' );
        if ( $b64 === null ) {
            return new \WP_Error(
                'missing_data',
                'No compressedData provided',
                [ 'status' => 400 ]
            );
        }
    
        // Enforce a maximum size on the compressed payload to mitigate
        // resource-exhaustion (zip bomb) attacks.  If the decoded base64
        // string exceeds the configured limit, reject the request.
        if ( strlen( $b64 ) > self::$max_css_compressed_bytes ) {
            return new \WP_Error(
                'payload_too_large',
                'Compressed CSS payload too large',
                [ 'status' => 413 ]
            );
        }

        // 2) GZIP decompress (suppress PHP warnings)
        if($sent_compressed == true) {

            $uncompressed = @gzdecode( $b64 );
            if ( $uncompressed === false ) {
                return new \WP_Error(
                    'decompression_failed',
                    'Failed to decompress CSS payload',
                    [ 'status' => 400 ]
                );
            }

        } else {

            //Data was not gzipped
            $uncompressed = $b64;

        }
    
        // Ensure the decompressed payload is below the maximum allowed size.
        if ( strlen( $uncompressed ) > self::$max_css_uncompressed_bytes ) {
            return new \WP_Error(
                'payload_too_large',
                'Decompressed CSS payload too large',
                [ 'status' => 413 ]
            );
        }

        // 3) JSON parse
        $data = json_decode( $uncompressed, true );
        if ( $data === null && json_last_error() !== JSON_ERROR_NONE ) {
            return new \WP_Error(
                'json_parse_error',
                json_last_error_msg(),
                [ 'status' => 400 ]
            );
        }

        // 4) CSRF & URL validation
        $csrf    = $data['csrf'] ?? '';
        $decoded = Speed::decode_csrf_token( $csrf );
        
        if ( !empty($decoded['fail_message']) || !isset( $decoded['url'], $data['url'] ) ) {
            return new \WP_Error(
                'invalid_request',
                //'Invalid CSRF token or missing URL. ' . $decoded['fail_message'],
                'Page expired. Please refresh the page.', //user friendly error message
                [ 'status' => 403 ]
            );
        }

        //Return data
        return array( 'data' => $data, 'decoded' => $decoded );

    }


    /**
     * Processes a CSS update request from the public side.
     *
     * @param WP_REST_Request $request The request object containing CSS data.
     */
    public static function update_css( \WP_REST_Request $request ) {
            
        //Get data with security tests
        $maybe_data = self::get_public_data($request);
        if ( is_wp_error( $maybe_data ) ) {
            // Returning the WP_Error makes the REST API send a 429 response.
            return $maybe_data;
        } else {

            $data = $maybe_data['data'];
            $decoded = $maybe_data['decoded'];

        }

        //Compare URLs exactly
        $url2 = Url::parse($data['url']);
        $reconstructedUrl2 = $url2->getScheme() . '://' . $url2->getHost() . rtrim($url2->getPath(), '/');
        $url_hash = substr(hash('sha256', $reconstructedUrl2), 0, 8); // short hash
        
        if ($url_hash !== $decoded['url']) {
            return new \WP_Error(
                'invalid_request',
                'URL mismatch ' . $url_hash . $decoded['url'],
                [ 'status' => 403 ]
            );
        }

        // 5) Sanitize inputs
    
        // force_includes: array of selectors/patterns
        $force_includes = [];
        if ( ! empty( $data['force_includes'] ) && is_array( $data['force_includes'] ) ) {
            foreach ( $data['force_includes'] as $item ) {
                $force_includes[] = sanitize_textarea_field( (string) $item );
            }
        }
    
        // url: must be valid
        $url = esc_url_raw( $data['url'] );

        //If it's just force includes, then we can skip the rest
        if(!empty($data['force_includes_only']) && $data['force_includes_only'] == "1") {

            $includes = Speed\CSS::process_force_includes(
                $force_includes,
                $url
            );
        
            //Return REST response
            return rest_ensure_response( [
                'includes' => $force_includes ?? null,
            ] );            

        }
    
        // post_id: integer
        $post_id = isset( $data['post_id'] ) ? intval( $data['post_id'] ) : 0;
    
        // post_types: array of slugs
        $post_types = [];
        if ( ! empty( $data['post_types'] ) && is_array( $data['post_types'] ) ) {
            foreach ( $data['post_types'] as $pt ) {
                $post_types[] = sanitize_key( (string) $pt );
            }
        }

        //icon fonts: array of font names
        $icon_fonts = array();
        if ( ! empty( $data['icon_fonts'] ) && is_array( $data['icon_fonts'] ) ) {
            foreach ( $data['icon_fonts'] as $icn ) {
                $icon_fonts[] = sanitize_key( (string) $icn );
            }
        }
    
        // invisible: nested structure
        $invisible = [
            'elements' => [],
            'viewport' => [ 'width' => 0, 'height' => 0 ],
        ];
        if ( ! empty( $data['invisible'] ) && is_array( $data['invisible'] ) ) {
            // Elements: each must be array with spuid
            if ( ! empty( $data['invisible']['elements'] ) && is_array( $data['invisible']['elements'] ) ) {
                foreach ( $data['invisible']['elements'] as $elem ) {
                    if ( is_array( $elem ) && isset( $elem['spuid'] ) ) {
                        $invisible['elements'][] = [
                            'spuid' => sanitize_text_field( (string) $elem['spuid'] ),
                        ];
                    }
                }
            }
            // Viewport: width/height ints
            if ( ! empty( $data['invisible']['viewport'] ) && is_array( $data['invisible']['viewport'] ) ) {
                $vp = $data['invisible']['viewport'];
                if ( isset( $vp['width'] ) ) {
                    $invisible['viewport']['width'] = intval( $vp['width'] );
                }
                if ( isset( $vp['height'] ) ) {
                    $invisible['viewport']['height'] = intval( $vp['height'] );
                }
            }
        }
    
        // usedFontRules: either a pipe-separated string or an array of URLs
        $used_font_rules = [];
        if ( ! empty( $data['usedFontRules'] ) ) {
            // If it’s a string, split on |
            if ( is_string( $data['usedFontRules'] ) ) {
                $candidates = explode( '|', $data['usedFontRules'] );
            }
            // If it’s already an array, use it directly
            elseif ( is_array( $data['usedFontRules'] ) ) {
                $candidates = $data['usedFontRules'];
            } else {
                $candidates = [];
            }

            // Sanitize each URL – note $rule_url here, not $url
            foreach ( $candidates as $rule_url ) {
                $clean_url = esc_url_raw( trim( (string) $rule_url ) );
                if ( ! empty( $clean_url ) ) {
                    $used_font_rules[] = $clean_url;
                }
            }
        }
    
        // lcp_image: full URL or data-URL
        $lcp_image = '';
        if ( ! empty( $data['lcp_image'] ) ) {
            $raw = trim( $data['lcp_image'] );
            if ( strpos( $raw, 'http' ) === 0 ) {
                $lcp_image = esc_url_raw( $raw );
            } elseif ( preg_match( '#^data:image/[^;]+;base64,#', $raw ) ) {
                // Normalize prefix, keep base64 payload
                $lcp_image = preg_replace(
                    '#^data:image/[^;]+;base64,#',
                    'data:image/png;base64,',
                    $raw
                );
            }
        }
    
        // 6) Process CSS
        $unused = Speed\CSS::process_css(
            $force_includes,
            $url,
            $post_id,
            $post_types,
            $invisible,
            $used_font_rules,
            $lcp_image,
            $icon_fonts
        );
    
        // 7) Return REST response
        return rest_ensure_response( [
            'reduction' => $unused['percent_reduction'] ?? null,
            /*'css_vars' => $unused['css_vars'],
            'markup' => $unused['markup'],
            'fonts_css_icons' => $unused['fonts_css_icons'],
            'fonts_css_text' => $unused['fonts_css_text'],*/
            'includes' => $force_includes ?? null
        ] );
    }   
    


    /**
     * Recursively iterates through an associative array (or object) and attempts to decode any string values as base64.
     * If the decoded value is not binary garbage (i.e. the original value can be re-encoded to match the original string),
     * the decoded value replaces the original value in the array.
     * 
     * @param array $formDataJson The associative array or object to transform.
     * @return array The transformed array with any base64 strings decoded.
     */
    public static function transform_btoa($formDataJson) {

        // If the input is not an array, return it unchanged.
        if ( ! is_array( $formDataJson ) ) {
            return $formDataJson;
        }            

        foreach ($formDataJson as $key => $value) {

            // If the value is a string, check if it's base64 encoded using regex pattern
            if (is_string($value) && self::is_base64($value)) {
                $decodedValue = base64_decode($value, true);
                // Check if base64_decode was successful and if the decoded value looks like valid text
                if ($decodedValue !== false && self::is_valid_decoded_string($decodedValue)) {
                    $formDataJson[$key] = $decodedValue;
                }
            }
            // If the value is an array, recursively call the function on that array
            else if (is_array($value)) {
                $formDataJson[$key] = self::transform_btoa($value);
            }
        }
    
        return $formDataJson;
    }


    public static function get_decoded($json, $key) {

        if (!isset($json[$key]) || !is_string($json[$key])) {
             return null;
        }
        $data = base64_decode($json[$key], true);
        if ($data === false) {
             return null;
        }

        return $data;

    }
    

    /**
     * Checks if a given string is a valid base64 encoded string.
     * 
     * A valid base64 string must have a length that is divisible by 4, and it can only contain valid base64 characters.
     * This function uses a regex to check for valid characters, length divisible by 4, and optional padding.
     * 
     * @param string $string The string to check.
     * @return boolean True if the string is a valid base64 encoded string, false otherwise.
     */
    private static function is_base64($string) {

        // Attempt to decode; if decoding returns a string and it contains "data:", treat it as valid.
        $decodedValue = base64_decode($string, true);
        if (is_string($decodedValue) && strpos($decodedValue, "data:") === 0) {
            return true;
        }

        // The string length must be divisible by 4, and it can only contain valid base64 characters
        // This regex checks for valid characters, length divisible by 4, and optional padding.
        return (bool) preg_match('/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/', $string);
    }
    

    /**
     * Checks if a given string is a valid decoded string.
     * 
     * A valid decoded string must be valid UTF-8 or ASCII and must not contain binary garbage.
     * 
     * @param string $string The string to check.
     * @return boolean True if the string is a valid decoded string, false otherwise.
     */
    private static function is_valid_decoded_string($string) {
        // Check if the decoded string is valid UTF-8 or ASCII and does not contain binary garbage
        return mb_check_encoding($string, 'UTF-8') || mb_check_encoding($string, 'ASCII');
    }
    
    

}