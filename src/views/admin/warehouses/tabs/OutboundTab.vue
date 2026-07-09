<script setup>
import { computed } from 'vue';
const props = defineProps({ wh: { type: Object, required: true } });

// Outbound = pending_outbound from stats; generate mock rows
const MOCK_OUTBOUND = Array.from({ length: Math.min(props.wh.stats.pending_outbound || 0, 6) }, (_, i) => ({
  id: `OUT-${props.wh.id.slice(-3)}-${1000 + i}`,
  orderId: `ORD-${88000 + i * 41}`,
  destination: ['Dubai', 'Riyadh', 'Cairo', 'Kuwait City', 'Doha'][i % 5],
  items: 1 + (i % 3),
  carrier: ['Aramex', 'SMSA Express', 'Bosta', 'DHL'][i % 4],
  status: ['pending_pick', 'picking', 'packed', 'dispatched'][i % 4],
}));

const STATUS = {
  pending_pick: { label:'Pending Pick', color:'var(--zg-text-dim)',   bg:'var(--zg-panel-hi)' },
  picking:      { label:'Picking',      color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.1)' },
  packed:       { label:'Packed',       color:'var(--zg-warn)',        bg:'oklch(0.82 0.15 75 / 0.1)' },
  dispatched:   { label:'Dispatched',   color:'var(--zg-good)',        bg:'oklch(0.78 0.15 150 / 0.1)' },
};
const sm = s => STATUS[s] || STATUS.pending_pick;
</script>

<template>
  <div class="zwh-tab-body">
    <div v-if="!MOCK_OUTBOUND.length" class="zwh-empty">
      <div class="zwh-empty-title">No outbound orders</div>
      <div class="zwh-empty-sub">No pending outbound shipments for this warehouse.</div>
    </div>
    <div v-else class="zwh-inv-table">
      <div class="zwh-inv-head" style="grid-template-columns:100px 100px 1fr 60px 100px 100px;">
        <span>Shipment</span><span>Order</span><span>Destination</span><span>Items</span><span>Carrier</span><span>Status</span>
      </div>
      <div v-for="row in MOCK_OUTBOUND" :key="row.id" class="zwh-inv-row" style="grid-template-columns:100px 100px 1fr 60px 100px 100px;">
        <span class="zwh-table-mono" style="font-size:10.5px;">{{ row.id }}</span>
        <span class="zwh-table-mono" style="font-size:10.5px;color:var(--zg-accent);">{{ row.orderId }}</span>
        <span style="font-size:12px;color:var(--zg-text);">{{ row.destination }}</span>
        <span class="zwh-table-mono">{{ row.items }}</span>
        <span style="font-size:11.5px;color:var(--zg-text-dim);">{{ row.carrier }}</span>
        <span class="zwh-badge" :style="{ color: sm(row.status).color, background: sm(row.status).bg }">{{ sm(row.status).label }}</span>
      </div>
    </div>
  </div>
</template>
