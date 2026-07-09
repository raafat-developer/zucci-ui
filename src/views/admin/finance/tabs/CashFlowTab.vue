<script setup>
import { ZCF_CASHFLOW } from '@/data/financeData';

const cf = ZCF_CASHFLOW;
const maxBar = Math.max(...cf.months.map(m => m.inflow));
const net30Inflow  = cf.upcoming30Days.inflows.reduce((s,i)=>s+i.amount,0);
const net30Outflow = cf.upcoming30Days.outflows.reduce((s,o)=>s+(
  o.currency==='AED'?o.amount:o.currency==='SAR'?o.amount/1.02:o.amount/49.2
),0);
const consolidatedBalance = (
  cf.currentBalance.AED + cf.currentBalance.SAR/1.02 + cf.currentBalance.EGP/49.2
).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const OUTFLOW_COLORS = { payout:'var(--zg-accent)', tax:'var(--zg-danger)', fee:'var(--zg-warn)', logistics:'oklch(0.82 0.14 215)' };
</script>

<template>
    <div class="zf-section-title">Current Cash Position (AED equiv.)</div>
    <div class="zf-kpi-strip">
      <div v-for="([c, amt]) in Object.entries(cf.currentBalance)" :key="c" class="zf-kpi-cell">
        <div class="zf-kpi-lbl">{{ c === 'AED' ? 'UAE · AED' : c === 'SAR' ? 'KSA · SAR' : 'Egypt · EGP' }}</div>
        <div class="zf-kpi-val is-accent">{{ c }} {{ amt.toLocaleString() }}</div>
        <div v-if="c !== 'AED'" class="zf-kpi-lbl">≈ AED {{ Math.round(amt / (c==='SAR'?1.02:49.2)).toLocaleString() }}</div>
      </div>
      <div class="zf-kpi-cell">
        <div class="zf-kpi-lbl">Consolidated (AED)</div>
        <div class="zf-kpi-val is-good">AED {{ consolidatedBalance }}</div>
      </div>
    </div>

    <div class="zf-section-title">6-Month Cash Flow (AED equiv.)</div>
    <div class="zf-cashflow-chart">
      <div v-for="(m, i) in cf.months" :key="i" class="zf-cf-col">
        <div class="zf-cf-bars">
          <div class="zf-cf-bar-wrap">
            <div class="zf-cf-bar zf-cf-bar--inflow" :style="{ height: (m.inflow/maxBar*100)+'%' }" :title="`Inflow: AED ${m.inflow.toLocaleString()}`" />
            <div class="zf-cf-bar zf-cf-bar--outflow" :style="{ height: (m.outflow/maxBar*100)+'%' }" :title="`Outflow: AED ${m.outflow.toLocaleString()}`" />
          </div>
        </div>
        <div class="zf-cf-net" :class="m.net >= 0 ? 'is-pos' : 'is-neg'">AED {{ (m.net/1000).toFixed(0) }}K</div>
        <div class="zf-cf-month">{{ m.month.split(' ')[0] }}<span v-if="m.forecast" class="zf-cf-forecast"> est</span></div>
      </div>
      <div class="zf-cf-legend">
        <span><span class="zf-cf-dot zf-cf-dot--inflow"/>Inflow</span>
        <span><span class="zf-cf-dot zf-cf-dot--outflow"/>Outflow</span>
      </div>
    </div>

    <div class="zen-grid-2" style="gap:12px;">
      <div class="zen-card">
        <div class="zen-card-head">
          <span class="zen-card-title">Expected Inflows · 30 days</span>
          <span class="zf-kpi-val is-good" style="font-size:13px;">AED {{ net30Inflow.toLocaleString() }}</span>
        </div>
        <div v-for="(it, i) in cf.upcoming30Days.inflows" :key="i" class="zf-upcoming-row">
          <span>{{ it.label }}</span>
          <span class="zf-amount is-pos" style="margin-left:auto;">{{ it.currency }} {{ it.amount.toLocaleString() }}</span>
          <span class="zen-pd-date">{{ it.date }}</span>
        </div>
      </div>
      <div class="zen-card">
        <div class="zen-card-head">
          <span class="zen-card-title">Expected Outflows · 30 days</span>
          <span class="zf-kpi-val is-neg" style="font-size:13px;">AED {{ Math.round(net30Outflow).toLocaleString() }}</span>
        </div>
        <div v-for="(it, i) in cf.upcoming30Days.outflows" :key="i" class="zf-upcoming-row">
          <span class="zf-type-badge" :style="{ background:'var(--zg-panel-hi)', color: OUTFLOW_COLORS[it.type]||'var(--zg-text-dim)', marginRight:'6px' }">{{ it.type }}</span>
          <span>{{ it.label }}</span>
          <span class="zf-amount is-neg" style="margin-left:auto;">{{ it.currency }} {{ it.amount.toLocaleString() }}</span>
          <span class="zen-pd-date">{{ it.date }}</span>
        </div>
      </div>
    </div>

    <div v-if="cf.aged" class="zen-grid-2" style="gap:12px;margin-top:12px;">
      <div v-for="([title, rows, cls]) in [['Aged Payables (Vendor Payouts Overdue)', cf.aged.payables, 'is-neg'],['Aged Receivables (Uncollected)', cf.aged.receivables, 'is-pos']]" :key="title" class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title" style="font-size:12px;">{{ title }}</span></div>
        <div v-for="(r, i) in rows" :key="i" class="zf-upcoming-row">
          <span>{{ r.range }}</span>
          <span class="zf-amount" :class="r.amount > 0 ? cls : ''" style="margin-left:auto;">{{ r.amount > 0 ? `AED ${r.amount.toLocaleString()}` : '—' }}</span>
        </div>
      </div>
    </div>
</template>
