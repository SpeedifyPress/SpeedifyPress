<script setup>

import Skeleton from './../components/Skeleton.vue'
import Button from './../components/Button.vue'
import CodeEditor from './../components/CodeEditor.vue'

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
  isPro: {
    type: Boolean,
    required: true
  }         
})

import { defineEmits } from 'vue'
const emit = defineEmits(['showDocs'])

</script>

<template>
  <div>

    <div class="flex flex-wrap">

            <div class="w-full p-2 mr-4" >
                <div class="flex items-left mb-4">
                    <span v-html="icon" class="mr-2 force-gradient"></span>
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">Cache Settings</h5>
                    <svg v-if="isPro " @click="emit('showDocs', 'Cache Settings')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>                 

            <div class="w-full p-2 mr-4" >
                <div class="flex items-left mb-4">
                    <svg :class="iconclass" class="mr-2" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48H0V0zm0 0h48v48H0V0z" fill="none"/><path d="M26 24h14v3H26zm0-5h14v3H26zm0 10h14v3H26zM42 8H6c-2.2 0-4 1.8-4 4v26c0 2.2 1.8 4 4 4h36c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4zm0 30H24V12h18v26z"/></svg>
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">Mode Selection</h5>
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>               

            <div :class="isPro ? 'max-w-md' : 'max-w-xs'" class="w-full p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="cache_mode" ref="cache_mode">

                      <div class="flex items-left mb-4">                        
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M4 3h14l2.707 2.707a1 1 0 0 1 .293.707V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 1v5h9V4H7zm-1 8v7h12v-7H6zm7-7h2v3h-2V5z"/></g></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Choose the Cache mode</h5>                                              
                      </div>
                      <ul class="grid w-full gap-2 md:grid-cols-2 mb-3">
                          <li>
                              <input type="radio" id="mode-enabled" name="cache_mode" value="enabled" class="!hidden peer" required v-bind:checked="cache_mode === 'enabled'" />
                              <label for="mode-enabled" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600 peer-checked:border-green-700 peer-checked:text-green-800 peer-checked:bg-green-100">                           
                                  <div class="block">
                                      <div class="w-full text-lg font-semibold">Fully Enabled</div>
                                      <div class="w-full">Caching takes place, stats generated</div>
                                  </div>
                              </label>
                          </li>
                          <li>
                              <input type="radio" id="mode-disabled" name="cache_mode" value="disabled" class="!hidden peer" v-bind:checked="cache_mode === 'disabled'">
                              <label for="mode-disabled" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-red-700 peer-checked:text-red-800 peer-checked:bg-red-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                  <div class="block">
                                      <div class="w-full text-lg font-semibold">Fully Disabled</div>
                                      <div class="w-full">No caching takes place at all</div>
                                  </div>
                              </label>
                          </li>                        
                      </ul>

                      <Button config_key="speed_cache" title="Update Cache Mode" id="cache_mode" :status_object="buttons" />

                    </form>                   

                  </div>


                </div>
            </div>                                 

            <div :class="isPro ? 'max-w-md' : 'max-w-xs'" class="w-full p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="page_preload_mode" ref="page_preload_mode">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 16 16" width="16px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M8,0C7.448,0,7,0.448,7,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1V1C9,0.448,8.552,0,8,0z M8,12c-0.552,0-1,0.447-1,1v2  c0,0.553,0.448,1,1,1s1-0.447,1-1v-2C9,12.447,8.552,12,8,12z M12.242,5.172l1.414-1.415c0.391-0.39,0.391-1.024,0-1.414  c-0.39-0.391-1.023-0.391-1.414,0l-1.414,1.414c-0.391,0.391-0.391,1.024,0,1.415C11.219,5.562,11.852,5.562,12.242,5.172z   M3.757,10.828l-1.414,1.414c-0.391,0.391-0.391,1.024,0,1.414c0.39,0.391,1.023,0.391,1.414,0l1.414-1.414  c0.391-0.391,0.391-1.023,0-1.414C4.781,10.438,4.148,10.438,3.757,10.828z M3.757,2.343c-0.391-0.391-1.024-0.391-1.414,0  c-0.391,0.39-0.391,1.024,0,1.414l1.414,1.415c0.391,0.39,1.024,0.39,1.414,0c0.391-0.391,0.391-1.024,0-1.415L3.757,2.343z   M12.242,10.828c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l1.414,1.414c0.391,0.391,1.024,0.391,1.414,0  c0.391-0.39,0.391-1.023,0-1.414L12.242,10.828z M15,7h-2c-0.553,0-1,0.448-1,1s0.447,1,1,1h2c0.553,0,1-0.448,1-1S15.553,7,15,7z   M4,8c0-0.552-0.448-1-1-1H1C0.448,7,0,7.448,0,8s0.448,1,1,1h2C3.552,9,4,8.552,4,8z"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Page Preload Mode</h5>                      
                      </div>
                      <ul class="grid w-full gap-2 md:grid-cols-3 mb-3">
                          <li>
                              <input type="radio" id="mode-hover" name="page_preload_mode" value="hover" class="!hidden peer" required v-bind:checked="page_preload_mode === 'hover'" />
                              <label for="mode-hover" class="inline-flex items-center justify-between w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600 peer-checked:border-green-700 peer-checked:text-green-800 peer-checked:bg-green-100">                           
                                  <div class="block">
                                      <div class="w-full text-sm font-semibold">On hover</div>
                                      <div class="w-full">Prefetch all pages on link hover</div>
                                  </div>
                              </label>
                          </li>
                          <li>
                              <input type="radio" id="mode-intelligent" name="page_preload_mode" value="intelligent" class="!hidden peer" required v-bind:checked="page_preload_mode === 'intelligent'" />
                              <label for="mode-intelligent" class="inline-flex items-center justify-between w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600 peer-checked:border-green-700 peer-checked:text-green-800 peer-checked:bg-green-100">                           
                                  <div class="block">
                                      <div class="w-full text-sm font-semibold">Smart</div>
                                      <div class="w-full">Prerender if cached, otherwise prefetch onhover</div>
                                  </div>
                              </label>
                          </li>
                          <li>
                              <input type="radio" id="mode-page-disabled" name="page_preload_mode" value="disabled" class="!hidden peer" v-bind:checked="page_preload_mode === 'disabled'">
                              <label for="mode-page-disabled" class="inline-flex items-center justify-between w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-red-700 peer-checked:text-red-800 peer-checked:bg-red-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                  <div class="block">
                                      <div class="w-full text-sm font-semibold">Fully Disabled</div>
                                      <div class="w-full">No preloading takes place at all</div>
                                  </div>
                              </label>
                          </li>                        
                      </ul>

                      <Button config_key="speed_cache" title="Update Preload Mode" id="page_preload_mode" :status_object="buttons" />

                    </form>                   

                  </div>


                </div>
            </div>       

            <div :class="isPro ? 'max-w-md' : 'max-w-xs'" class="w-full p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="cache_lifetime" ref="cache_lifetime">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M421.9,199.3c-16.7-15-39-23.3-62.6-23.3c-23.6,0-45.9,8.3-62.6,23.3l-31.6,28.5l22.4,20.2l31.1-28  c10.8-9.7,25.3-15.1,40.7-15.1c15.4,0,29.9,5.4,40.7,15.1c10.7,9.6,16.6,22.4,16.6,36.1c0,13.6-5.9,26.4-16.6,36  c-10.8,9.7-25.3,15.1-40.7,15.1c-15.4,0-29.9-5.4-40.7-15.1l-103.3-92.7c-16.7-15-39-23.3-62.6-23.3c-23.6,0-45.9,8.3-62.6,23.3  C73.3,214.4,64,234.5,64,256c0,21.5,9.3,41.6,26.1,56.7c16.7,15,39,23.3,62.6,23.3c23.6,0,45.9-8.3,62.6-23.3l31.6-28.4l-22.4-20.2  l-31,27.9c-10.8,9.7-25.3,15.1-40.7,15.1s-29.9-5.4-40.7-15.1c-10.7-9.6-16.6-22.4-16.6-36c0-13.6,5.9-26.4,16.6-36.1  c10.8-9.7,25.3-15.1,40.7-15.1c15.4,0,29.9,5.4,40.7,15.1l103.3,92.7c16.7,15,39,23.3,62.6,23.3c23.6,0,45.9-8.3,62.6-23.3  c16.8-15.1,26.1-35.2,26.1-56.7C448,234.5,438.7,214.4,421.9,199.3z"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Choose cache lifetime</h5>                      
                      </div>
                      <ul class="grid w-full gap-2 md:grid-cols-5 mb-3">
                          <li>
                              <input type="radio" id="mode-0" name="cache_lifetime" value="0" class="!hidden peer" required v-bind:checked="cache_lifetime === '0'" />
                              <label for="mode-0" class="inline-flex items-center justify-between w-full h-16 p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-indigo-700 peer-checked:text-indigo-800 peer-checked:bg-indigo-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                  <div class="block">
                                      <div class="w-full text-sm font-semibold">
                                        ∞
                                      </div>
                                  </div>
                              </label>
                          </li>
                          <li>
                              <input type="radio" id="mode-2" name="cache_lifetime" value="2" class="!hidden peer" required v-bind:checked="cache_lifetime === '2'" />
                              <label for="mode-2" class="inline-flex items-center justify-between w-full h-16 p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-indigo-700 peer-checked:text-indigo-800 peer-checked:bg-indigo-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                  <div class="block">
                                      <div class="w-full text-sm font-semibold">2 hrs</div>
                                  </div>
                              </label>
                          </li>                          
                          <li>
                              <input type="radio" id="mode-6" name="cache_lifetime" value="6" class="!hidden peer" v-bind:checked="cache_lifetime === '6'">
                              <label for="mode-6" class="inline-flex items-center justify-between w-full h-16 p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-indigo-700 peer-checked:text-indigo-800 peer-checked:bg-indigo-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                  <div class="block">
                                      <div class="w-full text-sm font-semibold">6 hrs</div>
                                  </div>
                              </label>
                          </li>
                          <li>
                              <input type="radio" id="mode-12" name="cache_lifetime" value="12" class="!hidden peer" v-bind:checked="cache_lifetime === '12'">
                              <label for="mode-12" class="inline-flex items-center justify-between w-full h-16 p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-indigo-700 peer-checked:text-indigo-800 peer-checked:bg-indigo-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                  <div class="block">
                                      <div class="w-full text-sm font-semibold">12 hrs</div>
                                  </div>
                              </label>
                          </li>                        
                          <li>
                              <input type="radio" id="mode-24" name="cache_lifetime" value="24" class="!hidden peer" v-bind:checked="cache_lifetime === '24'">
                              <label for="mode-24" class="inline-flex items-center justify-between w-full h-16 p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-indigo-700 peer-checked:text-indigo-800 peer-checked:bg-indigo-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                  <div class="block">
                                      <div class="w-full text-sm font-semibold">24 hrs</div>
                                  </div>
                              </label>
                          </li>                        
                      </ul>

                      <Button config_key="speed_cache" title="Update Cache Lifetime" id="cache_lifetime" :status_object="buttons" />

                    </form>                   

                  </div>


                </div>
            </div>               

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" v-if="isPro">

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="replace_nonces" ref="replace_nonces">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M21 5V3H3V5H21Z" fill="currentColor"/><path d="M21 19V21H3V19H21Z" fill="currentColor"/><path clip-rule="evenodd" d="M12.0001 7.37636C11.602 7.35207 11.2112 7.56874 11.0325 7.95204L7.65154 15.2025C7.41815 15.7031 7.6347 16.2981 8.13522 16.5315C8.63577 16.7649 9.23074 16.5484 9.46417 16.0477L9.95278 14.9999H14.0473L14.5359 16.0477C14.7693 16.5484 15.3643 16.7649 15.8648 16.5315C16.3654 16.2981 16.5819 15.7031 16.3485 15.2025L12.9676 7.95204C12.7888 7.56874 12.3981 7.35207 12.0001 7.37636ZM13.1147 12.9999H10.8854L12.0001 10.6095L13.1147 12.9999Z" fill="currentColor" fill-rule="evenodd"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Nonce options</h5>                      
                      </div>                                                             

                      <div class="flex mt-4 mb-4">
                          <div class="flex items-center h-5 mt-2">
                              <input id="replace_woo_nonces" name="replace_woo_nonces" aria-describedby="helper-checkbox-text" type="checkbox" 
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    v-bind:checked="replace_woo_nonces === 'true'"
                              >
                          </div>
                          <div class="ms-2 text-sm">
                              <label for="replace_woo_nonces" class="font-medium text-gray-900 dark:text-gray-300">Replace WooCommerce nonces?</label>
                              <p id="replace_woo_nonces-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ replace_woo_nonces_helper }}</p>
                          </div>
                      </div>  

                      <div class="flex mt-4 mb-4">
                          <div class="flex items-center h-5 mt-2">
                              <input id="replace_ajax_nonces" name="replace_ajax_nonces" aria-describedby="helper-checkbox-text" type="checkbox" 
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    v-bind:checked="replace_ajax_nonces === 'true'"
                              >
                          </div>
                          <div class="ms-2 text-sm">
                              <label for="replace_ajax_nonces" class="font-medium text-gray-900 dark:text-gray-300">Replace AJAX nonces?</label>
                              <p id="replace_ajax_nonces-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ replace_ajax_nonces_helper }}</p>
                          </div>
                      </div>                                                                                            

                      <Button config_key="speed_cache" title="Update Advanced Options" :status_object="buttons" id="replace_nonces" />

                    </form>

                  </div>

                </div>

            </div>                                                    

            <div class="w-full p-2 mr-4" >
                <div class="flex items-left mb-4">
                    <svg :class="iconclass" class="mr-2"  viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="  M3.241,7.646L13,19v9l6-4v-5l9.759-11.354C29.315,6.996,28.848,6,27.986,6H4.014C3.152,6,2.685,6.996,3.241,7.646z"  id="XMLID_6_" fill="#f7f7f7" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/></svg>
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">Filters</h5>
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>              

             <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="bypass_cookies" ref="bypass_cookies">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0 0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77 54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0 0 57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"/></svg>                                                                       
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Bypass When Cookies Present</h5>                      
                      </div>                      

                      <textarea 
                        @keyup="handleKeyup"
                        id="bypass_cookies" 
                        name="bypass_cookies"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="bypass_cookies"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ bypass_cookies_helper }}</p>

                      <Button config_key="speed_cache" title="Update Cookies" :status_object="buttons" id="bypass_cookies" />

                    </form>                   

                  </div>
               


                </div>
            </div>                            

             <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="bypass_urls" ref="bypass_urls">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <path d="M20.7,19.3l-1-1c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l1,1c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3   C21.1,20.3,21.1,19.7,20.7,19.3z"/>
                          <path d="M14,22c0,0.6,0.4,1,1,1s1-0.4,1-1v-2c0-0.6-0.4-1-1-1s-1,0.4-1,1V22z"/>
                          <path d="M22,14h-2c-0.6,0-1,0.4-1,1s0.4,1,1,1h2c0.6,0,1-0.4,1-1S22.6,14,22,14z"/>
                          <path d="M20.7,8.4c0-1.4-0.5-2.6-1.5-3.6c-1-1-2.2-1.5-3.6-1.5S13,3.8,12,4.8L9.8,7c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0l2.2-2.2   c1.2-1.2,3.2-1.2,4.4,0c0.6,0.6,0.9,1.4,0.9,2.2c0,0.8-0.3,1.6-0.9,2.2l-2.2,2.2c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3   s0.5-0.1,0.7-0.3l2.2-2.2C20.2,11,20.7,9.8,20.7,8.4z"/>
                          <path d="M3.3,15.6c0,1.4,0.5,2.6,1.5,3.6c1,1,2.2,1.5,3.6,1.5s2.6-0.5,3.6-1.5l2.2-2.2c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-2.2,2.2   c-1.2,1.2-3.2,1.2-4.4,0c-0.6-0.6-0.9-1.4-0.9-2.2c0-0.8,0.3-1.6,0.9-2.2l2.2-2.2c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L4.8,12   C3.8,13,3.3,14.2,3.3,15.6z"/>
                          <path d="M5.7,4.3l-1-1c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l1,1C4.5,5.9,4.7,6,5,6s0.5-0.1,0.7-0.3C6.1,5.3,6.1,4.7,5.7,4.3z"/>
                          <path d="M10,4V2c0-0.6-0.4-1-1-1S8,1.4,8,2v2c0,0.6,0.4,1,1,1S10,4.6,10,4z"/>
                          <path d="M4,10c0.6,0,1-0.4,1-1S4.6,8,4,8H2C1.4,8,1,8.4,1,9s0.4,1,1,1H4z"/>
                        </svg>                        
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Bypass URLs</h5>                      
                      </div>                      

                      <textarea 
                        id="bypass_urls" 
                        name="bypass_urls"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="bypass_urls"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ bypass_urls_helper }}</p>


                      <Button config_key="speed_cache" title="Update URLs" :status_object="buttons" id="bypass_urls" />

                    </form>                   

                  </div>
            


                </div>
            </div> 

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="bypass_useragents" ref="bypass_useragents">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m15.71 15.71 2.29-2.3 2.29 2.3 1.42-1.42-2.3-2.29 2.3-2.29-1.42-1.42-2.29 2.3-2.29-2.3-1.42 1.42L16.58 12l-2.29 2.29zM12 8a3.91 3.91 0 0 0-4-4 3.91 3.91 0 0 0-4 4 3.91 3.91 0 0 0 4 4 3.91 3.91 0 0 0 4-4zM6 8a1.91 1.91 0 0 1 2-2 1.91 1.91 0 0 1 2 2 1.91 1.91 0 0 1-2 2 1.91 1.91 0 0 1-2-2zM4 18a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1h2v-1a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v1h2z"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Bypass User Agents</h5>                      
                      </div>                      

                      <textarea 
                        id="bypass_useragents" 
                        name="bypass_useragents"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="bypass_useragents"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ bypass_useragents_helper }}</p>

                      <Button config_key="speed_cache" title="Update User Agents" :status_object="buttons" id="bypass_useragents" />

                    </form>                   

                  </div>              


                </div>
            </div>                                     

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="ignore_querystrings" ref="ignore_querystrings">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M352 416H306.7l18.96-64.1L271.4 308.5L239.1 416H192c-17.67 0-32 14.31-32 32s14.33 31.99 31.1 31.99h160C369.7 480 384 465.7 384 448S369.7 416 352 416zM630.8 469.1l-276.4-216.7l45.63-156.5H512v32c0 17.69 14.33 32 32 32s32-14.31 32-32v-64c0-17.69-14.33-32-32-32H192c-17.67 0-32 14.31-32 32v36.11L38.81 5.13c-10.47-8.219-25.53-6.37-33.7 4.068s-6.349 25.54 4.073 33.69l591.1 463.1c4.406 3.469 9.61 5.127 14.8 5.127c7.125 0 14.17-3.164 18.9-9.195C643.1 492.4 641.2 477.3 630.8 469.1zM300.1 209.9l-82.08-64.33C221.5 140.5 224 134.7 224 128v-32h109.3L300.1 209.9z"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Ignore Querystrings</h5>                      
                      </div>                      

                      <textarea 
                        id="ignore_querystrings" 
                        name="ignore_querystrings"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="ignore_querystrings"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ ignore_querystrings_helper }}</p>

                      <Button config_key="speed_cache" title="Update Querystrings" :status_object="buttons" id="ignore_querystrings" />

                    </form>                   

                  </div>              


                </div>
            </div>             

            <div class="w-full p-2 mr-4" >
                <div class="flex items-left mb-4">
                    <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polyline points="17 11 21 7 17 3"></polyline> <line x1="21" y1="7" x2="9" y2="7"></line> <polyline points="7 21 3 17 7 13"></polyline> <line x1="15" y1="17" x2="3" y2="17"></line> </g></svg>
                    <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Cache Outputs</h5>    
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>              

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flex items-left mb-4">
                  <svg :class="iconclass" class="mr-2" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M28,2H4C2.9,2,2,2.9,2,4v24c0,1.1,0.9,2,2,2h24c1.1,0,2-0.9,2-2V4C30,2.9,29.1,2,28,2z M26,26H6V6h20V26z M16,20  c-1.104,0-2,0.896-2,2s0.896,2,2,2s2-0.896,2-2S17.104,20,16,20z M24,8H8v10h16V8z"/></svg>
                  <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Device Paths <span v-if="isPro">& Compression</span></h5>                      
                </div>               

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="update_settings" ref="update_settings">                      

                      <div class="flex mt-4 mb-4" v-if="isPro">
                          <div class="flex items-center h-5 mt-2">
                              <input id="cache_mobile_separately" name="cache_mobile_separately" aria-describedby="helper-checkbox-text" type="checkbox" 
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    v-bind:checked="cache_mobile_separately === 'true'"
                              >
                          </div>
                          <div class="ms-2 text-sm">
                              <label for="cache_mobile_separately" class="font-medium text-gray-900 dark:text-gray-300">Cache mobile devices separately?</label>
                              <p id="cache_mobile_separately-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">Create a separate cache for mobile devices?</p>
                          </div>
                      </div>          

                       <div class="flex mt-4 mb-4">
                          <div class="flex items-center h-5 mt-2">
                              <input id="cache_path_uploads" name="cache_path_uploads" aria-describedby="helper-checkbox-text" type="checkbox" 
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    v-bind:checked="cache_path_uploads === 'true'"
                              >
                          </div>
                          <div class="ms-2 text-sm">
                              <label for="cache_path_uploads" class="font-medium text-gray-900 dark:text-gray-300">Switch the Cache Path?</label>
                              <p id="cache_path_uploads-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ cache_path_uploads_helper }}?</p>
                          </div>
                      </div>   

                       <div class="flex mt-4 mb-4" v-if="isPro">
                          <div class="flex items-center h-5 mt-2">
                              <input id="force_gzipped_output" name="force_gzipped_output" aria-describedby="helper-checkbox-text" type="checkbox" 
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    v-bind:checked="force_gzipped_output === 'true'"
                              >
                          </div>
                          <div class="ms-2 text-sm">
                              <label for="force_gzipped_output" class="font-medium text-gray-900 dark:text-gray-300">Force gzipped output?</label>
                              <p id="force_gzipped_output-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ force_gzipped_output_helper }}?</p>
                          </div>
                      </div>   


                      
                 

                      <Button config_key="speed_cache" title="Update Settings" :status_object="buttons" id="update_settings" />

                    </form>

                  </div>

                </div>

            </div>    

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="separate_cookie_cache" ref="separate_cookie_cache">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0 0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77 54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0 0 57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"/></svg>                                               
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Separate Cookie Cache</h5>                      
                      </div>                      

                      <textarea 
                        id="separate_cookie_cache" 
                        name="separate_cookie_cache"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="separate_cookie_cache"
                        style="box-shadow:inherit!important"
                      ></textarea>                         
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ separate_cookie_cache_helper }}
                        <span v-if="isPro">Not compatible with Cloudflare Worker</span>
                      </p>

                      <Button config_key="speed_cache" title="Update Cookies" :status_object="buttons" id="separate_cookie_cache" />

                    </form>                   

                  </div>
               


                </div>
            </div>                  

            <div class="w-full p-4 ml-2 mr-[40px] mb-4 bg-white border border-gray-200 rounded-lg shadow" v-if="isPro">

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="flex flex-wrap" data-ref="cache_logged_in_users" ref="cache_logged_in_users">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><title/><path d="M85.57,446.25H426.43a32,32,0,0,0,28.17-47.17L284.18,82.58c-12.09-22.44-44.27-22.44-56.36,0L57.4,399.08A32,32,0,0,0,85.57,446.25Z" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><path d="M250.26,195.39l5.74,122,5.73-121.95a5.74,5.74,0,0,0-5.79-6h0A5.74,5.74,0,0,0,250.26,195.39Z" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><path d="M256,397.25a20,20,0,1,1,20-20A20,20,0,0,1,256,397.25Z"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Logged in cache</h5>   
                        <p class="text-xs font-normal text-gray-500 ml-3 mt-[2px]">BETA</p>
                      </div>                         

                      <div class="w-full bg-white " >

                        <div class="flex">
                            <div class="flex items-center h-5 mt-2 ">
                                <input id="cache_logged_in_users" name="cache_logged_in_users" aria-describedby="helper-checkbox-text" type="checkbox" 
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                      v-model="cache_logged_in_users"
                                      v-bind:checked="cache_logged_in_users === 'true'"  
                                >                                
                            </div>
                            <div class="ms-2 text-sm w-full">

                                <label for="cache_logged_in_users" class="font-medium text-gray-900 dark:text-gray-300">Cached logged in users?</label>
                                <p id="cache_logged_in_users-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">Create a separate cache for logged in users? Default is not to cache when logged in.</p>


                                <p class="font-medium text-gray-900 dark:text-gray-300 text-sm mt-4"><label>Exclude certain page areas from caching</label></p> 

                                <div class="relative overflow-x-auto mt-2 rounded-lg shadow border-t border-gray-300">                                                                  

                                  <table class="table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">                                    
                                    <thead class="hidden lg:table-header-group">
                                      <tr class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">                                        
                                        <th scope="col" class="px-6 py-3 w-[30%]">Find Area<br/><small class="capitalize">Enter CSS selector to search by</small></th>
                                        <th scope="col" class="px-6 py-3">Skeleton<br/><small class="capitalize">Choose loading skeleton. For custom enter HTML.</small></th>
                                        <th scope="col" class="px-6 py-3 w-[12%]">Delay JS<br/><small class="capitalize">Run site JS after load</small></th>
                                        <th scope="col" class="px-6 py-3">Notes<br/><small class="capitalize">Notes for your own reference</small></th>
                                        <th scope="col" class="px-6 py-3"></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <template v-for="(row, index) in findReplaceData" :key="index">
                                        <tr :class="['bg-white','dark:bg-gray-800', row.skeleton === 'custom' ? 'border-b-0' : 'border-b dark:border-gray-700']">
                                              
                                          <td class="block lg:table-cell px-6 py-4 align-top">

                                            <p class="block lg:hidden">Find Area</p>

                                            <input type="text" 
                                              :name="`cache_logged_in_users_exceptions[${index}][find]`"
                                              class="block w-full text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                              v-model="row.find"/>
                                          </td>
                                          <td class="block lg:table-cell px-6 py-4 align-top">

                                            <p class="block lg:hidden">Skeleton</p>
                                            
                                            <select :name="`cache_logged_in_users_exceptions[${index}][skeleton]`" v-model="row.skeleton" class="w-full text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500">                                          
                                              <option value="" selected="selected">none</option>
                                              <option v-for="(item, key) in skeletonsAvailable" :key="key" :value="item">{{ item }}</option>
                                              <option value="custom">custom</option>
                                            </select>      
                                            <!-- Mobile-only CodeJar editor + hidden input -->
                                            <div v-if="row.skeleton === 'custom'" class="lg:hidden mt-2 min-w-0">
                                              <CodeEditor
                                                :name="`cache_logged_in_users_exceptions[${index}][custom_html]`"
                                                v-model="row.custom_html"
                                                language="markup"
                                                pre-class="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-0 pl-[10px] w-full min-h-32 overflow-x-auto box-border"
                                              />                                              
                                            </div>                                                                                                                 
                                          </td>
                                          <td class="block lg:table-cell px-6 py-4 align-top">

                                            <p class="block lg:hidden">Delay JS</p>

                                            <input type="checkbox" :name="`cache_logged_in_users_exceptions[${index}][delay_js]`" v-model="row.delay_js" :checked="row.delay_js === 'true'">
                                            
                                          </td>
                                        <td class="block lg:table-cell px-6 py-4 align-top">

                                            <p class="block lg:hidden">Notes</p>

                                            <input type="text" 
                                              :name="`cache_logged_in_users_exceptions[${index}][notes]`"
                                              class="block w-full text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                              v-model="row.notes"/>
                                          </td>                                        
                                          <td class="block lg:table-cell px-6 py-4 align-top text-right">
                                            <button 
                                              @click="deleteRow(index)"
                                              type="button"
                                              class="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-3 py-1">
                                              Delete
                                            </button>
                                          </td>
                                        </tr>
                                        <!-- Desktop-only CodeJar editor; visually attached to the row above -->
                                        <tr v-if="row.skeleton === 'custom'" class="hidden lg:table-row bg-white dark:bg-gray-800 border-b dark:border-gray-700 border-t-0">
                                          <td :colspan="5" class="px-6 pt-0 pb-4 min-w-0">                                            
                                            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Custom HTML</label>
                                            <CodeEditor
                                              :name="`cache_logged_in_users_exceptions[${index}][custom_html]`"
                                              v-model="row.custom_html"
                                              language="markup"
                                              pre-class="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-0 pl-[10px] w-full min-h-32 overflow-x-auto box-border"
                                            />
                                          </td>
                                        </tr>                                        
                                      </template>
                                      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td colspan="5" class="block lg:table-cell text-right pr-2">
                                          <button 
                                            @click="addRow"
                                            type="button"
                                            class="text-white bg-gray-600 hover:bg-gray-700 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 my-2">
                                            Add Row
                                          </button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <div class="flex justify-between mt-4">
                                    
                                    <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">                                                

                                      <div class="ml-0 w-full pr-4">

                                          <p class="font-medium text-gray-900 dark:text-gray-300 text-sm mb-2"><label>Only run on certain URLs</label></p>                     

                                          <textarea 
                                            id="cache_logged_in_users_exclusively_on" 
                                            name="cache_logged_in_users_exclusively_on"  
                                            class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            v-model="cache_logged_in_users_exclusively_on"
                                            style="box-shadow:inherit!important"
                                          ></textarea>                    
                                          <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ cache_logged_in_users_exclusively_on_helper }}</p>
            
                                      </div>              



                                </div>   

                            </div>  
                            
                        </div>     

                      </div>                  

                      <div class="w-full" >
                      <Button config_key="speed_cache" title="Update Settings" :status_object="buttons" id="cache_logged_in_users" />
                      </div>

                    </form>

                  </div>

                </div>

            </div>   

    </div>    


  </div>
