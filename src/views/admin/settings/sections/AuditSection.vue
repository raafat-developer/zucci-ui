<script setup>
import { ref, computed } from 'vue';
import AuditDetailPanel from '../drawers/AuditDetailPanel.vue';

const search  = ref('');
const page    = ref(0);
const detail  = ref(null);
const PAGE_SZ = 12;

const AUDIT_LOG = [
  { id:'a1',  user:'Sara Medhat',   action:'Updated company VAT registration',  module:'Settings › Company',   time:'2h ago',   ip:'196.x.x.x' },
  { id:'a2',  user:'Ahmed Khalil',  action:'Processed payout PAY-4821',          module:'Finance',              time:'3h ago',   ip:'185.x.x.x' },
  { id:'a3',  user:'System',        action:'SLA breach detected — TKT-4820',     module:'Tickets',              time:'4h ago',   ip:'internal'  },
  { id:'a4',  user:'Sara Medhat',   action:'Approved listing L-0441',            module:'Marketplace',          time:'5h ago',   ip:'196.x.x.x' },
  { id:'a5',  user:'Omar Hassan',   action:'Adjusted stock — SWIM-L-BLK (-4)',   module:'Warehouse › Inventory',time:'6h ago',   ip:'212.x.x.x' },
  { id:'a6',  user:'Layla Haddad',  action:'Resolved ticket TKT-4818',           module:'Tickets',              time:'7h ago',   ip:'37.x.x.x'  },
  { id:'a7',  user:'Nada Ibrahim',  action:'Created campaign EID-2025',          module:'Comms',                time:'8h ago',   ip:'196.x.x.x' },
  { id:'a8',  user:'Sara Medhat',   action:'Updated return policy — SA',         module:'Settings › Returns',   time:'1d ago',   ip:'196.x.x.x' },
  { id:'a9',  user:'System',        action:'Auto-escalated TKT-4820 to Admin',   module:'Tickets',              time:'1d ago',   ip:'internal'  },
  { id:'a10', user:'Omar Hassan',   action:'Updated bin locations',              module:'Warehouse › Detail',   time:'3d ago',   ip:'212.x.x.x' },
  { id:'a11', user:'Ahmed Khalil',  action:'Added payment gateway — Tabby',     module:'Settings › Gateways',  time:'4d ago',   ip:'185.x.x.x' },
  { id:'a12', user:'Sara Medhat',   action:'Invited user n.ibrahim@zucci.com',  module:'Settings › Access',    time:'5d ago',   ip:'196.x.x.x' },
  { id:'a13', user:'Tariq Saleh',   action:'Created new warehouse WH-EG-001',   module:'Warehouses',           time:'6d ago',   ip:'77.x.x.x'  },
  { id:'a14', user:'Nada Ibrahim',  action:'Launched flash sale — EID 2025',    module:'Promotions',           time:'7d ago',   ip:'196.x.x.x' },
  { id:'a15', user:'System',        action:'Automatic payout cycle processed',  module:'Finance',              time:'7d ago',   ip:'internal'  },
];

const filtered = computed(() => {
  const q = search.value.toLowerCase();
  return AUDIT_LOG.filter(e => !q || e.user.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || e.module.toLowerCase().includes(q));
});
const paged   = computed(() => filtered.value.slice(page.value * PAGE_SZ, (page.value + 1) * PAGE_SZ));
const maxPage = computed(() => Math.max(0, Math.ceil(filtered.value.length / PAGE_SZ) - 1));

function exportCSV() {
  const rows = [['ID','User','Action','Module','Time','IP'], ...AUDIT_LOG.map(e => [e.id, e.user, e.action, e.module, e.time, e.ip])];
  const b = new Blob([rows.map(r => r.join(',')).join('\n')], { type:'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'audit-log.csv'; a.click();
}
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Audit Log</div><div class="zset-content-sub">All admin actions with user, module, IP, and timestamp</div></div>
      <button class="zwh-btn-ghost" @click="exportCSV">Export CSV</button>
    </div>

    <!-- Search -->
    <div style="position:relative;margin-bottom:12px;max-width:320px;">
      <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
      <input v-model="search" placeholder="Search user, action, module…" @input="page = 0"
        style="height:30px;padding:0 8px 0 26px;width:100%;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box;" />
    </div>

    <!-- Table -->
    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
      <div style="display:grid;grid-template-columns:70px 1fr 140px 80px 80px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;gap:10px;">
        <span>ID</span><span>Action</span><span>Module</span><span>Time</span><span>IP</span>
      </div>
      <div v-for="e in paged" :key="e.id"
        style="display:grid;grid-template-columns:70px 1fr 140px 80px 80px;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);align-items:center;font-size:12px;gap:10px;cursor:pointer;transition:background .08s;"
        @click="detail = e"
        @mouseenter="$event.currentTarget.style.background='var(--zg-panel-hi)'"
        @mouseleave="$event.currentTarget.style.background='var(--zg-panel)'">
        <span style="font-family:var(--zg-mono);font-size:10px;color:var(--zg-text-dim);">{{ e.id }}</span>
        <div>
          <div style="font-size:12px;color:var(--zg-text);">{{ e.action }}</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:1px;">{{ e.user }}</div>
        </div>
        <span style="font-size:11px;color:var(--zg-text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ e.module }}</span>
        <span style="font-size:11px;color:var(--zg-text-dim);">{{ e.time }}</span>
        <span style="font-family:var(--zg-mono);font-size:10px;color:var(--zg-text-dim);">{{ e.ip }}</span>
      </div>
    </div>

    <!-- Pagination -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;font-size:11.5px;color:var(--zg-text-dim);">
      <span>{{ filtered.length }} entries</span>
      <div style="display:flex;gap:6px;align-items:center;">
        <button class="zwh-btn-ghost" style="height:26px;font-size:11px;" :disabled="page===0" :style="{ opacity:page===0?0.4:1 }" @click="page--">← Prev</button>
        <span>{{ page+1 }} / {{ maxPage+1 }}</span>
        <button class="zwh-btn-ghost" style="height:26px;font-size:11px;" :disabled="page>=maxPage" :style="{ opacity:page>=maxPage?0.4:1 }" @click="page++">Next →</button>
      </div>
    </div>

    <AuditDetailPanel :entry="detail" @close="detail = null" />
  </div>
</template>
