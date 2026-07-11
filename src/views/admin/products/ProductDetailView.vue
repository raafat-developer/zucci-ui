<script setup>
/**
 * ProductDetailView — faithful Vue port of ZucciProductDetail. Handles both
 * "new" (blank) and existing products. All sections: Content (synced/EN/AR),
 * Media, Product Details (synced split or live), Market Availability, Variants
 * (attributes + pricing), SEO, Activity — plus header actions and the approval
 * drawer (approve / reject with reason + note).
 */
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ZCP_PRODUCTS, ZCP_DETAIL_10001 } from "@/data/productsData";
import {
  ZCP_ALL_MARKETS,
  STATUS_OPTIONS,
  REJECTION_REASONS,
  isSyncedProduct,
} from "@/data/productsMeta";
import ZSearchableSelect from "@/components/ui/ZSearchableSelect.vue";
import ZDrawer from "@/components/ui/ZDrawer.vue";
import { useClickOutside } from "@/composables/useClickOutside";
import RichTextEditor from "./parts/RichTextEditor.vue";
import LiveDetailsForm from "./parts/LiveDetailsForm.vue";
import AttrSelect from "./parts/AttrSelect.vue";
import VariantsPricingTable from "./parts/VariantsPricingTable.vue";
import MediaManager from "./parts/MediaManager.vue";
import { useProductsStore } from "@/stores/products";
import { useLookup } from "@/composables/useLookup";
import { useLookupStore } from "@/stores/lookup.store";
import { useConfirm } from "@/composables/useConfirm";
import { storeToRefs } from "pinia";
import http from "@/api/http";

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const lookup = useLookup();
const lookupStore = useLookupStore();
const { confirm } = useConfirm();

function blankProduct() {
  return {
    id: null,
    name: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    category: "",
    sizeGuideId: "",
    careInstructionId: "",
    shippingWeight: 0,
    shippingUnit: "kg",
    hsCode: "",
    countryOfOrigin: "Egypt",
    returnPolicy: 1,
    nonReturnableReason: "",
    isVariable: false,
    syncSource: "manual",
    markets: ["AE"],
    attributes: { color: [], size: [], material: [], style: [] },
    variants: [],
    images: [],
    syncedImages: [],
    tags: [],
    approvalStatus: "draft",
    status: "draft",
    brand: "",
    brandId: null,
    vendor: "",
    vendorId: "",
    brandCode: "",
    brandOriginalSku: "",
    fulfillment: "consignment",
    completenessScore: null,
    seoTitleEn: "",
    seoDescEn: "",
    seoTitleAr: "",
    seoDescAr: "",
  };
}

const product = reactive(blankProduct());
const rejectOpen = ref(false);
const selectedRejectionReasonId = ref(null);
const rejectionNote = ref("");
const loadingRejections = ref(false);

const isSynced = computed(() => isSyncedProduct(product));
const activeMkts = computed(() =>
  ZCP_ALL_MARKETS.filter((m) => (product.markets || []).includes(m.code)),
);

const allMarkets = computed(() => {
  const lookupMarkets = lookup.get("markets") || [];
  const flagMap = {
    AE: "🇦🇪",
    SA: "🇸🇦",
    EG: "🇪🇬",
    KW: "🇰🇼",
    QA: "🇶🇦",
    BH: "🇧🇭",
    OM: "🇴🇲",
  };
  return lookupMarkets.map((m) => ({
    code: m.code,
    name: m.label || m.name,
    flag: flagMap[m.code] || "🏳️",
    currency: m.currencyCode || m.currency || "USD",
  }));
});

// category path getter

const getCategoryPath = (catId) => {
  const allCats = lookup.get("categories");
  const cat = allCats.find((c) => c.id === catId);
  if (!cat) return "";
  const buildPath = (c) => {
    const label = c.label || c.name || "";
    if (c.parentId) {
      const parent = allCats.find((p) => p.id === c.parentId);
      if (parent) return buildPath(parent) + " > " + label;
    }
    return label;
  };
  return buildPath(cat);
};

const findCategoryIdByPath = (path) => {
  if (!path) return null;
  const parts = path.split(" > ");
  const lastPart = parts[parts.length - 1].trim().toLowerCase();
  const allCats = lookup.get("categories");
  const found = allCats.find(
    (c) =>
      (c.label || c.name || "").toLowerCase() === lastPart ||
      (c.slug || "").toLowerCase() === lastPart,
  );
  return found ? found.id : null;
};

const getReturnPolicyValue = (policyId) => {
  const policies = lookup.get("returnPolicies");
  const p = policies.find((x) => x.id === policyId);
  if (!p) return "standard";
  const code = (p.code || p.slug || p.name || "").toLowerCase();
  if (code.includes("standard") || code.includes("14")) return "standard";
  if (code.includes("extended") || code.includes("21")) return "extended";
  if (code.includes("non") || code.includes("law")) return "non_returnable";
  return "standard";
};

