<script setup>
import Skeleton from './../components/Skeleton.vue'
import Button from './../components/Button.vue'

import { api } from '../lib/api';

defineProps({
  icon: {
    type: String,
    required: false
  }, 
  iconclass: {
    type: String,
    required: false
  },
  plugin_type: {
    type: String,
    required: true
  },
  build_plugin_type: {
    type: String,
    required: true
  },
  pro_dashboard_config: {
    type: Object,
    required: true
  },
  isPro: {
    type: Boolean,
    required: true
  }       
})

import { defineEmits } from 'vue'

const emit = defineEmits(['changeColumn','showDocs'])

// Function to emit the column change event
function changeColumn(newColumn) {
  emit('changeColumn', newColumn)
}



</script>

<template>
  <div>

    <div v-if="dashboardData" class="flex flex-wrap items-start">

            <div class="w-full p-2 mr-4" >

                <div class="flex items-left mb-4">
                    <span v-html="icon" class="mr-2 force-gradient"></span>
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">Dashboard</h5>
                    <svg v-if="isPro" @click="emit('showDocs', 'Dashboard')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>          

            <div class="w-full max-w-lg p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="" v-if="dashboardData.cache_data">

                    <div class="flex items-left mb-4">
                      <svg :class="iconclass" class="mr-2" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM3.397 14.841a1.13 1.13 0 0 0 .401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 0 0-.375-.357 2.027 2.027 0 0 0-.566-.21l-.621-.144a.97.97 0 0 1-.404-.176.37.37 0 0 1-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.2-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 0 1 .152.326.505.505 0 0 1-.085.29.559.559 0 0 1-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 0 1-.248-.115.578.578 0 0 1-.255-.384h-.765ZM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 0 1 .302-.399.814.814 0 0 1 .475-.137c.15 0 .283.032.398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.441 1.441 0 0 0-.489-.272 1.838 1.838 0 0 0-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.799.799 0 0 1-.118.363.7.7 0 0 1-.272.25.874.874 0 0 1-.401.087.845.845 0 0 1-.478-.132.833.833 0 0 1-.299-.392 1.699 1.699 0 0 1-.102-.627v-.495ZM6.78 15.29a1.176 1.176 0 0 1-.111-.449h.764a.578.578 0 0 0 .255.384c.07.049.154.087.25.114.095.028.201.041.319.041.164 0 .301-.023.413-.07a.559.559 0 0 0 .255-.193.507.507 0 0 0 .085-.29.387.387 0 0 0-.153-.326c-.101-.08-.256-.144-.463-.193l-.618-.143a1.72 1.72 0 0 1-.539-.214 1 1 0 0 1-.351-.367 1.068 1.068 0 0 1-.123-.524c0-.244.063-.457.19-.639.127-.181.303-.322.527-.422.225-.1.484-.149.777-.149.304 0 .564.05.779.152.217.102.384.239.5.41.12.17.187.359.2.566h-.75a.56.56 0 0 0-.12-.258.624.624 0 0 0-.246-.181.923.923 0 0 0-.37-.068c-.216 0-.387.05-.512.152a.472.472 0 0 0-.184.384c0 .121.047.22.143.3a.97.97 0 0 0 .404.175l.621.143c.217.05.406.12.566.211.16.09.285.21.375.358.09.148.135.335.135.56 0 .247-.063.466-.188.656a1.216 1.216 0 0 1-.539.439c-.234.105-.52.158-.858.158-.254 0-.476-.03-.665-.09a1.404 1.404 0 0 1-.478-.252 1.13 1.13 0 0 1-.29-.375Z" fill-rule="evenodd"/></svg>
                      <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Unused CSS Mode - 
                        <span v-if="mode == 'disabled'" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">Disabled</span>
                        <span v-if="mode == 'enabled'" class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Enabled</span>
                        <span v-if="mode == 'preview'" class="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-700 dark:text-yellow-300">Preview Mode</span>
                        <span v-if="mode == 'stats'" class="bg-indigo-200 text-indigo-900 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-800 dark:text-indigo-300">Stats Only</span>
                      </h5>
                    </div>
                    <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">

                    <div class="grid grid-cols-[20px_1fr] gap-4">

                        <div class="w-[20px]">
                          <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
                              <svg class="w-4 h-4" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48h-48z" fill="none"></path><path d="M22 34h4v-12h-4v12zm2-30c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16zm-2-22h4v-4h-4v4z" fill="#000000"></path></svg>
                              <span class="sr-only">Info icon</span>
                          </div>
                        </div>
                        <div class="flex-1 ms-3 text-sm font-normal">
                            <span class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                                <span v-if="mode == 'enabled'">Complete functionality enabled</span>
                                <span v-if="mode == 'preview'">Just enabled for admins</span>
                                <span v-if="mode == 'stats'">Will just gather stats</span>
                                <span v-if="mode == 'disabled'">No replacements are made, you can just view existing stats</span>
                            </span>
                            <div class="mb-2 text-sm font-normal" v-if="mode == 'enabled'">Every new page view will generate unused CSS. Subsequent page views will use new CSS.</div> 
                            <div class="mb-2 text-sm font-normal" v-if="mode == 'preview'">As an admin you can view pages, test CSS and adjust. Users will get normal CSS.</div> 
                            <div class="mb-2 text-sm font-normal" v-if="mode == 'stats'">Plugin is just gathering stats. <a href="#" @click.prevent="changeColumn('Stats')">View them here.</a></div> 
                            <div class="mb-2 text-sm font-normal" v-if="mode == 'disabled'">Plugin will not change CSS in any way</div> 
                        </div>
                        <div class="w-[200px]">
                            <a 
                            @click.prevent="changeColumn('CSS Settings')"
                            href="#" 
                            class="inline-flex justify-center w-xs px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-600 dark:text-white hover:shadow-md"
                            >
                              <svg class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white no-gradient mr-1" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48H0z" fill="none"></path><path d="M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97L29 4.84c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97L9.9 10.1c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31C9.06 22.69 9 23.34 9 24s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zM24 31c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path></svg> Change Settings
                            </a> 
                        </div>                      

                    </div>


                  </div>
                  <!-- Loading skeleton -->
                  <div class="flex flex-wrap mt-4" v-else>

                      <Skeleton />

                  </div>                  


                </div>
            </div>        
        
            <div class="w-full max-w-sm p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow " >
                <div class="flex items-left mb-4">
                    <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19,12 L19,8.62081119 C17.3445598,9.50508911 14.8145288,10 12,10 C9.18547122,10 6.65544022,9.50508911 5,8.62081119 L5,12.0000003 C5,12.8370203 8.10127922,14 12,14 C15.8987208,14 19,12.8370203 19,12 Z M19,14.6208112 C17.3445598,15.5050891 14.8145288,16 12,16 C9.18547122,16 6.65544022,15.5050891 5,14.6208112 L5,18 C5,18.8370203 8.10127922,20 12,20 C15.8987208,20 19,18.8370203 19,18 L19,14.6208112 Z M3,6 C3,3.52331179 7.06216478,2 12,2 C16.9378352,2 21,3.52331179 21,6 L21,18 C21,20.4766882 16.9378352,22 12,22 C7.06216478,22 3,20.4766882 3,18 L3,6 Z M12,8 C15.8987208,8 19,6.83702029 19,6 C19,5.16297971 15.8987208,4 12,4 C8.10127922,4 5,5.16297971 5,6 C5,6.83702029 8.10127922,8 12,8 Z" fill-rule="evenodd"/></svg>
                    <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">CSS Cache Status</h5>
                    <svg @click="refreshCache" v-if="!refreshing" class="flex-shrink-0 w-4 h-4 inline-block mt-[-1px] cursor-pointer ml-auto no-gradient" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/></svg>
                    <svg v-if="refreshing" class="flex-shrink-0 w-4 h-4 inline-block mt-[-1px] animate-spin ml-auto no-gradient" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/></svg>
                </div>
                 <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
                <div class="flow-root">                  

                  <div class="ml-0" v-if="dashboardData.cache_data">
                    <p>
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <tr>
                                <td>Unique CSS files</td>
                                <td v-if="isPro" class="text-right"><a @click.prevent="changeColumn(pro_dashboard_config.cssStatsColumn)" href="#" class="text-cyan-600 hover:underline">{{ dashboardData.cache_data.num_css_files }}</a></td>
                                <td v-else class="text-right">{{ dashboardData.cache_data.num_css_files }}</td>
                            </tr>
                            <tr>
                                <td>Number of pages</td>
                                <td v-if="isPro" class="text-right"><a @click.prevent="changeColumn(pro_dashboard_config.cssStatsColumn)" href="#" class="text-cyan-600 hover:underline">{{ dashboardData.cache_data.num_lookup_files }}</a></td>
                                <td v-else class="text-right">{{ dashboardData.cache_data.num_lookup_files }}</td>
                            </tr>
                        </table>
                    </p>
                    <button @click="clearCache" type="submit" class="mt-4 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl hover:shadow-md">
                      <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md text-cyan-700">
                        <svg v-if="clearing.spinner" aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin mt-[-3px]" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" />
                        </svg>                        
                        <transition
                          enter-active-class="transition-opacity duration-700 ease-out"
                          enter-from-class="opacity-0"
                          enter-to-class="opacity-100"
                          leave-active-class="transition-opacity duration-0"
                          leave-from-class="opacity-100"
                          leave-to-class="opacity-0"
                          mode="out-in"
                        >                          
                          <svg v-if="clearing.success" class="inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g><polygon class="st0" points="434.8,49 174.2,309.7 76.8,212.3 0,289.2 174.1,463.3 196.6,440.9 196.6,440.9 511.7,125.8 434.8,49" fill="#41AD49" /></g>
                          </svg> 
                          <svg v-if="clearing.failure" class="inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient" viewBox="0 0 612 792" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g><polygon class="st0" points="382.2,396.4 560.8,217.8 484,141 305.4,319.6 126.8,141 50,217.8 228.6,396.4 50,575 126.8,651.8    305.4,473.2 484,651.8 560.8,575 382.2,396.4  " fill="#E44061"/></g>
                          </svg>                                                                     
                        </transition>
                        <span v-if="clearing.text">Clearing</span><span v-else>Clear Cache</span>
                        
                      </span>
                    </button>

                  </div>
                  <!-- Loading skeleton -->
                  <div class="flex flex-wrap mt-4" v-else>

                      <Skeleton  />

                  </div>                  


                </div>
            </div>  

            <div class="w-full max-w-lg p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="" v-if="dashboardData.cache_data">

                    <div class="flex items-left mb-4">
                      <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M4 3h14l2.707 2.707a1 1 0 0 1 .293.707V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 1v5h9V4H7zm-1 8v7h12v-7H6zm7-7h2v3h-2V5z"/></g></svg>
                      <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Cache Mode - 
                        <span v-if="cache_mode == 'disabled'" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">Disabled</span>
                        <span v-if="cache_mode == 'enabled'" class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Enabled</span>
                      </h5>
                    </div>
                    <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">

                    <div class="grid grid-cols-[20px_1fr] gap-4">

                        <div class="w-[20px]">
                          <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
                              <svg class="w-4 h-4" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48h-48z" fill="none"></path><path d="M22 34h4v-12h-4v12zm2-30c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16zm-2-22h4v-4h-4v4z" fill="#000000"></path></svg>
                              <span class="sr-only">Info icon</span>
                          </div>
                        </div>
                        <div class="flex-1 ms-3 text-sm font-normal">
                            <span class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                                <span v-if="cache_mode == 'enabled'">Complete functionality enabled</span>
                               <span v-if="cache_mode == 'disabled'">No caching will take place</span>
                            </span>
                            <div class="mb-2 text-sm font-normal" v-if="cache_mode == 'enabled'">
                              Cache file will  
                              <span v-if="cache_lifetime > 0">regenerate every {{ cache_lifetime }} hours</span>
                              <span v-else>never regenerate</span>
                            </div>                                                        
                            <div class="mb-2 text-sm font-normal" v-if="cache_mode == 'disabled'">Enable caching to use this feature</div> 
                        </div>
                        <div class="w-[200px]">
                            <a 
                            @click.prevent="changeColumn('Cache Settings')"
                            href="#" 
                            class="inline-flex justify-center w-xs px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-600 dark:text-white hover:shadow-md"
                            >
                              <svg class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white no-gradient mr-1" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48H0z" fill="none"></path><path d="M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97L29 4.84c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97L9.9 10.1c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31C9.06 22.69 9 23.34 9 24s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zM24 31c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path></svg> Change Settings
                            </a> 
                        </div>                      

                    </div>


                  </div>
                  <!-- Loading skeleton -->
                  <div class="flex flex-wrap mt-4" v-else>

                      <Skeleton />

                  </div>                  


                </div>
            </div>        
        
            <div class="w-full max-w-sm p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow " >
                <div class="flex items-left mb-4">
                    <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19,12 L19,8.62081119 C17.3445598,9.50508911 14.8145288,10 12,10 C9.18547122,10 6.65544022,9.50508911 5,8.62081119 L5,12.0000003 C5,12.8370203 8.10127922,14 12,14 C15.8987208,14 19,12.8370203 19,12 Z M19,14.6208112 C17.3445598,15.5050891 14.8145288,16 12,16 C9.18547122,16 6.65544022,15.5050891 5,14.6208112 L5,18 C5,18.8370203 8.10127922,20 12,20 C15.8987208,20 19,18.8370203 19,18 L19,14.6208112 Z M3,6 C3,3.52331179 7.06216478,2 12,2 C16.9378352,2 21,3.52331179 21,6 L21,18 C21,20.4766882 16.9378352,22 12,22 C7.06216478,22 3,20.4766882 3,18 L3,6 Z M12,8 C15.8987208,8 19,6.83702029 19,6 C19,5.16297971 15.8987208,4 12,4 C8.10127922,4 5,5.16297971 5,6 C5,6.83702029 8.10127922,8 12,8 Z" fill-rule="evenodd"/></svg>
                    <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Page Cache Status</h5>
                    <svg @click="refreshPageCache" v-if="!refreshing_page" class="flex-shrink-0 w-4 h-4 inline-block mt-[-1px] cursor-pointer ml-auto no-gradient" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/></svg>
                    <svg v-if="refreshing_page" class="flex-shrink-0 w-4 h-4 inline-block mt-[-1px] animate-spin ml-auto no-gradient" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/></svg>
                </div>
                 <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
                <div class="flow-root">                  

                  <div class="ml-0" v-if="dashboardData.page_cache_data">
                    <p>
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <tr>
                                <td>Pages cached</td>
                                <td class="text-right">{{ dashboardData.page_cache_data.count }}</td>
                            </tr>
                            <tr>
                                <td>Oldest file</td>
                                <td class="text-right">{{ dashboardData.page_cache_data.oldest }}</td>
                            </tr>
                            <tr>
                                <td>Most recent file</td>
                                <td class="text-right">{{ dashboardData.page_cache_data.newest }}</td>
                            </tr>
                            <tr>
                                <td>Average file age</td>
                                <td class="text-right">{{ dashboardData.page_cache_data.average_age }}</td>
                            </tr>
                        </table>
                    </p>
                    <button @click="clearPageCache" type="submit" class="mt-4 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl hover:shadow-md">
                      <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md text-cyan-700">
                        <svg v-if="clearing_page.spinner" aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin mt-[-3px]" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" />
                        </svg>                        
                        <transition
                          enter-active-class="transition-opacity duration-700 ease-out"
                          enter-from-class="opacity-0"
                          enter-to-class="opacity-100"
                          leave-active-class="transition-opacity duration-0"
                          leave-from-class="opacity-100"
                          leave-to-class="opacity-0"
                          mode="out-in"
                        >                          
                          <svg v-if="clearing_page.success" class="inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g><polygon class="st0" points="434.8,49 174.2,309.7 76.8,212.3 0,289.2 174.1,463.3 196.6,440.9 196.6,440.9 511.7,125.8 434.8,49" fill="#41AD49" /></g>
                          </svg> 
                          <svg v-if="clearing_page.failure" class="inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient" viewBox="0 0 612 792" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g><polygon class="st0" points="382.2,396.4 560.8,217.8 484,141 305.4,319.6 126.8,141 50,217.8 228.6,396.4 50,575 126.8,651.8    305.4,473.2 484,651.8 560.8,575 382.2,396.4  " fill="#E44061"/></g>
                          </svg>                                                                     
                        </transition>
                        <span v-if="clearing_page.text">Clearing</span><span v-else>Clear Cache</span>
                        
                      </span>
                    </button>

                  </div>
                  <!-- Loading skeleton -->
                  <div class="flex flex-wrap mt-4" v-else>

                      <Skeleton rows="2" />

                  </div>                  


                </div>
            </div>              
       
            <div class="w-full max-w-lg p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow xxl:mt-[-50px]" >

                <div class="flow-root">                  

                  <div class="" v-if="dashboardData.cache_data">

                    <div class="flex items-left mb-4">
                      <svg :class="iconclass" class="mr-2" viewBox="-698.001 870.198 410.847 510.719"
                        enable-background="new -698.001 870.198 410.847 510.719" xml:space="preserve">
                      <defs>
                      </defs>
                      <path fill="" stroke="" stroke-width="20" stroke-miterlimit="10" d="M-488.666,1196.174
                        c4.219-4.729,8.567-9.894,13.052-15.49c4.479-5.591,9.013-11.249,13.6-16.974c3.957-4.939,7.865-9.816,11.724-14.633
                        c3.854-4.811,7.552-9.426,11.098-13.853c3.752-4.683,5.1-9.688,4.033-15.029c-1.061-5.335-3.546-9.567-7.448-12.694
                        c-0.519-0.415-0.841-0.674-0.976-0.781c-0.128-0.103-0.323-0.259-0.585-0.469c-4.63-3.279-9.318-4.363-14.053-3.251
                        c-4.74,1.117-9.505,4.667-14.298,10.648c-20.008,24.973-44.582,39.351-73.722,43.122c-29.145,3.778-55.056-3.427-77.743-21.604
                        c-0.524-0.42-1.042-0.836-1.567-1.256c-0.518-0.415-1.042-0.835-1.567-1.255c-20.808-18.373-32.166-41.469-34.084-69.273
                        c-1.912-27.801,5.772-52.497,23.074-74.093c6.668-8.322,13.805-17.23,21.416-26.729c7.606-9.493,15.265-19.054,22.979-28.681
                        c5.81-7.251,21.994-27.45,43.011-53.683h-46.43h-40.847c-27.614,0-50,22.386-50,50v390.719c0,27.614,22.386,50,50,50h9.146
                        c56.809-70.751,118.948-148.231,121.587-151.525C-502.373,1213.282-496.169,1205.539-488.666,1196.174z"/>
                      <path fill="" stroke="" stroke-width="20" stroke-miterlimit="10" d="M-297.154,1080.198
                        c0-92.762-63.156-170.763-148.811-193.377c-29.376,36.776-57.106,71.441-59.396,74.299c-5.002,6.243-11.383,13.945-19.148,23.1
                        c-3.961,4.944-8.128,10.146-12.505,15.608s-8.754,10.926-13.13,16.389c-3.962,4.944-7.923,9.889-11.88,14.827
                        c-3.961,4.945-7.713,9.628-11.255,14.048c-2.921,3.646-4.536,7.798-4.851,12.451c-0.313,4.663,1.401,8.919,5.143,12.77
                        c0.358,0.286,0.691,0.554,0.978,0.783c0.39,0.313,0.719,0.576,0.976,0.781c5.463,4.377,11.151,5.411,17.06,3.098
                        c5.915-2.31,11.208-5.856,15.898-10.647c1.303-1.089,2.422-2.224,3.36-3.395s1.925-2.402,2.97-3.707
                        c19.799-24.711,43.211-38.738,70.231-42.076s51.559,3.619,73.621,20.864c22.01,16.784,34.63,39.278,37.861,67.495
                        c3.237,28.221-3.54,53.334-20.319,75.339c-4.121,5.668-8.615,11.678-13.483,18.028c-4.874,6.346-9.917,12.776-15.124,19.276
                        c-1.251,1.561-2.555,3.188-3.908,4.877c-1.358,1.695-2.657,3.317-3.908,4.878c-5.627,7.023-11.117,13.737-16.452,20.135
                        c-5.347,6.397-9.994,12.073-13.951,17.012c-0.437,0.545-3.404,4.246-8.341,10.401
                        C-360.091,1250.687-297.154,1172.799-297.154,1080.198z"/>
                      </svg>
                      <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Plugin Mode - 
                        <span v-if="plugin_mode == 'disabled'" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">Disabled</span>
                        <span v-if="plugin_mode == 'enabled'" class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Enabled</span>
                        <span v-if="plugin_mode == 'partial'" class="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">Partial</span>
                      </h5>
                    </div>
                    <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">

                      <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="plugin_mode" ref="plugin_mode">

                        <ul class="grid w-full gap-2 md:grid-cols-3 mb-3">
                            <li>
                                <input type="radio" id="mode-enabled" name="plugin_mode" value="enabled" class="!hidden peer" required v-bind:checked="plugin_mode === 'enabled'" @change="setPartialTextboxDisplay('hidden')" />

                                <label for="mode-enabled" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600 peer-checked:border-green-700 peer-checked:text-green-800 peer-checked:bg-green-100">                           
                                    <div class="block">
                                        <div class="w-full text-sm font-semibold">Fully Enabled Sitewide</div>
                                    </div>
                                </label>
                            </li>
                            <li>
                                <input type="radio" id="mode-disabled" name="plugin_mode" value="disabled" class="!hidden peer" v-bind:checked="plugin_mode === 'disabled'" @change="setPartialTextboxDisplay('hidden')">
                                <label for="mode-disabled" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-red-700 peer-checked:text-red-800 peer-checked:bg-red-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div class="block">
                                        <div class="w-full text-sm font-semibold">Fully Disabled Sitewide</div>
                                    </div>
                                </label>
                            </li>                        
                            <li>
                                <input type="radio" id="mode-partial" name="plugin_mode" value="partial" class="!hidden peer" v-bind:checked="plugin_mode === 'partial'" @change="setPartialTextboxDisplay('show')">
                                <label for="mode-partial" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-indigo-700 peer-checked:text-indigo-800 peer-checked:bg-indigo-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div class="block">
                                        <div class="w-full text-sm font-semibold">Disabled for certain URLs</div>
                                    </div>
                                </label>
                            </li>                        

                        </ul>

                        <textarea 
                          @keyup="handleKeyup"
                          id="disable_urls" 
                          name="disable_urls"  
                          class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                          v-model="disable_urls"
                          style="box-shadow:inherit!important"
                          v-if="plugin_mode === 'partial' || partial_textbox_display === 'show'"
                        ></textarea>                    
                        <p  
                        v-if="plugin_mode === 'partial' || partial_textbox_display === 'show'"
                        id="helper-text-explanation" 
                        class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">URLs or querystrings to disable the plugin on</p>                        

                        <Button config_key="plugin" title="Update Mode" id="plugin_mode" :status_object="buttons" />

                        <div v-if="mode_error" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">{{ mode_error }}</div>

                      </form>

                  </div>
                  <!-- Loading skeleton -->
                  <div class="flex flex-wrap mt-4" v-else>

                      <Skeleton />

                  </div>                  


                </div>
            </div>

            <div class="w-full max-w-sm p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow">
                <div class="flex items-left mb-4">
                    <svg :class="iconclass" class="mr-2" viewBox="0 0 48 48" width="48px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><polygon fill="#241F20" points="0,2.641 0,35.641 25.761,35.641 25.761,31.641 4,31.641 4,6.641 44,6.641 44,14.391 48,14.391    48,2.641  "/><polygon fill="#241F20" points="41.959,14.391 41.959,11.703 41.959,8.641 38.896,8.641 31.959,8.641 31.959,11.703 38.896,11.703    38.896,14.391  "/><polygon fill="#241F20" points="9.062,11.703 16,11.703 16,8.641 9.062,8.641 6,8.641 6,11.703 6,14.391 9.062,14.391  "/><polygon fill="#241F20" points="16.042,29.683 16.042,26.62 9.104,26.62 9.104,23.933 6.042,23.933 6.042,26.62 6.042,29.683    9.104,29.683  "/><path d="M38.303,17.391c-5.27,0-9.542,4.272-9.542,9.542c0,3.558,1.951,6.655,4.839,8.296v3.267v0.229v6.636   l4.709-4.875l4.697,4.875v-6.636v-0.229v-3.267c2.887-1.641,4.838-4.738,4.838-8.296C47.844,21.663,43.572,17.391,38.303,17.391z    M38.302,31.642c-2.6,0-4.708-2.108-4.708-4.708c0-2.601,2.108-4.708,4.708-4.708c2.601,0,4.708,2.108,4.708,4.708   C43.01,29.533,40.902,31.642,38.302,31.642z" fill="#241F20"/></g></svg>
                    <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">License Status -
                        <span v-if="isWordPressOrgBuild" class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300">WordPress.org</span>
                        <span v-else-if="dashboardData.license_data.license_status == 'inactive'" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">Inactive</span>
                        <span v-else-if="dashboardData.license_data.license_status == 'active'" class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Active</span>
                    </h5>                        
                    <svg @click="doWizard(0)" v-if="awaiting_license == true" class="cursor-pointer flex-shrink-0 w-4 h-4 inline-block mt-[-1px] ml-auto rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg> 
                </div>
                 <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
                <div class="flow-root">              


                  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-4">                                
                    <tbody>
                        <tr class="">                                              
                          <td class="w-1/2 text-gray-900 dark:text-white">
                              Build
                          </td>                    
                          <td class="text-right">
                            <span v-if="build_plugin_type=='community'" v-html="'<strong>' + build_plugin_type + '</strong>'" class="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300 inline-block"></span>
                            <span v-else-if="build_plugin_type=='pro'" v-html="'<strong>' + build_plugin_type + '</strong>'" class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300 inline-block"></span>
                            <span v-else-if="build_plugin_type=='wordpressorg'" class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300 inline-block"><strong>wordpress.org</strong></span>
                          </td>                    
                        </tr>
                        <tr class="">                                              
                          <td class="w-1/2 text-gray-900 dark:text-white">
                              License
                          </td>                    
                          <td class="text-right">
                            <span v-if="license_type=='community'" v-html="'<strong>' + license_type + '</strong>'" class="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300 inline-block"></span>
                            <span v-else-if="license_type=='pro'" v-html="'<strong>' + license_type + '</strong>'" class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300 inline-block"></span>
                            <span v-else-if="license_type=='wordpress.org'" class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300 inline-block"><strong>wordpress.org</strong></span>
                            <span v-else-if="license_type=='None'" v-html="'<strong>' + license_type + '</strong>'" class="bg-orange-100 text-orange-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300 inline-block"></span>
                          </td>                    
                        </tr>
                        <tr class="" v-if="!isWordPressOrgBuild && dashboardData.license_data.allowed_hosts > 0">                                              
                          <td class="w-1/2 text-gray-900 dark:text-white">
                              Hosts
                          </td>                    
                          <td class="text-right">
                              <span v-if="dashboardData.license_data.allowed_hosts" v-html="'<strong>' + dashboardData.license_data.allowed_hosts + '</strong>'" class="bg-cyan-100 text-cyan-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300"></span>                        
                          </td>                    
                        </tr>                              
                        <tr class="" v-if="!isWordPressOrgBuild && dashboardData.license_data.license_ends_days && dashboardData.license_data.license_status_verb">                                              
                          <td class="w-1/2 text-gray-900 dark:text-white">
                              License {{ dashboardData.license_data.license_status_verb }}
                          </td>                    
                          <td class="text-right">
                              <a v-if="license_type!='community'" href='https://speedifypress.lemonsqueezy.com/billing' target='_blank' class="underline">
                                <span v-if="dashboardData.license_data.license_ends_days" v-html="'<span style=\'transform: rotate(-45deg);display:inline-block\'>&#x2192;</span> <strong>' + dashboardData.license_data.license_ends_days + '</strong>'" class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300"></span>                                                      
                              </a>
                              <span v-else-if="dashboardData.license_data.license_ends_days" v-html="'<strong>' + dashboardData.license_data.license_ends_days + '</strong>'" class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300"></span>                                                      
                          </td>                    
                        </tr>                              
                    </tbody>
                  </table>        

                  <div class="ml-0" v-if="license_number != null">

                    <span v-if="license_type=='pro' && build_plugin_type == 'community'" v-html="'You have a <strong>' + license_type + '</strong> license but are running the <strong>community</strong> build. Check your purchase email for instructions on how to download the pro build.'" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-2.5 rounded-[15px] dark:bg-cyan-900 dark:text-cyan-300 mb-4 inline-block"></span>

                    <div v-if="isWordPressOrgBuild && wanting_license_pro == false">
                      <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
                        This WordPress.org build is active and does not require a separate license.
                      </p>
                      <ul class="grid w-full gap-2 md:grid-cols-1 mb-2">
                        <li>
                          <input type="radio" id="license_status_wordpressorg_pro" name="license_status_wordpressorg" value="pro" class="!hidden peer" required @change="doWizard(4)" />
                          <label for="license_status_wordpressorg_pro" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600">
                            <div class="block">
                              <div class="w-full text-lg font-semibold">Get Pro License</div>
                              <div class="w-full">Unlock unlimited sites, premium features, and support</div>
                            </div>
                            <svg class="w-[15px] ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                          </label>
                        </li>
                      </ul>
                    </div>

                    <template v-else>
                    <p v-if="awaiting_license == false">

                        <ul class="grid w-full gap-2 md:grid-cols-2 mb-2">
                            <li>
                                <input type="radio" id="license_status_new" name="license_status" value="new" class="!hidden peer" required @change="doWizard(1)"  />
                                <label for="license_status_new" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600">                           
                                    <div class="block">
                                        <div v-if="license_type != 'None'" class="w-full text-lg font-semibold">Swap</div>
                                        <div v-else class="w-full text-lg font-semibold">I have a license</div>
                                        <div v-if="license_type != 'None'" class="w-full">Enter a different license</div>
                                        <div v-else class="w-full">Let's get your features enabled</div>
                                    </div>
                                    <svg class="w-[20px] ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                    </svg>                                    
                                </label>
                            </li>
                            <li>
                                <input type="radio" id="license_status_existing" name="license_status" value="existing" class="!hidden peer" required @change="doWizard(2)">
                                <label for="license_status_existing" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600">                           
                                    <div class="block">
                                        <div v-if="license_type != 'None'" class="w-full text-lg font-semibold">Get New</div>
                                        <div v-else class="w-full text-lg font-semibold">I need a license</div>
                                        <div class="w-full">Let's get you setup</div>
                                    </div>
                                    <svg class="w-[15px] ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                    </svg>                                      
                                </label>
                            </li>                        

                        </ul>

                    </p>

                    <p v-else-if="wanting_license == true">

                        <ul class="grid w-full gap-2 md:grid-cols-2 mb-2">
                            <li>
                                <input type="radio" id="license_status_single" name="license_status_advanced" value="single" class="!hidden peer" required @change="doWizard(3)"  />
                                <label for="license_status_single" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600">                           
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">
                                          <svg class="h-4 w-4 "  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M11.9805 17H13.9561V7.0332H13.7441L9.62207 8.50977V10.1162L11.9805 9.38477V17Z" fill="#000000"/>
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" fill="#000000"/>
                                          </svg>                                          
                                          Just a single site
                                        </div>
                                        <div class="w-full">No pro features, no support</div>
                                    </div>
                                    <svg class="w-[20px] ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                    </svg>                                    
                                </label>
                            </li>
                            <li>
                                <input type="radio" id="license_status_pro" name="license_status_advanced" value="multiple" class="!hidden peer" required @change="doWizard(4)">
                                <label for="license_status_pro" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600">                           
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">                                        
                                        <svg class="h-4 w-4 "  viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-2.025 1042.1a4 4 0 0 0 0 8c2 0 4-1 5-4-1-3-3-4-5-4zm0 2s2 0 3 2c-1 2-3 2-3 2a2 2 0 1 1 0-4z" style="opacity:1;vector-effect:none;fill:#373737;fill-opacity:1;stroke:none;stroke-width:4;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:3.20000005;stroke-opacity:.55063291" transform="translate(6.025 -1038.1)"/><path d="M5.975 1042.1a4 4 0 0 1 0 8c-2 0-4-1-5-4 1-3 3-4 5-4zm0 2s-2 0-3 2c1 2 3 2 3 2a2 2 0 1 0 0-4z" style="opacity:1;vector-effect:none;fill:#373737;fill-opacity:1;stroke:none;stroke-width:4;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:3.20000005;stroke-opacity:.55063291" transform="translate(6.025 -1038.1)"/></svg>  
                                          Unlimited sites
                                        </div>
                                        <div class="w-full">Pro features, customer support</div>
                                    </div>
                                    <svg class="w-[15px] ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                    </svg>                                      
                                </label>
                            </li>                        

                        </ul>                      


                    </p>

                    <p v-else-if="wanting_license_pro == true">

                      Go pro! If you'd like an unlimited site license with personal support and all the features, you can purchase one at <a href='https://speedifypress.com/go-pro' target="_blank">https://speedifypress.com/go-pro</a>                                           
                      <ul class="mt-4 space-y-2 text-sm text-gray-700">
                          <li class="flex items-center gap-3">
                            <span><svg class="h-4 w-4 " viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </span>
                            <span>Cache All of WooCommerce</span>
                          </li>
                          <li class="flex items-center gap-3">
                            <span><svg class="h-4 w-4 " viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </span>
                            <span>Cloudflare Integration</span>
                          </li>
                          <li class="flex items-center gap-3">
                            <span><svg class="h-4 w-4 " viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </span>
                            <span>Cache Logged In Users</span>
                          </li>                          
                          <li class="flex items-center gap-3">
                            <span><svg class="h-4 w-4 " viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </span>
                            <span>HTML Find/Replace</span>
                          </li>                          
                          <li class="flex items-center gap-3">
                            <span><svg class="h-4 w-4 " viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </span>
                            <span>Support via email</span>
                          </li>                          
                      </ul>
                      <a href="https://speedifypress.com/go-pro" target="_blank" class="mt-4 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl hover:shadow-md">
                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md text-cyan-700">
                          <span>Go pro</span>
                        </span>
                      </a>
                      <svg fill="none" height="20" style="width:204px;height:20px;margin-top:10px;margin-left:-30px" viewBox="0 0 204 30" width="204" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)"><path d="M52.688 13.028c-.22 0-.437.008-.654.015a.297.297 0 0 0-.102.024.365.365 0 0 0-.236.255l-.93 3.249c-.401 1.397-.252 2.687.422 3.634.618.876 1.646 1.39 2.894 1.45l5.045.306c.15.008.28.08.359.199a.492.492 0 0 1 .051.434.64.64 0 0 1-.547.426l-5.242.306c-2.848.132-5.912 2.456-6.987 5.29l-.378 1a.28.28 0 0 0 .248.382h18.054a.48.48 0 0 0 .464-.35 13.12 13.12 0 0 0 .48-3.54c0-7.22-5.789-13.072-12.933-13.072" fill="#FBAD41"></path><path d="M85.519 18.886h2.99v8.249h5.218v2.647h-8.208V18.886ZM96.819 24.365v-.032c0-3.13 2.493-5.665 5.821-5.665 3.327 0 5.789 2.508 5.789 5.633v.032c0 3.129-2.493 5.665-5.821 5.665s-5.79-2.505-5.79-5.633Zm8.562 0v-.032c0-1.573-1.123-2.942-2.773-2.942-1.65 0-2.725 1.337-2.725 2.91v.032c0 1.572 1.122 2.942 2.757 2.942 1.634 0 2.741-1.338 2.741-2.91ZM112.086 25.003V18.89h3.033v6.055c0 1.572.783 2.317 1.985 2.317 1.201 0 1.985-.717 1.985-2.242v-6.134h3.032v6.039c0 3.519-1.985 5.056-5.049 5.056s-4.99-1.573-4.99-4.98M126.694 18.889h4.159c3.848 0 6.081 2.241 6.081 5.382v.032c0 3.14-2.265 5.477-6.144 5.477h-4.096V18.886v.004Zm4.202 8.216c1.788 0 2.97-.995 2.97-2.754v-.032c0-1.744-1.185-2.755-2.97-2.755h-1.217v5.541h1.217ZM141.277 18.886h8.621v2.648h-5.636v1.85h5.096v2.505h-5.096v3.893h-2.985V18.886ZM154.054 18.886h2.989v8.249h5.219v2.647h-8.208V18.886ZM170.067 18.809h2.878l4.589 10.971h-3.202l-.788-1.946h-4.159l-.768 1.946h-3.143l4.589-10.971h.004Zm2.619 6.676-1.202-3.097-1.217 3.097h2.419ZM181.383 18.889h5.096c1.647 0 2.789.438 3.509 1.182.635.621.954 1.465.954 2.536v.032c0 1.664-.879 2.77-2.218 3.344l2.572 3.797h-3.45l-2.17-3.3h-1.308v3.3h-2.989V18.886l.004.004Zm4.959 5.23c1.016 0 1.602-.497 1.602-1.29v-.031c0-.856-.614-1.29-1.618-1.29h-1.954v2.616h1.973l-.003-.004ZM195.253 18.886h8.669v2.568h-5.711v1.648h5.175v2.384h-5.175v1.728h5.79v2.568h-8.748V18.886ZM78.976 25.642c-.418.956-1.3 1.633-2.47 1.633-1.63 0-2.756-1.37-2.756-2.942V24.3c0-1.573 1.094-2.91 2.725-2.91 1.229 0 2.166.764 2.564 1.807h3.147c-.505-2.591-2.757-4.53-5.683-4.53-3.324 0-5.821 2.536-5.821 5.665v.032c0 3.129 2.461 5.633 5.79 5.633 2.843 0 5.068-1.864 5.655-4.36h-3.155l.004.004Z" fill="#000"></path><path d="m44.808 29.578.334-1.175c.402-1.397.253-2.687-.42-3.634-.62-.876-1.647-1.39-2.896-1.45l-23.665-.306a.467.467 0 0 1-.374-.199.492.492 0 0 1-.052-.434.64.64 0 0 1 .552-.426l23.886-.306c2.836-.131 5.9-2.456 6.975-5.29l1.362-3.6a.914.914 0 0 0 .04-.477C48.998 5.259 42.79 0 35.368 0c-6.842 0-12.647 4.462-14.73 10.665a6.92 6.92 0 0 0-4.911-1.374c-3.28.33-5.92 3.002-6.246 6.318a7.148 7.148 0 0 0 .18 2.472c-5.36.16-9.66 4.598-9.66 10.052 0 .493.035.979.106 1.453a.46.46 0 0 0 .457.402h43.704a.57.57 0 0 0 .54-.418" fill="#F6821F"></path></g><defs><clipPath id="a"><path d="M0 0h204v30H0z" fill="#FFF"></path></clipPath></defs></svg>

                    </p>

                    <p v-else-if="wanting_license_single == true">

                      <p class="px-2">
                        Register for a single site license to get started. Single site licenses are a great way to get started with SpeedifyPress. They are provided for free, with no warranty or support. 
                      </p>
                      
                      <form 
                        @submit="handleSubstackSubmit"
                        action="https://speedifypress.com/license/request/" method="POST" target="_blank" class="max-w-md mx-auto p-4 mt-4 mb-4 bg-white border border-gray-200 rounded-lg shadow"
                      >
                        <h4 class="text-lg font-semibold text-gray-800 mb-2">Register for a license</h4>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"                          
                        />
                        <button
                          type="submit"
                          class="mt-2 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl hover:shadow-md">
                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md text-cyan-700">
                        <span>Confirm Email</span>
                        </span>
                        </button>

                        <p class="opaque">
                          <div class="mb-1 text-gray-500">
                            By registering, you consent to receive your license details and essential version and security email updates. You may unsubscribe at any time.
                          </div>
                        </p>            

                      </form>

           


                    </p>

                    <form v-else @submit.prevent="checkLicense" class="max-w-xl mx-auto" data-ref="license_number" ref="license_number">

                      <p v-if="submitted" class="text-green-600 font-medium mt-2 mb-3">
                        Thanks for registering! You should receive a confirmation email shortly. Once confirmed, enter your email below. 
                      </p>

                      <p>                       
                         <input 
                            type="text"
                            id="license_number" 
                            name="license_number"  
                            placeholder="Enter your license identifier"
                            class="bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            v-model="license_number"
                            style="box-shadow:inherit!important"
                            required
                          />
                          <p  id="helper-text-explanation" class="mb-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            For community plans, enter the email address associated with your license. For paid plans, enter your license key. 
                          </p>
                      </p>
                      <button type="submit" class="mt-4 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl hover:shadow-md">
                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md text-cyan-700">
                          <svg v-if="checking.spinner" aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin mt-[-3px]" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" />
                          </svg>                        
                          <transition
                            enter-active-class="transition-opacity duration-700 ease-out"
                            enter-from-class="opacity-0"
                            enter-to-class="opacity-100"
                            leave-active-class="transition-opacity duration-0"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                            mode="out-in"
                          >                          
                            <svg v-if="checking.success" class="inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                              <g><polygon class="st0" points="434.8,49 174.2,309.7 76.8,212.3 0,289.2 174.1,463.3 196.6,440.9 196.6,440.9 511.7,125.8 434.8,49" fill="#41AD49" /></g>
                            </svg> 
                            <svg v-if="checking.failure" class="inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient" viewBox="0 0 612 792" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                              <g><polygon class="st0" points="382.2,396.4 560.8,217.8 484,141 305.4,319.6 126.8,141 50,217.8 228.6,396.4 50,575 126.8,651.8    305.4,473.2 484,651.8 560.8,575 382.2,396.4  " fill="#E44061"/></g>
                            </svg>                                                                     
                          </transition>
                          <span v-if="checking.text">Checking</span><span v-else>Check License</span>
                          
                        </span>
                      </button>                      
                    </form> 
                    <div v-if="license_error" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">{{ license_error }}</div>
                    </template>


 
                    
                    


                  </div>
                  <!-- Loading skeleton -->
                  <div class="flex flex-wrap mt-4" v-else>

                      <Skeleton rows="2" />

                  </div>                  


                </div>
            </div>           

    </div>
    
    <!-- Loading skeleton -->
    <div class="flex flex-wrap" v-else>

        <Skeleton mr="4" width="max-w-lg" rows="2" />
        <Skeleton width="max-w-sm" rows="2"  />
        <Skeleton mr="4" width="max-w-lg" rows="2" />
        <Skeleton width="max-w-sm" rows="2"  />
        <Skeleton mr="4" width="max-w-lg" rows="2" />
        <Skeleton width="max-w-sm" rows="2"  />

    </div>        


  </div>
