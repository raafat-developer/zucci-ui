<script setup>
/**
 * OrderDetail — faithful Vue port of ZucciOrderDetail.
 * Center pane: header (ID, status, carrier, tracking), status bar (steps),
 * line items, order summary, timeline with reply box.
 */
import { ref, computed } from 'vue';
import { ZC_ORDER_STATUS_STEPS } from '@/data/ordersData';

const props = defineProps({ order: { type: Object, required: true } });
const emit  = defineEmits(['user-click', 'status-expand', 'more-click']);

// ── Reply box ─────────────────────────────────────────────
const replyText  = ref('');
const visibility = ref('internal'); // internal | customer
const fileInput  = ref(null);

// ── Copy util ─────────────────────────────────────────────
const copied = ref('');
function copyVal(val, key) {
  navigator.clipboard?.writeText(val || '');
  copied.value = key;
  setTimeout(() => (copied.value = ''), 1400);
}

// ── Steps ─────────────────────────────────────────────────
const steps   = ZC_ORDER_STATUS_STEPS || ['Brand Pickup','Courier Pickup','In Transit','Out for Delivery','Delivered'];
const current = computed(() => props.order?.currentStep ?? 2);

// ── Computed ──────────────────────────────────────────────
const lineItems   = computed(() => props.order?.lineItems || []);
const totalItems  = computed(() => lineItems.value.reduce((s, i) => s + i.qty, 0));
const timeline    = computed(() => props.order?.timeline || []);

// ── Timeline entry meta ────────────────────────────────────
const ACTOR_META = {
  note:       { label:'Note',        color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.15)' },
  email:      { label:'Email',       color:'var(--zg-accent)',     bg:'oklch(0.78 0.18 130 / 0.12)' },
  status:     { label:'Status',      color:'var(--zg-text-dim)',   bg:'var(--zg-panel-hi)'           },
  system:     { label:'System',      color:'var(--zg-text-dim)',   bg:'var(--zg-panel-hi)'           },
  comment:    { label:'Comment',     color:'var(--zg-good)',       bg:'oklch(0.78 0.15 150 / 0.12)'  },
  return:     { label:'Return',      color:'var(--zg-warn)',       bg:'oklch(0.82 0.15 75 / 0.12)'   },
};
const entryMeta = (type) => ACTOR_META[type] || ACTOR_META.system;

// ── Pill color ─────────────────────────────────────────────
const PILL_STATUS = {
  transit:    { label:'In Transit',  cls:'zco-pill--transit' },
  completed:  { label:'Completed',   cls:'zco-pill--completed' },
  cancelled:  { label:'Cancelled',   cls:'zco-pill--cancelled' },
  progress:   { label:'Processing',  cls:'zco-pill--progress' },
};
const statusPill = computed(() => PILL_STATUS[props.order?.overallStatus] || PILL_STATUS.transit);

