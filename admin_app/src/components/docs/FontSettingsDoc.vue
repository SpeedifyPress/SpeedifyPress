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

            <!-- Google options -->
            <div class="flex items-left mt-4">
                <svg :class="iconclass" class="mr-2" viewBox="0 0 56.6934 56.6934" width="56.6934px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M51.981,24.4812c-7.7173-0.0038-15.4346-0.0019-23.1518-0.001c0.001,3.2009-0.0038,6.4018,0.0019,9.6017  c4.4693-0.001,8.9386-0.0019,13.407,0c-0.5179,3.0673-2.3408,5.8723-4.9258,7.5991c-1.625,1.0926-3.492,1.8018-5.4168,2.139  c-1.9372,0.3306-3.9389,0.3729-5.8713-0.0183c-1.9651-0.3921-3.8409-1.2108-5.4773-2.3649  c-2.6166-1.8383-4.6135-4.5279-5.6388-7.5549c-1.0484-3.0788-1.0561-6.5046,0.0048-9.5805  c0.7361-2.1679,1.9613-4.1705,3.5708-5.8002c1.9853-2.0324,4.5664-3.4853,7.3473-4.0811c2.3812-0.5083,4.8921-0.4113,7.2234,0.294  c1.9815,0.6016,3.8082,1.6874,5.3044,3.1163c1.5125-1.5039,3.0173-3.0164,4.527-4.5231c0.7918-0.811,1.624-1.5865,2.3908-2.4196  c-2.2928-2.1218-4.9805-3.8274-7.9172-4.9056C32.0723,4.0363,26.1097,3.995,20.7871,5.8372  C14.7889,7.8907,9.6815,12.3763,6.8497,18.0459c-0.9859,1.9536-1.7057,4.0388-2.1381,6.1836  C3.6238,29.5732,4.382,35.2707,6.8468,40.1378c1.6019,3.1768,3.8985,6.001,6.6843,8.215c2.6282,2.0958,5.6916,3.6439,8.9396,4.5078  c4.0984,1.0993,8.461,1.0743,12.5864,0.1355c3.7284-0.8581,7.256-2.6397,10.0725-5.24c2.977-2.7358,5.1006-6.3403,6.2249-10.2138  C52.5807,33.3171,52.7498,28.8064,51.981,24.4812z"/></svg>
                <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Google options</h5>                  
            </div>        

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Locally host Google fonts</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Select this to serve Google Fonts locally, rather than downloading them from the Google website. You should select this in order for the "Only preload fonts on desktop" option to work properly. 
            </p>            

            <span class="pro">

                <!-- Preload options -->
                <div class="flex items-left mt-4">
                    <svg :class="iconclass" class="mr-2" viewBox="0 0 128 128" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M96.1,103.6c-10.4,8.4-23.5,12.4-36.8,11.1c-10.5-1-20.3-5.1-28.2-11.8H44v-8H18v26h8v-11.9c9.1,7.7,20.4,12.5,32.6,13.6   c1.9,0.2,3.7,0.3,5.5,0.3c13.5,0,26.5-4.6,37-13.2c19.1-15.4,26.6-40.5,19.1-63.9l-7.6,2.4C119,68.6,112.6,90.3,96.1,103.6z"/><path d="M103,19.7c-21.2-18.7-53.5-20-76.1-1.6C7.9,33.5,0.4,58.4,7.7,81.7l7.6-2.4C9,59.2,15.5,37.6,31.9,24.4   C51.6,8.4,79.7,9.6,98,26H85v8h26V8h-8V19.7z"/></g></svg>
                    <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Preload options</h5>                   
                </div>                 

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Preload fonts</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    This is a recommended feature for every site. It will prevent the flash of unstyled fonts that can happen on page load. 
                </p>

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Don't preload icon fonts</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Recommended for every site. It's generally not necessary to preload these, as they don't flash and the preload can be render blocking.                 
                </p>    

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Don't preload fonts on mobile</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    Recommended for every site. Font files on mobile are generally too heavy and preloading them will prevent high pagespeed scores. 
                </p>                

            </span>  

            <!-- Advanced options -->
            <div class="flex items-left mt-4">
                <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M21 5V3H3V5H21Z" fill="currentColor"/><path d="M21 19V21H3V19H21Z" fill="currentColor"/><path clip-rule="evenodd" d="M12.0001 7.37636C11.602 7.35207 11.2112 7.56874 11.0325 7.95204L7.65154 15.2025C7.41815 15.7031 7.6347 16.2981 8.13522 16.5315C8.63577 16.7649 9.23074 16.5484 9.46417 16.0477L9.95278 14.9999H14.0473L14.5359 16.0477C14.7693 16.5484 15.3643 16.7649 15.8648 16.5315C16.3654 16.2981 16.5819 15.7031 16.3485 15.2025L12.9676 7.95204C12.7888 7.56874 12.3981 7.35207 12.0001 7.37636ZM13.1147 12.9999H10.8854L12.0001 10.6095L13.1147 12.9999Z" fill="currentColor" fill-rule="evenodd"/></svg>
                <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Advanced options</h5>                  
            </div>            

            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Lazy load icon fonts</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Recommended if you have icon fonts below the fold and they're causing render blocking. Will load in the icon fonts upon user interaction with the page.                 
            </p>                        
    
            <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Use system fonts on mobile</h5>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Recommended for every site, in conjunction with "Only preload fonts on desktop". Instead of font files, system fonts are used on mobile which is much quicker. To overwrite the system fonts,
                just replace the "--spdy-ui-font" for the selector in question. For example, this would replace H1 and H2 on mobile with Times New Roman:<br/>
                <code>
                     @media (max-width: 800px) {<br/>
                            &nbsp;&nbsp;h1, h2 {<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;--spdy-ui-font: "Times New Roman", serif !important;<br/>
                            &nbsp;&nbsp;}<br/>
                     }<br/>
                </code>
                <br/>
                <br/>
            </p>            

            <span class="community">

                <h5 class="mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Preload fonts intelligently</h5>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                    The system will automatically detect fonts and preload them. However, it won't preload icons fonts and it won't preload fonts on mobile.
                </p>   

            </span>


    </div>
</template>