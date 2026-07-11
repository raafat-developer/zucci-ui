<template>
  <div class="zp-detail-wrap">
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
          <path d="M5 1L1 5L5 9 M1 5h12"></path>
        </svg>
        Back
      </button>
      <div class="zp-detail-title">New Product</div>
      <div class="zp-detail-meta">
        <div
          style="position: relative; display: inline-block; min-width: 200px"
        >
          <ZSearchableSelect
            v-model="selectedBrandId"
            :options="brandsList"
            placeholder="Select brand…"
          />
        </div>
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
                  o.value === selectedProductStatus ? o.color : 'var(--zg-text-mid)',
              }"
              @click="pickStatus(o.value)"
            >
              <span class="zp-status-dot" :style="{ background: o.color }" />
              {{ o.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="zp-detail-actions">
        <button
          type="button"
          class="zen-btn-ghost"
          style="height: 28px; font-size: 11px"
        >
          Preview
        </button>
        <button
          type="button"
          class="zen-btn-primary"
          style="height: 28px; font-size: 11px"
          @click="saveProduct()"
        >
          Save
        </button>
      </div>
    </div>
    <div class="zp-detail-body">
      <div class="zp-section-label">Content</div>
      <div class="zp-content-grid">
        <div class="zp-content-col">
          <div class="zp-content-col-head">
            <span class="zp-content-col-title">Live Content</span>
            <span class="zp-lang-badge">English</span>
            <button
              type="button"
              class="zp-translate-btn"
              style="margin-left: auto"
              :disabled="translating"
              @click="translateToEn()"
            >
              Translate
            </button>
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
            <button
              type="button"
              class="zp-translate-btn"
              style="margin-left: auto"
              :disabled="translating"
              @click="translateToAr()"
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
      <div class="zp-section-label">Media</div>
      <MediaManager
        :images="product.images || []"
        @update:images="(v) => upd('images', v)"
      />
      <div class="zp-section-label">Product Details</div>
      <div class="zen-card" style="padding: 14px">
        <LiveDetailsForm :product="product" @update="upd" />
      </div>
      <div class="zp-section-label">Market Availability</div>
      <div class="zp-markets-grid">
        <label
          class="zp-market-card"
          :class="{ 'is-active': selectedMarketCodes.includes(market.code) }"
          style="cursor: pointer"
          v-for="market in markets"
          :key="market.code"
        >
          <div class="zp-market-card-head">
            <span style="font-size: 14px">{{ market.flag }}</span>
            <span class="zp-market-name">{{ market.name }}</span>
            <input
              type="checkbox"
              :value="market.code"
              v-model="selectedMarketCodes"
            />
          </div>
          <div class="zp-market-currency">{{ market.currency }}</div>
        </label>
      </div>
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
      <div class="zp-section-label">Search Engine Listing</div>
      <div class="zp-seo-grid">
        <div class="zp-seo-col">
          <div
            class="zp-content-col-head"
            dir="ltr"
            style="margin-bottom: 10px"
          >
            <span class="zp-content-col-title">Search Engine Listing</span
            ><span class="zp-lang-badge">English</span>
          </div>
          <label class="zf-props-label">Page Title</label
          ><input
            class="zp-field-h"
            dir="ltr"
            placeholder="Enter page title…"
            v-model="seoTitleEn"
            style="width: 100%; box-sizing: border-box; margin-bottom: 4px"
          /><span class="zp-char-count" dir="ltr"
            >{{ seoTitleEn.length }} / 70 characters</span
          ><label class="zf-props-label" style="margin-top: 10px"
            >Meta Description</label
          >
          <textarea
            class="zp-seo-textarea"
            dir="ltr"
            rows="4"
            placeholder="Enter meta description…"
            v-model="seoDescEn"
          ></textarea>
          <span class="zp-char-count" dir="ltr"
            >{{ seoDescEn.length }} / 320 characters</span
          >
        </div>
        <div class="zp-seo-col">
          <div
            class="zp-content-col-head"
            dir="rtl"
            style="margin-bottom: 10px"
          >
            <span class="zp-content-col-title">قائمة محرك البحث</span
            ><span class="zp-lang-badge">عربي</span>
          </div>
          <label class="zf-props-label">عنوان الصفحة</label
          ><input
            class="zp-field-h"
            dir="rtl"
            placeholder="أدخل عنوان الصفحة…"
            v-model="seoTitleAr"
            style="width: 100%; box-sizing: border-box; margin-bottom: 4px"
          /><span class="zp-char-count" dir="rtl"
            >{{ seoTitleAr.length }} من 70 حرفاً</span
          ><label class="zf-props-label" style="margin-top: 10px"
            >ميتا الوصف</label
          >
          <textarea
            class="zp-seo-textarea"
            dir="rtl"
            rows="4"
            placeholder="أدخل ميتا الوصف…"
            v-model="seoDescAr"
          ></textarea>
          <span class="zp-char-count" dir="rtl"
            >{{ seoDescAr.length }} من 320 حرفاً</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProductsStore } from "../../../stores/products";
import { storeToRefs } from "pinia";
import { useLookup } from "@/composables/useLookup";
import Cookies from "js-cookie";
import RichTextEditor from "./parts/RichTextEditor.vue";
import MediaManager from "./parts/MediaManager.vue";
import LiveDetailsForm from "./parts/LiveDetailsForm.vue";
import ZSearchableSelect from "@/components/ui/ZSearchableSelect.vue";
import { useClickOutside } from "@/composables/useClickOutside";
import { STATUS_OPTIONS } from "@/data/productsMeta";
import AttrSelect from "./parts/AttrSelect.vue";
import VariantsPricingTable from "./parts/VariantsPricingTable.vue";

const router = useRouter();
const productStore = useProductsStore();
const { saving } = storeToRefs(productStore);
const { createProduct } = productStore;
const lookup = useLookup();
const product = ref({
  name: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  images: [],
  category: "",
  sizeGuideId: "",
  careInstructionId: "",
  shippingWeight: 0,
  shippingUnit: "kg",
  hsCode: "",
  returnPolicy: 1,
  fulfillment: "consignment",
  tags: [],
  isVariable: false,
  attributes: { color: [], size: [], material: [], style: [] },
  variants: [],
});

const upd = (k, v) => {
  product.value[k] = v;
};
const seoTitleEn = ref("");
const seoDescEn = ref("");
const seoTitleAr = ref("");
const seoDescAr = ref("");

const selectedMarketCodes = ref(["AE", "SA", "EG"]);

const markets = computed(() => {
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
    currency: m.currencyCode || m.currency,
  }));
});

