<script setup>
import { C, D } from '@/data/analyticsChartData';
import ChartCard       from './ChartCard.vue';
import SvgBarChart     from './SvgBarChart.vue';
import SvgHorizBarChart from './SvgHorizBarChart.vue';
</script>

<template>
  <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;background:#0E1013;min-height:100%;">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
      <ChartCard title="Top Products by GMV" sub="AED thousands" :span="3" :h="260">
        <SvgHorizBarChart :data="D.top_products" x-key="name" y-key="gmv" :color="C.lime" unit="K" :height="260" />
      </ChartCard>

      <ChartCard title="Return Rate by Category" sub="% of orders returned" :h="220">
        <SvgBarChart :data="D.by_category" x-key="name" y-key="returnRate" :color="C.amber" unit="%" :height="220" />
      </ChartCard>

      <ChartCard title="Sell-Through Rate" sub="Stock sold vs available by category" :h="220">
        <SvgBarChart :data="D.sell_through" x-key="cat" y-key="rate" :color="C.blue" unit="%" :height="220" />
      </ChartCard>

      <ChartCard title="Price Range Distribution" sub="Order count by price bracket" :h="220">
        <SvgBarChart :data="D.price_dist" x-key="range" y-key="count" :color="C.purple" :height="220" />
      </ChartCard>

      <ChartCard title="Units Sold — Top Products" sub="Total units sold in period" :span="2" :h="220">
        <SvgHorizBarChart :data="D.top_products" x-key="name" y-key="sold" :color="C.pink" unit=" units" :height="220" />
      </ChartCard>
    </div>
  </div>
</template>
