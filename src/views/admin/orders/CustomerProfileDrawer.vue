<script setup>
/**
 * CustomerProfileDrawer — 80vw drawer opened from Orders panel/detail.
 * Faithful to React: looks up buyer by email, shows all 8 BuyerDetail tabs.
 * Tabs: Profile · Purchases · Addresses · Payment Methods · Loyalty ·
 *       Analytics · Abandoned Carts · Activity Log
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ZC_BUYERS } from '@/data/customersData';
import BuyerScoreRing   from '@/views/admin/customers/BuyerScoreRing.vue';
import BuyerTierBadge   from '@/views/admin/customers/BuyerTierBadge.vue';
import BuyerProfileTab  from '@/views/admin/customers/tabs/BuyerProfileTab.vue';
import BuyerPurchasesTab from '@/views/admin/customers/tabs/BuyerPurchasesTab.vue';
import BuyerAddressesTab from '@/views/admin/customers/tabs/BuyerAddressesTab.vue';
import BuyerPaymentsTab  from '@/views/admin/customers/tabs/BuyerPaymentsTab.vue';
import BuyerLoyaltyTab   from '@/views/admin/customers/tabs/BuyerLoyaltyTab.vue';
import BuyerAnalyticsTab from '@/views/admin/customers/tabs/BuyerAnalyticsTab.vue';
import BuyerAbandonedCartsTab from '@/views/admin/customers/tabs/BuyerAbandonedCartsTab.vue';
import BuyerActivityTab  from '@/views/admin/customers/tabs/BuyerActivityTab.vue';

const props = defineProps({
  open:     { type: Boolean, default: false },
  customer: { type: Object,  default: null },
});
const emit = defineEmits(['close']);
const router = useRouter();

const tab = ref('profile');

const TABS = [
  ['profile',         'Profile'],
  ['purchases',       'Purchases'],
  ['addresses',       'Addresses'],
  ['payment-methods', 'Payment Methods'],
  ['loyalty',         'Loyalty'],
  ['analytics',       'Analytics'],
  ['abandoned-carts', 'Abandoned Carts'],
  ['activity-log',    'Activity Log'],
];

const buyer = computed(() => {
  if (!props.customer) return null;
  const match = ZC_BUYERS.find(b =>
    b.email && props.customer?.email &&
    b.email.toLowerCase() === props.customer.email?.toLowerCase()
  );
  if (match) return match;
  // Fallback from order customer fields
  return {
    id:'—', firstName:props.customer.firstName, lastName:props.customer.lastName,
    email:props.customer.email, phone:props.customer.phone,
    initials:`${(props.customer.firstName||'?')[0]}${(props.customer.lastName||'?')[0]}`,
    color:'#7c8189', tier:'Standard', country:'—', city:'—',
    nationality:'—', currency:'AED', registeredDate:'—', lastLogin:'—',
    buyerScore:0, status:'active', dob:'—', gender:'—', language:'en',
    marketingOptIn:false, smsOptIn:false, pushOptIn:false,
    notes:'', isFallback:true,
    stats:{ totalOrders:0, lifetimeValue:0, avgOrderValue:0, returnRate:0, lastOrderDate:'—', totalSpend:0 },
    purchases:[], addresses:[], paymentMethods:[], activityLog:[],
    analytics:{ purchaseFrequency:'—', avgDaysBetweenOrders:0, preferredDay:'—', preferredTime:'—', topCategories:[], topBrands:[], deviceBreakdown:{ mobile:50, desktop:50 }, returnReasons:[] },
  };
});

const TIER_META = {
  Gold:     { bg:'oklch(0.82 0.15 75 / 0.15)', color:'var(--zg-warn)',        border:'oklch(0.82 0.15 75 / 0.35)' },
  Silver:   { bg:'oklch(0.70 0.0 0 / 0.15)',   color:'#aaa',                  border:'rgba(170,170,170,0.3)' },
  Bronze:   { bg:'oklch(0.65 0.12 40 / 0.15)', color:'oklch(0.72 0.12 40)',   border:'oklch(0.65 0.12 40 / 0.35)' },
  Standard: { bg:'var(--zg-panel-hi)',          color:'var(--zg-text-dim)',    border:'var(--zg-line)' },
};
const tierStyle = t => TIER_META[t] || TIER_META.Standard;

function openFullRecord() { router.push('/admin/customers'); emit('close'); }
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div v-if="open" class="cpd-backdrop" @click="emit('close')" />

    <!-- Drawer -->
    <div v-if="open" class="cpd-drawer">
      <div v-if="!buyer" class="cpd-empty">
        <span>Customer not found</span>
        <button class="cpd-btn-ghost" @click="emit('close')">Close</button>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="cpd-head">
          <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;">
            <!-- Avatar -->
            <div class="cpd-avatar" :style="{ background: buyer.color+'22', color: buyer.color }">
              {{ buyer.initials }}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:15px;font-weight:700;color:var(--zg-text);">{{ buyer.firstName }} {{ buyer.lastName }}</div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;">
                <span style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);">#{{ buyer.id }}</span>
                <span style="font-size:11px;color:var(--zg-text-dim);">{{ buyer.country }} · {{ buyer.city }}</span>
                <span class="zen-tier-badge"
                  :style="{ background: tierStyle(buyer.tier).bg, color: tierStyle(buyer.tier).color, borderColor: tierStyle(buyer.tier).border }">
                  {{ buyer.tier }}
                </span>
                <span class="zen-bst" :class="buyer.status === 'active' ? 'zen-bst--active' : 'zen-bst--inactive'">{{ buyer.status }}</span>
              </div>
            </div>
          </div>
          <!-- Actions -->
          <div style="display:flex;gap:6px;flex-shrink:0;">
            <button class="cpd-head-act" title="Call" @click="">
              <svg viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5 1C4 3 3 5 4 7C5 9 7 11 9 12C11 13 13 12 15 11L12 8L10 10C9 9 7 7 6 6L8 4L5 1Z"/></svg>
            </button>
            <button class="cpd-head-act" title="Email" @click="">
              <svg viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1" y="3" width="14" height="10" rx="1.5"/><path d="M1 5L8 9L15 5"/></svg>
            </button>
            <button class="cpd-head-act" title="Password Reset" @click="">
              <svg viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5 8a3 3 0 016 0v1H4V8z M4 9h8v5H4z M8 12v1"/></svg>
            </button>
            <button class="cpd-open-full" @click="openFullRecord">Open Full Profile →</button>
            <button class="cpd-close-btn" @click="emit('close')">×</button>
          </div>
        </div>

        <!-- Tab bar -->
        <div class="cpd-tabs">
          <button v-for="[v, l] in TABS" :key="v"
            class="cpd-tab" :class="{ 'is-active': tab === v }"
            @click="tab = v">{{ l }}</button>
        </div>

        <!-- Tab content -->
        <div class="cpd-content">
          <BuyerProfileTab       v-if="tab === 'profile'"          :buyer="buyer" />
          <BuyerPurchasesTab     v-else-if="tab === 'purchases'"     :buyer="buyer" />
          <BuyerAddressesTab     v-else-if="tab === 'addresses'"     :buyer="buyer" />
          <BuyerPaymentsTab      v-else-if="tab === 'payment-methods'" :buyer="buyer" />
          <BuyerLoyaltyTab       v-else-if="tab === 'loyalty'"        :buyer="buyer" />
          <BuyerAnalyticsTab     v-else-if="tab === 'analytics'"      :buyer="buyer" />
          <BuyerAbandonedCartsTab v-else-if="tab === 'abandoned-carts'" :buyer="buyer" />
          <BuyerActivityTab      v-else-if="tab === 'activity-log'"   :buyer="buyer" />
        </div>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.cpd-backdrop {
  position: fixed; inset: 0; z-index: 490;
  background: oklch(0.1 0.01 250 / 0.3);
}
.cpd-drawer {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: 65vw; max-width: 900px; z-index: 491;
  background: var(--zg-bg-elev);
  border-left: 1px solid var(--zg-line);
  display: flex; flex-direction: column; min-height: 0;
  box-shadow: -8px 0 32px oklch(0.05 0.01 250 / 0.5);
  animation: cpd-slide-in 0.22s cubic-bezier(0.22, 0.61, 0.36, 1);
}
@keyframes cpd-slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }

/* Header */
.cpd-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--zg-line); flex-shrink: 0;
  background: var(--zg-bg-elev);
}
.cpd-avatar {
  width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 800; letter-spacing: -0.02em;
}
.cpd-head-act {
  width: 30px; height: 30px; border: 1px solid var(--zg-line); border-radius: 4px;
  background: var(--zg-panel); cursor: pointer; color: var(--zg-text-dim);
  display: flex; align-items: center; justify-content: center;
}
.cpd-head-act:hover { background: var(--zg-panel-hi); color: var(--zg-text); }
.cpd-open-full {
  height: 30px; padding: 0 12px; border: 1px solid var(--zg-accent);
  border-radius: var(--zg-radius-md); background: oklch(0.78 0.18 130 / 0.08);
  cursor: pointer; font-size: 11.5px; font-weight: 600; color: var(--zg-accent);
  white-space: nowrap;
}
.cpd-close-btn {
  width: 30px; height: 30px; border: none; background: var(--zg-panel);
  border-radius: 4px; cursor: pointer; font-size: 18px; color: var(--zg-text-dim);
}

