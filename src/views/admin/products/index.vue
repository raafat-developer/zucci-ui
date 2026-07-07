<template>
  <div class="zp-wrap">
    <ProductsHeader 
      :products-count="PRODUCTS.length" 
      @add-product="$router.push({name:'add-product'})"
    />

    <ProductsTabs 
      :tabs="STATUS_TABS"
      :current-tab="statusTab"
      :tab-counts="tabCounts"
      :status-meta="STATUS_META"
      @update:current-tab="statusTab = $event"
    />

    <ProductsFilters 
      :search-value="search"
      :filters="filters"
      @update:search-value="search = $event"
      @update:filters="filters = $event"
    />

    <ProductsTable 
      :products="filtered"
      :selected-ids="selectedIds"
      :status-meta="STATUS_META"
      @toggle-all="toggleAll"
      @toggle-select="toggleSelect"
    />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import ProductsHeader from '../../../components/admin/products/ProductsHeader.vue';
import ProductsTabs from '../../../components/admin/products/ProductsTabs.vue';
import ProductsFilters from '../../../components/admin/products/ProductsFilters.vue';
import ProductsTable from '../../../components/admin/products/ProductsTable.vue';

const STATUS_META = {
  active: {
    label: "Active",
    color: "var(--zg-good)",
    bg: "oklch(0.78 0.15 150 / 0.1)",
  },
  draft: {
    label: "Draft",
    color: "oklch(0.82 0.14 215)",
    bg: "oklch(0.82 0.14 215 / 0.1)",
  },
  pending_review: {
    label: "Pending Review",
    color: "var(--zg-warn)",
    bg: "oklch(0.82 0.15 75 / 0.1)",
  },
  out_of_stock: {
    label: "Out of Stock",
    color: "var(--zg-danger)",
    bg: "oklch(0.70 0.18 25 / 0.08)",
  },
  suspended: {
    label: "Suspended",
    color: "var(--zg-danger)",
    bg: "oklch(0.70 0.18 25 / 0.15)",
  },
  archived: {
    label: "Archived",
    color: "var(--zg-text-dim)",
    bg: "var(--zg-panel-hi)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--zg-danger)",
    bg: "oklch(0.70 0.18 25 / 0.1)",
  },
};