const findReturnPolicyId = (val) => {
  const policies = lookup.get("returnPolicies");
  const found = policies.find((p) => {
    const code = (p.code || p.slug || p.name || "").toLowerCase();
    if (
      val === "standard" &&
      (code.includes("standard") || code.includes("14"))
    )
      return true;
    if (
      val === "extended" &&
      (code.includes("extended") || code.includes("21"))
    )
      return true;
    if (
      val === "non_returnable" &&
      (code.includes("non") || code.includes("law"))
    )
      return true;
    return code === val.toLowerCase();
  });
  return found ? found.id : 1;
};

const getFulfillmentValue = (modeId) => {
  const modes = lookup.get("fulfillmentModes");
  const m = modes.find((x) => x.id === modeId);
  if (!m) return "consignment";
  const code = (m.code || m.slug || m.name || "").toLowerCase();
  if (code.includes("consignment")) return "consignment";
  if (code.includes("direct") || code.includes("ship")) return "direct_ship";
  return "consignment";
};

const findFulfillmentModeId = (val) => {
  const modes = lookup.get("fulfillmentModes");
  const found = modes.find((m) => {
    const code = (m.code || m.slug || m.name || "").toLowerCase();
    if (val === "consignment" && code.includes("consignment")) return true;
    if (
      val === "direct_ship" &&
      (code.includes("direct") || code.includes("ship"))
    )
      return true;
    return code === val.toLowerCase();
  });
  return found ? found.id : 1;
};

const getShippingUnitValue = (unitId) => {
  const units = lookup.get("shippingUnits");
  const u = units.find((x) => x.id === unitId);
  return u ? (u.code || u.slug || u.symbol || "kg").toLowerCase() : "kg";
};

const findShippingUnitId = (val) => {
  const units = lookup.get("shippingUnits");
  const found = units.find((u) => {
    const code = (u.code || u.slug || u.name || u.symbol || "").toLowerCase();
    return code === val.toLowerCase();
  });
  return found ? found.id : 1;
};

const getBrandValue = (brandId) => {
  const brands = lookup.get("brands");
  const b = brands.find((x) => x.id === brandId);
  return b ? b.name : "";
};

const loadProduct = async () => {
  const id = route.params.id;
  if (id === "new") {
    Object.assign(product, blankProduct());
    return;
  }

  try {
    const apiProduct = await productsStore.fetchDetail(id);
    if (apiProduct) {
      let catId = apiProduct.categoryId;
      if (!catId && apiProduct.categories && apiProduct.categories.length) {
        catId = apiProduct.categories[0].id;
      }
      const categoryPath = catId ? getCategoryPath(catId) : "";

      const returnPolicyVal = getReturnPolicyValue(apiProduct.returnPolicyId);
      const fulfillmentVal = getFulfillmentValue(apiProduct.fulfillmentModeId);
      const shippingUnitVal = getShippingUnitValue(apiProduct.shippingUnitId);
      const brandVal =
        apiProduct.brand?.name || getBrandValue(apiProduct.brandId);

      const locales = lookup.get("locales");
      const enLocale = locales.find((l) => l.code === "en") || { id: 1 };
      const arLocale = locales.find((l) => l.code === "ar") || { id: 2 };

      const enTrans =
        apiProduct.translations?.find(
          (t) =>
            t.localeId === enLocale.id ||
            t.localeCode === "en" ||
            t.locale?.code === "en",
        ) || {};
      const arTrans =
        apiProduct.translations?.find(
          (t) =>
            t.localeId === arLocale.id ||
            t.localeCode === "ar" ||
            t.locale?.code === "ar",
        ) || {};

      const nameVal = enTrans.name || apiProduct.name || "";
      const nameArVal = arTrans.name || apiProduct.nameAr || "";
      const descriptionEnVal =
        enTrans.description ||
        apiProduct.description ||
        apiProduct.descriptionEn ||
        "";
      const descriptionArVal =
        arTrans.description || apiProduct.descriptionAr || "";

      const imagesList =
        apiProduct.images && apiProduct.images.length
          ? apiProduct.images
          : apiProduct.media && apiProduct.media.length
            ? apiProduct.media
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((m) => ({
                  id: m.fileId || m.id,
                  url: m.file?.url || m.url || "",
                  alt: m.file?.filename || m.alt || "",
                  isPrimary: m.isPrimary || false,
                }))
            : [];

      const marketMap = {
        1: "AE",
        2: "SA",
        3: "EG",
        4: "KW",
        5: "BH",
        6: "QA",
        7: "OM",
      };
      const apiMarkets = Array.isArray(apiProduct.markets)
        ? apiProduct.markets
        : Array.isArray(apiProduct.marketSettings)
          ? apiProduct.marketSettings.map((m) => m.marketId ?? m)
          : [];
      const marketsCodes = apiMarkets
        .map((m) => {
          if (m == null) return null;
          let val = m;
          if (typeof m === "object") {
            val = m.id || m.marketId || m.code || m.marketCode || m.name;
          }
          const numVal = Number(val);
          if (!isNaN(numVal) && marketMap[numVal]) {
            return marketMap[numVal];
          }
          return String(val);
        })
        .filter(Boolean);

      const mapped = {
        ...blankProduct(),
        ...apiProduct,
        name: nameVal,
        nameAr: nameArVal,
        descriptionEn: descriptionEnVal,
        descriptionAr: descriptionArVal,
        category: categoryPath,
        // returnPolicy is now the enum id (numeric)
        returnPolicy: apiProduct.returnPolicyId || 1,
        fulfillment: fulfillmentVal,
        shippingUnit: shippingUnitVal,
        brand: brandVal,
        brandId: apiProduct.brandId,
        sizeGuideId: apiProduct.sizeGuideId || "",
        careInstructionId: apiProduct.careInstructionId || "",
        status: apiProduct.status || apiProduct.productStatus || "draft",
        approvalStatus: apiProduct.approvalStatus || "draft",
        attributes: apiProduct.configuredAttributes?.length
          ? Object.fromEntries(
              apiProduct.configuredAttributes.map((a) => [
                a.code || a.slug,
                a.values || [],
              ]),
            )
          : apiProduct.attributes || {
              color: [],
              size: [],
              material: [],
              style: [],
            },
        images: imagesList,
        markets: marketsCodes.length ? marketsCodes : ["AE"],
      };

      Object.assign(product, mapped);
      if (product.id && product.id !== "new") {
        await loadConfiguredAttributes(product.id);
      }
    }
  } catch (e) {
    console.error("Failed to fetch product details:", e);
    window.toast?.error(e.message || "Failed to load product details");
  }
};

