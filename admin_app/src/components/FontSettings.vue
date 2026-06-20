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
const emit = defineEmits(['changeColumn','showDocs'])

// Function to emit the column change event
function changeColumn(newColumn) {
  emit('changeColumn', newColumn)
}

</script>

<template>
  <div>

    <div class="flex flex-wrap">

            <div class="w-full p-2 mr-4" >
                <div class="flex items-left mb-4">
                    <span v-html="icon" class="mr-2 force-gradient"></span>
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">Font Settings</h5>
                    <svg v-if="isPro " @click="emit('showDocs', 'Font Settings')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>                                       
                           
            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="update_external" ref="update_external">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 56.6934 56.6934" width="56.6934px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M51.981,24.4812c-7.7173-0.0038-15.4346-0.0019-23.1518-0.001c0.001,3.2009-0.0038,6.4018,0.0019,9.6017  c4.4693-0.001,8.9386-0.0019,13.407,0c-0.5179,3.0673-2.3408,5.8723-4.9258,7.5991c-1.625,1.0926-3.492,1.8018-5.4168,2.139  c-1.9372,0.3306-3.9389,0.3729-5.8713-0.0183c-1.9651-0.3921-3.8409-1.2108-5.4773-2.3649  c-2.6166-1.8383-4.6135-4.5279-5.6388-7.5549c-1.0484-3.0788-1.0561-6.5046,0.0048-9.5805  c0.7361-2.1679,1.9613-4.1705,3.5708-5.8002c1.9853-2.0324,4.5664-3.4853,7.3473-4.0811c2.3812-0.5083,4.8921-0.4113,7.2234,0.294  c1.9815,0.6016,3.8082,1.6874,5.3044,3.1163c1.5125-1.5039,3.0173-3.0164,4.527-4.5231c0.7918-0.811,1.624-1.5865,2.3908-2.4196  c-2.2928-2.1218-4.9805-3.8274-7.9172-4.9056C32.0723,4.0363,26.1097,3.995,20.7871,5.8372  C14.7889,7.8907,9.6815,12.3763,6.8497,18.0459c-0.9859,1.9536-1.7057,4.0388-2.1381,6.1836  C3.6238,29.5732,4.382,35.2707,6.8468,40.1378c1.6019,3.1768,3.8985,6.001,6.6843,8.215c2.6282,2.0958,5.6916,3.6439,8.9396,4.5078  c4.0984,1.0993,8.461,1.0743,12.5864,0.1355c3.7284-0.8581,7.256-2.6397,10.0725-5.24c2.977-2.7358,5.1006-6.3403,6.2249-10.2138  C52.5807,33.3171,52.7498,28.8064,51.981,24.4812z"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Google options</h5>                      
                      </div>                        

                      <div class="flex">
                          <div class="flex items-center h-5 mt-2">
                              <input id="gfonts-locally" name="gfonts_locally" aria-describedby="helper-checkbox-text" type="checkbox" 
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                      v-bind:checked="gfonts_locally === 'true'"  
                              >
                          </div>
                          <div class="w-full ms-2 text-sm">
                              <label for="gfonts-locally" class="font-medium text-gray-900 dark:text-gray-300">Locally host Google fonts</label>
                              <p id="gfonts-locally-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">Detect Google fonts and host locally. </p>
                          </div>        
                          <!-- Show "Clear cache" when Local Google Fonts is enabled (saved state) -->
                          <div class="w-full mt-3" v-if="gfonts_locally === 'true'">
                            <p class="text-xs font-normal text-gray-500 dark:text-gray-300 mb-2">
                              If you've changed font families/weights or updated local files, clear the local Google Fonts cache.
                            </p>
                            <span @click.prevent="clear_gfonts_cache">
                              <Button
                                config_key="external_scripts"
                                title="Clear Cache"
                                saving="Clearing"
                                :status_object="buttons"
                                id="clear_gfonts_cache"
                              />
                            </span>
                          </div>                                               
                      </div>
                                     
                      <Button config_key="external_scripts" title="Update External Scripts" :status_object="buttons" id="update_external" />

                    </form>

                  </div>

                </div>

            </div>


            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" v-if="isPro ">

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="update_preload" ref="update_preload">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 128 128" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M96.1,103.6c-10.4,8.4-23.5,12.4-36.8,11.1c-10.5-1-20.3-5.1-28.2-11.8H44v-8H18v26h8v-11.9c9.1,7.7,20.4,12.5,32.6,13.6   c1.9,0.2,3.7,0.3,5.5,0.3c13.5,0,26.5-4.6,37-13.2c19.1-15.4,26.6-40.5,19.1-63.9l-7.6,2.4C119,68.6,112.6,90.3,96.1,103.6z"/><path d="M103,19.7c-21.2-18.7-53.5-20-76.1-1.6C7.9,33.5,0.4,58.4,7.7,81.7l7.6-2.4C9,59.2,15.5,37.6,31.9,24.4   C51.6,8.4,79.7,9.6,98,26H85v8h26V8h-8V19.7z"/></g></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Preload options</h5>                      
                      </div>                        

                      <div v-if="css_mode === 'preview'||css_mode === 'enabled'">

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="preload_fonts" name="preload_fonts" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="preload_fonts"
                                        v-bind:checked="preload_fonts === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="preload_fonts" class="font-medium text-gray-900 dark:text-gray-300">Preload fonts</label>
                                <p id="preload_fonts-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ preload_fonts_helper }}</p>
                            </div>
                        </div>

                        <div class="flex mt-2 mb-4" v-if="preload_fonts">
                            <div class="flex items-center h-5 mt-2">
                                <input id="dont_preload_icon_fonts" name="dont_preload_icon_fonts" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-bind:checked="dont_preload_icon_fonts === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="dont_preload_icon_fonts" class="font-medium text-gray-900 dark:text-gray-300">Don't preload icon fonts</label>
                                <p id="dont_preload_icon_fonts-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ dont_preload_icon_fonts_helper }}</p>
                            </div>
                        </div>                                          

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="preload_fonts_desktop_only" name="preload_fonts_desktop_only" aria-describedby="helper-checkbox-text" type="checkbox" 
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                      v-bind:checked="preload_fonts_desktop_only === 'true'"
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="preload_fonts_desktop_only" class="font-medium text-gray-900 dark:text-gray-300">Don't preload fonts on mobile</label>
                                <p id="preload_fonts_desktop_only-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ preload_fonts_desktop_only_helper }}</p>
                            </div>
                        </div>                                               


                        <Button config_key="speed_code" title="Update Preload Options" :status_object="buttons" id="update_preload" />

                      </div>
                      <div v-else>

                        <div class="flex-1 text-sm font-normal">
                          <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                            <span class="font-semibold">Enable Unused CSS for access to font preload options</span>
                          </p>
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

                    </form>

                  </div>

                </div>

            </div>

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow">

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="update_fonts" ref="update_fonts">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M21 5V3H3V5H21Z" fill="currentColor"/><path d="M21 19V21H3V19H21Z" fill="currentColor"/><path clip-rule="evenodd" d="M12.0001 7.37636C11.602 7.35207 11.2112 7.56874 11.0325 7.95204L7.65154 15.2025C7.41815 15.7031 7.6347 16.2981 8.13522 16.5315C8.63577 16.7649 9.23074 16.5484 9.46417 16.0477L9.95278 14.9999H14.0473L14.5359 16.0477C14.7693 16.5484 15.3643 16.7649 15.8648 16.5315C16.3654 16.2981 16.5819 15.7031 16.3485 15.2025L12.9676 7.95204C12.7888 7.56874 12.3981 7.35207 12.0001 7.37636ZM13.1147 12.9999H10.8854L12.0001 10.6095L13.1147 12.9999Z" fill="currentColor" fill-rule="evenodd"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Advanced options</h5>                      
                      </div>                                                             

                      <div class="flex mt-4 mb-4">
                          <div class="flex items-center h-5 mt-2">
                              <input id="system_fonts" name="system_fonts" aria-describedby="helper-checkbox-text" type="checkbox" 
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    v-bind:checked="system_fonts === 'true'"
                              >
                          </div>
                          <div class="ms-2 text-sm">
                              <label for="system_fonts" class="font-medium text-gray-900 dark:text-gray-300">Use system fonts on mobile</label>
                              <p id="system_fonts-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ system_fonts_helper }}</p>
                          </div>
                      </div>                        

                      <div class="flex mt-4 mb-4" v-if="css_mode === 'preview'||css_mode === 'enabled'">
                          <div class="flex items-center h-5 mt-2">
                              <input id="lazyload_icon_fonts" name="lazyload_icon_fonts" aria-describedby="helper-checkbox-text" type="checkbox" 
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                      v-bind:checked="lazyload_icon_fonts === 'true'"  
                              >
                          </div>
                          <div class="ms-2 text-sm">
                              <label for="lazyload_icon_fonts" class="font-medium text-gray-900 dark:text-gray-300">Lazy load icon fonts</label>
                              <p id="lazyload_icon_fonts-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ lazyload_icon_fonts_helper }}</p>
                          </div>
                      </div>    

                      <div class="flex mt-4 mb-4" v-if="(css_mode === 'preview'||css_mode === 'enabled') && (!isPro)">
                          <div class="flex items-center h-5 mt-2">
                              <input id="preload_fonts_intelligently" name="preload_fonts_intelligently" aria-describedby="helper-checkbox-text" type="checkbox" 
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                      v-bind:checked="preload_fonts_intelligently === 'true'"  
                              >
                          </div>
                          <div class="ms-2 text-sm">
                              <label for="preload_fonts_intelligently" class="font-medium text-gray-900 dark:text-gray-300">Preload fonts intelligently</label>
                              <p id="preload_fonts_intelligently-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ preload_fonts_intelligently_helper }}</p>
                          </div>
                      </div>    

                      <Button config_key="speed_code" title="Update Advanced Options" :status_object="buttons" id="update_fonts" />

                    </form>

                  </div>

                </div>

            </div>            

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" v-if="isPro ">

                <div class="flow-root">                  

                  <div class="ml-0" >

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="icon_font_names" ref="icon_font_names">

                      <div class="flex items-left mb-4">
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="black"><path d="M12 5H20V7H12Z"/><path d="M15 6H17V18H15Z"/><path d="M4 10H10V12H4Z"/><path d="M6 11H8V18H6Z"/></svg>                     
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Icon Font Names</h5>                      
                      </div>                      

                      <textarea 
                        @keyup="handleKeyup"
                        id="icon_font_names" 
                        name="icon_font_names"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="icon_font_names"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ icon_font_names_helper }}</p>

                      <Button config_key="speed_code" title="Update Names" :status_object="buttons" id="icon_font_names" />

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

