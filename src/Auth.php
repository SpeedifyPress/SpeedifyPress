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

  /**
   * Permission callback for admin-only REST routes.
   *
   * This callback is executed for each request and ensures that:
   *  - The current user has the `manage_options` capability.
   *  - A valid nonce is provided via the `X-WP-Nonce` header. The nonce
   *    should be created with `wp_create_nonce( 'speedify_press_rest' )` on the client side.
   *
   * Returning `true` allows the request to proceed; otherwise the request
   * will be rejected.
   *
   * @param \WP_REST_Request $request The REST request context.
   * @return bool True if the user is authorized and nonce is valid.
   */
  public static function admin_permission_callback( $request ) {
      
    // Ensure the current user can manage options (administrator privilege)
      if ( ! self::is_allowed() ) {
          return false;
      }
      // Retrieve the nonce from the request header; return false if missing
      $nonce = is_object( $request ) ? $request->get_header( 'X-WP-Nonce' ) : '';
      if ( ! $nonce ) {
          return false;
      }
      // Verify the nonce for our REST action
      return (bool) wp_verify_nonce( $nonce, 'wp_rest' );
  }  

}
