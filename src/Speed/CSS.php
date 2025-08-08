<?php

namespace SPRESS\Speed;

use SPRESS\App\Config;
use SPRESS\Speed;
use SPRESS\Speed\Cache;
use SPRESS\Speed\Unused;

use Wa72\Url\Url;
use MatthiasMullie\Minify;
use simplehtmldom\HtmlDocument;

/**
 * This `CSS` class is responsible for optimizing and managing CSS files for faster 
 * page load times. It caches processed CSS files, rewrites URLs, and integrates 
 * with the WordPress enqueue system to serve optimized CSS assets.
 * 
 * @package SPRESS
 */
class CSS {

    //Enabled, previewm stats only or disabled
    public static $mode;

    //Inline, inline-grouped or file
    public static $inclusion_mode;

    //The default include patterns for the unused CSS script
    public static $default_include_patterns = array();

    public static $script_name = "speed-css";

	public static function init() {

        //Set the mode
        self::$mode = Config::get('speed_css','css_mode');

        //Set the inclusion mode
        self::$inclusion_mode = Config::get('speed_css','inclusion_mode');

        //Enqueue the script for our CSS processing
        if((self::$mode == "enabled" || self::$mode == "stats" || self::$mode == "preview") && Speed::is_frontend() === true) {
        
            //No match, include script
            if(self::is_blocked_url() == false) {
                add_action( 'wp_enqueue_scripts', array(__CLASS__,'public_enqueue_css') );    
            }
            
        }

        $include_partytown = trim(Config::get('speed_css', 'include_partytown'));
        if($include_partytown) {
            add_action( 'wp_enqueue_scripts', array(__CLASS__,'public_enqueue_partytown') );    
        }
        
        // Purge cache on updating post
        // Make sure the function name doesn't include purge|cache|clear 
        // to avoid loop
        add_action('post_updated', [__CLASS__, 'do_post_updated'], 10, 1);


	}

    /**
     * Processes an array of CSS files and saves them to a cache directory.
     * 
     * This function takes an array of CSS files and their corresponding URLs, 
     * rewrites absolute URLs, saves the processed CSS files to a cache directory. 
     * It also creates a lookup file to map original filenames to new filenames 
     * 
     * @param array $force_includes An array of selectorTexts, keyed by rules, keyframes, fonts
     * @param string $source_url The URL of the source CSS file.
     * @param int $post_id The id of the post if available
     * @param array $post_types An array of post types
     * @param array $invisible An array of invisible post types
     * @param array $used_font_rules An array of used font files
     * @param array $lcp_image An array of LCP images
     * @return void
     */
    public static function process_css( $force_includes, $source_url, $post_id = null, $post_types = null, $invisible = null, $used_font_rules = null, $lcp_image = null ) {

        //Get/set the elements that should be always included
        $force_includes = self::get_update_force_includes($force_includes, $source_url);            

        //Get cache directory for the URL
        $cache_dir =  Speed::get_cache_dir_from_url($source_url);

        //HTML file
        $html_file = $cache_dir . "CSS_page_cache.html.gz";

        if(!file_exists($html_file)) {
            return;
        }

        //Get HTML
        $html = @gzdecode(file_get_contents($html_file));
        if ( $html === false ) {
            return;
        }

        //Gather all Unused CSS in document
        $css_vars = self::get_css_vars_array();
        
        //Set force include patterns
        $include_patterns = (array)json_decode($css_vars['include_patterns']);

        //Merge with force includes
        $include_patterns = array_merge($include_patterns, $force_includes);

        //Get unused
        $unused = Unused::init($html, $include_patterns, null);
        
        /*
        $unused = array();
        $unused['CSS'] = $force_includes;
        */

        //A lookup of old to new filesname
        $lookup = array();

        //Get cache directory for the URL
        $cache_dir =  Speed::get_cache_dir_from_url($source_url);

        //Set lookup file
        $lookup_file = $cache_dir . "lookup.json";

        // Create the cache directory if it does not exist
        !is_dir($cache_dir) && mkdir($cache_dir, 0755, true);        

        //Run through the array
        foreach((array)$unused['CSS'] AS $url=>$csstxt) {

            //Rewrite absolutes
            $csstxt = self::rewrite_absolute_urls($csstxt, $url);
                        
            //Save to cache            
            $original_filename = ($url);
            $new_filename = md5($csstxt) . ".css";            

            //Get path
            $cache_file_path = Speed::get_root_cache_path() . "/". $new_filename;

            //Save to root path
            if(!file_exists($cache_file_path)) {
                file_put_contents($cache_file_path, $csstxt, LOCK_EX);                             
            }

            //Create lookup
            $lookup[$original_filename] = $new_filename;
            

        }
        
        //Get current lookup        
        // Ensure file exists before attempting to read
        if (!file_exists($lookup_file) || !is_readable($lookup_file)) {
            $current_lookup = [];
        } else {
            $file_contents = file_get_contents($lookup_file);
            $data = json_decode($file_contents, true); // Decode as an associative array

            // Ensure lookup key exists and is an array
            $current_lookup = isset($data['lookup']) && is_array($data['lookup']) ? $data['lookup'] : [];
        }


        //Merge
        $merged_lookup = array_merge($current_lookup,$lookup);

        //Create the data array to save
        $data = array(
            'lookup' => $merged_lookup,
            'source_url' => $source_url,
            'post_id' => $post_id,
            'post_types' => $post_types,
            'invisible' => $invisible,
            'used_font_rules' => $used_font_rules,
            'lcp_image' => $lcp_image

        );


        //Save the lookup
        file_put_contents($lookup_file, (string)json_encode($data), LOCK_EX);  

        //Update cached file

        //Override the URL
        Speed::$injected_url = $source_url;

        //Get currently cached content
        $cache_file = Cache::get_cache_filepath($source_url,"html");

        //See if it exists
        if(!file_exists($cache_file)) {
            return $unused;
        }
        
        $output = file_get_contents($cache_file);

        //Rewrite with new CSS if not already done
        if(!strstr($output,"|@@@CSSDone@@@")) {
            
            $output = self::rewrite_css($output,$source_url);

            //Add invisible elements
            $dom = (new HtmlDocument(""))->load($output,true, false);   
            $dom = Speed::add_invisible_elements($dom);  
            $output = $dom->outertext;

            //Resave cache file
            Cache::save_cache($cache_file,$output," |@@@CSSDone@@@");

        }

        //Mark this path as needing a Cloudflare update
        $cache_dir  = Speed::get_cache_dir_from_url($source_url);
        file_put_contents($cache_dir."update_required","");

        //Integrations
        if(class_exists('Nginx_Helper') && $post_id) {
            $post_object = get_post( $post_id );
            do_action( 'transition_post_status', 'publish', 'publish', $post_object );
        }        
        
        global $kinsta_cache;
        if ( ! empty( $kinsta_cache->kinsta_cache_purge ) ) {
            // Flush full-page + edge + CDN caches
            //$kinsta_cache->kinsta_cache_purge->initiate_purge( $post_id, 'post' );//didn't seem to be working properly
            $kinsta_cache->kinsta_cache_purge->purge_complete_site_cache();
        }
                

        return $unused;

    }    

