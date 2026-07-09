<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const tab = ref(route.query.tab || 'individuals');
watch(() => route.query.tab, v => { if (v) tab.value = v; });

const TABS = [
  ['individuals',  'Individuals'],
  ['businesses',   'Businesses & Brands'],
  ['kyb',          'KYB Reviews'],
  ['contracts',    'Contracts'],
  ['onboarding',   'Onboarding'],
];

// ── Mock data ─────────────────────────────────────────────
const individuals = ref([
  { id:'IND-001', name:'Fatima Al Rashidi',   email:'fatima@zucci.com',   phone:'+971 50 123 4567', market:'AE', status:'active',  kyb:'verified',   role:'Seller',          joined:'Jan 12, 2025' },
  { id:'IND-002', name:'Mohammed Al Hamdan',  email:'mhamdan@zucci.com',  phone:'+966 55 234 5678', market:'SA', status:'active',  kyb:'verified',   role:'Seller',          joined:'Feb 3, 2025' },
  { id:'IND-003', name:'Nour Hassan',         email:'nhassan@zucci.com',  phone:'+20 10 345 6789',  market:'EG', status:'pending', kyb:'pending',    role:'Seller',          joined:'May 28, 2025' },
  { id:'IND-004', name:'Khalid Al Mutairi',   email:'khalid@zucci.com',   phone:'+965 66 456 7890', market:'KW', status:'active',  kyb:'verified',   role:'Brand Owner',     joined:'Mar 15, 2025' },
  { id:'IND-005', name:'Sara Al Dosari',      email:'sara@zucci.com',     phone:'+974 44 567 8901', market:'QA', status:'suspended',kyb:'rejected',  role:'Seller',          joined:'Apr 20, 2025' },
  { id:'IND-006', name:'Layla Abdallah',      email:'layla@zucci.com',    phone:'+971 55 678 9012', market:'AE', status:'active',  kyb:'verified',   role:'Brand Owner',     joined:'Jan 30, 2025' },
]);

const businesses = ref([
  { id:'BIZ-001', name:'Hessa Fashion House', type:'Brand',       market:'AE',    status:'active',  kyb:'verified',  tier:'Gold',    categories:['Women','Accessories'], products:241, revenue:'AED 2.4M', rep:'Hessa Al Mansoori',  joined:'Jan 5, 2025' },
  { id:'BIZ-002', name:'Desert Rose Couture', type:'Brand',       market:'SA',    status:'active',  kyb:'verified',  tier:'Silver',  categories:['Abayas','Modest'],     products:88,  revenue:'SAR 890K',  rep:'Sara Al Ghamdi',     joined:'Feb 14, 2025' },
  { id:'BIZ-003', name:'Gulf Style Co.',      type:'Distributor', market:'AE,SA', status:'active',  kyb:'verified',  tier:'Gold',    categories:['Men','Kids'],          products:182, revenue:'AED 1.8M', rep:'Ahmed Khalil',       joined:'Jan 18, 2025' },
  { id:'BIZ-004', name:'Cairo Threads',       type:'Brand',       market:'EG',    status:'pending', kyb:'pending',   tier:null,      categories:['Women','Streetwear'],  products:0,   revenue:'—',         rep:'Omar Hassan',        joined:'Jun 2, 2025' },
  { id:'BIZ-005', name:'Al Noor Textiles',    type:'Supplier',    market:'AE',    status:'active',  kyb:'verified',  tier:'Bronze',  categories:['Fabrics'],             products:43,  revenue:'AED 340K', rep:'Nasser Al Nuaimi',   joined:'Mar 9, 2025' },
]);

