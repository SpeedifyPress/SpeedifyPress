<?php 
/**
 * ReleaseManager class
 *
 * This class is responsible for building and saving a release JSON file by:
 * - Reading a source release JSON.
 * - Updating the release version from a plugin file.
 * - Including WordPress version information.
 * - Converting a Markdown changelog into HTML.
 * - Saving the updated release to a target JSON file with pretty formatting.
 */
class ReleaseManager {

    // Paths to required files.
    protected $sourceReleaseFile;
    protected $targetReleaseFile;
    protected $pluginVersionFile;
    protected $wordpressVersionFile;
    protected $changelogFile;

    // The release object loaded from the source JSON.
    protected $release;

    /**
     * Constructor to initialize file paths.
     *
     * @param string $sourceReleaseFile Path to the source release JSON file.
     * @param string $targetReleaseFile Path to the target release JSON file.
     * @param string $pluginVersionFile Path to the plugin version PHP file.
     * @param string $wordpressVersionFile Path to the WordPress version file.
     * @param string $changelogFile Path to the Markdown changelog file.
     * @param string $docsFolder Path to the documentation folder.
     */
    public function __construct($sourceReleaseFile, $targetReleaseFile, $pluginVersionFile, $wordpressVersionFile, $changelogFile,$docsFolder) {
        $this->sourceReleaseFile    = $sourceReleaseFile;
        $this->targetReleaseFile    = $targetReleaseFile;
        $this->pluginVersionFile    = $pluginVersionFile;
        $this->wordpressVersionFile = $wordpressVersionFile;
        $this->changelogFile        = $changelogFile;
        $this->docsFolder           = $docsFolder;
    }

    /**
     * Reads the first 8 KB of a file and extracts header data.
     *
     * This function searches the beginning of a file for headers as defined in the 
     * $default_headers array and returns an associative array of header values.
     *
     * @param string $file Path to the file.
     * @param array $default_headers An associative array where keys are header names.
     * @param string $context Optional context parameter.
     * @return array Associative array of header data.
     */
    public static function getFileData($file, $default_headers, $context = '') {
        // Pull only the first 8 KB of the file.
        $file_data = file_get_contents($file, false, null, 0, 8 * 1024);
        if (false === $file_data) {
            $file_data = '';
        }
        // Normalize line endings.
        $file_data = str_replace("\r", "", $file_data);
        $all_headers = $default_headers;
        // Loop through each header and attempt to find it in the file.
        foreach ($all_headers as $field => $regex) {
            if (preg_match('/^(?:[ \t]*<\?php)?[ \t\/*#@]*' . preg_quote($regex, '/') . ':(.*)$/mi', $file_data, $match) && $match[1]) {
                // Trim and clean up the header value.
                $all_headers[$field] = trim(preg_replace('/\s*(?:\*\/|\?>).*/', '', $match[1]));
            } else {
                $all_headers[$field] = '';
            }
        }
        return $all_headers;
    }

    /**
     * Converts a Markdown changelog into formatted HTML.
     *
     * This method processes the changelog by extracting version headers and
     * bullet list items, and converting them into HTML blocks. It limits the output
     * to the number of versions specified by $max_versions.
     *
     * @param string $changelog The raw Markdown changelog.
     * @param int $max_versions The maximum number of version blocks to include.
     * @return string HTML formatted changelog.
     */
    public static function convertChangelog($changelog, $max_versions) { 
        // Split the changelog into individual lines.
        $lines = explode("\n", $changelog);
        $output = "";
        $version = "";
        $items = [];
        $versionCount = 0;
        // URL for the full changelog.
        $fullChangelogLink = "https://github.com/SpeedifyPress/SpeedifyPress/blob/main/CHANGELOG.md";

        // Process each line.
        foreach ($lines as $line) {
            $line = trim($line);

            // Check if the line is a version header (starts with "###").
            if (preg_match('/^###\s*(.+?)\s*-\s*(\d{4}-\d{2}-\d{2})$/', $line, $matches)) {
                // If there's an existing version block, output it.
                if ($version !== "" && !empty($items)) {
                    // Stop processing if maximum versions reached.
                    if ($versionCount >= $max_versions) {
                        break;
                    }                    
                    $output .= "<h4>" . htmlspecialchars($version) . $versionDate . "</h4><ul>";
                    foreach ($items as $item) {
                        $output .= "<li>" . htmlspecialchars($item) . "</li>";
                    }
                    $output .= "</ul>";
                    $versionCount++;
                }
                // Start a new version block.
                $version = $matches[1];
                $versionDate = $matches[2] ? (" - " . date("j F, Y",strtotime($matches[2]))) : "";
                $items = [];
            }
            // Check if the line is a changelog bullet (starts with a dash).
            elseif (preg_match('/^-+\s*(.+)$/', $line, $matches)) {
                $items[] = $matches[1];
            }
        }

        // Output any remaining version block if not exceeding max_versions.
        if ($version !== "" && !empty($items) && $versionCount < $max_versions) {
            $date = date("j F, Y");
            $output .= "<h4>" . htmlspecialchars($version) . " - " . $date . "</h4><ul>";
            foreach ($items as $item) {
                $output .= "<li>" . htmlspecialchars($item) . "</li>";
            }
            $output .= "</ul>";
        }

        // Append a link to the full changelog.
        $output .= "<p>Full changelog: <a href='" . htmlspecialchars($fullChangelogLink) . "'>" . $fullChangelogLink . "</a></p>";
        return $output;
    }

