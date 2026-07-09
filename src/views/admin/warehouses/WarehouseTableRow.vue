<script setup>
import { computed } from 'vue';
import { ZCW_TYPE_META, ZCW_STATUS_META, ZCW_ALERTS as SEED_ALERTS } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });
const emit  = defineEmits(['click']);

const utilPct = (used, total) => total ? Math.round((used / total) * 100) : 0;
const utilCls = (pct) => pct >= 85 ? 'high' : pct >= 60 ? 'mid' : 'low';
const typeMeta = (t) => ZCW_TYPE_META[t] || {};
const statusMeta = (s) => ZCW_STATUS_META[s] || ZCW_STATUS_META.active;

const alerts = computed(() => SEED_ALERTS.filter(a => a.warehouse_id === props.wh.id));
const danger = computed(() => alerts.value.filter(a => a.severity === 'danger').length);
const pct    = computed(() => utilPct(props.wh.capacity.used_m2, props.wh.capacity.m2));
const cls    = computed(() => utilCls(pct.value));
</script>

<template>
  <div class="zwh-table-row" @click="emit('click')">
    <!-- Name + location -->
    <div style="display:flex;flex-direction:column;gap:2px;overflow:hidden;">
      <span class="zwh-table-name">{{ wh.name }}</span>
      <span class="zwh-table-loc">{{ wh.flag }} {{ wh.city }}, {{ wh.country }}</span>
    </div>

    <!-- Type badges -->
    <div style="display:flex;gap:3px;flex-wrap:wrap;">
      <span v-for="t in wh.types" :key="t" class="zwh-type-badge"
        :style="{ color: typeMeta(t).color, background: typeMeta(t).bg, borderColor: typeMeta(t).border }">
        {{ typeMeta(t).label }}
      </span>
    </div>

    <!-- Markets -->
    <div style="display:flex;gap:3px;flex-wrap:wrap;">
      <span v-for="m in wh.markets" :key="m" class="zwh-market-tag">{{ m }}</span>
    </div>

    <!-- Utilization -->
    <div style="display:flex;flex-direction:column;gap:3px;">
      <template v-if="wh.capacity.m2 > 0">
        <div class="zwh-util-track" style="height:4px;">
          <div :class="`zwh-util-fill is-${cls}`" :style="{ width: pct + '%' }" />
        </div>
        <span style="font-size:10px;font-family:var(--zg-mono);"
          :style="{ color: cls==='high'?'var(--zg-danger)':cls==='mid'?'var(--zg-warn)':'var(--zg-good)' }">
          {{ pct }}% · {{ wh.capacity.used_m2.toLocaleString() }} / {{ wh.capacity.m2.toLocaleString() }} m²
        </span>
      </template>
      <span v-else style="font-size:11px;color:var(--zg-text-dim);">Virtual</span>
    </div>

    <!-- SKUs -->
    <div class="zwh-table-mono">{{ wh.stats.total_skus.toLocaleString() }}</div>

    <!-- Alerts -->
    <div>
      <span class="zwh-table-mono"
        :style="{ color: danger>0?'var(--zg-danger)':alerts.length>0?'var(--zg-warn)':'var(--zg-text-dim)' }">
        {{ alerts.length }}
      </span>
    </div>

    <!-- Status -->
    <span class="zwh-status-pill" :style="{ color: statusMeta(wh.status).color, background: statusMeta(wh.status).bg }">
      {{ statusMeta(wh.status).label }}
    </span>
  </div>
