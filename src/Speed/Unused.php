<?php

namespace SPRESS\Speed;

use Sabberworm\CSS\CSSList\AtRuleBlockList;
use Sabberworm\CSS\CSSList\CSSBlockList;
use Sabberworm\CSS\CSSList\Document;
use Sabberworm\CSS\OutputFormat;
use Sabberworm\CSS\Parser as CSSParser;
use Sabberworm\CSS\Settings;
use Sabberworm\CSS\RuleSet\DeclarationBlock;
use Sabberworm\CSS\Value\URL;

use MatthiasMullie\Minify;
use Wa72\Url\Url as WaUrl;

/**
 * This `Unused` class is responsible for finding the unused CSS in HTML content.
 * 
 * @credits heavily influenced by https://plugins.svn.wordpress.org/debloat/trunk/inc/remove-css/remove-css.php
 * 
 * @package SPRESS
 */
class Unused {

    protected static $used_markup = [
        'classes' => [],
        'tags' => [],
        'ids' => [],
        'fonts' => [],
        'keyframes' => [],         
    ];

    /**
     * @var array<string,string>
     *   Maps a custom property name (e.g. "--h1_typography-font-family")
     *   to its raw value (e.g. "Oswald, Verdana, Geneva, sans-serif")
     */
    protected static $css_variables = [];

    protected static $allow_selectors = [];
    protected static $current_stylesheet = null;
    protected static $body_classes = [];
    public static $stylesheets_css = [];
    public static $usage_tracker = ['original_length' => 0, 'used_length' => 0];
    public static $stylesheet_urls = [];
    public static $inline_css = [];
    public static $raw_css = [];
    public static $parsed_css = [];

    /**
     * Initializes the process of optimizing and extracting useful CSS from HTML content.
     *
     * This function processes the provided HTML to extract body classes and find
     * used CSS selectors. It also handles forced inclusion of fonts and keyframes,
     * parses and processes linked CSS stylesheets, and calculates the reduction in
     * CSS size.
     *
     * @param string $html The HTML content to process.
     * @param array $allow_selectors An optional array of selectors that are allowed.
     * @return array An array containing optimized CSS, usage tracker statistics, percentage reduction, and used markup.
     */

    public static function init($html, $allow_selectors = []) {

        $start_time = microtime(true);

        // Extract body classes manually before DOM load
        preg_match('/<body[^>]*class=["\']([^"\']+)["\']/', $html, $body_match);
        self::$body_classes = isset($body_match[1]) ? preg_split('/\s+/', $body_match[1]) : [];

        //Create DOM object
        libxml_use_internal_errors(true);
        $dom = new \DOMDocument();
        $dom->loadHTML($html);
        libxml_clear_errors();

        //Set selectors user can set as allowed
        self::$allow_selectors = $allow_selectors;

        //Look for selectors in the DOM
        self::find_used_selectors_in_dom($dom);                           

        //Get stylesteets
        self::find_stylesheet_urls($html);

        //Pass 1, get fonts and keyframes from CSS
        foreach(self::$stylesheet_urls AS $url) {            
            self::process_sheet_for_fonts_keyfames($url);           
        }

        //Pass 2, parse the CSS and remove unused
        foreach(self::$stylesheet_urls AS $url) {
            self::process_sheet_for_css($url);
        }

        //Process inline CSS
        self::find_inline_css($html);
        $home_url = home_url();
        foreach(self::$inline_css AS $spcid => $css) {

            //Track usage
            self::$usage_tracker['original_length'] += strlen($css);

            //Get used keyframe and fonts
            self::find_used_fonts_keyframes_in_html($css);

            //Get parsed
            $parsed = self::parse_css($home_url, $css, $spcid);

            //Get the CSS blocks and remove unused
            $data = self::transform_parsed_css($parsed, $home_url);

            //Sanitize based on the used blocks
            $sanitized_css = self::render_css($data);

            //Track usage
            self::$usage_tracker['used_length'] += strlen($sanitized_css);

            //Add to global variable
            self::$stylesheets_css["id-".$spcid] = $sanitized_css;              

        }

        //Form return array
        return array("CSS"=>self::$stylesheets_css, 
                     "usage_tracker"=>self::$usage_tracker,
                     "percent_reduction" => self::$usage_tracker['original_length'] > 0
                                            ? number_format((self::$usage_tracker['original_length'] - self::$usage_tracker['used_length']) / self::$usage_tracker['original_length'] * 100, 2)
                                            : 0,
                     "markup"=>self::$used_markup
                    );
    }


