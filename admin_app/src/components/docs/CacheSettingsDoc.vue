<script setup>
const isProBuild = __PLUGIN_TYPE__ === 'pro';

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
  

    <!-- Nonce replacement is available only in the Pro build. -->
    

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
      Specify a line separated list of (partial) URLs where no caching should take place.
      
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

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Device Paths</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Allows you to create separate caches for:
    </p>    

    <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
      
      <li>Cookies</li>
    </ul>

    
    
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal mt-3">
      <strong>Switch the Cache Path</strong> will change the cache path from /wp-content/cache/ to /wp-content/upload. The is sometimes necessary for compatibility with other plugins and some hosts. 
    </p>        

    

  </div>
</template>
