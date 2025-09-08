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
    public static $plan_type;

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
                
                echo '<br><span style="color: red; font-weight: bold;">' . 'Your license is inactive. Please <a href="'. 'admin.php?page='.Menu::$menu_slug .'">activate your license</a> to receive updates. Click <a target="_blank" href="https://speedifypress.com">here</a> to purchase a license.' . '</span>';
                $shown = true;
            }
        }, 10, 2);              

        add_filter( 'upgrader_pre_download', array(__CLASS__,'check_license_before_plugin_update'), 10, 4 );

    }

    /**
     * Checks the license validity before allowing the plugin update to proceed.
     *
     * This function hooks into the 'upgrader_pre_download' filter to verify the
     * license status for the plugin before a download attempt is made during an
     * update. If the license is invalid or expired, it prevents the update process
     * and displays an error message to the user.
     *
     * @param bool   $reply      Whether to proceed with the download. Default true.
     * @param string $package    The package file name.
     * @param object $updater    The instance of the upgrader class.
     * @param array  $hook_extra Extra arguments passed to the hook.
     * @return bool|string Return original $reply if license is valid or not our plugin,
     *                     otherwise stops the update process.
     */

    public static function check_license_before_plugin_update( $reply, $package, $updater, $hook_extra ) {
        
        $plugin_slug = SPRESS_FILE_NAME; // e.g. 'speedify_press_plugin/speedify_press.php'
    
        // Only proceed if this update is for our plugin
        if ( isset( $hook_extra['plugin'] ) && $hook_extra['plugin'] === $plugin_slug ) {
    
            // Run your license check logic
            $license_valid = self::get_download_link(); // should return false if license is invalid
    
            if ( $license_valid === false ) {

                // Remove .maintenance file to avoid "stuck in maintenance" issue
                $maintenance_file = ABSPATH . '.maintenance';
                if ( file_exists( $maintenance_file ) ) {
                    @unlink( $maintenance_file );
                }

                // Abort update with meaningful error
                wp_die(
                    __( 'Update failed: License is invalid or expired.', 'speedify-press' ),
                    __( 'Plugin Update', 'your-textdomain' ),
                    array( 'back_link' => true )
                );

            }
        }
    
        return $reply; // Proceed with update if license is valid or not your plugin
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
        ) {

            //Always return a response here
            //when an update is available
            $transient->response[$plugin_slug] = (object) array(
                'slug'         => $plugin_dir,
                'new_version'  => $latest_version,
                'package'      => self::get_download_link(),
                'url'          => "https://speedifypress.com/",
            );


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
    public static function get_download_link($for_worker=false) {

        if(get_option('spress_namespace_INVOICE_NUMBER') === false || get_option('spress_namespace_INVOICE_NUMBER') === ''){ 
            return false; 
        }

        if($for_worker === true) {
            $stem = 'https://speedifypress.com/license/worker/?invoice=';
        } else {
            $stem = 'https://speedifypress.com/license/download/?invoice=';
        }

        return $stem . urlencode(get_option('spress_namespace_INVOICE_NUMBER')). '&filename='.urlencode(SPRESS_DIR_NAME) . '&host=' . urlencode($_SERVER['HTTP_HOST'] ?? null);;

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
     * Checks the license for the given invoice number.
     *
     * If no number is provided, the stored license number from the options table is used.
     * If a number is provided, it updates the stored option.
     *
     * Sends a request to the licensing server and sets a transient with the subscription end timestamp.
     * If the license check fails or returns '0', it schedules a recheck in 24 hours.
     *
     * @param string|null $number The invoice number associated with the license. Defaults to null.
     * @return bool|array True if valid, false otherwise or error array.
     */
    public static function check_license($number = null) {

        if (!$number) {
            $number = get_option('spress_namespace_INVOICE_NUMBER');
        }

        $host = $_SERVER['HTTP_HOST'] ?? '';
        $check_url = "https://speedifypress.com/license/check/?license_number=" . urlencode($number) . "&host=" . urlencode($host);

        $response = wp_remote_get($check_url, ['timeout' => 10]);

        if (is_wp_error($response)) {
            set_transient('spress_subscription_ends', "0", DAY_IN_SECONDS);
            set_transient('spress_allowed_hosts', "0", DAY_IN_SECONDS);
            return false;
        }

        $body = wp_remote_retrieve_body($response);

        if ($body !== '0' && !empty($body)) {
            $subscription = json_decode($body);

            if (isset($subscription->error)) {

                set_transient('spress_subscription_ends', "0", DAY_IN_SECONDS);
                set_transient('spress_allowed_hosts', "0", DAY_IN_SECONDS);
                return ["error" => $subscription->error];

            } elseif (isset($subscription->success)) {

                // Allow auto update
                delete_site_transient('update_plugins');
                wp_update_plugins();

                // Normalize $subscription->success to a Unix timestamp
                $rawEnds = $subscription->success;
                if (is_numeric($rawEnds)) {
                    $subscription_ends = (int) $rawEnds; // already epoch seconds
                } else {
                    try {
                        // Assume UTC if no timezone provided
                        $dt = new \DateTimeImmutable($rawEnds, new \DateTimeZone('UTC'));
                        $subscription_ends = $dt->getTimestamp();
                    } catch (Exception $e) {
                        $subscription_ends = strtotime($rawEnds) ?: 0;
                    }
                }

                // Use a consistent "now" (UTC) for TTL math
                $now = current_time('timestamp', true); // GMT/UTC
                $expires_in = $subscription_ends > 0 ? ($subscription_ends - $now) : 0;
                $ttl = $expires_in > 0 ? $expires_in : DAY_IN_SECONDS;

                // Store ends-at as epoch and expire the transient when it actually ends
                set_transient('spress_subscription_ends', $subscription_ends, $ttl);

                self::$allowed_hosts     = isset($subscription->allowed_hosts) ? (int) $subscription->allowed_hosts : 0;
                self::$num_current_hosts = isset($subscription->current_hosts) ? (int) $subscription->current_hosts : 0;

                set_transient('spress_allowed_hosts', self::$num_current_hosts . "/" . self::$allowed_hosts, $ttl);

                // Tie plan_type to same TTL so it doesn't linger past expiry
                set_transient('spress_plan_type', ($subscription->plan_type ?? ''), $ttl);

                update_option('spress_namespace_INVOICE_NUMBER', $number, false);

                return true;
            }
        }

        set_transient('spress_subscription_ends', "0", DAY_IN_SECONDS);
        update_option('spress_namespace_INVOICE_NUMBER', "", false);
        set_transient('spress_allowed_hosts', "0", DAY_IN_SECONDS);
        return false;
    }



    /**
     * Retrieves the current license status and associated invoice number.
     *
     * Checks a transient that stores the subscription end timestamp to determine if the license is active.
     * If the transient is missing or invalid, it attempts to recheck the license status.
     *
     * @return array {
     *     An associative array containing:
     *     @type string $license_status 'active' if the license is valid; 'inactive' otherwise.
     *     @type string $allowed_hosts  Number of current/allowed hosts.
     *     @type string $license_number  The invoice number stored in the options table.
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
            'license_number'  => (get_option('spress_namespace_INVOICE_NUMBER') ? get_option('spress_namespace_INVOICE_NUMBER') : ''),
        );
    }
}
