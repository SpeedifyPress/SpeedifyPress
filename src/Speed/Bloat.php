<?php

namespace SPRESS\Speed;

use SPRESS\App\Config;

/**
 * This `Bloat` class is responsible for
 * removing bloat from the frontend and the
 * admin interface 
 * 
 * @package SPRESS
 */
class Bloat {

	protected static $config = array();

	protected static $emojis = 'false';
	protected static $jquery_migrate = 'false';
	protected static $rss_feeds = 'false';
	protected static $oembed = 'false';
	protected static $heartbeat = 'false';

	protected static $autosave = 'false';
	protected static $post_revisions = 'false';
	protected static $block_editor = 'false';

	protected static $xmlrpc = 'false';
	protected static $attachment_pages = 'false';
	protected static $wp_sitemaps = 'false';

	protected static $comments = 'false';
	protected static $pingbacks_trackbacks = 'false';

	protected static $woocommerce_cart_fragments = 'false';

	/**
	 * Initializes the bloat reduction features 
     * based on config settings.
	 * 
	 * @return void
	 */
	public static function init() {

		$config = Config::get('bloat');
		self::$config = is_array($config) ? $config : array();

		foreach (self::$config as $key => $value) {
			if (isset($value['value']) && property_exists(__CLASS__, $key)) {
				self::$$key = $value['value'];
			}
		}

		// Core Frontend
		if (self::enabled('emojis')) {
			self::disable_emojis();
		}

		if (self::enabled('jquery_migrate')) {
			self::disable_jquery_migrate();
		}

		if (self::enabled('rss_feeds')) {
			self::disable_feeds();
		}

		if (self::enabled('oembed')) {
			self::disable_oembed();
		}

		if (self::enabled('heartbeat')) {
			self::limit_heartbeat();
		}

		// Admin Interface
		if (self::enabled('autosave')) {
			self::limit_autosave();
		}

		if (self::enabled('post_revisions')) {
			self::limit_revisions();
		}

		if (self::enabled('block_editor')) {
			self::disable_block_editor();
		}

		// Media
		if (self::enabled('xmlrpc')) {
			self::disable_xmlrpc();
		}

		if (self::enabled('attachment_pages')) {
			self::disable_attachment_pages();
		}

		if (self::enabled('wp_sitemaps')) {
			self::disable_wp_sitemaps();
		}

		// Discussion
		if (self::enabled('comments')) {
			self::disable_comments();
		}

		if (self::enabled('pingbacks_trackbacks')) {
			self::disable_pingbacks_trackbacks();
		}

		// WooCommerce
		if (self::enabled('woocommerce_cart_fragments')) {
			self::disable_woo_cart_fragments();
		}

	}

	/**
	 * Check if a given key is enabled in the bloat config.
	 * 
	 * @param string $key the key to check
	 * @return bool true if the key is enabled, false otherwise
	 */
	protected static function enabled($key) {
		if (!property_exists(__CLASS__, $key)) return false;
		return self::$$key === 'true';
	}

    /**
     * Disable WordPress emoji support.
     *
     * Removes the following actions:
     * - `wp_head`: `print_emoji_detection_script`
     * - `admin_print_scripts`: `print_emoji_detection_script`
     * - `wp_print_styles`: `print_emoji_styles`
     * - `admin_print_styles`: `print_emoji_styles`
     *
     * Removes the following filters:
     * - `the_content_feed`: `wp_staticize_emoji`
     * - `comment_text_rss`: `wp_staticize_emoji`
     * - `wp_mail`: `wp_staticize_emoji_for_email`
     *
     * Adds a filter to `tiny_mce_plugins` to remove `wpemoji` from the list of plugins.
     */
	protected static function disable_emojis() {
		remove_action('wp_head', 'print_emoji_detection_script', 7);
		remove_action('admin_print_scripts', 'print_emoji_detection_script');
		remove_action('wp_print_styles', 'print_emoji_styles');
		remove_action('admin_print_styles', 'print_emoji_styles');
		remove_filter('the_content_feed', 'wp_staticize_emoji');
		remove_filter('comment_text_rss', 'wp_staticize_emoji');
		remove_filter('wp_mail', 'wp_staticize_emoji_for_email');

		add_filter('tiny_mce_plugins', function ($plugins) {
			if (is_array($plugins)) {
				return array_diff($plugins, array('wpemoji'));
			}
			return array();
		});
	}

	/**
	 * Disable jQuery migrate on frontend.
	 *
	 * This function removes the 'jquery-migrate' dependency from the frontend jQuery
	 * script, which is required for backwards compatibility with older browsers.
	 *
	 * @return void
	 */
	protected static function disable_jquery_migrate() {
		add_filter('wp_default_scripts', function ($scripts) {
			if (is_admin()) return;
			if (!isset($scripts->registered['jquery'])) return;

			$deps = $scripts->registered['jquery']->deps;
			$scripts->registered['jquery']->deps = array_diff($deps, array('jquery-migrate'));
		});
	}

