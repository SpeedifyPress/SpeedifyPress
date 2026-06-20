<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { CodeJar } from 'codejar';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';

const loaders = {
  markup: () => import('prismjs/components/prism-markup'),
  javascript: () => import('prismjs/components/prism-javascript'),
  typescript: () => import('prismjs/components/prism-typescript'),
  css: () => import('prismjs/components/prism-css'),
  json: () => import('prismjs/components/prism-json'),
  php: () => import('prismjs/components/prism-php'),
};

const props = defineProps({
  modelValue: { type: String, default: '' },
  name: { type: String, default: '' },   // hidden input name for form posts
  id:   { type: String, default: '' },
  language: { type: String, default: 'javascript' }, // 'javascript' | 'markup' | ...
  preClass: { type: [String, Array, Object], default: '' }, // Tailwind/classes for the <pre>
  tab: { type: String, default: '  ' },
  autofocus: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue','focus','blur','change']);

const editorEl = ref(null);
const hiddenInputEl = ref(null);
const innerValue = ref(props.modelValue || '');
let jar = null;

const normalizedLang = ref(props.language === 'html' ? 'markup' : props.language);

async function ensureLanguageLoaded(lang) {
  const key = lang === 'html' ? 'markup' : lang;
  if (!Prism.languages[key] && loaders[key]) {
    try { await loaders[key](); } catch {}
  }
}

function highlighter(ed) {
  const code = ed.textContent;
  const key = normalizedLang.value;
  const grammar = Prism.languages[key] || Prism.languages.markup;
  ed.innerHTML = Prism.highlight(code, grammar, key);
}

onMounted(async () => {
  await ensureLanguageLoaded(normalizedLang.value);
  if (!editorEl.value) return;

  editorEl.value.setAttribute('contenteditable', props.disabled ? 'false' : 'true');
  editorEl.value.classList.add(`language-${normalizedLang.value}`);

  jar = CodeJar(editorEl.value, highlighter, { tab: props.tab });

  // seed and sync hidden input
  jar.updateCode(innerValue.value || '');
  if (hiddenInputEl.value) hiddenInputEl.value.value = innerValue.value || '';

  jar.onUpdate((code) => {
    innerValue.value = code;
    emit('update:modelValue', code);
    if (hiddenInputEl.value) hiddenInputEl.value.value = code;
  });

  editorEl.value.addEventListener('focus', () => emit('focus'));
  editorEl.value.addEventListener('blur', () => { emit('blur'); emit('change', innerValue.value); });

  if (props.autofocus) editorEl.value.focus();
});

onBeforeUnmount(() => { jar = null; });

watch(() => props.modelValue, async (nv) => {
  innerValue.value = nv || '';
  if (!jar || document.activeElement === editorEl.value) return;
  await ensureLanguageLoaded(normalizedLang.value);
  jar.updateCode(innerValue.value);
  if (hiddenInputEl.value) hiddenInputEl.value.value = innerValue.value;
});

watch(() => props.language, async (lang) => {
  normalizedLang.value = lang === 'html' ? 'markup' : lang;
  await ensureLanguageLoaded(normalizedLang.value);
  if (editorEl.value) {
    editorEl.value.className = editorEl.value.className
      .split(' ').filter(c => !c.startsWith('language-')).join(' ');
    editorEl.value.classList.add(`language-${normalizedLang.value}`);
    highlighter(editorEl.value);
  }
});

watch(() => props.disabled, (d) => {
  if (editorEl.value) editorEl.value.setAttribute('contenteditable', d ? 'false' : 'true');
});
</script>

<template>
  <!-- single PRE as the editable/highlighted surface -->
  <pre
    :id="id || undefined"
    ref="editorEl"
    contenteditable="true"
    :class="[
      // kill theme spacing; you can re-add padding via preClass
      'm-0 p-1 w-full max-w-full overflow-x-auto box-border block text-sm font-mono text-gray-900 dark:text-white min-h-32 overflow-auto resize-y',
      preClass
    ]"
    :data-placeholder="placeholder"
    :aria-disabled="disabled ? 'true' : 'false'"
  ></pre>

  <!-- hidden input keeps native <form> submissions working -->
  <input
    v-if="name"
    type="hidden"
    :name="name"
    :value="innerValue"
    ref="hiddenInputEl"
  />
</template>

<style scoped>
/* Placeholder when empty */
pre[contenteditable="true"][data-placeholder]:empty::before {
  content: attr(data-placeholder);
  opacity: 0.5;
  pointer-events: none;
}

pre.fixed-width {
    max-width: 285px !important;
}
.collapsed pre.fixed-width {
    max-width: 380px !important;
}
.expanded pre.fixed-width {
    max-width: 40vw !important;
}

</style>