    /**
     * Merges $force_includes with a global list of force includes, and saves
     * the merged list back to the global list. This is used to update the
     * force includes list when a cache is updated.
     *
     * @param array $force_includes The new list of force includes.
     * @param string $source_url The source URL of the cache being updated.
     *
     * @return array The updated list of force includes.
     */
    public static function get_update_force_includes($force_includes, $source_url) {

        $file = Speed::get_pre_cache_path() . "/force_includes.json";

        if(file_exists($file)) {
            $global_force_includes = (array)json_decode(file_get_contents($file),true);
        } else {
            $global_force_includes = array();
        }

        if (! isset($global_force_includes[$source_url])) {
            $global_force_includes[$source_url] = [];
        }        
        
        //Merge, if they have the same key elements should be added
        $force_includes = $global_force_includes[$source_url] = array_values(array_unique(array_filter(array_merge((array) $global_force_includes[$source_url], $force_includes))));       

        //Save back
        file_put_contents($file, json_encode($global_force_includes),LOCK_EX);

        return $force_includes;

    }

    /**
     * Replaces CSS links in the provided HTML output with optimized versions 
     * from the lookup file.
     *
     * @param string $output The HTML output to optimize.
     * @param string $direct Is the output being provided directly
     * @return string The optimized HTML output.
     */
    public static function rewrite_css($output) {

        $start_time = microtime(true);

        // Early exit?
        if(self::should_exit_early() === true) {
            return $output;
        }

        //Keep CSS inline
        if(self::$inclusion_mode == "inline-grouped") {
            $inline_css = "";
        }

        //Get current URL
        $current_url = Speed::get_url();

        //See if there is a lookup file
        $lookup_file = self::get_lookup_file( $current_url );
        if(!file_exists($lookup_file)) {
            return $output;
        }

        //Check if we have a lookup file
        $data_object = json_decode((string)file_get_contents($lookup_file));
        $lookup = $data_object->lookup;
        
        if(is_object($lookup)) {
            
            //Get the sheets from the output
            $sheets = self::get_stylesheets($output);      

            //$output .= "<!--" . print_r($sheets,true) . "-->";
            
            //Replace with lookup file
            $count = 0;
            $first_tag = "";
            foreach($sheets[0] AS $key => $tag) {
                
                if(!isset($sheets[1][$key])) {
                    continue;
                }

                //Get sheet URL
                $sheet_url = $sheets[1][$key];

                // Extract relevant attributes
                $media_attr = '';
                $title_attr = '';
                $disabled_attr = '';

                if (preg_match('/media=[\'"]([^\'"]+)[\'"]/', $tag, $matches)) {
                    $media_attr = trim($matches[1]);
                }
                if (preg_match('/title=[\'"]([^\'"]+)[\'"]/', $tag, $matches)) {
                    $title_attr = trim($matches[1]);
                }
                if (preg_match('/\sdisabled\b/', $tag)) {
                    $disabled_attr = 'disabled';
                }

                //Remove version
                $sheet_url = Unused::url_remove_querystring($sheet_url);

                // Check if this is an inline stylesheet (key begins with "id-")
                if (strpos($sheet_url, 'id-') === 0) {
                    if (isset($lookup->$sheet_url)) {
                        if (self::$mode == "stats") {
                            // In stats mode, just mark it as processed.
                            $new_tag = str_replace("<style", "<style data-spress-processed='true'", $tag);
                        } else {
                            // For inline styles, simply replace the tag in place.
                            $file = Speed::get_root_cache_path() . "/" . $lookup->$sheet_url;
                            if (file_exists($file)) {
                                $newInlineCSS = file_get_contents($file);

                                // Optionally, minify the inline CSS.
                                $minifier = new Minify\CSS($newInlineCSS);
                                $newInlineCSS = $minifier->minify();
                            } else {
                                $newInlineCSS = "";
                            }
                            if($newInlineCSS) {
                                if (!empty($media_attr)) {
                                    $newInlineCSS = "@media {$media_attr} {" . $newInlineCSS . "}";
                                }
                                $attrs = "rel='spress-inlined-".$sheet_url."' data-spcid='".$sheet_url ."'";
                                if (!empty($title_attr)) {
                                    $attrs .= " data-original-title='" . htmlspecialchars($title_attr, ENT_QUOTES) . "'";
                                }
                                if (!empty($disabled_attr)) {
                                    $attrs .= " data-original-disabled='true'";
                                }
                                $new_tag = "<style $attrs>" . $newInlineCSS . "</style>";
                            } else {
                                $new_tag = "";
                            }
                        }
                        $output = str_replace($tag, $new_tag, $output);
                    }
                    continue; // Skip further processing for inline styles.
                }

                //Make URL absolute
                $baseurl = Url::parse($sheet_url);
                $sheet_url_lookup = $baseurl->makeAbsolute($baseurl)->write();  
                $sheet_url_lookup = preg_replace("@^//@", isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https://' : 'http://', trim($sheet_url_lookup));
                $sheet_url_lookup = html_entity_decode($sheet_url_lookup);

                if(isset($lookup->$sheet_url_lookup)) {   

                    if(self::$inclusion_mode == "inline" || self::$inclusion_mode == "inline-grouped") {

                        $count++;
                                                
                        $file = Speed::get_root_cache_path() . "/" . $lookup->$sheet_url_lookup;
                        $inline_file_contents = "";
                        if(file_exists($file)) {
                            $inline_file_contents = file_get_contents($file);

                            $minifier = new Minify\CSS($inline_file_contents);
                            $inline_file_contents = $minifier->minify();        

                            if (!empty($media_attr)) {
                                $inline_file_contents = "@media {$media_attr} {" . $inline_file_contents . "}";
                            }

                            if(self::$inclusion_mode == "inline") {

                                $attrs = "rel='spress-inlined' data-original-href='".$sheet_url."'";
                                if (!empty($title_attr)) {
                                    $attrs .= " data-original-title='" . htmlspecialchars($title_attr, ENT_QUOTES) . "'";
                                }
                                if (!empty($disabled_attr)) {
                                    $attrs .= " data-original-disabled='true'";
                                }

                                $output = str_replace($tag,"<style $attrs>".$inline_file_contents. "</style>",$output);

                            } else {

                                $inline_css .= $inline_file_contents;

                                //Save first tag for replacement
                                if($count == 1) {
                                    $first_tag = $tag;
                                } else {
                                    $output = str_replace($tag,"",$output);
                                }

                            }

                        }

                    } else {

                        if(self::$mode == "stats") {
                            
                            // In stats mode, just mark it as processed.
                            $new_tag = str_replace("<link ","<link data-spress-processed='true' ",$tag);                        

                        } else {

                            if($lookup->$sheet_url_lookup == md5("").".css") {  //Blank files
                                $new_tag = "";
                            } else {
                                $new_tag = str_replace($sheet_url,Speed::get_root_cache_url() . "/" . $lookup->$sheet_url_lookup,$tag);
                                //Tag as processed
                                $new_tag = str_replace("<link ","<link data-spress-processed='true' ",$new_tag);

                                // Restore missing attributes if necessary
                                if (!empty($media_attr) && strpos($new_tag, 'media=') === false) {
                                    $new_tag = str_replace(">", " media='" . htmlspecialchars($media_attr, ENT_QUOTES) . "'>", $new_tag);
                                }
                                if (!empty($title_attr) && strpos($new_tag, 'title=') === false) {
                                    $new_tag = str_replace(">", " title='" . htmlspecialchars($title_attr, ENT_QUOTES) . "'>", $new_tag);
                                }
                                if (!empty($disabled_attr) && strpos($new_tag, 'disabled') === false) {
                                    $new_tag = str_replace(">", " disabled>", $new_tag);
                                }
                            }

                        }
                        $output = str_replace($tag,$new_tag,$output);

                    }

                } else {
                
                    //Not found in lookup, mark as processed
                    $new_tag = str_replace("<link ","<link data-spress-processed='true' ",$tag); 
                    $output = str_replace($tag, $new_tag, $output);

                }

            }

            //Add preloads for fonts and lcp image
            $preload = "";
            $font_preload = "";
            if(Config::get('speed_code', 'preload_fonts') === 'true'
            && !strstr($output,"FontPreload")
            ) {

                $dont_preload_icon_fonts = Config::get('speed_code','dont_preload_icon_fonts');

                $fonts = array();
                if(is_array($data_object->used_font_rules)) {
                    $fonts = $data_object->used_font_rules;
                }
                foreach($fonts AS $font) {

                    $local_file = Unused::url_to_local($font);
                    if($dont_preload_icon_fonts === 'true' && self::is_icon_font($local_file) == true) {
                        continue;
                    }                    

                    if($font) {
                        $font_preload .= "\n" . "<link rel='preload' href='" . $font . "' as='font' fetchpriority='high' crossorigin='anonymous'>";
                    }
                }
                if($font_preload != '') {
                    $preload = "<!-- FontPreload -->".$font_preload . "<!-- /FontPreload -->";
                    if(Config::get('speed_code', 'preload_fonts_desktop_only') === 'true') {
                        $preload .= "<!-- SPRESS_preload_fonts_desktop_only -->";
                    }
                }
            }

            $lcp_image = $data_object->lcp_image ?? false;
            if ( $lcp_image ) {
                // Get current host (or empty string if not set)
                $current_host = isset( $_SERVER['HTTP_HOST'] ) ? $_SERVER['HTTP_HOST'] : '';
            
                // Only preload if:
                // 1) URL is relative (no "://"), OR
                // 2) it contains the current host
                if ( false === strstr( $lcp_image, '://' ) || false !== strstr( $lcp_image, $current_host ) ) {
                    $preload_html = "<link rel='preload' href='" . esc_url( $lcp_image ) . "' as='image' />";
            
                    if ( false === strstr( $output, $preload_html ) ) {
                        $preload .= "\n" . $preload_html;
                    }
                }
            }
                    
            // only replace the first </title> with itself + $preload
            $output = preg_replace(
                '/<\/title>/', 
                '</title>' . $preload, 
                $output, 
                1
            );

            if(self::$inclusion_mode == "inline-grouped") {

                //Minify all as a grouped set
                $minifier = new Minify\CSS($inline_css);
                $inline_css = $minifier->minify(); 
                
                $output = str_replace($first_tag,"<style rel='spress-inlined'>".$inline_css."</style>",$output);

            }

        }       

        $end_time = microtime(true);
        $elapsed_time = $end_time - $start_time;
        $output .=  "<!-- Elapsed CSS " . number_format($elapsed_time,2) . "-->";

        return $output;
    }

     

    /**
     * Determine if a font file is likely an icon font.
     *
     * @param string $fontFile Path to .woff or .woff2 file
     * @return bool
     * @throws Exception if file not found
     */
    public static function is_icon_font($fontFile)    {

        if (!file_exists($fontFile)) {
            return false;
        }

        $contents = file_get_contents($fontFile);
        $lowerContent = strtolower($contents);

        // 1. Name-based heuristic for common icon font names
        $knownIconFontNames = [
            'fontawesome',
            'materialicons',
            'ionicons',
            'feather',
            'simplelineicons',
            'typicons',
            'entypo',
            'icomoon',
            'lineicons',
            'iconfont',
            'mdi',
            'flaticon',
            'icons',
        ];

        foreach ($knownIconFontNames as $name) {
            if (strpos(strtolower($fontFile), $name) !== false) {
                return true; // Found a known icon font keyword
            }
        }


        return false;
    }
    

    /**
     * Saves the final HTML output to a cache file on disk.
     *
     * @param string $output The final HTML output.
     * @return string The output, maybe modified.
     */
    public static function do_html_cache($output) {

        // Early exit?
        if(self::should_exit_early() === true) {
            return $output;
        }
        
        //Skips because of URL/header issues?
        $url = Speed::get_url();  
        if (Cache::meets_url_requirements($url, $output) === false) {
            return $output;
        }

        //Get file
        $path_to_file = self::get_css_pagecache_file();

        //Write file
        if(!file_exists($path_to_file) && !file_exists($path_to_file.".gz")) {
            $output = Cache::save_cache($path_to_file, $output, "CSS html cached", true);
        }
        
        return $output;


    }

    /**
     * Retrieves the path to the CSS page cache file for the current URL.
     *
     * @return string The full file path for the CSS page cache file.
     */
    public static function get_css_pagecache_file() {

        //Get original URL
        $url = Speed::get_url();        

        $cache_dir  = Speed::get_cache_dir_from_url($url);
        $filename   = "CSS_page_cache.html";
        $path_to_file = $cache_dir . $filename;

        return $path_to_file;

    }

    /**
     * Determines if the current operation should exit early based on various conditions.
     *
     * @return bool True if any condition for early exit is met, otherwise false.
     * 
     * This function checks if the current execution context should not proceed due to:
     * - Not being on the front-end.
     * - The mode being set to "disabled".
     * - The mode set to "preview" and the current user lacking management permissions.
     * - The current URL being blocked.
     */

    public static function should_exit_early() {

        //Only run on front-end
        if(Speed::is_frontend() === false) {
            return true;
        }

        //Don't run if we're disabled or stats only
        if(self::$mode == "disabled") {
            return true;
        }

        if(self::$mode == "preview" && !current_user_can( 'manage_options' )) {
            return true;
        }   

        //Don't run if blocked
        if(self::is_blocked_url() == true) {
            return true;
        }

        return false;

    }
     
    /**
     * Get the LCP image for the current URL
     *
     * @return string|false The URL of the LCP image, 
     * or false if no image is found
     * 
     */
    public static function get_lcp_image() {

        //Get current URL
        $current_url = Speed::get_url();        

        $lookup_file = self::get_lookup_file( $current_url );
        if(!file_exists($lookup_file)) {
            return false;
        }

        $data_object = json_decode((string)file_get_contents($lookup_file));
        return $data_object->lcp_image ?? false;

    }

    /**
     * Checks if the current URL matches any of the ignore URLs set in the
     * settings.
     *
     * @return bool 
     * 
     */
    private static function is_blocked_url() {

        // Get ignore URLs and cookies from config
        $ignore_urls = array_filter(explode("\n", Config::get('speed_css', 'ignore_urls')));
        $ignore_cookies = array_filter(explode("\n", Config::get('speed_css', 'ignore_cookies')));
        $current_uri = Speed::get_url();
        $match_found = false;

        // Check URL patterns
        foreach ($ignore_urls as $pattern) {
            if (@preg_match('@' . str_replace('/', '\/', trim($pattern)) . '$@', $current_uri)) {
                $match_found = true;
                break;
            }
        }

        // Check cookie patterns if no URL match was found
        if (!$match_found) {
            foreach ($ignore_cookies as $pattern) {
                $regex = '@' . str_replace('/', '\/', trim($pattern)) . '@';
                foreach ($_COOKIE as $cookie_name => $cookie_value) {
                    // Check if the cookie name or value matches the pattern
                    if (@preg_match($regex, $cookie_name)) {
                        $match_found = true;
                        break;
                    }
                }                
            }
        }

        //Check if we have the nocache querystring
        if (stripos($current_uri, 'nocache') !== false) {
            $match_found = true;
        }

        
        return $match_found;


    }

    /**
     * Enqueues the public scripts for the Speed CSS plugin.
     *
     * This function is hooked into the 'wp_enqueue_scripts' action and is 
     * responsible for enqueuing the plugin's JavaScript file and localizing 
     * the script with the cache directory.
     *
     * @return void
     */
    public static function public_enqueue_css() {

        // Enqueue our js script.
        wp_enqueue_script( self::$script_name, SPRESS_PLUGIN_URL . 'assets/usage_collector/usage_collector.min.js', array( 'jquery' ), SPRESS_VER, true );

		wp_localize_script(
			self::$script_name,
			'speed_css_vars',
			self::get_css_vars_array()
		);      
    }

    /**
     * Returns an array of variables to be localized for the usage collector JavaScript file.
     *
     * This function is used by the public_enqueue_css method to localize the 
     * JavaScript file with the cache directory, include patterns, ignore URLs, and
     * ignore cookies.
     *
     * @return array An array of variables to be localized for the usage collector
     * JavaScript file.
     */
    public static function get_css_vars_array() {

        // Get include patterns, ignore URLs, and ignore cookies
        $default_patterns = self::$default_include_patterns ?? [];
        $include_pattern = self::getConfigArray('include_patterns', $default_patterns);
        $ignore_urls = self::getConfigArray('ignore_urls');
        $ignore_cookies = self::getConfigArray('ignore_cookies');    
        $generation_res = Config::get('speed_css', 'generation_res');

        return array(
            'cache_directory' => Speed::$cache_directory,
            'include_patterns' => $include_pattern,
            'ignore_urls' => $ignore_urls,
            'ignore_cookies' => $ignore_cookies,
            'generation_res' => $generation_res,
        );


    }

    /**
     * Enqueues the partytown script if required by the plugin configuration.
     *
     * This function is hooked into the 'wp_enqueue_scripts' action and is 
     * responsible for enqueuing the partytown script and localizing the script
     * with the cache directory.
     *
     * @return void
     */
    public static function public_enqueue_partytown() {

        $plugin_dir_relative = str_replace(content_url(), '', SPRESS_PLUGIN_URL);
        $party_path = '/wp-content' . $plugin_dir_relative . 'assets/partytown/';

        ?>
        <script rel="js-extra">
            window.partytown = {"lib":"<?php echo $party_path; ?>",
                                "forward":["dataLayer.push"],
                                "resolveSendBeaconRequestParameters": function (url) {
                                                                        return url.hostname.includes('analytics.google') ||
                                                                            url.hostname.includes('google-analytics')
                                                                            ? { keepalive: false }
                                                                            : {};
                                                                    }
                                };
        </script>
        <?php        

        wp_enqueue_script(
            'partytown js-extra',
            SPRESS_PLUGIN_URL . 'assets/partytown/partytown.min.js',
            array(),
            SPRESS_VER,
            false
        );  
        



    }


    public static function update_config_to_cache($new_config) {

        Cache::update_config_to_cache(self::get_css_vars_array(),$new_config,"speed_css_vars");        

    }

    
    /**
     * Retrieves an array of config values as a JSON string from the speed_css config group.
     *
     * If the config value is not set, the provided default array is used.
     *
     * @param string $key The key of the config value to retrieve.
     * @param array $default The default array to return if the config value is not set.
     * @return string The JSON encoded array of config values
     *
     */  
    private static function getConfigArray($key, $default = []) {
        $configValue = Config::get('speed_css', $key);
        $array = $configValue ? explode("\n", $configValue) : $default;
        return json_encode($array);
    }


    /**
     * Extracts stylesheet tags from the provided HTML content.
     *
     * This function retrieves both external stylesheet <link> tags (with rel="stylesheet")
     * and inline <style> tags from the given HTML string. It returns an array containing two elements:
     * - Index 0: an array of the full HTML tags.
     * - Index 1: an array of corresponding keys. For external stylesheets, the key is the href attribute,
     *   and for inline stylesheets, a unique ID is assigned.
     *
     * @param string $html The HTML content to search for stylesheet tags.
     * @return array An array where the first element is the list of stylesheet tags and the second element is the list of keys.
     */
    public static function get_stylesheets($html) {

        // Pattern for external stylesheet <link> tags.
        $link_pattern = '/<link[^>]*\srel=[\'"]stylesheet[\'"][^>]*\shref=[\'"]([^\'"]+)[\'"][^>]*>/i';
        preg_match_all($link_pattern, $html, $link_matches);
        
        // Pattern for inline <style> tags.
        $style_pattern = '/<style[^>]*>(.*?)<\/style>/is';
        preg_match_all($style_pattern, $html, $style_matches);
        
        $tags = [];
        $urls = [];
        
        // Add external stylesheets.
        if (isset($link_matches[0])) {
            foreach ($link_matches[0] as $i => $tag) {
                $tags[] = $tag;
                $urls[] = $link_matches[1][$i]; // Use the captured href attribute as the key.
            }
        }
        
        // Add inline stylesheets.
        if (isset($style_matches[0])) {
            foreach ($style_matches[0] as $i => $tag) {
                $tags[] = $tag;
                //Get content ID
                preg_match("@data-spcid=\"(.*?)\"@",$tag,$matches);
                $spcid = $matches[1] ?? '';
                $urls[] = "id-".$spcid; // Use the content as the key
            }
        }
        
        return [$tags, $urls];
    }


    /**
     * Retrieves the path to the lookup file for the given URL.
     *
     * @param string $url The URL for which to retrieve the lookup file path.
     * @return string The path to the lookup file.
     */
    public static function get_lookup_file($url) {
        
        $file = Speed::get_cache_dir_from_url($url) . "lookup.json";
        return $file;


    }   


    /**
     * Replaces relative URLs in the provided content with absolute URLs.
     *
     * @param string $content The content to replace relative URLs in.
     * @param string $base_url The base URL to use for absolute URLs.
     * @return string The content with relative URLs replaced.
     */
    private static function rewrite_absolute_urls($content, $base_url)    {

      $regex = '/url\(\s*[\'"]?([^\'")]+)[\'"]?\s*\)|@import\s+[\'"]([^\'"]+\.[^\s]+)[\'"]/';
  
      $content = preg_replace_callback(
        $regex,
        function ($match) use ($base_url) {
          // Remove empty values
          $match = array_values(array_filter($match));
          $url_string = $match[0];
          $relative_url = $match[1];
          $absolute_url = Url::parse($relative_url);
          $absolute_url->makeAbsolute(Url::parse($base_url));
          return str_replace($relative_url, $absolute_url, $url_string);
        },
        $content
      );
  
      return $content;

    }    

    /**
     * Retrieves the relative path of a given path from the root cache directory.
     *
     * @param string $path The path to retrieve the relative path for.
     * @return string The relative path.
     */
    public static function get_relative_path($path) {

        $dir = Speed::get_root_cache_path();

        //Get the relative path of where we are
        $relativePath = str_replace($dir, '', $path);
        $relativePath = trim($relativePath, '/');
        if($relativePath === '') {
            $relativePath = '/';
        }

        return $relativePath;

    }

    /**
     * Retrieves an array of post types from an array of strings.
     *
     * Removes any post types that are prefixed with 'home-' or contain 'template', 'id', 'child', or 'parent'.
     *
     * @param string|array $types The post types to filter.
     * @return array An array of post types.
     */
    public static function get_posttypes($types) {

        $types = (array)$types;

        foreach($types AS $key=>$value) {

            if(preg_match("@home|(-(template|id|child|parent))@",$value)) {
                unset($types[$key]);
            }

        }

        return array_values($types);

    }

    /**
     * Retrieves an array of arrays containing data about each folder in the cache.
     *
     * The outer array is keyed by the relative path of the folder within the cache.
     * Each value in the outer array is itself an array with the following keys:
     *
     * - `post_types`: An array of post types.
     * - `post_id`: The ID of the post.
     * - `empty`: An array of plugin names as keys and the number of empty CSS files
     *            generated by that plugin as the value.
     * - `used`: An array of plugin names as keys and the number of non-empty CSS files
     *           generated by that plugin as the value.
     *
     * @return array An array of arrays containing data about each folder in the cache.
     */
    public static function get_master_data() {

        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator(Speed::get_root_cache_path()));
        $pluginStats = [];
        $urlGroups = [];
        $totalPages = 0;

        //Run through the folders and gather data
        $master_data = array();
        foreach ($iterator as $file) {

            //Find the lookup files
            if ($file->isFile() && $file->getFilename() === 'lookup.json') {

                $allData = json_decode(file_get_contents($file->getPathname()), true);

                //Get the root path
                $post_types = (array)self::get_posttypes($allData['post_types']);
                $rootPath =  self::get_relative_path($file->getPath());
                $full_url = $rootPath;

                if(in_array("single",$post_types)) {
                    $rootPath = str_replace(basename($rootPath),"{slug}",$rootPath);
                }

                if(!isset($master_data[$rootPath])) {
                    $master_data[$rootPath] = array();    
                }                     
                
                $master_data[$rootPath]['full_urls'][] = $full_url;       
                $master_data[$rootPath]['post_types'] = $post_types;               
                $master_data[$rootPath]['post_id'] = $allData['post_id'];                

                //Get the lookup data
                $lookupData = $allData['lookup'] ?? [];

                foreach ($lookupData as $url => $cssFile) {

                    //Get the plugin name from the URL
                    $plugin = self::get_plugin_from_url($url);
                    if($plugin == "unknown") {
                        #continue;//allow unknown plugins
                    }

                    //This one is empty! The CSS didn't match any selectors
                    if (basename($cssFile) === md5("") . ".css") {

                        // Initialize count and plugins array if not already set
                        if (!isset($master_data[$rootPath]['empty'][$plugin])) {
                            $master_data[$rootPath]['empty'][$plugin] = ['count' => 0, 'plugins' => []];
                        }

                        // Add basename($url) to plugins if it's not already in the array
                        if (!in_array(basename($url), $master_data[$rootPath]['empty'][$plugin]['plugins'])) {
                            $master_data[$rootPath]['empty'][$plugin]['plugins'][] = basename($url);
                            $master_data[$rootPath]['empty'][$plugin]['count']++;
                        }

                    } else {
                        
                        // Initialize count and plugins array if not already set
                        if (!isset($master_data[$rootPath]['used'][$plugin])) {
                            $master_data[$rootPath]['used'][$plugin] = ['count' => 0, 'plugins' => []];
                        }

                        // Add basename($url) to plugins if it's not already in the array
                        if (!in_array(basename($url), $master_data[$rootPath]['used'][$plugin]['plugins'])) {
                            $master_data[$rootPath]['used'][$plugin]['plugins'][] = basename($url);
                            $master_data[$rootPath]['used'][$plugin]['count']++;
                        }               

                    }

                }
                
            }

        }

        ksort($master_data);

        return  $master_data;

    }

