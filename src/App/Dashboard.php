<?php

namespace SPRESS\App;

use SPRESS\Speed\CSS;
use SPRESS\Speed\Cache;


/**
 * Handles the display of the SPRESS dashboard. 
 * 
 * @package SPRESS
 */
class Dashboard {


  /**
   * Returns data for the dashboard.
   *
   * @return array
   *
   */
  public static function get_data() {

    $data = array();
    $data['cache_data'] = CSS::get_cache_data();
    $data['page_cache_data'] = Cache::get_cache_data();
    $data['license_data'] = class_exists( '\SPRESS\App\LicenseIntegration' )
      ? LicenseIntegration::get_dashboard_data()
      : array(
          'license_status' => 'inactive',
          'license_ends_days' => '',
          'allowed_hosts' => '0',
          'license_status_verb' => '',
          'license_number' => '',
        );
    $data['restNonce'] = wp_create_nonce( 'wp_rest' );

    return $data;

  }

  /**
   * Displays admin notices 
   *
   *
   * @return void
   */
  public static function add_notices() {





  }



}
