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
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">Image Settings</h5>
                    <svg v-if="isPro " @click="emit('showDocs', 'Image Settings')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>                                                                                       

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flex items-center justify-center w-full">

                    <form @submit.prevent="submitForm" class="" data-ref="preload_image" ref="preload_image">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"/></g></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Preload Image</h5>                      
                      </div>                   

                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ preload_image_helper }}</p>                      

                      <label 
                      @dragover.prevent
                      @dragenter="handleDragEnter"
                      @dragleave="handleDragLeave"                      
                      @drop="handleImageDrop"
                      for="preload_image"
                      :class="[
                        'mb-3 relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer',
                        isDragging ? 'bg-gray-100' : 'hover:bg-gray-100'
                      ]"
                      >
                          <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <div v-if="imagePreview" class="w-full h-full">
                              <img :src="imagePreview" class="w-full h-full object-contain max-h-[230px] max-w-[230px]" />
                            </div>
                            <div v-else-if="preload_image" class="w-full h-full">
                              <img :src="preload_image" class="w-full h-full object-contain max-h-[230px] max-w-[230px]" />
                            </div>                            
                            <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">                            
                              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                          </div>
                          <input @change="handleFileInput" id="preload_image" name="preload_image" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
                      </label>

                      <p v-if="preload_image" class="">
                        <strong>Current image:</strong> {{ preload_image.slice(0, 200) }}
                      </p>

                      <Button config_key="speed_code" title="Update Image" :status_object="buttons" id="preload_image" />

                      <span @click.prevent="remove_image">
                        <Button config_key="speed_code" title="Remove Image" :status_object="buttons" id="remove_image" :buttonclass="deleteButton" />
                      </span>

                    </form>

                </div> 

            </div>    

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="skip_lazyload" ref="skip_lazyload">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 128 128" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M96.1,103.6c-10.4,8.4-23.5,12.4-36.8,11.1c-10.5-1-20.3-5.1-28.2-11.8H44v-8H18v26h8v-11.9c9.1,7.7,20.4,12.5,32.6,13.6   c1.9,0.2,3.7,0.3,5.5,0.3c13.5,0,26.5-4.6,37-13.2c19.1-15.4,26.6-40.5,19.1-63.9l-7.6,2.4C119,68.6,112.6,90.3,96.1,103.6z"/><path d="M103,19.7c-21.2-18.7-53.5-20-76.1-1.6C7.9,33.5,0.4,58.4,7.7,81.7l7.6-2.4C9,59.2,15.5,37.6,31.9,24.4   C51.6,8.4,79.7,9.6,98,26H85v8h26V8h-8V19.7z"/></g></svg>                       
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Skip Lazyloading</h5>                      
                      </div>                      

                      <textarea 
                        @keyup="handleKeyup"
                        id="skip_lazyload" 
                        name="skip_lazyload"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="skip_lazyload"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-5 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ skip_lazyload_helper }}</p>


                      <div class="flex items-left mb-4 mt-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48H0V0z" fill="none"/><path d="M26.1 19.58L20 15v18l6.1-4.58L32 24zm0 0L20 15v18l6.1-4.58L32 24zm0 0L20 15v18l6.1-4.58L32 24zM22 8.14V4.1c-4.02.4-7.68 2-10.64 4.42l2.84 2.86c2.22-1.72 4.88-2.88 7.8-3.24zM11.38 14.2l-2.86-2.84C6.1 14.32 4.5 17.98 4.1 22h4.04c.36-2.92 1.52-5.58 3.24-7.8zM8.14 26H4.1c.4 4.02 2 7.68 4.42 10.64l2.86-2.86C9.66 31.58 8.5 28.92 8.14 26zm3.22 13.48C14.32 41.9 18 43.5 22 43.9v-4.04c-2.92-.36-5.58-1.52-7.8-3.24l-2.84 2.86zM44 24c0 10.32-7.84 18.84-17.9 19.9v-4.04C33.94 38.82 40 32.1 40 24S33.94 9.18 26.1 8.14V4.1C36.16 5.16 44 13.68 44 24z" fill="#010101"/></svg>                       
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Force Lazyloading</h5>                      
                      </div>                      

                      <textarea 
                        @keyup="handleKeyup"
                        id="force_lazyload" 
                        name="force_lazyload"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="force_lazyload"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ force_lazyload_helper }}</p>                      

                      

                      <Button config_key="speed_code" title="Update Lazyload Settings" :status_object="buttons" id="skip_lazyload" />

                    </form>                   

                  </div>
               


                </div>
            </div> 
              
            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0" >

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M11 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M4.04193 18.2622C4.07264 18.5226 4.12583 18.7271 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V13M15 5.28571L16.8 7L21 3" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> 
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Image Optimisation</h5>                      
                      </div>                      

                      <p>We use the excellent free plugin <a href='https://wordpress.org/plugins/compressx/' target="_blank">CompressX</a> for image optimisation, which you can install directly from this panel.</p>

                      <p v-if="pluginStatus === null" class="mt-3">
                        <Skeleton rows="1" />
                      </p>                   

                      <div v-else class="grid grid-cols-[20px_1fr] gap-4 mt-4 border border-gray-200 rounded p-4 pl-3">

                            <div class="w-[20px]">
                              <div class="inline-flex items-center justify-center flex-shrink-0 w-10 h-10">
                                  <img src='data:image/webp;base64,UklGRqIEAABXRUJQVlA4IJYEAADwFQCdASpAAEAAPp1Cm0sloyIhqhZqMLATiWQAwcOgNO26hs9vdzyXOAdbXvNl+gdU3oa+/3s7k4Xz/Cr6dvJL/dd7Hlu8mv6F/rO5y9E9LFoAflT0D89v0v7A/6wdbtWbXMnr+tLQxgeVBlr8Y8tvVrrMfq8NF9kUXpSySyLT/arV6oW1T51xFcbtIBP4NO30d5T1zigHZl5bbZxqBGvCTrl7QAFS7Uh7yPYweVsC5r2p7IOyesYAAP7zvdauhbz767fpjLaFZD+UqyPelL9TiajbGQbOCIFDhtFzb5kO8hNa9amuBD/InIS4m4L3dRikWLsjED143prHh96Thtyzgls/BUG77fKBB0+FtWsyvZ43Yxwr7Ii+WXPWXhLW5gsyBxE8oEDq8KxWG+5cW6yNxAg+ew/oIztDs/+aVuVC1PPLfnx6bf2gHb+uA31sDlRdyC82w9ob9b+s+VYjKJlXP4R4ciA0Srd89QiteoFEi47bPF1HZrDacfZFKxKmmXKLD5lV+ND4qrlFi3qSN3bOqepvDwuQg7jGf+ROQ9CQMCHliP3evWHkEO4nwxDxZ+p191We7e7WOvwro4uQEG2KcdTzPcRhlDyz58ieJqI0i4G9VMwaQv68Af7YBaYezXbizB3aB7VFhgegFtUKTfn5PLGyGEVa4ekLOfq1c+skfIvAroGmknmdjobTFu/91NsLzpEWKyMeJUIIj8DLzgfgaYckna0xlz3+I3vtNA4xKP+MfkuAQTppL5muJeSFp7552mdVAFvVrHYc89DuKxn6izsd2gS0uurCXcnZ/h1s/drQixbw2ut/GSkbZzgLfuLLf/s1235+L9TChwY9rUrmXX7BLXE0C7u87/8ySx3CP7WzOqeAHSBa+6yuzbCGIGDlVZB8a5//FZfYdJLnD7bkANEsvnEAfqWurN8J7N85QIeeKnB6ocz61lMiNCitNWV1m+ZCerrx2/aHT0gCM/QQdFhupvw/s4w701KledgdyRmJq2v84CgWx+L1KaBAY6LxwUFCivQe0MSMg4ReenYvK1lzB3L6vwDprQdPcSdK9A0VQfPdQqpcwtRR8nnaNF6Re4ni4MquYMJFIQfQZFYYfDhZPQ/56ZhQJh+GZEr0S5SozT1RWQ45aEh77k+an2CanFws4FpN9zwEd0zRy7w6qreYBYN9envXiGo8D87eb4qw9ZY6aeHCfnv4uBY4qKDDllx5tyJM4UC+R/Dy3/pZ5xQwnblaozxX3L0nkFZAa3X4INb0P3Rhu6Hx5LMzSjViY8mewJtTn9A/25QoK3DEZgW0lk+KqghT3+2jsB+Wfci5mDAb2yDJ17p33X2yV60yfECS2CQW0pFnUdypmFWFJEbkeeVkmgJo0Zh27LWCEIZ0EQ8cEtn3oo6k/iY5QeZ+6Wf2OC0g+gmJDkmLmmyMmImtzE5w4ZA9EwhowkupqZGjlyWsGf+sqI5JMgnvSpfhIW34BRI0Havn8XDPZutXKXBNqeUgb2Ivg7NdW3beI4Bh3AL9B35I9MzndkpUnbvMP7/E42H4ol77cx7BSryim+TIyAAA'/>
                              </div>
                            </div>
                            <div class="flex-1 ms-3 text-sm font-normal">
                                <span class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                                    <span v-if="pluginStatus == ''">CompressX can be downloaded from the WordPress repository by clicking below</span>
                                    <span v-else-if="pluginStatus == 'deactivated'">CompressX was successfully downloaded and is now ready to activate.</span>                                  
                                    <span v-else-if="pluginStatus == 'activated'">CompressX was successfully downloaded and activated. Click the button below to update with our recommended settings.</span>       
                                    <span v-else-if="pluginStatus == 'configured' && canRewrite == false">Configuration saved but CompressX cannot rewrite.</span>       
                                    <span v-else-if="pluginStatus == 'configured'">CompressX was configured correctly.</span>                                           
                                    <span v-else>{{ pluginStatus }}</span>       
                                    <p class="col-span-2 mt-2 font-normal opaque" v-if="pluginStatus == 'Multisite is not supported'">
                                      Unfortunately CompressX isn't compatibile with MultiSite in its free version
                                    </p>  
                                    <p class="col-span-2 mt-2 font-normal opaque" v-if="pluginStatus == 'configured' && canRewrite == false">
                                      CompressX is reporting that it can't rewrite the compressed images. You can find full information on the issue in <a :href="adminUrl">their control panel</a>.
                                    </p>                                                                                                                                           
                                    <p class="col-span-2 mt-2 font-normal opaque" v-else-if="pluginStatus == 'configured'">
                                      To change advanced options or compress your images already on the site, use the control panel <a :href="adminUrl">here</a>. New uploads will be compressed automatically.
                                    </p>                                                                                                                                           
                                </span>
                            </div>     

                            <ul class="grid w-full gap-2 mb-2 mt-3" v-if="pluginStatus == '' || pluginStatus == 'deactivated' || pluginStatus == 'activated'">
                                <li  v-if="pluginStatus == ''">
                                    <input type="radio" id="license_status_new" name="license_status" value="new" class="!hidden peer" required @change="enable_compressx"  />
                                    <label for="license_status_new" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600">                           
                                        <div class="block w-[150px]">
                                            <div class="w-full text-lg font-semibold">Download CompressX</div>
                                            <div class="w-full" v-if="!downLoading">Let's get the plugin installed</div>
                                            <div class="w-full" v-else>                                        
                                              <span>Downloading plugin</span>
                                            </div>
                                        </div>
                                        <svg v-if="!downLoading" class="w-4 h-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                        </svg>                                    
                                        <svg v-else aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101"  xmlns="http://www.w3.org/2000/svg">
                                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"/>
                                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" />
                                        </svg>                                        
                                    </label>
                                </li>                              
                                <li v-else-if="pluginStatus == 'deactivated'" >
                                    <input type="radio" id="license_status_new" name="license_status" value="new" class="!hidden peer" required @click="startActivation(actionUrl)" />
                                    <label for="license_status_new" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600">                           
                                        <div class="block w-[150px]">
                                            <div class="w-full text-lg font-semibold">Activate CompressX</div>
                                            <div class="w-full">Opens in a new window. Return here after activating.</div>
                                        </div>
                                        <svg v-if="!checkingActivation" class="w-4 h-4 rtl:rotate-180 nogradient" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve">
                                          <g>
                                            <path d="M48.7,2H29.6C28.8,2,28,2.5,28,3.3v3C28,7.1,28.7,8,29.6,8h7.9c0.9,0,1.4,1,0.7,1.6l-17,17
                                              c-0.6,0.6-0.6,1.5,0,2.1l2.1,2.1c0.6,0.6,1.5,0.6,2.1,0l17-17c0.6-0.6,1.6-0.2,1.6,0.7v7.9c0,0.8,0.8,1.7,1.6,1.7h2.9
                                              c0.8,0,1.5-0.9,1.5-1.7v-19C50,2.5,49.5,2,48.7,2z"/>
                                            <path d="M36.3,25.5L32.9,29c-0.6,0.6-0.9,1.3-0.9,2.1v11.4c0,0.8-0.7,1.5-1.5,1.5h-21C8.7,44,8,43.3,8,42.5v-21
                                              C8,20.7,8.7,20,9.5,20H21c0.8,0,1.6-0.3,2.1-0.9l3.4-3.4c0.6-0.6,0.2-1.7-0.7-1.7H6c-2.2,0-4,1.8-4,4v28c0,2.2,1.8,4,4,4h28
                                              c2.2,0,4-1.8,4-4V26.2C38,25.3,36.9,24.9,36.3,25.5z"/>
                                          </g>
                                        </svg>     
                                       <svg v-else aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101"  xmlns="http://www.w3.org/2000/svg">
                                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"/>
                                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" />
                                        </svg>                                                                      
                                    </label>
                                </li>
                                <li v-else-if="pluginStatus == 'activated'" >
                                    <input type="radio" id="license_status_new" name="license_status" value="new" class="!hidden peer" required @change="configure_compressx"  />
                                    <label for="license_status_new" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600">                           
                                        <div class="block w-[150px]">
                                            <div class="w-full text-lg font-semibold">Configure CompressX</div>
                                            <div class="w-full">We'll add lossy compression and auto compression of new uploads</div>
                                        </div>
                                        <svg v-if="!configuringPlugin" class="w-4 h-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                        </svg>                               
                                        <svg v-else aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101"  xmlns="http://www.w3.org/2000/svg">
                                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"/>
                                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" />
                                        </svg>
                                    </label>
                                </li>                                
                            </ul>                                     

                      </div>                


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

