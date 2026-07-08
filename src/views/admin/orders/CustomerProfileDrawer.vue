<script setup>
/**
 * CustomerProfileDrawer — full customer profile opened inline from the Order
 * panel's "View full profile" action (matches the React behaviour of
 * surfacing buyer info without leaving the order). Looks up the order's
 * customer in ZC_BUYERS by email; falls back to the order's own contact
 * fields if no match is found. Mirrors the Profile tab of the Customers
 * module (score ring, personal info, comms prefs) plus a link to open the
 * full record in the Customers module.
 */
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import ZButton from '@/components/ui/ZButton.vue';
import { ZC_BUYERS } from '@/data/customersData';

const props = defineProps({ open: { type: Boolean, default: false }, customer: { type: Object, default: null } });
const emit = defineEmits(['close']);
const router = useRouter();

const buyer = computed(() => {
  if (!props.customer) return null;
  const match = ZC_BUYERS.find((b) => b.email && props.customer.email && b.email.toLowerCase() === props.customer.email.toLowerCase());
  if (match) return match;
  // Build a lightweight fallback profile from the order's own customer fields.
  return {
    id: '—', firstName: props.customer.firstName, lastName: props.customer.lastName,
    email: props.customer.email, phone: props.customer.phone, initials: `${(props.customer.firstName||'?')[0]}${(props.customer.lastName||'?')[0]}`,
    color: '#7c8189', tier: 'Standard', country: '—', city: '—', nationality: '—', currency: '—',
    registeredDate: '—', lastLogin: '—', buyerScore: 0,
    stats: { totalOrders: '—', lifetimeValue: 0, avgOrderValue: 0, returnRate: 0, lastOrderDate: '—' },
    marketingOptIn: false, smsOptIn: false, pushOptIn: false, isFallback: true,
  };
});

const scoreColor = (s) => (s >= 80 ? 'var(--zg-good)' : s >= 60 ? 'oklch(0.82 0.14 215)' : s >= 40 ? 'var(--zg-warn)' : 'var(--zg-danger)');
const ringDash = (s) => { const circ = 2 * Math.PI * 22; return `${(s / 100) * circ} ${circ}`; };
const TIER_META = {
  Gold: { bg:'oklch(0.82 0.15 75 / 0.15)', color:'var(--zg-warn)', border:'oklch(0.82 0.15 75 / 0.35)' },
  Silver: { bg:'oklch(0.70 0.0 0 / 0.15)', color:'#aaa', border:'rgba(170,170,170,0.3)' },
  Bronze: { bg:'oklch(0.65 0.12 40 / 0.15)', color:'oklch(0.72 0.12 40)', border:'oklch(0.65 0.12 40 / 0.35)' },
  Standard: { bg:'var(--zg-panel-hi)', color:'var(--zg-text-dim)', border:'var(--zg-line)' },
};
const tierMeta = (t) => TIER_META[t] || TIER_META.Standard;

const openFullRecord = () => { router.push('/admin/customers'); emit('close'); };
</script>

<template>
  <ZDrawer :open="open" title="Customer Profile" :subtitle="buyer ? `#${buyer.id}` : ''" :width="560" @close="emit('close')">
    <div v-if="buyer" style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex-shrink:0" :style="{ background: buyer.color + '22', color: buyer.color }">{{ buyer.initials }}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:16px;font-weight:700;color:var(--zg-text)">{{ buyer.firstName }} {{ buyer.lastName }}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:3px;flex-wrap:wrap">
            <span v-if="buyer.country !== '—'" style="font-size:11.5px;color:var(--zg-text-dim)">{{ buyer.country }} · {{ buyer.city }}</span>
            <span class="zen-tier-badge" :style="{ background: tierMeta(buyer.tier).bg, color: tierMeta(buyer.tier).color, borderColor: tierMeta(buyer.tier).border }">{{ buyer.tier }}</span>
          </div>
        </div>
        <div v-if="!buyer.isFallback" style="flex-shrink:0;text-align:center">
          <svg width="48" height="48" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--zg-line)" stroke-width="4" />
            <circle cx="28" cy="28" r="22" fill="none" :stroke="scoreColor(buyer.buyerScore)" stroke-width="4" :stroke-dasharray="ringDash(buyer.buyerScore)" stroke-linecap="round" transform="rotate(-90 28 28)" />
            <text x="28" y="33" text-anchor="middle" font-size="12" font-weight="700" :fill="scoreColor(buyer.buyerScore)" font-family="var(--zg-mono)">{{ buyer.buyerScore }}</text>
          </svg>
        </div>
      </div>

      <div v-if="buyer.isFallback" style="padding:10px 12px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-text-dim)">
        No matching customer record found — showing contact details from this order only.
      </div>

      <div v-else class="zen-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="byr-strip-kpi"><div class="zen-perf-lbl">Total Orders</div><div class="byr-strip-val">{{ buyer.stats.totalOrders }}</div></div>
        <div class="byr-strip-kpi"><div class="zen-perf-lbl">Lifetime Value</div><div class="byr-strip-val">{{ buyer.currency }} {{ (buyer.stats.lifetimeValue || 0).toLocaleString() }}</div></div>
        <div class="byr-strip-kpi"><div class="zen-perf-lbl">Avg Order Value</div><div class="byr-strip-val">{{ buyer.currency }} {{ buyer.stats.avgOrderValue }}</div></div>
        <div class="byr-strip-kpi"><div class="zen-perf-lbl">Return Rate</div><div class="byr-strip-val" :class="{ 'is-warn': buyer.stats.returnRate > 7 }">{{ buyer.stats.returnRate }}%</div></div>
      </div>

      <div class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title">Contact</span></div>
        <div class="zen-bank-fields">
          <div class="zen-bank-field"><div class="zen-field-label">Email</div><div class="zen-field-val zen-field-mono" style="font-size:11.5px">{{ buyer.email }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Phone</div><div class="zen-field-val zen-field-mono" style="font-size:11.5px">{{ buyer.phone }}</div></div>
          <div v-if="buyer.nationality !== '—'" class="zen-bank-field"><div class="zen-field-label">Nationality</div><div class="zen-field-val">{{ buyer.nationality }}</div></div>
          <div v-if="buyer.registeredDate !== '—'" class="zen-bank-field"><div class="zen-field-label">Registered</div><div class="zen-field-val">{{ buyer.registeredDate }}</div></div>
        </div>
      </div>

      <div v-if="!buyer.isFallback" class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title">Communication Preferences</span></div>
        <div class="zen-bank-fields">
          <div class="zen-bank-field" style="flex-direction:row;align-items:center;justify-content:space-between"><div class="zen-field-label" style="margin-bottom:0">Email Marketing</div><span class="zen-bst" :class="buyer.marketingOptIn ? 'zen-bst--active' : 'zen-bst--inactive'">{{ buyer.marketingOptIn ? 'Opted In' : 'Opted Out' }}</span></div>
          <div class="zen-bank-field" style="flex-direction:row;align-items:center;justify-content:space-between"><div class="zen-field-label" style="margin-bottom:0">SMS Notifications</div><span class="zen-bst" :class="buyer.smsOptIn ? 'zen-bst--active' : 'zen-bst--inactive'">{{ buyer.smsOptIn ? 'Opted In' : 'Opted Out' }}</span></div>
        </div>
      </div>
    </div>

    <template #footer>
      <ZButton variant="ghost" @click="emit('close')">Close</ZButton>
      <ZButton variant="primary" @click="openFullRecord">Open Full Record in Customers →</ZButton>
    </template>
  </ZDrawer>
</template>
