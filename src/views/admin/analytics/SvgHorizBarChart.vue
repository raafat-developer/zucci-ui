<!-- SvgHorizBarChart — horizontal bar chart for rankings -->
<script setup>
const props = defineProps({
  data:   { type: Array,  required: true },
  xKey:   { type: String, required: true },
  yKey:   { type: String, required: true },
  color:  { type: String, default:'#A3E635' },
  unit:   { type: String, default: '' },
  height: { type: Number, default: 220 },
  colors: { type: Array,  default: null },
});
const W = 560;
const PAD = { t:4, r:80, b:4, l:130 };
const barH = 22;
const barGap = 6;
const maxV = val => Math.max(...props.data.map(d => Number(d[props.yKey]) || 0), 1);
function bw(v) { return ((v / maxV()) * (W - PAD.l - PAD.r)) || 0; }
function by(i) { return PAD.t + i * (barH + barGap); }
const svgH = val => PAD.t + props.data.length * (barH + barGap) + PAD.b;
function fillColor(i) { return props.colors ? props.colors[i % props.colors.length] : props.color; }
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${svgH()}`" width="100%" :height="height" style="overflow:visible;">
    <g v-for="(d, i) in data" :key="i">
      <!-- Label -->
      <text :x="PAD.l - 6" :y="by(i) + barH/2 + 4" text-anchor="end" font-size="10" fill="#9CA3AF">
        {{ (String(d[xKey])).slice(0, 18) }}
      </text>
      <!-- Bar background -->
      <rect :x="PAD.l" :y="by(i)" :width="W - PAD.l - PAD.r" :height="barH" fill="rgba(255,255,255,0.04)" rx="3" />
      <!-- Bar fill -->
      <rect :x="PAD.l" :y="by(i)" :width="bw(Number(d[yKey]) || 0)" :height="barH" :fill="fillColor(i)" opacity="0.85" rx="3">
        <title>{{ d[xKey] }}: {{ d[yKey] }}{{ unit }}</title>
      </rect>
      <!-- Value label -->
      <text :x="PAD.l + bw(Number(d[yKey]) || 0) + 6" :y="by(i) + barH/2 + 4" font-size="10" fill="#D1D5DB" font-weight="600">
        {{ d[yKey] }}{{ unit }}
      </text>
    </g>
  </svg>
</template>
