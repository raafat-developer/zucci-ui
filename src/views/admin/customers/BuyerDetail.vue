<script setup>
import { ref } from 'vue';
import BuyerTierBadge    from './BuyerTierBadge.vue';
import BuyerProfileTab   from './tabs/BuyerProfileTab.vue';
import BuyerPurchasesTab from './tabs/BuyerPurchasesTab.vue';
import BuyerAddressesTab from './tabs/BuyerAddressesTab.vue';
import BuyerPaymentsTab  from './tabs/BuyerPaymentsTab.vue';
import BuyerLoyaltyTab   from './tabs/BuyerLoyaltyTab.vue';
import BuyerAnalyticsTab from './tabs/BuyerAnalyticsTab.vue';
import BuyerAbandonedCartsTab from './tabs/BuyerAbandonedCartsTab.vue';
import BuyerActivityTab  from './tabs/BuyerActivityTab.vue';

const props = defineProps({ buyer: { type: Object, required: true } });

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

const ACTIONS = [
  { title:'Call',            icon:'M5 1C4 3 3 5 4 7C5 9 7 11 9 12C11 13 13 12 15 11L12 8L10 10C9 9 7 7 6 6L8 4L5 1Z' },
  { title:'Email',           icon:'M1 3h14v10H1z M1 5l7 4 7-4', isRect: true },
  { title:'Password reset',  icon:'M5 8a3 3 0 016 0v1H4V8z M4 9h8v5H4z M8 12v1' },
  { title:'Suspend',         icon:'M4 2h3v12H4z M9 2h3v12H9z', warn: true },
  { title:'Flag',            icon:'M4 2L4 14 M4 2L13 5.5L4 9', danger: true },
];
</script>

<template>
  <div class="zen-detail">
    <!-- Header -->
    <div class="zen-detail-head">
      <div class="zen-entity-avatar" :style="{ background: buyer.color + '22', color: buyer.color }">
        {{ buyer.initials }}
      </div>
      <div class="zen-entity-info">
        <div class="zen-entity-name">{{ buyer.firstName }} {{ buyer.lastName }}</div>
        <div class="zen-entity-meta">
          <span class="zen-entity-id">#{{ buyer.id }}</span>
          <span class="zen-entity-type">{{ buyer.country }} · {{ buyer.city }}</span>
          <BuyerTierBadge :tier="buyer.tier" />
          <span class="zen-bst" :class="buyer.status === 'active' ? 'zen-bst--active' : 'zen-bst--inactive'">
            {{ buyer.status }}
          </span>
        </div>
      </div>
      <div class="zen-entity-actions">
        <button class="zen-head-act" title="Call" @click="">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <path d="M5 1C4 3 3 5 4 7C5 9 7 11 9 12C11 13 13 12 15 11L12 8L10 10C9 9 7 7 6 6L8 4L5 1Z"/>
          </svg>
        </button>
        <button class="zen-head-act" title="Email" @click="">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <rect x="1" y="3" width="14" height="10" rx="1.5"/><path d="M1 5L8 9L15 5"/>
          </svg>
        </button>
        <button class="zen-head-act" title="Password reset" @click="">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <path d="M5 8a3 3 0 016 0v1H4V8z M4 9h8v5H4z M8 12v1"/>
          </svg>
        </button>
        <button class="zen-head-act zen-head-act--warn" title="Suspend" @click="">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <rect x="4" y="2" width="3" height="12" rx="1"/><rect x="9" y="2" width="3" height="12" rx="1"/>
          </svg>
        </button>
        <button class="zen-head-act zen-head-act--danger" title="Flag" @click="">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <path d="M4 2L4 14 M4 2L13 5.5L4 9"/>
          </svg>
        </button>
        <button class="zen-head-act" title="More">⋯</button>
      </div>
    </div>

    <!-- Tab bar -->
    <div class="zen-tabs">
      <button v-for="[v, l] in TABS" :key="v"
        class="zen-tab" :class="{ 'is-active': tab === v }"
        @click="tab = v">{{ l }}</button>
    </div>

    <!-- Tab content -->
    <div class="zen-tab-content">
      <BuyerProfileTab       v-if="tab === 'profile'"         :buyer="buyer" />
      <BuyerPurchasesTab     v-else-if="tab === 'purchases'"      :buyer="buyer" />
      <BuyerAddressesTab     v-else-if="tab === 'addresses'"      :buyer="buyer" />
      <BuyerPaymentsTab      v-else-if="tab === 'payment-methods'":buyer="buyer" />
      <BuyerLoyaltyTab       v-else-if="tab === 'loyalty'"        :buyer="buyer" />
      <BuyerAnalyticsTab     v-else-if="tab === 'analytics'"      :buyer="buyer" />
      <BuyerAbandonedCartsTab v-else-if="tab === 'abandoned-carts'":buyer="buyer" />
      <BuyerActivityTab      v-else-if="tab === 'activity-log'"   :buyer="buyer" />
    </div>
  </div>
</template>