    /**
     * Disable all feeds on the frontend.
     *
     * This function removes all feed links from the frontend, including RSS, Atom, and RDF
     * feeds. It also kills the request with a 404 error if the user tries to access a feed
     * directly.
     *
     * @return void
     */
	protected static function disable_feeds() {
		remove_action('wp_head', 'feed_links', 2);
		remove_action('wp_head', 'feed_links_extra', 3);

		$kill = function () {
			status_header(404);
			nocache_headers();
			header('Content-Type: text/plain; charset=utf-8', true);
			echo 'Not Found';
			exit;
		};

		add_action('do_feed', $kill, 1);
		add_action('do_feed_rdf', $kill, 1);
		add_action('do_feed_rss', $kill, 1);
		add_action('do_feed_rss2', $kill, 1);
		add_action('do_feed_atom', $kill, 1);
		add_action('do_feed_rss2_comments', $kill, 1);
		add_action('do_feed_atom_comments', $kill, 1);
	}

	/**
	 * Disable oEmbed functionality on the frontend.
	 *
	 * This function removes the oEmbed functionality from the frontend, including the discovery links,
	 * the JavaScript file, and the autoembedding filter.
	 *
	 * @return void
	 */
	protected static function disable_oembed() {
		remove_action('wp_head', 'wp_oembed_add_discovery_links');
		remove_action('wp_head', 'wp_oembed_add_host_js');
		remove_filter('the_content', array($GLOBALS['wp_embed'], 'autoembed'), 8);
		remove_filter('widget_text_content', array($GLOBALS['wp_embed'], 'autoembed'), 8);

		add_filter('embed_oembed_discover', '__return_false');

		add_action('init', function () {
			remove_action('rest_api_init', 'wp_oembed_register_route');
			add_filter('oembed_dataparse', '__return_false', 10);
			remove_filter('pre_oembed_result', 'wp_filter_pre_oembed_result', 10);
		}, 20);

		add_filter('rewrite_rules_array', function ($rules) {
			if (isset($rules['embed=true$'])) {
				unset($rules['embed=true$']);
			}
			foreach ($rules as $rule => $rewrite) {
				if (strpos($rewrite, 'embed=true') !== false) {
					unset($rules[$rule]);
				}
			}
			return $rules;
		});
	}

    /**
     * Disable the WordPress heartbeat functionality.
     *
     * WordPress heartbeat is a feature that allows the admin dashboard to update in real-time
     * without the need for a full page reload.  However, it can be a source of performance
     * problems in some situations, such as having multiple tabs open.  Disabling it can help
     * alleviate those problems.
     *
     * This function limits the WordPress heartbeat by setting the heartbeat interval to 60
     * seconds.  You can customize this value by overriding the 'heartbeat_settings' filter.
     *
     * @return void
     */
	protected static function limit_heartbeat() {
		add_filter('heartbeat_settings', function ($settings) {
			$settings['interval'] = 60;
			return $settings;
		});
	}

	/**
	 * Limit the autosave interval to 5 minutes.
	 *
	 * Autosave is a feature that periodically saves a revision of a post or page.  This
	 * can be useful for some users, but it can also cause unnecessary database writes.
	 * By limiting the autosave interval, we can reduce the number of database writes and
	 * improve performance.
	 *
	 * @return void
	 */
	protected static function limit_autosave() {
		add_filter('autosave_interval', function () {
			return 300;
		});
	}

	/**
	 * Limits the number of revisions to keep for each post to 3.
	 *
	 * This function limits the number of revisions to keep for each post to 3.  By default,
	 * WordPress will keep an unlimited number of revisions for each post, which can
	 * lead to unnecessary database bloat.  By limiting the number of revisions to
	 * keep, we can reduce the amount of database space used and improve performance.
	 *
	 * @return void
	 */
	protected static function limit_revisions() {
		add_filter('wp_revisions_to_keep', function ($num, $post) {
			return 3;
		}, 10, 2);
	}

	/**
	 * Disables the block editor for all posts and post types.
	 *
	 * The block editor is a feature that allows users to edit the content of a post
	 * using a drag-and-drop interface.  While this feature can be useful for some
	 * users, it can also cause unnecessary database writes and can slow down the
	 * performance of a site.  By disabling the block editor, we can reduce the number
	 * of database writes and improve performance.
	 *
	 * @return void
	 */
	protected static function disable_block_editor() {
		add_filter('use_block_editor_for_post_type', '__return_false', 100);
		add_filter('use_block_editor_for_post', '__return_false', 100);
	}

