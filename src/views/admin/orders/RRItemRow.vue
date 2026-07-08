<script setup>
/**
 * RRItemRow — shared line-item row with qty stepper, used by both Return and
 * Refund drawers. Faithful port of RRItemRow from zucci-return-refund.jsx.
 */
const props = defineProps({ item: { type: Object, required: true }, qty: { type: Number, required: true }, maxQty: { type: Number, required: true } });
const emit = defineEmits(['update:qty']);
const setQty = (v) => emit('update:qty', Math.max(0, Math.min(props.maxQty, v)));
</script>

<template>
  <div class="zrr-item-row">
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
        <button class="zrr-qty-btn" @click="setQty(qty - 1)">−</button>
        <input class="zrr-qty-input" type="number" min="0" :max="maxQty" :value="qty" @input="setQty(Number($event.target.value))" />
        <button class="zrr-qty-btn" @click="setQty(qty + 1)">+</button>
      </div>
      <span class="zrr-qty-of">of {{ maxQty }}</span>
    </div>
    <div class="zrr-item-total">{{ (item.price * qty).toFixed(2) }} AED</div>
  </div>
</template>
