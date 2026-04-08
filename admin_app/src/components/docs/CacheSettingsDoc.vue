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

    <!-- Mode Selection -->
    <div class="flex items-left mt-4">
      <svg :class="iconclass" class="mr-1" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h48v48H0V0zm0 0h48v48H0V0z" fill="none"/>
        <path d="M26 24h14v3H26zm0-5h14v3H26zm0 10h14v3H26zM42 8H6c-2.2 0-4 1.8-4 4v26c0 2.2 1.8 4 4 4h36c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4zm0 30H24V12h18v26z"/>
      </svg>
      <h5 class="text-lg font-bold leading-none text-raisin dark:text-white">Mode Selection</h5>
    </div>        

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Choose the Cache Mode</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      When you first install the plugin, the mode setting will be set to 
      <span class="bg-red-100 text-red-800 me-1 px-2.5 py-0.5 rounded dark:bg-red-100 dark:text-yellow-300 border border-red-700 rounded-lg">Fully Disabled</span>. 
      This means that no caching will take place until you enable it and update the mode
    </p>

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Choose the page preload mode</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
         Here you can choose how the plugin should perform page preloading. This is when the page for the user's next visit is preloaded before they visit it. 
         <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
          <li>"On hover" will prefetch the page when the user hovers over the link on desktop. On mobile it'll start the prefetch when they touch the link (before releasing it). Uses prefetch and will fetch all links (cached or not)</li>
          <li>"Intelligent" will prerender links as soon as they enter the viewport (or prefetch if that's not supported). It uses sensible throttles and will only preload links that are in the cache. Non-cached links default to the onhover method.</li>
        </ul>
    </p>

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Choose the cache lifetime</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      This decides how long your cached files will last for being automatically deleted. <i>Never Expires</i> is the recommended but it's possible you could run into issues with expired nonce (in which case, set to 6hrs)
    </p>    
  

    <!-- Filters -->
    <div class="flex items-left mt-4">
      <svg :class="iconclass" class="mr-1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.241,7.646L13,19v9l6-4v-5l9.759-11.354C29.315,6.996,28.848,6,27.986,6H4.014C3.152,6,2.685,6.996,3.241,7.646z" 
        fill="#f7f7f7" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
      </svg>
      <h5 class="text-lg font-bold leading-none text-raisin dark:text-white">Filters</h5>
    </div>

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Bypass When Cookies Present</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Enter a line seprate list of (partial) cookie names that, if detected, will prevent caching from taking place. For example:
    </p>                     
    <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
      <li>🔑 <i>wordpress_logged_in_</i> → Excludes logged-in users.</li>
      <li>🛒 <i>woocommerce_cart_hash</i> → Excludes users with an item in their cart.</li>
    </ul>        

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Bypass URLs</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Specify a line separated list of (partial) URLs where no caching should take place. For example, if you're caching logged in users you might want to add <i>my-account</i> here
    </p>                     

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Bypass User Agents</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
       Specify a line separated list of (partial) user agents for which no caching should take place
    </p>                     

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Ignore Querystrings</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Specify a line separated list of querystrings that should be ignored for caching. 
      For example, to ensure that users arriving from a Klaviyo newsletter all get the cached content <i>nb_klid</i> is necessary here. An extensive default list comes with the plugin. 
    </p>          

    <!-- Separate Caches -->
    <div class="flex items-left mt-4">
      <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polyline points="17 11 21 7 17 3"></polyline> <line x1="21" y1="7" x2="9" y2="7"></line> <polyline points="7 21 3 17 7 13"></polyline> <line x1="15" y1="17" x2="3" y2="17"></line> </g></svg>
      <h5 class="text-lg font-bold leading-none text-raisin dark:text-white">Cache Outputs</h5>
    </div>

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Device Paths & Compression</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Allows you to create separate caches for:
    </p>    

    <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
      <li>Mobile users. Use this if mobile users are shown a different site (rather than a responsive site)</li>
      <li>Cookies</li>
    </ul>

    <span class="pro">
      <p class="text-gray-500 dark:text-gray-400 text-sm font-normal mt-3">
        Also allows you to force gzipped compressed output if this (or brotli) hasn't already been setup on the server. 
      </p>    
    </span>
    
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal mt-3">
      <strong>Switch the Cache Path</strong> will change the cache path from /wp-content/cache/ to /wp-content/upload. The is sometimes necessary for compatibility with other plugins and some hosts. 
    </p>        

    <span class="pro">

      <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Logged in users (BETA)</h5>
      <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
        This BETA feature allows you to exclude certain areas from logged-in caching. The options work as follows:
      </p>       

      <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
        <li>Area. Use a CSS selector to define the area or areas of the page not to be cached</li>
        <li>Skeleton. Area will be hidden with a skeleton while they are loaded in. Choose the skeleton type to use. </li>
        <li>Delay JS Execution. Selecting this option will ensure that any JS applied to the replacement areas will run properly, as all JS will only run after the swap. Will only work is Delay JS is enabled for the page.</li>
      </ul>  

      <!-- Logged in cache -->
      <div class="flex items-left mt-4">
        <svg :class="iconclass" class="mr-2" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><title data-v-2766e06f=""></title><path data-v-2766e06f="" d="M85.57,446.25H426.43a32,32,0,0,0,28.17-47.17L284.18,82.58c-12.09-22.44-44.27-22.44-56.36,0L57.4,399.08A32,32,0,0,0,85.57,446.25Z" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"></path><path data-v-2766e06f="" d="M250.26,195.39l5.74,122,5.73-121.95a5.74,5.74,0,0,0-5.79-6h0A5.74,5.74,0,0,0,250.26,195.39Z" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"></path><path data-v-2766e06f="" d="M256,397.25a20,20,0,1,1,20-20A20,20,0,0,1,256,397.25Z"></path></svg>
        <h5 class="text-lg font-bold leading-none text-raisin dark:text-white">Logged in cache (BETA)</h5>
      </div>

      <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Cached logged in users?</h5>
      <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
        Ticking this option means that the content for logged in users will be cached, with a separate cache for each user role.
      </p>    

      <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Exclude certain page areas from caching</h5>
      <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
        Adding a row here allows you to exclude certain page areas from being cached. For example, you may not want to have a part of the page that shows a user's name to be cached, as that will be different for each user.
      </p>    

      <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
        The options work as follows:
      </p>       

      <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
        <li><strong>FIND AREA</strong>. Use a CSS selector to define the area or areas of the page not to be cached</li>
        <li><strong>SKELETON</strong>. Area will be hidden with a skeleton while they are loaded in. Choose the skeleton type to use or add your own.</li>
        <li><strong>DELAY JS</strong> Selecting this option will ensure that any JS applied to the replacement areas will run properly, as all JS will only run after the swap. Will only work if Delay JS is enabled for the page.</li>
        <li><strong>NOTES</strong>. Sometimes it can be hard to remember what you've done - add notes here. </li>
      </ul>                     

    </span>

  </div>
</template>
