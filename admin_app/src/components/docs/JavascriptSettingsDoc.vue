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

        <div class="flex items-left mt-6 mb-4">
            <svg :class="iconclass" class="mr-1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"/></svg>
            <h5 class="text-lg font-bold leading-none text-raisin dark:text-white">             
                Delay JavaScript
            </h5>
        </div>

            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Ticking the Delay JavaScript textbox will delay the loading of JavaScript until either:
            </p>

            <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-3 mb-3">
                <li>The user interacts with the page in any way 🖱️</li>
                <li>A certain number of seconds (as configured) elapses ⏳</li>
            </ul>  

            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                This is a more aggressive method of deferring JavaScript and can sometimes cause issues with pages, depending on how exactly the JavaScript works.  
                For this reason, there are several further options available to configure the way this works:
            </p>

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Exclude scripts from delay</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Enter any script name or partial script names here to have them excluded from deferring. It will match against the entire script block, including tags such as <i>rel</i> and the script contents.  
                Useful for scripts that need to run immediately. 
            </p>   

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Exclude URLs from delay</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Enter any full or partial URLs here. If matched, no JavaScript delay will take place on that URL.  
                Helps avoid breaking key functionality. 🚧
            </p>   

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Load JavaScript First</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Enter any script name or partial script names here to bring them to the front of the load order.  
                Ideal for high-priority scripts. 🎯
            </p>   

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Load JavaScript Last</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Enter any script name or partial script names here to push them to the end of the load order.  
                This can improve perceived page speed. 🚀
            </p>   

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">JavaScript to run on completion</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Enter JavaScript here that should be run after all the scripts have finished loading.  
                Enter complete JavaScript with no script tags.
            </p>                                                   

         


    </div>
</template>
