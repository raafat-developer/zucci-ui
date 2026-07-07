<script setup>
/**
 * TicketsView — faithful Vue port of ZucciTicketsModule. Header + KPIs,
 * list pane (search + status/priority/category filters, bulk bar, SLA badges),
 * detail pane (assignee/team/status selects, meta, timeline, CSAT, reply box
 * with canned responses / resolve / escalate / close), New Ticket + SLA modals.
 */
import { ref, reactive, computed, onMounted } from 'vue';
import { useTicketsStore } from '@/stores/tickets';
import {
  ZC_TICKETS, CANNED, TIMELINE_DATA, PRIORITY_META, STATUS_META, CAT_COLORS, TEAMS, ASSIGNEES,
} from '@/data/ticketsData';
import ZModal from '@/components/ui/ZModal.vue';

const tickets = reactive(ZC_TICKETS.map((t) => ({ ...t })));
const ticketsStore = useTicketsStore();
onMounted(async () => {
  // Data comes from the store (mock-backed now, real API later).
  try { const rows = await ticketsStore.fetchAll(); if (rows?.length) tickets.splice(0, tickets.length, ...rows); } catch { /* keep seed */ }
});
const activeId = ref(null);
const statusF = ref('all');
const priorityF = ref('all');
const catF = ref('all');
const search = ref('');
const selected = ref(new Set());
const newOpen = ref(false);
const slaOpen = ref(false);
const comment = ref('');
const cannedOpen = ref(false);

const nt = reactive({ subject:'', cat:'Orders', priority:'medium', entity:'', market:'AE', order_ref:'', team:'Operations', assignee:'Unassigned', notes:'' });

const pMeta = (p) => PRIORITY_META[p];
const sMeta = (s) => STATUS_META[s];
const cats = computed(() => [...new Set(tickets.map((t) => t.cat))]);
const active = computed(() => tickets.find((t) => t.id === activeId.value) || null);

const filtered = computed(() => {
  const sq = search.value.toLowerCase();
  return tickets.filter((t) =>
    (statusF.value === 'all' || (statusF.value === 'breached' ? t.sla_remaining < 0 : t.status === statusF.value)) &&
    (priorityF.value === 'all' || t.priority === priorityF.value) &&
    (catF.value === 'all' || t.cat === catF.value) &&
    (!sq || t.id.toLowerCase().includes(sq) || t.subject.toLowerCase().includes(sq) || t.entity.toLowerCase().includes(sq)),
  );
});
const kpis = computed(() => [
  ['Open', tickets.filter((t) => t.status === 'open').length, 'is-accent'],
  ['In Progress', tickets.filter((t) => t.status === 'in_progress').length, ''],
  ['SLA Breached', tickets.filter((t) => t.sla_remaining < 0 && t.status !== 'resolved' && t.status !== 'closed').length, 'is-danger'],
  ['Resolved Today', tickets.filter((t) => t.status === 'resolved').length, 'is-good'],
  ['Avg CSAT', '4.3 / 5', 'is-good'],
]);
const timeline = computed(() => TIMELINE_DATA[active.value?.id] || (active.value ? [
  { time: active.value.created, user:'System', action:'Ticket created', type:'create' },
  { time: active.value.updated, user: active.value.assignee, action:'Last updated', type:'status' },
] : []));
const dotColor = (type) => type === 'sla' ? 'var(--zg-danger)' : type === 'escalate' ? 'var(--zg-warn)' : type === 'create' ? 'var(--zg-accent)' : 'var(--zg-text-dim)';
const slaClass = (t) => t.sla_remaining < 0 ? 'breach' : t.sla_remaining <= t.sla_hours * 0.25 ? 'warn' : 'ok';

