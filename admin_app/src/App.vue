<script setup>

import { onMounted, ref, computed } from 'vue'
import { initFlowbite } from 'flowbite'
import { getProAdminItems, getProDashboardConfig } from '@pro-admin-items'

//Set icon class
const iconClass = 'flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white no-gradient';

//Import components
import Dashboard from './components/Dashboard.vue'
import CssSettings from './components/CssSettings.vue'
import CacheSettings from './components/CacheSettings.vue'
import ExternalScripts from './components/ExternalScripts.vue'
import ImageSettings from './components/ImageSettings.vue'
import BloatSettings from './components/BloatSettings.vue'
import FontSettings from './components/FontSettings.vue'
import JavascriptSettings from './components/JavascriptSettings.vue'


//Import docs
import DashboardDoc from './components/docs/DashboardDoc.vue';
import CacheSettingsDoc from './components/docs/CacheSettingsDoc.vue';
import ExternalScriptsDoc from './components/docs/ExternalScriptsDoc.vue';
import FontSettingsDoc from './components/docs/FontSettingsDoc.vue';
import BloatSettingsDoc from './components/docs/BloatSettingsDoc.vue';
import ImageSettingsDoc from './components/docs/ImageSettingsDoc.vue';
import CssSettingsDoc from './components/docs/CssSettingsDoc.vue';
import JavascriptSettingsDoc from './components/docs/JavascriptSettingsDoc.vue';

// Reactive global values
const version = ref(window.spress_namespace.version);
const plugin_mode = ref(window.spress_namespace.config.plugin.plugin_mode.value);
const collapsed = ref(false);
const expanded = ref(false);

// Build-time plugin type (tree-shaking boundary)
const BUILD_PLUGIN_TYPE = __PLUGIN_TYPE__;
const isProBuild = BUILD_PLUGIN_TYPE === 'pro';
const proAdminItems = getProAdminItems(iconClass);
const proDashboardConfig = getProDashboardConfig();

// Runtime plugin type (defined by license)
const plugin_type = ref(
  BUILD_PLUGIN_TYPE === 'wordpressorg'
    ? 'wordpress.org'
    : (localStorage.getItem('spress_plugin_type') || 'None')
);

// Function to see if we're pro
const isPro = computed(() => {
  return isProBuild && plugin_type.value === 'pro'
})

// Watch for changes in the global plugin mode
const updatePluginMode = () => {
  plugin_mode.value = window.spress_namespace.config.plugin.plugin_mode.value;
};

//Show/hide the sidebar
function toggleSidebar() {
  collapsed.value = !collapsed.value
}


//Expand/retract the main bar
function toggleMainbar() {
  expanded.value = !expanded.value;
  if(expanded.value) {
    document.querySelector("#app").style.maxWidth = '100%';
    document.querySelectorAll(".xxl\\:mt-\\[-50px\\]").forEach((element) => { element.classList.remove('xxl:mt-[-50px]');element.classList.add('removed-50') });
  } else {
    document.querySelector("#app").style.maxWidth = '1280px';
    document.querySelectorAll(".removed-50").forEach((element) => { element.classList.add('xxl:mt-[-50px]');element.classList.remove('removed-50') });
  }
}


