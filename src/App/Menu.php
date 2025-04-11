<?php

namespace SPRESS\App;

use SPRESS\Auth;

/**
 * This class handles adding the SPRESS plugin's admin menu
 * and injecting JavaScript and CSS required for the admin page. 
 * It also renders the display content for the SPRESS plugin. 
 *
 * @package SPRESS
 */
class Menu {
    
    /**
     * @var string Base64-encoded SVG icon used for the admin menu icon.
     */
    public static $menu_icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNDEwLjg0N3B4IiBoZWlnaHQ9IjUxMC43MTlweCIgdmlld0JveD0iLTY5OC4wMDEgODcwLjE5OCA0MTAuODQ3IDUxMC43MTkiDQoJIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTY5OC4wMDEgODcwLjE5OCA0MTAuODQ3IDUxMC43MTkiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iI0NDQ0NDQyIgZD0iTS00ODguNjY2LDExOTYuMTc0YzQuMjE5LTQuNzI5LDguNTY3LTkuODk0LDEzLjA1Mi0xNS40OWM0LjQ3OS01LjU5MSw5LjAxMy0xMS4yNDksMTMuNi0xNi45NzQNCgljMy45NTctNC45MzksNy44NjUtOS44MTYsMTEuNzI0LTE0LjYzM2MzLjg1NC00LjgxMSw3LjU1Mi05LjQyNiwxMS4wOTgtMTMuODUzYzMuNzUyLTQuNjgzLDUuMS05LjY4OCw0LjAzMy0xNS4wMjkNCgljLTEuMDYxLTUuMzM1LTMuNTQ2LTkuNTY3LTcuNDQ4LTEyLjY5NGMtMC41MTktMC40MTUtMC44NDEtMC42NzQtMC45NzYtMC43ODFjLTAuMTI4LTAuMTAzLTAuMzIzLTAuMjU5LTAuNTg1LTAuNDY5DQoJYy00LjYzLTMuMjc5LTkuMzE4LTQuMzYzLTE0LjA1My0zLjI1MWMtNC43NCwxLjExNy05LjUwNSw0LjY2Ny0xNC4yOTgsMTAuNjQ4Yy0yMC4wMDgsMjQuOTczLTQ0LjU4MiwzOS4zNTEtNzMuNzIyLDQzLjEyMg0KCWMtMjkuMTQ1LDMuNzc4LTU1LjA1Ni0zLjQyNy03Ny43NDMtMjEuNjA0Yy0wLjUyNC0wLjQyLTEuMDQyLTAuODM2LTEuNTY3LTEuMjU2Yy0wLjUxOC0wLjQxNS0xLjA0Mi0wLjgzNS0xLjU2Ny0xLjI1NQ0KCWMtMjAuODA4LTE4LjM3My0zMi4xNjYtNDEuNDY5LTM0LjA4NC02OS4yNzNjLTEuOTEyLTI3LjgwMSw1Ljc3Mi01Mi40OTcsMjMuMDc0LTc0LjA5M2M2LjY2OC04LjMyMiwxMy44MDUtMTcuMjMsMjEuNDE2LTI2LjcyOQ0KCWM3LjYwNi05LjQ5MywxNS4yNjUtMTkuMDU0LDIyLjk3OS0yOC42ODFjNS44MS03LjI1MSwyMS45OTQtMjcuNDUsNDMuMDExLTUzLjY4M2gtNDYuNDNoLTQwLjg0N2MtMjcuNjE0LDAtNTAsMjIuMzg2LTUwLDUwdjM5MC43MTkNCgljMCwyNy42MTQsMjIuMzg2LDUwLDUwLDUwaDkuMTQ2YzU2LjgwOS03MC43NTEsMTE4Ljk0OC0xNDguMjMxLDEyMS41ODctMTUxLjUyNQ0KCUMtNTAyLjM3MywxMjEzLjI4Mi00OTYuMTY5LDEyMDUuNTM5LTQ4OC42NjYsMTE5Ni4xNzR6Ii8+DQo8cGF0aCBmaWxsPSIjQ0NDQ0NDIiBkPSJNLTI5Ny4xNTQsMTA4MC4xOThjMC05Mi43NjItNjMuMTU2LTE3MC43NjMtMTQ4LjgxMS0xOTMuMzc3Yy0yOS4zNzYsMzYuNzc2LTU3LjEwNiw3MS40NDEtNTkuMzk2LDc0LjI5OQ0KCWMtNS4wMDIsNi4yNDMtMTEuMzgzLDEzLjk0NS0xOS4xNDgsMjMuMWMtMy45NjEsNC45NDQtOC4xMjgsMTAuMTQ2LTEyLjUwNSwxNS42MDhzLTguNzU0LDEwLjkyNi0xMy4xMywxNi4zODkNCgljLTMuOTYyLDQuOTQ0LTcuOTIzLDkuODg5LTExLjg4LDE0LjgyN2MtMy45NjEsNC45NDUtNy43MTMsOS42MjgtMTEuMjU1LDE0LjA0OGMtMi45MjEsMy42NDYtNC41MzYsNy43OTgtNC44NTEsMTIuNDUxDQoJYy0wLjMxMyw0LjY2MywxLjQwMSw4LjkxOSw1LjE0MywxMi43N2MwLjM1OCwwLjI4NiwwLjY5MSwwLjU1NCwwLjk3OCwwLjc4M2MwLjM5LDAuMzEzLDAuNzE5LDAuNTc2LDAuOTc2LDAuNzgxDQoJYzUuNDYzLDQuMzc3LDExLjE1MSw1LjQxMSwxNy4wNiwzLjA5OGM1LjkxNS0yLjMxLDExLjIwOC01Ljg1NiwxNS44OTgtMTAuNjQ3YzEuMzAzLTEuMDg5LDIuNDIyLTIuMjI0LDMuMzYtMy4zOTUNCglzMS45MjUtMi40MDIsMi45Ny0zLjcwN2MxOS43OTktMjQuNzExLDQzLjIxMS0zOC43MzgsNzAuMjMxLTQyLjA3NnM1MS41NTksMy42MTksNzMuNjIxLDIwLjg2NA0KCWMyMi4wMSwxNi43ODQsMzQuNjMsMzkuMjc4LDM3Ljg2MSw2Ny40OTVjMy4yMzcsMjguMjIxLTMuNTQsNTMuMzM0LTIwLjMxOSw3NS4zMzljLTQuMTIxLDUuNjY4LTguNjE1LDExLjY3OC0xMy40ODMsMTguMDI4DQoJYy00Ljg3NCw2LjM0Ni05LjkxNywxMi43NzYtMTUuMTI0LDE5LjI3NmMtMS4yNTEsMS41NjEtMi41NTUsMy4xODgtMy45MDgsNC44NzdjLTEuMzU4LDEuNjk1LTIuNjU3LDMuMzE3LTMuOTA4LDQuODc4DQoJYy01LjYyNyw3LjAyMy0xMS4xMTcsMTMuNzM3LTE2LjQ1MiwyMC4xMzVjLTUuMzQ3LDYuMzk3LTkuOTk0LDEyLjA3My0xMy45NTEsMTcuMDEyYy0wLjQzNywwLjU0NS0zLjQwNCw0LjI0Ni04LjM0MSwxMC40MDENCglDLTM2MC4wOTEsMTI1MC42ODctMjk3LjE1NCwxMTcyLjc5OS0yOTcuMTU0LDEwODAuMTk4eiIvPg0KPC9zdmc+DQo=';

