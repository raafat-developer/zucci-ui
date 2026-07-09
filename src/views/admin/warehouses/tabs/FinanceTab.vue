<script setup>
import { computed } from 'vue';
import { ZCW_COST_EVENTS, ZCW_VENDOR_COSTS_MTD, ZCW_3PL_INVOICES } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });

const costEvents = computed(() => (ZCW_COST_EVENTS || []).filter(e => e.wh === props.wh.id || e.warehouse === props.wh.id).slice(0, 15));
const vendorCosts = computed(() => ZCW_VENDOR_COSTS_MTD || []);
const invoices = computed(() => (ZCW_3PL_INVOICES || []).filter(i => i.warehouse_id === props.wh.id));

const TYPE_COLOR = {
  storage:    'var(--zg-warn)',
  receiving:  'oklch(0.82 0.14 215)',
  handling:   'var(--zg-accent)',
  fulfillment:'var(--zg-good)',
  other:      'var(--zg-text-dim)',
};
</script>

<template>
  <div class="zwh-tab-body">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;">
      <div class="zwh-card-panel" style="padding:10px 12px;">
        <div class="zwh-stat-cell-lbl">MTD Storage Cost</div>
        <div class="zwh-stat-cell-val warn">AED {{ wh.costs?.monthly_est?.toLocaleString() || '—' }}</div>
      </div>
      <div class="zwh-card-panel" style="padding:10px 12px;">
        <div class="zwh-stat-cell-lbl">3PL Invoices Pending</div>
        <div class="zwh-stat-cell-val">{{ invoices.length }}</div>
      </div>
      <div class="zwh-card-panel" style="padding:10px 12px;">
        <div class="zwh-stat-cell-lbl">Active Vendors</div>
        <div class="zwh-stat-cell-val accent">{{ wh.stats.active_vendors }}</div>
      </div>
    </div>

    <!-- Cost events -->
    <div class="zwh-section-label" style="margin-bottom:6px;">Cost Ledger</div>
    <div v-if="!costEvents.length" class="zwh-empty" style="height:80px;">
      <div class="zwh-empty-sub">No cost events recorded for this warehouse yet.</div>
    </div>
    <div v-else class="zwh-inv-table">
      <div class="zwh-inv-head" style="grid-template-columns:80px 80px 1fr 80px 80px 80px;">
        <span>ID</span><span>Date</span><span>Description</span><span>Vendor</span><span>Amount</span><span>Type</span>
      </div>
      <div v-for="e in costEvents" :key="e.id" class="zwh-inv-row" style="grid-template-columns:80px 80px 1fr 80px 80px 80px;">
        <span class="zwh-table-mono" style="font-size:10.5px;">{{ e.id }}</span>
        <span style="font-size:11px;color:var(--zg-text-dim);">{{ e.date }}</span>
        <span style="font-size:12px;color:var(--zg-text);">{{ e.desc || e.description }}</span>
        <span style="font-size:11.5px;color:var(--zg-text-dim);">{{ e.vendor }}</span>
        <span class="zwh-table-mono" style="color:var(--zg-warn);">{{ e.currency }} {{ e.amount }}</span>
        <span class="zwh-badge" :style="{ color: TYPE_COLOR[e.type]||TYPE_COLOR.other, background: (TYPE_COLOR[e.type]||TYPE_COLOR.other)+'18' }">{{ e.type }}</span>
      </div>
    </div>

    <!-- 3PL Invoices -->
    <div v-if="invoices.length">
      <div class="zwh-section-label" style="margin:14px 0 6px;">3PL Invoices</div>
      <div class="zwh-inv-table">
        <div class="zwh-inv-head" style="grid-template-columns:100px 80px 1fr 100px 80px;">
          <span>Invoice</span><span>Date</span><span>3PL Provider</span><span>Amount</span><span>Status</span>
        </div>
        <div v-for="inv in invoices" :key="inv.id" class="zwh-inv-row" style="grid-template-columns:100px 80px 1fr 100px 80px;">
          <span class="zwh-table-mono" style="font-size:10.5px;">{{ inv.id }}</span>
          <span style="font-size:11px;color:var(--zg-text-dim);">{{ inv.date }}</span>
          <span style="font-size:12px;color:var(--zg-text);">{{ inv.provider }}</span>
          <span class="zwh-table-mono" style="color:var(--zg-accent);">{{ inv.currency }} {{ inv.amount?.toLocaleString() }}</span>
          <span class="zwh-badge" :style="{ color: inv.status==='paid'?'var(--zg-good)':inv.status==='disputed'?'var(--zg-danger)':'var(--zg-warn)', background: inv.status==='paid'?'oklch(0.78 0.15 150 / 0.1)':inv.status==='disputed'?'oklch(0.70 0.18 25 / 0.1)':'oklch(0.82 0.15 75 / 0.1)' }">
            {{ inv.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