const setField = (id, k, v) => { const t = tickets.find((x) => x.id === id); if (t) t[k] = v; };
const resolve = () => { if (active.value) active.value.status = 'resolved'; };
const escalate = () => { if (active.value) active.value.status = 'in_progress'; };
const closeTicket = () => { if (active.value) active.value.status = 'closed'; };
const applyCanned = (c) => { comment.value = c.body; cannedOpen.value = false; };
const createTicket = () => {
  const id = `TKT-${4800 + Math.floor(Math.random() * 100)}`;
  const h = nt.priority === 'critical' ? 4 : nt.priority === 'high' ? 8 : 48;
  tickets.unshift({ ...nt, id, status:'open', created:'Just now', updated:'Just now', sla_hours:h, sla_remaining:h, tags:[] });
  newOpen.value = false;
};
const statusEntries = Object.entries(STATUS_META);
const slaRows = [['Orders','2h','4h','24h','72h'],['Finance','2h','8h','48h','168h'],['KYC/KYB','4h','24h','72h','168h'],['Brand','8h','48h','72h','168h'],['Tech','1h','4h','24h','72h'],['Logistics','2h','8h','24h','72h']];
const statusChips = [['all','All'],['open','Open'],['in_progress','In Progress'],['pending_vendor','Pending'],['resolved','Resolved'],['breached','SLA Breach']];
const prioChips = [['all','All Priority'],['critical','Critical'],['high','High'],['medium','Medium'],['low','Low']];
const catColor = (c) => CAT_COLORS[c] || 'var(--zg-text-dim)';
const teams = TEAMS;
const assignees = ASSIGNEES;
const canned = CANNED;
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;min-height:0">
    <div class="zwh-header" style="flex-shrink:0">
      <div class="zwh-header-left">
        <div style="font-size:16px;font-weight:700;color:var(--zg-text)">Tickets</div>
        <div class="zwh-subtitle">{{ tickets.filter(t => t.status !== 'closed').length }} active · {{ tickets.filter(t => t.sla_remaining < 0 && t.status !== 'closed').length }} SLA breached</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="zwh-btn-ghost">Export CSV</button>
        <button class="zwh-btn-ghost" @click="slaOpen = true">SLA Rules</button>
        <button class="zwh-btn-primary" @click="newOpen = true">+ New Ticket</button>
      </div>
    </div>

    <div class="zwh-kpi-strip" style="flex-shrink:0">
      <div v-for="[l, v, cls] in kpis" :key="l" class="zwh-kpi-cell"><span class="zwh-kpi-lbl">{{ l }}</span><span class="zwh-kpi-val" :class="cls">{{ v }}</span></div>
    </div>

    <div style="flex:1;display:flex;min-height:0">
      <!-- List pane -->
      <div style="width:340px;flex-shrink:0;border-right:1px solid var(--zg-line);display:flex;flex-direction:column;min-height:0">
        <div style="padding:8px 12px;border-bottom:1px solid var(--zg-line);display:flex;flex-direction:column;gap:6px;flex-shrink:0">
          <div style="position:relative">
            <input v-model="search" placeholder="Search tickets…" style="width:100%;height:28px;padding:0 8px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box" />
          </div>
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <button v-for="[v, l] in statusChips" :key="v" class="zwh-filter-chip" :class="{ 'is-active': statusF === v }" style="font-size:10px;height:20px" @click="statusF = v">{{ l }}</button>
          </div>
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <button v-for="[v, l] in prioChips" :key="v" class="zwh-filter-chip" :class="{ 'is-active': priorityF === v }" style="font-size:10px;height:20px" @click="priorityF = v">{{ l }}</button>
          </div>
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <button class="zwh-filter-chip" :class="{ 'is-active': catF === 'all' }" style="font-size:10px;height:20px" @click="catF = 'all'">All</button>
            <button v-for="c in cats" :key="c" class="zwh-filter-chip" :class="{ 'is-active': catF === c }" style="font-size:10px;height:20px" :style="{ color: catF === c ? 'var(--zg-accent)' : catColor(c) }" @click="catF = c">{{ c }}</button>
          </div>
        </div>

        <div style="flex:1;overflow-y:auto">
          <div v-if="!filtered.length" style="padding:20px;text-align:center;font-size:13px;color:var(--zg-text-dim)">No tickets match filters</div>
          <button
            v-for="t in filtered"
            :key="t.id"
            style="width:100%;padding:10px 16px;border:none;border-bottom:1px solid var(--zg-line-soft);cursor:pointer;text-align:left"
            :style="{ background: activeId === t.id ? 'var(--zg-panel-hi)' : 'transparent' }"
            @click="activeId = t.id"
          >
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
              <span style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim)">{{ t.id }}</span>
              <span :style="{ height:'16px', padding:'0 5px', borderRadius:'2px', fontSize:'9.5px', fontWeight:700, background: pMeta(t.priority).color + '22', color: pMeta(t.priority).color, display:'inline-flex', alignItems:'center' }">{{ pMeta(t.priority).label }}</span>
              <span :style="{ height:'16px', padding:'0 5px', borderRadius:'2px', fontSize:'9.5px', fontWeight:600, background:'var(--zg-panel-hi)', color: sMeta(t.status).color, display:'inline-flex', alignItems:'center', marginLeft:'auto' }">{{ sMeta(t.status).label }}</span>
            </div>
            <div style="font-size:12.5px;font-weight:600;color:var(--zg-text);line-height:1.35;margin-bottom:4px">{{ t.subject }}</div>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span :style="{ fontSize:'10.5px', fontWeight:600, color: catColor(t.cat) }">{{ t.cat }}</span>
              <span style="font-size:10.5px;color:var(--zg-text-xdim)">·</span>
              <span style="font-size:10.5px;color:var(--zg-text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px">{{ t.entity }}</span>
              <span style="margin-left:auto;flex-shrink:0">
                <span v-if="slaClass(t) === 'breach'" style="font-size:10px;padding:2px 6px;border-radius:2px;background:oklch(0.70 0.18 25 / 0.15);color:var(--zg-danger);font-weight:700;font-family:var(--zg-mono)">BREACHED</span>
                <span v-else :style="{ fontSize:'10px', padding:'2px 6px', borderRadius:'2px', background: slaClass(t)==='warn' ? 'oklch(0.82 0.15 75 / 0.12)' : 'var(--zg-panel-hi)', color: slaClass(t)==='warn' ? 'var(--zg-warn)' : 'var(--zg-text-dim)', fontWeight:700, fontFamily:'var(--zg-mono)' }">{{ t.sla_remaining }}h left</span>
              </span>
            </div>
          </button>
        </div>
        <div style="padding:8px 12px;border-top:1px solid var(--zg-line);font-size:11px;color:var(--zg-text-dim);flex-shrink:0">{{ filtered.length }} tickets</div>
      </div>

      <!-- Detail pane -->
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;min-height:0;position:relative">
        <template v-if="active">
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);flex-shrink:0;background:var(--zg-bg-elev)">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px">
              <div>
                <div style="font-size:11px;font-family:var(--zg-mono);color:var(--zg-text-dim);margin-bottom:3px">{{ active.id }} · {{ active.market }} · {{ active.created }}</div>
                <div style="font-size:15px;font-weight:700;color:var(--zg-text);line-height:1.3">{{ active.subject }}</div>
              </div>
              <div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap">
                <span :style="{ height:'22px', padding:'0 8px', borderRadius:'3px', fontSize:'10.5px', fontWeight:700, background: pMeta(active.priority).color + '22', color: pMeta(active.priority).color, display:'inline-flex', alignItems:'center' }">{{ pMeta(active.priority).label }}</span>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
              <div style="display:flex;flex-direction:column;gap:3px">
                <span style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-xdim);font-weight:600">Assignee</span>
                <select :value="active.assignee" style="height:26px;padding:0 6px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-sm);font-family:inherit;font-size:11px;color:var(--zg-text);outline:none;cursor:pointer" @change="setField(active.id, 'assignee', $event.target.value)">
                  <option v-for="a in assignees" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>
              <div style="display:flex;flex-direction:column;gap:3px">
                <span style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-xdim);font-weight:600">Team</span>
                <select :value="active.team" style="height:26px;padding:0 6px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-sm);font-family:inherit;font-size:11px;color:var(--zg-text);outline:none;cursor:pointer" @change="setField(active.id, 'team', $event.target.value)">
                  <option v-for="t in teams" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div style="display:flex;flex-direction:column;gap:3px">
                <span style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-xdim);font-weight:600">SLA</span>
                <div style="height:26px;display:flex;align-items:center">
                  <span v-if="active.sla_remaining < 0" style="font-size:10px;padding:2px 6px;border-radius:2px;background:oklch(0.70 0.18 25 / 0.15);color:var(--zg-danger);font-weight:700;font-family:var(--zg-mono)">BREACHED</span>
                  <span v-else style="font-size:10px;padding:2px 6px;border-radius:2px;background:var(--zg-panel-hi);color:var(--zg-text-dim);font-weight:700;font-family:var(--zg-mono)">{{ active.sla_remaining }}h left</span>
                </div>
              </div>
              <div style="display:flex;flex-direction:column;gap:3px">
                <span style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-xdim);font-weight:600">Status</span>
                <select :value="active.status" :style="{ height:'26px', padding:'0 6px', background:'var(--zg-panel)', border:'1px solid var(--zg-line)', borderRadius:'var(--zg-radius-sm)', fontFamily:'inherit', fontSize:'11px', color: sMeta(active.status).color, outline:'none', cursor:'pointer', fontWeight:600 }" @change="setField(active.id, 'status', $event.target.value)">
                  <option v-for="[v, m] in statusEntries" :key="v" :value="v">{{ m.label }}</option>
                </select>
              </div>
            </div>
          </div>

          <div style="flex:1;overflow-y:auto">
            <div style="padding:12px 20px;border-bottom:1px solid var(--zg-line);display:flex;gap:16px;flex-wrap:wrap">
              <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.06em;color:var(--zg-text-xdim);font-weight:600;margin-bottom:2px">Entity</div><div style="font-size:12px;font-weight:600;color:var(--zg-text)">{{ active.entity }}</div></div>
              <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.06em;color:var(--zg-text-xdim);font-weight:600;margin-bottom:2px">Category</div><div style="font-size:12px;font-weight:600;color:var(--zg-text)">{{ active.cat }}</div></div>
              <div v-if="active.order_ref"><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.06em;color:var(--zg-text-xdim);font-weight:600;margin-bottom:2px">Linked Ref</div><div style="font-size:12px;font-weight:600;color:var(--zg-text)">{{ active.order_ref }}</div></div>
              <div style="display:flex;gap:4px;flex-wrap:wrap;margin-left:auto">
                <span v-for="tg in (active.tags || [])" :key="tg" style="height:18px;padding:0 6px;border-radius:2px;background:var(--zg-panel);border:1px solid var(--zg-line);font-size:10px;color:var(--zg-text-dim);display:inline-flex;align-items:center">{{ tg }}</span>
              </div>
            </div>

            <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line)">
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-xdim);font-weight:700;margin-bottom:10px">Timeline</div>
              <div v-for="(e, i) in timeline" :key="i" style="display:flex;gap:10px;align-items:flex-start;padding-bottom:10px">
                <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
                  <div :style="{ width:'8px', height:'8px', borderRadius:'50%', background: dotColor(e.type), marginTop:'2px' }" />
                  <div v-if="i < timeline.length - 1" style="width:1px;flex:1;background:var(--zg-line);min-height:12px;margin-top:2px" />
                </div>
                <div style="flex:1">
                  <div :style="{ fontSize:'12px', color:'var(--zg-text)', fontWeight: e.type === 'sla' ? 700 : 500 }">{{ e.action }}</div>
                  <div style="font-size:10.5px;color:var(--zg-text-xdim);margin-top:1px">{{ e.user }} · {{ e.time }}</div>
                </div>
              </div>
            </div>

            <div v-if="active.status === 'resolved' || active.status === 'closed'" style="padding:10px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;gap:10px">
              <span style="font-size:11.5px;color:var(--zg-text-mid)">CSAT:</span>
              <button v-for="n in 5" :key="n" :style="{ width:'24px', height:'24px', borderRadius:'50%', border:'1px solid', cursor:'pointer', fontSize:'12px', display:'flex', alignItems:'center', justifyContent:'center', borderColor: (active.csat || 0) >= n ? 'var(--zg-accent)' : 'var(--zg-line)', background: (active.csat || 0) >= n ? 'var(--zg-accent-tint)' : 'transparent', color: (active.csat || 0) >= n ? 'var(--zg-accent)' : 'var(--zg-text-dim)' }" @click="active.csat = n">{{ n }}</button>
            </div>
          </div>

          <div style="padding:12px 16px;border-top:1px solid var(--zg-line);flex-shrink:0;background:var(--zg-bg-elev);position:relative">
            <textarea v-model="comment" placeholder="Add a comment or reply…" style="width:100%;height:72px;padding:8px 10px;resize:none;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box" />
            <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
              <button class="zwh-btn-primary" :style="{ height:'30px', fontSize:'12px', opacity: comment ? 1 : 0.4 }" @click="comment = ''">Send</button>
              <button class="zwh-btn-ghost" style="height:30px;font-size:12px" @click="cannedOpen = !cannedOpen">Canned Responses</button>
              <button class="zwh-btn-ghost" style="height:30px;font-size:12px" @click="resolve">Resolve</button>
              <button class="zwh-btn-ghost" style="height:30px;font-size:12px" @click="escalate">Escalate</button>
              <button class="zwh-btn-ghost" style="height:30px;font-size:12px;color:var(--zg-danger)" @click="closeTicket">Close</button>
            </div>
            <div v-if="cannedOpen" style="position:absolute;bottom:80px;left:16px;width:320px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);box-shadow:0 8px 32px oklch(0.05 0.01 250 / 0.5);z-index:100;max-height:220px;overflow-y:auto">
              <button v-for="c in canned" :key="c.id" style="width:100%;padding:9px 14px;border:none;border-bottom:1px solid var(--zg-line-soft);background:transparent;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:2px;font-family:inherit" @click="applyCanned(c)">
                <span style="font-size:12.5px;font-weight:600;color:var(--zg-text)">{{ c.title }}</span>
                <span style="font-size:11px;color:var(--zg-text-dim);line-height:1.3">{{ c.body.slice(0, 80) }}…</span>
              </button>
            </div>
          </div>
        </template>
        <div v-else style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;color:var(--zg-text-dim)">
          <svg viewBox="0 0 24 24" width="36" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          <span style="font-size:13px">Select a ticket to view details</span>
        </div>
      </div>
    </div>

    <!-- New Ticket modal -->
    <ZModal :open="newOpen" title="New Ticket" :width="540" @close="newOpen = false">
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;flex-direction:column;gap:4px">
          <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Subject</label>
          <input v-model="nt.subject" placeholder="Describe the issue…" style="height:30px;padding:0 9px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Category</label><select v-model="nt.cat" style="height:30px;padding:0 9px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text)"><option v-for="o in ['Orders','Finance','KYC/KYB','Brand','Tech','Logistics']" :key="o">{{ o }}</option></select></div>
          <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Priority</label><select v-model="nt.priority" style="height:30px;padding:0 9px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text)"><option v-for="o in ['low','medium','high','critical']" :key="o">{{ o }}</option></select></div>
          <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Entity / Vendor</label><input v-model="nt.entity" placeholder="Brand or account name" style="height:30px;padding:0 9px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text)" /></div>
          <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Market</label><select v-model="nt.market" style="height:30px;padding:0 9px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text)"><option v-for="o in ['AE','SA','EG','KW','BH','QA','OM']" :key="o">{{ o }}</option></select></div>
          <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Team</label><select v-model="nt.team" style="height:30px;padding:0 9px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text)"><option v-for="o in teams" :key="o">{{ o }}</option></select></div>
          <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Assign To</label><select v-model="nt.assignee" style="height:30px;padding:0 9px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text)"><option v-for="o in assignees" :key="o">{{ o }}</option></select></div>
        </div>
      </div>
      <template #footer>
        <button class="zwh-btn-ghost" @click="newOpen = false">Cancel</button>
        <button class="zwh-btn-primary" :style="{ opacity: nt.subject && nt.entity ? 1 : 0.4 }" @click="createTicket">Create Ticket</button>
      </template>
    </ZModal>

    <!-- SLA modal -->
    <ZModal :open="slaOpen" title="SLA Rules" :width="560" @close="slaOpen = false">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:var(--zg-panel-hi)"><th v-for="h in ['Category','Critical','High','Medium','Low']" :key="h" style="padding:8px 12px;text-align:left;border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600">{{ h }}</th></tr></thead>
        <tbody>
          <tr v-for="(row, i) in slaRows" :key="row[0]" :style="{ background: i % 2 === 0 ? 'var(--zg-panel)' : 'var(--zg-bg)' }">
            <td v-for="(cell, j) in row" :key="j" :style="{ padding:'9px 12px', borderBottom:'1px solid var(--zg-line-soft)', fontFamily: j > 0 ? 'var(--zg-mono)' : 'inherit', fontWeight: j === 0 ? 600 : 400, color: j === 0 ? 'var(--zg-text)' : 'var(--zg-text-mid)' }">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </ZModal>
  </div>
</template>

