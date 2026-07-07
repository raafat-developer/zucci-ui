<script setup>
/**
 * AnalyticsView — demonstrates the charting pattern for the Vue build.
 * The React version used Recharts; Vue uses vue-echarts (ECharts) which is
 * the idiomatic interactive-chart lib for Vue 3. One area chart + one bar
 * chart are shown here as the reference pattern for porting the 6 analytics
 * tabs. Charts are interactive (hover tooltips, cursor line).
 *
 * NOTE: requires `echarts` + `vue-echarts` (already in package.json).
 * If you prefer, the same JSON option objects map 1:1 onto any chart lib.
 */
import { computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent]);

const AX = { lime: '#A3E635', blue: '#60A5FA', dim: '#6B7280', line: 'rgba(255,255,255,0.08)' };
const baseGrid = { left: 44, right: 16, top: 24, bottom: 28 };
const axisCommon = {
  axisLine: { lineStyle: { color: AX.line } },
  axisTick: { show: false },
  axisLabel: { color: AX.dim, fontSize: 10 },
  splitLine: { lineStyle: { color: AX.line, type: 'dashed' } },
};

const gmvOption = computed(() => ({
  grid: baseGrid,
  tooltip: { trigger: 'axis', backgroundColor: '#0E1013', borderColor: AX.line, textStyle: { color: '#D1D5DB' } },
  legend: { textStyle: { color: AX.dim }, top: 0, icon: 'circle', itemWidth: 8 },
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], ...axisCommon },
  yAxis: { type: 'value', ...axisCommon, axisLabel: { ...axisCommon.axisLabel, formatter: '{value}K' } },
  series: [
    { name: 'GMV', type: 'line', smooth: true, data: [284, 312, 298, 341, 378, 402], lineStyle: { color: AX.lime, width: 2 }, itemStyle: { color: AX.lime }, areaStyle: { color: 'rgba(163,230,53,0.15)' }, symbol: 'none' },
    { name: 'Net', type: 'line', smooth: true, data: [199, 218, 209, 239, 265, 281], lineStyle: { color: AX.blue, width: 2 }, itemStyle: { color: AX.blue }, areaStyle: { color: 'rgba(96,165,250,0.12)' }, symbol: 'none' },
  ],
}));

const marketOption = computed(() => ({
  grid: baseGrid,
  tooltip: { trigger: 'axis', backgroundColor: '#0E1013', borderColor: AX.line, textStyle: { color: '#D1D5DB' } },
  xAxis: { type: 'category', data: ['AE', 'SA', 'EG', 'QA', 'KW', 'BH', 'OM'], ...axisCommon },
  yAxis: { type: 'value', ...axisCommon },
  series: [
    { name: 'Orders', type: 'bar', data: [1200, 930, 320, 120, 40, 15, 6], itemStyle: { color: AX.lime, borderRadius: [4, 4, 0, 0] }, barWidth: '55%' },
  ],
}));
</script>

<template>
  <div class="an">
    <div class="an-grid">
      <section class="an-card">
        <header class="an-card-head">
          <div class="an-card-title">GMV &amp; Net Revenue</div>
          <div class="an-card-sub">Last 6 months · AED thousands</div>
        </header>
        <VChart class="an-chart" :option="gmvOption" autoresize />
      </section>

      <section class="an-card">
        <header class="an-card-head">
          <div class="an-card-title">Orders by Market</div>
          <div class="an-card-sub">Current period</div>
        </header>
        <VChart class="an-chart" :option="marketOption" autoresize />
      </section>
    </div>

    <p class="an-note">
      Reference charts using <code>vue-echarts</code>. The remaining Analytics
      tabs (Sales, Customers, Products, Markets, Export) follow this same
      option-object pattern — see README for the full port checklist.
    </p>
  </div>
</template>

<style scoped>
.an { height: 100%; overflow-y: auto; padding: 16px 20px; }
.an-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.an-card { background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: 10px; padding: 16px 20px 12px; }
.an-card-head { margin-bottom: 12px; }
.an-card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--zg-text); }
.an-card-sub { font-size: 10.5px; color: var(--zg-text-dim); margin-top: 2px; }
.an-chart { height: 240px; width: 100%; }
.an-note { margin: 16px 2px 0; font-size: 11.5px; color: var(--zg-text-dim); line-height: 1.6; max-width: 720px; }
.an-note code { font-family: var(--zg-mono); color: var(--zg-accent); background: var(--zg-accent-tint); padding: 1px 5px; border-radius: 3px; }
</style>
