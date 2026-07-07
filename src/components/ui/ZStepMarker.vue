<script setup>
/**
 * ZStepMarker — the "Step N of M" dotted progress marker from the auth flow.
 */
defineProps({
  total: { type: Number, default: 3 },
  current: { type: Number, default: 1 },
  label: { type: String, default: '' },
});
</script>

<template>
  <div class="zstep">
    <div class="zstep-dots">
      <span
        v-for="i in total"
        :key="i"
        class="zstep-dot"
        :class="{ 'is-on': i === current, 'is-done': i < current }"
      />
    </div>
    <span class="zstep-lbl">Step {{ current }} of {{ total }}<template v-if="label"> · {{ label }}</template></span>
  </div>
</template>

<style scoped>
.zstep {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--zg-mono);
  font-size: 10px;
  color: var(--zg-text-dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.zstep-dots { display: flex; gap: 3px; }
.zstep-dot { width: 14px; height: 2px; border-radius: 1px; background: var(--zg-line); }
.zstep-dot.is-on { background: var(--zg-accent); }
.zstep-dot.is-done { background: var(--zg-accent-dim); }
</style>
