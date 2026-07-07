<script setup>
/**
 * ProductsListView — faithful Vue port of ZucciProductsModule (zucci-products.jsx).
 * Header + Export/Import/Add actions, status tabs with counts, filter row,
 * bulk-actions bar, and the full product table. "Add Product" and row-click
 * navigate to the real detail route. Uses the legacy zp-* CSS classes.
 */
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import { ZCP_PRODUCTS as SEED } from '@/data/productsData';
import { PROD_STATUS_META, APPROVAL_META, SYNC_META } from '@/data/productsMeta';

const router = useRouter();
const store = useProductsStore();
onMounted(() => { if (!store.loaded) store.fetchAll(); });
// Data comes from the store; the seed is only a first-paint fallback pre-fetch.
const ZCP_PRODUCTS = computed(() => (store.items.length ? store.items : SEED));

const statusTab = ref('all');
const search = ref('');
const vendorFilter = ref('all');
const brandFilter = ref('all');
const categoryFilter = ref('all');
const marketFilter = ref('all');
const approvalFilter = ref('all');
const selectedIds = ref([]);
const bulkAction = ref('');

const STATUS_TABS = ['all','active','pending_review','draft','rejected','out_of_stock','suspended','archived'];
const markets = ['AE','SA','EG','QA'];

const vendors = computed(() => [...new Set(ZCP_PRODUCTS.value.map((p) => p.vendor))]);
const brands = computed(() => [...new Set(ZCP_PRODUCTS.value.map((p) => p.brand))]);
const categories = computed(() => [...new Set(ZCP_PRODUCTS.value.map((p) => p.category))]);

const filtered = computed(() =>
  ZCP_PRODUCTS.value.filter((p) => {
    const s = search.value.toLowerCase();
    const matchTab = statusTab.value === 'all' || p.status === statusTab.value || p.approvalStatus === statusTab.value;
    const matchSearch = !s || p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s) ||
      p.vendor.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s);
    const mv = vendorFilter.value === 'all' || p.vendor === vendorFilter.value;
    const mb = brandFilter.value === 'all' || p.brand === brandFilter.value;
    const mc = categoryFilter.value === 'all' || p.category === categoryFilter.value;
    const mm = marketFilter.value === 'all' || (p.markets || []).includes(marketFilter.value);
    const ma = approvalFilter.value === 'all' || p.approvalStatus === approvalFilter.value;
    return matchTab && matchSearch && mv && mb && mc && mm && ma;
  }),
);

const tabCounts = computed(() => {
  const c = {};
  STATUS_TABS.forEach((t) => {
    c[t] = t === 'all' ? ZCP_PRODUCTS.value.length
      : ZCP_PRODUCTS.value.filter((p) => p.status === t || p.approvalStatus === t).length;
  });
  return c;
});

const toggleSelect = (id) => {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((x) => x !== id) : [...selectedIds.value, id];
};
const toggleAll = () => {
  selectedIds.value = selectedIds.value.length === filtered.value.length ? [] : filtered.value.map((p) => p.id);
};
const applyBulk = () => { selectedIds.value = []; bulkAction.value = ''; };

const openProduct = (id) => router.push(`/admin/products/${id}`);
const tabLabel = (t) => (t === 'all' ? 'All' : PROD_STATUS_META[t]?.label || t);

// exposed to template (computed → auto-unwrapped in template)
const products = ZCP_PRODUCTS;
const statusTabs = STATUS_TABS;
const mkts = markets;
const statusMeta = (s) => PROD_STATUS_META[s] || PROD_STATUS_META.draft;
const approvalMeta = (s) => APPROVAL_META[s] || APPROVAL_META.pending;
const syncMeta = (s) => SYNC_META[s] || SYNC_META.manual;
</script>

