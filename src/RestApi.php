<?php

namespace SPRESS;

use SPRESS\Speed;
use Wa72\Url\Url;

use WP_REST_Server;

/**
 * This `RestApi` class handles the registration and processing of custom REST API endpoints
 * for the SPRESS plugin.
 * 
 * @package SPRESS
 */
class RestApi {

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
                    'permission_callback' => '__return_true', // Admin-only access as after auth check
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
                'permission_callback' => '__return_true', // Admin-only access as after auth check
            )
        );

        // Route for clearing unused CSS cache
        register_rest_route(
            'speedifypress',
            '/clear_css_cache/?',
            array(
                'methods' => array('GET'),
                'callback' => array(__CLASS__, 'clear_css_cache'),
                'permission_callback' => '__return_true', // Admin-only access as after auth check
            )
        );  

        // Route for clearing page cache
        register_rest_route(
            'speedifypress',
            '/clear_page_cache/?',
            array(
                'methods' => array('GET'),
                'callback' => array(__CLASS__, 'clear_page_cache'),
                'permission_callback' => '__return_true', // Admin-only access as after auth check
            )
        );  
        
        
        // Route for clearing unused CSS cache
        register_rest_route(
            'speedifypress',
            '/check_license/?',
            array(
                'methods' => array('POST'),
                'callback' => array(__CLASS__, 'check_license'),
                'permission_callback' => '__return_true', // Admin-only access as after auth check
            )
        );          

        // Route for getting Cloudflare worker script
        register_rest_route(
            'speedifypress',
            '/get_cloudflare_script/?',
            array(
                'methods' => array('GET'),
                'callback' => array(__CLASS__, 'get_cloudflare_script'),
                'permission_callback' => '__return_true', // Admin-only access as after auth check
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
        $config = self::transform_btoa($config);

        //Test and sanitize
        $config = App\Config::ensure_valid($config);

        //See if allowed to enable
        if($config['config_key'] == "plugin"
            && ($config['plugin_mode'] == "enabled" || $config['plugin_mode'] == "partial")
        ) {
            
            $can_download = App\License::get_download_link();
            if(!$can_download) {
                //Throw error
                return new \WP_Error(
                    'no_license',
                    'No license found. Please sign up for a free license to activate the plugin.',
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

        //Write advanced cache
        Speed\Cache::write_advanced_cache();
        
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
        
        if($location) {

            //Get contents
            $contents = file_get_contents($location);

            if(strstr($contents, 'this.csrf_salt')) {

                //Replace this.csrf_salt = '{salt}'; with NONCE_SALT using preg_replace
                $contents = preg_replace('/this\.csrf_salt = \'(.*)\';/', 'this.csrf_salt = \'' . NONCE_SALT . '\';', $contents);

            } 
            
            //Return contents
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

        //If elapsed time is less than 2 seconds, sleep for remainder using usleep
        if($elapsed_time < 1) {
            $remainder = (1 - $elapsed_time) * 1000000;
            usleep($remainder);
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

        //If elapsed time is less than 2 seconds, sleep for remainder using usleep
        if($elapsed_time < 1) {
            $remainder = (1 - $elapsed_time) * 1000000;
            usleep($remainder);
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

        //Decode from base64
        $license_number = self::get_decoded($json,'license_number');
        $license = App\License::check_license($license_number);
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
     * Processes a CSS update request from the public side.
     *
     * @param WP_REST_Request $request The request object containing CSS data.
     */
    public static function update_css( \WP_REST_Request $request ) {
    
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
    
        // 2) GZIP decompress (suppress PHP warnings)
        $uncompressed = @gzdecode( $b64 );
        if ( $uncompressed === false ) {
            return new \WP_Error(
                'decompression_failed',
                'Failed to decompress CSS payload',
                [ 'status' => 400 ]
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
        if ( ! $decoded || ! isset( $decoded['url'], $data['url'] ) ) {
            return new \WP_Error(
                'invalid_request',
                'Invalid CSRF token or missing URL',
                [ 'status' => 403 ]
            );
        }

        //Compare URLs exactly
        $url1 = Url::parse($decoded['url']);
        $url2 = Url::parse($data['url']);
        
        $reconstructedUrl1 = $url1->getScheme() . '://' . $url1->getHost() . rtrim($url1->getPath(), '/');
        $reconstructedUrl2 = $url2->getScheme() . '://' . $url2->getHost() . rtrim($url2->getPath(), '/');
        
        if ($reconstructedUrl1 !== $reconstructedUrl2) {
            return new \WP_Error(
                'invalid_request',
                'URL mismatch ' . $reconstructedUrl1 . $reconstructedUrl2,
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
    
        // post_id: integer
        $post_id = isset( $data['post_id'] ) ? intval( $data['post_id'] ) : 0;
    
        // post_types: array of slugs
        $post_types = [];
        if ( ! empty( $data['post_types'] ) && is_array( $data['post_types'] ) ) {
            foreach ( $data['post_types'] as $pt ) {
                $post_types[] = sanitize_key( (string) $pt );
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
    
        // usedFontRules: either a pipe‑separated string or an array of URLs
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
            $lcp_image
        );


    
        // 7) Return REST response
        return rest_ensure_response( [
            'reduction' => $unused['percent_reduction'] ?? null,
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
            die(json_encode(['error' => 'invalid compressed data']));
        }
        $data = base64_decode($json[$key], true);
        if ($data === false) {
            die(json_encode(['error' => 'invalid base64 encoding']));
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