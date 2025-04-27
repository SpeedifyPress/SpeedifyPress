/**
 * Class responsible for handling cache operations and bypass logic for a Cloudflare Worker.
 * This class manages caching of requests, bypassing cache under specific conditions,
 * and performing cache invalidation when required. It provides methods to check request
 * headers, validate the presence of specific headers in the response, and delete or refill 
 * cache entries based on server-side conditions. 
 * 
 * It also handles bypassing the cache based on request parameters such as HTTP methods, 
 * cookies, static file requests, and the presence of specific query parameters.
 * 
 * @class CacheHandler
 * @author Leon Chevalier
 * @credits Heavily influenced by https://plugins.svn.wordpress.org/wp-cloudflare-page-cache/trunk/assets/js/worker_template.js 
 *          Although much improved! :-) 
 * @constructor
 */

class CacheHandler {

    /**
     * Constructor for CacheHandler, sets default values for bypass cookies 
     * and static file extensions.
     * @constructor
     */
    constructor() {

        //Don't cache when these cookies are present
        this.DEFAULT_BYPASS_COOKIES = [
        'wordpress_logged_in_',
        'comment_',
        'woocommerce_',
        'wordpressuser_',
        'wordpresspass_',
        'wordpress_sec_',
        'yith_wcwl_products',
        'edd_items_in_cart',
        'it_exchange_session_',
        'comment_author',
        'dshack_level',
        'auth',
        'noaffiliate_',
        'mp_session',
        'mp_globalcart_',
        'xf_'
        ];

        //Strip these from the URL. This means caching will still take place even if these come through with
        //a different value every time
        this.THIRD_PARTY_QUERY_PARAMETERS = [
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
        ];

        //For static files so we don't mess with these
        this.STATIC_FILE_EXTENSIONS = [
        '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.tiff', '.ico', '.3gp', '.wmv', '.avi', '.asf', '.asx',
        '.mpg', '.mpeg', '.webm', '.ogg', '.ogv', '.mp4', '.mkv', '.pls', '.mp3', '.mid', '.wav', '.swf', '.flv', '.exe', '.zip',
        '.tar', '.rar', '.gz', '.tgz', '.bz2', '.uha', '.7z', '.doc', '.docx', '.pdf', '.iso', '.test', '.bin', '.js', '.json',
        '.css', '.eot', '.ttf', '.woff', '.woff2', '.webmanifest'
        ];

        //Our plugin name for the headers
        this.globalPluginName = 'X-SPDY';

        //Set this to allow cache validation/invalidation from the origin
        //server. Will only cache when this is set and invalidate when it isn't
        this.mustHaveHeader = 'x-spdy-cache';
        this.mustHaveHeaderValue = 'HIT';

        //Set the csrf token name and salt
        this.csrf_name = 'spdy_csrfToken';
        this.csrf_salt = 'X1uOzep8o3kEp7#pn';

    }

