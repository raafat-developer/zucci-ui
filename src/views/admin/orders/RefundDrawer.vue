<script setup>
/**
 * RefundDrawer — faithful port of RefundDrawer from zucci-return-refund.jsx:
 * item qty selection, refund reason, sticky summary with payment method +
 * manual amount override. 85vw drawer.
 */
import { ref, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import RRItemRow from './RRItemRow.vue';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false }, order: { type: Object, default: null } });
const emit = defineEmits(['close']);

const items = computed(() => props.order?.lineItems || []);
const qtys = ref({});
const reason = ref('');
const infoBanner = ref(true);
const manualAmt = ref('');

watch(() => props.open, (v) => { if (v) { qtys.value = Object.fromEntries(items.value.map((_, i) => [i, 0])); reason.value = ''; manualAmt.value = ''; infoBanner.value = true; } });

const orderDiscount = 55.05;
const refundTotal = computed(() => items.value.reduce((s, item, i) => s + item.price * (qtys.value[i] || 0), 0));
const hasItems = computed(() => refundTotal.value > 0);
const refundCount = computed(() => items.value.reduce((s, _, i) => s + (qtys.value[i] || 0), 0));
const available = 2399.83;
const netRefund = computed(() => (hasItems.value ? (refundTotal.value - orderDiscount).toFixed(2) : '0.00'));

const doRefund = () => { toast.success(`AED ${netRefund.value} refunded`); emit('close'); };
</script>

<template>
  <ZDrawer :open="open" title="Refund items" :subtitle="order ? `#${order.id} · Fulfilled` : ''" width="85vw" @close="emit('close')">
    <div class="zrr-layout">
      <div class="zrr-main">
        <div v-if="infoBanner" class="zrr-info-banner zrr-info-banner--warn">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6" /><line x1="8" y1="7" x2="8" y2="11" /><circle cx="8" cy="5" r="0.5" fill="currentColor" /></svg>
          <span>Once an item is refunded, you can't start a return for it. To return an item, <button class="zrr-inline-link">create a return</button> first and then process the refund.</span>
          <button class="zrr-banner-close" @click="infoBanner = false"><svg viewBox="0 0 12 12" width="10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" /></svg></button>
        </div>

        <div class="zrr-card">
          <RRItemRow v-for="(item, i) in items" :key="i" :item="item" :qty="qtys[i] || 0" :max-qty="item.qty" @update:qty="(v) => (qtys[i] = v)" />
        </div>

        <div class="zrr-card">
          <div class="zrr-card-title">Reason for refund</div>
          <textarea class="zrr-reason-textarea" v-model="reason" placeholder="Enter the reason for the refund here…" rows="3" />
          <div class="zrr-reason-note">Only you and other staff can see this reason</div>
        </div>
      </div>

      <div class="zrr-summary">
        <div class="zrr-summary-title">Summary</div>
        <div v-if="!hasItems" class="zrr-summary-empty">No items selected.</div>
        <div v-else class="zrr-summary-rows">
          <div class="zrr-summary-row"><span>Items subtotal ({{ refundCount }})</span><span>{{ refundTotal.toFixed(2) }} AED</span></div>
          <div class="zrr-summary-row"><span class="zrr-summary-sub">Order discount<br /><span class="zrr-disc-code">EID2025</span></span><span class="zrr-neg">-{{ orderDiscount.toFixed(2) }} AED</span></div>
          <div class="zrr-summary-divider" />
          <div class="zrr-summary-row zrr-summary-total"><span>Refund total</span><span>{{ refundTotal.toFixed(2) }} AED</span></div>
        </div>

        <div class="zrr-summary-divider" style="margin:16px 0" />

        <div class="zrr-summary-title" style="font-size:13px;margin-bottom:12px">Refund amount</div>
        <div class="zrr-payment-method"><div class="zrr-card-icon"><span style="color:#eb001b;font-size:18px">●</span><span style="color:#f79e1b;font-size:18px;margin-left:-6px">●</span></div><span>Mastercard ending in **** 3888</span></div>
        <div class="zrr-amount-row">
          <input class="zrr-amount-input" type="number" :value="manualAmt || (hasItems ? netRefund : '0.00')" placeholder="0.00" @input="manualAmt = $event.target.value" />
          <span class="zrr-amount-ccy">AED</span>
        </div>
        <div class="zrr-available">{{ available.toFixed(2) }} AED available for refund</div>

        <button class="zrr-cta-btn" :disabled="!hasItems" style="margin-top:16px" @click="doRefund">Refund {{ netRefund }} AED</button>
      </div>
    </div>
  </ZDrawer>
</template>
