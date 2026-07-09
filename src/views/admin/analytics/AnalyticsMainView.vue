<script setup>
/**
 * AnalyticsMainView — Analytics & Data module shell.
 * 6 tabs: Overview · Sales · Customers · Products · Markets · Export
 * All charts use native SVG (no external chart library required).
 */
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AnalyticsOverview   from './AnalyticsOverview.vue';
import AnalyticsSales      from './AnalyticsSales.vue';
import AnalyticsCustomers  from './AnalyticsCustomers.vue';
import AnalyticsProducts   from './AnalyticsProducts.vue';
import AnalyticsMarkets    from './AnalyticsMarkets.vue';
import AnalyticsExport     from './AnalyticsExport.vue';

const route = useRoute();
const tab  = ref(route.query.tab || 'overview');
const dateRange = ref('Last 30 days');
const market    = ref('all');

const TABS = [
  ['overview',  'Overview'],
  ['sales',     'Sales Analytics'],
  ['customers', 'Customer Insights'],
  ['products',  'Product Performance'],
  ['markets',   'Market Reports'],
  ['export',    'Export Data'],
];
const DATE_RANGES = ['Last 7 days','Last 30 days','Last 90 days','This month','This year'];
const MARKETS_OPT = ['all','AE','SA','EG','QA','KW','BH','OM'];

watch(() => route.query.tab, t => { if (t) tab.value = t; });
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;min-height:0;background:#0E1013;">
    <!-- Header -->
    <div style="display:flex;align-items:center;gap:10px;padding:10px 20px;border-bottom:1px solid rgba(255,255,255,0.08);background:#15171B;flex-shrink:0;flex-wrap:wrap;">
      <div style="font-size:13px;font-weight:700;color:#D1D5DB;flex:1;">Analytics &amp; Data</div>
      <!-- Date range -->
      <select v-model="dateRange" style="height:28px;padding:0 10px;background:#0E1013;border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:11.5px;color:#9CA3AF;outline:none;cursor:pointer;">
        <option v-for="r in DATE_RANGES" :key="r">{{ r }}</option>
      </select>
      <!-- Market filter -->
      <select v-model="market" style="height:28px;padding:0 10px;background:#0E1013;border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:11.5px;color:#9CA3AF;outline:none;cursor:pointer;">
        <option value="all">All Markets</option>
        <option v-for="m in MARKETS_OPT.slice(1)" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>

    <!-- Tab bar -->
    <div style="display:flex;border-bottom:1px solid rgba(255,255,255,0.08);background:#15171B;flex-shrink:0;overflow-x:auto;scrollbar-width:none;">
      <button v-for="[v,l] in TABS" :key="v"
        style="height:38px;padding:0 16px;border:none;background:transparent;font-family:inherit;font-size:12px;cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;transition:all .1s;"
        :style="{ color: tab===v?'#A3E635':'#6B7280', borderBottomColor: tab===v?'#A3E635':'transparent', fontWeight: tab===v?600:400 }"
        @click="tab = v">{{ l }}</button>
    </div>

    <!-- Tab content -->
    <div style="flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.08) transparent;">
      <AnalyticsOverview  v-if="tab === 'overview'" />
      <AnalyticsSales     v-else-if="tab === 'sales'" />
      <AnalyticsCustomers v-else-if="tab === 'customers'" />
      <AnalyticsProducts  v-else-if="tab === 'products'" />
      <AnalyticsMarkets   v-else-if="tab === 'markets'" />
      <AnalyticsExport    v-else-if="tab === 'export'" />
    </div>
  </div>
</template>
