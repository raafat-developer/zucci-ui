<script setup>
/**
 * ReturnExchangeDrawer — faithful port of ReturnExchangeDrawer from
 * zucci-return-refund.jsx: select return items, exchange items (+ Add
 * Products sub-view), return shipping options, sticky summary with expected
 * refund. 85vw drawer.
 */
import { ref, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import RRItemRow from './RRItemRow.vue';
import AddProductsView from './AddProductsView.vue';

const props = defineProps({ open: { type: Boolean, default: false }, order: { type: Object, default: null } });
const emit = defineEmits(['close']);

const RETURN_REASONS = ["Wrong size / doesn't fit", 'Damaged or defective item', 'Wrong item received', 'Item not as described', 'Changed mind', 'Quality not as expected', 'Duplicate order', 'Other'];

const items = computed(() => props.order?.lineItems || []);
const qtys = ref({});
const reason = ref('');
const shipping = ref('none');
const exchangeItems = ref([]);
const showAddProd = ref(false);
const discountBanner = ref(true);

const resetState = () => {
  qtys.value = Object.fromEntries(items.value.map((_, i) => [i, 0]));
  reason.value = ''; shipping.value = 'none'; exchangeItems.value = []; showAddProd.value = false; discountBanner.value = true;
};
watch(() => props.open, (v) => { if (v) resetState(); });

const totalReturn = computed(() => items.value.reduce((s, item, i) => s + item.price * (qtys.value[i] || 0), 0));
const orderDiscount = 55.05;
const hasItems = computed(() => totalReturn.value > 0);
const expectedRefund = computed(() => (hasItems.value ? -(totalReturn.value - orderDiscount) : 0));
const returnCount = computed(() => items.value.reduce((s, _, i) => s + (qtys.value[i] || 0), 0));

const onAddExchange = (newItems) => { exchangeItems.value = [...exchangeItems.value, ...newItems]; showAddProd.value = false; };
</script>

<template>
  <ZDrawer :open="open" title="Return and exchange" :subtitle="order ? `#${order.id} · Fulfilled` : ''" width="85vw" @close="emit('close')">
    <AddProductsView v-if="showAddProd" @cancel="showAddProd = false" @add="onAddExchange" />
    <div v-else class="zrr-layout">
      <div class="zrr-main">
        <div class="zrr-card">
          <div class="zrr-card-title">Select return items</div>
          <RRItemRow v-for="(item, i) in items" :key="i" :item="item" :qty="qtys[i] || 0" :max-qty="item.qty" @update:qty="(v) => (qtys[i] = v)" />
          <div class="zrr-reason-row" style="position:relative">
            <select class="zrr-reason-select" v-model="reason">
              <option value="">Reason for return</option>
              <option v-for="r in RETURN_REASONS" :key="r" :value="r">{{ r }}</option>
            </select>
            <svg viewBox="0 0 10 6" width="10" height="6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="position:absolute;right:14px;top:50%;transform:translateY(-50%);pointer-events:none"><path d="M1 1L5 5L9 1" /></svg>
          </div>
        </div>

        <div class="zrr-card">
          <div class="zrr-card-title">Exchange items</div>
          <div class="zrr-card-sub">Items to be sent to the customer</div>

          <div v-if="exchangeItems.length && discountBanner" class="zrr-info-banner">
            <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6" /><line x1="8" y1="7" x2="8" y2="11" /><circle cx="8" cy="5" r="0.5" fill="currentColor" /></svg>
            <span>This order includes order discounts that are not applied to exchange items. To discount exchange items, apply a product discount below.</span>
            <button class="zrr-banner-close" @click="discountBanner = false"><svg viewBox="0 0 12 12" width="10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" /></svg></button>
          </div>

          <div v-for="(item, i) in exchangeItems" :key="i" class="zrr-item-row">
            <div class="zrr-item-img" />
            <div class="zrr-item-info">
              <div class="zrr-item-brand">Urban Looms</div>
              <div class="zrr-item-name">Swim Leggings – Pina Colada</div>
              <div class="zrr-item-variant-pill">{{ item.size }} / {{ item.color }}</div>
              <div class="zrr-item-meta">SKU: CHAIR-001</div>
            </div>
            <div class="zrr-qty-wrap" style="justify-content:center"><input class="zrr-qty-input" style="width:48px" type="number" value="1" min="1" /></div>
            <div class="zrr-item-total"><div>{{ item.price.toFixed(2) }} AED</div><button class="zrr-apply-disc">Apply discount</button></div>
          </div>

          <button class="zrr-add-products-btn" @click="showAddProd = true">
            <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="7" y1="1" x2="7" y2="13" /><line x1="1" y1="7" x2="13" y2="7" /></svg>
            Add Products
          </button>
        </div>

        <div class="zrr-card">
          <div class="zrr-card-title">Return shipping options</div>
          <label class="zrr-radio-row">
            <input type="radio" name="shipping" value="bosta" v-model="shipping" />
            <div class="zrr-bosta-logo"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 17H3V6h11v11H8 M8 17a2 2 0 104 0M5 17a2 2 0 104 0" /><path d="M14 9h4l3 4v4h-3" /></svg>bosta</div>
            <span>Process return through Bosta</span>
          </label>
          <label class="zrr-radio-row"><input type="radio" name="shipping" value="none" v-model="shipping" /><span>No shipping required</span></label>
        </div>
      </div>

      <div class="zrr-summary">
        <div class="zrr-summary-title">Summary</div>
        <div v-if="!hasItems" class="zrr-summary-empty">No items selected.</div>
        <template v-else>
          <div class="zrr-summary-rows">
            <div class="zrr-summary-row"><span>Return item ({{ returnCount }})</span><span class="zrr-neg">-{{ totalReturn.toFixed(2) }} AED</span></div>
            <div class="zrr-summary-row"><span class="zrr-summary-sub">Order discount<br /><span class="zrr-disc-code">EID2025</span></span><span>{{ orderDiscount.toFixed(2) }} AED</span></div>
            <div class="zrr-summary-row"><button class="zrr-shipping-link">Return shipping</button><span class="zrr-muted">--</span></div>
            <div class="zrr-summary-divider" />
            <div class="zrr-summary-row zrr-summary-total"><span>Expected refund</span><span class="zrr-neg">{{ expectedRefund.toFixed(2) }} AED</span></div>
          </div>
          <div class="zrr-no-refund-box"><svg viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6" /><line x1="8" y1="7" x2="8" y2="11" /><circle cx="8" cy="5" r="0.5" fill="currentColor" /></svg>No refund will be issued at this time.</div>
          <p class="zrr-no-refund-note">A notification is not sent when no return shipping is required.</p>
        </template>
        <button class="zrr-cta-btn" :disabled="!hasItems" @click="emit('close')">Create return</button>
      </div>
    </div>
  </ZDrawer>
</template>