    /**
     * Retrieves a list of all plugin names (directories) in the WordPress plugins directory.
     * 
     * @return array A list of plugin names (directories) in the WordPress plugins directory.
     */
    public static function get_all_plugins() {
        $pluginDirectory = WP_PLUGIN_DIR;
        $plugins = [];
    
        if (is_dir($pluginDirectory)) {
            // Open the directory and iterate through its contents
            $pluginDir = new \DirectoryIterator($pluginDirectory);
            foreach ($pluginDir as $fileinfo) {
                if ($fileinfo->isDir() && !$fileinfo->isDot() && substr($fileinfo->getFilename(), 0, 1) !== '_') {
                    // Assume each directory is a plugin, add the directory name to the plugins array
                    $dirname = $fileinfo->getFilename();
                    if(substr($dirname,0,1)!=".") {
                        $plugins[] = $dirname;
                    }
                }
            }
        }
    
        return $plugins; // Return the list of all plugin names
    }
    

    /**
     * Reorganizes the master data by path and adds counts of empty and non-empty
     * CSS files per path.
     *
     * @param array $master_data The master data to reorganize.
     *
     * @return array The reorganized data.
     */
    private static function get_by_path($master_data) {

        $plugin_data = array();

        foreach($master_data AS $path=>$data) {

            // Ensure 'used' and 'empty' indexes exist before sorting
            if (isset($data['used']) && is_array($data['used'])) {
                ksort($data['used']);
            } else {
                $data['used'] = [];
            }

            if (isset($data['empty']) && is_array($data['empty'])) {
                ksort($data['empty']);
            } else {
                $data['empty'] = [];
            }


            $plugin_data[$path] = array("sortkey"=>$path,
                                   "full_urls"=>$data['full_urls'],
                                   "found_urls"=>$data['used'],
                                   "empty_urls"=>$data['empty'],
                                   'empty_css_count' => count($data['empty']),
                                   'found_css_count' => count($data['used']),
                                    );

        }

        return $plugin_data;

    }

