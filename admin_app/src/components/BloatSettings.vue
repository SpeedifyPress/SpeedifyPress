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
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">Bloat Settings</h5>
                    <svg @click="emit('showDocs', 'Bloat Settings')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>                                       

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="update_core" ref="update_core">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10.5H8M16 10.5L13 13.5M16 10.5L13 7.5M12 20H16M12 20H8M12 20V16M12 16H5C4.44772 16 4 15.5523 4 15V6C4 5.44771 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V7M12 16H19C19.5523 16 20 15.5523 20 15V11" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Core Frontend</h5>                      
                      </div>                        

                      <div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="emojis" name="emojis" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="emojis"
                                        v-bind:checked="emojis === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="emojis" class="font-medium text-gray-900 dark:text-gray-300">{{ emojis_label }}</label>
                                <p id="preload_fonts-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ emojis_helper }}</p>
                            </div>
                        </div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="jquery_migrate" name="jquery_migrate" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="jquery_migrate"
                                        v-bind:checked="jquery_migrate === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="jquery_migrate" class="font-medium text-gray-900 dark:text-gray-300">{{ jquery_migrate_label }}</label>
                                <p id="jquery_migrate-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ jquery_migrate_helper }}</p>
                            </div>
                        </div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="rss_feeds" name="rss_feeds" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="rss_feeds"
                                        v-bind:checked="rss_feeds === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="rss_feeds" class="font-medium text-gray-900 dark:text-gray-300">{{ rss_feeds_label }}</label>
                                <p id="rss_feeds-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ rss_feeds_helper }}</p>
                            </div>
                        </div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="oembed" name="oembed" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="oembed"
                                        v-bind:checked="oembed === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="oembed" class="font-medium text-gray-900 dark:text-gray-300">{{ oembed_label }}</label>
                                <p id="oembed-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ oembed_helper }}</p>
                            </div>
                        </div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="heartbeat" name="heartbeat" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="heartbeat"
                                        v-bind:checked="heartbeat === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="heartbeat" class="font-medium text-gray-900 dark:text-gray-300">{{ heartbeat_label }}</label>
                                <p id="heartbeat-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ heartbeat_helper }}</p>
                            </div>
                        </div>                        

                        <Button config_key="bloat" title="Update Core Options" :status_object="buttons" id="update_core" />

                      </div>


                    </form>

                  </div>

                </div>

            </div>

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="update_admin" ref="update_admin">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 10.5H16M8 10.5L11 13.5M8 10.5L11 7.5M12 20H16M12 20H8M12 20V16M12 16H5C4.44772 16 4 15.5523 4 15V6C4 5.44771 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V7M12 16H19C19.5523 16 20 15.5523 20 15V11"        stroke="#000000"        stroke-width="1.5"        stroke-linecap="round"        stroke-linejoin="round"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Backend</h5>                      
                      </div>                        

                      <div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="autosave" name="autosave" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="autosave"
                                        v-bind:checked="autosave === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="autosave" class="font-medium text-gray-900 dark:text-gray-300">{{ autosave_label }}</label>
                                <p id="autosave-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ autosave_helper }}</p>
                            </div>
                        </div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="post_revisions" name="post_revisions" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="post_revisions"
                                        v-bind:checked="post_revisions === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="post_revisions" class="font-medium text-gray-900 dark:text-gray-300">{{ post_revisions_label }}</label>
                                <p id="post_revisions-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ post_revisions_helper }}</p>
                            </div>
                        </div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="block_editor" name="block_editor" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="block_editor"
                                        v-bind:checked="block_editor === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="block_editor" class="font-medium text-gray-900 dark:text-gray-300">{{ block_editor_label }}</label>
                                <p id="block_editor-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ block_editor_helper }}</p>
                            </div>
                        </div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="xmlrpc" name="xmlrpc" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="xmlrpc"
                                        v-bind:checked="xmlrpc === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="xmlrpc" class="font-medium text-gray-900 dark:text-gray-300">{{ xmlrpc_label }}</label>
                                <p id="xmlrpc-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ xmlrpc_helper }}</p>
                            </div>
                        </div>

                        <Button config_key="bloat" title="Update Admin Options" :status_object="buttons" id="update_admin" />

                      </div>

                    </form>

                  </div>

                </div>

            </div>

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="update_media" ref="update_media">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v48H54a6 6 0 0 0-6 6v244a6 6 0 0 0 6 6h372a6 6 0 0 0 6-6v-10h48zm42-336H150a6 6 0 0 0-6 6v244a6 6 0 0 0 6 6h372a6 6 0 0 0 6-6V86a6 6 0 0 0-6-6zm6-48c26.51 0 48 21.49 48 48v256c0 26.51-21.49 48-48 48H144c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h384zM264 144c0 22.091-17.909 40-40 40s-40-17.909-40-40 17.909-40 40-40 40 17.909 40 40zm-72 96l39.515-39.515c4.686-4.686 12.284-4.686 16.971 0L288 240l103.515-103.515c4.686-4.686 12.284-4.686 16.971 0L480 208v80H192v-48z"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Media</h5>                      
                      </div>                        

                      <div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="attachment_pages" name="attachment_pages" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="attachment_pages"
                                        v-bind:checked="attachment_pages === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="attachment_pages" class="font-medium text-gray-900 dark:text-gray-300">{{ attachment_pages_label }}</label>
                                <p id="attachment_pages-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ attachment_pages_helper }}</p>
                            </div>
                        </div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="wp_sitemaps" name="wp_sitemaps" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="wp_sitemaps"
                                        v-bind:checked="wp_sitemaps === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="wp_sitemaps" class="font-medium text-gray-900 dark:text-gray-300">{{ wp_sitemaps_label }}</label>
                                <p id="wp_sitemaps-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ wp_sitemaps_helper }}</p>
                            </div>
                        </div>

                        <Button config_key="bloat" title="Update Media Options" :status_object="buttons" id="update_media" />

                      </div>

                    </form>

                  </div>

                </div>

            </div>

            <div class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="update_discussion" ref="update_discussion">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.38204 10.234C7.96783 10.234 7.63204 10.5698 7.63204 10.984C7.63204 11.3982 7.96783 11.734 8.38204 11.734V10.234ZM14.147 11.734C14.5613 11.734 14.897 11.3982 14.897 10.984C14.897 10.5698 14.5613 10.234 14.147 10.234V11.734ZM9.10004 12.342C8.68583 12.342 8.35004 12.6778 8.35004 13.092C8.35004 13.5062 8.68583 13.842 9.10004 13.842V12.342ZM13.426 13.842C13.8403 13.842 14.176 13.5062 14.176 13.092C14.176 12.6778 13.8403 12.342 13.426 12.342V13.842ZM7.89534 6.77227C7.4868 6.84059 7.211 7.22716 7.27932 7.6357C7.34764 8.04424 7.73421 8.32005 8.14275 8.25173L7.89534 6.77227ZM8.51904 7.471L8.5175 8.221H8.51904V7.471ZM14.019 7.471L14.0247 6.721H14.019V7.471ZM17.035 10.532L16.285 10.5265V10.532H17.035ZM17.035 14.248L16.285 14.248L16.285 14.2489L17.035 14.248ZM16.2486 14.666C16.1762 15.0739 16.4482 15.4631 16.8561 15.5355C17.2639 15.6078 17.6532 15.3358 17.7255 14.928L16.2486 14.666ZM8.1494 8.25058C8.55731 8.17859 8.82962 7.78955 8.75763 7.38164C8.68563 6.97373 8.29659 6.70142 7.88869 6.77342L8.1494 8.25058ZM5.50004 10.531L6.25006 10.531L6.25003 10.527L5.50004 10.531ZM5.50004 19H4.75004C4.75004 19.2663 4.89121 19.5126 5.12096 19.6471C5.35071 19.7817 5.63459 19.7844 5.86683 19.6542L5.50004 19ZM8.51604 17.309V16.559C8.38759 16.559 8.2613 16.592 8.14926 16.6548L8.51604 17.309ZM14.016 17.309V18.059L14.021 18.059L14.016 17.309ZM17.7199 14.9289C17.7911 14.5209 17.518 14.1324 17.11 14.0612C16.7019 13.99 16.3134 14.263 16.2422 14.6711L17.7199 14.9289ZM7.28008 7.38379C7.20928 7.79191 7.48272 8.18016 7.89084 8.25096C8.29896 8.32177 8.6872 8.04832 8.75801 7.64021L7.28008 7.38379ZM10.987 5V4.24999L10.9827 4.25001L10.987 5ZM16.487 5L16.4934 4.25H16.487V5ZM19.5 8.061L18.75 8.05554V8.061H19.5ZM19.5 11.777H18.75L18.7501 11.782L19.5 11.777ZM16.8507 14.0614C16.4428 14.1334 16.1705 14.5224 16.2425 14.9304C16.3145 15.3383 16.7035 15.6106 17.1114 15.5386L16.8507 14.0614ZM8.38204 11.734H14.147V10.234H8.38204V11.734ZM9.10004 13.842H13.426V12.342H9.10004V13.842ZM8.14275 8.25173C8.26659 8.23102 8.39194 8.22074 8.5175 8.221L8.52059 6.721C8.31111 6.72057 8.10196 6.73772 7.89534 6.77227L8.14275 8.25173ZM8.51904 8.221H14.019V6.721H8.51904V8.221ZM14.0134 8.22098C15.2773 8.23051 16.2943 9.26265 16.2851 10.5265L17.785 10.5375C17.8002 8.4453 16.1168 6.7368 14.0247 6.72102L14.0134 8.22098ZM16.285 10.532V14.248H17.785V10.532H16.285ZM16.285 14.2489C16.2852 14.3887 16.273 14.5283 16.2486 14.666L17.7255 14.928C17.7654 14.7032 17.7853 14.4754 17.785 14.2471L16.285 14.2489ZM7.88869 6.77342C6.06575 7.09516 4.74009 8.68395 4.75006 10.535L6.25003 10.527C6.244 9.40676 7.04624 8.44529 8.1494 8.25058L7.88869 6.77342ZM4.75004 10.531V19H6.25004V10.531H4.75004ZM5.86683 19.6542L8.88283 17.9632L8.14926 16.6548L5.13326 18.3458L5.86683 19.6542ZM8.51604 18.059H14.016V16.559H8.51604V18.059ZM14.021 18.059C15.8485 18.047 17.4057 16.7293 17.7199 14.9289L16.2422 14.6711C16.0527 15.757 15.1134 16.5518 14.0111 16.559L14.021 18.059ZM8.75801 7.64021C8.94671 6.55256 9.88748 5.75633 10.9914 5.74999L10.9827 4.25001C9.15263 4.26052 7.59293 5.58059 7.28008 7.38379L8.75801 7.64021ZM10.987 5.75H16.487V4.25H10.987V5.75ZM16.4806 5.74997C17.7437 5.76075 18.7593 6.79252 18.7501 8.05554L20.25 8.06646C20.2652 5.97576 18.5841 4.26786 16.4934 4.25003L16.4806 5.74997ZM18.75 8.061V11.777H20.25V8.061H18.75ZM18.7501 11.782C18.7576 12.9034 17.955 13.8665 16.8507 14.0614L17.1114 15.5386C18.9362 15.2165 20.2624 13.6249 20.25 11.772L18.7501 11.782Z" fill="#000000"/></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">Discussion</h5>                      
                      </div>                        

                      <div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="comments" name="comments" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="comments"
                                        v-bind:checked="comments === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="comments" class="font-medium text-gray-900 dark:text-gray-300">{{ comments_label }}</label>
                                <p id="comments-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ comments_helper }}</p>
                            </div>
                        </div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="pingbacks_trackbacks" name="pingbacks_trackbacks" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="pingbacks_trackbacks"
                                        v-bind:checked="pingbacks_trackbacks === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="pingbacks_trackbacks" class="font-medium text-gray-900 dark:text-gray-300">{{ pingbacks_trackbacks_label }}</label>
                                <p id="pingbacks_trackbacks-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ pingbacks_trackbacks_helper }}</p>
                            </div>
                        </div>

                        <Button config_key="bloat" title="Update Discussion Options" :status_object="buttons" id="update_discussion" />

                      </div>

                    </form>

                  </div>

                </div>

            </div>

            <div v-if="has_woocommerce === 'true'" class="w-full max-w-md p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <div class="flow-root">                  

                  <div class="ml-0">

                    <form @submit.prevent="submitForm" class="max-w-xl mx-auto" data-ref="update_woocommerce" ref="update_woocommerce">

                      <div class="flex items-left mb-4">                
                        <svg :class="iconclass" class="mr-2"  viewBox="0 -51.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid"><g fill-rule="evenodd"><path d="M232.137523,0 L23.7592719,0 C10.5720702,0 -0.103257595,10.7799647 0.000639559736,23.862498 L0.000639559736,103.404247 C0.000639559736,116.591115 10.6767385,127.266612 23.8639402,127.266612 L122.558181,127.266612 L167.667206,152.384995 L157.410382,127.266612 L232.137523,127.266612 C245.325059,127.266612 255.999888,116.591115 255.999888,103.404247 L255.999888,23.862498 C255.999888,10.6752964 245.325059,0 232.137523,0 Z M19.3640061,18.4201481 C16.4334946,18.6294847 14.2355942,19.6761007 12.7703719,21.6645976 C11.3051496,23.5484931 10.781875,25.9556632 11.095813,28.6768382 C17.2707741,67.9247058 23.027062,94.4034429 28.3647436,108.113986 C30.4579757,113.137395 32.8651458,115.5451 35.690989,115.335764 C40.086656,115.021425 45.3196694,108.951332 51.4946305,97.1248185 C54.73908,90.4260478 59.7628237,80.3792294 66.5657276,66.9823567 C72.2170797,86.762992 79.9618646,101.625221 89.6956814,111.567705 C92.417057,114.393415 95.2427665,115.649434 97.9634733,115.440098 C100.371178,115.230761 102.254539,113.974742 103.510558,111.672039 C104.557241,109.683676 104.975914,107.380974 104.766578,104.764601 C104.138568,95.2407893 105.080917,81.9489193 107.69729,64.8892584 C110.417997,47.3063898 113.767382,34.6424627 117.849111,27.1069476 C118.686458,25.5370569 119.000128,23.9670994 118.895794,22.0832708 C118.686458,19.6760338 117.639775,17.6875369 115.651411,16.1176463 C113.663048,14.5477557 111.46468,13.8151445 109.057643,14.0244142 C106.022597,14.2337508 103.719895,15.6989731 102.150205,18.6294847 C95.6614396,30.4560654 91.0560348,49.6088916 88.335328,76.1924977 C84.3579328,66.145211 81.0085475,54.3185634 78.3921746,40.3987506 C77.2411578,34.2238564 74.4154483,31.2933449 69.8100434,31.6073497 C66.670329,31.8166194 64.0538892,33.9098515 61.9606572,37.8869122 L39.0401069,81.5302462 C35.2723159,66.3544807 31.7138615,47.8296643 28.4694119,25.9556632 C27.7368007,20.5133802 24.7016209,18.0014749 19.3640061,18.4201481 Z M221.044022,25.9559976 C228.475136,27.5259551 234.022221,31.5030159 237.789611,38.0965832 C241.138996,43.7482697 242.81302,50.5511737 242.81302,58.7146317 C242.81302,69.4943957 240.092314,79.3325464 234.649562,88.3333508 C228.370134,98.7995112 220.206676,104.032257 210.054854,104.032257 C208.275828,104.032257 206.391799,103.82292 204.402767,103.404247 C196.972321,101.834557 191.425236,97.857831 187.657177,91.264063 C184.308461,85.5076413 182.633768,78.6002028 182.633768,70.5410787 C182.633768,59.7612478 185.355144,49.923164 190.797226,41.0270948 C197.181658,30.5610681 205.345116,25.3280548 215.392603,25.3280548 C217.171629,25.3280548 219.055659,25.5373913 221.044022,25.9559976 Z M216.648622,82.5769291 C220.521015,79.1232099 223.137388,73.9947979 224.602744,67.0873594 C225.021417,64.6802562 225.335087,62.0637496 225.335087,59.3425746 C225.335087,56.3074616 224.707078,53.0630121 223.451058,49.8184957 C221.881368,45.7367667 219.788002,43.5389332 217.275963,43.0155917 C213.508574,42.2829805 209.845518,44.3762126 206.391799,49.5045577 C203.566089,53.4816184 201.786394,57.6680157 200.844713,61.9590813 C200.321038,64.3663182 200.111701,66.9830255 200.111701,69.5993984 C200.111701,72.6344445 200.739711,75.8788272 201.99573,79.1232099 C203.566089,83.2049389 205.658786,85.4026386 208.170825,85.9263145 C210.787198,86.4493215 213.612908,85.2983047 216.648622,82.5769291 Z M172.167608,38.0965832 C168.399549,31.5030159 162.74813,27.5259551 155.422019,25.9559976 C153.432987,25.5373913 151.549626,25.3280548 149.769931,25.3280548 C139.723112,25.3280548 131.559654,30.5610681 125.175223,41.0270948 C119.732472,49.923164 117.011765,59.7612478 117.011765,70.5410787 C117.011765,78.6002028 118.686458,85.5076413 122.035174,91.264063 C125.803233,97.857831 131.350318,101.834557 138.780763,103.404247 C140.769126,103.82292 142.653156,104.032257 144.432851,104.032257 C154.584672,104.032257 162.74813,98.7995112 169.027559,88.3333508 C174.47031,79.3325464 177.191017,69.4943957 177.191017,58.7146317 C177.191017,50.5511737 175.516324,43.7482697 172.167608,38.0965832 Z M158.980072,67.0873594 C157.515384,73.9947979 154.898343,79.1232099 151.02595,82.5769291 C147.990904,85.2983047 145.165195,86.4493215 142.548822,85.9263145 C140.036783,85.4026386 137.943417,83.2049389 136.373727,79.1232099 C135.117707,75.8788272 134.489698,72.6344445 134.489698,69.5993984 C134.489698,66.9830255 134.699034,64.3663182 135.22271,61.9590813 C136.16439,57.6680157 137.943417,53.4816184 140.769126,49.5045577 C144.223514,44.3762126 147.88657,42.2829805 151.65396,43.0155917 C154.165999,43.5389332 156.259365,45.7367667 157.829055,49.8184957 C159.085074,53.0630121 159.713084,56.3074616 159.713084,59.3425746 C159.713084,62.0637496 159.503748,64.6802562 158.980072,67.0873594 Z" fill="#000"></path></g></svg>
                        <h5 class="text-lg font-bold leading-none text-gray-900 dark:text-white">WooCommerce</h5>                      
                      </div>                        

                      <div>

                        <div class="flex mt-4 mb-4">
                            <div class="flex items-center h-5 mt-2">
                                <input id="woocommerce_cart_fragments" name="woocommerce_cart_fragments" aria-describedby="helper-checkbox-text" type="checkbox" 
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        v-model="woocommerce_cart_fragments"
                                        v-bind:checked="woocommerce_cart_fragments === 'true'"  
                                >
                            </div>
                            <div class="ms-2 text-sm">
                                <label for="woocommerce_cart_fragments" class="font-medium text-gray-900 dark:text-gray-300">{{ woocommerce_cart_fragments_label }}</label>
                                <p id="woocommerce_cart_fragments-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">{{ woocommerce_cart_fragments_helper }}</p>
                            </div>
                        </div>

                        <Button config_key="bloat" title="Update WooCommerce Options" :status_object="buttons" id="update_woocommerce" />

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

