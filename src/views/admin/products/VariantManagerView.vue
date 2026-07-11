<script setup>
/**
 * VariantManagerView — Variant Manager (faithful port of
 * ZucciVariantManagerModule): KPI strip, Variant Types tab (drag-reorder,
 * colour/text swatch preview, applies-to, status toggle, edit) and Product
 * Configs tab (variant types badges, SKU/disabled counts, Manage → drawer).
 */
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ZC_PRODUCT_VARIANTS } from "@/data/sizeGuidesData";
import { useDnDList } from "@/composables/useDnDList";
import VariantTypeDrawer from "./variants/VariantTypeDrawer.vue";
import ProductVariantDrawer from "./variants/ProductVariantDrawer.vue";
import http from "@/api/http";
import { useLookupStore } from "@/stores/lookup.store";

const router = useRouter();
const lookupStore = useLookupStore();

const types = ref([]);
const {
  dragIdx,
  overIdx,
  start,
  over,
  drop,
  end,
} = useDnDList(types);

const tab = ref("types");
const typeEdit = ref(null);
const typeOpen = ref(false);
const pvEdit = ref(null);
const pvOpen = ref(false);

const MARKET_MAP = {
  1: 'AE',
  2: 'SA',
  3: 'EG',
  4: 'KW',
  5: 'BH',
  6: 'QA',
  7: 'OM'
};

const mapApiAttributeToUI = (attr) => {
  const input_type = attr.inputType === 1 ? 'select' : attr.inputType === 3 ? 'swatch_color' : 'swatch_text';
  
  const allCategories = lookupStore.get('categories') || [];
  const applies_to = (attr.categories || []).map(c => {
    const found = allCategories.find(item => item.id === c.id || item.id === c);
    return found ? (found.label || found.name) : (c.label || c.name || c);
  });
  const categoryIds = (attr.categories || []).map(c => c.id || c) || attr.categoryIds || [];

  const status = attr.statusId === 1 || attr.status === 'active' || attr.isActive ? 'active' : 'inactive';

  const options = (attr.options || []).map(opt => {
    if (typeof opt === 'object') {
      return {
        id: opt.id,
        label: opt.label || opt.name || '',
        hex: opt.hex || opt.color || ''
      };
    }
    return opt;
  });

  return {
    id: attr.id,
    name: attr.name,
    code: attr.code,
    input_type,
    applies_to,
    categoryIds,
    options,
    status,
    requires_size_chart: attr.requiresSizeChart || false,
    sort: attr.sortOrder || 0
  };
};

const loadAttributes = async () => {
  try {
    const res = await http.get("/catalog/attributes", {
      params: {
        page: 1,
        perPage: 100
      }
    });
    const items = res.data?.data || res.data || res.items || [];
    types.value = items.map(mapApiAttributeToUI);
  } catch (err) {
    console.error("Failed to load attributes:", err);
  }
};

const productVariants = ref([]);

const mapApiProductConfigToUI = (cfg) => {
  return {
    id: cfg.productId,
    productId: cfg.productId,
    sku: cfg.sku || "—",
    product: cfg.productName || "—",
    brand: cfg.brandName || "—",
    variant_types: cfg.variantTypesEnabled || [],
    variants_count: cfg.totalSkus ?? 0,
    disabled_count: cfg.disabledSkus ?? 0,
    variants: []
  };
};

const loadProductConfigs = async () => {
  try {
    const res = await http.get("/catalog/product-configs");
    const items = res.data?.data || res.data || res.items || [];
    productVariants.value = items.map(mapApiProductConfigToUI);
  } catch (err) {
    console.error("Failed to load product configs:", err);
  }
};

onMounted(async () => {
  await lookupStore.load();
  await loadAttributes();
});

watch(tab, (newTab) => {
  if (newTab === "products") {
    loadProductConfigs();
  }
});

const openType = (t = null) => {
  typeEdit.value = t;
  typeOpen.value = true;
};