    /**
     * Reorganizes the master data by plugin and adds counts of empty and non-empty
     * CSS files per plugin.
     *
     * @param array $master_data The master data to reorganize.
     *
     * @return array The reorganized data with the structure:
     *     [
     *         <plugin_name> => [
     *             'sortkey'      => <plugin_name>,
     *             'empty_css_count' => <int>,
     *             'found_css_count' => <int>,
     *             'empty_urls'     => [<path> => <int>, ...],
     *             'found_urls'     => [<path> => <int>, ...],
     *         ],
     *         ...
     *     ]
     */
    private static function get_by_plugin($master_data) {

   
        $plugin_data = array();

        foreach($master_data AS $path=>$data) {

            foreach($data['used'] AS $plugin=>$count) {

                if(!isset($plugin_data[$plugin])) {
                    $plugin_data[$plugin] = array('sortkey' => $plugin,
                                                 'empty_css_count' => 0,
                                                'found_css_count' => 0,
                                                'empty_urls' => [],
                                                'found_urls' => []
                                                );
                }
                
                $plugin_data[$plugin]['found_css_count']++;
                $plugin_data[$plugin]['found_urls'][$path] = $count;


            }

            foreach($data['empty'] AS $plugin=>$count) {

                if(!isset($plugin_data[$plugin])) {
                    $plugin_data[$plugin] = array('sortkey' => $plugin,
                                                'empty_css_count' => 0,
                                                'found_css_count' => 0,
                                                'empty_urls' => [],
                                                'found_urls' => []
                                                );
                }
                
                $plugin_data[$plugin]['empty_css_count']++;
                $plugin_data[$plugin]['empty_urls'][$path] = $count;


            }            


        }

        //Add in empty plugins
        $all_plugins = self::get_all_plugins();
        foreach($all_plugins AS $plugin) {
            if(!isset($plugin_data[$plugin])) {
                $plugin_data[$plugin] = array('sortkey' => $plugin,
                                              'empty_css_count' => 0,
                                              'found_css_count' => 0,
                                              'empty_urls' => [],
                                              'found_urls' => []
                                              );
            }
        }

        ksort($plugin_data);

        return $plugin_data;

    }    

