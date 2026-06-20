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

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Preload Image</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                This is a recommended feature for every site. Adding an image here will activate image lazy loading and set a default image to be displayed before the real image is loaded. 
                It's recommended that you choose a very lightweight SVG image here. 
            </p>

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Skip Lazyloading</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Allows you to skip the lazyloading of certain images. This would normally be for images that are shown above the fold. For example, you should skip lazyloading of your logo. 
                Any images that are added here will be preloaded by default. 
            </p>      

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Force Lazyloading</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Allows you to force the lazyloading of certain images. This would normally be for images that have been identified as an LCP image at desktop but are shown above the fold at mobile.
            </p>    

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Image Optimisation</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                We hook into the CompressX plugin by <a href='https://compressx.io/'>https://compressx.io/</a> for image optimisation. We have no connection with them and they are not endorsed by us. 
                We just really like their plugin! So we decided to make it extra easy to install and configure within SpeedifyPress. Just follow the Wizard and you're good to go.
            </p>                                


    </div>
</template>