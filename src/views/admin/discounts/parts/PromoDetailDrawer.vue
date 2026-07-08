<script setup>
/**
 * PromoDetailDrawer — view/edit an existing promotion with performance KPIs.
 * Faithful port of PromoDetailDrawer from zucci-discounts.jsx.
 */
import { ref, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import FundingTag from './FundingTag.vue';
import { DISCOUNT_TYPES, MARKET_CUR } from '@/data/discountsData';
import { STATUS_META, MKT_FLAGS, MKT_NAMES } from '@/data/discountsShared';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false }, promo: { type: Object, default: null } });
const emit = defineEmits(['close']);

const last = ref(props.promo);
watch(() => props.promo?.id, () => { if (props.promo) last.value = props.promo; });
const p = computed(() => last.value);
const cur = computed(() => (p.value ? MARKET_CUR[p.value.market] || 'AED' : 'AED'));
const s = computed(() => STATUS_META[p.value?.status] || { label: p.value?.status || '—', color:'var(--zg-text-dim)', bg:'var(--zg-panel-hi)' });
const roi = computed(() => (p.value?.totalDiscountGiven > 0 ? (p.value.revenueGenerated / p.value.totalDiscountGiven).toFixed(1) + 'x' : '—'));
const kpis = computed(() => !p.value ? [] : [
  { lbl:'Times Used', val:(p.value.usageCount || 0).toLocaleString() },
  { lbl:'Discount Given', val:`${cur.value} ${(p.value.totalDiscountGiven || 0).toLocaleString()}`, cls:'is-neg' },
  { lbl:'Revenue Generated', val:`${cur.value} ${(p.value.revenueGenerated || 0).toLocaleString()}`, cls:'is-good' },
  { lbl:'Discount Value', val:`${p.value.value}${p.value.type === 'percentage' ? '%' : ' ' + cur.value}` },
  { lbl:'ROI', val: roi.value, cls:'is-good' },
]);
const togglePause = () => toast.info(p.value.status === 'active' ? 'Promotion paused' : 'Promotion reactivated');
const save = () => { toast.success('Changes saved'); emit('close'); };
const discountTypes = DISCOUNT_TYPES;
</script>

<template>
  <ZDrawer v-if="p" :open="open" :title="p.name" :subtitle="`${MKT_FLAGS[p.market] || ''} ${MKT_NAMES[p.market] || p.market} · ${discountTypes[p.type] || p.type}`" :width="620" @close="emit('close')">
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;align-items:center;gap:8px;padding:9px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);flex-wrap:wrap">
        <span class="zcd-badge" :style="{ background: s.bg, color: s.color }">{{ s.label }}</span>
        <code v-if="p.code" class="zcd-code-pill">{{ p.code }}</code>
        <span v-if="p.autoApply" class="zcd-auto-pill">Auto</span>
        <FundingTag :model="p.fundedBy" />
        <span v-if="p.startDate || p.endDate" style="margin-left:auto;font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim)">{{ p.startDate || '—' }} → {{ p.endDate || '—' }}</span>
      </div>

      <div class="zf-kpi-strip">
        <div v-for="k in kpis" :key="k.lbl" class="zf-kpi-cell"><div class="zf-kpi-lbl">{{ k.lbl }}</div><div class="zf-kpi-val" :class="k.cls">{{ k.val }}</div></div>
      </div>

      <div class="zcd-form-grid">
        <div class="zf-props-field" style="grid-column:1/-1"><label class="zf-props-label">Promotion Name</label><input class="zp-field-h" style="width:100%;box-sizing:border-box" :value="p.name" /></div>
        <div class="zf-props-field"><label class="zf-props-label">Discount Type</label><select class="zp-field-h" style="width:100%" :value="p.type"><option v-for="[k, v] in Object.entries(discountTypes)" :key="k" :value="k">{{ v }}</option></select></div>
        <div class="zf-props-field"><label class="zf-props-label">Value</label><input type="number" class="zp-field-h" style="width:100%;box-sizing:border-box" :value="p.value" /></div>
        <div class="zf-props-field"><label class="zf-props-label">Start Date</label><input type="date" class="zp-field-h" style="width:100%;box-sizing:border-box" :value="p.startDate || ''" /></div>
        <div class="zf-props-field"><label class="zf-props-label">End Date</label><input type="date" class="zp-field-h" style="width:100%;box-sizing:border-box" :value="p.endDate || ''" /></div>
        <div class="zf-props-field"><label class="zf-props-label">Discount Code</label><input class="zp-field-h" style="width:100%;box-sizing:border-box;font-family:var(--zg-mono);letter-spacing:0.08em" :value="p.code || ''" placeholder="Leave blank for auto-apply" /></div>
        <div class="zf-props-field"><label class="zf-props-label">Min. Order Value ({{ cur }})</label><input type="number" class="zp-field-h" style="width:100%;box-sizing:border-box" :value="p.minOrderValue || 0" /></div>
        <div class="zf-props-field" style="grid-column:1/-1"><label class="zf-props-label">Internal Notes</label><textarea class="zp-seo-textarea" rows="2" :value="p.notes || ''" placeholder="Internal notes…" /></div>
      </div>
    </div>
    <template #footer>
      <button class="zen-btn-ghost" @click="emit('close')">Close</button>
      <button class="zen-btn-ghost" @click="togglePause">{{ p.status === 'active' ? 'Pause' : 'Reactivate' }}</button>
      <button class="zen-btn-primary" @click="save">Save</button>
    </template>
  </ZDrawer>
</template>
