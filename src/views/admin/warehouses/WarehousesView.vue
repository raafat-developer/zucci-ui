<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWarehousesStore } from '@/stores/warehouses';
import {
  ZCW_TYPE_META, ZCW_STATUS_META, ZCW_WAREHOUSES as SEED_WH, ZCW_ALERTS as SEED_ALERTS,
} from '@/data/warehouseData';
import WarehouseCard     from './WarehouseCard.vue';
import WarehouseTableRow from './WarehouseTableRow.vue';
import WarehouseDetail   from './WarehouseDetail.vue';
import NewWarehouseDrawer from './drawers/NewWarehouseDrawer.vue';
import InventoryMasterView  from './subviews/InventoryMasterView.vue';
import InboundShipmentsView from './subviews/InboundShipmentsView.vue';
import ReturnsQueueView     from './subviews/ReturnsQueueView.vue';
import AgingDashboardView   from './subviews/AgingDashboardView.vue';
import TransfersHubView     from './subviews/TransfersHubView.vue';
import FinanceSummaryView   from './subviews/FinanceSummaryView.vue';

const store    = useWarehousesStore();
const route    = useRoute();
onMounted(() => { if (!store.loaded) { store.fetchAll(); store.fetchAlerts(); } });

const warehouses = computed(() => store.items.length ? store.items : SEED_WH);
const alerts     = computed(() => store.alerts.length ? store.alerts : SEED_ALERTS);

// ── UI state ──────────────────────────────────────────────
const selected  = ref(null);
const view      = ref(route.query.tab || 'list');
watch(() => route.query.tab, t => { if (t) { view.value = t; selected.value = null; } });
const viewMode  = ref('grid');
const search    = ref('');
const typeF     = ref('all');
const countryF  = ref('all');
const addOpen   = ref(false);

// ── KPI aggregates ─────────────────────────────────────────
const utilPct   = (u, t) => t ? Math.round((u/t)*100) : 0;
const withM2    = computed(() => warehouses.value.filter(w => w.capacity.m2 > 0));
const avgUtil   = computed(() => withM2.value.length ? Math.round(withM2.value.reduce((s,w) => s + utilPct(w.capacity.used_m2, w.capacity.m2), 0) / withM2.value.length) : 0);
const totalAlerts  = computed(() => alerts.value.length);
const dangerAlerts = computed(() => alerts.value.filter(a => a.severity === 'danger').length);
const pendingIn    = computed(() => warehouses.value.reduce((s,w) => s + w.stats.pending_inbound, 0));
const pendingRet   = computed(() => warehouses.value.reduce((s,w) => s + w.stats.pending_returns, 0));
const totalSKUs    = computed(() => warehouses.value.reduce((s,w) => s + w.stats.total_skus, 0));
const countries    = computed(() => [...new Set(warehouses.value.map(w => w.country))]);
const allTypes     = computed(() => [...new Set(warehouses.value.flatMap(w => w.types))]);

// ── Filters ────────────────────────────────────────────────
const filtered = computed(() => warehouses.value.filter(w => {
  if (search.value && !w.name.toLowerCase().includes(search.value.toLowerCase()) &&
      !w.city.toLowerCase().includes(search.value.toLowerCase())) return false;
  if (typeF.value !== 'all' && !w.types.includes(typeF.value)) return false;
  if (countryF.value !== 'all' && w.country !== countryF.value) return false;
  return true;
}));

const COUNTRY_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', KW:'🇰🇼', BH:'🇧🇭', QA:'🇶🇦', OM:'🇴🇲' };

