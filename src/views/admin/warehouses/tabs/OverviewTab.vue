<script setup>
import { computed } from 'vue';
import { ZCW_ALERTS, ZCW_ACTIVITY, ZCW_INVENTORY } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });

const utilPct2 = (u, t) => t ? Math.round((u/t)*100) : 0;
const utilCls  = pct => pct >= 85 ? 'high' : pct >= 60 ? 'mid' : 'low';
const utilColor = pct => pct >= 85 ? 'var(--zg-danger)' : pct >= 60 ? 'var(--zg-warn)' : 'var(--zg-good)';
const fmtTs = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) + ' · ' + d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
};
const fmtCur = (n, cur) => `${cur} ${Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;

const alerts   = computed(() => ZCW_ALERTS.filter(a => a.warehouse_id === props.wh.id));
const activity = computed(() => ZCW_ACTIVITY[props.wh.id] || []);
const inv      = computed(() => ZCW_INVENTORY[props.wh.id] || []);
const totalDailyCost = computed(() => inv.value.reduce((s,i) => s + (i.daily_cost||0), 0));

const gauges = computed(() => [
  props.wh.capacity.m2      > 0 ? { label:'Floor Space',       used:props.wh.capacity.used_m2,      total:props.wh.capacity.m2,      unit:'m²'      } : null,
  props.wh.capacity.pallets > 0 ? { label:'Pallet Positions',  used:props.wh.capacity.used_pallets,  total:props.wh.capacity.pallets,  unit:'pallets' } : null,
  props.wh.capacity.bins    > 0 ? { label:'Bin Locations',     used:props.wh.capacity.used_bins,     total:props.wh.capacity.bins,     unit:'bins'    } : null,
].filter(Boolean));
</script>

<template>
  <div class="zwh-tab-body">
    <!-- Alerts -->
    <div v-if="alerts.length" style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
      <div class="zwh-section-label">Active Alerts</div>
      <div v-for="a in alerts" :key="a.id" :class="`zwh-alert-item ${a.severity}`">
        <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 2L13 12H1L7 2Z"/><line x1="7" y1="6" x2="7" y2="8.5"/><circle cx="7" cy="10.5" r="0.5" fill="currentColor"/></svg>
        <span style="flex:1;">{{ a.msg }}</span>
        <span class="zwh-alert-time">{{ fmtTs(a.created) }}</span>
      </div>
    </div>

    <div class="zwh-ov-grid">
      <!-- Capacity -->
      <div class="zwh-card-panel">
        <div class="zwh-panel-head">Capacity Utilization <span class="zwh-panel-sub">{{ wh.currency }} / day</span></div>
        <div class="zwh-panel-body">
          <template v-if="gauges.length">
            <div v-for="g in gauges" :key="g.label" class="zwh-gauge-row">
              <div class="zwh-gauge-header">
                <span class="zwh-gauge-title">{{ g.label }}</span>
                <span class="zwh-gauge-nums">{{ g.used.toLocaleString() }} / {{ g.total.toLocaleString() }} {{ g.unit }}</span>
              </div>
              <div class="zwh-gauge-track"><div :class="`zwh-gauge-fill ${utilCls(utilPct2(g.used, g.total))}`" :style="{ width: utilPct2(g.used, g.total)+'%' }" /></div>
              <div class="zwh-gauge-footer">
                <span class="zwh-gauge-pct" :style="{ color: utilColor(utilPct2(g.used, g.total)) }">{{ utilPct2(g.used, g.total) }}%</span>
                <span class="zwh-gauge-free">{{ (g.total - g.used).toLocaleString() }} {{ g.unit }} free</span>
              </div>
            </div>
          </template>
          <div v-else style="color:var(--zg-text-dim);font-size:12px;padding:8px 0;">Virtual warehouse — no physical capacity tracked.</div>
        </div>
      </div>

      <!-- Stats + Daily cost -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="zwh-stats-grid">
          <div class="zwh-stat-cell"><div class="zwh-stat-cell-lbl">Total SKUs</div><div class="zwh-stat-cell-val accent">{{ wh.stats.total_skus.toLocaleString() }}</div></div>
          <div class="zwh-stat-cell"><div class="zwh-stat-cell-lbl">Active Vendors</div><div class="zwh-stat-cell-val">{{ wh.stats.active_vendors }}</div></div>
          <div class="zwh-stat-cell"><div class="zwh-stat-cell-lbl">Pending Inbound</div><div class="zwh-stat-cell-val" :class="{ warn: wh.stats.pending_inbound > 8 }">{{ wh.stats.pending_inbound }}</div></div>
          <div class="zwh-stat-cell"><div class="zwh-stat-cell-lbl">Pending Outbound</div><div class="zwh-stat-cell-val">{{ wh.stats.pending_outbound }}</div></div>
          <div class="zwh-stat-cell"><div class="zwh-stat-cell-lbl">Returns Queue</div><div class="zwh-stat-cell-val" :class="{ warn: wh.stats.pending_returns > 5 }">{{ wh.stats.pending_returns }}</div></div>
          <div class="zwh-stat-cell"><div class="zwh-stat-cell-lbl">Open Transfers</div><div class="zwh-stat-cell-val">{{ wh.stats.open_transfers }}</div></div>
        </div>

        <div v-if="totalDailyCost > 0" class="zwh-card-panel">
          <div class="zwh-panel-head">Accruing Daily Cost</div>
          <div class="zwh-panel-body" style="gap:6px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <span style="font-size:11.5px;color:var(--zg-text-dim);">Storage (tracked SKUs)</span>
              <span style="font-family:var(--zg-mono);font-size:13px;font-weight:600;color:var(--zg-warn);">{{ fmtCur(totalDailyCost, wh.currency) }}/day</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="font-size:11.5px;color:var(--zg-text-dim);">Handling fee rate</span>
              <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text-mid);">{{ wh.currency }} {{ wh.costs.handling_fee }}/unit</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="font-size:11.5px;color:var(--zg-text-dim);">Fulfillment fee rate</span>
              <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text-mid);">{{ wh.currency }} {{ wh.costs.fulfillment_fee }}/order</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity -->
    <div v-if="activity.length" class="zwh-card-panel" style="margin-top:14px;">
      <div class="zwh-panel-head">Recent Activity</div>
      <div style="padding:0 14px;">
        <div class="zwh-activity-log">
          <div v-for="(a, i) in activity" :key="i" class="zwh-act-item">
            <span :class="`zwh-act-dot ${a.type}`" />
            <span class="zwh-act-msg">{{ a.msg }}</span>
            <div class="zwh-act-meta">
              <span class="zwh-act-actor">{{ a.actor }}</span>
              <span class="zwh-act-time">{{ fmtTs(a.ts) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
