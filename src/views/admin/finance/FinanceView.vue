<script setup>
/**
 * FinanceView — Finance module. Faithful port of ZucciFinanceModule: tabs for
 * Overview (consolidated P&L + per-market + next payout cycle), Transactions
 * ledger, Payouts, Gateways, VAT & Tax, and Cash Flow. Uses legacy zf-/zen- CSS.
 */
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  ZCF_PL, ZCF_TRANSACTIONS, ZCF_PAYOUTS, ZCF_GATEWAYS, ZCF_VAT, ZCF_RECONCILIATION,
  ZCF_UPCOMING, ZCF_INVOICE_QUEUE, ZCF_WHT, ZCF_CASHFLOW,
} from '@/data/financeData';

const route = useRoute();
const tab = ref(route.query.tab || 'overview');
watch(() => route.query.tab, (t) => { if (t) tab.value = t; });
const query = ref('');
const typeFilter = ref('all');
const mktFilter = ref('all');
const payoutFilter = ref('all');

const TABS = [['overview','Overview'],['ledger','Transactions'],['payouts','Payouts'],['gateways','Gateways'],['vat','VAT & Tax'],['cashflow','Cash Flow']];
const aed = (n) => `AED ${Number(n).toLocaleString()}`;
const cur = (n, c) => `${c} ${Number(n).toLocaleString()}`;

const TXN_TYPE_META = {
  revenue:{ label:'Revenue', color:'var(--zg-good)', bg:'oklch(0.78 0.15 150 / 0.1)' }, payout:{ label:'Payout', color:'var(--zg-accent)', bg:'var(--zg-accent-tint)' },
  refund:{ label:'Refund', color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.08)' }, fee:{ label:'Fee', color:'var(--zg-warn)', bg:'oklch(0.82 0.15 75 / 0.08)' },
  chargeback:{ label:'Chargeback', color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.08)' }, cost:{ label:'Cost', color:'var(--zg-warn)', bg:'oklch(0.82 0.15 75 / 0.08)' },
  tax:{ label:'Tax', color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.08)' },
};
const PAYOUT_STATUS_META = {
  processed:{ label:'Processed', color:'var(--zg-good)', bg:'oklch(0.78 0.15 150 / 0.1)' }, pending:{ label:'Pending', color:'var(--zg-warn)', bg:'oklch(0.82 0.15 75 / 0.1)' },
  on_hold:{ label:'On Hold', color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.1)' }, failed:{ label:'Failed', color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.1)' },
  upcoming:{ label:'Upcoming', color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.1)' },
};
const txnMeta = (t) => TXN_TYPE_META[t] || TXN_TYPE_META.revenue;
const payoutMeta = (s) => PAYOUT_STATUS_META[s] || PAYOUT_STATUS_META.pending;

const c = ZCF_PL.consolidated;
const overviewKpis = [
  { lbl:'Total GMV', val:aed(c.totalGmvAed), cls:'' },
  { lbl:'Net Revenue', val:aed(c.totalNetRevenueAed), cls:'is-good' },
  { lbl:'Margin', val:c.margin + '%', cls:'is-good' },
  { lbl:'Total Refunds', val:aed(c.totalRefundsAed), cls:'is-neg' },
  { lbl:'Gateway Fees', val:aed(c.totalGatewayFeesAed), cls:'is-neg' },
  { lbl:'Vendor Payouts', val:aed(c.totalPayoutsAed), cls:'is-neg' },
  { lbl:'Outstanding Payouts', val:aed(c.outstandingPayoutsAed), cls: c.outstandingPayoutsAed > 0 ? 'is-warn' : '' },
  { lbl:'Pending Refunds', val:aed(c.pendingRefundsAed), cls: c.pendingRefundsAed > 0 ? 'is-warn' : '' },
];
const marketRow = (m) => [
  ['GMV', cur(m.gmv, m.currency)], ['Commission', cur(m.commissionIncome, m.currency), 'pos'], ['Platform Fees', cur(m.platformFees, m.currency), 'pos'],
  ['Refunds', cur(m.refunds, m.currency), 'neg'], ['Gateway Fees', cur(m.gatewayFees, m.currency), 'neg'], ['Net Revenue', cur(m.netRevenue, m.currency), 'total'],
];

