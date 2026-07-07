<script setup>
/**
 * ProductDetailView — faithful Vue port of ZucciProductDetail. Handles both
 * "new" (blank) and existing products. All sections: Content (synced/EN/AR),
 * Media, Product Details (synced split or live), Market Availability, Variants
 * (attributes + pricing), SEO, Activity — plus header actions and the approval
 * drawer (approve / reject with reason + note).
 */
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ZCP_PRODUCTS, ZCP_DETAIL_10001 } from '@/data/productsData';
import {
  ZCP_ALL_MARKETS, STATUS_OPTIONS, ZCF_BRANDS_LIST, REJECTION_REASONS, isSyncedProduct,
} from '@/data/productsMeta';
import ZSearchableSelect from '@/components/ui/ZSearchableSelect.vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { useClickOutside } from '@/composables/useClickOutside';
import RichTextEditor from './parts/RichTextEditor.vue';
import LiveDetailsForm from './parts/LiveDetailsForm.vue';
import AttrSelect from './parts/AttrSelect.vue';
import VariantsPricingTable from './parts/VariantsPricingTable.vue';
import MediaManager from './parts/MediaManager.vue';

const route = useRoute();
const router = useRouter();

function blankProduct() {
  return {
    id: null, name: '', nameAr: '', descriptionEn: '', descriptionAr: '',
    category: '', sizeGuideId: '', careInstructionId: '',
    shippingWeight: 0, shippingUnit: 'kg', hsCode: '', countryOfOrigin: 'Egypt',
    returnPolicy: 'standard', nonReturnableReason: '',
    isVariable: false, syncSource: 'manual', markets: ['AE'],
    attributes: { color: [], size: [], material: [], style: [] },
    variants: [], images: [], syncedImages: [], tags: [],
    approvalStatus: 'draft', status: 'draft',
    brand: '', vendor: '', vendorId: '', brandCode: '', brandOriginalSku: '',
    fulfillment: 'consignment', completenessScore: null,
    seoTitleEn: '', seoDescEn: '', seoTitleAr: '', seoDescAr: '',
  };
}

function resolveInitial() {
  const id = route.params.id;
  if (id === 'new') return blankProduct();
  if (id === 'PRD-10001') return JSON.parse(JSON.stringify(ZCP_DETAIL_10001));
  const found = ZCP_PRODUCTS.find((p) => p.id === id);
  return found ? { ...blankProduct(), ...JSON.parse(JSON.stringify(found)) } : blankProduct();
}

const product = reactive(resolveInitial());
const approvalOpen = ref(false);
const approvalMode = ref('approve');
const rejectReason = ref('');
const rejectNote = ref('');

const isSynced = computed(() => isSyncedProduct(product));
const activeMkts = computed(() => ZCP_ALL_MARKETS.filter((m) => (product.markets || []).includes(m.code)));

onMounted(() => {
  if (isSynced.value && !product.isVariable && product.syncedAttributes &&
      Object.values(product.syncedAttributes).some((a) => a?.length > 0)) {
    product.isVariable = true;
  }
});

const upd = (k, v) => { product[k] = v; };
const setBrand = (v) => { const b = ZCF_BRANDS_LIST.find((x) => x.value === v); product.brand = v; product.brandCode = b?.code || ''; };
const updAttr = (attr, vals) => { product.attributes = { ...product.attributes, [attr]: vals }; };
const updFromTable = (k, v) => { product[k] = v; };

const submitForReview = () => { product.approvalStatus = 'pending'; };
const doApprove = () => { product.approvalStatus = 'approved'; product.status = 'active'; approvalOpen.value = false; };
const doReject = () => { product.approvalStatus = 'rejected'; product.status = 'draft'; product.rejectionReason = rejectReason.value + (rejectNote.value ? ': ' + rejectNote.value : ''); approvalOpen.value = false; };
const toggleMarket = (code) => {
  const m = product.markets || [];
  product.markets = m.includes(code) ? m.filter((x) => x !== code) : [...m, code];
};