onMounted(async () => {
  await lookup.load({
    includeStatuses: true,
    statusDomains: ["product_lifecycle", "product_approval"],
  });
  await loadSystemAttributes();
  await loadProduct();

  if (
    isSynced.value &&
    !product.isVariable &&
    product.syncedAttributes &&
    Object.values(product.syncedAttributes).some((a) => a?.length > 0)
  ) {
    product.isVariable = true;
  }
});

const triggerMediaUpdate = async (newImages) => {
  if (!product.id) return;
  try {
    const payload = {
      media: newImages.map((img, index) => ({
        fileId: img.id,
        sortOrder: index,
        isPrimary: index === 0
      }))
    };
    await http.put(`/catalog/products/${product.id}/media`, payload);
    window.toast?.success("Media updated successfully!");
  } catch (e) {
    console.error("Failed to update media:", e);
    window.toast?.error(e.message || "Failed to update media");
  }
};

const triggerVariantsUpdate = async (newVariants) => {
  if (!product.id) return;
  try {
    const marketMap = { AE: 1, SA: 2, EG: 3, KW: 4, BH: 5, QA: 6, OM: 7 };
    const items = newVariants.map((v, index) => {
      const prices = [];
      Object.entries(v.marketPrices || {}).forEach(([mktCode, val]) => {
        const marketId = marketMap[mktCode];
        if (marketId && val) {
          prices.push({
            marketId,
            price: Number(val),
            compareAtPrice: Number(val) * 1.2,
            currencyId: marketId
          });
        }
      });
      return {
        id: v.id,
        sortOrder: index,
        isActive: v.isActive !== undefined ? v.isActive : true,
        commissionPct: v.commissionPct || 15,
        prices
      };
    });

    await http.patch(`/catalog/products/${product.id}/variants`, { items });
    window.toast?.success("Variants updated successfully!");
  } catch (e) {
    console.error("Failed to update variants:", e);
    window.toast?.error(e.message || "Failed to update variants");
  }
};

const upd = (k, v) => {
  product[k] = v;
  if (k === 'images') {
    triggerMediaUpdate(v);
  } else if (k === 'variants') {
    triggerVariantsUpdate(v);
  }
};
const setBrand = (v) => {
  product.brandId = v;
  const b = lookup.get("brands").find((x) => x.id === v);
  product.brand = b ? b.name : "";
};

const configuredAttributes = ref([]);
const systemAttributes = ref([]);

const getSelectedValueIds = (attrId) => {
  const cfg = configuredAttributes.value.find((a) => a.attributeId === attrId || a.id === attrId);
  if (!cfg) return [];
  return (cfg.valueIds || cfg.values || []).map(v => typeof v === 'object' ? v.id : v);
};

const getValueLabel = (sysAttr, valId) => {
  const opt = (sysAttr.options || []).find((o) => o.id === valId);
  return opt ? (opt.label || opt.name || '') : valId;
};

const getUnselectedValueOptions = (sysAttr) => {
  const selected = getSelectedValueIds(sysAttr.id);
  return (sysAttr.options || []).filter((o) => !selected.includes(o.id)).map((o) => ({
    id: o.id,
    label: o.label || o.name || ''
  }));
};

const saveConfiguredAttributes = async () => {
  if (!product.id || product.id === "new") return;
  try {
    const payload = {
      attributes: configuredAttributes.value.map((attr, idx) => ({
        attributeId: attr.attributeId || attr.id,
        sortOrder: idx,
        valueIds: (attr.valueIds || attr.values || []).map(v => typeof v === 'object' ? v.id : v)
      }))
    };
    await http.put(`/catalog/products/${product.id}/configured-attributes`, payload);
    window.toast?.success("Configured attributes saved successfully!");
  } catch (err) {
    console.error("Failed to save configured attributes:", err);
    window.toast?.error("Failed to save configured attributes");
  }
};

