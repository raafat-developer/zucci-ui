<script setup>
/**
 * DashboardView — faithful port of ZucciLiveDashboard.
 * KPI strip (8 cells + sparklines + deltas), market filter, live clock,
 * 4 live panels: Recent Orders · Pending Orders · Open Returns · Inventory Alerts
 * + sidebar: System Alerts + Vendor Queue.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const market = ref('all');
const now    = ref(new Date());
let ticker;
onMounted(() => { ticker = setInterval(() => (now.value = new Date()), 1000); });
onUnmounted(() => clearInterval(ticker));

const fmtTime = d => d.toTimeString().slice(0, 8);
const fmtN    = n => n >= 1000 ? (n/1000).toFixed(1)+'K' : String(n);
const fmtAed  = n => n >= 1000 ? (n/1000).toFixed(0)+'K' : String(n);
const fmtPct  = n => (n*100).toFixed(1)+'%';
const delta   = (a, b) => { const d = ((a-b)/Math.max(b,1)*100); return { pct:(d>0?'+':'')+d.toFixed(1)+'%', kind:d>0?'pos':d<0?'neg':'muted' }; };
const deltaInv= (a, b) => { const d = ((a-b)/Math.max(b,1)*100); return { pct:(d>0?'+':'')+d.toFixed(1)+'%', kind:d>0?'neg':'pos' }; };

// ── Market KPI data ───────────────────────────────────────
const MARKET_KPI = {
  all:{ ordersToday:1284, ordersYest:1102, gmvToday:318400, gmvYest:291000, pendingOrders:247, pendingYest:198, returnsOpen:83, returnsYest:71, activeBrands:312, brandsYest:298, fulfillmentRate:0.961, fulfillRate:0.954, slaBreaches:7, slaYest:5, pendingPayouts:42, payoutsYest:49, miniOrders:[820,910,980,1050,1120,1200,1284], miniGmv:[210,240,265,278,295,308,318], miniPending:[180,195,210,225,215,232,247], miniReturns:[55,61,67,72,76,80,83], miniBrands:[280,285,290,295,300,306,312], miniFulfill:[94,94,95,95,96,96,96], miniSla:[3,4,4,5,6,6,7], miniPayouts:[55,52,49,47,45,44,42] },
  ae: { ordersToday:621,  ordersYest:530,  gmvToday:182000, gmvYest:165000, pendingOrders:118, pendingYest:95,  returnsOpen:34, returnsYest:28, activeBrands:289, brandsYest:277, fulfillmentRate:0.971, fulfillRate:0.965, slaBreaches:2, slaYest:3, pendingPayouts:18, payoutsYest:22, miniOrders:[410,460,490,540,570,595,621], miniGmv:[140,152,162,170,176,179,182], miniPending:[80,88,93,99,104,110,118], miniReturns:[20,22,25,28,30,32,34], miniBrands:[265,270,275,280,283,286,289], miniFulfill:[95,96,96,97,97,97,97], miniSla:[1,1,2,2,2,2,2], miniPayouts:[24,23,22,21,20,19,18] },
  sa: { ordersToday:412,  ordersYest:368,  gmvToday:96800,  gmvYest:89200,  pendingOrders:88,  pendingYest:74,  returnsOpen:29, returnsYest:25, activeBrands:201, brandsYest:194, fulfillmentRate:0.953, fulfillRate:0.947, slaBreaches:3, slaYest:2, pendingPayouts:15, payoutsYest:17, miniOrders:[280,300,330,355,375,392,412], miniGmv:[70,76,80,85,88,92,97],   miniPending:[60,65,70,74,78,83,88],   miniReturns:[18,20,22,24,26,28,29], miniBrands:[185,188,192,195,197,199,201], miniFulfill:[93,94,94,95,95,95,95], miniSla:[1,1,1,2,2,3,3], miniPayouts:[18,17,17,16,16,15,15] },
  eg: { ordersToday:251,  ordersYest:204,  gmvToday:39600,  gmvYest:36800,  pendingOrders:41,  pendingYest:29,  returnsOpen:20, returnsYest:18, activeBrands:98,  brandsYest:91,  fulfillmentRate:0.942, fulfillRate:0.931, slaBreaches:2, slaYest:0, pendingPayouts:9,  payoutsYest:10, miniOrders:[160,175,190,210,225,238,251], miniGmv:[28,30,33,35,37,38,40],   miniPending:[22,25,28,32,35,38,41],   miniReturns:[12,14,15,16,17,18,20], miniBrands:[82,85,88,91,93,96,98],   miniFulfill:[91,92,93,93,94,94,94], miniSla:[0,0,0,1,1,2,2], miniPayouts:[11,11,10,10,10,9,9] },
};

const RECENT_ORDERS = [
  { id:'#ZUC-20841', customer:'Layla Al Mansouri', market:'AE', amount:'AED 420',   items:3, status:'dispatched',  time:'2m ago'  },
  { id:'#ZUC-20840', customer:'Ahmed Khalid',       market:'SA', amount:'SAR 310',   items:1, status:'pending',     time:'3m ago'  },
  { id:'#ZUC-20839', customer:'Sara Ibrahim',        market:'EG', amount:'EGP 890',   items:2, status:'processing',  time:'5m ago'  },
  { id:'#ZUC-20838', customer:'Omar Yousef',          market:'AE', amount:'AED 1,240', items:5, status:'dispatched',  time:'7m ago'  },
  { id:'#ZUC-20837', customer:'Fatima Al Rashid',    market:'SA', amount:'SAR 580',   items:2, status:'pending',     time:'9m ago'  },
  { id:'#ZUC-20836', customer:'Khaled Nasser',        market:'AE', amount:'AED 220',   items:1, status:'delivered',   time:'12m ago' },
  { id:'#ZUC-20835', customer:'Nour Hassan',          market:'EG', amount:'EGP 1,450', items:4, status:'processing',  time:'14m ago' },
  { id:'#ZUC-20834', customer:'Reem Al Zaabi',        market:'AE', amount:'AED 760',   items:2, status:'dispatched',  time:'16m ago' },
];
const PENDING_ORDERS = [
  { id:'#ZUC-20840', customer:'Ahmed Khalid',    market:'SA', amount:'SAR 310', items:1, age:'3m',  type:'Standard', cod:false },
  { id:'#ZUC-20837', customer:'Fatima Al Rashid',market:'SA', amount:'SAR 580', items:2, age:'9m',  type:'Standard', cod:false },
  { id:'#ZUC-20833', customer:'Mahmoud Sami',    market:'EG', amount:'EGP 620', items:1, age:'18m', type:'Express',  cod:true  },
  { id:'#ZUC-20830', customer:'Aisha Qasim',     market:'AE', amount:'AED 390', items:3, age:'22m', type:'Standard', cod:false },
  { id:'#ZUC-20828', customer:'Tariq Al Mutairi',market:'SA', amount:'SAR 940', items:4, age:'31m', type:'Express',  cod:false },
  { id:'#ZUC-20825', customer:'Hana Kamal',      market:'AE', amount:'AED 185', items:1, age:'44m', type:'Standard', cod:true  },
];
const OPEN_RETURNS = [
  { id:'#RET-3821', order:'#ZUC-20701', customer:'Mona Saeed',      market:'AE', reason:'Wrong size',        age:2,  status:'Inspection' },
  { id:'#RET-3818', order:'#ZUC-20688', customer:'Yasser Ali',       market:'SA', reason:'Damaged item',      age:5,  status:'Received'   },
  { id:'#RET-3815', order:'#ZUC-20672', customer:'Dina Fathy',       market:'EG', reason:'Changed mind',      age:8,  status:'Pending'    },
  { id:'#RET-3812', order:'#ZUC-20651', customer:'Salim Obaid',      market:'AE', reason:'Size issue',        age:14, status:'Approved'   },
  { id:'#RET-3809', order:'#ZUC-20634', customer:'Rania Ibrahim',    market:'SA', reason:'Not as described',  age:21, status:'Pending'    },
];
const ALERTS_DATA = ref([
  { id:1, sev:'danger', msg:'3PL API sync failed — Dubai South (last sync 2h ago)',       route:'/admin/warehouses', time:'8m ago'  },
  { id:2, sev:'warn',   msg:'Low stock: Nike Air Max 90 (AE) — 4 units remaining',        route:'/admin/warehouses', time:'15m ago' },
  { id:3, sev:'warn',   msg:'SLA breach: 7 orders pending >24h in SA market',             route:'/admin/orders',     time:'22m ago' },
  { id:4, sev:'info',   msg:'New KYC submission: Adidas Arabia — awaiting review',        route:'/admin/owners',     time:'34m ago' },
  { id:5, sev:'danger', msg:'Payment gateway timeout — Tabby (EG) — 12 failed checkouts',route:'/admin/finance',    time:'41m ago' },
  { id:6, sev:'warn',   msg:'Cross-border return aging: 5 items approaching Day 30',     route:'/admin/warehouses', time:'1h ago'  },
  { id:7, sev:'info',   msg:'Flash sale "Summer Edit" ends in 47 minutes — 89% redeemed',route:'/admin/discounts',  time:'1h ago'  },
]);
const INVENTORY_ALERTS = [
  { sku:'NIKE-AM90-AE-9',  name:'Nike Air Max 90',   market:'AE', stock:4,   threshold:20, type:'low'       },
  { sku:'BOSS-SHT-SA-M',   name:'Boss Slim Shirt',   market:'SA', stock:0,   threshold:15, type:'oos'        },
  { sku:'GUCCI-BAG-AE-1',  name:'Gucci Tote Bag',    market:'AE', stock:142, threshold:30, type:'overstock'  },
  { sku:'PUMA-RS-EG-8',    name:'Puma RS-X Sneaker', market:'EG', stock:7,   threshold:25, type:'low'       },
  { sku:'ZARA-DRS-SA-S',   name:'Zara Midi Dress',   market:'SA', stock:0,   threshold:10, type:'oos'        },
];
const VENDOR_QUEUE = [
  { id:'V-1024', name:'Adidas Arabia',   type:'KYC Review',       market:'SA,AE', age:'2d', priority:'high'   },
  { id:'V-1023', name:'Mango MENA',      type:'New Listing (48)', market:'AE',    age:'1d', priority:'normal' },
  { id:'V-1021', name:'H&M Gulf',        type:'Payout Dispute',   market:'AE,SA', age:'3d', priority:'high'   },
  { id:'V-1019', name:'Stradivarius EG', type:'New Listing (12)', market:'EG',    age:'4h', priority:'normal' },
  { id:'V-1018', name:'Pull&Bear MENA',  type:'Contract Renewal', market:'All',   age:'5d', priority:'high'   },
];

const dismissedAlerts = ref(new Set());
const activeAlerts = computed(() => ALERTS_DATA.value.filter(a => !dismissedAlerts.value.has(a.id)));
function dismissAlert(id) { dismissedAlerts.value = new Set([...dismissedAlerts.value, id]); }

// ── Market filter computed ────────────────────────────────
const d = computed(() => MARKET_KPI[market.value] || MARKET_KPI.all);
const mktFilter = (arr) => market.value === 'all' ? arr : arr.filter(o => o.market === market.value.toUpperCase());
const filteredOrders   = computed(() => mktFilter(RECENT_ORDERS));
const filteredPending  = computed(() => mktFilter(PENDING_ORDERS));
const filteredReturns  = computed(() => mktFilter(OPEN_RETURNS));
const filteredInv      = computed(() => mktFilter(INVENTORY_ALERTS));

// ── Sort state for Recent Orders ─────────────────────────
const sortField = ref('time'); // time | amount | status
const sortDir   = ref('desc');

const sortedOrders = computed(() => {
  const arr = [...filteredOrders.value];
  arr.sort((a, b) => {
    let va = a[sortField.value], vb = b[sortField.value];
    if (sortField.value === 'amount') {
      va = parseFloat(String(va).replace(/[^0-9.]/g,''));
      vb = parseFloat(String(vb).replace(/[^0-9.]/g,''));
    }
    if (va < vb) return sortDir.value === 'asc' ? -1 : 1;
    if (va > vb) return sortDir.value === 'asc' ? 1 : -1;
    return 0;
  });
  return arr;
});

function toggleSort(field) {
  if (sortField.value === field) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  else { sortField.value = field; sortDir.value = 'desc'; }
}
function sortIndicator(field) {
  if (sortField.value !== field) return '↕';
  return sortDir.value === 'asc' ? '↑' : '↓';
}
const kpis = computed(() => {
  const dd = d.value;
  return [
    { label:'Orders Today',     value: fmtN(dd.ordersToday),          delta: delta(dd.ordersToday, dd.ordersYest),     mini: dd.miniOrders,   route:'/admin/orders' },
    { label:'GMV Today',        value: 'AED '+fmtAed(dd.gmvToday),    delta: delta(dd.gmvToday, dd.gmvYest),           mini: dd.miniGmv,      route:'/admin/finance' },
    { label:'Pending Orders',   value: fmtN(dd.pendingOrders),         delta: deltaInv(dd.pendingOrders, dd.pendingYest),mini: dd.miniPending, route:'/admin/orders' },
    { label:'Returns Open',     value: fmtN(dd.returnsOpen),           delta: deltaInv(dd.returnsOpen, dd.returnsYest), mini: dd.miniReturns,  route:'/admin/warehouses' },
    { label:'Active Brands',    value: fmtN(dd.activeBrands),          delta: delta(dd.activeBrands, dd.brandsYest),    mini: dd.miniBrands,   route:'/admin/marketplace' },
    { label:'Fulfilment Rate',  value: fmtPct(dd.fulfillmentRate),     delta: delta(dd.fulfillmentRate, dd.fulfillRate),mini: dd.miniFulfill,  route:'/admin/warehouses' },
    { label:'SLA Breaches',     value: fmtN(dd.slaBreaches),           delta: deltaInv(dd.slaBreaches, dd.slaYest),    mini: dd.miniSla,      route:'/admin/orders' },
    { label:'Pending Payouts',  value: fmtN(dd.pendingPayouts),        delta: deltaInv(dd.pendingPayouts, dd.payoutsYest),mini: dd.miniPayouts,route:'/admin/finance' },
  ];
});

// ── Sparkline ─────────────────────────────────────────────
function sparkline(values, kind) {
  const W=64, H=20, min=Math.min(...values), max=Math.max(...values), range=max-min||1;
  const pts = values.map((v,i) => `${(i/(values.length-1))*W},${H-((v-min)/range)*(H-3)-1}`).join(' ');
  const color = kind==='pos'?'var(--zg-good)':kind==='neg'?'var(--zg-danger)':'var(--zg-warn)';
  return { pts, color };
}

// ── Status pill ───────────────────────────────────────────
const STATUS_MAP = {
  pending:   { color:'var(--zg-warn)',   bg:'oklch(0.78 0.15 80 / 0.12)' },
  processing:{ color:'var(--zg-accent)', bg:'oklch(0.82 0.19 120 / 0.1)' },
  dispatched:{ color:'var(--zg-good)',   bg:'oklch(0.78 0.15 150 / 0.1)' },
  delivered: { color:'var(--zg-good)',   bg:'oklch(0.78 0.15 150 / 0.1)' },
  cancelled: { color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.1)'  },
  returned:  { color:'var(--zg-warn)',   bg:'oklch(0.78 0.15 80 / 0.12)' },
};
const statusStyle = s => STATUS_MAP[s] || { color:'var(--zg-text-dim)', bg:'transparent' };

// ── Alert severity ────────────────────────────────────────
const SEV_MAP = {
  danger:{ dot:'var(--zg-danger)', bg:'oklch(0.28 0.06 25)', border:'oklch(0.70 0.18 25 / 0.3)' },
  warn:  { dot:'var(--zg-warn)',   bg:'oklch(0.22 0.04 80)', border:'oklch(0.78 0.15 80 / 0.2)' },
  info:  { dot:'var(--zg-text-dim)', bg:'transparent',       border:'transparent' },
};

// ── Inventory alert type ──────────────────────────────────
const INV_TYPE = {
  low:      { label:'Low Stock',   color:'var(--zg-warn)',   bg:'oklch(0.78 0.15 80 / 0.12)' },
  oos:      { label:'Out of Stock',color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.1)'  },
  overstock:{ label:'Overstock',   color:'var(--zg-accent)', bg:'oklch(0.82 0.19 120 / 0.08)'},
};
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;min-height:0;background:var(--zg-bg);">

    <!-- Market bar -->
    <div class="dash-market-bar">
      <span class="dash-pulse" />
      <span class="dash-live-label">Live Dashboard</span>
      <span class="dash-clock">{{ fmtTime(now) }}</span>
      <div class="dash-mkt-group">
        <button v-for="[k,v] in [['all','All Markets'],['ae','AE — UAE'],['sa','SA — KSA'],['eg','EG — Egypt']]" :key="k"
          class="dash-mkt-btn" :class="{ 'is-active': market === k }"
          @click="market = k">{{ v }}</button>
      </div>
    </div>

    <!-- KPI strip -->
    <div class="zg-kpis" style="grid-template-columns:repeat(8,1fr);">
      <div v-for="k in kpis" :key="k.label" class="zg-kpi" @click="router.push(k.route)">
        <div class="zg-kpi-head">
          <span class="zg-kpi-label">{{ k.label }}</span>
          <span class="zg-kpi-delta" :class="`zg-kpi-delta--${k.delta.kind}`">{{ k.delta.pct }}</span>
        </div>
        <div class="zg-kpi-value">{{ k.value }}</div>
        <svg :width="64" :height="20" style="display:block;flex-shrink:0;margin-top:4px;">
          <polyline :points="sparkline(k.mini, k.delta.kind).pts" fill="none"
            :stroke="sparkline(k.mini, k.delta.kind).color"
            stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" opacity="0.7" />
        </svg>
      </div>
    </div>

    <!-- Body grid: 2 cols + sidebar -->
    <div class="dash-body">
      <!-- Col 1 Row 1: Recent Orders -->
      <div class="dash-panel" style="grid-column:1;grid-row:1;border-right:1px solid var(--zg-line);border-bottom:1px solid var(--zg-line);">
        <div class="dash-panel-head">
          <span class="dash-panel-title">Recent Orders</span>
          <span class="dash-panel-count">{{ sortedOrders.length }}</span>
          <button class="dash-panel-action" @click="router.push('/admin/orders')">All Orders →</button>
        </div>
        <div class="dash-scroll">
          <table class="dash-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Mkt</th>
                <th style="cursor:pointer;user-select:none;" @click="toggleSort('amount')">Amount {{ sortIndicator('amount') }}</th>
                <th style="cursor:pointer;user-select:none;" @click="toggleSort('status')">Status {{ sortIndicator('status') }}</th>
                <th style="cursor:pointer;user-select:none;" @click="toggleSort('time')">When {{ sortIndicator('time') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in sortedOrders" :key="o.id" class="dash-tr" @click="router.push('/admin/orders')">
                <td class="mono accent" style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ o.id }}</td>
                <td class="nowrap">{{ o.customer }}</td>
                <td class="mono dim">{{ o.market }}</td>
                <td class="mono bold">{{ o.amount }}</td>
                <td><span class="dash-pill" :style="{ color: statusStyle(o.status).color, background: statusStyle(o.status).bg }">{{ o.status }}</span></td>
                <td class="mono xdim">{{ o.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Col 2 Row 1: Pending Orders -->
      <div class="dash-panel" style="grid-column:2;grid-row:1;border-right:1px solid var(--zg-line);border-bottom:1px solid var(--zg-line);">
        <div class="dash-panel-head">
          <span class="dash-panel-title">Pending Orders</span>
          <span class="dash-panel-count">{{ filteredPending.length }}</span>
          <button class="dash-panel-action" @click="router.push('/admin/orders')">View All →</button>
        </div>
        <div class="dash-scroll">
          <table class="dash-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Type</th><th>Age</th></tr></thead>
            <tbody>
              <tr v-for="o in filteredPending" :key="o.id" class="dash-tr" @click="router.push('/admin/orders')">
                <td class="mono accent">{{ o.id }}</td>
                <td class="nowrap">{{ o.customer }}</td>
                <td class="mono bold">{{ o.amount }}</td>
                <td>
                  <span class="dash-tag">{{ o.type }}</span>
                  <span v-if="o.cod" class="dash-cod">COD</span>
                </td>
                <td class="mono bold" :style="{ color: parseInt(o.age)>30?'var(--zg-danger)':parseInt(o.age)>15?'var(--zg-warn)':'var(--zg-text-dim)' }">{{ o.age }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Col 3 (full height): Alerts + Vendor Queue -->
      <div class="dash-panel" style="grid-column:3;grid-row:1/3;border-bottom:none;display:flex;flex-direction:column;">
        <div class="dash-panel-head">
          <span class="dash-panel-title">System Alerts</span>
          <span class="dash-panel-count">{{ activeAlerts.length }}</span>
        </div>
        <div class="dash-scroll" style="flex:1;">
          <div v-for="a in activeAlerts" :key="a.id" class="dash-alert-row"
            :style="{ background: SEV_MAP[a.sev]?.bg, cursor:'pointer' }"
            @click="router.push(a.route)">
            <span class="dash-alert-dot" :style="{ background: SEV_MAP[a.sev]?.dot }" />
            <div style="flex:1;min-width:0;">
              <div class="dash-alert-msg">{{ a.msg }}</div>
              <div class="dash-alert-time">{{ a.time }}</div>
            </div>
            <button class="dash-alert-dismiss" @click.stop="dismissAlert(a.id)">×</button>
          </div>
          <div v-if="!activeAlerts.length" class="dash-empty-msg">No active alerts</div>
        </div>
        <!-- Vendor Queue -->
        <div style="border-top:1px solid var(--zg-line);flex-shrink:0;">
          <div class="dash-panel-head">
            <span class="dash-panel-title">Vendor Queue</span>
            <span class="dash-panel-count">{{ VENDOR_QUEUE.length }}</span>
            <button class="dash-panel-action" @click="router.push('/admin/marketplace')">View All →</button>
          </div>
          <div style="max-height:200px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;">
            <div v-for="v in VENDOR_QUEUE" :key="v.id" class="dash-vendor-row" @click="router.push('/admin/marketplace')">
              <div style="flex:1;min-width:0;">
                <div class="dash-vendor-name">{{ v.name }}</div>
                <div class="dash-vendor-type">{{ v.type }}</div>
              </div>
              <span class="dash-vendor-age">{{ v.age }}</span>
              <span v-if="v.priority==='high'" class="dash-vendor-high">HIGH</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Col 1 Row 2: Open Returns -->
      <div class="dash-panel" style="grid-column:1;grid-row:2;border-right:1px solid var(--zg-line);">
        <div class="dash-panel-head">
          <span class="dash-panel-title">Open Returns</span>
          <span class="dash-panel-count">{{ filteredReturns.length }}</span>
          <button class="dash-panel-action" @click="router.push('/admin/warehouses')">Returns Module →</button>
        </div>
        <div class="dash-scroll">
          <table class="dash-table">
            <thead><tr><th>Return</th><th>Order</th><th>Customer</th><th>Reason</th><th>Age (d)</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="r in filteredReturns" :key="r.id" class="dash-tr" @click="router.push('/admin/warehouses')">
                <td class="mono" style="color:var(--zg-warn);font-weight:700;">{{ r.id }}</td>
                <td class="mono accent">{{ r.order }}</td>
                <td class="nowrap">{{ r.customer }}</td>
                <td class="dim">{{ r.reason }}</td>
                <td class="mono bold" :style="{ color: r.age>14?'var(--zg-danger)':r.age>7?'var(--zg-warn)':'var(--zg-text)' }">{{ r.age }}</td>
                <td><span class="dash-tag">{{ r.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Col 2 Row 2: Inventory Alerts -->
      <div class="dash-panel" style="grid-column:2;grid-row:2;border-right:1px solid var(--zg-line);">
        <div class="dash-panel-head">
          <span class="dash-panel-title">Inventory Alerts</span>
          <span class="dash-panel-count">{{ filteredInv.length }}</span>
          <button class="dash-panel-action" @click="router.push('/admin/warehouses')">Inventory →</button>
        </div>
        <div class="dash-scroll">
          <div v-for="item in filteredInv" :key="item.sku" class="dash-inv-row" @click="router.push('/admin/warehouses')">
            <div style="flex:1;min-width:0;">
              <div class="dash-inv-name">{{ item.name }}</div>
              <div class="dash-inv-sku">{{ item.sku }} · {{ item.market }}</div>
            </div>
            <div style="text-align:right;flex-shrink:0;">
              <div class="dash-inv-stock" :style="{ color: item.stock===0?'var(--zg-danger)':item.stock<item.threshold?'var(--zg-warn)':'var(--zg-accent)' }">{{ item.stock }}</div>
              <span class="dash-inv-badge" :style="{ color: INV_TYPE[item.type]?.color, background: INV_TYPE[item.type]?.bg }">{{ INV_TYPE[item.type]?.label }}</span>
            </div>
          </div>
          <div v-if="!filteredInv.length" class="dash-empty-msg">No alerts for this market</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Market bar */
