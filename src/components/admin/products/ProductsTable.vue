<template>
  <div class="zp-table-panel">
    <div v-if="selectedIds.length" class="zp-bulk-bar">
      <span>{{ selectedIds.length }} selected</span>
      <select class="zp-filter-select" :value="bulkAction" @change="$emit('update:bulk-action', $event.target.value)">
        <option value="">Bulk Action…</option>
        <option v-for="option in bulkActionOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <button type="button" class="zen-btn-primary" style="height:28px;font-size:11px" :disabled="!bulkAction || loading" @click="$emit('apply-bulk')">
        {{ loading ? 'Applying…' : 'Apply' }}
      </button>
      <button type="button" class="zen-btn-ghost" style="height:28px;font-size:11px" @click="$emit('clear-selection')">Clear</button>
    </div>

    <div class="zp-table-wrap">
      <div class="zp-table">
        <div class="zp-table-head">
          <span class="zp-col-check"><input type="checkbox" :checked="selectedIds.length === products.length && products.length > 0" @change="$emit('toggle-all')" /></span>
          <span class="zp-col-product">Product</span>
          <span class="zp-col-brand">Brand / Vendor</span>
          <span class="zp-col-sku">SKU</span>
          <span class="zp-col-markets">Markets</span>
          <span class="zp-col-inventory">Inventory</span>
          <span class="zp-col-status">Status</span>
          <span class="zp-col-approval">Approval</span>
          <span class="zp-col-sync">Source</span>
          <span class="zp-col-actions"></span>
        </div>

        <div
          v-for="product in products"
          :key="product.id"
          class="zp-table-row"
          :class="{ 'is-selected': selectedIds.includes(product.id) }"
          @click="$emit('open-product', product.id)"
        >
          <span class="zp-col-check" @click.stop>
            <input type="checkbox" :checked="selectedIds.includes(product.id)" @change="$emit('toggle-select', product.id)" />
          </span>
          <span class="zp-col-product">
            <div class="zp-thumb">
              <img v-if="product.thumbnail" :src="product.thumbnail" alt="" style="width:28px;height:28px;object-fit:cover;border-radius:4px" />
              <svg v-else viewBox="0 0 32 32" width="28" height="28" fill="none"><rect width="32" height="32" rx="4" fill="var(--zg-panel-hi)" /><path d="M8 22L12 16L16 20L20 14L24 22Z" stroke="var(--zg-line)" stroke-width="1.2" fill="none" stroke-linejoin="round" /><circle cx="11" cy="12" r="2" stroke="var(--zg-line)" stroke-width="1.2" /></svg>
            </div>
            <div class="zp-product-info">
              <div class="zp-product-name">{{ product.name }}</div>
              <span v-if="product.isVariable" class="zp-variant-count">{{ product.variantCount }} variants</span>
              <span v-if="product.returnPolicy === 'non_returnable'" class="zp-non-return-tag">Non-returnable</span>
            </div>
          </span>
          <span class="zp-col-brand">
            <div class="zp-brand-name">{{ product.brand }}</div>
            <div class="zp-vendor-name">{{ product.vendor }}</div>
          </span>
          <span class="zp-col-sku"><span class="zp-sku">{{ product.sku }}</span></span>
          <span class="zp-col-markets">
            <span v-for="market in (product.markets || [])" :key="market" class="zp-market-pill" >{{ markets[market] }}</span>
          </span>
          <span class="zp-col-inventory">
            <span :class="{ 'zp-stock-zero': product.inventoryTotal === 0 }">{{ product.inventoryTotal }} pcs</span>
          </span>
          <span class="zp-col-status">
            <span class="zp-status-badge" :style="{ background: statusMeta(product.status).bg, color: statusMeta(product.status).color }">{{ statusMeta(product.status).label }}</span>
          </span>
          <span class="zp-col-approval">
            <span style="font-size:11px;font-family:var(--zg-mono);font-weight:600" :style="{ color: approvalMeta(product.approvalStatus).color }">{{ approvalMeta(product.approvalStatus).label }}</span>
          </span>
          <span class="zp-col-sync">
            <span style="font-size:10.5px;font-family:var(--zg-mono)" :style="{ color: syncMeta(product.syncSource).color }">{{ syncMeta(product.syncSource).label }}</span>
            <span v-if="product.syncStatus === 'synced'" class="zp-sync-dot" />
          </span>
          <span class="zp-col-actions" @click.stop>
            <button type="button" class="zen-act-btn-sm" title="Preview">
              <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><ellipse cx="7" cy="7" rx="6" ry="4" /><circle cx="7" cy="7" r="1.5" /></svg>
            </button>
          </span>
        </div>

        <div v-if="error" class="zp-empty" style="color:var(--zg-danger)">{{ error }}</div>
        <div v-else-if="!products.length" class="zp-empty">{{ loading ? 'Loading products…' : 'No products match your filters.' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    default: () => []
  },
  selectedIds: {
    type: Array,
    default: () => []
  },
  bulkAction: {
    type: String,
    default: ''
  },
  bulkActionOptions: {
    type: Array,
    default: () => []
  },
  markets: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  statusMeta: {
    type: Function,
    required: true
  },
  approvalMeta: {
    type: Function,
    required: true
  },
  syncMeta: {
    type: Function,
    required: true
  }
})

defineEmits([
  'update:bulk-action',
  'apply-bulk',
  'clear-selection',
  'toggle-all',
  'toggle-select',
  'open-product'
])
</script>

<style scoped>
.zp-table-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}
</style>
