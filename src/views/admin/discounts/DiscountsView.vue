<script setup>
/**
 * DiscountsView — Discounts & Promotions module shell. Faithful port of
 * ZucciDiscountsModule from zucci-discounts.jsx: market switcher + 15 tabs.
 */
import { ref, inject, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import DiscountsOverview from './parts/DiscountsOverview.vue';
import ZucciPromosTab from './parts/ZucciPromosTab.vue';
import VendorPromosTab from './parts/VendorPromosTab.vue';
import CustomerTargetingTab from './parts/CustomerTargetingTab.vue';
import PaymentDealsTab from './parts/PaymentDealsTab.vue';
import CampaignsTab from './parts/CampaignsTab.vue';
import AutomatedRulesTab from './parts/AutomatedRulesTab.vue';
import DiscountsAnalyticsTab from './parts/DiscountsAnalyticsTab.vue';
import RulesTab from './parts/RulesTab.vue';
import InfluencerTab from './parts/InfluencerTab.vue';
import GiftCardsTab from './parts/GiftCardsTab.vue';
import StoreCreditTab from './parts/StoreCreditTab.vue';
import BudgetsTab from './parts/BudgetsTab.vue';
import CreativeAssetsTab from './parts/CreativeAssetsTab.vue';
import LiveShoppingTab from './parts/LiveShoppingTab.vue';
import { ZCD_VENDOR_PROMOS, MARKET_CUR } from '@/data/discountsData';
import { MKT_FLAGS, MKT_NAMES } from '@/data/discountsShared';
import { toast } from '@/composables/useToast';

const marketInject = inject('market', ref('AE'));
const market = computed(() => (['AE','SA','EG','QA'].includes(marketInject.value?.toUpperCase?.()) ? marketInject.value.toUpperCase() : 'AE'));
const route = useRoute();
const tab = ref(route.query.tab || 'overview');
watch(() => route.query.tab, t => { if (t) tab.value = t; });

const TABS = [
  { id:'overview', label:'Overview' }, { id:'zucci', label:'Zucci Promotions' }, { id:'vendor', label:'Vendor Promotions' },
  { id:'targeting', label:'Customer Targeting' }, { id:'payment', label:'Payment Partner Deals' }, { id:'campaigns', label:'Campaigns' },
  { id:'automated', label:'Automated Rules' }, { id:'analytics', label:'Analytics' }, { id:'rules', label:'Rules & Limits' },
  { id:'influencers', label:'Influencers & UGC' }, { id:'gift-cards', label:'Gift Cards' }, { id:'store-credit', label:'Store Credit' },
  { id:'budgets', label:'Budgets' }, { id:'creative', label:'Creative Assets' }, { id:'live', label:'Live Shopping' },
];
const pendingVendor = computed(() => ZCD_VENDOR_PROMOS.filter((p) => p.market === market.value && p.status === 'pending_approval').length);
const cur = computed(() => MARKET_CUR[market.value] || 'AED');
</script>

<template>
  <div class="zcd-wrap">
    <div class="zcd-header">
      <div><div class="zf-title">Discounts &amp; Promotions</div><div class="zf-subtitle">{{ MKT_FLAGS[market] }} {{ MKT_NAMES[market] }} · {{ cur }} · Market-scoped</div></div>
      <div style="display:flex;gap:8px;align-items:center"><button class="zen-btn-ghost" @click="toast.info('Exporting promotions report…')">Export Report</button></div>
    </div>

    <div class="zen-tabs" style="padding:0 20px;flex-shrink:0">
      <button v-for="t in TABS" :key="t.id" class="zen-tab" :class="{ 'is-active': tab === t.id }" @click="tab = t.id">
        {{ t.label }}
        <span v-if="t.id === 'vendor' && pendingVendor > 0" class="zcd-pending-dot">{{ pendingVendor }}</span>
      </button>
    </div>

    <div class="zcd-content">
      <DiscountsOverview v-if="tab === 'overview'" :market="market" />
      <ZucciPromosTab v-else-if="tab === 'zucci'" :market="market" />
      <VendorPromosTab v-else-if="tab === 'vendor'" :market="market" />
      <CustomerTargetingTab v-else-if="tab === 'targeting'" :market="market" />
      <PaymentDealsTab v-else-if="tab === 'payment'" :market="market" />
      <CampaignsTab v-else-if="tab === 'campaigns'" :market="market" />
      <AutomatedRulesTab v-else-if="tab === 'automated'" :market="market" />
      <DiscountsAnalyticsTab v-else-if="tab === 'analytics'" :market="market" />
      <RulesTab v-else-if="tab === 'rules'" :market="market" />
      <InfluencerTab v-else-if="tab === 'influencers'" :market="market" />
      <GiftCardsTab v-else-if="tab === 'gift-cards'" :market="market" />
      <StoreCreditTab v-else-if="tab === 'store-credit'" :market="market" />
      <BudgetsTab v-else-if="tab === 'budgets'" :market="market" />
      <CreativeAssetsTab v-else-if="tab === 'creative'" :market="market" />
      <LiveShoppingTab v-else :market="market" />
    </div>
  </div>
</template>
