<?php

namespace UPRESS\App;

use UPRESS\Speed;

/**
 * The Config class is responsible for managing various configurations of the system.
 * It includes functionality for initializing the configuration from the database,
 * merging the default configuration with user-defined settings, and providing methods
 * for updating and retrieving configuration values.
 *
 * @package UPRESS
 */
class Config {

	// Variable to store the configuration
	public static $config;

	// Default configuration
	protected static $initial_config = array(
		'speed_css'  => array(
			'css_mode' => array(
				'name'   => 'Unused CSS mode (enable, stats, disabled)',
				'helper' => 'Whether or not the unused CSS functionality is enabled',
				'type'	=> 'radio',
				'value' => 'preview',
			),			
			'include_patterns' => array(
				'name'   => 'Include Patterns',
				'helper' => 'Selectors in CSS files that match these patterns will always be included. Separate multiple with new lines',
				'value' => '',
			),
			'ignore_urls' => array(
				'name'   => 'Ignore URLs',
				'helper' => 'Enter URLs that should be ignored. Regex compatible. Separate multiple with new lines',
				'value' => '',
			),	
			'ignore_cookies' => array(
				'name'   => 'Ignore Cookies',
				'helper' => 'Enter cookies that should be ignored for both CSS collection and rewrite. Regex compatible. Separate multiple with new lines',
				'value' => '',
			),
			'include_partytown' => array(
				'name'   => 'Load with Partytown',
				'helper' => 'Enter strings that match a script filename or contents. Separate multiple with new lines',
				'value' => '',
			),					
			'inclusion_mode' => array(
				'name'   => 'Inclusion Mode',
				'helper' => 'Selects the method used to include the CSS on the page',
				'value' => 'inline',
			),
			'generation_res' => array(
				'name'   => 'Generation Resolutions',
				'helper' => 'Screen resolutions at which the Unused CSS will be generated',
				'value' => array('mobile'=>'true','tablet'=>'true','desktop'=>'true'),
			),
		),		
		'speed_js'  => array(
			'defer_js' => array(
				'name'   => 'Defer JS',
				'helper' => 'Whether or not to defer JS',
				'value' => '',
			),
			'defer_exclude' => array(
				'name'   => 'Exclude scripts from defer',
				'helper' => 'Do not defer scripts matching these patterns. Separate multiple with new lines',
				'value' => '',
			),	
			'defer_exclude_urls' => array(
				'name'   => 'Exclude URLs from defer',
				'helper' => 'Do not defer URLs matching these patterns. Separate multiple with new lines',
				'value' => '',
			),						
			'delay_js' => array(
				'name'   => 'Delay JS',
				'helper' => 'Delay JS execution by a certain amount of seconds',
				'value' => '',
			),												
			'delay_exclude' => array(
				'name'   => 'Exclude scripts from delay',
				'helper' => 'Do not delay scripts matching these patterns. Separate multiple with new lines',
				'value' => '',
			),	
			'delay_exclude_urls' => array(
				'name'   => 'Exclude URLs from delay',
				'helper' => 'Do not delay URLs matching these patterns. Separate multiple with new lines',
				'value' => '',
			),						
			'delay_seconds' => array(
				'name'   => 'Delay Seconds',
				'helper' => 'Amounts of seconds to delay JS execution',
				'value' => '',
			),	
			'script_load_first' => array(
				'name'   => 'Script Load First',
				'helper' => 'Enter scripts to load first. Separate multiple with new lines',
				'value' => '',
			),	
			'script_load_last' => array(
				'name'   => 'Script Load Last',
				'helper' => 'Enter scripts to load last. Separate multiple with new lines',
				'value' => '',
			),	
			'load_complete_js' => array(
				'name'   => 'Delay Completed JavaScript',
				'helper' => 'Enter JavaScript to run once all delayed scripts have been loaded',
				'value' => '',
			),																			
		),					
		'speed_code'  => array(
			'page_headers' => array(
				'name'   => 'Page Headers',
				'helper' => 'Enter headers to be sent to the browser. Separate multiple with new lines.',
				'value' => '',
			),	
			'skip_lazyload' => array(
				'name'   => 'Skip Lazyload',
				'helper' => 'Enter (partial) image filenames to skip lazy loading. These images will be preloaded.',
				'value' => '',
			),
			'preload_image' => array(
				'name'   => 'Preload Image',
				'helper' => 'Choose an image for the preload. This image will be displayed before lazyload. SVG recommended.',
				'value' => '',
			),										
		),		
		'speed_replace'  => array(
			'speed_find_replace' => array(
				'name'   => 'HTML find/replace',
				'value' => '',
			),			
		),			
		'external_scripts' => array(
			'gtag_locally' => array(
				'name'   => 'Should gtag be hosted locally',
				'helper' => '',
				'value' => 'false',
			),
			'preload_gtag' => array(
				'name'   => 'Should gtag script be preloaded/DNS prefetched',
				'helper' => '',
				'value' => 'false',
			)	
		),				
	);

