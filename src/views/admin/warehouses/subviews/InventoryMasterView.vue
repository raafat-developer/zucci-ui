<script setup>
/**
 * InventoryMasterView — cross-warehouse inventory view.
 * All SKUs across all warehouses, searchable + filterable.
 */
import { ref, computed } from 'vue';
import { ZCW_INVENTORY_ALL, ZCW_WAREHOUSES } from '@/data/warehouseData';

const emit = defineEmits(['back']);
const search   = ref('');
const whFilter = ref('all');
const ownFilter = ref('all');

const AGING_COLOR = { D0:'var(--zg-good)', 'D0-D30':'var(--zg-good)', 'D30-D60':'oklch(0.82 0.14 215)', 'D60-D90':'var(--zg-warn)', 'D90-D120':'var(--zg-danger)', 'D120+':'var(--zg-danger)', 'D120-D180':'var(--zg-danger)', 'D180+':'var(--zg-danger)' };

const inv = computed(() => {
  let rows = ZCW_INVENTORY_ALL || [];
  if (whFilter.value !== 'all') rows = rows.filter(i => i.warehouse_id === whFilter.value);
  if (ownFilter.value !== 'all') rows = rows.filter(i => i.ownership === ownFilter.value);
  if (search.value) {
    const q = search.value.toLowerCase();
    rows = rows.filter(i => i.sku?.toLowerCase().includes(q) || i.name?.toLowerCase().includes(q) || i.vendor?.toLowerCase().includes(q));
  }
  return rows;
});

const totalUnits = computed(() => inv.value.reduce((s,i) => s+i.qty, 0));
const totalCost  = computed(() => inv.value.reduce((s,i) => s+(i.daily_cost||0), 0));
const whs        = computed(() => ZCW_WAREHOUSES);

function exportCSV() {
  const h = ['SKU','Product','Vendor','Warehouse','Ownership','Qty','Bin','Age','Daily Cost'];
  const r = inv.value.map(i => [i.sku,i.name,i.vendor,i.warehouse_id,i.ownership,i.qty,i.bin,i.age,i.daily_cost]);
  const b = new Blob([[h,...r].map(r=>r.join(',')).join('\n')],{type:'text/csv'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(b); a.download='inventory.csv'; a.click();
}
</script>

<template>
  <div class="zwh-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <button class="zwh-bc-back" @click="emit('back')">
          <svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14"/></svg>
          Warehouses
        </button>
        <div class="zwh-title" style="margin-left:10px;">Inventory Master</div>
        <div class="zwh-subtitle">{{ inv.length }} SKUs · {{ totalUnits.toLocaleString() }} units <span v-if="totalCost > 0" style="color:var(--zg-warn);"> · AED {{ totalCost.toFixed(2) }}/day accruing</span></div>
      </div>
      <div class="zwh-header-right">
        <button class="zwh-btn-ghost" @click="exportCSV">Export CSV</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="zwh-filters">
      <div class="zwh-search">
        <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="5.5" cy="5.5" r="4"/><line x1="9" y1="9" x2="13" y2="13"/></svg>
        <input v-model="search" placeholder="Search SKU, product, vendor…" />
      </div>
      <div class="zwh-filter-sep" />
      <select class="zwh-filter-chip" v-model="whFilter" style="height:28px;padding:0 8px;background:transparent;border:1px solid var(--zg-line);border-radius:3px;color:var(--zg-text-dim);cursor:pointer;font-size:11px;">
        <option value="all">All Warehouses</option>
        <option v-for="w in whs" :key="w.id" :value="w.id">{{ w.flag }} {{ w.name }}</option>
      </select>
      <select class="zwh-filter-chip" v-model="ownFilter" style="height:28px;padding:0 8px;background:transparent;border:1px solid var(--zg-line);border-radius:3px;color:var(--zg-text-dim);cursor:pointer;font-size:11px;">
        <option value="all">All Ownership</option>
        <option value="owned">Zucci-Owned</option>
        <option value="consignment">Consignment</option>
        <option value="dropship">Dropship</option>
      </select>
    </div>

    <!-- Table -->
    <div class="zwh-content">
      <div class="zwh-content-pad">
        <div class="zwh-list-table">
          <div class="zwh-list-head">
            <span class="zwh-col" style="flex:1.2;">SKU / Product</span>
            <span class="zwh-col w120">Vendor</span>
            <span class="zwh-col w140">Warehouse</span>
            <span class="zwh-col w110">Ownership</span>
            <span class="zwh-col w60 right">Qty</span>
            <span class="zwh-col w70">Bin</span>
            <span class="zwh-col w60 right">Age (d)</span>
            <span class="zwh-col w80">Aging</span>
            <span class="zwh-col w60 right">Daily</span>
          </div>
          <div v-for="(item, i) in inv" :key="i" class="zwh-list-row">
            <div class="zwh-col" style="flex:1.2;display:flex;flex-direction:column;gap:2px;overflow:hidden;">
              <span style="font-weight:600;font-size:12px;color:var(--zg-text);font-family:var(--zg-mono);">{{ item.sku }}</span>
              <span style="font-size:11px;color:var(--zg-text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ item.name }}</span>
            </div>
            <span class="zwh-col w120 zwh-dim" style="font-size:11.5px;">{{ item.vendor }}</span>
            <span class="zwh-col w140" style="font-size:11px;color:var(--zg-text-dim);">{{ item.warehouse_id }}</span>
            <span class="zwh-col w110">
              <span style="display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:3px;font-size:9.5px;font-weight:600;"
                :style="{ color:item.ownership==='owned'?'oklch(0.82 0.14 215)':item.ownership==='consignment'?'var(--zg-warn)':'var(--zg-text-dim)', background:item.ownership==='owned'?'oklch(0.82 0.14 215 / 0.1)':item.ownership==='consignment'?'oklch(0.82 0.15 75 / 0.1)':'var(--zg-panel-hi)' }">
                {{ item.ownership === 'owned' ? 'Zucci-Owned' : item.ownership === 'consignment' ? 'Consignment' : item.ownership || '—' }}
              </span>
            </span>
            <span class="zwh-col w60 right zwh-mono" style="font-weight:600;">{{ item.qty }}</span>
            <span class="zwh-col w70 zwh-mono" style="font-size:10.5px;">{{ item.bin }}</span>
            <span class="zwh-col w60 right zwh-mono" :style="{ color: item.age>=90?'var(--zg-danger)':item.age>=60?'var(--zg-warn)':'var(--zg-text-dim)' }">{{ item.age }}</span>
            <span class="zwh-col w80">
              <span v-if="item.aging" style="display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:3px;font-size:9.5px;font-weight:600;" :style="{ color:AGING_COLOR[item.aging]||'var(--zg-text-dim)', background:(AGING_COLOR[item.aging]||'var(--zg-text-dim)')+'18' }">{{ item.aging }}</span>
            </span>
            <span class="zwh-col w60 right zwh-mono" style="font-size:11px;" :style="{ color: item.daily_cost>0?'var(--zg-warn)':'var(--zg-text-xdim)' }">{{ item.daily_cost>0?item.daily_cost.toFixed(2):'—' }}</span>
          </div>
          <div v-if="!inv.length" class="zwh-empty">
            <div class="zwh-empty-title">No inventory matches</div>
            <div class="zwh-empty-sub">Adjust your filters to see results</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