    /**
     * @var string Base64-encoded SVG icon used for the admin menu icon when we are on the SPRESS page
     */
    public static $menu_icon_selected = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNDEwLjg0N3B4IiBoZWlnaHQ9IjUxMC43MTlweCIgdmlld0JveD0iLTY5OC4wMDEgODcwLjE5OCA0MTAuODQ3IDUxMC43MTkiDQoJIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTY5OC4wMDEgODcwLjE5OCA0MTAuODQ3IDUxMC43MTkiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iI0NDQ0NDQyIgZD0iTS00ODguNjY2LDExOTYuMTc0YzQuMjE5LTQuNzI5LDguNTY3LTkuODk0LDEzLjA1Mi0xNS40OWM0LjQ3OS01LjU5MSw5LjAxMy0xMS4yNDksMTMuNi0xNi45NzQNCgljMy45NTctNC45MzksNy44NjUtOS44MTYsMTEuNzI0LTE0LjYzM2MzLjg1NC00LjgxMSw3LjU1Mi05LjQyNiwxMS4wOTgtMTMuODUzYzMuNzUyLTQuNjgzLDUuMS05LjY4OCw0LjAzMy0xNS4wMjkNCgljLTEuMDYxLTUuMzM1LTMuNTQ2LTkuNTY3LTcuNDQ4LTEyLjY5NGMtMC41MTktMC40MTUtMC44NDEtMC42NzQtMC45NzYtMC43ODFjLTAuMTI4LTAuMTAzLTAuMzIzLTAuMjU5LTAuNTg1LTAuNDY5DQoJYy00LjYzLTMuMjc5LTkuMzE4LTQuMzYzLTE0LjA1My0zLjI1MWMtNC43NCwxLjExNy05LjUwNSw0LjY2Ny0xNC4yOTgsMTAuNjQ4Yy0yMC4wMDgsMjQuOTczLTQ0LjU4MiwzOS4zNTEtNzMuNzIyLDQzLjEyMg0KCWMtMjkuMTQ1LDMuNzc4LTU1LjA1Ni0zLjQyNy03Ny43NDMtMjEuNjA0Yy0wLjUyNC0wLjQyLTEuMDQyLTAuODM2LTEuNTY3LTEuMjU2Yy0wLjUxOC0wLjQxNS0xLjA0Mi0wLjgzNS0xLjU2Ny0xLjI1NQ0KCWMtMjAuODA4LTE4LjM3My0zMi4xNjYtNDEuNDY5LTM0LjA4NC02OS4yNzNjLTEuOTEyLTI3LjgwMSw1Ljc3Mi01Mi40OTcsMjMuMDc0LTc0LjA5M2M2LjY2OC04LjMyMiwxMy44MDUtMTcuMjMsMjEuNDE2LTI2LjcyOQ0KCWM3LjYwNi05LjQ5MywxNS4yNjUtMTkuMDU0LDIyLjk3OS0yOC42ODFjNS44MS03LjI1MSwyMS45OTQtMjcuNDUsNDMuMDExLTUzLjY4M2gtNDYuNDNoLTQwLjg0N2MtMjcuNjE0LDAtNTAsMjIuMzg2LTUwLDUwdjM5MC43MTkNCgljMCwyNy42MTQsMjIuMzg2LDUwLDUwLDUwaDkuMTQ2YzU2LjgwOS03MC43NTEsMTE4Ljk0OC0xNDguMjMxLDEyMS41ODctMTUxLjUyNQ0KCUMtNTAyLjM3MywxMjEzLjI4Mi00OTYuMTY5LDEyMDUuNTM5LTQ4OC42NjYsMTE5Ni4xNzR6Ii8+DQo8cGF0aCBmaWxsPSIjQ0NDQ0NDIiBkPSJNLTI5Ny4xNTQsMTA4MC4xOThjMC05Mi43NjItNjMuMTU2LTE3MC43NjMtMTQ4LjgxMS0xOTMuMzc3Yy0yOS4zNzYsMzYuNzc2LTU3LjEwNiw3MS40NDEtNTkuMzk2LDc0LjI5OQ0KCWMtNS4wMDIsNi4yNDMtMTEuMzgzLDEzLjk0NS0xOS4xNDgsMjMuMWMtMy45NjEsNC45NDQtOC4xMjgsMTAuMTQ2LTEyLjUwNSwxNS42MDhzLTguNzU0LDEwLjkyNi0xMy4xMywxNi4zODkNCgljLTMuOTYyLDQuOTQ0LTcuOTIzLDkuODg5LTExLjg4LDE0LjgyN2MtMy45NjEsNC45NDUtNy43MTMsOS42MjgtMTEuMjU1LDE0LjA0OGMtMi45MjEsMy42NDYtNC41MzYsNy43OTgtNC44NTEsMTIuNDUxDQoJYy0wLjMxMyw0LjY2MywxLjQwMSw4LjkxOSw1LjE0MywxMi43N2MwLjM1OCwwLjI4NiwwLjY5MSwwLjU1NCwwLjk3OCwwLjc4M2MwLjM5LDAuMzEzLDAuNzE5LDAuNTc2LDAuOTc2LDAuNzgxDQoJYzUuNDYzLDQuMzc3LDExLjE1MSw1LjQxMSwxNy4wNiwzLjA5OGM1LjkxNS0yLjMxLDExLjIwOC01Ljg1NiwxNS44OTgtMTAuNjQ3YzEuMzAzLTEuMDg5LDIuNDIyLTIuMjI0LDMuMzYtMy4zOTUNCglzMS45MjUtMi40MDIsMi45Ny0zLjcwN2MxOS43OTktMjQuNzExLDQzLjIxMS0zOC43MzgsNzAuMjMxLTQyLjA3NnM1MS41NTksMy42MTksNzMuNjIxLDIwLjg2NA0KCWMyMi4wMSwxNi43ODQsMzQuNjMsMzkuMjc4LDM3Ljg2MSw2Ny40OTVjMy4yMzcsMjguMjIxLTMuNTQsNTMuMzM0LTIwLjMxOSw3NS4zMzljLTQuMTIxLDUuNjY4LTguNjE1LDExLjY3OC0xMy40ODMsMTguMDI4DQoJYy00Ljg3NCw2LjM0Ni05LjkxNywxMi43NzYtMTUuMTI0LDE5LjI3NmMtMS4yNTEsMS41NjEtMi41NTUsMy4xODgtMy45MDgsNC44NzdjLTEuMzU4LDEuNjk1LTIuNjU3LDMuMzE3LTMuOTA4LDQuODc4DQoJYy01LjYyNyw3LjAyMy0xMS4xMTcsMTMuNzM3LTE2LjQ1MiwyMC4xMzVjLTUuMzQ3LDYuMzk3LTkuOTk0LDEyLjA3My0xMy45NTEsMTcuMDEyYy0wLjQzNywwLjU0NS0zLjQwNCw0LjI0Ni04LjM0MSwxMC40MDENCglDLTM2MC4wOTEsMTI1MC42ODctMjk3LjE1NCwxMTcyLjc5OS0yOTcuMTU0LDEwODAuMTk4eiIvPg0KPC9zdmc+DQo=';

