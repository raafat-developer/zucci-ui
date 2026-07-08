<script setup>
/**
 * VendorPromoReviewDrawer — approve/reject/request-mod a vendor promotion.
 * Faithful port of VendorPromoReviewDrawer from zucci-discounts.jsx.
 */
import { ref, computed } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import FundingTag from './FundingTag.vue';
import { DISCOUNT_TYPES, MARKET_CUR, ZCD_RULES } from '@/data/discountsData';
import { MKT_FLAGS, MKT_NAMES } from '@/data/discountsShared';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false }, promo: { type: Object, default: null } });
const emit = defineEmits(['close']);
const decision = ref('approve');
const note = ref('');

const cur = computed(() => (props.promo ? MARKET_CUR[props.promo.market] || 'AED' : 'AED'));
const conflicts = computed(() => props.promo?.conflictsWith || []);
const exceedsMax = computed(() => props.promo && ZCD_RULES.markets?.[props.promo.market]?.vendorMaxDiscount < props.promo.value);

const doAction = () => {
  if (decision.value === 'approve') toast.success('Promotion approved — vendor notified');
  else if (decision.value === 'reject') toast.error('Promotion rejected — vendor notified');
  else toast.info('Modification requested — vendor notified');
  emit('close');
};
const discountTypes = DISCOUNT_TYPES;
</script>

<template>
  <ZDrawer v-if="promo" :open="open" title="Review Vendor Promotion" :subtitle="promo.name" :width="620" @close="emit('close')">
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="zen-card" style="padding:14px">
        <div class="zen-bank-fields">
          <div class="zen-bank-field"><div class="zen-field-label">Vendor / Brand</div><div class="zen-field-val">{{ promo.vendor }} · <strong>{{ promo.brand }}</strong></div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Market</div><div class="zen-field-val">{{ MKT_FLAGS[promo.market] }} {{ MKT_NAMES[promo.market] }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Type</div><div class="zen-field-val">{{ discountTypes[promo.type] }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Discount</div><div class="zen-field-val" style="font-family:var(--zg-mono);font-weight:700;color:var(--zg-accent);font-size:15px">{{ promo.value }}% off</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Duration</div><div class="zen-field-val">{{ promo.startDate }} → {{ promo.endDate }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Min. Order</div><div class="zen-field-val">{{ cur }} {{ promo.minOrderValue || 'None' }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Code</div><div class="zen-field-val zen-field-mono">{{ promo.code || 'Auto-apply' }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Funded By</div><FundingTag :model="promo.fundedBy" /></div>
        </div>
      </div>

      <div v-if="conflicts.length" class="zf-alert zf-alert--warn">
        <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 2L13 12H1L7 2Z" /><line x1="7" y1="6" x2="7" y2="8.5" /><circle cx="7" cy="10.5" r="0.5" fill="currentColor" /></svg>
        Conflicts with active promotion(s): {{ conflicts.join(', ') }}. Check stacking rules before approving.
      </div>
      <div v-if="exceedsMax" class="zf-alert zf-alert--danger">
        Requested discount ({{ promo.value }}%) exceeds maximum vendor discount for {{ MKT_NAMES[promo.market] }} ({{ ZCD_RULES.markets[promo.market]?.vendorMaxDiscount }}%).
      </div>

      <div class="zf-filter-row">
        <button v-for="d in ['approve','reject','request_modification']" :key="d" type="button" class="zen-filter-chip" :class="{ 'is-on': decision === d }" @click="decision = d">{{ d === 'approve' ? 'Approve' : d === 'reject' ? 'Reject' : 'Request Modification' }}</button>
      </div>
      <div class="zf-props-field">
        <label class="zf-props-label">{{ decision === 'approve' ? 'Approval Note (optional)' : 'Note to Vendor *' }}</label>
        <textarea class="zp-seo-textarea" rows="3" v-model="note" :placeholder="decision === 'approve' ? 'e.g. Approved — runs alongside Summer Sale, max 35% combined' : 'Explain what needs to change…'" />
      </div>
    </div>
    <template #footer>
      <button class="zen-btn-ghost" @click="emit('close')">Cancel</button>
      <button v-if="decision === 'approve'" class="zen-btn-primary" style="background:var(--zg-good)" @click="doAction">Approve</button>
      <button v-else-if="decision === 'reject'" class="zen-btn-primary" style="background:var(--zg-danger)" :disabled="!note" :style="{ opacity: note ? 1 : 0.4 }" @click="doAction">Reject</button>
      <button v-else class="zen-btn-primary" @click="doAction">Send Request</button>
    </template>
  </ZDrawer>
</template>
