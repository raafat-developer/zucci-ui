<script setup>
import { computed } from 'vue';
import { ZCW_TRANSFERS } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });
const transfers = computed(() => (ZCW_TRANSFERS || []).filter(t => t.from_id === props.wh.id || t.to_id === props.wh.id));

const STATUS = {
  requested:   { label:'Requested',   color:'var(--zg-text-dim)',   bg:'var(--zg-panel-hi)' },
  approved:    { label:'Approved',    color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.1)' },
  in_transit:  { label:'In Transit',  color:'var(--zg-warn)',       bg:'oklch(0.82 0.15 75 / 0.1)' },
  completed:   { label:'Completed',   color:'var(--zg-good)',       bg:'oklch(0.78 0.15 150 / 0.1)' },
  cancelled:   { label:'Cancelled',   color:'var(--zg-danger)',     bg:'oklch(0.70 0.18 25 / 0.1)' },
};
const sm = s => STATUS[s] || STATUS.requested;
</script>

<template>
  <div class="zwh-tab-body">
    <div style="display:flex;justify-content:flex-end;margin-bottom:10px;">
      <button class="zwh-btn-primary" @click="">+ New Transfer</button>
    </div>
    <div v-if="!transfers.length" class="zwh-empty">
      <div class="zwh-empty-title">No transfers</div>
      <div class="zwh-empty-sub">No stock transfers for this warehouse.</div>
    </div>
    <div v-else class="zwh-inv-table">
      <div class="zwh-inv-head" style="grid-template-columns:100px 1fr 1fr 60px 100px 80px;">
        <span>Transfer ID</span><span>From</span><span>To</span><span>Units</span><span>ETA</span><span>Status</span>
      </div>
      <div v-for="t in transfers" :key="t.id" class="zwh-inv-row" style="grid-template-columns:100px 1fr 1fr 60px 100px 80px;">
        <span class="zwh-table-mono" style="font-size:10.5px;">{{ t.id }}</span>
        <div style="font-size:11.5px;color:var(--zg-text);">{{ t.from_name || t.from_id }}</div>
        <div style="font-size:11.5px;color:var(--zg-text);">{{ t.to_name || t.to_id }}</div>
        <span class="zwh-table-mono">{{ t.total_units || t.units || '—' }}</span>
        <span style="font-size:11px;color:var(--zg-text-dim);">{{ t.eta || '—' }}</span>
        <span class="zwh-badge" :style="{ color: sm(t.status).color, background: sm(t.status).bg }">{{ sm(t.status).label }}</span>
      </div>
    </div>
  </div>
</template>