</template>

<script>
import axios from 'axios';


function createButtonState() {
  return { spinner: false, text: false, success: false, failure: false };
}

function getCacheValue(key, fallback = '') {
  return window?.spress_namespace?.config?.speed_cache?.[key]?.value ?? fallback;
}

function getCacheHelper(key, fallback = '') {
  return window?.spress_namespace?.config?.speed_cache?.[key]?.helper ?? fallback;
}

export default {
  data() {
    return {
      buttons: {
        bypass_urls: createButtonState(),
        bypass_cookies: createButtonState(),
        cache_mode: createButtonState(),        
        page_preload_mode: createButtonState(),
        ignore_querystrings: createButtonState(),        
        bypass_useragents: createButtonState(),                
        separate_cookie_cache: createButtonState(),     
        update_settings: createButtonState(),    
        cache_lifetime: createButtonState(),  
        cache_logged_in_users: createButtonState(),        
        replace_nonces: createButtonState(),                
      },
      findReplaceData: null,
      skeletonsAvailable: null,      
      cache_mode: getCacheValue('cache_mode', 'disabled'),
      page_preload_mode: getCacheValue('page_preload_mode', 'intelligent'),
      bypass_urls: getCacheValue('bypass_urls', ''),
      bypass_urls_helper: getCacheHelper('bypass_urls', ''),
      bypass_cookies: getCacheValue('bypass_cookies', ''),
      bypass_cookies_helper: getCacheHelper('bypass_cookies', ''),
      separate_cookie_cache: getCacheValue('separate_cookie_cache', ''),
      separate_cookie_cache_helper: getCacheHelper('separate_cookie_cache', ''),
      ignore_querystrings: getCacheValue('ignore_querystrings', ''),
      ignore_querystrings_helper: getCacheHelper('ignore_querystrings', ''),
      bypass_useragents: getCacheValue('bypass_useragents', ''),
      bypass_useragents_helper: getCacheHelper('bypass_useragents', ''),
      cache_mobile_separately: getCacheValue('cache_mobile_separately', 'false'),
      force_gzipped_output: getCacheValue('force_gzipped_output', 'false'),
      force_gzipped_output_helper: getCacheHelper('force_gzipped_output', ''),
      cache_path_uploads: getCacheValue('cache_path_uploads', 'false'),
      cache_path_uploads_helper: getCacheHelper('cache_path_uploads', ''),
      cache_logged_in_users: getCacheValue('cache_logged_in_users', 'false'),
      cache_logged_in_users_exceptions: getCacheValue('cache_logged_in_users_exceptions', []),
      cache_logged_in_users_exceptions_helper: getCacheHelper('cache_logged_in_users_exceptions', ''),
      cache_logged_in_users_exclusively_on: getCacheValue('cache_logged_in_users_exclusively_on', ''),
      cache_logged_in_users_exclusively_on_helper: getCacheHelper('cache_logged_in_users_exclusively_on', ''),
      cache_lifetime: getCacheValue('cache_lifetime', '4'),
      replace_woo_nonces: getCacheValue('replace_woo_nonces', 'false'),
      replace_woo_nonces_helper: getCacheHelper('replace_woo_nonces', ''),
      replace_ajax_nonces: getCacheValue('replace_ajax_nonces', 'false'),
      replace_ajax_nonces_helper: getCacheHelper('replace_ajax_nonces', ''),
      jars: { desktop: {}, mobile: {} },            
    };
  },
  mounted() {    
    this.findReplaceData = getCacheValue('cache_logged_in_users_exceptions', []) || [];
    this.skeletonsAvailable = ['element shimmer','block - 1 row','block - 2 rows','block - 3 rows'];
  },
  beforeDestroy() {
  },  
  methods: {
    deleteRow(index) {
      this.findReplaceData.splice(index, 1); // Remove the row at the given index
    },  
    addRow() {
      this.findReplaceData.push({
        find: '',
        skeleton: '',
        delay_js: '',
        custom_html: '',
      });
    },        
    convertToArray(input) {

      const result = {};

        for (const key in input) {
            const match = key.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
            
            if (match) {
                const arrayName = match[1];
                const index = parseInt(match[2]);
                const fieldName = match[3];
                
                // Initialize the array in result if it doesn't exist
                if (!result[arrayName]) {
                    result[arrayName] = [];
                }
                
                // Ensure the object at the current index exists
                if (!result[arrayName][index]) {
                    result[arrayName][index] = {};
                }
                
                // Assign the value to the correct field in the indexed object
                result[arrayName][index][fieldName] = input[key];
            } else {
                // For keys not matching the pattern, simply add them to the result
                result[key] = input[key];
            }
        }

        return result;

    },     
    handleKeyup(event) {

      //Get the element of the textarea
      const element = event.target;

      //Update global JS
      if(typeof window.spress_namespace.config.speed_cache[element.name] != 'undefined') {
        window.spress_namespace.config.speed_cache[element.name].value = element.value;
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
        if(typeof window.spress_namespace.config.speed_cache[element.name] != 'undefined') {
          window.spress_namespace.config.speed_cache[element.name].value = formDataJson[element.name];
          if(element.name == 'cache_logged_in_users') {
            this.cache_logged_in_users = formDataJson[element.name];
          }
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
          if(typeof window?.spress_namespace?.config?.speed_cache?.[key] != 'undefined') {
            window.spress_namespace.config.speed_cache[key].value = checkboxHolder[key];
          }
        }
      }

      // Encode the values using btoa()
      for (let key in formDataJson) formDataJson[key] = btoa(
        encodeURIComponent(formDataJson[key])
          .replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      );  

      formDataJson = this.convertToArray(formDataJson);

      // Make your AJAX POST request here
      api.post(window.spress_namespace.resturl + 'speedifypress/update_config', formDataJson)
        .then(response => {
          //Set success
          this.setButton(this.buttons[ref],'success');
        })
        .catch(error => {
          // Handle any errors here
          //Set success
          this.setButton(this.buttons[ref],'failure');
        })
        .finally(() => {
        });
    },    
    setButton(button, type) {

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
  },
};
</script>
<style scoped>

/* Constrain editors so long lines never widen table/container */
td { min-width: 0; }
pre[class*="language-"] {
  width: 100%;
  overflow-x: auto;
  box-sizing: border-box;
  padding-bottom:0;
}
code[class*="language-"] { 
  display: block; 
}

pre[class*="language-"],
code[class*="language-"] {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  line-height: 1.3; /* optional: tighten vertical rhythm */
}



</style>