.dash-market-bar { display:flex;align-items:center;gap:8px;padding:5px 14px;border-bottom:1px solid var(--zg-line);background:var(--zg-bg-elev);flex-shrink:0; }
.dash-pulse { display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--zg-good);animation:dashPulse 1.8s ease-in-out infinite;flex-shrink:0; }
@keyframes dashPulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)} }
.dash-live-label { font-family:var(--zg-mono);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--zg-text-mid);flex:1; }
.dash-clock { font-family:var(--zg-mono);font-size:10px;color:var(--zg-text-dim); }
.dash-mkt-group { display:flex;gap:1px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:5px;overflow:hidden; }
.dash-mkt-btn { font-family:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border:none;cursor:pointer;background:transparent;color:var(--zg-text-dim);transition:all .12s; }
.dash-mkt-btn.is-active { background:var(--zg-accent);color:#000; }

/* KPI strip */
.zg-kpis { display:grid;border-bottom:1px solid var(--zg-line);flex-shrink:0; }
.zg-kpi { padding:10px 14px;border-right:1px solid var(--zg-line);display:flex;flex-direction:column;gap:2px;cursor:pointer;transition:background .1s; }
.zg-kpi:hover { background:var(--zg-panel); }
.zg-kpi:last-child { border-right:none; }
.zg-kpi-head { display:flex;align-items:center;justify-content:space-between;gap:6px; }
.zg-kpi-label { font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:700; }
.zg-kpi-delta { font-family:var(--zg-mono);font-size:9px;font-weight:700; }
.zg-kpi-delta--pos { color:var(--zg-good); }
.zg-kpi-delta--neg { color:var(--zg-danger); }
.zg-kpi-delta--muted { color:var(--zg-text-dim); }
.zg-kpi-value { font-family:var(--zg-mono);font-size:18px;font-weight:800;color:var(--zg-accent);letter-spacing:-.02em;line-height:1; }

/* Body grid */
.dash-body { flex:1;overflow:hidden;display:grid;grid-template-columns:1fr 1fr 320px;grid-template-rows:1fr 1fr;background:var(--zg-bg-elev); }
.dash-panel { display:flex;flex-direction:column;min-height:0; }
.dash-panel-head { display:flex;align-items:center;gap:7px;padding:8px 14px;border-bottom:1px solid var(--zg-line);flex-shrink:0; }
.dash-panel-title { font-size:10px;text-transform:uppercase;letter-spacing:.09em;font-weight:700;color:var(--zg-text-mid); }
.dash-panel-count { font-family:var(--zg-mono);font-size:10px;font-weight:700;color:var(--zg-text-dim);background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:3px;padding:1px 5px; }
.dash-panel-action { font-family:inherit;font-size:10px;font-weight:700;color:var(--zg-text-dim);background:none;border:none;cursor:pointer;padding:0;letter-spacing:.04em;margin-left:auto; }
.dash-panel-action:hover { color:var(--zg-accent); }
.dash-scroll { flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent; }

/* Table */
.dash-table { width:100%;border-collapse:collapse;font-size:11px; }
.dash-table th { padding:5px 10px;text-align:left;font-family:var(--zg-mono);font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:700;white-space:nowrap;border-bottom:1px solid var(--zg-line);background:var(--zg-panel); }
.dash-table th:hover { color:var(--zg-accent); }
.dash-table td { padding:7px 10px;border-bottom:1px solid var(--zg-line);color:var(--zg-text); }
.dash-tr { cursor:pointer;transition:background .08s; }
.dash-tr:hover td { background:var(--zg-panel); }
.mono { font-family:var(--zg-mono); }
.bold { font-weight:600; }
.accent { color:var(--zg-accent);font-weight:700; }
.dim { color:var(--zg-text-dim); }
.xdim { color:var(--zg-text-dim);font-size:10px; }
.nowrap { max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }

.dash-pill { font-size:10px;font-weight:700;padding:2px 6px;border-radius:3px;white-space:nowrap; }
.dash-tag { font-size:10px;font-weight:700;padding:2px 6px;border-radius:3px;background:var(--zg-bg);border:1px solid var(--zg-line);color:var(--zg-text-mid); }
.dash-cod { margin-left:4px;font-size:10px;font-weight:700;padding:2px 5px;border-radius:3px;color:var(--zg-warn);background:oklch(0.78 0.15 80 / 0.12); }

/* Alerts */
.dash-alert-row { display:flex;gap:9px;padding:10px 12px;border-bottom:1px solid var(--zg-line);cursor:pointer;transition:filter .1s; }
.dash-alert-row:hover { filter:brightness(1.15); }
.dash-alert-dot { width:6px;height:6px;border-radius:50%;margin-top:3px;flex-shrink:0;animation:dashPulse 1.8s ease-in-out infinite; }
.dash-alert-msg { font-size:11px;color:var(--zg-text);line-height:1.4;margin-bottom:3px; }
.dash-alert-time { font-family:var(--zg-mono);font-size:9.5px;color:var(--zg-text-dim); }
.dash-alert-dismiss { background:none;border:none;cursor:pointer;color:var(--zg-text-dim);font-size:14px;line-height:1;padding:0;flex-shrink:0; }
.dash-empty-msg { padding:40px 20px;text-align:center;font-family:var(--zg-mono);font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--zg-text-dim); }

