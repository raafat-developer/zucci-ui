<script setup>
import { computed } from 'vue';
import { C, D, M6 } from '@/data/analyticsChartData';
import ChartCard    from './ChartCard.vue';
import SvgLineChart from './SvgLineChart.vue';
import SvgHorizBarChart from './SvgHorizBarChart.vue';

const mktMonthly = computed(() => D.market_monthly);
</script>

<template>
  <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;background:#0E1013;min-height:100%;">
    <!-- Market KPI cards -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
      <div v-for="m in D.market_kpis" :key="m.market"
        style="background:#15171B;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px 16px;">
        <div style="font-size:13px;font-weight:800;color:#D1D5DB;margin-bottom:8px;">{{ m.market }}</div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:10.5px;color:#6B7280;">GMV</span>
            <span style="font-family:monospace;font-size:12px;font-weight:700;color:#A3E635;">AED {{ m.gmv }}K</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:10.5px;color:#6B7280;">Orders</span>
            <span style="font-family:monospace;font-size:12px;font-weight:700;color:#D1D5DB;">{{ m.orders.toLocaleString() }}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:10.5px;color:#6B7280;">Brands</span>
            <span style="font-family:monospace;font-size:12px;color:#D1D5DB;">{{ m.brands }}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:10.5px;color:#6B7280;">Return %</span>
            <span style="font-family:monospace;font-size:12px;font-weight:700;" :style="{ color: m.return_rate > 5 ? '#F87171' : m.return_rate > 3.5 ? '#FBBF24' : '#A3E635' }">{{ m.return_rate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
      <ChartCard title="Monthly GMV by Market" sub="AED thousands per market" :span="3" :h="220">
        <SvgLineChart :data="mktMonthly" x-key="m"
          :lines="[{key:'AE',color:C.lime,name:'AE'},{key:'SA',color:C.blue,name:'SA'},{key:'EG',color:C.purple,name:'EG'},{key:'QA',color:C.amber,name:'QA'}]"
          :height="220" unit="K" />
      </ChartCard>

      <ChartCard title="Orders by Market" sub="Current period" :h="220">
        <SvgHorizBarChart :data="D.geo" x-key="market" y-key="orders" :height="220"
          :colors="[C.lime,C.blue,C.purple,C.amber,C.teal,C.pink,C.orange]" unit=" orders" />
      </ChartCard>

      <ChartCard title="GMV Share by Market" sub="% contribution" :span="2" :h="220">
        <div style="display:flex;flex-direction:column;gap:10px;padding:8px 0;">
          <div v-for="m in D.market_kpis" :key="m.market" style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:11px;font-weight:700;color:#D1D5DB;width:28px;">{{ m.market }}</span>
            <div style="flex:1;height:18px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
              <div :style="{ width: (m.gmv/402*100).toFixed(0)+'%', height:'100%', background:C.lime, borderRadius:'3px', opacity:0.85 }" />
            </div>
            <span style="font-family:monospace;font-size:11px;color:#9CA3AF;width:50px;text-align:right;">{{ (m.gmv/402*100).toFixed(0) }}%</span>
          </div>
        </div>
      </ChartCard>
    </div>
  </div>
</template>
