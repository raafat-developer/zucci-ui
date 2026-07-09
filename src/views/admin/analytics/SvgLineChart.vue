<!-- SvgLineChart — pure SVG multi-line chart -->
<script setup>
import { computed } from 'vue';
const props = defineProps({
  data:   { type: Array,  required: true },
  xKey:   { type: String, required: true },
  lines:  { type: Array,  required: true }, // [{key, color, name}]
  height: { type: Number, default: 180 },
  unit:   { type: String, default: '' },
  area:   { type: Boolean,default: false },
});
const W = 560; const H = computed(() => props.height);
const PAD = { t:8, r:20, b:28, l:44 };
const allVals = computed(() => props.data.flatMap(d => props.lines.map(l => Number(d[l.key]) || 0)));
const maxV = computed(() => Math.max(...allVals.value, 1));
const minV = computed(() => 0);
const range = computed(() => maxV.value - minV.value || 1);
const plotW = computed(() => W - PAD.l - PAD.r);
const plotH = computed(() => H.value - PAD.t - PAD.b);
function px(i) { return PAD.l + (i / Math.max(props.data.length - 1, 1)) * plotW.value; }
function py(v) { return PAD.t + plotH.value - ((Number(v) - minV.value) / range.value) * plotH.value; }
function pathD(key) {
  return props.data.map((d, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(d[key]).toFixed(1)}`).join(' ');
}
function areaD(key) {
  const top = props.data.map((d, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(d[key]).toFixed(1)}`).join(' ');
  const bot = `L${px(props.data.length-1).toFixed(1)},${(H.value-PAD.b).toFixed(1)} L${px(0).toFixed(1)},${(H.value-PAD.b).toFixed(1)} Z`;
  return top + ' ' + bot;
}
const yTicks = computed(() => Array.from({ length: 5 }, (_, i) => Math.round(maxV.value * i / 4)));
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" width="100%" :height="H" style="overflow:visible;">
    <!-- Grid -->
    <g v-for="t in yTicks" :key="t">
      <line :x1="PAD.l" :y1="py(t)" :x2="W - PAD.r" :y2="py(t)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text :x="PAD.l - 5" :y="py(t) + 4" text-anchor="end" font-size="9" fill="#6B7280">
        {{ t >= 1000 ? (t/1000).toFixed(0)+'K' : t }}
      </text>
    </g>
    <!-- Area fill (optional) -->
    <path v-if="area" v-for="l in lines" :key="'a'+l.key" :d="areaD(l.key)" :fill="l.color" opacity="0.12" />
    <!-- Lines -->
    <path v-for="l in lines" :key="l.key" :d="pathD(l.key)" fill="none" :stroke="l.color" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
    <!-- Dots -->
    <g v-for="l in lines" :key="'d'+l.key">
      <circle v-for="(d, i) in data" :key="i" :cx="px(i)" :cy="py(d[l.key])" r="3" :fill="l.color">
        <title>{{ d[xKey] }} — {{ l.name }}: {{ d[l.key] }}{{ unit }}</title>
      </circle>
    </g>
    <!-- X labels -->
    <text v-for="(d, i) in data" :key="'x'+i" :x="px(i)" :y="H - PAD.b + 14" text-anchor="middle" font-size="9.5" fill="#6B7280">{{ d[xKey] }}</text>
    <!-- X axis -->
    <line :x1="PAD.l" :y1="H - PAD.b" :x2="W - PAD.r" :y2="H - PAD.b" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
    <!-- Legend -->
    <g v-for="(l, i) in lines" :key="'leg'+l.key" :transform="`translate(${PAD.l + i * 100}, 2)`">
      <rect x="0" y="0" width="8" height="8" rx="2" :fill="l.color" />
      <text x="11" y="8" font-size="9.5" fill="#9CA3AF">{{ l.name }}</text>
    </g>
  </svg>
</template>
