<script setup>
import { computed, ref } from 'vue'
import apacheProtect from '../config/server-configs/apache-protect.conf?raw'
import apacheDirectServe from '../config/server-configs/apache-direct-serve.conf?raw'
import nginxProtect from '../config/server-configs/nginx-protect.conf?raw'
import nginxDirectServeHttp from '../config/server-configs/nginx-direct-serve-http.conf?raw'
import nginxDirectServeServer from '../config/server-configs/nginx-direct-serve-server.conf?raw'
import CodeEditor from './CodeEditor.vue'

const emit = defineEmits(['showDocs'])

defineProps({
  icon: { type: String, default: '' },
})

const serverSoftware = String(window.spress_namespace.server_software || '')
const serverSoftwareLower = serverSoftware.toLowerCase()
const cacheUrlPath = String(window.spress_namespace.cache_url_path || '').replace(/\/$/, '')
const cacheUrlBasePath = cacheUrlPath.replace(/\/[^/]+$/, '')
const cacheUrlBasePathRegex = escapeRegex(cacheUrlBasePath)
const cacheConfig = window.spress_namespace.config?.speed_cache || {}
const bypassUrls = String(cacheConfig.bypass_urls?.value || '')
const bypassUserAgents = String(cacheConfig.bypass_useragents?.value || '')
const copiedConfig = ref('')

const detectedServer = computed(() => {
  if (serverSoftwareLower.includes('nginx') || serverSoftwareLower.includes('openresty')) return 'nginx'
  if (serverSoftwareLower.includes('apache') || serverSoftwareLower.includes('litespeed')) return 'apache'
  return 'unknown'
})

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getExclusionRules(value) {
  return value
    .split(/\r?\n/)
    .map(rule => rule.replace(/[\u0000-\u001f\u007f]/g, '').trim())
    .filter(Boolean)
}

function quoteRegex(value) {
  return escapeRegex(value).replaceAll('"', '\\"')
}

function escapeApacheRegex(value) {
  return escapeRegex(value).replaceAll(' ', '\\x20')
}

function renderRuleLines(rules, format, variable = '', isUrlRule = false) {
  if (rules.length === 0) {
    return format === 'apache'
      ? '# No matching exclusions are currently configured.'
      : '    # No matching exclusions are currently configured.'
  }

  if (format === 'apache') {
    return rules.map(rule => {
      const pattern = isUrlRule && rule === '/' ? '^/$' : escapeApacheRegex(rule)
      return `RewriteCond %{${variable}} !${pattern} [NC]`
    }).join('\n')
  }

  return rules.map(rule => {
    const pattern = isUrlRule && rule === '/' ? '^/$' : quoteRegex(rule)
    return `    "~*${pattern}" 1;`
  }).join('\n')
}

function renderConfig(source) {
  const bypassUrlRules = getExclusionRules(bypassUrls)
  const bypassUserAgentRules = getExclusionRules(bypassUserAgents)

  return source
    .replaceAll('{{CACHE_URL_PATH_REGEX}}', escapeRegex(cacheUrlPath))
    .replaceAll('{{CACHE_URL_BASE_PATH_REGEX}}', cacheUrlBasePathRegex)
    .replaceAll('{{CACHE_URL_PATH}}', cacheUrlPath)
    .replaceAll('{{CACHE_URL_BASE_PATH}}', cacheUrlBasePath)
    .replaceAll('{{BYPASS_URL_CONDITIONS}}', renderRuleLines(bypassUrlRules, 'apache', 'REQUEST_URI', true))
    .replaceAll('{{BYPASS_USER_AGENT_CONDITIONS}}', renderRuleLines(bypassUserAgentRules, 'apache', 'HTTP_USER_AGENT'))
    .replaceAll('{{BYPASS_URL_MAP}}', renderRuleLines(bypassUrlRules, 'nginx', '', true))
    .replaceAll('{{BYPASS_USER_AGENT_MAP}}', renderRuleLines(bypassUserAgentRules, 'nginx'))
}