// Lookup data
const brands = computed(() => lookup.get("brands"));
const brandsList = computed(() => {
  return lookup.get("brands").map((b) => ({
    value: b.id,
    label: b.name || b.translations?.[0]?.name || b.slug || b.id,
  }));
});
const categories = computed(() => lookup.get("categories"));
const attributes = computed(() => lookup.get("attributes"));
const fulfillmentModes = computed(() => lookup.get("fulfillmentModes"));
const returnPolicies = computed(() => lookup.get("returnPolicies"));
const shippingUnits = computed(() => lookup.get("shippingUnits"));
const genders = computed(() => lookup.getEnum("gender"));
const productStatuses = computed(() => lookup.getStatus("product_lifecycle"));

// Status dropdown setup
const {
  isOpen: statusOpen,
  rootRef: statusRef,
  toggle: toggleStatus,
  close: closeStatus,
} = useClickOutside();

const selectedProductStatus = ref("draft");

const curStatus = computed(() => {
  const match = STATUS_OPTIONS.find((o) => o.value === selectedProductStatus.value);
  if (match) return match;
  const matchLookup = productStatuses.value.find(
    (s) =>
      s.code === selectedProductStatus.value ||
      s.slug === selectedProductStatus.value ||
      s.value === selectedProductStatus.value,
  );
  return matchLookup
    ? {
        value: selectedProductStatus.value,
        label: matchLookup.label || matchLookup.name,
        color: "var(--zg-good)",
      }
    : STATUS_OPTIONS[0];
});

