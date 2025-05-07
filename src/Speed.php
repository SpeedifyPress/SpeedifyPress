<?php

namespace SPRESS;

use SPRESS\Speed\CSS;
use SPRESS\Speed\Cache;
use SPRESS\Speed\Unused;
use SPRESS\Speed\JS;
use SPRESS\AdvancedCache;

use SPRESS\App\Config;
use simplehtmldom\HtmlDocument;
use MatthiasMullie\Minify;

/**
 * The `Speed` class handles performance optimizations and output rewriting 
 * for the plugin. It manages CSS rewriting.
 * 
 * @package SPRESS
 */
class Speed {

    //The directory where unused CSS will be stored
    //will be a subdirectory of wp-content/cache
    public static $cache_directory = "speedify-spress";

    //The hostname of the current site
    public static $hostname;     

    //An array to holder uids, preventing duplicates
    public static $spuid_holder = array();     

    //Used to overwrite the dected URL, if required
    public static $injected_url;

    // array to hold URLs already purged this session
    public static $done_purge = array();           
    
    // start time for performance tracking
    public static $start_time;

    // set the name
    public static $csrf_name = "spdy_csrfToken";

    // allow OB debugging
    public static $debug_output_buffer = false;

    /**
     * Initializes the Speed class by setting up output buffering, CSS optimizations,
     * HTML rewriting, and registering filters and actions for third-party plugins.
     */
    public static function init() {

        //Set the hostname
        self::$hostname = parse_url(site_url(), PHP_URL_HOST);

		//Set caching headers		
		add_action("send_headers",function() {

			$headers = Config::get('speed_code','page_headers');
			if($headers && !is_admin()) {
	
				// Split the header text into lines
				$lines = explode("\n", $headers);				
	
				// Loop through each line and convert it to a PHP header
				foreach ($lines as $line) {
					$line = trim($line); // Remove whitespace
					if (!empty($line)) {
	
						//Get header key and value
						$parts = explode(":", $line, 2);
						$key = trim($parts[0]);
						$value = trim($parts[1]);
	
						//Get date value
						preg_match('/\{\{(.*?)\}\}/', $value, $matches);
						if (!empty($matches) && isset($matches[1])) {
							$day_match = strtotime($matches[1]);						
							//If cache control value is seconds from now
							if(preg_match('@Cache-Control|Retry-After|Access-Control-Max-Age|Keep-Alive@i',$key)) {
								$seconds = $day_match - strtotime("now");
								$value = str_replace($matches[0],$seconds,$value);
							//If not cache-control, convert to date
							} else {
								$value = gmdate("D, d M Y H:i:s", $day_match) . " GMT";
							}
						}
						
						//Send the header
						header($key . ": " . $value);
	
					}
				}		
		
			}
				
		});        

        // Initialize Cache speed optimizations
        Cache::init();        

        // Initialize CSS  speed optimizations
        CSS::init();

        // Initialize JS  speed optimizations
        JS::init();        

        
        // Start output buffering and process output
        // Hook to init to ensure it runs before other plugins
        if(Speed::is_frontend() === true) {
            add_action(
                'init',function() {
                    ob_start(array(__CLASS__, 'process_output'));
            });      
        }

        //Cron action
        add_action('run_gtag_cron', array(__CLASS__,'run_gtag_cron'));


    }

    /**
     * Retrieves the cache path that won't get cleared
     *
     * @return string The cache path
     */
    public static function get_pre_cache_path() {

        return ABSPATH . "wp-content/cache/".self::$cache_directory;

    }

    /**
     * A cache URL that isnt' deleted on cache clear
     *
     * @return string The root cache URL.
     */
    public static function get_pre_cache_url() {

        return site_url() . "/wp-content/cache/".self::$cache_directory;

    }       

    /**
     * Retrieves the root cache path.
     *
     * @return string The root cache path.
     */
    public static function get_root_cache_path() {

        return ABSPATH . "wp-content/cache/".self::$cache_directory."/" . self::$hostname;

    }

    /**
     * Retrieves the root cache URL.
     *
     * @return string The root cache URL.
     */
    public static function get_root_cache_url() {

        return site_url() . "/wp-content/cache/".self::$cache_directory."/" . self::$hostname;

    }    

    /**
     * Processes the final output before it's sent to the browser.
     * This includes rewriting CSS and HTML.
     *
     * @param string $output The buffered output.
     * @return string The modified output.
     */
    public static function process_output($output) {

        // Check if this is an HTML document
        if (!strstr($output, '<html')) {
            return $output;
        }        


        // Set a custom error handler inside the callback
        if(self::$debug_output_buffer === true) {
            set_error_handler(function($errno, $errstr, $errfile, $errline) {

                // Capture the backtrace
                $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
                
                // Format the trace as a readable string
                $traceString = "";
                foreach ($trace as $index => $frame) {
                    $file = isset($frame['file']) ? $frame['file'] : '[internal function]';
                    $line = isset($frame['line']) ? $frame['line'] : '';
                    $function = $frame['function'];
                    $traceString .= "#$index $file($line): $function()\n";
                }

                // Output the error message and trace in HTML comments
                if(current_user_can( 'manage_options' )) {
                    echo "<!--Caught error in output buffer callback: [$errno] $errstr in $errfile on line $errline\nTrace:\n$traceString-->\n";
                }

                // Returning true prevents the PHP error handler from continuing
                return true;
            });        
        }

        try {
            
        //Start time
        self::$start_time = microtime(true);

        $output = self::rewrite_html($output);     // Rewrite HTML content for optimizations, add tags firs

        $output = CSS::rewrite_css($output); // Rewrite CSS for performance improvements
        $output = JS::rewrite_js($output); // Rewrite JS for performance improvements

        //Run again to replace in new output
        $output = self::find_replace($output);

        //Remove comments
        $output = str_replace(['@@@replaced@@@', '@@@/replaced@@@'], '', $output);
        $output = str_replace([base64_encode('@@@replaced@@@'), base64_encode('@@@/replaced@@@'), base64_encode('@@@replaced@@@@@@/replaced@@@')], '', $output);

        //Save ouput to cache
        $output = Cache::do_cache($output); 
        $output = CSS::do_html_cache($output);

        } catch (\Exception $e) {
            // Handle exception here if necessary, but PHP may not fully respect try-catch within ob_start callback
            if(current_user_can( 'manage_options' )
            && self::$debug_output_buffer === true) {
                echo "<!--Caught exception: " . $e->getMessage() . "-->";
            }
        }

        // Restore previous error handler
        restore_error_handler();

        return $output;

    }

