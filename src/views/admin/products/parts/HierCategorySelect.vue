<script setup>
/**
 * HierarchicalCategorySelect — Shopify-style drill-down category picker with
 * breadcrumb, search, back, and "+ Request new category". Ported from the
 * React component; outside-click close via useClickOutside.
 */
import { ref, computed } from 'vue';
import { CATEGORY_TREE } from '@/data/productsMeta';
import { useClickOutside } from '@/composables/useClickOutside';

const props = defineProps({ modelValue: { type: String, default: '' } });
const emit = defineEmits(['update:modelValue']);

const { isOpen, rootRef, close, toggle } = useClickOutside();
const path = ref([]);
const search = ref('');

const level = computed(() => {
  let l = CATEGORY_TREE;
  for (const p of path.value) l = (l && l[p]) || {};
  return l && typeof l === 'object' ? l : {};
});
const keys = computed(() => Object.keys(level.value));
const filtered = computed(() =>
  search.value ? keys.value.filter((k) => k.toLowerCase().includes(search.value.toLowerCase())) : keys.value,
);
const hasSub = (key) => {
  const sub = level.value[key];
  return sub && typeof sub === 'object' && Object.keys(sub).length > 0;
};
const select = (key) => {
  if (hasSub(key)) { path.value = [...path.value, key]; search.value = ''; }
  else { emit('update:modelValue', [...path.value, key].join(' > ')); reset(); close(); }
};
const reset = () => { path.value = []; search.value = ''; };
const openToggle = () => { toggle(); if (!isOpen.value) reset(); };
const requestNew = () => { emit('update:modelValue', ''); reset(); close(); };
</script>

<template>
  <div ref="rootRef" class="zp-cat-wrap" style="position:relative">
    <button type="button" class="zp-ss-trigger" @click="openToggle">
      <span :class="{ 'zp-ss-placeholder': !modelValue }" style="flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ modelValue || 'Select category…' }}</span>
      <svg viewBox="0 0 10 6" width="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0;margin-left:auto"><path d="M1 1L5 5L9 1" /></svg>
    </button>
    <div v-show="isOpen" class="zp-ss-dropdown zp-cat-dropdown">
      <div class="zp-cat-breadcrumb">
        <button type="button" class="zp-cat-bc-btn" @click="reset">All</button>
        <template v-for="(p, i) in path" :key="i">
          <span class="zp-cat-bc-sep">›</span>
          <button type="button" class="zp-cat-bc-btn" @click="path = path.slice(0, i + 1); search = ''">{{ p }}</button>
        </template>
      </div>
      <input class="zp-ss-search" v-model="search" placeholder="Search categories…" />
      <div style="overflow-y:auto;max-height:200px">
        <button v-if="path.length" type="button" class="zp-ss-opt zp-cat-back" @click="path = path.slice(0, -1); search = ''">← Back</button>
        <button
          v-for="key in filtered"
          :key="key"
          type="button"
          class="zp-ss-opt"
          :class="{ 'is-sel': modelValue === [...path, key].join(' > ') }"
          style="justify-content:space-between"
          @click="select(key)"
        >
          <span>{{ key }}</span>
          <span v-if="hasSub(key)" style="opacity:0.5;font-size:10px">›</span>
        </button>
        <button type="button" class="zp-ss-opt zp-ss-opt-special" @click="requestNew">+ Request new category</button>
      </div>
    </div>
  </div>
</template>
