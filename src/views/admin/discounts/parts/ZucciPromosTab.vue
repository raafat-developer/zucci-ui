<script setup>
/**
 * ZucciPromosTab — Zucci-created promotions table. Faithful port of
 * ZucciPromosTab from zucci-discounts.jsx.
 */
import { ref, computed } from 'vue';
import PromoFormDrawer from './PromoFormDrawer.vue';
import PromoDetailDrawer from './PromoDetailDrawer.vue';
import StatusBadge from './StatusBadge.vue';
import FundingTag from './FundingTag.vue';
import { ZCD_ZUCCI_PROMOS, DISCOUNT_TYPES, MARKET_CUR } from '@/data/discountsData';
import { MKT_FLAGS, MKT_NAMES } from '@/data/discountsShared';
import { toast } from '@/composables/useToast';

const props = defineProps({ market: { type: String, required: true } });
const filter = ref('all');
const editPromo = ref(null);
const showNew = ref(false);
const suggestOpen = ref(false);
const detailPromo = ref(null);
const cur = computed(() => MARKET_CUR[props.market] || 'AED');

const all = computed(() => ZCD_ZUCCI_PROMOS[props.market] || []);
const filtered = computed(() => (filter.value === 'all' ? all.value : all.value.filter((p) => p.status === filter.value)));
const counts = computed(() => { const c = {}; all.value.forEach((p) => { c[p.status] = (c[p.status] || 0) + 1; }); return c; });
const discountTypes = DISCOUNT_TYPES;
const togglePause = (p) => toast.info(p.status === 'active' ? 'Promotion paused' : 'Promotion reactivated');
</script>

<template>
  <div class="zcd-tab-body">
    <div class="zf-section-title" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0">
      <span>{{ MKT_FLAGS[market] }} {{ MKT_NAMES[market] }} · Zucci-Created Promotions</span>
      <div style="display:flex;gap:6px">
        <button class="zen-btn-ghost" style="height:28px;font-size:11.5px" @click="suggestOpen = true">Suggest to Vendor</button>
        <button class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="showNew = true">+ New Promotion</button>
      </div>
    </div>

    <div class="zf-filter-row">
      <button v-for="s in ['all','active','scheduled','expired','paused']" :key="s" class="zen-filter-chip" :class="{ 'is-on': filter === s }" @click="filter = s">
        {{ s.charAt(0).toUpperCase() + s.slice(1) }}<span v-if="s !== 'all' && counts[s]" style="margin-left:4px;opacity:0.7">{{ counts[s] }}</span>
      </button>
    </div>

    <div v-if="!filtered.length" class="zcd-empty">No {{ filter === 'all' ? '' : filter }} promotions for {{ MKT_NAMES[market] }}.</div>
    <div v-else class="zcd-table">
      <div class="zcd-table-head"><span>Promotion</span><span>Type</span><span>Value</span><span>Duration</span><span>Funded By</span><span>Used</span><span>Discount Given</span><span>Status</span><span></span></div>
      <div v-for="p in filtered" :key="p.id" class="zcd-table-row" @click="detailPromo = p">
        <div><div class="zcd-promo-name">{{ p.name }}</div><code v-if="p.code" class="zcd-code-pill">{{ p.code }}</code><span v-if="p.autoApply" class="zcd-auto-pill">Auto</span></div>
        <span style="font-size:12px;color:var(--zg-text-mid)">{{ discountTypes[p.type] }}</span>
        <span style="font-family:var(--zg-mono);font-weight:700;color:var(--zg-accent);font-size:13px">{{ p.value }}{{ p.type === 'percentage' ? '%' : ` ${cur}` }}</span>
        <div><div style="font-size:11.5px;color:var(--zg-text-mid)">{{ p.startDate }}</div><div style="font-size:11px;color:var(--zg-text-dim)">→ {{ p.endDate }}</div></div>
        <FundingTag :model="p.fundedBy" />
        <span style="font-family:var(--zg-mono);font-size:12px">{{ p.usageCount.toLocaleString() }}</span>
        <span class="zf-amount is-neg" style="font-size:12px">{{ cur }} {{ p.totalDiscountGiven.toLocaleString() }}</span>
        <StatusBadge :status="p.status" />
        <div style="display:flex;gap:4px" @click.stop>
          <button class="zen-act-btn-sm" title="Edit" @click="editPromo = p"><svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M9.5 1.5L12.5 4.5L5 12H2V9L9.5 1.5Z" /></svg></button>
          <button class="zen-act-btn-sm" :title="p.status === 'active' ? 'Pause' : 'Activate'" @click="togglePause(p)">
            <svg v-if="p.status === 'active'" viewBox="0 0 12 12" width="10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="2" width="3" height="8" /><rect x="7" y="2" width="3" height="8" /></svg>
            <svg v-else viewBox="0 0 12 12" width="10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 2L10 6L2 10V2Z" /></svg>
          </button>
        </div>
      </div>
    </div>

    <PromoFormDrawer :open="!!editPromo || showNew" :promo="editPromo" @close="editPromo = null; showNew = false" />
    <PromoFormDrawer :open="suggestOpen" :promo="null" mode="suggest" @close="suggestOpen = false" />
    <PromoDetailDrawer :promo="detailPromo" :open="!!detailPromo" @close="detailPromo = null" />
  </div>
</template>
