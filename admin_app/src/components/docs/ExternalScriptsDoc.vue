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


            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Locally host gtag.js</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                If you are using the standard Google Analytics tag then this generally results in a performance hit. One way to improve things is to host the file locally. 
                Ticking this option will download the remote file and setup a cron job to ensure it's always kept up to date. 
                This is the recommended method for most sites using GA. 
            </p>

            
         


    </div>
</template>
