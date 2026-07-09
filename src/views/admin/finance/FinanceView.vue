<script setup>
/**
 * FinanceView — Financial Transactions shell.
 * 9 tabs each in their own component under tabs/.
 */
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ZCF_PL, ZCF_PAYOUTS, ZCF_UPCOMING } from '@/data/financeData';

import OverviewTab       from './tabs/OverviewTab.vue';
import TransactionsTab   from './tabs/TransactionsTab.vue';
import PayoutsTab        from './tabs/PayoutsTab.vue';
import GatewaysTab       from './tabs/GatewaysTab.vue';
import TaxComplianceTab  from './tabs/TaxComplianceTab.vue';
import CashFlowTab       from './tabs/CashFlowTab.vue';
import StorageCostsTab   from './tabs/StorageCostsTab.vue';
import ReconciliationTab from './tabs/ReconciliationTab.vue';
import ReportsTab        from './tabs/ReportsTab.vue';

const route = useRoute();
const tab = ref(route.query.tab || 'overview');
watch(() => route.query.tab, t => { if (t) tab.value = t; });

const TABS = [
  ['overview',       'Overview'],
  ['transactions',   'Transactions'],
  ['payouts',        'Payouts'],
  ['gateways',       'Gateways'],
  ['tax-compliance', 'Tax & Compliance'],
  ['cash-flow',      'Cash Flow'],
  ['storage-costs',  'Storage Costs'],
  ['reconciliation', 'Reconciliation'],
  ['reports',        'Reports'],
];

const pl = ZCF_PL;
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;min-height:0;">
    <!-- Header -->
    <div class="zwh-header" style="flex-shrink:0;">
      <div class="zwh-header-left">
        <div style="font-size:16px;font-weight:700;color:var(--zg-text)">Financial Transactions &amp; Payouts</div>
        <div class="zwh-subtitle">{{ pl.period }} · Multi-currency · All markets</div>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="zwh-btn-ghost" @click="">Jun 2025</button>
        <button class="zwh-btn-ghost" @click="">Export All</button>
        <button class="zwh-btn-primary" @click="">Process Payouts</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="zen-tabs" style="padding:0 20px;flex-shrink:0;overflow-x:auto;scrollbar-width:none;">
      <button v-for="[v,l] in TABS" :key="v"
        class="zen-tab" :class="{ 'is-active': tab === v }"
        @click="tab = v">{{ l }}</button>
    </div>

    <!-- Tab content -->
    <div style="flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;">
      <OverviewTab       v-if="tab === 'overview'" />
      <TransactionsTab   v-else-if="tab === 'transactions'" />
      <PayoutsTab        v-else-if="tab === 'payouts'" />
      <GatewaysTab       v-else-if="tab === 'gateways'" />
      <TaxComplianceTab  v-else-if="tab === 'tax-compliance'" />
      <CashFlowTab       v-else-if="tab === 'cash-flow'" />
      <StorageCostsTab   v-else-if="tab === 'storage-costs'" />
      <ReconciliationTab v-else-if="tab === 'reconciliation'" />
      <ReportsTab        v-else-if="tab === 'reports'" />
    </div>
  </div>
</template>

<style scoped>
.zwh-header { display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--zg-line);flex-wrap:wrap;gap:8px; }
.zwh-header-left { display:flex;flex-direction:column;gap:2px; }
.zwh-subtitle { font-size:11.5px;color:var(--zg-text-dim); }
.zwh-btn-primary { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }
.zwh-btn-ghost { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
.zen-tabs { display:flex;border-bottom:1px solid var(--zg-line);background:var(--zg-bg-elev); }
.zen-tab { height:40px;padding:0 14px;border:none;background:transparent;font-size:12px;cursor:pointer;color:var(--zg-text-dim);border-bottom:2px solid transparent;white-space:nowrap;font-weight:400; }
.zen-tab.is-active { color:var(--zg-accent);border-bottom-color:var(--zg-accent);font-weight:600; }
</style>
