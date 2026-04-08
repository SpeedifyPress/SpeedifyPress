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


            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Locally host gtag.js</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                If you are using the standard Google Analytics tag then this generally results in a performance hit. One way to improve things is to host the file locally. 
                Ticking this option will download the remote file and setup a cron job to ensure it's always kept up to date. 
                This is the recommended method for most sites using GA. 
            </p>

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Preload gtag.js</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Adds a preload in for the locally hosted gtag.js. You won't generally see a performance increase from this, but it can be worth testing.
            </p>

            <span class="pro">

                <hr class="mt-4 border-gray-200 dark:border-gray-700" />      

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Add scripts to Partytown</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    🎉 Partytown is an experimental feature that allows you load certain scripts via a web worker and therefore not in the main JavaScript thread. 
                    It was developed by <a href="https://partytown.builder.io/" target="_blank">https://partytown.builder.io/</a>. To add the locally hosted gtag here, just enter "local_tag" to the box. 
                    This will generally give a performance boost of a few points, but may affect the amount of sessions reported. It's therefore most suited to new sites. 
                </p>

            </span>
         


    </div>
</template>