const kybReviews = ref([
  { id:'KYB-001', entity:'Cairo Threads',          type:'Business', submitted:'Jun 2, 2025',  status:'pending',  docs:['Trade License','ID','Bank Statement'], assignee:'Sara Medhat',   priority:'high' },
  { id:'KYB-002', entity:'Nour Hassan',             type:'Individual',submitted:'May 28, 2025',status:'pending',  docs:['Emirates ID','Selfie'],               assignee:'Ahmed Khalil',  priority:'normal' },
  { id:'KYB-003', entity:'Qatar Luxury FZCO',       type:'Business', submitted:'May 20, 2025', status:'in_review',docs:['License','CR','UBO Declaration'],     assignee:'Sara Medhat',   priority:'high' },
  { id:'KYB-004', entity:'Luxury Living LLC',       type:'Business', submitted:'May 15, 2025', status:'approved', docs:['All docs verified'],                  assignee:'Ahmed Khalil',  priority:'normal' },
  { id:'KYB-005', entity:'Style Republic',          type:'Business', submitted:'Apr 30, 2025', status:'rejected', docs:['License expired'],                    assignee:'Sara Medhat',   priority:'normal' },
]);

const contracts = ref([
  { id:'CON-001', entity:'Hessa Fashion House', type:'Vendor Agreement',     market:'AE',    signed:'Jan 10, 2025',  expiry:'Jan 10, 2026',  status:'active',   commission:'12%', tier:'Gold' },
  { id:'CON-002', entity:'Gulf Style Co.',      type:'Distributor Agreement',market:'AE,SA', signed:'Jan 20, 2025',  expiry:'Jan 20, 2026',  status:'active',   commission:'8%',  tier:'Gold' },
  { id:'CON-003', entity:'Desert Rose Couture', type:'Vendor Agreement',     market:'SA',    signed:'Feb 18, 2025',  expiry:'Feb 18, 2026',  status:'active',   commission:'14%', tier:'Silver' },
  { id:'CON-004', entity:'Al Noor Textiles',    type:'Supplier Agreement',   market:'AE',    signed:'Mar 12, 2025',  expiry:'Mar 12, 2026',  status:'active',   commission:'6%',  tier:'Bronze' },
  { id:'CON-005', entity:'Style Republic',      type:'Vendor Agreement',     market:'KW',    signed:'Apr 5, 2025',   expiry:'Apr 5, 2026',   status:'suspended',commission:'15%', tier:null },
]);

const onboarding = ref([
  { id:'ONB-001', entity:'Cairo Threads',    type:'Brand',      step:'KYB Review',    progress:40,  market:'EG', startDate:'Jun 2, 2025',  assignee:'Sara Medhat' },
  { id:'ONB-002', entity:'Nour Hassan',      type:'Individual', step:'Doc Upload',    progress:20,  market:'EG', startDate:'May 28, 2025', assignee:'Ahmed Khalil' },
  { id:'ONB-003', entity:'Qatar Luxury',     type:'Business',   step:'Contract Sign', progress:80,  market:'QA', startDate:'May 20, 2025', assignee:'Sara Medhat' },
  { id:'ONB-004', entity:'Style Bloom Co.',  type:'Brand',      step:'Training',      progress:90,  market:'SA', startDate:'May 15, 2025', assignee:'Ahmed Khalil' },
  { id:'ONB-005', entity:'Sana Collection',  type:'Brand',      step:'Store Setup',   progress:60,  market:'AE', startDate:'May 10, 2025', assignee:'Nada Ibrahim' },
]);

// Filters
const search = ref('');
const statusF = ref('all');

const filteredIndividuals = computed(() => {
  const sq = search.value.toLowerCase();
  return individuals.value.filter(i =>
    (statusF.value === 'all' || i.status === statusF.value) &&
    (!sq || i.name.toLowerCase().includes(sq) || i.email.toLowerCase().includes(sq))
  );
});
const filteredBusinesses = computed(() => {
  const sq = search.value.toLowerCase();
  return businesses.value.filter(b =>
    (statusF.value === 'all' || b.status === statusF.value) &&
    (!sq || b.name.toLowerCase().includes(sq) || b.rep.toLowerCase().includes(sq))
  );
});
const filteredKYB = computed(() => {
  return kybReviews.value.filter(k =>
    statusF.value === 'all' || k.status.replace('_','') === statusF.value || k.status === statusF.value
  );
});

