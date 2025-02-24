<?php
/*
Plugin Name: SpeedifyPress
Description: Suite of tools and utilities to optimise WordPress sites
Author: Leon Chevalier
Version: 0.32.0
Text Domain: speedify-press
Author URI: https://github.com/acid-drop
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

//The composer autoload function 
require_once dirname(__FILE__) . '/vendor/autoload.php';

// Use get_file_data() to read the version from the plugin header
$plugin_data = get_file_data( __FILE__, array( 'Version' => 'Version' ) );
$plugin_version_full = $plugin_data['Version'];

// Define constants
define('UPRESS_VER', $plugin_version_full);
define('UPRESS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('UPRESS_PLUGIN_DIR', plugin_dir_path(__FILE__));

//Run the init functions
UPRESS\RestApi::init();
UPRESS\App\Config::init();
UPRESS\Speed::init();


//Run last as other classes and feed $display var here
UPRESS\App\Menu::init();