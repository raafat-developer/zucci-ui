<script setup>
/**
 * ZContextMenu — a small anchored action menu (the "⋯ options" fly-out used
 * across modules). Teleported to body, closes on outside-click / Esc / select.
 * items: [{ label, icon?, danger?, disabled?, action }]  or  { divider: true }
 */
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
});
const emit = defineEmits(['close']);
const rootRef = ref(null);

const onDown = (e) => { if (rootRef.value && !rootRef.value.contains(e.target)) emit('close'); };
const onKey = (e) => { if (e.key === 'Escape') emit('close'); };
onMounted(() => { setTimeout(() => document.addEventListener('mousedown', onDown), 0); document.addEventListener('keydown', onKey); });
onUnmounted(() => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); });

const pick = (item) => { if (item.disabled) return; item.action?.(); emit('close'); };
</script>

<template>
  <Teleport to="body">
    <div ref="rootRef" class="zctx" :style="{ top: y + 'px', left: x + 'px' }">
      <template v-for="(item, i) in items" :key="i">
        <div v-if="item.divider" class="zctx-divider" />
        <button v-else class="zctx-item" :class="{ 'is-danger': item.danger, 'is-disabled': item.disabled }" @click="pick(item)">
          {{ item.label }}
        </button>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.zctx {
  position: fixed;
  z-index: 9500;
  min-width: 200px;
  background: var(--zg-bg-elev);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  box-shadow: 0 12px 32px oklch(0.05 0.01 250 / 0.5);
  padding: 4px;
  animation: zctx-in 0.12s ease both;
}
@keyframes zctx-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.zctx-item {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: var(--zg-text);
  font-family: inherit;
  font-size: 12.5px;
  cursor: pointer;
  border-radius: var(--zg-radius-sm);
  white-space: nowrap;
}
.zctx-item:hover { background: var(--zg-panel); }
.zctx-item.is-danger { color: var(--zg-danger); }
.zctx-item.is-disabled { color: var(--zg-text-xdim); cursor: not-allowed; }
.zctx-divider { height: 1px; background: var(--zg-line); margin: 4px 0; }
</style>