/* Tier badge */
:deep(.zen-tier-badge) {
  height: 18px; padding: 0 7px; border-radius: 3px; border: 1px solid;
  font-size: 10px; font-weight: 700; display: inline-flex; align-items: center;
}

/* Tabs */
.cpd-tabs {
  display: flex; border-bottom: 1px solid var(--zg-line);
  background: var(--zg-bg-elev); overflow-x: auto; scrollbar-width: none; flex-shrink: 0;
}
.cpd-tab {
  height: 38px; padding: 0 14px; border: none; background: transparent;
  font-size: 12.5px; cursor: pointer; color: var(--zg-text-dim);
  border-bottom: 2px solid transparent; white-space: nowrap; font-weight: 400;
}
.cpd-tab.is-active { color: var(--zg-accent); border-bottom-color: var(--zg-accent); font-weight: 600; }

/* Content */
.cpd-content {
  flex: 1; overflow-y: auto; min-height: 0;
  scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent;
}

/* Empty state */
.cpd-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%; gap: 12px;
  font-size: 13px; color: var(--zg-text-dim);
}
.cpd-btn-ghost {
  height: 32px; padding: 0 14px; border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md); background: transparent;
  color: var(--zg-text-mid); font-size: 12px; cursor: pointer;
}
</style>