const pickStatus = (v) => {
  selectedProductStatus.value = v;
  const matchLookup = productStatuses.value.find(
    (s) => s.code === v || s.slug === v || s.value === v,
  );
  if (matchLookup) {
    selectedProductStatusId.value = matchLookup.id;
  }
  closeStatus();
};

const statusOptions = computed(() => {
  const options = [];
  productStatuses.value.forEach((s) => {
    const val = s.code || s.slug || s.value || s.name?.toLowerCase();
    const existing = STATUS_OPTIONS.find((o) => o.value === val);
    options.push({
      value: val,
      label: s.label || s.name,
      color: existing ? existing.color : "var(--zg-text)",
    });
  });
  return options.length ? options : STATUS_OPTIONS;
});
const approvalStatuses = computed(() => lookup.getStatus("product_approval"));
const currencies = computed(() => lookup.get("currencies"));

// Form fields
const selectedBrandId = ref(null);
const selectedCategoryId = ref(null);
const selectedFulfillmentModeId = ref(1);
const selectedReturnPolicyId = ref(1);
const selectedShippingUnitId = ref(1);
const selectedGenderId = ref(3);
const selectedProductStatusId = ref(101);
const selectedApprovalStatusId = ref(111);
const productSku = ref("");

const attrs = ["color", "size", "material", "style"];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const updAttr = (attr, vals) => {
  product.value.attributes = { ...product.value.attributes, [attr]: vals };
};

const updFromTable = (k, v) => {
  product.value[k] = v;
};

const activeMkts = computed(() => {
  return markets.value.filter((m) => selectedMarketCodes.value.includes(m.code));
});

// Load lookup data on mount
onMounted(async () => {
  await lookup.load({
    includeStatuses: true,
    statusDomains: ["product_lifecycle", "product_approval"],
    markets: true,
  });
  console.log(productStatuses.value);
});

const translating = ref(false);

async function translateText(text, targetLang) {
  if (!text) return "";
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
    );
    const data = await res.json();
    return data[0].map((s) => s[0]).join("");
  } catch (e) {
    console.error("Translation failed:", e);
    return text;
  }
}

async function translateToAr() {
  if (translating.value) return;
  translating.value = true;
  try {
    if (product.value.name) {
      product.value.nameAr = await translateText(product.value.name, "ar");
    }
    if (product.value.descriptionEn) {
      product.value.descriptionAr = await translateText(
        product.value.descriptionEn,
        "ar",
      );
    }
    window.toast?.success("Translated to Arabic successfully!");
  } catch (err) {
    window.toast?.error("Translation failed: " + err.message);
  } finally {
    translating.value = false;
  }
}

async function translateToEn() {
  if (translating.value) return;
  translating.value = true;
  try {
    if (product.value.nameAr) {
      product.value.name = await translateText(product.value.nameAr, "en");
    }
    if (product.value.descriptionAr) {
      product.value.descriptionEn = await translateText(
        product.value.descriptionAr,
        "en",
      );
    }
    window.toast?.success("Translated to English successfully!");
  } catch (err) {
    window.toast?.error("Translation failed: " + err.message);
  } finally {
    translating.value = false;
  }
}

const findCategoryIdByPath = (path) => {
  if (!path) return null;
  const parts = path.split(" > ");
  const lastPart = parts[parts.length - 1].trim().toLowerCase();
  const found = categories.value.find(
    (c) =>
      (c.label || c.name || "").toLowerCase() === lastPart ||
      (c.slug || "").toLowerCase() === lastPart,
  );
  return found ? found.id : null;
};

