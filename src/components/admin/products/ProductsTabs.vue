<template>
  <div class="zp-status-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="zp-status-tab"
      :class="{ 'is-active': currentTab === tab.value }"
      @click="$emit('update:current-tab', tab.value)"
    >
      {{ tab.label }}
      <span class="zp-tab-count">{{ tabCounts[tab.value] || 0 }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    default: () => []
  },
  currentTab: {
    type: String,
    default: 'all'
  },
  tabCounts: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['update:current-tab'])
</script>
