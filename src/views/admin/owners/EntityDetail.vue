<script setup>
import { ref } from 'vue';
import OverviewTab       from './tabs/OverviewTab.vue';
import BrandsTab         from './tabs/BrandsTab.vue';
import UsersTab          from './tabs/UsersTab.vue';
import DocumentsTab      from './tabs/DocumentsTab.vue';
import ActivityLogTab    from './tabs/ActivityLogTab.vue';
import FinanceTab        from './tabs/FinanceTab.vue';
import PerformanceTab    from './tabs/PerformanceTab.vue';
import ContractsTab      from './tabs/ContractsTab.vue';
import TcTab             from './tabs/TcTab.vue';
import CertificationsTab from './tabs/CertificationsTab.vue';
import ClaimsTab         from './tabs/ClaimsTab.vue';
import RiskTab           from './tabs/RiskTab.vue';
import TicketsTab        from './tabs/TicketsTab.vue';

const props = defineProps({ entity: { type: Object, required: true } });
const tab   = ref('overview');

const TABS = [
  ['overview','Overview'],['brands','Brands'],['users','Users'],['documents','Documents'],
  ['activity-log','Activity Log'],['finance','Finance'],['performance','Performance'],
  ['contracts','Contracts'],['tc','T&C'],['certifications','Certifications'],
  ['claims','Claims'],['risk','Risk'],['tickets','Tickets'],
];

const KYC_CLS = { approved:'zen-kyc-chip--approved', pending:'zen-kyc-chip--pending', rejected:'zen-kyc-chip--rejected', not_started:'zen-kyc-chip--not-started' };
const KYC_LBL = { approved:'KYB Approved', pending:'KYB Pending', rejected:'KYB Rejected', not_started:'KYB Not Started' };
const TIER_STYLE = {
  Gold:   { bg:'oklch(0.82 0.15 75 / 0.15)',  color:'var(--zg-warn)',      border:'oklch(0.82 0.15 75 / 0.35)' },
  Silver: { bg:'oklch(0.70 0.0 0 / 0.15)',    color:'#aaa',                border:'rgba(170,170,170,0.3)' },
  Blue:   { bg:'oklch(0.65 0.15 250 / 0.15)', color:'oklch(0.72 0.14 250)',border:'oklch(0.65 0.15 250 / 0.35)' },
  Bronze: { bg:'oklch(0.65 0.12 40 / 0.15)',  color:'oklch(0.72 0.12 40)', border:'oklch(0.65 0.12 40 / 0.35)' },
};
const tierStyle = t => TIER_STYLE[t] || TIER_STYLE.Silver;
</script>

<template>
  <div class="zen-detail">
    <!-- Header -->
    <div class="zen-detail-head">
      <div class="zen-entity-avatar" :style="{ background: entity.color + '22', color: entity.color }">
        {{ entity.initials }}
      </div>
      <div class="zen-entity-info">
        <div class="zen-entity-name">{{ entity.name }}</div>
        <div class="zen-entity-meta">
          <span class="zen-entity-id">#{{ entity.id }}</span>
          <span :class="`zen-entity-type-badge ${entity.entityType === 'individual' ? 'zen-entity-type-badge--individual' : 'zen-entity-type-badge--business'}`">
            {{ entity.entityType === 'individual' ? 'Individual' : 'Business' }}
          </span>
          <span class="zen-entity-type">{{ entity.type }}</span>
          <span class="zen-tier-badge" :style="{ background:tierStyle(entity.tier).bg, color:tierStyle(entity.tier).color, borderColor:tierStyle(entity.tier).border }">{{ entity.tier }} Tier</span>
          <span :class="`zen-kyc-chip ${KYC_CLS[entity.kycbStatus] || KYC_CLS.not_started}`">{{ KYC_LBL[entity.kycbStatus] || 'KYB Not Started' }}</span>
        </div>
      </div>
      <div class="zen-entity-actions">
        <button class="zen-head-act" title="Call">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5 1C4 3 3 5 4 7C5 9 7 11 9 12C11 13 13 12 15 11L12 8L10 10C9 9 7 7 6 6L8 4L5 1Z"/></svg>
        </button>
        <button class="zen-head-act" title="Email">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1" y="3" width="14" height="10" rx="1.5"/><path d="M1 5L8 9L15 5"/></svg>
        </button>
        <button class="zen-head-act" title="Schedule call">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1" y="2" width="14" height="12" rx="1.5"/><line x1="1" y1="6" x2="15" y2="6"/><line x1="5" y1="1" x2="5" y2="3"/><line x1="11" y1="1" x2="11" y2="3"/></svg>
        </button>
        <button class="zen-head-act zen-head-act--warn" title="Place on hold">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="4" y="2" width="3" height="12" rx="1"/><rect x="9" y="2" width="3" height="12" rx="1"/></svg>
        </button>
        <button class="zen-head-act zen-head-act--danger" title="Flag for review">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 2L4 14 M4 2L13 5.5L4 9"/></svg>
        </button>
        <button class="zen-head-act" title="More">⋯</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="zen-tabs">
      <button v-for="[v, l] in TABS" :key="v"
        class="zen-tab" :class="{ 'is-active': tab === v }"
        @click="tab = v">{{ l }}</button>
    </div>

    <!-- Tab content -->
    <div class="zen-tab-content">
      <OverviewTab       v-if="tab === 'overview'"        :entity="entity" />
      <BrandsTab         v-else-if="tab === 'brands'"         :entity="entity" />
      <UsersTab          v-else-if="tab === 'users'"          :entity="entity" />
      <DocumentsTab      v-else-if="tab === 'documents'"      :entity="entity" />
      <ActivityLogTab    v-else-if="tab === 'activity-log'"   :entity="entity" />
      <FinanceTab        v-else-if="tab === 'finance'"         :entity="entity" />
      <PerformanceTab    v-else-if="tab === 'performance'"     :entity="entity" />
      <ContractsTab      v-else-if="tab === 'contracts'"       :entity="entity" />
      <TcTab             v-else-if="tab === 'tc'"              :entity="entity" />
      <CertificationsTab v-else-if="tab === 'certifications'"  :entity="entity" />
      <ClaimsTab         v-else-if="tab === 'claims'"          :entity="entity" />
      <RiskTab           v-else-if="tab === 'risk'"            :entity="entity" />
      <TicketsTab        v-else-if="tab === 'tickets'"         :entity="entity" />
    </div>
  </div>
</template>
