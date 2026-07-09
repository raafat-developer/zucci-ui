<script setup>
import { computed } from 'vue';
import { D, M6, C } from '@/data/analyticsChartData';
import ChartCard       from './ChartCard.vue';
import SvgBarChart     from './SvgBarChart.vue';
import SvgLineChart    from './SvgLineChart.vue';
import SvgHorizBarChart from './SvgHorizBarChart.vue';

const custData = computed(() => M6.map((m,i) => ({ m, New:D.new_cust[i], Returning:D.ret_cust[i] })));
</script>

<template>
  <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;background:#0E1013;min-height:100%;">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
      <ChartCard title="New vs Returning Customers" sub="Monthly customer breakdown" :span="2" :h="220">
        <SvgLineChart :data="custData" x-key="m" :lines="[{key:'New',color:C.lime,name:'New'},{key:'Returning',color:C.blue,name:'Returning'}]" :height="220" :area="true" />
      </ChartCard>

      <ChartCard title="Customer LTV by Tier" sub="Average lifetime value · AED" :h="220">
        <SvgHorizBarChart :data="D.ltv_tiers" x-key="tier" y-key="ltv" :height="220" :colors="[C.textDim,C.blue,C.amber,C.lime,C.purple]" unit=" AED" />
      </ChartCard>

      <ChartCard title="Geographic Breakdown" sub="Orders by market" :h="210">
        <SvgHorizBarChart :data="D.geo" x-key="market" y-key="orders" :color="C.teal" unit=" orders" :height="210" />
      </ChartCard>

      <ChartCard title="Customer Satisfaction (CSAT)" sub="Post-order rating distribution" :h="210">
        <SvgBarChart :data="D.satisfaction" x-key="name" y-key="count" :height="210" :color="C.lime" />
      </ChartCard>

      <!-- Cohort heatmap table -->
      <ChartCard title="Retention Cohort" sub="% retained by month" :h="210">
        <div style="overflow-x:auto;font-size:10.5px;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="text-align:left;padding:4px 8px;color:#6B7280;font-weight:600;">Cohort</th>
                <th v-for="m in ['M0','M1','M2','M3','M4','M5']" :key="m" style="padding:4px 8px;color:#6B7280;font-weight:600;text-align:center;">{{ m }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ri) in [[100,68,52,41,36,31],[100,71,55,44,38,null],[100,69,53,42,null,null],[100,73,56,null,null,null],[100,70,null,null,null,null],[100,null,null,null,null,null]]" :key="ri">
                <td style="padding:4px 8px;color:#9CA3AF;">{{ M6[ri] }}</td>
                <td v-for="(v, ci) in row" :key="ci" style="padding:4px 8px;text-align:center;border-radius:3px;"
                  :style="{ background: v === null ? 'transparent' : v >= 80 ? 'rgba(163,230,53,0.3)' : v >= 60 ? 'rgba(163,230,53,0.18)' : v >= 40 ? 'rgba(163,230,53,0.1)' : 'rgba(163,230,53,0.05)', color: v === null ? '#374151' : '#D1D5DB' }">
                  {{ v !== null ? v+'%' : '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  </div>
</template>
