<script setup>
/**
 * CategoriesView — Products + Marketplace categories. Faithful port of
 * ZucciCategoriesModule: KPI strip, market filter chips, below-minimum flags,
 * Products tree (drag-to-reorder, expand children, inline status toggle,
 * per-market stats, add/edit/sub/delete) and Marketplace table (mapping,
 * commission, expand children). Category drawer + bulk import wired.
 * `?type=products|marketplace` selects the panel.
 */
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCategoriesStore } from "@/stores/categories";
import { useLookupStore } from "@/stores/lookup.store";
import { ZC_CATEGORIES, ZC_MARKETPLACE_CATS } from "@/data/categoriesData";
import { useLookup } from "@/composables/useLookup";
import { useDnDList } from "@/composables/useDnDList";
import CategoryDrawer from "./CategoryDrawer.vue";
import CategoryBulkImport from "./CategoryBulkImport.vue";
import { toast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import http from "@/api/http";

const lookup = useLookup();
const { confirm } = useConfirm();
const FALLBACK_MARKETS = [
  { id: 1, code: "AE", name: "UAE" },
  { id: 2, code: "SA", name: "Saudi Arabia" },
  { id: 3, code: "EG", name: "Egypt" },
  { id: 4, code: "KW", name: "Kuwait" },
  { id: 5, code: "BH", name: "Bahrain" },
  { id: 6, code: "QA", name: "Qatar" },
  { id: 7, code: "OM", name: "Oman" },
];
const MARKETS = computed(() => {
  const markets = lookup.get("markets");
  if (markets.length === 0) return FALLBACK_MARKETS;
  return markets;
});
const route = useRoute();
const isMarketplace = computed(() => route.query.type === "marketplace");
const lookupStore = useLookupStore();

// ── Store Integration ──
const categoriesStore = useCategoriesStore();
const {
  internalCategories: prodCats,
  marketplaceCategories: mktCats,
  loading,
  error,
  page,
  perPage,
  total,
  lastPage,
  kpis: storeKpis,
} = storeToRefs(categoriesStore);

const search = ref("");
const selectedMarketCode = ref("all");
const selectedParentId = ref("all");
const selectedLevel = ref("all");

const parentCategories = computed(() => {
  const all = lookupStore.get("categories") || [];
  return all
    .filter((c) => !c.parentId)
    .map((c) => ({ id: c.id, name: c.label || c.name || c.title }));
});

const fetchFilteredCategories = async () => {
  const marketMap = { AE: 1, SA: 2, EG: 3, KW: 4, BH: 5, QA: 6, OM: 7 };
  const marketIdVal =
    selectedMarketCode.value !== "all"
      ? marketMap[selectedMarketCode.value]
      : undefined;

  const params = {
    search: search.value || undefined,
    market:
      selectedMarketCode.value !== "all" ? selectedMarketCode.value : undefined,
    marketId: marketIdVal,
    parentId:
      selectedParentId.value !== "all" ? selectedParentId.value : undefined,
    level:
      selectedLevel.value !== "all" ? Number(selectedLevel.value) : undefined,
  };
  console.log("[CategoriesView] Fetching with parameters:", params);
  try {
    await categoriesStore.load(params);
    console.log(
      "[CategoriesView] Fetch completed. Count:",
      categoriesStore.internalCategories.length,
    );
  } catch (err) {
    console.error("[CategoriesView] Fetch failed:", err);
  }
};

onMounted(async () => {
  await lookupStore.load({
    includeStatuses: true,
    statusDomains: ["category"],
  });
  await fetchFilteredCategories();
});

// ── helpers ──
const belowMin = (cat, m) => {
  const ms = cat.markets?.[m];
  return ms?.enabled && ms.listing_count < ms.min_listings;
};
const anyBelowMin = (cat) =>
  MARKETS.value.some((market) => belowMin(cat, market.code));
const belowMinCount = (list) =>
  list.reduce(
    (s, c) =>
      s + MARKETS.value.filter((market) => belowMin(c, market.code)).length,
    0,
  );
const clone = (arr) =>
  arr.map((c) => ({
    ...c,
    children: (c.children || []).map((ch) => ({ ...ch })),
  }));

// ── state ──
const expanded = ref({});
const statsFor = ref(null);
const mktFilter = ref("all");
const drawerOpen = ref(false);
const editCat = ref(null);
const parentCat = ref(null);
const importOpen = ref(false);

watch(isMarketplace, () => {
  expanded.value = {};
  statsFor.value = null;
  mktFilter.value = "all";
});
watch([search, selectedMarketCode, selectedParentId, selectedLevel], () => {
  fetchFilteredCategories();
});

// drag-reorder (products) using useDnDList
const {
  items: draggableCats,
  dragIdx,
  overIdx,
  start,
  over,
  drop,
  end,
} = useDnDList(prodCats.value);

const handleDrop = async (idx) => {
  drop(idx);
  prodCats.value = [...draggableCats.value];
  try {
    const payload = {
      orderedIds: prodCats.value.map((c) => c.id),
    };
    await http.post("/catalog/categories/reorder", payload);
    toast.success("Categories order updated successfully");
  } catch (err) {
    console.error("Failed to reorder categories:", err);
    toast.error("Failed to update categories order");
  }
};

watch(prodCats, (newCats) => {
  draggableCats.value = [...newCats];
});

const cats = computed(() =>
  isMarketplace.value ? mktCats.value : prodCats.value,
);
const filtered = computed(() => cats.value);
const INTL = ZC_CATEGORIES || [];

const toggle = (id) => {
  expanded.value = { ...expanded.value, [id]: !expanded.value[id] };
};
const openAdd = (par = null) => {
  editCat.value = null;
  parentCat.value = par;
  drawerOpen.value = true;
};
const openEdit = (c) => {
  editCat.value = { ...c };
  parentCat.value = null;
  drawerOpen.value = true;
};
const openAddMkt = () => {
  editCat.value = {
    commission_pct: "",
    listing_requirements: [],
    requires_approval: false,
    markets: Object.fromEntries(
      MARKETS.value.map((m) => [
        m.code,
        { enabled: false, min_listings: 10, commission_pct: 15 },
      ]),
    ),
  };
  parentCat.value = null;
  drawerOpen.value = true;
};
const toggleStatus = async (id, isChild, pid) => {
  let cat = null;
  if (!isChild) {
    cat = prodCats.value.find((c) => c.id === id);
  } else {
    const parent = prodCats.value.find((c) => c.id === pid);
    if (parent) {
      cat = parent.children?.find((ch) => ch.id === id);
    }
  }
  if (!cat) return;

  const currentStatus = cat.status || "active";
  const newStatusStr = currentStatus === "active" ? "inactive" : "active";

  const catStatuses = lookupStore.getStatus("category") || [];
  const foundStatus = catStatuses.find(
    (s) =>
      s.name?.toLowerCase() === newStatusStr.toLowerCase() ||
      (s.code || s.slug || s.value)?.toLowerCase() ===
        newStatusStr.toLowerCase(),
  );

  const payload = {};
  if (foundStatus) {
    payload.statusId = foundStatus.id;
  } else {
    payload.statusId = newStatusStr === "active" ? 161 : 162;
  }
  payload.status = newStatusStr;

  try {
    await categoriesStore.updateCategory(id, payload);
    toast.success(`Category status updated to ${newStatusStr}`);
  } catch (err) {
    console.error("Failed to update status:", err);
    toast.error(err.message || "Failed to update category status");
  }
};
const del = async (cat) => {
  const confirmed = await confirm({
    title: "Delete Category",
    message: `Are you sure you want to delete "${cat.label}"? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "danger",
  });
  if (confirmed) {
    try {
      await categoriesStore.deleteCategory(cat.id);
      toast.warn(`"${cat.label}" deleted`);
    } catch (err) {
      toast.error(err.message);
    }
  }
};
const downloadCsv = () => toast.success("Exporting categories CSV…");

const tagStyle = (cat, m) => {
  const ms = cat.markets?.[m];
  if (!ms) return null;
  const dim = mktFilter.value !== "all" && mktFilter.value !== m;
  if (!ms.enabled) return { enabled: false, opacity: dim ? 0.3 : 0.6 };
  const below = belowMin(cat, m);
  return { enabled: true, below, opacity: dim ? 0.35 : 1 };
};

// Pagination handler
const totalPages = computed(() => lastPage.value);
const onPageChange = (event) => {
  const newPage = event.page + 1;
  categoriesStore.load({ page: newPage });
};

// KPIs from store
const kpis = computed(() => {
  const sk = storeKpis.value;
  if (isMarketplace.value)
    return [
      ["Marketplace Cats", sk?.total || 0, "", "vendor-facing"],
      ["Mapped", sk?.topLevel || 0, "is-good", "linked to internal"],
      ["Approval Required", sk?.subCategories || 0, "is-warn", "need review"],
      ["Avg Commission", "15%", "is-accent", "across categories"],
      [
        "Total Listings",
        (sk?.totalProducts || 0).toLocaleString(),
        "",
        "active",
      ],
      [
        "Below Min",
        sk?.thresholdWarnings || 0,
        (sk?.thresholdWarnings || 0) > 0 ? "is-warn" : "",
        "market thresholds",
      ],
    ];
  return [
    ["Total Categories", sk?.taxonomyTrees || 0, "", "all levels"],
    ["Top-level", sk?.topLevel || 0, "", "parent categories"],
    ["Active", sk?.activeStorefront || 0, "is-good", "live on storefront"],
    ["Private", sk?.privateB2bTiers || 0, "is-accent", "B2B / VIP / hidden"],
    [
      "Total Products",
      (sk?.totalCatalogItems || 0).toLocaleString(),
      "",
      "across all",
    ],
    [
      "Below Min",
      sk?.thresholdWarnings || 0,
      (sk?.thresholdWarnings || 0) > 0 ? "is-warn" : "",
      "market thresholds",
    ],
  ];
});
const statsCat = computed(() => {
  if (!statsFor.value) return null;
  for (const c of cats.value) {
    if (c.id === statsFor.value) return c;
    const ch = (c.children || []).find((x) => x.id === statsFor.value);
    if (ch) return ch;
  }
  return null;
});
const mkts = MARKETS.value.map((m) => m.code); // for backwards compatibility
</script>

<template>
  <div class="zcat-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <span
          style="font-size: 13px; font-weight: 600; color: var(--zg-text)"
          >{{ isMarketplace ? "Marketplace Categories" : "Categories" }}</span
        >
        <div class="zwh-subtitle">
          {{
            isMarketplace
              ? `${mktCats.length} vendor-facing categories mapped to internal taxonomy`
              : `${prodCats.length} top-level · ${prodCats.reduce((s, c) => s + (c.children?.length || 0), 0)} sub-categories · internal taxonomy`
          }}
        </div>
      </div>
    </div>

    <div class="zwh-kpi-strip">
      <div v-for="[lbl, val, cls, sub] in kpis" :key="lbl" class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">{{ lbl }}</span>
        <span class="zwh-kpi-val" :class="cls">{{ val }}</span>
        <span class="zwh-kpi-sub">{{ sub }}</span>
      </div>
    </div>

    <div class="zcat-content">
      <!-- Toolbar & Filters -->
      <div
        style="
          display: flex;
          gap: 12px;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-bottom: 16px;
          align-items: center;
        "
      >
        <div
          style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center"
        >
          <div
            class="zp-search"
            style="display: flex; align-items: center; position: relative"
          >
            <input
              v-model="search"
              placeholder="Search categories…"
              style="
                height: 28px;
                padding: 0;
                border-radius: var(--zg-radius-md);
                font-size: 11.5px;
                color: var(--zg-text);
                outline: none;
                width: 160px;
              "
            />
            <button
              v-if="search"
              style="
                position: absolute;
                right: 8px;
                background: none;
                border: none;
                color: var(--zg-text-dim);
                cursor: pointer;
                font-size: 12px;
              "
              @click="search = ''"
            >
              ×
            </button>
          </div>

          <button
            v-for="m in ['all', ...MARKETS.map((market) => market.code)]"
            :key="m"
            class="zwh-filter-chip"
            :class="{ 'is-active': selectedMarketCode === m }"
            @click="selectedMarketCode = m"
          >
            {{ m === "all" ? "All Markets" : m }}
          </button>

          <select
            v-model="selectedParentId"
            style="
              height: 28px;
              padding: 0 8px;
              background: var(--zg-panel);
              border: 1px solid var(--zg-line);
              border-radius: var(--zg-radius-md);
              font-size: 11.5px;
              color: var(--zg-text);
              outline: none;
              cursor: pointer;
              max-width: 160px;
            "
          >
            <option value="all">All Parents</option>
            <option v-for="c in parentCategories" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>

          <select
            v-model="selectedLevel"
            style="
              height: 28px;
              padding: 0 8px;
              background: var(--zg-panel);
              border: 1px solid var(--zg-line);
              border-radius: var(--zg-radius-md);
              font-size: 11.5px;
              color: var(--zg-text);
              outline: none;
              cursor: pointer;
            "
          >
            <option value="all">All Levels</option>
            <option value="1">Level 1 (Root)</option>
            <option value="2">Level 2 (Sub-category)</option>
          </select>

          <span
            v-if="belowMinCount(cats) > 0"
            style="
              height: 20px;
              padding: 0 8px;
              background: oklch(0.7 0.18 25 / 0.1);
              border: 1px solid oklch(0.7 0.18 25 / 0.3);
              border-radius: 3px;
              font-size: 10px;
              font-weight: 700;
              color: var(--zg-danger);
              display: inline-flex;
              align-items: center;
            "
            >{{ belowMinCount(cats) }} below minimum</span
          >
        </div>
        <div style="display: flex; gap: 6px">
          <button class="zwh-btn-ghost" @click="importOpen = true">
            Bulk Import
          </button>
          <button
            v-if="!isMarketplace"
            class="zwh-btn-ghost"
            @click="downloadCsv"
          >
            Export CSV
          </button>
          <button
            class="zwh-btn-primary"
            @click="isMarketplace ? openAddMkt() : openAdd(null)"
          >
            + Add Category
          </button>
        </div>
      </div>

      <!-- Products tree -->
      <div v-if="!isMarketplace" class="zcat-tree">
        <template v-for="(cat, idx) in draggableCats" :key="cat.id">
          <div
            class="zcat-root-row"
            draggable="true"
            @dragstart="start(idx)"
            @dragover.prevent="over(idx)"
            @drop.prevent="handleDrop(idx)"
            @dragend="end"
            :style="{
              background:
                overIdx === idx
                  ? 'var(--zg-accent-tint)'
                  : dragIdx === idx
                    ? 'oklch(0.25 0.02 250 / 0.5)'
                    : cat.status !== 'active'
                      ? 'var(--zg-bg)'
                      : 'var(--zg-panel)',
              outline: overIdx === idx ? '1px dashed var(--zg-accent)' : 'none',
              cursor: 'grab',
            }"
          >
            <span class="zcat-drag-handle" title="Drag to reorder"
              ><svg viewBox="0 0 8 12" width="8" fill="currentColor">
                <circle cx="2" cy="2" r="1.1" />
                <circle cx="6" cy="2" r="1.1" />
                <circle cx="2" cy="6" r="1.1" />
                <circle cx="6" cy="6" r="1.1" />
                <circle cx="2" cy="10" r="1.1" />
                <circle cx="6" cy="10" r="1.1" /></svg
            ></span>
            <button
              v-if="cat.children?.length"
              class="zcat-expand-btn"
              @click="toggle(cat.id)"
            >
              <svg
                class="zcat-expand-chevron"
                :class="{ open: expanded[cat.id] }"
                viewBox="0 0 8 12"
                width="7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              >
                <path d="M2 2l4 4-4 4" />
              </svg>
            </button>
            <span v-else style="width: 20px" />
            <span class="zcat-name">{{ cat.label }}</span>
            <span
              v-if="anyBelowMin(cat)"
              title="Some markets below minimum"
              style="
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--zg-danger);
                color: #fff;
                font-size: 10px;
                font-weight: 900;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
              "
              >!</span
            >
            <span v-if="cat.private" class="zcat-badge private">Private</span>
            <div style="flex: 1; min-width: 0">
              <div
                style="
                  display: flex;
                  gap: 3px;
                  flex-wrap: wrap;
                  align-items: center;
                "
              >
                <span
                  v-for="market in MARKETS"
                  :key="market.code"
                  :style="{
                    height: '16px',
                    padding: '0 5px',
                    borderRadius: '2px',
                    fontSize: '9px',
                    fontWeight: tagStyle(cat, market.code)?.enabled ? 700 : 600,
                    fontFamily: 'var(--zg-mono)',
                    background: !tagStyle(cat, market.code)?.enabled
                      ? 'var(--zg-panel-hi)'
                      : tagStyle(cat, market.code)?.below
                        ? 'oklch(0.70 0.18 25 / 0.12)'
                        : 'oklch(0.78 0.18 130 / 0.3)',
                    color: !tagStyle(cat, market.code)?.enabled
                      ? 'var(--zg-text-xdim)'
                      : tagStyle(cat, market.code)?.below
                        ? 'var(--zg-danger)'
                        : cat.markets?.[market.code]?.enabled
                          ? 'var(--zg-good)'
                          : 'var(--zg-accent)',
                    border: `1px solid ${!tagStyle(cat, market.code)?.enabled ? 'var(--zg-line)' : tagStyle(cat, market.code)?.below ? 'oklch(0.70 0.18 25 / 0.3)' : cat.markets?.[market.code]?.enabled ? 'var(--zg-good)' : 'oklch(0.78 0.18 130 / 0.3)'}`,
                    opacity: tagStyle(cat, market.code)?.opacity,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                  }"
                  >{{ market.code
                  }}<span
                    v-if="tagStyle(cat, market.code)?.below"
                    style="font-size: 8px; font-weight: 900"
                    >!</span
                  ></span
                >
              </div>
            </div>
            <span class="zcat-count"
              >{{ (cat.product_count || 0).toLocaleString() }} products</span
            >
            <button
              class="zcat-toggle"
              :class="cat.status === 'active' ? 'on' : 'off'"
              @click.stop="toggleStatus(cat.id, false, null)"
            >
              <div class="zcat-toggle-knob" />
            </button>
            <div class="zcat-row-actions">
              <button
                class="zcat-act"
                @click.stop="statsFor = statsFor === cat.id ? null : cat.id"
              >
                Stats
              </button>
              <button class="zcat-act" @click.stop="openAdd(cat)">+ Sub</button>
              <button class="zcat-act" @click.stop="openEdit(cat)">Edit</button>
              <button class="zcat-act danger" @click.stop="del(cat)">
                Del
              </button>
            </div>
          </div>

          <div
            v-if="statsFor === cat.id"
            style="
              padding: 10px 14px 14px;
              background: var(--zg-bg);
              border-bottom: 1px solid var(--zg-line);
            "
          >
            <div
              style="
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 6px;
              "
            >
              <div
                v-for="market in MARKETS"
                :key="market.code"
                v-show="cat.markets?.[market.code]"
                :style="{
                  background: 'var(--zg-panel)',
                  border: `1px solid ${belowMin(cat, market.code) ? 'oklch(0.70 0.18 25 / 0.4)' : cat.markets?.[market.code]?.enabled ? 'var(--zg-line)' : 'var(--zg-line-soft)'}`,
                  borderRadius: 'var(--zg-radius-md)',
                  padding: '8px 10px',
                  opacity: cat.markets?.[market.code]?.enabled ? 1 : 0.45,
                }"
              >
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 4px;
                  "
                >
                  <span
                    style="
                      font-size: 10px;
                      font-weight: 700;
                      font-family: var(--zg-mono);
                    "
                    >{{ market.code }}</span
                  ><span
                    :style="{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: cat.markets?.[market.code]?.enabled
                        ? belowMin(cat, market.code)
                          ? 'var(--zg-danger)'
                          : 'var(--zg-good)'
                        : 'var(--zg-line)',
                    }"
                  />
                </div>
                <template v-if="cat.markets?.[market.code]?.enabled">
                  <div
                    :style="{
                      fontSize: '13px',
                      fontWeight: 700,
                      fontFamily: 'var(--zg-mono)',
                      color: belowMin(cat, market.code)
                        ? 'var(--zg-danger)'
                        : 'var(--zg-text)',
                    }"
                  >
                    {{ cat.markets[market.code].listing_count }}
                  </div>
                  <div
                    style="
                      font-size: 9.5px;
                      color: var(--zg-text-dim);
                      margin-top: 1px;
                    "
                  >
                    / {{ cat.markets[market.code].min_listings }} min
                  </div>
                  <div
                    v-if="cat.markets[market.code].vendor_count"
                    style="
                      font-size: 9px;
                      color: var(--zg-text-xdim);
                      margin-top: 3px;
                    "
                  >
                    {{ cat.markets[market.code].vendor_count }} vendors
                  </div>
                </template>
                <div
                  v-else
                  style="
                    font-size: 10px;
                    color: var(--zg-text-xdim);
                    margin-top: 4px;
                  "
                >
                  Disabled
                </div>
              </div>
            </div>
          </div>

          <template v-if="expanded[cat.id]">
            <div
              v-for="ch in cat.children || []"
              :key="ch.id"
              class="zcat-child-row"
            >
              <span style="width: 8px" /><span
                style="
                  font-family: monospace;
                  color: var(--zg-text-xdim);
                  font-size: 11px;
                "
                >└</span
              >
              <span class="zcat-child-name">{{ ch.label }}</span>
              <span
                v-if="anyBelowMin(ch)"
                style="
                  width: 14px;
                  height: 14px;
                  border-radius: 50%;
                  background: var(--zg-danger);
                  color: #fff;
                  font-size: 9px;
                  font-weight: 900;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                "
                >!</span
              >
              <div style="flex: 1; min-width: 0">
                <div style="display: flex; gap: 3px; flex-wrap: wrap">
                  <span
                    v-for="market in MARKETS"
                    :key="market.code"
                    v-show="ch.markets?.[market.code]?.enabled"
                    style="
                      height: 15px;
                      padding: 0 4px;
                      border-radius: 2px;
                      font-size: 8.5px;
                      font-weight: 700;
                      font-family: var(--zg-mono);
                    "
                    :style="{
                      background: belowMin(ch, market.code)
                        ? 'oklch(0.70 0.18 25 / 0.12)'
                        : 'var(--zg-accent-tint)',
                      color: belowMin(ch, market.code)
                        ? 'var(--zg-danger)'
                        : ch.markets?.[market.code]?.enabled
                          ? 'var(--zg-good)'
                          : 'var(--zg-accent)',
                    }"
                    >{{ market.code }}</span
                  >
                </div>
              </div>
              <span class="zcat-count">{{
                (ch.product_count || 0).toLocaleString()
              }}</span>
              <button
                class="zcat-toggle"
                :class="ch.status === 'active' ? 'on' : 'off'"
                @click="toggleStatus(ch.id, true, cat.id)"
              >
                <div class="zcat-toggle-knob" />
              </button>
              <div class="zcat-row-actions">
                <button
                  class="zcat-act"
                  @click="statsFor = statsFor === ch.id ? null : ch.id"
                >
                  Stats
                </button>
                <button class="zcat-act" @click="openEdit(ch)">Edit</button>
              </div>
            </div>
          </template>
        </template>
      </div>

      <!-- Marketplace table -->
      <div
        v-else
        style="
          border: 1px solid var(--zg-line);
          border-radius: var(--zg-radius-md);
          overflow: hidden;
        "
      >
        <div
          style="
            display: grid;
            grid-template-columns: 1fr 130px 80px 80px 80px 120px 80px;
            gap: 10px;
            padding: 0 14px;
            height: 32px;
            background: var(--zg-panel-hi);
            border-bottom: 1px solid var(--zg-line);
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            color: var(--zg-text-dim);
            font-weight: 600;
            align-items: center;
          "
        >
          <span>Category</span><span>Maps to</span><span>Commission</span
          ><span>Vendors</span><span>Listings</span><span>Markets</span
          ><span>Actions</span>
        </div>
        <template v-for="cat in filtered" :key="cat.id">
          <div
            style="
              display: grid;
              grid-template-columns: 1fr 130px 80px 80px 80px 120px 80px;
              gap: 10px;
              padding: 10px 14px;
              background: var(--zg-panel);
              border-bottom: 1px solid var(--zg-line-soft);
              align-items: center;
              cursor: pointer;
            "
            @click="toggle(cat.id)"
          >
            <div style="overflow: hidden">
              <div style="display: flex; align-items: center; gap: 6px">
                <span
                  style="
                    font-size: 12.5px;
                    font-weight: 600;
                    color: var(--zg-text);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  >{{ cat.label }}</span
                ><span
                  v-if="anyBelowMin(cat)"
                  style="
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: var(--zg-danger);
                    color: #fff;
                    font-size: 9px;
                    font-weight: 900;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                  "
                  >!</span
                >
              </div>
              <div
                style="
                  font-size: 10px;
                  color: var(--zg-text-dim);
                  font-family: var(--zg-mono);
                "
              >
                {{ cat.slug }}
              </div>
            </div>
            <div>
              <div
                style="
                  font-size: 11.5px;
                  color: var(--zg-text-mid);
                  font-weight: 500;
                "
              >
                {{ cat.mapped_label }}
              </div>
              <div
                style="
                  font-size: 10px;
                  color: var(--zg-text-dim);
                  font-family: var(--zg-mono);
                "
              >
                {{ cat.mapped_to }}
              </div>
            </div>
            <span
              style="
                font-family: var(--zg-mono);
                font-size: 13px;
                font-weight: 700;
                color: var(--zg-accent);
              "
              >{{
                mktFilter !== "all" && cat.markets?.[mktFilter]
                  ? cat.markets[mktFilter].commission_pct
                  : cat.commission_pct
              }}%</span
            >
            <span
              style="
                font-family: var(--zg-mono);
                font-size: 12px;
                color: var(--zg-text-mid);
              "
              >{{
                mktFilter !== "all" && cat.markets?.[mktFilter]
                  ? cat.markets[mktFilter].vendor_count
                  : cat.vendor_count
              }}</span
            >
            <span
              style="
                font-family: var(--zg-mono);
                font-size: 12px;
                color: var(--zg-text-mid);
              "
              >{{
                (mktFilter !== "all" && cat.markets?.[mktFilter]
                  ? cat.markets[mktFilter].listing_count
                  : cat.listing_count
                )?.toLocaleString()
              }}</span
            >
            <div style="display: flex; gap: 3px; flex-wrap: wrap">
              <span
                v-for="market in MARKETS"
                :key="market.code"
                v-show="cat.markets?.[market.code]?.enabled"
                style="
                  height: 15px;
                  padding: 0 4px;
                  border-radius: 2px;
                  font-size: 8.5px;
                  font-weight: 700;
                  font-family: var(--zg-mono);
                "
                :style="{
                  background: belowMin(cat, market.code)
                    ? 'oklch(0.70 0.18 25 / 0.12)'
                    : 'var(--zg-accent-tint)',
                  color: belowMin(cat, market.code)
                    ? 'var(--zg-danger)'
                    : cat.markets?.[market.code]?.enabled
                      ? 'var(--zg-good)'
                      : 'var(--zg-accent)',
                }"
                >{{ market.code }}</span
              >
            </div>
            <div style="display: flex; gap: 4px" @click.stop>
              <button
                class="zcat-act"
                style="opacity: 1"
                @click="statsFor = statsFor === cat.id ? null : cat.id"
              >
                Stats
              </button>
              <button
                class="zcat-act"
                style="opacity: 1"
                @click="openEdit(cat)"
              >
                Edit
              </button>
            </div>
          </div>
          <div
            v-if="statsFor === cat.id"
            style="
              padding: 10px 14px 14px;
              background: var(--zg-bg);
              border-bottom: 1px solid var(--zg-line);
            "
          >
            <div
              style="
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 6px;
              "
            >
              <div
                v-for="market in MARKETS"
                :key="market.code"
                v-show="cat.markets?.[market.code]"
                :style="{
                  background: 'var(--zg-panel)',
                  border: `1px solid ${belowMin(cat, market.code) ? 'oklch(0.70 0.18 25 / 0.4)' : cat.markets?.[market.code]?.enabled ? 'var(--zg-line)' : 'var(--zg-line-soft)'}`,
                  borderRadius: 'var(--zg-radius-md)',
                  padding: '8px 10px',
                  opacity: cat.markets?.[market.code]?.enabled ? 1 : 0.45,
                }"
              >
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 4px;
                  "
                >
                  <span
                    style="
                      font-size: 10px;
                      font-weight: 700;
                      font-family: var(--zg-mono);
                    "
                    >{{ market.code }}</span
                  >
                </div>
                <template v-if="cat.markets?.[market.code]?.enabled">
                  <div
                    :style="{
                      fontSize: '13px',
                      fontWeight: 700,
                      fontFamily: 'var(--zg-mono)',
                      color: belowMin(cat, market.code)
                        ? 'var(--zg-danger)'
                        : 'var(--zg-text)',
                    }"
                  >
                    {{ cat.markets[market.code].listing_count }}
                  </div>
                  <div
                    style="
                      font-size: 9.5px;
                      color: var(--zg-text-dim);
                      margin-top: 1px;
                    "
                  >
                    / {{ cat.markets[market.code].min_listings }} min
                  </div>
                  <div
                    style="
                      font-size: 9.5px;
                      color: var(--zg-accent);
                      font-weight: 700;
                      margin-top: 2px;
                    "
                  >
                    {{ cat.markets[market.code].commission_pct }}% comm.
                  </div>
                </template>
                <div
                  v-else
                  style="
                    font-size: 10px;
                    color: var(--zg-text-xdim);
                    margin-top: 4px;
                  "
                >
                  Disabled
                </div>
              </div>
            </div>
          </div>
          <template v-if="expanded[cat.id]">
            <div
              v-for="ch in cat.children || []"
              :key="ch.id"
              style="
                display: grid;
                grid-template-columns: 1fr 130px 80px 80px 80px 120px 80px;
                gap: 10px;
                padding: 8px 14px 8px 44px;
                background: var(--zg-bg);
                border-bottom: 1px solid var(--zg-line-soft);
                align-items: center;
              "
            >
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  overflow: hidden;
                "
              >
                <span
                  style="
                    color: var(--zg-text-xdim);
                    font-size: 11px;
                    font-family: monospace;
                  "
                  >└</span
                ><span
                  style="
                    font-size: 12.5px;
                    color: var(--zg-text-mid);
                    font-weight: 500;
                  "
                  >{{ ch.label }}</span
                >
              </div>
              <span style="font-size: 11.5px; color: var(--zg-text-dim)">{{
                INTL.find((c) => c.id === ch.mapped_to)?.label ||
                ch.mapped_to ||
                "—"
              }}</span>
              <span
                style="
                  font-family: var(--zg-mono);
                  font-size: 12px;
                  color: var(--zg-accent);
                "
                >{{ ch.commission_pct }}%</span
              >
              <span style="font-size: 11px; color: var(--zg-text-dim)">—</span>
              <span
                style="
                  font-family: var(--zg-mono);
                  font-size: 12px;
                  color: var(--zg-text-mid);
                "
                >{{ ch.listing_count?.toLocaleString() }}</span
              >
              <span />
              <div style="display: flex; gap: 4px">
                <button
                  class="zcat-act"
                  style="opacity: 1"
                  @click="openEdit(ch)"
                >
                  Edit
                </button>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
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
        :rows="perPage"
        :totalRecords="total"
        :first="(page - 1) * perPage"
        @page="onPageChange"
      />
      <span
        v-if="loading"
        style="
          font-family: var(--zg-mono);
          font-size: 12px;
          color: var(--zg-text-xdim);
          margin-left: 16px;
        "
      >
        Loading...
      </span>
      <span
        v-if="error"
        style="
          font-family: var(--zg-mono);
          font-size: 12px;
          color: var(--zg-danger);
          margin-left: 16px;
        "
      >
        {{ error }}
      </span>
    </div>

    <CategoryDrawer
      :open="drawerOpen"
      :cat="editCat"
      :parent-cat="parentCat"
      :is-marketplace="isMarketplace"
      @close="drawerOpen = false"
      @save="() => {}"
    />
    <CategoryBulkImport
      :open="importOpen"
      :tab="isMarketplace ? 'marketplace' : 'products'"
      @close="importOpen = false"
    />
  </div>
</template>
<style scoped>
.zp-search {
  padding: 0px 16px !important;
}
</style>
