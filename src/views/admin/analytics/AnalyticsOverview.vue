<script setup>
import { computed } from 'vue';
import { D, M6, C } from '@/data/analyticsChartData';
import ChartCard       from './ChartCard.vue';
import SvgBarChart     from './SvgBarChart.vue';
import SvgLineChart    from './SvgLineChart.vue';
import SvgHorizBarChart from './SvgHorizBarChart.vue';

const kpis = [
  { label:'GMV (Jun)',    value:'AED 402K', delta:+6.3, sub:'vs May AED 378K',  color:C.lime   },
  { label:'Net Orders',  value:'2,614',    delta:+8.9, sub:'vs May 2,401',      color:C.blue   },
  { label:'Avg Order',   value:'AED 154',  delta:-0.6, sub:'stable',            color:C.amber  },
  { label:'Return Rate', value:'3.7%',     delta:-9.3, sub:'best in 6mo',       color:C.teal   },
  { label:'Active Brands',value:'312',     delta:+4.7, sub:'up 14 from May',    color:C.purple },
  { label:'Fulfillment', value:'96.1%',    delta:+0.7, sub:'SLA comply',        color:C.lime   },
];
const revData  = computed(() => M6.map((m,i) => ({ m, GMV:D.gmv_monthly[i], Net:D.net_monthly[i] })));
const retData  = computed(() => M6.map((m,i) => ({ m, rate:D.return_monthly[i] })));
const aovData  = computed(() => M6.map((m,i) => ({ m, aov:D.aov_monthly[i] })));
</script>

<template>
  <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;background:#0E1013;min-height:100%;">
    <!-- KPI strip -->
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;">
      <div v-for="k in kpis" :key="k.label" style="background:#15171B;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px 14px;">
        <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:#6B7280;font-weight:600;margin-bottom:4px;">{{ k.label }}</div>
        <div style="font-size:20px;font-weight:800;letter-spacing:-.02em;" :style="{ color: k.color }">{{ k.value }}</div>
        <div style="font-size:10px;margin-top:3px;" :style="{ color: k.delta > 0 ? '#A3E635' : '#F87171' }">{{ k.delta > 0 ? '+' : '' }}{{ k.delta }}% · {{ k.sub }}</div>
      </div>
    </div>

    <!-- Charts grid -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
      <ChartCard title="Revenue & GMV" sub="AED thousands · 6 months" :span="2" :h="210">
        <SvgLineChart :data="revData" x-key="m" :lines="[{key:'GMV',color:C.lime,name:'GMV'},{key:'Net',color:C.blue,name:'Net Revenue'}]" :height="210" unit="K" :area="true" />
      </ChartCard>

      <ChartCard title="Category GMV" sub="AED thousands" :h="210">
        <SvgHorizBarChart :data="D.by_category" x-key="name" y-key="gmv" :color="C.purple" unit="K" :height="210" />
      </ChartCard>

      <ChartCard title="Return Rate Trend" sub="% of orders returned" :h="200">
        <SvgBarChart :data="retData" x-key="m" y-key="rate" :color="C.amber" :height="200" unit="%" />
      </ChartCard>

      <ChartCard title="Market Breakdown" sub="Orders by market" :h="200">
        <SvgHorizBarChart :data="D.geo" x-key="market" y-key="orders" :color="C.lime" unit=" orders" :height="200" />
      </ChartCard>

      <ChartCard title="AOV Trend" sub="Average order value · AED" :h="200">
        <SvgLineChart :data="aovData" x-key="m" :lines="[{key:'aov',color:C.purple,name:'AOV'}]" :height="200" unit=" AED" />
      </ChartCard>
    </div>
  </div>
</template>