    /**
     * Reorganizes the master data by post type and adds counts of empty and non-empty
     * CSS files per post type.
     *
     * @param array $master_data The master data to reorganize.
     *
     * @return array The reorganized data with the structure:
     *     [
     *         <post_type> => [
     *             'sortkey'      => <post_type>,
     *             'empty_css_count' => <int>,
     *             'found_css_count' => <int>,
     *             'empty_urls'     => [<path> => <int>, ...],
     *             'found_urls'     => [<path> => <int>, ...],
     *         ],
     *         ...
     *     ]
     */
    private static function get_by_posttype(array $master_data): array {
    
        $plugin_data = [];
    
        foreach ($master_data as $path => $data) {
    
            // Ensure 'post_types' is an array before looping
            if (!isset($data['post_types']) || !is_array($data['post_types'])) {
                continue;
            }
    
            foreach ($data['post_types'] as $type) {
    
                if (!isset($plugin_data[$type])) {
                    $plugin_data[$type] = [
                        'sortkey'          => $type,
                        'empty_css_count'  => 0,
                        'found_css_count'  => 0,
                        "full_urls"        => [],
                        'empty_urls'       => [],
                        'found_urls'       => []
                    ];
                }
    
                // Ensure arrays exist before merging
                $data['full_urls'] = $data['full_urls'] ?? [];
                $data['used'] = $data['used'] ?? [];
                $data['empty'] = $data['empty'] ?? [];
    
                // Corrected array merging
                $plugin_data[$type]['full_urls']  = array_merge($plugin_data[$type]['full_urls'], $data['full_urls']);
                $plugin_data[$type]['found_urls'] = array_merge($plugin_data[$type]['found_urls'], $data['used']);
                $plugin_data[$type]['empty_urls'] = array_merge($plugin_data[$type]['empty_urls'], $data['empty']);
    
                // Count elements
                $plugin_data[$type]['empty_css_count'] = count($plugin_data[$type]['empty_urls']);
                $plugin_data[$type]['found_css_count'] = count($plugin_data[$type]['found_urls']);
    
                // Sorting - no need for `ksort()` on indexed arrays
                ksort($plugin_data[$type]['full_urls']);
                ksort($plugin_data[$type]['found_urls']);
                ksort($plugin_data[$type]['empty_urls']);
            }
        }

        return $plugin_data;
    }
    

