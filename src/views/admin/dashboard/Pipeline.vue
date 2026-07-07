<template>
  <div class="zg-pipeline">
    <div v-for="stage in stages" :key="stage.id" class="zg-pipe-stage">
      <div class="zg-pipe-head">
        <span class="zg-pipe-title">{{ stage.label }}</span>
        <span class="zg-pipe-count">{{ shipments.filter(s => s.stage === stage.id).length }}</span>
      </div>
      <div class="zg-pipe-items">
        <div v-for="s in shipments.filter(s => s.stage === stage.id)" :key="s.id" class="zg-pipe-item">
          <div class="zg-pipe-id">{{ s.id }}</div>
          <div class="zg-pipe-route">{{ s.originZone }} &rarr; {{ s.destZone }}</div>
          <div class="zg-pipe-meta">
            <span class="zg-pipe-mode">{{ s.mode }}</span>
            <span v-if="s.etaMin" class="zg-pipe-eta">ETA {{ s.etaMin }}m</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  shipments: { type: Array, required: true },
  stages: { type: Array, required: true }
})
</script>

<style scoped>
.zg-pipeline { display:flex; gap:12px; overflow-x:auto; padding:12px 16px; background:var(--zg-bg); border-top:1px solid var(--zg-line); height: 260px; }
.zg-pipe-stage { flex:1; min-width:260px; background:var(--zg-panel); border:1px solid var(--zg-line); border-radius:var(--zg-radius-md); display:flex; flex-direction:column; }
.zg-pipe-head { padding:10px 12px; border-bottom:1px solid var(--zg-line); display:flex; justify-content:space-between; align-items:center; background:var(--zg-panel-hi); border-radius:var(--zg-radius-md) var(--zg-radius-md) 0 0; }
.zg-pipe-title { font-size:11.5px; font-weight:700; color:var(--zg-text); text-transform:uppercase; letter-spacing:0.04em; }
.zg-pipe-count { font-size:11px; font-weight:700; color:var(--zg-text-dim); background:var(--zg-bg); padding:2px 6px; border-radius:10px; }
.zg-pipe-items { padding:8px; display:flex; flex-direction:column; gap:8px; overflow-y:auto; flex:1; }
.zg-pipe-item { background:var(--zg-bg); border:1px solid var(--zg-line); border-radius:var(--zg-radius-md); padding:10px; cursor:pointer; }
.zg-pipe-item:hover { border-color:var(--zg-accent); }
.zg-pipe-id { font-family:var(--zg-mono); font-size:11.5px; font-weight:700; color:var(--zg-text); margin-bottom:4px; }
.zg-pipe-route { font-size:11px; color:var(--zg-text-mid); margin-bottom:6px; }
.zg-pipe-meta { display:flex; justify-content:space-between; align-items:center; }
.zg-pipe-mode { font-size:10px; font-weight:700; color:var(--zg-accent); text-transform:uppercase; padding:2px 4px; background:var(--zg-accent-tint); border-radius:3px; }
.zg-pipe-eta { font-size:10.5px; color:var(--zg-text-dim); font-family:var(--zg-mono); }
</style>
