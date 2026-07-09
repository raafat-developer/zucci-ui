<script setup>
/**
 * TicketsView — Tickets module shell.
 * Splits into: TicketListItem · TicketDetail · NewTicketModal
 */
import { ref, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  ZC_TICKETS, PRIORITY_META, STATUS_META, CAT_COLORS,
} from '@/data/ticketsData';
import TicketListItem  from './TicketListItem.vue';
import TicketDetail    from './TicketDetail.vue';
import NewTicketModal  from './NewTicketModal.vue';

const tickets  = reactive(ZC_TICKETS.map(t => ({ ...t })));
const activeId = ref(null);
const statusF  = ref('all');
const priorityF = ref('all');
const catF     = ref('all');
const search   = ref('');
const selected = ref(new Set());
const newOpen  = ref(false);

const active = computed(() => tickets.find(t => t.id === activeId.value) || null);
const cats   = computed(() => [...new Set(tickets.map(t => t.cat))]);

const filtered = computed(() => {
  const sq = search.value.toLowerCase();
  return tickets.filter(t =>
    (statusF.value === 'all' || (statusF.value === 'breached' ? t.sla_remaining < 0 : t.status === statusF.value)) &&
    (priorityF.value === 'all' || t.priority === priorityF.value) &&
    (catF.value === 'all' || t.cat === catF.value) &&
    (!sq || t.id.toLowerCase().includes(sq) || t.subject.toLowerCase().includes(sq) || t.entity.toLowerCase().includes(sq))
  );
});

const kpis = computed(() => [
  ['Open',        tickets.filter(t => t.status === 'open').length,        'is-accent'],
  ['In Progress', tickets.filter(t => t.status === 'in_progress').length, ''],
  ['SLA Breached',tickets.filter(t => t.sla_remaining < 0).length,        'is-danger'],
  ['Resolved',    tickets.filter(t => t.status === 'resolved').length,    'is-good'],
  ['Closed',      tickets.filter(t => t.status === 'closed').length,       ''],
]);

function toggleCheck(id) {
  const n = new Set(selected.value);
  n.has(id) ? n.delete(id) : n.add(id);
  selected.value = n;
}
function selectTicket(t) { activeId.value = t.id; }

function applyUpdate(patch) {
  const idx = tickets.findIndex(t => t.id === patch.id);
  if (idx >= 0) Object.assign(tickets[idx], patch);
}

function addTicket(ticket) {
  tickets.unshift(ticket);
  activeId.value = ticket.id;
  newOpen.value = false;
}

function bulkResolve() {
  tickets.forEach(t => { if (selected.value.has(t.id)) t.status = 'resolved'; });
  selected.value = new Set();
}
function bulkClose() {
  tickets.forEach(t => { if (selected.value.has(t.id)) t.status = 'closed'; });
  selected.value = new Set();
}

const STATUS_FILTERS = [
  ['all','All'], ['open','Open'], ['in_progress','In Progress'],
  ['pending_vendor','Pending Vendor'], ['resolved','Resolved'],
  ['closed','Closed'], ['breached','SLA Breached'],
];
const PRIORITY_FILTERS = [['all','All'], ['critical','Critical'], ['high','High'], ['medium','Medium'], ['low','Low']];
</script>

