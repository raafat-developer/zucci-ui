<script setup>
/**
 * SDropField — searchable single/multi-select dropdown.
 * Faithful Vue 3 port of SDropField from zucci-inf-fields.jsx.
 */
import { ref, computed, nextTick } from 'vue';

const props = defineProps({
  label:   { type: String, required: true },
  value:   { type: String, default: '' },
  options: { type: Array, required: true },
  multi:   { type: Boolean, default: false },
});
const emit = defineEmits(['update:value', 'change']);

const open    = ref(false);
const q       = ref('');
const triggerRef = ref(null);
const dropRef    = ref(null);
const dropPos    = ref({ top: 0, left: 0, width: 240 });

const vals = computed(() =>
  props.multi ? (props.value ? props.value.split(', ').filter(Boolean) : []) : []
);
const display = computed(() =>
  props.multi
    ? (vals.value.length ? vals.value.join(', ') : '—')
    : (props.value || '—')
);
const filtered = computed(() =>
  props.options.filter(o => o.toLowerCase().includes(q.value.toLowerCase()))
);

function openDrop() {
  const rect = triggerRef.value?.getBoundingClientRect();
  if (rect) {
    dropPos.value = {
      top:   rect.bottom + 4,
      left:  rect.left,
      width: Math.max(rect.width, 240),
    };
  }
  open.value = !open.value;
  q.value = '';
}

function pick(o) {
  if (props.multi) {
    const n = vals.value.includes(o)
      ? vals.value.filter(v => v !== o)
      : [...vals.value, o];
    emit('update:value', n.join(', '));
    emit('change', n.join(', '));
  } else {
    emit('update:value', o);
    emit('change', o);
    open.value = false;
    q.value = '';
  }
}

function close() { open.value = false; q.value = ''; }
</script>

<template>
  <div class="sdf-wrap">
    <div class="zen-field-label">{{ label }}</div>
    <button ref="triggerRef" type="button" class="zp-ss-trigger" @click="openDrop">
      <span class="sdf-display" :class="{ 'is-empty': display === '—' }">{{ display }}</span>
      <svg viewBox="0 0 10 6" width="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 1L5 5L9 1"/></svg>
    </button>

    <Teleport to="body">
      <div v-if="open" class="sdf-overlay" @click="close" />
      <div v-if="open" ref="dropRef" class="zp-ss-dropdown"
        :style="{ position:'fixed', zIndex:99991, top: dropPos.top+'px', left: dropPos.left+'px', width: dropPos.width+'px' }"
        @mousedown.stop>
        <input v-model="q" class="zp-ss-search" autofocus placeholder="Search…" />
        <div style="overflow-y:auto;max-height:200px;">
          <div v-if="filtered.length === 0" class="zp-ss-empty">No results</div>
          <button
            v-for="o in filtered" :key="o" type="button"
            class="zp-ss-opt" :class="{ 'is-sel': multi ? vals.includes(o) : value === o }"
            @mousedown.prevent @click="pick(o)">{{ o }}</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.sdf-wrap { position: relative; }
.zen-field-label { font-size: 10.5px; font-weight: 600; color: var(--zg-text-mid); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.zp-ss-trigger { display: flex; align-items: center; gap: 6px; width: 100%; height: 28px; padding: 0 8px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); cursor: pointer; font-size: 12px; color: var(--zg-text); }
.sdf-display { flex: 1; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sdf-display.is-empty { color: var(--zg-text-dim); }
.sdf-overlay { position: fixed; inset: 0; z-index: 99990; }
.zp-ss-dropdown { background: var(--zg-bg-elev); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); box-shadow: 0 8px 24px oklch(0.05 0.01 250 / 0.5); overflow: hidden; }
.zp-ss-search { width: 100%; height: 30px; padding: 0 10px; background: var(--zg-panel); border: none; border-bottom: 1px solid var(--zg-line); font-size: 12px; color: var(--zg-text); outline: none; box-sizing: border-box; }
.zp-ss-empty { padding: 10px 12px; font-size: 12px; color: var(--zg-text-dim); }
.zp-ss-opt { display: block; width: 100%; padding: 6px 12px; text-align: left; background: transparent; border: none; cursor: pointer; font-size: 12px; color: var(--zg-text-mid); }
.zp-ss-opt:hover { background: var(--zg-panel-hi); color: var(--zg-text); }
.zp-ss-opt.is-sel { background: oklch(0.78 0.18 130 / 0.12); color: var(--zg-accent); font-weight: 600; }
</style>