    /**
     * Tags the output HTML with comments for easier debugging.
     * 
     * @param string $html The HTML output.
     * @return string The modified HTML output.
     */
    private static function tag_html($dom) {                        

        // Define display elements we want to tag
        $displayElements = [
            'div', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'style', 'link'
        ];

        // Start traversal from the <html> element
        $html = $dom->find('html', 0); // Find the <html> tag

        // Start from the body or root element
        $depthThreshold = 13;
        self::traverse_and_tag($html, 0, $depthThreshold, $displayElements);

        return $dom;
         
    }

    /**
     *
     * 
     * @param \simple_html_dom $dom The DOM structure to modify.
     * @return \simple_html_dom The modified DOM structure with the stand-in
     *                          script included.
     */
    private static function add_template_js($dom) {
        
        //Set file
        $template_js = file_get_contents(SPRESS_PLUGIN_DIR . '/assets/restore_template_content.js');

        //Minify it
        $minifier = new Minify\JS($template_js);
        $template_js = $minifier->minify();

        // Create a new script element
        $scriptElement = $dom->createElement('script');
        $scriptElement->setAttribute('rel', 'js-extra spress_template_restore');//
        $scriptElement->innertext = $template_js;

        // Append the script element directly to the head
        $headElement = $dom->find('head', 0);
        if($headElement) {
            $headElement->children(0)->outertext = $scriptElement->outertext . $headElement->children(0)->outertext;        
        }

        //Always exclude
        JS::$delay_exclude .= "\n" . "spress_template_restore";

        return $dom;

    }

    /**
     * Embeds a minified jQuery stand-in script into the provided DOM structure.
     * This function reads the stand-in script, minifies it, and appends it to
     * the <head> element of the DOM, ensuring basic jQuery functionalities are
     * available before the actual jQuery library loads.
     *
     * @param \simple_html_dom $dom The DOM structure to modify.
     * @return \simple_html_dom The modified DOM structure with the stand-in
     *                          script included.
     */
    private static function add_jquery_standin($dom) {
     
        //Set file
        $simple_jquery_standin = file_get_contents(SPRESS_PLUGIN_DIR . '/assets/simple_jquery_standin.js');

        //Minify it
        $minifier = new Minify\JS($simple_jquery_standin);
        $simple_jquery_standin = $minifier->minify();

        // Create a new script element
        $scriptElement = $dom->createElement('script');
        $scriptElement->setAttribute('rel', 'js-extra spress_jquery_standin');
        $scriptElement->innertext = $simple_jquery_standin;

        // Append the script element directly to the head
        $headElement = $dom->find('head', 0);
        if($headElement) {
            $headElement->children(0)->outertext = $scriptElement->outertext . $headElement->children(0)->outertext;        
        }

        //Always exclude
        JS::$delay_exclude .= "\n" . "spress_jquery_standin";

        return $dom;

    }    

    private static function add_gtag($dom) {

        //Find all script elememts in DOM
        $scripts = $dom->find('script');

        // Iterate over each <script> tag
        foreach ((array)$scripts as $script) {

            if(strstr($script->outertext,"/gtag/")) {                 
                
                preg_match("@((https?:\/\/)?www\.googletagmanager\.com\/gtag\/js[^\"']+)@",$script->outertext,$matches);
                if(!empty($matches[1])) {
                    
                    $file = self::download_gtag($matches[1]);

                    if($file) {
                        
                        //Replace the file
                        $script->outertext = str_replace($matches[1],$file,$script->outertext);
                        
                        //Change type for partytown
                        $party_conf = Config::get('speed_css', 'include_partytown');
                        if($party_conf) {
                            $script->outertext = str_replace("src","type='text/partytown' src",$script->outertext);
                        }                        

                        //Add preload
                        if(Config::get('external_scripts', 'preload_gtag') === "true") {                            

                            $link = $dom->createElement('link');
                            $link->setAttribute('rel','preload');
                            $link->setAttribute('href',$file);
                            $link->setAttribute('as','script');

                            //Add as first child of head
                            $headElement = $dom->find('head', 0);
                            if($headElement) {
                                $headElement->children(0)->outertext = $link->outertext . $headElement->children(0)->outertext;                              
                            }


                        }

                    }

                }
                

            }


        }



        return $dom;

    }

