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

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Completion Triggers</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                This allows advanced users to change how the delay script re-fires onload and onready events that may have been missed due to the delay.
                Generally the default settings will be fire for most cases, especially when combined with custom executions to run on completion. Advanced users may wish to 
                change the defaults. 
            </p>                                                   

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Completion Events</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                If a users clicks or mouseovers before the JS has loaded to process that event, it will be lost unless this option is enabled. 
            </p>                                                   

        <span class="pro">

            <div class="flex items-left mt-4">
                <svg :class="iconclass" class="mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
                <h5 class="text-lg font-bold leading-none text-raisin dark:text-white">             
                   Force JS Inline
                </h5>
            </div>        

                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal mt-4">
                    Allows you to force certain JavaScript to load completely inline, and therefore won't be render blocking. It will still be delayed unless you add the script to the delay exceptions.
                </p>


            <div class="flex items-left mt-4">
                <svg :class="iconclass" class="mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
                <h5 class="text-lg font-bold leading-none text-raisin dark:text-white">             
                    Defer JavaScript
                </h5>
            </div>        

                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal mt-4">
                    Ticking the Defer JavaScript textbox will add the <i>defer</i> attribute to the script tag. This will defer the loading of the JavaScript until after the DOM has finished parsing (but before the DOM content is ready).  
                    Try this one first and see what the effect is on page speed. ⚡
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Exclude scripts from defer</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Enter any script name or partial script names here to have them excluded from deferring. It will match against the entire script block, including tags such as <i>rel</i> and the script contents.  
                    This can help prevent conflicts with essential scripts. 
                </p>            

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Exclude URLs from defer</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    JavaScript will not be deferred on any URLs that match strings or regular expressions entered here.  
                    Useful for ensuring key functionality remains intact. 
                </p>    



        </span> 


    </div>
</template>