const servers = computed(() => [
  {
    id: 'apache',
    label: 'Apache / LiteSpeed',
    recommended: detectedServer.value === 'apache',
    configs: [
      { id: 'apache-protect', title: 'Block direct access to cache files', source: apacheProtect },
      { id: 'apache-direct-serve', title: 'Direct Server Delivery', source: apacheDirectServe },
    ],
  },
  {
    id: 'nginx',
    label: 'Nginx / OpenResty',
    recommended: detectedServer.value === 'nginx',
    configs: [
      { id: 'nginx-protect', title: 'Block direct access to cache files', source: nginxProtect },
      {
        id: 'nginx-direct-serve',
        title: 'Direct Server Delivery',
        sections: [
          { id: 'nginx-http', title: 'nginx.conf (http block)', source: nginxDirectServeHttp },
          { id: 'nginx-server', title: 'Site config (/etc/nginx/sites-available)', source: nginxDirectServeServer },
        ],
      },
    ],
  },
])

async function copyConfig(config) {
  const text = renderConfig(config.source)

  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }

  copiedConfig.value = config.id
  window.setTimeout(() => {
    if (copiedConfig.value === config.id) copiedConfig.value = ''
  }, 1800)
}
</script>

<template>
  <div>
    <div class="flex flex-wrap">
      <div class="w-full p-2 mr-4">
        <div class="flex items-left mb-4">
          <span v-html="icon" class="mr-2 force-gradient"></span>
          <h5 class="text-xl font-bold leading-none text-raisin dark:text-white">Server Config</h5>
          <svg @click="emit('showDocs', 'Server Config')" class="flex-shrink-0 w-5 h-5 inline-block mt-[-1px] cursor-pointer ml-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>
        </div>
        <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">
      </div>
    </div>

    <div class="space-y-4 text-left px-2">

    <p class="text-sm text-gray-600 dark:text-gray-300">
      Detected server: <strong>{{ serverSoftware || 'not reported' }}</strong>.
      Use the recommended server section below. The other server's examples remain available if your site is behind a reverse proxy.
    </p>

    <div v-if="!cacheUrlPath" class="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
      The plugin could not determine its cache URL path. Check the path in each snippet before applying it.
    </div>

    <p class="text-sm text-gray-600 dark:text-gray-300">
      Blocking direct requests to cache files is recommended. Direct server delivery is optional and has additional limitations; read its documentation before enabling it.
    </p>

    <details
      v-for="server in servers"
      :key="server.id"
      :open="server.recommended"
      class="group rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <summary class="flex cursor-pointer list-none items-center gap-2 p-4 font-semibold text-raisin dark:text-white">
        {{ server.label }}
        <span v-if="server.recommended" class="rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-900">Detected</span>
        <span class="ml-auto text-gray-500 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
      </summary>

      <div class="space-y-5 border-t border-gray-200 p-4 dark:border-gray-700">
        <article v-for="config in server.configs" :key="config.id" class="space-y-2">
          <template v-if="config.sections">
            <h3 class="font-medium text-gray-800 dark:text-gray-100">{{ config.title }}</h3>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <section v-for="section in config.sections" :key="section.id" class="min-w-0 space-y-2">
                <div class="flex items-center justify-between gap-3">
                  <h4 class="font-medium text-gray-800 dark:text-gray-100">{{ section.title }}</h4>
                  <button
                    type="button"
                    :disabled="!cacheUrlPath"
                    class="shrink-0 rounded border border-cyan-600 px-3 py-1.5 text-sm text-cyan-800 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-gray-700"
                    @click="copyConfig({ ...section, id: `${config.id}-${section.id}` })"
                  >
                    {{ copiedConfig === `${config.id}-${section.id}` ? 'Copied' : 'Copy' }}
                  </button>
                </div>
                <CodeEditor
                  :model-value="renderConfig(section.source)"
                  language="nginx"
                  :disabled="true"
                  pre-class="max-h-80 rounded bg-gray-950 p-3 text-xs leading-relaxed text-gray-100"
                />
              </section>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center justify-between gap-3">
              <h3 class="font-medium text-gray-800 dark:text-gray-100">{{ config.title }}</h3>
              <button
                type="button"
                :disabled="!cacheUrlPath"
                class="shrink-0 rounded border border-cyan-600 px-3 py-1.5 text-sm text-cyan-800 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-gray-700"
                @click="copyConfig(config)"
              >
                {{ copiedConfig === config.id ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <CodeEditor
              :model-value="renderConfig(config.source)"
              :language="server.id === 'nginx' ? 'nginx' : 'apacheconf'"
              :disabled="true"
              pre-class="max-h-80 rounded bg-gray-950 p-3 text-xs leading-relaxed text-gray-100"
            />
          </template>
        </article>
      </div>
    </details>
    </div>
  </div>
</template>