export default {
  data() {
    return {
      imagePreview: null,
      isDragging: false,
      deleteButton: "from-red-500 to-red-800 text-red-800",      
      buttons: {
        update_external: createButtonState(),   
        update_preload: createButtonState(),    
        update_fonts: createButtonState(),    
        clear_gfonts_cache: createButtonState(),
        icon_font_names: createButtonState(),
      },
      css_mode: (window.spress_namespace.config.speed_css.css_mode.value),
      gfonts_locally: (window.spress_namespace.config.external_scripts.gfonts_locally.value),      
      preload_fonts: (window.spress_namespace.config.speed_code.preload_fonts.value),
      preload_fonts_helper: (window.spress_namespace.config.speed_code.preload_fonts.helper),    
      dont_preload_icon_fonts: (window.spress_namespace.config.speed_code.dont_preload_icon_fonts.value),    
      dont_preload_icon_fonts_helper: (window.spress_namespace.config.speed_code.dont_preload_icon_fonts.helper),    
      preload_fonts_desktop_only: (window.spress_namespace.config.speed_code.preload_fonts_desktop_only.value),
      preload_fonts_desktop_only_helper: (window.spress_namespace.config.speed_code.preload_fonts_desktop_only.helper),  
      preload_fonts_intelligently: (window.spress_namespace.config.speed_code.preload_fonts_intelligently.value),
      preload_fonts_intelligently_helper: (window.spress_namespace.config.speed_code.preload_fonts_intelligently.helper),  
      lazyload_icon_fonts: (window.spress_namespace.config.speed_code.lazyload_icon_fonts.value),
      lazyload_icon_fonts_helper: (window.spress_namespace.config.speed_code.lazyload_icon_fonts.helper),          
      system_fonts: (window.spress_namespace.config.speed_code.system_fonts.value),
      system_fonts_helper: (window.spress_namespace.config.speed_code.system_fonts.helper),      
      icon_font_names: (window.spress_namespace.config.speed_code.icon_font_names.value),
      icon_font_names_helper: (window.spress_namespace.config.speed_code.icon_font_names.helper),    
    };
  },
  mounted() {
  },
  beforeDestroy() {
  },  
  methods: {
    async clear_gfonts_cache() {
      const ref = 'clear_gfonts_cache';
      this.buttons[ref].spinner = true;
      this.buttons[ref].text = true;

      // Make your AJAX POST request here
      api.get(window.spress_namespace.resturl + 'speedifypress/clear_gfonts_cache')
        .then(response => {
          this.setButton(this.buttons[ref],'success');   
        })
        .catch(error => {
          this.setButton(this.buttons[ref],'failure');   
      });


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
          } else if(ref == "update_external") {
            this.gfonts_locally = window.spress_namespace.config.external_scripts.gfonts_locally.value;
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