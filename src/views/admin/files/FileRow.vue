<script setup>
import { TYPE_COLORS } from '@/data/filesData';

const props = defineProps({ file: Object, selected: Boolean, idx: Number });
const emit  = defineEmits(['select', 'open']);
</script>

<template>
  <div
    class="zfl-row"
    :class="{ 'is-selected': selected, 'is-odd': idx % 2 !== 0 }"
    @click="emit('open', file)"
  >
    <input type="checkbox" :checked="selected" @change.stop="emit('select', file.id)" @click.stop style="accent-color: var(--zg-accent); cursor: pointer;" />

    <!-- Thumb -->
    <div class="zfl-row-thumb">
      <img v-if="file.url" :src="file.url" :alt="file.name" />
      <span v-else :style="{ color: TYPE_COLORS[file.type] }">
        <svg v-if="file.type==='image'" viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="1" y="3" width="14" height="10" rx="1.5"/><circle cx="5.5" cy="6.5" r="1.2"/><path d="M1 11l4-4 3 3 2-2 5 4"/></svg>
        <svg v-else-if="file.type==='pdf'" viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2" y="1" width="12" height="14" rx="1"/><path d="M5 7h2M5 10h6M5 4h6"/><path d="M9 1v4h5"/></svg>
        <svg v-else-if="file.type==='video'" viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="1" y="3" width="10" height="10" rx="1"/><path d="M11 6l4-2v8l-4-2v-4z"/></svg>
        <svg v-else viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2" y="1" width="12" height="14" rx="1"/><path d="M5 5h6M5 8h6M5 11h4"/></svg>
      </span>
    </div>

    <!-- Name + tags -->
    <div>
      <div class="zfl-row-name">{{ file.name }}</div>
      <div class="zfl-row-tags">
        <span v-for="tag in file.tags.slice(0,3)" :key="tag" class="zfl-tag">{{ tag }}</span>
      </div>
    </div>

    <span class="zfl-row-cell" style="text-transform: capitalize;">{{ file.type }}</span>
    <span class="zfl-row-cell zfl-mono">{{ file.size }}</span>
    <span class="zfl-row-cell">{{ file.dims }}</span>
    <span class="zfl-row-cell">{{ file.uploaded }}</span>
  </div>
</template>

<style scoped>
.zfl-row {
  display: grid;
  grid-template-columns: 28px 36px 1fr 80px 100px 80px 100px;
  gap: 10px;
  padding: 8px 14px;
  background: var(--zg-panel);
  border-bottom: 1px solid var(--zg-line);
  align-items: center;
  cursor: pointer;
  transition: background .1s;
  border-left: 2px solid transparent;
}
.zfl-row.is-odd { background: var(--zg-bg); }
.zfl-row.is-selected { background: oklch(0.78 0.18 130 / 0.06); border-left-color: var(--zg-accent); }
.zfl-row:hover { background: var(--zg-panel-hi); }

.zfl-row-thumb {
  width: 32px; height: 32px; border-radius: var(--zg-radius-md);
  background: var(--zg-panel-hi); border: 1px solid var(--zg-line);
  display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
}
.zfl-row-thumb img { width: 100%; height: 100%; object-fit: cover; }

.zfl-row-name { font-size: 12.5px; font-weight: 600; color: var(--zg-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.zfl-row-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 2px; }
.zfl-tag { padding: 0 4px; border-radius: 2px; background: var(--zg-panel-hi); border: 1px solid var(--zg-line); font-size: 9.5px; color: var(--zg-text-dim); }

.zfl-row-cell { font-size: 11px; color: var(--zg-text-dim); }
.zfl-mono { font-family: var(--zg-mono); }
</style>