<template>
  <div class="tkt-wrap">
    <!-- Header -->
    <div class="zwh-header" style="flex-shrink:0;">
      <div class="zwh-header-left">
        <div style="font-size:16px;font-weight:700;color:var(--zg-text);">Tickets</div>
        <div class="zwh-subtitle">Support · Compliance · Finance · Operations — all teams</div>
      </div>
      <button class="btn-primary" @click="newOpen = true">+ New Ticket</button>
    </div>

    <!-- KPI strip -->
    <div class="zwh-kpi-strip" style="flex-shrink:0;">
      <div v-for="[l,v,cls] in kpis" :key="l" class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">{{ l }}</span>
        <span class="zwh-kpi-val" :class="cls">{{ v }}</span>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="tkt-filter-bar" style="flex-shrink:0;">
      <!-- Search -->
      <div style="position:relative;flex:0 0 220px;">
        <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round"
          style="position:absolute;left:7px;top:50%;transform:translateY(-50%);pointer-events:none;">
          <circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/>
        </svg>
        <input v-model="search" placeholder="Search tickets…" class="tkt-search" />
      </div>
      <!-- Status filters -->
      <button v-for="[v,l] in STATUS_FILTERS" :key="v"
        class="chip" :class="{ 'is-active': statusF === v }" @click="statusF = v">{{ l }}</button>
      <div style="width:1px;height:16px;background:var(--zg-line);flex-shrink:0;" />
      <!-- Priority filters -->
      <button v-for="[v,l] in PRIORITY_FILTERS" :key="v"
        class="chip" :class="{ 'is-active': priorityF === v }" @click="priorityF = v">{{ l }}</button>
      <div style="width:1px;height:16px;background:var(--zg-line);flex-shrink:0;" />
      <!-- Category filters -->
      <button class="chip" :class="{ 'is-active': catF === 'all' }" @click="catF = 'all'">All Cats</button>
      <button v-for="c in cats" :key="c"
        class="chip" :class="{ 'is-active': catF === c }" @click="catF = c"
        :style="catF === c ? { borderColor: CAT_COLORS[c] || 'var(--zg-accent)', color: CAT_COLORS[c] || 'var(--zg-accent)' } : {}">{{ c }}</button>
    </div>

    <!-- Bulk action bar -->
    <div v-if="selected.size > 0" class="tkt-bulk-bar">
      <span style="font-size:12px;font-weight:600;color:var(--zg-text);">{{ selected.size }} selected</span>
      <button class="chip" style="color:var(--zg-good);border-color:oklch(0.78 0.15 150 / 0.4);" @click="bulkResolve">Mark Resolved</button>
      <button class="chip" style="color:var(--zg-text-dim);" @click="bulkClose">Mark Closed</button>
      <button class="chip" @click="selected = new Set()">Clear</button>
    </div>

    <!-- Two-pane: list + detail -->
    <div class="tkt-body">
      <!-- List pane -->
      <div class="tkt-list-pane">
        <div v-if="!filtered.length" style="padding:20px;font-size:12px;color:var(--zg-text-dim);text-align:center;">
          No tickets found
        </div>
        <TicketListItem
          v-for="t in filtered" :key="t.id"
          :ticket="t"
          :active="activeId === t.id"
          @select="selectTicket"
          @check="toggleCheck"
        />
      </div>

      <!-- Detail pane -->
      <div class="tkt-detail-pane">
        <div v-if="!active" style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:8px;color:var(--zg-text-dim);">
          <svg viewBox="0 0 24 24" width="40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
            <path d="M4 8V6h16v2a2 2 0 000 4v2H4v-2a2 2 0 000-4z"/><line x1="12" y1="6" x2="12" y2="18"/>
          </svg>
          <span style="font-size:13px;">Select a ticket to view details</span>
        </div>
        <TicketDetail
          v-else
          :ticket="active"
          @update="applyUpdate"
        />
      </div>
    </div>

    <!-- New Ticket Modal -->
    <NewTicketModal :open="newOpen" @close="newOpen = false" @save="addTicket" />
  </div>
</template>

<style scoped>
.tkt-wrap { display:flex;flex-direction:column;height:100%;min-height:0; }
.zwh-header { display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--zg-line);flex-wrap:wrap;gap:8px; }
.zwh-header-left { display:flex;flex-direction:column;gap:2px; }
.zwh-subtitle { font-size:11.5px;color:var(--zg-text-dim); }
.zwh-kpi-strip { display:flex;align-items:stretch;border-bottom:1px solid var(--zg-line);background:var(--zg-panel); }
.zwh-kpi-cell { flex:1;padding:8px 16px;border-right:1px solid var(--zg-line);display:flex;flex-direction:column;gap:2px; }
.zwh-kpi-cell:last-child { border-right:none; }
.zwh-kpi-lbl { font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600; }
.zwh-kpi-val { font-family:var(--zg-mono);font-size:18px;font-weight:800;color:var(--zg-text); }
.zwh-kpi-val.is-accent { color:var(--zg-accent); }
.zwh-kpi-val.is-good { color:var(--zg-good); }
.zwh-kpi-val.is-danger { color:var(--zg-danger); }

.tkt-filter-bar { display:flex;align-items:center;gap:5px;padding:8px 12px;border-bottom:1px solid var(--zg-line);flex-wrap:wrap;background:var(--zg-bg-elev); }
.tkt-search { width:100%;height:28px;padding-left:24px;padding-right:8px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none; }
.chip { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:10.5px;color:var(--zg-text-dim);white-space:nowrap; }
.chip.is-active { background:var(--zg-panel-hi);color:var(--zg-text);border-color:var(--zg-accent); }

.tkt-bulk-bar { display:flex;align-items:center;gap:8px;padding:6px 12px;background:oklch(0.78 0.18 130 / 0.06);border-bottom:1px solid var(--zg-line);flex-shrink:0; }

.tkt-body { flex:1;display:flex;min-height:0; }
.tkt-list-pane { width:340px;flex-shrink:0;border-right:1px solid var(--zg-line);overflow-y:auto;display:flex;flex-direction:column;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent; }
.tkt-detail-pane { flex:1;min-width:0;min-height:0;display:flex;flex-direction:column; }

.btn-primary { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }
</style>
