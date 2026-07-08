<script setup>
/**
 * FFSteps — Fit Finder step-dot progress indicator. Faithful port of FFSteps.
 */
defineProps({ current: { type: Number, required: true }, total: { type: Number, required: true } });
</script>

<template>
  <div style="display:flex;align-items:center;gap:4px;justify-content:center;padding:16px 20px 0">
    <template v-for="i in total" :key="i - 1">
      <div :style="{ width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:700, flexShrink:0, background: (i-1) < current ? 'var(--zg-good)' : (i-1) === current ? 'var(--zg-accent)' : 'var(--zg-panel)', border: (i-1) < current || (i-1) === current ? 'none' : '1px solid var(--zg-line)', color: (i-1) < current ? '#fff' : (i-1) === current ? 'oklch(0.18 0.04 130)' : 'var(--zg-text-dim)' }">
        {{ (i - 1) < current ? '✓' : i }}
      </div>
      <div v-if="i - 1 < total - 1" :style="{ height:'2px', flex:1, background: (i-1) < current ? 'var(--zg-good)' : 'var(--zg-line)', borderRadius:'1px' }" />
    </template>
  </div>
</template>
