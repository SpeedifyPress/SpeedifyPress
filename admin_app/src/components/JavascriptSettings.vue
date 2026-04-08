<script setup>

import Skeleton from './../components/Skeleton.vue'
import Button from './../components/Button.vue'
import CodeEditor from './../components/CodeEditor.vue'

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

import { api } from '../lib/api';

</script>

<template>
  <div>

    <div class="flex flex-wrap">

            <div class="w-full p-2 mr-4" >
                <div class="flex items-left mb-4">
                    <span v-html="icon" class="mr-2 force-gradient"></span>
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">JavaScript Settings</h5>
                    <svg v-if="isPro " @click="emit('showDocs', 'JavaScript Settings')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>       

            <div class="w-full p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="flex flex-wrap" data-ref="js_delay" ref="js_delay">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Delay</h5>                      
                      </div>                         

                      <div class="w-full bg-white " >

                        <div class="flex">
                            <div class="flex items-center h-5 mt-2">
                                <input id="delay_js" name="delay_js" aria-describedby="helper-checkbox-text" type="checkbox" 
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                      v-model="delay_js"
                                      v-bind:checked="delay_js === 'true'"
                                >
                            </div>
                            <div class="ms-2 text-sm">

                                <label for="delay_js" class="font-medium text-gray-900 dark:text-gray-300">Delay JavaScript</label>
                                <p id="delay_js-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ delay_js_helper }}</p>

                                <div class="mt-4"  v-if="delay_js === 'true' || delay_js == true">  
                                  <input                               
                                    type="number" step="0.01" name="delay_seconds" id="delay_seconds" 
                                    class="w-[80px] text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="6"
                                    v-model="delay_seconds"
                                    />                            
                                    <label for="delay_seconds" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter delay in seconds</label>    
                                    <p id="delay_seconds-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ delay_seconds_helper }}</p>                        
                                </div>

                                <div class="flex flex-wrap mt-4"  v-if="delay_js === 'true' || delay_js == true">

                                    <h5 class="w-full mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Exclusions</h5>

                                      <div class="ml-0 w-1/2 lg:w-1/2 max-lg:w-full max-w-md pr-4">

                                          <p class="font-medium text-gray-900 dark:text-gray-300 text-sm"><label>Exclude scripts from delay</label></p>                     

                                          <textarea 
                                            id="delay_exclude" 
                                            name="delay_exclude"  
                                            class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            v-model="delay_exclude"
                                            style="box-shadow:inherit!important"
                                          ></textarea>                    
                                          <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ delay_exclude_helper }}</p>
            
                                      </div>              

                                      <div class="ml-0 w-1/2 lg:w-1/2 max-lg:w-full max-w-md pr-4">

                                          <p class="font-medium text-gray-900 dark:text-gray-300 text-sm"><label>Exclude URLs from delay</label></p>                     

                                          <textarea 
                                            id="delay_exclude_urls" 
                                            name="delay_exclude_urls"  
                                            class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            v-model="delay_exclude_urls"
                                            style="box-shadow:inherit!important"
                                          ></textarea>                    
                                          <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ delay_exclude_urls_helper }}</p>
            
                                      </div>           

                                      <h5 class="w-full mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Load Order</h5>                                      

                                      <div class="ml-0 w-1/2 lg:w-1/2 max-lg:w-full max-w-md pr-4">

                                          <p class="font-medium text-gray-900 dark:text-gray-300 text-sm"><label>Load JavaScript First</label></p>                     

                                          <textarea 
                                            id="script_load_first" 
                                            name="script_load_first"  
                                            class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            v-model="script_load_first"
                                            style="box-shadow:inherit!important"
                                          ></textarea>                    
                                          <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ script_load_first_helper }}</p>
            
                                      </div>                                         

                                      <div class="ml-0 w-1/2 lg:w-1/2 max-lg:w-full max-w-md pr-4">

                                          <p class="font-medium text-gray-900 dark:text-gray-300 text-sm"><label>Load JavaScript Last</label></p>                     

                                          <textarea 
                                            id="script_load_last" 
                                            name="script_load_last"  
                                            class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            v-model="script_load_last"
                                            style="box-shadow:inherit!important"
                                          ></textarea>                    
                                          <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ script_load_last_helper }}</p>
            
                                      </div>    
                                    
                                      <h5 class="w-full mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Custom Executions</h5> 

                                      <div class="ml-0 w-full pr-4">

                                          <p class="font-medium text-gray-900 dark:text-gray-300 text-sm"><label>JavaScript to run on completion</label></p>      

                                          <CodeEditor
                                            name="load_complete_js"
                                            v-model="load_complete_js"
                                            language="javascript"
                                            pre-class="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2.5 py-2.5 h-32 m-[12px]"

                                          />                                                                                                       
              
                                          <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ load_complete_js_helper }}</p>                                               
            
                                      </div>    

                                      <span v-if="isPro ">

                                        <h5 class="w-full mb-1 mt-3 text-base text-gray-500 md:text-lg dark:text-gray-400">Completion Triggers</h5>

                                        <div class="ml-0 w-full pr-4">

                                            <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            When JavaScript is delayed, load events that are created in the delayed scripts will often fail to fire, as the document has already loaded. The default configuaration will re-fire the jQuery events in <i>document</i> and the native events on <i>window</i>. 
                                            This will work in most cases and is generally safe, although it may require certain functions to be re-run in "Custom Excecutions". Alternatively, advanced users may want to change the settings below. 
                                            </p>                                                          

                                              <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                                                  <table class="w-full text-sm text-left rtl:text-right text-body">
                                                      <thead class="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                                                          <tr>
                                                              <th></th>
                                                              <th scope="col" colspan="2" class="px-6 py-3 w-1/4">
                                                                  jQuery Broadcast
                                                              </th>
                                                              <th scope="col" colspan="2" class="px-6 py-3 w-1/4">
                                                                  Native Interception
                                                              </th>
                                                              <th scope="col" colspan="2" class="px-6 py-3 w-1/4">
                                                                  Native Broadcast
                                                              </th>
                                                          </tr>
                                                          <tr>
                                                              <th></th>
                                                              <th scope="col" class="px-6 py-3 font-normal">
                                                                  Window
                                                              </th>
                                                              <th scope="col" class="px-6 py-3 font-normal">
                                                                  Document
                                                              </th>                                                            
                                                              <th scope="col" class="px-6 py-3 font-normal">
                                                                  Window
                                                              </th>
                                                              <th scope="col" class="px-6 py-3 font-normal">
                                                                  Document
                                                              </th>  
                                                              <th scope="col" class="px-6 py-3 font-normal">
                                                                  Window
                                                              </th>
                                                              <th scope="col" class="px-6 py-3 font-normal">
                                                                  Document
                                                              </th>  
                                                          </tr>                                                        
                                                      </thead>
                                                      <tbody>
                                                          <tr class="bg-neutral-primary border-b border-default">
                                                              <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                                  DOM is ready 
                                                              </th>
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_jquery_broadcast.dom.window" name="trigger_jquery_broadcast.dom.window" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_jquery_broadcast.dom.window"
                                                                            v-bind:checked="trigger_jquery_broadcast.dom.window === 'true'"
                                                                    >                    
                                                              </td>
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_jquery_broadcast.dom.document" name="trigger_jquery_broadcast.dom.document" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_jquery_broadcast.dom.document"
                                                                            v-bind:checked="trigger_jquery_broadcast.dom.document === 'true'"
                                                                    >                    
                                                                                  
                                                              </td>                                                            
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_interception.dom.window" name="trigger_native_interception.dom.window" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_interception.dom.window"
                                                                            v-bind:checked="trigger_native_interception.dom.window === 'true'"
                                                                    >                    
                                                                                  
                                                              </td>
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_interception.dom.document" name="trigger_native_interception.dom.document" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_interception.dom.document"
                                                                            v-bind:checked="trigger_native_interception.dom.document === 'true'"
                                                                    >                                                                                                      
                                                              </td>    
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_broadcast.dom.window" name="trigger_native_broadcast.dom.window" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_broadcast.dom.window"
                                                                            v-bind:checked="trigger_native_broadcast.dom.window === 'true'"
                                                                    >                                                                                                      
                                                              </td>   
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_broadcast.dom.document" name="trigger_native_broadcast.dom.document" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_broadcast.dom.document"
                                                                            v-bind:checked="trigger_native_broadcast.dom.document === 'true'"
                                                                    >                                                                                                       
                                                              </td>                                                                                                                                                                                    
                                                          </tr>
                                                          <tr class="bg-neutral-primary border-b border-default">
                                                              <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                                  Page is fully loaded
                                                              </th>
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_jquery_broadcast.load.window" name="trigger_jquery_broadcast.load.window" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_jquery_broadcast.load.window"
                                                                            v-bind:checked="trigger_jquery_broadcast.load.window === 'true'"
                                                                    >                    
                                                              </td>
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_jquery_broadcast.load.document" name="trigger_jquery_broadcast.load.document" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_jquery_broadcast.load.document"
                                                                            v-bind:checked="trigger_jquery_broadcast.load.document === 'true'"
                                                                    >                    
                                                                                  
                                                              </td>                                                            
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_interception.load.window" name="trigger_native_interception.load.window" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_interception.load.window"
                                                                            v-bind:checked="trigger_native_interception.load.window === 'true'"
                                                                    >                    
                                                                                  
                                                              </td>
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_interception.load.document" name="trigger_native_interception.load.document" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_interception.load.document"
                                                                            v-bind:checked="trigger_native_interception.load.document === 'true'"
                                                                    >                                                                                                      
                                                              </td>    
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_broadcast.load.window" name="trigger_native_broadcast.load.window" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_broadcast.load.window"
                                                                            v-bind:checked="trigger_native_broadcast.load.window === 'true'"
                                                                    >                                                                                                      
                                                              </td>   
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_broadcast.load.document" name="trigger_native_broadcast.load.document" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_broadcast.load.document"
                                                                            v-bind:checked="trigger_native_broadcast.load.document === 'true'"
                                                                    >                                                                                                       
                                                              </td>                                                                                                                                                                                    
                                                          </tr>         
                                                          <tr class="bg-neutral-primary border-b border-default">
                                                              <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                                  Readystate changed
                                                              </th>
                                                              <td class="px-6 py-4">
                                                                                    
                                                              </td>
                                                              <td class="px-6 py-4">                                                                                 
                                                                                  
                                                              </td>                                                            
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_interception.readystate.window" name="trigger_native_interception.readystate.window" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_interception.readystate.window"
                                                                            v-bind:checked="trigger_native_interception.readystate.window === 'true'"
                                                                    >                    
                                                                                  
                                                              </td>
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_interception.readystate.document" name="trigger_native_interception.readystate.document" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_interception.readystate.document"
                                                                            v-bind:checked="trigger_native_interception.readystate.document === 'true'"
                                                                    >                                                                                                      
                                                              </td>    
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_broadcast.readystate.window" name="trigger_native_broadcast.readystate.window" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_broadcast.readystate.window"
                                                                            v-bind:checked="trigger_native_broadcast.readystate.window === 'true'"
                                                                    >                                                                                                      
                                                              </td>   
                                                              <td class="px-6 py-4">
                                                                  <input id="trigger_native_broadcast.readystate.document" name="trigger_native_broadcast.readystate.document" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            v-model="trigger_native_broadcast.readystate.document"
                                                                            v-bind:checked="trigger_native_broadcast.readystate.document === 'true'"
                                                                    >                                                                                                       
                                                              </td>                                                                                                                                                                                    
                                                          </tr> 
                                                      </tbody>
                                                  </table>
                                              </div>                                                                                                                                     
              
                                        </div>           

                                        <h5 class="w-full mb-0 mt-5 text-base text-gray-500 md:text-lg dark:text-gray-400">Completion Events</h5>                            

                                        <div class="ml-0 w-1/2 lg:w-1/2 max-lg:w-full max-w-md pr-4">

                                              <div class="flex mt-2 mb-4">
                                                  <div class="flex items-center h-5 mt-2">
                                                      <input id="trigger_replays" name="trigger_replays" aria-describedby="helper-checkbox-text" type="checkbox" 
                                                              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                              v-model="trigger_replays"
                                                              v-bind:checked="trigger_replays === 'true'"
    
                                                      >
                                                  </div>
                                                  <div class="ms-2 text-sm">
                                                      <label for="trigger_replays" class="font-normal text-gray-900 dark:text-gray-300">Event Replays</label>
                                                      <p id="trigger_replays-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">If a user clicks or mouseovers before the JS is ready, replay the event once it is.</p>
                                                  </div>
                                              </div>                                                                                                                                       
              
                                        </div>          

                                      </span>                              

                                </div>                                  

                            </div>
                        </div>           

                      </div>                  

                      <div class="w-full" >
                      <Button config_key="speed_js" title="Update Delay Settings" :status_object="buttons" id="js_delay" />
                      </div>

                    </form>

                  </div>

                </div>

            </div>

            <div class="w-full max-w-sm p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" v-if="isPro " >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="flex flex-wrap" data-ref="force_js_inline" ref="force_js_inline">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z" fill="#1C274C"/><path d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="#1C274C" stroke-width="1.5"/><path d="M7 14L6 15L7 16M11.5 16L12.5 17L11.5 18M10 14L8.5 18" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Force JS Inline</h5>                      
                      </div>                         

                      <div class="w-full bg-white" >

                        <div class="flex">

                            <div class="ms-2 text-sm">

                                <div class="flex mt-1">
                                    
                                    <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">                                                

                                      <div class="ml-0 w-full max-w-md pr-4">

                                          <p class="font-medium text-gray-900 dark:text-gray-300 text-sm"><label>Force the contents of these JS files to be inlined</label></p>                     

                                          <textarea 
                                            id="force_js_inline" 
                                            name="force_js_inline"  
                                            class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            v-model="force_js_inline"
                                            style="box-shadow:inherit!important"
                                          ></textarea>                    
                                          <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ force_js_inline_helper }}</p>
            
                                      </div>                         

                                </div>   

                            </div>  
                            
                        </div>     

                      </div>                  

                      <div class="w-full" >
                      <Button config_key="speed_js" title="Update Inline Settings" :status_object="buttons" id="force_js_inline" />
                      </div>

                    </form>

                  </div>

                </div>

            </div>                                                                       

            <div class="w-full max-w-lg  p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow"  v-if="isPro ">

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="flex flex-wrap" data-ref="js_defer" ref="js_defer">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M16,0.5c-0.82813,0-1.5,0.67188-1.5,1.5v4c0,0.82813,0.67188,1.5,1.5,1.5s1.5-0.67188,1.5-1.5V2   C17.5,1.17188,16.82813,0.5,16,0.5z"/><path d="M7.5,16c0-0.82813-0.67188-1.5-1.5-1.5H2c-0.82813,0-1.5,0.67188-1.5,1.5s0.67188,1.5,1.5,1.5h4   C6.82813,17.5,7.5,16.82813,7.5,16z"/><path d="M7.86816,22.01074l-2.82813,2.82813c-0.58594,0.58594-0.58594,1.53516,0,2.12109   c0.29297,0.29297,0.67676,0.43945,1.06055,0.43945s0.76758-0.14648,1.06055-0.43945l2.82813-2.82813   c0.58594-0.58594,0.58594-1.53516,0-2.12109S8.4541,21.4248,7.86816,22.01074z"/><path d="M16,24.5c-0.82813,0-1.5,0.67188-1.5,1.5v4c0,0.82813,0.67188,1.5,1.5,1.5s1.5-0.67188,1.5-1.5v-4   C17.5,25.17188,16.82813,24.5,16,24.5z"/><path d="M24.13184,22.01074c-0.58594-0.58594-1.53516-0.58594-2.12109,0s-0.58594,1.53516,0,2.12109l2.82813,2.82813   c0.29297,0.29297,0.67676,0.43945,1.06055,0.43945s0.76758-0.14648,1.06055-0.43945c0.58594-0.58594,0.58594-1.53516,0-2.12109   L24.13184,22.01074z"/><path d="M30,14.5h-4c-0.82813,0-1.5,0.67188-1.5,1.5s0.67188,1.5,1.5,1.5h4c0.82813,0,1.5-0.67188,1.5-1.5S30.82813,14.5,30,14.5z"/><path d="M23.07129,10.42871c0.38379,0,0.76758-0.14648,1.06055-0.43945l2.82813-2.82813c0.58594-0.58594,0.58594-1.53516,0-2.12109   s-1.53516-0.58594-2.12109,0l-2.82813,2.82813c-0.58594,0.58594-0.58594,1.53516,0,2.12109   C22.30371,10.28223,22.6875,10.42871,23.07129,10.42871z"/></g></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Defer</h5>                      
                      </div>                         

                      <div class="w-full bg-white" >

                        <div class="flex">
                            <div class="flex items-center h-5 mt-2 ">
                                <input id="defer_js" name="defer_js" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="defer_js"
                                        v-bind:checked="defer_js === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">

                                <label for="defer_js" class="font-medium text-gray-900 dark:text-gray-300">Defer JavaScript</label>
                                <p id="defer_js-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ defer_js_helper }}</p>                           

                                <div class="flex mt-4" v-if="defer_js === 'true' || defer_js == true">
                                    
                                    <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">                                                

                                      <div class="ml-0 w-1/2 lg:w-1/2 max-lg:w-full max-w-md pr-4">

                                          <p class="font-medium text-gray-900 dark:text-gray-300 text-sm"><label>Exclude scripts from defer</label></p>                     

                                          <textarea 
                                            id="defer_exclude" 
                                            name="defer_exclude"  
                                            class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            v-model="defer_exclude"
                                            style="box-shadow:inherit!important"
                                          ></textarea>                    
                                          <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ defer_exclude_helper }}</p>
            
                                      </div>              

                                      <div class="ml-0 w-1/2 lg:w-1/2 max-lg:w-full max-w-md pr-4">

                                          <p class="font-medium text-gray-900 dark:text-gray-300 text-sm"><label>Exclude URLs from defer</label></p>                     

                                          <textarea 
                                            id="defer_exclude_urls" 
                                            name="defer_exclude_urls"  
                                            class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            v-model="defer_exclude_urls"
                                            style="box-shadow:inherit!important"
                                          ></textarea>                    
                                          <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ defer_exclude_urls_helper }}</p>
            
                                      </div>              



                                </div>   

                            </div>  
                            
                        </div>     

                      </div>                  

                      <div class="w-full" >
                      <Button config_key="speed_js" title="Update Defer Settings" :status_object="buttons" id="js_defer" />
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

