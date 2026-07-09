<script setup>
/**
 * NotificationsDrawer — slide-in notification feed panel.
 * Triggered by the bell button in the sidebar footer.
 * Features: filter chips, grouped-by-date feed, mark read/all, action links.
 */
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit  = defineEmits(['close', 'navigate']);

const router = useRouter();
const filter = ref('all');
const closing = ref(false);

watch(() => props.open, (v) => { if (v) closing.value = false; });

function close() {
  closing.value = true;
  setTimeout(() => { closing.value = false; emit('close'); }, 220);
}

// ── Notification data ─────────────────────────────────────
const NOTIFS = ref([
  { id:'n1',  type:'ticket',  title:'SLA Breached — TKT-4820',       body:'Payout not received for May cycle is now 4h overdue.',    time:'2m ago',  date:'Today',     unread:true,  route:'/admin/tickets',    severity:'danger' },
  { id:'n2',  type:'order',   title:'New Order — ORD-18841',          body:'Hessa Al Mansoori placed a new order: AED 389.',           time:'8m ago',  date:'Today',     unread:true,  route:'/admin/orders',     severity:'' },
  { id:'n3',  type:'finance', title:'Payout Failed — Almaz Couture',  body:'IBAN validation failed. Payout of AED 12,400 on hold.',    time:'25m ago', date:'Today',     unread:true,  route:'/admin/finance',    severity:'danger' },
  { id:'n4',  type:'system',  title:'Warehouse Alert — WH-AE-001',   body:'Space utilization exceeded 85%. 3 zones at critical.',     time:'1h ago',  date:'Today',     unread:true,  route:'/admin/warehouses', severity:'warn' },
  { id:'n5',  type:'ticket',  title:'New Ticket — TKT-4821',         body:'Commercial Registry renewal required by 24K Fashion.',     time:'2h ago',  date:'Today',     unread:false, route:'/admin/tickets',    severity:'' },
  { id:'n6',  type:'order',   title:'Return Request — RMA-0891',      body:'Hessa Al Mansoori initiated a return for ORD-18817.',     time:'3h ago',  date:'Today',     unread:false, route:'/admin/orders',     severity:'' },
  { id:'n7',  type:'finance', title:'Payout Processed — Desert Kicks',body:'SAR 48,200 payout completed via SNB.',                    time:'5h ago',  date:'Today',     unread:false, route:'/admin/finance',    severity:'' },
  { id:'n8',  type:'kyc',     title:'KYB Submitted — Cairo Threads',  body:'New KYB documents uploaded. Review required.',            time:'Yesterday',date:'Yesterday',unread:false, route:'/admin/owners',     severity:'' },
  { id:'n9',  type:'system',  title:'Low Inventory Alert',            body:'Cloud Runner Sneakers (SA) has 3 units remaining.',       time:'Yesterday',date:'Yesterday',unread:false, route:'/admin/warehouses', severity:'warn' },
  { id:'n10', type:'order',   title:'Order Delivered — ORD-18810',    body:'5 orders delivered across AE market. 0 issues.',          time:'Yesterday',date:'Yesterday',unread:false, route:'/admin/orders',     severity:'' },
  { id:'n11', type:'finance', title:'Reconciliation Discrepancy',     body:'Paymob: EGP 220 shortfall detected in Jun 1 settlement.', time:'Jun 2',   date:'Jun 2',     unread:false, route:'/admin/finance',    severity:'warn' },
  { id:'n12', type:'system',  title:'System Maintenance',             body:'Scheduled maintenance Jun 6 02:00–04:00 GST.',            time:'Jun 1',   date:'Jun 2',     unread:false, route:null,                severity:'' },
]);

const FILTERS = [
  ['all',     'All'],
  ['unread',  'Unread'],
  ['ticket',  'Tickets'],
  ['finance', 'Finance'],
  ['order',   'Orders'],
  ['system',  'System'],
  ['kyc',     'KYC/KYB'],
];