const findReturnPolicyId = (val) => {
  const found = returnPolicies.value.find((p) => {
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

const findFulfillmentModeId = (val) => {
  const found = fulfillmentModes.value.find((m) => {
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

const findShippingUnitId = (val) => {
  const found = shippingUnits.value.find((u) => {
    const code = (u.code || u.slug || u.name || u.symbol || "").toLowerCase();
    return code === val.toLowerCase();
  });
  return found ? found.id : 1;
};

async function saveProduct() {
  if (!selectedBrandId.value) {
    window.toast?.error("Please select a brand");
    return;
  }

  const selectedMarketIds = selectedMarketCodes.value.map((code) => {
    const marketMap = { AE: 1, SA: 2, EG: 3, KW: 4, BH: 5, QA: 6, OM: 7 };
    return marketMap[code];
  });

  // Get supplierEntityId from cookie/session
  let supplierEntityId = null;
  try {
    const user = JSON.parse(Cookies.get("zucci_user") || "null");
    supplierEntityId =
      user?.supplierEntityId || user?.supplierId || user?.vendorId || null;
  } catch (e) {
    console.error("Failed to parse user cookie for supplierEntityId:", e);
  }

  // Validate variable product variants
  if (product.value.isVariable) {
    if (!(product.value.variants || []).length) {
      window.toast?.error("Please generate at least one variant");
      return;
    }
    for (let i = 0; i < product.value.variants.length; i++) {
      const v = product.value.variants[i];
      if (!v.sku) {
        window.toast?.error(`Variant ${i + 1} is missing SKU`);
        return;
      }
    }
  }

  // Map translations locale array
  const translations = [];
  if (product.value.name || product.value.descriptionEn) {
    translations.push({
      localeId: 1,
      name: product.value.name || "",
      description: product.value.descriptionEn || "",
      seoTitle: seoTitleEn.value || "",
      seoDescription: seoDescEn.value || "",
    });
  }
  if (product.value.nameAr || product.value.descriptionAr) {
    translations.push({
      localeId: 2,
      name: product.value.nameAr || "",
      description: product.value.descriptionAr || "",
      seoTitle: seoTitleAr.value || "",
      seoDescription: seoDescAr.value || "",
    });
  }

  // Fallback translations if empty
  if (translations.length === 0) {
    translations.push({
      localeId: 1,
      name: "Unnamed Product",
      description: "",
      seoTitle: "",
      seoDescription: "",
    });
  }

  // Map primary category array
  const catId = findCategoryIdByPath(product.value.category);
  const categoriesPayload = catId
    ? [{ categoryId: catId, isPrimary: true, sortOrder: 0 }]
    : [];

  // Map media array
  const mediaPayload = (product.value.images || []).map((img, idx) => ({
    fileId: img.id || img.url,
    sortOrder: idx,
    isPrimary: idx === 0,
  }));

  // Map variants array
  const variantsPayload = product.value.isVariable
    ? product.value.variants
    : [
        {
          sku: `${productSku.value || "SKU"}-${Date.now()}`,
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
      ];

  const countriesList = lookup.get("countries") || [];
  const countryOfOriginId = countriesList[0]?.id || 1;

  const payload = {
    sku: productSku.value || `SKU-${Date.now()}`,
    translations,
    brandId: selectedBrandId.value,
    supplierEntityId,
    productStatusId: selectedProductStatusId.value || 101,
    approvalStatusId: selectedApprovalStatusId.value || 111,
    fulfillmentModeId: findFulfillmentModeId(product.value.fulfillment),
    returnPolicyId: product.value.returnPolicy || 1,
    nonReturnableReason: null,
    defaultWarehouseId: null,
    hsCode: product.value.hsCode || "6204.42",
    countryOfOriginId,
    shippingWeight: Number(product.value.shippingWeight) || 0.5,
    shippingUnitId: findShippingUnitId(product.value.shippingUnit),
    sizeGuideId: (product.value.sizeGuideId && product.value.sizeGuideId !== "") ? product.value.sizeGuideId : null,
    careInstructionId: (product.value.careInstructionId && product.value.careInstructionId !== "")
      ? product.value.careInstructionId
      : null,
    gender: selectedGenderId.value || 3,
    isVariable: product.value.isVariable,
    tags: product.value.tags || ["demo", "catalog"],
    markets: selectedMarketIds,
    categories: categoriesPayload,
    media: mediaPayload,
    variants: variantsPayload,
  };

  await createProduct(payload);
}
</script>
