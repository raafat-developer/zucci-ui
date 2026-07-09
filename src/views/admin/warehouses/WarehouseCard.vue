<script setup>
/**
 * WarehouseCard — grid card faithful to React WarehouseCard.
 * Shows type badges, status pill, utilization bars, stats, and sync status.
 */
import { computed } from 'vue';
import {
  ZCW_TYPE_META, ZCW_STATUS_META, ZCW_ALERTS as SEED_ALERTS,
} from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });
const emit  = defineEmits(['click']);

const utilPct  = (used, total) => total ? Math.round((used / total) * 100) : 0;
const utilCls  = (pct) => pct >= 85 ? 'high' : pct >= 60 ? 'mid' : 'low';
const fmtSync  = (iso) => {
  if (!iso) return null;
  const diff = Math.round((Date.now() - new Date(iso)) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / 1440)}d ago`;
};

const typeMeta   = (t) => ZCW_TYPE_META[t] || {};
const statusMeta = (s) => ZCW_STATUS_META[s] || ZCW_STATUS_META.active;

const alerts      = computed(() => SEED_ALERTS.filter(a => a.warehouse_id === props.wh.id));
const dangerCount = computed(() => alerts.value.filter(a => a.severity === 'danger').length);
const warnCount   = computed(() => alerts.value.filter(a => a.severity === 'warn').length);

const syncLabel   = computed(() => fmtSync(props.wh.last_sync));
const syncOk      = computed(() => props.wh.last_sync && (Date.now() - new Date(props.wh.last_sync)) < 4 * 3600 * 1000);

function barColor(pct) {
  const cls = utilCls(pct);
  return cls === 'high' ? 'var(--zg-danger)' : cls === 'mid' ? 'var(--zg-warn)' : 'var(--zg-good)';
}
</script>

<template>
  <div class="zwh-card" @click="emit('click')">
    <!-- Head: types + status -->
    <div class="zwh-card-head">
      <div class="zwh-card-badges">
        <span v-for="t in wh.types" :key="t" class="zwh-type-badge"
          :style="{ color: typeMeta(t).color, background: typeMeta(t).bg, borderColor: typeMeta(t).border }">
          {{ typeMeta(t).label }}
        </span>
      </div>
      <span class="zwh-status-pill" :style="{ color: statusMeta(wh.status).color, background: statusMeta(wh.status).bg }">
        {{ statusMeta(wh.status).label }}
      </span>
    </div>

    <!-- Body: name, location, markets, util bars -->
    <div class="zwh-card-body">
      <div class="zwh-card-name">{{ wh.name }}</div>
      <div class="zwh-card-location">
        <span>{{ wh.flag }}</span>
        <span>{{ wh.city }}, {{ wh.country }}</span>
        <span style="color:var(--zg-text-xdim);">·</span>
        <span style="color:var(--zg-text-xdim);font-size:10px;">{{ wh.operator }}</span>
      </div>
      <div v-if="wh.markets?.length" class="zwh-card-markets">
        <span v-for="m in wh.markets" :key="m" class="zwh-market-tag">{{ m }}</span>
      </div>

      <!-- Space utilization bar -->
      <div v-if="wh.capacity.m2 > 0" class="zwh-util-row">
        <span class="zwh-util-label">Space</span>
        <div class="zwh-util-track">
          <div class="zwh-util-fill" :class="`is-${utilCls(utilPct(wh.capacity.used_m2, wh.capacity.m2))}`"
            :style="{ width: utilPct(wh.capacity.used_m2, wh.capacity.m2) + '%' }" />
        </div>
        <span class="zwh-util-pct" :style="{ color: barColor(utilPct(wh.capacity.used_m2, wh.capacity.m2)) }">
          {{ utilPct(wh.capacity.used_m2, wh.capacity.m2) }}%
        </span>
      </div>

      <!-- Bins utilization bar -->
      <div v-if="wh.capacity.bins > 0" class="zwh-util-row">
        <span class="zwh-util-label">Bins</span>
        <div class="zwh-util-track">
          <div class="zwh-util-fill" :class="`is-${utilCls(utilPct(wh.capacity.used_bins, wh.capacity.bins))}`"
            :style="{ width: utilPct(wh.capacity.used_bins, wh.capacity.bins) + '%' }" />
        </div>
        <span class="zwh-util-pct" :style="{ color: barColor(utilPct(wh.capacity.used_bins, wh.capacity.bins)) }">
          {{ utilPct(wh.capacity.used_bins, wh.capacity.bins) }}%
        </span>
      </div>
    </div>

    <!-- Stats strip -->
    <div class="zwh-card-stats">
      <div class="zwh-card-stat">
        <span class="zwh-stat-lbl">SKUs</span>
        <span class="zwh-stat-val">{{ wh.stats.total_skus.toLocaleString() }}</span>
      </div>
      <div class="zwh-card-stat">
        <span class="zwh-stat-lbl">Inbound</span>
        <span class="zwh-stat-val" :class="{ 'is-warn': wh.stats.pending_inbound > 8 }">{{ wh.stats.pending_inbound }}</span>
      </div>
      <div class="zwh-card-stat">
        <span class="zwh-stat-lbl">Alerts</span>
        <span class="zwh-stat-val"
          :class="{ 'is-danger': dangerCount > 0, 'is-warn': !dangerCount && warnCount > 0 }">
          {{ alerts.length }}
        </span>
      </div>
    </div>

    <!-- Sync status -->
    <div v-if="syncLabel" class="zwh-card-sync">
      <span class="zwh-sync-dot" :class="syncOk ? 'ok' : 'warn'" />
      <span>Last sync {{ syncLabel }}</span>
      <span style="margin-left:4px;" :style="{ color: syncOk ? 'var(--zg-good)' : 'var(--zg-warn)' }">
        {{ wh.tech_integration === 'api_wms' ? '· API' : '· Manual' }}
      </span>
    </div>
  </div>
</template>
