<script setup>
import { ref, computed } from 'vue';
import { ZCW_INBOUND, ZCW_WAREHOUSES } from '@/data/warehouseData';
const emit = defineEmits(['back']);
const filter = ref('all');
const whFilter = ref('all');
const STATUS_MAP = {
  expected:    { label:'Expected',    color:'var(--zg-text-dim)',   bg:'var(--zg-panel-hi)' },
  in_transit:  { label:'In Transit',  color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.12)' },
  arrived:     { label:'Arrived',     color:'var(--zg-warn)',        bg:'oklch(0.82 0.15 75 / 0.12)' },
  receiving:   { label:'Receiving',   color:'var(--zg-accent)',      bg:'oklch(0.78 0.18 130 / 0.12)' },
  received:    { label:'Received',    color:'var(--zg-good)',        bg:'oklch(0.78 0.15 150 / 0.1)' },
  discrepancy: { label:'Discrepancy', color:'var(--zg-danger)',      bg:'oklch(0.70 0.18 25 / 0.1)' },
};
const sm = s => STATUS_MAP[s] || STATUS_MAP.expected;
const all = computed(() => ZCW_INBOUND || []);
const items = computed(() => {
  let rows = all.value;
  if (whFilter.value !== 'all') rows = rows.filter(i => i.warehouse_id === whFilter.value);
  if (filter.value !== 'all') rows = rows.filter(i => i.status === filter.value);
  return rows;
});
const whs = computed(() => ZCW_WAREHOUSES);
const kpis = computed(() => ({
  total: all.value.length,
  arrived: all.value.filter(i=>i.status==='arrived').length,
  receiving: all.value.filter(i=>i.status==='receiving').length,
  discrepancy: all.value.filter(i=>i.status==='discrepancy').length,
}));
</script>
<template>
  <div class="zwh-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <button class="zwh-bc-back" @click="emit('back')"><svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14"/></svg> Warehouses</button>
        <div class="zwh-title" style="margin-left:10px;">Inbound Shipments</div>
        <div class="zwh-subtitle">{{ kpis.total }} shipments · {{ kpis.arrived }} arrived · {{ kpis.discrepancy }} discrepancies</div>
      </div>
      <button class="zwh-btn-primary">+ New Inbound</button>
    </div>
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Total Inbound</span><span class="zwh-kpi-val is-accent">{{ kpis.total }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Arrived</span><span class="zwh-kpi-val is-warn">{{ kpis.arrived }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Receiving</span><span class="zwh-kpi-val">{{ kpis.receiving }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Discrepancies</span><span class="zwh-kpi-val" :class="{ 'is-danger': kpis.discrepancy > 0 }">{{ kpis.discrepancy }}</span></div>
    </div>
    <div class="zwh-filters">
      <button v-for="[v,l] in [['all','All'],['expected','Expected'],['in_transit','In Transit'],['arrived','Arrived'],['received','Received'],['discrepancy','Discrepancy']]" :key="v"
        class="zwh-filter-chip" :class="{ 'is-active': filter===v }" @click="filter=v">{{ l }}</button>
      <div class="zwh-filter-sep" />
      <select class="zwh-filter-chip" v-model="whFilter" style="height:28px;padding:0 8px;background:transparent;border:1px solid var(--zg-line);border-radius:3px;color:var(--zg-text-dim);cursor:pointer;font-size:11px;">
        <option value="all">All Warehouses</option>
        <option v-for="w in whs" :key="w.id" :value="w.id">{{ w.flag }} {{ w.name }}</option>
      </select>
    </div>
    <div class="zwh-content"><div class="zwh-content-pad">
      <div class="zwh-list-table">
        <div class="zwh-list-head">
          <span class="zwh-col w100">ID</span><span class="zwh-col">Vendor / Carrier</span><span class="zwh-col w140">Warehouse</span><span class="zwh-col w60 right">SKUs</span><span class="zwh-col w60 right">Units</span><span class="zwh-col w120">Expected</span><span class="zwh-col w80">Customs</span><span class="zwh-col w110">Status</span>
        </div>
        <div v-for="item in items" :key="item.id" class="zwh-list-row">
          <span class="zwh-col w100 zwh-mono" style="font-size:10.5px;">{{ item.id }}</span>
          <div class="zwh-col" style="display:flex;flex-direction:column;gap:2px;"><span style="font-size:12px;font-weight:600;color:var(--zg-text);">{{ item.vendor }}</span><span style="font-size:11px;color:var(--zg-text-dim);">{{ item.carrier }}</span></div>
          <span class="zwh-col w140" style="font-size:11px;color:var(--zg-text-dim);">{{ item.warehouse_id }}</span>
          <span class="zwh-col w60 right zwh-mono">{{ item.skus }}</span>
          <span class="zwh-col w60 right zwh-mono">{{ item.units }}</span>
          <span class="zwh-col w120" style="font-size:11px;color:var(--zg-text-dim);">{{ item.expected_date }}</span>
          <span class="zwh-col w80"><span v-if="item.customs" style="font-size:9.5px;padding:1px 5px;border-radius:2px;font-weight:600;background:oklch(0.82 0.14 215 / 0.12);color:oklch(0.82 0.14 215);">{{ item.customs }}</span><span v-else style="color:var(--zg-text-dim);font-size:11px;">N/A</span></span>
          <span class="zwh-col w110"><span class="zwh-badge" :style="{ color:sm(item.status).color, background:sm(item.status).bg }">{{ sm(item.status).label }}</span></span>
        </div>
        <div v-if="!items.length" class="zwh-empty"><div class="zwh-empty-title">No inbound shipments match</div></div>
      </div>
    </div></div>
  </div>
</template>