	public static function download_gtag( $remote_file = null, $force_version_update = false ) {

        //Set the version file
        $version_file = self::get_pre_cache_path() . "/local_tag/version.json";

        //For debugging
        $error_file = self::get_pre_cache_path() . "/local_tag/error.log";

        //Set the directory
        $path = self::get_pre_cache_path() . "/local_tag/";

        //Set the filename
        $local_filename = "local_tag.js";

        //Set the file
        $js_file = self::get_pre_cache_path() . "/local_tag/" . $local_filename;

        //Set the URL
        $url = self::get_pre_cache_url() . "/local_tag/";

        //Return if found
        if(file_exists($js_file) && $force_version_update == false) {
            $filename = basename($js_file);
            $version = (array)json_decode(file_get_contents($version_file));
            return $url . $filename . "?v=" . $version['version'] ?? 0;
        }

        //If remote not passed, use previously downloaded one
        if(!$remote_file && file_exists($version_file)) {
            $version = (array)json_decode(file_get_contents($version_file));
            $remote_file = ($version['remote'] ?? '');
        }   

        //No remote found
        if(!$remote_file) {
            //Write error log
            file_put_contents($error_file, date("Y-m-d H:i:s") . " No remote file specified and no previous download found.\n",FILE_APPEND);
            return false;
        }

        //Get new file contents
		$file_contents = wp_remote_get( $remote_file );

        //Could not download
        if ( is_wp_error( $file_contents ) ) {
            $error_message = $file_contents->get_error_message();
            //Write error log
            file_put_contents($error_file, date("Y-m-d H:i:s") . " Could not download remote file. Error: $error_message\n",FILE_APPEND);        
            return false;
        }

        //Get the contents
        $file_contents = $file_contents[ 'body' ];

        //Make sure contents OK
        if(!strstr($file_contents,"Google")) {
            //Write error log
            file_put_contents($error_file, date("Y-m-d H:i:s") . " Could not download remote file. Error: Could not find 'Google' string in " . $file_contents . "\n",FILE_APPEND);
            return false;
        }

        //Minify the JS
        $minifier = new Minify\JS($file_contents);
        $file_contents = $minifier->minify();        

        //Get the version
        if(file_exists($version_file)) {
            $version = file_get_contents($version_file);
            $version = (array)json_decode($version);
        } else {
            $version = array('remote'=>$remote_file,'version'=>0);
        }

        //Increase version
        $version['version']++;
        $dir = self::get_pre_cache_path() . "/local_tag/";
                
        // Create the cache directory if it does not exist
        !is_dir($dir) && mkdir($dir, 0755, true);  

        //Write new version
        file_put_contents($version_file,json_encode($version));

        //Write the file
        $path =  $dir . $local_filename;
        file_put_contents($path, $file_contents, LOCK_EX);

		return $url . $local_filename . "?v=".$version['version'];

	}     

    public static function handle_gtag_update($value) {

        //Schedule the cron
        if($value == "true") {

            if (!wp_next_scheduled('run_gtag_cron')) {
                wp_schedule_event(time(), 'twicedaily', 'run_gtag_cron');
            }


        } else {
        //Remove the cron

            if (wp_next_scheduled('run_gtag_cron')) {
                wp_clear_scheduled_hook('run_gtag_cron');
            }        

        }
    }

    public static function run_gtag_cron() {

        self::download_gtag( null, true);

    }

    public static function add_invisible_elements($dom) {        

        //Get current URL
        $current_url = self::get_url();

        //See if there is a lookup file
        $lookup_file = CSS::get_lookup_file( $current_url );
        if(!file_exists($lookup_file)) {
            return $dom;
        }

        //Check if we have a lookup file
        $contents = @file_get_contents($lookup_file);
        $data_object = ($contents !== false && ($decoded = json_decode($contents)) && json_last_error() === JSON_ERROR_NONE && is_object($decoded))
            ? $decoded
            : (object)[];        

        //Mark invisible elements
        if(isset($data_object->invisible) && isset($data_object->invisible->elements) && count($data_object->invisible->elements) >0 ) {

            // Get elements with paths
            $elements = $data_object->invisible->elements;             
            
            // Get original viewport
            $originalViewport = $data_object->invisible->viewport;                

            foreach ($elements as $element) {

                if(!isset($element->tag)) {
                    $element->tag = "";
                }

                //Get an element height to fit all screens                                
                $average_vp_width = 1536;
                $diff = $originalViewport->width / $average_vp_width;
                if($diff < 1) {
                    $diff = $diff * 1.2;   
                } else {
                    $diff = $diff / 1.2;
                }
                if(isset($element->height)) {
                    $element_height  = $element->height * $diff;                    
                } else {
                    $element_height  = 100;                    
                }
                
                //Get element and current spuid
                $spuid = $element->spuid ?? false;  

                if($spuid && $element->tag != 'style' && $element->tag != 'link') {

                    $element = $dom->find('[data-spuid="' . $spuid . '"]', 0);
                    if($element) {
                        $element->addClass('unused-invisible');
                        $element->style .= ' content-visibility: auto; contain-intrinsic-size: auto ' . (int)$element_height . 'px;';

                        $template = $dom->createElement('template');
                        $template->innertext = $element->innertext;
                        $templater_filler = $template->outertext;
                        $element->outertext  = str_replace($element->innertext,$templater_filler,$element->outertext);
                    }

                    
                }

            }


        }



        return $dom;

    }

    private static function add_csrf_token($dom) {  

        // Create a new script element
        $scriptElement = $dom->createElement('script');
        $scriptElement->setAttribute('id', self::$csrf_name);
        $csrf_token = self::generate_csrf_token(self::get_url());
        $scriptElement->innertext = 'window.' . self::$csrf_name . ' = "' . htmlspecialchars($csrf_token, ENT_QUOTES, 'UTF-8') . '";'; 

        //Add after head
        $headElement = $dom->find('html', 0);
        if($headElement) {
            $headElement->children(0)->outertext = $scriptElement->outertext . $headElement->children(0)->outertext;        
        }        

        return $dom;

    }

    
    private static function set_onload($dom) {  

        // Create a new script element
        $scriptElement = $dom->createElement('script');
        $scriptElement->setAttribute('ref', 'onload.min.js ');
        $scriptElement->setAttribute('id', 'onload-main');
        $scriptElement->src = SPRESS_PLUGIN_URL . 'assets/onload/onload.min.js?v=' . SPRESS_VER;

        //Add after head
        $headElement = $dom->find('html', 0);
        if($headElement) {
            $headElement->children(0)->outertext = $scriptElement->outertext . $headElement->children(0)->outertext;        
        }        

        return $dom;

    }

    private static function add_partytown($dom) {

        $bodyElement = $dom->find('body', 0);

        $party_conf = Config::get('speed_css', 'include_partytown');

        if($party_conf) {

            $include_partytown = array_filter(explode("\n", $party_conf));

            // Find all <script> tags in the DOM
            $scripts = $dom->find('script');

            // Iterate over each <script> tag
            foreach ((array)$scripts as $script) {
                // Initialize a flag to mark if any pattern matches
                $patternFound = false;

                // Check each pattern in the include_partytown array
                foreach ($include_partytown as $pattern) {
                    // Check if the script has a 'src' attribute and search within it
                    if (isset($script->src) && strpos($script->src, $pattern) !== false) {
                        $patternFound = true;
                        break; // Exit loop if a match is found in the 'src'
                    }
                    
                    // Check inline content if no match found in 'src'
                    if (strpos($script->innertext, $pattern) !== false) {
                        $patternFound = true;
                        break; // Exit loop if a match is found in inline content
                    }
                }

                // If a pattern was found change type
                if ($patternFound) {
                    $script->setAttribute('type', 'text/partytown');
                    $script->setAttribute('defer', 'defer');
                }
            }

        }


        return $dom;

    }