const selectValue = (attrId, valId) => {
  if (!valId) return;
  let cfg = configuredAttributes.value.find((a) => a.attributeId === attrId || a.id === attrId);
  if (!cfg) {
    cfg = { attributeId: attrId, sortOrder: configuredAttributes.value.length, valueIds: [] };
    configuredAttributes.value.push(cfg);
  }
  const currentValIds = (cfg.valueIds || cfg.values || []).map(v => typeof v === 'object' ? v.id : v);
  if (!currentValIds.includes(valId)) {
    if (cfg.valueIds) {
      cfg.valueIds.push(valId);
    } else {
      cfg.values = [...(cfg.values || []), valId];
    }
  }
  saveConfiguredAttributes();
};

const deselectValue = (attrId, valId) => {
  let cfg = configuredAttributes.value.find((a) => a.attributeId === attrId || a.id === attrId);
  if (cfg) {
    if (cfg.valueIds) {
      cfg.valueIds = cfg.valueIds.filter((id) => id !== valId);
    } else if (cfg.values) {
      cfg.values = cfg.values.filter((v) => (typeof v === 'object' ? v.id : v) !== valId);
    }
    const remainingIds = getSelectedValueIds(attrId);
    if (remainingIds.length === 0) {
      configuredAttributes.value = configuredAttributes.value.filter((a) => (a.attributeId || a.id) !== attrId);
    }
    saveConfiguredAttributes();
  }
};

const loadConfiguredAttributes = async (productId) => {
  try {
    const res = await http.get(`/catalog/products/${productId}/configured-attributes`);
    const items = res.data?.attributes || res.data?.data?.attributes || res.data || [];
    configuredAttributes.value = items.map(item => ({
      attributeId: item.attributeId || item.id,
      valueIds: (item.valueIds || item.values || []).map(v => typeof v === 'object' ? v.id : v)
    }));
  } catch (err) {
    console.error("Failed to load configured attributes:", err);
  }
};

const loadSystemAttributes = async () => {
  try {
    const res = await http.get("/catalog/attributes", { params: { perPage: 100 } });
    systemAttributes.value = res.data?.data || res.data || res.items || [];
  } catch (err) {
    console.error("Failed to load system attributes:", err);
  }
};

const updFromTable = (k, v) => {
  product[k] = v;
  if (k === 'variants') {
    triggerVariantsUpdate(v);
  } else if (k === 'images') {
    triggerMediaUpdate(v);
  }
};

const buildPayload = () => {
  const selectedMarketIds = (product.markets || [])
    .map((code) => {
      const marketMap = { AE: 1, SA: 2, EG: 3, KW: 4, BH: 5, QA: 6, OM: 7 };
      return marketMap[code];
    })
    .filter(Boolean);

  const locales = lookup.get("locales");
  const enLocale = locales.find((l) => l.code === "en") || { id: 1 };
  const arLocale = locales.find((l) => l.code === "ar") || { id: 2 };

  const translations = [];
  if (product.name || product.descriptionEn) {
    translations.push({
      localeId: enLocale.id || 1,
      name: product.name || "",
      description: product.descriptionEn || "",
    });
  }
  if (product.nameAr || product.descriptionAr) {
    translations.push({
      localeId: arLocale.id || 2,
      name: product.nameAr || "",
      description: product.descriptionAr || "",
    });
  }

  return {
    brandId: product.brandId,
    name: product.name,
    nameAr: product.nameAr,
    descriptionEn: product.descriptionEn,
    descriptionAr: product.descriptionAr,
    sku: product.sku || `SKU-${Date.now()}`,
    markets: selectedMarketIds,
    categoryId: findCategoryIdByPath(product.category),
    fulfillmentModeId: findFulfillmentModeId(product.fulfillment),
    returnPolicyId:
      typeof product.returnPolicy === "number" ? product.returnPolicy : 1,
    shippingUnitId: findShippingUnitId(product.shippingUnit),
    gender: product.gender || 3,
    isVariable: product.isVariable,
    images: (product.images || []).map((img) => img.id || img.url),
    configuredAttributes: [],
    translations,
    variants: product.isVariable
      ? product.variants
      : [
          {
            sku: `${product.sku || "SKU"}-${Date.now()}`,
            sortOrder: 0,
            isActive: true,
            commissionPct: 15,
            attributes: [],
            prices: selectedMarketIds.map((marketId) => ({
              marketId,
              price: 299,
              compareAtPrice: 349,
              currencyId: 1,
            })),
          },
        ],
    productStatusId: product.productStatusId || 101,
    approvalStatusId: product.approvalStatusId || 111,
  };
};

const saveProduct = async () => {
  try {
    const payload = buildPayload();
    await productsStore.updateProduct(product.id, payload);
    window.toast?.success("Product saved successfully!");
    await loadProduct();
  } catch (e) {
    window.toast?.error(e.message || "Failed to save product");
  }
};

const submitForReviewClick = async () => {
  const ok = await confirm({
    title: "Submit for Review",
    message: `Submit "${product.name || "this product"}" for review? Zucci admins will be notified to review and approve the product before it goes live.`,
    confirmText: "Submit for Review",
    cancelText: "Cancel",
    variant: "primary",
  });
  if (!ok) return;
  try {
    await productsStore.submitForReview(product.id);
    window.toast?.success("Product submitted for review!");
    await loadProduct();
  } catch (e) {
    window.toast?.error(e.message || "Failed to submit product for review");
  }
};

