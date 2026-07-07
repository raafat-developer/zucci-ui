<template>
  <div class="perf-page">
    <div class="perf-header">
      <div class="perf-header-left">
        <h2 class="perf-title">Performance Summary</h2>
        <p class="perf-sub">Key highlights, anomalies, and vendor ranking</p>
      </div>
      <div class="perf-header-right">
        <button v-for="p in periods" :key="p.value" 
          class="perf-chip" :class="{ 'is-active': period === p.value }" @click="period = p.value">
          {{ p.label }}
        </button>
      </div>
    </div>

    <div class="perf-content">
      <!-- Headline numbers -->
      <div class="perf-metrics">
        <div v-for="m in headMetrics" :key="m.label" class="perf-metric">
          <div class="perf-metric-lbl">{{ m.label }}</div>
          <div class="perf-metric-val">{{ m.value }}</div>
          <div class="perf-metric-sub">{{ m.sub }}</div>
        </div>
      </div>

      <!-- Anomaly alerts -->
      <div class="perf-section">
        <div class="perf-section-hd">Anomalies & Alerts This Period</div>
        <div v-for="(a, i) in alerts" :key="i" class="perf-alert">
          <div class="perf-alert-dot" :class="a.sev"></div>
          <span class="perf-alert-msg">{{ a.msg }}</span>
          <button class="perf-alert-act">{{ a.action }}</button>
        </div>
      </div>

      <!-- Vendor ranking -->
      <div class="perf-section">
        <div class="perf-section-hd">Top Vendor Performance</div>
        <div class="perf-table-hd">
          <span>#</span><span>Vendor</span><span>Tier</span><span>GMV</span><span>Orders</span><span>Return</span><span>Trend</span>
        </div>
        <div v-for="(v, i) in VENDOR_PERF" :key="v.vendor" class="perf-table-row" :class="{ even: i % 2 === 0 }">
          <span class="perf-rank">{{ i + 1 }}</span>
          <span class="perf-vendor">{{ v.vendor }}</span>
          <span class="perf-tier" :style="{ color: TIER_COLORS[v.tier] }">{{ v.tier }}</span>
          <span class="perf-mono">{{ (v.gmv / 1000).toFixed(0) }}K</span>
          <span class="perf-mono">{{ v.orders.toLocaleString() }}</span>
          <span class="perf-mono" :class="v.returnRate > 7 ? 'danger' : v.returnRate > 4 ? 'warn' : 'good'">{{ v.returnRate }}%</span>
          <span class="perf-mono perf-trend" :class="v.trend.startsWith('+') ? 'good' : 'danger'">{{ v.trend }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const period = ref('this_month')
const periods = [
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'q2_2025', label: 'Q2 2025' }
]

const VENDOR_PERF = [
  { vendor:'Nabila Collective', tier:'platinum', gmv:142000, orders:921, returnRate:2.1, score:94, trend:'+12%' },
  { vendor:'Bakhoor House',     tier:'gold',     gmv:124000, orders:1842, returnRate:1.4, score:91, trend:'+8%'  },
  { vendor:'Urban Looms',       tier:'gold',     gmv:98400,  orders:641,  returnRate:5.2, score:78, trend:'-3%'  },
  { vendor:'Desert Kicks',      tier:'silver',   gmv:84200,  orders:441,  returnRate:8.8, score:66, trend:'-11%' },
  { vendor:'Amara Threads',     tier:'silver',   gmv:62100,  orders:481,  returnRate:6.4, score:72, trend:'+2%'  },
]

const TIER_COLORS = { platinum:'oklch(0.90 0.06 280)', gold:'oklch(0.82 0.15 75)', silver:'var(--zg-text-mid)', bronze:'oklch(0.70 0.12 45)' }

const alerts = [
  { sev:'high',   msg:'Desert Kicks return rate at 8.8% — 3× platform average', action:'Review returns' },
  { sev:'medium', msg:'WH-EG-001 at 94% capacity — risk of overflow',           action:'View warehouse' },
  { sev:'medium', msg:'3 vendor documents expiring within 30 days',             action:'Review docs'   },
  { sev:'low',    msg:'5th Avenue Cairo KYB pending for 12 days',               action:'Review KYB'    },
]