// ── Header overflow menu ──────────────────────────────────
const headerMenu = ref(null);
const ORDER_MENU_ITEMS = [
  { label:'Duplicate Order',       icon:'M8 4H4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V8M8 4l6 0M8 4v6', action:() => {} },
  { label:'Export PDF',            icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M7 13h10M7 9h4M7 17h10', action:() => {} },
  { label:'View Change History',   icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', action:() => emit('status-expand') },
  { divider: true },
  { label:'Cancel Order',          icon:'M18 6L6 18M6 6l12 12', action:() => emit('more-click','cancel-order', null), danger:true },
  { label:'Archive Order',         icon:'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8', action:() => {}, danger:false },
];
function openHeaderMenu(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  headerMenu.value = { x: Math.max(8, rect.right - 200), y: rect.bottom + 4 };
}
</script>

<template>
  <div class="zco-detail">

    <!-- Header overflow menu -->
    <Teleport to="body">
      <div v-if="headerMenu" style="position:fixed;inset:0;z-index:9990;" @click="headerMenu = null" />
      <div v-if="headerMenu"
        style="position:fixed;z-index:9991;min-width:200px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);box-shadow:0 8px 24px oklch(0.05 0.01 250 / 0.5);overflow:hidden;"
        :style="{ top: headerMenu.y+'px', left: headerMenu.x+'px' }">
        <template v-for="(item, i) in ORDER_MENU_ITEMS" :key="i">
          <div v-if="item.divider" style="height:1px;background:var(--zg-line);margin:3px 0;" />
          <button v-else
            style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 14px;border:none;background:transparent;cursor:pointer;text-align:left;font-family:inherit;font-size:12.5px;transition:background .08s;"
            :style="{ color: item.danger ? 'var(--zg-danger)' : 'var(--zg-text-mid)' }"
            @click="() => { item.action(); headerMenu = null; }"
            @mouseenter="e => e.currentTarget.style.background='var(--zg-panel)'"
            @mouseleave="e => e.currentTarget.style.background='transparent'">
            <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0;">
              <path :d="item.icon" />
            </svg>
            {{ item.label }}
          </button>
        </template>
      </div>
    </Teleport>

    <!-- ── Header ── -->
    <div class="zco-detail-head">
      <div class="zco-detail-head-top">
        <div class="zco-order-id">#{{ order.id }}</div>
        <span class="zco-pill" :class="statusPill.cls">{{ statusPill.label }}</span>
        <div class="zco-refund-window">{{ order.refundWindow }}</div>
        <button class="zco-head-overflow" @click="openHeaderMenu">⋯</button>
      </div>

      <!-- Carrier + tracking row -->
      <div class="zco-carrier-row">
        <div class="zco-carrier-badge">
          <span class="zco-carrier-dot" />
          <span class="zco-carrier-name">{{ order.carrier }}</span>
        </div>

        <div class="zco-tracking-field">
          <div class="zco-tracking-label">Internal Tracking Code</div>
          <div class="zco-tracking-value">
            {{ order.internalTracking }}
            <button class="zco-trk-btn" title="Copy" @click="copyVal(order.internalTracking, 'int')">
              <svg v-if="copied !== 'int'" viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="4" width="7" height="7" rx="1"/><path d="M2 10V2h8"/></svg>
              <svg v-else viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2 7 5 10 12 3"/></svg>
            </button>
            <button class="zco-trk-btn" title="Edit" @click="">
              <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 2l3 3-7 7H2v-3L9 2z"/></svg>
            </button>
          </div>
        </div>

        <div class="zco-tracking-field">
          <div class="zco-tracking-label">International Tracking Code</div>
          <div class="zco-tracking-value">
            {{ order.internationalTracking }}
            <button class="zco-trk-btn" @click="copyVal(order.internationalTracking, 'int2')">
              <svg v-if="copied !== 'int2'" viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="4" width="7" height="7" rx="1"/><path d="M2 10V2h8"/></svg>
              <svg v-else viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2 7 5 10 12 3"/></svg>
            </button>
            <button class="zco-trk-btn" @click="">
              <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 2l3 3-7 7H2v-3L9 2z"/></svg>
            </button>
          </div>
        </div>

        <div class="zco-tracking-field">
          <div class="zco-tracking-label">Estimated Delivery Date</div>
          <div class="zco-tracking-value" style="font-family:var(--zg-mono);font-size:11.5px;">{{ order.estimatedDelivery }}</div>
        </div>
      </div>
    </div>

    <!-- ── Status Bar ── -->
    <div class="zco-status-bar">
      <div class="zco-status-bar-label">
        <span>Order Status</span>
        <button class="zco-status-expand" @click="emit('status-expand')" title="View full history">
          <svg viewBox="0 0 16 16" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 4l4 4-4 4"/></svg>
        </button>
      </div>
      <div class="zco-status-steps">
        <template v-for="(step, i) in steps" :key="step">
          <div v-if="i > 0" class="zco-step-connector" :class="{ 'is-done': i <= current }" />
          <div class="zco-step-node">
            <div class="zco-step-dot" :class="{ 'is-done': i <= current, 'is-current': i === current + 1 }" />
            <div class="zco-step-label" :class="{ 'is-done': i <= current, 'is-current': i === current + 1 }">{{ step }}</div>
          </div>
        </template>
      </div>
    </div>

    <!-- ── Line Items ── -->
    <div class="zco-section">
      <div class="zco-section-head">
        <div class="zco-section-title">Order Details</div>
        <button class="zco-section-overflow" @click="e => emit('more-click', 'order-details', e)">⋯</button>
      </div>
      <div v-for="(item, i) in lineItems" :key="i" class="zco-item-row">
        <div class="zco-item-img" />
        <div class="zco-item-info">
          <div class="zco-item-brand">{{ item.brand }}</div>
          <div class="zco-item-name">{{ item.name }}</div>
          <div class="zco-item-variant">{{ item.variant }}</div>
          <div class="zco-item-sku">SKU: {{ item.sku }}</div>
        </div>
        <div class="zco-item-price">
          <div class="zco-item-total">{{ (item.price * item.qty).toFixed(2) }} AED</div>
          <div class="zco-item-unit">{{ item.price.toFixed(2) }} AED × {{ item.qty }}</div>
        </div>
      </div>
    </div>

    <!-- ── Summary ── -->
    <div class="zco-section">
      <div class="zco-summary">
        <div class="zco-summary-row">
          <span class="zco-summary-key">Subtotal <small>{{ totalItems }} items</small></span>
          <span class="zco-summary-val">{{ order.subtotal?.toFixed(2) }} AED</span>
        </div>
        <div class="zco-summary-row">
          <span class="zco-summary-key">Shipping <small>{{ order.shippingLabel }}</small></span>
          <span class="zco-summary-val">{{ order.shippingCost?.toFixed(2) }} AED</span>
        </div>
        <div class="zco-summary-row is-total">
          <span class="zco-summary-key">Total</span>
          <span class="zco-summary-val">{{ order.total?.toFixed(2) }} AED</span>
        </div>
        <div class="zco-summary-row">
          <span class="zco-summary-key">Refunded</span>
          <span class="zco-summary-val">{{ order.refunded?.toFixed(2) }} AED</span>
        </div>
        <div class="zco-summary-row">
          <span class="zco-summary-key">Paid <small>{{ order.settlementNote }}</small></span>
          <span class="zco-summary-val">{{ order.paid?.toFixed(2) }} AED</span>
        </div>
      </div>
    </div>

    <!-- ── Timeline ── -->
    <div class="zco-timeline-wrap" style="padding-bottom:40px;">
      <!-- Reply box -->
      <div class="zco-reply-box">
        <div class="zco-reply-tabs">
          <button class="zco-reply-tab" :class="{ 'is-active': visibility === 'internal' }" @click="visibility = 'internal'">🔒 Internal Note</button>
          <button class="zco-reply-tab" :class="{ 'is-active': visibility === 'customer' }" @click="visibility = 'customer'">👁 Customer Comment</button>
        </div>
        <textarea v-model="replyText" class="zco-reply-textarea" :placeholder="visibility === 'internal' ? 'Add internal note — only Zucci staff will see this…' : 'Add comment visible to vendor/customer…'" />
        <div class="zco-reply-actions">
          <label class="zco-attach-btn" title="Attach file">
            <input type="file" multiple style="display:none;" ref="fileInput" />
            <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M12 7.5L7 12.5a3 3 0 01-4-4l5-5A2 2 0 0111 6l-5 5a1 1 0 01-1.4-1.4L9 5"/></svg>
            Attach
          </label>
          <button class="zco-reply-send" @click="replyText = ''">Send</button>
        </div>
      </div>

      <!-- Timeline entries -->
      <div v-for="(group, gi) in timeline" :key="gi">
        <div class="zco-tl-date">{{ group.date }}</div>
        <div v-for="(entry, ei) in group.entries" :key="ei" class="zco-tl-entry-v2" :class="{ 'is-note': entry.type === 'note' }">
          <div class="zco-tl-entry-left">
            <div v-if="!entry.actor || entry.actor.role === 'system'" class="zco-tl-sys-dot" />
            <button v-else class="zco-tl-avatar-btn"
              :style="{ background: entryMeta(entry.type).bg, color: entryMeta(entry.type).color }"
              @click="emit('user-click', entry.actor)">
              {{ entry.actor.initials }}
            </button>
            <div class="zco-tl-v-line" />
          </div>
          <div class="zco-tl-entry-body">
            <div class="zco-tl-entry-head">
              <span v-if="!entry.actor || entry.actor.role === 'system'" class="zco-tl-sys-label">System</span>
              <button v-else class="zco-tl-actor-name" @click="emit('user-click', entry.actor)">{{ entry.actor.name }}</button>
              <span class="zco-tl-type-badge" :class="`zco-tl-type-badge--${entry.type}`" :style="{ color: entryMeta(entry.type).color }">{{ entryMeta(entry.type).label }}</span>
              <span v-if="entry.visibility === 'internal'" class="zco-tl-internal">🔒 Internal</span>
              <span class="zco-tl-time-v2">{{ entry.time }}</span>
            </div>
            <div v-if="entry.text" class="zco-tl-body-text">{{ entry.text }}</div>
            <button v-if="entry.viewEmail" class="zco-tl-email-btn" style="margin-top:6px;">View Email</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.zco-detail { display:flex;flex-direction:column;overflow-y:auto;min-width:0;height:100%;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent; }

/* Header */
.zco-detail-head { padding:14px 20px;border-bottom:1px solid var(--zg-line);flex-shrink:0;background:var(--zg-bg-elev); }
.zco-detail-head-top { display:flex;align-items:center;gap:10px;margin-bottom:10px; }
.zco-order-id { font-family:var(--zg-mono);font-size:15px;font-weight:800;color:var(--zg-accent);letter-spacing:-.02em; }
.zco-refund-window { font-size:11px;color:var(--zg-text-dim);margin-left:auto; }
.zco-head-overflow { width:28px;height:28px;border:none;background:transparent;cursor:pointer;font-size:18px;color:var(--zg-text-dim);border-radius:4px;display:flex;align-items:center;justify-content:center; }
.zco-head-overflow:hover { background:var(--zg-panel);color:var(--zg-text); }

/* Carrier row */
.zco-carrier-row { display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap; }
.zco-carrier-badge { display:flex;align-items:center;gap:6px;flex-shrink:0; }
.zco-carrier-dot { width:7px;height:7px;border-radius:50%;background:var(--zg-good);animation:dashPulse 1.8s ease-in-out infinite; }
@keyframes dashPulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)} }
.zco-carrier-name { font-size:12.5px;font-weight:700;color:var(--zg-text); }
.zco-tracking-field { display:flex;flex-direction:column;gap:3px; }
.zco-tracking-label { font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600; }
.zco-tracking-value { display:flex;align-items:center;gap:5px;font-family:var(--zg-mono);font-size:11.5px;color:var(--zg-text);font-weight:600; }
.zco-trk-btn { width:20px;height:20px;border:none;background:transparent;cursor:pointer;color:var(--zg-text-dim);display:flex;align-items:center;justify-content:center;border-radius:3px; }
.zco-trk-btn:hover { background:var(--zg-panel);color:var(--zg-accent); }

