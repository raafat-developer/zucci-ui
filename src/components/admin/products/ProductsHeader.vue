<template>
  <div class="zp-header">
    <div class="zp-header-left">
      <div class="zp-title">Products</div>
      <div class="zp-subtitle">{{ productsCount }} products · across {{ brandsCount }} brands</div>
    </div>
    <div class="zp-header-right">
      <button type="button" class="zen-btn-ghost" @click="$emit('export')">Export</button>
      <button type="button" class="zen-btn-ghost" @click="$emit('import')">Import</button>
      <button type="button" class="zen-btn-primary" @click="$emit('add-product')">+ Add Product</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  productsCount: {
    type: Number,
    default: 0
  },
  brandsCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['export', 'import', 'add-product'])
</script>