// Status dropdown
const { isOpen: statusOpen, rootRef: statusRef, toggle: toggleStatus, close: closeStatus } = useClickOutside();
const curStatus = computed(() => STATUS_OPTIONS.find((o) => o.value === product.status) || STATUS_OPTIONS[0]);
const pickStatus = (v) => { product.status = v; closeStatus(); };

const statusOptions = STATUS_OPTIONS;
const brandsList = ZCF_BRANDS_LIST;
const allMarkets = ZCP_ALL_MARKETS;
const rejectReasons = REJECTION_REASONS;
const attrs = ['color', 'size', 'material', 'style'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const seoCols = [
  { dir:'ltr', title:'Search Engine Listing', lang:'English', tLbl:'Page Title', dLbl:'Meta Description', tV:'seoTitleEn', dV:'seoDescEn', tPh:'Enter page title…', dPh:'Enter meta description…', tSuf:'/ 70 characters', dSuf:'/ 320 characters' },
  { dir:'rtl', title:'قائمة محرك البحث', lang:'عربي', tLbl:'عنوان الصفحة', dLbl:'ميتا الوصف', tV:'seoTitleAr', dV:'seoDescAr', tPh:'أدخل عنوان الصفحة…', dPh:'أدخل ميتا الوصف…', tSuf:'من 70 حرفاً', dSuf:'من 320 حرفاً' },
];
</script>

<template>
  <div class="zp-detail-wrap">
    <!-- Header -->
    <div class="zp-detail-header">
      <button type="button" class="zp-back-btn" @click="router.push('/admin/products')">
        <svg viewBox="0 0 14 10" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 1L1 5L5 9 M1 5h12" /></svg>
        Back
      </button>
      <div class="zp-detail-title">{{ product.name || 'New Product' }}</div>
      <div class="zp-detail-meta">
        <div v-if="!isSynced" style="position:relative;display:inline-block;min-width:220px">
          <ZSearchableSelect :model-value="product.brand || ''" :options="brandsList" placeholder="Assign brand…" @update:model-value="setBrand" />
        </div>
        <span v-else class="zen-pd-ref">{{ product.brand }}</span>
        <span v-if="product.sku" class="zen-field-mono" style="font-size:10px">{{ product.sku }}</span>

        <!-- Status dropdown -->
        <div ref="statusRef" style="position:relative">
          <button type="button" class="zp-status-selector" :style="{ color: curStatus.color }" @click="toggleStatus">
            <span class="zp-status-dot" :style="{ background: curStatus.color }" />
            {{ curStatus.label }}
            <svg viewBox="0 0 10 6" width="8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 1L5 5L9 1" /></svg>
          </button>
          <div v-show="statusOpen" class="zp-status-dd">
            <button
              v-for="o in statusOptions"
              :key="o.value"
              type="button"
              class="zp-status-dd-item"
              :style="{ color: o.value === product.status ? o.color : 'var(--zg-text-mid)' }"
              @click="pickStatus(o.value)"
            >
              <span class="zp-status-dot" :style="{ background: o.color }" />
              {{ o.label }}
            </button>
          </div>
        </div>
        <span v-if="product.approvalStatus === 'pending'" style="font-family:var(--zg-mono);font-size:10px;color:var(--zg-warn)">· Pending Review</span>
      </div>
      <div class="zp-detail-actions">
        <button type="button" class="zen-btn-ghost" style="height:28px;font-size:11px">Preview</button>
        <button v-if="product.approvalStatus === 'pending'" type="button" class="zen-btn-primary" style="height:28px;font-size:11px;background:var(--zg-good)" @click="approvalOpen = true">Review</button>
        <button v-else-if="product.approvalStatus !== 'approved'" type="button" class="zen-btn-ghost" style="height:28px;font-size:11px" @click="submitForReview">Submit for Review</button>
        <button type="button" class="zen-btn-primary" style="height:28px;font-size:11px">Save</button>
      </div>
    </div>

    <!-- Rejection banner -->
    <div v-if="product.approvalStatus === 'rejected' && product.rejectionReason" class="zp-rejection-banner">
      <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="5.5" /><line x1="7" y1="4.5" x2="7" y2="7.5" /><circle cx="7" cy="9.5" r="0.5" fill="currentColor" /></svg>
      <strong>Rejected:</strong> {{ product.rejectionReason }}
    </div>

    <!-- Completeness -->
    <div v-if="product.completenessScore != null" class="zp-completeness-header">
      <span class="zf-kpi-lbl">Completeness</span>
      <div class="zp-completeness-track" style="flex:1;max-width:180px">
        <div class="zp-completeness-fill" :style="{ width: product.completenessScore + '%', background: product.completenessScore >= 80 ? 'var(--zg-good)' : product.completenessScore >= 50 ? 'var(--zg-warn)' : 'var(--zg-danger)' }" />
      </div>
      <span class="zp-completeness-pct">{{ product.completenessScore }}%</span>
    </div>

    <div class="zp-detail-body">
      <!-- CONTENT -->
      <div class="zp-section-label">{{ isSynced ? 'Content — Synced vs. Live' : 'Content' }}</div>
      <div class="zp-content-grid" :class="{ 'has-synced': isSynced }">
        <div v-if="isSynced" class="zp-content-col">
          <div class="zp-content-col-head"><span class="zp-content-col-title">Synced</span><span class="zp-synced-badge">from store</span></div>
          <div class="zp-name-input zp-name-readonly">{{ product.name || '—' }}</div>
          <div class="zp-rte-preview" v-html="product.descriptionEn || 'No synced description'" />
        </div>
        <div class="zp-content-col">
          <div class="zp-content-col-head">
            <span class="zp-content-col-title">Live Content</span>
            <span class="zp-lang-badge">English</span>
            <span v-if="isSynced" class="zp-live-dot" />
          </div>
          <input class="zp-name-input" :value="product.name" placeholder="Enter product name here…" @input="upd('name', $event.target.value)" />
          <RichTextEditor :model-value="product.descriptionEn" dir="ltr" placeholder="Enter product description here…" @update:model-value="(v) => upd('descriptionEn', v)" />
        </div>
        <div class="zp-content-col">
          <div class="zp-content-col-head" dir="rtl">
            <span class="zp-content-col-title">محتوى المنتج المباشر</span>
            <span class="zp-lang-badge">عربي</span>
            <span v-if="String(product.arabicStatus || '').startsWith('ai')" class="zp-ai-badge">AI</span>
            <button type="button" class="zp-translate-btn" style="margin-left:auto">Translate</button>
          </div>
          <input class="zp-name-input" dir="rtl" :value="product.nameAr" placeholder="أدخل اسم المنتج هنا..." @input="upd('nameAr', $event.target.value)" />
          <RichTextEditor :model-value="product.descriptionAr" dir="rtl" placeholder="أدخل وصف المنتج هنا..." @update:model-value="(v) => upd('descriptionAr', v)" />
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
        <div class="zen-card" style="padding:14px">
          <div class="zp-content-col-head" style="margin-bottom:10px">
            <span class="zp-content-col-title">Synced Product Details</span>
            <span class="zp-synced-badge">from store</span>
          </div>
          <div class="zen-bank-fields">
            <div class="zen-bank-field">
              <div class="zen-field-label">Tags</div>
              <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">
                <span v-for="t in ((product.syncedData || {}).tags || product.syncedTags || [])" :key="t" class="zen-brand-cat-tag">{{ t }}</span>
              </div>
            </div>
            <div class="zen-bank-field">
              <div class="zen-field-label">Shipping Weight</div>
              <div class="zen-field-val">{{ (product.syncedData || {}).shippingWeight || product.syncedShippingWeight || '—' }} {{ (product.syncedData || {}).shippingUnit || product.syncedShippingUnit || '' }}</div>
            </div>
            <div class="zen-bank-field">
              <div class="zen-field-label">Brand SKU</div>
              <div class="zen-field-val zen-field-mono" style="font-size:11px">{{ product.brandOriginalSku || 'N/A' }}</div>
            </div>
            <div class="zen-bank-field">
              <div class="zen-field-label">Synced Category</div>
              <div class="zen-field-val">{{ (product.syncedData || {}).category || product.syncedCategory || product.category || '—' }}</div>
            </div>
          </div>
        </div>
        <div class="zen-card" style="padding:14px">
          <div class="zp-content-col-head" style="margin-bottom:10px">
            <span class="zp-content-col-title">Live Product Details</span>
            <span class="zp-live-dot" />
          </div>
          <LiveDetailsForm :product="product" @update="upd" />
        </div>
      </div>
      <div v-else class="zen-card" style="padding:14px">
        <LiveDetailsForm :product="product" @update="upd" />
      </div>

      <!-- MARKET AVAILABILITY -->
      <div class="zp-section-label">Market Availability</div>
      <div class="zp-markets-grid">
        <label v-for="m in allMarkets" :key="m.code" class="zp-market-card" :class="{ 'is-active': (product.markets || []).includes(m.code) }" style="cursor:pointer">
          <div class="zp-market-card-head">
            <span style="font-size:14px">{{ m.flag }}</span>
            <span class="zp-market-name">{{ m.name }}</span>
            <input type="checkbox" :checked="(product.markets || []).includes(m.code)" @change="toggleMarket(m.code)" />
          </div>
          <div class="zp-market-currency">{{ m.currency }}</div>
          <span v-if="(product.markets || []).includes(m.code) && product.approvalStatus === 'approved'" class="zen-bst zen-bst--active" style="font-size:9px">Live</span>
          <span v-else-if="(product.markets || []).includes(m.code) && product.approvalStatus === 'pending'" class="zen-bst zen-bst--pending" style="font-size:9px">Pending</span>
        </label>
      </div>

      <!-- VARIANTS -->
      <div class="zp-section-label">
        Live Variants
        <label class="zp-variable-toggle">
          <input type="checkbox" :checked="!!product.isVariable" @change="upd('isVariable', $event.target.checked)" />
          <span>{{ product.isVariable ? 'Switch back to simple product' : 'Switch to variable product' }}</span>
        </label>
      </div>

      <template v-if="product.isVariable">
        <div class="zp-attr-grid">
          <div v-for="attr in attrs" :key="attr" class="zf-props-field">
            <label class="zf-props-label">{{ cap(attr) }}</label>
            <div v-if="isSynced" style="margin-bottom:6px;padding:6px 10px;background:oklch(0.82 0.14 215 / 0.07);border:1px solid oklch(0.82 0.14 215 / 0.2);border-radius:5px">
              <div style="font-size:9.5px;color:oklch(0.82 0.14 215);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Synced</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                <span v-for="v in ((product.syncedAttributes || {})[attr] || [])" :key="v" class="zp-sync-val-pill" style="font-size:11px">{{ v }}</span>
                <span v-if="!((product.syncedAttributes || {})[attr] || []).length" style="font-size:11px;color:var(--zg-text-dim)">—</span>
              </div>
            </div>
            <AttrSelect :attr="attr" :values="(product.attributes || {})[attr] || []" @update:values="(vals) => updAttr(attr, vals)" />
          </div>
        </div>
        <VariantsPricingTable :product="product" :active-mkts="activeMkts" @update="updFromTable" />
      </template>
      <div v-else class="zp-variants-empty" style="opacity:0.6;font-size:12px;color:var(--zg-text-dim);padding:10px 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md)">
        Simple product — no variants. Toggle above to add variations.
      </div>

      <!-- SEO -->
      <div class="zp-section-label">Search Engine Listing</div>
      <div class="zp-seo-grid">
        <div v-for="col in seoCols" :key="col.dir" class="zp-seo-col">
          <div class="zp-content-col-head" :dir="col.dir" style="margin-bottom:10px">
            <span class="zp-content-col-title">{{ col.title }}</span>
            <span class="zp-lang-badge">{{ col.lang }}</span>
          </div>
          <label class="zf-props-label">{{ col.tLbl }}</label>
          <input class="zp-field-h" :dir="col.dir" style="width:100%;box-sizing:border-box;margin-bottom:4px" :value="product[col.tV] || ''" :placeholder="col.tPh" @input="upd(col.tV, $event.target.value)" />
          <span class="zp-char-count" :dir="col.dir">{{ (product[col.tV] || '').length }} {{ col.tSuf }}</span>
          <label class="zf-props-label" style="margin-top:10px">{{ col.dLbl }}</label>
          <textarea class="zp-seo-textarea" :dir="col.dir" rows="4" :value="product[col.dV] || ''" :placeholder="col.dPh" @input="upd(col.dV, $event.target.value)" />
          <span class="zp-char-count" :dir="col.dir">{{ (product[col.dV] || '').length }} {{ col.dSuf }}</span>
        </div>
      </div>

      <!-- ACTIVITY -->
      <template v-if="(product.activityLog || []).length">
        <div class="zp-section-label">Activity</div>
        <div class="zen-act-timeline">
          <div v-for="(e, i) in product.activityLog" :key="i" class="zen-act-entry">
            <div class="zen-act-entry-left">
              <div class="zen-act-icon-dot" :class="`zen-act-icon-dot--${e.role}`" />
              <div v-if="i < product.activityLog.length - 1" class="zen-act-vline" />
            </div>
            <div class="zen-act-entry-body">
              <div class="zen-act-entry-head"><span class="zen-act-actor">{{ e.actor }}</span><span class="zen-act-role" :class="`zen-act-role--${e.role}`">{{ e.role.toUpperCase() }}</span></div>
              <div class="zen-act-action">{{ e.action }}</div>
              <div class="zen-act-time">{{ e.date }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Approval drawer -->
    <ZDrawer :open="approvalOpen" :title="approvalMode === 'approve' ? 'Approve Product' : 'Reject Product'" :subtitle="product.name" :width="420" @close="approvalOpen = false">
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="zf-filter-row" style="display:flex;gap:6px">
          <button v-for="m in ['approve','reject']" :key="m" type="button" class="zen-filter-chip" :class="{ 'is-on': approvalMode === m }" @click="approvalMode = m">{{ cap(m) }}</button>
        </div>
        <template v-if="approvalMode === 'reject'">
          <div class="zf-props-field">
            <label class="zf-props-label">Rejection Reason *</label>
            <ZSearchableSelect v-model="rejectReason" :options="rejectReasons" placeholder="Select reason…" />
          </div>
          <div class="zf-props-field">
            <label class="zf-props-label">Note to Vendor</label>
            <textarea class="zen-notes-textarea" style="margin-top:0" rows="3" v-model="rejectNote" placeholder="What specifically needs to be fixed?" />
          </div>
        </template>
        <div v-else class="zf-alert" style="background:oklch(0.78 0.15 150 / 0.07);border:1px solid oklch(0.78 0.15 150/0.3);color:var(--zg-text-mid);padding:10px 12px;border-radius:6px;font-size:12px">Product goes live in all active markets.</div>
      </div>
      <template #footer>
        <button class="zen-btn-ghost" @click="approvalOpen = false">Cancel</button>
        <button v-if="approvalMode === 'approve'" class="zen-btn-primary" style="background:var(--zg-good)" @click="doApprove">Approve</button>
        <button v-else class="zen-btn-primary" style="background:var(--zg-danger)" :style="{ opacity: rejectReason ? 1 : 0.4 }" :disabled="!rejectReason" @click="doReject">Reject</button>
      </template>
    </ZDrawer>
  </div>
</template>