/* Status bar */
.zco-status-bar { padding:12px 20px;border-bottom:1px solid var(--zg-line);flex-shrink:0;background:var(--zg-bg-elev); }
.zco-status-bar-label { display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:700; }
.zco-status-expand { background:none;border:none;cursor:pointer;color:var(--zg-text-dim);display:flex;align-items:center;padding:0; }
.zco-status-steps { display:flex;align-items:center;gap:0; }
.zco-step-connector { height:2px;flex:1;background:var(--zg-line);transition:background .3s; }
.zco-step-connector.is-done { background:var(--zg-accent); }
.zco-step-node { display:flex;flex-direction:column;align-items:center;gap:5px;flex-shrink:0; }
.zco-step-dot { width:10px;height:10px;border-radius:50%;background:var(--zg-line);border:2px solid var(--zg-line);transition:all .3s; }
.zco-step-dot.is-done { background:var(--zg-accent);border-color:var(--zg-accent); }
.zco-step-dot.is-current { background:transparent;border-color:var(--zg-accent);box-shadow:0 0 0 3px oklch(0.78 0.18 130 / 0.2); }
.zco-step-label { font-size:9px;color:var(--zg-text-dim);white-space:nowrap;max-width:70px;text-align:center;line-height:1.2; }
.zco-step-label.is-done { color:var(--zg-accent);font-weight:600; }
.zco-step-label.is-current { color:var(--zg-accent); }

