<script setup>
const props = defineProps({ buyer: { type: Object, required: true } });
const CARD_BRAND_COLOR = { Visa:'#1A1F71', Mastercard:'#EB001B' };
</script>

<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar">
      <div class="zen-tab-toolbar-title">{{ buyer.paymentMethods.length }} payment method{{ buyer.paymentMethods.length !== 1 ? 's' : '' }}</div>
    </div>
    <div v-for="pm in buyer.paymentMethods" :key="pm.id" class="byr-pm-card">
      <div class="byr-pm-icon">
        <svg viewBox="0 0 24 16" width="36" height="24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
          <rect x="1" y="1" width="22" height="14" rx="2"/>
          <line x1="1" y1="5" x2="23" y2="5"/>
          <rect x="3" y="8" width="5" height="3" rx="0.5"/>
        </svg>
      </div>
      <div class="byr-pm-info">
        <div class="byr-pm-row">
          <template v-if="pm.type === 'card'">
            <span class="byr-card-brand" :style="{ color: CARD_BRAND_COLOR[pm.brand] || 'var(--zg-accent)' }">{{ pm.brand }}</span>
            <span class="byr-pm-number">•••• {{ pm.last4 }}</span>
          </template>
          <span v-else class="byr-pm-wallet">{{ pm.brand }}</span>
          <span v-if="pm.isDefault" class="zen-pm-default">Default</span>
        </div>
        <div v-if="pm.expiry" class="byr-pm-expiry">Expires {{ pm.expiry }}</div>
      </div>
      <div style="display:flex;gap:6px;margin-left:auto;">
        <button v-if="!pm.isDefault" class="zen-doc-request-btn" @click="">Set Default</button>
        <span class="zen-bst" :class="pm.status === 'active' ? 'zen-bst--active' : 'zen-bst--inactive'">{{ pm.status }}</span>
      </div>
    </div>
  </div>
</template>