    /**
     * Retrieves statistical information about the CSS cache.
     *
     * It looks through the files lookup.json files, finding entries which
     * have an empty CSS file. For the URL used as the key it works out
     * what the plugin is that has called an empty file. Thus we build 
     * a list of plugins that are outputting empty CSS files.
     * 
     *
     * @return array Information about the current state of the CSS cache.
     */
    public static function get_stats_data() {

        $master_data = self::get_master_data();
        
        $data['by_path'] = self::get_by_path($master_data);
        $data['by_plugin'] = self::get_by_plugin($master_data);
        $data['by_post_type'] = self::get_by_posttype($master_data);
    
        return [
            'plugin_stats' => $data,
        ];
    }
    


    /**
     * Extracts the root path from a given path.
     *
     * This function takes a path and returns the root directory of that path.
     * If the path contains more than one part, it appends a trailing slash.
     *
     * @param string $path The path to extract the root from.
     * @return string The root path.
     */
    private static function get_root_path( $path ) {

        $parts = explode('/', trim($path, '/'));
        $return = $parts[0] . (count($parts) > 1 ? '/' : '');
        if($return === '') {
            $return = '/';
        }
        return $return;
    }

    /**
     * Extracts the plugin name from a given URL.
     *
     * This function takes a URL and attempts to determine which plugin
     * the URL belongs to by analyzing the path. It assumes that the URL
     * structure contains a recognizable plugin directory.
     *
     * @param string $url The URL to analyze.
     * @return string The name of the plugin, or 'unknown' if it cannot be determined.
     */
    public static function get_plugin_from_url($url) {
        
        $parsedUrl = parse_url($url);
        $path = $parsedUrl['path'];
        $pathParts = explode('/', $path);

        // Look for the 'wp-content/plugins' directory in the path
        $pluginIndex = array_search('plugins', $pathParts);
        if ($pluginIndex !== false && isset($pathParts[$pluginIndex + 1])) {
            return $pathParts[$pluginIndex + 1];
        }

        // Look for the 'wp-content/themes' directory in the path
        $pluginIndex = array_search('themes', $pathParts);
        if ($pluginIndex !== false && isset($pathParts[$pluginIndex + 1])) {
            return $pathParts[$pluginIndex + 1];
        }        

        return 'unknown';
    }