    public function convertDocs() {
        $files = glob($this->docsFolder . '/*.vue');        
        $pro_files = array("CloudflareSettingsDoc.vue","CodeInsertionDoc.vue","CssStatsDoc.vue","DashboardDoc.vue","FindReplaceDoc.vue");
        //Remove pro from files
        foreach($files as $key => $file) {
            if(in_array(basename($file), $pro_files)) {
                unset($files[$key]);
            }
        }
        $order = array("CacheSettingsDoc","CssSettingsDoc","JavascriptSettingsDoc","ImageSettingsDoc","FontSettingsDoc","ExternalScriptsDoc","BloatSettingsDoc");
        //Reorder files to follow the order set in $order
        usort($files, function ($a, $b) use ($order) {
            $aName = pathinfo($a, PATHINFO_FILENAME);
            $bName = pathinfo($b, PATHINFO_FILENAME);

            return array_search($aName, $order) <=> array_search($bName, $order);
        });        

        //Get Docs
        foreach ($files as $file) {
            $content = file_get_contents($file);
            $content = self::removePro($content);
            $markdownDocs[basename($file, '.vue')] = self::convertVueToMarkdown($content);
            $faqDocs[basename($file, '.vue')] = self::convertVueToHTML($content);
        }

        //No Dashboard
        unset($markdownDocs['DashboardDoc']);
        unset($faqDocs['DashboardDoc']);

        $markdown = '<img src="assets/speedify_banner.jpg" alt="SpeedifyPress">' . "\n\n";
        $markdown .= '# SpeedifyPress - Real-World WP Speed, Engineered for Pros' . "\n\n";
        $markdown .= "SpeedifyPress is a performance optimization toolkit for WordPress, built for developers and agencies who need real-world speed and precision control. Combining advanced techniques with practical configurability, SpeedifyPress goes beyond typical plugins to deliver fast, scalable, and reliable results — all without compromising compatibility or flexibility. From smart unused CSS handling to Cloudflare-ready caching, it's your personal speed stack, engineered for you." . "\n\n";
        $markdown .= '<img src="https://speedifypress.com/wp-content/uploads/2026/01/speedifypress_screen_2.jpg" alt="SpeedifyPress Dashboard" />' . "\n\n";

        $markdown .= "# 🔑 Key Capabilities

### Community Edition (this repository)

- **Unused CSS Handling (Done Right)**  
  Smart removal of unused CSS with a custom approach that avoids common pitfalls of other solutions.

- **Advanced Page Caching**  
  Cache pages with full support for language/currency plugins

- **JavaScript Delay**  
  Delay JavaScript for better performance — with fine-tuned control for real-world use cases. You'll get this working for all sites. 

- **Local Google Analytics (gtag.js)**  
  Serve Google Analytics locally for faster load times and better privacy.

- **Image Lazyloading + Preload**  
  Lazyload images with a custom preloader and automatically preload your LCP image for faster perceived load.

- **HTML Lazyloading**  
  Defer rendering of below-the-fold HTML for a faster initial paint.
  
- **Expert Font Loading**  
  Automatically preload the right fonts and fall back to fast system fonts on mobile where appropriate.

- **Remove Bloar**  
  Quick and easy removal of all of WordPress' mostly bloaty features

### Pro Edition ([https://speedifypress.com/go-pro](https://speedifypress.com/go-pro))

- **Cloudflare Integration**  
  Use a custom Cloudflare Worker for intelligent, edge-level caching — with an easy way to clear the cache.

- **Cache All of WooCommerce**  
  Cache WooCommerce without worrying about nonces and hardcoded user info. Even works on the cart and checkout pages. 

- **Cache Logged In Users**  
  The cache works even for logged in users with dynamic information on the page. Yes, really. 

- **HTML Find/Replace**  
  Modify your site's HTML on-the-fly with advanced find/replace rules — ideal for agency or power users.  


" . "\n";

        $markdown_pro = "# 🔑 Key Capabilities

- **Unused CSS Handling (Done Right)**  
  Smart removal of unused CSS with a custom approach that avoids common pitfalls of other solutions.

- **Advanced Page Caching**  
  Cache pages with full support for language/currency plugins, background processing, and seamless Cloudflare integration.

- **Cache All of WooCommerce**  
  Cache WooCommerce without worrying about nonces and hardcoded user info. Even works on the cart and checkout pages. 

- **Cache Logged In Users**  
  The cache works even for logged in users with dynamic information on the page. Yes, really. 

- **JavaScript Delay**  
  Delay JavaScript for better performance — with fine-tuned control for real-world use cases. You'll get this working for all sites. 

- **Local Google Analytics (gtag.js)**  
  Serve Google Analytics locally for faster load times and better privacy.

- **Image Lazyloading + Preload**  
  Lazyload images with a custom preloader and automatically preload your LCP image for faster perceived load.

- **HTML Lazyloading**  
  Defer rendering of below-the-fold HTML for a faster initial paint.

- **HTML Find/Replace**  
  Modify your site's HTML on-the-fly with advanced find/replace rules — ideal for agency or power users.

- **Cloudflare Worker Script**  
  Use a custom Cloudflare Worker for intelligent, edge-level caching — with an easy way to clear the cache.

- **Expert Font Loading**  
  Automatically preload the right fonts and fall back to fast system fonts on mobile where appropriate.
" . "\n";

        $markdown .= "## ⚡ Quick Start

1. **Download SpeedifyPress**  
   Simply download the zip from this repository or from [https://speedifypress.com/license/free/](https://speedifypress.com/license/free/)

2. **Install the Plugin on Your WordPress Site**  
   - Log in to your WordPress dashboard  
   - Go to **Plugins → Add New → Upload Plugin**  
   - Upload the `.zip` file and click **Install Now**  
   - Activate the plugin

3. **Access the Dashboard and Register**  
   Once the installation is finished, click \"I need a license\" in the Dashboard. For single sites, we'll email you a free license. 

4. **Subscribe to the Newsletter**  
   Subscribe for free at the [Adventures in WordPressing Substack](https://adventuresinwordpressing.substack.com/p/speedifypress) to find out how we're using the plugin on real sites. 

5. **Enjoy the Speed**  
   Your site is now equipped with professional-grade optimization tools — faster load times, improved performance scores, and happier users.
";      

$markdown .= "## 📝 Documentation & Support

Full documentation and support info is available [here](https://github.com/SpeedifyPress/SpeedifyPress/blob/main/SUPPORT.md).
";


$markdown .= "## 📸 Screenshots

  <p>
    <a href='https://speedifypress.com/go-pro' target='_blank'>
        <img src='https://speedifypress.com/wp-content/uploads/2026/01/speedifypress_screen_2.jpg' alt='SpeedifyPress Cache Settings' />    
    </a>
  </p>
  <p>
    <a href='https://speedifypress.com/go-pro' target='_blank'>
        <img src='https://speedifypress.com/wp-content/uploads/2026/01/speedifypress_screen_3.jpg' alt='SpeedifyPress CSS Settings' />
    </a>
  </p>
  <p>
    <a href='https://speedifypress.com/go-pro' target='_blank'>
        <img src='https://speedifypress.com/wp-content/uploads/2026/01/speedifypress_screen_4.jpg' alt='SpeedifyPress JavaScript Settings' />
    </a>
  </p>
  <p>
    <a href='https://speedifypress.com/go-pro' target='_blank'>    
        <img src='https://speedifypress.com/wp-content/uploads/2026/01/speedifypress_screen_5.jpg' alt='SpeedifyPress Image Settings' />
    </a>
  </p>
  <p>
    <a href='https://speedifypress.com/go-pro' target='_blank'>    
        <img src='https://speedifypress.com/wp-content/uploads/2026/01/speedifypress_screen_6.jpg' alt='SpeedifyPress Bloat Settings' />
    </a>
  </p>
  
";

        $markdown .= "## 📝 License

SpeedifyPress is licensed under the **GNU General Public License v3.0 or later (GPL)**.  
You are free to use, study, modify, and redistribute the source code under the terms of the GPL.

### Community Edition

The code is GPL licensed. You are free to modify it as you like. However, we would like to be able to contact you with essential version and security information. We therefore lock
plugin activaton behind a free subscription, requiring an email address. This gives you:

- Access to all the plugin features except:
  - The Cloudflare integration
  - Logged in cache with area exclusions (cache every page, for everyone)
  - WooCommerce caching (easily cache shop and product pages)
  - Advanced HTML Find/Replace
  - Code Insertion
- A single site license

Of course, you're free to modify the code if you'd prefer not to use a subscription.

### Pro Edition

A paid subscription unlocks:

- Access to all the plugin features including the Cloudflare integration and logged-in caching
- An unlimited site license
- Personal installation and configuration support  
- Find out more at [https://speedifypress.com/go-pro](https://speedifypress.com/go-pro)

> ⚠️ While the GPL allows code redistribution and modification, unlocking features requires a valid subscription.  
> The locking mechanism is designed to encourage support and continued development, but it does not restrict your legal rights under the GPL.
";

        //Set Support
        $support = "";
        $support .= '# 📚 Support ' . "\n\n";
        $support .= 'The community version of SpeedifyPress comes with no support, but plenty of docs. If you need help and would like to talk to an expert, then see our paid version at [https://speedifypress.com/devs-and-agencies/](https://speedifypress.com/devs-and-agencies/). Otherwise, you can dive into the docs below.' . "\n\n";
        $support .= '# 📚 Documentation ' . "\n\n";

        $support .= '## Table of Contents' . "\n\n";

        foreach ($markdownDocs as $key => $value) {
            $key = str_replace("Css","CSS",ucwords(preg_replace('/(?<!\ )[A-Z]/', ' $0', str_replace("Doc","",$key))));
            
            // strip markdown hashes so we only slug the visible heading text
            $key_for_link = self::get_key_for_link($key);
            $support .= "- [" . $key . "](#".$key_for_link.")\n";

            //Get innner links that start with ##
            $value = preg_replace("@#### ([^\n]+)@","*$1*",$value);
            $inner_links = preg_match_all('@[#]{2} ([^\n]+)@', $value, $matches);
            foreach($matches[1] as $link) {
                $key_for_link = self::get_key_for_link($link);
                $support .= "   - [" . $link . "](#".$key_for_link.")\n";
            }

        }

        foreach ($markdownDocs as $key => $value) {
            $support .= "## " . str_replace("Css","CSS",ucwords(preg_replace('/(?<!\ )[A-Z]/', ' $0', str_replace("Doc","",$key)))) . "\n\n";
            $value = preg_replace("@#### ([^\n]+)@","*$1*",$value);
            //$value = preg_replace("@### ([^\n]+)@","**$1**",$value);
            //$value = str_replace("####","       - ",$value);
            //$value = str_replace("###","    - ",$value);
            $support .= $value . "\n";
        }

        //Set FAQ
        $faq = "";
        foreach ($faqDocs as $key => $value) {
            $faq .= "<h3>How to use the " . str_replace("Css","CSS",ucwords(preg_replace('/(?<!\ )[A-Z]/', ' $0', str_replace("Doc","",$key)))) . "?</h3>\n\n";
            // Strip HTML <img> tags
            $value = preg_replace('/<img[^>]*>/i', '', $value);
            $faq .= $value . "\n";
        }      

        return array("markdown" => $markdown, "support"=> $support, "faq" => $faq);

    }

    public static function get_key_for_link($link) {

        $anchor = trim(preg_replace('/^#+\s*/', '', $link));
        $anchor = trim($anchor);
        $key_for_link = strtolower($anchor);
        $key_for_link = preg_replace('/[^a-z0-9\s-]/', '', $key_for_link);
        $key_for_link = preg_replace('/\s+/', '-', $key_for_link);
        $key_for_link = preg_replace('/-+/', '-', $key_for_link);
        $key_for_link = trim($key_for_link, '-');

        return $key_for_link;

    }


    public static function removePro($content) {

        //Remove any elements with the "pro" class 
        //from the content
        $content = preg_replace('/<span class="pro">.*?<\/span>/s', "\n\n", $content);

        return $content;


    }

    /**
     * Converts Vue files with HTML content into Pure HTML
     *
     * @param string $content The Vue file content.
     * @return string Converted HTML.
     */
    public static function convertVueToHTML(string $content): string {

        // Ensure UTF-8 encoding
        $content = mb_convert_encoding($content, 'UTF-8', 'UTF-8');
    
        // Extract the <template> content
        preg_match('/<template>(.*?)<\/template>/s', $content, $matches);
        if (!isset($matches[1])) {
            return '';
        }
        $html = $matches[1];
    
        // Suppress errors due to malformed HTML
        libxml_use_internal_errors(true);
    
        $dom = new DOMDocument();
        $dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
    
        $xpath = new DOMXPath($dom);
    
        // Remove all elements with a class attribute
        foreach ($xpath->query('//*[@class]') as $node) {
            $node->removeAttribute('class');
        }
    
        // Remove all <svg> elements
        foreach ($xpath->query('//svg') as $node) {
            $node->parentNode->removeChild($node);
        }
    
        // Replace <h5> and <h6> tags with <h4> correctly
        foreach (['h5', 'h6'] as $headingTag) {
            $nodes = $dom->getElementsByTagName($headingTag);
            $nodesArray = iterator_to_array($nodes); // Convert NodeList to array to avoid live node issues
    
            foreach ($nodesArray as $node) {
                $newNode = $dom->createElement('h4');
    
                // Move all child nodes to the new <h4> (preserves inline elements)
                while ($node->firstChild) {
                    $newNode->appendChild($node->firstChild);
                }
    
                // Replace the old node with the new <h4>
                $node->parentNode->replaceChild($newNode, $node);
            }
        }
    
        // Get cleaned HTML
        $cleanHtml = $dom->saveHTML();
    
        // Remove all line breaks (\r, \n)
        $cleanHtml = str_replace(["\r", "\n"], '', $cleanHtml);
    
        // Remove emojis and Unicode surrogate pairs
        $cleanHtml = preg_replace('/[\x{1F300}-\x{1F6FF}\x{1F900}-\x{1F9FF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}\x{2B50}-\x{2B55}]/u', '', $cleanHtml);
    
        // Remove HTML entity-encoded emojis (e.g., &#128194;, &#x1F4C2;)
        $cleanHtml = preg_replace('/&#[xX]?[0-9A-F]+;/', '', $cleanHtml);
    
        return trim($cleanHtml);
    }
    
    
    

    /**
     * Converts Vue files with HTML content into Markdown format.
     *
     * @param string $content The Vue file content.
     * @return string Converted Markdown.
     */
    public static function convertVueToMarkdown(string $content): string {
        // Ensure the input is treated as UTF-8
        $content = mb_convert_encoding($content, 'UTF-8', 'UTF-8');
    
        // Extract the <template> content
        preg_match('/<template>(.*?)<\/template>/s', $content, $matches);
        if (!isset($matches[1])) {
            return '';
        }
        $html = $matches[1];
    
        // Convert HTML to entities to help preserve special characters
        $html = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
    
        // Load HTML into DOMDocument with proper UTF-8 header
        $dom = new DOMDocument('1.0', 'UTF-8');
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="UTF-8" ?>' . '<div>' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
    
        $markdown = "";
    
        // Loop over nodes and build Markdown
        foreach ($dom->getElementsByTagName('*') as $node) {
            // Decode HTML entities (including emojis and em-dashes) into UTF-8 characters
            $text = trim(html_entity_decode($node->textContent, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    
            if ($node->nodeName === 'h5') {
                $classAttr = $node->getAttribute('class');
                if (strpos($classAttr, 'text-base') !== false) {
                    $markdown .= "#### " . $text . "\n\n"; // Smaller heading
                } else {
                    $markdown .= "### " . $text . "\n\n"; // Larger heading
                }
            } elseif ($node->nodeName === 'p') {
                $text = self::convertInlineFormatting($node);
                if(trim($text) != "" && strlen(trim($text)) > 2) {
                    $markdown .= $text . "\n\n";
                }
            } elseif ($node->nodeName === 'ul') {
                foreach ($node->getElementsByTagName('li') as $li) {
                    $liText = self::convertInlineFormatting($li);
                    // Decode any remaining entities
                    $liText = html_entity_decode($liText, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $markdown .= "- " . $liText . "\n";
                }
                $markdown .= "\n";
            }
        }
    
        return trim($markdown);
    }
    
    /**
     * Convert inline HTML formatting (<strong>, <i>, <a>) into Markdown.
     */
    private static function convertInlineFormatting(DOMNode $node): string {
        $text = "";
        foreach ($node->childNodes as $child) {
            if ($child->nodeType === XML_TEXT_NODE) {
                $text .= html_entity_decode($child->textContent, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            } elseif ($child->nodeName === 'strong') {
                $text .= "**" . trim($child->textContent) . "**";
            } elseif ($child->nodeName === 'i') {
                $text .= "*" . trim($child->textContent) . "*";
            } elseif ($child->nodeName === 'a') {
                $href = $child->getAttribute('href');
                $text .= "[" . trim($child->textContent) . "](" . $href . ")";
            } else {
                $text .= $child->textContent;
            }
        }
        return trim($text);
    }
    

    /**
     * Builds the release object by reading various files and updating properties.
     *
     * This method performs the following:
     * - Loads the source release JSON.
     * - Updates the release version from the plugin file.
     * - Includes WordPress version information.
     * - Converts the Markdown changelog to HTML.
     */
    public function buildRelease() {

        // Load the release source JSON.
        $json = file_get_contents($this->sourceReleaseFile);
        $this->release = json_decode($json);

        // Get plugin version data and update the release version.
        $pluginData = self::getFileData($this->pluginVersionFile, array('Version' => 'Version'));
        $this->release->version = $pluginData['Version'];
        if ( getenv( 'SPRESS_PLAIN_VERSION_OUTPUT' ) ) {
            echo  "Version: " . str_replace("-pro","",$this->release->version) . "\n";
        } else {
            echo  "Version: " . $this->release->version . "\n";
        }
        $this->release->version = str_replace("-pro","",$this->release->version);

        // Include the WordPress version file (defines $wp_version and $required_php_version).
        require_once($this->wordpressVersionFile);
        $this->release->tested = $wp_version;
        $this->release->requires_php = $required_php_version;

        // Load and convert the changelog to HTML.
        $changelogContent = file_get_contents($this->changelogFile);
        // Ensure that the release object has a 'sections' property.
        if (!isset($this->release->sections) || !is_object($this->release->sections)) {
            $this->release->sections = new stdClass();
        }
        $this->release->sections->changelog = self::convertChangelog($changelogContent, 10);

        //Load and convert the docs to the readme
        $docs = $this->convertDocs();        
        file_put_contents(dirname(__FILE__) . '/../README.md', $docs['markdown']);
        file_put_contents(dirname(__FILE__) . '/../SUPPORT.md', $docs['support']);
        $this->release->sections->faq = $docs['faq'];



    }

    /**
     * Saves the updated release object back to the target release JSON file.
     *
     * The JSON output is pretty formatted for readability.
     */
    public function saveRelease() {
        $newRelease = json_encode($this->release, JSON_PRETTY_PRINT);
        file_put_contents($this->targetReleaseFile, $newRelease);
    }
}

// Build release file
$sourceReleaseFile    = "release.json"; // Read from the current directory.
$targetReleaseFile    = dirname(__FILE__) . '/../release.json'; // Write to one level up.
$pluginVersionFile    = dirname(__FILE__) . '/../speedify_press.php';
$wordpressVersionFile = dirname(__FILE__) . '/../../../../wp-includes/version.php';
$changelogFile        = dirname(__FILE__) . '/../CHANGELOG.md';
$docsFolder           = dirname(__FILE__) . '/src/components/docs';

// Instantiate the ReleaseManager.
$releaseManager = new ReleaseManager($sourceReleaseFile, $targetReleaseFile, $pluginVersionFile, $wordpressVersionFile, $changelogFile, $docsFolder);
// Build and save the release.
$releaseManager->buildRelease();
$releaseManager->saveRelease();
?>