    // Uses a regex to find inline styles, where the styles have the
    // data-spcid="idhere" tag. Return an array indexed by the spcid
    // where the value is the inline CSS
    public static function find_inline_css($html) {
       
        $pattern = '/<style[^>]*data-spcid="([^"]+)"[^>]*>([^<]+)<\/style>/';
        preg_match_all($pattern, $html, $matches);
        $result = array();
        foreach ($matches[1] as $index => $spcid) {
            if(isset($matches[2][$index])) {
                $result[$spcid] = $matches[2][$index];
            }
        }

        self::$inline_css = $result;

    }

    /**
     * Finds all linked stylesheets in the provided HTML content.
     *
     * This function parses the HTML to extract all <link> tags with a rel attribute set to
     * "stylesheet". It then extracts the href attribute value from each of these tags and
     * removes any query strings from the URLs before storing them in the $stylesheet_urls
     * class property.
     *
     * @param string $html The HTML content to parse for stylesheets.
     * @return void
     */
    public static function find_stylesheet_urls($html) {

        //Look for selectors in the sheets
        preg_match_all('#<link[^>]*stylesheet[^>]*>#Usi', $html, $matches);
        $tags = $matches[0] ?? [];

        //Get URLS        
        foreach ($tags as $tag) {
            
            if (!preg_match('/href=["\']([^"\']+)["\']/', $tag, $href_match)) {
                continue;
            }

            $url = $href_match[1] ?? false;

            if($url) {

                if (strpos($url, '//') === 0) {
                    $url = (is_ssl() ? 'https:' : 'http:') . $url;
                } elseif (! preg_match('#^https?://#i', $url)) {
                    $url = rtrim(home_url(), '/') . '/' . ltrim($url, '/');
                }

                $url = self::url_remove_querystring($url);
                self::$stylesheet_urls[] = $url;
            }

        }

    }


    // Looks at a URL and gets the used fonts and animation keyframes
    // which we will check against later
    public static function process_sheet_for_fonts_keyfames($url) {

        $parsed = self::get_parsed_sheet($url);
        if($parsed) {

            // first collect all --* variables into self::$css_variables
            self::collect_css_vars($parsed);

            self::find_used_fonts_keyframes_in_css($parsed, $url);
        } 

    }

    // Looks at a CSS URL and parses the CSS within it
    // fills the $stylesheets_css variable with the used CSS
    public static function process_sheet_for_css($url) {

        $parsed = self::get_parsed_sheet($url);
        if(!$parsed) {
            return false;
        }

        //Get the CSS blocks and remove unused
        $data = self::transform_parsed_css($parsed, $url);

        //Sanitize based on the used blocks
        $sanitized_css = self::render_css($data);

        self::$usage_tracker['used_length'] += strlen($sanitized_css);

        //Add to global variable
        self::$stylesheets_css[$url] = $sanitized_css;  


    }