    /**
     * Main method to handle requests and apply cache or bypass logic.
     * @param {FetchEvent} event - The fetch event containing the request.
     * @returns {Promise<Response>} - The response object.
    */
    async handleRequest(event) {

        const request = event?.request;
        let requestURL;
        try {
        requestURL = this.urlNormalize(event?.request?.url);  // Normalize the URL
        } catch (err) {
        // If an error occurs during URL normalization, handle it here
        return new Response(err.message, {
            status: 400,  // Bad Request status code
            statusText: err.message,
        });
        }    

        let response;

        // Check if the request is for a static file
        if (this.isStaticFile(requestURL)) {
            try {
            response = await this.fetchStaticFile(request);  // Await static file fetch
            return response;
            } catch (err) {
            // Handle static file fetch errors
            console.error(`Error in static file processing: ${err.message}`);
            return new Response(`Error fetching static file: ${err.message}`, {
                status: 500,
                statusText: err.message,
            });
            }
        }

        //Handle request headers to check for bypass
        const requestCheck = this.checkRequestHeaders(request, requestURL);

        //The request should be bypassed, add headers
        if (requestCheck.bypassCache === true) {
            
            const bypassedResponse = await fetch(request);
            response = new Response(bypassedResponse?.body, bypassedResponse);
            response = this.addBypassCustomHeaders(response, requestCheck.bypassReasonDetails);

        //Not eligible for bypass, fetch and cache
        } else {

            response = await this.fetchAndCacheResponse(event, request, requestURL);

        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {

            const clonedResponse = response.clone(); // Clone to avoid stream lock
            let body = await clonedResponse.text();

            // the User-Agent indicates a mobile browser, remove any content between
            // <!-- FontPreload --> and <!-- /FontPreload -->
            const userAgent = request.headers.get('user-agent') || '';
            const isMobile = /Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/i.test(userAgent);

            // Replace away font preloads
            if (isMobile && body.includes('<!-- SPRESS_preload_fonts_desktop_only -->')) {
                body = body.replace(/<!--\s*FontPreload\s*-->[\s\S]*?<!--\s*\/FontPreload\s*-->/gi, '');                
            }            

            // Update the token every time
            if(body.includes(this.csrf_name)) {

                // Generate a new CSRF token using the current URL.
                // generateCsrfToken is assumed to be defined and uses this.csrf_salt.
                const newCsrfToken = await this.generateCsrfToken.call(this, requestURL);
                // Replace the existing token in the body with the new one.
                const csrfRegex = new RegExp(`(<script id="${this.csrf_name}">window\\.${this.csrf_name} = ")[^"]*(";<\\/script>)`, 'i');
                body = body.replace(csrfRegex, `$1${newCsrfToken}$2`);

            }    

            response = new Response(body, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });


        }        





        return response;

    }

    /**
     * Generates a CSRF token for a given URL.
     *
     * The token is a base64-encoded string containing:
     *   - an expiry timestamp (Unix time in seconds, 30 seconds from now)
     *   - a 6-byte random value (hex encoded)
     *   - the provided URL
     *   - an HMAC‑SHA256 signature of the above data using this.csrf_salt
     *
     * @param {string} url - The URL to include in the token.
     * @returns {Promise<string>} - The base64‑encoded token.
     */
    async generateCsrfToken(url) {
        const encoder = new TextEncoder();
        // Expiry: current Unix timestamp plus 30 seconds
        const expiry = Math.floor(Date.now() / 1000) + 30;
        // Generate 6 random bytes and convert to hex
        const randomBytes = new Uint8Array(6);
        crypto.getRandomValues(randomBytes);
        const randomHex = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
        // Combine expiry, random hex, and URL into a single data string
        const data = `${expiry}:${randomHex}:${url}`;
        
        // Import the secret key (this.csrf_salt) as a CryptoKey for HMAC-SHA256
        const keyData = encoder.encode(this.csrf_salt);
        const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
        );
        