    /**
     * @var string Menu slug for the SPRESS app
     */
    public static $menu_slug = 'speedify_press';

    /**
     * Initialize the class by hooking the 'add_menu' method to the 'admin_menu' action.
     * This ensures that the admin menu is added when the admin dashboard is being loaded.
     *
     * @return void
     */
    public static function init() {        
        
        //Add the SPRESS menu
        add_action( 'admin_menu', array( __CLASS__, 'add_menu' ), 999 );

        //Add top menu
        add_action('admin_bar_menu', array(__CLASS__, 'add_top_menu'), 999);

        //Add any error notices
        add_action( 'admin_notices', array( \SPRESS\App\Dashboard::class ,'add_notices' ));

        //Add settings link
        add_filter('plugin_action_links_' . SPRESS_FILE_NAME , array(__CLASS__, 'add_plugin_page_shortcuts'));

        //Add plugin info
        add_filter( 'plugins_api', array(__CLASS__,'plugin_info'), 20, 3);

        //Add update notification
        add_action( 'after_plugin_row_' . SPRESS_FILE_NAME, array( __CLASS__, 'show_update_notification' ), 10, 2 );

        //Add view details link
        //add_filter('plugin_row_meta', array(__CLASS__, 'add_view_details_link'), 10, 3);

    }

