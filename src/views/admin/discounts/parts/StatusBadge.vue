<script setup>
const STATUS_META = {
  active:{label:'Active',color:'var(--zg-good)',bg:'oklch(0.78 0.15 150 / 0.1)'},
  scheduled:{label:'Scheduled',color:'oklch(0.82 0.14 215)',bg:'oklch(0.82 0.14 215 / 0.1)'},
  expired:{label:'Expired',color:'var(--zg-text-dim)',bg:'var(--zg-panel-hi)'},
  pending_approval:{label:'Pending Approval',color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.1)'},
  approved:{label:'Approved',color:'var(--zg-good)',bg:'oklch(0.78 0.15 150 / 0.1)'},
  rejected:{label:'Rejected',color:'var(--zg-danger)',bg:'oklch(0.70 0.18 25 / 0.1)'},
  suggested:{label:'Suggested',color:'oklch(0.72 0.15 290)',bg:'oklch(0.72 0.15 290 / 0.1)'},
  paused:{label:'Paused',color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.08)'},
  planned:{label:'Planned',color:'oklch(0.82 0.14 215)',bg:'oklch(0.82 0.14 215 / 0.1)'},
  pending_legal:{label:'Pending Legal',color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.1)'},
  negotiating:{label:'Negotiating',color:'oklch(0.72 0.15 290)',bg:'oklch(0.72 0.15 290 / 0.1)'},
};
const props = defineProps({ status: { type: String, default: '' } });
const s = STATUS_META[props.status] || { label: props.status || '—', color:'var(--zg-text-dim)', bg:'var(--zg-panel-hi)' };
defineExpose({ STATUS_META });
</script>
<template><span class="zcd-badge" :style="{ background: s.bg, color: s.color }">{{ s.label }}</span></template>
