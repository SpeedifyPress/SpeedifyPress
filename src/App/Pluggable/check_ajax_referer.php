<?php

if ( ! function_exists( 'check_ajax_referer' ) ) :

    /**
     * Checks the AJAX nonce for a given action.
     *
     * This function mimics the behavior of WordPress's built-in
     * check_ajax_referer() function, but with an additional fallback
     * to the SPDY CSRF header when the legacy nonce is missing or
     * invalid.
     *
     * @param int|string $action The action to check the nonce for. If -1,
     *                         the value of $_REQUEST['action'] will be used.
     * @param bool $query_arg Whether to look for the nonce in the query arguments.
     * @param bool $die Whether to die if the nonce check fails.
     *
     * @return int 1 if the nonce is valid and verified, -1 if not.
     */
    function check_ajax_referer( $action = -1, $query_arg = false, $die = true ) {
        if ( -1 === $action && isset( $_REQUEST['action'] ) ) {
            $action = $_REQUEST['action'];
        }

        $nonce = '';
        if ( $query_arg && isset( $_REQUEST[ $query_arg ] ) ) {
            $nonce = $_REQUEST[ $query_arg ];
        } elseif ( isset( $_REQUEST['_ajax_nonce'] ) ) {
            $nonce = $_REQUEST['_ajax_nonce'];
        } elseif ( isset( $_REQUEST['_wpnonce'] ) ) {
            $nonce = $_REQUEST['_wpnonce'];
        }

        $result = wp_verify_nonce( $nonce, $action );

        // Fallback to SPDY CSRF header when legacy nonce is missing or invalid
        if ( false === $result && \SPRESS\App\Config::get( 'speed_cache', 'replace_ajax_nonces' ) === 'true' ) {
            $token = $_SERVER['HTTP_X_SPDY_CSRF'] ?? '';
            if ( $token !== '' ) {
                $decoded = \SPRESS\Speed::decode_csrf_token( $token, 'long' );
                if ( empty( $decoded['fail_message'] ) ) {
                    $result = 1;
                }
            }
        }

        if ( false === $result ) {
            if ( $die ) {
                if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
                    wp_die( -1 );
                }
                die( '-1' );
            }
        }

        do_action( 'check_ajax_referer', $action, $result );

        return $result;
    }

endif;

?>