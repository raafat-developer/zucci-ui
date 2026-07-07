<template>
  <div class="zg-filterbar">
    <div class="zg-filter-group">
      <div class="zg-filter-lbl">Fulfillment</div>
      <div class="zg-filter-chips">
        <button class="zg-chip" :class="{ 'is-on': filters.mode.includes('zugooo') }" @click="toggle('mode','zugooo')">
          <span class="zg-chip-swatch zg-chip-swatch--accent"></span> Consignment
        </button>
        <button class="zg-chip" :class="{ 'is-on': filters.mode.includes('mixed') }" @click="toggle('mode','mixed')">
          <span class="zg-chip-swatch zg-chip-swatch--accent-dim"></span> Shopify Connect
        </button>
        <button class="zg-chip" :class="{ 'is-on': filters.mode.includes('3p') }" @click="toggle('mode','3p')">
          <span class="zg-chip-swatch zg-chip-swatch--muted"></span> 3PL
        </button>
      </div>
    </div>
    
    <div class="zg-filter-group">
      <div class="zg-filter-lbl">Carrier</div>
      <div class="zg-filter-chips">
        <button class="zg-chip" :class="{ 'is-on': filters.fleet.includes('owned') }" @click="toggle('fleet','owned')">Zucci Fleet</button>
        <button class="zg-chip" :class="{ 'is-on': filters.fleet.includes('freelance') }" @click="toggle('fleet','freelance')">Contracted</button>
        <button class="zg-chip" :class="{ 'is-on': filters.fleet.includes('3p') }" @click="toggle('fleet','3p')">3P Partner</button>
      </div>
    </div>
    
    <div class="zg-filter-group">
      <div class="zg-filter-lbl">Vehicle</div>
      <div class="zg-filter-chips">
        <button class="zg-chip" :class="{ 'is-on': filters.vehicle.includes('car') }" @click="toggle('vehicle','car')">Cars</button>
        <button class="zg-chip" :class="{ 'is-on': filters.vehicle.includes('bike') }" @click="toggle('vehicle','bike')">Bikes</button>
        <button class="zg-chip" :class="{ 'is-on': filters.vehicle.includes('truck') }" @click="toggle('vehicle','truck')">Vans</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  filters: { type: Object, required: true }
})
const emit = defineEmits(['update:filters'])

const toggle = (key, val) => {
  const set = new Set(props.filters[key])
  if (set.has(val)) set.delete(val)
  else set.add(val)
  emit('update:filters', { ...props.filters, [key]: Array.from(set) })
}
</script>

<style scoped>
/* Inherited from global CSS */
</style>
