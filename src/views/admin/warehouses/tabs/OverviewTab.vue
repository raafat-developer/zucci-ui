<script setup>
import { computed } from 'vue';
import {
  ZCW_ALERTS as SEED_ALERTS, ZCW_ACTIVITY,
} from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });

const utilPct  = (used, total) => total ? Math.round((used / total) * 100) : 0;
const utilCls  = (pct) => pct >= 85 ? 'high' : pct >= 60 ? 'mid' : 'low';
const utilColor = (pct) => pct >= 85 ? 'var(--zg-danger)' : pct >= 60 ? 'var(--zg-warn)' : 'var(--zg-good)';
const fmtTs = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short' }) + ' · ' +
         d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
};

const alerts   = computed(() => SEED_ALERTS.filter(a => a.warehouse_id === props.wh.id));
const activity = computed(() => ZCW_ACTIVITY[props.wh.id] || []);

const STATS = computed(() => [
  { lbl:'Total SKUs',        val: props.wh.stats.total_skus.toLocaleString(),    cls: 'accent' },
  { lbl:'Active Vendors',    val: props.wh.stats.active_vendors,                 cls: '' },
  { lbl:'Pending Inbound',   val: props.wh.stats.pending_inbound,                cls: props.wh.stats.pending_inbound > 8 ? 'warn' : '' },
  { lbl:'Pending Outbound',  val: props.wh.stats.pending_outbound,               cls: '' },
  { lbl:'Returns Queue',     val: props.wh.stats.pending_returns,                 cls: props.wh.stats.pending_returns > 5 ? 'warn' : '' },
  { lbl:'Open Transfers',    val: props.wh.stats.open_transfers,                 cls: '' },
]);

const gauges = computed(() => {
  const { capacity: c } = props.wh;
  return [
    c.m2 > 0       ? { label:'Floor Space',      used: c.used_m2,     total: c.m2,      unit:'m²' }      : null,
    c.pallets > 0  ? { label:'Pallet Positions', used: c.used_pallets, total: c.pallets, unit:'pallets' } : null,
    c.bins > 0     ? { label:'Bin Locations',    used: c.used_bins,    total: c.bins,    unit:'bins' }    : null,
  ].filter(Boolean);
});
</script>

<template>
  <div class="zwh-tab-body">
    <!-- Alerts -->
    <div v-if="alerts.length" style="display:flex;flex-direction:column;gap:6px;">
      <div class="zwh-section-label">Active Alerts</div>
      <div v-for="a in alerts" :key="a.id" class="zwh-alert-item" :class="a.severity">
        <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M7 2L13 12H1L7 2Z"/><line x1="7" y1="6" x2="7" y2="8.5"/><circle cx="7" cy="10.5" r="0.5" fill="currentColor"/>
        </svg>
        <span style="flex:1;">{{ a.msg }}</span>
        <span class="zwh-alert-time">{{ fmtTs(a.created) }}</span>
      </div>
    </div>

    <div class="zwh-ov-grid">
      <!-- Capacity gauges -->
      <div class="zwh-card-panel">
        <div class="zwh-panel-head">Capacity Utilization</div>
        <div class="zwh-panel-body">
          <template v-if="gauges.length">
            <div v-for="g in gauges" :key="g.label" class="zwh-gauge-row">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span class="zwh-util-label">{{ g.label }}</span>
                <span style="font-size:10.5px;font-family:var(--zg-mono);" :style="{ color: utilColor(utilPct(g.used, g.total)) }">
                  {{ utilPct(g.used, g.total) }}% · {{ g.used.toLocaleString() }} / {{ g.total.toLocaleString() }} {{ g.unit }}
                </span>
              </div>
              <div class="zwh-util-track" style="height:6px;">
                <div :class="`zwh-util-fill is-${utilCls(utilPct(g.used, g.total))}`" :style="{ width: utilPct(g.used, g.total) + '%' }" />
              </div>
            </div>
          </template>
          <div v-else style="color:var(--zg-text-dim);font-size:12px;padding:8px 0;">
            Virtual warehouse — no physical capacity tracked.
          </div>
        </div>
      </div>

      <!-- Key metrics grid -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="zwh-stats-grid">
          <div v-for="s in STATS" :key="s.lbl" class="zwh-stat-cell">
            <div class="zwh-stat-cell-lbl">{{ s.lbl }}</div>
            <div class="zwh-stat-cell-val" :class="s.cls">{{ s.val }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent activity -->
    <div v-if="activity.length">
      <div class="zwh-section-label" style="margin-bottom:8px;">Recent Activity</div>
      <div class="zen-card">
        <div v-for="(a, i) in activity" :key="i"
          style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid var(--zg-line);">
          <span class="zwh-sync-dot ok" style="margin-top:5px;flex-shrink:0;" />
          <div style="flex:1;min-width:0;">
            <div style="font-size:12px;color:var(--zg-text);">{{ a.action || a.msg }}</div>
            <div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:2px;">{{ a.actor }} · {{ a.time || fmtTs(a.ts) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
