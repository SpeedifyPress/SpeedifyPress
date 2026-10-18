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

        <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
            <strong>CSS Stats</strong> provide valuable insights into how CSS is being generated across your site and which plugins contribute to it.
        </p>

        <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
            <li>The <strong>Unused</strong> column shows the number of CSS files generated but <strong>not used</strong> on any page.</li>
            <li>The <strong>Used</strong> column displays the CSS files that are actively in use.</li>
            <li>Click on a row for a <strong>detailed breakdown</strong> of how CSS is applied across your site.</li>
        </ul>

        <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">By Plugin Folder</h5>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
            View a breakdown of <strong>CSS files generated per 📂 plugin folder</strong>. This helps identify which plugins contribute the most to your site's styles.
        </p>

        <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">By Path</h5>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
            Displays CSS caching stats <strong>for each 🔍 page path</strong>. This helps pinpoint where CSS is stored and how it's being utilized across different URLs.
        </p>

        <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">By Post Types</h5>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
            Groups CSS stats by <strong>📝 Post Type</strong>, allowing you to analyze <strong>which plugins affect different content types</strong>.
        </p>

        <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
            <li>If certain post types <strong>only</strong> fill the <strong>Unused</strong> column, they likely don’t need those styles—optimizing them can improve performance.</li>
        </ul>

    </div>
</template>
