<script setup>
import Skeleton from './../components/Skeleton.vue'
defineProps({
  icon: {
    type: String,
    required: false
  },
})

import { defineEmits } from 'vue'
const emit = defineEmits(['showDocs'])

import { api } from '../lib/api';

</script>

<template>
  <div>

    <div class="flex flex-wrap">

            <div class="w-full p-2 mr-4" >
                <div class="flex items-center justify-between mb-4">
                    <!-- Left: Icon and Title -->
                    <div class="flex items-center">
                        <span v-html="icon" class="mr-2 force-gradient"></span>
                        <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">CSS Stats</h5>
                    </div>

                    <!-- Right: All SVGs -->
                    <div class="flex items-center space-x-2 ml-auto">
                        <svg @click="refreshStats" v-if="!refreshing" class="w-4 h-4 cursor-pointer no-gradient" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/>
                        </svg>
                        <svg v-if="refreshing" class="w-4 h-4 animate-spin no-gradient" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/>
                        </svg>
                        <svg @click="$emit('showDocs', 'CSS Stats')" class="w-5 h-5 cursor-pointer" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g>
                        </svg>
                    </div>
                </div>
                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>        

            <div class="w-full p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow" >

                <!-- Tabs Navigation -->
                <div class="text-sm font-medium text-center text-gray-500">
                  <ul class="flex flex-wrap -mb-px" id="myTab" data-tabs-toggle="#myTabContent" 
                  data-tabs-active-classes="text-customBlue-700 hover:text-customBlue-700 border-customBlue-700" 
                  data-tabs-inactive-classes="dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300" 
                  role="tablist">
                    <li class="mr-2" role="presentation">
                      <button class="inline-block p-4 border-b-2 rounded-t-lg" id="tab1-tab" data-tabs-target="#tab1" type="button" role="tab" aria-controls="tab1" aria-selected="true">By Plugin Folder</button>
                    </li>
                    <li class="mr-2" role="presentation">
                      <button class="inline-block p-4 border-b-2 rounded-t-lg" id="tab2-tab" data-tabs-target="#tab2" type="button" role="tab" aria-controls="tab2" aria-selected="false">By Path</button>
                    </li>
                    <li class="mr-2" role="presentation">
                      <button class="inline-block p-4 border-b-2 rounded-t-lg" id="tab3-tab" data-tabs-target="#tab3" type="button" role="tab" aria-controls="tab2" aria-selected="false">By Post Types</button>
                    </li>                    
                  </ul>
                </div>                

                <div class="flow-root">                  

                  <!-- Tabs Content -->
                  <div id="myTabContent">
                    <div class="" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">              

                      <div class="ml-3" v-if="stats_data">
                        <p>
                            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <thead>
                                <tr>
                                    <td @click="sortTable('sortkey')" class="font-bold cursor-pointer w-4/5"></td>
                                    <td @click="sortTable('empty_css_count')" class="font-bold cursor-pointer">Unused</td>
                                    <td @click="sortTable('found_css_count')" class="font-bold cursor-pointer">Used</td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr @click="openModal(item.sortkey , item)" v-for="(item,key,index) in sortedStatsData" :key="key" :class="{'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer': index % 2 === 0, 'hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer': index % 2 !== 0}">
                                    <td>{{ item.sortkey }}</td>
                                    <td class="">{{ item.empty_css_count }}</td>
                                    <td class="">{{ item.found_css_count }}</td>
                                </tr>
                              </tbody>
                            </table>                      
                        </p>
                      </div>
                      <!-- Loading skeleton -->
                      <div class="flex flex-wrap mt-4" v-else>

                          <Skeleton mr="4"  width="full" />

                      </div> 
                    </div>
                    <div class="hidden ml-3" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
                      
                      <div class="ml-3" v-if="by_path">
                        <p>
                            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <thead>
                                <tr>
                                    <td @click="sortTable('sortkey')" class="font-bold cursor-pointer w-4/5"></td>
                                    <td @click="sortTable('empty_css_count')" class="font-bold cursor-pointer">Unused</td>
                                    <td @click="sortTable('found_css_count')" class="font-bold cursor-pointer">Used</td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr @click="openModal(item.sortkey, item)" v-for="(item,key,index) in sortedByPathData" :key="key" :class="{'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer': index % 2 === 0, 'hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer': index % 2 !== 0}">
                                    <td>{{ item.sortkey }}</td>
                                    <td>{{ Object.keys(item.empty_urls).length }}</td>
                                    <td>{{ Object.keys(item.found_urls).length }}</td>
                                </tr>
                              </tbody>
                            </table>                      
                        </p>
                      </div>  
                      <!-- Loading skeleton -->
                      <div class="flex flex-wrap mt-4" v-else>

                          <Skeleton mr="4"  width="full" />

                      </div>                       
                      
                    </div>
                    <div class="hidden ml-3" id="tab3" role="tabpanel" aria-labelledby="tab3-tab">
                      
                        <div class="ml-3" v-if="by_post_type">
                          <p>
                              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead>
                                  <tr>
                                      <td @click="sortTable('sortkey')" class="font-bold cursor-pointer w-4/5"></td>
                                      <td @click="sortTable('empty_css_count')" class="font-bold cursor-pointer">Unused</td>
                                      <td @click="sortTable('found_css_count')" class="font-bold cursor-pointer">Used</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr @click="openModal(item.sortkey, item)" v-for="(item,key,index) in sortedByPostType" :key="key" :class="{'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer': index % 2 === 0, 'hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer': index % 2 !== 0}">
                                      <td>{{ item.sortkey }}</td>
                                      <td>{{ Object.keys(item.empty_urls).length }}</td>
                                      <td>{{ Object.keys(item.found_urls).length }}</td>
                                  </tr>
                                </tbody>
                              </table>                      
                          </p>
                        </div>
                      <!-- Loading skeleton -->
                      <div class="flex flex-wrap mt-4" v-else>

                          <Skeleton mr="4"  width="full" />

                      </div>                         

                    </div>                    
                  </div>                  

 

                </div>
            </div>            

    </div>    






    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full p-4 z-[1000]" id="my-modal">
      <div class="relative top-20 mx-auto w-full max-w-5xl max-h-full">
        <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div class="flex justify-between items-center pb-1 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              URL paths for {{ selectedPlugin }}
            </h3>
            <button @click="closeModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="space-y-6">
            <table class="w-full">
              <thead>
                <tr>
                  <th class="font-bold w-1/2 bg-gray-200">Unused</th>
                  <th class="font-bold w-1/2 bg-gray-100">Used</th>
                </tr>
              </thead>
              <tbody>
                <!-- Iterate over all unique keys from emptyUrls and foundUrls -->
                <tr v-for="key in allUniqueKeys" :key="key">
                  <td class="w-1/2 bg-gray-200">
                    <!-- Show value from emptyUrls if it exists -->
                    <span v-if="emptyUrls[key]">{{ key }} (<span class="border-b border-b-[1px] border-dotted border-gray-700" :title="printPlugins(emptyUrls[key])">{{ emptyUrls[key].count }}</span>)</span>
                  </td>
                  <td class="w-1/2 bg-gray-100">
                    <!-- Show value from foundUrls if it exists -->
                    <span v-if="foundUrls[key]">{{ key }} (<span class="border-b border-b-[1px] border-dotted border-gray-700" :title="printPlugins(foundUrls[key])">{{ foundUrls[key].count }}</span>)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 v-if="fullUrls.length > 0" class="text-lg font-semibold text-gray-900 dark:text-white mt-3">
            URL{{ (fullUrls.length > 1 ? "s" : "") }} for {{ selectedPlugin }}
          </h3>          
          <div class="space-y-6">
            <ul v-if="fullUrls.length > 0" class="mt-2">
                <li v-for="(value, key) in fullUrls" :key="key">
                  <a :href="getOrigin(value)" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" class="inline h-4 w-4 ml-1 no-gradient mt-[-2px]" fill="none" viewBox="0 0 24 24" stroke="gray">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" fill="none" />
                    </svg>                    
                    {{ value }}</a>
                </li>  
            </ul>
          </div>                      
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      refreshing: false,
      stats_data: null,
      by_path: null,
      by_plugin: null,
      by_post_type: null,
      sortKey: 'sortkey',
      sortOrder: 'asc',
      showModal: false,
      selectedPlugin: '',
      selectedUrls: [],
      emptyUrls: {},  
      foundUrls: {},      
      fullUrls: []
    };
  },
  mounted() {
    initFlowbite();
    this.fetchData();
  },
  computed: {
    allUniqueKeys() {
      // Combine keys from both emptyUrls and foundUrls and get unique keys
      const emptyKeys = Object.keys(this.emptyUrls);
      const foundKeys = Object.keys(this.foundUrls);
      return Array.from(new Set([...emptyKeys, ...foundKeys]));
    },
    sortedStatsData() {
      if (!this.by_plugin) return [];
      return this.sortData(this.by_plugin, this.sortKey, this.sortOrder);
    },
    sortedByPathData() {
      if (!this.by_path) return [];
      return this.sortData(this.by_path, this.sortKey, this.sortOrder);
    },
    sortedByPostType() {
      if (!this.by_post_type) return [];
      return this.sortData(this.by_post_type, this.sortKey, this.sortOrder);
    }
  },
    methods: {  
    getOrigin(value) {
      return `${location.origin}/${value}`;
    },
    printPlugins(array) {
      //If not undefined
      if (typeof array !== 'undefined' && typeof array.plugins !== 'undefined') {
        return array.plugins.join("\n");
      }
    },
    sortData(dataObj, key, order) {
      // Convert object into array for sorting
      const data = Object.values(dataObj);

      return data.sort((a, b) => {
        let valueA, valueB;

        // Sorting by either 'plugin' or 'path', or numeric values (empty_css_count, found_css_count)
        if (key === 'sortkey') {
          valueA = a[key];
          valueB = b[key];
        } else if (key === 'empty_css_count') {
          valueA = a.empty_css_count;
          valueB = b.empty_css_count;
        } else if (key === 'found_css_count') {
          valueA = a.found_css_count;
          valueB = b.found_css_count;
        }

        if (valueA < valueB) return order === 'asc' ? -1 : 1;
        if (valueA > valueB) return order === 'asc' ? 1 : -1;
        return 0;
      });
    },
    sortTable(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },  
    fetchData() {
      api.get(window.spress_namespace.resturl + 'speedifypress/get_css_data')
        .then(response => {
          this.stats_data = response.data.stats_data;
          this.by_path  = this.stats_data.plugin_stats.by_path;
          this.by_plugin  = this.stats_data.plugin_stats.by_plugin;
          this.by_post_type  = this.stats_data.plugin_stats.by_post_type;
          this.refreshing = false;
        })
        .catch(error => {
          console.error(error);
        });
    },     
    refreshStats() {
      this.stats_data = null;
      this.by_path = null;
      this.by_post_type = null;
      this.refreshing = true;
      this.fetchData(); 
    },     
    openModal(plugin, item) {
      this.selectedPlugin = plugin;
      this.emptyUrls = Array.isArray(item.empty_urls) ? {} : item.empty_urls || {};
      this.foundUrls = Array.isArray(item.found_urls) ? {} : item.found_urls || {};
      this.fullUrls = Array.isArray(item.full_urls) ? item.full_urls : [];
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
    }
  },   
};
</script>