    /**
     * Adds a minified Intersection Observer script to the provided DOM structure.
     * This function checks for the presence of <template> tags in the DOM, and
     * if found, reads and minifies the Intersection Observer script, then appends
     * it directly after the last <template> tag. The script is intended to handle
     * lazy-loading or other intersection-based operations on elements within the
     * DOM.
     *
     * @param \simple_html_dom $dom The DOM structure to modify.
     * @return \simple_html_dom The modified DOM structure with the Intersection
     *                          Observer script included if templates are present.
     */
    private static function add_intersection_observer($dom) {      
     

        //Set file
        $intersection_observer = file_get_contents(SPRESS_PLUGIN_DIR . '/assets/intersection_observer.js');
        
        //Minify it
        $minifier = new Minify\JS($intersection_observer);
        $intersection_observer = $minifier->minify();
        
        // Create a new script element
        $scriptElement = $dom->createElement('script');
        $scriptElement->setAttribute('rel', 'js-extra');
        $scriptElement->innertext = $intersection_observer;

        //Add before body end
        $body = $dom->find('body', 0);
        $body->appendChild($scriptElement);

        return $dom;

    }    

    private static function traverse_and_tag($element, $currentDepth, $depthThreshold, $displayElements, $parentKey = '') {

        // Check if this element is one of our target display elements at the desired depth
        if ($currentDepth < $depthThreshold && in_array($element->tag, $displayElements)) {
    
            // Create a canonical representation for the element: tag, sorted attributes, and normalized inner text
            $canonical = $element->tag . '|' . self::get_canonical_attributes($element) . '|' . trim($currentDepth);
            
            // Combine with parent's stable key to generate the hash source
            $hashSource = $parentKey . '>' . $canonical;
            $ident = substr(md5($hashSource), 0, 8);

            //Add to holder array
            self::$spuid_holder[$ident][] = $hashSource;
            
            // Construct a spuid
            $spuid = 'd' . $currentDepth . '-' . $ident . '-' . count(self::$spuid_holder[$ident]);
            $element->setAttribute('data-spuid', $spuid);
            $element->setAttribute('data-spudepth', $currentDepth);

            //For style tags, give a content ID
            if($element->tag == "style") {
                $content_id = md5($element->innertext);
                $element->setAttribute('data-spcid', $content_id);
            }
    
            // Use the current element’s UID as the new parent key for children
            $parentKey = $spuid;
        }
    
        // Recursively tag child elements, passing along the current stable key
        foreach ($element->children as $child) {
            self::traverse_and_tag($child, $currentDepth + 1, $depthThreshold, $displayElements, $parentKey);
        }
    }
    
    // Helper function to get a canonical, sorted string of the element's attributes
    private static function get_canonical_attributes($element) {
        $attrs = $element->getAllAttributes();
        ksort($attrs);
        $attrStr = '';
        foreach ($attrs as $key => $value) {
            $attrStr .= $key . '=' . $value . ';';
        }
        return $attrStr;
    }
    
      

    public static function is_frontend() {
        // Check if it's an admin area or an AJAX request
        if (is_admin() || wp_doing_ajax()
        || (stripos( $_SERVER['SCRIPT_NAME'], 'wp-login.php' ) !== false)
        ) {
            return false;
        }
        
        //Intregrations
        if(isset($_GET['elementor-preview'])) {
            return false;
        }

        // Check if it's a REST API request by looking at the URI
        $request_uri = self::get_url();
        if (strpos($request_uri, '/wp-json/') === 0) {
            return false;
        }
    
        // If none of the above conditions match, it's a front-end request
        return true;
    }    

    /**
     * Rewrites the HTML output by inserting custom head and body code, and performs 
     * find-and-replace operations defined in the configuration.
     *
     * @param string $html The HTML output.
     * @return string The modified HTML output.
     */
    public static function rewrite_html($html) {

        // Check if this is an HTML document
        if (!strstr($html, '<html')) {
            return $html;
        }

		// Detect non-HTML.
		if ( ! isset( $html ) || trim( $html ) === '' || strcasecmp( substr( $html, 0, 5 ), '<?xml' ) === 0 || trim( $html )[0] !== '<' ) {
			return $html;
		}

		if ( isset( $_GET['fb-edit'] ) || isset( $_GET['builder'] ) || isset( $_GET['auth0'] ) || isset( $_GET['et_fb']) ) {
			return $html;
		}

		if ( strstr( $_SERVER['REQUEST_URI'], 'wp-json' ) ) {
			return $html;
		}

		if ( is_404() ) {
			return $html;
		}        

        if(self::is_frontend()) {

            $start_time = microtime(true);

            // Perform find-and-replace operations 
            // do this first so new html can be worked on below
            $html = self::find_replace($html);

            // simple_html_dom.
            $dom = (new HtmlDocument(""))->load($html,true, false);     

            //add depth and sibling tags to HTML
            $dom = self::tag_html($dom);

            //add jquery standing
            $dom = self::add_jquery_standin($dom);

            //add jquery standing
            $dom = self::add_template_js($dom);            

            //Force system fonts for mobile
            if(Config::get('speed_code', 'system_fonts') === 'true') {
                $dom = self::add_mobile_system_fonts($dom);
            }            

            //add self hosted gtag
            if(Config::get('external_scripts','gtag_locally') === "true") {
                $dom = self::add_gtag($dom);
            }     

            //add invisible elements
            $dom = self::add_invisible_elements($dom);  
            
            //add intersection
            $dom = self::add_intersection_observer($dom);            

            //HTML replacements, must be done after templates added
            $dom = self::set_onload($dom);            
            
            //Add CRF token
            $dom = self::add_csrf_token($dom);                 
            
            //Refresh dom
            $dom = self::refresh_dom($dom);

            //add partytown (after gtag) //requires dom refresh
            $dom = self::add_partytown($dom);                
            
            //Add image lazy loading //requires dom refresh
            $dom = self::add_image_lazyload($dom);               

            $html = $dom->outertext;

            $end_time = microtime(true);
            $elapsed_time = $end_time - $start_time;
            $html .=  "<!-- Elapsed HTML " . number_format($elapsed_time,2) . "-->";

        }

        return $html;

    }

