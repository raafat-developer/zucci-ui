<script setup>
import { ref, computed } from 'vue';
import { ZCF_PL, ZCF_PAYOUTS, ZCF_RECONCILIATION, ZCF_VAT, ZCF_UPCOMING } from '@/data/financeData';

const aed = n => `AED ${Number(n).toLocaleString()}`;
const cur = (n, c) => `${c} ${Number(n).toLocaleString()}`;
const pct = n => `${n}%`;

const c = ZCF_PL.consolidated;
const overviewKpis = [
  { lbl:'Total GMV',          val:aed(c.totalGmvAed),          cls:'' },
  { lbl:'Net Revenue',        val:aed(c.totalNetRevenueAed),    cls:'is-good' },
  { lbl:'Margin',             val:pct(c.margin),                cls:'is-good' },
  { lbl:'Total Refunds',      val:aed(c.totalRefundsAed),       cls:'is-neg' },
  { lbl:'Gateway Fees',       val:aed(c.totalGatewayFeesAed),   cls:'is-neg' },
  { lbl:'Vendor Payouts',     val:aed(c.totalPayoutsAed),       cls:'is-neg' },
  { lbl:'Outstanding Payouts',val:aed(c.outstandingPayoutsAed), cls:c.outstandingPayoutsAed > 0 ? 'is-warn' : '' },
  { lbl:'Pending Refunds',    val:aed(c.pendingRefundsAed),     cls:c.pendingRefundsAed > 0 ? 'is-warn' : '' },
];
const marketRow = m => [
  ['GMV',          cur(m.gmv, m.currency),             ''],
  ['Commission',   cur(m.commissionIncome, m.currency), 'pos'],
  ['Platform Fees',cur(m.platformFees, m.currency),    'pos'],
  ['Refunds',      cur(m.refunds, m.currency),          'neg'],
  ['Gateway Fees', cur(m.gatewayFees, m.currency),      'neg'],
  ['Net Revenue',  cur(m.netRevenue, m.currency),       'total'],
];
const overviewAlerts = computed(() => [
  ZCF_PAYOUTS.filter(p => p.status === 'failed').length > 0 && { type:'danger', msg:`${ZCF_PAYOUTS.filter(p=>p.status==='failed').length} payout(s) failed — IBAN issues` },
  ZCF_PAYOUTS.filter(p => p.status === 'on_hold').length > 0 && { type:'warn', msg:`${ZCF_PAYOUTS.filter(p=>p.status==='on_hold').length} payout(s) on hold` },
  ZCF_RECONCILIATION.filter(r => r.status === 'discrepancy').length > 0 && { type:'warn', msg:`${ZCF_RECONCILIATION.filter(r=>r.status==='discrepancy').length} reconciliation discrepancies` },
  ZCF_VAT.filter(v => v.outstanding > 0).length > 0 && { type:'danger', msg:`VAT outstanding in ${ZCF_VAT.filter(v=>v.outstanding>0).map(v=>v.name).join(', ')}` },
].filter(Boolean));
</script>

<template>
    <!-- Alerts -->
    <div v-for="(a, i) in overviewAlerts" :key="i" :class="`zf-alert zf-alert--${a.type}`">
      <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 2L13 12H1L7 2Z"/><line x1="7" y1="6" x2="7" y2="8.5"/><circle cx="7" cy="10.5" r="0.5" fill="currentColor"/></svg>
      {{ a.msg }}
    </div>

    <div class="zf-section-title">Consolidated · {{ ZCF_PL.period }} · AED base</div>
    <div class="zf-kpi-strip">
      <div v-for="k in overviewKpis" :key="k.lbl" class="zf-kpi-cell">
        <div class="zf-kpi-lbl">{{ k.lbl }}</div>
        <div class="zf-kpi-val" :class="k.cls">{{ k.val }}</div>
      </div>
    </div>

    <div class="zf-section-title">Per-Market Breakdown</div>
    <div class="zf-market-grid">
      <div v-for="m in ZCF_PL.markets" :key="m.code" class="zf-market-card">
        <div class="zf-market-head">
          <span class="zf-market-name">{{ m.name }}</span>
          <span class="zf-market-currency">{{ m.currency }}</span>
          <span class="zf-market-margin" :class="m.margin < 10 ? 'is-warn' : 'is-good'">{{ m.margin }}% margin</span>
        </div>
        <div class="zf-market-rows">
          <div v-for="([lbl,val,cls],i) in marketRow(m)" :key="i" class="zf-market-row" :class="{ 'is-total': cls === 'total' }">
            <span>{{ lbl }}</span>
            <span class="zf-market-amount" :class="{ 'is-pos': cls==='pos', 'is-neg': cls==='neg', 'is-total': cls==='total' }">{{ val }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="zf-section-title">Next Payout Cycle · {{ ZCF_UPCOMING.nextPayoutDate }}</div>
    <div class="zf-upcoming-card">
      <div class="zf-upcoming-meta">
        <div class="zf-upcoming-total">
          <div class="zf-kpi-lbl">Expected Total (AED equiv.)</div>
          <div class="zf-kpi-val is-accent">{{ aed(ZCF_UPCOMING.expectedAmountAed) }}</div>
        </div>
        <div class="zf-kpi-cell">
          <div class="zf-kpi-lbl">Vendors</div>
          <div class="zf-kpi-val">{{ ZCF_UPCOMING.expectedVendorCount }}</div>
        </div>
      </div>
      <div class="zf-upcoming-breakdown">
        <div v-for="b in ZCF_UPCOMING.breakdown" :key="b.market" class="zf-upcoming-row">
          <span class="zf-market-name">{{ b.market }} · {{ b.currency }}</span>
          <span class="zf-pd-ref">{{ b.vendors }} vendors</span>
          <span class="zf-upcoming-amount">{{ cur(b.amount, b.currency) }}</span>
        </div>
      </div>
    </div>
</template>
