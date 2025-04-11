<?php

namespace SPRESS\App;

use SPRESS\Speed;

/**
 * The Config class is responsible for managing various configurations of the system.
 * It includes functionality for initializing the configuration from the database,
 * merging the default configuration with user-defined settings, and providing methods
 * for updating and retrieving configuration values.
 *
 * @package SPRESS
 */
class Config {

	// Variable to store the configuration
	public static $config;

	public static $querystrings = array(
        'Browser', 'C', 'GCCON', 'MCMP', 'MarketPlace', 'PD', 'Refresh', 'Sens', 'ServiceVersion', 'Source', 'Topic',
        '__WB_REVISION__', '__cf_chl_jschl_tk__', '__d', '__hsfp', '__hssc', '__hstc', '__s', '_branch_match_id', '_bta_c',
        '_bta_tid', '_com', '_escaped_fragment_', '_ga', '_ga-ft', '_gl', '_hsmi', '_ke', '_kx', '_paged', '_sm_byp', '_sp',
        '_szp', '3x', 'a', 'a_k', 'ac', 'acpage', 'action-box', 'action_object_map', 'action_ref_map', 'action_type_map',
        'activecampaign_id', 'ad', 'ad_frame_full', 'ad_frame_root', 'ad_name', 'adclida', 'adid', 'adlt', 'adsafe_ip', 'adset_name',
        'advid', 'aff_sub2', 'afftrack', 'afterload', 'ak_action', 'alt_id', 'am', 'amazingmurphybeds', 'amp;', 'amp;amp',
        'amp;amp;amp', 'amp;amp;amp;amp', 'amp;utm_campaign', 'amp;utm_medium', 'amp;utm_source', 'ampStoryAutoAnalyticsLinker',
        'ampstoryautoanalyticslinke', 'an', 'ap', 'ap_id', 'apif', 'apipage', 'as_occt', 'as_q', 'as_qdr', 'askid', 'atFileReset',
        'atfilereset', 'aucid', 'auct', 'audience', 'author', 'awt_a', 'awt_l', 'awt_m', 'b2w', 'back', 'bannerID', 'blackhole',
        'blockedAdTracking', 'blog-reader-used', 'blogger', 'br', 'bsft_aaid', 'bsft_clkid', 'bsft_eid', 'bsft_ek', 'bsft_lx',
        'bsft_mid', 'bsft_mime_type', 'bsft_tv', 'bsft_uid', 'bvMethod', 'bvTime', 'bvVersion', 'bvb64', 'bvb64resp', 'bvplugname',
        'bvprms', 'bvprmsmac', 'bvreqmerge', 'cacheburst', 'campaign', 'campaign_id', 'campaign_name', 'campid', 'catablog-gallery',
        'channel', 'checksum', 'ck_subscriber_id', 'cmplz_region_redirect', 'cmpnid', 'cn-reloaded', 'code', 'comment',
        'content_ad_widget', 'cost', 'cr', 'crl8_id', 'crlt.pid', 'crlt_pid', 'crrelr', 'crtvid', 'ct', 'cuid', 'daksldlkdsadas',
        'dcc', 'dfp', 'dm_i', 'domain', 'dosubmit', 'dsp_caid', 'dsp_crid', 'dsp_insertion_order_id', 'dsp_pub_id', 'dsp_tracker_token',
        'dt', 'dur', 'durs', 'e', 'ee', 'ef_id', 'el', 'env', 'erprint', 'et_blog', 'exch', 'externalid', 'fb_action_ids', 'fb_action_types',
        'fb_ad', 'fb_source', 'fbclid', 'fbzunique', 'fg-aqp', 'fireglass_rsn', 'fo', 'fp_sid', 'fpa', 'fref', 'fs', 'furl',
        'fwp_lunch_restrictions', 'ga_action', 'gclid', 'gclsrc', 'gdffi', 'gdfms', 'gdftrk', 'gf_page', 'gidzl', 'goal', 'gooal',
        'gpu', 'gtVersion', 'haibwc', 'hash', 'hc_location', 'hemail', 'hid', 'highlight', 'hl', 'home', 'hsa_acc', 'hsa_ad',
        'hsa_cam', 'hsa_grp', 'hsa_kw', 'hsa_mt', 'hsa_net', 'hsa_src', 'hsa_tgt', 'hsa_ver', 'ias_campId', 'ias_chanId', 'ias_dealId',
        'ias_dspId', 'ias_impId', 'ias_placementId', 'ias_pubId', 'ical', 'ict', 'ie', 'igshid', 'im', 'ipl', 'jw_start', 'jwsource',
        'k', 'key1', 'key2', 'klaviyo', 'ksconf', 'ksref', 'l', 'label', 'lang', 'ldtag_cl', 'level1', 'level2', 'level3', 'level4',
        'limit', 'lng', 'load_all_comments', 'lt', 'ltclid', 'ltd', 'lucky', 'm', 'm?sales_kw', 'matomo_campaign', 'matomo_cid',
        'matomo_content', 'matomo_group', 'matomo_keyword', 'matomo_medium', 'matomo_placement', 'matomo_source', 'max-results',
        'mc_cid', 'mc_eid', 'mdrv', 'mediaserver', 'memset', 'mibextid', 'mkcid', 'mkevt', 'mkrid', 'mkwid', 'ml_subscriber',
        'ml_subscriber_hash', 'mobileOn', 'mode', 'month', 'msID', 'msclkid', 'msg', 'mtm_campaign', 'mtm_cid', 'mtm_content',
        'mtm_group', 'mtm_keyword', 'mtm_medium', 'mtm_placement', 'mtm_source', 'murphybedstoday', 'mwprid', 'n', 'native_client',
        'navua', 'nb', 'nb_klid', 'o', 'okijoouuqnqq', 'org', 'pa_service_worker', 'partnumber', 'pcmtid', 'pcode', 'pcrid',
        'pfstyle', 'phrase', 'pid', 'piwik_campaign', 'piwik_keyword', 'piwik_kwd', 'pk_campaign', 'pk_keyword', 'pk_kwd',
        'placement', 'plat', 'platform', 'playsinline', 'pp', 'pr', 'prid', 'print', 'q', 'q1', 'qsrc', 'r', 'rd', 'rdt_cid',
        'redig', 'redir', 'ref', 'reftok', 'relatedposts_hit', 'relatedposts_origin', 'relatedposts_position', 'remodel',
        'replytocom', 'reverse-paginate', 'rid', 'rnd', 'rndnum', 'robots_txt', 'rq', 'rsd', 's_kwcid', 'sa', 'safe', 'said',
        'sales_cat', 'sales_kw', 'sb_referer_host', 'scrape', 'script', 'scrlybrkr', 'search', 'sellid', 'sersafe', 'sfn_data',
        'sfn_trk', 'sfns', 'sfw', 'sha1', 'share', 'shared', 'showcomment', 'si', 'sid', 'sid1', 'sid2', 'sidewalkShow', 'sig',
        'site', 'site_id', 'siteid', 'slicer1', 'slicer2', 'source', 'spref', 'spvb', 'sra', 'src', 'srk', 'srp', 'ssp_iabi', 'ssts',
        'stylishmurphybeds', 'subId1 ', 'subId2 ', 'subId3', 'subid', 'swcfpc', 'tail', 'teaser', 'test', 'timezone', 'toWww',
        'triplesource', 'trk_contact', 'trk_module', 'trk_msg', 'trk_sid', 'tsig', 'turl', 'u', 'up_auto_log', 'upage', 'updated-max',
        'uptime', 'us_privacy', 'usegapi', 'usqp', 'utm', 'utm_campa', 'utm_campaign', 'utm_content', 'utm_expid', 'utm_id', 'utm_medium',
        'utm_reader', 'utm_referrer', 'utm_source', 'utm_sq', 'utm_ter', 'utm_term', 'v', 'vc', 'vf', 'vgo_ee', 'vp', 'vrw', 'vz',
        'wbraid', 'webdriver', 'wing', 'wpdParentID', 'wpmp_switcher', 'wref', 'wswy', 'wtime', 'x', 'zMoatImpID', 'zarsrc', 'zeffdn'
	);

