<script setup>
import { computed } from 'vue';
const props = defineProps({ score: { type: Number, default: 0 } });
const R = 22;
const CIRC = 2 * Math.PI * R;
const fill  = computed(() => (props.score / 100) * CIRC);
const color = computed(() => {
  if (props.score >= 80) return 'var(--zg-good)';
  if (props.score >= 60) return 'oklch(0.82 0.14 215)';
  if (props.score >= 40) return 'var(--zg-warn)';
  return 'var(--zg-danger)';
});
</script>

<template>
  <div class="byr-score-ring">
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" :r="R" fill="none" stroke="var(--zg-line)" stroke-width="4"/>
      <circle cx="28" cy="28" :r="R" fill="none" :stroke="color" stroke-width="4"
        :stroke-dasharray="`${fill} ${CIRC}`" stroke-linecap="round"
        transform="rotate(-90 28 28)" style="transition:stroke-dasharray .6s ease;"/>
      <text x="28" y="33" text-anchor="middle" font-size="13" font-weight="700" :fill="color" font-family="var(--zg-mono)">{{ score }}</text>
    </svg>
    <div class="byr-score-label">Buyer Score</div>
  </div>
</template>