/* Vendor Queue */
.dash-vendor-row { display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--zg-line);cursor:pointer;transition:background .08s; }
.dash-vendor-row:hover { background:var(--zg-panel); }
.dash-vendor-name { font-size:11px;font-weight:600;color:var(--zg-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.dash-vendor-type { font-size:10px;color:var(--zg-text-dim); }
.dash-vendor-age { font-family:var(--zg-mono);font-size:9.5px;color:var(--zg-text-dim);flex-shrink:0; }
.dash-vendor-high { font-size:9px;font-weight:800;padding:1px 5px;border-radius:3px;color:var(--zg-danger);background:oklch(0.70 0.18 25 / 0.12);flex-shrink:0; }

/* Inventory */
.dash-inv-row { display:flex;align-items:center;gap:10px;padding:9px 12px;border-bottom:1px solid var(--zg-line);cursor:pointer;transition:background .08s; }
.dash-inv-row:hover { background:var(--zg-panel); }
.dash-inv-name { font-size:11px;font-weight:600;color:var(--zg-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:2px; }
.dash-inv-sku { font-family:var(--zg-mono);font-size:9.5px;color:var(--zg-text-dim); }
.dash-inv-stock { font-family:var(--zg-mono);font-size:14px;font-weight:700;line-height:1;margin-bottom:3px; }
.dash-inv-badge { font-size:9.5px;font-weight:700;padding:1px 5px;border-radius:3px; }
</style>
