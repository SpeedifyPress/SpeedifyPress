<script setup>
import Skeleton from './../components/Skeleton.vue'
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

const emit = defineEmits(['changeColumn'])

// Function to emit the column change event
function changeColumn(newColumn) {
  emit('changeColumn', newColumn)
}

</script>

<template>
  <div>

    <div class="flex flex-wrap items-start">

            <div class="w-full p-2 mr-4" >

                <div class="flex items-left mb-4">
                    <span v-html="icon" class="mr-2 force-gradient"></span>
                    <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">How to use</h5>
                </div>
                <hr class="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700">
            </div>      

            <div class="w-full max-w-lg p-4 pt-0 mr-4 p-4 ml-2 bg-white border border-gray-200 rounded-lg shadow mb-4" >              

                <p class="mb-1 mt-3 text-lg text-gray-500 md:text-xl dark:text-gray-400">Getting Started</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                  When you first install the Plugin it will start in <span class="bg-yellow-100 text-yellow-800 me-1 px-2.5 py-0.5 rounded dark:bg-yellow-700 dark:text-yellow-300">Preview Mode</span>. This allows you 
                  to test  the plugin as an admin and ensure that Unused CSS is being removed as expected. You should:
                  <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
                    <li><strong class="font-semibold text-gray-900 dark:text-white">Visit some pages</strong> on your site.</li>
                    <li>On each page you visit you should <strong class="font-semibold text-gray-900 dark:text-white">scroll and then wait</strong> a few seconds</li>
                    <li>In a separate browser tab, keep open <a @click.prevent="changeColumn('Dashboard')" href="#">The Dashboard</a></li>
                    <li>Keep an eye on the <strong class="font-semibold text-gray-900 dark:text-white">Cache Status.</strong> You should see the number of files & pages increasing</li>
                    <li><strong class="font-semibold text-gray-900 dark:text-white">Revisit the pages</strong> they should now load with reduced CSS (check the page source to confirm)</li>
                    <li>If not, try clearning your page cache (for most caches, it should be automatic)</li>
                  </ul> 
                </p>

            </div> 

            <div class="w-full max-w-sm p-4 pt-0 mr-4 p-4 ml-2 bg-white border border-gray-200 rounded-lg shadow mb-4" >              

                <p class="mb-1 mt-3 text-lg text-gray-500 md:text-xl dark:text-gray-400">Display Problems?</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                  When you visit pages, you may find that the CSS is not displaying correctly for some elements. This is usually because the CSS is added by JavaScript or some other external process and therefore isn't captured. How to fix:
                  <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
                    <li>These instructions are for Chrome <svg  class="w-3 h-3 inline mt-[-3px]" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M7,12c0-2.7614136,2.2385864-5,5-5c0.7705078,0,1.4915771,0.1887207,2.1434326,0.5h8.9761353   C21.338562,3.1040039,17.03479,0,12,0C8.1478271,0,4.7286987,1.8223267,2.53302,4.6439209l4.5093994,7.7771606   C7.0304565,12.2799683,7,12.1442261,7,12z" fill="#F44336"/><path d="M12,17c-2.6171875,0-4.7403564-2.0178833-4.9575806-4.5789185L2.53302,4.6439209   C0.9511719,6.6766968,0,9.2247314,0,12c0,6.0725098,4.5148926,11.0784302,10.3684082,11.8762817l4.4510498-7.75   C14.0164185,16.6760864,13.0466919,17,12,17z" fill="#00B060"/><path d="M14.1434326,7.5C15.8276367,8.3043823,17,10.0090942,17,12   c0,1.7147217-0.8649902,3.2255249-2.180542,4.1262817l-4.4510498,7.75C10.9033203,23.9492188,11.4450684,24,12,24   c6.6274414,0,12-5.3726196,12-12c0-1.5926514-0.3170776-3.109436-0.8804321-4.5H14.1434326z" fill="#FFC107"/><circle cx="12" cy="12" fill="#2196F3" id="XMLID_1302_" r="4"/><linearGradient gradientUnits="userSpaceOnUse" id="SVGID_1_" x1="16.3874664" x2="20.8755341" y1="5.2559662" y2="9.7440338"><stop offset="0" style="stop-color:#000000;stop-opacity:0.1"/><stop offset="1" style="stop-color:#000000;stop-opacity:0"/></linearGradient><path d="M16.4558716,9.7610474L23.1195679,7.5h-8.9761353   C15.1433716,7.9775391,15.9550171,8.7772827,16.4558716,9.7610474z" fill="url(#SVGID_1_)"/><linearGradient gradientUnits="userSpaceOnUse" id="SVGID_2_" x1="1.8841199" x2="8.0149345" y1="5.2791538" y2="11.4099684"><stop offset="0" style="stop-color:#000000;stop-opacity:0.1"/><stop offset="1" style="stop-color:#000000;stop-opacity:0"/></linearGradient><path d="M7.8330746,9.2605782L2.5431018,4.6201715l4.4880676,7.7735615   C6.9447608,11.288991,7.2315364,10.1862135,7.8330746,9.2605782z" fill="url(#SVGID_2_)"/><linearGradient gradientUnits="userSpaceOnUse" id="SVGID_3_" x1="10.6388721" x2="13.4027376" y1="18.0505562" y2="20.8144207"><stop offset="0" style="stop-color:#000000;stop-opacity:0.1"/><stop offset="1" style="stop-color:#000000;stop-opacity:0"/></linearGradient><path d="M11.7110538,16.9783745l-1.373723,6.901453l4.4880676-7.7735596   C13.9118671,16.7334709,12.813446,17.0365047,11.7110538,16.9783745z" fill="url(#SVGID_3_)"/><linearGradient gradientUnits="userSpaceOnUse" id="XMLID_45_" x1="1.1217111" x2="22.8782883" y1="6.9273705" y2="17.0726299"><stop offset="0" style="stop-color:#FFFFFF;stop-opacity:0.2"/><stop offset="1" style="stop-color:#FFFFFF;stop-opacity:0"/></linearGradient><circle cx="12" cy="12" fill="url(#XMLID_45_)" id="XMLID_1304_" r="12"/></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg></li>                      
                    <li>First, make sure that <span class="bg-yellow-100 text-yellow-800 me-1 px-2.5 py-0.5 rounded dark:bg-yellow-700 dark:text-yellow-300">Preview Mode</span> is enabled in this plugin</li>
                    <li>Open a tab with the incorrect CSS displaying. In a new <svg class="no-gradient w-3 h-3 inline mt-[-1px]" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css">
	.st0{opacity:0.2;fill:none;stroke:#000000;stroke-width:5.000000e-02;stroke-miterlimit:10;}
</style><g id="grid_system"/><g id="_icons"><g><path d="M4,12h3h10h3c0.6,0,1-0.4,1-1s-0.4-1-1-1h-2.2l-1.5-5.8C16,2.9,14.9,2,13.6,2c-0.2,0-0.4,0.1-0.5,0.2l-0.3,0.2    c-0.4,0.3-0.9,0.3-1.3,0L11,2.2C10.8,2.1,10.6,2,10.4,2C9.1,2,8,2.9,7.7,4.2L6.2,10H4c-0.6,0-1,0.4-1,1S3.4,12,4,12z M9.6,4.6    C9.7,4.3,9.9,4.1,10.2,4l0,0c1.1,0.7,2.4,0.7,3.5,0l0,0c0.3,0.1,0.5,0.3,0.6,0.6L15,7H9L9.6,4.6z M8.5,9h6.9l0.3,1H8.3L8.5,9z"/><path d="M17,13c-1.9,0-3.4,1.3-3.9,3h-2.3c-0.4-1.7-2-3-3.9-3c-2.2,0-4,1.8-4,4s1.8,4,4,4c1.9,0,3.4-1.3,3.9-3h2.3    c0.4,1.7,2,3,3.9,3c2.2,0,4-1.8,4-4S19.2,13,17,13z M7,19c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S8.1,19,7,19z M17,19    c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S18.1,19,17,19z"/></g></g></svg> 
                      incognito tab, open the same page.</li>
                    <li>On each page, <strong class="font-semibold text-gray-900 dark:text-white">right click the element</strong> which isn't displaying correctly and select "Inspect". </li>
                    <li>Look for the <strong class="font-semibold text-gray-900 dark:text-white">CSS class</strong> that causes the correct CSS to be loaded</li>
                    <li>Add that CSS class to the list of <strong class="font-semibold text-gray-900 dark:text-white">Force Include Seletors</strong> on the <a @click.prevent="changeColumn('Settings')" href="#">Settings Page</a>.</li>
                    <li>Clear the cache and repeat</li>
                  </ul> 
                </p>

            </div>      

            <div class="w-full max-w-lg p-4 pt-0 mr-4 p-4 ml-2 bg-white border border-gray-200 rounded-lg shadow xxl:mt-[-85px] mb-4" >              

                <p class="mb-1 mt-3 text-lg text-gray-500 md:text-xl dark:text-gray-400">Using the Stats</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                  The stats section allows you to explore how different plugins inject CSS across your site. 
                  <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2">
                    <li>View by <strong class="font-semibold text-gray-900 dark:text-white">plugin folder, path or post type</strong>. </li>
                    <li>Click <strong class="font-semibold text-gray-900 dark:text-white">column headers</strong> to sort</li>
                    <li><strong class="font-semibold text-gray-900 dark:text-white">Click a row</strong> for detailed usage information</li>
                  </ul> 
                </p>

            </div>                  

            <div class="w-full max-w-sm p-4 pt-0 mr-4 p-4 ml-2 bg-white border border-gray-200 rounded-lg shadow  mb-4" >              

                <p class="mb-1 mt-3 text-lg text-gray-500 md:text-xl dark:text-gray-400">
                <svg :class="iconclass" class="inline w-4 h-4 mt-[-3px]" viewBox="0 0 128 128" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M64,1.2C29.3,1.2,1.2,29.3,1.2,64s28.2,62.8,62.8,62.8s62.8-28.2,62.8-62.8S98.7,1.2,64,1.2z M64,8.8   c13.6,0,26,4.9,35.6,13.1L84.4,37c-5.7-4.3-12.8-6.9-20.4-6.9S49.2,32.7,43.6,37L28.4,21.9C38,13.8,50.4,8.8,64,8.8z M90.2,64   c0,14.4-11.7,26.2-26.2,26.2S37.8,78.4,37.8,64S49.6,37.8,64,37.8S90.2,49.6,90.2,64z M8.8,64c0-14.1,5.3-27,14.1-36.7L38,42.4   c-4.9,5.9-7.8,13.4-7.8,21.6c0,7.7,2.6,14.8,6.9,20.4L21.9,99.6C13.8,90,8.8,77.6,8.8,64z M64,119.2c-14.1,0-27-5.3-36.7-14.1   L42.4,90c5.9,4.9,13.4,7.8,21.6,7.8s15.8-2.9,21.6-7.8l15.1,15.1C91,113.8,78.1,119.2,64,119.2z M106.1,99.6L91,84.4   c4.3-5.7,6.9-12.8,6.9-20.4c0-8.2-2.9-15.8-7.8-21.6l15.1-15.1c8.7,9.8,14.1,22.6,14.1,36.7C119.2,77.6,114.2,90,106.1,99.6z"/></g></svg>                  
                  High traffic site? Need Expert help?
                </p>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                   Optimising high traffic <svg class="inline w-4 h-4 mt-[-3px]" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path clip-rule="evenodd" d="M198.627,398.169l-83.444-250.333   c8.616-0.453,17.232-1.359,25.396-2.266c8.616-1.359,9.522-7.71,9.069-10.881c-0.453-2.726-3.172-8.616-10.429-7.71   c-22.216,1.813-42.175,2.719-60.767,2.719c-2.266,0-4.992,0-7.257,0c40.363-58.955,107.934-97.95,185.035-97.95   c55.775,0,106.567,20.404,146.016,54.416c-12.248,2.265-24.935,10.882-28.575,23.13c-10.873,35.372,10.437,58.502,20.42,73.914   c10.874,17.232,14.968,35.832,16.779,55.33c2.266,27.208-9.077,61.673-16.326,87.983l-23.591,70.289l-82.991-248.974   c8.624-0.453,17.232-1.359,25.403-2.266c9.062-1.359,9.515-7.71,9.062-10.881c0-2.726-2.719-8.163-10.421-7.71   c-22.231,2.266-41.729,2.719-60.321,2.719s-38.543-0.453-60.768-2.719c-7.257-0.453-9.975,4.984-10.428,7.71   c0,3.171,0.453,9.522,9.069,10.881c7.71,0.906,15.874,1.813,23.583,2.266l36.277,98.864L198.627,398.169z M480.254,256.23   c0,80.257-42.637,151-106.583,190.464l52.167-148.749c10.421-28.122,22.216-56.689,29.012-86.163   c3.625-16.326,5.453-32.652,5-49.432C472.989,190.917,480.254,222.664,480.254,256.23L480.254,256.23z M256.23,480.254   c-22.231,0-43.089-3.172-63.04-9.077l65.759-197.261l71.195,193.636C306.554,475.707,282.071,480.254,256.23,480.254   L256.23,480.254z M152.375,454.85C80.718,417.214,31.747,342.394,31.747,256.23c0-30.395,5.89-58.962,16.771-85.264L152.375,454.85   z M256.23,0C114.73,0,0,114.73,0,256.23C0,397.263,114.73,512,256.23,512C397.263,512,512,397.263,512,256.23   C512,114.73,397.263,0,256.23,0L256.23,0z" fill="#0CA3D1" fill-rule="evenodd"/></g></svg> WordPress 
                   sites and <br/><svg class="inline w-5 h-5 mt-[-3px]" viewBox="0 0 256 153" width="256px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M23.7586644,0 L232.137438,0 C245.324643,0 256,10.6753566 256,23.8625617 L256,103.404434 C256,116.591639 245.324643,127.266996 232.137438,127.266996 L157.409942,127.266996 L167.666657,152.385482 L122.558043,127.266996 L23.8633248,127.266996 C10.6761196,127.266996 0.000763038458,116.591639 0.000763038458,103.404434 L0.000763038458,23.8625617 C-0.10389732,10.7800169 10.5714592,0 23.7586644,0 L23.7586644,0 Z" fill="#9B5C8F"/><path d="M14.5781994,21.7495935 C16.0351099,19.7723577 18.2204758,18.7317073 21.1342969,18.5235772 C26.441614,18.1073171 29.4595002,20.604878 30.1879555,26.0162602 C33.4139717,47.7658537 36.9521831,66.1853659 40.6985246,81.2747967 L63.4887685,37.8796748 C65.5700693,33.9252033 68.1716953,31.8439024 71.2936465,31.6357724 C75.8725083,31.3235772 78.6822644,34.2373984 79.8269798,40.3772358 C82.4286059,54.2178862 85.7586872,65.9772358 89.7131587,75.9674797 C92.4188498,49.5349593 96.9977116,30.4910569 103.449744,18.7317073 C105.01072,15.8178862 107.300151,14.3609756 110.318037,14.1528455 C112.711533,13.9447154 114.896899,14.6731707 116.874134,16.2341463 C118.85137,17.795122 119.89202,19.7723577 120.100151,22.1658537 C120.204216,24.0390244 119.89202,25.6 119.0595,27.1609756 C115.000964,34.6536585 111.670882,47.2455285 108.965191,64.7284553 C106.363565,81.6910569 105.42698,94.9073171 106.05137,104.377236 C106.2595,106.978862 105.84324,109.268293 104.80259,111.245528 C103.553809,113.534959 101.680638,114.78374 99.2871424,114.99187 C96.5814514,115.2 93.7716953,113.95122 91.0660042,111.141463 C81.3879555,101.255285 73.6871424,86.4780488 68.0676303,66.8097561 C61.3034026,80.1300813 56.3082807,90.1203252 53.0822644,96.7804878 C46.942427,108.539837 41.739175,114.57561 37.3684433,114.887805 C34.5586872,115.095935 32.1651912,112.702439 30.0838904,107.707317 C24.7765733,94.0747967 19.0529961,67.7463415 12.9131587,28.7219512 C12.4968985,26.0162602 13.1212888,23.6227642 14.5781994,21.7495935 Z M238.213972,38.0878049 C234.46763,31.5317073 228.952183,27.5772358 221.563565,26.0162602 C219.586329,25.6 217.713159,25.3918699 215.944053,25.3918699 C205.953809,25.3918699 197.836736,30.595122 191.488768,41.001626 C186.077386,49.8471545 183.371695,59.6292683 183.371695,70.3479675 C183.371695,78.3609756 185.036736,85.2292683 188.366817,90.9528455 C192.113159,97.5089431 197.628606,101.463415 205.017224,103.02439 C206.99446,103.44065 208.86763,103.64878 210.636736,103.64878 C220.731045,103.64878 228.848118,98.4455285 235.09202,88.0390244 C240.503403,79.0894309 243.209094,69.3073171 243.209094,58.5886179 C243.313159,50.4715447 241.544053,43.7073171 238.213972,38.0878049 Z M225.101777,66.9138211 C223.644866,73.7821138 221.04324,78.8813008 217.192834,82.3154472 C214.174947,85.0211382 211.365191,86.1658537 208.763565,85.6455285 C206.266004,85.1252033 204.184703,82.9398374 202.623728,78.8813008 C201.374947,75.6552846 200.750557,72.4292683 200.750557,69.4113821 C200.750557,66.8097561 200.958687,64.2081301 201.479012,61.8146341 C202.415598,57.5479675 204.184703,53.3853659 206.99446,49.4308943 C210.428606,44.3317073 214.070882,42.2504065 217.817224,42.9788618 C220.314785,43.499187 222.396086,45.6845528 223.957061,49.7430894 C225.205842,52.9691057 225.830232,56.195122 225.830232,59.2130081 C225.830232,61.9186992 225.622102,64.5203252 225.101777,66.9138211 Z M173.069256,38.0878049 C169.322915,31.5317073 163.703403,27.5772358 156.41885,26.0162602 C154.441614,25.6 152.568443,25.3918699 150.799338,25.3918699 C140.809094,25.3918699 132.69202,30.595122 126.344053,41.001626 C120.932671,49.8471545 118.22698,59.6292683 118.22698,70.3479675 C118.22698,78.3609756 119.89202,85.2292683 123.222102,90.9528455 C126.968443,97.5089431 132.48389,101.463415 139.872508,103.02439 C141.849744,103.44065 143.722915,103.64878 145.49202,103.64878 C155.586329,103.64878 163.703403,98.4455285 169.947305,88.0390244 C175.358687,79.0894309 178.064378,69.3073171 178.064378,58.5886179 C178.064378,50.4715447 176.399338,43.7073171 173.069256,38.0878049 Z M159.852996,66.9138211 C158.396086,73.7821138 155.79446,78.8813008 151.944053,82.3154472 C148.926167,85.0211382 146.116411,86.1658537 143.514785,85.6455285 C141.017224,85.1252033 138.935923,82.9398374 137.374947,78.8813008 C136.126167,75.6552846 135.501777,72.4292683 135.501777,69.4113821 C135.501777,66.8097561 135.709907,64.2081301 136.230232,61.8146341 C137.166817,57.5479675 138.935923,53.3853659 141.745679,49.4308943 C145.179825,44.3317073 148.822102,42.2504065 152.568443,42.9788618 C155.066004,43.499187 157.147305,45.6845528 158.708281,49.7430894 C159.957061,52.9691057 160.581451,56.195122 160.581451,59.2130081 C160.685516,61.9186992 160.373321,64.5203252 159.852996,66.9138211 L159.852996,66.9138211 L159.852996,66.9138211 Z" fill="#FFFFFF"/></g></svg> WooCommerce stores is not easy. 
                   If your business needs an expert to guide you then <a href="">get in touch</a> and let's talk.
                </p>

            </div>                            

    </div>    



    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full p-4" id="my-modal">
      <div class="relative top-20 mx-auto w-full max-w-2xl max-h-full">
        <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div class="flex justify-between items-center pb-1 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              How to check Unused CSS is loading
            </h3>
            <button @click="closeModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="space-y-6">
            
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
     showModal: false
    };
  },
  mounted() {
    initFlowbite();
  },
  methods: { 
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>