// Selected detail
const selected = ref(null);

// KPI strip per tab
const kpis = computed(() => {
  if (tab.value === 'individuals')
    return [
      ['Total',     individuals.value.length, ''],
      ['Active',    individuals.value.filter(i=>i.status==='active').length, 'is-good'],
      ['Pending',   individuals.value.filter(i=>i.status==='pending').length, 'is-warn'],
      ['Suspended', individuals.value.filter(i=>i.status==='suspended').length, 'is-danger'],
    ];
  if (tab.value === 'businesses')
    return [
      ['Total Entities', businesses.value.length, ''],
      ['Brands',         businesses.value.filter(b=>b.type==='Brand').length, 'is-accent'],
      ['Distributors',   businesses.value.filter(b=>b.type==='Distributor').length, ''],
      ['Suppliers',      businesses.value.filter(b=>b.type==='Supplier').length, ''],
    ];
  if (tab.value === 'kyb')
    return [
      ['Total',     kybReviews.value.length, ''],
      ['Pending',   kybReviews.value.filter(k=>k.status==='pending').length, 'is-warn'],
      ['In Review', kybReviews.value.filter(k=>k.status==='in_review').length, 'is-accent'],
      ['Approved',  kybReviews.value.filter(k=>k.status==='approved').length, 'is-good'],
    ];
  if (tab.value === 'contracts')
    return [
      ['Total',     contracts.value.length, ''],
      ['Active',    contracts.value.filter(c=>c.status==='active').length, 'is-good'],
      ['Expiring',  0, 'is-warn'],
      ['Suspended', contracts.value.filter(c=>c.status==='suspended').length, 'is-danger'],
    ];
  return [
    ['In Progress', onboarding.value.length, ''],
    ['High Progress', onboarding.value.filter(o=>o.progress>=80).length, 'is-good'],
    ['Avg Progress', Math.round(onboarding.value.reduce((s,o)=>s+o.progress,0)/onboarding.value.length)+'%', 'is-accent'],
    ['Stalled', 0, 'is-warn'],
  ];
});

watch(tab, () => { search.value = ''; statusF.value = 'all'; selected.value = null; });

const STATUS_CLS = {
  active:'is-good', pending:'is-warn', suspended:'is-danger', rejected:'is-danger',
  verified:'is-good', in_review:'is-accent', approved:'is-good',
};
const TIER_CLS = { Gold:'is-gold', Silver:'is-silver', Bronze:'is-bronze' };
</script>

