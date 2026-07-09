<script setup>
/**
 * OrderPanel — faithful Vue port of ZucciOrderPanel (zucci-orders-panel.jsx).
 * Right column: Customer Information, Shipping Information, Activity Log, Tags.
 * Each section has a ⋯ options button that opens a context menu.
 */
import { ref, computed } from 'vue';
import ContextMenuDropdown from './ContextMenuDropdown.vue';

const props = defineProps({ order: { type: Object, required: true } });
const emit  = defineEmits(['add-tag', 'view-profile']);

const tagInput = ref('');
const ctxMenu  = ref(null);
const copied   = ref('');

const customer = computed(() => props.order?.customer || {});
const addr     = computed(() => props.order?.shippingAddr || {});
const log      = computed(() => props.order?.activityLog || []);
const tags     = computed(() => props.order?.tags || []);

function copyVal(val, key) {
  navigator.clipboard?.writeText(val || '').catch(() => {});
  copied.value = key;
  setTimeout(() => (copied.value = ''), 1400);
}

function openCtx(section, e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const items =
    section === 'customer-info' ? [
      { label:'View Full Profile',     icon:'M12 12a4 4 0 100-8 4 4 0 000 8zm-8 8a8 8 0 0116 0', action:() => emit('view-profile', customer.value) },
      { label:'Send Message',          icon:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', action:() => {} },
      { label:'Copy Phone',            icon:'M8 4H4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V8M8 4l6 0M8 4v6', action:() => copyVal(customer.value.phone, 'phone') },
      { label:'Copy Email',            icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', action:() => copyVal(customer.value.email, 'email') },
      { divider: true },
      { label:'Flag Customer',         icon:'M3 2v12M3 2h8l-2 4 2 4H3', action:() => {}, danger:true },
      { label:'Block Customer',        icon:'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', action:() => {}, danger:true },
    ]
    : section === 'shipping-info' ? [
      { label:'Edit Address',          icon:'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', action:() => {} },
      { label:'Copy Full Address',     icon:'M8 4H4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V8M8 4l6 0M8 4v6', action:() => copyVal(`${addr.value.building} ${addr.value.street} ${addr.value.city}`, 'address') },
      { label:'Open in Google Maps',   icon:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', action:() => {} },
      { label:'Copy W3W',              icon:'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101', action:() => copyVal(addr.value.w3w, 'w3w') },
      { label:'Copy Coordinates',      icon:'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', action:() => copyVal(addr.value.latlong, 'latlong') },
    ]
    : [ // activity-log
      { label:'Export Activity Log',   icon:'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', action:() => {} },
      { label:'Filter by Type',        icon:'M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z', action:() => {} },
    ];
  ctxMenu.value = { x: rect.right - 200, y: rect.bottom + 4, items };
}

function addTag() {
  if (tagInput.value.trim()) { emit('add-tag', tagInput.value.trim()); tagInput.value = ''; }
}
</script>

<template>
  <div class="zco-rpanel">
    <!-- Context menu -->
    <ContextMenuDropdown
      v-if="ctxMenu"
      :items="ctxMenu.items"
      :x="ctxMenu.x"
      :y="ctxMenu.y"
      @close="ctxMenu = null"
    />

    <!-- ── Customer Information ── -->
    <div class="zco-rp-section">
      <div class="zco-rp-section-head">
        <div class="zco-rp-title">Customer Information</div>
        <button class="zco-rp-icon-btn" title="Options" @click="e => openCtx('customer-info', e)">
          <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <circle cx="7" cy="3" r="0.8" fill="currentColor"/>
            <circle cx="7" cy="7" r="0.8" fill="currentColor"/>
            <circle cx="7" cy="11" r="0.8" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div class="zco-field-grid-2">
        <div class="zco-field">
          <div class="zco-field-label">First Name</div>
          <div class="zco-field-value">{{ customer.firstName }}</div>
        </div>
        <div class="zco-field">
          <div class="zco-field-label">Last Name</div>
          <div class="zco-field-value">{{ customer.lastName }}</div>
        </div>
        <div class="zco-field zco-field--full">
          <div class="zco-field-label">Mobile Number</div>
          <div class="zco-field-row">
            <div class="zco-field-value">{{ customer.phone }}</div>
            <div class="zco-field-actions">
              <button class="zco-field-copy-btn" title="Copy number" @click="copyVal(customer.phone, 'phone')">
                <svg v-if="copied !== 'phone'" viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="4" width="7" height="7" rx="1"/><path d="M2 10V2h8"/></svg>
                <svg v-else viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2 7 5 10 12 3"/></svg>
              </button>
              <button class="zco-field-copy-btn" title="Call">
                <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3a1 1 0 011-1h1.5l1 2.5-1.2.7a7 7 0 003.5 3.5l.7-1.2L11 8.5V10a1 1 0 01-1 1C4.5 11 2 8 2 3z"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div class="zco-field zco-field--full">
          <div class="zco-field-label">Email</div>
          <div class="zco-field-row">
            <div class="zco-field-value" style="font-size:11.5px;word-break:break-all;">{{ customer.email }}</div>
            <div class="zco-field-actions">
              <button class="zco-field-copy-btn" title="Copy email" @click="copyVal(customer.email, 'email')">
                <svg v-if="copied !== 'email'" viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="4" width="7" height="7" rx="1"/><path d="M2 10V2h8"/></svg>
                <svg v-else viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2 7 5 10 12 3"/></svg>
              </button>
              <button class="zco-field-copy-btn" title="Open">
                <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 9l5-5M9 4H5M9 4v4"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Shipping Information ── -->
    <div class="zco-rp-section">
      <div class="zco-rp-section-head">
        <div class="zco-rp-title">Shipping Information</div>
        <button class="zco-rp-icon-btn" title="Options" @click="e => openCtx('shipping-info', e)">
          <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <circle cx="7" cy="3" r="0.8" fill="currentColor"/>
            <circle cx="7" cy="7" r="0.8" fill="currentColor"/>
            <circle cx="7" cy="11" r="0.8" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div class="zco-field-grid-2">
        <div class="zco-field">
          <div class="zco-field-label">Building Number</div>
          <div class="zco-field-value">{{ addr.building }}</div>
        </div>
        <div class="zco-field">
          <div class="zco-field-label">Street Name</div>
          <div class="zco-field-value">{{ addr.street }}</div>
        </div>
        <div class="zco-field">
          <div class="zco-field-label">District / Neighbourhood</div>
          <div class="zco-field-value">{{ addr.district }}</div>
        </div>
        <div class="zco-field">
          <div class="zco-field-label">Postal Code</div>
          <div class="zco-field-value">{{ addr.postal }}</div>
        </div>
        <div class="zco-field">
          <div class="zco-field-label">City</div>
          <div class="zco-field-value">{{ addr.city }}</div>
        </div>
        <div class="zco-field">
          <div class="zco-field-label">Country</div>
          <div class="zco-field-value">{{ addr.country }}</div>
        </div>
        <div class="zco-field zco-field--full">
          <div class="zco-field-label">W3W · What 3 Words Code</div>
          <div class="zco-field-row">
            <div class="zco-field-value is-mono" style="font-size:11px;color:var(--zg-accent);">{{ addr.w3w }}</div>
            <div class="zco-field-actions">
              <button class="zco-field-copy-btn" @click="copyVal(addr.w3w, 'w3w')">
                <svg v-if="copied !== 'w3w'" viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="4" width="7" height="7" rx="1"/><path d="M2 10V2h8"/></svg>
                <svg v-else viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2 7 5 10 12 3"/></svg>
              </button>
              <button class="zco-field-copy-btn" title="Open">
                <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 9l5-5M9 4H5M9 4v4"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div class="zco-field zco-field--full">
          <div class="zco-field-label">Latitude and Longitude</div>
          <div class="zco-field-row">
            <div class="zco-field-value is-mono" style="font-size:10.5px;">{{ addr.latlong }}</div>
            <div class="zco-field-actions">
              <button class="zco-field-copy-btn" @click="copyVal(addr.latlong, 'latlong')">
                <svg v-if="copied !== 'latlong'" viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="4" width="7" height="7" rx="1"/><path d="M2 10V2h8"/></svg>
                <svg v-else viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2 7 5 10 12 3"/></svg>
              </button>
              <button class="zco-field-copy-btn" title="Open in Maps">
                <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 9l5-5M9 4H5M9 4v4"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Activity Log ── -->
    <div class="zco-rp-section">
      <div class="zco-rp-section-head">
        <div class="zco-rp-title">Activity Log</div>
        <button class="zco-rp-icon-btn" @click="e => openCtx('activity-log', e)">
          <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <circle cx="7" cy="3" r="0.8" fill="currentColor"/>
            <circle cx="7" cy="7" r="0.8" fill="currentColor"/>
            <circle cx="7" cy="11" r="0.8" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div v-for="(entry, i) in log" :key="i" class="zco-activity-row">
        <div>
          <div class="zco-activity-label">User</div>
          <div class="zco-activity-user">{{ entry.user }}</div>
        </div>
        <div>
          <div class="zco-activity-label">Action</div>
          <div class="zco-activity-action">{{ entry.action }}</div>
        </div>
        <div class="zco-activity-dt">{{ entry.datetime }}</div>
      </div>
    </div>

    <!-- ── Tags ── -->
    <div class="zco-rp-section">
      <div class="zco-rp-section-head">
        <div class="zco-rp-title">Tags</div>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">
        <span v-for="tag in tags" :key="tag" class="zco-tag">{{ tag }}</span>
      </div>
      <input
        v-model="tagInput"
        class="zco-tags-input"
        type="text"
        placeholder="Type or select a tag for this order…"
        @keydown.enter="addTag"
      />
    </div>
  </div>
</template>
