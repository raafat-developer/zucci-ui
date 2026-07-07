<template>
  <div class="kpi-page">
    <div class="kpi-toolbar">
      <div class="kpi-toolbar-left">
        <h2 class="kpi-title">KPI Overview</h2>
        <p class="kpi-sub">Platform-wide metrics with trend indicators</p>
      </div>
      <div class="kpi-toolbar-right">
        <label class="kpi-toggle-label">
          <button
            class="kpi-toggle"
            :class="{ 'is-on': compare }"
            @click="compare = !compare"
          >
            <div class="kpi-toggle-thumb" :class="{ 'is-on': compare }"></div>
          </button>
          vs prev. period
        </label>
        <select v-model="market" class="kpi-select">
          <option value="all">All Markets</option>
          <option v-for="m in MARKETS" :key="m" :value="m">{{ m }}</option>
        </select>
        <select v-model="dateRange" class="kpi-select">
          <option v-for="r in ['Last 7 days','Last 30 days','Last 90 days','This month','This quarter','This year']" :key="r">{{ r }}</option>
        </select>
      </div>
    </div>

    <div class="kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.key" class="kpi-card">
        <div class="kpi-card-top">
          <span class="kpi-card-label">{{ kpi.label }}</span>
          <span v-if="compare" class="kpi-card-delta" :class="kpi.delta >= 0 ? 'pos' : 'neg'">
            {{ kpi.delta >= 0 ? '+' : '' }}{{ kpi.delta }}%
          </span>
        </div>
        <div class="kpi-card-value" :style="{ color: kpi.color }">{{ kpi.fmt(kpi.values[kpi.values.length - 1]) }}</div>
        <svg viewBox="0 0 80 32" width="80" height="32" class="kpi-spark">
          <path :d="sparklinePath(kpi.values)" fill="none" :stroke="kpi.color" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
          <circle :cx="80" :cy="32 - ((kpi.values.at(-1) - Math.min(...kpi.values)) / (Math.max(...kpi.values) - Math.min(...kpi.values) || 1)) * 26 - 3" r="2.5" :fill="kpi.color"/>
        </svg>
        <div class="kpi-months">
          <span v-for="m in MONTHS" :key="m">{{ m }}</span>
        </div>
      </div>
    </div>

    <!-- Comparison table -->
    <div v-if="compare" class="kpi-compare">
      <div class="kpi-compare-head">Period Comparison</div>
      <div class="kpi-compare-cols">
        <span>Metric</span><span>Current</span><span>Previous</span><span>Change</span>
      </div>
      <div v-for="(kpi, i) in kpis" :key="kpi.key" class="kpi-compare-row" :class="{ even: i % 2 === 0 }">
        <span class="kpi-compare-name">{{ kpi.label }}</span>
        <span class="kpi-compare-curr" :style="{ color: kpi.color }">{{ kpi.fmt(kpi.values.at(-1)) }}</span>
        <span class="kpi-compare-prev">{{ kpi.fmt(kpi.values.at(-2)) }}</span>
        <span class="kpi-compare-chg" :class="kpi.values.at(-1) >= kpi.values.at(-2) ? 'pos' : 'neg'">
          {{ kpi.values.at(-1) >= kpi.values.at(-2) ? '+' : '' }}{{ (((kpi.values.at(-1) - kpi.values.at(-2)) / kpi.values.at(-2)) * 100).toFixed(1) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dateRange = ref('Last 30 days')
const market = ref('all')
const compare = ref(true)

const MARKETS = ['AE','SA','EG','QA','KW','BH','OM']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun']

const kpis = [
  { key:'gmv',        label:'Gross Merchandise Value', values:[284000,312000,298000,341000,378000,402000], unit:'AED', fmt:v=>`AED ${(v/1000).toFixed(0)}K`, delta:6.3,  color:'var(--zg-accent)' },
  { key:'orders',     label:'Total Orders',            values:[1841,2012,1924,2184,2401,2614],             unit:'',    fmt:v=>v.toLocaleString(),             delta:8.9,  color:'oklch(0.82 0.14 215)' },
  { key:'aov',        label:'Average Order Value',     values:[154,155,155,156,157,154],                   unit:'AED', fmt:v=>`AED ${v}`,                     delta:-2.0, color:'oklch(0.78 0.15 290)' },
  { key:'return_rate',label:'Return Rate',             values:[4.2,3.8,4.1,3.9,4.3,3.7],                  unit:'%',   fmt:v=>`${v}%`,                         delta:14.0, color:'var(--zg-good)' },
  { key:'fulfill',    label:'Fulfillment Rate',        values:[95.1,96.2,95.8,96.9,97.1,97.4],            unit:'%',   fmt:v=>`${v}%`,                         delta:0.3,  color:'var(--zg-good)' },
  { key:'vendors',    label:'New Vendors (MTD)',       values:[4,6,3,8,5,7],                               unit:'',    fmt:v=>v.toString(),                    delta:40.0, color:'var(--zg-warn)' },
  { key:'listings',   label:'Active Listings',         values:[2841,2984,3021,3198,3312,3441],             unit:'',    fmt:v=>v.toLocaleString(),             delta:3.9,  color:'var(--zg-accent)' },
  { key:'csat',       label:'CSAT Score',              values:[4.1,4.2,4.2,4.3,4.3,4.4],                  unit:'/5',  fmt:v=>`${v} / 5`,                     delta:2.3,  color:'oklch(0.82 0.15 45)' },
]

const sparklinePath = (values, w = 80, h = 32) => {
  const max = Math.max(...values), min = Math.min(...values)
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    h - ((v - min) / (max - min || 1)) * (h - 6) - 3
  ])
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
}
</script>