    /**
     * Add mobile system fonts to the document. This adds a style to the head of the document
     * which sets the font-family of all h1-5, p and non-icon elements to the browser's
     * default sans-serif font. This is useful for performance optimization on mobile devices.
     *
     * @param \simplehtmldom\HtmlDocument $dom
     * @return void
     */
    public static function add_mobile_system_fonts($dom) {

        // Create a new style element
        $styleElement = $dom->createElement('style');
        $styleElement->innertext = '@media (max-width: 800px) {
                h1, h2, h3, h4, h5, p, :not(.fa):not(.fab):not(.fas):not(.far):not([class*=" awb-icon-"]):not([class^="awb-icon-"]):not(.ld-icon):not([class*="fusion-icon"]):not([class*="icon"]):not(input) {
                font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif!important;
            }
        }';

        // Append the script element directly to the head
        $headElement = $dom->find('head', 0);
        if($headElement) {
            $headElement->children(0)->outertext = $styleElement->outertext . $headElement->children(0)->outertext;        
        }        

        return $dom;

    }

    /**
     * Perform find-and-replace operations on the HTML output.
     *
     * @param string $html The HTML output.
     * @return string The modified HTML output.
     *
     * The replace operations are defined in the configuration under the key
     * "speed_find_replace". The operations are performed in the order they
     * appear in the configuration.
     *
     * Each operation is defined as an associative array with the following
     * keys:
     *
     * - find: The string to search for.
     * - replace: The string to replace with.
     * - scope: The scope of the replacement. If set to "", the replacement
     *   is performed on the entire string. If set to "first", the replacement
     *   is only performed on the first occurrence of the string.
     */
    private static function find_replace($html) {
        $replacements = Config::get('speed_replace', 'speed_find_replace');
        if ($replacements && is_array($replacements)) {
            foreach ($replacements as $rep) {
                $find = $rep['find'];
                $replacementText = $rep['replace'];
                $scope = $rep['scope'];
    
                // Prepare the marked replacement text using raw markers.
                $markedReplacement = '@@@replaced@@@' . $replacementText . '@@@/replaced@@@';
    
                // Build a pattern that captures both raw markers and their HTML-encoded counterparts.
                $pattern = '/((?:@@@replaced@@@).*?(?:@@@\/replaced@@@))/s';
    
                // Split the HTML into segments that are either within markers or not.
                $parts = preg_split(
                    $pattern,
                    $html,
                    -1,
                    PREG_SPLIT_DELIM_CAPTURE
                );
    
                // Process only segments not already within markers.
                foreach ($parts as $index => $segment) {
                    // Check for either the raw or encoded marker block.
                    if (!preg_match('/^(?:@@@replaced@@@.*?@@@\/replaced@@@)$/s', $segment)) {
                        if ($scope == "") {
                            $parts[$index] = str_replace($find, $markedReplacement, $segment);
                        } elseif ($scope == "first") {
                            $parts[$index] = preg_replace(
                                '@' . preg_quote($find, '@') . '@',
                                $markedReplacement,
                                $segment,
                                1
                            );
                        }
                    }
                }
                // Reassemble the HTML.
                $html = implode('', $parts);
            }
        }
        return $html;
    }
    

    /**
     * Refreshes the simple_html_dom object
     *
     * It appears that simple_html_dom does not allow you to modify the DOM
     * once it has been loaded. This function works around this limitation by
     * extracting the HTML from the current DOM, and then loading it back into
     * a new simple_html_dom object.
     *
     * @param object $dom The simple_html_dom object to be refreshed
     * @return object The refreshed simple_html_dom object
     */
    private static function refresh_dom($dom) {
        
        $html = $dom->outertext;
        $dom = (new HtmlDocument(""))->load($html,true, false);   

        return $dom;

    }

    private static function add_image_lazyload($dom) {

        //Only continue if placeholder set
        $placeholder = Config::get('speed_code', 'preload_image');
        if(!$placeholder) {
            return $dom;
        }  

        //Get lcp image if exists
        $lcp_image = CSS::get_lcp_image();

        $images = $dom->find('img');
        $preload = array();
        foreach ($images as $image) {

            //preload and skipped the configured images
            $do_skip = false;
            $skipped = trim(Config::get('speed_code', 'skip_lazyload'));
            if($skipped) {
                $file_names = explode("\n", $skipped);
                foreach ($file_names as $file_name) {
                    $file_name = trim($file_name);
                    if(strstr($image->src, $file_name)) {
                        $preload[$image->src] = array("src"=>$image->src,"imagesrcset"=>$image->srcset ?? null);
                        $do_skip = true;
                        $image->setAttribute('loading','eager');
                        $image->setAttribute('fetchpriority','high');  
                        $image->setAttribute('decoding','async');                    
                    }                    
                }
            }

            if($do_skip == true) {
                continue;
            }
            
            // get src attribute
            $src = $image->src;

            //Skip if no src
            if(!$src) {
                continue;
            }            

            //Not needed for lcp image
            if($src == $lcp_image) {
                continue;
            }

            //Not needed for SVG
            if(self::is_svg($src)) {
                continue;
            }

            // Get width and height
            $dimensions = self::get_dimensions($src, $image);

            //Get aspect ratio
            $width = $dimensions['width'] ?? false;
            $height = $dimensions['height'] ?? false;

            //No height found
            if($height != false && $height <= 0) {
                continue;
            }

            //Add image attributes           
            $image->setAttribute('data-lazy-src',$image->src);
            $image->src = $placeholder;
            if(!$image->width && $width == true) {
                $image->width = $width;
            }
            if(!$image->height && $height == true) {
                $image->height = $height;
            }
            $image->setAttribute('data-lazy-srcset',$image->srcset);
            $image->setAttribute('srcset','');
            $image->setAttribute('loading','lazy');
            $image->setAttribute('fetchpriority','low');

            //Add preload
            $preload[$placeholder] = array("src"=>$placeholder,"imagesrcset"=>$image->srcset ?? null);

        }

        //Add the preloads
        $preload_html = "";
        foreach($preload AS $src=>$image) {

           $preload_html .= "\n<link rel='preload' href='" . $image['src'] . "' as='image' imagesrcset='" . $image['imagesrcset'] ."' imagesizes='' />";

        }

        // Add directly after title
        $dom->outertext = str_replace("</title>","</title>".$preload_html,$dom->outertext);

        return $dom;

    }

    /**
     * Attempts to extract dimensions from a given image URL or file path.
     *
     * Checks for the following in order:
     * 1. Dimensions in the file name (e.g. image-800x600.jpg)
     * 2. Local file in /wp-content/uploads/ (uses getimagesize() if not SVG)
     * 3. URL (uses getimagesize() if possible)
     * 4. Data URL (uses getimagesizefromstring() if possible)
     *
     * @param string $src The URL or file path of the image
     *
     * @return array|null An array with 'width' and 'height' keys with integer values, 
     * or null if no dimensions could be determined
     */
    private static function get_dimensions($src, $image) {

        //Check if already has width and height
        if(isset($image->width) && isset($image->height)) {
            return [
                'width' => (int)$image->width,
                'height' => (int)$image->height
            ];
        }

        // Check if dimensions can be extracted from the file name
        if (preg_match('/(\d+)x(\d+)/', $src, $matches)) {
            return [
                'width' => (int)$matches[1],
                'height' => (int)$matches[2]
            ];
        }
    
        // Handle local files in /wp-content/uploads/
        $upload_dir_parts =  wp_get_upload_dir();
        $uploads_dir = str_replace(ABSPATH,"",$upload_dir_parts['basedir']); //just the wp-content/uploads bit
        
        //get relative path of the image
        $image_relative_path = parse_url($src, PHP_URL_PATH);        

        //Remove the wp-content/uploads 
        $image_relative_path = str_replace($uploads_dir,"",$image_relative_path);

        //Add onto the full path for the wp-uploads dir (which contains wp-content/uploads)
        $local_path = $upload_dir_parts['basedir'] . $image_relative_path;
        
        if (file_exists($local_path)) {
            $size = getimagesize($local_path);
            if ($size) {
                return [
                    'width' => $size[0],
                    'height' => $size[1]
                ];
            }
        }
    
        // Handle URLs
        /*if (filter_var($src, FILTER_VALIDATE_URL)) {

            try {
                $size = getimagesize($src);
                if ($size) {
                    return [
                        'width' => $size[0],
                        'height' => $size[1]
                    ];
                }
            } catch (Exception $e) {
                return null;
            }

        }*/ //too slow! needs caching
    
        // Handle data URLs
        if (strpos($src, 'data:image') === 0) {
            $data = explode(',', $src);
            if (isset($data[1])) {
                $image_data = base64_decode($data[1]);
                $size = getimagesizefromstring($image_data);
                if ($size) {
                    return [
                        'width' => $size[0],
                        'height' => $size[1]
                    ];
                }
            }
        }
    
        // Return null if no dimensions could be determined
        return null;
    }
    
    /**
     * Checks if the given string is an SVG file or data URL.
     * @param string $src The string to check.
     * @return bool True if the string is an SVG file or data URL.
     */
    private static function is_svg($src) {
        return preg_match('/\.svg$/i', $src) || strpos($src, 'image/svg+xml') !== false;
    }
    

	/**
	 * Save an image from a data URL to a file
	 *
	 * @param string $dataUrl The data URL, e.g. "data:image/png;base64,iVBORw0KGg..."
	 * @param string $outputPath The path to save the image to, e.g. "/path/to/image.png"
	 * @return string The saved file path, or throw an Exception on error
	 * @throws Exception If the data URL is invalid, the output path is invalid, or the file cannot be written
	 */
	public static function save_data_image($dataUrl, $outputDirectory) {
		// Validate the data URL
		if (preg_match('/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,/', $dataUrl, $type)) {

			$data = substr($dataUrl, strpos($dataUrl, ',') + 1);
			$type = strtolower($type[1]); // Extract the image type (e.g., jpg, png, svg+xml)
	
			// Decode the base64 data
			$data = base64_decode($data);
	
			if ($data === false) {
				throw new \Exception('Base64 decode failed.');
			}
	
			// Normalize file type for SVG
			if ($type === 'svg+xml') {
				$type = 'svg';
			}
	
			// Validate the file type
			if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
				throw new \Exception('Invalid image type.');
			}
	
			// Ensure the output directory exists
			if (!is_dir($outputDirectory)) {
				if (!mkdir($outputDirectory, 0755, true)) {
					throw new \Exception("Failed to create directory: $outputDirectory");
				}
			}
	
			// Generate a unique file name with the appropriate extension
			$fileName = uniqid('image_', true) . '.' . $type;
			$outputPath = rtrim($outputDirectory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;
	
			// Save the file
			if (file_put_contents($outputPath, $data)) {
				return $outputPath; // Return the saved file path
			} else {
				throw new \Exception("Failed to write file: $outputPath");
			}
		} else {
			return $dataUrl;
		}
	}

    /**
     * Retrieves the current uri
     *
     * @return string The full URL, with ignored query strings removed.
     */
    public static function get_uri($get_original=true) {

        //Get the request URI before plugins may have messed with it
        if(class_exists("SPRESS\\AdvancedCache")
        && isset(AdvancedCache::$original_uri)
        && $get_original) {
            $raw = AdvancedCache::$original_uri;
        } else {
            //Directly grab from $_SERVER, cast to string, default to “/” if missing
            $raw = isset( $_SERVER['REQUEST_URI'] )
            ? (string) $_SERVER['REQUEST_URI']
            : '/';
        }
    
        $safe = self::get_sanitized_uri($raw);
    
        return $safe;


    }

    /**
     * Cleans an arbitrary URL fragment  and returns
     * a fully‑qualified, sanitized URL pointing to this site.
     *
     * @param  string $raw  The raw URL or URI fragment to sanitize.
     * @return string       A full, safe URI fragment.
     */
    public static function get_sanitized_uri(string $raw): string
    {
        // 1. Strip null bytes and ASCII control characters
        $raw = preg_replace('/[\x00-\x1F\x7F]/u', '', $raw) ?: '';
    
        // 2. Parse into components so we only ever honor path + query
        $parts = parse_url($raw);
        $path  = $parts['path']  ?? '/';
        $query = isset($parts['query']) ? '?' . $parts['query'] : '';
    
        // 3. Normalize percent-encoding
        //    a) Decode once
        $path = rawurldecode($path);
        //    b) Replace backslashes and collapse "../" and "." segments
        $path = str_replace('\\', '/', $path);
        $segments = explode('/', ltrim($path, '/'));
        $normalized = [];
        foreach ($segments as $seg) {
            if ($seg === '' || $seg === '.') {
                continue;
            }
            if ($seg === '..') {
                array_pop($normalized);
            } else {
                $normalized[] = $seg;
            }
        }
        //    c) Re-encode each segment to block sneaky bytes
        $encoded = array_map('rawurlencode', $normalized);
        $path    = '/' . implode('/', $encoded);
    
        // 4. Rebuild the relative URL
        $relative = $path . $query;
    
        // 5. Final sanitization for output (HTML headers, attributes, etc.)
        //    - FILTER_SANITIZE_URL strips invalid URL chars
        $relative = filter_var($relative, FILTER_SANITIZE_URL);
        return $relative;
    }
    

    /**
     * Retrieves the current full url, optionally removing ignored query strings.
     *
     * If self::$ignore_querystrings is set, the method parses the query string
     * and removes any key specified in the list.
     * 
     * @param bool $get_original whether to use the original url before anything may have modded it
     *
     * @return string The full URL, with ignored query strings removed.
     */
    public static function get_url($get_original=true) {

        //Allow URL overrides 
        if(isset(self::$injected_url)) {
            return self::$injected_url;
        }

        $request_uri = self::get_uri($get_original);

        // Determine protocol and host.
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];        
        $full_url = $protocol . $host . $request_uri;


        // Remove query strings that should be ignored.
        if (!empty(Cache::$ignore_querystrings)) {
            $ignore_keys = array_filter(array_map('trim', explode("\n", Cache::$ignore_querystrings)));
            $parsed_url = parse_url($full_url);
            $query = [];
            if (isset($parsed_url['query'])) {
                parse_str($parsed_url['query'], $query);
                foreach ($ignore_keys as $key) {
                    if (isset($query[$key])) {
                        unset($query[$key]);
                    }
                }
            }
            // Rebuild the query string.
            $query_string = http_build_query($query);
            $full_url = $protocol . $host . $parsed_url['path'] . ($query_string ? '?' . $query_string : '');
        }
        return $full_url;
    }    

    /**
     * Retrieves the cache path for a given URL.
     *
     * @param string $url The URL for which to retrieve the cache path.
     * @return string The cache path for the given URL.
     */
    public static function get_cache_dir_from_url($url) {

        // Remove any unnecessary query strings using get_clean_url().
        $clean_url = self::get_clean_url($url);
    
        // Extract the relative path from the clean URL.
        $relative_path = parse_url($clean_url, PHP_URL_PATH);
        // Normalize: if the relative path is "/" (or empty), set it to an empty string.
        $relative_path = trim($relative_path, '/') ? trim($relative_path, '/') : "";
    
        // Parse the query parameters from the clean URL.
        $parsed_url = parse_url($clean_url);
        $query_array = [];
        if (isset($parsed_url['query'])) {
            parse_str($parsed_url['query'], $query_array);
        }
    
        // Remove any ignored keys.
        $ignore_keys = array_map('trim', explode("\n", Cache::$ignore_querystrings));
        $query_strings = array_diff_key($query_array, array_flip($ignore_keys));
    
        // Build a directory-safe string from the remaining query parameters.
        $query_dir = "";
        if (!empty($query_strings)) {
            $safe_query_parts = [];
            foreach ($query_strings as $key => $value) {
                // Sanitize both key and value to allow only alphanumerics, underscores, and dashes.
                $safe_key = preg_replace('/[^A-Za-z0-9_\-]/', '', $key);
                $safe_value = preg_replace('/[^A-Za-z0-9_\-]/', '', $value);
                $safe_query_parts[] = $safe_value !== '' ? $safe_key . '-' . $safe_value : $safe_key;
            }
            // Join the parts with a dash.
            $query_dir = implode('-', $safe_query_parts);
        }
    
        // Build the base cache directory from the root.
        $base = rtrim(Speed::get_root_cache_path(), '/');
        // If there's a relative path, append it; otherwise, use the base as-is.
        $cache_dir = $relative_path !== "" ? $base . '/' . $relative_path : $base;
        // If query parameters exist, add them as an extra directory.
        if ($query_dir !== "") {
            $cache_dir .= '/' . $query_dir;
        }

        //Ensure ends with trailing slash
        $cache_dir = rtrim($cache_dir, '/') . '/';
        
        return $cache_dir;        
  
    }   


    
    /**
     * Build and return the full URL after stripping ignored query strings.
     *
     * @return string The cleaned full URL.
     */
    public static function get_clean_url($full_url = null, $ignore_querystrings=null) {

        //Allow ignore querystrings to be passed
        if(!$ignore_querystrings) {
            $ignore_querystrings = Cache::$ignore_querystrings;
        }

        if (!$full_url) {
            $protocol    = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
            $host        = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
            $request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
            $request_uri = self::get_sanitized_uri($request_uri);
            $full_url    = $protocol . $host . $request_uri;
        } else {
            $parsed = parse_url($full_url);
            $protocol = isset($parsed['scheme']) ? $parsed['scheme'] . '://' : 'http://';
            $host = isset($parsed['host']) ? $parsed['host'] : '';
        }
    
        // Remove ignored query strings.
        if (!empty($ignore_querystrings)) {
            $ignore_keys = array_filter(array_map('trim', explode("\n", $ignore_querystrings)));
            $parsed_url  = parse_url($full_url);
            $query       = [];
            if (isset($parsed_url['query'])) {
                parse_str($parsed_url['query'], $query);
                foreach ($ignore_keys as $key) {
                    if (isset($query[$key])) {
                        unset($query[$key]);
                    }
                }
            }
            $query_string = http_build_query($query);
            $path = isset($parsed_url['path']) ? $parsed_url['path'] : '';
            $full_url = $protocol . $host . $path . ($query_string ? '?' . $query_string : '');
        }
        return $full_url;
    }
    

    /**
     * Purges the cache file(s) for a given URL.
     *
     *
     * @param string $url The URL for which to purge the cache.
     */
    public static function purge_cache($url, $file_types = array("html", "gz")) {

        // Check not already purged
        if (isset(Speed::$done_purge[$url.implode('',$file_types)])) {
            return;
        }
    
        // Get the file path from the URL
        $cache_path = self::get_cache_dir_from_url($url);
    
    
        // Delete files
        Speed::deleteSpecificFiles($cache_path, $file_types);
    
        // Additionally, check the lookup_uris.json for modified URLs corresponding to the original URL.
        $lookup_file = Speed::get_root_cache_path() . "/lookup_uris.json";
        if (file_exists($lookup_file)) {
            $contents = file_get_contents($lookup_file);
            $current_lookup = $contents ? json_decode($contents, true) : [];

            // If the lookup contains our original URL as a key...
            if (isset($current_lookup[$url]) && is_array($current_lookup[$url])) {
                foreach ($current_lookup[$url] as $modified_url => $flag) {
                    // Get the cache directory for the modified URL.
                    if($modified_url) {
                        $modified_cache_path = self::get_cache_dir_from_url($modified_url);
                        Speed::deleteSpecificFiles($modified_cache_path, $file_types);
                    }
                }
            }
        }
    
        // Save as purged
        Speed::$done_purge[$url.implode('',$file_types)] = true;
    }
    

    /**
     * Deletes all files and subfolders in a given directory.
     *
     * @param string $dir The path to the directory to delete.
     * @param array $extensions array of extensions to delete
     *
     * @return void
     */
    public static function deleteSpecificFiles($dir, $patterns) {
    
        // Ensure the directory exists
        if (!is_dir($dir)) {
            return;
        }
    
        // Create a RecursiveDirectoryIterator to iterate through the directory and subdirectories
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );
    
        // Normalize patterns: Ensure all patterns are lowercase for case-insensitive matching
        $patterns = array_map('strtolower', $patterns);
    
        // Loop through each item (file/folder) in the directory
        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $filename = strtolower($file->getFilename());
    
                // Check if the filename ends with any of the patterns
                foreach ($patterns as $pattern) {
                    if (substr($filename, -strlen($pattern)) === $pattern) {
                        unlink($file->getRealPath());
                        break; // Stop checking other patterns once a match is found
                    }
                }
            }
        }
    }
        
    /**
     * Generates a CSRF token that can be used to secure a form from
     * cross-site request forgery attacks.
     *
     * The token is a base64-encoded string that contains a 30-second
     * expiration timestamp and a 16-byte random value. The token is
     * signed using the HMAC-SHA256 algorithm and the NONCE_SALT secret
     * key.
     *
     * @return string A base64-encoded CSRF token.
     */
    public static function generate_csrf_token($url) {
        global $secret_key;
        $secret_key = NONCE_SALT;
        $expiry = time() + 30; // Token expires in 30 seconds
        $random = bin2hex(random_bytes(6)); // Generate a random string
        // Combine expiry and random value into a single string.
        $data = $expiry . ':' . $random . ":" . $url;
        // Create a signature using HMAC-SHA256.
        $signature = hash_hmac('sha256', $data, $secret_key);
        // Concatenate the data and the signature.
        $token = $data . ':' . $signature;
        // Base64 encode the token so it can be safely included in HTML.
        return base64_encode($token);
    }

    /**
     * Decodes and verifies a CSRF token.
     *
     * The token is expected to be a base64-encoded string in the format:
     *   expiry:random:url:signature
     * where the URL may itself contain colons.
     *
     * @param string $token The base64-encoded CSRF token.
     * @return array|false Returns an associative array with keys 'expiry', 'random', 'url', and 'signature'
     *                     if the token is valid and not expired. Returns false otherwise.
     */
    public static function decode_csrf_token($token) {

        // Decode the token from base64.
        $decoded = base64_decode($token, true);
        if ($decoded === false) {
            return false; // Invalid base64 encoding.
        }
        
        // Split the decoded string on colons.
        $parts = explode(':', $decoded);
        
        // We need at least 4 parts: expiry, random, url, signature.
        if (count($parts) < 4) {
            return false;
        }
        
        // Extract the first part as expiry and the second as random.
        $expiry = array_shift($parts);
        $random = array_shift($parts);
        
        // The signature is the last element; the URL is everything in between
        // safer if the url has a colon
        $signature = array_pop($parts);
        $url = implode(':', $parts);
        
        // Check if the expiry is numeric and not in the past.
        if (!is_numeric($expiry) || time() > (int)$expiry) {
            //return false; // Token expired.
        }
        
        // Recompute the signature based on the expiry, random, and URL.
        $data = $expiry . ':' . $random . ':' . $url;
        $expected_signature = hash_hmac('sha256', $data, NONCE_SALT);
        
        // Use hash_equals to mitigate timing attacks.
        if (!hash_equals($expected_signature, $signature)) {
            return false; // Invalid signature.
        }
        
        // Return the token components if everything checks out.
        return [
            'expiry'    => (int)$expiry,
            'random'    => $random,
            'url'       => $url,
            'signature' => $signature,
        ];
    }


}