const txnTypes = ['all','revenue','payout','refund','fee','chargeback','cost','tax'];
const txnMarkets = ['all','AE','SA','EG'];
const filteredTxns = computed(() => {
  const q = query.value.toLowerCase();
  return ZCF_TRANSACTIONS.filter((t) => (!q || t.id.includes(q) || t.ref?.toLowerCase().includes(q) || t.vendor?.toLowerCase().includes(q) || t.gateway.toLowerCase().includes(q)) && (typeFilter.value === 'all' || t.type === typeFilter.value) && (mktFilter.value === 'all' || t.market === mktFilter.value));
});
const payoutStatuses = ['all','processed','pending','on_hold','failed','upcoming'];
const filteredPayouts = computed(() => payoutFilter.value === 'all' ? ZCF_PAYOUTS : ZCF_PAYOUTS.filter((p) => p.status === payoutFilter.value));

const tabs = TABS; const pl = ZCF_PL; const up = ZCF_UPCOMING; const gateways = ZCF_GATEWAYS; const vat = ZCF_VAT; const wht = ZCF_WHT; const invoices = ZCF_INVOICE_QUEUE; const cashflow = ZCF_CASHFLOW;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ');
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;min-height:0">
    <div class="zwh-header" style="flex-shrink:0">
      <div class="zwh-header-left">
        <div style="font-size:16px;font-weight:700;color:var(--zg-text)">Finance</div>
        <div class="zwh-subtitle">P&amp;L · transactions · payouts · gateways · tax — {{ pl.period }}</div>
      </div>
      <div style="display:flex;gap:6px"><button class="zwh-btn-ghost">Export</button></div>
    </div>

    <div style="display:flex;border-bottom:1px solid var(--zg-line);background:var(--zg-bg-elev);flex-shrink:0;padding:0 20px">
      <button v-for="[v, l] in tabs" :key="v" style="height:40px;padding:0 14px;border:none;background:transparent;font-family:inherit;font-size:12.5px;cursor:pointer" :style="{ color: tab === v ? 'var(--zg-accent)' : 'var(--zg-text-dim)', borderBottom: tab === v ? '2px solid var(--zg-accent)' : '2px solid transparent', fontWeight: tab === v ? 600 : 400 }" @click="tab = v">{{ l }}</button>
    </div>

    <div style="flex:1;overflow-y:auto" class="zf-tab-body">
      <!-- Overview -->
      <template v-if="tab === 'overview'">
        <div class="zf-section-title">Consolidated · {{ pl.period }} · AED base</div>
        <div class="zf-kpi-strip">
          <div v-for="(k, i) in overviewKpis" :key="i" class="zf-kpi-cell"><div class="zf-kpi-lbl">{{ k.lbl }}</div><div class="zf-kpi-val" :class="k.cls">{{ k.val }}</div></div>
        </div>
        <div class="zf-section-title">Per-Market Breakdown</div>
        <div class="zf-market-grid">
          <div v-for="m in pl.markets" :key="m.code" class="zf-market-card">
            <div class="zf-market-head">
              <span class="zf-market-name">{{ m.name }}</span>
              <span class="zf-market-currency">{{ m.currency }}</span>
              <span class="zf-market-margin" :class="m.margin < 10 ? 'is-warn' : 'is-good'">{{ m.margin }}% margin</span>
            </div>
            <div class="zf-market-rows">
              <div v-for="([lbl, val, cls], i) in marketRow(m)" :key="i" class="zf-market-row" :class="{ 'is-total': cls === 'total' }">
                <span>{{ lbl }}</span>
                <span class="zf-market-amount" :class="{ 'is-pos': cls === 'pos', 'is-neg': cls === 'neg', 'is-total': cls === 'total' }">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="zf-section-title">Next Payout Cycle · {{ up.nextPayoutDate }}</div>
        <div class="zf-upcoming-card">
          <div class="zf-upcoming-meta">
            <div class="zf-upcoming-total"><div class="zf-kpi-lbl">Expected Total (AED equiv.)</div><div class="zf-kpi-val is-accent">{{ aed(up.expectedAmountAed) }}</div></div>
            <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Vendors</div><div class="zf-kpi-val">{{ up.expectedVendorCount }}</div></div>
          </div>
          <div class="zf-upcoming-breakdown">
            <div v-for="b in up.breakdown" :key="b.market" class="zf-upcoming-row">
              <span class="zf-market-name">{{ b.market }} · {{ b.currency }}</span>
              <span class="zf-pd-ref">{{ b.vendors }} vendors</span>
              <span class="zf-upcoming-amount">{{ cur(b.amount, b.currency) }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Ledger -->
      <template v-else-if="tab === 'ledger'">
        <div class="zf-ledger-filters">
          <div class="zf-search">
            <input v-model="query" placeholder="Search ID, ref, vendor, gateway…" />
          </div>
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
            <span><span class="zen-bst" :class="['settled','processed','remitted'].includes(t.status) ? 'zen-bst--active' : ['pending','pending_collection'].includes(t.status) ? 'zen-bst--pending' : 'zen-bst--suspended'">{{ t.status.replace('_', ' ') }}</span></span>
            <span class="zf-amount" :class="t.amount < 0 ? 'is-neg' : 'is-pos'">{{ t.amount < 0 ? '' : '+' }}{{ t.currency }} {{ Math.abs(t.amount).toLocaleString() }}</span>
          </div>
        </div>
      </template>

      <!-- Payouts -->
      <template v-else-if="tab === 'payouts'">
        <div class="zf-filter-row" style="margin-bottom:8px">
          <button v-for="s in payoutStatuses" :key="s" class="zen-filter-chip" :class="{ 'is-on': payoutFilter === s }" @click="payoutFilter = s">{{ cap(s) }}</button>
        </div>
        <div class="zf-payout-table">
          <div class="zf-payout-head"><span>Payout ID</span><span>Vendor</span><span>Market</span><span>Bank</span><span>Orders</span><span>Commission</span><span>Status</span><span>Amount</span><span>Due</span></div>
          <div v-for="p in filteredPayouts" :key="p.id" class="zf-payout-row">
            <span class="zf-txn-id">{{ p.id }}</span>
            <span>{{ p.vendor }}</span>
            <span class="zen-pd-ref">{{ p.market }} · {{ p.currency }}</span>
            <span class="zen-pd-ref">{{ p.bank }}</span>
            <span class="zen-pd-ref">{{ p.ordersCount }}</span>
            <span class="zf-amount is-neg">{{ p.currency }} {{ p.commission.toLocaleString() }}</span>
            <span><span class="zf-type-badge" :style="{ background: payoutMeta(p.status).bg, color: payoutMeta(p.status).color }">{{ payoutMeta(p.status).label }}</span></span>
            <span class="zf-amount is-pos">{{ p.currency }} {{ p.amount.toLocaleString() }}</span>
            <span class="zen-pd-date">{{ p.dueDate }}</span>
          </div>
        </div>
      </template>

      <!-- Gateways -->
      <template v-else-if="tab === 'gateways'">
        <div class="zf-section-title">{{ gateways.length }} payment gateways</div>
        <div class="zf-gateway-grid">
          <div v-for="gw in gateways" :key="gw.id" class="zf-gw-card" :class="{ 'is-discrepancy': gw.discrepancy > 0, 'is-pending': gw.discrepancy === 0 && gw.pending > 0 }">
            <div class="zf-gw-head">
              <div>
                <div class="zf-gw-name">{{ gw.name }}</div>
                <div class="zf-gw-meta"><span class="zen-brand-cat-tag">{{ gw.type }}</span><span v-for="m in gw.markets" :key="m" class="zen-brand-cat-tag">{{ m }}</span></div>
              </div>
              <span v-if="gw.discrepancy > 0" class="zen-bst zen-bst--suspended">Discrepancy</span>
              <span v-else-if="gw.pending > 0" class="zen-bst zen-bst--pending">Pending</span>
              <span v-else class="zen-bst zen-bst--active">Settled</span>
            </div>
            <div class="zf-gw-stats">
              <div><div class="zf-kpi-lbl">Volume</div><div class="zf-gw-val">{{ gw.volume.toLocaleString() }}</div></div>
              <div><div class="zf-kpi-lbl">Transactions</div><div class="zf-gw-val">{{ gw.txnCount.toLocaleString() }}</div></div>
              <div><div class="zf-kpi-lbl">Fees</div><div class="zf-gw-val is-neg">{{ gw.fees.toLocaleString() }}</div></div>
              <div v-if="gw.discrepancy > 0"><div class="zf-kpi-lbl">Discrepancy</div><div class="zf-gw-val is-neg">{{ gw.discrepancy.toLocaleString() }}</div></div>
            </div>
            <div v-if="gw.lastSettlement" class="zf-gw-footer">Last settlement: {{ gw.lastSettlement }}</div>
          </div>
        </div>
      </template>

      <!-- VAT & Tax -->
      <template v-else-if="tab === 'vat'">
        <div class="zf-section-title">VAT Summary by Market</div>
        <div class="zf-ledger-table">
          <div class="zf-ledger-head" style="grid-template-columns:1fr 60px 100px 100px 100px 100px 90px"><span>Market</span><span>Rate</span><span>Collected</span><span>Remitted</span><span>Outstanding</span><span>Next Due</span><span>Status</span></div>
          <div v-for="v in vat" :key="v.market" class="zf-ledger-row" style="grid-template-columns:1fr 60px 100px 100px 100px 100px 90px">
            <span>{{ v.name }} ({{ v.market }})</span>
            <span class="zen-pd-ref">{{ v.rate }}%</span>
            <span class="zf-amount">{{ v.currency }} {{ v.collected.toLocaleString() }}</span>
            <span class="zf-amount">{{ v.currency }} {{ v.remitted.toLocaleString() }}</span>
            <span class="zf-amount" :class="{ 'is-neg': v.outstanding > 0 }">{{ v.currency }} {{ v.outstanding.toLocaleString() }}</span>
            <span class="zen-pd-date">{{ v.nextDueDate }}</span>
            <span><span class="zen-bst" :class="v.filingStatus === 'filed' ? 'zen-bst--active' : 'zen-bst--pending'">{{ v.filingStatus }}</span></span>
          </div>
        </div>
        <div class="zf-section-title">Withholding Tax (WHT)</div>
        <div class="zf-ledger-table">
          <div class="zf-ledger-head" style="grid-template-columns:110px 1fr 70px 110px 70px 90px 90px"><span>WHT ID</span><span>Vendor</span><span>Mkt</span><span>Payout</span><span>Rate</span><span>Amount</span><span>Status</span></div>
          <div v-for="w in wht" :key="w.id" class="zf-ledger-row" style="grid-template-columns:110px 1fr 70px 110px 70px 90px 90px">
            <span class="zf-txn-id">{{ w.id }}</span><span>{{ w.vendor }}</span><span class="zen-pd-ref">{{ w.market }}</span>
            <span class="zen-pd-ref">{{ w.payoutId }}</span><span class="zen-pd-ref">{{ w.rate }}%</span>
            <span class="zf-amount is-neg">{{ w.whtAmount.toLocaleString() }}</span>
            <span><span class="zen-bst" :class="w.status === 'deducted' ? 'zen-bst--active' : 'zen-bst--pending'">{{ w.status }}</span></span>
          </div>
        </div>
        <div class="zf-section-title">E-Invoice Queue</div>
        <div class="zf-ledger-table">
          <div class="zf-ledger-head" style="grid-template-columns:150px 60px 90px 60px 110px 90px 1fr"><span>Invoice</span><span>Mkt</span><span>Authority</span><span>Type</span><span>Amount</span><span>Status</span><span>Vendor / Ref</span></div>
          <div v-for="inv in invoices" :key="inv.id" class="zf-ledger-row" style="grid-template-columns:150px 60px 90px 60px 110px 90px 1fr">
            <span class="zf-txn-id">{{ inv.id }}</span><span class="zen-pd-ref">{{ inv.market }}</span><span>{{ inv.authority }}</span><span class="zen-pd-ref">{{ inv.type }}</span>
            <span class="zf-amount">{{ inv.amount }}</span>
            <span><span class="zen-bst" :class="inv.status === 'cleared' ? 'zen-bst--active' : 'zen-bst--pending'">{{ inv.status }}</span></span>
            <span class="zf-vendor-ref">{{ inv.vendor }} · {{ inv.ref }}</span>
          </div>
        </div>
      </template>

      <!-- Cash Flow -->
      <template v-else>
        <div class="zf-section-title">Current Balances</div>
        <div class="zf-kpi-strip">
          <div v-for="(bal, ccy) in cashflow.currentBalance" :key="ccy" class="zf-kpi-cell"><div class="zf-kpi-lbl">{{ ccy }}</div><div class="zf-kpi-val is-accent">{{ ccy }} {{ bal.toLocaleString() }}</div></div>
        </div>
        <div class="zf-section-title">Monthly Cash Flow</div>
        <div class="zf-ledger-table">
          <div class="zf-ledger-head" style="grid-template-columns:1fr repeat(4, 1fr)"><span>Month</span><span>Inflow</span><span>Outflow</span><span>Net</span><span>Balance</span></div>
          <div v-for="m in cashflow.months" :key="m.month" class="zf-ledger-row" style="grid-template-columns:1fr repeat(4, 1fr)">
            <span style="font-weight:600;color:var(--zg-text)">{{ m.month }}</span>
            <span class="zf-amount is-pos">{{ (m.inflow || 0).toLocaleString() }}</span>
            <span class="zf-amount is-neg">{{ (m.outflow || 0).toLocaleString() }}</span>
            <span class="zf-amount" :class="(m.net || 0) >= 0 ? 'is-pos' : 'is-neg'">{{ (m.net || 0).toLocaleString() }}</span>
            <span class="zf-amount">{{ (m.balance || 0).toLocaleString() }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
