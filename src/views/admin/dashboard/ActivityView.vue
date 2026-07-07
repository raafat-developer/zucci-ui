<template>
  <div class="act-page">
    <div class="act-header">
      <div class="act-header-left">
        <h2 class="act-title">Activity Feed</h2>
        <p class="act-sub">Live stream of platform events across all modules</p>
      </div>
    </div>

    <div class="act-filters">
      <div class="act-search">
        <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
        <input v-model="searchQuery" placeholder="Search events…" />
      </div>
      
      <button v-for="t in ['all','order','listing','alert','vendor','return','payout']" :key="t"
        class="act-chip" :class="{ 'is-active': typeFilter === t }" @click="typeFilter = t">
        {{ t }}
      </button>
      
      <div class="act-divider"></div>
      
      <button class="act-chip" :class="{ 'is-active': marketFilter === 'all' }" @click="marketFilter = 'all'">All</button>
      <button v-for="m in ['AE','SA','EG','QA']" :key="m"
        class="act-chip" :class="{ 'is-active': marketFilter === m }" @click="marketFilter = m">
        {{ MARKET_FLAGS[m] }} {{ m }}
      </button>
    </div>

    <div class="act-list">
      <div v-for="group in groups" :key="group">
        <div class="act-group-hd">{{ group }}</div>
        <div v-for="a in getGroupItems(group)" :key="a.id" class="act-item">
          <div class="act-icon" :style="{ color: TYPE_COLORS[a.type] || 'var(--zg-text-dim)' }">
            <svg viewBox="0 0 14 14" width="13" height="13" v-html="renderIcon(a.icon)"></svg>
          </div>
          <div class="act-body">
            <div class="act-msg">{{ a.msg }}</div>
            <div class="act-meta">
              <span>{{ a.actor }}</span>
              <span>{{ MARKET_FLAGS[a.market] }} {{ a.market }}</span>
              <span class="act-tag" :style="{ color: TYPE_COLORS[a.type] || 'var(--zg-text-dim)' }">{{ a.type }}</span>
            </div>
          </div>
          <span class="act-time">{{ a.time }}</span>
        </div>
      </div>
      
      <div v-if="filtered.length === 0" class="act-empty">No events match filters</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const typeFilter = ref('all')
const marketFilter = ref('all')
const searchQuery = ref('')

const MARKET_FLAGS = { AE: '🇦🇪', SA: '🇸🇦', EG: '🇪🇬', QA: '🇶🇦', KW: '🇰🇼', BH: '🇧🇭', OM: '🇴🇲' }
const TYPE_COLORS = { order: 'oklch(0.82 0.14 215)', alert: 'var(--zg-danger)', listing: 'var(--zg-accent)', return: 'var(--zg-warn)', vendor: 'oklch(0.78 0.15 290)', payout: 'var(--zg-good)' }

