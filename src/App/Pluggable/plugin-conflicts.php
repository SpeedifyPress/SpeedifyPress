<?php

if (!defined('ABSPATH')) {
    exit;
}

// This bootstrap file deliberately uses no plugin classes or shared constants.
return (static function ($mainFile) {

    $current = plugin_basename($mainFile);
    $isCss = basename($mainFile) === 'speedifycss.php';
    $currentName = $isCss ? 'SpeedifyCSS' : 'SpeedifyPress';
    $otherName = $isCss ? 'SpeedifyPress' : 'SpeedifyCSS';
    $otherFile = $isCss ? 'speedify_press.php' : 'speedifycss.php';
    $active = array_merge((array) get_option('active_plugins', []), array_keys((array) get_site_option('active_sitewide_plugins', [])));

    // A drop-in can load the other package before WordPress loads its active-plugin list.
    foreach (get_included_files() as $included) {
        if (substr(str_replace('\\', '/', $included), -20) !== '/vendor/autoload.php') continue;
        $owner = dirname($included, 2);
        if (realpath($owner) !== realpath(dirname($mainFile)) && is_file($owner . '/' . $otherFile)) {
            $active[] = basename($owner) . '/' . $otherFile;
        }
    }

    foreach ($active as $plugin) {
        if ($plugin === $current) {
            continue;
        }
        $otherIsCss = basename($plugin) === 'speedifycss.php';
        $otherIsPress = basename($plugin) === 'speedify_press.php';
        if (($isCss && $otherIsPress) || (!$isCss && $otherIsCss)) {
            $message = sprintf('Deactivate %s before activating %s. SpeedifyPress already includes the CSS and Cache features of SpeedifyCSS.', $otherName, $currentName);

            // Reject activation; also avoid class collisions if both are already active.
            register_activation_hook($mainFile, static function () use ($message) {

                wp_die(esc_html($message));
            });
            add_action('admin_notices', static function () use ($message) {

                echo '<div class="notice notice-error"><p>' . esc_html($message) . '</p></div>';
            });
            return false;
        }
    }

    // Stop the activation request before WordPress includes an older, unguarded package.
    add_action('admin_init', static function () use ($otherFile, $otherName, $currentName) {

        $action = isset($_REQUEST['action']) && is_string($_REQUEST['action']) ? sanitize_key(wp_unslash($_REQUEST['action'])) : '';
        if ($action === '-1' || $action === '') {
            $action = isset($_REQUEST['action2']) && is_string($_REQUEST['action2']) ? sanitize_key(wp_unslash($_REQUEST['action2'])) : '';
        }
        if ($action !== 'activate' && $action !== 'activate-selected') return;
        $nonce = isset($_REQUEST['_wpnonce']) && is_string($_REQUEST['_wpnonce']) ? sanitize_text_field(wp_unslash($_REQUEST['_wpnonce'])) : '';
        if ($action === 'activate') {
            $plugin = isset($_REQUEST['plugin']) && is_string($_REQUEST['plugin']) ? sanitize_text_field(wp_unslash($_REQUEST['plugin'])) : '';
            if (!wp_verify_nonce($nonce, 'activate-plugin_' . $plugin)) return;
            $plugins = [$plugin];
        } else {
            if (!wp_verify_nonce($nonce, 'bulk-plugins')) return;
            $plugins = isset($_REQUEST['checked']) && is_array($_REQUEST['checked']) ? array_map('sanitize_text_field', wp_unslash($_REQUEST['checked'])) : [];
        }
        foreach ($plugins as $plugin) {
            if (basename($plugin) !== $otherFile || !current_user_can('activate_plugin', $plugin)) continue;
            wp_die(
                esc_html(sprintf('Deactivate %s before activating %s. SpeedifyPress already includes the CSS and Cache features of SpeedifyCSS.', $currentName, $otherName)),
                esc_html('Plugin activation conflict'),
                ['back_link' => true, 'response' => 409]
            );
        }
    });
    return true;
})($spress_bootstrap_file);
