<?php

namespace SPRESS;

use SPRESS\Speed;

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

    }

    /**
     * Handles updating configuration settings.
     *
     * @param WP_REST_Request $request The request object containing config data.
     */
    public static function update_config($request) {
        $config = $request->get_json_params();
        $config = self::transform_btoa($config);

        //Transform checkbox arrays
        foreach($config AS $key=>$value) {

            if(strstr($key,".")) {
                $data = explode(".", $key);
                unset($config[$key]);
                $config[$data[0]][$data[1]] = $value;
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
        $license = App\License::check_license(base64_decode($json['license_email']));
        $data['success'] = $license;
        $data['allowed_hosts'] = App\License::$allowed_hosts;
        $data['num_current_hosts'] = App\License::$num_current_hosts;
        return $data;

    }    

    /**
     * Processes a CSS update request from the public side.
     *
     * @param WP_REST_Request $request The request object containing CSS data.
     */
    public static function update_css($request) {
        $json = $request->get_json_params();
        $compressedData = base64_decode($json['compressedData']);
        $uncompressedData = gzdecode($compressedData);
        $json = json_decode($uncompressedData, true);

        // Check if JSON decoding failed
        if ($json === null && json_last_error() !== JSON_ERROR_NONE) {
            // Handle the error: JSON decoding failed
            $errorMsg = json_last_error_msg();
            die(json_encode(['error' => $errorMsg]));
        }

        // Validate csrf
        $csrf = $json['csrf'];
        $decode = Speed::decode_csrf_token($csrf);

        if ($decode == false) {
            die(json_encode(['error' => 'invalid csrf token']));
        }

        // Get reliable URL
        $url = $decode['url'];

        // Something strange?
        if($url != $json['url']) {
            die(json_encode(['error' => 'invalid url']));
        }

        $unused = Speed\CSS::process_css($json['force_includes'], $json['url'], $json['post_id'], $json['post_types'], $json['invisible'], $json['usedFontRules'], $json['lcp_image']);
        echo json_encode(['reduction' => $unused['percent_reduction'] ]);
        die();    

    

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