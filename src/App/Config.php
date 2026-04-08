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
		'utm_source','utm_medium','utm_campaign','utm_term','utm_content',
		'utm_id','utm_source_platform','utm_creative_format','utm_marketing_tactic',
		'_ga','_gl','utm_expid','utm_reader','utm_referrer',
		'gclid','gclsrc','dclid','gbraid','wbraid',
		'gad_source','pcrid','srsltid','loc_interest_ms','loc_physical_ms','ifmobile','ifnotmobile',
		'msclkid',
		'fbclid','fb_action_ids','fb_action_types','fb_source','fb_ref',
		'igshid',
		'li_fat_id',
		'ttclid','twclid','ScCid','ndclid','vmcid',
		'yclid','_openstat','ysclid',
		's_kwcid','ef_id',
		'pk_campaign','pk_kwd','pk_keyword',
		'piwik_campaign','piwik_kwd','piwik_keyword',
		'mtm_campaign','mtm_keyword','mtm_source','mtm_medium','mtm_content','mtm_cid','mtm_group','mtm_placement',
		'matomo_campaign','matomo_keyword','matomo_source','matomo_medium','matomo_content','matomo_cid','matomo_group','matomo_placement',
		'hsa_cam','hsa_grp','hsa_mt','hsa_src','hsa_ad','hsa_acc','hsa_net','hsa_kw','hsa_tgt','hsa_ver',
		'__hstc','__hssc','__hsfp','_hsmi','_hsenc','hsCtaTracking',
		'_branch_match_id',
		'mc_cid','mc_eid',
		'_kx','_ke','nb_klid','ksref',
		'dm_i',
		'trk_contact','trk_msg','trk_module','trk_sid',
		'bsft_clkid','bsft_eid','bsft_uid','bsft_mid','bsft_aaid','bsft_lx','bsft_ek','bsft_mime_type','bsft_tv',
		'redirect_log_mongo_id','redirect_mongo_id','sb_referer_host',
		'gdfms','gdftrk','gdffi',
		'mkt_tok',
		'irclickid',
		'cjevent','cjdata',
		'sscid',
		'mkcid','mkevt','mkrid','campid','toolid','customid',
		'mkwid',
		'rtid',
		'epik',
		'tw_source','tw_campaign','tw_term','tw_content','tw_adid',
		'sms_click','sms_uph',
		'oly_enc_id','oly_anon_id','rb_clickid',
		'vero_id','vero_conv',
		'_bta_c','_bta_tid',
		'rdt_cid',
		'hootPostID',
		'CF-SPU-Browser'
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
			'page_preload_mode' => array(
				'name'   => 'Page preload mode',
				'helper' => 'Which type of preloading to use for links',
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
				'helper' => 'Enter full or partial URLs that will prevent caching on that URL. Separate multiple with new lines.',
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
				'helper' => 'Enter cookie names that will create a separate cache for if detected. Separate multiple with new lines. If cookies being present adds extra CSS, add those classes to CSS > Force Include Selectors.',
				'value' => '',
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
			'cache_path_uploads' => array(
				'name'   => 'Cache Path in Uploads',
				'helper' => 'Switch the cache path to the upload directory instead of the cache directory',
				'value' => 'false',
			),
			'force_gzipped_output' => array(
				'name'   => 'Gzipped Output',
				'helper' => 'If the server or CDN isn\'t handling compression, set output to be gzipped',
				'value' => 'false',
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
				'helper' => 'Selectors in CSS files that match these patterns will always be included. Some common examples have been included by default. Separate multiple with new lines',
				'value' => "opened\n-open\nclosed\ntrigger\ntoggl\ndropdown\nslider\nswiper\nmega-menu\nmenu-mobile\nmobile-menu\nselect2\nactive\nslick\npop-\ndrawer\nsidebar\nowl\nloading\nstars\nmodal\nwc-block\nwp-block-navigation\nshow-password-input\nscreen-reader-text\neasyzoom\nicon-fullscreen\naos\ntab\nemoji\narrow",
			),
			'ignore_urls' => array(
				'name'   => 'Ignore URLs',
				'helper' => 'Enter URLs that should be ignored. Regex compatible. Separate multiple with new lines',
				'value' => '',
			),	
			'ignore_cookies' => array(
				'name'   => 'Ignore Cookies',
				'helper' => 'Enter cookies that should be ignored for both CSS collection and rewrite. Regex compatible. Separate multiple with new lines',
				'value'  => 'wordpress_logged_in',
			),
			'inclusion_mode' => array(
				'name'   => 'Inclusion Mode',
				'helper' => 'Selects the method used to include the CSS on the page',
				'value' => 'inline',
			),
			'generation_res' => array(
				'name'   => 'Generation Resolutions',
				'helper' => 'Screen resolutions at which the Unused CSS will be generated',
				'value' => array('mobile'=>'false','tablet'=>'false','desktop'=>'true'),
			),
			'csrf_expiry_seconds' => array(
				'name'   => 'CSRF Expiry',
				'helper' => 'Number of seconds for the CSRF token to be valid',
				'value' => '30',
			),
			'force_includes_limit' => array(
				'name'   => 'Force Includes Limit',
				'helper' => 'Limit the number of auto-generated classes to be force included',
				'value' => '50',
			)							
			),		
		'speed_js'  => array(
			'force_js_inline' => array(
				'name'   => 'Force JS Inline',
				'helper' => 'Scripts matching these patterns will be inlined. Separate multiple with new lines',
				'value' => '',
			),
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
				'helper' => 'Do not defer on URLs matching these patterns. Separate multiple with new lines',
				'value'  => '',
			),						
			'delay_js' => array(
				'name'   => 'Delay JS',
				'helper' => 'Delay JS execution by a certain amount of seconds. If logged in cache exclusion is enabled, JS will run immediately after excluded area(s) load in.',
				'value'  => '6',
			),												
			'delay_exclude' => array(
				'name'   => 'Exclude scripts from delay',
				'helper' => 'Do not delay scripts matching these patterns. Separate multiple with new lines',
				'value' =>  'js-extra',
			),	
			'delay_exclude_urls' => array(
				'name'   => 'Exclude URLs from delay',
				'helper' => 'Do not delay on URLs matching these patterns. Separate multiple with new lines',
				'value' =>  '',
			),						
			'delay_seconds' => array(
				'name'   => 'Delay Seconds',
				'helper' => 'Amounts of seconds to delay JS execution. Add data-delay attribute to scripts to override this value. E.g data-delay="2" for 2 seconds.',
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
			'trigger_native_interception' => array(
				'name'   => 'Trigger Native Interception',
				'helper' => '',
				'value' => array('dom'=>array('window'=>'false','document'=>'false'),'load'=>array('window'=>'true','document'=>'false'),'readystate'=>array('window'=>'false','document'=>'false')),
			),					
			'trigger_native_broadcast' => array(
				'name'   => 'Trigger Native Broadcast',
				'helper' => '',
				'value' => array('dom'=>array('window'=>'true','document'=>'false'),'load'=>array('window'=>'false','document'=>'false'),'readystate'=>array('window'=>'true','document'=>'false')),
			),																									
			'trigger_jquery_broadcast' => array(
				'name'   => 'Trigger jQuery Events',
				'helper' => '',
				'value' => array('dom'=>array('window'=>'false','document'=>'true'),'load'=>array('window'=>'false','document'=>'true')),
			),	
			'trigger_replays' => array(
				'name'   => 'Trigger Replays',
				'helper' => 'If a user clicks or mouseovers before the JS is ready, replay the event once it is.',
				'value' => 'true',
			),				
		),					
		'speed_code'  => array(
			'skip_lazyload' => array(
				'name'   => 'Skip Lazyload',
				'helper' => 'Enter (partial) image filenames to skip lazy loading. These images will be preloaded.',
				'value' => '',
			),
			'force_lazyload' => array(
				'name'   => 'Force Lazyload',
				'helper' => 'Enter (partial) image filenames to force lazy loading. These images will be lazy loaded even if identified as LCP.',
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
				'helper' => "Do not preload a font if it's an icon font.",
				'value' => 'false',
			),
			'lazyload_icon_fonts' => array(
				'name'   => "Lazyload icon fonts",
				'helper' => "Only load icon fonts upon JavaScript load",
				'value' => 'false',
			),
			'preload_fonts_desktop_only' => array(
				'name'   => 'Preload Fonts only on Desktop',
				'helper' => 'Will not preload fonts on mobile.',
				'value' => 'false',
			),
			'preload_fonts_intelligently' => array(
				'name'   => 'Preload Fonts intelligently',
				'helper' => 'Detect fonts and preload them (but not icon fonts, and not on mobile)',
				'value' => 'false',
			),				
			'system_fonts' => array(
				'name'   => 'Use system fonts',
				'helper' => 'Use high-speed system fonts for mobile devices. Will automatically prevent preloading standard fonts on mobile devices.',
				'value' => 'false',
			),		
			'icon_font_names' => array(
				'name'   => 'Icon font names',
				'helper' => 'List of icon font filenames. A common list is included by default',
				'value' => "fontawesome\nfa-\nmaterialicons\nionicons\nfeather\nsimplelineicons\ntypicons\nentypo\nicomoon\nlineicons\niconfont\nmdi\nflaticon\nicons\nmodules\nwoosidecart",
			)																						
		),		
		'speed_replace'  => array(
			'speed_find_replace' => array(
				'name'   => 'HTML find/replace',
				'value' => '',
			),			
		),	
		'speed_insertion'  => array(
			'head_code' => array(
				'name'   => 'Head Code',
				'value' => '',
			),	
			'body_code' => array(
				'name'   => 'Body Code',
				'value' => '',
			),						
		),					
		'bloat' => array(
			//Core
			'emojis' => array(
				'name'   => 'Remove Emojis',
				'helper' => 'Adds an extra JS file and inline CSS on every page. Rarely needed on modern sites.',
				'value'  => 'false',
			),
			'jquery_migrate' => array(
				'name'   => 'Disable jQuery Migrate',
				'helper' => 'Legacy compatibility layer. Safe to remove if your theme/plugins do not rely on old jQuery APIs.',
				'value'  => 'false',
			),
			'rss_feeds' => array(
				'name'   => 'Disable RSS/Atom feeds',
				'helper' => 'Unused on many sites and frequently hit by bots. Disable if you do not support feed subscribers.',
				'value'  => 'false',
			),
			'oembed' => array(
				'name'   => 'Disable oEmbed functionality',
				'helper' => 'Removes oEmbed discovery and related endpoints. Rarely required unless you embed WP content cross-site.',
				'value'  => 'false',
			),
			'heartbeat' => array(
				'name'   => 'Limit Heartbeat API',
				'helper' => 'Reduces frequent AJAX polling in admin (and sometimes frontend). Can improve backend responsiveness.',
				'value'  => 'false',
			),
			//Admin Interface
			'autosave' => array(
				'name'   => 'Increase autosave interval',
				'helper' => 'Fewer autosaves means less DB churn while editing, especially for long posts and busy editorial teams. Sets to 5 mins.',
				'value'  => 'false',
			),
			'post_revisions' => array(
				'name'   => 'Limit post revisions',
				'helper' => 'Revisions can bloat wp_posts and wp_postmeta on busy sites. Limit to 3 revisions per post.',
				'value'  => 'false',
			),
			'block_editor' => array(
				'name'   => 'Disable the block editor',
				'helper' => 'If you only use Classic Editor, disabling Gutenberg reduces editor assets and related complexity.',
				'value'  => 'false',
			),		
			'xmlrpc' => array(
				'name'   => 'Disable XML-RPC',
				'helper' => 'Common brute-force and abuse target. Disable unless you explicitly need Jetpack or remote publishing features.',
				'value'  => 'false',
			),				
			//Media
			'attachment_pages' => array(
				'name'   => 'Disable attachment pages',
				'helper' => 'Often thin content and SEO dead weight. Redirect to the file or parent post instead.',
				'value'  => 'false',
			),		
			'wp_sitemaps' => array(
				'name'   => 'Disable core XML sitemaps',
				'helper' => 'Redundant if an SEO plugin already provides sitemaps. Disable one to avoid duplication.',
				'value'  => 'false',
			),				
			//Discussion	
			'comments' => array(
				'name'   => 'Disable comments sitewide',
				'helper' => 'Eliminates spam surface and comment related queries/admin overhead if you do not use comments.',
				'value'  => 'false',
			),
			'pingbacks_trackbacks' => array(
				'name'   => 'Disable pingbacks/trackbacks',
				'helper' => 'Rarely useful and commonly abused. Disabling reduces attack surface and spam.',
				'value'  => 'false',
			),
			//WooCommerce
			'woocommerce_cart_fragments' => array(
				'name'   => 'Disable WooCommerce cart fragments',
				'helper' => 'Adds JS and AJAX requests sitewide. Disable if you do not need live cart updates in the header.',
				'value'  => 'false',
			),
		),
		'external_scripts' => array(
			'gfonts_locally' => array(
				'name'   => 'Should google fonts be hosted locally?',
				'helper' => '',
				'value' => 'false',
			),					
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

	protected static function get_initial_config() {
		return self::$initial_config;
	}

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

		$initial_config = self::get_initial_config();

		// Get the saved configuration from the database
		self::$config = (array)get_option( 'spress_namespace_CONFIG', array() );
		self::$config = self::array_merge_recursive_unique( $initial_config, self::$config );

		// Example of how to update one of the default configs
		/*$docs = self::$initial_config['icon_font_names'];
		$update = array("config_key"=>"icon_font_names","iframe"=>$icon_font_names['iframe']['value']);
		self::update_config($update);*/


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

				$current_url_raw = Speed::server_var('REQUEST_URI', '/');
				$current_url = Speed::get_sanitized_uri( sanitize_text_field( $current_url_raw ) );

		//Still allow speedifypress backend admin
		if(strstr($current_url,"/wp-json/speedifypress/")){
			return true;
		}		

			// Disable in WordPress Customizer (screen + preview)
			if (
				strstr($current_url, '/wp-admin/customize.php') ||
				Speed::request_has_query_arg('customize_changeset_uuid') ||
				Speed::request_has_query_arg('customize_messenger_channel')
			) {
				return false;
			}

		// Disable for builder querystrings
		$builder_querystrings = array(
		'vc_',          // WPBakery: vc_action, vc_editable, etc.
		'fl_builder',   // Beaver Builder
		'bricks',       // Bricks
		'et_fb',        // Divi
		'fb',           // Divi
		'ct_builder',   // Oxygen
		'brizy',        // Brizy (also brizy_post)
		'vcv-',         // Visual Composer Website Builder (vcv-action, vcv-source-id)
		);

			// Loop through each builder keyword
			$query_keys = array_keys(Speed::get_query_args());
			foreach ($builder_querystrings as $builder_querystring) {
				foreach ($query_keys as $key) {
					if (strpos($key, $builder_querystring) !== false) {
						return false;
					}
				}
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
		foreach ((array)$array as $key => $value) {
			foreach((array)$value AS $subkey=>$subvalue) {
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
     * Validates & sanitises a single‐section config array,
     * supporting dot‐notation for nested array fields.
     *
     * Expects:
     *   [
     *     'config_key' => 'section_name',
     *     'simple_field' => 'value',
     *     'array_field.subkey1' => 'val1',
     *     'array_field.subkey2' => 'val2',
     *     // …
     *   ]
     *
     * Returns the same shape (including config_key) but only with keys
     * defined in $initial_config[section_name], and all values cleaned.
     *
     * @param array $config Raw config (must include 'config_key').
     * @return array Sanitised config, or [] if invalid.
     */
    public static function ensure_valid(array $config) {
        // 1) Must specify which section we're validating
        if (empty($config['config_key'])) {
            return [];
        }
        $section = $config['config_key'];

        // 2) That section must exist in our defaults
        if (!isset(self::$initial_config[$section])) {
            return [];
        }
        $section_meta = self::$initial_config[$section];

        // Prepare normalized input: handle dot notation for array fields
        $normalized = [];
        foreach ($config as $key => $value) {
            // skip the config_key entry itself
            if ($key === 'config_key') {
                continue;
            }
            // skip completely empty keys
            if ($key === '' || $key === null) {
                continue;
            }
            // dot notation: e.g. array_field.subkey or array_field.subkey.other
            if (strpos($key, '.') !== false) {
                list($root, $sub) = explode('.', $key, 2);
                // only group if the root key exists and its default value is array
                if (isset($section_meta[$root]) && is_array($section_meta[$root]['value'])) {
                    if (!isset($normalized[$root]) || !is_array($normalized[$root])) {
                        $normalized[$root] = [];
                    }
                    $target =& $normalized[$root];
                    $path = explode('.', $sub);
                    $last = array_pop($path);
                    foreach ($path as $segment) {
                        if (!isset($target[$segment]) || !is_array($target[$segment])) {
                            $target[$segment] = [];
                        }
                        $target =& $target[$segment];
                    }
                    $target[$last] = $value;
                    unset($target);
                    continue;
                }
            }
            // otherwise, keep as-is
            $normalized[$key] = $value;
        }

        // Build cleaned output, preserving config_key
        $clean = ['config_key' => $section];

        // 3) Loop through each normalized key
        foreach ($normalized as $key => $raw_value) {
            // only accept known fields
            if (!isset($section_meta[$key])) {
                continue;
            }

            // special case: HTML find/replace array passes raw
            if ($section === 'speed_replace' && $key === 'speed_find_replace' && is_array($raw_value)) {
                $clean[$key] = array_values(array_filter($raw_value, function ($item) {
                    return is_array($item);
                }));
                continue;
            }

            // special case: logged in user exception find/replace array passes raw
            if ($section === 'speed_cache' && $key === 'cache_logged_in_users_exceptions' && is_array($raw_value)) {
                $clean[$key] = array_values(array_filter($raw_value, function ($item) {
                    return is_array($item);
                }));
                continue;
            }			

            // special case: raw JS snippet allowed
            if ($section === 'speed_js' && $key === 'load_complete_js') {
                $clean[$key] = (string)$raw_value;
                continue;
            }

            // special case: raw head and body code allowed
            if ($section === 'speed_insertion' && ($key === 'head_code' || $key === 'body_code')) {
                $clean[$key] = (string)$raw_value;
                continue;
            }			
            // array field: sanitize each nested value (support nested arrays)
            if (is_array($raw_value)) {
                $sanitize_deep = function ($value) use (&$sanitize_deep) {
                    if (is_array($value)) {
                        $out = [];
                        foreach ($value as $k => $v) {
                            $out[$k] = $sanitize_deep($v);
                        }
                        return $out;
                    }
                    return sanitize_textarea_field((string)$value);
                };

                $clean[$key] = $sanitize_deep($raw_value);
            }
            // scalar field: sanitize as textarea
            else {
                $clean[$key] = sanitize_textarea_field((string)$raw_value);
            }
        }

        return $clean;
    }


	/**
	 * Update the config with new values
	 *
	 * @param array $new_config The new config values
	 *
	 * @return void
	 */
	public static function update_config( $new_config = array() ) {

		$update_advanced_cache = false;

			if ( isset( $new_config['config_key'] ) ) {

				$config_key = $new_config['config_key'];

				//Get the array frame
				$frame = self::$config[ $config_key ];

				// Expand intelligent font shortcut before iterating keys so
				// dependent values are persisted in this same update pass.
				if ($config_key === 'speed_code' && isset($new_config['preload_fonts_intelligently'])) {
					if ($new_config['preload_fonts_intelligently'] === "true") {
						$new_config['preload_fonts'] = "true";
						$new_config['dont_preload_icon_fonts'] = "true";
						$new_config['preload_fonts_desktop_only'] = "true";
					} else {
						$new_config['preload_fonts'] = "false";
						$new_config['dont_preload_icon_fonts'] = "false";
						$new_config['preload_fonts_desktop_only'] = "false";
					}
				}
			

				//Run through the frame and find matching keys
				foreach ( $frame as $key_to_update=> $value ) {

					if ( isset( $new_config[ $key_to_update ] ) ) {
						
						//Custom methods for updates here
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

								echo esc_url( $url );
								
							}
						}

						//If disabling page cache, purge it
						if($key_to_update == "cache_mode" && $new_config[ $key_to_update ] == "disabled") {
							Speed\Cache::clear_cache();
						}

						//If disabling CSS cache or switching to preview only, purge it
						if($key_to_update == "speed_css" && ($new_config[ $key_to_update ] == "disabled" || $new_config[ $key_to_update ] == "preview")) {
							Speed\CSS::clear_cache();
						}					
						
						//Save to advanced cache
						if($key_to_update == "separate_cookie_cache" ||
						$key_to_update == "force_gzipped_output" ||
						$key_to_update == "csrf_expiry_seconds" ||
						$key_to_update == "cache_path_uploads" ||
						$key_to_update == "cache_logged_in_users" ||
						$key_to_update == "cache_mobile_separately" ||	
						$key_to_update == "ignore_querystrings" ||	
						$key_to_update == "cache_lifetime" ||	
						$key_to_update == "plugin_mode" ||	
						$key_to_update == "disable_urls" ||	
						$key_to_update == "preload_fonts_desktop_only") {
							$update_advanced_cache = true;
						}
						
						//Save frame
						$frame[ $key_to_update ]['value'] = $new_config[ $key_to_update ];

					} else {

						//For the tables, if there is no key it means everything has been deleted
						if(
						($key_to_update == "speed_find_replace")
						|| 
						(isset($new_config['cache_logged_in_users']) && $key_to_update == "cache_logged_in_users_exceptions")
						) {
							$frame[ $key_to_update ]['value'] = "";	
						}				


					}

				}

				//Update the config
				self::$config[ $config_key ] = $frame;

				//Update the advanced cache for certain variables
				if($update_advanced_cache) {
					Speed\Cache::init();
					Speed\Cache::write_advanced_cache();
				}

		}

		update_option( 'spress_namespace_CONFIG', self::$config, false );

	}




}