<style scoped>
.kpi-page { display:flex; flex-direction:column; gap:20px; padding:20px; overflow-y:auto; height:100%; }
.kpi-toolbar { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-shrink:0; }
.kpi-toolbar-left {}
.kpi-title { margin:0; font-size:18px; font-weight:700; color:var(--zg-text); letter-spacing:-0.01em; }
.kpi-sub { margin:3px 0 0; font-size:12px; color:var(--zg-text-dim); }
.kpi-toolbar-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.kpi-toggle-label { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--zg-text-mid); cursor:pointer; }
.kpi-toggle { width:28px; height:16px; border-radius:8px; border:none; cursor:pointer; background:var(--zg-line); position:relative; flex-shrink:0; transition:background .14s; padding:0; }
.kpi-toggle.is-on { background:var(--zg-accent); }
.kpi-toggle-thumb { width:11px; height:11px; border-radius:50%; background:#fff; position:absolute; top:2.5px; left:2px; transition:left .14s; }
.kpi-toggle-thumb.is-on { left:13.5px; }
.kpi-select { height:28px; padding:0 8px; background:var(--zg-panel); border:1px solid var(--zg-line); border-radius:var(--zg-radius-md); font-family:inherit; font-size:12px; color:var(--zg-text); outline:none; cursor:pointer; }

.kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.kpi-card { background:var(--zg-panel); border:1px solid var(--zg-line); border-radius:var(--zg-radius-md); padding:14px 16px; display:flex; flex-direction:column; gap:6px; transition:border-color .12s; }
.kpi-card:hover { border-color:var(--zg-muted-line); }
.kpi-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
.kpi-card-label { font-size:10.5px; text-transform:uppercase; letter-spacing:.07em; color:var(--zg-text-dim); font-weight:600; line-height:1.3; }
.kpi-card-delta { font-size:10px; font-weight:700; padding:2px 5px; border-radius:2px; flex-shrink:0; }
.kpi-card-delta.pos { background:oklch(0.78 0.15 150 / 0.1); color:var(--zg-good); }
.kpi-card-delta.neg { background:oklch(0.70 0.18 25 / 0.1); color:var(--zg-danger); }
.kpi-card-value { font-family:var(--zg-mono); font-size:22px; font-weight:800; line-height:1; }
.kpi-spark { margin-top:2px; }
.kpi-months { display:flex; justify-content:space-between; }
.kpi-months span { font-size:8px; color:var(--zg-text-xdim); }

.kpi-compare { background:var(--zg-panel); border:1px solid var(--zg-line); border-radius:var(--zg-radius-md); overflow:hidden; flex-shrink:0; }
.kpi-compare-head { padding:10px 16px; background:var(--zg-panel-hi); border-bottom:1px solid var(--zg-line); font-size:12.5px; font-weight:600; color:var(--zg-text); }
.kpi-compare-cols { display:grid; grid-template-columns:1fr 120px 120px 80px; padding:0 16px; height:30px; background:var(--zg-panel-hi); border-bottom:1px solid var(--zg-line); font-size:9.5px; text-transform:uppercase; letter-spacing:.07em; color:var(--zg-text-dim); font-weight:600; align-items:center; gap:10px; }
.kpi-compare-row { display:grid; grid-template-columns:1fr 120px 120px 80px; padding:9px 16px; align-items:center; font-size:12px; gap:10px; border-bottom:1px solid var(--zg-line-soft); }
.kpi-compare-row.even { background:var(--zg-bg); }
.kpi-compare-name { font-weight:500; color:var(--zg-text); }
.kpi-compare-curr { font-family:var(--zg-mono); font-weight:700; }
.kpi-compare-prev { font-family:var(--zg-mono); color:var(--zg-text-dim); }
.kpi-compare-chg { font-family:var(--zg-mono); font-size:11px; font-weight:700; }
.kpi-compare-chg.pos { color:var(--zg-good); }
.kpi-compare-chg.neg { color:var(--zg-danger); }
</style>
