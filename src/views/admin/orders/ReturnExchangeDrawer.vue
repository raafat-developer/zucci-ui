<script setup>
/**
 * ReturnExchangeDrawer — faithful Vue port of React ReturnExchangeDrawer.
 * 85vw drawer: select return items with qty steppers, reason select,
 * exchange items with Add Products sub-view, return shipping, summary panel.
 */
import { ref, reactive, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';

const props = defineProps({ open: Boolean, order: Object });
const emit  = defineEmits(['close']);

const RETURN_REASONS = [
  "Wrong size / doesn't fit", 'Damaged or defective item',
  'Wrong item received', 'Item not as described',
  'Changed mind', 'Quality not as expected',
  'Duplicate order', 'Other',
];
const PRODUCT_VARIANTS = [
  { key:'xs-pc',  size:'XS', color:'Pina Colada', stock:23, price:299.99 },
  { key:'s-pc',   size:'S',  color:'Pina Colada', stock:23, price:299.99 },
  { key:'m-pc',   size:'M',  color:'Pina Colada', stock:23, price:299.99 },
  { key:'l-pc',   size:'L',  color:'Pina Colada', stock:23, price:299.99 },
  { key:'xl-blk', size:'XL', color:'Black',       stock:23, price:299.99 },
  { key:'xxl-pc', size:'XXL',color:'Pina Colada', stock:23, price:299.99 },
];

const qtys         = reactive({});
const reason       = ref('');
const shipping     = ref('none');
const exchangeItems = ref([]);
const showAddProd  = ref(false);
const discBanner   = ref(true);
const variantSearch = ref('');
const selectedVars  = ref(new Set());

const items = computed(() => props.order?.lineItems || []);

watch(() => props.open, (v) => {
  if (!v) return;
  items.value.forEach((_, i) => (qtys[i] = 0));
  reason.value = ''; shipping.value = 'none';
  exchangeItems.value = []; showAddProd.value = false; discBanner.value = true;
  variantSearch.value = ''; selectedVars.value = new Set();
});

const filteredVariants = computed(() => {
  const q = variantSearch.value.toLowerCase();
  return PRODUCT_VARIANTS.filter(v => !q || v.size.toLowerCase().includes(q) || v.color.toLowerCase().includes(q));
});

const totalReturn   = computed(() => items.value.reduce((s, item, i) => s + item.price * (qtys[i] || 0), 0));
const hasItems      = computed(() => totalReturn.value > 0);
const orderDiscount = 55.05;
const returnCount   = computed(() => items.value.reduce((s, _, i) => s + (qtys[i] || 0), 0));
const expectedRefund = computed(() => hasItems.value ? -(totalReturn.value - orderDiscount) : 0);

function toggleVar(key) {
  const s = new Set(selectedVars.value);
  s.has(key) ? s.delete(key) : s.add(key);
  selectedVars.value = s;
}
function addSelectedProducts() {
  const added = [...selectedVars.value].map(k => PRODUCT_VARIANTS.find(v => v.key === k)).filter(Boolean);
  exchangeItems.value = [...exchangeItems.value, ...added];
  showAddProd.value = false; selectedVars.value = new Set();
}
function setQty(i, v) { qtys[i] = Math.max(0, Math.min(items.value[i]?.qty || 0, Number(v))); }
</script>

<template>
  <!-- Add Products sub-view -->
  <Teleport to="body">
    <div v-if="open && showAddProd" style="position:fixed;inset:0;z-index:9300;background:var(--zg-bg-elev);display:flex;flex-direction:column;">
      <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;gap:12px;flex-shrink:0;">
        <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:16px;display:flex;align-items:center;justify-content:center;" @click="showAddProd = false">←</button>
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--zg-text);">Add products</div>
          <div style="font-size:11.5px;color:var(--zg-text-dim);">#{{ order?.id || '329929328239' }}</div>
        </div>
      </div>
      <div style="padding:12px 20px;border-bottom:1px solid var(--zg-line);flex-shrink:0;position:relative;">
        <svg viewBox="0 0 16 16" width="13" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:32px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="6.5" cy="6.5" r="4"/><line x1="10" y1="10" x2="14" y2="14"/></svg>
        <input v-model="variantSearch" placeholder="Search products…" style="width:100%;height:32px;padding-left:28px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box;" />
      </div>
      <div style="flex:1;overflow-y:auto;padding:14px 20px;">
        <div style="font-size:12px;font-weight:600;color:var(--zg-text-dim);margin-bottom:8px;">Urban Looms — Swim Leggings – Pina Colada</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label v-for="v in filteredVariants" :key="v.key" style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);cursor:pointer;">
            <input type="checkbox" :checked="selectedVars.has(v.key)" @change="toggleVar(v.key)" style="accent-color:var(--zg-accent);" />
            <span style="flex:1;font-size:12px;color:var(--zg-text);">{{ v.size }} / {{ v.color }}</span>
            <span style="font-size:11px;color:var(--zg-text-dim);">{{ v.stock }} available</span>
            <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text);">{{ v.price.toFixed(2) }} AED</span>
          </label>
        </div>
      </div>
      <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <span style="font-size:12px;color:var(--zg-text-dim);">{{ selectedVars.size }} product{{ selectedVars.size !== 1 ? 's' : '' }} selected</span>
        <div style="display:flex;gap:8px;">
          <button class="rr-btn-ghost" @click="showAddProd = false">Cancel</button>
          <button class="rr-btn-primary" :disabled="!selectedVars.size" :style="{ opacity: selectedVars.size ? 1 : 0.4 }" @click="addSelectedProducts">Add</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Main drawer -->
  <ZDrawer :open="open && !showAddProd" title="Return and exchange" :subtitle="`#${order?.id || '329929328239'} · Fulfilled`" width="85vw" @close="emit('close')">
    <div class="zrr-layout">
      <!-- Left: main content -->
      <div class="zrr-main">
        <!-- Select return items -->
        <div class="zrr-card">
          <div class="zrr-card-title">Select return items</div>
          <div v-for="(item, i) in items" :key="i" class="zrr-item-row">
            <div class="zrr-item-img" />
            <div class="zrr-item-info">
              <div class="zrr-item-brand">{{ item.brand }}</div>
              <div class="zrr-item-name">{{ item.name }}</div>
              <div class="zrr-item-variant-pill">{{ item.variant }}</div>
              <div class="zrr-item-meta">SKU: {{ item.sku }}</div>
              <div class="zrr-item-meta">{{ item.price.toFixed(2) }} AED × {{ item.qty }}</div>
            </div>
            <div class="zrr-qty-wrap">
              <div class="zrr-qty-ctrl">
                <button class="zrr-qty-btn" @click="setQty(i, (qtys[i]||0) - 1)">−</button>
                <input class="zrr-qty-input" type="number" :min="0" :max="item.qty" :value="qtys[i]||0" @change="e => setQty(i, e.target.value)" />
                <button class="zrr-qty-btn" @click="setQty(i, (qtys[i]||0) + 1)">+</button>
              </div>
              <span class="zrr-qty-of">of {{ item.qty }}</span>
            </div>
            <div class="zrr-item-total">{{ (item.price * (qtys[i]||0)).toFixed(2) }} AED</div>
          </div>
          <!-- Reason select -->
          <div class="zrr-reason-row">
            <select class="zrr-reason-select" v-model="reason">
              <option value="">Reason for return</option>
              <option v-for="r in RETURN_REASONS" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
        </div>

        <!-- Exchange items -->
        <div class="zrr-card">
          <div class="zrr-card-title">Exchange items</div>
          <div class="zrr-card-sub">Items to be sent to the customer</div>
          <div v-if="exchangeItems.length && discBanner" class="zrr-info-banner">
            <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="7" x2="8" y2="11"/><circle cx="8" cy="5" r="0.5" fill="currentColor"/></svg>
            <span>This order includes order discounts that are not applied to exchange items.</span>
            <button class="zrr-banner-close" @click="discBanner = false">×</button>
          </div>
          <div v-for="(item, i) in exchangeItems" :key="i" class="zrr-item-row">
            <div class="zrr-item-img" />
            <div class="zrr-item-info">
              <div class="zrr-item-brand">Urban Looms</div>
              <div class="zrr-item-name">Swim Leggings – Pina Colada</div>
              <div class="zrr-item-variant-pill">{{ item.size }} / {{ item.color }}</div>
            </div>
            <div class="zrr-qty-wrap" style="justify-content:center;">
              <input class="zrr-qty-input" style="width:48px;" type="number" value="1" min="1" />
            </div>
            <div class="zrr-item-total">{{ item.price.toFixed(2) }} AED</div>
          </div>
          <button class="zrr-add-products-btn" @click="showAddProd = true">
            <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
            Add Products
          </button>
        </div>

        <!-- Return shipping -->
        <div class="zrr-card">
          <div class="zrr-card-title">Return shipping options</div>
          <label class="zrr-radio-row">
            <input type="radio" v-model="shipping" value="bosta" />
            <span>Process return through Bosta</span>
          </label>
          <label class="zrr-radio-row">
            <input type="radio" v-model="shipping" value="none" />
            <span>No shipping required</span>
          </label>
        </div>
      </div>

      <!-- Right: summary -->
      <div class="zrr-summary">
        <div class="zrr-summary-title">Summary</div>
        <div v-if="!hasItems" class="zrr-summary-empty">No items selected.</div>
        <template v-else>
          <div class="zrr-summary-rows">
            <div class="zrr-summary-row">
              <span>Return items ({{ returnCount }})</span>
              <span class="zrr-neg">-{{ totalReturn.toFixed(2) }} AED</span>
            </div>
            <div class="zrr-summary-row">
              <span class="zrr-summary-sub">Order discount<br/><span class="zrr-disc-code">EID2025</span></span>
              <span>{{ orderDiscount.toFixed(2) }} AED</span>
            </div>
            <div class="zrr-summary-row">
              <button class="zrr-shipping-link">Return shipping</button>
              <span class="zrr-muted">--</span>
            </div>
            <div class="zrr-summary-divider" />
            <div class="zrr-summary-row zrr-summary-total">
              <span>Expected refund</span>
              <span class="zrr-neg">{{ expectedRefund.toFixed(2) }} AED</span>
            </div>
          </div>
          <div class="zrr-no-refund-box">
            <svg viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="7" x2="8" y2="11"/><circle cx="8" cy="5" r="0.5" fill="currentColor"/></svg>
            No refund will be issued at this time.
          </div>
          <p class="zrr-no-refund-note">A notification is not sent when no return shipping is required.</p>
        </template>
        <button class="zrr-cta-btn" :disabled="!hasItems" :style="{ opacity: hasItems ? 1 : 0.4 }" @click="emit('close')">Create return</button>
      </div>
    </div>
  </ZDrawer>
