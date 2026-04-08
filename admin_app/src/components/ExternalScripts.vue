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
    type: String, required: true 
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
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">External Scripts</h5>
                    <svg v-if="isPro "  @click="emit('showDocs', 'External Scripts')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
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
                   

                      <div class="flex mt-4">
                          <div class="flex items-center h-5 mt-2">
                              <input id="gtag-locally" name="gtag_locally" aria-describedby="helper-checkbox-text" type="checkbox" 
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                      v-bind:checked="gtag_locally === 'true'"  
                              >
                          </div>
                          <div class="ms-2 text-sm">
                              <label for="gtag-locally" class="font-medium text-gray-900 dark:text-gray-300">Locally host gtag.js</label>
                              <p id="gtag-locally-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">Detect gtag.js and host it locally. Uses cron to keep updated.</p>
                          </div>
                      </div>

                      <div class="flex mt-4 mb-4" v-if="isPro ">
                          <div class="flex items-center h-5 mt-2">
                              <input id="gtag-preload" name="preload_gtag" aria-describedby="helper-checkbox-text" type="checkbox" 
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    v-bind:checked="preload_gtag === 'true'"
                              >
                          </div>
                          <div class="ms-2 text-sm">
                              <label for="gtag-preload" class="font-medium text-gray-900 dark:text-gray-300">Preload gtag.js</label>
                              <p id="gtag-preload-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">Add script preload or DNS preconnect for gtag.js</p>
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

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="include_partytown" ref="include_partytown">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title/><path d="M24.16,14.21,24.1,14,24,13.88l-.12-.14a.9.9,0,0,0-1.3,0l-.12.14-.08.16a1.26,1.26,0,0,0,0,.18.6.6,0,0,0,0,.18.91.91,0,0,0,.06.35.94.94,0,0,0,.2.3.81.81,0,0,0,.3.2,1,1,0,0,0,.36.07l.18,0,.18-.06.16-.08A.59.59,0,0,0,23.9,15a.81.81,0,0,0,.2-.3.91.91,0,0,0,.07-.35A1.22,1.22,0,0,0,24.16,14.21Z"/><path d="M26,10.52l-.06-.18-.08-.16L25.74,10a.9.9,0,0,0-1.3,0l-.12.14-.08.16a1.26,1.26,0,0,0,0,.18.6.6,0,0,0,0,.18.91.91,0,0,0,.06.35.94.94,0,0,0,.2.3.81.81,0,0,0,.3.2,1,1,0,0,0,.36.07l.18,0,.18-.06.16-.08a.59.59,0,0,0,.14-.12.81.81,0,0,0,.2-.3A.91.91,0,0,0,26,10.7,1.22,1.22,0,0,0,26,10.52Z"/><path d="M21.39,5.9l-.06-.18-.08-.16-.12-.14a.9.9,0,0,0-1.3,0l-.12.14-.08.16a1.26,1.26,0,0,0,0,.18.6.6,0,0,0,0,.18.91.91,0,0,0,.06.35.94.94,0,0,0,.2.3.81.81,0,0,0,.3.2,1,1,0,0,0,.36.07l.18,0,.18-.06L21,6.85a.59.59,0,0,0,.14-.12.81.81,0,0,0,.2-.3.91.91,0,0,0,.07-.35A1.22,1.22,0,0,0,21.39,5.9Z"/><path d="M17.69,9.59l-.06-.18-.08-.16-.12-.14a.9.9,0,0,0-1.3,0L16,9.26l-.08.16a1.26,1.26,0,0,0,0,.18.6.6,0,0,0,0,.18.91.91,0,0,0,.06.35.94.94,0,0,0,.2.3.81.81,0,0,0,.3.2,1,1,0,0,0,.36.07l.18,0,.18-.06.16-.08a.59.59,0,0,0,.14-.12.81.81,0,0,0,.2-.3.91.91,0,0,0,.07-.35A1.22,1.22,0,0,0,17.69,9.59Z"/><path d="M12.15,5.9l-.06-.18L12,5.57l-.12-.14a.9.9,0,0,0-1.3,0l-.12.14-.08.16a1.26,1.26,0,0,0,0,.18.6.6,0,0,0,0,.18.91.91,0,0,0,.06.35.94.94,0,0,0,.2.3.81.81,0,0,0,.3.2,1,1,0,0,0,.36.07l.18,0,.18-.06.16-.08a.59.59,0,0,0,.14-.12.81.81,0,0,0,.2-.3.91.91,0,0,0,.07-.35A1.22,1.22,0,0,0,12.15,5.9Z"/><path d="M17.52,24.42a.92.92,0,0,0-.25-.86L8.14,14.42a.92.92,0,0,0-1.53.36L2,28.49a.92.92,0,0,0,1.17,1.17l13.7-4.57A.92.92,0,0,0,17.52,24.42Zm-7.43,1L6.29,21.61l.5-1.5,4.81,4.81ZM5.63,23.57l2.5,2.5L4.38,27.32Zm7.92.7L7.44,18.15l.45-1.36,7,7Z"/><path d="M19.25,14.82l.43-2.51,2.51-.43a.92.92,0,0,0,.75-.75l.43-2.51,2.51-.43a.92.92,0,0,0-.31-1.82l-3.15.54a.92.92,0,0,0-.75.75l-.43,2.51-2.51.43a.92.92,0,0,0-.75.75l-.43,2.51L15,14.3a.92.92,0,0,0,.16,1.83h.16l3.15-.54A.92.92,0,0,0,19.25,14.82Z"/><path d="M29.4,15.87l-2.66-1a.92.92,0,0,0-1.13.41l-1,1.79-1.92-.72a.92.92,0,0,0-1.13.41l-1,1.78-1.92-.72A.92.92,0,1,0,18,19.55l2.66,1a.92.92,0,0,0,1.13-.41l1-1.79,1.92.72a.92.92,0,0,0,1.13-.41l1-1.79,1.92.72a.92.92,0,0,0,.65-1.73Z"/><path d="M14.54,11l-.7-1.93,1.79-1a.92.92,0,0,0,.42-1.12L15.36,5l1.79-1a.92.92,0,0,0-.89-1.62L13.78,3.78a.92.92,0,0,0-.42,1.12l.7,1.92-1.79,1a.92.92,0,0,0-.42,1.12l.7,1.93-1.8,1a.92.92,0,1,0,.89,1.62l2.49-1.37A.92.92,0,0,0,14.54,11Z"/><path d="M7.55,9.67a.92.92,0,0,0-.63,1.14l.38,1.31a.92.92,0,0,0,.88.66.91.91,0,0,0,.26,0,.92.92,0,0,0,.63-1.14l-.38-1.31A.92.92,0,0,0,7.55,9.67Z"/><path d="M14.66,19.25a.92.92,0,0,0,.53-.17l.54-.38a.92.92,0,1,0-1.07-1.51l-.54.38a.92.92,0,0,0,.53,1.68Z"/><path d="M10.85,14.52a.92.92,0,0,0,0,1.3l.38.38a.92.92,0,1,0,1.3-1.3l-.38-.38A.92.92,0,0,0,10.85,14.52Z"/><path d="M21,23.85h.16A.92.92,0,0,0,21.27,22L19,21.65a.92.92,0,1,0-.31,1.82Z"/></svg>                       
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Add scripts to Partytown</h5>        
                        <p class="text-xs font-normal text-gray-500 ml-3 mt-[2px]">BETA</p>              
                      </div>                      

                      <textarea 
                        id="include_partytown" 
                        name="include_partytown"  
                        class="h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        v-model="include_partytown"
                        style="box-shadow:inherit!important"
                      ></textarea>                    
                      <p  id="helper-text-explanation" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">{{ include_partytown_helper }}</p>

                      <Button config_key="speed_css" title="Update Partytown" :status_object="buttons" id="include_partytown" />

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
      imagePreview: null,
      isDragging: false,
      deleteButton: "from-red-500 to-red-800 text-red-800",      
      buttons: {
        include_partytown: createButtonState(),       
        update_external: createButtonState(),   
      },
      include_partytown: getConfigValue(['speed_css', 'include_partytown'], ''),
      gtag_locally: getConfigValue(['external_scripts', 'gtag_locally'], 'false'),
      preload_gtag: getConfigValue(['external_scripts', 'preload_gtag'], 'false'),
      include_partytown_helper: getConfigHelper(['speed_css', 'include_partytown'], ''),
    };
  },
  mounted() {
  },
  beforeDestroy() {
  },  
  methods: {
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
          if(ref == "update_external") {
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
