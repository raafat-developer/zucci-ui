<template>
  <div class="zg-kpis">
    <button v-for="t in tiles" :key="t.id"
            class="zg-kpi" :class="{ 'is-active': activeKpi === t.id }"
            @click="emit('update:activeKpi', t.id)">
      <div class="zg-kpi-head">
        <span class="zg-kpi-label">{{ t.label }}</span>
        <span :class="['zg-kpi-delta', `zg-kpi-delta--${t.deltaKind}`]">{{ t.delta }}</span>
      </div>
      <div class="zg-kpi-value">{{ t.value }}</div>
    </button>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  kpis: { type: Object, required: true },
  activeKpi: { type: String, required: true }
})
const emit = defineEmits(['update:activeKpi'])

const fmt = (n) => n >= 1000 ? (n/1000).toFixed(1)+'K' : String(n)
const fmtAed = (n) => 'AED ' + (n >= 1000 ? (n/1000).toFixed(0)+'K' : n)

const tiles = computed(() => [
  { id: 'active', label: 'Active Orders', value: fmt(props.kpis.activeOrders), delta: '+4.3%', deltaKind: 'pos' },
  { id: 'transit', label: 'In Transit', value: fmt(props.kpis.inTransit), delta: '+2.1%', deltaKind: 'pos' },
  { id: 'pending', label: 'Pending Pickup', value: fmt(props.kpis.pendingPickup), delta: '-1.5%', deltaKind: 'neg' },
  { id: 'qc', label: 'QC Holds', value: fmt(props.kpis.qcHolds), delta: '+3', deltaKind: 'warn' },
  { id: 'returns', label: 'Returns', value: fmt(props.kpis.returnsInProgress), delta: '+6', deltaKind: 'warn' },
  { id: 'onTime', label: 'On-Time Rate', value: (props.kpis.onTimeRate*100).toFixed(1)+'%', delta: '+0.4pp', deltaKind: 'pos' },
  { id: 'sla', label: 'SLA Breaches', value: fmt(props.kpis.slaBreaches), delta: '+2', deltaKind: 'neg' },
])
</script>

<style scoped>
/* Basic styles inherited from global CSS */
</style>
