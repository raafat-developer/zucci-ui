<script setup>
import { ref, watch, computed } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';

const props = defineProps({ order: { type: Object, default: null } });
const emit  = defineEmits(['close']);

// Keep last non-null order so drawer doesn't go blank while closing
const last = ref(props.order);
watch(() => props.order, v => { if (v) last.value = v; });
const o = computed(() => last.value);

const STATUS_META = {
  delivered:  { label:'Delivered',  color:'var(--zg-good)' },
  in_transit: { label:'In Transit', color:'var(--zg-warn)' },
  returned:   { label:'Returned',   color:'var(--zg-danger)' },
  cancelled:  { label:'Cancelled',  color:'var(--zg-text-dim)' },
};
const sm = computed(() => o.value ? (STATUS_META[o.value.status] || STATUS_META.delivered) : STATUS_META.delivered);

function taxInfo(ord) {
  const authority = ord.currency === 'SAR' ? 'ZATCA' : ord.currency === 'EGP' ? 'ETA' : 'FTA';
  const vatRate   = ord.currency === 'SAR' ? 15 : ord.currency === 'EGP' ? 14 : 5;
  const vatAmt    = (ord.amount * vatRate / (100 + vatRate)).toFixed(2);
  const preAmt    = (ord.amount - parseFloat(vatAmt)).toFixed(2);
  return { authority, vatRate, vatAmt, preAmt };
}
</script>

<template>
  <ZDrawer :open="!!order" :title="o?.id || ''" :subtitle="o ? `${o.date} · ${o.brand}` : ''" size="sm" @close="emit('close')">
    <template #footer>
      <button class="zen-btn-ghost" @click="emit('close')">Close</button>
      <button class="zen-btn-primary" @click="">Open Full Order →</button>
    </template>

    <div v-if="o" class="zen-tab-body" style="padding:16px 20px;">
      <!-- Status pill -->
      <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);">
        <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;" :style="{ background: sm.color }" />
        <span style="font-weight:600;font-family:var(--zg-mono);font-size:11px;letter-spacing:0.06em;" :style="{ color: sm.color }">{{ sm.label }}</span>
        <span style="margin-left:auto;font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-dim);">{{ o.date }}</span>
      </div>

      <!-- Order meta -->
      <div class="zen-card" style="margin-top:12px;">
        <div class="zen-bank-fields">
          <div class="zen-bank-field"><div class="zen-field-label">Order ID</div><div class="zen-field-val zen-field-mono">{{ o.id }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Brand</div><div class="zen-field-val">{{ o.brand }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Items</div><div class="zen-field-val">{{ o.items }} item{{ o.items !== 1 ? 's' : '' }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Currency</div><div class="zen-field-val">{{ o.currency }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Total</div><div class="zen-field-val zen-field-mono" style="font-size:16px;font-weight:700;color:var(--zg-accent);">{{ o.currency }} {{ o.amount.toLocaleString() }}</div></div>
        </div>
      </div>

      <!-- Items -->
      <div class="zen-card" style="margin-top:8px;">
        <div class="zen-card-head"><span class="zen-card-title">Items in Order</span></div>
        <div class="zen-pd-simple-row">
          <div style="flex:1;">
            <div style="font-size:12.5px;color:var(--zg-text);font-weight:500;">{{ o.brand }} Item A</div>
            <span class="zen-brand-cat-tag" style="display:inline-block;margin-top:3px;">Swimwear</span>
          </div>
          <span class="zen-payout-amount">{{ o.currency }} {{ (o.amount * 0.45).toFixed(2) }}</span>
        </div>
        <div v-if="o.items > 1" class="zen-pd-simple-row">
          <div style="flex:1;">
            <div style="font-size:12.5px;color:var(--zg-text);font-weight:500;">{{ o.brand }} Item B</div>
            <span class="zen-brand-cat-tag" style="display:inline-block;margin-top:3px;">Women's Fashion</span>
          </div>
          <span class="zen-payout-amount">{{ o.currency }} {{ (o.amount * 0.55).toFixed(2) }}</span>
        </div>
      </div>

      <!-- VAT Invoice -->
      <div class="zen-card" style="margin-top:8px;">
        <div class="zen-card-head"><span class="zen-card-title">Tax Invoice</span></div>
        <div class="zen-bank-fields">
          <div class="zen-bank-field"><div class="zen-field-label">Authority</div><div class="zen-field-val">{{ taxInfo(o).authority }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">VAT Rate</div><div class="zen-field-val">{{ taxInfo(o).vatRate }}% (inclusive)</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">VAT Amount</div><div class="zen-field-val zen-field-mono">{{ o.currency }} {{ taxInfo(o).vatAmt }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Pre-tax Amount</div><div class="zen-field-val zen-field-mono">{{ o.currency }} {{ taxInfo(o).preAmt }}</div></div>
        </div>
        <button class="zen-doc-card-btn" style="margin-top:8px;" @click="">Download Invoice PDF</button>
      </div>

      <!-- Actions -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
        <button v-if="o.status === 'delivered'" class="zen-doc-card-btn" @click="">Initiate Return</button>
        <button class="zen-doc-card-btn" @click="">Invoice PDF</button>
      </div>
    </div>
  </ZDrawer>
</template>
