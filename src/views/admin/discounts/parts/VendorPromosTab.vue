<script setup>
/**
 * VendorPromosTab — vendor-submitted / Zucci-suggested promotions. Faithful
 * port of VendorPromosTab from zucci-discounts.jsx.
 */
import { ref, computed } from 'vue';
import VendorPromoReviewDrawer from './VendorPromoReviewDrawer.vue';
import PromoFormDrawer from './PromoFormDrawer.vue';
import StatusBadge from './StatusBadge.vue';
import FundingTag from './FundingTag.vue';
import { ZCD_VENDOR_PROMOS, MARKET_CUR } from '@/data/discountsData';
import { MKT_FLAGS, MKT_NAMES } from '@/data/discountsShared';
import { toast } from '@/composables/useToast';

const props = defineProps({ market: { type: String, required: true } });
const filter = ref('all');
const reviewPromo = ref(null);
const suggestOpen = ref(false);

const all = computed(() => ZCD_VENDOR_PROMOS.filter((p) => p.market === props.market));
const filtered = computed(() => (filter.value === 'all' ? all.value : all.value.filter((p) => p.status === filter.value || p.origin === filter.value)));
const pendingCount = computed(() => all.value.filter((p) => p.status === 'pending_approval').length);
</script>

<template>
  <div class="zcd-tab-body">
    <div class="zf-section-title" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0">
      <span>{{ MKT_FLAGS[market] }} {{ MKT_NAMES[market] }} · Vendor Promotions</span>
      <button class="zen-btn-ghost" style="height:28px;font-size:11.5px" @click="suggestOpen = true">Suggest to Vendor</button>
    </div>

    <div v-if="pendingCount" class="zf-alert zf-alert--warn">
      <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="5.5" /><line x1="7" y1="4.5" x2="7" y2="7.5" /><circle cx="7" cy="9.5" r="0.5" fill="currentColor" /></svg>
      {{ pendingCount }} promotion{{ pendingCount !== 1 ? 's' : '' }} awaiting your approval.
    </div>

    <div class="zf-filter-row">
      <button v-for="[s, l] in [['all','All'],['pending_approval','Pending'],['approved','Approved'],['rejected','Rejected'],['vendor_suggested','Suggested by Zucci']]" :key="s" class="zen-filter-chip" :class="{ 'is-on': filter === s }" @click="filter = s">{{ l }}</button>
    </div>

    <div v-if="!filtered.length" class="zcd-empty">No vendor promotions for this filter in {{ MKT_NAMES[market] }}.</div>
    <div v-for="p in filtered" :key="p.id" class="zcd-vendor-card">
      <div class="zcd-vendor-card-head">
        <div>
          <div class="zcd-promo-name">{{ p.name }}</div>
          <div class="zcd-promo-meta" style="margin-top:3px">
            <span class="zen-pd-ref">{{ p.vendor }}</span>
            <span class="zen-brand-cat-tag">{{ p.brand }}</span>
            <span class="zcd-promo-value">{{ p.value }}% off</span>
            <code v-if="p.code" class="zcd-code-pill">{{ p.code }}</code>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
          <FundingTag :model="p.fundedBy" />
          <StatusBadge :status="p.status" />
        </div>
      </div>

      <div class="zcd-vendor-card-body">
        <div class="zen-bank-field"><div class="zen-field-label">Duration</div><div class="zen-field-val">{{ p.startDate || 'TBD' }} → {{ p.endDate || 'TBD' }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Min. Order</div><div class="zen-field-val">{{ MARKET_CUR[p.market] || 'AED' }} {{ p.minOrderValue || 'None' }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Applies To</div><div class="zen-field-val">{{ p.appliesTo }}</div></div>
        <div v-if="p.origin === 'vendor_suggested' && p.suggestedNote" class="zen-bank-field" style="grid-column:1/-1"><div class="zen-field-label">Zucci Suggestion Note</div><div class="zen-field-val" style="font-size:12px;color:var(--zg-text-mid)">{{ p.suggestedNote }}</div></div>
        <div v-if="p.approvalNote" class="zen-bank-field" style="grid-column:1/-1"><div class="zen-field-label">{{ p.status === 'rejected' ? 'Rejection Reason' : 'Approval Note' }}</div><div class="zen-field-val" :style="{ fontSize:'12px', color: p.status === 'rejected' ? 'var(--zg-danger)' : 'var(--zg-text-mid)' }">{{ p.approvalNote }}</div></div>
      </div>

      <div class="zcd-vendor-card-foot">
        <span class="zen-pd-date">{{ p.origin === 'vendor_suggested' ? `Suggested by ${p.suggestedBy} · ${p.suggestedDate}` : `Submitted by ${p.submittedBy} · ${p.submittedDate}` }}</span>
        <button v-if="p.status === 'pending_approval'" class="zen-btn-primary" style="height:26px;font-size:11.5px" @click="reviewPromo = p">Review</button>
        <div v-if="p.origin === 'vendor_suggested' && p.status === 'suggested'" style="display:flex;gap:6px">
          <button class="zen-doc-card-btn" @click="toast.success('Suggestion accepted — vendor notified')">Vendor Accepted</button>
          <button class="zen-doc-card-btn zen-doc-card-btn--reject" @click="toast.info('Suggestion declined')">Declined</button>
        </div>
      </div>
    </div>

    <VendorPromoReviewDrawer :open="!!reviewPromo" :promo="reviewPromo" @close="reviewPromo = null" />
    <PromoFormDrawer :open="suggestOpen" :promo="null" mode="suggest" @close="suggestOpen = false" />
  </div>
</template>
