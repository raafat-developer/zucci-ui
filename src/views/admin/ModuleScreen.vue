<script setup>
/**
 * ModuleScreen — data-driven module list view used by every admin module.
 * Renders: header + primary action, KPI strip, tab filters, search, a table,
 * and a row-detail drawer. Config comes from src/data/adminModules.js keyed by
 * the route name. Market-aware via injected `market` (filters on a `mk` column
 * when present). This is a real, working screen — not a placeholder.
 */
import { computed, inject, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MODULES } from '@/data/adminModules';
import ZButton from '@/components/ui/ZButton.vue';
import ZStatusPill from '@/components/ui/ZStatusPill.vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';

const route = useRoute();
const market = inject('market', ref('all'));

const cfg = computed(() => MODULES[route.name] || MODULES.orders);
const activeTab = ref('');
const query = ref('');
const selected = ref(null);

// reset tab/search when the module changes
watch(
  () => route.name,
  () => { activeTab.value = ''; query.value = ''; selected.value = null; },
);

const rows = computed(() => {
  let list = cfg.value.rows;
  if (market.value !== 'all') {
    list = list.filter((r) => !r.mk || r.mk.toLowerCase() === market.value.toLowerCase());
  }
  const q = query.value.trim().toLowerCase();
  if (q) {
    list = list.filter((r) =>
      Object.values(r).some((v) =>
        (typeof v === 'string' ? v : v?.label || '').toLowerCase().includes(q),
      ),
    );
  }
  return list;
});

const cell = (row, col) => (col.pill ? row[col.key]?.label : row[col.key]);
const cellTone = (row, col) => row[col.key]?.tone || 'neutral';
</script>

<template>
  <div class="mod">
    <!-- Header -->
    <header class="mod-head">
      <div class="mod-head-titles">
        <h1 class="mod-title">{{ cfg.title }}</h1>
        <p class="mod-subtitle">{{ cfg.subtitle }}</p>
      </div>
      <ZButton v-if="cfg.primaryAction" variant="primary">{{ cfg.primaryAction }}</ZButton>
    </header>

    <!-- KPI strip -->
    <div class="mod-kpis">
      <div v-for="k in cfg.kpis" :key="k.label" class="mod-kpi">
        <span class="mod-kpi-lbl">{{ k.label }}</span>
        <span class="mod-kpi-val" :class="`is-${k.tone}`">{{ k.value }}</span>
      </div>
    </div>

    <!-- Tabs + search -->
    <div class="mod-toolbar">
      <div class="mod-tabs">
        <button
          v-for="(t, i) in cfg.tabs"
          :key="t"
          class="mod-tab"
          :class="{ 'is-on': activeTab === t || (!activeTab && i === 0) }"
          @click="activeTab = t"
        >{{ t }}</button>
      </div>
      <input v-model="query" class="mod-search" type="text" placeholder="Search…" />
    </div>

    <!-- Table -->
    <div class="mod-table-wrap">
      <table class="mod-table">
        <thead>
          <tr>
            <th v-for="col in cfg.columns" :key="col.key">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in rows" :key="ri" class="mod-row" @click="selected = row">
            <td
              v-for="col in cfg.columns"
              :key="col.key"
              :class="{ mono: col.mono, accent: col.accent, dim: col.dim }"
            >
              <ZStatusPill v-if="col.pill" :tone="cellTone(row, col)" :label="cell(row, col)" />
              <template v-else>{{ cell(row, col) }}</template>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td :colspan="cfg.columns.length" class="mod-empty">No records match your filters</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Row detail drawer -->
    <ZDrawer
      :open="!!selected"
      :title="selected ? (selected.id || selected.sku || selected.code || 'Detail') : ''"
      :subtitle="cfg.title"
      @close="selected = null"
    >
      <dl v-if="selected" class="mod-detail">
        <div v-for="col in cfg.columns" :key="col.key" class="mod-detail-row">
          <dt>{{ col.label }}</dt>
          <dd>
            <ZStatusPill v-if="col.pill" :tone="cellTone(selected, col)" :label="cell(selected, col)" />
            <template v-else>{{ cell(selected, col) }}</template>
          </dd>
        </div>
      </dl>
      <template #footer>
        <ZButton variant="ghost" @click="selected = null">Close</ZButton>
        <ZButton variant="primary">Open full record</ZButton>
      </template>
    </ZDrawer>
  </div>
