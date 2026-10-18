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
                    <svg @click="emit('showDocs', 'JavaScript Settings')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
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
