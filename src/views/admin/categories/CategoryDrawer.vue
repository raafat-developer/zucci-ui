<script setup>
/**
 * CategoryDrawer — create/edit a category (products or marketplace). Faithful
 * port of CategoryDrawer from zucci-categories.jsx: basic fields, visibility
 * toggles, per-market settings grid (enable + min listings + commission),
 * media banners + SEO (products), marketplace rules. Uses legacy zcat- CSS.
 */
import { ref, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { toast } from '@/composables/useToast';
import { useCategoriesStore } from '@/stores/categories';
import { useLookup } from '@/composables/useLookup';
import { uploadFile } from '@/api/files';

const MARKET_MAP = {
  1: 'AE',
  2: 'SA',
  3: 'EG',
  4: 'KW',
  5: 'BH',
  6: 'QA',
  7: 'OM'
};
const FALLBACK_MARKETS = [
  { id: 1, code: 'AE', name: 'UAE' },
  { id: 2, code: 'SA', name: 'Saudi Arabia' },
  { id: 3, code: 'EG', name: 'Egypt' },
  { id: 4, code: 'KW', name: 'Kuwait' },
  { id: 5, code: 'BH', name: 'Bahrain' },
  { id: 6, code: 'QA', name: 'Qatar' },
  { id: 7, code: 'OM', name: 'Oman' },
];
const lookup = useLookup();
const MARKETS = computed(() => {
  const markets = lookup.get('markets');
  if (markets.length === 0) return FALLBACK_MARKETS;
  return markets;
});
const categoriesStore = useCategoriesStore();
const props = defineProps({
  open: { type: Boolean, default: false },
  cat: { type: Object, default: null },
  parentCat: { type: Object, default: null },
  isMarketplace: { type: Boolean, default: false },
});
const emit = defineEmits(['close', 'save']);

const BANNERS = [
  { id: 1, label: 'Mobile Banner', desc: 'App category pages', dims: '375 × 200px' },
  { id: 2, label: 'Homepage Banner', desc: 'Category grid', dims: '600 × 400px' },
  { id: 3, label: 'Hero Cover', desc: 'Full-width header', dims: '1440 × 400px' },
];

const FALLBACK_STATUSES = [
  { id: 161, name: 'Active' },
  { id: 162, name: 'Inactive' },
  { id: 163, name: 'Draft' }
];

const STATUSES = computed(() => {
  const lookupStatuses = lookup.getStatus('category');
  return lookupStatuses.length ? lookupStatuses : FALLBACK_STATUSES;
});

const blank = () => {
  // Find default active status id from lookup
  const defaultStatus = STATUSES.value.find(s => s.name?.toLowerCase() === 'active') || STATUSES.value[0];
  return {
    label:'', slug:'', description:'', statusId: defaultStatus?.id, private:false, featured:false,
    seo_title:'', seo_desc:'', seo_slug:'', commission_pct:'', requires_approval:false, listing_requirements:'',
    markets: Object.fromEntries(MARKETS.value.map((m) => [m.code, { enabled:false, min_listings:10, commission_pct:15 }])),
    media: BANNERS.map(b => ({ bannerType: b.id, fileId: null, sortOrder: 0, file: null, preview: null })),
  };
};
const v = ref(blank());
watch(() => [props.open, props.cat?.id], () => {
  if (props.open) {
    const initial = blank();
    if (props.cat) {
      // Merge existing category data
      v.value = {
        ...initial,
        ...props.cat,
        statusId: props.cat.statusId,
        markets: { ...initial.markets, ...(props.cat.markets || {}) },
        commission_pct: props.cat.commission_pct ?? '',
        media: initial.media.map((b) => {
          const existing = props.cat.media?.find(m => m.bannerType === b.bannerType);
          return existing ? { ...b, ...existing } : b;
        })
      };
    } else {
      v.value = initial;
    }
  }
});

const isNew = computed(() => !props.cat?.id);
const valid = computed(() => v.value.label.trim().length > 0);
const autoSlug = (l) => l.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const onLabel = (e) => { v.value.label = e.target.value; if (isNew.value) v.value.slug = autoSlug(e.target.value); };
const mkts = computed(() => MARKETS.value.map(m => m.code));
const reqText = computed({
  get: () => Array.isArray(v.value.listing_requirements) ? v.value.listing_requirements.join('\n') : (v.value.listing_requirements || ''),
  set: (val) => { v.value.listing_requirements = val; },
});
const title = computed(() => isNew.value ? (props.parentCat ? `Add sub-category under "${props.parentCat.label}"` : props.isMarketplace ? 'New Marketplace Category' : 'New Category') : `Edit: ${props.cat?.label}`);

const handleFileSelect = async (bannerType, files) => {
  if (!files.length) return;
  const file = files[0];
  try {
    const mediaIndex = v.value.media.findIndex(m => m.bannerType === bannerType);
    // Show preview first
    v.value.media[mediaIndex].preview = URL.createObjectURL(file);
    // Upload file
    const response = await uploadFile(file);
    const fileId = response.data?.id; // Adjust based on actual API response structure
    if (fileId) {
      v.value.media[mediaIndex].fileId = fileId;
      toast.success(`Uploaded ${file.name}`);
    }
  } catch (err) {
    toast.error('Upload failed');
  }
};

const save = async () => { 
  try {
    // Build API payload
    const payload = {
      slug: v.value.slug,
      translations: [
        {
          localeId: 1, // TODO: Make dynamic based on lookups later
          name: v.value.label,
          description: v.value.description,
        },
      ],
      statusId: v.value.statusId,
      featured: v.value.featured,
      private: v.value.private,
      markets: Object.entries(v.value.markets)
        .filter(([code, m]) => m.enabled)
        .map(([code, m]) => {
          const marketId = Object.keys(MARKET_MAP).find(id => MARKET_MAP[id] === code);
          return Number(marketId);
        }),
      marketSettings: Object.entries(v.value.markets)
        .map(([code, m]) => {
          const marketId = Object.keys(MARKET_MAP).find(id => MARKET_MAP[id] === code);
          return {
            marketId: Number(marketId),
            isActive: m.enabled,
            minListings: m.min_listings
          };
        }),
      media: v.value.media.filter(m => m.fileId).map(m => ({
        fileId: m.fileId,
        bannerType: m.bannerType,
        sortOrder: m.sortOrder
      })),
      seoTitle: v.value.seo_title,
      metaDescription: v.value.seo_desc,
      canonicalSlug: v.value.seo_slug
    };

    if (props.isMarketplace) {
      // TODO: Add marketplace-specific fields
    }

    if (props.parentCat) {
      payload.parentId = props.parentCat.id;
    }

    if (isNew.value) {
      await categoriesStore.createCategory(payload);
    } else {
      await categoriesStore.updateCategory(props.cat.id, payload);
    }
    
    emit('save', v.value); 
    toast.success(`Category ${isNew.value ? 'created' : 'updated'}: ${v.value.label}`); 
    emit('close'); 
  } catch (err) {
    toast.error(err.message);
  }
};
</script>

<template>
  <ZDrawer :open="open" :title="title" :subtitle="parentCat ? `Sub-category of ${parentCat.label}` : 'Top-level category'" :width="720" @close="emit('close')">
    <div class="zcat-form">
      <div class="zcat-form-section-title">Basic</div>
      <div class="zcat-grid-2">
        <div class="zcat-field" style="grid-column:1 / -1">
          <label class="zcat-label">Category Name<span style="color:var(--zg-danger)"> *</span></label>
          <input class="zcat-input" :value="v.label" placeholder="e.g. Abayas" @input="onLabel" />
        </div>
        <div class="zcat-field"><label class="zcat-label">URL Slug</label><input class="zcat-input" style="font-family:var(--zg-mono)" v-model="v.slug" placeholder="e.g. abayas" /></div>
        <div class="zcat-field">
          <label class="zcat-label">Status</label>
          <select class="zcat-select" v-model="v.statusId">
            <option v-for="status in STATUSES" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="zcat-field"><label class="zcat-label">Description</label><textarea class="zcat-textarea" v-model="v.description" placeholder="Short description…" /></div>

      <div class="zcat-form-section-title" style="margin-top:6px">Visibility</div>
      <div class="zcat-toggle-row">
        <div class="zcat-toggle-info"><span class="zcat-toggle-info-label">Featured</span><span class="zcat-toggle-info-sub">Show in featured categories on storefront</span></div>
        <button class="zcat-toggle" :class="v.featured ? 'on' : 'off'" @click="v.featured = !v.featured"><div class="zcat-toggle-knob" /></button>
      </div>
      <div class="zcat-toggle-row">
        <div class="zcat-toggle-info"><span class="zcat-toggle-info-label">Private / Hidden</span><span class="zcat-toggle-info-sub">Only visible to approved accounts (B2B, VIP)</span></div>
        <button class="zcat-toggle" :class="v.private ? 'on' : 'off'" @click="v.private = !v.private"><div class="zcat-toggle-knob" /></button>
      </div>

      <div class="zcat-form-section-title" style="margin-top:6px">Market Settings</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px">
        <div v-for="m in mkts" :key="m" :style="{ background:'var(--zg-panel)', border:`1px solid ${v.markets[m].enabled ? 'var(--zg-accent)' : 'var(--zg-line)'}`, borderRadius:'var(--zg-radius-md)', padding:'10px', opacity: v.markets[m].enabled ? 1 : 0.55 }">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:11px;font-weight:700;font-family:var(--zg-mono);color:var(--zg-text)">{{ m }}</span>
            <button class="zcat-toggle" :class="v.markets[m].enabled ? 'on' : 'off'" @click="v.markets[m].enabled = !v.markets[m].enabled"><div class="zcat-toggle-knob" /></button>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px">
            <div>
              <div style="font-size:9px;color:var(--zg-text-dim);font-weight:600;margin-bottom:2px">Min listings</div>
              <input type="number" min="0" v-model.number="v.markets[m].min_listings" style="width:100%;height:26px;padding:0 6px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:3px;font-family:var(--zg-mono);font-size:12px;color:var(--zg-text);outline:none;text-align:center" />
            </div>
            <div v-if="isMarketplace">
              <div style="font-size:9px;color:var(--zg-text-dim);font-weight:600;margin-bottom:2px">Commission %</div>
              <input type="number" min="0" max="100" v-model.number="v.markets[m].commission_pct" style="width:100%;height:26px;padding:0 6px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:3px;font-family:var(--zg-mono);font-size:12px;color:var(--zg-accent);outline:none;text-align:center" />
            </div>
          </div>
        </div>
      </div>

      <template v-if="!isMarketplace">
        <div class="zcat-form-section-title" style="margin-top:6px">Media</div>
        <div v-for="banner in BANNERS" :key="banner.id" style="display:flex;flex-direction:column;gap:5px;margin-bottom:8px">
          <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">{{ banner.label }}</label>
          <span style="font-size:10px;color:var(--zg-text-dim)">{{ banner.desc }} · {{ banner.dims }}</span>
          <label style="height:120px;border:1px dashed var(--zg-line);border-radius:var(--zg-radius-md);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;background:var(--zg-panel);overflow:hidden;position:relative">
            <input type="file" accept="image/*" style="display:none" @change="e => handleFileSelect(banner.id, e.target.files)" />
            <img v-if="v.media.find(m => m.bannerType === banner.id)?.preview" :src="v.media.find(m => m.bannerType === banner.id).preview" style="position:absolute;inset:0;object-fit:cover;width:100%;height:100%" />
            <template v-else>
              <svg viewBox="0 0 14 14" width="24" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.4" stroke-linecap="round"><path d="M7 1v8M4 6l3-3 3 3M2 12h10" /></svg>
              <span style="font-size:12px;color:var(--zg-text-dim)">Upload image</span>
            </template>
          </label>
        </div>
        <div class="zcat-form-section-title" style="margin-top:6px">SEO</div>
        <div class="zcat-field"><label class="zcat-label">SEO Title</label><input class="zcat-input" v-model="v.seo_title" placeholder="Page title (50–60 chars)" /></div>
        <div class="zcat-field"><label class="zcat-label">Meta Description</label><textarea class="zcat-textarea" style="min-height:48px" v-model="v.seo_desc" placeholder="160 chars…" /></div>
        <div class="zcat-field"><label class="zcat-label">Canonical Slug</label><input class="zcat-input" style="font-family:var(--zg-mono)" v-model="v.seo_slug" placeholder="custom-slug" /></div>
      </template>

      <template v-if="isMarketplace">
        <div class="zcat-form-section-title" style="margin-top:6px">Marketplace Rules</div>
        <div class="zcat-grid-2"><div class="zcat-field"><label class="zcat-label">Default Commission %</label><input class="zcat-input" style="font-family:var(--zg-mono)" v-model="v.commission_pct" placeholder="15" /></div></div>
        <div class="zcat-toggle-row">
          <div class="zcat-toggle-info"><span class="zcat-toggle-info-label">Requires Approval</span><span class="zcat-toggle-info-sub">New vendor listings need manual approval before going live</span></div>
          <button class="zcat-toggle" :class="v.requires_approval ? 'on' : 'off'" @click="v.requires_approval = !v.requires_approval"><div class="zcat-toggle-knob" /></button>
        </div>
        <div class="zcat-field"><label class="zcat-label">Listing Requirements</label><textarea class="zcat-textarea" v-model="reqText" placeholder="One requirement per line…" /></div>
      </template>
    </div>

    <template #footer>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
      <button class="zwh-btn-primary" :disabled="!valid" :style="{ opacity: valid ? 1 : 0.4 }" @click="save">{{ isNew ? 'Create Category' : 'Save Changes' }}</button>
    </template>
  </ZDrawer>
</template>