export default {
  data() {
    return {
      imagePreview: null,
      isDragging: false,
      deleteButton: "from-red-500 to-red-800 text-red-800",      
      buttons: {
        update_core: createButtonState(),   
        update_admin: createButtonState(),    
        update_media: createButtonState(),    
        update_discussion: createButtonState(),
        update_woocommerce: createButtonState(),
      },
      has_woocommerce: window.spress_namespace.has_woo,
      emojis: (window.spress_namespace.config.bloat.emojis.value),
      emojis_label: (window.spress_namespace.config.bloat.emojis.name),      
      emojis_helper: (window.spress_namespace.config.bloat.emojis.helper),      
      jquery_migrate: (window.spress_namespace.config.bloat.jquery_migrate.value),
      jquery_migrate_label: (window.spress_namespace.config.bloat.jquery_migrate.name),
      jquery_migrate_helper: (window.spress_namespace.config.bloat.jquery_migrate.helper),
      rss_feeds: (window.spress_namespace.config.bloat.rss_feeds.value),
      rss_feeds_label: (window.spress_namespace.config.bloat.rss_feeds.name),
      rss_feeds_helper: (window.spress_namespace.config.bloat.rss_feeds.helper),
      oembed: (window.spress_namespace.config.bloat.oembed.value),
      oembed_label: (window.spress_namespace.config.bloat.oembed.name),
      oembed_helper: (window.spress_namespace.config.bloat.oembed.helper),
      heartbeat: (window.spress_namespace.config.bloat.heartbeat.value),
      heartbeat_label: (window.spress_namespace.config.bloat.heartbeat.name),
      heartbeat_helper: (window.spress_namespace.config.bloat.heartbeat.helper),
      autosave: (window.spress_namespace.config.bloat.autosave.value),
      autosave_label: (window.spress_namespace.config.bloat.autosave.name),
      autosave_helper: (window.spress_namespace.config.bloat.autosave.helper),
      post_revisions: (window.spress_namespace.config.bloat.post_revisions.value),
      post_revisions_label: (window.spress_namespace.config.bloat.post_revisions.name),
      post_revisions_helper: (window.spress_namespace.config.bloat.post_revisions.helper),
      block_editor: (window.spress_namespace.config.bloat.block_editor.value),
      block_editor_label: (window.spress_namespace.config.bloat.block_editor.name),
      block_editor_helper: (window.spress_namespace.config.bloat.block_editor.helper),
      xmlrpc: (window.spress_namespace.config.bloat.xmlrpc.value),
      xmlrpc_label: (window.spress_namespace.config.bloat.xmlrpc.name),
      xmlrpc_helper: (window.spress_namespace.config.bloat.xmlrpc.helper),
      attachment_pages: (window.spress_namespace.config.bloat.attachment_pages.value),
      attachment_pages_label: (window.spress_namespace.config.bloat.attachment_pages.name),
      attachment_pages_helper: (window.spress_namespace.config.bloat.attachment_pages.helper),
      wp_sitemaps: (window.spress_namespace.config.bloat.wp_sitemaps.value),
      wp_sitemaps_label: (window.spress_namespace.config.bloat.wp_sitemaps.name),
      wp_sitemaps_helper: (window.spress_namespace.config.bloat.wp_sitemaps.helper),
      comments: (window.spress_namespace.config.bloat.comments.value),
      comments_label: (window.spress_namespace.config.bloat.comments.name),
      comments_helper: (window.spress_namespace.config.bloat.comments.helper),
      pingbacks_trackbacks: (window.spress_namespace.config.bloat.pingbacks_trackbacks.value),
      pingbacks_trackbacks_label: (window.spress_namespace.config.bloat.pingbacks_trackbacks.name),
      pingbacks_trackbacks_helper: (window.spress_namespace.config.bloat.pingbacks_trackbacks.helper),
      woocommerce_cart_fragments: (window.spress_namespace.config.bloat.woocommerce_cart_fragments.value),
      woocommerce_cart_fragments_label: (window.spress_namespace.config.bloat.woocommerce_cart_fragments.name),
      woocommerce_cart_fragments_helper: (window.spress_namespace.config.bloat.woocommerce_cart_fragments.helper),
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