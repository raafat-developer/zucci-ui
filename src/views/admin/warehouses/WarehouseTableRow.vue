<script setup>
import { computed } from 'vue';
import { ZCW_TYPE_META, ZCW_STATUS_META, ZCW_ALERTS } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });
const emit  = defineEmits(['click']);

const utilPct  = (used, total) => total ? Math.round((used/total)*100) : 0;
const utilCls  = pct => pct >= 85 ? 'high' : pct >= 60 ? 'mid' : 'low';
const utilColor = pct => pct >= 85 ? 'var(--zg-danger)' : pct >= 60 ? 'var(--zg-warn)' : 'var(--zg-good)';
const typeMeta  = t => ZCW_TYPE_META[t] || {};
const statMeta  = s => ZCW_STATUS_META[s] || ZCW_STATUS_META.active;
const pct     = computed(() => utilPct(props.wh.capacity.used_m2, props.wh.capacity.m2));
const cls     = computed(() => utilCls(pct.value));
const alerts  = computed(() => ZCW_ALERTS.filter(a => a.warehouse_id === props.wh.id));
const danger  = computed(() => alerts.value.filter(a => a.severity === 'danger').length);
</script>

<template>
  <div class="zwh-table-row" @click="emit('click')">
    <div style="display:flex;flex-direction:column;gap:2px;overflow:hidden;">
      <span class="zwh-table-name">{{ wh.name }}</span>
      <span class="zwh-table-loc">{{ wh.flag }} {{ wh.city }}, {{ wh.country }}</span>
    </div>
    <div style="display:flex;gap:3px;flex-wrap:wrap;">
      <span v-for="t in wh.types" :key="t" class="zwh-type-badge"
        :style="{ color:typeMeta(t).color, background:typeMeta(t).bg, borderColor:typeMeta(t).border }">
        {{ typeMeta(t).label }}
      </span>
    </div>
    <div style="display:flex;gap:3px;flex-wrap:wrap;">
      <span v-for="m in wh.markets" :key="m" class="zwh-market-tag">{{ m }}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:3px;">
      <template v-if="wh.capacity.m2 > 0">
        <div class="zwh-util-track" style="height:4px;"><div :class="`zwh-util-fill is-${cls}`" :style="{ width: pct+'%' }" /></div>
        <span style="font-size:10px;font-family:var(--zg-mono);" :style="{ color: utilColor(pct) }">{{ pct }}% · {{ wh.capacity.used_m2.toLocaleString() }} / {{ wh.capacity.m2.toLocaleString() }} m²</span>
      </template>
      <span v-else style="font-size:11px;color:var(--zg-text-dim);">Virtual</span>
    </div>
    <div class="zwh-table-mono">{{ wh.stats.total_skus.toLocaleString() }}</div>
    <div><span class="zwh-table-mono" :style="{ color: danger>0?'var(--zg-danger)':alerts.length>0?'var(--zg-warn)':'var(--zg-text-dim)' }">{{ alerts.length }}</span></div>
    <span class="zwh-status-pill" :style="{ color:statMeta(wh.status).color, background:statMeta(wh.status).bg }">{{ statMeta(wh.status).label }}</span>
  </div>
</template>
