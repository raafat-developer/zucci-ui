<script setup>
defineProps({
  buyer:  { type: Object,  required: true },
  active: { type: Boolean, default: false },
});
defineEmits(['click']);
</script>

<template>
  <button class="zen-list-row" :class="{ 'is-active': active }" @click="$emit('click')">
    <div class="zen-list-row-name">{{ buyer.firstName }} {{ buyer.lastName }}</div>
    <div class="zen-list-row-meta">
      #{{ buyer.id }} · {{ buyer.stats.totalOrders }} orders · {{ buyer.currency }} {{ buyer.stats.totalSpend?.toLocaleString() }}
    </div>
  </button>
</template>
