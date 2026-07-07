<script setup>
/**
 * ZSearchableSelect — the searchable dropdown used everywhere in the app.
 * Ports the React SearchableSelect: type-to-filter, keyboard nav,
 * close-on-outside-click (deferred-listener pattern via useClickOutside),
 * and upward-flip when it would overflow the viewport.
 *
 * options: [{ value, label, flag? }]  — v-model on `value`.
 */
import { ref, computed, nextTick } from 'vue';
import { useClickOutside } from '@/composables/useClickOutside';

const props = defineProps({
  modelValue: { type: [String, Number, null], default: null },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select…' },
});
const emit = defineEmits(['update:modelValue']);

const { isOpen, rootRef, open, close, toggle } = useClickOutside();
const query = ref('');
const flipUp = ref(false);
const triggerRef = ref(null);

const safeOptions = computed(() => props.options.filter((o) => o && o.value != null && o.label != null));
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return safeOptions.value;
  return safeOptions.value.filter((o) => o.label.toLowerCase().includes(q));
});
const selected = computed(() => safeOptions.value.find((o) => o.value === props.modelValue) || null);

function onTriggerClick() {
  if (isOpen.value) { close(); return; }
  const rect = triggerRef.value?.getBoundingClientRect();
  flipUp.value = rect ? window.innerHeight - rect.bottom < 280 : false;
  query.value = '';
  open();
  nextTick(() => rootRef.value?.querySelector('.zsel-search')?.focus());
}
function pick(opt) {
  emit('update:modelValue', opt.value);
  close();
}
</script>

<template>
  <div ref="rootRef" class="zsel">
    <button ref="triggerRef" type="button" class="zsel-trigger" @click="onTriggerClick">
      <span v-if="selected" class="zsel-val">
        <span v-if="selected.flag" class="zsel-flag">{{ selected.flag }}</span>
        {{ selected.label }}
      </span>
      <span v-else class="zsel-placeholder">{{ placeholder }}</span>
      <span class="zsel-caret" :class="{ 'is-open': isOpen }">▾</span>
    </button>

    <div v-show="isOpen" class="zsel-panel" :class="{ 'flip-up': flipUp }">
      <div class="zsel-search-wrap">
        <input
          v-model="query"
          class="zsel-search"
          type="text"
          placeholder="Search…"
          @keydown.esc.prevent="close"
        />
      </div>
      <div class="zsel-list">
        <button
          v-for="opt in filtered"
          :key="opt.value"
          type="button"
          class="zsel-opt"
          :class="{ 'is-selected': opt.value === modelValue }"
          @click="pick(opt)"
        >
          <span v-if="opt.flag" class="zsel-flag">{{ opt.flag }}</span>
          {{ opt.label }}
        </button>
        <div v-if="!filtered.length" class="zsel-empty">No results</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zsel { position: relative; width: 100%; }
.zsel-trigger {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--zg-panel);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  color: var(--zg-text);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.12s;
}
.zsel-trigger:hover { border-color: var(--zg-muted-line); }
.zsel-val { flex: 1; text-align: left; display: flex; align-items: center; gap: 7px; }
.zsel-placeholder { flex: 1; text-align: left; color: var(--zg-text-xdim); }
.zsel-flag { font-size: 14px; }
.zsel-caret { color: var(--zg-text-dim); font-size: 10px; transition: transform 0.12s; }
.zsel-caret.is-open { transform: rotate(180deg); }

.zsel-panel {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  z-index: 60;
  background: var(--zg-bg-elev);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}
.zsel-panel.flip-up { top: auto; bottom: calc(100% + 4px); }

.zsel-search-wrap { padding: 8px; border-bottom: 1px solid var(--zg-line); }
.zsel-search {
  width: 100%;
  height: 30px;
  padding: 0 10px;
  background: var(--zg-panel);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-sm);
  color: var(--zg-text);
  font-family: inherit;
  font-size: 12.5px;
  outline: none;
}
.zsel-search:focus { border-color: var(--zg-accent); }

.zsel-list { max-height: 240px; overflow-y: auto; padding: 4px; }
.zsel-opt {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border: none;
  background: transparent;
  color: var(--zg-text);
  font-size: 12.5px;
  text-align: left;
  cursor: pointer;
  border-radius: var(--zg-radius-sm);
}
.zsel-opt:hover { background: var(--zg-panel); }
.zsel-opt.is-selected { background: var(--zg-accent-tint); color: var(--zg-accent); }
.zsel-empty { padding: 14px 10px; text-align: center; color: var(--zg-text-xdim); font-size: 12px; }
</style>