//Define the items here
const base_admin_items = [
    { name: 'Dashboard', component: Dashboard, docComponent: DashboardDoc, icon: '<svg class="' + iconClass + '" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"/></svg>'},
    { name: 'Cache Settings', component: CacheSettings, docComponent: CacheSettingsDoc, li_class: 'pt-2 border-t border-gray-300 dark:border-gray-700', icon: '<svg class="' + iconClass + '" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M4 3h14l2.707 2.707a1 1 0 0 1 .293.707V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 1v5h9V4H7zm-1 8v7h12v-7H6zm7-7h2v3h-2V5z"/></g></svg>'},
    { name: 'CSS Settings', component: CssSettings, docComponent: CssSettingsDoc, icon: '<svg class="' + iconClass + '" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM3.397 14.841a1.13 1.13 0 0 0 .401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 0 0-.375-.357 2.027 2.027 0 0 0-.566-.21l-.621-.144a.97.97 0 0 1-.404-.176.37.37 0 0 1-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.2-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 0 1 .152.326.505.505 0 0 1-.085.29.559.559 0 0 1-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 0 1-.248-.115.578.578 0 0 1-.255-.384h-.765ZM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 0 1 .302-.399.814.814 0 0 1 .475-.137c.15 0 .283.032.398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.441 1.441 0 0 0-.489-.272 1.838 1.838 0 0 0-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.799.799 0 0 1-.118.363.7.7 0 0 1-.272.25.874.874 0 0 1-.401.087.845.845 0 0 1-.478-.132.833.833 0 0 1-.299-.392 1.699 1.699 0 0 1-.102-.627v-.495ZM6.78 15.29a1.176 1.176 0 0 1-.111-.449h.764a.578.578 0 0 0 .255.384c.07.049.154.087.25.114.095.028.201.041.319.041.164 0 .301-.023.413-.07a.559.559 0 0 0 .255-.193.507.507 0 0 0 .085-.29.387.387 0 0 0-.153-.326c-.101-.08-.256-.144-.463-.193l-.618-.143a1.72 1.72 0 0 1-.539-.214 1 1 0 0 1-.351-.367 1.068 1.068 0 0 1-.123-.524c0-.244.063-.457.19-.639.127-.181.303-.322.527-.422.225-.1.484-.149.777-.149.304 0 .564.05.779.152.217.102.384.239.5.41.12.17.187.359.2.566h-.75a.56.56 0 0 0-.12-.258.624.624 0 0 0-.246-.181.923.923 0 0 0-.37-.068c-.216 0-.387.05-.512.152a.472.472 0 0 0-.184.384c0 .121.047.22.143.3a.97.97 0 0 0 .404.175l.621.143c.217.05.406.12.566.211.16.09.285.21.375.358.09.148.135.335.135.56 0 .247-.063.466-.188.656a1.216 1.216 0 0 1-.539.439c-.234.105-.52.158-.858.158-.254 0-.476-.03-.665-.09a1.404 1.404 0 0 1-.478-.252 1.13 1.13 0 0 1-.29-.375Z" fill-rule="evenodd"/></svg>'},
    { name: 'JavaScript Settings', component: JavascriptSettings, docComponent: JavascriptSettingsDoc, icon: '<svg class="' + iconClass + '" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14 11.25C14 10.2835 14.7835 9.5 15.75 9.5H17.25C17.6642 9.5 18 9.83579 18 10.25C18 10.6642 17.6642 11 17.25 11H15.75C15.6119 11 15.5 11.1119 15.5 11.25V12.75C15.5 12.8881 15.6119 13 15.75 13H16.25C17.2165 13 18 13.7835 18 14.75V16.25C18 17.2165 17.2165 18 16.25 18H14.75C14.3358 18 14 17.6642 14 17.25C14 16.8358 14.3358 16.5 14.75 16.5H16.25C16.3881 16.5 16.5 16.3881 16.5 16.25V14.75C16.5 14.6119 16.3881 14.5 16.25 14.5H15.75C14.7835 14.5 14 13.7165 14 12.75V11.25Z" /><path d="M12.75 10.25C12.75 9.83579 12.4142 9.5 12 9.5C11.5858 9.5 11.25 9.83579 11.25 10.25V16.25C11.25 16.3881 11.1381 16.5 11 16.5H9.75C9.33579 16.5 9 16.8358 9 17.25C9 17.6642 9.33579 18 9.75 18H11C11.9665 18 12.75 17.2165 12.75 16.25V10.25Z" /><path d="M3 6.25V17.75C3 19.5449 4.45507 21 6.25 21H17.75C19.5449 21 21 19.5449 21 17.75V6.25C21 4.45507 19.5449 3 17.75 3H6.25C4.45507 3 3 4.45507 3 6.25ZM6.25 4.5H17.75C18.7165 4.5 19.5 5.2835 19.5 6.25V17.75C19.5 18.7165 18.7165 19.5 17.75 19.5H6.25C5.2835 19.5 4.5 18.7165 4.5 17.75V6.25C4.5 5.2835 5.2835 4.5 6.25 4.5Z"/></svg>'},
    { name: 'Image Settings', component: ImageSettings, docComponent: ImageSettingsDoc, icon: '<svg class="' + iconClass + '" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v48H54a6 6 0 0 0-6 6v244a6 6 0 0 0 6 6h372a6 6 0 0 0 6-6v-10h48zm42-336H150a6 6 0 0 0-6 6v244a6 6 0 0 0 6 6h372a6 6 0 0 0 6-6V86a6 6 0 0 0-6-6zm6-48c26.51 0 48 21.49 48 48v256c0 26.51-21.49 48-48 48H144c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h384zM264 144c0 22.091-17.909 40-40 40s-40-17.909-40-40 17.909-40 40-40 40 17.909 40 40zm-72 96l39.515-39.515c4.686-4.686 12.284-4.686 16.971 0L288 240l103.515-103.515c4.686-4.686 12.284-4.686 16.971 0L480 208v80H192v-48z"/></svg>'},
    { name: 'Font Settings', component: FontSettings, docComponent: FontSettingsDoc, icon: '<svg class="' + iconClass + '" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="black"><path d="M12 5H20V7H12Z"/><path d="M15 6H17V18H15Z"/><path d="M4 10H10V12H4Z"/><path d="M6 11H8V18H6Z"/></svg>'},
    { name: 'External Scripts', component: ExternalScripts, docComponent: ExternalScriptsDoc, li_class: 'pt-2 border-t border-gray-300 dark:border-gray-700', icon: '<svg class="' + iconClass + '" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;}</style></defs><title/><polygon points="18.83 26 21.41 23.42 20 22 16 26 20 30 21.42 28.59 18.83 26"/><polygon points="27.17 26 24.59 28.58 26 30 30 26 26 22 24.58 23.41 27.17 26"/><path d="M14,28H8V4h8v6a2.0058,2.0058,0,0,0,2,2h6v6h2V10a.9092.9092,0,0,0-.3-.7l-7-7A.9087.9087,0,0,0,18,2H8A2.0058,2.0058,0,0,0,6,4V28a2.0058,2.0058,0,0,0,2,2h6ZM18,4.4,23.6,10H18Z"/><rect class="cls-1" data-name="&lt;Transparent Rectangle&gt;" height="32" id="_Transparent_Rectangle_" width="32"/></svg>'},    
    { name: 'Bloat Remover', component: BloatSettings, docComponent: BloatSettingsDoc, icon: '<svg class="' + iconClass + '" viewBox="0 0 48 48" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><title/><path d="M42,3H28a2,2,0,0,0-2-2H22a2,2,0,0,0-2,2H6A2,2,0,0,0,6,7H42a2,2,0,0,0,0-4Z"/><path d="M39,9a2,2,0,0,0-2,2V43H11V11a2,2,0,0,0-4,0V45a2,2,0,0,0,2,2H39a2,2,0,0,0,2-2V11A2,2,0,0,0,39,9Z"/><path d="M21,37V19a2,2,0,0,0-4,0V37a2,2,0,0,0,4,0Z"/><path d="M31,37V19a2,2,0,0,0-4,0V37a2,2,0,0,0,4,0Z"/></svg>'},        
];

