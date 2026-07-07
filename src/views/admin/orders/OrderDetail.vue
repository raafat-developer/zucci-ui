<script setup>
/**
 * OrderDetail — center pane: header, tax e-invoice, status bar, line items,
 * summary, individual items status, timeline. Faithful port of the React
 * ZucciOrderDetail composition.
 */
import { ref, computed } from 'vue';
import { ZC_ORDER_STATUS_STEPS } from '@/data/ordersData';
import { toast } from '@/composables/useToast';
import ItemsStatus from './ItemsStatus.vue';
import OrderTimeline from './OrderTimeline.vue';

const props = defineProps({ order: { type: Object, required: true } });
const emit = defineEmits(['user-click', 'status-expand']);

const steps = ZC_ORDER_STATUS_STEPS;
const itemCount = computed(() => props.order.lineItems.reduce((s, i) => s + i.qty, 0));
const copyTrack = (v, label) => { if (v) navigator.clipboard?.writeText(v).catch(() => {}); toast.success(label + ' copied'); };
const editTrack = (label) => toast.info('Edit ' + label + '…');

// E-invoice
const market = computed(() => {
  const c = props.order.shippingAddr?.country || 'AE';
  if (c === 'Saudi Arabia') return 'SA'; if (c === 'Egypt') return 'EG'; if (c === 'Qatar') return 'QA'; return 'AE';
});
const authorityMap = { SA:'ZATCA', EG:'ETA', AE:'FTA', QA:'GTA' };
const authority = computed(() => authorityMap[market.value] || 'FTA');
const invoiceId = computed(() => `INV-${authority.value}-${props.order.id.replace(/\D/g, '').slice(-5)}`);
const invStatus = ref(market.value === 'EG' ? 'pending' : 'cleared');
const statusMeta = { cleared:{ label:'Cleared', color:'var(--zg-good)', bg:'oklch(0.78 0.15 150 / 0.1)' }, pending:{ label:'Pending', color:'var(--zg-warn)', bg:'oklch(0.82 0.15 75 / 0.1)' }, failed:{ label:'Failed', color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.1)' } };
const marketName = computed(() => ({ SA:'Saudi Arabia', EG:'Egypt', AE:'UAE', QA:'Qatar' }[market.value]));
const vatRate = computed(() => ({ SA:'15%', EG:'14%', AE:'5%', QA:'0%' }[market.value]));
</script>

<template>
  <div class="zco-detail">
    <!-- Header -->
    <div class="zco-detail-head">
      <div class="zco-detail-head-top">
        <div class="zco-order-id">#{{ order.id }}</div>
        <span class="zco-pill zco-pill--transit">In Transit</span>
        <div class="zco-refund-window">{{ order.refundWindow }}</div>
      </div>
      <div class="zco-carrier-row">
        <div class="zco-carrier-badge"><span class="zco-carrier-dot" /><span class="zco-carrier-name">{{ order.carrier }}</span></div>
        <div class="zco-tracking-field">
          <div class="zco-tracking-label">Internal Tracking Code</div>
          <div class="zco-tracking-value">{{ order.internalTracking }}<button title="Copy" @click="copyTrack(order.internalTracking, 'Internal tracking')">⧉</button><button title="Edit" @click="editTrack('internal tracking')">✎</button></div>
        </div>
        <div class="zco-tracking-field">
          <div class="zco-tracking-label">International Tracking Code</div>
          <div class="zco-tracking-value">{{ order.internationalTracking }}<button title="Copy" @click="copyTrack(order.internationalTracking, 'International tracking')">⧉</button><button title="Edit" @click="editTrack('international tracking')">✎</button></div>
        </div>
        <div class="zco-tracking-field">
          <div class="zco-tracking-label">Estimated Delivery Date</div>
          <div class="zco-tracking-value" style="font-family:var(--zg-mono);font-size:11.5px">{{ order.estimatedDelivery }}</div>
        </div>
      </div>
    </div>

    <!-- Tax invoice -->
    <div class="zco-section" style="padding-top:10px;padding-bottom:10px">
      <div class="zco-section-head">
        <div class="zco-section-title">Tax Invoice</div>
        <span class="zf-type-badge" :style="{ background: statusMeta[invStatus].bg, color: statusMeta[invStatus].color }">{{ authority }} · {{ statusMeta[invStatus].label }}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;padding:8px 0">
        <div style="flex:1">
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <div class="zen-bank-field" style="padding:0"><div class="zen-field-label">Invoice ID</div><div class="zen-field-val zen-field-mono" style="font-size:11px">{{ invoiceId }}</div></div>
            <div class="zen-bank-field" style="padding:0"><div class="zen-field-label">Authority</div><div class="zen-field-val">{{ authority }} — {{ marketName }}</div></div>
            <div class="zen-bank-field" style="padding:0"><div class="zen-field-label">VAT Rate</div><div class="zen-field-val">{{ vatRate }}</div></div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <button class="zen-doc-card-btn">Download PDF</button>
          <button v-if="invStatus === 'pending'" class="zen-doc-card-btn zen-doc-card-btn--approve" @click="invStatus = 'cleared'">Submit to {{ authority }}</button>
        </div>
      </div>
    </div>

    <!-- Status bar -->
    <div class="zco-status-bar">
      <div class="zco-status-bar-label">
        <span>Order Status</span>
        <button class="zco-status-expand" title="View full history" @click="emit('status-expand')">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 4l4 4-4 4" /></svg>
        </button>
      </div>
      <div class="zco-status-steps">
        <template v-for="(step, i) in steps" :key="step">
          <div v-if="i > 0" class="zco-step-connector" :class="{ 'is-done': i <= order.currentStep }" />
          <div class="zco-step-node">
            <div class="zco-step-dot" :class="{ 'is-done': i <= order.currentStep, 'is-current': i === order.currentStep + 1 }" />
            <div class="zco-step-label" :class="{ 'is-done': i <= order.currentStep, 'is-current': i === order.currentStep + 1 }">{{ step }}</div>
          </div>
        </template>
      </div>
    </div>

    <!-- Line items -->
    <div class="zco-section">
      <div class="zco-section-head"><div class="zco-section-title">Order Details</div></div>
      <div v-for="(item, i) in order.lineItems" :key="i" class="zco-item-row">
        <div class="zco-item-img" />
        <div class="zco-item-info">
          <div class="zco-item-brand">{{ item.brand }}</div>
          <div class="zco-item-name">{{ item.name }}</div>
          <div class="zco-item-variant">{{ item.variant }}</div>
          <div class="zco-item-sku">SKU: {{ item.sku }}</div>
        </div>
        <div class="zco-item-price">
          <div class="zco-item-total">{{ (item.price * item.qty).toFixed(2) }} AED</div>
          <div class="zco-item-unit">{{ item.price.toFixed(2) }} AED × {{ item.qty }}</div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="zco-section">
      <div class="zco-summary">
        <div class="zco-summary-row"><span class="zco-summary-key">Subtotal<small>{{ itemCount }} items</small></span><span class="zco-summary-val">{{ order.subtotal.toFixed(2) }} AED</span></div>
        <div class="zco-summary-row"><span class="zco-summary-key">Shipping<small>{{ order.shippingLabel }}</small></span><span class="zco-summary-val">{{ order.shippingCost.toFixed(2) }} AED</span></div>
        <div class="zco-summary-row is-total"><span class="zco-summary-key">Total</span><span class="zco-summary-val">{{ order.total.toFixed(2) }} AED</span></div>
        <div class="zco-summary-row"><span class="zco-summary-key">Refunded</span><span class="zco-summary-val">{{ order.refunded.toFixed(2) }} AED</span></div>
        <div class="zco-summary-row"><span class="zco-summary-key">Paid<small>{{ order.settlementNote }}</small></span><span class="zco-summary-val">{{ order.paid.toFixed(2) }} AED</span></div>
      </div>
    </div>

    <ItemsStatus :order="order" />
    <OrderTimeline :order="order" @user-click="emit('user-click', $event)" />
  </div>
</template>
