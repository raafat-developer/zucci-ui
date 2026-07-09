<script setup>
import { ref, reactive, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';

const props = defineProps({ open: Boolean, order: Object });
const emit  = defineEmits(['close']);

const qtys      = reactive({});
const reason    = ref('');
const infoBanner = ref(true);
const manualAmt  = ref('');

const items = computed(() => props.order?.lineItems || []);

watch(() => props.open, (v) => {
  if (!v) return;
  items.value.forEach((_, i) => (qtys[i] = 0));
  reason.value = ''; manualAmt.value = '';
});

function setQty(i, v) { qtys[i] = Math.max(0, Math.min(items.value[i]?.qty || 0, Number(v))); }

const refundTotal   = computed(() => items.value.reduce((s, item, i) => s + item.price * (qtys[i] || 0), 0));
const hasItems      = computed(() => refundTotal.value > 0);
const returnCount   = computed(() => items.value.reduce((s, _, i) => s + (qtys[i] || 0), 0));
const orderDiscount = 55.05;
const available     = 2399.83;
const displayAmt    = computed(() => manualAmt.value || (hasItems.value ? (refundTotal.value - orderDiscount).toFixed(2) : '0.00'));
</script>

<template>
  <ZDrawer :open="open" title="Refund items" :subtitle="`#${order?.id || '329929328239'} · Fulfilled`" width="85vw" @close="emit('close')">
    <div class="zrr-layout">
      <!-- Left -->
      <div class="zrr-main">
        <!-- Info banner -->
        <div v-if="infoBanner" class="zrr-info-banner">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="7" x2="8" y2="11"/><circle cx="8" cy="5" r="0.5" fill="currentColor"/></svg>
          <span>Once an item is refunded, you can't start a return for it. To return an item, <button class="zrr-inline-link">create a return</button> first and then process the refund.</span>
          <button class="zrr-banner-close" @click="infoBanner = false">×</button>
        </div>

        <!-- Items -->
        <div class="zrr-card">
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
                <button class="zrr-qty-btn" @click="setQty(i, (qtys[i]||0)-1)">−</button>
                <input class="zrr-qty-input" type="number" :min="0" :max="item.qty" :value="qtys[i]||0" @change="e => setQty(i, e.target.value)" />
                <button class="zrr-qty-btn" @click="setQty(i, (qtys[i]||0)+1)">+</button>
              </div>
              <span class="zrr-qty-of">of {{ item.qty }}</span>
            </div>
            <div class="zrr-item-total">{{ (item.price * (qtys[i]||0)).toFixed(2) }} AED</div>
          </div>
        </div>

        <!-- Reason -->
        <div class="zrr-card">
          <div class="zrr-card-title">Reason for refund</div>
          <textarea class="zrr-reason-textarea" v-model="reason" placeholder="Enter the reason for the refund here…" rows="3" />
          <div class="zrr-reason-note">Only you and other staff can see this reason</div>
        </div>
      </div>

      <!-- Right: summary -->
      <div class="zrr-summary">
        <div class="zrr-summary-title">Summary</div>
        <div v-if="!hasItems" class="zrr-summary-empty">No items selected.</div>
        <div v-else class="zrr-summary-rows">
          <div class="zrr-summary-row">
            <span>Items subtotal ({{ returnCount }})</span>
            <span>{{ refundTotal.toFixed(2) }} AED</span>
          </div>
          <div class="zrr-summary-row">
            <span class="zrr-summary-sub">Order discount<br/><span class="zrr-disc-code">EID2025</span></span>
            <span class="zrr-neg">-{{ orderDiscount.toFixed(2) }} AED</span>
          </div>
          <div class="zrr-summary-divider" />
          <div class="zrr-summary-row zrr-summary-total">
            <span>Refund total</span>
            <span>{{ refundTotal.toFixed(2) }} AED</span>
          </div>
        </div>

        <div class="zrr-summary-divider" style="margin:16px 0;" />
        <div class="zrr-summary-title" style="font-size:13px;margin-bottom:12px;">Refund amount</div>

        <!-- Payment method -->
        <div class="zrr-payment-method">
          <span style="color:#eb001b;font-size:18px;line-height:1;">●</span>
          <span style="color:#f79e1b;font-size:18px;margin-left:-6px;line-height:1;">●</span>
          <span style="font-size:12.5px;color:var(--zg-text);margin-left:6px;">Mastercard ending in **** 3888</span>
        </div>

        <!-- Amount input -->
        <div class="zrr-amount-row">
          <input class="zrr-amount-input" type="number" :value="displayAmt" placeholder="0.00" @input="e => manualAmt = e.target.value" />
          <span class="zrr-amount-ccy">AED</span>
        </div>
        <div class="zrr-available">{{ available.toFixed(2) }} AED available for refund</div>

        <button class="zrr-cta-btn" :disabled="!hasItems" :style="{ opacity: hasItems?1:0.4, marginTop:'16px' }" @click="emit('close')">
          Refund {{ displayAmt }} AED
        </button>
      </div>
    </div>
  </ZDrawer>
</template>

<style scoped>
.zrr-layout { display:flex;height:100%;min-height:0; }
.zrr-main { flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent; }
.zrr-summary { width:260px;flex-shrink:0;border-left:1px solid var(--zg-line);padding:16px;display:flex;flex-direction:column;gap:10px;background:var(--zg-bg-elev); }
.zrr-card { background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px; }
.zrr-card-title { font-size:13px;font-weight:700;color:var(--zg-text);margin-bottom:10px; }
.zrr-item-row { display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid var(--zg-line); }
.zrr-item-img { width:56px;height:56px;border-radius:var(--zg-radius-md);background:var(--zg-panel-hi);border:1px solid var(--zg-line);flex-shrink:0; }
.zrr-item-info { flex:1;min-width:0; }
.zrr-item-brand { font-size:10.5px;color:var(--zg-text-dim); }
.zrr-item-name { font-size:12.5px;font-weight:600;color:var(--zg-text);margin:2px 0 4px; }
.zrr-item-variant-pill { display:inline-block;height:18px;padding:0 7px;border-radius:9px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:10.5px;color:var(--zg-text-dim);line-height:18px;margin-bottom:4px; }
.zrr-item-meta { font-size:11px;color:var(--zg-text-dim); }
.zrr-item-total { font-family:var(--zg-mono);font-size:13px;font-weight:600;color:var(--zg-text);flex-shrink:0;min-width:80px;text-align:right; }
.zrr-qty-wrap { display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0; }
.zrr-qty-ctrl { display:flex;align-items:center; }
.zrr-qty-btn { width:28px;height:28px;border:1px solid var(--zg-line);background:var(--zg-panel-hi);cursor:pointer;font-size:16px;color:var(--zg-text-mid);display:flex;align-items:center;justify-content:center; }
.zrr-qty-btn:first-child { border-radius:4px 0 0 4px; }
.zrr-qty-btn:last-child { border-radius:0 4px 4px 0; }
.zrr-qty-input { width:42px;height:28px;border:1px solid var(--zg-line);border-left:none;border-right:none;background:var(--zg-panel);text-align:center;font-family:var(--zg-mono);font-size:13px;color:var(--zg-text);outline:none; }
.zrr-qty-of { font-size:10.5px;color:var(--zg-text-dim); }
.zrr-reason-textarea { width:100%;padding:8px 10px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;resize:vertical;box-sizing:border-box; }
.zrr-reason-note { font-size:11px;color:var(--zg-text-dim);margin-top:6px; }
.zrr-info-banner { display:flex;align-items:flex-start;gap:8px;padding:10px 12px;background:oklch(0.82 0.15 75 / 0.08);border:1px solid oklch(0.82 0.15 75 / 0.3);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-text-mid); }
.zrr-banner-close { background:none;border:none;cursor:pointer;color:var(--zg-text-dim);font-size:14px;margin-left:auto; }
.zrr-inline-link { background:none;border:none;cursor:pointer;color:var(--zg-accent);font-family:inherit;font-size:11.5px;padding:0;text-decoration:underline; }
.zrr-summary-title { font-size:14px;font-weight:700;color:var(--zg-text); }
.zrr-summary-empty { font-size:12px;color:var(--zg-text-dim); }
.zrr-summary-rows { display:flex;flex-direction:column;gap:8px; }
.zrr-summary-row { display:flex;justify-content:space-between;align-items:flex-start;font-size:12.5px;color:var(--zg-text); }
.zrr-summary-sub { font-size:11.5px;color:var(--zg-text-dim); }
.zrr-disc-code { font-family:var(--zg-mono);font-size:10px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);padding:0 4px;border-radius:2px; }
.zrr-summary-divider { height:1px;background:var(--zg-line); }
.zrr-summary-total { font-weight:700; }
.zrr-neg { color:var(--zg-danger);font-weight:600; }
.zrr-payment-method { display:flex;align-items:center;padding:8px 0; }
.zrr-amount-row { display:flex;align-items:center;gap:8px;padding:8px 0; }
.zrr-amount-input { flex:1;height:36px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:15px;font-weight:700;color:var(--zg-accent);outline:none; }
.zrr-amount-ccy { font-family:var(--zg-mono);font-size:13px;color:var(--zg-text-dim);flex-shrink:0; }
.zrr-available { font-size:11px;color:var(--zg-text-dim); }
.zrr-cta-btn { width:100%;height:36px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:13px;cursor:pointer; }
</style>