//Extra pro items
const admin = computed(() => {
  const items = [...base_admin_items];

  if (isPro.value) {
    items.push(...proAdminItems);
  } else {
    items.forEach(item => {
      item.name = item.name.replace('Settings', '').replace(/(Font|Image)s/, "$1").replace(/(Font|Image)/, '$1s');
    });
  }

  return items;
});

//For showing/hiding columns
const currentColumn = ref(base_admin_items[0].name);

//For showing/hiding docs
const currentDocs = ref(null);

//For showing/hiding flyout
const showDocsFlyout = ref(false);

// Dynamically determine which component to show based on currentColumn
const currentComponent = computed(() => {
  const activeItem = admin.value.find(item => item.name === currentColumn.value);
  
  // Save active item globally
  window.spress_namespace.activeItem = activeItem;
  
  if (activeItem?.name !== 'How to use') {
    currentDocs.value = activeItem?.name || null;
  } else {
    showDocsFlyout.value = false;
  }

  return activeItem?.component || null;
});


// Dynamically determine which doc componet to show
const currentDocComponent = computed(() => {
    const activeItem = admin.value.find(item => item.name === currentDocs.value);
    return activeItem ? activeItem.docComponent : null;
});

//Get current component icon
const currentIcon = computed(() => {
  const activeItem = admin.value.find(item => item.name === currentColumn.value)
  return activeItem ? activeItem.icon : null
})

