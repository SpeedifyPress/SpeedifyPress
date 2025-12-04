<?php

namespace SPRESS\Speed;

use SPRESS\App\Config;
use SPRESS\Speed;
use SPRESS\Speed\CSS;

use SPRESS\Dependencies\simplehtmldom\HtmlDocument;
use SPRESS\Dependencies\MatthiasMullie\Minify;

/**
 * This `CSS` class is responsible for optimizing and managing CSS files for faster 
 * page load times. It caches processed CSS files, rewrites URLs, and integrates 
 * with the WordPress enqueue system to serve optimized CSS assets.
 * 
 * @package SPRESS
 */
class JS {

    public static $defer_js;       
    public static $defer_exclude;
    public static $defer_exclude_urls;
    
    public static $delay_js;
    public static $delay_exclude;                 
    public static $delay_exclude_urls;        
    public static $delay_seconds;        
    public static $delay_callback;        
    public static $script_load_first;        
    public static $script_load_last;      
    public static $trigger_native_events;   
    public static $trigger_jquery_events;   
    public static $trigger_replays;    

    public static $script_name = "speed-js";

	public static function init() {

        //Get configuration values
        self::$defer_js = Config::get('speed_js','defer_js');        
        self::$defer_exclude = Config::get('speed_js','defer_exclude');        
        self::$defer_exclude_urls = Config::get('speed_js','defer_exclude_urls');        
        
        self::$delay_js = Config::get('speed_js','delay_js');
        self::$delay_exclude = Config::get('speed_js','delay_exclude');                 
        self::$delay_exclude_urls = Config::get('speed_js','delay_exclude_urls');        
        self::$delay_seconds = Config::get('speed_js','delay_seconds');        
        self::$script_load_first = Config::get('speed_js','script_load_first');        
        self::$script_load_last = Config::get('speed_js','script_load_last');
        self::$trigger_native_events = Config::get('speed_js','trigger_native_events');
        self::$trigger_jquery_events = Config::get('speed_js','trigger_jquery_events');
        self::$trigger_replays = Config::get('speed_js','trigger_replays');        
         
        if(self::run_js() == false) {
            return;
        }

        //Create the callback
        $callback = Config::get('speed_js','load_complete_js');
        if($callback) {

            $minifier = new Minify\JS($callback);
            $jstxt = $minifier->minify();
            $jstxt = "(function(){" . ($jstxt) . "})();";
            self::$delay_callback = $jstxt;

        }
        
        //Enqueue the script for our JS processing
        add_action( 'wp_enqueue_scripts', array(__CLASS__,'public_enqueue_js') );


	}


    /**
     * 
     *
     * @param string $output The HTML output to optimize.
     * @return string The optimized HTML output.
     */
    public static function rewrite_js($output) {

        if(self::run_js() == false) {
            return $output;
        }


        $start_time = microtime(true);

        // simple_html_dom.
        $dom = (new HtmlDocument(""))->load($output,true, false);          

        //Rewrite defer
        if(self::$defer_js == "true" && self::is_blocked_url('defer') === false) {
            
            $dom = self::rewrite_defer($dom, self::$defer_exclude);

        }

        //Rewrite delay
        if(self::$delay_js == "true" && self::is_blocked_url('delay') === false) {
            
            $dom = self::rewrite_delay($dom, self::$delay_exclude);

        } 
    
        $html = $dom->outertext;

        $end_time = microtime(true);
        $elapsed_time = $end_time - $start_time;
        $html .=  "<!-- JS " . number_format($elapsed_time,2) . "-->";


        return $html;

    }       

    public static function rewrite_defer($dom, $exclude_scripts) {
        return self::processScripts($dom, $exclude_scripts, [self::class, 'handleDeferScript']);
    }
    
    public static function rewrite_delay($dom, $exclude_scripts) {
        return self::processScripts($dom, $exclude_scripts, [self::class, 'handleDelayScript']);
    }
    
    /**
     * Processes all <script> tags in the DOM, applying a handler for each script.
     * @param object $dom - The DOM object.
     * @param string $exclude_scripts - Newline-separated list of scripts to exclude.
     * @param callable $handler - Function to handle each script.
     * @return object - The modified DOM object.
     */
    private static function processScripts($dom, $exclude_scripts, callable $handler) {
        $exclude_scripts_array = array_filter(array_map('trim', explode("\n", $exclude_scripts)));
        $exclude_scripts_array[] = self::$script_name; // Always exclude our own scripts
        $exclude_scripts_array[] = CSS::$script_name."-js-extra"; // Always exclude our own scripts data
        $exclude_scripts_array[] = Speed::$csrf_name; // Always exclude our csrf token
        $exclude_scripts_array[] = "partytown"; // Always exclude partytown from delay
        $scripts = $dom->find('script');
    
        foreach ((array) $scripts AS $script) {
            $isExcluded = self::isExcluded($script, $exclude_scripts_array);
            $handler($script, $isExcluded);
        }

        //Handle module preloads
        $links = $dom->find('link');
        foreach ((array) $links AS $link) {
            $isExcluded = self::isExcluded($link, $exclude_scripts_array);
            $handler($link, $isExcluded);
        }        
    
        return $dom;
    }
    
    /**
     * Handles defer logic for scripts.
     * @param object $script - The script element.
     * @param bool $isExcluded - Whether the script is excluded.
     */
    private static function handleDeferScript($script, $isExcluded) {
        if (!$isExcluded) {
            $script->setAttribute('defer', true);
        } 
    }
    
