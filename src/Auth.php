<?php

namespace SPRESS;

/**
 * Handles authentication for the REST API
 *
 * @package SPRESS
 */
class Auth {

  /**
   * Checks if the current user has access to the REST API
   *
   * @return bool
   */
  public static function is_allowed()  {

    if ( ! is_user_logged_in() ) {
      return false;
    }

    if ( current_user_can( 'manage_options' ) ) {
      return true;
    }    

    $current_user = wp_get_current_user();
    $allowed_roles = ['administrator'];

    // Only allow access to the REST API for users with the specified roles
    if (!array_intersect($current_user->roles, $allowed_roles)) {
      return false;
    }

    return true;

  }

}