    /**
     * Fetches the CSS for a stylesheet, parses it, and returns the parsed
     * CSS. If the CSS has already been parsed, it will return the parsed
     * version instead of re-parsing it.
     *
     * @param string $url The URL of the stylesheet to parse
     *
     * @return ParsedCSS|null The parsed CSS, or null if it could not be
     *     parsed
     */
    public static function get_parsed_sheet($url) {
        
        if(isset(self::$raw_css[$url])) {
            $css = self::$raw_css[$url];
        } else {
            $css = self::fetch($url);
        }
        if (!$css) return;


        //set original length
        self::$usage_tracker['original_length'] += strlen($css);

        //Set for later usage
        self::$current_stylesheet = $url;

        //Get parsed
        if(isset(self::$parsed_css[$url])) {
            $parsed = self::$parsed_css[$url];            
        } else {
            $parsed = self::parse_css($url, $css, $url);
        }    

        return $parsed;

    }

    
    /**
     * Parses a CSS string and stores the parsed representation.
     *
     * @param string|null $url Optional. The URL from which the CSS was fetched, used for converting URLs.
     * @param string $css The CSS string to parse.
     * @param string|null $identifier Optional. An identifier to store the parsed CSS result.
     *
     * The function uses the CSSParser to parse the given CSS string and stores the parsed result in the class's
     * parsed CSS storage. If a URL is provided, it will also convert relative URLs within the parsed CSS.
     */

    public static function parse_css($url = null, $css, $identifier = null) {        

        $config = Settings::create()->withMultibyteSupport(false);
        $parser = new CSSParser($css, $config);
        $parsed = $parser->parse();

        if($url) {
            $base_url = self::url_to_base($url);
            self::convert_urls($parsed, $base_url);
        }

        self::$parsed_css[$identifier] = $parsed;

        return $parsed;

    }


    /**
     * Finds all used selectors in a given DOM.
     *
     * @param \DOMDocument $dom The DOM to search through
     *
     * @return void
     */
    protected static function find_used_selectors_in_dom($dom) {
        
        $classes = self::$body_classes; // Start with body classes
        foreach ($dom->getElementsByTagName('*') as $node) {
            self::$used_markup['tags'][$node->tagName] = 1;
    
            if ($node->hasAttribute('class')) {
                $ele_classes = preg_split('/\s+/', $node->getAttribute('class'));
                array_push($classes, ...$ele_classes);
            }
    
            if ($node->hasAttribute('id')) {
                self::$used_markup['ids'][$node->getAttribute('id')] = 1;
            }
    
            if ($node->hasAttribute('style')) {
                $style = $node->getAttribute('style');
                self::find_used_fonts_keyframes_in_html($style);
            }
        }
    
        $classes = array_filter(array_unique($classes));
        if ($classes) {
            self::$used_markup['classes'] = array_fill_keys($classes, 1);
        }
    }

