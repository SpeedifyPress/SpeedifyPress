<script setup>
defineProps({
  iconclass: {
    type: String,
    required: false
  },  
})
</script>

<template>
    <div class="text-left text-md">    

            <!-- Frontend -->
            <div class="flex items-left mt-4">
                <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10.5H8M16 10.5L13 13.5M16 10.5L13 7.5M12 20H16M12 20H8M12 20V16M12 16H5C4.44772 16 4 15.5523 4 15V6C4 5.44771 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V7M12 16H19C19.5523 16 20 15.5523 20 15V11" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Core Frontend</h5>                  
            </div>        

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Remove Emojis</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Disables WordPress emoji support (scripts, styles and TinyMCE plugin) to reduce frontend payload.
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Disable jQuery Migrate</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Removes the jQuery Migrate compatibility layer on the frontend. Only enable if your theme and plugins do not rely on legacy jQuery APIs.
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Disable RSS/Atom feeds</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Disables core RSS/Atom endpoints and removes feed discovery links from the page head. Use this if you do not provide feeds to subscribers.
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Disable oEmbed functionality</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Removes oEmbed discovery and related endpoints. Plain URLs will no longer auto-convert into embeds unless you use embed blocks/shortcodes.
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Limit Heartbeat API</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Reduces background Heartbeat polling by increasing the interval to 60 seconds. This can reduce admin AJAX activity while keeping post locking and session checks working.
                </p>        

             <!-- Admin -->
            <div class="flex items-left mt-4">
                <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 10.5H16M8 10.5L11 13.5M8 10.5L11 7.5M12 20H16M12 20H8M12 20V16M12 16H5C4.44772 16 4 15.5523 4 15V6C4 5.44771 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V7M12 16H19C19.5523 16 20 15.5523 20 15V11"        stroke="#000000"        stroke-width="1.5"        stroke-linecap="round"        stroke-linejoin="round"/></svg>
                <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Admin Interface</h5>                  
            </div>    

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Increase autosave interval</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Increases the editor autosave interval to reduce database writes during editing. Useful on busy editorial sites.
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Limit post revisions</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Limits saved revisions to 3 per post to reduce database bloat in wp_posts and wp_postmeta.
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Disable the block editor</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Disables Gutenberg and forces the classic editor UI. Only enable if you are not using the block editor.
                </p>

             <!-- Media -->
            <div class="flex items-left mt-4">
                <svg :class="iconclass" class="mr-2" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v48H54a6 6 0 0 0-6 6v244a6 6 0 0 0 6 6h372a6 6 0 0 0 6-6v-10h48zm42-336H150a6 6 0 0 0-6 6v244a6 6 0 0 0 6 6h372a6 6 0 0 0 6-6V86a6 6 0 0 0-6-6zm6-48c26.51 0 48 21.49 48 48v256c0 26.51-21.49 48-48 48H144c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h384zM264 144c0 22.091-17.909 40-40 40s-40-17.909-40-40 17.909-40 40-40 40 17.909 40 40zm-72 96l39.515-39.515c4.686-4.686 12.284-4.686 16.971 0L288 240l103.515-103.515c4.686-4.686 12.284-4.686 16.971 0L480 208v80H192v-48z"/></svg>
                <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Media</h5>                  
            </div>   

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Disable XML-RPC</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Disables XML-RPC to reduce brute force and abuse surface. Do not enable if you rely on integrations that require XML-RPC (some Jetpack features and legacy remote publishing).
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Disable attachment pages</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Redirects attachment pages to the original file URL (or parent content) to avoid thin pages that add little value.
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Disable core XML sitemaps</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Disables WordPress core sitemaps at /wp-sitemap.xml. Enable this if an SEO plugin already provides sitemaps to avoid duplication.
                </p>            

             <!-- Discussion -->
            <div class="flex items-left mt-4">
                <svg :class="iconclass" class="mr-2" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.38204 10.234C7.96783 10.234 7.63204 10.5698 7.63204 10.984C7.63204 11.3982 7.96783 11.734 8.38204 11.734V10.234ZM14.147 11.734C14.5613 11.734 14.897 11.3982 14.897 10.984C14.897 10.5698 14.5613 10.234 14.147 10.234V11.734ZM9.10004 12.342C8.68583 12.342 8.35004 12.6778 8.35004 13.092C8.35004 13.5062 8.68583 13.842 9.10004 13.842V12.342ZM13.426 13.842C13.8403 13.842 14.176 13.5062 14.176 13.092C14.176 12.6778 13.8403 12.342 13.426 12.342V13.842ZM7.89534 6.77227C7.4868 6.84059 7.211 7.22716 7.27932 7.6357C7.34764 8.04424 7.73421 8.32005 8.14275 8.25173L7.89534 6.77227ZM8.51904 7.471L8.5175 8.221H8.51904V7.471ZM14.019 7.471L14.0247 6.721H14.019V7.471ZM17.035 10.532L16.285 10.5265V10.532H17.035ZM17.035 14.248L16.285 14.248L16.285 14.2489L17.035 14.248ZM16.2486 14.666C16.1762 15.0739 16.4482 15.4631 16.8561 15.5355C17.2639 15.6078 17.6532 15.3358 17.7255 14.928L16.2486 14.666ZM8.1494 8.25058C8.55731 8.17859 8.82962 7.78955 8.75763 7.38164C8.68563 6.97373 8.29659 6.70142 7.88869 6.77342L8.1494 8.25058ZM5.50004 10.531L6.25006 10.531L6.25003 10.527L5.50004 10.531ZM5.50004 19H4.75004C4.75004 19.2663 4.89121 19.5126 5.12096 19.6471C5.35071 19.7817 5.63459 19.7844 5.86683 19.6542L5.50004 19ZM8.51604 17.309V16.559C8.38759 16.559 8.2613 16.592 8.14926 16.6548L8.51604 17.309ZM14.016 17.309V18.059L14.021 18.059L14.016 17.309ZM17.7199 14.9289C17.7911 14.5209 17.518 14.1324 17.11 14.0612C16.7019 13.99 16.3134 14.263 16.2422 14.6711L17.7199 14.9289ZM7.28008 7.38379C7.20928 7.79191 7.48272 8.18016 7.89084 8.25096C8.29896 8.32177 8.6872 8.04832 8.75801 7.64021L7.28008 7.38379ZM10.987 5V4.24999L10.9827 4.25001L10.987 5ZM16.487 5L16.4934 4.25H16.487V5ZM19.5 8.061L18.75 8.05554V8.061H19.5ZM19.5 11.777H18.75L18.7501 11.782L19.5 11.777ZM16.8507 14.0614C16.4428 14.1334 16.1705 14.5224 16.2425 14.9304C16.3145 15.3383 16.7035 15.6106 17.1114 15.5386L16.8507 14.0614ZM8.38204 11.734H14.147V10.234H8.38204V11.734ZM9.10004 13.842H13.426V12.342H9.10004V13.842ZM8.14275 8.25173C8.26659 8.23102 8.39194 8.22074 8.5175 8.221L8.52059 6.721C8.31111 6.72057 8.10196 6.73772 7.89534 6.77227L8.14275 8.25173ZM8.51904 8.221H14.019V6.721H8.51904V8.221ZM14.0134 8.22098C15.2773 8.23051 16.2943 9.26265 16.2851 10.5265L17.785 10.5375C17.8002 8.4453 16.1168 6.7368 14.0247 6.72102L14.0134 8.22098ZM16.285 10.532V14.248H17.785V10.532H16.285ZM16.285 14.2489C16.2852 14.3887 16.273 14.5283 16.2486 14.666L17.7255 14.928C17.7654 14.7032 17.7853 14.4754 17.785 14.2471L16.285 14.2489ZM7.88869 6.77342C6.06575 7.09516 4.74009 8.68395 4.75006 10.535L6.25003 10.527C6.244 9.40676 7.04624 8.44529 8.1494 8.25058L7.88869 6.77342ZM4.75004 10.531V19H6.25004V10.531H4.75004ZM5.86683 19.6542L8.88283 17.9632L8.14926 16.6548L5.13326 18.3458L5.86683 19.6542ZM8.51604 18.059H14.016V16.559H8.51604V18.059ZM14.021 18.059C15.8485 18.047 17.4057 16.7293 17.7199 14.9289L16.2422 14.6711C16.0527 15.757 15.1134 16.5518 14.0111 16.559L14.021 18.059ZM8.75801 7.64021C8.94671 6.55256 9.88748 5.75633 10.9914 5.74999L10.9827 4.25001C9.15263 4.26052 7.59293 5.58059 7.28008 7.38379L8.75801 7.64021ZM10.987 5.75H16.487V4.25H10.987V5.75ZM16.4806 5.74997C17.7437 5.76075 18.7593 6.79252 18.7501 8.05554L20.25 8.06646C20.2652 5.97576 18.5841 4.26786 16.4934 4.25003L16.4806 5.74997ZM18.75 8.061V11.777H20.25V8.061H18.75ZM18.7501 11.782C18.7576 12.9034 17.955 13.8665 16.8507 14.0614L17.1114 15.5386C18.9362 15.2165 20.2624 13.6249 20.25 11.772L18.7501 11.782Z" fill="#000000"/></svg>
                <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Discussion</h5>                  
            </div>      

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Disable comments sitewide</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Disables commenting across the site and removes comment UI where possible. Use this if you do not accept comments.
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Disable pingbacks/trackbacks</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Disables pingbacks and trackbacks, removes related head links/headers, and reduces spam and attack surface.
                </p>            

             <!-- WooCommerce -->
            <div class="flex items-left mt-4">
                <svg :class="iconclass" class="mr-2" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.38204 10.234C7.96783 10.234 7.63204 10.5698 7.63204 10.984C7.63204 11.3982 7.96783 11.734 8.38204 11.734V10.234ZM14.147 11.734C14.5613 11.734 14.897 11.3982 14.897 10.984C14.897 10.5698 14.5613 10.234 14.147 10.234V11.734ZM9.10004 12.342C8.68583 12.342 8.35004 12.6778 8.35004 13.092C8.35004 13.5062 8.68583 13.842 9.10004 13.842V12.342ZM13.426 13.842C13.8403 13.842 14.176 13.5062 14.176 13.092C14.176 12.6778 13.8403 12.342 13.426 12.342V13.842ZM7.89534 6.77227C7.4868 6.84059 7.211 7.22716 7.27932 7.6357C7.34764 8.04424 7.73421 8.32005 8.14275 8.25173L7.89534 6.77227ZM8.51904 7.471L8.5175 8.221H8.51904V7.471ZM14.019 7.471L14.0247 6.721H14.019V7.471ZM17.035 10.532L16.285 10.5265V10.532H17.035ZM17.035 14.248L16.285 14.248L16.285 14.2489L17.035 14.248ZM16.2486 14.666C16.1762 15.0739 16.4482 15.4631 16.8561 15.5355C17.2639 15.6078 17.6532 15.3358 17.7255 14.928L16.2486 14.666ZM8.1494 8.25058C8.55731 8.17859 8.82962 7.78955 8.75763 7.38164C8.68563 6.97373 8.29659 6.70142 7.88869 6.77342L8.1494 8.25058ZM5.50004 10.531L6.25006 10.531L6.25003 10.527L5.50004 10.531ZM5.50004 19H4.75004C4.75004 19.2663 4.89121 19.5126 5.12096 19.6471C5.35071 19.7817 5.63459 19.7844 5.86683 19.6542L5.50004 19ZM8.51604 17.309V16.559C8.38759 16.559 8.2613 16.592 8.14926 16.6548L8.51604 17.309ZM14.016 17.309V18.059L14.021 18.059L14.016 17.309ZM17.7199 14.9289C17.7911 14.5209 17.518 14.1324 17.11 14.0612C16.7019 13.99 16.3134 14.263 16.2422 14.6711L17.7199 14.9289ZM7.28008 7.38379C7.20928 7.79191 7.48272 8.18016 7.89084 8.25096C8.29896 8.32177 8.6872 8.04832 8.75801 7.64021L7.28008 7.38379ZM10.987 5V4.24999L10.9827 4.25001L10.987 5ZM16.487 5L16.4934 4.25H16.487V5ZM19.5 8.061L18.75 8.05554V8.061H19.5ZM19.5 11.777H18.75L18.7501 11.782L19.5 11.777ZM16.8507 14.0614C16.4428 14.1334 16.1705 14.5224 16.2425 14.9304C16.3145 15.3383 16.7035 15.6106 17.1114 15.5386L16.8507 14.0614ZM8.38204 11.734H14.147V10.234H8.38204V11.734ZM9.10004 13.842H13.426V12.342H9.10004V13.842ZM8.14275 8.25173C8.26659 8.23102 8.39194 8.22074 8.5175 8.221L8.52059 6.721C8.31111 6.72057 8.10196 6.73772 7.89534 6.77227L8.14275 8.25173ZM8.51904 8.221H14.019V6.721H8.51904V8.221ZM14.0134 8.22098C15.2773 8.23051 16.2943 9.26265 16.2851 10.5265L17.785 10.5375C17.8002 8.4453 16.1168 6.7368 14.0247 6.72102L14.0134 8.22098ZM16.285 10.532V14.248H17.785V10.532H16.285ZM16.285 14.2489C16.2852 14.3887 16.273 14.5283 16.2486 14.666L17.7255 14.928C17.7654 14.7032 17.7853 14.4754 17.785 14.2471L16.285 14.2489ZM7.88869 6.77342C6.06575 7.09516 4.74009 8.68395 4.75006 10.535L6.25003 10.527C6.244 9.40676 7.04624 8.44529 8.1494 8.25058L7.88869 6.77342ZM4.75004 10.531V19H6.25004V10.531H4.75004ZM5.86683 19.6542L8.88283 17.9632L8.14926 16.6548L5.13326 18.3458L5.86683 19.6542ZM8.51604 18.059H14.016V16.559H8.51604V18.059ZM14.021 18.059C15.8485 18.047 17.4057 16.7293 17.7199 14.9289L16.2422 14.6711C16.0527 15.757 15.1134 16.5518 14.0111 16.559L14.021 18.059ZM8.75801 7.64021C8.94671 6.55256 9.88748 5.75633 10.9914 5.74999L10.9827 4.25001C9.15263 4.26052 7.59293 5.58059 7.28008 7.38379L8.75801 7.64021ZM10.987 5.75H16.487V4.25H10.987V5.75ZM16.4806 5.74997C17.7437 5.76075 18.7593 6.79252 18.7501 8.05554L20.25 8.06646C20.2652 5.97576 18.5841 4.26786 16.4934 4.25003L16.4806 5.74997ZM18.75 8.061V11.777H20.25V8.061H18.75ZM18.7501 11.782C18.7576 12.9034 17.955 13.8665 16.8507 14.0614L17.1114 15.5386C18.9362 15.2165 20.2624 13.6249 20.25 11.772L18.7501 11.782Z" fill="#000000"/></svg>
                <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">WooCommerce</h5>                  
            </div>                                                     

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Disable WooCommerce cart fragments</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Disables wc-cart-fragments to reduce sitewide JS and AJAX requests. Only enable if you do not need live cart count updates in the header.
                    <br/>
                    <br/>
                    <br/>
                    <br/>                    
                </p>       


    </div>
</template>