    /**
     * Handles delay logic for scripts.
     * @param object $script - The script element.
     * @param bool $isExcluded - Whether the script is excluded.
     */
    private static function handleDelayScript($script, $isExcluded) {

        //Script with external source
        if (!$isExcluded && isset($script->src)) {
            $script->setAttribute('data-src', $script->src);
            $script->setAttribute('src', false);
            $script->setAttribute('defer', false);
            $script->setAttribute('async', false);                
        //Module preloads
        } elseif (!$isExcluded &&
            isset($script->href) &&
            isset($script->rel)
        ) {
            if($script->rel == "modulepreload") {
                $script->setAttribute('data-href', $script->href);
                $script->setAttribute('data-rel', $script->rel);
                $script->setAttribute('href', false);        
                $script->setAttribute('rel', false);                            
                $script->setAttribute('defer', false);
                $script->setAttribute('async', false);                    
            }
        //Inline JS
        } elseif (
            !$isExcluded &&
            !isset($script->src) &&
            self::isInlineJavaScript($script)
        ) {
            self::convertInlineScript($script, 'data-src');
        } 
    }
    
    /**
     * Checks if a script is in the exclusion list.
     * @param object $script - The script element.
     * @param array $exclude_scripts_array - List of excluded scripts.
     * @return bool - True if the script is excluded, false otherwise.
     */
    private static function isExcluded($script, $exclude_scripts_array) {
        foreach ($exclude_scripts_array as $exclude) {
            if (strpos($script->outertext, $exclude) !== false) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Checks if an inline script is JavaScript (type="text/javascript" or no type specified).
     * @param object $script - The script element.
     * @return bool - True if the script is JavaScript, false otherwise.
     */
    private static function isInlineJavaScript($script) {
        return (
            (isset($script->type) && $script->type === "text/javascript") ||
            !isset($script->type)
        );
    }

    /**
     * Converts an inline script into a data URI format.
     * @param object $script - The script element.
     * @param string $attribute - The attribute to set (e.g., 'src' or 'data-src').
     */
    private static function convertInlineScript($script, $attribute) {
        $scriptContent = trim($script->innertext);
    
        if (!empty($scriptContent)) {
            $encodedContent = base64_encode($scriptContent);
            $attributes = [];
    
            foreach ($script->getAllAttributes() as $attr => $value) {
                if ($attr !== 'src') {
                    $attributes[] = sprintf('%s="%s"', $attr, htmlspecialchars($value, ENT_QUOTES));
                }
            }
    
            $attributesString = implode(' ', $attributes);
            $script->outertext = sprintf(
                '<script %s="data:text/javascript;base64,%s" %s></script>',
                $attribute,
                $encodedContent,
                $attributesString
            );
        }
    }
    
       

    private static function run_js() {

        //Only run on front-end
        if(Speed::is_frontend() === false) {
            return false;
        }

        //Neither delaying not defering
        if(self::$defer_js != "true" && self::$delay_js != "true") {
            return false;
        }

        //Don't run if blocked by both
        if(self::is_blocked_url('delay') == true && self::is_blocked_url('defer') == true) {
            return false;
        }

        return true;

    }
     

    /**
     * Checks if the current URL matches any of the ignore URLs set in the
     * settings.
     *
     * @return bool 
     * 
     */
    private static function is_blocked_url($type) {

        if($type == "defer") {
        
            $ignore_urls = array_filter(explode("\n",self::$defer_exclude_urls));
            
        } else if($type == "delay") {

            $ignore_urls = array_filter(explode("\n",self::$delay_exclude_urls));

        }       
        

        // Get ignore URLs and cookies from config
        $current_uri = Speed::get_uri();
        $match_found = false;

        // Check URL patterns
        foreach ($ignore_urls as $pattern) {
            $pattern = trim($pattern);
        
            // Special case: If the pattern is explicitly for the root URI
            if ($pattern === '^/$' && $current_uri === '/') {
                $match_found = true;
                break;
            }
        
            // Construct regex dynamically for other patterns
            $regex = '@' . str_replace('/', '\/', $pattern) . '@';
        
            // Match the current URI with the pattern
            if (@preg_match($regex, $current_uri)) {
                $match_found = true;
                break;
            }
        }

        return $match_found;


    }


    /**
     * 
     *
     * @return void
     */
    public static function public_enqueue_js() {

        // Enqueue our js script, deferred
        wp_enqueue_script( self::$script_name, SPRESS_PLUGIN_URL . 'assets/js_delay/js_delay.min.js', array(), SPRESS_VER, true );
        add_filter( 'script_loader_tag', function ( $tag, $handle ) {
            if ( self::$script_name === $handle ) {
                return str_replace( '></script>', ' defer></script>', $tag );
            }
            return $tag;
        }, 10, 2 );


		wp_localize_script(
			self::$script_name,
			'speed_js_vars',
             self::get_js_vars_array()
		);      

    }

    /**
     * Returns an array of JavaScript variables.
     *
     * This function returns an array containing key-value pairs of variables that will be exposed to JavaScript.
     *
     * @return array An array of JavaScript variables, including delay settings and script load order.
     */
    public static function get_js_vars_array() {

       return array(
            'delay_seconds' => self::$delay_seconds,
            'delay_callback' => self::$delay_callback,
            'script_load_first' => self::$script_load_first,
            'script_load_last' => self::$script_load_last,
            'trigger_native_events' => self::$trigger_native_events,
            'trigger_jquery_events' => self::$trigger_jquery_events,
            'trigger_replays' => self::$trigger_replays,
       );

    }    

    public static function update_config_to_cache($new_config) {

        Cache::update_config_to_cache(self::get_js_vars_array(),$new_config,"speed_js_vars");        

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


 


}
