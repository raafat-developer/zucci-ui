<script setup>
/**
 * PromoFormDrawer — faithful port of EnhancedPromoFormDrawer from
 * zucci-discounts-extra.jsx: multi-market selector, name/code (auto-gen),
 * type/value, auto-apply vs code, dates, applies-to, min order, funded-by
 * (+ split slider), stackable, suggest-to-vendor mode, internal notes.
 */
import { ref, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { DISCOUNT_TYPES } from '@/data/discountsData';
import { toast } from '@/composables/useToast';

const ALL_MKT_LIST = [
  { code:'AE', name:'UAE', currency:'AED', flag:'🇦🇪' },
  { code:'SA', name:'KSA', currency:'SAR', flag:'🇸🇦' },
  { code:'EG', name:'Egypt', currency:'EGP', flag:'🇪🇬' },
  { code:'QA', name:'Qatar', currency:'QAR', flag:'🇶🇦' },
];
function generateCode(name) {
  const words = (name || 'PROMO').toUpperCase().replace(/[^A-Z0-9 ]/g, '').split(' ').filter(Boolean);
  const prefix = words.map((w) => w.slice(0, 3)).join('').slice(0, 8);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + suffix;
}

const props = defineProps({ open: { type: Boolean, default: false }, promo: { type: Object, default: null }, mode: { type: String, default: '' } });
const emit = defineEmits(['close']);

const isNew = computed(() => !props.promo);
const name = ref(''); const code = ref(''); const type = ref('percentage'); const value = ref(10);
const fundedBy = ref('zucci_100'); const zPct = ref(50);
const selMarkets = ref(['AE']); const appliesTo = ref('all');
const autoApply = ref(true); const stackable = ref(false); const minOrder = ref(0);
const notes = ref(''); const startDate = ref(''); const endDate = ref('');

watch(() => [props.open, props.promo?.id], () => {
  if (!props.open) return;
  const p = props.promo;
  name.value = p?.name || ''; code.value = p?.code || ''; type.value = p?.type || 'percentage'; value.value = p?.value || 10;
  fundedBy.value = p?.fundedBy || 'zucci_100'; zPct.value = p?.zucciFundPct ?? 50;
  selMarkets.value = p ? [p.market] : ['AE']; appliesTo.value = p?.appliesTo || 'all';
  autoApply.value = p?.autoApply ?? true; stackable.value = p?.stackable ?? false; minOrder.value = p?.minOrderValue ?? 0;
  notes.value = p?.notes || ''; startDate.value = p?.startDate || ''; endDate.value = p?.endDate || '';
});
watch(name, (n) => { if (isNew.value && n && !code.value) code.value = generateCode(n); });

const title = computed(() => (props.mode === 'suggest' ? 'Suggest Promotion to Vendor' : props.mode === 'targeted' ? 'New Targeted Rule' : isNew.value ? 'New Promotion' : 'Edit Promotion'));
const subtitle = computed(() => selMarkets.value.map((m) => `${ALL_MKT_LIST.find((x) => x.code === m)?.flag} ${m}`).join(' · '));
const toggleMarket = (c) => { selMarkets.value = selMarkets.value.includes(c) ? selMarkets.value.filter((m) => m !== c) : [...selMarkets.value, c]; };
const vPct = computed(() => 100 - zPct.value);
const ctaLabel = computed(() => (selMarkets.value.length > 1 ? `Create for ${selMarkets.value.length} Markets` : isNew.value ? 'Create' : 'Save'));
const save = () => {
  toast.success(selMarkets.value.length > 1 ? `Promotion created for ${selMarkets.value.length} markets` : isNew.value ? 'Promotion created' : 'Promotion saved');
  emit('close');
};
const discountTypes = DISCOUNT_TYPES;
const mkts = ALL_MKT_LIST;
</script>

<template>
  <ZDrawer :open="open" :title="title" :subtitle="subtitle" :width="620" @close="emit('close')">
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="zf-props-field">
        <label class="zf-props-label">Markets (creates a separate promotion record per market)</label>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <label v-for="m in mkts" :key="m.code" class="zcd-mkt-check" :class="{ 'is-on': selMarkets.includes(m.code) }" @click="toggleMarket(m.code)">
            <input type="checkbox" :checked="selMarkets.includes(m.code)" style="display:none" />
            {{ m.flag }} {{ m.name }} <span style="font-family:var(--zg-mono);font-size:9.5px;opacity:0.7">{{ m.currency }}</span>
          </label>
        </div>
        <div v-if="selMarkets.length > 1" class="zf-alert" style="background:oklch(0.82 0.14 215 / 0.07);border-color:oklch(0.82 0.14 215 / 0.2);color:var(--zg-text-mid);padding:7px 10px;font-size:11.5px">
          This will create {{ selMarkets.length }} separate promotion records. Min. order values and currency are applied per market using default thresholds.
        </div>
      </div>

      <div class="zcd-form-grid">
        <div class="zf-props-field" style="grid-column:1/-1"><label class="zf-props-label">Promotion Name</label><input class="zp-field-h" style="width:100%;box-sizing:border-box" v-model="name" placeholder="e.g. Summer Sale 2025" /></div>
        <div class="zf-props-field"><label class="zf-props-label">Discount Type</label><select class="zp-field-h" style="width:100%" v-model="type"><option v-for="[k, v] in Object.entries(discountTypes)" :key="k" :value="k">{{ v }}</option></select></div>
        <div class="zf-props-field">
          <label class="zf-props-label">Value</label>
          <div style="display:flex;gap:4px">
            <input type="number" class="zp-field-h" style="flex:1" v-model.number="value" min="1" :max="type === 'percentage' ? 100 : 9999" />
            <div style="width:60px;flex-shrink:0;font-family:var(--zg-mono);font-size:11px;display:flex;align-items:center;justify-content:center;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:6px;color:var(--zg-accent);font-weight:700">{{ type === 'percentage' ? '%' : 'VAL' }}</div>
          </div>
        </div>
        <div class="zf-props-field">
          <label class="zf-props-label" style="display:flex;align-items:center;justify-content:space-between">Discount Code<button type="button" style="background:none;border:none;cursor:pointer;color:var(--zg-accent);font-size:10px;font-family:var(--zg-mono);font-weight:600" @click="code = generateCode(name)">Regenerate</button></label>
          <input class="zp-field-h" style="width:100%;box-sizing:border-box;font-family:var(--zg-mono);letter-spacing:0.08em;text-transform:uppercase" :value="code" @input="code = $event.target.value.toUpperCase()" placeholder="Auto-generated" />
        </div>
        <div class="zf-props-field">
          <label class="zf-props-label">Application Method</label>
          <div style="display:flex;gap:6px">
            <label class="zcd-toggle-btn" :class="{ 'is-on': autoApply }" @click="autoApply = true">Auto-apply</label>
            <label class="zcd-toggle-btn" :class="{ 'is-on': !autoApply }" @click="autoApply = false">Code required</label>
          </div>
        </div>
        <div class="zf-props-field"><label class="zf-props-label">Start Date</label><input type="date" class="zp-field-h" style="width:100%;box-sizing:border-box" v-model="startDate" /></div>
        <div class="zf-props-field"><label class="zf-props-label">End Date</label><input type="date" class="zp-field-h" style="width:100%;box-sizing:border-box" v-model="endDate" /></div>
        <div class="zf-props-field">
          <label class="zf-props-label">Applies To</label>
          <select class="zp-field-h" style="width:100%" v-model="appliesTo">
            <option value="all">All Products</option><option value="category">Specific Categories</option><option value="brand">Specific Brands</option>
            <option value="new_customers">New Customers Only</option><option value="loyalty_tier">Loyalty Tier</option><option value="app_only">App Users Only</option>
          </select>
        </div>
        <div class="zf-props-field">
          <label class="zf-props-label">Min. Order Value</label>
          <input type="number" class="zp-field-h" style="width:100%;box-sizing:border-box" v-model.number="minOrder" min="0" />
          <div v-if="selMarkets.length > 1" style="font-size:10px;color:var(--zg-text-dim);margin-top:2px">Applied per-market using local currency threshold</div>
        </div>
        <div class="zf-props-field" style="grid-column:1/-1">
          <label class="zf-props-label">Funded By</label>
          <div style="display:flex;gap:6px;margin-bottom:8px">
            <label v-for="[v, l] in [['zucci_100','Zucci 100%'],['vendor_100','Vendor 100%'],['split','Split (custom %)'],['partner_100','Partner 100%']]" :key="v" class="zcd-toggle-btn" :class="{ 'is-on': fundedBy === v }" @click="fundedBy = v">{{ l }}</label>
          </div>
          <div v-if="fundedBy === 'split'" class="zcd-split-slider">
            <div class="zcd-split-labels"><span style="color:var(--zg-accent);font-weight:700">Zucci {{ zPct }}%</span><span style="color:var(--zg-text-dim)">|</span><span style="color:oklch(0.72 0.15 290);font-weight:700">Vendor {{ vPct }}%</span></div>
            <input type="range" min="0" max="100" v-model.number="zPct" class="zcd-range" />
            <div class="zcd-split-bar"><div class="zcd-split-fill-zucci" :style="{ width: zPct + '%' }" /><div class="zcd-split-fill-vendor" :style="{ width: vPct + '%' }" /></div>
          </div>
        </div>
        <div class="zf-props-field">
          <label class="zf-props-label">Stack with other promotions?</label>
          <div style="display:flex;gap:6px">
            <label class="zcd-toggle-btn" :class="{ 'is-on': !stackable }" @click="stackable = false">Exclusive</label>
            <label class="zcd-toggle-btn" :class="{ 'is-on': stackable }" @click="stackable = true">Stackable</label>
          </div>
        </div>
        <div v-if="mode === 'suggest'" class="zf-props-field">
          <label class="zf-props-label">Suggest to Vendor</label>
          <select class="zp-field-h" style="width:100%">
            <option>24K Fashion House — Le Maillot, Burgandy</option><option>7 Wonders Trading — 7 Wonders</option>
            <option>Aurora Fashion SA — Aurora Fashion</option><option>Almaz Couture LLC — Almaz Couture</option>
          </select>
        </div>
        <div class="zf-props-field" style="grid-column:1/-1"><label class="zf-props-label">Internal Notes</label><textarea class="zp-seo-textarea" rows="2" v-model="notes" placeholder="Internal notes (not shown to customers or vendors)" /></div>
      </div>
    </div>
    <template #footer>
      <button class="zen-btn-ghost" @click="emit('close')">Cancel</button>
      <button class="zen-btn-primary" @click="save">{{ ctaLabel }}</button>
    </template>
  </ZDrawer>
</template>