<template>
  <div class="zow-wrap">
    <!-- Header -->
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div class="zwh-title">Owners &amp; Brands</div>
        <div class="zwh-subtitle">Individuals, businesses, brand onboarding, KYB, and contracts</div>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="zwh-btn-ghost" @click="">Export</button>
        <button class="zwh-btn-primary" @click="">+ Add Entity</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="zow-tabs">
      <button v-for="[v,l] in TABS" :key="v" class="zow-tab" :class="{ 'is-active': tab === v }" @click="tab = v">{{ l }}</button>
    </div>

    <!-- KPI strip -->
    <div class="zwh-kpi-strip">
      <div v-for="[l,v,cls] in kpis" :key="l" class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">{{ l }}</span>
        <span class="zwh-kpi-val" :class="cls">{{ v }}</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="zow-toolbar">
      <div style="position:relative;flex:1;max-width:280px;">
        <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:7px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
        <input v-model="search" placeholder="Search…" class="zow-search" />
      </div>
      <div style="display:flex;gap:5px;">
        <button v-for="[v,l] in [['all','All'],['active','Active'],['pending','Pending'],['suspended','Suspended']]" :key="v"
          class="zwh-filter-chip" :class="{ 'is-active': statusF === v }" @click="statusF = v">{{ l }}</button>
      </div>
    </div>

    <!-- Content -->
    <div class="zow-content">

      <!-- Individuals -->
      <div v-if="tab === 'individuals'" class="zow-table">
        <div class="zow-table-head" style="grid-template-columns:180px 1fr 120px 60px 100px 90px 90px 80px">
          <span>Name</span><span>Email</span><span>Phone</span><span>Mkt</span><span>Role</span><span>KYB</span><span>Status</span><span>Actions</span>
        </div>
        <div v-for="i in filteredIndividuals" :key="i.id" class="zow-table-row" style="grid-template-columns:180px 1fr 120px 60px 100px 90px 90px 80px">
          <div>
            <div class="zow-name">{{ i.name }}</div>
            <div class="zow-id">{{ i.id }}</div>
          </div>
          <span class="zow-dim">{{ i.email }}</span>
          <span class="zow-mono">{{ i.phone }}</span>
          <span class="zow-badge">{{ i.market }}</span>
          <span class="zow-dim">{{ i.role }}</span>
          <span class="zow-status-pill" :class="STATUS_CLS[i.kyb]">{{ i.kyb }}</span>
          <span class="zow-status-pill" :class="STATUS_CLS[i.status]">{{ i.status }}</span>
          <div style="display:flex;gap:4px;">
            <button class="zcat-act" @click="selected = i">View</button>
            <button class="zcat-act" @click="">KYB</button>
          </div>
        </div>
      </div>

      <!-- Businesses & Brands -->
      <div v-if="tab === 'businesses'" class="zow-table">
        <div class="zow-table-head" style="grid-template-columns:200px 90px 80px 80px 60px 80px 100px 80px">
          <span>Entity Name</span><span>Type</span><span>Market</span><span>Tier</span><span>SKUs</span><span>Revenue</span><span>Rep</span><span>Actions</span>
        </div>
        <div v-for="b in filteredBusinesses" :key="b.id" class="zow-table-row" style="grid-template-columns:200px 90px 80px 80px 60px 80px 100px 80px">
          <div>
            <div class="zow-name">{{ b.name }}</div>
            <div class="zow-id">{{ b.id }}</div>
          </div>
          <span class="zow-dim">{{ b.type }}</span>
          <span class="zow-dim">{{ b.market }}</span>
          <span v-if="b.tier" class="zow-tier" :class="TIER_CLS[b.tier]">{{ b.tier }}</span>
          <span v-else class="zow-dim">—</span>
          <span class="zow-mono">{{ b.products }}</span>
          <span class="zow-mono" style="color:var(--zg-accent)">{{ b.revenue }}</span>
          <span class="zow-dim">{{ b.rep }}</span>
          <div style="display:flex;gap:4px;">
            <button class="zcat-act" @click="selected = b">View</button>
            <button class="zcat-act" @click="">Edit</button>
          </div>
        </div>
      </div>

      <!-- KYB Reviews -->
      <div v-if="tab === 'kyb'" class="zow-table">
        <div class="zow-table-head" style="grid-template-columns:180px 90px 110px 100px 1fr 100px 100px">
          <span>Entity</span><span>Type</span><span>Submitted</span><span>Status</span><span>Docs</span><span>Assignee</span><span>Actions</span>
        </div>
        <div v-for="k in filteredKYB" :key="k.id" class="zow-table-row" style="grid-template-columns:180px 90px 110px 100px 1fr 100px 100px">
          <div>
            <div class="zow-name">{{ k.entity }}</div>
            <div class="zow-id">{{ k.id }}</div>
          </div>
          <span class="zow-dim">{{ k.type }}</span>
          <span class="zow-dim">{{ k.submitted }}</span>
          <span class="zow-status-pill" :class="STATUS_CLS[k.status]">{{ k.status.replace('_',' ') }}</span>
          <div style="display:flex;gap:3px;flex-wrap:wrap;">
            <span v-for="d in k.docs" :key="d" class="zow-doc-tag">{{ d }}</span>
          </div>
          <span class="zow-dim">{{ k.assignee }}</span>
          <div style="display:flex;gap:4px;">
            <button class="zcat-act" @click="">Review</button>
            <button v-if="k.status==='pending'||k.status==='in_review'" class="zcat-act" style="color:var(--zg-good);" @click="">Approve</button>
          </div>
        </div>
      </div>

      <!-- Contracts -->
      <div v-if="tab === 'contracts'" class="zow-table">
        <div class="zow-table-head" style="grid-template-columns:200px 160px 80px 100px 100px 80px 90px 80px">
          <span>Entity</span><span>Contract Type</span><span>Market</span><span>Signed</span><span>Expiry</span><span>Commission</span><span>Status</span><span>Actions</span>
        </div>
        <div v-for="c in contracts" :key="c.id" class="zow-table-row" style="grid-template-columns:200px 160px 80px 100px 100px 80px 90px 80px">
          <div>
            <div class="zow-name">{{ c.entity }}</div>
            <div class="zow-id">{{ c.id }}</div>
          </div>
          <span class="zow-dim">{{ c.type }}</span>
          <span class="zow-dim">{{ c.market }}</span>
          <span class="zow-dim">{{ c.signed }}</span>
          <span class="zow-dim">{{ c.expiry }}</span>
          <span class="zow-mono" style="color:var(--zg-accent)">{{ c.commission }}</span>
          <span class="zow-status-pill" :class="STATUS_CLS[c.status]">{{ c.status }}</span>
          <div style="display:flex;gap:4px;">
            <button class="zcat-act" @click="">View</button>
            <button class="zcat-act" @click="">Renew</button>
          </div>
        </div>
      </div>

      <!-- Onboarding -->
      <div v-if="tab === 'onboarding'" class="zow-onboard-list">
        <div v-for="o in onboarding" :key="o.id" class="zow-onboard-card">
          <div class="zow-onboard-head">
            <div>
              <div class="zow-name">{{ o.entity }}</div>
              <div class="zow-id">{{ o.id }} · {{ o.type }} · {{ o.market }}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
              <span class="zow-onboard-step">{{ o.step }}</span>
              <span class="zow-dim">{{ o.assignee }}</span>
            </div>
          </div>
          <div class="zow-progress-row">
            <div class="zow-progress-bar">
              <div class="zow-progress-fill" :style="{ width: o.progress + '%' }" :class="{ 'is-done': o.progress >= 100 }" />
            </div>
            <span class="zow-progress-pct" :class="{ 'is-done': o.progress >= 80 }">{{ o.progress }}%</span>
          </div>
          <div style="display:flex;gap:6px;margin-top:10px;">
            <button class="zcat-act" @click="">View Details</button>
            <button class="zcat-act" @click="">Send Reminder</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail drawer (simple right panel) -->
    <Teleport to="body">
      <div v-if="selected" class="zow-drawer-backdrop" @click="selected = null">
        <div class="zow-drawer" @click.stop>
          <div class="zow-drawer-head">
            <span class="zow-drawer-title">{{ selected.name }}</span>
            <button class="zow-drawer-close" @click="selected = null">×</button>
          </div>
          <div class="zow-drawer-body">
            <div v-for="[k,v] in Object.entries(selected).filter(([k])=>k!=='id')" :key="k" class="zow-drawer-row">
              <span class="zow-drawer-label">{{ k.replace(/_/g,' ') }}</span>
              <span class="zow-drawer-val">{{ Array.isArray(v) ? v.join(', ') : v }}</span>
            </div>
          </div>
          <div style="padding:14px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="zwh-btn-primary" @click="">Edit</button>
            <button class="zwh-btn-ghost" @click="selected = null">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.zow-wrap { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.zwh-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--zg-line); flex-shrink: 0; flex-wrap: wrap; gap: 8px; }