    /**
     * Parses HTML content to extract and track used font-family and animation-name styles.
     *
     * This function searches for 'font-family' and 'animation-name' declarations 
     * within the provided HTML and updates the $used_markup property with the 
     * identified fonts and keyframes. It handles multiple values separated by 
     * commas and ensures that font-family and animation-name values are trimmed 
     * of extraneous spaces and quotes. The function also checks to ensure that 
     * animation names are not set to 'none' before tracking them.
     *
     * @param string $html The HTML content to parse for font and animation usage.
     * @return void
     */
    public static function find_used_fonts_keyframes_in_html($html) {

        // Extract font-family
        if (preg_match_all('/font-family\s*:\s*([^;]+);?/', $html, $matches)) {
            foreach ($matches[1] as $font) {

                //  If it's using var(--some-var, optional-fallback), resolve:
                if (preg_match('/var\(\s*(--[A-Za-z0-9_-]+)(?:\s*,\s*[^)]+)?\)/', $font, $m)) {
                    $var_name = $m[1];
                    if (isset(self::$css_variables[$var_name])) {
                        foreach (explode(',', self::$css_variables[$var_name]) as $fam) {
                            $fam_clean = trim(trim($fam), "\"'");
                            if ($fam_clean !== '') {
                                self::$used_markup['fonts'][$fam_clean] = 1;
                            }
                        }
                        continue;
                    }
                }

                // Otherwise split on commas as before:
                $families = explode(',', $font);
                foreach ($families as $fam) {
                    $fam_clean = trim(trim($fam), "\"'");
                    if ($fam_clean !== '') {
                        self::$used_markup['fonts'][$fam_clean] = 1;
                    }
                }
            }
        }
    
        // Extract animation-name and animation shorthand
        if (preg_match_all('/animation(?:-name)?\s*:\s*([^;]+);?/', $html, $matches)) {
            foreach ($matches[1] as $animation_value) {
                $animations = explode(',', $animation_value);
                foreach ($animations as $anim) {
                    // For shorthand animation, the name is usually the first value *if* it's a valid CSS identifier
                    $parts = preg_split('/\s+/', trim($anim));
                    if (count($parts)) {
                        // Skip known timing functions and keywords
                        foreach ($parts as $part) {
                            $clean = trim($part, "\"'");
                            if (
                                $clean &&
                                !preg_match('/^\d+(ms|s)?$/', $clean) && // durations
                                !in_array(strtolower($clean), ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'infinite', 'alternate', 'forwards', 'backwards', 'none', 'normal', 'reverse', 'paused', 'running', 'step-start', 'step-end']) &&
                                !preg_match('/^\d+(\.\d+)?$/', $clean)
                            ) {
                                self::$used_markup['keyframes'][$clean] = 1;
                                break; // Only need the animation name
                            }
                        }
                    }
                }
            }
        }
    }
    
    
    /**
     * Parses a given CSS block and extracts used font-family and animation-name rules.
     *
     * @param CSSBlockList $data The CSS block to parse
     * @param string $url The URL of the stylesheet being parsed
     *
     * @return void
     */
    protected static function find_used_fonts_keyframes_in_css(CSSBlockList $data, $url) {

        //Get base url
        $base_url = self::url_to_base($url);

        $items = [];
    
        foreach ($data->getContents() as $content) {
    
            if ($content instanceof AtRuleBlockList) {
                
                //Parse nested @s
                self::find_used_fonts_keyframes_in_css($content, $base_url);

                
            } elseif ($content instanceof DeclarationBlock) {

                $selectors = $content->getSelectors();
    
                // Regular CSS rule with selectors
                $parsed_selectors = self::parse_selectors($selectors);
                $should_include = false;
    
                foreach ($parsed_selectors as $selector) {
                    if (self::should_include($selector)) {
                        
                        $should_include = true;
    
                        // If included, check for font-family usage
                        foreach ($content->getRules() as $rule) {

                            $rule_name = strtolower($rule->getRule());
                            $val = $rule->getValue();
                            $val_str = $val instanceof \Sabberworm\CSS\Value\Value ? $val->render(OutputFormat::createCompact()) : (string) $val;
                    
                            // If this is a CSS custom-property (starts with "--"), store it and skip:
                            if (strpos($rule_name, '--') === 0) {
                                self::$css_variables[$rule_name] = trim($val_str);
                                continue;
                            }  

                            // Capture font-family
                            if ($rule_name === 'font-family') {

                                $pattern = '/var\(\s*(--[A-Za-z0-9_-]+)(?:\s*,\s*[^)]+)?\)\s*(?:!important)?/i';

                                // If it's using var(--some-var):
                                if (preg_match('/var\(\s*(--[A-Za-z0-9_-]+)(?:\s*,\s*[^)]+)?\)/', $val_str, $m)) {

                                        $var_name = $m[1]; // "--h1_typography-font-family"

                                        if (isset(self::$css_variables[$var_name])) {
                                            // Get e.g. "Oswald,Verdana,Geneva,sans-serif"
                                            $real_families = self::$css_variables[$var_name];
                                            foreach (explode(',', $real_families) as $fam) {
                                                // Trim any stray quotes or spaces
                                                $fam_clean = trim(trim($fam), "\"'");
                                                if ($fam_clean !== '') {
                                                    self::$used_markup['fonts'][$fam_clean] = 1;
                                                }
                                            }
                                        } 

                                } else {

                                        $families = explode(',', $val_str);
                                        foreach ($families as $fam) {
                                            $fam_clean = trim(trim($fam), "\"'");
                                            if ($fam_clean) {
                                                self::$used_markup['fonts'][$fam_clean] = 1;
                                            }
                                        }

                                }

                            }

                            // Capture from 'font' shorthand
                            if ($rule_name === 'font') {

                                // If it's using var(--some-var):
                                if (preg_match('/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/', $val_str, $m)) {
                                    $var_name = $m[1];
                                    if (isset(self::$css_variables[$var_name])) {
                                        $real_families = self::$css_variables[$var_name];
                                        foreach (explode(',', $real_families) as $fam) {
                                            $fam_clean = trim(trim($fam), "\"'");
                                            if ($fam_clean) {
                                                self::$used_markup['fonts'][$fam_clean] = 1;
                                            }
                                        }
                                    }
                                } else {

                                    $parts = explode(',', $val_str);
                                    foreach ($parts as $part) {
                                        $tokens = preg_split('/\s+/', trim($part));
                                        if (!empty($tokens)) {
                                            $maybe_font = trim(end($tokens), "\"'");
                                            if ($maybe_font && strtolower($maybe_font) !== 'inherit') {
                                                self::$used_markup['fonts'][$maybe_font] = 1;
                                            }
                                        }
                                    }

                                }
                            }                            
                    
                            // Capture animation-name or shorthand animation
                            if ($rule_name === 'animation' || $rule_name === 'animation-name') {
                                $names = explode(',', $val_str);
                                foreach ($names as $name) {
                                    $parts = preg_split('/\s+/', trim($name));
                                    if (!empty($parts)) {
                                        // First part is usually the animation-name
                                        $candidate = trim($parts[0], "\"'");
                                        if ($candidate && strtolower($candidate) !== 'none') {
                                            self::$used_markup['keyframes'][$candidate] = 1;
                                        }
                                    }
                                }
                            }
                            

                        }
    
                        break;
                    }
                }
    


            } else {

                $css = self::handle_utf8($content->render(OutputFormat::createCompact()));

                if (stripos($css, '@import') !== false) {

                    preg_match_all('/@import\s+(url\()?["\']?([^"\')]+)["\']?\)?\s*;?/', $css, $matches);

                    foreach ($matches[2] as $url) {
                        if (strpos($url, 'http') !== 0 && strpos($url, '/') !== 0) {

                            $base = WaUrl::parse($base_url);
                            $relative = WaUrl::parse($url);
                            $fixed_url = $relative->makeAbsolute($base)->write();
                            
                            self::process_sheet_for_fonts_keyfames($fixed_url);
                            continue;
                        }
                    }

                }
            


            }
        }

    }    

    /**
     * Escapes non-ASCII characters in CSS content property values. This is needed
     * because some CSS minifiers (like YUI Compressor) do not handle UTF-8
     * characters correctly.
     *
     * @param string $css The CSS to process
     *
     * @return string The processed CSS
     */
    protected static function handle_utf8($css) {
        return preg_replace_callback(
            '/content\s*:\s*"([^"]+)"/i',
            function ($matches) {
                $fixed = '';
                $chars = mb_str_split($matches[1]);
                foreach ($chars as $char) {
                    $code = mb_ord($char, 'UTF-8');
                    // Escape non-ASCII characters
                    if ($code > 127) {
                        $fixed .= '\\' . dechex($code);
                    } else {
                        $fixed .= $char;
                    }
                }
                return 'content: "' . $fixed . '"';
            },
            $css
        );
    }    

    /**
     * Converts relative URLs in a parsed CSS document to absolute URLs
     *
     * @param Document $data The parsed CSS document
     * @param string $base_url The base URL to use for absolute URLs
     *
     * @return void
     */        
    protected static function convert_urls(Document $data, $base_url) {
        $values = $data->getAllValues();
        foreach ($values as $value) {
            if (!($value instanceof URL)) continue;
            $url = $value->getURL()->getString();
            if (preg_match('/^(https?|data):/', $url)) continue;
            $parsed = parse_url($url);
            if (!empty($parsed['host']) || empty($parsed['path']) || $parsed['path'][0] === '/') continue;
            $value->getURL()->setString($base_url . $url);
        }
    }



    /**
     * Transforms the entire parsed CSS blocklist into just an array of CSS
     * and selectors that should be included
     *
     * @param CSSBlockList $data The parsed CSS blocklist
     * @param string $url The URL of the stylesheet
     *
     * @return array An array of CSS and selectors that should be included
     */
    protected static function transform_parsed_css(CSSBlockList $data, $url) {

        // Ensure base
        $base_url = self::url_to_base($url);

        $items = [];
    
        foreach ($data->getContents() as $content) {
    
            if ($content instanceof AtRuleBlockList) {
                $at_rule_name = $content->atRuleName();
                $args = $content->atRuleArgs();
    
                // @media, @supports, etc. rules
                $items[] = [
                    'rulesets' => self::transform_parsed_css($content, $base_url),
                    'at_rule'  => "@{$at_rule_name} {$args}"
                ];
    
            } elseif ($content instanceof DeclarationBlock) {
                $selectors = $content->getSelectors();
    
                // Regular CSS rule with selectors
                $parsed_selectors = self::parse_selectors($selectors);
                $should_include = false;
    
                foreach ($parsed_selectors as $selector) {
                    if (self::should_include($selector)) {
                        $should_include = true;
                        break;
                    }
                }
    
                if ($should_include) {
                    $items[] = [
                        'css' => self::handle_utf8($content->render(OutputFormat::createCompact())),
                        'selectors' => $parsed_selectors
                    ];
                }

            } else {

                $css = self::handle_utf8($content->render(OutputFormat::createCompact()));

                // Check if it's a font-face block
                if (stripos($css, '@font-face') !== false) {
                    // Attempt to extract font-family manually
                    if (preg_match('/font-family\s*:\s*["\']?([^;"\'\n]+)/i', $css, $match)) {
                        $font = trim($match[1]);
                        if (!isset(self::$used_markup['fonts'][$font])) {
                            //Remove from CSS
                            continue;
                        }
                    }
                }

                // Check if keyframe
                if (stripos($css, '@keyframes') !== false) {
                    // Attempt to extract keyframe name manually
                    if (preg_match('/@keyframes\s+([a-zA-Z0-9_-]+)/i', $css, $match)) {
                        $keyframe = trim($match[1]);
                        if (!isset(self::$used_markup['keyframes'][$keyframe])) {
                            // Remove from CSS
                            continue;
                        }
                    }
                }                

                if (stripos($css, '@import') !== false) {

                    preg_match_all('/@import\s+(url\()?["\']?([^"\')]+)["\']?\)?\s*;?/', $css, $matches);

                    foreach ($matches[2] as $url) {
                        if (strpos($url, 'http') !== 0 && strpos($url, '/') !== 0) {

                            $base = WaUrl::parse($base_url);
                            $relative = WaUrl::parse($url);
                            $fixed_url = $relative->makeAbsolute($base)->write();
                            
                            self::process_sheet_for_css($fixed_url);
                           
                        }
                    }

                    //Remove from CSS
                    continue;

                }
            
                // Handles @import, @keyframes, etc.
                $items[] = ['css' => $css];

            }
        }
    
        return $items;
    }
    
    

    /**
     * Parse selectors to get classes, id, tags and attrs.
     *
     * @param array $selectors
     * @return array
     */
    protected static function parse_selectors(array $selectors) {
        $result = [];
        foreach ($selectors as $sel) {
            // Use getSelector() instead of __toString()
            if (is_object($sel) && method_exists($sel, 'getSelector')) {
                $selector = $sel->getSelector();
            } else {
                // Fallback in case something unexpected comes in
                $selector = (string) $sel;
            }
            $data = [
                'selector' => $selector,
                'classes' => [],
                'ids' => [],
                'tags' => [],
                'attrs' => []
            ];
            $selector = preg_replace('/(?<!\\\\)::?[a-zA-Z0-9_-]+(\(.+?\))?/', '', $selector);
            $selector = preg_replace_callback('/\[([A-Za-z0-9_:-]+)(\W?=[^\]]+)?\]/', function($m) use (&$data) {
                $data['attrs'][] = $m[1];
                return '';
            }, $selector);
            $selector = preg_replace_callback('/\.((?:[a-zA-Z0-9_-]+|\\\\.)+)/', function($m) use (&$data) {
                $data['classes'][] = stripslashes($m[1]);
                return '';
            }, $selector);
            $selector = preg_replace_callback('/#([a-zA-Z0-9_-]+)/', function($m) use (&$data) {
                $data['ids'][] = $m[1];
                return '';
            }, $selector);
            $selector = preg_replace_callback('/[a-zA-Z0-9_-]+/', function($m) use (&$data) {
                $data['tags'][] = $m[0];
                return '';
            }, $selector);
            $result[] = array_filter($data);
        }
        return $result;
    }

    /**
     * Render CSS block from data structure.
     *
     * @param array $data Data structure from transform_data.
     * @return string
     */
    protected static function render_css(array $data) {
        $output = [];
        foreach ($data as $item) {
            if (isset($item['css'])) {
                if (!isset($item['selectors'])) {
                    // e.g. @font-face or @keyframes — no selectors, always include
                    $output[] = $item['css'];
                } else {
                    foreach ($item['selectors'] as $selector) {
                        if (self::should_include($selector)) {
                            $output[] = $item['css'];
                            break;
                        }
                    }
                }
            }
             elseif (!empty($item['rulesets'])) {
                $nested = self::render_css($item['rulesets']);
                if ($nested) {
                    $output[] = sprintf('%s { %s }', $item['at_rule'], $nested);
                }
            }
        }
        $csstxt = implode('', $output);

        //Minify it
        $minifier = new Minify\CSS($csstxt);
        $csstxt = $minifier->minify();

        return $csstxt;

    }

    /**
     * First pass: walk the entire parsed CSS tree and collect all custom-property
     * definitions (rules like "--foo: bar;"), storing them in self::$css_variables.
     *
     * @param CSSBlockList $data The parsed CSS blocklist
     * @return void
     */
    protected static function collect_css_vars(CSSBlockList $data) {
        foreach ($data->getContents() as $content) {
            if ($content instanceof DeclarationBlock) {
                foreach ($content->getRules() as $rule) {
                    $rule_name = strtolower($rule->getRule());
                    $val       = $rule->getValue();
                    $val_str   = $val instanceof \Sabberworm\CSS\Value\Value
                            ? $val->render(OutputFormat::createCompact())
                            : (string)$val;
                    if (strpos($rule_name, '--') === 0) {
                        // Store "--foo: bar" => css_variables['--foo'] = 'bar'
                        self::$css_variables[$rule_name] = trim($val_str);
                    }
                }
            }
            elseif ($content instanceof AtRuleBlockList) {
                // Recurse into nested @media, etc.
                self::collect_css_vars($content);
            }
        }
    }    


    /**
     * Determine if a CSS selector should be included in the final output.
     *
     * @param array $selector {
     *     @type string $selector The CSS selector.
     *     @type string[] $classes The classes in the selector.
     *     @type string[] $ids The IDs in the selector.
     *     @type string[] $tags The HTML tags in the selector.
     *     @type string[] $attrs The attributes in the selector.
     * }
     * @return boolean
     */
    protected static function should_include(array $selector) {

        //Root gets a pass
        if ($selector['selector'] === ':root') return true;

        //Attrs get a pass
        if (!empty($selector['attrs']) && empty($selector['classes']) && empty($selector['ids']) && empty($selector['tags'])) return true;

        //Test passed classes against selector
        foreach (self::$allow_selectors as $class) {

            if(preg_match("@".$class."@i",$selector['selector'],$matches)) {
                return true;
            }
        }

		$valid = true;
		if (
			// Check if all classes are used.
			(!empty($selector['classes']) && !self::is_used($selector['classes'], 'classes'))

			// Check if all the ids are used.
			|| (!empty($selector['ids']) && !self::is_used($selector['ids'], 'ids'))

			// Check for the target tags in used.
			|| (!empty($selector['tags']) && !self::is_used($selector['tags'], 'tags'))
		) {
			$valid = false;
		}


		return $valid;
    }

    /**
     * Determine if all targets of a given type are used.
     *
     * @param string|array $targets The targets to check.
     * @param string $type The type of targets, either 'classes', 'ids', or 'tags'.
     * @return boolean
     */
    protected static function is_used($targets, $type) {
        $targets = (array) $targets;
        foreach ($targets as $t) {
            if (!isset(self::$used_markup[$type][$t])) return false;
        }
        return true;
    }

    /**
     * Processes the allowed selectors to compute search regex patterns.
     *
     * Iterates through each allowed selector rule and checks for the presence of 
     * a 'search' key. If found, it constructs regex patterns by converting 
     * wildcard characters ('*') into proper regex syntax. The computed regex 
     * patterns are then stored in the 'computed_search_regex' key of the rule 
     * for later use in matching operations.
     *
     * @return void
     */    
    protected static function process_allowed_selectors() {
        foreach (self::$allow_selectors as &$rule) {
            if (isset($rule['search'])) {
                $regexes = [];
                foreach ((array)$rule['search'] as $search) {
                    if (strpos($search, '*') !== false) {
                        $escaped = preg_quote($search);
                        $escaped = str_replace('\\*', '.*?', $escaped);
                        $regexes[] = '^' . $escaped;
                    }
                }
                if ($regexes) {
                    $rule['computed_search_regex'] = '(' . implode('|', $regexes) . ')';
                }
            }
        }
    }

    /**
     * Checks if an asset matches a given pattern.
     *
     * The pattern may contain wildcard characters ('*'), which are converted to 
     * regex syntax for flexible matching. If the pattern does not contain a 
     * wildcard, a simple equality check is performed.
     *
     * @param string $pattern The pattern to match against, possibly containing wildcards.
     * @param string $asset The asset to be matched.
     * @return bool True if the asset matches the pattern, false otherwise.
     */
    protected static function asset_match($pattern, $asset) {
        if (strpos($pattern, '*') === false) {
            return $pattern === $asset;
        }
        $regex = '#^' . str_replace('\*', '.*?', preg_quote($pattern, '#')) . '$#';
        return (bool) preg_match($regex, $asset);
    }


    /**
     * Fetches the content at a given URL, either from a local copy if
     * one exists or from the web if it doesn't.
     *
     * @param string $url The URL to fetch
     *
     * @return string|false The content at the URL, or false if it couldn't
     *     be fetched.
     */
    protected static function fetch($url) {
        $file = self::url_to_local($url);
        if ($file && file_exists($file)) {
            return file_get_contents($file);
        } else {
            return false;
        }
    }

     /**
     * Removes the query string from a given URL.
     *
     * @param string $url The URL to remove the query string from
     *
     * @return string The URL with the query string removed
     */
    public static function url_remove_querystring($url) {

        //Remove querystring
        $base_url = preg_replace('#\?.*$#', '', $url);

        return $base_url;

    }


    /**
     * Removes the filename and query string from a given URL.
     *
     * @param string $url The URL to remove the filename and query string from
     *
     * @return string The URL with the filename and query string removed
     */
    protected static function url_to_base($url) {

        //Get base url
        $base_url = preg_replace('#[^/]+\?.*$#', '', $url); // remove filename + query
        $base_url = preg_replace('#[^/]+$#', '', $base_url); // remove filename if no query

        return $base_url;

    }

    /**
     * Converts a URL to a local filesystem path.
     *
     * @param string $url The URL to convert
     *
     * @return string|false The local filesystem path, or false if the URL is not a local URL
     */
    public static function url_to_local($url) {
        $site_url = site_url();
        if (strpos($url, $site_url) === 0) {
            $path = str_replace($site_url, ABSPATH, $url);
            return realpath(parse_url($path, PHP_URL_PATH));
        }
        return false;
    }



}