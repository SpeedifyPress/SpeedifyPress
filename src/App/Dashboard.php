<?php

namespace SPRESS\App;

use SPRESS\Speed\CSS;


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
    $data['license_data'] = License::get_license_data();

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
