<script setup>
import { computed } from 'vue';
import BuyerTierBadge from '../BuyerTierBadge.vue';

const props = defineProps({ buyer: { type: Object, required: true } });

const tiers    = ['Bronze','Silver','Gold','Platinum'];
const tierIdx  = computed(() => tiers.indexOf(props.buyer.tier));
const nextTier = computed(() => tiers[tierIdx.value + 1]);
const points   = computed(() => props.buyer.buyerScore * 48 + 220);
const nextTarget = computed(() => (tierIdx.value + 1) * 5000);
const progress   = computed(() => Math.min(100, Math.round((points.value / nextTarget.value) * 100)));

const history = computed(() => [
  { date:'May 28, 2026', event:`Purchase ORD-88841`, pts:+120, bal:points.value },
  { date:'May 14, 2026', event:`Purchase ORD-88720`, pts:+90,  bal:points.value - 120 },
  { date:'Apr 30, 2026', event:'Reward redeemed — 10% off', pts:-500, bal:points.value - 210 },
  { date:'Apr 30, 2026', event:`Purchase ORD-88421`, pts:+240, bal:points.value - 210 + 240 },
  { date:'Mar 22, 2026', event:'Referral bonus', pts:+200, bal:points.value - 210 },
]);

const benefits = [
  { label:'Points per AED spent',   val: (t) => t === 'Gold' ? '2×' : '1×' },
  { label:'Early access sales',     val: (t) => t === 'Gold' ? 'Yes' : 'No' },
  { label:'Free returns',           val: (t) => t === 'Gold' ? 'Unlimited' : '2/year' },
  { label:'Birthday reward',        val: () => '250 pts' },
  { label:'Priority support',       val: (t) => t === 'Gold' ? 'Yes' : 'No' },
  { label:'Exclusive vouchers',     val: (t) => t === 'Gold' ? 'Monthly' : 'Quarterly' },
];
</script>

<template>
  <div class="zen-tab-body">
    <div class="zen-card byr-loyalty-card">
      <div class="byr-loyalty-top">
        <div>
          <div class="byr-loyalty-tier-label">Current Tier</div>
          <BuyerTierBadge :tier="buyer.tier" />
        </div>
        <div class="byr-loyalty-points">
          <div class="byr-loyalty-pts-val">{{ points.toLocaleString() }}</div>
          <div class="byr-loyalty-pts-lbl">points</div>
        </div>
        <div v-if="nextTier" style="flex:1;min-width:120px;">
          <div class="zen-perf-lbl" style="margin-bottom:6px;">Progress to {{ nextTier }}</div>
          <div class="byr-bar-track" style="height:8px;">
            <div class="byr-bar-fill" :style="{ width: progress + '%' }" />
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:4px;">
            <span class="zen-adv-kpi-sub">{{ points.toLocaleString() }} pts</span>
            <span class="zen-adv-kpi-sub">{{ nextTarget.toLocaleString() }} pts</span>
          </div>
        </div>
      </div>
      <div class="byr-loyalty-benefits">
        <div class="zen-doc-section-title" style="margin-bottom:8px;">Tier Benefits</div>
        <div class="byr-benefit-grid">
          <div v-for="b in benefits" :key="b.label"
            class="zen-bank-field" style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding:6px 0;">
            <span class="zen-field-label" style="margin-bottom:0;">{{ b.label }}</span>
            <span class="zen-field-val" style="font-size:12px;">{{ b.val(buyer.tier) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="zen-doc-section-title">Points History</div>
    <div class="zen-payout-table">
      <div class="zen-payout-table-head" style="grid-template-columns:100px 1fr 80px 100px;">
        <span>Date</span><span>Event</span><span>Points</span><span>Balance</span>
      </div>
      <div v-for="(h, i) in history" :key="i" class="zen-payout-row" style="grid-template-columns:100px 1fr 80px 100px;">
        <span class="zen-pd-date">{{ h.date }}</span>
        <span>{{ h.event }}</span>
        <span class="zen-payout-amount" :style="{ color: h.pts > 0 ? 'var(--zg-good)' : 'var(--zg-danger)' }">{{ h.pts > 0 ? '+' : '' }}{{ h.pts }}</span>
        <span class="zen-payout-amount">{{ h.bal.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>