const activities = [
  { id:'a1',  time:'2m ago',   type:'order',      market:'AE', actor:'Customer',      msg:'Order #ORD-18912 placed — AED 489 · 2 items',               icon:'box'    },
  { id:'a2',  time:'4m ago',   type:'order',      market:'SA', actor:'Customer',      msg:'Order #ORD-18911 placed — SAR 320 · 1 item',                icon:'box'    },
  { id:'a3',  time:'8m ago',   type:'alert',      market:'AE', actor:'System',        msg:'Low stock alert: Midnight Abaya XL — 3 units remaining',    icon:'bell'   },
  { id:'a4',  time:'12m ago',  type:'listing',    market:'AE', actor:'Urban Looms',   msg:'New listing submitted: Emerald Wrap Dress',                 icon:'tag'    },
  { id:'a5',  time:'18m ago',  type:'return',     market:'AE', actor:'Customer',      msg:'Return RMA-0891 received at WH-AE-001',                     icon:'return' },
  { id:'a6',  time:'24m ago',  type:'order',      market:'EG', actor:'Customer',      msg:'Order #ORD-18910 dispatched from WH-EG-001',               icon:'box'    },
  { id:'a7',  time:'31m ago',  type:'vendor',     market:'SA', actor:'House of Oud',  msg:'KYB document uploaded: ZATCA Tax Certificate',             icon:'doc'    },
  { id:'a8',  time:'45m ago',  type:'payout',     market:'AE', actor:'Finance',       msg:'Payout PYT-2115 processed — AED 14,200 to Urban Looms',    icon:'coin'   },
  { id:'a9',  time:'1h ago',   type:'listing',    market:'SA', actor:'Admin',         msg:'Listing Desert Chelsea Boot approved',                      icon:'check'  },
  { id:'a10', time:'1h ago',   type:'alert',      market:'EG', actor:'System',        msg:'Warehouse WH-EG-001 at 94% capacity',                      icon:'bell'   },
  { id:'a11', time:'2h ago',   type:'order',      market:'QA', actor:'Customer',      msg:'Order #ORD-18908 delivered — QAR 780',                     icon:'check'  },
  { id:'a12', time:'2h ago',   type:'vendor',     market:'AE', actor:'System',        msg:'Commercial Registry expired: 5th Avenue Cairo',            icon:'alert'  },
  { id:'a13', time:'3h ago',   type:'return',     market:'SA', actor:'System',        msg:'Cross-border return aging Day 60 — 3 items flagged',       icon:'alert'  },
  { id:'a14', time:'4h ago',   type:'payout',     market:'SA', actor:'Finance',       msg:'Payout PYT-2114 scheduled — SAR 8,100 to Desert Kicks',    icon:'coin'   },
  { id:'a15', time:'5h ago',   type:'listing',    market:'EG', actor:'Admin',         msg:'Listing rejected: Classic Cotton Polo — description too short', icon:'x' },
  { id:'a16', time:'6h ago',   type:'order',      market:'AE', actor:'System',        msg:'48 orders dispatched from WH-AE-001',                      icon:'box'    },
  { id:'a17', time:'8h ago',   type:'vendor',     market:'AE', actor:'Sara Medhat',   msg:'Approved KYB for Bakhoor House — SA market',               icon:'check'  },
  { id:'a18', time:'Yesterday',type:'alert',      market:'AE', actor:'System',        msg:'3PL sync failure: GWC Qatar — manual update required',     icon:'bell'   },
  { id:'a19', time:'Yesterday',type:'payout',     market:'AE', actor:'Finance',       msg:'Monthly payout cycle completed — 12 vendors paid',         icon:'coin'   },
  { id:'a20', time:'Yesterday',type:'vendor',     market:'SA', actor:'Omar Hassan',   msg:'New vendor application: House of Oud — SA market',         icon:'building'},
]

const filtered = computed(() => {
  const sq = searchQuery.value.toLowerCase()
  return activities.filter(a =>
    (typeFilter.value === 'all' || a.type === typeFilter.value) &&
    (marketFilter.value === 'all' || a.market === marketFilter.value) &&
    (!sq || a.msg.toLowerCase().includes(sq) || a.actor.toLowerCase().includes(sq))
  )
})

const groups = computed(() => [...new Set(filtered.value.map(a => a.time.includes('ago') ? 'Today' : a.time))])

const getGroupItems = (group) => filtered.value.filter(a => (a.time.includes('ago') ? 'Today' : a.time) === group)

