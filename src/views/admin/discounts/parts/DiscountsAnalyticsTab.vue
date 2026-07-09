<script setup>
/**
 * DiscountsAnalyticsTab — promo analytics: KPI strip, monthly bar chart, top
 * promotions, discount code performance. Faithful port of DiscountsAnalytics
 * from zucci-discounts.jsx.
 */
import { computed } from 'vue';
import StatusBadge from './StatusBadge.vue';
import { ZCD_ZUCCI_PROMOS, ZCD_ANALYTICS, MARKET_CUR } from '@/data/discountsData';
import { MKT_FLAGS, MKT_NAMES } from '@/data/discountsShared';

const props = defineProps({ market: { type: String, required: true } });
const data = computed(() => (ZCD_ANALYTICS || {})[props.market] || {});
const all = computed(() => ZCD_ZUCCI_PROMOS[props.market] || []);
const cur = computed(() => MARKET_CUR[props.market] || 'AED');
const topPromos = computed(() => data.value.topPromos || all.value.filter((p) => p.usageCount > 0).sort((a, b) => b.usageCount - a.usageCount).slice(0, 5));
const monthly = computed(() => data.value.monthlyBreakdown || []);
const maxRev = computed(() => Math.max(...monthly.value.map((m) => m.revenue), 1));
const kpis = computed(() => [
  ['Total Promotions', data.value.totalPromos || all.value.length],
  ['Active', data.value.activePromos || all.value.filter((p) => p.status === 'active').length, 'is-good'],
  ['Codes Issued', data.value.totalCodesIssued || all.value.filter((p) => p.code).length],
  ['Codes Used', data.value.totalCodesUsed || 0],
  [`Total Discount (${cur.value})`, (data.value.totalDiscountGiven?.value || all.value.reduce((s, p) => s + (p.totalDiscountGiven || 0), 0)).toLocaleString(), 'is-neg'],
  [`Revenue via Promos (${cur.value})`, (data.value.totalRevenueFromPromos?.value || all.value.reduce((s, p) => s + (p.revenueGenerated || 0), 0)).toLocaleString(), 'is-good'],
  ['Avg Discount %', (data.value.avgDiscount || 0) + '%'],
]);
</script>

<template>
  <div class="zcd-tab-body">
    <div class="zf-section-title">{{ MKT_FLAGS[market] }} {{ MKT_NAMES[market] }} · Promotions Analytics</div>

    <div class="zf-kpi-strip">
      <div v-for="[l, v, cls] in kpis" :key="l" class="zf-kpi-cell"><div class="zf-kpi-lbl">{{ l }}</div><div class="zf-kpi-val" :class="cls">{{ v }}</div></div>
    </div>

    <template v-if="monthly.length">
      <div class="zf-section-title">Monthly Performance</div>
      <div class="zcd-bar-chart">
        <div v-for="(m, i) in monthly" :key="i" class="zcd-bar-col">
          <div class="zcd-bar-wrap">
            <div class="zcd-bar-rev" :style="{ height: (m.revenue / maxRev * 100) + '%' }" :title="`Revenue: ${cur} ${m.revenue.toLocaleString()}`" />
            <div class="zcd-bar-disc" :style="{ height: (m.discountGiven / maxRev * 100) + '%' }" :title="`Discount: ${cur} ${m.discountGiven.toLocaleString()}`" />
          </div>
          <div class="zcd-bar-label">{{ m.month.split(' ')[0] }}</div>
          <div class="zcd-bar-orders">{{ m.promoOrders.toLocaleString() }}</div>
        </div>
        <div class="zcd-bar-legend"><span><span class="zcd-bar-dot" style="background:var(--zg-good)" /> Revenue</span><span><span class="zcd-bar-dot" style="background:var(--zg-danger)" /> Discount Given</span></div>
      </div>
    </template>

    <div class="zf-section-title">Top Promotions by Usage</div>
    <div class="zcd-table">
      <div class="zcd-table-head" style="grid-template-columns:1fr 80px 120px 120px 80px"><span>Promotion</span><span>Used</span><span>Discount Given</span><span>Revenue</span><span>Conv. Rate</span></div>
      <div v-for="p in topPromos" :key="p.id" class="zcd-table-row" style="grid-template-columns:1fr 80px 120px 120px 80px">
        <div><div class="zcd-promo-name" style="font-size:12px">{{ p.name }}</div><div class="zen-pd-ref">{{ p.id }}</div></div>
        <span style="font-family:var(--zg-mono);font-size:12px">{{ (p.usageCount || 0).toLocaleString() }}</span>
        <span class="zf-amount is-neg">{{ cur }} {{ (p.discountGiven || p.totalDiscountGiven || 0).toLocaleString() }}</span>
        <span class="zf-amount is-good">{{ cur }} {{ (p.revenue || p.revenueGenerated || 0).toLocaleString() }}</span>
        <span :style="{ fontFamily:'var(--zg-mono)', fontSize:'11.5px', color: (p.conversionRate || 0) >= 10 ? 'var(--zg-good)' : 'var(--zg-text-mid)' }">{{ p.conversionRate || 0 }}%</span>
      </div>
      <div v-if="!topPromos.length" class="zcd-empty">No usage data yet.</div>
    </div>

    <div class="zf-section-title">Discount Code Performance</div>
    <div class="zcd-table">
      <div class="zcd-table-head" style="grid-template-columns:130px 1fr 70px 70px 100px 100px 90px"><span>Code</span><span>Promotion</span><span>Issued</span><span>Used</span><span>Use Rate</span><span>Discount Given</span><span>Status</span></div>
      <div v-for="p in all.filter((p) => p.code).slice(0, 20)" :key="p.id" class="zcd-table-row" style="grid-template-columns:130px 1fr 70px 70px 100px 100px 90px">
        <code class="zcd-code-pill">{{ p.code }}</code>
        <span style="font-size:11.5px;color:var(--zg-text-mid)">{{ p.name }}</span>
        <span class="zen-pd-ref">—</span>
        <span style="font-family:var(--zg-mono);font-size:12px">{{ p.usageCount.toLocaleString() }}</span>
        <span class="zen-pd-ref">{{ p.usageCount > 0 ? '—' : '0%' }}</span>
        <span class="zf-amount is-neg">{{ cur }} {{ p.totalDiscountGiven.toLocaleString() }}</span>
        <StatusBadge :status="p.status" />
      </div>
    </div>
  </div>
</template>