    public static function show_update_notification() {
        
        if (is_network_admin()) {
            return; // Do not show in network admin
        }

        $plugin_file = SPRESS_FILE_NAME;
        $plugin_slug = SPRESS_DIR_NAME;        

        //Check for licence
        if(License::get_download_link() == false) {

            $settings_url = admin_url('admin.php?page='.self::$menu_slug);

            echo "<tr class='plugin-update-tr active' id='{$plugin_slug}-update' data-slug='{$plugin_slug}' data-plugin='{$plugin_file}'>
            <td colspan='4' class='plugin-update'>
                <div class='update-message notice inline notice-warning notice-alt'>
                    <p>Please <a href='" . $settings_url . "'>activate your license</a> to enable plugin updates</p>
                </div>
            </td>
        </tr>";            

        } else if(is_multisite()) {
    
            $version = License::get_latest_version();

            //Version check
            if($version <= SPRESS_VER) {
                return;
            }

            $update_url = wp_nonce_url(self_admin_url('update.php?action=upgrade-plugin&plugin=' . $plugin_file), 'upgrade-plugin_' . $plugin_file);
        
            echo "<tr class='plugin-update-tr active' id='{$plugin_slug}-update' data-slug='{$plugin_slug}' data-plugin='{$plugin_file}'>
                    <td colspan='4' class='plugin-update'>
                        <div class='update-message notice inline notice-warning notice-alt'>
                            <p>There is a new version of SpeedifyPress available. 
                                <a href='{$update_url}'
                                class='update-link' 
                                data-plugin='{$plugin_file}' 
                                data-slug='{$plugin_slug}'
                                data-name='SpeedifyPress'
                                aria-label='Update SpeedifyPress now'
                                data-wp-action='update-plugin'>
                                    Update to version {$version}
                                </a>
                            </p>
                        </div>
                    </td>
                </tr>";

        }

        echo "<style>
                    tr.update[data-plugin='". $plugin_file. "'] th, tr.plugin-update-tr[data-plugin='". $plugin_file. "'] th 
                    tr.update[data-plugin='". $plugin_file. "'] td, tr.plugin-update-tr[data-plugin='". $plugin_file. "'] td {
                        box-shadow:none !important;
                    }
                </style>";

    }
    
    
    