.zwh-header-left { display: flex; flex-direction: column; gap: 2px; }
.zwh-title { font-size: 16px; font-weight: 700; color: var(--zg-text); }
.zwh-subtitle { font-size: 11.5px; color: var(--zg-text-dim); }

.zow-tabs { display: flex; border-bottom: 1px solid var(--zg-line); background: var(--zg-bg-elev); flex-shrink: 0; padding: 0 20px; }
.zow-tab { height: 40px; padding: 0 14px; border: none; background: transparent; font-size: 12.5px; cursor: pointer; color: var(--zg-text-dim); border-bottom: 2px solid transparent; margin-bottom: -1px; font-weight: 400; }
.zow-tab.is-active { color: var(--zg-accent); border-bottom-color: var(--zg-accent); font-weight: 600; }

.zwh-kpi-strip { display: flex; align-items: stretch; border-bottom: 1px solid var(--zg-line); background: var(--zg-panel); flex-shrink: 0; }
.zwh-kpi-cell { flex: 1; padding: 8px 16px; border-right: 1px solid var(--zg-line); display: flex; flex-direction: column; gap: 2px; }
.zwh-kpi-cell:last-child { border-right: none; }
.zwh-kpi-lbl { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); font-weight: 600; }
.zwh-kpi-val { font-family: var(--zg-mono); font-size: 18px; font-weight: 800; color: var(--zg-text); }
.zwh-kpi-val.is-accent { color: var(--zg-accent); }
.zwh-kpi-val.is-good { color: var(--zg-good); }
.zwh-kpi-val.is-warn { color: var(--zg-warn); }
.zwh-kpi-val.is-danger { color: var(--zg-danger); }

