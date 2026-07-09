<script setup>
/**
 * PaymentDealsTab — payment partner deals. Faithful port of PaymentDealsTab
 * from zucci-discounts.jsx.
 */
import { ref, computed } from 'vue';
import StatusBadge from './StatusBadge.vue';
import FundingTag from './FundingTag.vue';
import PaymentDealEditDrawer from './PaymentDealEditDrawer.vue';
import { ZCD_PAYMENT_DEALS, MARKET_CUR } from '@/data/discountsData';
import { MKT_FLAGS, MKT_NAMES } from '@/data/discountsShared';
import { toast } from '@/composables/useToast';

const props = defineProps({ market: { type: String, required: true } });
const editDeal = ref(null);
const deals = ref(ZCD_PAYMENT_DEALS.map((d) => ({ ...d })));
const cur = computed(() => MARKET_CUR[props.market] || 'AED');
const marketDeals = computed(() => deals.value.filter((d) => d.market === props.market));
const onSaveDeal = (saved) => {
  const idx = deals.value.findIndex((d) => d.id === saved.id);
  if (idx >= 0) deals.value[idx] = { ...deals.value[idx], ...saved };
  else deals.value.unshift({ ...saved, market: props.market, logo:'💳', partnerType:'bank', paymentMethods:[], dealType:'instant_discount', value: saved.discount, txnCount:0, totalCashbackPaid:0, totalRevenue:0, contractUploaded:false });
};
</script>

<template>
  <div class="zcd-tab-body">
    <div class="zf-section-title" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0">
      <span>{{ MKT_FLAGS[market] }} {{ MKT_NAMES[market] }} · Payment Partner Deals</span>
      <button class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="editDeal = {}">+ New Deal</button>
    </div>
    <div class="zf-alert" style="background:oklch(0.82 0.14 215 / 0.07);border-color:oklch(0.82 0.14 215 / 0.2);color:var(--zg-text-mid)">
      <svg viewBox="0 0 14 14" width="12" fill="none" stroke="oklch(0.82 0.14 215)" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="5.5" /><line x1="7" y1="4.5" x2="7" y2="7.5" /><circle cx="7" cy="9.5" r="0.5" fill="currentColor" /></svg>
      Payment partner deals are market-locked and require Finance + Legal approval before activation.
    </div>

    <div v-if="!marketDeals.length" class="zcd-empty">No payment partner deals for {{ MKT_NAMES[market] }}.</div>
    <div v-for="d in marketDeals" :key="d.id" class="zcd-payment-card">
      <div class="zcd-payment-head">
        <div class="zcd-payment-logo">{{ d.logo }}</div>
        <div class="zcd-payment-info">
          <div class="zcd-promo-name">{{ d.partner }}</div>
          <div class="zcd-promo-meta"><span class="zen-brand-cat-tag">{{ d.partnerType.toUpperCase() }}</span><span v-for="m in d.paymentMethods" :key="m" class="zen-brand-cat-tag">{{ m }}</span></div>
        </div>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center;flex-shrink:0"><FundingTag :model="d.fundedBy" /><StatusBadge :status="d.status" /></div>
      </div>

      <div class="zcd-payment-body">
        <div class="zcd-payment-kpi"><div class="zf-kpi-lbl">Deal Type</div><div class="zcd-stat-val">{{ d.dealType === 'cashback' ? `${d.value}% Cashback` : d.dealType === 'instant_discount' ? `${d.value}% Instant Discount` : '0% Installments' }}</div></div>
        <div class="zcd-payment-kpi"><div class="zf-kpi-lbl">Max Cashback / Tx</div><div class="zcd-stat-val">{{ d.maxCashbackPerTx ? `${cur} ${d.maxCashbackPerTx}` : '—' }}</div></div>
        <div class="zcd-payment-kpi"><div class="zf-kpi-lbl">Min Order</div><div class="zcd-stat-val">{{ d.minOrderValue ? `${cur} ${d.minOrderValue}` : '—' }}</div></div>
        <div class="zcd-payment-kpi"><div class="zf-kpi-lbl">Transactions</div><div class="zcd-stat-val">{{ d.txnCount.toLocaleString() }}</div></div>
        <div class="zcd-payment-kpi"><div class="zf-kpi-lbl">Total Benefit Paid</div><div class="zcd-stat-val is-neg">{{ cur }} {{ d.totalCashbackPaid.toLocaleString() }}</div></div>
        <div class="zcd-payment-kpi"><div class="zf-kpi-lbl">Revenue Generated</div><div class="zcd-stat-val is-good">{{ cur }} {{ d.totalRevenue.toLocaleString() }}</div></div>
      </div>

      <div class="zcd-approval-track">
        <div v-for="[k, l] in [['contractUploaded','Contract Uploaded'],['legalApproved','Legal Approved'],['financeApproved','Finance Approved']]" :key="k" class="zcd-approval-step" :class="d[k] ? 'is-done' : 'is-pending'">
          <svg v-if="d[k]" viewBox="0 0 12 12" width="11" fill="none" stroke="var(--zg-good)" stroke-width="2" stroke-linecap="round"><path d="M2 6L5 9L10 3" /></svg>
          <svg v-else viewBox="0 0 12 12" width="11" fill="none" stroke="var(--zg-warn)" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="4.5" /></svg>
          {{ l }}
        </div>
        <span v-if="d.contractRef" class="zen-pd-ref" style="margin-left:auto">Ref: {{ d.contractRef }}</span>
      </div>

      <div v-if="d.notes" class="zcd-notes-strip">{{ d.notes }}</div>

      <div class="zcd-card-foot">
        <span v-if="d.startDate" class="zen-pd-date">{{ d.startDate }} → {{ d.endDate }}</span>
        <div style="display:flex;gap:6px;margin-left:auto">
          <button class="zen-doc-card-btn" @click="toast.info('Viewing contract document…')">View Contract</button>
          <button class="zen-doc-card-btn" @click="editDeal = d">Edit</button>
          <button v-if="!d.legalApproved" class="zen-doc-card-btn zen-doc-card-btn--approve" @click="toast.success('Legal approval granted')">Legal Approve</button>
          <button v-if="d.legalApproved && !d.status.startsWith('active')" class="zen-doc-card-btn zen-doc-card-btn--approve" @click="toast.success('Deal activated')">Activate</button>
        </div>
      </div>
    </div>

    <PaymentDealEditDrawer :open="!!editDeal" :deal="editDeal" @close="editDeal = null" @save="onSaveDeal" />
  </div>
</template>
