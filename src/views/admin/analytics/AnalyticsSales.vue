<script setup>
import { computed } from 'vue';
import { D, M12, DOW, C } from '@/data/analyticsChartData';
import ChartCard       from './ChartCard.vue';
import SvgBarChart     from './SvgBarChart.vue';
import SvgLineChart    from './SvgLineChart.vue';
import SvgHorizBarChart from './SvgHorizBarChart.vue';

const stackedData = computed(() => M12.map((m,i) => ({ m, GMV:D.gmv_monthly[i%6], Net:D.net_monthly[i%6] })));
const dowData     = computed(() => DOW.map((d,i) => ({ d, orders:D.days_orders[i] })));
const funnelData  = computed(() => D.funnel);
</script>

<template>
  <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;background:#0E1013;min-height:100%;">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
      <ChartCard title="GMV & Net Revenue (12 months)" sub="AED thousands" :span="2" :h="220">
        <SvgLineChart :data="stackedData" x-key="m" :lines="[{key:'GMV',color:C.lime,name:'GMV'},{key:'Net',color:C.blue,name:'Net Revenue'}]" :height="220" unit="K" :area="true" />
      </ChartCard>

      <ChartCard title="Orders by Day of Week" sub="Average daily volume" :h="220">
        <SvgBarChart :data="dowData" x-key="d" y-key="orders" :color="C.lime" :height="220" />
      </ChartCard>

      <ChartCard title="Payment Method Split" sub="% of transactions" :h="210">
        <SvgHorizBarChart :data="D.pay_methods" x-key="name" y-key="value" :color="C.blue" unit="%" :height="210" :colors="[C.lime,C.blue,C.purple,C.amber,C.teal]" />
      </ChartCard>

      <ChartCard title="Sales Funnel" sub="Session → Order conversion" :span="2" :h="210">
        <SvgHorizBarChart :data="funnelData" x-key="stage" y-key="value" :height="210" :colors="[C.lime,C.blue,C.purple,C.amber,C.pink]" />
      </ChartCard>
    </div>
  </div>
</template>
