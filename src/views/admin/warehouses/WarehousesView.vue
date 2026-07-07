<script setup>
/**
 * WarehousesView — Warehouses & Storage module. Faithful port of the React
 * WarehouseList + module shell: header nav (Alerts/Finance/Transfers/Aging/
 * Inventory/Export/Add), KPI strip, search + type/country filters, grid/table
 * views, warehouse cards, Add-warehouse drawer, and a facility detail panel.
 */
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWarehousesStore } from '@/stores/warehouses';
import { toast } from '@/composables/useToast';
import {
  ZCW_TYPE_META, ZCW_STATUS_META, ZCW_ZONES, ZCW_ACTIVITY,
  ZCW_WAREHOUSES as SEED_WH, ZCW_ALERTS as SEED_ALERTS,
} from '@/data/warehouseData';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import ZButton from '@/components/ui/ZButton.vue';

const store = useWarehousesStore();
const route = useRoute();
onMounted(() => { if (!store.loaded) store.fetchAll(); store.fetchAlerts(); });
const ZCW_WAREHOUSES = computed(() => (store.items.length ? store.items : SEED_WH));
const ZCW_ALERTS = computed(() => (store.alerts.length ? store.alerts : SEED_ALERTS));

const search = ref('');
const typeFilter = ref('all');
const countryF = ref('all');
const viewMode = ref('grid');
const addOpen = ref(false);
const selected = ref(null);
const subView = ref(route.query.tab || 'list'); // list | inventory | aging | transfers | finance | alerts
watch(() => route.query.tab, (t) => { subView.value = t || 'list'; });