const TYPE_ICON = {
  ticket:  'M4 8V6h16v2a2 2 0 000 4v2H4v-2a2 2 0 000-4zM12 6v12',
  order:   'M5 7l2-4h10l2 4M3 7h18l-1.5 9H4.5L3 7zM9 11v4M15 11v4M12 11v4',
  finance: 'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 5v5l3 3M12 7v5',
  system:  'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  kyc:     'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10',
};
const TYPE_COLOR = {
  ticket:  'var(--zg-accent)',
  order:   'oklch(0.82 0.14 215)',
  finance: 'var(--zg-warn)',
  system:  'var(--zg-text-dim)',
  kyc:     'oklch(0.78 0.15 150)',
};
const SEV_COLOR = { danger:'var(--zg-danger)', warn:'var(--zg-warn)', '':'var(--zg-text-mid)' };

const filtered = computed(() => {
  const n = NOTIFS.value;
  if (filter.value === 'unread')  return n.filter(x => x.unread);
  if (filter.value !== 'all')     return n.filter(x => x.type === filter.value);
  return n;
});

const grouped = computed(() => {
  const map = {};
  filtered.value.forEach(n => {
    if (!map[n.date]) map[n.date] = [];
    map[n.date].push(n);
  });
  return Object.entries(map);
});

const unreadCount = computed(() => NOTIFS.value.filter(n => n.unread).length);

function markRead(id) {
  const n = NOTIFS.value.find(x => x.id === id);
  if (n) n.unread = false;
}
function markAllRead() { NOTIFS.value.forEach(n => (n.unread = false)); }
function navigate(n) {
  markRead(n.id);
  if (n.route) { router.push(n.route); close(); }
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div v-if="open || closing" class="nd-backdrop" :class="{ 'is-closing': closing }" @click="close" />

    <!-- Drawer -->
    <div v-if="open || closing" class="nd-drawer" :class="{ 'is-closing': closing }">
      <!-- Header -->
      <div class="nd-head">
        <div>
          <div class="nd-title">Notifications</div>
          <div v-if="unreadCount > 0" class="nd-unread-count">{{ unreadCount }} unread</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button v-if="unreadCount > 0" class="nd-mark-all" @click="markAllRead">Mark all read</button>
          <button class="nd-close" @click="close">×</button>
        </div>
      </div>

      <!-- Filter chips -->
      <div class="nd-filters">
        <button v-for="[v,l] in FILTERS" :key="v"
          class="nd-chip" :class="{ 'is-active': filter === v }"
          @click="filter = v">
          {{ l }}
          <span v-if="v === 'unread' && unreadCount > 0" class="nd-chip-count">{{ unreadCount }}</span>
        </button>
      </div>

      <!-- Feed -->
      <div class="nd-feed">
        <div v-if="!filtered.length" class="nd-empty">
          <svg viewBox="0 0 24 24" width="36" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
            <path :d="TYPE_ICON.system" />
          </svg>
          <span>No notifications</span>
        </div>

        <template v-for="[date, items] in grouped" :key="date">
          <div class="nd-date-group">{{ date }}</div>
          <div v-for="n in items" :key="n.id"
            class="nd-item" :class="{ 'is-unread': n.unread }"
            @click="navigate(n)">
            <!-- Icon -->
            <div class="nd-icon" :style="{ color: n.severity ? SEV_COLOR[n.severity] : TYPE_COLOR[n.type], background: (n.severity ? SEV_COLOR[n.severity] : TYPE_COLOR[n.type]) + '18' }">
              <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <path :d="TYPE_ICON[n.type] || TYPE_ICON.system" />
              </svg>
            </div>
            <!-- Content -->
            <div class="nd-content">
              <div class="nd-item-title">{{ n.title }}</div>
              <div class="nd-item-body">{{ n.body }}</div>
              <div class="nd-item-meta">
                <span>{{ n.time }}</span>
                <span v-if="n.route" class="nd-item-link">View →</span>
              </div>
            </div>
            <!-- Unread dot -->
            <div v-if="n.unread" class="nd-dot" />
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="nd-footer">
        <button class="nd-footer-btn" @click="router.push('/admin/comms'); close()">View all in Comms →</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Backdrop */
.nd-backdrop {
  position: fixed; inset: 0; z-index: 490;
  background: oklch(0.1 0.01 250 / 0.4);
  animation: nd-fade-in 0.2s ease;
}
.nd-backdrop.is-closing { animation: nd-fade-out 0.22s ease forwards; }

/* Drawer */
.nd-drawer {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: 360px; z-index: 491;
  background: var(--zg-bg-elev);
  border-left: 1px solid var(--zg-line);
  display: flex; flex-direction: column;
  box-shadow: -8px 0 32px oklch(0.05 0.01 250 / 0.5);
  animation: nd-slide-in 0.22s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.nd-drawer.is-closing { animation: nd-slide-out 0.22s cubic-bezier(0.22, 0.61, 0.36, 1) forwards; }

@keyframes nd-fade-in  { from { opacity: 0; } to { opacity: 1; } }
@keyframes nd-fade-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes nd-slide-in  { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes nd-slide-out { from { transform: translateX(0); } to { transform: translateX(100%); } }

/* Header */
.nd-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 16px 18px 12px; border-bottom: 1px solid var(--zg-line); flex-shrink: 0;
}
.nd-title { font-size: 15px; font-weight: 700; color: var(--zg-text); }
.nd-unread-count { font-size: 10.5px; color: var(--zg-text-dim); margin-top: 2px; }
.nd-mark-all { height: 24px; padding: 0 8px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 11px; color: var(--zg-accent); white-space: nowrap; }
.nd-close { width: 28px; height: 28px; border: none; background: var(--zg-panel); border-radius: 4px; cursor: pointer; font-size: 16px; color: var(--zg-text-dim); }

/* Filters */
.nd-filters {
  display: flex; gap: 5px; padding: 10px 18px;
  border-bottom: 1px solid var(--zg-line); flex-shrink: 0; flex-wrap: wrap;
}
.nd-chip {
  height: 24px; padding: 0 8px; border: 1px solid var(--zg-line);
  border-radius: 3px; background: transparent; cursor: pointer;
  font-size: 10.5px; color: var(--zg-text-dim); white-space: nowrap;
  display: inline-flex; align-items: center; gap: 4px;
}
.nd-chip.is-active { background: var(--zg-panel-hi); color: var(--zg-text); border-color: var(--zg-accent); }
.nd-chip-count {
  height: 16px; min-width: 16px; padding: 0 4px; border-radius: 8px;
  background: var(--zg-accent); color: var(--zg-bg); font-size: 9px;
  font-weight: 700; display: inline-flex; align-items: center; justify-content: center;
}

/* Feed */
.nd-feed { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }
.nd-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; gap: 8px; color: var(--zg-text-dim); font-size: 13px; }
.nd-date-group { padding: 10px 18px 4px; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); font-weight: 700; }