	/**
	 * Disables XML-RPC for the entire site.
	 *
	 * XML-RPC is a feature that allows external applications to interact with
	 * WordPress.  While this feature can be useful for some users, it can also
	 * pose a security risk if not properly secured.  By disabling XML-RPC, we can
	 * reduce the attack surface of a site and improve security.
	 *
	 * @return void
	 */
	protected static function disable_xmlrpc() {
	    
    	add_action('init', function () {
    		if (defined('XMLRPC_REQUEST') && XMLRPC_REQUEST) {
    			status_header(403);
    			nocache_headers();
    			exit('XML-RPC is disabled.');
    		}
    	}, 0);	  

		add_filter('xmlrpc_enabled', '__return_false');
		add_filter('xmlrpc_methods', function ($methods) {
			return array();
		});

        //A couple of bonuses
        remove_action('wp_head', 'rsd_link');
        remove_action('wp_head', 'wlwmanifest_link');

	}

	/**
	 * Disables attachment pages.
	 *
	 * Attachment pages are pages that show the full image of an attachment.  While
	 * these pages can be useful for some users, they can also cause unnecessary
	 * database writes and can slow down the performance of a site.  By disabling
	 * attachment pages, we can reduce the number of database writes and improve
	 * performance.
	 *
	 * This function disables attachment pages by redirecting users to the full image
	 * URL of the attachment if they try to access the attachment page.
	 *
	 * @return void
	 */
	protected static function disable_attachment_pages() {
		add_action('template_redirect', function () {
			if (!is_attachment()) return;

			$url = wp_get_attachment_url(get_queried_object_id());
			if ($url) {
				wp_redirect($url, 301);
				exit;
			}
		});
	}

	/**
	 * Disables WordPress sitemaps.
	 *
	 * WordPress sitemaps is a feature that allows search engines to crawl and index
	 * the content of a site more efficiently.  While this feature can be useful for
	 * some sites, it can also cause unnecessary database writes and can slow down
	 * the performance of a site.  By disabling WordPress sitemaps, we can reduce
	 * the number of database writes and improve performance.
	 *
	 * This function disables WordPress sitemaps by adding a filter to the
	 * `wp_sitemaps_enabled` filter.
	 *
	 * @return void
	 */
	protected static function disable_wp_sitemaps() {
		add_filter('wp_sitemaps_enabled', '__return_false');
	}

	/**
	 * Disables comments on all post types.
	 *
	 * This function disables comments on all post types by removing post type support
	 * for comments and trackbacks. It also filters comments_open and pings_open to
	 * return false, and filters comments_array to return an empty array. Finally,
	 * it removes the comments menu page from the admin menu and redirects users to the
	 * dashboard if they try to access the comments page.
	 *
	 * @return void
	 */
	protected static function disable_comments() {
		add_action('init', function () {
			foreach (get_post_types() as $post_type) {
				if (post_type_supports($post_type, 'comments')) {
					remove_post_type_support($post_type, 'comments');
				}
			}
		}, 100);

		add_filter('comments_open', '__return_false', 20, 2);
		add_filter('comments_array', '__return_empty_array', 10, 2);

		add_action('admin_menu', function () {
			remove_menu_page('edit-comments.php');
		});

		add_action('admin_init', function () {
			if (is_admin() && isset($GLOBALS['pagenow']) && $GLOBALS['pagenow'] === 'edit-comments.php') {
				wp_redirect(admin_url());
				exit;
			}
		});
	}

	/**
	 * Disables pingbacks and trackbacks.
	 *
	 * Pingbacks and trackbacks are features that allow external applications to
	 * interact with WordPress.  While these features can be useful for some users,
	 * they can also pose a security risk if not properly secured.  By disabling
	 * pingbacks and trackbacks, we can reduce the attack surface of a site and
	 * improve security.
	 *
	 * This function disables pingbacks and trackbacks by filtering `pings_open` to
	 * return false and filtering `pre_ping` to return an empty array. It also removes
	 * the `do_all_pings` action from the `init` action hook.
	 *
	 * @return void
	 */
	protected static function disable_pingbacks_trackbacks() {

        add_action('init', function () {
            foreach (get_post_types() as $post_type) {
                if (post_type_supports($post_type, 'trackbacks')) {
                    remove_post_type_support($post_type, 'trackbacks');
                }
            }
        }, 100);

        add_filter('pings_open', '__return_false', 20, 2);
        add_filter('pre_ping', function (&$links) { $links = array(); });

        remove_action('wp_head', 'rsd_link');
        remove_action('wp_head', 'wlwmanifest_link');
        remove_action('wp_head', 'pingback_link');

        add_filter('wp_headers', function ($headers) {
            if (isset($headers['X-Pingback'])) unset($headers['X-Pingback']);
            return $headers;
        }, 100);

        add_action('init', function () {
            remove_action('do_pings', 'do_all_pings', 10);
        }, 20);


	}

	/**
	 * Disable WooCommerce cart fragments. By disabling cart fragments, we can
	 * improve performance by reducing the number of queries made to the database.
	 *
	 * @return void
	 */
	protected static function disable_woo_cart_fragments() {
		add_action('wp_enqueue_scripts', function () {
			if (function_exists('is_woocommerce')) {
				wp_dequeue_script('wc-cart-fragments');
				wp_deregister_script('wc-cart-fragments');
			}
		}, 100);
	}

}