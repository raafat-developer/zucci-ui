<script setup>
import { ref, computed } from 'vue';
import { ZCW_INBOUND } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });
const filter = ref('all');

const STATUS_MAP = {
  expected:    { label:'Expected',    color:'var(--zg-text-dim)',   bg:'var(--zg-panel-hi)' },
  in_transit:  { label:'In Transit',  color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.12)' },
  arrived:     { label:'Arrived',     color:'var(--zg-warn)',        bg:'oklch(0.82 0.15 75 / 0.12)' },
  receiving:   { label:'Receiving',   color:'var(--zg-accent)',      bg:'oklch(0.78 0.18 130 / 0.12)' },
  received:    { label:'Received',    color:'var(--zg-good)',        bg:'oklch(0.78 0.15 150 / 0.1)' },
  discrepancy: { label:'Discrepancy', color:'var(--zg-danger)',      bg:'oklch(0.70 0.18 25 / 0.1)' },
};
const sm = s => STATUS_MAP[s] || STATUS_MAP.expected;

const all  = computed(() => (ZCW_INBOUND || []).filter(i => i.warehouse_id === props.wh.id));
const items = computed(() => filter.value === 'all' ? all.value : all.value.filter(i => i.status === filter.value));
const counts = computed(() => {
  const c = {};
  Object.keys(STATUS_MAP).forEach(s => { c[s] = all.value.filter(i => i.status === s).length; });
  return c;
});
</script>

<template>
  <div class="zwh-tab-body">
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;justify-content:space-between;">
      <div style="display:flex;gap:5px;flex-wrap:wrap;">
        <button v-for="[v,l] in [['all','All'],['expected','Expected'],['in_transit','In Transit'],['arrived','Arrived'],['received','Received'],['discrepancy','Discrepancy']]" :key="v"
          class="zwh-filter-chip" :class="{ 'is-active': filter === v }" @click="filter = v">
          {{ l }}<span v-if="v !== 'all' && counts[v]" style="margin-left:4px;opacity:0.7;">{{ counts[v] }}</span>
        </button>
      </div>
      <button class="zwh-btn-primary" style="height:28px;font-size:11.5px;" @click="">+ New Inbound</button>
    </div>

    <div v-if="!items.length" class="zwh-empty">
      <div class="zwh-empty-title">No inbound shipments</div>
      <div class="zwh-empty-sub">No scheduled or in-transit inbound for this warehouse</div>
    </div>

    <div v-else class="zwh-list-table">
      <div class="zwh-list-head">
        <span class="zwh-col w100">Shipment</span><span class="zwh-col">Vendor / Carrier</span><span class="zwh-col w60 right">SKUs</span><span class="zwh-col w60 right">Units</span><span class="zwh-col w120">Expected</span><span class="zwh-col w80">Customs</span><span class="zwh-col w110">Status</span>
      </div>
      <div v-for="item in items" :key="item.id" class="zwh-list-row">
        <span class="zwh-col w100 zwh-mono" style="font-size:10.5px;">{{ item.id }}</span>
        <div class="zwh-col" style="display:flex;flex-direction:column;gap:2px;">
          <span style="font-size:12px;font-weight:600;color:var(--zg-text);">{{ item.vendor }}</span>
          <span style="font-size:11px;color:var(--zg-text-dim);">{{ item.carrier }}</span>
        </div>
        <span class="zwh-col w60 right zwh-mono">{{ item.skus }}</span>
        <span class="zwh-col w60 right zwh-mono">{{ item.units }}</span>
        <span class="zwh-col w120" style="font-size:11px;color:var(--zg-text-dim);">{{ item.expected_date }}</span>
        <span class="zwh-col w80">
          <span v-if="item.customs" style="font-size:9.5px;padding:1px 5px;border-radius:2px;font-weight:600;background:oklch(0.82 0.14 215 / 0.12);color:oklch(0.82 0.14 215);">{{ item.customs }}</span>
          <span v-else style="font-size:11px;color:var(--zg-text-dim);">N/A</span>
        </span>
        <span class="zwh-col w110"><span class="zwh-badge" :style="{ color:sm(item.status).color, background:sm(item.status).bg }">{{ sm(item.status).label }}</span></span>
      </div>
    </div>
  </div>
</template>