const handleApproveClick = async () => {
  const ok = await confirm({
    title: "Approve Product",
    message: `Are you sure you want to approve "${product.name || "this product"}"? This will make the product live in all active markets.`,
    confirmText: "Approve",
    cancelText: "Cancel",
    variant: "primary",
  });

  if (ok) {
    try {
      await productsStore.approve(product.id);
      await loadProduct();
    } catch (e) {
      window.toast?.error(e.message || "Failed to approve product");
    }
  }
};

const handleRejectClick = () => {
  selectedRejectionReasonId.value = null;
  rejectionNote.value = '';
  rejectOpen.value = true;
};

const submitRejection = async () => {
  if (!selectedRejectionReasonId.value) {
    window.toast?.warn("Please select a rejection reason");
    return;
  }

  try {
    const payload = {
      rejectionReason: selectedRejectionReasonId.value,
      rejectionNote: rejectionNote.value,
    };
    await productsStore.reject(product.id, payload);
    rejectOpen.value = false;
    await loadProduct();
  } catch (e) {
    window.toast?.error(e.message || "Failed to reject product");
  }
};

const toggleMarket = (code) => {
  const m = product.markets || [];
  product.markets = m.includes(code)
    ? m.filter((x) => x !== code)
    : [...m, code];
};

// Status dropdown
const {
  isOpen: statusOpen,
  rootRef: statusRef,
  toggle: toggleStatus,
  close: closeStatus,
} = useClickOutside();
const productStatuses = computed(() => lookup.getStatus("product_lifecycle"));

const curStatus = computed(() => {
  const match = STATUS_OPTIONS.find((o) => o.value === product.status);
  if (match) return match;
  const matchLookup = productStatuses.value.find(
    (s) =>
      s.code === product.status ||
      s.slug === product.status ||
      s.value === product.status,
  );
  return matchLookup
    ? {
        value: product.status,
        label: matchLookup.label || matchLookup.name,
        color: "var(--zg-good)",
      }
    : STATUS_OPTIONS[0];
});

const pickStatus = (v) => {
  product.status = v;
  const matchLookup = productStatuses.value.find(
    (s) => s.code === v || s.slug === v || s.value === v,
  );
  if (matchLookup) {
    product.productStatusId = matchLookup.id;
  }
  closeStatus();
};

const statusOptions = computed(() => {
  const options = [];
  productStatuses.value.forEach((s) => {
    const val =
      s.code || s.slug || s.value || (s.label || s.name || "").toLowerCase();
    const existing = STATUS_OPTIONS.find((o) => o.value === val);
    options.push({
      value: val,
      label: s.label || s.name,
      color: existing ? existing.color : "var(--zg-text)",
    });
  });
  return options.length ? options : STATUS_OPTIONS;
});

const brandsList = computed(() => {
  const lookupBrands = lookup.get("brands");
  if (lookupBrands.length) {
    return lookupBrands.map((b) => ({ value: b.id, label: b.name }));
  }
  return [];
});

const rejectionReasonOptions = computed(() => {
  const list = lookup.getEnum("rejection_reason") || [];
  return list
    .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
    .map((item) => ({
      value: item.id,
      label: item.label || item.name,
    }));
});
const rejectReasons = rejectionReasonOptions;
const attrs = ["color", "size", "material", "style"];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const seoCols = [
  {
    dir: "ltr",
    title: "Search Engine Listing",
    lang: "English",
    tLbl: "Page Title",
    dLbl: "Meta Description",
    tV: "seoTitleEn",
    dV: "seoDescEn",
    tPh: "Enter page title…",
    dPh: "Enter meta description…",
    tSuf: "/ 70 characters",
    dSuf: "/ 320 characters",
  },
  {
    dir: "rtl",
    title: "قائمة محرك البحث",
    lang: "عربي",
    tLbl: "عنوان الصفحة",
    dLbl: "ميتا الوصف",
    tV: "seoTitleAr",
    dV: "seoDescAr",
    tPh: "أدخل عنوان الصفحة…",
    dPh: "أدخل ميتا الوصف…",
    tSuf: "من 70 حرفاً",
    dSuf: "من 320 حرفاً",
  },
];
</script>