const PRODUCTS = [
  {
    id: "PRD-10001",
    name: "Levis Black Ripped Jeans",
    brand: "Le Maillot",
    vendor: "24K Fashion House",
    sku: "JNS-LME-SC24-10001",
    category: "Jeans",
    status: "active",
    approval: "approved",
    markets: ["AE", "EG", "SA"],
    inventory: 249,
    variants: 10,
    price: "799 EGP",
    sync: "shopify",
  },
  {
    id: "PRD-10002",
    name: "Le Maillot Beige Swimsuit",
    brand: "Le Maillot",
    vendor: "24K Fashion House",
    sku: "SWM-LME-SC24-10002",
    category: "Swimwear",
    status: "active",
    approval: "approved",
    markets: ["AE", "EG"],
    inventory: 83,
    variants: 5,
    price: "450 EGP",
    sync: "shopify",
  },
  {
    id: "PRD-10003",
    name: "Burgandy Evening Gown",
    brand: "Burgandy",
    vendor: "24K Fashion House",
    sku: "EVN-BRG-FC24-10003",
    category: "Evening Wear",
    status: "draft",
    approval: "pending",
    markets: ["AE"],
    inventory: 14,
    variants: 3,
    price: "1,200 AED",
    sync: "shopify",
  },
  {
    id: "PRD-10004",
    name: "7 Wonders Linen Blazer",
    brand: "7 Wonders",
    vendor: "7 Wonders Trading",
    sku: "FRM-7WW-SC25-10004",
    category: "Formal",
    status: "draft",
    approval: "rejected",
    markets: ["AE", "SA"],
    inventory: 0,
    variants: 4,
    price: "280 USD",
    sync: "manual",
  },
  {
    id: "PRD-10005",
    name: "Cairo Cotton Underwear Set",
    brand: "Cairo Essentials",
    vendor: "Cairo Brands Co.",
    sku: "UND-CCE-SC24-10005",
    category: "Underwear",
    status: "active",
    approval: "approved",
    markets: ["EG"],
    inventory: 412,
    variants: 8,
    price: "180 EGP",
    sync: "api",
  },
  {
    id: "PRD-10006",
    name: "Almaz Silk Wrap Dress",
    brand: "Almaz Couture",
    vendor: "Almaz Couture LLC",
    sku: "DRS-ALC-SC25-10006",
    category: "Dresses",
    status: "pending_review",
    approval: "pending",
    markets: ["AE", "SA", "EG"],
    inventory: 28,
    variants: 6,
    price: "850 AED",
    sync: "shopify",
  },
  {
    id: "PRD-10007",
    name: "Aurora Sports Bra Coral",
    brand: "Aurora Fashion",
    vendor: "Aurora Fashion SA",
    sku: "ACT-AUR-SC25-10007",
    category: "Activewear",
    status: "out_of_stock",
    approval: "approved",
    markets: ["AE", "SA"],
    inventory: 0,
    variants: 5,
    price: "220 SAR",
    sync: "shopify",
  },
  {
    id: "PRD-10008",
    name: "Le Maillot Classic One-Piece",
    brand: "Le Maillot",
    vendor: "24K Fashion House",
    sku: "SWM-LME-FC24-10008",
    category: "Swimwear",
    status: "active",
    approval: "approved",
    markets: ["AE", "SA"],
    inventory: 64,
    variants: 4,
    price: "520 EGP",
    sync: "shopify",
  },
  {
    id: "PRD-10009",
    name: "Burgandy Sequin Midi Dress",
    brand: "Burgandy",
    vendor: "24K Fashion House",
    sku: "EVN-BRG-SC25-10009",
    category: "Evening Wear",
    status: "active",
    approval: "approved",
    markets: ["AE", "SA", "EG"],
    inventory: 19,
    variants: 3,
    price: "1,400 AED",
    sync: "shopify",
  },
  {
    id: "PRD-10010",
    name: "7 Wonders Tailored Blazer",
    brand: "7 Wonders",
    vendor: "7 Wonders Trading",
    sku: "FRM-7WW-FC24-10010",
    category: "Formal",
    status: "active",
    approval: "approved",
    markets: ["AE"],
    inventory: 37,
    variants: 5,
    price: "310 USD",
    sync: "manual",
  },
  {
    id: "PRD-10011",
    name: "Cairo Essentials Linen Shirt",
    brand: "Cairo Essentials",
    vendor: "Cairo Brands Co.",
    sku: "CSL-CCE-SC25-10011",
    category: "Casual Wear",
    status: "draft",
    approval: "pending",
    markets: ["EG"],
    inventory: 150,
    variants: 6,
    price: "220 EGP",
    sync: "api",
  },
  {
    id: "PRD-10012",
    name: "Aurora High Waist Leggings",
    brand: "Aurora Fashion",
    vendor: "Aurora Fashion SA",
    sku: "ACT-AUR-FC24-10012",
    category: "Activewear",
    status: "active",
    approval: "approved",
    markets: ["AE", "SA"],
    inventory: 89,
    variants: 4,
    price: "180 SAR",
    sync: "shopify",
  },
];

const statusTab = ref("all");
const search = ref("");
const filters = ref({
  vendor: 'all',
  brand: 'all',
  category: 'all',
  market: 'all',
  approval: 'all'
});
const STATUS_TABS = [
  "all",
  "active",
  "pending_review",
  "draft",
  "rejected",
  "out_of_stock",
  "archived",
];

const filtered = computed(() => {
  return PRODUCTS.filter((p) => {
    const matchTab = statusTab.value === "all" || p.status === statusTab.value;
    const matchSearch =
      !search.value ||
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.value.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.value.toLowerCase());

    const matchVendor = filters.value.vendor === 'all' || p.vendor === filters.value.vendor;
    const matchBrand = filters.value.brand === 'all' || p.brand === filters.value.brand;
    const matchCategory = filters.value.category === 'all' || p.category === filters.value.category;
    const matchMarket = filters.value.market === 'all' || (p.markets || []).includes(filters.value.market);
    const matchApproval = filters.value.approval === 'all' || p.approval === filters.value.approval;

    return matchTab && matchSearch && matchVendor && matchBrand && matchCategory && matchMarket && matchApproval;
  });
});

const tabCounts = computed(() => {
  const c = {};
  STATUS_TABS.forEach((t) => {
    c[t] =
      t === "all"
        ? PRODUCTS.length
        : PRODUCTS.filter((p) => p.status === t).length;
  });
  return c;
});

const selectedIds = ref([]);
const toggleSelect = (id) => {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((x) => x !== id)
    : [...selectedIds.value, id];
};
const toggleAll = () => {
  selectedIds.value =
    selectedIds.value.length === filtered.value.length
      ? []
      : filtered.value.map((p) => p.id);
};
</script>

<style scoped>
.zp-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
