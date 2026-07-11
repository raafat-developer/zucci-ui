<script setup>
const props = defineProps({ entity: { type: Object, required: true } });
const TICKETS = [
  { id:'TKT-4820', subject:'Commercial Registry Renewal Follow-up', priority:'high', status:'open', created:'Jun 8, 2025' },
  { id:'TKT-4612', subject:'Payout discrepancy — May cycle',         priority:'medium', status:'resolved', created:'May 20, 2025' },
  { id:'TKT-4401', subject:'Brand sync issue — Le Maillot',          priority:'low', status:'resolved', created:'Apr 10, 2025' },
];
const PRI_COLOR = { high:'var(--zg-danger)', medium:'var(--zg-warn)', low:'oklch(0.82 0.14 215)' };
const STATUS_CLS = { open:'zen-bst--pending', resolved:'zen-bst--active', in_progress:'zen-bst--pending' };
</script>
<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">Support Tickets</div><button class="zen-btn-primary">+ New Ticket</button></div>
    <div class="zen-card">
      <div v-for="t in TICKETS" :key="t.id" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--zg-line);">
        <div style="width:8px;height:8px;border-radius:50%;flex-shrink:0;" :style="{ background: PRI_COLOR[t.priority] }" />
        <div style="flex:1;">
          <div style="font-size:12.5px;font-weight:500;color:var(--zg-text);">{{ t.subject }}</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:2px;">{{ t.id }} · {{ t.created }}</div>
        </div>
        <span :class="`zen-bst ${STATUS_CLS[t.status]||'zen-bst--inactive'}`">{{ t.status }}</span>
        <button class="zen-doc-card-btn">View</button>
      </div>
    </div>
  </div>
</template>