/* Notification item */
.nd-item {
  display: flex; gap: 12px; padding: 10px 18px;
  border-bottom: 1px solid var(--zg-line); cursor: pointer;
  transition: background 0.1s; position: relative;
}
.nd-item:hover { background: var(--zg-panel-hi); }
.nd-item.is-unread { background: oklch(0.78 0.18 130 / 0.04); }
.nd-item.is-unread:hover { background: oklch(0.78 0.18 130 / 0.08); }

.nd-icon {
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; margin-top: 1px;
}
.nd-content { flex: 1; min-width: 0; }
.nd-item-title { font-size: 12.5px; font-weight: 600; color: var(--zg-text); margin-bottom: 3px; line-height: 1.3; }
.nd-item-body { font-size: 11.5px; color: var(--zg-text-dim); line-height: 1.45; margin-bottom: 5px; }
.nd-item-meta { display: flex; align-items: center; justify-content: space-between; }
.nd-item-meta > span:first-child { font-size: 10.5px; color: var(--zg-text-dim); }
.nd-item-link { font-size: 10.5px; color: var(--zg-accent); font-weight: 600; }

.nd-dot {
  position: absolute; top: 12px; right: 14px;
  width: 8px; height: 8px; border-radius: 50%; background: var(--zg-accent);
}

/* Footer */
.nd-footer {
  padding: 10px 18px; border-top: 1px solid var(--zg-line); flex-shrink: 0;
  background: var(--zg-bg-elev);
}
.nd-footer-btn {
  width: 100%; height: 32px; border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md); background: transparent;
  cursor: pointer; font-size: 12px; color: var(--zg-text-mid);
  font-family: inherit; transition: border-color .1s, color .1s;
}
.nd-footer-btn:hover { border-color: var(--zg-accent); color: var(--zg-accent); }
</style>