export default {
  data() {
    return {
      imagePreview: null,
      isDragging: false,
      pluginVersion: null, 
      pluginStatus: null, 
      actionUrl: null,  
      adminUrl: null,    
      downLoading: null,
      configuringPlugin: null,
      checkingActivation: null,
      canRewrite: null,
      deleteButton: "from-red-500 to-red-800 text-red-800",      
      buttons: {
        skip_lazyload: createButtonState(),    
        preload_image: createButtonState(), 
        remove_image: createButtonState(),          
      },
      skip_lazyload: (window.spress_namespace.config.speed_code.skip_lazyload.value),
      skip_lazyload_helper: (window.spress_namespace.config.speed_code.skip_lazyload.helper),
      preload_image: (window.spress_namespace.config.speed_code.preload_image.value),
      preload_image_helper: (window.spress_namespace.config.speed_code.preload_image.helper),  
      force_lazyload: (window.spress_namespace.config.speed_code.force_lazyload.value),
      force_lazyload_helper: (window.spress_namespace.config.speed_code.force_lazyload.helper),  
    };
  },
  mounted() {
    this.fetchData().then(() => {
    });
  },
  beforeDestroy() {
  },  
  methods: {
    async startActivation(url) {
      
      //Open in new tab
      window.open(url, '_blank');

      //Check to see if activated
      this.checkingActivation = true;

      // Fetch data every 10 seconds until pluginStatus is activated
      while (this.pluginStatus !== 'activated') {
        await this.fetchData();
      }


    },
    async fetchData() {
      return new Promise((resolve, reject) => {
        api.get(window.spress_namespace.resturl + 'speedifypress/get_compressx_data')
          .then(response => {            
            this.pluginVersion = response.data.version;
            this.actionUrl = response.data.action_url;
            this.pluginStatus = response.data.status; 
            this.adminUrl = response.data.admin_url;
            this.canRewrite = response.data.can_rewrite;
            resolve();
          })
          .catch(error => {
            console.error(error.response.data);
            this.pluginStatus= error.response.data.message;
            reject(error);
          });
      });
    },    
    async configure_compressx() {
      
      this.configuringPlugin = true;

      // Make your AJAX POST request here
      api.get(window.spress_namespace.resturl + 'speedifypress/handle_compressx?action=configure')
        .then(response => {
          this.fetchData().then(() => {
            this.configuringPlugin = false;
            this.pluginStatus = 'configured'
          })          
        })
        .catch(error => {
          
      });

    },
    async enable_compressx() {

      this.downLoading = true;

      // Make your AJAX POST request here
      api.get(window.spress_namespace.resturl + 'speedifypress/handle_compressx?action=install')
        .then(response => {
          this.fetchData().then(() => {
            this.downLoading = false;
          })          
        })
        .catch(error => {
          
      });


    },    
    remove_image() {
      this.preload_image = null;
      this.imagePreview = null;
    },
    handleDragEnter() {
      this.isDragging = true; // Add dragging state
    },
    handleDragLeave() {
      this.isDragging = false; // Remove dragging state
    },    
    handleFileSelection(file) {
      if (file && file.type.startsWith('image/')) {
        // Create a preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result; // Set the preview
        };
        reader.readAsDataURL(file);
        this.isDragging = false;
      }
    },    
    handleImageDrop(event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          this.handleFileSelection(file);
        }
      }
    },    
    handleFileInput(event) {
      const file = event.target.files[0];
      if (file) {
        this.handleFileSelection(file);
      }
    },       
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
      let config_key = '';

      //Get the config key
      Array.from(formElements).forEach((element) => {    
        if (element.type === 'hidden' && element.name === 'config_key') {
          config_key = element.value;
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
        if(typeof window.spress_namespace.config[config_key][element.name] != 'undefined') {
          window.spress_namespace.config[config_key][element.name].value = formDataJson[element.name];
        }


      });

      //Add image if exists
      if(this.imagePreview && ref == "preload_image") {
        formDataJson['preload_image'] = this.imagePreview;
      } else if(this.preload_image && ref == "preload_image") {        
        formDataJson['preload_image'] = this.preload_image;
      }      

      // Encode the values using btoa()
      for (let key in formDataJson) formDataJson[key] = btoa(
        encodeURIComponent(formDataJson[key])
          .replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      );  

      // Make your AJAX POST request here
      api.post(window.spress_namespace.resturl + 'speedifypress/update_config', formDataJson)
        .then(response => {
 
          // Handle the response here
          if(response.data && ref == "preload_image") {
            this.preload_image = response.data;
            window.spress_namespace.config.speed_code.preload_image.value = this.preload_image;
          } 
 
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