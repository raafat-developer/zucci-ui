<script setup>
/**
 * ZBanner — inline status banner. Mirrors .zauth-banner variants.
 * tone: error | warn | info | good
 */
defineProps({
  tone: { type: String, default: 'info' },
  title: { type: String, default: '' },
});
</script>

<template>
  <div :class="['zbanner', `zbanner--${tone}`]">
    <span class="zbanner-icon"><slot name="icon" /></span>
    <div class="zbanner-body">
      <div v-if="title" class="zbanner-title">{{ title }}</div>
      <div class="zbanner-msg"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.zbanner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--zg-radius-md);
  font-size: 12.5px;
  line-height: 1.5;
}
.zbanner-icon :deep(svg) { flex-shrink: 0; margin-top: 1px; }
.zbanner-body { flex: 1; min-width: 0; }
.zbanner-title { color: var(--zg-text); font-weight: 500; margin-bottom: 2px; }
.zbanner-msg { color: var(--zg-text-mid); }

.zbanner--error { background: oklch(0.70 0.18 25 / 0.08); border: 1px solid oklch(0.70 0.18 25 / 0.3); }
.zbanner--error .zbanner-icon { color: var(--zg-danger); }
.zbanner--warn { background: oklch(0.82 0.15 75 / 0.08); border: 1px solid oklch(0.82 0.15 75 / 0.3); }
.zbanner--warn .zbanner-icon { color: var(--zg-warn); }
.zbanner--info { background: var(--zg-panel); border: 1px solid var(--zg-line); }
.zbanner--info .zbanner-icon { color: var(--zg-text-mid); }
.zbanner--good { background: oklch(0.78 0.15 150 / 0.08); border: 1px solid oklch(0.78 0.15 150 / 0.3); }
.zbanner--good .zbanner-icon { color: var(--zg-good); }
</style>
