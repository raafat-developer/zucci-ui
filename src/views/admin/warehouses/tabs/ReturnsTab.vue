<script setup>
import { computed } from 'vue';
import { ZCW_RETURNS } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });
const returns = computed(() => (ZCW_RETURNS || []).filter(r => r.warehouse_id === props.wh.id));

const DISP_COLOR = {
  'Restock':         { color:'var(--zg-good)',   bg:'oklch(0.78 0.15 150 / 0.1)' },
  'Restock (Grade B)':{ color:'var(--zg-accent)', bg:'oklch(0.78 0.18 130 / 0.1)' },
  'Write-off':       { color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.1)' },
  'Vendor Return':   { color:'var(--zg-warn)',   bg:'oklch(0.82 0.15 75 / 0.1)' },
  'Pending QC':      { color:'var(--zg-text-dim)', bg:'var(--zg-panel-hi)' },
};
const dm = d => DISP_COLOR[d] || DISP_COLOR['Pending QC'];
</script>

<template>
  <div class="zwh-tab-body">
    <div v-if="!returns.length" class="zwh-empty">
      <div class="zwh-empty-title">No returns</div>
      <div class="zwh-empty-sub">No returns in the queue for this warehouse.</div>
    </div>
    <div v-else class="zwh-inv-table">
      <div class="zwh-inv-head" style="grid-template-columns:100px 1fr 80px 80px 70px 100px 80px;">
        <span>Return ID</span><span>Item / Vendor</span><span>Market</span><span>Days</span><span>Cond.</span><span>Disposition</span><span>Actions</span>
      </div>
      <div v-for="r in returns" :key="r.id" class="zwh-inv-row" style="grid-template-columns:100px 1fr 80px 80px 70px 100px 80px;">
        <span class="zwh-table-mono" style="font-size:10.5px;">{{ r.id }}</span>
        <div>
          <div style="font-size:12px;font-weight:500;color:var(--zg-text);">{{ r.product || r.item }}</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);">{{ r.vendor }}</div>
        </div>
        <span style="font-size:11px;color:var(--zg-text-dim);">{{ r.market }}</span>
        <span class="zwh-table-mono" :style="{ color: (r.days_waiting||0) >= 120 ? 'var(--zg-danger)' : (r.days_waiting||0) >= 60 ? 'var(--zg-warn)' : 'var(--zg-text)' }">
          {{ r.days_waiting || '—' }}
        </span>
        <span style="font-size:11.5px;color:var(--zg-text-dim);">{{ r.condition || '—' }}</span>
        <span class="zwh-badge" :style="{ color: dm(r.disposition).color, background: dm(r.disposition).bg }">{{ r.disposition || 'Pending QC' }}</span>
        <button class="zwh-btn-ghost" style="height:24px;font-size:11px;" @click="">Inspect</button>
      </div>
    </div>
  </div>
</template>