        // Sign the data string
        const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        encoder.encode(data)
        );
        // Convert signature from ArrayBuffer to a hex string
        const signatureHex = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
        
        // Concatenate the data and signature
        const token = `${data}:${signatureHex}`;
        
        // Base64 encode the token (btoa expects a binary string; our token is ASCII-safe)
        return btoa(token);
    }


    /**
     * Fetches a response from the cache if available, otherwise fetches it from the origin server.
     * If the response is not in the cache, attempts to cache it for future requests.
     * Handles headers to determine caching eligibility and sets status accordingly.
     *
     * @param {FetchEvent} event - The fetch event associated with the request.
     * @param {Request} request - The request object containing the request details.
     * @param {URL} requestURL - The normalized URL of the request.
     * @returns {Promise<Response>} - The response object, either from cache or freshly fetched.
     */
    async fetchAndCacheResponse(event, request, requestURL) {
        
        //Create a cache key based on the request URL and headers
        const cacheKey = new Request(requestURL);

        //Get the default cache
        const cache = caches?.default;

        //Initialize response object
        let response;

        //Try to get the response from cache
        try {

            response = await cache?.match(cacheKey);

        } catch (err) {

            // Handle cache errors (e.g., cache access issues)
            console.error(`Cache match error: ${err.message}`);
            return new Response(`Cache fetch error: ${err.message}`, { status: 500 });
        }

        //If response is found in cache, return it
        if (response) {
        
        response = new Response(response.body, response);
        response?.headers?.set(this.globalPluginName +'-status', 'HIT');      

        } else {

            //If response is not found in cache, fetch it from origin server
            let fetchedResponse;
            try {
                fetchedResponse = await fetch(request);
            } catch (err) {
                // Handle origin fetch errors
                console.error(`Origin fetch error: ${err.message}`);
                return new Response(`Error fetching content from the origin: ${err.message}`, { status: 500 });
            }
            
            //Create a new response with the fetched content
            response = new Response(fetchedResponse.body, fetchedResponse);

            //Add headers to allow subsequent caching
            response.headers.set('Cache-Control', 'public, max-age=31536000;');

            // Calculate the expiration date: 30 days from now
            const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
            response.headers.set('Expires', oneMonthLater)                       

            //Check the response headers
            const responseCheck = this.checkResponseHeaders(response);

            //This response should not be stored in the cache
            if (responseCheck.bypassCache === true) {
                
                response = this.addBypassCustomHeaders(response, responseCheck.bypassReasonDetails);

            } else {      

                //This response should be cached then served
                response = this.doCache(event, response, request, cache, cacheKey, requestURL);

            }
        
        }

        return response;

    }  


    /**
     * Caches the response based on the request type and status.
     * 
     * This function sets a response header to indicate a cache miss and checks if the response status is 206 or if the request method
     * is not GET. If either condition is true, the request is fetched again from the origin server with the cacheEverything flag set.
     * Otherwise, the response is cached using the provided cache key.
     * 
     * @param {FetchEvent} event - The fetch event associated with the request.
     * @param {Response} response - The response object to be cached or modified.
     * @param {Request} request - The request object associated with the fetch event.
     * @param {Cache} cache - The cache storage where the response may be cached.
     * @param {Request} cacheKey - The key used to identify the response in the cache.
     * @returns {Promise<Response>} - The response object, potentially modified and/or cached.
     */

    async doCache(event, response, request, cache, cacheKey, requestURL) {

        // Cache.put doesn't work with 206 or non GETs, so we need to fetch again
        // with cacheEverything set to TRUE as that is the only way to cache it
        // More info: https://developers.cloudflare.com/workers/runtime-apis/request#requestinitcfproperties
        if (response.status === 206 || request?.method !== 'GET') {

            try {
                response = await fetch(request, { cf: { cacheEverything: true } }) // Fetch with cacheEverything flag
            } catch (err) {
                return new Response( 
                `Error: ${err.message}`,
                { status: 500, statusText: "Unable to fetch content from the origin server with cacheEverything flag" } 
                )
            }

            response = new Response(response.body, response);

        } else {

            // Put the response in cache
            try {
                event.waitUntil(cache.put(cacheKey, response.clone())); // Clone the response before caching
            } catch (err) {
                return new Response(`Cache Put Error: ${err.message}`, { status: 500, statusText: `Cache Put Error: ${err.message}` });
            }

        }

        // We're caching it, return SAVED status
        // with a tacker to check if this is getting cached
        let random_tracker = Math.floor(Math.random() * 999999);
        response.headers?.set(this.globalPluginName +'-status', 'SAVED '+random_tracker);

        //Let us know the normalised URL
        response.headers?.set(this.globalPluginName +'-nurl', requestURL);
        
        return response;

    }


    /**
     * Checks if the request headers indicate that the response should be cached.
     * 
     * @param {Request} request - The request object associated with the fetch event.
     * @param {URL} requestURL - The URL object associated with the request.
     * @returns {Object} - An object containing a boolean indicating whether the response should be 
     *                     bypassed (bypassCache) and a string describing the reason (bypassReasonDetails).
     */
    checkRequestHeaders(request, requestURL) {

        //Allow methods
        const allowedReqMethods = ['GET', 'HEAD'];

        //Default doesn't bypass
        let bypassCache = false;
        let bypassReasonDetails = '';    

        //Check HTML content type accepted
        let isHTMLContentType = false;
        const accept = request?.headers?.get('Accept');
        if (accept?.includes('text/html')) {
            isHTMLContentType = true;
        }    

        // Only cache GET and HEAD requests
        if (!allowedReqMethods.includes(request?.method)) {
            bypassCache = true;
            bypassReasonDetails = `Caching not possible for req method ${request.method}`;
        }

        // If the request is for an admin or API path
        if (this.isAdminOrAPIPath(requestURL.pathname)) {
            bypassCache = true;
            bypassReasonDetails = 'WP Admin HTML request';
        }

        // Check for bypass based on cookies
        const cookieHeader = request?.headers?.get('cookie');
        if (!bypassCache && isHTMLContentType && this.areBlacklistedCookies(cookieHeader)) {
            bypassCache = true;
            bypassReasonDetails = 'Default Bypass Cookie Present';
        }    

        return {bypassCache: bypassCache, bypassReasonDetails: bypassReasonDetails };

    }

    /**
     * Evaluates the response headers to determine if caching should be bypassed.
     *
     * This function checks if the response content type is HTML and whether it contains
     * a required header with a specific value. If the header is missing or its value is
     * incorrect, caching is bypassed. Additionally, it checks if the response has an
     * unusual status code, which also results in bypassing the cache.
     *
     * @param {Response} response - The response object to evaluate.
     * @returns {Object} - An object containing a boolean `bypassCache` to indicate if
     *                     caching should be bypassed, and `bypassReasonDetails` providing
     *                     the reason for the bypass if applicable.
     */

    checkResponseHeaders(response) {
    
        // Check for HTML content type and presence of the must-have header
        if (this.mustHaveHeader && response?.headers?.get('content-type')?.includes('text/html')) {
            const headerValue = response?.headers?.get(this.mustHaveHeader);

            // If header is missing or its value is not as expected
            if (!headerValue || headerValue !== this.mustHaveHeaderValue) {
                return {
                    bypassCache: true,
                    bypassReasonDetails: `${this.mustHaveHeader} failed. Found: '${headerValue}'`
                };
            }
        }

        if (this.hasUnusualOriginServerResponseCode(response)) {
            return { bypassCache: true, bypassReasonDetails: `Unusual response code found: ` + String(response?.status) };
        }

        return { bypassCache: false };

    }  


    /**
     * Check the server for the mustHaveHeader and delete the cache if needed.
     * @param {Request} request - The request object.
    */
    async checkAndDeleteCacheIfNeeded(request) {
        try {
            const originResponse = await fetch(request, { method: 'HEAD' });
            const originHeaderValue = originResponse.headers.get(this.mustHaveHeader);

            if (this.mustHaveHeaderValue != '' 
                && originHeaderValue !== this.mustHaveHeaderValue) {
                
                // If the value is incorrect, delete the cache for this request
                const cache = caches.default;
                const cacheKey = new Request(this.urlNormalize(request.url));
                await cache.delete(cacheKey);  // Delete the cache entry

                //Refetch to fill cache
                await fetch(request, { method: 'GET' });

            }
        } catch (err) {
            console.error(`Error checking origin server: ${err.message}`);
        }
    }


    /**
     * Normalizes the given URL by removing promotional query parameters
     * from the query string. This is useful for removing tracking parameters
     * that are not relevant for caching.
     * 
     * @param {string} url - The URL to normalize.
     * @returns {URL} The normalized URL.
     * @throws {Error} If an error occurs during normalization.
     */
    urlNormalize(url) {
        try {

            const reqURL = new URL(url);
            this.THIRD_PARTY_QUERY_PARAMETERS.forEach(param => {
                const promoUrlQuery = new RegExp(`(&?)(${param}=\\S+)`, 'g');
                if (promoUrlQuery.test(reqURL.search)) {
                reqURL.searchParams.delete(param);
                }
            });
            return reqURL;

        } catch (err) {        
            // If an error occurs during normalization, throw an error
            throw new Error(`URL Handling Error: ${err.message}`);
        }
    }

    
    /**
     * Checks if any blacklisted cookies are present in the given cookie header.
     * @param {string} cookieHeader - The cookie header to check.
     * @returns {boolean} true if any blacklisted cookies are present, false otherwise.
     */
    areBlacklistedCookies(cookieHeader) {
        if (!cookieHeader) return false;
        const cookies = cookieHeader.split(';');
        return cookies.some(cookie => this.DEFAULT_BYPASS_COOKIES.some(bypassCookie => cookie.trim().startsWith(bypassCookie.trim())));
    }

    
    /**
     * Checks if the given URL is a static file request.
     * @param {URL} requestURL - The URL to check.
     * @returns {boolean} true if the request is for a static file, false otherwise.
     */
    isStaticFile(requestURL) {
        const requestPath = requestURL.pathname;
        return this.STATIC_FILE_EXTENSIONS.some(ext => requestPath.endsWith(ext));
    }
    
    /**
     * Adds custom headers to the response to indicate a request bypass.
     *
     * This function modifies the provided response object by setting custom
     * headers that specify the status and reason for bypassing the cache.
     * It also sets the 'Cache-Control' header to prevent caching.
     *
     * @param {Response} res - The response object to modify.
     * @param {string} reason - The reason for bypassing, which will be included
     *   in the response headers.
     * @returns {Response} The modified response object with added headers.
     */
    addBypassCustomHeaders(res, reason) {
        if (res && reason) {
            res.headers.set(`${this.globalPluginName}-status`, 'BYPASS');
            res.headers.set(`${this.globalPluginName}-bypass-reason`, reason);
            res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        }
        return res;
    }
    
    
    /**
     * Checks if the given path is an admin or API path.
     * 
     * Checks if the given path is an admin path or an API path (e.g. /wp-json or /edd-api).
     * 
     * @param {string} pathname - The path to check.
     * @returns {boolean} true if the path is an admin or API path, false otherwise.
     */
    isAdminOrAPIPath(pathname) {
        const adminOrAPIRegex = /^\/(wp-admin|wc-api|edd-api|wp-json)(\/|$|\/.*)/;
        return adminOrAPIRegex.test(pathname);
    }
    
    /**
     * Fetches a static file from the origin server.
     * @param {Request} request - The request object.
     * @returns {Promise<Response>} - A promise that resolves with the response object
     * if the request is successful, or rejects with an error if the request fails.
     */
    async fetchStaticFile(request) {
        return fetch(request)
        .then(response => {
            return response;
        })
        .catch(err => {
            // Log the error message to help debug
            console.error(`Error fetching static file: ${err.message}`);
            throw new Error(`Error fetching static file: ${err.message}`);
        });
    }    
    
    /**
     * Helper method to check if the response status code is unusual
     * @param {Response} response - The response object
     * @returns {Boolean} - If the response has an unusual status code (3XX, 4XX, 5XX)
     */
    hasUnusualOriginServerResponseCode(response) {
        const responseStatusCode = String(response?.status);

        // Check if the status code is unusual
        if (responseStatusCode.startsWith('3') || responseStatusCode.startsWith('4') || responseStatusCode.startsWith('5')) {
            // Set a custom header to indicate the response code
            response.headers?.set(this.globalPluginName + '-worker-origin-response', responseStatusCode);
            return true;
        }

        // If the status code is not unusual, return false
        return false;
    }

}

/**
 * Event listener for 'fetch' events, responsible for handling HTTP requests.
 * Uses CacheHandler to manage caching and response logic.
 */
addEventListener('fetch', event => {
  try {
    // Initialize a new CacheHandler instance
    const cacheHandler = new CacheHandler();

    // Use CacheHandler to process the request and provide a response
    event.respondWith(
        cacheHandler.handleRequest(event).then(response => {
          // Check if the response is a cache hit and perform the asynchronous action
          if (response?.headers?.get(cacheHandler.globalPluginName + '-status')?.includes('HIT')) {
            event.waitUntil(cacheHandler.checkAndDeleteCacheIfNeeded(event.request));
          }
          return response;
        })
    );      
    
  } catch (err) {
    // Handle any errors that occur during request processing
    return event.respondWith(
      new Response(
        `Error thrown: ${err.message}`, 
        { status: 500, statusText: `Error thrown: ${err.message}` }
      )
    );
  }
});