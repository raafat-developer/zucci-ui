<template>
  <div class="zp-wrap">
    <ProductsHeader
      :products-count="productsCount"
      :brands-count="brands.length"
      @export="handleExport"
      @import="importOpen = true"
      @add-product="router.push({ name: 'product-new' })"
    />

    <ProductsTabs
      :tabs="statusTabs"
      :current-tab="statusTab"
      :tab-counts="tabCounts"
      @update:current-tab="statusTab = $event"
    />

    <ProductsFilters
      :search-value="search"
      :filters="filters"
      :vendors="vendors"
      :brands="brands"
      :categories="categories"
      :markets="markets"
      @update:search-value="search = $event"
      @update:filters="filters = $event"
    />

    <ProductsTable
      :products="filtered"
      :selected-ids="selectedIds"
      :bulk-action="bulkAction"
      :bulk-action-options="bulkActionOptions"
      :loading="store.loading || store.saving"
      :error="store.error"
      :status-meta="statusMeta"
      :approval-meta="approvalMeta"
      :sync-meta="syncMeta"
      :markets="markets"
      @update:bulk-action="bulkAction = $event"
      @apply-bulk="applyBulk"
      @clear-selection="selectedIds = []"
      @toggle-all="toggleAll"
      @toggle-select="toggleSelect"
      @open-product="openProduct"
      @quick-approve="handleQuickApprove"
    />

    <div
      v-if="store.lastPage > 1"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 16px;
        border-top: 1px solid var(--zg-line);
        background: var(--zg-panel);
        margin-top: 16px;
      "
    >
      <Paginator
        :rows="store.perPage"
        :totalRecords="store.total"
        :first="(store.page - 1) * store.perPage"
        @page="onPageChange"
      />
    </div>

    <ProductBulkImport :open="importOpen" @close="importOpen = false" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import ProductsFilters from "@/components/admin/products/ProductsFilters.vue";
import ProductsHeader from "@/components/admin/products/ProductsHeader.vue";
import ProductsTable from "@/components/admin/products/ProductsTable.vue";
import ProductsTabs from "@/components/admin/products/ProductsTabs.vue";
import ProductBulkImport from "@/views/admin/products/ProductBulkImport.vue";
import { toast } from "@/composables/useToast";
import { useProductsStore } from "@/stores/products";
import { useLookupStore } from "@/stores/lookup.store";
import {
  APPROVAL_META,
  PROD_STATUS_META,
  SYNC_META,
} from "@/data/productsMeta";
import { useConfirm } from "@/composables/useConfirm";

const FALLBACK_STATUS_VALUES = [
  "active",
  "pending_review",
  "draft",
  "rejected",
  "out_of_stock",
  "suspended",
  "archived",
];

const router = useRouter();
const store = useProductsStore();
const lookupStore = useLookupStore();
const { confirm } = useConfirm();

const statusTab = ref("all");
const search = ref("");
const filters = ref({
  vendor: "all",
  brand: "all",
  category: "all",
  market: "all",
  approval: "all",
});
const selectedIds = ref([]);
const bulkAction = ref("");
const importOpen = ref(false);

const normalizeStatusValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const humanizeStatus = (value) =>
  String(value || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const humanizeAction = (value) =>
  humanizeStatus(String(value || "").replace(/[\s-]+/g, "_"));
const getLookupStatusValue = (status) =>
  normalizeStatusValue(
    status?.code ??
      status?.slug ??
      status?.value ??
      status?.id ??
      status?.key ??
      status?.title ??
      status?.name ??
      status?.label,
  );
const getLookupStatusLabel = (status, fallbackValue = "") =>
  status?.label ||
  status?.name ||
  status?.title ||
  humanizeStatus(fallbackValue);

const statusLookupMap = computed(() =>
  Object.fromEntries(
    lifecycleStatuses.value.map((status) => {
      const value = getLookupStatusValue(status);
      return [value, getLookupStatusLabel(status, value)];
    }),
  ),
);

const statusMeta = (status) => {
  const normalizedStatus = normalizeStatusValue(status);
  const fallback = PROD_STATUS_META[normalizedStatus] || PROD_STATUS_META.draft;

  return {
    ...fallback,
    label: statusLookupMap.value[normalizedStatus] || fallback.label,
  };
};
const syncMeta = (status) =>
  SYNC_META[normalizeStatusValue(status)] || SYNC_META.manual;

const products = computed(() => store.items);
const productsCount = computed(() => store.total || products.value.length);
const lifecycleStatuses = computed(() =>
  lookupStore.getStatus("product_lifecycle"),
);
const approvalStatuses = computed(() =>
  lookupStore.getStatus("product_approval"),
);
const approvalLookupMap = computed(() =>
  Object.fromEntries(
    approvalStatuses.value.map((status) => {
      const value = getLookupStatusValue(status);
      return [value, getLookupStatusLabel(status, value)];
    }),
  ),
);
const approvalMeta = (status) => {
  const normalizedStatus = normalizeStatusValue(status);
  const fallback = APPROVAL_META[normalizedStatus] || APPROVAL_META.pending;

  return {
    ...fallback,
    label: approvalLookupMap.value[normalizedStatus] || fallback.label,
  };
};
const marketLookupMap = computed(() => {
  const entries = {};

  lookupStore.get("markets").forEach((market) => {
    const label =
      market.label ||
      market.name ||
      market.title ||
      market.code ||
      String(market.id || "");
    [market.id, market.value, market.code, market.name]
      .filter((value) => value !== undefined && value !== null && value !== "")
      .forEach((value) => {
        entries[String(value)] = label;
      });
  });

  return entries;
});

const resolveMarketLabel = (market) =>
  marketLookupMap.value[String(market)] || String(market || "");

const normalizedProducts = computed(() =>
  products.value.map((product) => ({
    ...product,
    markets: (product.markets || []).map(resolveMarketLabel).filter(Boolean),
  })),
);

const markets = computed(() => {
  const lookupMarkets = lookupStore.get("markets");
  return lookupMarkets;
});

const statusTabs = computed(() => {
  const seen = new Set();
  const lookupTabs = lifecycleStatuses.value
    .map((status) => {
      const value = getLookupStatusValue(status);
      if (!value || seen.has(value)) return null;
      seen.add(value);
      return {
        value,
        label: getLookupStatusLabel(status, value),
        sortOrder: Number.isFinite(Number(status.sortOrder))
          ? Number(status.sortOrder)
          : Number.MAX_SAFE_INTEGER,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label),
    );

  const fallbackTabs = FALLBACK_STATUS_VALUES.map((value) => ({
    value,
    label: PROD_STATUS_META[value]?.label || humanizeStatus(value),
  }));

  return [
    { value: "all", label: "All" },
    ...(lookupTabs.length ? lookupTabs : fallbackTabs),
  ];
});

const bulkActionOptions = computed(() =>
  (approvalStatuses.value.length
    ? approvalStatuses.value.map((status) => {
        const value = getLookupStatusValue(status);
        if (!value) return null;
        return {
          value,
          label: getLookupStatusLabel(status, value),
          sortOrder: Number.isFinite(Number(status.sortOrder))
            ? Number(status.sortOrder)
            : Number.MAX_SAFE_INTEGER,
        };
      })
    : [
        ...new Set(
          products.value
            .map((product) => normalizeStatusValue(product.approvalStatus))
            .filter(Boolean),
        ),
      ].map((value) => ({
        value,
        label:
          approvalLookupMap.value[value] ||
          APPROVAL_META[value]?.label ||
          humanizeStatus(value),
        sortOrder: Number.MAX_SAFE_INTEGER,
      }))
  )
    .map((status) => {
      if (!status) return null;
      if (typeof status === "object" && "value" in status) return status;
      const value = getLookupStatusValue(status);
      if (!value) return null;
      return {
        value,
        label: getLookupStatusLabel(status, value),
        sortOrder: Number.isFinite(Number(status.sortOrder))
          ? Number(status.sortOrder)
          : Number.MAX_SAFE_INTEGER,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label))
    .map(({ value, label }) => ({ value, label })),
);

const vendors = computed(() => {
  const map = new Map();
  products.value.forEach((p) => {
    const name = p.vendor || p.brand?.name || "—";
    const id = p.supplierEntityId || p.vendorId || name;
    if (name && id && !map.has(id)) {
      map.set(id, name);
    }
  });
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
});

const brands = computed(() => {
  const lookupBrands = lookupStore.get("brands") || [];
  return lookupBrands
    .map((b) => ({
      id: b.id,
      name: b.name || b.translations?.[0]?.name || "—",
    }))
    .filter((b) => b.id && b.name);
});

const categories = computed(() => {
  const lookupCats = lookupStore.get("categories") || [];
  return lookupCats
    .map((c) => ({
      id: c.id,
      name: c.name || c.label || c.translations?.[0]?.name || "—",
    }))
    .filter((c) => c.id && c.name);
});

const filtered = computed(() => normalizedProducts.value);

const loadFilteredProducts = () => {
  const params = {
    page: 1,
    search: search.value || undefined,
  };
  if (statusTab.value !== "all") {
    params.status = statusTab.value;
  }
  if (filters.value.vendor !== "all") {
    params.supplierEntityId = filters.value.vendor;
    params.vendor = filters.value.vendor;
  }
  if (filters.value.brand !== "all") {
    params.brandId = filters.value.brand;
    params.brand = filters.value.brand;
  }
  if (filters.value.category !== "all") {
    params.categoryId = filters.value.category;
    params.category = filters.value.category;
  }
  if (filters.value.market !== "all") params.marketId = filters.value.market;
  if (filters.value.approval !== "all")
    params.approvalStatus = filters.value.approval;

  store.load(params);
};

watch([statusTab, filters], () => {
  loadFilteredProducts();
}, { deep: true });

let searchWatchTimeout = null;
watch(search, () => {
  if (searchWatchTimeout) clearTimeout(searchWatchTimeout);
  searchWatchTimeout = setTimeout(() => {
    loadFilteredProducts();
  }, 300);
});

const tabCounts = computed(() =>
  Object.fromEntries(
    statusTabs.value.map((tab) => [tab.value, store.tabs[tab.value] ?? 0]),
  ),
);

const toggleSelect = (id) => {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((currentId) => currentId !== id)
    : [...selectedIds.value, id];
};

const toggleAll = () => {
  selectedIds.value =
    selectedIds.value.length === filtered.value.length
      ? []
      : filtered.value.map((product) => product.id);
};

const applyBulk = async () => {
  if (!bulkAction.value || !selectedIds.value.length) return;

  try {
    const { refreshError } = await store.bulkAction(
      bulkAction.value,
      selectedIds.value,
    );
    toast.success(
      `${humanizeAction(bulkAction.value)} applied to ${selectedIds.value.length} products`,
    );
    selectedIds.value = [];
    bulkAction.value = "";

    if (refreshError) {
      toast.warn(
        "Bulk action succeeded, but the products list did not refresh",
      );
    }
  } catch {
    toast.error(store.error || "Failed to apply product bulk action");
  }
};

const openProduct = (id) => {
  router.push(`/admin/products/${id}`);
};

const handleQuickApprove = async (product) => {
  const ok = await confirm({
    title: "Approve Product",
    message: `Are you sure you want to approve "${product.name || "this product"}"?`,
    confirmText: "Approve",
    cancelText: "Cancel",
    variant: "primary",
  });
  if (ok) {
    try {
      await store.approve(product.id);
      await store.load();
    } catch (e) {
      toast.error(e.message || "Failed to approve product");
    }
  }
};

const handleExport = async () => {
  try {
    await store.exportProducts();
    toast.success("Exporting products CSV…");
  } catch {
    toast.error(store.error || "Failed to export products CSV");
  }
};

const onPageChange = (event) => {
  const newPage = event.page + 1;
  selectedIds.value = [];
  store.load({ page: newPage, perPage: event.rows });
};

watch(statusTabs, (tabs) => {
  if (!tabs.some((tab) => tab.value === statusTab.value)) {
    statusTab.value = "all";
  }
});

onMounted(async () => {
  await Promise.allSettled([
    store.load(),
    lookupStore.load(),
    lookupStore.loadStatusDomain("product_lifecycle"),
    lookupStore.loadStatusDomain("product_approval"),
  ]);
});
</script>

<style scoped>
.zp-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