const openPv = async (pv) => {
  try {
    const res = await http.get(`/catalog/products/${pv.id}`);
    const apiProduct = res.data?.data || res.data || {};
    
    const mappedVariants = (apiProduct.variants || []).map(v => {
      const attrMap = {};
      (v.attributes || []).forEach(a => {
        attrMap[a.code || a.slug || a.name || ''] = a.value || a.label || '';
      });

      const size = attrMap.size || '';
      const colour = attrMap.color || attrMap.colour || '';
      const material = attrMap.material || '';

      const basePrice = v.prices?.[0]?.price || v.price || 0;
      const overridePrice = v.prices?.[0]?.compareAtPrice || null;

      return {
        id: v.id,
        sku: v.sku,
        size,
        colour,
        material,
        price_base: basePrice,
        price_override: overridePrice,
        stock: v.stock ?? v.quantity ?? 0,
        images: v.images?.length || 0,
        status: v.isActive ? 'active' : 'disabled'
      };
    });

    pvEdit.value = {
      ...pv,
      variants: mappedVariants
    };
    pvOpen.value = true;
  } catch (err) {
    console.error("Failed to load product variants detail:", err);
    window.toast?.error("Failed to load variant details");
  }
};

const toggleType = async (id) => {
  const t = types.value.find(item => item.id === id);
  if (!t) return;
  const newActive = t.status !== "active";
  try {
    await http.post(`/catalog/attributes/${id}/toggle`, {
      isActive: newActive
    });
    t.status = newActive ? "active" : "inactive";
    window.toast?.success(`Variant type ${newActive ? 'enabled' : 'disabled'}`);
  } catch (err) {
    console.error("Failed to toggle attribute:", err);
    window.toast?.error("Failed to update status");
  }
};

const onSaveType = () => {
  loadAttributes();
};

const handleDrop = async (idx) => {
  drop(idx);
  try {
    const payload = {
      items: types.value.map((t, index) => ({
        id: t.id,
        sortOrder: index
      }))
    };
    await http.post("/catalog/attributes/reorder", payload);
    window.toast?.success("Variant types order updated!");
  } catch (err) {
    console.error("Failed to reorder attributes:", err);
    window.toast?.error("Failed to update sort order");
  }
};

const disabledTotal = computed(() =>
  productVariants.value.reduce(
    (s, p) => s + p.variants.filter((v) => v.status !== "active").length,
    0,
  ),
);
const vNamesFor = (pv) =>
  (pv.variant_types || []).map(
    (id) => types.value.find((t) => t.id === id)?.name || id,
  );
const disabledFor = (pv) =>
  pv.variants.filter((v) => v.status !== "active").length;
const kpis = computed(() => [
  ["Variant Types", types.value.length, "", "defined"],
  [
    "Active",
    types.value.filter((t) => t.status === "active").length,
    "is-good",
    "enabled",
  ],
  ["Products", productVariants.value.length, "is-accent", "configured"],
  [
    "Total SKUs",
    productVariants.value.reduce((s, p) => s + p.variants.length, 0),
    "",
    "combinations",
  ],
  [
    "Disabled",
    disabledTotal.value,
    disabledTotal.value > 0 ? "is-warn" : "",
    "out of stock / off",
  ],
]);
</script>