/* Section */
.zco-section { border-bottom:1px solid var(--zg-line); }
.zco-section-head { display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:var(--zg-panel-hi); }
.zco-section-title { font-size:10px;text-transform:uppercase;letter-spacing:.09em;font-weight:700;color:var(--zg-text-mid); }
.zco-section-overflow { background:none;border:none;cursor:pointer;color:var(--zg-text-dim);font-size:16px;padding:0 4px;border-radius:3px; }
.zco-section-overflow:hover { background:var(--zg-panel);color:var(--zg-text); }

/* Line items */
.zco-item-row { display:flex;align-items:flex-start;gap:12px;padding:12px 20px;border-bottom:1px solid var(--zg-line); }
.zco-item-img { width:56px;height:56px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);flex-shrink:0; }
.zco-item-info { flex:1;min-width:0; }
.zco-item-brand { font-size:10.5px;color:var(--zg-text-dim); }
.zco-item-name { font-size:12.5px;font-weight:600;color:var(--zg-text);margin:2px 0; }
.zco-item-variant { font-size:11px;color:var(--zg-text-dim); }
.zco-item-sku { font-family:var(--zg-mono);font-size:10px;color:var(--zg-text-dim);margin-top:2px; }
.zco-item-price { flex-shrink:0;text-align:right; }
.zco-item-total { font-family:var(--zg-mono);font-size:14px;font-weight:700;color:var(--zg-text); }
.zco-item-unit { font-size:11px;color:var(--zg-text-dim);margin-top:2px; }

