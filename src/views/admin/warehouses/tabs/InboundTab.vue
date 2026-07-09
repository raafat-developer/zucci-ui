<script setup>
import { computed } from 'vue';
import { ZCW_INBOUND } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });
const items = computed(() => (ZCW_INBOUND || []).filter(i => i.warehouse_id === props.wh.id));

const STATUS = {
  expected:   { label:'Expected',   color:'var(--zg-text-dim)',  bg:'var(--zg-panel-hi)' },
  in_transit: { label:'In Transit', color:'var(--zg-accent)',    bg:'oklch(0.78 0.18 130 / 0.1)' },
  arrived:    { label:'Arrived',    color:'var(--zg-warn)',      bg:'oklch(0.82 0.15 75 / 0.1)' },
  received:   { label:'Received',   color:'var(--zg-good)',      bg:'oklch(0.78 0.15 150 / 0.1)' },
  discrepancy:{ label:'Discrepancy',color:'var(--zg-danger)',    bg:'oklch(0.70 0.18 25 / 0.1)' },
};
const sm = s => STATUS[s] || STATUS.expected;
</script>

<template>
  <div class="zwh-tab-body">
    <div v-if="!items.length" class="zwh-empty">
      <div class="zwh-empty-title">No inbound shipments</div>
      <div class="zwh-empty-sub">No scheduled or in-transit inbound shipments for this warehouse.</div>
    </div>
    <div v-else class="zwh-inv-table">
      <div class="zwh-inv-head" style="grid-template-columns:100px 1fr 80px 80px 100px 80px;">
        <span>Shipment ID</span><span>Vendor / Carrier</span><span>SKUs</span><span>Units</span><span>Expected</span><span>Status</span>
      </div>
      <div v-for="item in items" :key="item.id" class="zwh-inv-row" style="grid-template-columns:100px 1fr 80px 80px 100px 80px;">
        <span class="zwh-table-mono" style="font-size:10.5px;">{{ item.id }}</span>
        <div>
          <div style="font-size:12px;font-weight:500;color:var(--zg-text);">{{ item.vendor }}</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);">{{ item.carrier }}</div>
        </div>
        <span class="zwh-table-mono">{{ item.skus }}</span>
        <span class="zwh-table-mono">{{ item.units }}</span>
        <span style="font-size:11.5px;color:var(--zg-text-dim);">{{ item.expected_date }}</span>
        <span class="zwh-badge" :style="{ color: sm(item.status).color, background: sm(item.status).bg }">{{ sm(item.status).label }}</span>
      </div>
    </div>
  </div>
</template>