<template>
  <div class="zcat-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="font-size: 13px; font-weight: 600; color: var(--zg-text)"
            >Variant Manager</span
          >
        </div>
        <div class="zwh-subtitle">
          {{ types.filter((t) => t.status === "active").length }} active variant
          types · {{ productVariants.length }} product configs
        </div>
      </div>
      <div class="zwh-header-right">
        <button class="zwh-btn-primary" @click="openType(null)">
          + New Variant Type
        </button>
      </div>
    </div>

    <div class="zwh-kpi-strip">
      <div v-for="[l, v, cls, sub] in kpis" :key="l" class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">{{ l }}</span
        ><span class="zwh-kpi-val" :class="cls">{{ v }}</span
        ><span class="zwh-kpi-sub">{{ sub }}</span>
      </div>
    </div>

    <div
      style="
        display: flex;
        border-bottom: 1px solid var(--zg-line);
        background: var(--zg-bg-elev);
        flex-shrink: 0;
        padding: 0 20px;
      "
    >
      <button
        v-for="[v, l] in [
          ['types', 'Variant Types'],
          ['products', 'Product Configs'],
        ]"
        :key="v"
        style="
          height: 40px;
          padding: 0 14px;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 12.5px;
          cursor: pointer;
        "
        :style="{
          color: tab === v ? 'var(--zg-accent)' : 'var(--zg-text-dim)',
          borderBottom:
            tab === v ? '2px solid var(--zg-accent)' : '2px solid transparent',
          marginBottom: '-1px',
          fontWeight: tab === v ? 600 : 400,
        }"
        @click="tab = v"
      >
        {{ l }}
      </button>
    </div>

    <div class="zcat-content">
      <!-- Variant Types -->
      <div
        v-if="tab === 'types'"
        style="
          border: 1px solid var(--zg-line);
          border-radius: var(--zg-radius-md);
          overflow: hidden;
        "
      >
        <div
          style="
            display: grid;
            grid-template-columns: 28px 1fr 100px 120px 80px 80px 80px;
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
          <span></span><span>Variant Type</span><span>Input</span
          ><span>Applies To</span><span>Options</span><span>Status</span
          ><span>Actions</span>
        </div>
        <div
          v-for="(t, i) in types"
          :key="t.id"
          draggable="true"
          @dragstart="start(i)"
          @dragover.prevent="over(i)"
          @drop.prevent="handleDrop(i)"
          @dragend="end"
          :style="{
            display: 'grid',
            gridTemplateColumns: '28px 1fr 100px 120px 80px 80px 80px',
            gap: '10px',
            padding: '12px 14px',
            background:
              overIdx === i
                ? 'var(--zg-accent-tint)'
                : dragIdx === i
                  ? 'oklch(0.25 0.02 250 / 0.5)'
                  : t.status !== 'active'
                    ? 'var(--zg-bg)'
                    : 'var(--zg-panel)',
            borderBottom: '1px solid var(--zg-line-soft)',
            alignItems: 'center',
            cursor: 'grab',
            opacity: t.status !== 'active' ? 0.55 : 1,
            outline: overIdx === i ? '1px dashed var(--zg-accent)' : 'none',
          }"
        >
          <div style="color: var(--zg-text-xdim); cursor: grab">
            <svg viewBox="0 0 8 12" width="8" fill="currentColor">
              <circle cx="2" cy="2" r="1.1" />
              <circle cx="6" cy="2" r="1.1" />
              <circle cx="2" cy="6" r="1.1" />
              <circle cx="6" cy="6" r="1.1" />
              <circle cx="2" cy="10" r="1.1" />
              <circle cx="6" cy="10" r="1.1" />
            </svg>
          </div>
          <div>
            <div
              style="font-size: 13px; font-weight: 600; color: var(--zg-text)"
            >
              {{ t.name }}
            </div>
            <div
              style="
                font-size: 10px;
                font-family: var(--zg-mono);
                color: var(--zg-text-dim);
                margin-top: 1px;
              "
            >
              {{ t.code }}
            </div>
          </div>
          <span style="font-size: 11px; color: var(--zg-text-dim)">{{
            t.input_type === "select"
              ? "Dropdown"
              : t.input_type === "swatch_color"
                ? "Colour"
                : "Text Swatches"
          }}</span>
          <div
            style="
              font-size: 10.5px;
              color: var(--zg-text-dim);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ (t.applies_to || []).join(", ") || "—" }}
          </div>
          <div style="display: flex; gap: 3px; flex-wrap: wrap">
            <template v-if="t.input_type === 'swatch_color'">
              <div
                v-for="(o, j) in (t.options || []).slice(0, 6)"
                :key="j"
                v-show="typeof o === 'object' && o.hex"
                :style="{
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  background: typeof o === 'object' ? o.hex : '',
                  border: '1px solid oklch(1 0 0 / 0.15)',
                  flexShrink: 0,
                }"
                :title="typeof o === 'object' ? o.label : o"
              />
            </template>
            <template v-else>
              <span
                v-for="(o, j) in (t.options || []).slice(0, 4)"
                :key="j"
                style="
                  font-size: 9.5px;
                  padding: 1px 5px;
                  background: var(--zg-panel-hi);
                  border-radius: 2px;
                  color: var(--zg-text-dim);
                  border: 1px solid var(--zg-line);
                  font-weight: 600;
                  white-space: nowrap;
                "
                >{{ typeof o === "object" ? o.label : o }}</span
              >
            </template>
            <span
              v-if="
                (t.options || []).length >
                (t.input_type === 'swatch_color' ? 6 : 4)
              "
              style="
                font-size: 9px;
                color: var(--zg-text-xdim);
                align-self: center;
              "
              >+{{
                t.options.length - (t.input_type === "swatch_color" ? 6 : 4)
              }}</span
            >
          </div>
          <div @click.stop>
            <button
              class="zcat-toggle"
              :class="t.status === 'active' ? 'on' : 'off'"
              @click="toggleType(t.id)"
            >
              <div class="zcat-toggle-knob" />
            </button>
          </div>
          <div style="display: flex; gap: 4px" @click.stop>
            <button class="zcat-act" style="opacity: 1" @click="openType(t)">
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Product Configs -->
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
            grid-template-columns: 1fr 100px 140px 70px 70px 90px;
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
          <span>Product</span><span>Brand</span><span>Variant Types</span
          ><span>SKUs</span><span>Disabled</span><span></span>
        </div>
        <div
          v-for="pv in productVariants"
          :key="pv.id"
          style="
            display: grid;
            grid-template-columns: 1fr 100px 140px 70px 70px 90px;
            gap: 10px;
            padding: 12px 14px;
            background: var(--zg-panel);
            border-bottom: 1px solid var(--zg-line-soft);
            align-items: center;
            cursor: pointer;
          "
          @click="openPv(pv)"
        >
          <div>
            <div
              style="font-size: 12.5px; font-weight: 600; color: var(--zg-text)"
            >
              {{ pv.product }}
            </div>
            <div
              style="
                font-size: 10px;
                font-family: var(--zg-mono);
                color: var(--zg-text-dim);
                margin-top: 1px;
              "
            >
              {{ pv.sku }}
            </div>
          </div>
          <span style="font-size: 12px; color: var(--zg-text-mid)">{{
            pv.brand
          }}</span>
          <div style="display: flex; flex-wrap: wrap; gap: 3px">
            <span
              v-for="n in vNamesFor(pv)"
              :key="n"
              style="
                font-size: 9.5px;
                padding: 1px 5px;
                background: var(--zg-panel-hi);
                border-radius: 2px;
                color: var(--zg-text-dim);
                font-weight: 600;
                border: 1px solid var(--zg-line);
              "
              >{{ n }}</span
            >
          </div>
          <span
            style="
              font-family: var(--zg-mono);
              font-size: 12px;
              color: var(--zg-text-mid);
            "
            >{{ pv.variants_count }}</span
          >
          <span
            :style="{
              fontFamily: 'var(--zg-mono)',
              fontSize: '12px',
              color:
                pv.disabled_count > 0 ? 'var(--zg-warn)' : 'var(--zg-text-dim)',
              fontWeight: pv.disabled_count > 0 ? 700 : 400,
            }"
            >{{ pv.disabled_count || "—" }}</span
          >
          <button class="zcat-act" style="opacity: 1" @click.stop="openPv(pv)">
            Manage
          </button>
        </div>
      </div>
    </div>

    <VariantTypeDrawer
      :open="typeOpen"
      :vtype="typeEdit"
      @close="typeOpen = false"
      @save="onSaveType"
    />
    <ProductVariantDrawer
      :open="pvOpen"
      :config="pvEdit"
      @close="pvOpen = false"
    />
  </div>
</template>