// ── Actions ────────────────────────────────────────────────
function exportCSV() {
  const rows = [
    ['ID','Name','Types','Country','City','Status','Util%','SKUs','Pending Inbound','Alerts'],
    ...warehouses.value.map(w => [
      w.id, w.name, w.types.join('+'), w.country, w.city, w.status,
      utilPct(w.capacity.used_m2, w.capacity.m2), w.stats.total_skus, w.stats.pending_inbound,
      alerts.value.filter(a => a.warehouse_id === w.id).length,
    ]),
  ];
  const b = new Blob([rows.map(r => r.join(',')).join('\n')], { type:'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'warehouses.csv'; a.click();
}
</script>

<template>
  <!-- Detail view -->
  <WarehouseDetail v-if="selected" :wh="selected" @back="selected = null" />

  <!-- Sub-views (sidebar deep links) -->
  <InventoryMasterView  v-else-if="view === 'inventory'"  @back="view = 'list'" />
  <InboundShipmentsView v-else-if="view === 'inbound'"    @back="view = 'list'" />
  <ReturnsQueueView     v-else-if="view === 'alerts'"     @back="view = 'list'" />
  <AgingDashboardView   v-else-if="view === 'aging'"      @back="view = 'list'" />
  <TransfersHubView     v-else-if="view === 'transfers'"  @back="view = 'list'" />
  <FinanceSummaryView   v-else-if="view === 'finance'"    @back="view = 'list'" />

  <!-- List view -->
  <div v-else class="zwh-wrap">
    <!-- Header -->
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div class="zwh-title">Warehouses &amp; Storage</div>
        <div class="zwh-subtitle">{{ warehouses.length }} facilities · {{ countries.length }} countries · {{ totalSKUs.toLocaleString() }} SKUs tracked</div>
      </div>
      <div class="zwh-header-right">
        <button class="zwh-btn-ghost" style="position:relative;" @click="view = 'transfers'">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 1A5 5 0 012 6v2l-1 2h10l-1-2V6A5 5 0 017 1zM5.5 10a1.5 1.5 0 003 0"/></svg>
          Alerts
          <span v-if="totalAlerts > 0" style="position:absolute;top:-3px;right:-3px;background:var(--zg-danger);color:#fff;font-size:8px;font-weight:700;border-radius:6px;padding:1px 4px;line-height:1.4;">{{ totalAlerts }}</span>
        </button>
        <button class="zwh-btn-ghost" @click="view = 'alerts'">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 10C2 6 5 4 7 4C9 4 12 6 12 10"/><line x1="7" y1="1" x2="7" y2="4"/><line x1="4" y1="12" x2="10" y2="12"/></svg>
          Finance
        </button>
        <button class="zwh-btn-ghost" @click="view = 'aging'">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 4h10M2 10h10M10 2l2 2-2 2M4 8l-2 2 2 2"/></svg>
          Transfers
        </button>
        <button class="zwh-btn-ghost" @click="view = 'inventory'">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="5"/><line x1="7" y1="4" x2="7" y2="7"/><line x1="7" y1="7" x2="9.5" y2="7"/></svg>
          Aging
        </button>
        <button class="zwh-btn-ghost" @click="">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="1" width="10" height="12" rx="1"/><line x1="5" y1="4" x2="9" y2="4"/><line x1="5" y1="7" x2="9" y2="7"/><line x1="5" y1="10" x2="7" y2="10"/></svg>
          Inventory
        </button>
        <button class="zwh-btn-ghost" @click="exportCSV">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 1v8M4 6l3 3 3-3M2 11h10"/></svg>
          Export
        </button>
        <button class="zwh-btn-primary" @click="addOpen = true">
          <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
          Add Warehouse
        </button>
      </div>
    </div>

    <!-- KPI strip -->
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Total Warehouses</span>
        <span class="zwh-kpi-val is-accent">{{ warehouses.length }}</span>
        <span class="zwh-kpi-sub">{{ countries.length }} countries</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Avg Utilization</span>
        <span class="zwh-kpi-val" :class="avgUtil >= 85 ? 'is-danger' : avgUtil >= 70 ? 'is-warn' : 'is-good'">{{ avgUtil }}%</span>
        <span class="zwh-kpi-sub">across owned + leased</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Active Alerts</span>
        <span class="zwh-kpi-val" :class="dangerAlerts > 0 ? 'is-danger' : totalAlerts > 0 ? 'is-warn' : ''">{{ totalAlerts }}</span>
        <span class="zwh-kpi-sub">{{ dangerAlerts }} critical</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Pending Inbound</span>
        <span class="zwh-kpi-val">{{ pendingIn }}</span>
        <span class="zwh-kpi-sub">shipments awaiting</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Returns Queue</span>
        <span class="zwh-kpi-val" :class="{ 'is-warn': pendingRet > 10 }">{{ pendingRet }}</span>
        <span class="zwh-kpi-sub">items pending inspection</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="zwh-filters">
      <div class="zwh-search">
        <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <circle cx="5.5" cy="5.5" r="4"/><line x1="9" y1="9" x2="13" y2="13"/>
        </svg>
        <input v-model="search" placeholder="Search warehouses…" />
      </div>
      <div class="zwh-filter-sep" />
      <button class="zwh-filter-chip" :class="{ 'is-active': typeF === 'all' }" @click="typeF = 'all'">All Types</button>
      <button v-for="t in allTypes" :key="t" class="zwh-filter-chip" :class="{ 'is-active': typeF === t }" @click="typeF = typeF === t ? 'all' : t">{{ ZCW_TYPE_META[t]?.label || t }}</button>
      <div class="zwh-filter-sep" />
      <button class="zwh-filter-chip" :class="{ 'is-active': countryF === 'all' }" @click="countryF = 'all'">All Countries</button>
      <button v-for="c in countries" :key="c" class="zwh-filter-chip" :class="{ 'is-active': countryF === c }" @click="countryF = countryF === c ? 'all' : c">{{ COUNTRY_FLAGS[c] || '' }} {{ c }}</button>
      <div class="zwh-view-toggle">
        <button class="zwh-view-btn" :class="{ 'is-active': viewMode === 'grid' }" @click="viewMode = 'grid'" title="Grid">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg>
        </button>
        <button class="zwh-view-btn" :class="{ 'is-active': viewMode === 'table' }" @click="viewMode = 'table'" title="Table">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="1" y1="4" x2="13" y2="4"/><line x1="1" y1="7" x2="13" y2="7"/><line x1="1" y1="10" x2="13" y2="10"/></svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="zwh-content">
      <div class="zwh-content-pad">
        <!-- Empty -->
        <div v-if="!filtered.length" class="zwh-empty">
          <svg class="zwh-empty-icon" viewBox="0 0 48 48" width="36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 18L24 8L42 18V40H6Z M14 40V28H34V40"/></svg>
          <div class="zwh-empty-title">No warehouses match your filters</div>
          <div class="zwh-empty-sub">Try adjusting your search or filter criteria</div>
        </div>

        <!-- Grid -->
        <div v-else-if="viewMode === 'grid'" class="zwh-grid">
          <WarehouseCard v-for="wh in filtered" :key="wh.id" :wh="wh" @click="selected = wh" />
        </div>

        <!-- Table -->
        <div v-else class="zwh-table-wrap">
          <div class="zwh-table-head">
            <span>Warehouse</span><span>Type</span><span>Markets</span><span>Utilization</span><span>SKUs</span><span>Alerts</span><span>Status</span>
          </div>
          <WarehouseTableRow v-for="wh in filtered" :key="wh.id" :wh="wh" @click="selected = wh" />
        </div>
      </div>
    </div>

    <!-- New Warehouse Drawer -->
    <NewWarehouseDrawer v-if="addOpen" @close="addOpen = false" @save="wh => warehouses.push(wh)" />
  </div>
</template>