const renderIcon = (name) => {
  const c = 'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"'
  const icons = {
    box:      `<rect x="1" y="4" width="12" height="9" rx="1" ${c}/><path d="M10 4V2H4v2M7 8v4" ${c}/>`,
    bell:     `<path d="M2 10a4 4 0 018 0M2 10h10M4 13a2 2 0 004 0" ${c}/><path d="M7 2v2" ${c}/>`,
    tag:      `<path d="M1 1h5l6 6-5 5-6-6V1z" ${c}/><circle cx="4.5" cy="4.5" r="1" fill="currentColor"/>`,
    return:   `<path d="M3 7V3h4M3 7a6 6 0 100 2" ${c}/>`,
    doc:      `<rect x="2" y="1" width="10" height="12" rx="1" ${c}/><path d="M5 4h4M5 7h4M5 10h2" ${c}/>`,
    coin:     `<circle cx="7" cy="7" r="6" ${c}/><path d="M7 4v6M5 5.5h3a1.5 1.5 0 010 3H5" ${c}/>`,
    check:    `<circle cx="7" cy="7" r="6" ${c}/><path d="M4.5 7l2 2 3-3" ${c}/>`,
    alert:    `<path d="M7 1L1 13h12L7 1z" ${c}/><path d="M7 6v3M7 11v.5" ${c}/>`,
    x:        `<circle cx="7" cy="7" r="6" ${c}/><path d="M5 5l4 4M9 5l-4 4" ${c}/>`,
    building: `<rect x="2" y="2" width="10" height="10" rx="1" ${c}/><path d="M5 6h2M8 6h1M5 9h2" ${c}/>`
  }
  return icons[name] || ''
}
</script>

<style scoped>
.act-page { display:flex; flex-direction:column; height:100%; min-height:0; }
.act-header { padding:20px; flex-shrink:0; }
.act-title { margin:0; font-size:18px; font-weight:700; color:var(--zg-text); }
.act-sub { margin:3px 0 0; font-size:12px; color:var(--zg-text-dim); }

.act-filters { padding:8px 20px; border-bottom:1px solid var(--zg-line); display:flex; gap:6px; flex-wrap:wrap; background:var(--zg-bg-elev); flex-shrink:0; align-items:center; }
.act-search { position:relative; display:flex; align-items:center; }
.act-search svg { position:absolute; left:7px; pointer-events:none; }
.act-search input { height:26px; padding:0 8px 0 22px; width:200px; background:var(--zg-panel); border:1px solid var(--zg-line); border-radius:var(--zg-radius-md); font-family:inherit; font-size:11.5px; color:var(--zg-text); outline:none; }

.act-chip { font-size:10.5px; height:24px; padding:0 8px; text-transform:capitalize; background:transparent; border:1px solid transparent; color:var(--zg-text-dim); border-radius:12px; cursor:pointer; }
.act-chip:hover { background:var(--zg-panel); color:var(--zg-text); }
.act-chip.is-active { background:var(--zg-accent-tint); color:var(--zg-accent); border-color:var(--zg-accent-dim); }
.act-divider { width:1px; height:18px; background:var(--zg-line); margin:0 4px; }

.act-list { flex:1; overflow-y:auto; }
.act-group-hd { padding:8px 20px 4px; font-size:9.5px; text-transform:uppercase; letter-spacing:.07em; color:var(--zg-text-xdim); font-weight:700; background:var(--zg-bg); position:sticky; top:0; z-index:1; }
.act-item { display:flex; gap:12px; padding:10px 20px; border-bottom:1px solid var(--zg-line-soft); align-items:flex-start; }
.act-icon { width:30px; height:30px; border-radius:50%; background:var(--zg-panel); border:1px solid var(--zg-line); display:grid; place-items:center; flex-shrink:0; }
.act-body { flex:1; }
.act-msg { font-size:12.5px; color:var(--zg-text); line-height:1.4; }
.act-meta { font-size:11px; color:var(--zg-text-dim); margin-top:3px; display:flex; gap:8px; align-items:center; }
.act-tag { padding:0 5px; border-radius:2px; background:var(--zg-panel-hi); font-size:9.5px; font-weight:600; text-transform:capitalize; }
.act-time { font-size:10.5px; color:var(--zg-text-xdim); flex-shrink:0; margin-top:1px; }
.act-empty { padding:30px; text-align:center; color:var(--zg-text-dim); font-size:13px; }
</style>
