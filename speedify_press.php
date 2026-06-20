<?php
/*
Plugin Name: SpeedifyPress
Description: Suite of tools and utilities to optimise WordPress sites
Author: Leon Chevalier
Version: 0.81.00
Text Domain: speedify-press
License: GPLv3 or later
Author URI: https://github.com/acid-drop
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

//The composer autoload function 
require_once dirname(__FILE__) . '/vendor/autoload.php';

// Use get_file_data() to read the version from the plugin header
$spress_plugin_data = get_file_data( __FILE__, array( 'Version' => 'Version' ) );
$spress_plugin_version_full = $spress_plugin_data['Version'];

// Define constants
define('SPRESS_VER', $spress_plugin_version_full);
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

//Run the init functions for Rest API and edition-specific licensing
SPRESS\RestApi::init();
if ( class_exists( '\SPRESS\App\LicenseIntegration' ) ) {
	SPRESS\App\LicenseIntegration::init();
}

//Check if to proceed at all or not
$spress_enabled = SPRESS\App\Config::check_enabled();
if($spress_enabled === false) {
	return;
}

//Run the bloat functions
SPRESS\Speed\Bloat::init();

//Run the main plugin functions
SPRESS\Speed::init();
