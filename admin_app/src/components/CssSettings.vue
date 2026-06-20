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
    type: String, required: true 
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
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">CSS Settings</h5>
                    <svg v-if="isPro " @click="emit('showDocs', 'CSS Settings')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
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

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="css_mode" ref="css_mode">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2"
                            viewBox="-31.872 -3.842 64.203 26.304" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <defs>
                                <linearGradient id="gradient_spress" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#3f83f8;stop-opacity:1" />
                                </linearGradient>
                            </defs>                  
                            <g stroke-miterlimit="10" stroke-width="2">
                              <path d="m-29.704 9.172c0-2.688 0.839-4.932 2.515-6.739 1.678-1.805 3.52-3.011 5.533-3.612 0.462-0.161 0.926-0.277 1.389-0.348 0.46-0.071 0.912-0.104 1.352-0.104l24.561-0.034v2.704h-23.834c-2.797 0.277-4.925 1.251-6.382 2.914-1.457 1.664-2.199 3.469-2.222 5.412v0.102c0 0.441 0.06 0.972 0.176 1.598s0.321 1.259 0.625 1.908c0.507 1.158 1.368 2.22 2.582 3.179 1.218 0.96 2.957 1.433 5.223 1.433h2.462v2.639h-3.918c-3.215-0.093-5.696-1.18-7.441-3.265-1.748-2.082-2.62-4.668-2.62-7.75v-0.037z"/>
                              <path d="m-6.46 17.551c0.97 0.023 1.75-0.159 2.339-0.553 0.59-0.396 0.943-1.018 1.058-1.875 0-0.74-0.243-1.422-0.728-2.045-0.486-0.626-1.214-1.184-2.186-1.67-0.186-0.091-0.378-0.181-0.573-0.271-0.198-0.096-0.397-0.193-0.607-0.283-0.022-0.022-0.054-0.039-0.088-0.05-0.033-0.012-0.065-0.028-0.087-0.051-1.711-0.835-3.277-1.728-4.7-2.688-1.42-0.958-2.132-2.269-2.132-3.937 0.023-0.07 0.035-0.127 0.035-0.175 0-0.045 5e-3 -0.079 0.016-0.104 0.012-0.023 0.018-0.046 0.018-0.069 0-1.605 0.458-2.816 1.373-3.63 0.911-0.816 1.911-1.349 2.997-1.606 0.165-0.047 0.331-0.082 0.505-0.104 0.173-0.026 0.339-0.048 0.503-0.071l7.63-0.034v2.704h-7.145c-0.811 0.023-1.457 0.275-1.941 0.746-0.486 0.474-0.788 1.002-0.904 1.578 0 0.093-6e-3 0.181-0.017 0.262-0.012 0.08-0.017 0.155-0.017 0.224 0 0.325 0.082 0.642 0.242 0.954 0.161 0.313 0.381 0.564 0.658 0.745 0.949 0.672 1.84 1.219 2.672 1.632 0.833 0.417 1.607 0.795 2.324 1.145 0.209 0.112 0.409 0.226 0.607 0.328 0.194 0.102 0.386 0.213 0.573 0.327 0.161 0.096 0.328 0.193 0.503 0.301 0.172 0.102 0.341 0.209 0.501 0.327 0.718 0.536 1.381 1.203 1.997 2.016 0.612 0.807 0.917 1.812 0.917 3.015 0 0.305-0.017 0.632-0.05 1.004-0.035 0.373-0.111 0.745-0.226 1.113-0.253 0.896-0.781 1.714-1.577 2.444-0.799 0.726-2.053 0.811-3.764 0.811h-0.104-0.104-0.034c-0.048 0-0.093-0.011-0.141-0.022-0.045-0.012-0.079-0.012-0.103-0.012l-8.118-0.038v-2.388h7.878z"/>
                              <path d="m9.634 17.551c0.971 0.023 1.751-0.159 2.337-0.553 0.594-0.396 0.948-1.018 1.062-1.875 0-0.74-0.243-1.422-0.729-2.045-0.484-0.626-1.213-1.184-2.185-1.67-0.184-0.091-0.377-0.181-0.571-0.271-0.199-0.096-0.398-0.193-0.607-0.283-0.023-0.022-0.055-0.039-0.087-0.05-0.035-0.012-0.066-0.028-0.088-0.051-1.711-0.835-3.277-1.728-4.701-2.688-1.419-0.959-2.131-2.269-2.131-3.937 0.022-0.07 0.034-0.128 0.034-0.175 0-0.045 6e-3 -0.079 0.017-0.104 0.012-0.023 0.017-0.046 0.017-0.069 0-1.605 0.458-2.816 1.371-3.63 0.912-0.816 1.911-1.349 2.999-1.606 0.162-0.048 0.33-0.083 0.505-0.104 0.172-0.026 0.337-0.048 0.5-0.071l7.631-0.034v2.704h-7.144c-0.81 0.023-1.457 0.275-1.942 0.746-0.484 0.474-0.786 1.002-0.903 1.578 0 0.093-6e-3 0.181-0.016 0.262-0.012 0.08-0.018 0.155-0.018 0.224 0 0.325 0.083 0.642 0.243 0.954 0.16 0.313 0.381 0.564 0.658 0.745 0.949 0.672 1.84 1.219 2.674 1.632 0.832 0.417 1.606 0.795 2.322 1.145 0.209 0.112 0.412 0.226 0.605 0.328 0.197 0.102 0.389 0.213 0.576 0.327 0.158 0.096 0.327 0.193 0.502 0.301 0.174 0.102 0.343 0.209 0.502 0.327 0.717 0.536 1.377 1.203 2 2.016 0.607 0.807 0.914 1.812 0.914 3.015 0 0.305-0.018 0.632-0.052 1.004-0.033 0.373-0.107 0.745-0.225 1.113-0.255 0.897-0.785 1.715-1.576 2.445-0.803 0.726-2.054 0.811-3.766 0.811h-0.107-0.102-0.035c-0.044 0-0.088-0.011-0.14-0.022-0.044-0.012-0.078-0.012-0.102-0.012l-8.119-0.038v-2.388h7.877z"/>
                              <path d="m30.159 9.208c0 3.083-0.87 5.669-2.62 7.749-1.743 2.084-4.225 3.17-7.441 3.264h-33.84v-2.639h32.384c2.264 0 4.004-0.473 5.222-1.432 1.214-0.957 2.078-2.02 2.586-3.174 0.299-0.651 0.507-1.286 0.622-1.912 0.119-0.626 0.174-1.156 0.174-1.598v-0.102c-0.023-1.943-0.762-3.748-2.218-5.412-1.458-1.663-3.592-2.637-6.386-2.914h-11.012v-2.704l11.313 0.034c0.441 0 1.319 0.033 1.777 0.104 0.462 0.071 0.926 0.187 1.389 0.348 2.013 0.601 3.861 1.807 5.538 3.612 1.676 1.807 2.513 4.051 2.513 6.739v0.037z"/>
                            </g>
                        </svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Choose the Unused CSS mode</h5>                      
                      </div>
                      <ul class="grid w-full gap-2 mb-3" :class="{ 'md:grid-cols-4': isPro, 'md:grid-cols-3': !isPro }">
                          <li>
                              <input type="radio" id="mode-enabled" name="css_mode" value="enabled" class="!hidden peer" required v-bind:checked="css_mode === 'enabled'" />
                              <label for="mode-enabled" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600 peer-checked:border-green-700 peer-checked:text-green-800 peer-checked:bg-green-100">                           
                                  <div class="block">
                                      <div class="w-full text-lg font-semibold">Fully Enabled</div>
                                      <div class="w-full">Replaces files, gets stats</div>
                                  </div>
                              </label>
                          </li>
                          <li>
                              <input type="radio" id="mode-preview" name="css_mode" value="preview" class="!hidden peer" required v-bind:checked="css_mode === 'preview'" />
                              <label for="mode-preview" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-yellow-700 peer-checked:text-yellow-800 peer-checked:bg-yellow-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                  <div class="block">
                                      <div class="w-full text-lg font-semibold">Preview Mode</div>
                                      <div class="w-full">Enabled only for admins</div>
                                  </div>
                              </label>
                          </li>                          
                          <li v-if="isPro">
                              <input type="radio" id="mode-stats" name="css_mode" value="stats" class="!hidden peer" v-bind:checked="css_mode === 'stats'">
                              <label for="mode-stats" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-indigo-700 peer-checked:text-indigo-800 peer-checked:bg-indigo-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                  <div class="block">
                                      <div class="w-full text-lg font-semibold">Statistics Only</div>
                                      <div class="w-full">Just gather & view statistics</div>
                                  </div>
                              </label>
                          </li>
                          <li>
                              <input type="radio" id="mode-disabled" name="css_mode" value="disabled" class="!hidden peer" v-bind:checked="css_mode === 'disabled'">
                              <label for="mode-disabled" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-red-700 peer-checked:text-red-800 peer-checked:bg-red-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                  <div class="block">
                                      <div class="w-full text-lg font-semibold">Fully Disabled</div>
                                      <div class="w-full">View existing stats only</div>
                                  </div>
                              </label>
                          </li>                        
                      </ul>

                      <Button config_key="speed_css" title="Update CSS Mode" id="css_mode" :status_object="buttons" />

                    </form>                   

                  </div>


                </div>
            </div>     
            
             <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="inclusion_mode" ref="inclusion_mode">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M448 80C448 35.82 412.2 0 368 0C323.8 0 288 35.82 288 80c0 32.79 19.77 60.89 48 73.25V192c0 17.66-14.36 32-32 32h-160c-11.28 0-21.94 2.312-32 5.898V153.2C140.2 140.9 160 112.8 160 80C160 35.82 124.2 0 80 0C35.82 0 0 35.82 0 80c0 32.79 19.77 60.89 48 73.25v205.5C19.77 371.1 0 399.2 0 432C0 476.2 35.82 512 80 512C124.2 512 160 476.2 160 432c0-32.79-19.77-60.89-48-73.25V320c0-17.66 14.36-32 32-32h160c52.94 0 96-43.06 96-96V153.2C428.2 140.9 448 112.8 448 80zM80 56c13.23 0 24 10.77 24 24S93.23 104 80 104c-13.23 0-24-10.77-24-24S66.77 56 80 56zM80 456c-13.23 0-24-10.77-24-24s10.77-24 24-24c13.23 0 24 10.77 24 24S93.23 456 80 456zM368 56c13.23 0 24 10.77 24 24s-10.77 24-24 24c-13.23 0-24-10.77-24-24S354.8 56 368 56z"/></svg>                      
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Choose the inclusion method</h5>                      
                      </div>                      

                      <ul class="grid w-full gap-2 md:grid-cols-3 mb-3">
                          <li>
                              <input type="radio" id="mode-inline" name="inclusion_mode" value="inline" class="!hidden peer" required v-bind:checked="inclusion_mode === 'inline'" />
                              <label for="mode-inline" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600 peer-checked:border-blue-700 peer-checked:text-blue-800 peer-checked:bg-blue-100">                           
                                  <div class="block">
                                      <div class="w-full text-lg font-semibold">Inline, Inplace</div>
                                      <div class="w-full">Optimised CSS replaces file links in the same place</div>
                                  </div>
                              </label>
                          </li>                          
                          <li>
                              <input type="radio" id="mode-inline-grouped" name="inclusion_mode" value="inline-grouped" class="!hidden peer" required v-bind:checked="inclusion_mode === 'inline-grouped'" />
                              <label for="mode-inline-grouped" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600 peer-checked:border-blue-700 peer-checked:text-blue-800 peer-checked:bg-blue-100">                           
                                  <div class="block">
                                      <div class="w-full text-lg font-semibold">Inline, Grouped</div>
                                      <div class="w-full">Entire optimised CSS inlined into the document head</div>
                                  </div>
                              </label>
                          </li>
                          <li>
                              <input type="radio" id="mode-file" name="inclusion_mode" value="file" class="!hidden peer" required v-bind:checked="inclusion_mode === 'file'" />
                              <label for="mode-file" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-blue-700 peer-checked:text-blue-800 peer-checked:bg-blue-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                  <div class="block">
                                      <div class="w-full text-lg font-semibold">Individual files</div>
                                      <div class="w-full">Optimised individual files included in the document  head</div>
                                  </div>
                              </label>
                          </li>                          
                       
                      </ul>

                      <Button config_key="speed_css" title="Update Inclusion Method" id="inclusion_mode" :status_object="buttons" />

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

             <div :class="isPro ? 'max-w-md' : 'max-w-xs'" class="w-full p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="include_patterns" ref="include_patterns">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" fill="none">
                          <path d="M9.41436 6.99991L4.41436 11.9999L9.41436 16.9999L8.00015 18.4141L1.58594 11.9999L8.00015 5.58569L9.41436 6.99991Z" />
                          <path d="M16.0002 5.58569L22.4144 11.9999L16.0002 18.4141L14.5859 16.9999L19.5859 11.9999L14.5859 6.99991L16.0002 5.58569Z" />
                        </svg>                        
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Force Include Selectors</h5>                      
                      </div>                      

                      <textarea 
                        @keyup="handleKeyup"
                        id="include_patterns" 
                        name="include_patterns"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="include_patterns"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ include_patterns_helper }}</p>

                      <Button config_key="speed_css" title="Update Selectors" :status_object="buttons" id="include_patterns" />

                    </form>                   

                  </div>
               


                </div>
            </div>                            

             <div :class="isPro ? 'max-w-md' : 'max-w-xs'" class="w-full p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="ignore_urls" ref="ignore_urls">

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
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Force Ignore URLs</h5>                      
                      </div>                      

                      <textarea 
                        id="ignore_urls" 
                        name="ignore_urls"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="ignore_urls"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ ignore_urls_helper }}</p>


                      <Button config_key="speed_css" title="Update URLs" :status_object="buttons" id="ignore_urls" />

                    </form>                   

                  </div>
            


                </div>
            </div> 

             <div :class="isPro ? 'max-w-md' : 'max-w-xs'"class="w-full p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="ignore_cookies" ref="ignore_cookies">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0 0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77 54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0 0 57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"/></svg>                       
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Force Ignore Cookies</h5>                      
                      </div>                      

                      <textarea 
                        id="ignore_cookies" 
                        name="ignore_cookies"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="ignore_cookies"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ ignore_cookies_helper }}</p>

                      <Button config_key="speed_css" title="Update Cookies" :status_object="buttons" id="ignore_cookies" />

                    </form>                   

                  </div>              


                </div>
            </div>     

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" v-if="isPro ">

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="generation_res" ref="generation_res">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title/><path d="M22.5,0H1.5A1.5,1.5,0,0,0,0,1.5v15A1.5,1.5,0,0,0,1.5,18H9.75a.25.25,0,0,1,.25.25v2.907a14.642,14.642,0,0,0-3.88.916A1,1,0,0,0,6.5,24H17.5a1,1,0,0,0,.377-1.926A14.62,14.62,0,0,0,14,21.157V18.25a.25.25,0,0,1,.25-.25H22.5A1.5,1.5,0,0,0,24,16.5V1.5A1.5,1.5,0,0,0,22.5,0ZM22,13.5a.5.5,0,0,1-.5.5H2.5a.5.5,0,0,1-.5-.5V2.5A.5.5,0,0,1,2.5,2h19a.5.5,0,0,1,.5.5Z"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Generation by Screen Resolution</h5>                      
                      </div>                      

                      <ul class="grid w-full gap-2 md:grid-cols-3 mb-3 pt-4">
                          <li>
                              <input type="checkbox" id="mode-mobile" name="generation_res.mobile" value="true" class="!hidden peer" v-bind:checked="generation_res.mobile === 'true'" />
                              <label for="mode-mobile" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600 peer-checked:border-blue-700 peer-checked:text-blue-800 peer-checked:bg-blue-100">                           
                                  <div class="block">
                                      <div class="w-full text-md font-semibold flex items-left">
                                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title/><path d="M17,0H7A3,3,0,0,0,4,3V21a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V3A3,3,0,0,0,17,0ZM6,19V3.5A.5.5,0,0,1,6.5,3h11a.5.5,0,0,1,.5.5V19a.5.5,0,0,1-.5.5H6.5A.5.5,0,0,1,6,19Z"/></svg>
                                        Mobile
                                      </div>
                                  </div>
                              </label>
                          </li>
                          <li>
                              <input type="checkbox" id="mode-tablet" name="generation_res.tablet" value="true" class="!hidden peer" v-bind:checked="generation_res.tablet === 'true'" />
                              <label for="mode-tablet" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600 peer-checked:border-blue-700 peer-checked:text-blue-800 peer-checked:bg-blue-100">                           
                                  <div class="block">
                                      <div class="w-full text-md font-semibold flex items-left">
                                        <svg :class="iconclass" class="mr-2" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 2c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2 0v14h12V2H4zm6 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>  
                                        Tablet
                                      </div>
                                  </div>
                              </label>
                          </li>                          
                          <li>
                              <input type="checkbox" id="mode-desktop" name="generation_res.desktop" value="true" class="!hidden peer" v-bind:checked="generation_res.desktop === 'true'" />
                              <label for="mode-desktop" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-blue-700 peer-checked:text-blue-800 peer-checked:bg-blue-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                  <div class="block">
                                      <div class="w-full text-md font-semibold flex items-left">
                                      <svg :class="iconclass" class="mr-2" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48h-48z" fill="none"/><path d="M42 4h-36c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h14l-4 6v2h16v-2l-4-6h14c2.21 0 4-1.79 4-4v-24c0-2.21-1.79-4-4-4zm0 24h-36v-20h36v20z"/></svg>
                                        Desktop
                                      </div>
                                  </div>
                              </label>
                          </li>                          
                       
                      </ul>

                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">Select all resolutions at which unused CSS generation should take place.</p>

                      <Button config_key="speed_css" title="Update Generation Resolutions" id="generation_res" :status_object="buttons" />

                    </form>                   

                  </div>              


                </div>
            </div>                                                     

            <div class="w-full p-2 mr-4" v-if="isPro ">
                <div class="flex items-left mb-4">
                    <svg :class="iconclass" class="mr-2"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.73169L19.5 5.39836V12.75C19.5 15.6371 17.5419 18.9972 12.2605 20.9533L12 21.0498L11.7395 20.9533C6.45811 18.9972 4.5 15.6371 4.5 12.75V5.39836L12 3.73169ZM6 6.60161V12.75C6 14.8245 7.3659 17.6481 12 19.4479C16.6341 17.6481 18 14.8245 18 12.75V6.60161L12 5.26828L6 6.60161Z" fill="#080341"></path> </g></svg>
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">Security Config</h5>
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>              

             <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" v-if="isPro ">

                <div class="flow-root">                  

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="csrf_expiry_seconds" ref="csrf_expiry_seconds">

                      <label for="csrf_expiry_seconds" class="font-medium text-gray-900 dark:text-gray-300">CSRF Expiry</label>
                      <p id="csrf_expiry_seconds-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ csrf_expiry_seconds_helper }}</p>

                      <div class="mt-4">  
                        <input                               
                          type="number" name="csrf_expiry_seconds" id="csrf_expiry_seconds" 
                          class="w-[60px] text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          placeholder="6"
                          v-model="csrf_expiry_seconds"
                          />                            
                          <label for="delay_seconds" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter expiry in seconds</label>                         
                      </div>
                   
                      <Button config_key="speed_css" title="Update Expiry" :status_object="buttons" id="csrf_expiry_seconds" />

                    </form>                   

                  </div>
               


                </div>
            </div>     

             <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" v-if="isPro ">

                <div class="flow-root">                  

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="force_includes_limit" ref="force_includes_limit">

                      <label for="force_includes_limit" class="font-medium text-gray-900 dark:text-gray-300">Force Include Limit</label>
                      <p id="force_includes_limit-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ force_includes_limit_helper }}</p>

                      <div class="mt-4">  
                        <input                               
                          type="number" name="force_includes_limit" id="force_includes_limit" 
                          class="w-[60px] text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          placeholder="6"
                          v-model="force_includes_limit"
                          />                            
                          <label for="delay_seconds" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter max classes to be force included</label>                         
                      </div>
                   
                      <Button config_key="speed_css" title="Update Limit" :status_object="buttons" id="force_includes_limit" />

                    </form>                   

                  </div>
               


                </div>
            </div>             

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" v-if="isPro ">

                <div class="flow-root">

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="turnstile_settings" ref="turnstile_settings">

                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          id="turnstile_protect_public_endpoints"
                          name="turnstile_protect_public_endpoints"
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                          v-model="turnstile_protect_public_endpoints"
                        />
                        <label for="turnstile_protect_public_endpoints" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Secure public endpoints with <strong>CLOUDFLARE</strong>
                        </label>
                      </div>

                      <div v-if="turnstile_protect_public_endpoints" class="mt-4">
                        <label for="turnstile_site_key" class="font-medium text-gray-900 dark:text-gray-300">Turnstile Site Key</label>
                        <p id="turnstile_site_key-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ turnstile_site_key_helper }}</p>
                        <div class="mt-2">
                          <input
                            type="text"
                            name="turnstile_site_key"
                            id="turnstile_site_key"
                            class="w-full text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            placeholder="0x00000000000000000000"
                            v-model="turnstile_site_key"
                            autocomplete="off"
                            autocapitalize="none"
                            autocorrect="off"
                            spellcheck="false"
                          />
                        </div>

                        <label for="turnstile_secret_key" class="font-medium text-gray-900 dark:text-gray-300 mt-4 block">Turnstile Secret Key</label>
                        <p id="turnstile_secret_key-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ turnstile_secret_key_helper }}</p>
                        <div class="mt-2">
                          <input
                            type="password"
                            name="turnstile_secret_key"
                            id="turnstile_secret_key"
                            class="w-full text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            placeholder="0x00000000000000000000"
                            v-model="turnstile_secret_key"
                            autocomplete="new-password"
                            autocapitalize="none"
                            autocorrect="off"
                            spellcheck="false"
                          />
                        </div>
                      </div>                      

                      <p  id="helper-text-explanation" class="mb-3 mt-4 text-sm text-gray-500 dark:text-gray-400">Click <svg @click="emit('showDocs', 'CSS Settings')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg> for installation instructions</p>                      

                      <Button config_key="speed_cloudflare" title="Update Security Settings" id="turnstile_settings" :status_object="buttons" />

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
  data() {
    return {
      buttons: {
        ignore_urls: createButtonState(),
        include_patterns: createButtonState(),
        css_mode: createButtonState(),
        ignore_cookies: createButtonState(),
        inclusion_mode: createButtonState(),
        include_partytown: createButtonState(),       
        update_external: createButtonState(),     
        generation_res: createButtonState(),    
        csrf_expiry_seconds: createButtonState(),
        force_includes_limit: createButtonState(),
        turnstile_settings: createButtonState(),
      },
      css_mode: getConfigValue(['speed_css', 'css_mode'], 'disabled'),
      inclusion_mode: getConfigValue(['speed_css', 'inclusion_mode'], 'inline-grouped'),
      generation_res: getConfigValue(['speed_css', 'generation_res'], 'true'),
      include_patterns: getConfigValue(['speed_css', 'include_patterns'], ''),
      include_patterns_helper: getConfigHelper(['speed_css', 'include_patterns'], ''),
      csrf_expiry_seconds: getConfigValue(['speed_css', 'csrf_expiry_seconds'], '15'),
      csrf_expiry_seconds_helper: getConfigHelper(['speed_css', 'csrf_expiry_seconds'], ''),
      force_includes_limit: getConfigValue(['speed_css', 'force_includes_limit'], '120'),
      force_includes_limit_helper: getConfigHelper(['speed_css', 'force_includes_limit'], ''),
      ignore_urls: getConfigValue(['speed_css', 'ignore_urls'], ''),
      ignore_urls_helper: getConfigHelper(['speed_css', 'ignore_urls'], ''),
      ignore_cookies: getConfigValue(['speed_css', 'ignore_cookies'], ''),
      ignore_cookies_helper: getConfigHelper(['speed_css', 'ignore_cookies'], ''),
      include_partytown: getConfigValue(['speed_css', 'include_partytown'], ''),
      gtag_locally: getConfigValue(['external_scripts', 'gtag_locally'], 'false'),
      preload_gtag: getConfigValue(['external_scripts', 'preload_gtag'], 'false'),
      include_partytown_helper: getConfigHelper(['speed_css', 'include_partytown'], ''),
      turnstile_site_key: (window.spress_namespace.config.speed_cloudflare?.turnstile_site_key?.value || ''),
      turnstile_site_key_helper: (window.spress_namespace.config.speed_cloudflare?.turnstile_site_key?.helper || ''),
      turnstile_secret_key: (window.spress_namespace.config.speed_cloudflare?.turnstile_secret_key?.value || ''),
      turnstile_secret_key_helper: (window.spress_namespace.config.speed_cloudflare?.turnstile_secret_key?.helper || ''),
      turnstile_protect_public_endpoints: (window.spress_namespace.config.speed_cloudflare?.turnstile_protect_public_endpoints?.value === 'true'),
    };
  },
  mounted() {    
  },
  beforeDestroy() {
  },  
  methods: {
    handleKeyup(event) {

      //Get the element of the textarea
      const element = event.target;

      //Update global JS
      if(typeof window.spress_namespace.config.speed_css[element.name] != 'undefined') {
        window.spress_namespace.config.speed_css[element.name].value = element.value;
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
      let config_key = 'speed_css';

      // Get the config key (if provided by Button)
      Array.from(formElements).forEach((element) => {
        if (element.type === 'hidden' && element.name === 'config_key') {
          config_key = element.value || 'speed_css';
        }
      });
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
        if(typeof window.spress_namespace.config[config_key]?.[element.name] != 'undefined') {
          window.spress_namespace.config[config_key][element.name].value = formDataJson[element.name];
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
          if (window.spress_namespace.config[config_key]?.[key]) {
            window.spress_namespace.config[config_key][key].value = checkboxHolder[key];
          }
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

    }  
  },
};
</script>