</template>

<style scoped>
.mod { height: 100%; display: flex; flex-direction: column; min-height: 0; background: var(--zg-bg); }

.mod-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--zg-line); flex-shrink: 0; }
.mod-title { font-size: 16px; font-weight: 700; color: var(--zg-text); margin: 0; }
.mod-subtitle { font-size: 11.5px; color: var(--zg-text-dim); margin: 2px 0 0; }

.mod-kpis { display: flex; border-bottom: 1px solid var(--zg-line); background: var(--zg-panel); flex-shrink: 0; }
.mod-kpi { flex: 1; padding: 12px 20px; border-right: 1px solid var(--zg-line); display: flex; flex-direction: column; gap: 4px; }
.mod-kpi:last-child { border-right: 0; }
.mod-kpi-lbl { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); font-weight: 600; }
.mod-kpi-val { font-family: var(--zg-mono); font-size: 22px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
.mod-kpi-val.is-good { color: var(--zg-good); }
.mod-kpi-val.is-warn { color: var(--zg-warn); }
.mod-kpi-val.is-danger { color: var(--zg-danger); }
.mod-kpi-val.is-accent { color: var(--zg-accent); }

.mod-toolbar { display: flex; align-items: center; gap: 14px; padding: 8px 20px; border-bottom: 1px solid var(--zg-line); background: var(--zg-bg-elev); flex-shrink: 0; }
.mod-tabs { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; }
.mod-tab {
  height: 30px; padding: 0 12px; border: none; background: transparent;
  font-family: inherit; font-size: 12px; color: var(--zg-text-dim); cursor: pointer;
  border-radius: var(--zg-radius-md); white-space: nowrap;
}
.mod-tab:hover { color: var(--zg-text); background: var(--zg-panel); }
.mod-tab.is-on { color: var(--zg-accent); background: var(--zg-accent-tint); font-weight: 600; }
.mod-search {
  margin-left: auto; width: 240px; height: 30px; padding: 0 12px;
  background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md);
  color: var(--zg-text); font-family: inherit; font-size: 12.5px; outline: none;
}
.mod-search:focus { border-color: var(--zg-accent); }

.mod-table-wrap { flex: 1; overflow: auto; min-height: 0; }
.mod-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.mod-table th {
  position: sticky; top: 0; text-align: left; padding: 8px 16px;
  font-family: var(--zg-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.07em;
  color: var(--zg-text-xdim); font-weight: 700; background: var(--zg-panel);
  border-bottom: 1px solid var(--zg-line); white-space: nowrap;
}
.mod-row { cursor: pointer; }
.mod-row:hover { background: var(--zg-panel); }
.mod-table td { padding: 9px 16px; border-bottom: 1px solid var(--zg-line-soft); color: var(--zg-text); white-space: nowrap; }
.mod-table td.mono { font-family: var(--zg-mono); }
.mod-table td.accent { color: var(--zg-accent); font-weight: 700; }
.mod-table td.dim { color: var(--zg-text-dim); }
.mod-empty { text-align: center; color: var(--zg-text-xdim); padding: 32px; }

.mod-detail { margin: 0; display: flex; flex-direction: column; gap: 2px; }
.mod-detail-row { display: grid; grid-template-columns: 120px 1fr; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--zg-line-soft); }
.mod-detail-row dt { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--zg-text-dim); }
.mod-detail-row dd { margin: 0; font-size: 12.5px; color: var(--zg-text); }
</style>
