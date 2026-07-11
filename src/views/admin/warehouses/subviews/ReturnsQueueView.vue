<script setup>
import { ref, computed } from 'vue';
import { ZCW_RETURNS, ZCW_WAREHOUSES } from '@/data/warehouseData';
const emit = defineEmits(['back']);
const filter = ref('all');
const whFilter = ref('all');
const DISP_MAP = { 'Restock':{color:'var(--zg-good)',bg:'oklch(0.78 0.15 150 / 0.1)'},'Quarantine':{color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.1)'},'Pending':{color:'var(--zg-text-dim)',bg:'var(--zg-panel-hi)'},'Clearance':{color:'oklch(0.85 0.16 55)',bg:'oklch(0.85 0.16 55 / 0.1)'},'Pending WO':{color:'var(--zg-danger)',bg:'oklch(0.70 0.18 25 / 0.1)'} };
const dm = d => DISP_MAP[d] || DISP_MAP['Pending'];
const agingColor = d => d>=180?'var(--zg-danger)':d>=120?'var(--zg-danger)':d>=60?'var(--zg-warn)':'var(--zg-text-dim)';
const all = computed(() => ZCW_RETURNS || []);
const items = computed(() => {
  let rows = all.value;
  if (whFilter.value !== 'all') rows = rows.filter(r => r.warehouse_id === whFilter.value);
  if (filter.value !== 'all') rows = rows.filter(r => r.disposition === filter.value);
  return rows;
});
const whs = computed(() => ZCW_WAREHOUSES);
const kpis = computed(() => ({ total:all.value.length, pending:all.value.filter(r=>r.disposition==='Pending').length, aging120:all.value.filter(r=>r.days_waiting>=120).length, crossBorder:all.value.filter(r=>r.cross_border).length }));
</script>
<template>
  <div class="zwh-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <button class="zwh-bc-back" @click="emit('back')"><svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14"/></svg> Warehouses</button>
        <div class="zwh-title" style="margin-left:10px;">Returns Queue</div>
        <div class="zwh-subtitle">{{ kpis.total }} returns · {{ kpis.aging120 }} aging &gt;120 days · {{ kpis.crossBorder }} cross-border</div>
      </div>
      <button class="zwh-btn-ghost">Export CSV</button>
    </div>
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Total Returns</span><span class="zwh-kpi-val is-accent">{{ kpis.total }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Pending QC</span><span class="zwh-kpi-val is-warn">{{ kpis.pending }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Aging &gt;120d</span><span class="zwh-kpi-val" :class="{ 'is-danger': kpis.aging120 > 0 }">{{ kpis.aging120 }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Cross-Border</span><span class="zwh-kpi-val">{{ kpis.crossBorder }}</span></div>
    </div>
    <div class="zwh-filters">
      <button v-for="[v,l] in [['all','All'],['Restock','Restock'],['Quarantine','Quarantine'],['Pending','Pending QC'],['Clearance','Clearance'],['Pending WO','Write-off']]" :key="v"
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
          <span class="zwh-col w80">ID</span><span class="zwh-col w100">Order #</span><span class="zwh-col">Customer</span><span class="zwh-col w110">SKU</span><span class="zwh-col w140">Warehouse</span><span class="zwh-col w80">Condition</span><span class="zwh-col w60 right">Days</span><span class="zwh-col w80">Origin</span><span class="zwh-col w110">Disposition</span>
        </div>
        <div v-for="r in items" :key="r.id" class="zwh-list-row">
          <span class="zwh-col w80 zwh-mono" style="font-size:11px;">{{ r.id }}</span>
          <span class="zwh-col w100 zwh-mono" style="font-size:10.5px;color:var(--zg-accent);">{{ r.order }}</span>
          <span class="zwh-col" style="font-size:12px;color:var(--zg-text);">{{ r.customer }}</span>
          <span class="zwh-col w110 zwh-mono" style="font-size:10.5px;">{{ r.sku }}</span>
          <span class="zwh-col w140" style="font-size:11px;color:var(--zg-text-dim);">{{ r.warehouse_id }}</span>
          <span class="zwh-col w80" style="font-size:12px;" :style="{ color: r.condition==='Damaged'?'var(--zg-danger)':'var(--zg-good)' }">{{ r.condition }}</span>
          <span class="zwh-col w60 right zwh-mono" :style="{ color: agingColor(r.days_waiting) }">{{ r.days_waiting }}</span>
          <div class="zwh-col w80" style="display:flex;align-items:center;gap:4px;">
            <span v-if="r.cross_border" style="font-size:9px;background:oklch(0.82 0.14 215 / 0.15);color:oklch(0.82 0.14 215);padding:1px 4px;border-radius:2px;">XBDR</span>
            <span style="font-size:11px;color:var(--zg-text-dim);">{{ r.origin }}</span>
          </div>
          <span class="zwh-col w110"><span class="zwh-badge" :style="{ color:dm(r.disposition).color, background:dm(r.disposition).bg }">{{ r.disposition }}</span></span>
        </div>
        <div v-if="!items.length" class="zwh-empty"><div class="zwh-empty-title">No returns match</div></div>
      </div>
    </div></div>
  </div>
</template>
