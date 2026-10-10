<?php

namespace SPRESS\App;

/**
 * Centralizes licensing-dependent hooks and data so edition-specific builds can
 * exclude this module without scattering conditional logic across the plugin.
 *
 * @package SPRESS
 */
class LicenseIntegration {

    public static function init() {

        LicenseService::init();

        add_filter( 'plugins_api', array( __CLASS__, 'plugin_info' ), 20, 3 );
        add_action( 'after_plugin_row_' . SPRESS_FILE_NAME, array( __CLASS__, 'show_update_notification' ), 10, 2 );
        add_filter( 'plugin_row_meta', array( __CLASS__, 'add_view_details_link' ), 10, 3 );
    }

    public static function get_dashboard_data() {
        return LicenseService::get_license_data();
    }

    public static function validate_plugin_enable() {

        $can_download = LicenseService::get_download_link();
        if ( ! $can_download ) {
            return new \WP_Error(
                'no_license',
                'No license found. Please sign up for a free license to activate the plugin.',
                array( 'status' => 403 )
            );
        }

        return true;
    }

    public static function register_rest_routes() {

        register_rest_route(
            'speedifypress',
            '/check_license/?',
            array(
                'methods'             => array( 'POST' ),
                'callback'            => array( __CLASS__, 'check_license' ),
                'permission_callback' => array( 'SPRESS\\Auth', 'admin_permission_callback' ),
            )
        );
    }

    public static function check_license( $request ) {

        $json = $request->get_json_params();
        $data = array();

        $license_number = \SPRESS\RestApi::get_decoded( $json, 'license_number' );
        if ( $license_number === null ) {
            return new \WP_Error(
                'invalid_license',
                'License number is missing or invalid.',
                array( 'status' => 400 )
            );
        }

        $license = LicenseService::check_license( $license_number );

        if ( isset( $license['error'] ) && $license['error'] !== '' ) {
            return new \WP_Error(
                'license_failed',
                $license['error'],
                array( 'status' => 403 )
            );
        }

        $data['success'] = $license;
        $data['allowed_hosts'] = LicenseService::$allowed_hosts;
        $data['num_current_hosts'] = LicenseService::$num_current_hosts;

        return $data;
    }

    public static function get_worker_download_link() {
        return LicenseService::get_download_link( true );
    }

    public static function show_update_notification() {

        $plugin_file = SPRESS_FILE_NAME;
        $plugin_slug = SPRESS_DIR_NAME;
        $version = 0;

        if ( LicenseService::get_download_link() == false ) {

            $version = LicenseService::get_latest_version();

            if ( $version <= SPRESS_VER ) {

                $settings_url = admin_url( 'admin.php?page=' . Menu::$menu_slug );

                echo "<tr class='plugin-update-tr active' id='{$plugin_slug}-update' data-slug='{$plugin_slug}' data-plugin='{$plugin_file}'>
                <td colspan='4' class='plugin-update'>
                    <div class='update-message notice inline notice-warning notice-alt'>
                        <p>Please <a href='" . $settings_url . "'>activate your license</a> to enable plugin updates.</p>
                    </div>
                </td>
                </tr>";

                echo '<script>
                    jQuery(document).ready(function($) {
                        $("tr[data-plugin=\'' . $plugin_file . '\']").addClass("update");
                    });
                </script>';
            }
        }

        if ( is_multisite() ) {

            if ( ! $version ) {
                $version = LicenseService::get_latest_version();
            }

            if ( $version <= SPRESS_VER ) {
                return;
            }

            $update_url = wp_nonce_url( self_admin_url( 'update.php?action=upgrade-plugin&plugin=' . $plugin_file ), 'upgrade-plugin_' . $plugin_file );

            echo "<tr class='plugin-update-tr active update' id='{$plugin_slug}-update' data-slug='{$plugin_slug}' data-plugin='{$plugin_file}'>
                    <td colspan='4' class='plugin-update'>
                        <div class='update-message notice inline notice-warning notice-alt'>
                            <p>There is a new version of SpeedifyPress available.
                                <a href='{$update_url}'
                                class='update-link'
                                data-plugin='{$plugin_file}'
                                data-slug='{$plugin_slug}'
                                data-name='SpeedifyPress'
                                aria-label='Update SpeedifyPress now'
                                data-wp-action='update-plugin'>
                                    Update to version {$version}
                                </a>
                            </p>
                        </div>
                    </td>
                </tr>";

            echo "<style>
                tr.update[data-plugin='" . $plugin_file . "'] th, tr.plugin-update-tr[data-plugin='" . $plugin_file . "'] th
                tr.update[data-plugin='" . $plugin_file . "'] td, tr.plugin-update-tr[data-plugin='" . $plugin_file . "'] td {
                    box-shadow:none !important;
                }
                </style>";

            echo '<script>
                    jQuery(document).ready(function($) {
                        $("tr[data-plugin=\'' . $plugin_file . '\']").addClass("update");
                    });
                </script>';
        }
    }

    public static function add_view_details_link( $plugin_meta, $plugin_file, $plugin_data = array() ) {

        if ( $plugin_file === SPRESS_FILE_NAME ) {

            foreach ( $plugin_meta as $meta ) {
                if ( stripos( $meta, 'plugin-install.php' ) !== false && stripos( $meta, 'thickbox' ) !== false ) {
                    return $plugin_meta;
                }
            }

            $view_details_link = sprintf(
                '<a href="%s" class="thickbox" title="%s">View details</a>',
                esc_url( LicenseService::get_plugin_info_url() ),
                esc_attr( $plugin_data['Name'] ?? 'Plugin Details' )
            );

            $plugin_meta[] = $view_details_link;
        }

        return $plugin_meta;
    }

    public static function plugin_info( $result, $action, $args ) {

        if ( 'plugin_information' !== $action ) {
            return $result;
        }

        if ( ! strstr( SPRESS_FILE_NAME, $args->slug ) ) {
            return $result;
        }

        $release_url = 'https://speedifypress.com/license/release/';

        $host = parse_url( $release_url, PHP_URL_HOST );
        if ( $host !== 'speedifypress.com' ) {
            return $result;
        }
        $response = wp_remote_get( $release_url, array( 'timeout' => 10 ) );
        if ( is_wp_error( $response ) ) {
            return $result;
        }
        $release_body = wp_remote_retrieve_body( $response );
        $release_data = json_decode( $release_body, true );

        if ( is_array( $release_data ) ) {

            $release_data['version'] = LicenseService::get_latest_version();

            if ( $release_data['version'] > SPRESS_VER
                && get_option( 'spress_namespace_INVOICE_NUMBER' ) !== false ) {
                $release_data['download_link'] = LicenseService::get_download_link();
            }

            $release_data['slug'] = SPRESS_DIR_NAME;

            $result = (object) array_filter( array_merge( (array) $result, $release_data ) );
        }

        return $result;
    }
}
