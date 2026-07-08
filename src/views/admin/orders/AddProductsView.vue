<script setup>
/**
 * AddProductsView — sub-view inside the Return & Exchange drawer for adding
 * exchange items. Faithful port of AddProductsView from
 * zucci-return-refund.jsx: search, group header with select-all, per-variant
 * checkboxes with stock/price, sticky footer with count + Add/Cancel.
 */
import { ref, computed } from 'vue';

const emit = defineEmits(['cancel', 'add']);

const PRODUCT_VARIANTS = [
  { key:'xs-pc',  size:'XS', color:'Pina Colada', stock:23, price:299.99 },
  { key:'s-pc',   size:'S',  color:'Pina Colada', stock:23, price:299.99 },
  { key:'m-pc',   size:'M',  color:'Pina Colada', stock:23, price:299.99 },
  { key:'l-pc',   size:'L',  color:'Pina Colada', stock:23, price:299.99 },
  { key:'xl-blk', size:'XL', color:'Black',       stock:23, price:299.99 },
  { key:'xxl-pc', size:'XXL',color:'Pina Colada', stock:23, price:299.99 },
];

const selected = ref(new Set());
const query = ref('');

const filteredV = computed(() => PRODUCT_VARIANTS.filter((v) => !query.value || v.size.toLowerCase().includes(query.value.toLowerCase()) || v.color.toLowerCase().includes(query.value.toLowerCase())));
const allChecked = computed(() => filteredV.value.every((v) => selected.value.has(v.key)));

const toggle = (key) => { const s = new Set(selected.value); s.has(key) ? s.delete(key) : s.add(key); selected.value = s; };
const toggleAll = () => {
  const s = new Set(selected.value);
  if (allChecked.value) filteredV.value.forEach((v) => s.delete(v.key));
  else filteredV.value.forEach((v) => s.add(v.key));
  selected.value = s;
};
const doAdd = () => emit('add', [...selected.value].map((k) => PRODUCT_VARIANTS.find((v) => v.key === k)).filter(Boolean));
</script>

<template>
  <div class="zrr-addprod">
    <div class="zrr-addprod-head">
      <button class="zrr-back-btn" @click="emit('cancel')"><svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10 4L6 8L10 12" /></svg></button>
      <div><div class="zrr-addprod-title">Add products</div><div class="zrr-addprod-sub">#329929328239</div></div>
    </div>

    <div class="zrr-addprod-search">
      <svg viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4" /><line x1="10" y1="10" x2="14" y2="14" /></svg>
      <input v-model="query" placeholder="Search products…" />
    </div>

    <div class="zrr-addprod-list">
      <div class="zrr-prod-group">
        <div class="zrr-prod-group-head">
          <label class="zrr-prod-check-wrap"><input type="checkbox" :checked="allChecked" @change="toggleAll" /></label>
          <div class="zrr-prod-group-img" />
          <div class="zrr-prod-group-info"><div class="zrr-prod-group-brand">Urban Looms</div><div class="zrr-prod-group-name">Swim Leggings – Pina Colada</div></div>
        </div>
        <div class="zrr-prod-variants">
          <label v-for="v in filteredV" :key="v.key" class="zrr-prod-variant-row">
            <input type="checkbox" :checked="selected.has(v.key)" @change="toggle(v.key)" />
            <span class="zrr-variant-label">{{ v.size }} / {{ v.color }}</span>
            <span class="zrr-variant-stock">{{ v.stock }} available</span>
            <span class="zrr-variant-price">{{ v.price.toFixed(2) }} AED</span>
          </label>
        </div>
      </div>
    </div>

    <div class="zrr-addprod-footer">
      <span class="zrr-addprod-count">{{ selected.size }} product{{ selected.size !== 1 ? 's' : '' }} selected</span>
      <div style="display:flex;gap:8px">
        <button class="zcd-btn-secondary" @click="emit('cancel')">Cancel</button>
        <button class="zcd-btn-primary" :disabled="selected.size === 0" @click="doAdd">Add</button>
      </div>
    </div>
  </div>
</template>