</template>

<script>
import axios from 'axios';

function createButtonState() {
  return { spinner: false, text: false, success: false, failure: false };
}

function getConfigEntry(path) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), window.spress_namespace?.config);
}

function getConfigValue(path, fallback = '') {
  const entry = getConfigEntry(path);
  if (entry && Object.prototype.hasOwnProperty.call(entry, 'value')) {
    return entry.value;
  }

  return fallback;
}

function getConfigHelper(path, fallback = '') {
  const entry = getConfigEntry(path);
  if (entry && Object.prototype.hasOwnProperty.call(entry, 'helper')) {
    return entry.helper;
  }

  return fallback;
}

export default {
  computed: {
    isWordPressOrgBuild() {
      return this.build_plugin_type === 'wordpressorg';
    },
  },
  data() {
    return {
      buttons: {
        plugin_mode: createButtonState(),
      },      
      license_type: 'None',
      dashboardData: null,
      loading: false,
      clearing:{},
      clearing_page:{},
      checking:{},
      refreshing:false,
      refreshing_page:false,
      livechat_loaded:false,
      license_number:null,
      license_error:null,
      mode_error:null,
      awaiting_license:false,
      wanting_license:false,
      wanting_license_single:false,
      wanting_license_pro:false,
      submitted: false,
      plugin_mode: getConfigValue(['plugin', 'plugin_mode'], 'disabled'),
      disable_urls: getConfigValue(['plugin', 'disable_urls'], ''),
      mode: getConfigValue(['speed_css', 'css_mode'], 'disabled'),
      cache_mode: getConfigValue(['speed_cache', 'cache_mode'], 'disabled'),
      cache_lifetime: getConfigValue(['speed_cache', 'cache_lifetime'], '4'),
      include_patterns: getConfigValue(['speed_css', 'include_patterns'], ''),
      include_patterns_helper: getConfigHelper(['speed_css', 'include_patterns'], ''),
      partial_textbox_display: 'hidden',
    };
  },
  mounted() {
    this.fetchData().then(() => {
      this.refreshCache(); // Start the loop after initial data is fetched
      this.refreshPageCache(); // Start the loop after initial data is fetched
    });
    window.addEventListener('beforeunload', this.clearLocalStorage);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.clearLocalStorage);
  },  
  methods: {    
  // Local-only preview of mode (no global config writes, no events)
  setPartialTextboxDisplay(mode) {
    this.partial_textbox_display = mode;
    // Do NOT touch window.spress_namespace or dispatch here
  },    
  handleSubstackSubmit(event) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.awaiting_license = true;
          this.wanting_license = false;
          this.wanting_license_single = false;
          this.wanting_license_pro = false;
          this.submitted = true;
        }, 1000); // Delay to let Substack process
      });

  },
  doWizard(stage) {

    if(stage == '0') {

      this.awaiting_license = false;
      this.wanting_license = false;
      this.wanting_license_single = false;
      this.wanting_license_pro = false;
      this.license_error = '';

    } else if(stage == '1') {

      this.awaiting_license = true;

    } else if(stage == '2') {

      this.awaiting_license = true;
      this.wanting_license = true;
      this.wanting_license_single = false;
      this.wanting_license_pro = false;      

    } else if(stage == '3') {

      this.awaiting_license = true;
      this.wanting_license = false;
      this.wanting_license_single = true;
      this.wanting_license_pro = false;

    } else if(stage == '4') {

      this.awaiting_license = true;
      this.wanting_license = false;
      this.wanting_license_single = false;
      this.wanting_license_pro = true;

    }

  },
  handleKeyup(event) {

      //Get the element of the textarea
      const element = event.target;

      //Update global JS
      if(typeof window.spress_namespace.config.plugin[element.name] != 'undefined') {
        window.spress_namespace.config.plugin[element.name].value = element.value;
      }      

  },    
    submitForm(event) {
      
      event.preventDefault();

      const ref = event.target.dataset.ref;
      const formElements = event.target.elements;

      // Set loading to true
      this.buttons[ref].spinner = true;
      this.buttons[ref].text = true;

      let formDataJson = {};
      let checkboxHolder = {};
      //Force the correct value for checboxed
      Array.from(formElements).forEach((element) => {      
        
        if (element.type === 'checkbox') {
          formDataJson[element.name] = element.checked.toString();
        } else if (element.type === 'radio') {
          if(element.checked === true) {
            formDataJson[element.name] = element.value;
          }
        } else {
          formDataJson[element.name] = element.value;
        }

        //Update global JS
        if(typeof window.spress_namespace.config['plugin'][element.name] != 'undefined') {
          window.spress_namespace.config['plugin'][element.name].value = formDataJson[element.name];
        }

        //Save checkbox data
        if(/\./.test(element.name) && element.type === 'checkbox') {
           let split = element.name.split(".");
           if(typeof checkboxHolder[split[0]] == "undefined") {
             checkboxHolder[split[0]] = {};
           }
           checkboxHolder[split[0]][split[1]] = element.checked.toString();
        }

      });

      //Run through checkboxHolder if has length
      //and update global JS
      if(Object.keys(checkboxHolder).length > 0) {
        for (let key in checkboxHolder) {
          window.spress_namespace.config.speed_css[key].value = checkboxHolder[key];
        }
      }

      // Encode the values using btoa()
      for (let key in formDataJson) formDataJson[key] = btoa(
        encodeURIComponent(formDataJson[key])
          .replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      );

      // Make your AJAX POST request here
      api.post(window.spress_namespace.resturl + 'speedifypress/update_config', formDataJson )
        .then(response => {
          //Set success          
          this.setButton(null,'success',this.buttons[ref]);
          if(typeof(formDataJson.plugin_mode) != 'undefined') {
            this.changePluginMode(atob(formDataJson.plugin_mode));
            this.mode_error = '';
          };
        })
        .catch(error => {
          // Handle any errors here
          //Set success
          this.setButton(null,'failure',this.buttons[ref]);
          if( error.response.data.code == "no_license"
            || error.response.data.code == "missing_mbstring"
            || error.response.data.code == "missing_iconv"
            || error.response.data.code == "missing_zlib"
            || error.response.data.code == "no_permalinks"
           ) {
            this.mode_error = error.response.data.message;
            this.changePluginMode('disabled');
            document.getElementById('mode-disabled').checked = true;
          }
        })
        .finally(() => {
        });
  },    
  changePluginMode(mode) {
    this.plugin_mode = mode;
    (window.spress_namespace.config.plugin.plugin_mode.value) = this.plugin_mode;
    window.dispatchEvent(new Event("pluginModeChanged"));
  },
  fetchData() {
    return new Promise((resolve, reject) => {

        const cachedData = localStorage.getItem('dashboardData');
        if (cachedData) {
          this.dashboardData = JSON.parse(cachedData);
          if (this.isWordPressOrgBuild) {
            this.dashboardData.license_data.license_status = 'active';
            this.dashboardData.license_data.allowed_hosts = '';
            this.dashboardData.license_data.license_ends_days = '';
            this.dashboardData.license_data.license_status_verb = '';
            this.dashboardData.license_data.license_number = '';
            this.license_type = 'wordpress.org';
            localStorage.setItem('spress_plugin_type', 'wordpress.org');
          }
          this.refreshing = false;
          this.refreshing_page = false;
          resolve();
          return;
        }

        api.get(window.spress_namespace.resturl + 'speedifypress/get_dashboard_data')
          .then(response => {
            this.dashboardData = response.data;
            this.refreshing = false;
            this.refreshing_page = false;
            if (this.isWordPressOrgBuild) {
              this.dashboardData.license_data.license_status = 'active';
              this.dashboardData.license_data.allowed_hosts = '';
              this.dashboardData.license_data.license_ends_days = '';
              this.dashboardData.license_data.license_status_verb = '';
              this.dashboardData.license_data.license_number = '';
              localStorage.setItem('spress_plugin_type', 'wordpress.org');
            }
            if (this.license_number == null) {
              this.license_number = this.dashboardData.license_data.license_number ?? '';
            }
            if(this.isWordPressOrgBuild) {
              this.license_type = 'wordpress.org';
            } else if(this.dashboardData.license_data.allowed_hosts === "0") {
              localStorage.setItem('spress_plugin_type', 'None');
            } else if(this.dashboardData.license_data.allowed_hosts === "1/1") {
              localStorage.setItem('spress_plugin_type', 'community');
            } else if(/^[1-9]\d*\/10000$/.test(this.dashboardData.license_data.allowed_hosts)) {
              localStorage.setItem('spress_plugin_type', 'pro');
            }
            if(!this.isWordPressOrgBuild) {
              this.license_type = localStorage.getItem('spress_plugin_type');
            }
            localStorage.setItem('dashboardData', JSON.stringify(response.data));
            resolve();
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      });
    },
    checkLicense(event) {

      this.checking.spinner = true;
      this.checking.text = true;

      event.preventDefault();
      const formElements = event.target.elements;

      let formDataJson = {};
      //Force the correct value for checboxed
      Array.from(formElements).forEach((element) => {      
        
        formDataJson[element.name] = element.value;

      });

      // Encode the values using btoa()
      for (let key in formDataJson) formDataJson[key] = btoa(
        encodeURIComponent(formDataJson[key])
          .replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      ); 

      // Make your AJAX POST request here
      api.post(window.spress_namespace.resturl + 'speedifypress/check_license', formDataJson )
        .then(response => {

          //Set success
          if(typeof response.data.error != 'undefined') {
            this.setButton('checking','failure');
            this.dashboardData.license_data.license_status = 'inactive';
            this.license_error = response.data.error;
          } else if(response.data == false || response.data.success == false) {
            this.setButton('checking','failure');
            this.dashboardData.license_data.license_status = 'inactive';
            this.license_error = 'License not found. Please allow 5 minutes for confirmation to complete.';
          } else {
            this.setButton('checking','success');
            this.dashboardData.license_data.license_status = 'active';
            this.dashboardData.license_data.allowed_hosts =  response.data.num_current_hosts + "/" + response.data.allowed_hosts;
            this.license_error = '';
          }
        })
        .catch(error => {
          // Handle any errors here
          this.setButton('checking','failure');  
          if( error.response.data.code == "license_failed") {
            this.license_error = error.response.data.message;
            this.dashboardData.license_data.license_status = 'inactive';
          }          
        })
        .finally(() => {
        });


    },
    clearCache(event) {
      this.clearing.spinner = true;
      this.clearing.text = true;
      api.get(window.spress_namespace.resturl + 'speedifypress/clear_css_cache')
        .then(response => {
          this.setButton('clearing','success');         
          localStorage.removeItem('dashboardData');
          this.refreshCache();
          this.fetchData();          
          setTimeout(() => {
            this.clearing = {};
          },500);
        })
        .catch(error => {
          this.setButton('clearing','failure');            
          console.error(error);
        });
    }, 
    clearPageCache(event) {
      this.clearing_page.spinner = true;
      this.clearing_page.text = true;
      api.get(window.spress_namespace.resturl + 'speedifypress/clear_page_cache')
        .then(response => {
          this.setButton('clearing_page','success');         
          localStorage.removeItem('dashboardData');
          this.refreshPageCache();
          this.fetchData();          
          setTimeout(() => {
            this.clearing_page = {};
          },500);
        })
        .catch(error => {
          this.setButton('clearing_page','failure');            
          console.error(error);
        });
    },     
    setButton(button_name=null, type, passed_button=null) {

      let button = {};

      if(button_name != null) {
        button = this[button_name];
      } else {
        button = passed_button;
      }

      if(type == "success") {
      
        button.spinner = false;
        button.success = true;
        setTimeout(() => {
          button.text = false;
          button.success = false;
        }, 1000);

      } else if(type == "failure") {
      
        button.spinner = false;
        button.failure = true;
        setTimeout(() => {
          button.text = false;
          button.failure = false;
        }, 1000);         
      }

    },    
    refreshCache() {

      // Prevent multiple simultaneous executions
      if (this.refreshing) return;

      this.refreshing = true;
      localStorage.removeItem('dashboardData');

      this.fetchData()
        .finally(() => {
          // Start the next cycle only after fetchData completes
          setTimeout(() => {
            if ((window.spress_namespace.activeItem.name ?? false) == "Dashboard") {
              this.refreshCache();
            }
          }, 10000);
        });
    },  
    refreshPageCache() {

      // Prevent multiple simultaneous executions
      if (this.refreshing_page) return;

      this.refreshing_page = true;
      localStorage.removeItem('dashboardData');

      this.fetchData()
        .finally(() => {
          // Start the next cycle only after fetchData completes
          setTimeout(() => {
            if ((window.spress_namespace.activeItem.name ?? false) == "Dashboard") {
              this.refreshPageCache();
            }
          }, 15000);
        });
    },        
    clearLocalStorage() {
      localStorage.removeItem('dashboardData');
    },    
  },
};
</script>
