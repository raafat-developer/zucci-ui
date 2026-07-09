<script setup>
import { ref, computed } from 'vue';
import { ZCF_TRANSACTIONS } from '@/data/financeData';

const cap = s => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
const TXN_TYPE_META = {
  revenue:    { label:'Revenue',    color:'var(--zg-good)',    bg:'oklch(0.78 0.15 150 / 0.1)' },
  payout:     { label:'Payout',     color:'var(--zg-accent)',  bg:'oklch(0.78 0.18 130 / 0.1)' },
  refund:     { label:'Refund',     color:'var(--zg-danger)',  bg:'oklch(0.70 0.18 25 / 0.08)' },
  fee:        { label:'Fee',        color:'var(--zg-warn)',    bg:'oklch(0.82 0.15 75 / 0.08)' },
  chargeback: { label:'Chargeback', color:'var(--zg-danger)',  bg:'oklch(0.70 0.18 25 / 0.08)' },
  cost:       { label:'Cost',       color:'var(--zg-warn)',    bg:'oklch(0.82 0.15 75 / 0.08)' },
  tax:        { label:'Tax',        color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.08)' },
};
const txnMeta = t => TXN_TYPE_META[t] || TXN_TYPE_META.revenue;

const query      = ref('');
const typeFilter = ref('all');
const mktFilter  = ref('all');
const txnTypes   = ['all','revenue','payout','refund','fee','chargeback','cost','tax'];
const txnMarkets = ['all','AE','SA','EG'];
const filteredTxns = computed(() => {
  const q = query.value.toLowerCase();
  return ZCF_TRANSACTIONS.filter(t =>
    (!q || t.id.includes(q) || t.ref?.toLowerCase().includes(q) || t.vendor?.toLowerCase().includes(q) || t.gateway.toLowerCase().includes(q)) &&
    (typeFilter.value === 'all' || t.type === typeFilter.value) &&
    (mktFilter.value === 'all'  || t.market === mktFilter.value)
  );
});
</script>

<template>
    <div class="zf-ledger-filters">
      <div class="zf-search"><input v-model="query" placeholder="Search ID, ref, vendor, gateway…" /></div>
      <div class="zf-filter-row">
        <button v-for="t in txnTypes" :key="t" class="zen-filter-chip" :class="{ 'is-on': typeFilter === t }" @click="typeFilter = t">{{ cap(t) }}</button>
      </div>
      <div class="zf-filter-row">
        <button v-for="m in txnMarkets" :key="m" class="zen-filter-chip" :class="{ 'is-on': mktFilter === m }" @click="mktFilter = m">{{ m === 'all' ? 'All Markets' : m }}</button>
      </div>
    </div>
    <div class="zf-section-title">{{ filteredTxns.length }} transactions</div>
    <div class="zf-ledger-table">
      <div class="zf-ledger-head"><span>TXN ID</span><span>Date</span><span>Type</span><span>Market</span><span>Gateway</span><span>Vendor / Ref</span><span>Status</span><span>Amount</span></div>
      <div v-for="t in filteredTxns" :key="t.id" class="zf-ledger-row">
        <span class="zf-txn-id">{{ t.id }}</span>
        <span class="zen-pd-date">{{ t.date }}</span>
        <span><span class="zf-type-badge" :style="{ background: txnMeta(t.type).bg, color: txnMeta(t.type).color }">{{ txnMeta(t.type).label }}</span></span>
        <span class="zen-pd-ref">{{ t.market }}</span>
        <span>{{ t.gateway }}</span>
        <span class="zf-vendor-ref">{{ t.vendor || t.ref }}</span>
        <span><span class="zen-bst" :class="['settled','processed','remitted'].includes(t.status)?'zen-bst--active':['pending','pending_collection'].includes(t.status)?'zen-bst--pending':'zen-bst--suspended'">{{ t.status.replace('_',' ') }}</span></span>
        <span class="zf-amount" :class="t.amount < 0 ? 'is-neg' : 'is-pos'">{{ t.amount < 0 ? '' : '+' }}{{ t.currency }} {{ Math.abs(t.amount).toLocaleString() }}</span>
      </div>
    </div>
</template>
