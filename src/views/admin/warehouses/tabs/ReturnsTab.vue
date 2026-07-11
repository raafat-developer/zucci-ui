<script setup>
import { ref, computed } from 'vue';
import { ZCW_RETURNS } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });
const filter = ref('all');

const DISP_MAP = {
  'Restock':    { color:'var(--zg-good)',   bg:'oklch(0.78 0.15 150 / 0.1)' },
  'Quarantine': { color:'var(--zg-warn)',   bg:'oklch(0.82 0.15 75 / 0.1)' },
  'Pending':    { color:'var(--zg-text-dim)', bg:'var(--zg-panel-hi)' },
  'Clearance':  { color:'oklch(0.85 0.16 55)', bg:'oklch(0.85 0.16 55 / 0.1)' },
  'Pending WO': { color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.1)' },
};
const dm = d => DISP_MAP[d] || DISP_MAP['Pending'];

const all   = computed(() => (ZCW_RETURNS || []).filter(r => r.warehouse_id === props.wh.id));
const items = computed(() => filter.value === 'all' ? all.value : all.value.filter(r => r.disposition === filter.value));
const crossBorder = computed(() => all.value.filter(r => r.cross_border));
const agingColor = days => days >= 180 ? 'var(--zg-danger)' : days >= 120 ? 'var(--zg-danger)' : days >= 60 ? 'var(--zg-warn)' : 'var(--zg-text-dim)';
</script>

<template>
  <div class="zwh-tab-body">
    <div v-if="crossBorder.length" class="zwh-alert-item warn" style="margin-bottom:8px;">
      <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 2L13 12H1L7 2Z"/><line x1="7" y1="6" x2="7" y2="8.5"/><circle cx="7" cy="10.5" r="0.5" fill="currentColor"/></svg>
      <span>{{ crossBorder.length }} cross-border return{{ crossBorder.length > 1 ? 's' : '' }} — import duties may apply</span>
    </div>

    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;">
      <button v-for="[v,l] in [['all','All'],['Restock','Restock'],['Quarantine','Quarantine'],['Pending','Pending'],['Clearance','Clearance'],['Pending WO','Write-off']]" :key="v"
        class="zwh-filter-chip" :class="{ 'is-active': filter === v }" @click="filter = v">{{ l }}</button>
    </div>

    <div v-if="!items.length" class="zwh-empty">
      <div class="zwh-empty-title">No pending returns</div>
      <div class="zwh-empty-sub">All returns have been processed</div>
    </div>

    <div v-else class="zwh-list-table">
      <div class="zwh-list-head">
        <span class="zwh-col w80">ID</span><span class="zwh-col w100">Order #</span><span class="zwh-col">Customer</span><span class="zwh-col w110">SKU</span><span class="zwh-col w80">Condition</span><span class="zwh-col w60 right">Days</span><span class="zwh-col w80">Origin</span><span class="zwh-col w110">Disposition</span>
      </div>
      <div v-for="item in items" :key="item.id" class="zwh-list-row">
        <span class="zwh-col w80 zwh-mono" style="font-size:11px;">{{ item.id }}</span>
        <span class="zwh-col w100 zwh-mono" style="font-size:10.5px;color:var(--zg-accent);">{{ item.order }}</span>
        <span class="zwh-col" style="font-size:12px;color:var(--zg-text);">{{ item.customer }}</span>
        <span class="zwh-col w110 zwh-mono" style="font-size:10.5px;">{{ item.sku }}</span>
        <span class="zwh-col w80" style="font-size:12px;" :style="{ color: item.condition === 'Damaged' ? 'var(--zg-danger)' : 'var(--zg-good)' }">{{ item.condition }}</span>
        <span class="zwh-col w60 right zwh-mono" :style="{ color: agingColor(item.days_waiting) }">{{ item.days_waiting }}</span>
        <div class="zwh-col w80" style="display:flex;align-items:center;gap:4px;">
          <span v-if="item.cross_border" style="font-size:9px;background:oklch(0.82 0.14 215 / 0.15);color:oklch(0.82 0.14 215);padding:1px 5px;border-radius:3px;border:1px solid oklch(0.82 0.14 215 / 0.3);">XBDR</span>
          <span style="font-size:11px;color:var(--zg-text-dim);">{{ item.origin }}</span>
        </div>
        <span class="zwh-col w110"><span class="zwh-badge" :style="{ color:dm(item.disposition).color, background:dm(item.disposition).bg }">{{ item.disposition }}</span></span>
      </div>
    </div>
  </div>
</template>