// initialize flowbite on mount
onMounted(() => {
    initFlowbite();
    window.addEventListener("pluginModeChanged", updatePluginMode);
    //Check for local storage updates
    if (BUILD_PLUGIN_TYPE === 'pro') {
      setInterval(() => {
        const stored = localStorage.getItem('spress_plugin_type') || BUILD_PLUGIN_TYPE;
        if (stored !== plugin_type.value) {
          plugin_type.value = stored;
        }
      }, 1000);
    }    
})


/**
 * Allows column changes from within components
 *
 * @param {string} newColumn The name of the new column to show.
 */
function handleColumnChange(newColumn) {
  if(plugin_type.value !== "pro") {
    newColumn = newColumn.replace('Settings', '').replace(/(Font|Image)s/, "$1").replace(/(Font|Image)/, '$1s');
  }
  currentColumn.value = newColumn;  
}

/**
 * Allows docs display from within components
 *
 * @param {string} newColumn The name of the new column to show.
 */
function handleDocsDisplay(docName) {
    const exists = admin.value.some(item => item.name === docName);
    currentDocs.value = exists ? docName : currentColumn.value;
    showDocsFlyout.value = true;
}


// Function to close the flyout
function closeFlyout() {
    showDocsFlyout.value = false;
}

</script>

<template>

  <div class="tailwind relative">

    <div class="flex flex-col md:flex-row md:gap-4 mt-4">

      <!-- Navigation Column -->
      <div class="">

        <aside id="default-sidebar" 
        class="relative rounded-lg shadow
                bg-gray-50 dark:bg-gray-800
                overflow-hidden
                transition-all duration-200
                flex flex-col
                mb-4
                "
        :class="collapsed  ? 'w-16' : ''"        
        aria-label="Sidebar">
          <!-- Show/Hide toggle -->
          <button
            @click="toggleSidebar"
            class="absolute bottom-1 right-2 p-1 bg-white dark:bg-gray-800 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            <!-- two-chevron SVG -->
            <svg v-if="!collapsed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" class="inline-block">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="17 17 12 12 17 7"></polyline>
            </svg>
            <svg v-else  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" class="inline-block transform rotate-180">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="17 17 12 12 17 7"></polyline>
            </svg>
          </button>          
          <div class="h-full px-3 pt-4 pb-2 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <p>
              <svg class="flex-shrink-0 w-5 h-5 inline-block mt-[-3px] hover-gradient-spress fill-raisin"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="410.847px" height="510.719px" viewBox="-698.001 870.198 410.847 510.719"
                enable-background="new -698.001 870.198 410.847 510.719" xml:space="preserve">
               <defs>
                  <linearGradient id="gradient1" gradientUnits="userSpaceOnUse" x1="-688.0007" y1="1125.5574" x2="-434.8059" y2="1125.5574">
                    <stop  offset="0" style="stop-color:#06B6D4"/>
                    <stop  offset="1" style="stop-color:#3F83F8"/>
                  </linearGradient>
                  <linearGradient id="gradient_spress" gradientUnits="userSpaceOnUse" x1="-757.2937" y1="964.6394" x2="-482.5385" y2="1239.3945">
                    <stop  offset="0" style="stop-color:#06B6D4"/>
                    <stop  offset="1" style="stop-color:#3F83F8"/>
                  </linearGradient>
              </defs>
              <path fill="url(#gradient1)" stroke="url(#gradient_spress)" stroke-width="20" stroke-miterlimit="10" d="M-488.666,1196.174
                c4.219-4.729,8.567-9.894,13.052-15.49c4.479-5.591,9.013-11.249,13.6-16.974c3.957-4.939,7.865-9.816,11.724-14.633
                c3.854-4.811,7.552-9.426,11.098-13.853c3.752-4.683,5.1-9.688,4.033-15.029c-1.061-5.335-3.546-9.567-7.448-12.694
                c-0.519-0.415-0.841-0.674-0.976-0.781c-0.128-0.103-0.323-0.259-0.585-0.469c-4.63-3.279-9.318-4.363-14.053-3.251
                c-4.74,1.117-9.505,4.667-14.298,10.648c-20.008,24.973-44.582,39.351-73.722,43.122c-29.145,3.778-55.056-3.427-77.743-21.604
                c-0.524-0.42-1.042-0.836-1.567-1.256c-0.518-0.415-1.042-0.835-1.567-1.255c-20.808-18.373-32.166-41.469-34.084-69.273
                c-1.912-27.801,5.772-52.497,23.074-74.093c6.668-8.322,13.805-17.23,21.416-26.729c7.606-9.493,15.265-19.054,22.979-28.681
                c5.81-7.251,21.994-27.45,43.011-53.683h-46.43h-40.847c-27.614,0-50,22.386-50,50v390.719c0,27.614,22.386,50,50,50h9.146
                c56.809-70.751,118.948-148.231,121.587-151.525C-502.373,1213.282-496.169,1205.539-488.666,1196.174z"/>
              <path fill="url(#gradient1)" stroke="url(#gradient_spress)" stroke-width="20" stroke-miterlimit="10" d="M-297.154,1080.198
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
              <span v-show="!collapsed" class="text-[#1B1725] inline-block ml-1">SpeedifyPress</span><br/><small>v{{ version }}</small>
              <span v-show="!collapsed" v-if="plugin_mode == 'disabled'" class="ml-2 bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300 block w-fit mx-auto">Disabled</span>
            </p>
          </div>
          <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 pb-8">
              <ul class="space-y-2 font-medium">

                <li v-for="(doc, index) in admin" :key="index" :class="doc.li_class">
                  <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" 
                    :class="(currentColumn === doc.name ? 'bg-gray-100' : '')"
                    @click.prevent="currentColumn = doc.name" 
                    >
                    <span v-html="doc.icon"></span>

                    <!-- label only when expanded -->
                    <span 
                      class="ml-3 whitespace-nowrap"
                      v-show="!collapsed"
                    >{{ doc.name }}</span>

                  </a>
                </li>

              </ul>
          </div>
        </aside>

      </div>

      <!-- Content Column Wrapper: Ensures Flyout is inside Content Column -->
      <div 
      :class="{ collapsed, expanded }"
      class="relative w-full shadow bg-white content-column overflow-hidden">

        <!-- Expand toggle -->
        <button
          @click="toggleMainbar"
          class="absolute bottom-1 right-2 p-1 bg-white dark:bg-gray-800 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none z-10"
        >
          <!-- two-chevron SVG -->
          <svg v-if="expanded" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="inline-block no-gradient">
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="17 17 12 12 17 7"></polyline>
          </svg>
          <svg v-else  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="inline-block transform rotate-180 no-gradient">
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="17 17 12 12 17 7"></polyline>
          </svg>
        </button>       

        <!-- Content Panel (Always Visible) -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 transform translate-x-2"
          enter-to-class="opacity-100 transform translate-x-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 transform translate-x-0"
          leave-to-class="opacity-0 transform translate-x-2"
          mode="out-in"
        >
          <component
            :is="currentComponent"
            :currentColumn="currentColumn"
            :plugin_type="plugin_type"
            :build_plugin_type="BUILD_PLUGIN_TYPE"
            :pro_dashboard_config="proDashboardConfig"
            :is-pro="isPro"
            class="relative h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 text-left"
            :iconclass="iconClass"
            :icon="currentIcon"
            @changeColumn="handleColumnChange"
            @showDocs="handleDocsDisplay"
          />
        </transition>

        <!-- Flyout Panel (Overlays Content Column) -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 transform translate-x-2"
          enter-to-class="opacity-100 transform translate-x-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 transform translate-x-0"
          leave-to-class="opacity-0 transform translate-x-2"
          mode="out-in"
        >
          <div 
            v-if="showDocsFlyout" 
            class="absolute top-0 right-0 w-full md:w-[calc(100%-16rem)] h-full bg-white shadow-lg dark:bg-gray-800 z-50 flyout-overlay"
          >
            <div class="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
              <span v-html="currentIcon" class="mr-2 no-gradient"></span>
              <h3 class="text-xl font-bold leading-none text-raisin dark:text-white">                
                How to use the {{ currentDocs }}
              </h3>
              <button @click="closeFlyout" class="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto dark:hover:bg-gray-600 dark:hover:text-white">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <span class="sr-only">Close flyout</span>
              </button>
            </div>

            <div class="p-4 space-y-6 overflow-y-auto h-full">              
              <component 
                :is="currentDocComponent"  
                :iconclass="iconClass"
              />
            </div>
          </div>
        </transition>

      </div>

    </div>

    
  </div>

</template>



