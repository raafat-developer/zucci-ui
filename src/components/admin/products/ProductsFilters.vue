<template>
  <div class="zp-filters">
    <div class="zp-search">
      <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="5.5" cy="5.5" r="3.5" /><line x1="8.5" y1="8.5" x2="12.5" y2="12.5" /></svg>
      <input :value="searchValue" placeholder="Search name, SKU, vendor, brand…" @input="$emit('update:search-value', $event.target.value)" />
      <button v-if="searchValue" type="button" class="zen-actlog-clear" @click="$emit('update:search-value', '')">×</button>
    </div>

    <select class="zp-filter-select" :value="filters.vendor" @change="updateFilter('vendor', $event.target.value)">
      <option value="all">All Vendors</option>
      <option v-for="vendor in vendors" :key="vendor" :value="vendor">{{ vendor }}</option>
    </select>

    <select class="zp-filter-select" :value="filters.brand" @change="updateFilter('brand', $event.target.value)">
      <option value="all">All Brands</option>
      <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
    </select>

    <select class="zp-filter-select" :value="filters.category" @change="updateFilter('category', $event.target.value)">
      <option value="all">All Categories</option>
      <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
    </select>

    <select class="zp-filter-select" :value="filters.market" @change="updateFilter('market', $event.target.value)">
      <option value="all">All Markets</option>
      <option v-for="market in markets" :key="market" :value="market">{{ market }}</option>
    </select>

    <select class="zp-filter-select" :value="filters.approval" @change="updateFilter('approval', $event.target.value)">
      <option value="all">All Approval</option>
      <option value="approved">Approved</option>
      <option value="pending">Pending Review</option>
      <option value="rejected">Rejected</option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  searchValue: {
    type: String,
    default: ''
  },
  filters: {
    type: Object,
    default: () => ({
      vendor: 'all',
      brand: 'all',
      category: 'all',
      market: 'all',
      approval: 'all'
    })
  },
  vendors: {
    type: Array,
    default: () => []
  },
  brands: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  },
  markets: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:search-value', 'update:filters'])

const updateFilter = (key, value) => {
  emit('update:filters', {
    ...props.filters,
    [key]: value
  })
}
</script>
