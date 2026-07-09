<script setup>
import { ref } from 'vue';
import { TYPE_COLORS } from '@/data/filesData';

const props = defineProps({ file: Object, selected: Boolean });
const emit  = defineEmits(['select', 'open']);
const hover = ref(false);
</script>

<template>
  <div
    class="zfl-card"
    :class="{ 'is-selected': selected }"
    @click="emit('open', file)"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Checkbox -->
    <div
      class="zfl-card-check"
      :class="{ 'is-visible': selected || hover }"
      @click.stop="emit('select', file.id)"
    >
      <div class="zfl-check-box" :class="{ 'is-checked': selected }">
        <svg v-if="selected" viewBox="0 0 10 10" width="10" fill="none" stroke="oklch(0.18 0.04 130)" stroke-width="2" stroke-linecap="round"><path d="M2 5l2.5 2.5L8 3"/></svg>
      </div>
    </div>

    <!-- Thumbnail -->
    <div class="zfl-card-thumb">
      <img v-if="file.url" :src="file.url" :alt="file.name" />
      <div v-else class="zfl-card-thumb-icon" :style="{ color: TYPE_COLORS[file.type] }">
        <svg v-if="file.type === 'image'" viewBox="0 0 16 16" width="24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="1" y="3" width="14" height="10" rx="1.5"/><circle cx="5.5" cy="6.5" r="1.2"/><path d="M1 11l4-4 3 3 2-2 5 4"/></svg>
        <svg v-else-if="file.type === 'pdf'" viewBox="0 0 16 16" width="24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2" y="1" width="12" height="14" rx="1"/><path d="M5 7h2M5 10h6M5 4h6"/><path d="M9 1v4h5"/></svg>
        <svg v-else-if="file.type === 'video'" viewBox="0 0 16 16" width="24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="1" y="3" width="10" height="10" rx="1"/><path d="M11 6l4-2v8l-4-2v-4z"/></svg>
        <svg v-else viewBox="0 0 16 16" width="24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2" y="1" width="12" height="14" rx="1"/><path d="M5 5h6M5 8h6M5 11h4"/></svg>
      </div>
    </div>

    <!-- Info -->
    <div class="zfl-card-info">
      <div class="zfl-card-name">{{ file.name }}</div>
      <div class="zfl-card-meta">{{ file.size }} · {{ file.dims }}</div>
    </div>
  </div>
</template>

<style scoped>
.zfl-card {
  background: var(--zg-panel);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: border-color .1s, box-shadow .1s;
  position: relative;
}
.zfl-card:hover { border-color: var(--zg-accent); }
.zfl-card.is-selected { border-color: var(--zg-accent); box-shadow: 0 0 0 2px oklch(0.78 0.18 130 / 0.2); }

.zfl-card-check {
  position: absolute; top: 6px; left: 6px; z-index: 2;
  opacity: 0; transition: opacity .1s;
}
.zfl-card-check.is-visible { opacity: 1; }

.zfl-check-box {
  width: 18px; height: 18px; border-radius: 4px;
  background: rgba(0,0,0,0.5);
  border: 1.5px solid rgba(255,255,255,0.6);
  display: flex; align-items: center; justify-content: center;
}
.zfl-check-box.is-checked { background: var(--zg-accent); border-color: var(--zg-accent); }

.zfl-card-thumb {
  height: 100px; background: var(--zg-panel-hi);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.zfl-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
.zfl-card-thumb-icon { display: flex; align-items: center; justify-content: center; }

.zfl-card-info { padding: 8px 10px; }
.zfl-card-name { font-size: 11.5px; font-weight: 600; color: var(--zg-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px; }
.zfl-card-meta { font-size: 10.5px; color: var(--zg-text-dim); }
</style>
