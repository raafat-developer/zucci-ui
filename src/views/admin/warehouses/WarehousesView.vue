<script setup>
/**
 * WarehousesView — Warehouses & Storage module shell.
 * Routes between: list view (WarehouseCard / WarehouseTableRow) ↔ WarehouseDetail.
 * Global sub-views (Inventory Master, Aging, Transfers, Finance, Alerts) are
 * handled via ?tab= route query on this view.
 */
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWarehousesStore } from '@/stores/warehouses';
import {
  ZCW_TYPE_META, ZCW_STATUS_META, ZCW_ALERTS as SEED_ALERTS,
  ZCW_WAREHOUSES as SEED_WH,
} from '@/data/warehouseData';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import WarehouseCard     from './WarehouseCard.vue';
import WarehouseTableRow from './WarehouseTableRow.vue';
import WarehouseDetail   from './WarehouseDetail.vue';

const store = useWarehousesStore();
const route = useRoute();
onMounted(() => { if (!store.loaded) store.fetchAll(); store.fetchAlerts(); });

const warehouses = computed(() => store.items.length ? store.items : SEED_WH);
const alerts     = computed(() => store.alerts.length ? store.alerts : SEED_ALERTS);

// ── UI state ──────────────────────────────────────────────
const search     = ref('');
const typeFilter = ref('all');
const countryF   = ref('all');
const viewMode   = ref('grid');
const addOpen    = ref(false);
const selected   = ref(null); // warehouse being viewed in detail

// New warehouse form
const newWh = ref({ name:'', types:[], status:'active', country:'', city:'', operator:'' });

// ── Helpers ───────────────────────────────────────────────
const utilPct  = (used, total) => total ? Math.round((used / total) * 100) : 0;
const typeMeta = (t) => ZCW_TYPE_META[t] || {};

const countries = computed(() => [...new Set(warehouses.value.map(w => w.country))]);
const allTypes  = computed(() => [...new Set(warehouses.value.flatMap(w => w.types))]);

// ── KPI aggregate ─────────────────────────────────────────
const totalWh    = computed(() => warehouses.value.length);
const withSpace  = computed(() => warehouses.value.filter(w => w.capacity.m2 > 0));
const avgUtil    = computed(() => {
  const ws = withSpace.value;
  return ws.length ? Math.round(ws.reduce((s, w) => s + utilPct(w.capacity.used_m2, w.capacity.m2), 0) / ws.length) : 0;
});
const totalAlerts  = computed(() => alerts.value.length);
const dangerAlerts = computed(() => alerts.value.filter(a => a.severity === 'danger').length);
const pendingIn    = computed(() => warehouses.value.reduce((s, w) => s + w.stats.pending_inbound, 0));
const pendingRet   = computed(() => warehouses.value.reduce((s, w) => s + w.stats.pending_returns, 0));
const totalSkus    = computed(() => warehouses.value.reduce((s, w) => s + w.stats.total_skus, 0));

// ── Filtered list ─────────────────────────────────────────
const filtered = computed(() => warehouses.value.filter(w => {
  if (search.value && !w.name.toLowerCase().includes(search.value.toLowerCase()) && !w.city.toLowerCase().includes(search.value.toLowerCase())) return false;
  if (typeFilter.value !== 'all' && !w.types.includes(typeFilter.value)) return false;
  if (countryF.value !== 'all' && w.country !== countryF.value) return false;
  return true;
}));

function createWarehouse() {
  addOpen.value = false;
}