    /**
     * Retrieves information about the current state of the CSS cache.
     *
     * The returned array will contain two keys: 'num_css_files' and 'num_lookup_files'.
     * The first will contain the number of CSS files in the cache folder, and the second
     * will contain the number of 'lookup.json' files in the cache folder and all subfolders.
     *
     * @return array Information about the current state of the CSS cache.
     */
    public static function get_cache_data() {

        //Get info on the current state of the cache
        $dir = Speed::get_root_cache_path();

        // Create the cache directory if it does not exist
        !is_dir($dir) && mkdir($dir, 0755, true);  

        //Get the number of CSS files in this dir (not subfolders)
        $cssFiles = glob($dir . '/*.css');

        // Count the number of CSS files
        $cssFileCount = count($cssFiles);        

        // Create a RecursiveDirectoryIterator to iterate through the directory and subdirectories
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir));

        // Filter the files and count how many are named "lookup.json"
        $lookupFileCount = 0;
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getFilename() === 'lookup.json') {
                $lookupFileCount++;
            }
        }        

        //Set the data var
        $data['num_css_files'] = $cssFileCount;
        $data['num_lookup_files'] = $lookupFileCount;

        return $data;


    }

    /**
     * Clears the CSS cache by deleting all files and subfolders in the cache directory.
     *
     * This function will delete all files and subfolders in the root cache directory.
     * Additionally, if the FLYING_PRESS_CACHE_DIR constant is defined, it will also
     * delete all files and subfolders in that directory.
     *
     * @return void
     */
    public static function clear_cache() {

        //Don't delete if no hostname found
        if(Speed::$hostname) {
            $dir = Speed::get_root_cache_path();
            Speed::deleteSpecificFiles($dir,array("css","lookup.json","CSS_page_cache.html.gz"),true);        
        }

        //Integrations
        if(defined('FLYING_PRESS_CACHE_DIR')) {
            Speed::deleteSpecificFiles(FLYING_PRESS_CACHE_DIR,array("html","gz"),true);
        }
        
        global $kinsta_cache;
        if ( ! empty( $kinsta_cache->kinsta_cache_purge ) ) {
            // Flush full-page + edge + CDN caches
            $kinsta_cache->kinsta_cache_purge->purge_complete_site_cache();
        }        

    }

    /**
     * Clears the CSS cache for a specific post by URL.
     *
     * This function deletes all files and subfolders in the cache directory
     * associated with the specified URL.
     *
     * @param string $url The URL of the post for which the cache should be cleared.
     *
     * @return void
     */
    public static function do_post_updated( $post_id ) {

        if(!empty($_SERVER['REQUEST_URI']) && 
        !preg_match("@update_css|wp-cron|wp-json@",$_SERVER['REQUEST_URI'])
        && is_user_logged_in() && current_user_can('edit_posts')) {

            $post = get_post($post_id);
            $excluded_post_types = [
                'shop_order', 'revision', 'nav_menu_item',
                'custom_css', 'customize_changeset', 'oembed_cache',
                'user_request', 'wp_block', 'wp_template', 'wp_template_part'
            ];

            if (in_array($post->post_type, $excluded_post_types, true)) {
                return;
            }            

            $url = get_permalink($post_id);

            if (strstr($url, '?p=')) {
                return;//Not a post
            }
            

            Speed::purge_cache($url,array("lookup.json","html","gz"));

        }


    }    


}
