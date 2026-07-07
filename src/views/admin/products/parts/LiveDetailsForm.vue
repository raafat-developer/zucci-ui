<script setup>
/**
 * LiveDetailsForm — the editable product-details grid (category, size guide,
 * care, return policy, shipping weight+unit, HS code, country of origin,
 * fulfilment, tags, auto SKU). Ported from the React LiveDetailsForm.
 */
import { computed } from 'vue';
import ZSearchableSelect from '@/components/ui/ZSearchableSelect.vue';
import HierCategorySelect from './HierCategorySelect.vue';
import {
  RETURN_OPTIONS, SHIPPING_UNITS, FULFILLMENT_OPTIONS, COUNTRY_FLAGS, inferCountry,
} from '@/data/productsMeta';
import { ZCP_SIZE_GUIDES, ZCP_CARE_INSTRUCTIONS, ZCP_CATEGORY_CODES } from '@/data/productsData';

const props = defineProps({ product: { type: Object, required: true } });
const emit = defineEmits(['update']);
const upd = (k, v) => emit('update', k, v);

const sizeGuideOptions = [
  { value: '', label: 'None (no size guide)' },
  ...ZCP_SIZE_GUIDES.filter((s) => s && s.id && s.name).map((s) => ({ value: s.id, label: s.name })),
  { value: '__new_sg__', label: '+ Add new size guide for this brand' },
];
const careOptions = [
  { value: '', label: 'None' },
  ...ZCP_CARE_INSTRUCTIONS.map((c) => ({ value: c.id, label: c.name })),
  { value: '__new_ci__', label: '+ Add new care instructions' },
];

const country = computed(() => inferCountry(props.product.vendorId || props.product.brandCode));
const countryFlag = computed(() => COUNTRY_FLAGS[country.value] || '🌍');
const autoSku = computed(() => {
  const p = props.product;
  if (p.sku) return p.sku;
  if (p.category && p.brandCode) return (ZCP_CATEGORY_CODES[p.category] || 'GEN') + '-' + p.brandCode + '-SC25-AUTO';
  return 'Auto-generated on save';
});

const onSizeGuide = (v) => { if (v === '__new_sg__') return; upd('sizeGuideId', v); };
const onCare = (v) => { if (v === '__new_ci__') return; upd('careInstructionId', v); };
const addTag = (e) => {
  const v = e.target.value.trim();
  if (v) { upd('tags', [...(props.product.tags || []), v]); e.target.value = ''; }
};
const removeTag = (t) => upd('tags', (props.product.tags || []).filter((x) => x !== t));
const returnOpts = RETURN_OPTIONS;
const shipUnits = SHIPPING_UNITS;
const fulfillOpts = FULFILLMENT_OPTIONS;
</script>

<template>
  <div class="zp-details-grid">
    <div class="zf-props-field">
      <label class="zf-props-label">Category</label>
      <HierCategorySelect :model-value="product.category" @update:model-value="(v) => upd('category', v)" />
    </div>
    <div class="zf-props-field">
      <label class="zf-props-label">Size Guide</label>
      <ZSearchableSelect :model-value="product.sizeGuideId" :options="sizeGuideOptions" placeholder="Select size guide…" @update:model-value="onSizeGuide" />
    </div>
    <div class="zf-props-field">
      <label class="zf-props-label">Care Instructions</label>
      <ZSearchableSelect :model-value="product.careInstructionId" :options="careOptions" placeholder="Select care instructions…" @update:model-value="onCare" />
    </div>
    <div class="zf-props-field">
      <label class="zf-props-label">Return Policy</label>
      <ZSearchableSelect :model-value="product.returnPolicy || 'standard'" :options="returnOpts" placeholder="Select…" @update:model-value="(v) => upd('returnPolicy', v)" />
      <input v-if="product.returnPolicy === 'non_returnable'" class="zp-field-h" style="margin-top:4px;width:100%;box-sizing:border-box;font-size:11px" :value="product.nonReturnableReason || ''" placeholder="Reason shown to customer (e.g. Swimwear — hygiene policy)" @input="upd('nonReturnableReason', $event.target.value)" />
    </div>
    <div class="zf-props-field">
      <label class="zf-props-label">Shipping Weight</label>
      <div style="display:flex;gap:4px">
        <input type="number" class="zp-field-h" style="flex:1;min-width:0" :value="product.shippingWeight || 0" @input="upd('shippingWeight', parseFloat($event.target.value) || 0)" />
        <div style="width:80px;flex-shrink:0">
          <ZSearchableSelect :model-value="product.shippingUnit || 'kg'" :options="shipUnits" @update:model-value="(v) => upd('shippingUnit', v)" />
        </div>
      </div>
    </div>
    <div class="zf-props-field">
      <label class="zf-props-label" style="display:flex;align-items:center;gap:6px">
        HS Code
        <span class="zp-tooltip" title="Harmonized System Code — international 6-digit code used for customs declarations">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="7" cy="7" r="5.5" /><line x1="7" y1="5" x2="7" y2="7.5" /><circle cx="7" cy="9.5" r="0.5" fill="currentColor" /></svg>
        </span>
      </label>
      <input class="zp-field-h" style="width:100%;box-sizing:border-box" :value="product.hsCode || ''" placeholder="e.g. 6203.42" @input="upd('hsCode', $event.target.value)" />
    </div>
    <div class="zf-props-field">
      <label class="zf-props-label">Country of Origin</label>
      <div style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);opacity:0.75;cursor:default;user-select:none">
        <span style="font-size:13px">{{ countryFlag }}</span>
        <span style="font-size:12.5px;color:var(--zg-text);font-weight:500">{{ country }}</span>
        <span style="margin-left:auto;font-size:10px;color:var(--zg-text-xdim);font-style:italic">from vendor registration</span>
      </div>
    </div>
    <div class="zf-props-field">
      <label class="zf-props-label">Fulfillment</label>
      <ZSearchableSelect :model-value="product.fulfillment || 'consignment'" :options="fulfillOpts" placeholder="Select…" @update:model-value="(v) => upd('fulfillment', v)" />
    </div>
    <div class="zf-props-field" style="grid-column:1/-1">
      <label class="zf-props-label">Tags</label>
      <div class="zp-tags-row">
        <span v-for="t in (product.tags || [])" :key="t" class="zen-brand-cat-tag" style="cursor:pointer" @click="removeTag(t)">{{ t }} ×</span>
        <input class="zp-tag-input" placeholder="Add tag + Enter" @keydown.enter="addTag" />
      </div>
    </div>
    <div class="zf-props-field" style="grid-column:1/-1">
      <label class="zf-props-label">Platform SKU (auto-generated)</label>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <code class="zen-field-mono" style="font-size:11px;padding:5px 10px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:5px">{{ autoSku }}</code>
        <span v-if="product.brandOriginalSku" class="zen-pd-ref">Brand SKU: <code style="font-family:var(--zg-mono);font-size:10.5px">{{ product.brandOriginalSku }}</code></span>
      </div>
    </div>
  </div>
</template>
