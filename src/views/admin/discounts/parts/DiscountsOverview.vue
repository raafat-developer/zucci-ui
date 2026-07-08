<script setup>
/**
 * DiscountsOverview — market overview tab. Faithful port of
 * DiscountsOverview from zucci-discounts.jsx: alerts, KPI strip, active +
 * scheduled promo lists.
 */
import { ref, computed } from 'vue';
import PromoDetailDrawer from './PromoDetailDrawer.vue';
import StatusBadge from './StatusBadge.vue';
import FundingTag from './FundingTag.vue';
import { ZCD_ZUCCI_PROMOS, ZCD_VENDOR_PROMOS, ZCD_PAYMENT_DEALS, ZCD_CAMPAIGNS, DISCOUNT_TYPES, MARKET_CUR } from '@/data/discountsData';
import { MKT_FLAGS, MKT_NAMES } from '@/data/discountsShared';

const props = defineProps({ market: { type: String, required: true } });
const selPromo = ref(null);

const mktPromos = computed(() => ZCD_ZUCCI_PROMOS[props.market] || []);
const active = computed(() => mktPromos.value.filter((p) => p.status === 'active'));
const scheduled = computed(() => mktPromos.value.filter((p) => p.status === 'scheduled'));
const vendorPend = computed(() => ZCD_VENDOR_PROMOS.filter((p) => p.market === props.market && p.status === 'pending_approval'));
const payDeals = computed(() => ZCD_PAYMENT_DEALS.filter((p) => p.market === props.market && p.status === 'active'));
const campaigns = computed(() => ZCD_CAMPAIGNS.filter((c) => c.markets[props.market]));
const cur = computed(() => MARKET_CUR[props.market] || 'AED');
const expiringSoon = computed(() => mktPromos.value.filter((p) => { const d = new Date(p.endDate); const diff = (d - new Date()) / 86400000; return diff >= 0 && diff <= 7; }));

const totalGiven = computed(() => [...mktPromos.value, ...ZCD_VENDOR_PROMOS.filter((p) => p.market === props.market && p.status === 'approved')].reduce((s, p) => s + (p.totalDiscountGiven || 0), 0));
const totalRev = computed(() => [...mktPromos.value, ...ZCD_VENDOR_PROMOS.filter((p) => p.market === props.market && p.status === 'approved')].reduce((s, p) => s + (p.revenueGenerated || 0), 0));

const kpis = computed(() => [
  ['Active Promotions', active.value.length, ''],
  ['Scheduled', scheduled.value.length, ''],
  ['Pending Approval', vendorPend.value.length, vendorPend.value.length ? 'is-warn' : ''],
  ['Payment Deals', payDeals.value.length, ''],
  ['Active Campaigns', campaigns.value.filter((c) => c.status === 'active').length, ''],
  [`Total Discount Given (${cur.value})`, totalGiven.value.toLocaleString(), 'is-neg'],
  [`Revenue from Promos (${cur.value})`, totalRev.value.toLocaleString(), 'is-good'],
]);
const discountTypes = DISCOUNT_TYPES;
</script>

<template>
  <div class="zcd-tab-body">
    <div v-if="vendorPend.length" class="zf-alert zf-alert--warn">
      <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="5.5" /><line x1="7" y1="4.5" x2="7" y2="7.5" /><circle cx="7" cy="9.5" r="0.5" fill="currentColor" /></svg>
      {{ vendorPend.length }} vendor promotion{{ vendorPend.length !== 1 ? 's' : '' }} pending your approval in {{ MKT_NAMES[market] }}.
    </div>
    <div v-if="expiringSoon.length" class="zf-alert zf-alert--warn">{{ expiringSoon.length }} promotion(s) expiring within 7 days.</div>

    <div class="zf-section-title">{{ MKT_FLAGS[market] }} {{ MKT_NAMES[market] }} · Active Overview</div>
    <div class="zf-kpi-strip">
      <div v-for="[l, v, cls] in kpis" :key="l" class="zf-kpi-cell"><div class="zf-kpi-lbl">{{ l }}</div><div class="zf-kpi-val" :class="cls">{{ v }}</div></div>
    </div>

    <template v-if="active.length">
      <div class="zf-section-title">Active Promotions</div>
      <div v-for="p in active" :key="p.id" class="zcd-promo-row" @click="selPromo = p">
        <div class="zcd-promo-main">
          <div class="zcd-promo-name">{{ p.name }}</div>
          <div class="zcd-promo-meta">
            <span>{{ discountTypes[p.type] }}</span>
            <span class="zcd-promo-value">{{ p.value }}{{ p.type === 'percentage' ? '%' : ` ${p.currency}` }} off</span>
            <code v-if="p.code" class="zcd-code-pill">{{ p.code }}</code>
            <FundingTag :model="p.fundedBy" />
          </div>
        </div>
        <div class="zcd-promo-stats">
          <div><div class="zf-kpi-lbl">Used</div><div class="zcd-stat-val">{{ p.usageCount.toLocaleString() }}</div></div>
          <div><div class="zf-kpi-lbl">Discount given</div><div class="zcd-stat-val is-neg">{{ p.currency }} {{ p.totalDiscountGiven.toLocaleString() }}</div></div>
          <div><div class="zf-kpi-lbl">Expiry</div><div class="zcd-stat-val">{{ p.endDate }}</div></div>
        </div>
        <StatusBadge :status="p.status" />
      </div>
    </template>

    <template v-if="scheduled.length">
      <div class="zf-section-title">Scheduled</div>
      <div v-for="p in scheduled" :key="p.id" class="zcd-promo-row" @click="selPromo = p">
        <div class="zcd-promo-main">
          <div class="zcd-promo-name">{{ p.name }}</div>
          <div class="zcd-promo-meta">
            <span>{{ discountTypes[p.type] }}</span>
            <span class="zcd-promo-value">{{ p.value }}{{ p.type === 'percentage' ? '%' : ` ${p.currency}` }} off</span>
            <span v-if="p.startTime" class="zcd-time-pill">{{ p.startDate }} {{ p.startTime }}</span>
          </div>
        </div>
        <StatusBadge :status="p.status" />
      </div>
    </template>

    <PromoDetailDrawer :promo="selPromo" :open="!!selPromo" @close="selPromo = null" />
  </div>
</template>
