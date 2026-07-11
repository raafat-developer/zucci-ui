<script setup>
const props = defineProps({ entity: { type: Object, required: true } });
const MKT_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', QA:'🇶🇦', KW:'🇰🇼', BH:'🇧🇭', OM:'🇴🇲' };
const MKT_NAMES = { AE:'UAE', SA:'KSA', EG:'Egypt', QA:'Qatar', KW:'Kuwait', BH:'Bahrain', OM:'Oman' };
const mf = props.entity.marketFinancials || [];
const p  = props.entity.performance || {};
const fmtAed = n => n >= 1000 ? 'AED '+(n/1000).toFixed(0)+'K' : 'AED '+(n||0);
const fmtCur = (n, c) => `${c} ${Number(n).toLocaleString()}`;
import { ref } from 'vue';
const sel = ref(mf[0]?.market || null);
const selData = () => mf.find(m => m.market === sel.value) || mf[0];
</script>
<template>
  <div class="zen-tab-body">
    <!-- Overall KPI strip -->
    <div class="zen-perf-strip" style="margin-bottom:14px;">
      <div v-for="[lbl,val,cls] in [['GMV This Month',fmtAed(p.gmvMonth),'zen-perf-cell--accent'],['GMV All Time',fmtAed(p.gmvAllTime),''],['Avg Order Value','AED '+(p.avgOrderValue||0),''],['Return Rate',(p.returnRate||0)+'%',p.returnRate>5?'is-warn':''],['Fulfillment Rate',(p.fulfillRate||0)+'%',p.fulfillRate<95?'is-warn':'is-good'],['Seller Score',(p.sellerScore||0)+'/100',p.sellerScore>=90?'is-great':p.sellerScore>=75?'is-good':'is-warn']]" :key="lbl" :class="`zen-perf-cell ${cls}`">
        <div class="zen-perf-lbl">{{ lbl }}</div>
        <div class="zen-perf-val">{{ val }}</div>
      </div>
    </div>

    <!-- Per-market breakdown -->
    <template v-if="mf.length">
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
        <button v-for="m in mf" :key="m.market" class="zen-mkt-tab" :class="{ 'is-on': sel === m.market }" @click="sel = m.market">
          {{ MKT_FLAGS[m.market]||'' }} {{ MKT_NAMES[m.market]||m.market }} <span style="font-size:9.5px;margin-left:3px;opacity:0.7;">{{ m.currency }}</span>
        </button>
      </div>
      <div v-if="selData()" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;">
        <div v-for="[lbl,val,sub,cls] in [
          ['GMV This Month', fmtCur(selData().gmvMonth, selData().currency), '≈ AED '+Math.round(selData().gmvMonth/(selData().fxRate||1)).toLocaleString(), 'is-accent'],
          ['GMV All Time', fmtCur(selData().gmvAllTime, selData().currency), '', ''],
          ['Orders', selData().orders, selData().returns+' returned', ''],
          ['Avg Order Value', fmtCur(selData().avgOrderValue, selData().currency), '', ''],
          ['Commission', selData().commission+'%', fmtCur(selData().commissionAmt||0, selData().currency), ''],
          ['Fulfillment Rate', (selData().fulfillRate||0)+'%', '', selData().fulfillRate<95?'is-warn':'is-good'],
          ['Return Rate', (selData().returnRate||0)+'%', '', selData().returnRate>5?'is-warn':''],
          ['FX Rate', '1 AED = '+(selData().fxRate||1)+' '+selData().currency, 'Live rate', ''],
        ]" :key="lbl" class="zen-adv-kpi-card">
          <div class="zen-adv-kpi-lbl">{{ lbl }}</div>
          <div class="zen-adv-kpi-val" :class="cls">{{ val }}</div>
          <div v-if="sub" class="zen-adv-kpi-sub">{{ sub }}</div>
        </div>
      </div>
    </template>
    <div v-else class="zen-tab-ph"><div class="zen-tab-ph-label">No market performance data yet</div></div>
  </div>
</template>