const headMetrics = [
  { label:'GMV', value:'AED 402K', sub:'↑ vs last period' },
  { label:'Orders', value:'2,614', sub:'↑ 8.9%' },
  { label:'New Vendors', value:'7', sub:'joined this period' },
  { label:'Return Rate', value:'3.7%', sub:'↓ improved' },
  { label:'Seller Score Avg', value:'81/100', sub:'platform avg' }
]
</script>

<style scoped>
.perf-page { display:flex; flex-direction:column; height:100%; min-height:0; }
.perf-header { padding:20px; flex-shrink:0; display:flex; justify-content:space-between; align-items:flex-start; }
.perf-title { margin:0; font-size:18px; font-weight:700; color:var(--zg-text); }
.perf-sub { margin:3px 0 0; font-size:12px; color:var(--zg-text-dim); }
.perf-header-right { display:flex; gap:5px; }
.perf-chip { font-size:10.5px; height:24px; padding:0 8px; background:transparent; border:1px solid transparent; color:var(--zg-text-dim); border-radius:12px; cursor:pointer; }
.perf-chip:hover { background:var(--zg-panel); color:var(--zg-text); }
.perf-chip.is-active { background:var(--zg-accent-tint); color:var(--zg-accent); border-color:var(--zg-accent-dim); }

.perf-content { flex:1; overflow-y:auto; padding:0 20px 20px; display:flex; flex-direction:column; gap:14px; }
.perf-metrics { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; }
.perf-metric { background:var(--zg-panel); border:1px solid var(--zg-line); border-radius:var(--zg-radius-md); padding:12px 14px; }
.perf-metric-lbl { font-size:9.5px; text-transform:uppercase; letter-spacing:.07em; color:var(--zg-text-dim); font-weight:600; margin-bottom:4px; }
.perf-metric-val { font-family:var(--zg-mono); font-size:18px; font-weight:800; color:var(--zg-text); line-height:1; margin-bottom:2px; }
.perf-metric-sub { font-size:10.5px; color:var(--zg-text-dim); }

.perf-section { background:var(--zg-panel); border:1px solid var(--zg-line); border-radius:var(--zg-radius-md); overflow:hidden; }
.perf-section-hd { padding:8px 16px; background:var(--zg-panel-hi); border-bottom:1px solid var(--zg-line); font-size:12.5px; font-weight:600; color:var(--zg-text); }

.perf-alert { display:flex; align-items:center; gap:10px; padding:9px 16px; border-bottom:1px solid var(--zg-line-soft); font-size:12px; }
.perf-alert:last-child { border-bottom:none; }
.perf-alert-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.perf-alert-dot.high { background:var(--zg-danger); }
.perf-alert-dot.medium { background:var(--zg-warn); }
.perf-alert-dot.low { background:var(--zg-text-dim); }
.perf-alert-msg { flex:1; color:var(--zg-text); }
.perf-alert-act { background:none; border:none; color:var(--zg-accent); cursor:pointer; font-size:11.5px; font-weight:500; }
.perf-alert-act:hover { text-decoration:underline; }

.perf-table-hd { display:grid; grid-template-columns:24px 1fr 60px 90px 80px 60px 70px; padding:0 16px; height:28px; background:var(--zg-panel-hi); border-bottom:1px solid var(--zg-line); font-size:9.5px; text-transform:uppercase; letter-spacing:.07em; color:var(--zg-text-dim); font-weight:600; align-items:center; gap:10px; }
.perf-table-row { display:grid; grid-template-columns:24px 1fr 60px 90px 80px 60px 70px; padding:9px 16px; border-bottom:1px solid var(--zg-line-soft); align-items:center; font-size:12px; gap:10px; }
.perf-table-row.even { background:var(--zg-bg); }
.perf-table-row:last-child { border-bottom:none; }
.perf-rank { font-family:var(--zg-mono); font-size:11px; font-weight:700; color:var(--zg-text-dim); }
.perf-vendor { font-weight:600; color:var(--zg-text); }
.perf-tier { font-weight:700; font-size:11px; text-transform:capitalize; }
.perf-mono { font-family:var(--zg-mono); font-size:12px; }
.perf-mono.danger { color:var(--zg-danger); }
.perf-mono.warn { color:var(--zg-warn); }
.perf-mono.good { color:var(--zg-good); }
.perf-trend { font-weight:700; }
</style>
