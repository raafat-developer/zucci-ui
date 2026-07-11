<script setup>
import { ref, computed } from 'vue';

const props = defineProps({ wh: { type: Object, required: true } });
const filter = ref('all');

const STATUS_MAP = {
  pending_pick: { label:'Pending Pick', color:'var(--zg-text-dim)',   bg:'var(--zg-panel-hi)' },
  picking:      { label:'Picking',      color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.1)' },
  packed:       { label:'Packed',       color:'var(--zg-warn)',        bg:'oklch(0.82 0.15 75 / 0.1)' },
  dispatched:   { label:'Dispatched',   color:'var(--zg-accent)',      bg:'oklch(0.78 0.18 130 / 0.1)' },
  delivered:    { label:'Delivered',    color:'var(--zg-good)',        bg:'oklch(0.78 0.15 150 / 0.1)' },
};
const sm = s => STATUS_MAP[s] || STATUS_MAP.pending_pick;

const MOCK = computed(() => Array.from({ length: Math.min(props.wh.stats.pending_outbound || 0, 8) }, (_, i) => ({
  id: `OUT-${props.wh.id.slice(-3)}-${1000+i}`,
  orderId: `ORD-${88000+i*41}`,
  customer: ['Layla Al-Mansouri','Ahmed Khalid','Sara Ibrahim','Omar Yousef'][i%4],
  destination: ['Dubai','Riyadh','Cairo','Kuwait City'][i%4],
  items: 1+(i%3), carrier: ['Aramex','SMSA','Bosta','DHL'][i%4],
  status: ['pending_pick','picking','packed','dispatched'][i%4],
  cod: i%3===0,
})));

const items = computed(() => filter.value === 'all' ? MOCK.value : MOCK.value.filter(i => i.status === filter.value));
</script>

<template>
  <div class="zwh-tab-body">
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;">
      <button v-for="[v,l] in [['all','All'],['pending_pick','Pending Pick'],['picking','Picking'],['packed','Packed'],['dispatched','Dispatched']]" :key="v"
        class="zwh-filter-chip" :class="{ 'is-active': filter === v }" @click="filter = v">{{ l }}</button>
    </div>

    <div v-if="!items.length" class="zwh-empty">
      <div class="zwh-empty-title">No outbound orders</div>
      <div class="zwh-empty-sub">No pending outbound shipments for this warehouse</div>
    </div>

    <div v-else class="zwh-list-table">
      <div class="zwh-list-head">
        <span class="zwh-col w100">Shipment</span><span class="zwh-col w100">Order</span><span class="zwh-col">Customer</span><span class="zwh-col">Destination</span><span class="zwh-col w50 right">Items</span><span class="zwh-col w100">Carrier</span><span class="zwh-col w80">COD</span><span class="zwh-col w110">Status</span>
      </div>
      <div v-for="item in items" :key="item.id" class="zwh-list-row">
        <span class="zwh-col w100 zwh-mono" style="font-size:10.5px;">{{ item.id }}</span>
        <span class="zwh-col w100 zwh-mono" style="font-size:10.5px;color:var(--zg-accent);">{{ item.orderId }}</span>
        <span class="zwh-col" style="font-size:12px;">{{ item.customer }}</span>
        <span class="zwh-col" style="font-size:12px;color:var(--zg-text);">{{ item.destination }}</span>
        <span class="zwh-col w50 right zwh-mono">{{ item.items }}</span>
        <span class="zwh-col w100" style="font-size:11.5px;color:var(--zg-text-dim);">{{ item.carrier }}</span>
        <span class="zwh-col w80">
          <span v-if="item.cod" style="font-size:10px;padding:1px 5px;border-radius:2px;background:oklch(0.82 0.15 75 / 0.12);color:var(--zg-warn);font-weight:700;">COD</span>
        </span>
        <span class="zwh-col w110"><span class="zwh-badge" :style="{ color:sm(item.status).color, background:sm(item.status).bg }">{{ sm(item.status).label }}</span></span>
      </div>
    </div>
  </div>
</template>
