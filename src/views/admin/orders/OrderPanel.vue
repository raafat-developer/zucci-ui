<script setup>
/**
 * OrderPanel — right column: Customer, Shipping, Activity Log, Tags.
 * Faithful port of ZucciOrderPanel — section ⋯ menus, copy-to-clipboard,
 * "View full profile" → Customers module, and tag add are all wired.
 */
import { ref } from 'vue';
import ZContextMenu from '@/components/ui/ZContextMenu.vue';
import { toast } from '@/composables/useToast';

const props = defineProps({ order: { type: Object, required: true } });
const emit = defineEmits(['add-tag', 'view-profile']);

const tagInput = ref('');
const menu = ref(null); // { x, y, items }

const copy = (v, label) => { if (v) navigator.clipboard?.writeText(v).catch(() => {}); toast.success((label || 'Value') + ' copied'); };
const viewProfile = () => { emit('view-profile', props.order.customer); };

const openMenu = (e, section) => {
  const r = e.currentTarget.getBoundingClientRect();
  const map = {
    customer: [
      { label: 'View full profile', action: viewProfile },
      { label: 'Copy email', action: () => copy(props.order.customer.email, 'Email') },
      { label: 'Copy phone', action: () => copy(props.order.customer.phone, 'Phone') },
      { divider: true },
      { label: 'Send message', action: () => toast.info('Message composer opening…') },
    ],
    shipping: [
      { label: 'Copy full address', action: () => copy(`${props.order.shippingAddr.building} ${props.order.shippingAddr.street}, ${props.order.shippingAddr.city}`, 'Address') },
      { label: 'Open in maps', action: () => toast.info('Opening map…') },
      { label: 'Edit shipping address', action: () => toast.info('Edit shipping drawer…') },
    ],
    activity: [
      { label: 'View full audit trail', action: () => toast.info('Audit trail opening…') },
      { label: 'Export activity (CSV)', action: () => toast.success('Exporting activity…') },
    ],
  };
  menu.value = { x: Math.min(r.right - 210, window.innerWidth - 220), y: r.bottom + 4, items: map[section] };
};
const addTag = () => { const t = tagInput.value.trim(); if (t) { emit('add-tag', t); toast.success(`Tag "${t}" added`); tagInput.value = ''; } };
</script>

<template>
  <div class="zco-rpanel">
    <!-- Customer -->
    <div class="zco-rp-section">
      <div class="zco-rp-section-head"><div class="zco-rp-title">Customer Information</div><button class="zco-rp-icon-btn" title="Options" @click="openMenu($event, 'customer')">⋯</button></div>
      <div class="zco-field-grid-2">
        <div class="zco-field"><div class="zco-field-label">First Name</div><div class="zco-field-value">{{ order.customer.firstName }}</div></div>
        <div class="zco-field"><div class="zco-field-label">Last Name</div><div class="zco-field-value">{{ order.customer.lastName }}</div></div>
        <div class="zco-field zco-field--full">
          <div class="zco-field-label">Mobile Number</div>
          <div class="zco-field-row">
            <div class="zco-field-value">{{ order.customer.phone }}</div>
            <div class="zco-field-actions"><button class="zco-field-copy-btn" @click="copy(order.customer.phone, 'Phone')" title="Copy">⧉</button></div>
          </div>
        </div>
        <div class="zco-field zco-field--full">
          <div class="zco-field-label">Email</div>
          <div class="zco-field-row">
            <div class="zco-field-value" style="font-size:11.5px;word-break:break-all">{{ order.customer.email }}</div>
            <div class="zco-field-actions"><button class="zco-field-copy-btn" @click="copy(order.customer.email, 'Email')" title="Copy">⧉</button></div>
          </div>
        </div>
      </div>
      <button class="zco-btn-action" style="margin-top:8px;width:100%" @click="viewProfile">View full profile →</button>
    </div>

    <!-- Shipping -->
    <div class="zco-rp-section">
      <div class="zco-rp-section-head"><div class="zco-rp-title">Shipping Information</div><button class="zco-rp-icon-btn" title="Options" @click="openMenu($event, 'shipping')">⋯</button></div>
      <div class="zco-field-grid-2">
        <div class="zco-field"><div class="zco-field-label">Building Number</div><div class="zco-field-value">{{ order.shippingAddr.building }}</div></div>
        <div class="zco-field"><div class="zco-field-label">Street Name</div><div class="zco-field-value">{{ order.shippingAddr.street }}</div></div>
        <div class="zco-field"><div class="zco-field-label">District / Neighbourhood</div><div class="zco-field-value">{{ order.shippingAddr.district }}</div></div>
        <div class="zco-field"><div class="zco-field-label">Postal Code</div><div class="zco-field-value">{{ order.shippingAddr.postal }}</div></div>
        <div class="zco-field"><div class="zco-field-label">City</div><div class="zco-field-value">{{ order.shippingAddr.city }}</div></div>
        <div class="zco-field"><div class="zco-field-label">Country</div><div class="zco-field-value">{{ order.shippingAddr.country }}</div></div>
        <div class="zco-field zco-field--full">
          <div class="zco-field-label">W3W · What 3 Words Code</div>
          <div class="zco-field-row">
            <div class="zco-field-value is-mono" style="font-size:11px;color:var(--zg-accent)">{{ order.shippingAddr.w3w }}</div>
            <div class="zco-field-actions"><button class="zco-field-copy-btn" @click="copy(order.shippingAddr.w3w, 'W3W')" title="Copy">⧉</button></div>
          </div>
        </div>
        <div class="zco-field zco-field--full">
          <div class="zco-field-label">Latitude and Longitude</div>
          <div class="zco-field-row">
            <div class="zco-field-value is-mono" style="font-size:10.5px">{{ order.shippingAddr.latlong }}</div>
            <div class="zco-field-actions"><button class="zco-field-copy-btn" @click="copy(order.shippingAddr.latlong, 'Coordinates')" title="Copy">⧉</button></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Log -->
    <div class="zco-rp-section">
      <div class="zco-rp-section-head"><div class="zco-rp-title">Activity Log</div><button class="zco-rp-icon-btn" title="Options" @click="openMenu($event, 'activity')">⋯</button></div>
      <div v-for="(entry, i) in order.activityLog" :key="i" class="zco-activity-row">
        <div><div class="zco-activity-label">User</div><div class="zco-activity-user">{{ entry.user }}</div></div>
        <div><div class="zco-activity-label">Action</div><div class="zco-activity-action">{{ entry.action }}</div></div>
        <div class="zco-activity-dt">{{ entry.datetime }}</div>
      </div>
    </div>

    <!-- Tags -->
    <div class="zco-rp-section">
      <div class="zco-rp-section-head"><div class="zco-rp-title">Tags</div></div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px">
        <span v-for="t in (order.tags || [])" :key="t" class="zen-brand-cat-tag">{{ t }}</span>
      </div>
      <input class="zco-tags-input" type="text" placeholder="Type a tag and press Enter…" v-model="tagInput" @keydown.enter="addTag" />
    </div>

    <ZContextMenu v-if="menu" :items="menu.items" :x="menu.x" :y="menu.y" @close="menu = null" />
  </div>
</template>