</template>

<style scoped>
.zrr-layout { display:flex;gap:0;height:100%;min-height:0; }
.zrr-main { flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent; }
.zrr-summary { width:260px;flex-shrink:0;border-left:1px solid var(--zg-line);padding:16px;display:flex;flex-direction:column;gap:10px;background:var(--zg-bg-elev); }
.zrr-card { background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px; }
.zrr-card-title { font-size:13px;font-weight:700;color:var(--zg-text);margin-bottom:10px; }
.zrr-card-sub { font-size:11.5px;color:var(--zg-text-dim);margin-bottom:10px; }
.zrr-item-row { display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid var(--zg-line); }
.zrr-item-row:last-of-type { border-bottom:none; }
.zrr-item-img { width:56px;height:56px;border-radius:var(--zg-radius-md);background:var(--zg-panel-hi);border:1px solid var(--zg-line);flex-shrink:0; }
.zrr-item-info { flex:1;min-width:0; }
.zrr-item-brand { font-size:10.5px;color:var(--zg-text-dim);margin-bottom:2px; }
.zrr-item-name { font-size:12.5px;font-weight:600;color:var(--zg-text);margin-bottom:4px; }
.zrr-item-variant-pill { display:inline-block;height:18px;padding:0 7px;border-radius:9px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:10.5px;color:var(--zg-text-dim);line-height:18px;margin-bottom:4px; }
.zrr-item-meta { font-size:11px;color:var(--zg-text-dim); }
.zrr-item-total { font-family:var(--zg-mono);font-size:13px;font-weight:600;color:var(--zg-text);flex-shrink:0;min-width:80px;text-align:right;padding-top:4px; }
.zrr-qty-wrap { display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0; }
.zrr-qty-ctrl { display:flex;align-items:center;gap:0; }
.zrr-qty-btn { width:28px;height:28px;border:1px solid var(--zg-line);background:var(--zg-panel-hi);cursor:pointer;font-size:16px;color:var(--zg-text-mid);display:flex;align-items:center;justify-content:center; }
.zrr-qty-btn:first-child { border-radius:4px 0 0 4px; }
.zrr-qty-btn:last-child { border-radius:0 4px 4px 0; }
.zrr-qty-input { width:42px;height:28px;border:1px solid var(--zg-line);border-left:none;border-right:none;background:var(--zg-panel);text-align:center;font-family:var(--zg-mono);font-size:13px;color:var(--zg-text);outline:none; }
.zrr-qty-of { font-size:10.5px;color:var(--zg-text-dim); }
.zrr-reason-row { position:relative;margin-top:12px; }
.zrr-reason-select { width:100%;height:34px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer; }
.zrr-info-banner { display:flex;align-items:flex-start;gap:8px;padding:10px 12px;background:oklch(0.82 0.14 215 / 0.08);border:1px solid oklch(0.82 0.14 215 / 0.3);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-text-mid);margin-bottom:10px; }
.zrr-banner-close { background:none;border:none;cursor:pointer;color:var(--zg-text-dim);font-size:14px;margin-left:auto;flex-shrink:0; }
.zrr-add-products-btn { display:flex;align-items:center;gap:6px;padding:8px 0;border:none;background:transparent;cursor:pointer;font-family:inherit;font-size:13px;color:var(--zg-accent);font-weight:600;margin-top:8px; }
.zrr-radio-row { display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--zg-line);font-size:12.5px;color:var(--zg-text);cursor:pointer; }
.zrr-summary-title { font-size:14px;font-weight:700;color:var(--zg-text); }
.zrr-summary-empty { font-size:12px;color:var(--zg-text-dim);padding:8px 0; }
.zrr-summary-rows { display:flex;flex-direction:column;gap:8px; }
.zrr-summary-row { display:flex;justify-content:space-between;align-items:flex-start;font-size:12.5px;color:var(--zg-text); }
.zrr-summary-sub { font-size:11.5px;color:var(--zg-text-dim); }
.zrr-disc-code { font-family:var(--zg-mono);font-size:10px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);padding:0 4px;border-radius:2px; }
.zrr-shipping-link { background:none;border:none;cursor:pointer;font-family:inherit;font-size:12.5px;color:var(--zg-accent);padding:0; }
.zrr-muted { color:var(--zg-text-dim); }
.zrr-summary-divider { height:1px;background:var(--zg-line);margin:4px 0; }
.zrr-summary-total { font-weight:700; }
.zrr-neg { color:var(--zg-danger);font-weight:600; }
.zrr-no-refund-box { display:flex;align-items:flex-start;gap:6px;padding:8px 10px;background:oklch(0.82 0.14 215 / 0.06);border:1px solid oklch(0.82 0.14 215 / 0.2);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-text-mid); }
.zrr-no-refund-note { font-size:11px;color:var(--zg-text-dim);margin:0; }
.zrr-cta-btn { width:100%;height:36px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:13px;cursor:pointer;margin-top:auto; }
.rr-btn-primary { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }
.rr-btn-ghost { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
</style>
