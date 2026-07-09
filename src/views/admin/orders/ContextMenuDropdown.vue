<script setup>
/**
 * ContextMenuDropdown — positioned context menu.
 * Items: { label, icon?, action, danger? }
 */
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  x:     { type: Number, default: 0 },
  y:     { type: Number, default: 0 },
});
const emit = defineEmits(['close']);

function onKey(e) { if (e.key === 'Escape') emit('close'); }
onMounted(() => document.addEventListener('keydown', onKey));
onUnmounted(() => document.removeEventListener('keydown', onKey));
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div style="position:fixed;inset:0;z-index:9990;" @click="emit('close')" />
    <!-- Menu -->
    <div style="position:fixed;z-index:9991;min-width:200px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);box-shadow:0 8px 24px oklch(0.05 0.01 250 / 0.5);overflow:hidden;"
      :style="{ top: y+'px', left: x+'px' }">
      <template v-for="(item, i) in items" :key="i">
        <div v-if="item.divider" style="height:1px;background:var(--zg-line);margin:3px 0;" />
        <button v-else class="ctx-item" :class="{ 'is-danger': item.danger }" @click="() => { item.action(); emit('close'); }">
          <svg v-if="item.icon" viewBox="0 0 16 16" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" style="flex-shrink:0;">
            <path :d="item.icon" />
          </svg>
          {{ item.label }}
        </button>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.ctx-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 8px 14px; border: none;
  background: transparent; cursor: pointer; text-align: left;
  font-family: inherit; font-size: 12.5px; color: var(--zg-text-mid);
  transition: background .08s;
}
.ctx-item:hover { background: var(--zg-panel); color: var(--zg-text); }
.ctx-item.is-danger { color: var(--zg-danger); }
.ctx-item.is-danger:hover { background: oklch(0.70 0.18 25 / 0.08); }
</style>