	/**
	 * Initializes the configuration class.
	 *
	 * Retrieves the saved configuration from the database, and merges it with the default configuration.
	 *
	 */
	public static function init() {

		// Get the saved configuration from the database
		self::$config = (array)get_option( 'upress_namespace_CONFIG', array() );
		self::$config = self::array_merge_recursive_unique( self::$initial_config, self::$config );

		// Example of how to update one of the default configs
		#$docs = self::$initial_config['docs'];
		#$update = array("config_key"=>"docs","iframe"=>$docs['iframe']['value']);
		#self::update_config($update);


	}


	/**
	 * Recursively merges two arrays uniquely, ensuring deep merging of nested arrays.
	 * 
	 * - If both values are arrays, they are merged recursively.
	 * - If a key named 'value' exists and is an array in both arrays, it is merged specifically.
	 * - Non-array values from $array2 overwrite those in $array1.
	 * - Ensures unique merging without duplicate values where applicable.
	 * 
	 * @param array $array1 The base array.
	 * @param array $array2 The array to merge into the base array.
	 * @return array The merged array with unique values.
	 */
	public static function array_merge_recursive_unique(array $array1, array $array2) {
		// Initialize merged array with the first array as the base
		$merged = $array1;

		// Iterate through each key-value pair in the second array
		foreach ($array2 as $key => $value) {
			// If both values are arrays and exist in both arrays
			if (is_array($value) && isset($merged[$key]) && is_array($merged[$key])) {
				// Special case: If merging the 'value' key and both values are arrays
				if ($key === 'value' && is_array($merged[$key]) && is_array($value)) {
					// Merge 'value' arrays (overwrite conflicting keys)
					$merged[$key] = array_merge($merged[$key], $value);
				} else {
					// Recursively merge nested arrays
					$merged[$key] = self::array_merge_recursive_unique($merged[$key], $value);
				}
			} 
			// If the value from the second array is an array, but the first array has no corresponding key
			elseif (is_array($value)) {
				// Assign a new array recursively
				$merged[$key] = self::array_merge_recursive_unique([], $value);
			} 
			// If the value is not an array, assign/overwrite it directly
			else {
				$merged[$key] = $value;
			}
		}

		return $merged;
	}



	/**
	 * Remove any non global config items from the array
	 *
	 * @param array $config The array to remove non global items from
	 *
	 * @return array The array with non global items removed
	 */
	public static function remove_non_global( $config ) {

		//Remove non-global
		$array = $config;
		foreach ($array as $key => $value) {
			foreach($value AS $subkey=>$subvalue) {
				if (is_array($subvalue) && isset($subvalue['global']) && $subvalue['global'] === false) {
					unset($array[$key][$subkey]);
				}
			}
		}
		return $array;

	}

	/**
	 * Get a config value
	 *
	 * @param string $parent The parent item of the config
	 * @param string $passed_key The key of the config item to get
	 *
	 * @return mixed The value of the config item
	 */
	public static function get( $parent, $passed_key ) {

		$config = self::$config;
		if ( isset( $config[ $parent ] ) ) {
			if ( isset( $config[ $parent ][ $passed_key ] ) ) {
				return $config[ $parent ][ $passed_key ] ['value'];
			}
		} else {
			return false;
		}

	}

	/**
	 * Update the config with new values
	 *
	 * @param array $new_config The new config values
	 *
	 * @return void
	 */
	public static function update_config( $new_config = array() ) {


		if ( isset( $new_config['config_key'] ) ) {

			$config_key = $new_config['config_key'];

			//Get the array frame
			$frame = self::$config[ $config_key ];

			//Run through the frame and find matching keys
			foreach ( $frame as $key_to_update=> $value ) {

				if ( isset( $new_config[ $key_to_update ] ) ) {
					
					//Custom methods for updates gere
					if($key_to_update == "gtag_locally") {

						Speed::handle_gtag_update($new_config[ $key_to_update ]);

					}

					//If this is a data image, save to cache
					if($key_to_update == "preload_image") {

						//Save to file
						if($new_config[ $key_to_update ]) {

							$file = Speed::save_data_image( $new_config[ $key_to_update ], Speed::get_permanent_cache_path() . "/preload_image/" );
							$url = str_replace(WP_CONTENT_DIR,content_url(),$file);
							$new_config[ $key_to_update ] = $url;

							echo $url;
							
						}
					}
					
					$frame[ $key_to_update ]['value'] = $new_config[ $key_to_update ];

				}

			}


			//Update the config
			self::$config[ $config_key ] = $frame;

		}


		update_option( 'upress_namespace_CONFIG', self::$config, false );

	}




}