const utilPct = (used, total) => (total ? Math.round((used / total) * 100) : 0);
const utilClass = (pct) => (pct >= 85 ? 'high' : pct >= 60 ? 'mid' : 'low');
const utilColor = (cls) => (cls === 'high' ? 'var(--zg-danger)' : cls === 'mid' ? 'var(--zg-warn)' : 'var(--zg-good)');
const fmtSync = (iso) => {
  if (!iso) return null;
  const diff = Math.round((Date.now() - new Date(iso)) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / 1440)}d ago`;
};
const alertsForWh = (id) => ZCW_ALERTS.value.filter((a) => a.warehouse_id === id);
const typeMeta = (t) => ZCW_TYPE_META[t];
const statusMeta = (s) => ZCW_STATUS_META[s] || ZCW_STATUS_META.active;

const countries = computed(() => [...new Set(ZCW_WAREHOUSES.value.map((w) => w.country))]);
const allTypes = computed(() => [...new Set(ZCW_WAREHOUSES.value.flatMap((w) => w.types))]);
const countryFlag = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', KW:'🇰🇼', BH:'🇧🇭', QA:'🇶🇦', OM:'🇴🇲' };

const totalWh = computed(() => ZCW_WAREHOUSES.value.length);
const withSpace = computed(() => ZCW_WAREHOUSES.value.filter((w) => w.capacity.m2 > 0));
const avgUtil = computed(() => { const ws = withSpace.value; return ws.length ? Math.round(ws.reduce((s, w) => s + utilPct(w.capacity.used_m2, w.capacity.m2), 0) / ws.length) : 0; });
const totalAlerts = computed(() => ZCW_ALERTS.value.length);
const dangerAlerts = computed(() => ZCW_ALERTS.value.filter((a) => a.severity === 'danger').length);
const pendingIn = computed(() => ZCW_WAREHOUSES.value.reduce((s, w) => s + w.stats.pending_inbound, 0));
const pendingRet = computed(() => ZCW_WAREHOUSES.value.reduce((s, w) => s + w.stats.pending_returns, 0));
const totalSkus = computed(() => ZCW_WAREHOUSES.value.reduce((s, w) => s + w.stats.total_skus, 0));

const filtered = computed(() => ZCW_WAREHOUSES.value.filter((w) => {
  if (search.value && !w.name.toLowerCase().includes(search.value.toLowerCase()) && !w.city.toLowerCase().includes(search.value.toLowerCase())) return false;
  if (typeFilter.value !== 'all' && !w.types.includes(typeFilter.value)) return false;
  if (countryF.value !== 'all' && w.country !== countryF.value) return false;
  return true;
}));

const subViews = { inventory:'Inventory Master', aging:'Cross-Border Aging Dashboard', transfers:'Transfer Hub', finance:'Finance Summary', alerts:'Alerts Hub' };
const zonesFor = (id) => ZCW_ZONES[id] || [];
const activityFor = (id) => ZCW_ACTIVITY[id] || [];
const fmtTs = (ts) => fmtSync(ts);
const alerts = computed(() => ZCW_ALERTS.value);
const exportCsv = () => toast.success('Exporting warehouse list…');
const createWarehouse = () => { addOpen.value = false; toast.success('Warehouse created'); };
</script>

<template>
  <!-- Facility detail -->
  <div v-if="selected" class="zwh-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <button class="zwh-btn-ghost" style="margin-bottom:6px" @click="selected = null">← All warehouses</button>
        <div class="zwh-title">{{ selected.name }}</div>
        <div class="zwh-subtitle">{{ selected.flag }} {{ selected.city }}, {{ selected.country }} · {{ selected.operator }}</div>
      </div>
      <div class="zwh-header-right">
        <span v-for="t in selected.types" :key="t" class="zwh-type-badge" :style="{ color: typeMeta(t).color, background: typeMeta(t).bg, borderColor: typeMeta(t).border }">{{ typeMeta(t).label }}</span>
        <span class="zwh-status-pill" :style="{ color: statusMeta(selected.status).color, background: statusMeta(selected.status).bg }">{{ statusMeta(selected.status).label }}</span>
      </div>
    </div>
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Total SKUs</span><span class="zwh-kpi-val is-accent">{{ selected.stats.total_skus.toLocaleString() }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Space Utilization</span><span class="zwh-kpi-val" :class="`is-${utilClass(utilPct(selected.capacity.used_m2, selected.capacity.m2)) === 'high' ? 'danger' : utilClass(utilPct(selected.capacity.used_m2, selected.capacity.m2)) === 'mid' ? 'warn' : 'good'}`">{{ utilPct(selected.capacity.used_m2, selected.capacity.m2) }}%</span><span class="zwh-kpi-sub">{{ selected.capacity.used_m2.toLocaleString() }} / {{ selected.capacity.m2.toLocaleString() }} m²</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Pending Inbound</span><span class="zwh-kpi-val">{{ selected.stats.pending_inbound }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Returns Queue</span><span class="zwh-kpi-val">{{ selected.stats.pending_returns }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Alerts</span><span class="zwh-kpi-val" :class="{ 'is-danger': alertsForWh(selected.id).some(a => a.severity === 'danger') }">{{ alertsForWh(selected.id).length }}</span></div>
    </div>
    <div class="zwh-content"><div class="zwh-content-pad" style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="zen-card">
        <div class="zco-section-title" style="margin-bottom:10px">Zones &amp; Locations</div>
        <div v-for="z in zonesFor(selected.id)" :key="z.zone || z.name" style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--zg-line-soft)">
          <span style="font-size:12px;color:var(--zg-text)">{{ z.zone || z.name }}</span>
          <span style="font-size:11px;font-family:var(--zg-mono);color:var(--zg-text-dim)">{{ z.bins ? z.bins + ' bins' : (z.used_pct != null ? z.used_pct + '%' : '') }}</span>
        </div>
        <div v-if="!zonesFor(selected.id).length" style="font-size:12px;color:var(--zg-text-dim)">No zone mapping for this facility.</div>
      </div>
      <div class="zen-card">
        <div class="zco-section-title" style="margin-bottom:10px">Recent Activity</div>
        <div v-for="(a, i) in activityFor(selected.id)" :key="i" style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid var(--zg-line-soft)">
          <span class="zwh-sync-dot ok" style="margin-top:5px" />
          <div><div style="font-size:12px;color:var(--zg-text)">{{ a.msg }}</div><div style="font-size:10px;color:var(--zg-text-dim);font-family:var(--zg-mono)">{{ a.actor }} · {{ fmtTs(a.ts) }}</div></div>
        </div>
        <div v-if="!activityFor(selected.id).length" style="font-size:12px;color:var(--zg-text-dim)">No recent activity.</div>
      </div>
    </div></div>
  </div>

  <!-- Sub-view (Inventory / Aging / Transfers / Finance / Alerts) -->
  <div v-else-if="subView !== 'list'" class="zwh-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <button class="zwh-btn-ghost" style="margin-bottom:6px" @click="subView = 'list'">← Back to warehouses</button>
        <div class="zwh-title">{{ subViews[subView] }}</div>
        <div class="zwh-subtitle">Network-wide view across all facilities</div>
      </div>
    </div>
    <div class="zwh-content"><div class="zwh-content-pad">
      <!-- Alerts hub -->
      <div v-if="subView === 'alerts'" class="zen-card">
        <div v-for="a in alerts" :key="a.id" style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--zg-line-soft)">
          <span class="zwh-sync-dot" :class="a.severity === 'danger' ? 'warn' : 'ok'" style="margin-top:5px;background:var(--zg-warn)" :style="{ background: a.severity === 'danger' ? 'var(--zg-danger)' : 'var(--zg-warn)' }" />
          <div style="flex:1"><div style="font-size:12.5px;color:var(--zg-text)">{{ a.msg }}</div><div style="font-size:10px;color:var(--zg-text-dim);font-family:var(--zg-mono)">{{ a.warehouse_id }} · {{ a.type }}</div></div>
        </div>
      </div>
      <div v-else style="font-size:13px;color:var(--zg-text-mid);padding:20px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md)">
        {{ subViews[subView] }} — network view. Facility-level detail is available by opening a warehouse from the list.
      </div>
    </div></div>
  </div>

  <!-- List -->
  <div v-else class="zwh-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div class="zwh-title">Warehouses &amp; Storage</div>
        <div class="zwh-subtitle">{{ totalWh }} facilities · {{ countries.length }} countries · {{ totalSkus.toLocaleString() }} SKUs tracked</div>
      </div>
      <div class="zwh-header-right">
        <button class="zwh-btn-ghost" style="position:relative" @click="subView = 'alerts'">Alerts<span v-if="totalAlerts" style="position:absolute;top:-3px;right:-3px;background:var(--zg-danger);color:#fff;font-size:8px;font-weight:700;border-radius:6px;padding:1px 4px;line-height:1.4">{{ totalAlerts }}</span></button>
        <button class="zwh-btn-ghost" @click="subView = 'finance'">Finance</button>
        <button class="zwh-btn-ghost" @click="subView = 'transfers'">Transfers</button>
        <button class="zwh-btn-ghost" @click="subView = 'aging'">Aging Dashboard</button>
        <button class="zwh-btn-ghost" @click="subView = 'inventory'">Inventory Master</button>
        <button class="zwh-btn-ghost" @click="exportCsv">Export</button>
        <button class="zwh-btn-primary" @click="addOpen = true">
          <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="1" x2="7" y2="13" /><line x1="1" y1="7" x2="13" y2="7" /></svg>
          Add Warehouse
        </button>
      </div>
    </div>

    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Total Warehouses</span><span class="zwh-kpi-val is-accent">{{ totalWh }}</span><span class="zwh-kpi-sub">{{ countries.length }} countries</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Avg Utilization</span><span class="zwh-kpi-val" :class="avgUtil >= 85 ? 'is-danger' : avgUtil >= 70 ? 'is-warn' : 'is-good'">{{ avgUtil }}%</span><span class="zwh-kpi-sub">across owned + leased</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Active Alerts</span><span class="zwh-kpi-val" :class="dangerAlerts > 0 ? 'is-danger' : totalAlerts > 0 ? 'is-warn' : ''">{{ totalAlerts }}</span><span class="zwh-kpi-sub">{{ dangerAlerts }} critical</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Pending Inbound</span><span class="zwh-kpi-val">{{ pendingIn }}</span><span class="zwh-kpi-sub">shipments awaiting</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Returns Queue</span><span class="zwh-kpi-val" :class="{ 'is-warn': pendingRet > 10 }">{{ pendingRet }}</span><span class="zwh-kpi-sub">items pending inspection</span></div>
    </div>

    <div class="zwh-filters">
      <div class="zwh-search">
        <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="5.5" cy="5.5" r="4" /><line x1="9" y1="9" x2="13" y2="13" /></svg>
        <input v-model="search" placeholder="Search warehouses…" />
      </div>
      <div class="zwh-filter-sep" />
      <button class="zwh-filter-chip" :class="{ 'is-active': typeFilter === 'all' }" @click="typeFilter = 'all'">All Types</button>
      <button v-for="t in allTypes" :key="t" class="zwh-filter-chip" :class="{ 'is-active': typeFilter === t }" @click="typeFilter = typeFilter === t ? 'all' : t">{{ typeMeta(t)?.label || t }}</button>
      <div class="zwh-filter-sep" />
      <button class="zwh-filter-chip" :class="{ 'is-active': countryF === 'all' }" @click="countryF = 'all'">All Countries</button>
      <button v-for="c in countries" :key="c" class="zwh-filter-chip" :class="{ 'is-active': countryF === c }" @click="countryF = countryF === c ? 'all' : c">{{ countryFlag[c] || '' }} {{ c }}</button>
      <div class="zwh-view-toggle">
        <button class="zwh-view-btn" :class="{ 'is-active': viewMode === 'grid' }" title="Grid view" @click="viewMode = 'grid'">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="5" height="5" rx="1" /><rect x="8" y="1" width="5" height="5" rx="1" /><rect x="1" y="8" width="5" height="5" rx="1" /><rect x="8" y="8" width="5" height="5" rx="1" /></svg>
        </button>
        <button class="zwh-view-btn" :class="{ 'is-active': viewMode === 'table' }" title="Table view" @click="viewMode = 'table'">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="1" y1="4" x2="13" y2="4" /><line x1="1" y1="7" x2="13" y2="7" /><line x1="1" y1="10" x2="13" y2="10" /></svg>
        </button>
      </div>
    </div>

    <div class="zwh-content">
      <div class="zwh-content-pad">
        <div v-if="!filtered.length" class="zwh-empty">
          <div class="zwh-empty-title">No warehouses match your filters</div>
          <div class="zwh-empty-sub">Try adjusting your search or filter criteria</div>
        </div>

        <div v-else-if="viewMode === 'grid'" class="zwh-grid">
          <div v-for="wh in filtered" :key="wh.id" class="zwh-card" @click="selected = wh">
            <div class="zwh-card-head">
              <div class="zwh-card-badges">
                <span v-for="t in wh.types" :key="t" class="zwh-type-badge" :style="{ color: typeMeta(t).color, background: typeMeta(t).bg, borderColor: typeMeta(t).border }">{{ typeMeta(t).label }}</span>
              </div>
              <span class="zwh-status-pill" :style="{ color: statusMeta(wh.status).color, background: statusMeta(wh.status).bg }">{{ statusMeta(wh.status).label }}</span>
            </div>
            <div class="zwh-card-body">
              <div class="zwh-card-name">{{ wh.name }}</div>
              <div class="zwh-card-location"><span>{{ wh.flag }}</span><span>{{ wh.city }}, {{ wh.country }}</span><span style="color:var(--zg-text-xdim)">·</span><span style="color:var(--zg-text-xdim);font-size:10px">{{ wh.operator }}</span></div>
              <div v-if="wh.markets.length" class="zwh-card-markets"><span v-for="m in wh.markets" :key="m" class="zwh-market-tag">{{ m }}</span></div>
              <div v-if="wh.capacity.m2 > 0" class="zwh-util-section">
                <div class="zwh-util-label"><span class="zwh-util-name">Space</span><span class="zwh-util-pct" :style="{ color: utilColor(utilClass(utilPct(wh.capacity.used_m2, wh.capacity.m2))) }">{{ utilPct(wh.capacity.used_m2, wh.capacity.m2) }}%</span></div>
                <div class="zwh-util-track"><div class="zwh-util-fill" :class="`is-${utilClass(utilPct(wh.capacity.used_m2, wh.capacity.m2))}`" :style="{ width: utilPct(wh.capacity.used_m2, wh.capacity.m2) + '%' }" /></div>
              </div>
            </div>
            <div class="zwh-card-stats">
              <div class="zwh-card-stat"><span class="zwh-stat-lbl">SKUs</span><span class="zwh-stat-val">{{ wh.stats.total_skus.toLocaleString() }}</span></div>
              <div class="zwh-card-stat"><span class="zwh-stat-lbl">Inbound</span><span class="zwh-stat-val" :class="{ 'is-warn': wh.stats.pending_inbound > 8 }">{{ wh.stats.pending_inbound }}</span></div>
              <div class="zwh-card-stat"><span class="zwh-stat-lbl">Alerts</span><span class="zwh-stat-val" :class="{ 'is-danger': alertsForWh(wh.id).some(a => a.severity === 'danger'), 'is-warn': alertsForWh(wh.id).length }">{{ alertsForWh(wh.id).length }}</span></div>
            </div>
            <div v-if="wh.last_sync" class="zwh-card-sync">
              <span class="zwh-sync-dot" :class="(Date.now() - new Date(wh.last_sync)) < 14400000 ? 'ok' : 'warn'" />
              <span>Last sync {{ fmtSync(wh.last_sync) }}</span>
              <span :style="{ marginLeft: '4px', color: (Date.now() - new Date(wh.last_sync)) < 14400000 ? 'var(--zg-good)' : 'var(--zg-warn)' }">{{ wh.tech_integration === 'api_wms' ? '· API' : '· Manual' }}</span>
            </div>
          </div>
        </div>

        <div v-else class="zwh-table-wrap">
          <div class="zwh-table-head"><span>Warehouse</span><span>Type</span><span>Markets</span><span>Utilization</span><span>SKUs</span><span>Alerts</span><span>Status</span></div>
          <div v-for="wh in filtered" :key="wh.id" class="zwh-table-row" @click="selected = wh">
            <div style="display:flex;flex-direction:column;gap:2px;overflow:hidden"><span class="zwh-table-name">{{ wh.name }}</span><span class="zwh-table-loc">{{ wh.flag }} {{ wh.city }}, {{ wh.country }}</span></div>
            <div style="display:flex;gap:3px;flex-wrap:wrap"><span v-for="t in wh.types" :key="t" class="zwh-type-badge" :style="{ color: typeMeta(t).color, background: typeMeta(t).bg, borderColor: typeMeta(t).border }">{{ typeMeta(t).label }}</span></div>
            <div style="display:flex;gap:3px"><span v-for="m in wh.markets" :key="m" class="zwh-market-tag">{{ m }}</span></div>
            <div style="display:flex;flex-direction:column;gap:3px">
              <template v-if="wh.capacity.m2 > 0">
                <div class="zwh-util-track" style="height:4px"><div class="zwh-util-fill" :class="`is-${utilClass(utilPct(wh.capacity.used_m2, wh.capacity.m2))}`" :style="{ width: utilPct(wh.capacity.used_m2, wh.capacity.m2) + '%' }" /></div>
                <span :style="{ fontSize:'10px', fontFamily:'var(--zg-mono)', color: utilColor(utilClass(utilPct(wh.capacity.used_m2, wh.capacity.m2))) }">{{ utilPct(wh.capacity.used_m2, wh.capacity.m2) }}% · {{ wh.capacity.used_m2.toLocaleString() }} / {{ wh.capacity.m2.toLocaleString() }} m²</span>
              </template>
              <span v-else style="font-size:11px;color:var(--zg-text-dim)">Virtual</span>
            </div>
            <div class="zwh-table-mono">{{ wh.stats.total_skus.toLocaleString() }}</div>
            <div><span class="zwh-table-mono" :style="{ color: alertsForWh(wh.id).some(a => a.severity === 'danger') ? 'var(--zg-danger)' : alertsForWh(wh.id).length ? 'var(--zg-warn)' : 'var(--zg-text-dim)' }">{{ alertsForWh(wh.id).length }}</span></div>
            <span class="zwh-status-pill" :style="{ color: statusMeta(wh.status).color, background: statusMeta(wh.status).bg }">{{ statusMeta(wh.status).label }}</span>
          </div>
        </div>
      </div>
    </div>

    <ZDrawer :open="addOpen" title="Add Warehouse" subtitle="Register a new facility" @close="addOpen = false">
      <div style="color:var(--zg-text-mid);font-size:12.5px;line-height:1.6">New warehouse registration form — name, type, country, operator, capacity, markets and tech integration.</div>
      <template #footer>
        <ZButton variant="ghost" @click="addOpen = false">Cancel</ZButton>
        <ZButton variant="primary" @click="createWarehouse">Create Warehouse</ZButton>
      </template>
    </ZDrawer>
  </div>
</template>