	public static $separate_cache_cookies = array('aelia_cs_selected_currency','yith_wcmcs_currency','wcml_currency');

	// Default configuration
	protected static $initial_config = array(
		'speed_cache'  => array(
			'cache_mode' => array(
				'name'   => 'Cache mode',
				'helper' => 'Whether or not the cache functionality is enabled',
				'type'	=> 'radio',
				'value' => 'disabled',
			),				
			'bypass_cookies' => array(
				'name'   => 'Bypass on Cookies',
				'helper' => 'Enter cookie names that will prevent caching if detected. Separate multiple with new lines.',
				'value' => '',
			),	
			'bypass_urls' => array(
				'name'   => 'Bypass URLs',
				'helper' => 'Enter full or partial URLs that will prevent caching if detected. Separate multiple with new lines.',
				'value' => '',
			),	
			'ignore_querystrings' => array(
				'name'   => 'Bypass Querystrings',
				'helper' => 'Enter names of querystrings that should be ignored when caching. Separate multiple with new lines.',
				'value' => '',
			),
			'bypass_useragents' => array(
				'name'   => 'Bypass on Useragents',
				'helper' => 'Enter (partial) matches of user agent strings that will prevent caching if detected. Separate multiple with new lines.',
				'value' => '',
			),
			'separate_cookie_cache' => array(
				'name'   => 'Separate Cache for Cookies',
				'helper' => 'Enter cookie names that will create a separate cache for if detected. Separate multiple with new lines.',
				'value' => '',
			),
			'cache_logged_in_users' => array(
				'name'   => 'Cache Logged in Users',
				'helper' => 'Should logged in users be cached? N.B Should be used in conjunction with exclude URLs to prevent caching user specific content',
				'value' => 'false',
			),	
			'cache_mobile_separately' => array(
				'name'   => 'Cache Mobile Devices Separately',
				'helper' => 'Should mobile devices be cached separately?',
				'value' => '',
			),	
			'cache_lifetime' => array(
				'name'   => 'Lifetime for page cache',
				'helper' => 'How long should the page cache last?',
				'value' => '0',
			),									
		),			
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
			'preload_fonts' => array(
				'name'   => 'Preload Fonts',
				'helper' => 'Detect fonts and preload them. This works in conjunction with the CSS cache.',
				'value' => 'false',
			),	
			'dont_preload_icon_fonts' => array(
				'name'   => "Don't preload icon fonts",
				'helper' => "Do not preload a font if it's an icon font",
				'value' => 'false',
			),
			'preload_fonts_desktop_only' => array(
				'name'   => 'Preload Fonts only on Desktop',
				'helper' => 'Will attempt to detected mobile devices and not preload fonts on mobile. This will not work for desktop responsive screens. Only works if page caching is enabled.',
				'value' => 'false',
			),	
			'system_fonts' => array(
				'name'   => 'Use system fonts',
				'helper' => 'Use high-speed system fonts for mobile devices. Will automatically prevent preloading standard fonts on mobile devices.',
				'value' => 'false',
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
		'plugin'  => array(
			'plugin_mode' => array(
				'name'   => 'Plugin Mode',
				'value' => 'disabled',
			),		
			'disable_urls' => array(
				'name'   => 'URLs to disable plugin on',
				'value' => '',
			),						
		),						
	);

	/**
	 * Initializes the configuration class.
	 *
	 * Retrieves the saved configuration from the database, and merges it with the default configuration.
	 *
	 */
	public static function init() {

		//Set inital config querystrings
		self::$initial_config['speed_cache']['ignore_querystrings']['value'] = implode("\n", self::$querystrings);

		//Set initial cache cookies
		self::$initial_config['speed_cache']['separate_cookie_cache']['value'] = implode("\n", self::$separate_cache_cookies);

		// Get the saved configuration from the database
		self::$config = (array)get_option( 'spress_namespace_CONFIG', array() );
		self::$config = self::array_merge_recursive_unique( self::$initial_config, self::$config );

		#print_r(self::$config);
		#die();

		// Example of how to update one of the default configs
		#$docs = self::$initial_config['docs'];
		#$update = array("config_key"=>"docs","iframe"=>$docs['iframe']['value']);
		#self::update_config($update);


	}

	/**
	 * Checks if the plugin should be enabled or not
	 *
	 * Checks the mode of the plugin and returns true if it should be enabled, or exits if it should be disabled.
	 * If the mode is partial, it checks if the current URL matches any of the partial URLs.
	 *
	 * @return bool True if enabled, otherwise exits.
	 */
	public static function check_enabled() {

		$current_url = $_SERVER['REQUEST_URI'];

		//Still allow speedifypress backend admin
		if(strstr($current_url,"/wp-json/speedifypress/")){
			return true;
		}		

		//get mode
		$mode = self::get('plugin','plugin_mode');

		//evaluate
		if($mode === "enabled") {
			return true;
		} else if($mode === "disabled") {
			return false;
		} else if($mode === "partial") {

			//Partial URLs
			$partial_urls = self::get('plugin','disable_urls');
			$partial_urls = $partial_urls ? explode("\n", $partial_urls) : array();			

			//Check if there's a match
			foreach($partial_urls as $partial_url) {
				if(strstr($current_url,$partial_url)){
					return false;
				}
			}

		}

		return true;

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
	public static function get( $parent, $passed_key = null ) {

		$config = self::$config;
		if ( isset( $config[ $parent ] ) ) {
			if($passed_key == null) {
				return $config[ $parent ];
			} else if ( isset( $config[ $parent ][ $passed_key ] ) ) {
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

							$file = Speed::save_data_image( $new_config[ $key_to_update ], Speed::get_pre_cache_path() . "/preload_image/" );
							$url = str_replace(WP_CONTENT_DIR,content_url(),$file);
							$new_config[ $key_to_update ] = $url;

							echo $url;
							
						}
					}

					//If disabling page cache, purge it
					if($key_to_update == "cache_mode" && $new_config[ $key_to_update ] == "disabled") {
						Speed\Cache::clear_cache();
					}
					
					$frame[ $key_to_update ]['value'] = $new_config[ $key_to_update ];

				}

			}

			//Update the config
			self::$config[ $config_key ] = $frame;

		}


		update_option( 'spress_namespace_CONFIG', self::$config, false );

	}




}
