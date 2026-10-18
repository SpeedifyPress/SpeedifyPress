<script setup>
const isProBuild = __PLUGIN_TYPE__ === 'pro';
const emit = defineEmits(['changeColumn']);
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

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Choose the Unused CSS Mode</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      When you first install the plugin, the CSS setting will be set to 
      <span class="bg-yellow-100 text-yellow-800 me-1 px-2.5 py-0.5 rounded dark:bg-yellow-700 dark:text-yellow-300 border border-yellow-700 rounded-lg">Preview Mode</span>. 
      This allows you to test the plugin as an admin and ensure that unused CSS is removed as expected.
    </p>

    <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2 mb-4">
      <li><strong>Visit some pages</strong> on your site.</li>
      <li><strong>Scroll and wait</strong> a few seconds on each page.</li>
      <li>Keep <a @click.prevent="emit('changeColumn', 'Dashboard')" href="#">The Dashboard</a> open in another tab.</li>
      <li>Monitor the <strong>Cache Status</strong>—the number of files & pages should increase.</li>
      <li><strong>Revisit the pages</strong>—they should now load with optimized CSS.</li>
      <li>⚠️ If not, try clearing your page cache (most caches should update automatically).</li>
    </ul>                 

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Choose the Inclusion Method</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Decide how your optimized CSS is loaded:
    </p>
    <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
      <li>⚡ <strong>Inline CSS:</strong> Inserts all styles at the top of the document, improving Google PageSpeed Insights scores.</li>
      <li>📁 <strong>External CSS Files:</strong> Loads individual CSS files, making navigation smoother by caching CSS across multiple pages.</li>
    </ul>

    <!-- Filters -->
    <div class="flex items-left mt-4">
      <svg :class="iconclass" class="mr-1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.241,7.646L13,19v9l6-4v-5l9.759-11.354C29.315,6.996,28.848,6,27.986,6H4.014C3.152,6,2.685,6.996,3.241,7.646z" 
        fill="#f7f7f7" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
      </svg>
      <h5 class="text-lg font-bold leading-none text-raisin dark:text-white">Filters</h5>
    </div>

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Force Include Selectors</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Use this option to always include specific CSS selectors. If elements lose their styling, it’s likely because JavaScript dynamically adds the CSS.
    </p>    

    <h6 class="mt-2 font-semibold text-gray-900 dark:text-white">🔧 How to fix it:</h6>
    <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
      <li>Ensure that <strong>Preview Mode</strong> is enabled.</li>
      <li>Open an incognito tab and visit the same page where styling is incorrect.</li>
      <li>Right-click the affected element and select <strong>Inspect</strong>.</li>
      <li>Find the CSS class responsible for applying the correct styles.</li>
      <li>Add that class to the <strong>Force Include Selectors</strong> list.</li>
      <li>♻️ Clear the cache and check if the issue is resolved.</li>
    </ul>        

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Force Ignore URLs</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Specify URLs where <strong>no CSS optimization</strong> should occur. Supports <strong>full URLs</strong> and <strong>regular expressions</strong>.
    </p>                     

    <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Force Ignore Cookies</h5>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
      Exclude CSS processing based on cookie values.  
      Example:
    </p>
    <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
      <li>🔑 <i>wordpress_logged_in_</i> → Excludes logged-in users.</li>
      <li>🛒 <i>woocommerce_cart_hash</i> → Excludes users with an item in their cart.</li>
    </ul>                     

    



  </div>
</template>