<template>
  <div class="zp-wrap">
    <!-- Header -->
    <div class="zp-header">
      <div class="zp-header-left">
        <div class="zp-title">Products</div>
        <div class="zp-subtitle">{{ products.length }} products · across {{ brands.length }} brands</div>
      </div>
      <div class="zp-header-right">
        <button class="zen-btn-ghost" @click="() => {}">Export</button>
        <button class="zen-btn-ghost" @click="() => {}">Import</button>
        <button class="zen-btn-primary" @click="openProduct('new')">+ Add Product</button>
      </div>
    </div>

    <!-- Status tabs -->
    <div class="zp-status-tabs">
      <button
        v-for="t in statusTabs"
        :key="t"
        class="zp-status-tab"
        :class="{ 'is-active': statusTab === t }"
        @click="statusTab = t"
      >
        {{ tabLabel(t) }}
        <span class="zp-tab-count">{{ tabCounts[t] || 0 }}</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="zp-filters">
      <div class="zp-search">
        <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="5.5" cy="5.5" r="3.5" /><line x1="8.5" y1="8.5" x2="12.5" y2="12.5" /></svg>
        <input v-model="search" placeholder="Search name, SKU, vendor, brand…" />
        <button v-if="search" class="zen-actlog-clear" @click="search = ''">×</button>
      </div>
      <select class="zp-filter-select" v-model="vendorFilter">
        <option value="all">All Vendors</option>
        <option v-for="v in vendors" :key="v" :value="v">{{ v }}</option>
      </select>
      <select class="zp-filter-select" v-model="brandFilter">
        <option value="all">All Brands</option>
        <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
      </select>
      <select class="zp-filter-select" v-model="categoryFilter">
        <option value="all">All Categories</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <select class="zp-filter-select" v-model="marketFilter">
        <option value="all">All Markets</option>
        <option v-for="m in mkts" :key="m" :value="m">{{ m }}</option>
      </select>
      <select class="zp-filter-select" v-model="approvalFilter">
        <option value="all">All Approval</option>
        <option value="approved">Approved</option>
        <option value="pending">Pending Review</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <!-- Bulk bar -->
    <div v-if="selectedIds.length" class="zp-bulk-bar">
      <span>{{ selectedIds.length }} selected</span>
      <select class="zp-filter-select" v-model="bulkAction">
        <option value="">Bulk Action…</option>
        <option value="Approve">Approve</option>
        <option value="Reject">Reject</option>
        <option value="Suspend">Suspend</option>
        <option value="Archive">Archive</option>
        <option value="Delete">Delete</option>
        <option value="Export">Export selected</option>
      </select>
      <button class="zen-btn-primary" style="height:28px;font-size:11px" @click="applyBulk">Apply</button>
      <button class="zen-btn-ghost" style="height:28px;font-size:11px" @click="selectedIds = []">Clear</button>
    </div>

    <!-- Table -->
    <div class="zp-table-wrap">
      <div class="zp-table">
        <div class="zp-table-head">
          <span class="zp-col-check"><input type="checkbox" :checked="selectedIds.length === filtered.length && filtered.length > 0" @change="toggleAll" /></span>
          <span class="zp-col-product">Product</span>
          <span class="zp-col-brand">Brand / Vendor</span>
          <span class="zp-col-sku">SKU</span>
          <span class="zp-col-markets">Markets</span>
          <span class="zp-col-inventory">Inventory</span>
          <span class="zp-col-status">Status</span>
          <span class="zp-col-approval">Approval</span>
          <span class="zp-col-sync">Source</span>
          <span class="zp-col-actions"></span>
        </div>

        <div
          v-for="p in filtered"
          :key="p.id"
          class="zp-table-row"
          :class="{ 'is-selected': selectedIds.includes(p.id) }"
          @click="openProduct(p.id)"
        >
          <span class="zp-col-check" @click.stop>
            <input type="checkbox" :checked="selectedIds.includes(p.id)" @change="toggleSelect(p.id)" />
          </span>
          <span class="zp-col-product">
            <div class="zp-thumb">
              <img v-if="p.thumbnail" :src="p.thumbnail" alt="" style="width:28px;height:28px;object-fit:cover;border-radius:4px" />
              <svg v-else viewBox="0 0 32 32" width="28" height="28" fill="none"><rect width="32" height="32" rx="4" fill="var(--zg-panel-hi)" /><path d="M8 22L12 16L16 20L20 14L24 22Z" stroke="var(--zg-line)" stroke-width="1.2" fill="none" stroke-linejoin="round" /><circle cx="11" cy="12" r="2" stroke="var(--zg-line)" stroke-width="1.2" /></svg>
            </div>
            <div class="zp-product-info">
              <div class="zp-product-name">{{ p.name }}</div>
              <span v-if="p.isVariable" class="zp-variant-count">{{ p.variantCount }} variants</span>
              <span v-if="p.returnPolicy === 'non_returnable'" class="zp-non-return-tag">Non-returnable</span>
            </div>
          </span>
          <span class="zp-col-brand">
            <div class="zp-brand-name">{{ p.brand }}</div>
            <div class="zp-vendor-name">{{ p.vendor }}</div>
          </span>
          <span class="zp-col-sku"><span class="zp-sku">{{ p.sku }}</span></span>
          <span class="zp-col-markets">
            <span v-for="m in (p.markets || [])" :key="m" class="zp-market-pill">{{ m }}</span>
          </span>
          <span class="zp-col-inventory">
            <span :class="{ 'zp-stock-zero': p.inventoryTotal === 0 }">{{ p.inventoryTotal }} pcs</span>
          </span>
          <span class="zp-col-status">
            <span class="zp-status-badge" :style="{ background: statusMeta(p.status).bg, color: statusMeta(p.status).color }">{{ statusMeta(p.status).label }}</span>
          </span>
          <span class="zp-col-approval">
            <span style="font-size:11px;font-family:var(--zg-mono);font-weight:600" :style="{ color: approvalMeta(p.approvalStatus).color }">{{ approvalMeta(p.approvalStatus).label }}</span>
          </span>
          <span class="zp-col-sync">
            <span style="font-size:10.5px;font-family:var(--zg-mono)" :style="{ color: syncMeta(p.syncSource).color }">{{ syncMeta(p.syncSource).label }}</span>
            <span v-if="p.syncStatus === 'synced'" class="zp-sync-dot" />
          </span>
          <span class="zp-col-actions" @click.stop>
            <button class="zen-act-btn-sm" title="Preview">
              <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><ellipse cx="7" cy="7" rx="6" ry="4" /><circle cx="7" cy="7" r="1.5" /></svg>
            </button>
          </span>
        </div>

        <div v-if="!filtered.length" class="zp-empty">No products match your filters.</div>
      </div>
    </div>
  </div>
</template>