.zow-toolbar { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-bottom: 1px solid var(--zg-line); flex-shrink: 0; flex-wrap: wrap; }
.zow-search { width: 100%; height: 28px; padding-left: 24px; padding-right: 8px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-size: 12px; color: var(--zg-text); outline: none; box-sizing: border-box; }

.zow-content { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }

.zow-table { border-bottom: 1px solid var(--zg-line); }
.zow-table-head { display: grid; padding: 0 16px; height: 30px; background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line); font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); font-weight: 600; align-items: center; gap: 10px; }
.zow-table-row { display: grid; padding: 9px 16px; background: var(--zg-panel); border-bottom: 1px solid var(--zg-line); align-items: center; font-size: 12px; gap: 10px; transition: background .1s; }
.zow-table-row:hover { background: var(--zg-panel-hi); }
.zow-table-row:nth-child(odd) { background: var(--zg-bg); }
.zow-table-row:nth-child(odd):hover { background: var(--zg-panel-hi); }

.zow-name { font-size: 12.5px; font-weight: 600; color: var(--zg-text); }
.zow-id { font-size: 10px; color: var(--zg-text-dim); font-family: var(--zg-mono); margin-top: 1px; }
.zow-dim { font-size: 11px; color: var(--zg-text-dim); }
.zow-mono { font-family: var(--zg-mono); font-size: 11.5px; color: var(--zg-text-mid); }
.zow-badge { height: 20px; padding: 0 6px; border-radius: 2px; background: var(--zg-panel-hi); border: 1px solid var(--zg-line); font-size: 10.5px; font-weight: 700; color: var(--zg-text-dim); display: inline-flex; align-items: center; }
.zow-status-pill { font-size: 10.5px; font-weight: 600; text-transform: capitalize; }
.zow-status-pill.is-good { color: var(--zg-good); }
.zow-status-pill.is-warn { color: var(--zg-warn); }
.zow-status-pill.is-danger { color: var(--zg-danger); }
.zow-status-pill.is-accent { color: var(--zg-accent); }
.zow-tier { height: 20px; padding: 0 7px; border-radius: 2px; font-size: 10.5px; font-weight: 700; display: inline-flex; align-items: center; }
.zow-tier.is-gold { background: oklch(0.88 0.14 85 / 0.15); color: oklch(0.78 0.14 85); border: 1px solid oklch(0.78 0.14 85 / 0.3); }
.zow-tier.is-silver { background: oklch(0.80 0.02 240 / 0.15); color: oklch(0.70 0.02 240); border: 1px solid oklch(0.70 0.02 240 / 0.3); }
.zow-tier.is-bronze { background: oklch(0.82 0.10 50 / 0.15); color: oklch(0.72 0.10 50); border: 1px solid oklch(0.72 0.10 50 / 0.3); }
.zow-doc-tag { height: 18px; padding: 0 5px; border-radius: 2px; background: var(--zg-panel-hi); border: 1px solid var(--zg-line); font-size: 9.5px; color: var(--zg-text-dim); display: inline-flex; align-items: center; }

