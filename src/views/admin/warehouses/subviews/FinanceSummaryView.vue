<script setup>
import { ref, computed } from 'vue';
import { ZCW_WAREHOUSES, ZCW_COST_EVENTS, ZCW_3PL_INVOICES, ZCW_INVENTORY_ALL } from '@/data/warehouseData';
const emit = defineEmits(['back']);
const whs = ZCW_WAREHOUSES;
const costEvents = ZCW_COST_EVENTS || [];
const invoices   = ZCW_3PL_INVOICES || [];
const inv        = ZCW_INVENTORY_ALL || [];

const totalAccruing  = computed(() => inv.reduce((s,i) => s+(i.daily_cost||0), 0));
const totalInvoiced  = computed(() => invoices.reduce((s,i) => s+(i.amount||0), 0));
const pendingInv     = computed(() => invoices.filter(i => i.status !== 'paid').length);
const TYPE_COLOR     = { storage:'var(--zg-warn)', receiving:'oklch(0.82 0.14 215)', handling:'var(--zg-accent)', fulfillment:'var(--zg-good)', other:'var(--zg-text-dim)' };

// Per-warehouse cost rollup
const whCosts = computed(() => whs.map(w => {
  const wInv = inv.filter(i => i.warehouse_id === w.id);
  const daily = wInv.reduce((s,i) => s+(i.daily_cost||0), 0);
  const wInv2 = invoices.filter(i => i.warehouse_id === w.id);
  const invTotal = wInv2.reduce((s,i) => s+(i.amount||0), 0);
  return { ...w, dailyCost:daily, invoiceTotal:invTotal, skus:wInv.length };
}).sort((a,b) => b.dailyCost - a.dailyCost));
</script>
<template>
  <div class="zwh-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <button class="zwh-bc-back" @click="emit('back')"><svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14"/></svg> Warehouses</button>
        <div class="zwh-title" style="margin-left:10px;">Finance Summary</div>
        <div class="zwh-subtitle">Storage costs, 3PL invoices, and accruals across all warehouses</div>
      </div>
      <button class="zwh-btn-ghost">Export Report</button>
    </div>
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Daily Accruing</span><span class="zwh-kpi-val is-warn">AED {{ totalAccruing.toFixed(2) }}/day</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">3PL Invoiced (MTD)</span><span class="zwh-kpi-val is-accent">AED {{ totalInvoiced.toLocaleString() }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Invoices Pending</span><span class="zwh-kpi-val" :class="{ 'is-danger': pendingInv > 0 }">{{ pendingInv }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Cost Events (MTD)</span><span class="zwh-kpi-val">{{ costEvents.length }}</span></div>
    </div>

    <!-- Per-warehouse cost cards -->
    <div style="padding:16px;display:flex;flex-direction:column;gap:12px;overflow-y:auto;">
      <div class="zwh-section-label">Per-Warehouse Breakdown</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;">
        <div v-for="w in whCosts" :key="w.id" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
            <span style="font-size:18px;">{{ w.flag }}</span>
            <div><div style="font-size:13px;font-weight:600;color:var(--zg-text);">{{ w.name }}</div><div style="font-size:11px;color:var(--zg-text-dim);">{{ w.city }}, {{ w.country }}</div></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:2px;">Daily Storage</div><div style="font-family:var(--zg-mono);font-size:14px;font-weight:700;" :style="{ color: w.dailyCost>0?'var(--zg-warn)':'var(--zg-text-dim)' }">{{ w.currency }} {{ w.dailyCost.toFixed(2) }}/d</div></div>
            <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:2px;">3PL Invoiced</div><div style="font-family:var(--zg-mono);font-size:14px;font-weight:700;color:var(--zg-accent);">{{ w.currency }} {{ w.invoiceTotal.toLocaleString() }}</div></div>
            <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:2px;">Tracked SKUs</div><div style="font-family:var(--zg-mono);font-size:14px;font-weight:700;color:var(--zg-text);">{{ w.skus }}</div></div>
            <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:2px;">Handling Fee</div><div style="font-family:var(--zg-mono);font-size:14px;font-weight:700;color:var(--zg-text);">{{ w.currency }} {{ w.costs?.handling_fee||0 }}/unit</div></div>
          </div>
        </div>
      </div>

      <!-- Cost events table -->
      <div v-if="costEvents.length">
        <div class="zwh-section-label" style="margin-bottom:6px;">Cost Ledger (All Warehouses)</div>
        <div class="zwh-list-table">
          <div class="zwh-list-head"><span class="zwh-col w80">ID</span><span class="zwh-col w80">Date</span><span class="zwh-col">Description</span><span class="zwh-col w80">Vendor</span><span class="zwh-col w140">Warehouse</span><span class="zwh-col w80 right">Amount</span><span class="zwh-col w70">Type</span></div>
          <div v-for="e in costEvents" :key="e.id" class="zwh-list-row">
            <span class="zwh-col w80 zwh-mono" style="font-size:10.5px;">{{ e.id }}</span>
            <span class="zwh-col w80" style="font-size:11px;color:var(--zg-text-dim);">{{ e.date }}</span>
            <span class="zwh-col" style="font-size:12px;color:var(--zg-text);">{{ e.desc||e.description }}</span>
            <span class="zwh-col w80" style="font-size:11.5px;color:var(--zg-text-dim);">{{ e.vendor }}</span>
            <span class="zwh-col w140" style="font-size:11px;color:var(--zg-text-dim);">{{ e.wh||e.warehouse }}</span>
            <span class="zwh-col w80 right zwh-mono" style="color:var(--zg-warn);">{{ e.currency }} {{ e.amount }}</span>
            <span class="zwh-col w70"><span class="zwh-badge" :style="{ color:TYPE_COLOR[e.type]||TYPE_COLOR.other, background:(TYPE_COLOR[e.type]||TYPE_COLOR.other)+'18' }">{{ e.type }}</span></span>
          </div>
        </div>
      </div>

      <!-- 3PL Invoices -->
      <div v-if="invoices.length">
        <div class="zwh-section-label" style="margin-bottom:6px;">3PL Invoices</div>
        <div class="zwh-list-table">
          <div class="zwh-list-head"><span class="zwh-col w110">Invoice</span><span class="zwh-col w80">Date</span><span class="zwh-col">Provider</span><span class="zwh-col w140">Warehouse</span><span class="zwh-col w100 right">Amount</span><span class="zwh-col w80">Status</span></div>
          <div v-for="inv in invoices" :key="inv.id" class="zwh-list-row">
            <span class="zwh-col w110 zwh-mono" style="font-size:10.5px;">{{ inv.id }}</span>
            <span class="zwh-col w80" style="font-size:11px;color:var(--zg-text-dim);">{{ inv.date }}</span>
            <span class="zwh-col" style="font-size:12px;color:var(--zg-text);">{{ inv.provider }}</span>
            <span class="zwh-col w140" style="font-size:11px;color:var(--zg-text-dim);">{{ inv.warehouse_id }}</span>
            <span class="zwh-col w100 right zwh-mono" style="color:var(--zg-accent);">{{ inv.currency }} {{ inv.amount?.toLocaleString() }}</span>
            <span class="zwh-col w80"><span class="zwh-badge" :style="{ color:inv.status==='paid'?'var(--zg-good)':inv.status==='disputed'?'var(--zg-danger)':'var(--zg-warn)', background:inv.status==='paid'?'oklch(0.78 0.15 150 / 0.1)':inv.status==='disputed'?'oklch(0.70 0.18 25 / 0.1)':'oklch(0.82 0.15 75 / 0.1)' }">{{ inv.status }}</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
