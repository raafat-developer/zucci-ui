<script setup>
/**
 * StatusHistoryDrawer — Bosta-style tracking timeline. Faithful port of
 * StatusHistoryDrawer from zucci-drawers.jsx.
 */
import { ref } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false }, order: { type: Object, default: null } });
const emit = defineEmits(['close']);

const ZC_TRACKING_EVENTS = [
  { date: 'Friday, 22 December', entries: [
    { time: '9:48 AM', event: 'Delivered to reception', location: 'Riyadh, KSA' },
    { time: '7:04 AM', event: 'Out for delivery', location: 'Riyadh, KSA' },
    { time: '4:37 AM', event: 'Package arrived at the final delivery station', location: 'Riyadh, KSA' },
  ]},
  { date: 'Thursday, 21 December', entries: [
    { time: '9:48 AM', event: 'Cleared customs', location: 'Riyadh, KSA' },
    { time: '7:04 AM', event: 'Arrived at customs', location: 'Riyadh, KSA' },
  ]},
  { date: 'Tuesday, 19 December', entries: [
    { time: '9:48 AM', event: 'Package left the shipper facility', location: 'Cairo, Egypt' },
    { time: '7:04 AM', event: 'Package weighed and ready for departure', location: 'Cairo, Egypt' },
    { time: '4:37 AM', event: 'Package arrived at the shipper facility', location: 'Cairo, Egypt' },
  ]},
  { date: 'Sunday, 17 December', entries: [
    { time: '9:48 AM', event: 'Package tracking issued', location: 'Cairo, Egypt' },
    { time: '7:04 AM', event: 'Package ready for dispatching', location: 'Cairo, Egypt' },
    { time: '4:37 AM', event: 'Package quality checked', location: 'Cairo, Egypt' },
    { time: '4:37 AM', event: 'Package picked up from brand facility', location: 'Cairo, Egypt' },
  ]},
];

const copied = ref(null);
const copyText = (text, key) => {
  navigator.clipboard?.writeText(text).catch(() => {});
  copied.value = key;
  setTimeout(() => (copied.value = null), 1500);
  toast.success('Tracking code copied');
};
const intCode = 'Order #33420541';
const extCode = 'Order #33420541';
const estDel = 'Nov 23rd to Dec 31st, 2025';
const events = ZC_TRACKING_EVENTS;
</script>

<template>
  <ZDrawer :open="open" :title="order ? `#${order.id}` : ''" :width="420" @close="emit('close')">
    <div class="zsh-top-row">
      <span class="zsh-status-pill">In Transit</span>
      <div class="zsh-carrier"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 17H3V6h11v11H8 M8 17a2 2 0 104 0M5 17a2 2 0 104 0" /><path d="M14 9h4l3 4v4h-3" /></svg>Bosta</div>
    </div>

    <div class="zsh-codes-grid">
      <div class="zsh-code-block">
        <div class="zsh-code-label">Internal Tracking Code</div>
        <div class="zsh-code-val">
          <span>{{ intCode }}</span>
          <button class="zsh-copy-btn" title="Copy" @click="copyText(intCode, 'int')">
            <svg v-if="copied === 'int'" viewBox="0 0 14 10" width="13" fill="none" stroke="var(--zg-accent)" stroke-width="1.8" stroke-linecap="round"><polyline points="1 5 5 9 13 1" /></svg>
            <svg v-else viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="5" y="5" width="9" height="9" rx="1.5" /><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" /></svg>
          </button>
          <button class="zsh-copy-btn" title="Open tracking"><svg viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6" /><path d="M8 4v4l3 1.5" /></svg></button>
        </div>
      </div>
      <div class="zsh-code-block">
        <div class="zsh-code-label">International Tracking Code</div>
        <div class="zsh-code-val">
          <span>{{ extCode }}</span>
          <button class="zsh-copy-btn" title="Copy" @click="copyText(extCode, 'ext')">
            <svg v-if="copied === 'ext'" viewBox="0 0 14 10" width="13" fill="none" stroke="var(--zg-accent)" stroke-width="1.8" stroke-linecap="round"><polyline points="1 5 5 9 13 1" /></svg>
            <svg v-else viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="5" y="5" width="9" height="9" rx="1.5" /><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" /></svg>
          </button>
          <button class="zsh-copy-btn" title="Open tracking"><svg viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6" /><path d="M8 4v4l3 1.5" /></svg></button>
        </div>
      </div>
    </div>

    <div class="zsh-est"><div class="zsh-est-label">Estimated Delivery Date</div><div class="zsh-est-val">{{ estDel }}</div></div>
    <div class="zsh-divider" />

    <div class="zsh-tl-wrap">
      <div class="zsh-tl-title">Order Details</div>
      <div v-for="(group, gi) in events" :key="gi" class="zsh-tl-group">
        <div class="zsh-tl-date">{{ group.date }}</div>
        <div v-for="(e, ei) in group.entries" :key="ei" class="zsh-tl-row">
          <div class="zsh-tl-time">{{ e.time }}</div>
          <div class="zsh-tl-line-wrap">
            <div class="zsh-tl-dot" />
            <div v-if="!(gi === events.length - 1 && ei === group.entries.length - 1)" class="zsh-tl-vert" />
          </div>
          <div class="zsh-tl-content"><div class="zsh-tl-event">{{ e.event }}</div><div class="zsh-tl-loc">{{ e.location }}</div></div>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="zcd-btn-secondary" @click="emit('close')">Close</button>
    </template>
  </ZDrawer>
</template>
