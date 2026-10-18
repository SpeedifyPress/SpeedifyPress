
<script setup>
defineProps({
  config_key: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },  
  saving: {
    type: String,
    required: false,
    default: "Saving"
  },  
  id: {
    type: String,
    required: false
  },  
  status_object: {
    type: Object,
    required: false
  },
  buttonclass: {
    type: String,
    required: true
  },       
})

</script>

<template>

        <span>

            <button type="submit" :class="buttonclass" class="mt-4 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl hover:shadow-md">
            <span :class="buttonclass" class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md text-cyan-700">
                <svg v-if="status_object[id].spinner" aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin mt-[-3px]" viewBox="0 0 100 101"  xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" />
                </svg>
                <transition
                enter-active-class="transition-opacity duration-700 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-0"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                mode="out-in"
                >                          
                <svg v-if="status_object[id].success" class="inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g><polygon class="st0" points="434.8,49 174.2,309.7 76.8,212.3 0,289.2 174.1,463.3 196.6,440.9 196.6,440.9 511.7,125.8 434.8,49" fill="#41AD49" /></g>
                </svg> 
                <svg v-if="status_object[id].failure" class="inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient" viewBox="0 0 612 792" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g><polygon class="st0" points="382.2,396.4 560.8,217.8 484,141 305.4,319.6 126.8,141 50,217.8 228.6,396.4 50,575 126.8,651.8    305.4,473.2 484,651.8 560.8,575 382.2,396.4  " fill="#E44061"/></g>
                </svg>                                                                     
                </transition>                          
                <span v-if="status_object[id].text">{{ saving }}</span><span v-else>{{ title }}</span>
            </span>
            </button>
            <input type="hidden" name="config_key" :value="config_key" /> 

        </span>

</template>