/* Summary */
.zco-summary { padding:12px 20px;display:flex;flex-direction:column;gap:6px; }
.zco-summary-row { display:flex;justify-content:space-between;align-items:baseline;font-size:12.5px; }
.zco-summary-row.is-total { font-weight:700;border-top:1px solid var(--zg-line);padding-top:6px;margin-top:2px; }
.zco-summary-key { color:var(--zg-text-mid);display:flex;align-items:baseline;gap:6px; }
.zco-summary-key small { font-size:10.5px;color:var(--zg-text-dim); }
.zco-summary-val { font-family:var(--zg-mono);font-weight:600;color:var(--zg-text); }

/* Timeline */
.zco-timeline-wrap { padding:14px 20px;display:flex;flex-direction:column;gap:0; }
.zco-reply-box { border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;margin-bottom:20px; }
.zco-reply-tabs { display:flex;border-bottom:1px solid var(--zg-line);background:var(--zg-panel-hi); }
.zco-reply-tab { flex:1;height:32px;border:none;background:transparent;cursor:pointer;font-family:inherit;font-size:11.5px;color:var(--zg-text-dim);font-weight:500; }
.zco-reply-tab.is-active { background:var(--zg-panel);color:var(--zg-text);font-weight:600; }
.zco-reply-textarea { width:100%;min-height:72px;padding:10px 12px;border:none;background:var(--zg-panel);font-family:inherit;font-size:12.5px;color:var(--zg-text);outline:none;resize:vertical;box-sizing:border-box; }
.zco-reply-actions { display:flex;align-items:center;gap:8px;padding:8px 10px;border-top:1px solid var(--zg-line);background:var(--zg-panel-hi); }
.zco-attach-btn { display:flex;align-items:center;gap:5px;height:26px;padding:0 10px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-family:inherit;font-size:11.5px;color:var(--zg-text-dim); }
.zco-reply-send { margin-left:auto;height:28px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }

.zco-tl-date { font-family:var(--zg-mono);font-size:10px;color:var(--zg-text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.07em;margin:12px 0 8px; }
.zco-tl-entry-v2 { display:flex;gap:10px;padding-bottom:14px; }
.zco-tl-entry-v2.is-note { background:oklch(0.82 0.14 215 / 0.04);border-radius:var(--zg-radius-md);padding:10px;margin-bottom:4px; }
.zco-tl-entry-left { display:flex;flex-direction:column;align-items:center;flex-shrink:0; }
.zco-tl-sys-dot { width:8px;height:8px;border-radius:50%;background:var(--zg-line);margin-top:3px; }
.zco-tl-avatar-btn { width:24px;height:24px;border-radius:50%;border:none;cursor:pointer;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.zco-tl-v-line { width:1px;flex:1;background:var(--zg-line);min-height:8px;margin-top:3px; }
.zco-tl-entry-body { flex:1;min-width:0; }
.zco-tl-entry-head { display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px; }
.zco-tl-sys-label { font-size:11px;font-weight:600;color:var(--zg-text-dim); }
.zco-tl-actor-name { background:none;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;color:var(--zg-text);padding:0; }
.zco-tl-actor-name:hover { color:var(--zg-accent); }
.zco-tl-type-badge { font-size:9.5px;font-weight:700;padding:1px 5px;border-radius:2px;background:var(--zg-panel-hi); }
.zco-tl-internal { font-size:10px;color:var(--zg-text-dim); }
.zco-tl-time-v2 { font-size:10.5px;color:var(--zg-text-dim);margin-left:auto; }
.zco-tl-body-text { font-size:12.5px;color:var(--zg-text);line-height:1.55; }
.zco-tl-email-btn { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-accent); }
</style>
