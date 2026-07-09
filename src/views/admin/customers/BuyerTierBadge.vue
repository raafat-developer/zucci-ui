<script setup>
const props = defineProps({ tier: { type: String, default: 'Standard' } });
const META = {
  Gold:     { bg:'oklch(0.82 0.15 75 / 0.15)',  color:'var(--zg-warn)',         border:'oklch(0.82 0.15 75 / 0.35)' },
  Silver:   { bg:'oklch(0.70 0.0 0 / 0.15)',    color:'#aaa',                   border:'rgba(170,170,170,0.3)' },
  Bronze:   { bg:'oklch(0.65 0.12 40 / 0.15)',  color:'oklch(0.72 0.12 40)',    border:'oklch(0.65 0.12 40 / 0.35)' },
  Standard: { bg:'var(--zg-panel-hi)',           color:'var(--zg-text-dim)',     border:'var(--zg-line)' },
};
const s = META[props.tier] || META.Standard;
</script>

<template>
  <span class="zen-tier-badge" :style="{ background: s.bg, color: s.color, borderColor: s.border }">{{ tier }}</span>
</template>
