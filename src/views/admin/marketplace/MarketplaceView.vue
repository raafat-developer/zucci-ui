<script setup>
/**
 * MarketplaceView — Marketplace module shell.
 * Splits into 4 tabs: Listings · Commission Rules · Disputes · Seller Hub
 * Each tab is its own SFC component.
 */
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { LISTINGS_DATA, DISPUTES_DATA, SELLER_HUB } from '@/data/marketplaceData';
import ListingsTab    from './tabs/ListingsTab.vue';
import CommissionsTab from './tabs/CommissionsTab.vue';
import DisputesTab    from './tabs/DisputesTab.vue';
import SellerHubTab   from './tabs/SellerHubTab.vue';

const route = useRoute();
const tab = ref(route.query.tab || 'listings');
watch(() => route.query.tab, t => { if (t) tab.value = t; });

const TABS = [
  ['listings',    'Listings'],
  ['commission',  'Commission Rules'],
  ['disputes',    'Disputes'],
  ['seller',      'Seller Hub'],
];

const pending      = computed(() => LISTINGS_DATA.filter(l => l.status === 'pending').length);
const openDisputes = computed(() => DISPUTES_DATA.filter(d => d.status === 'open').length);
const totalGmv     = computed(() => SELLER_HUB.reduce((s, x) => s + x.gmv, 0).toLocaleString());

const kpis = computed(() => [
  ['Pending Listings',  pending.value,             'is-accent'],
  ['Active Vendors',    SELLER_HUB.length,          ''],
  ['Open Disputes',     openDisputes.value,          'is-warn'],
  ['Total GMV',         totalGmv.value,              'is-good'],
]);
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;min-height:0;">
    <!-- Header -->
    <div class="zwh-header" style="flex-shrink:0;">
      <div class="zwh-header-left">
        <div style="font-size:16px;font-weight:700;color:var(--zg-text);">Marketplace</div>
        <div class="zwh-subtitle">{{ pending }} listing{{ pending !== 1 ? 's' : '' }} pending review · multi-vendor across 7 markets</div>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="zwh-btn-primary" @click="">Invite Vendor</button>
      </div>
    </div>

    <!-- KPI strip -->
    <div class="zwh-kpi-strip" style="flex-shrink:0;">
      <div v-for="[l,v,cls] in kpis" :key="l" class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">{{ l }}</span>
        <span class="zwh-kpi-val" :class="cls">{{ v }}</span>
      </div>
    </div>

    <!-- Tabs -->
    <div style="display:flex;border-bottom:1px solid var(--zg-line);background:var(--zg-bg-elev);flex-shrink:0;padding:0 20px;overflow-x:auto;scrollbar-width:none;">
      <button v-for="[v,l] in TABS" :key="v"
        style="height:40px;padding:0 14px;border:none;background:transparent;font-family:inherit;font-size:12.5px;cursor:pointer;white-space:nowrap;"
        :style="{ color: tab===v?'var(--zg-accent)':'var(--zg-text-dim)', borderBottom: tab===v?'2px solid var(--zg-accent)':'2px solid transparent', marginBottom:'-1px', fontWeight: tab===v?600:400 }"
        @click="tab = v">
        {{ l }}{{ v==='listings' && pending>0 ? ` (${pending})` : '' }}
      </button>
    </div>

    <!-- Tab content -->
    <div style="flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;">
      <ListingsTab    v-if="tab === 'listings'" />
      <CommissionsTab v-else-if="tab === 'commission'" />
      <DisputesTab    v-else-if="tab === 'disputes'" />
      <SellerHubTab   v-else-if="tab === 'seller'" />
    </div>
  </div>
</template>

<style scoped>
.zwh-header { display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--zg-line);flex-wrap:wrap;gap:8px; }
.zwh-header-left { display:flex;flex-direction:column;gap:2px; }
.zwh-subtitle { font-size:11.5px;color:var(--zg-text-dim); }
.zwh-kpi-strip { display:flex;align-items:stretch;border-bottom:1px solid var(--zg-line);background:var(--zg-panel); }
.zwh-kpi-cell { flex:1;padding:8px 16px;border-right:1px solid var(--zg-line);display:flex;flex-direction:column;gap:2px; }
.zwh-kpi-cell:last-child { border-right:none; }
.zwh-kpi-lbl { font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600; }
.zwh-kpi-val { font-family:var(--zg-mono);font-size:18px;font-weight:800;color:var(--zg-text); }
.zwh-kpi-val.is-accent { color:var(--zg-accent); }
.zwh-kpi-val.is-good { color:var(--zg-good); }
.zwh-kpi-val.is-warn { color:var(--zg-warn); }
.zwh-btn-primary { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }
</style>
