<!-- SvgBarChart — pure SVG bar chart, no external deps -->
<script setup>
import { computed } from 'vue';
const props = defineProps({
  data:    { type: Array,  required: true },
  xKey:    { type: String, required: true },
  yKey:    { type: String, required: true },
  color:   { type: String, default: '#A3E635' },
  height:  { type: Number, default: 180 },
  unit:    { type: String, default: '' },
  horiz:   { type: Boolean,default: false },
});
const W = 560; const H = computed(() => props.height);
const PAD = { t:8, r:20, b:28, l:40 };
const vals = computed(() => props.data.map(d => Number(d[props.yKey]) || 0));
const maxV  = computed(() => Math.max(...vals.value, 1));
const cW    = computed(() => (W - PAD.l - PAD.r) / props.data.length);
const barW  = computed(() => Math.max(cW.value * 0.6, 4));
function barH(v) { return ((v / maxV.value) * (H.value - PAD.t - PAD.b)); }
function barX(i) { return PAD.l + i * cW.value + (cW.value - barW.value) / 2; }
function barY(v) { return H.value - PAD.b - barH(v); }
const yTicks = computed(() => {
  const steps = 4;
  return Array.from({ length: steps + 1 }, (_, i) => Math.round(maxV.value * i / steps));
});
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" width="100%" :height="H" style="overflow:visible;">
    <!-- Y grid + labels -->
    <g v-for="t in yTicks" :key="t">
      <line :x1="PAD.l" :y1="H - PAD.b - barH(t)" :x2="W - PAD.r" :y2="H - PAD.b - barH(t)"
        stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text :x="PAD.l - 5" :y="H - PAD.b - barH(t) + 4" text-anchor="end" font-size="9" fill="#6B7280">
        {{ t >= 1000 ? (t/1000).toFixed(0)+'K' : t }}
      </text>
    </g>
    <!-- Bars -->
    <g v-for="(d, i) in data" :key="i">
      <rect :x="barX(i)" :y="barY(vals[i])" :width="barW" :height="barH(vals[i]) || 1"
        :fill="color" opacity="0.85" rx="3" ry="3" />
      <!-- X label -->
      <text :x="PAD.l + i * cW + cW / 2" :y="H - PAD.b + 14"
        text-anchor="middle" font-size="9.5" fill="#6B7280">{{ d[xKey] }}</text>
      <!-- Value on hover proxy (title) -->
      <title>{{ d[xKey] }}: {{ vals[i] }}{{ unit }}</title>
    </g>
    <!-- X axis -->
    <line :x1="PAD.l" :y1="H - PAD.b" :x2="W - PAD.r" :y2="H - PAD.b" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  </svg>
</template>