    /**

     */
    public static function add_view_details_link($plugin_meta, $plugin_file, $plugin_data = array()) {
    
        // Ensure this is only applied to the SPRESS plugin
        if ($plugin_file === SPRESS_FILE_NAME) {
                        
            // Define the link to the plugin details page with ThickBox support
            $view_details_link = sprintf(
                '<a href="%s" class="thickbox" title="%s">View Details</a>',
                esc_url(License::get_plugin_info_url()),
                esc_attr($plugin_data['Name'] ?? 'Plugin Details')
            );
            
            // Append the new link to the existing meta array
            $plugin_meta[] = $view_details_link;
        }
        
        return $plugin_meta;
    }

    public static function plugin_info($result, $action, $args) {

        // Do nothing if this is not about getting plugin information
        if ('plugin_information' !== $action) {
            return $result;
        }   
    
        // Do nothing if it is not our plugin
        if (!strstr(SPRESS_FILE_NAME, $args->slug)) {
            return $result;
        }

        //$release_file = dirname(__FILE__) . "/../../release.json";
        $release_url = "https://speedifypress.com/license/release/";
    
        //Get last release data
        $release_data = json_decode(file_get_contents($release_url), true);

        // Ensure the data is valid and matches the expected WordPress format
        if (is_array($release_data)) {

            //Add latest version
            $release_data['version'] = License::get_latest_version();

            //Add download link for latest version
            if($release_data['version'] > SPRESS_VER
                && get_option('spress_namespace_EMAIL') !== false) {
                $release_data['download_link'] = License::get_download_link();
            }

            //Add correct slug
            $release_data['slug'] = SPRESS_DIR_NAME;

            //Set correct format
            $result = (object) array_filter(array_merge((array) $result, $release_data));
        }
    
        return $result;
    }
        