const LOAD_COMPLETE_TRIGGER_SNIPPET = '["ready","DOMContentLoaded","load"].forEach((n=>{const d=new Event(n);document.dispatchEvent(d)}));'; 

function createButtonState() {
  return { spinner: false, text: false, success: false, failure: false };
}

export default {
  data() {
    return {
      buttons: {
        force_js_inline: createButtonState(),
        js_defer: createButtonState(),   
        js_delay: createButtonState(),           
        script_load_first: createButtonState(),           
        script_load_last: createButtonState(),             
      },
      force_js_inline: (window.spress_namespace.config.speed_js.force_js_inline.value),
      force_js_inline_helper: (window.spress_namespace.config.speed_js.force_js_inline.helper),
      defer_js: (window.spress_namespace.config.speed_js.defer_js.value),      
      defer_js_helper: (window.spress_namespace.config.speed_js.defer_js.helper),      
      delay_js: (window.spress_namespace.config.speed_js.delay_js.value),
      delay_js_helper: (window.spress_namespace.config.speed_js.delay_js.helper),
      delay_seconds: (window.spress_namespace.config.speed_js.delay_seconds.value),
      delay_seconds_helper: (window.spress_namespace.config.speed_js.delay_seconds.helper),     
      script_load_first: (window.spress_namespace.config.speed_js.script_load_first.value),
      script_load_first_helper: (window.spress_namespace.config.speed_js.script_load_first.helper), 
      script_load_last: (window.spress_namespace.config.speed_js.script_load_last.value),
      script_load_last_helper: (window.spress_namespace.config.speed_js.script_load_last.helper), 
      defer_exclude: (window.spress_namespace.config.speed_js.defer_exclude.value),
      defer_exclude_helper: (window.spress_namespace.config.speed_js.defer_exclude.helper), 
      defer_exclude_urls: (window.spress_namespace.config.speed_js.defer_exclude_urls.value),
      defer_exclude_urls_helper: (window.spress_namespace.config.speed_js.defer_exclude_urls.helper), 
      delay_exclude: (window.spress_namespace.config.speed_js.delay_exclude.value),
      delay_exclude_helper: (window.spress_namespace.config.speed_js.delay_exclude.helper), 
      delay_exclude_urls: (window.spress_namespace.config.speed_js.delay_exclude_urls.value),
      delay_exclude_urls_helper: (window.spress_namespace.config.speed_js.delay_exclude_urls.helper),    
      load_complete_js: (window.spress_namespace.config.speed_js.load_complete_js.value),
      load_complete_js_helper: (window.spress_namespace.config.speed_js.load_complete_js.helper),               
      trigger_native_interception: (window.spress_namespace.config.speed_js.trigger_native_interception.value),
      trigger_native_broadcast: (window.spress_namespace.config.speed_js.trigger_native_broadcast.value),
      trigger_jquery_broadcast: (window.spress_namespace.config.speed_js.trigger_jquery_broadcast.value),
      trigger_replays: (window.spress_namespace.config.speed_js.trigger_replays.value),
    };
  },
  mounted() {
  },
  beforeDestroy() {
  },  
  methods: {      
    updateLoadCompleteJsForTrigger(value) {

      if (value === true || value === 'true') {

        if (typeof this.load_complete_js !== 'string') {
          this.load_complete_js = ''
        }

        if (this.load_complete_js.indexOf(LOAD_COMPLETE_TRIGGER_SNIPPET) === -1) {
          if (this.load_complete_js.trim().length) {
            this.load_complete_js = this.load_complete_js.replace(/\s*$/, '') + '\n' + LOAD_COMPLETE_TRIGGER_SNIPPET
          } else {
            this.load_complete_js = LOAD_COMPLETE_TRIGGER_SNIPPET
          }
        }

      } else {

        if (typeof this.load_complete_js === 'string' && this.load_complete_js.indexOf(LOAD_COMPLETE_TRIGGER_SNIPPET) !== -1) {
          const escaped = LOAD_COMPLETE_TRIGGER_SNIPPET.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp('\\n?' + escaped + '\\s*', 'g')
          this.load_complete_js = this.load_complete_js.replace(regex, '').trim()
        }

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
      let checkboxHolder = {};
      //Force the correct value for checboxed
      Array.from(formElements).forEach((element) => {     
        //if (!element.name) {
        //  return
        //}           
        if (element.type === 'checkbox') {
          formDataJson[element.name] = element.checked.toString();
        } else if (element.type === 'radio') {
          if(element.checked === true) {
            formDataJson[element.name] = element.value;
          }
        } else {
          formDataJson[element.name] = element.value;
        }

        //Update global JS, all in speed_js namespace
        if(typeof window.spress_namespace.config.speed_js[element.name] != 'undefined') {
          window.spress_namespace.config.speed_js[element.name].value = formDataJson[element.name];
        }

        //Save checkbox data
        if(/\./.test(element.name) && element.type === 'checkbox') {
           let split = element.name.split(".");
           if(typeof checkboxHolder[split[0]] == "undefined") {
             checkboxHolder[split[0]] = {};
           }
           if(typeof checkboxHolder[split[0]][split[1]] == "undefined") {
             checkboxHolder[split[0]][split[1]] = {};
           }
           if(typeof split[2] != "undefined") {
             checkboxHolder[split[0]][split[1]][split[2]] = element.checked.toString();
           }
        }


      });   

      //Run through checkboxHolder if has length
      //and update global JS
      if(Object.keys(checkboxHolder).length > 0) {
        for (let key in checkboxHolder) {
          window.spress_namespace.config.speed_js[key].value = checkboxHolder[key];
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
          // Handle the response here
          //Set success
          this.setButton(this.buttons[ref],'success');
        })
        .catch(error => {
          // Handle any errors here
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
  }
};
</script>