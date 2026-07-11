<script setup>
/**
 * LiveDetailsForm — editable product-details grid (category, size guide,
 * care, return policy, shipping weight+unit, HS code, country of origin,
 * fulfilment, tags, auto SKU). Ported from the React LiveDetailsForm.
 *
 * Care Instructions and Size Guide selects have a trailing "Add New…"
 * sentinel option. When chosen, the matching ZDrawer slides in, POSTs to
 * the API, refreshes the lookup, and auto-selects the new item.
 */
import { ref, computed } from 'vue';
import ZSearchableSelect from '@/components/ui/ZSearchableSelect.vue';
import HierCategorySelect from './HierCategorySelect.vue';
import AddCareInstructionDrawer from './AddCareInstructionDrawer.vue';
import AddSizeGuideDrawer from './AddSizeGuideDrawer.vue';
import { SHIPPING_UNITS, FULFILLMENT_OPTIONS, COUNTRY_FLAGS, inferCountry } from '@/data/productsMeta';
import { ZCP_CATEGORY_CODES } from '@/data/productsData';
import { useLookup } from '@/composables/useLookup';

const props = defineProps({ product: { type: Object, required: true } });
const emit = defineEmits(['update']);
const upd = (k, v) => emit('update', k, v);

const lookup = useLookup();

// ─── Sentinel value that triggers drawer open ────────────────
const ADD_CARE_SENTINEL = '__add_care__';
const ADD_SIZE_SENTINEL = '__add_size__';

// ─── Drawer open states ──────────────────────────────────────
const addCareOpen = ref(false);
const addSizeOpen = ref(false);

// ── Size Guides from API: /catalog/size-guides ───────────────
const sizeGuideOptions = computed(() => [
  { value: '', label: 'None (no size guide)' },
  ...lookup.get('sizeGuides').map((s) => ({
    value: s.id,
    label: s.name || s.translations?.[0]?.name || s.slug || s.id,
  })),
  // ─ sentinel: always last ─
  { value: ADD_SIZE_SENTINEL, label: '＋ Add New Size Guide', _isAction: true },
]);

// ── Care Instructions from API: /catalog/care-instructions ───
const careOptions = computed(() => [
  { value: '', label: 'None' },
  ...lookup.get('careInstructions').map((c) => ({
    value: c.id,
    label: c.name || c.translations?.[0]?.name || c.slug || c.id,
  })),
  // ─ sentinel: always last ─
  { value: ADD_CARE_SENTINEL, label: '＋ Add New Care Instruction', _isAction: true },
]);

// ── Return Policy from enum: return_policy ────────────────
const returnOpts = computed(() => {
  const enums = lookup.getEnum('return_policy');
  if (enums && enums.length) {
    return enums
      .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
      .map((e) => ({ value: e.id, label: e.label || e.name }));
  }
  return [
    { value: 1, label: 'Standard (14 days)' },
    { value: 2, label: 'Extended (21 days)' },
    { value: 3, label: 'Non-returnable' },
  ];
});

const shipUnits   = SHIPPING_UNITS;
const fulfillOpts = FULFILLMENT_OPTIONS;

const country     = computed(() => inferCountry(props.product.vendorId || props.product.brandCode));
const countryFlag = computed(() => COUNTRY_FLAGS[country.value] || '🌍');
const autoSku     = computed(() => {
  const p = props.product;
  if (p.sku) return p.sku;
  if (p.category && p.brandCode) return (ZCP_CATEGORY_CODES[p.category] || 'GEN') + '-' + p.brandCode + '-SC25-AUTO';
  return 'Auto-generated on save';
});

// ── Select handlers ───────────────────────────────────────────
function onSizeGuide(v) {
  if (v === ADD_SIZE_SENTINEL) {
    addSizeOpen.value = true;
    return;
  }
  upd('sizeGuideId', v);
}

function onCare(v) {
  if (v === ADD_CARE_SENTINEL) {
    addCareOpen.value = true;
    return;
  }
  upd('careInstructionId', v);
}

// ── Drawer "created" callbacks — refetch then auto-select ─────
/**
 * The API response may vary; we try .id, then fall back to searching
 * the refreshed lookup list by code/name from the response object.
 */
function resolveId(res, list) {
  if (res?.id) return res.id;
  if (res?.data?.id) return res.data.id;
  // Fallback: pick last item in the refreshed list (most recently added)
  return list.length ? list[list.length - 1].id : null;
}

async function onCareCreated(res) {
  // lookup already refreshed inside the drawer; pick the new id
  const list = lookup.get('careInstructions');
  const id   = resolveId(res, list);
  if (id) upd('careInstructionId', id);
}

async function onSizeCreated(res) {
  const list = lookup.get('sizeGuides');
  const id   = resolveId(res, list);
  if (id) upd('sizeGuideId', id);
}

// ── Tags ──────────────────────────────────────────────────────
const addTag = (e) => {
  const v = e.target.value.trim();
  if (v) { upd('tags', [...(props.product.tags || []), v]); e.target.value = ''; }
};
const removeTag = (t) => upd('tags', (props.product.tags || []).filter((x) => x !== t));
</script>

<template>
  <div class="zp-details-grid">
    <div class="zf-props-field">
      <label class="zf-props-label">Category</label>
      <HierCategorySelect :model-value="product.category" @update:model-value="(v) => upd('category', v)" />
    </div>

    <!-- Size Guide select with "Add New" sentinel at end -->
    <div class="zf-props-field">
      <label class="zf-props-label">Size Guide</label>
      <ZSearchableSelect
        :model-value="product.sizeGuideId"
        :options="sizeGuideOptions"
        placeholder="Select size guide…"
        @update:model-value="onSizeGuide"
      />
    </div>

    <!-- Care Instructions select with "Add New" sentinel at end -->
    <div class="zf-props-field">
      <label class="zf-props-label">Care Instructions</label>
      <ZSearchableSelect
        :model-value="product.careInstructionId"
        :options="careOptions"
        placeholder="Select care instructions…"
        @update:model-value="onCare"
      />
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

  <!-- ── Add Care Instruction Drawer ──────────────────────── -->
  <AddCareInstructionDrawer
    :open="addCareOpen"
    @close="addCareOpen = false"
    @created="onCareCreated"
  />

  <!-- ── Add Size Guide Drawer ────────────────────────────── -->
  <AddSizeGuideDrawer
    :open="addSizeOpen"
    @close="addSizeOpen = false"
    @created="onSizeCreated"
  />
</template>