<template>
  <div class="zp-detail-wrap">
    <!-- Header -->
    <div class="zp-detail-header">
      <button
        type="button"
        class="zp-back-btn"
        @click="router.push('/admin/products')"
      >
        <svg
          viewBox="0 0 14 10"
          width="12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        >
          <path d="M5 1L1 5L5 9 M1 5h12" />
        </svg>
        Back
      </button>
      <div class="zp-detail-title">{{ product.name || "New Product" }}</div>
      <div class="zp-detail-meta">
        <div
          v-if="!isSynced"
          style="position: relative; display: inline-block; min-width: 220px"
        >
          <ZSearchableSelect
            :model-value="product.brandId || ''"
            :options="brandsList"
            placeholder="Assign brand…"
            @update:model-value="setBrand"
          />
        </div>
        <span v-else class="zen-pd-ref">{{ product.brand }}</span>
        <span
          v-if="product.sku"
          class="zen-field-mono"
          style="font-size: 10px"
          >{{ product.sku }}</span
        >

        <!-- Status dropdown -->
        <div ref="statusRef" style="position: relative">
          <button
            type="button"
            class="zp-status-selector"
            :style="{ color: curStatus.color }"
            @click="toggleStatus"
          >
            <span
              class="zp-status-dot"
              :style="{ background: curStatus.color }"
            />
            {{ curStatus.label }}
            <svg
              viewBox="0 0 10 6"
              width="8"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            >
              <path d="M1 1L5 5L9 1" />
            </svg>
          </button>
          <div v-show="statusOpen" class="zp-status-dd">
            <button
              v-for="o in statusOptions"
              :key="o.value"
              type="button"
              class="zp-status-dd-item"
              :style="{
                color:
                  o.value === product.status ? o.color : 'var(--zg-text-mid)',
              }"
              @click="pickStatus(o.value)"
            >
              <span class="zp-status-dot" :style="{ background: o.color }" />
              {{ o.label }}
            </button>
          </div>
        </div>
        <span
          v-if="product.approvalStatus === 'pending'"
          style="
            font-family: var(--zg-mono);
            font-size: 10px;
            color: var(--zg-warn);
          "
          >· Pending Review</span
        >
      </div>
      <div class="zp-detail-actions">
        <button
          type="button"
          class="zen-btn-ghost"
          style="height: 28px; font-size: 11px"
        >
          Preview
        </button>
        <template v-if="product.approvalStatus === 'pending'">
          <button
            type="button"
            class="zen-btn-primary"
            style="height: 28px; font-size: 11px; background: var(--zg-good)"
            @click="handleApproveClick"
          >
            Approve
          </button>
          <button
            type="button"
            class="zen-btn-primary"
            style="height: 28px; font-size: 11px; background: var(--zg-danger)"
            @click="handleRejectClick"
          >
            Reject
          </button>
        </template>
        <!-- Submit for Review: show for draft/rejected, hide for pending/approved -->
        <button
          v-else-if="['draft', 'rejected'].includes(product.approvalStatus)"
          type="button"
          class="zen-btn-ghost"
          style="height: 28px; font-size: 11px"
          :disabled="productsStore.saving"
          @click="submitForReviewClick"
        >
          {{ productsStore.saving ? "Submitting…" : "Submit for Review" }}
        </button>
        <button
          type="button"
          class="zen-btn-primary"
          style="height: 28px; font-size: 11px"
          @click="saveProduct"
        >
          Save
        </button>
      </div>
    </div>

    <!-- Rejection banner -->
    <div
      v-if="product.approvalStatus === 'rejected' && product.rejectionReason"
      class="zp-rejection-banner"
    >
      <svg
        viewBox="0 0 14 14"
        width="13"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      >
        <circle cx="7" cy="7" r="5.5" />
        <line x1="7" y1="4.5" x2="7" y2="7.5" />
        <circle cx="7" cy="9.5" r="0.5" fill="currentColor" />
      </svg>
      <strong>Rejected:</strong> {{ product.rejectionReason }}
    </div>

    <!-- Completeness -->
    <div
      v-if="product.completenessScore != null"
      class="zp-completeness-header"
    >
      <span class="zf-kpi-lbl">Completeness</span>
      <div class="zp-completeness-track" style="flex: 1; max-width: 180px">
        <div
          class="zp-completeness-fill"
          :style="{
            width: product.completenessScore + '%',
            background:
              product.completenessScore >= 80
                ? 'var(--zg-good)'
                : product.completenessScore >= 50
                  ? 'var(--zg-warn)'
                  : 'var(--zg-danger)',
          }"
        />
      </div>
      <span class="zp-completeness-pct">{{ product.completenessScore }}%</span>
    </div>

    <div class="zp-detail-body">
      <!-- CONTENT -->
      <div class="zp-section-label">
        {{ isSynced ? "Content — Synced vs. Live" : "Content" }}
      </div>
      <div class="zp-content-grid" :class="{ 'has-synced': isSynced }">
        <div v-if="isSynced" class="zp-content-col">
          <div class="zp-content-col-head">
            <span class="zp-content-col-title">Synced</span
            ><span class="zp-synced-badge">from store</span>
          </div>
          <div class="zp-name-input zp-name-readonly">
            {{ product.name || "—" }}
          </div>
          <div
            class="zp-rte-preview"
            v-html="product.descriptionEn || 'No synced description'"
          />
        </div>
        <div class="zp-content-col">
          <div class="zp-content-col-head">
            <span class="zp-content-col-title">Live Content</span>
            <span class="zp-lang-badge">English</span>
            <span v-if="isSynced" class="zp-live-dot" />
          </div>
          <input
            class="zp-name-input"
            :value="product.name"
            placeholder="Enter product name here…"
            @input="upd('name', $event.target.value)"
          />
          <RichTextEditor
            :model-value="product.descriptionEn"
            dir="ltr"
            placeholder="Enter product description here…"
            @update:model-value="(v) => upd('descriptionEn', v)"
          />
        </div>
        <div class="zp-content-col">
          <div class="zp-content-col-head" dir="rtl">
            <span class="zp-content-col-title">محتوى المنتج المباشر</span>
            <span class="zp-lang-badge">عربي</span>
            <span
              v-if="String(product.arabicStatus || '').startsWith('ai')"
              class="zp-ai-badge"
              >AI</span
            >
            <button
              type="button"
              class="zp-translate-btn"
              style="margin-left: auto"
            >
              Translate
            </button>
          </div>
          <input
            class="zp-name-input"
            dir="rtl"
            :value="product.nameAr"
            placeholder="أدخل اسم المنتج هنا..."
            @input="upd('nameAr', $event.target.value)"
          />
          <RichTextEditor
            :model-value="product.descriptionAr"
            dir="rtl"
            placeholder="أدخل وصف المنتج هنا..."
            @update:model-value="(v) => upd('descriptionAr', v)"
          />
        </div>
      </div>

      <!-- MEDIA -->
      <div class="zp-section-label">Media</div>
      <MediaManager
        :images="product.images || []"
        :synced-images="product.syncedImages || []"
        :is-synced="isSynced && (product.syncedImages || []).length > 0"
        @update:images="(v) => upd('images', v)"
      />

      <!-- PRODUCT DETAILS -->
      <div class="zp-section-label">Product Details</div>
      <div v-if="isSynced" class="zp-synced-details-split">
        <div class="zen-card" style="padding: 14px">
          <div class="zp-content-col-head" style="margin-bottom: 10px">
            <span class="zp-content-col-title">Synced Product Details</span>
            <span class="zp-synced-badge">from store</span>
          </div>
          <div class="zen-bank-fields">
            <div class="zen-bank-field">
              <div class="zen-field-label">Tags</div>
              <div
                style="
                  display: flex;
                  gap: 4px;
                  flex-wrap: wrap;
                  margin-top: 4px;
                "
              >
                <span
                  v-for="t in (product.syncedData || {}).tags ||
                  product.syncedTags ||
                  []"
                  :key="t"
                  class="zen-brand-cat-tag"
                  >{{ t }}</span
                >
              </div>
            </div>
            <div class="zen-bank-field">
              <div class="zen-field-label">Shipping Weight</div>
              <div class="zen-field-val">
                {{
                  (product.syncedData || {}).shippingWeight ||
                  product.syncedShippingWeight ||
                  "—"
                }}
                {{
                  (product.syncedData || {}).shippingUnit ||
                  product.syncedShippingUnit ||
                  ""
                }}
              </div>
            </div>
            <div class="zen-bank-field">
              <div class="zen-field-label">Brand SKU</div>
              <div class="zen-field-val zen-field-mono" style="font-size: 11px">
                {{ product.brandOriginalSku || "N/A" }}
              </div>
            </div>
            <div class="zen-bank-field">
              <div class="zen-field-label">Synced Category</div>
              <div class="zen-field-val">
                {{
                  (product.syncedData || {}).category ||
                  product.syncedCategory ||
                  product.category ||
                  "—"
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="zen-card" style="padding: 14px">
          <div class="zp-content-col-head" style="margin-bottom: 10px">
            <span class="zp-content-col-title">Live Product Details</span>
            <span class="zp-live-dot" />
          </div>
          <LiveDetailsForm :product="product" @update="upd" />
        </div>
      </div>
      <div v-else class="zen-card" style="padding: 14px">
        <LiveDetailsForm :product="product" @update="upd" />
      </div>

      <!-- MARKET AVAILABILITY -->
      <div class="zp-section-label">Market Availability</div>
      <div class="zp-markets-grid">
        <label
          v-for="m in allMarkets"
          :key="m.code"
          class="zp-market-card"
          :class="{ 'is-active': (product.markets || []).includes(m.code) }"
          style="cursor: pointer"
        >
          <div class="zp-market-card-head">
            <span style="font-size: 14px">{{ m.flag }}</span>
            <span class="zp-market-name">{{ m.name }}</span>
            <input
              type="checkbox"
              :checked="(product.markets || []).includes(m.code)"
              @change="toggleMarket(m.code)"
            />
          </div>
          <div class="zp-market-currency">{{ m.currency }}</div>
          <span
            v-if="
              (product.markets || []).includes(m.code) &&
              product.approvalStatus === 'approved'
            "
            class="zen-bst zen-bst--active"
            style="font-size: 9px"
            >Live</span
          >
          <span
            v-else-if="
              (product.markets || []).includes(m.code) &&
              product.approvalStatus === 'pending'
            "
            class="zen-bst zen-bst--pending"
            style="font-size: 9px"
            >Pending</span
          >
        </label>
      </div>

      <!-- VARIANTS -->
      <div class="zp-section-label">
        Live Variants
        <label class="zp-variable-toggle">
          <input
            type="checkbox"
            :checked="!!product.isVariable"
            @change="upd('isVariable', $event.target.checked)"
          />
          <span>{{
            product.isVariable
              ? "Switch back to simple product"
              : "Switch to variable product"
          }}</span>
        </label>
      </div>

      <template v-if="product.isVariable">
        <div class="zp-attr-grid">
          <div v-for="attr in attrs" :key="attr" class="zf-props-field">
            <label class="zf-props-label">{{ cap(attr) }}</label>
            <div
              v-if="isSynced"
              style="
                margin-bottom: 6px;
                padding: 6px 10px;
                background: oklch(0.82 0.14 215 / 0.07);
                border: 1px solid oklch(0.82 0.14 215 / 0.2);
                border-radius: 5px;
              "
            >
              <div
                style="
                  font-size: 9.5px;
                  color: oklch(0.82 0.14 215);
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                  margin-bottom: 4px;
                "
              >
                Synced
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px">
                <span
                  v-for="v in (product.syncedAttributes || {})[attr] || []"
                  :key="v"
                  class="zp-sync-val-pill"
                  style="font-size: 11px"
                  >{{ v }}</span
                >
                <span
                  v-if="!((product.syncedAttributes || {})[attr] || []).length"
                  style="font-size: 11px; color: var(--zg-text-dim)"
                  >—</span
                >
              </div>
            </div>
            <AttrSelect
              :attr="attr"
              :values="(product.attributes || {})[attr] || []"
              @update:values="(vals) => updAttr(attr, vals)"
            />
          </div>
        </div>
        <VariantsPricingTable
          :product="product"
          :active-mkts="activeMkts"
          @update="updFromTable"
        />
      </template>
      <div
        v-else
        class="zp-variants-empty"
        style="
          opacity: 0.6;
          font-size: 12px;
          color: var(--zg-text-dim);
          padding: 10px 14px;
          border: 1px solid var(--zg-line);
          border-radius: var(--zg-radius-md);
        "
      >
        Simple product — no variants. Toggle above to add variations.
      </div>

      <!-- SEO -->
      <div class="zp-section-label">Search Engine Listing</div>
      <div class="zp-seo-grid">
        <div v-for="col in seoCols" :key="col.dir" class="zp-seo-col">
          <div
            class="zp-content-col-head"
            :dir="col.dir"
            style="margin-bottom: 10px"
          >
            <span class="zp-content-col-title">{{ col.title }}</span>
            <span class="zp-lang-badge">{{ col.lang }}</span>
          </div>
          <label class="zf-props-label">{{ col.tLbl }}</label>
          <input
            class="zp-field-h"
            :dir="col.dir"
            style="width: 100%; box-sizing: border-box; margin-bottom: 4px"
            :value="product[col.tV] || ''"
            :placeholder="col.tPh"
            @input="upd(col.tV, $event.target.value)"
          />
          <span class="zp-char-count" :dir="col.dir"
            >{{ (product[col.tV] || "").length }} {{ col.tSuf }}</span
          >
          <label class="zf-props-label" style="margin-top: 10px">{{
            col.dLbl
          }}</label>
          <textarea
            class="zp-seo-textarea"
            :dir="col.dir"
            rows="4"
            :value="product[col.dV] || ''"
            :placeholder="col.dPh"
            @input="upd(col.dV, $event.target.value)"
          />
          <span class="zp-char-count" :dir="col.dir"
            >{{ (product[col.dV] || "").length }} {{ col.dSuf }}</span
          >
        </div>
      </div>

      <!-- ACTIVITY -->
      <template v-if="(product.activityLog || []).length">
        <div class="zp-section-label">Activity</div>
        <div class="zen-act-timeline">
          <div
            v-for="(e, i) in product.activityLog"
            :key="i"
            class="zen-act-entry"
          >
            <div class="zen-act-entry-left">
              <div
                class="zen-act-icon-dot"
                :class="`zen-act-icon-dot--${e.role}`"
              />
              <div
                v-if="i < product.activityLog.length - 1"
                class="zen-act-vline"
              />
            </div>
            <div class="zen-act-entry-body">
              <div class="zen-act-entry-head">
                <span class="zen-act-actor">{{ e.actor }}</span
                ><span
                  class="zen-act-role"
                  :class="`zen-act-role--${e.role}`"
                  >{{ e.role.toUpperCase() }}</span
                >
              </div>
              <div class="zen-act-action">{{ e.action }}</div>
              <div class="zen-act-time">{{ e.date }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Reject drawer -->
    <ZDrawer
      :open="rejectOpen"
      title="Reject Product"
      :subtitle="product.name"
      :width="420"
      @close="rejectOpen = false"
    >
      <div style="display: flex; flex-direction: column; gap: 12px">
          <div class="zf-props-field">
            <label class="zf-props-label">Rejection Reason *</label>
            <ZSearchableSelect
              v-model="selectedRejectionReasonId"
              :options="rejectReasons"
              placeholder="Select reason…"
            />
          </div>
          <div class="zf-props-field">
            <label class="zf-props-label">Note to Vendor</label>
            <textarea
              class="zen-notes-textarea"
              style="margin-top: 0"
              rows="3"
              v-model="rejectionNote"
              placeholder="What specifically needs to be fixed?"
            />
          </div>
      </div>
      <template #footer>
        <button class="zen-btn-ghost" @click="rejectOpen = false">
          Cancel
        </button>
        <button
          class="zen-btn-primary"
          style="background: var(--zg-danger)"
          :style="{ opacity: selectedRejectionReasonId ? 1 : 0.4 }"
          :disabled="!selectedRejectionReasonId || loadingRejections"
          @click="submitRejection"
        >
          Reject Product
        </button>
      </template>
    </ZDrawer>
  </div>
</template>