/* Onboarding cards */
.zow-onboard-list { display: flex; flex-direction: column; gap: 10px; padding: 16px; }
.zow-onboard-card { background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 14px 16px; }
.zow-onboard-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
.zow-onboard-step { font-size: 11.5px; font-weight: 600; color: var(--zg-accent); }
.zow-progress-row { display: flex; align-items: center; gap: 10px; }
.zow-progress-bar { flex: 1; height: 6px; background: var(--zg-panel-hi); border-radius: 3px; overflow: hidden; }
.zow-progress-fill { height: 100%; background: var(--zg-accent); border-radius: 3px; transition: width .4s; }
.zow-progress-fill.is-done { background: var(--zg-good); }
.zow-progress-pct { font-family: var(--zg-mono); font-size: 11px; font-weight: 700; color: var(--zg-text-mid); width: 36px; text-align: right; }
.zow-progress-pct.is-done { color: var(--zg-good); }

/* Detail drawer */
.zow-drawer-backdrop { position: fixed; inset: 0; z-index: 500; }
.zow-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 360px; background: var(--zg-bg-elev); border-left: 1px solid var(--zg-line); display: flex; flex-direction: column; z-index: 501; }
.zow-drawer-head { padding: 14px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.zow-drawer-title { font-size: 13px; font-weight: 700; color: var(--zg-text); }
.zow-drawer-close { width: 26px; height: 26px; border: none; background: var(--zg-panel); border-radius: 4px; cursor: pointer; color: var(--zg-text-dim); font-size: 16px; }
.zow-drawer-body { flex: 1; overflow-y: auto; padding: 14px 20px; display: flex; flex-direction: column; gap: 8px; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }
.zow-drawer-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 6px 0; border-bottom: 1px solid var(--zg-line); }
.zow-drawer-label { font-size: 11px; color: var(--zg-text-dim); text-transform: capitalize; flex-shrink: 0; }
.zow-drawer-val { font-size: 12px; font-weight: 500; color: var(--zg-text); text-align: right; }

/* Shared */
.zwh-filter-chip { height: 28px; padding: 0 10px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 11.5px; color: var(--zg-text-dim); white-space: nowrap; }
.zwh-filter-chip.is-active { background: var(--zg-panel-hi); color: var(--zg-text); border-color: var(--zg-accent); }
.zwh-btn-primary { height: 32px; padding: 0 14px; border: none; border-radius: var(--zg-radius-md); background: var(--zg-accent); color: oklch(0.18 0.04 130); font-weight: 700; font-size: 12px; cursor: pointer; }
.zwh-btn-ghost { height: 32px; padding: 0 14px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: transparent; color: var(--zg-text-mid); font-size: 12px; cursor: pointer; }
.zcat-act { height: 24px; padding: 0 8px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 11px; color: var(--zg-text-dim); }
</style>