function exportCsv() {
  const rows = [
    ['ID','Name','Types','Country','City','Status','SKUs','Alerts'],
    ...warehouses.value.map(w => [w.id, w.name, w.types.join(';'), w.country, w.city, w.status, w.stats.total_skus, alerts.value.filter(a=>a.warehouse_id===w.id).length]),
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const b = new Blob([csv], { type:'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'warehouses.csv'; a.click();
}
</script>

<template>
  <!-- ── DETAIL VIEW ──────────────────────────────────────── -->
  <WarehouseDetail v-if="selected" :wh="selected" @back="selected = null" />

  <!-- ── LIST VIEW ────────────────────────────────────────── -->
  <div v-else class="zwh-wrap">
    <!-- Header -->
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div class="zwh-title">Warehouses &amp; Storage</div>
        <div class="zwh-subtitle">{{ totalWh }} facilities · {{ totalSkus.toLocaleString() }} SKUs · {{ avgUtil }}% avg utilization</div>
      </div>
      <div class="zwh-header-right">
        <button class="zwh-btn-ghost" @click="exportCsv">Export</button>
        <button class="zwh-btn-primary" @click="addOpen = true">+ Add Warehouse</button>
      </div>
    </div>

    <!-- KPI strip -->
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Total Warehouses</span><span class="zwh-kpi-val">{{ totalWh }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Avg Utilization</span><span class="zwh-kpi-val" :class="avgUtil >= 85 ? 'is-danger' : avgUtil >= 60 ? 'is-warn' : 'is-good'">{{ avgUtil }}%</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Total SKUs</span><span class="zwh-kpi-val is-accent">{{ totalSkus.toLocaleString() }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Pending Inbound</span><span class="zwh-kpi-val" :class="{ 'is-warn': pendingIn > 10 }">{{ pendingIn }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Returns Queue</span><span class="zwh-kpi-val" :class="{ 'is-warn': pendingRet > 5 }">{{ pendingRet }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Active Alerts</span><span class="zwh-kpi-val" :class="dangerAlerts > 0 ? 'is-danger' : totalAlerts > 0 ? 'is-warn' : ''">{{ totalAlerts }}</span></div>
    </div>

    <!-- Toolbar: search + filters + view toggle -->
    <div class="zwh-toolbar">
      <div class="zwh-search">
        <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round">
          <circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/>
        </svg>
        <input v-model="search" placeholder="Search warehouses…" />
      </div>

      <!-- Type filters -->
      <button class="zwh-filter-chip" :class="{ 'is-active': typeFilter === 'all' }" @click="typeFilter = 'all'">All Types</button>
      <button v-for="t in allTypes" :key="t" class="zwh-filter-chip" :class="{ 'is-active': typeFilter === t }" @click="typeFilter = t"
        :style="typeFilter === t ? { borderColor: typeMeta(t).color, color: typeMeta(t).color } : {}">
        {{ typeMeta(t).label || t }}
      </button>

      <!-- Country filters -->
      <div style="width:1px;height:20px;background:var(--zg-line);flex-shrink:0;" />
      <button class="zwh-filter-chip" :class="{ 'is-active': countryF === 'all' }" @click="countryF = 'all'">All</button>
      <button v-for="c in countries" :key="c" class="zwh-filter-chip" :class="{ 'is-active': countryF === c }" @click="countryF = c">{{ c }}</button>

      <!-- View toggle -->
      <div style="margin-left:auto;display:flex;gap:4px;">
        <button class="zwh-view-btn" :class="{ 'is-active': viewMode === 'grid' }" @click="viewMode = 'grid'" title="Grid view">
          <svg viewBox="0 0 12 12" width="12" fill="currentColor"><rect x="0" y="0" width="5" height="5" rx="1"/><rect x="7" y="0" width="5" height="5" rx="1"/><rect x="0" y="7" width="5" height="5" rx="1"/><rect x="7" y="7" width="5" height="5" rx="1"/></svg>
        </button>
        <button class="zwh-view-btn" :class="{ 'is-active': viewMode === 'table' }" @click="viewMode = 'table'" title="Table view">
          <svg viewBox="0 0 12 12" width="12" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="2" x2="12" y2="2"/><line x1="0" y1="6" x2="12" y2="6"/><line x1="0" y1="10" x2="12" y2="10"/></svg>
        </button>
      </div>
    </div>

    <!-- Content: grid or table -->
    <div class="zwh-content">
      <!-- Empty state -->
      <div v-if="!filtered.length" class="zwh-empty">
        <div class="zwh-empty-title">No warehouses found</div>
        <div class="zwh-empty-sub">Try adjusting your filters.</div>
      </div>

      <!-- Grid -->
      <div v-else-if="viewMode === 'grid'" class="zwh-grid">
        <WarehouseCard
          v-for="wh in filtered" :key="wh.id"
          :wh="wh"
          @click="selected = wh"
        />
      </div>

      <!-- Table -->
      <div v-else class="zwh-table-wrap">
        <div class="zwh-table-head">
          <span>Warehouse</span><span>Types</span><span>Markets</span><span>Utilization</span><span>SKUs</span><span>Alerts</span><span>Status</span>
        </div>
        <WarehouseTableRow
          v-for="wh in filtered" :key="wh.id"
          :wh="wh"
          @click="selected = wh"
        />
      </div>
    </div>

    <!-- Add Warehouse Drawer -->
    <ZDrawer :open="addOpen" title="New Warehouse" subtitle="Add a new facility to the network" @close="addOpen = false">
      <template #footer>
        <button class="zwh-btn-ghost" @click="addOpen = false">Cancel</button>
        <button class="zwh-btn-primary" @click="createWarehouse">Create Warehouse</button>
      </template>
      <div style="display:flex;flex-direction:column;gap:12px;padding:4px 0;">
        <div class="zwh-field">
          <label class="zwh-field-label">Warehouse Name <span style="color:var(--zg-danger);">*</span></label>
          <input class="zwh-field-input" v-model="newWh.name" placeholder="e.g. Zucci Cairo Hub" />
        </div>
        <div class="zwh-field">
          <label class="zwh-field-label">Country</label>
          <select class="zwh-field-input" v-model="newWh.country">
            <option value="">Select country…</option>
            <option v-for="c in ['AE','SA','EG','KW','BH','QA','OM']" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="zwh-field">
          <label class="zwh-field-label">City</label>
          <input class="zwh-field-input" v-model="newWh.city" placeholder="e.g. Dubai" />
        </div>
        <div class="zwh-field">
          <label class="zwh-field-label">Operator / 3PL</label>
          <input class="zwh-field-input" v-model="newWh.operator" placeholder="e.g. Aramex Fulfillment" />
        </div>
        <div class="zwh-field">
          <label class="zwh-field-label">Status</label>
          <select class="zwh-field-input" v-model="newWh.status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>
    </ZDrawer>
  </div>

<style scoped>
.zwh-toolbar {
  display: flex; align-items: center; gap: 6px; padding: 8px 16px;
  border-bottom: 1px solid var(--zg-line); flex-shrink: 0; flex-wrap: wrap;
}
.zwh-search {
  position: relative; display: flex; align-items: center;
  background: var(--zg-panel); border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md); padding: 0 8px; gap: 6px; height: 28px; flex: 0 0 220px;
}
.zwh-search input {
  border: none; background: transparent; font-size: 12px; color: var(--zg-text);
  outline: none; width: 100%;
}
.zwh-filter-chip {
  height: 26px; padding: 0 10px; border: 1px solid var(--zg-line); border-radius: 3px;
  background: transparent; cursor: pointer; font-size: 11px; color: var(--zg-text-dim); white-space: nowrap;
}
.zwh-filter-chip.is-active { background: var(--zg-panel-hi); color: var(--zg-text); border-color: var(--zg-accent); }
.zwh-view-btn {
  width: 28px; height: 28px; border: 1px solid var(--zg-line); border-radius: 3px;
  background: transparent; cursor: pointer; color: var(--zg-text-dim);
  display: flex; align-items: center; justify-content: center;
}
.zwh-view-btn.is-active { background: var(--zg-panel-hi); color: var(--zg-text); border-color: var(--zg-accent); }

.zwh-content { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }
.zwh-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; padding: 16px; }

.zwh-table-wrap { padding: 0; }
.zwh-table-head {
  display: grid; grid-template-columns: 1fr 160px 120px 200px 80px 60px 90px;
  padding: 0 16px; height: 30px; background: var(--zg-panel-hi);
  border-bottom: 1px solid var(--zg-line); font-size: 9.5px;
  text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim);
  font-weight: 600; align-items: center; gap: 10px;
}
</style>