    public static function add_plugin_page_shortcuts($links) {
    
      $settings_url = admin_url('admin.php?page='.self::$menu_slug);
        
      //Add the link
      array_push($links, "<a href='$settings_url'>Settings</a>");
  
      return $links;
      
    }

    /**
     * Adds custom menu items to the WordPress admin bar.
     *
     * @param object $admin_bar The WordPress admin bar object.
     *
     * @return void
     */
    public static function add_top_menu($admin_bar) {

        // Only admins after this point
        if ( ! Auth::is_allowed() ) {
            return;
        }    

        // Check if the "Dashboard" menu exists
        $dashboard_node = $admin_bar->get_node('site-name');

        // If the "Dashboard" node exists, we proceed to add custom links
        if ($dashboard_node) {          

            //Individual quicklinks items
            $quicklinks_array = array(
                array("name"=>"Plugins", "slug"=>"plugins.php"),
                array("name"=>"Posts", "slug"=>"edit.php"),
                array("name"=>"Pages", "slug"=>"edit.php?post_type=page"),
                array("name"=>"Users", "slug"=>"users.php")                
            );

            //Check if Woo is installed
            if(is_plugin_active('woocommerce/woocommerce.php')) {
                $quicklinks_array[] = array("name"=>"Products", "slug"=>"edit.php?post_type=product");
                $quicklinks_array[] = array("name"=>"Orders", "slug"=>"edit.php?post_type=shop_order");
                $quicklinks_array[] = array("name"=>"Logs", "slug"=>"admin.php?page=wc-status&tab=logs");
            }
            
            //Sort $quicklinks alphabetically by name
            usort($quicklinks_array, function($a, $b) {
                return strcmp($a['name'], $b['name']);
            });

            foreach($quicklinks_array AS $num=>$admin_page) {

                $admin_bar->add_menu([
                'id' => self::$menu_slug . '-quicklink-'.$num,
                'parent' => 'site-name',
                'title' => $admin_page['name'],
                'href' => admin_url($admin_page['slug']), 
                ]);   

            }

        }

        //SpeedifyPress menu
        $admin_bar->add_menu([
            'id' => self::$menu_slug,
            'title' => 'SpeedifyPress',
            'href' => admin_url('admin.php?page='.self::$menu_slug),
          ]);

          $admin_bar->add_menu([
            'id' => self::$menu_slug . '-clear',
            'parent' => self::$menu_slug,
            'title' => 'Clear CSS Cache',
            'href' => '#',
            'meta' => [
              'onclick' => 'clear_cache("css");return false;',
            ],
          ]);   
          
          $admin_bar->add_menu([
            'id' => self::$menu_slug . '-clearpage',
            'parent' => self::$menu_slug,
            'title' => 'Clear Page Cache',
            'href' => '#',
            'meta' => [
              'onclick' => 'clear_cache("page");return false;',
            ],
          ]);             

          ?>
            <script>
            function clear_cache(cache_type) {

                if(cache_type == "page") {
                    var id = '<?php echo esc_js(self::$menu_slug . '-clearpage'); ?>';                
                    var resturl = '<?php echo esc_url(rest_url("speedifypress/clear_page_cache")); ?>';
                } else {
                    var id = '<?php echo esc_js(self::$menu_slug . '-clear'); ?>';                
                    var resturl = '<?php echo esc_url(rest_url("speedifypress/clear_css_cache")); ?>';
                }
                var elem = document.querySelector('#wp-admin-bar-' + id + ' > a');
                if (!elem) return;

                var originalText = elem.innerText;
                var spinner = document.createElement('span');
                spinner.className = 'loader';
                spinner.style.marginLeft = '5px';
                elem.innerText = originalText; // Reset text and append spinner
                elem.appendChild(spinner);

                var xhr = new XMLHttpRequest();
                xhr.open('GET', resturl, true);
                
                xhr.onload = function () {
                    elem.innerText = originalText;
                    if (xhr.status === 200) {
                        console.log('Cache cleared successfully.');
                    } else {
                        console.error('Failed to clear cache:', xhr.status, xhr.statusText);
                    }
                };

                xhr.onerror = function () {
                    elem.innerText = originalText;
                    console.error('Error clearing cache.');
                };

                xhr.send();
            }
            </script>
          <style>
            .loader {
                width: 20px !important;
                height: 20px !important;
                border: 2px solid #FFF !important;
                border-bottom-color: transparent !important;
                border-radius: 50% !important;
                display: inline-block !important;
                box-sizing: border-box !important;
                animation: rotation 1s linear infinite !important;
                position:absolute !important;
                margin-top:2px !important;
                }

                @keyframes rotation {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                } 

            #wp-admin-bar-<?php echo self::$menu_slug; ?>>.ab-item {
                background-image: url(<?php echo self::$menu_icon ?>)!important;
                background-size: 15px!important;
                background-repeat: no-repeat!important;
                background-position: 10px 7px!important;
                padding-left: 30px!important
            }


        }
        </style><?php

    }

    /**
     * Add the custom menu page to the WordPress admin dashboard.
     * This function defines the title, capability, slug, and callback function for the page.
     * It also adds JavaScript and CSS specifically to this admin page.
     *
     * @return void
     */
    public static function add_menu() {
        
        // Check if the current user has the necessary permissions to view the page.
        if ( ! Auth::is_allowed() ) {
            return;
        }

        //Different menu icon when on our page
        $menu_icon = self::$menu_icon;
        if(isset($_GET['page']) && $_GET['page'] == self::$menu_slug) {
            $menu_icon = self::$menu_icon_selected;
        }

        // Add the custom menu page to the WordPress admin.
        $menu = add_menu_page(
            'SpeedifyPress',          // Page title
            'SpeedifyPress',          // Menu title
            'manage_options',           // Capability required to view this menu
            self::$menu_slug,      // Menu slug
            array( __CLASS__, 'display' ), // Callback function to display content
            $menu_icon,       // Icon for the menu
            '100'                   // Position in the admin menu
        );


        // Inject the JavaScript and CSS files only when this specific admin page is loaded.
        add_action( 'admin_print_scripts-' . $menu, array( __CLASS__, 'add_js' ) );
    }

    /**
     * Enqueue the JavaScript and CSS required for the custom admin page.
     * This ensures the required assets are loaded only on the specific page.
     *
     * @return void
     */
    public static function add_js() {
        // Enqueue the admin page JavaScript file.
        wp_enqueue_script(
            'unused_spress_admin',                      // Handle for the script
            SPRESS_PLUGIN_URL . 'assets/admin/admin.min.js', // URL to the script
            array(),                                   // Dependencies (none)
            SPRESS_VER,
            true                                       // Load in the footer
        );

        // Enqueue the admin page CSS file.
        wp_enqueue_style(
            'unused_spress_admin_style',                // Handle for the style
            SPRESS_PLUGIN_URL . 'assets/admin/admin.min.css', // URL to the stylesheet
            array(),
            SPRESS_VER
        );
    }

    /**
     * Display the content for the custom admin page.
     * This function passes configuration and version data to the frontend by injecting it
     * into a global JavaScript object. It also sets up a container for rendering the Vue.js app.
     *
     * @return void
     */
    public static function display() {

        // Get the plugin version.
        $version = SPRESS_VER;

        // Get the plugin configuration, removing any non-global values.
        $config  = json_encode( Config::remove_non_global(Config::$config ));

        //Set ajax url
        $ajax_url =  admin_url( 'admin-ajax.php' );

        // Output the necessary data for the frontend into a JavaScript object.
        echo "<script>window.spress_namespace={config:$config,version:'$version',ajaxurl:'$ajax_url'}</script>";

        // Output a container div for the Vue.js app with Tailwind CSS classes.
        echo '<div id="app" class="tailwind"></div>';
    }

}