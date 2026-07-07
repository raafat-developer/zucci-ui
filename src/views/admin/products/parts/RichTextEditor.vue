<script setup>
/**
 * RichTextEditor — contentEditable editor with a formatting toolbar and a
 * code (HTML source) view. Ported from the React RichTextEditor. Content is
 * set on mount via a template ref (never v-html on the live editable node) to
 * avoid the cross-column bleed bug called out in the conversion brief.
 */
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  dir: { type: String, default: 'ltr' },
  readOnly: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

const bodyRef = ref(null);
const codeView = ref(false);
let lastVal = props.modelValue || '';

onMounted(() => {
  if (bodyRef.value && !props.readOnly) bodyRef.value.innerHTML = props.modelValue || '';
});
// Resync when external value changes and editor isn't focused
watch(() => props.modelValue, (v) => {
  if (v !== lastVal && bodyRef.value && document.activeElement !== bodyRef.value && !codeView.value) {
    bodyRef.value.innerHTML = v || '';
    lastVal = v || '';
  }
});

const exec = (cmd) => { document.execCommand(cmd, false, null); bodyRef.value?.focus(); };
const format = (e) => { if (e.target.value) { document.execCommand('formatBlock', false, e.target.value); bodyRef.value?.focus(); e.target.value = ''; } };
const sync = () => { if (bodyRef.value) { lastVal = bodyRef.value.innerHTML; emit('update:modelValue', lastVal); } };
const toggleCode = () => {
  if (!codeView.value && bodyRef.value) { lastVal = bodyRef.value.innerHTML; emit('update:modelValue', lastVal); }
  codeView.value = !codeView.value;
  if (!codeView.value) requestAnimationFrame(() => { if (bodyRef.value) bodyRef.value.innerHTML = props.modelValue || ''; });
};
</script>

<template>
  <div class="zp-rte">
    <template v-if="readOnly">
      <div class="zp-rte-toolbar zp-rte-toolbar--readonly"><span class="zp-rte-readonly-label">Read-only</span></div>
      <div class="zp-rte-body" :dir="dir" :style="{ color:'var(--zg-text-dim)', textAlign: dir==='rtl'?'right':'left' }" v-html="modelValue || '<em>No synced content</em>'" />
    </template>
    <template v-else>
      <div class="zp-rte-toolbar">
        <select class="zp-rte-select" @change="format" value="">
          <option value="">Format</option>
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="blockquote">Blockquote</option>
        </select>
        <div class="zp-rte-sep" />
        <button type="button" class="zp-rte-btn" title="bold" @mousedown.prevent="exec('bold')"><span style="font-weight:700">B</span></button>
        <button type="button" class="zp-rte-btn" title="italic" @mousedown.prevent="exec('italic')"><span style="font-style:italic">I</span></button>
        <button type="button" class="zp-rte-btn" title="underline" @mousedown.prevent="exec('underline')"><span style="text-decoration:underline">U</span></button>
        <div class="zp-rte-sep" />
        <button type="button" class="zp-rte-btn" title="Bullet list" @mousedown.prevent="exec('insertUnorderedList')">• —</button>
        <button type="button" class="zp-rte-btn" title="Numbered list" @mousedown.prevent="exec('insertOrderedList')">1.</button>
        <div class="zp-rte-sep" />
        <button type="button" class="zp-rte-btn" :class="{ 'is-active': codeView }" title="Toggle HTML source" @click="toggleCode">
          <span style="font-size:8.5px;font-family:var(--zg-mono);font-weight:700">&lt;/&gt;</span>
        </button>
      </div>
      <textarea
        v-if="codeView"
        class="zp-rte-code"
        :dir="dir"
        :value="modelValue"
        placeholder="Raw HTML…"
        @input="emit('update:modelValue', $event.target.value)"
      />
      <div
        v-else
        ref="bodyRef"
        class="zp-rte-body"
        :dir="dir"
        contenteditable
        :data-placeholder="placeholder"
        :style="{ textAlign: dir==='rtl'?'right':'left' }"
        @input="sync"
        @blur="sync"
      />
    </template>
  </div>
</template>
