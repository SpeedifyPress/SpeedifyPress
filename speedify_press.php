<?php
/*
Plugin Name: SpeedifyPress
Description: Suite of tools and utilities to optimise WordPress sites
Author: Leon Chevalier
Version: 0.58.0
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
define('SPRESS_VER', $plugin_version_full);
define('SPRESS_FILE_NAME', plugin_basename(__FILE__)); //e.g speedify_press_plugin/speedify_press.php
define('SPRESS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('SPRESS_PLUGIN_DIR', plugin_dir_path(__FILE__));


//Might already be defined in advanced-cache.php
if ( ! defined( 'SPRESS_DIR_NAME' ) ) {
	define('SPRESS_DIR_NAME', dirname(plugin_basename(__FILE__)));
}     

//Load the config first
SPRESS\App\Config::init();

//Need this even if plugin fully disabled
SPRESS\App\Menu::init();

//Run the init functions for Rest API and license
SPRESS\RestApi::init();
SPRESS\App\License::init();

//Check if to proceed at all or not
$enabled = SPRESS\App\Config::check_enabled();
if($enabled === false) {
	return;
}

//Run the main plugin functions
SPRESS\Speed::init();
