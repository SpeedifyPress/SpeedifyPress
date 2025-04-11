<?php

namespace SPRESS\App;
use SPRESS\App\Menu;
use SPRESS\App\License;

/**
 * Class License
 *
 * Handles licensing functionality for the plugin.
 *
 * @package SPRESS
 */
class License {

    public static $allowed_hosts;
    public static $num_current_hosts;

    /**
     * Initializes the licensing class.
     *
     * Adds a filter to hook into WordPress' plugins_api to retrieve 
     * information about the plugin and handle licensing-related requests.
     */
    public static function init() {

        add_filter( 'pre_set_site_transient_update_plugins', array(__CLASS__, 'check_update' ) );

        $plugin_slug = SPRESS_FILE_NAME;
        add_action('in_plugin_update_message-'.$plugin_slug, function ($plugin_data, $response) {

            static $shown = false; // Prevent multiple prints

            if (!$shown && License::check_license() !== true) {
                
                echo '<br><span style="color: red; font-weight: bold;">' . 'Your license is inactive. Please <a href="'. 'admin.php?page='.Menu::$menu_slug .'">activate your license</a> to receive updates.' . '</span>';
                $shown = true;
            }
        }, 10, 2);              

    }

    /**
     * Checks for an update by comparing the installed version with the latest available version.
     *
     * @param object $transient The WordPress update transient object.
     * @return object Modified transient with update data if applicable.
     */
    public static function check_update($transient) {        

        // Ensure we have a valid transient object
        if (empty($transient->last_checked)) {
            return $transient;
        }

        $plugin_slug = SPRESS_FILE_NAME;
        $plugin_dir = SPRESS_DIR_NAME;
        $current_version = SPRESS_VER;
        $latest_version = self::get_latest_version();

        // Compare the versions
        if (version_compare($current_version, $latest_version, '<')
        && self::get_download_link() !== false
        ) {

            //Check license
            if(self::check_license() !== true) {

                $transient->response[$plugin_slug] = (object) array(
                    'slug'         => $plugin_dir,
                    'new_version'  => $latest_version,
                    'package'      => ''                
                );         


            } else {

                $transient->response[$plugin_slug] = (object) array(
                    'slug'         => $plugin_dir,
                    'new_version'  => $latest_version,
                    'package'      => self::get_download_link(),
                    'url'          => "https://speedifypress.com/",
                );

            }

        }

        return $transient;
    }

    public static function get_latest_version(){

        //Get current version with wp_remote_get
        $version = wp_remote_get("https://speedifypress.com/license/version/");

        if (is_wp_error($version)) {
            return SPRESS_VER;
        }

        return trim($version['body']);    

    }

     /**
     * Retrieves the download link for the latest version.
     *
     * @return string The URL to the latest plugin zip file.
     */
    public static function get_download_link() {

        if(get_option('spress_namespace_EMAIL') === false || get_option('spress_namespace_EMAIL') === ''){ 
            return false; 
        }

        return 'https://speedifypress.com/license/download/?email=' . urlencode(get_option('spress_namespace_EMAIL')). '&filename='.urlencode(SPRESS_DIR_NAME) . '&host=' . urlencode($_SERVER['HTTP_HOST'] ?? null);;

    }

    /**
     * Retrieves the plugin information page URL.
     *
     * @return string The plugin information page URL.
     */
    public static function get_plugin_info_url() {

        $base_url = is_multisite() ? network_admin_url('plugin-install.php') : admin_url('plugin-install.php');
        return $base_url . '?tab=plugin-information&plugin=' . basename(dirname(SPRESS_FILE_NAME)) . '&TB_iframe=true&width=600&height=550';

    }

    /**
     * Checks the license for the given email address.
     *
     * If no email is provided, the stored license email from the options table is used.
     * If an email is provided, it updates the stored option.
     *
     * Sends a request to the licensing server and sets a transient with the subscription end timestamp.
     * If the license check fails or returns '0', it schedules a recheck in 24 hours.
     *
     * @param string|null $email The email associated with the license. Defaults to null.
     * @return bool True if the license is valid and active, false otherwise.
     */
    public static function check_license($email = null) {
        
        // Retrieve or update the stored license email.
        if (!$email) {
            $email = get_option('spress_namespace_EMAIL');
        } else {
            update_option('spress_namespace_EMAIL', $email, false);
        }

        // Build the license check URL with proper URL encoding.
        $check_url = "https://speedifypress.com/license/check/?email=" . urlencode($email) . "&host=" . urlencode($_SERVER['HTTP_HOST'] ?? null);

        // Make a remote GET request using WordPress HTTP API.
        $response = wp_remote_get($check_url);

        // Check for errors in the response.
        if (is_wp_error($response)) {
            // In case of error, set a transient to recheck after 24 hours.
            set_transient('spress_subscription_ends', "0", 60 * 60 * 24);
            return false;
        }

        // Retrieve the response body.
        $body = wp_remote_retrieve_body($response);

        // If the response is not "0" and not empty, assume it returns a valid timestamp.
        if ($body !== '0' && !empty($body)) {

            $subscription = json_decode($body);

            //Error message
            if($subscription->error) {

                // If the response indicates an inactive license, recheck after 24 hours.
                set_transient('spress_subscription_ends', "0", 60 * 60 * 24);

                return array("error"=>$subscription->error);

            } else if($subscription->success) {
            
                // Cast the response to an integer timestamp.
                $subscription_ends = (int) $subscription->success;
                // Calculate the number of seconds until the subscription ends.
                $expires_in = $subscription_ends - time();

                // Ensure that the expiration time is not negative.
                if ($expires_in < 0) {
                    $expires_in = 0;
                }

                // Store the subscription end timestamp in a transient.
                set_transient('spress_subscription_ends', $subscription_ends, $expires_in);

                //Set number of allowed hosts
                self::$allowed_hosts = (int) $subscription->allowed_hosts;
                self::$num_current_hosts = (int) $subscription->current_hosts;

                set_transient('spress_allowed_hosts', self::$num_current_hosts . "/" . self::$allowed_hosts , $expires_in);

            return true;

            }
        } else {
            // If the response indicates an inactive license, recheck after 24 hours.
            set_transient('spress_subscription_ends', "0", 60 * 60 * 24);
            return false;
        }
    }

    /**
     * Retrieves the current license status and associated email.
     *
     * Checks a transient that stores the subscription end timestamp to determine if the license is active.
     * If the transient is missing or invalid, it attempts to recheck the license status.
     *
     * @return array {
     *     An associative array containing:
     *     @type string $license_status 'active' if the license is valid; 'inactive' otherwise.
     *     @type string $license_email  The email stored in the options table.
     * }
     */
    public static function get_license_data() {
        
        // Retrieve the stored subscription end timestamp.
        $license_ends = get_transient('spress_subscription_ends');
        $license_status = 'inactive';
        $allowed_hosts = get_transient('spress_allowed_hosts');

        // If we have a numeric timestamp that is still in the future, the license is active.
        if ($license_ends && is_numeric($license_ends) && $license_ends > time()) {
            $license_status = 'active';

        } elseif ($license_ends === "0") {
            $license_status = 'inactive';
        } else {
            // If transient is not set or invalid, perform a license recheck.
            if (self::check_license()) {
                $license_status = 'active';
            } else {
                $license_status = 'inactive';
            }
        }

        return array(
            'license_status' => $license_status,
            'allowed_hosts'  => $allowed_hosts,
            'license_email'  => (get_option('spress_namespace_EMAIL') ? get_option('spress_namespace_EMAIL') : ''),
        );
    }
}
