<script setup>
import { ref, computed } from 'vue';
import { ZCW_INVENTORY_ALL, ZCW_WAREHOUSES } from '@/data/warehouseData';
const emit = defineEmits(['back']);
const whFilter = ref('all');
const AGING_BANDS = [
  { key:'D0-D30',   label:'D0–30',   color:'var(--zg-good)',   days:[0,30] },
  { key:'D30-D60',  label:'D30–60',  color:'oklch(0.82 0.14 215)', days:[30,60] },
  { key:'D60-D90',  label:'D60–90',  color:'var(--zg-warn)',   days:[60,90] },
  { key:'D90-D120', label:'D90–120', color:'var(--zg-danger)', days:[90,120] },
  { key:'D120+',    label:'D120+',   color:'var(--zg-danger)', days:[120,99999] },
];
const whs = ZCW_WAREHOUSES;
const all = computed(() => {
  let rows = ZCW_INVENTORY_ALL || [];
  if (whFilter.value !== 'all') rows = rows.filter(i => i.warehouse_id === whFilter.value);
  return rows.filter(i => (i.age||0) > 0);
});
const inBand = (band) => all.value.filter(i => (i.age||0) >= band.days[0] && (i.age||0) < band.days[1]);
const totalCost = (rows) => rows.reduce((s,i) => s + (i.daily_cost||0)*(i.age||0), 0);
const sel = ref('D120+');
const selItems = computed(() => {
  const band = AGING_BANDS.find(b => b.key === sel.value);
  if (!band) return all.value;
  return all.value.filter(i => (i.age||0) >= band.days[0] && (i.age||0) < band.days[1]);
});
</script>
<template>
  <div class="zwh-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <button class="zwh-bc-back" @click="emit('back')"><svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14"/></svg> Warehouses</button>
        <div class="zwh-title" style="margin-left:10px;">Aging Dashboard</div>
        <div class="zwh-subtitle">{{ all.length }} aged items · AED {{ totalCost(all).toFixed(0) }} accrued</div>
      </div>
      <div class="zwh-header-right">
        <select class="zwh-filter-chip" v-model="whFilter" style="height:28px;padding:0 8px;background:transparent;border:1px solid var(--zg-line);border-radius:3px;color:var(--zg-text-dim);cursor:pointer;font-size:11px;">
          <option value="all">All Warehouses</option>
          <option v-for="w in whs" :key="w.id" :value="w.id">{{ w.flag }} {{ w.name }}</option>
        </select>
        <button class="zwh-btn-primary">Bulk Write-Off</button>
      </div>
    </div>

    <!-- Aging bands strip -->
    <div class="zwh-kpi-strip" style="grid-template-columns:repeat(5,1fr);">
      <div v-for="band in AGING_BANDS" :key="band.key" class="zwh-kpi-cell"
        style="cursor:pointer;transition:background .1s;" :style="{ borderBottom: sel===band.key?'2px solid '+band.color:'2px solid transparent' }"
        @click="sel = band.key">
        <span class="zwh-kpi-lbl">{{ band.label }}</span>
        <span class="zwh-kpi-val" :style="{ color: band.color }">{{ inBand(band).length }}</span>
        <span class="zwh-kpi-sub" style="color:var(--zg-warn);">AED {{ totalCost(inBand(band)).toFixed(0) }}</span>
      </div>
    </div>

    <!-- Items in selected band -->
    <div class="zwh-content"><div class="zwh-content-pad">
      <div style="font-size:11px;color:var(--zg-text-dim);margin-bottom:8px;">{{ selItems.length }} items in {{ AGING_BANDS.find(b=>b.key===sel)?.label }} band</div>
      <div class="zwh-list-table">
        <div class="zwh-list-head">
          <span class="zwh-col" style="flex:1.2;">SKU / Product</span>
          <span class="zwh-col w120">Vendor</span>
          <span class="zwh-col w140">Warehouse</span>
          <span class="zwh-col w60 right">Qty</span>
          <span class="zwh-col w70">Bin</span>
          <span class="zwh-col w70 right">Age (d)</span>
          <span class="zwh-col w90 right">Accrued (AED)</span>
          <span class="zwh-col w80">Action</span>
        </div>
        <div v-for="(item,i) in selItems" :key="i" class="zwh-list-row">
          <div class="zwh-col" style="flex:1.2;display:flex;flex-direction:column;gap:2px;overflow:hidden;">
            <span style="font-weight:600;font-size:12px;color:var(--zg-text);font-family:var(--zg-mono);">{{ item.sku }}</span>
            <span style="font-size:11px;color:var(--zg-text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ item.name }}</span>
          </div>
          <span class="zwh-col w120 zwh-dim" style="font-size:11.5px;">{{ item.vendor }}</span>
          <span class="zwh-col w140" style="font-size:11px;color:var(--zg-text-dim);">{{ item.warehouse_id }}</span>
          <span class="zwh-col w60 right zwh-mono">{{ item.qty }}</span>
          <span class="zwh-col w70 zwh-mono" style="font-size:10.5px;">{{ item.bin }}</span>
          <span class="zwh-col w70 right zwh-mono" :style="{ color: item.age>=120?'var(--zg-danger)':item.age>=60?'var(--zg-warn)':'var(--zg-text)' }">{{ item.age }}</span>
          <span class="zwh-col w90 right zwh-mono" style="color:var(--zg-danger);">{{ ((item.daily_cost||0)*(item.age||0)).toFixed(0) }}</span>
          <div class="zwh-col w80" style="display:flex;gap:4px;">
            <button class="zwh-btn-ghost" style="height:22px;font-size:10px;padding:0 6px;" @click="">Write-off</button>
          </div>
        </div>
        <div v-if="!selItems.length" class="zwh-empty"><div class="zwh-empty-sub">No items in this aging band</div></div>
      </div>
    </div></div>
  </div>
</template>
