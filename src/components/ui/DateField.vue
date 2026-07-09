<script setup>
/**
 * DateField — calendar date picker with month/year navigation.
 * Faithful Vue 3 port of DateField from zucci-inf-fields.jsx.
 */
import { ref, computed } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  value: { type: String, default: '' },  // ISO date string YYYY-MM-DD
});
const emit = defineEmits(['update:value', 'change']);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['S','M','T','W','T','F','S'];

const parsed = computed(() => props.value ? new Date(props.value) : null);
const display = computed(() => {
  if (!parsed.value) return '—';
  return `${parsed.value.getDate()} ${MONTHS[parsed.value.getMonth()]} ${parsed.value.getFullYear()}`;
});

const now = new Date();
const open      = ref(false);
const mode      = ref('day');
const viewYear  = ref(parsed.value?.getFullYear()  ?? now.getFullYear());
const viewMonth = ref(parsed.value?.getMonth()     ?? now.getMonth());
const triggerRef = ref(null);
const dropPos    = ref({ top: 0, left: 0 });

const years = computed(() => {
  const arr = [];
  for (let y = now.getFullYear(); y >= 1940; y--) arr.push(y);
  return arr;
});

function getDays(y, m)  { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y, m) { return new Date(y, m, 1).getDay(); }

const blanks = computed(() => Array.from({ length: firstDay(viewYear.value, viewMonth.value) }));
const days   = computed(() => Array.from({ length: getDays(viewYear.value, viewMonth.value) }, (_, i) => i + 1));

function openDrop() {
  const rect = triggerRef.value?.getBoundingClientRect();
  if (rect) dropPos.value = { top: rect.bottom + 4, left: rect.left };
  open.value = !open.value;
  mode.value = 'day';
}

function selectDate(day) {
  const mo = String(viewMonth.value + 1).padStart(2, '0');
  const d2 = String(day).padStart(2, '0');
  const val = `${viewYear.value}-${mo}-${d2}`;
  emit('update:value', val);
  emit('change', val);
  open.value = false;
}

function prevMonth() {
  if (viewMonth.value === 0) { viewYear.value--; viewMonth.value = 11; }
  else viewMonth.value--;
}
function nextMonth() {
  if (viewMonth.value === 11) { viewYear.value++; viewMonth.value = 0; }
  else viewMonth.value++;
}

function isSelected(day) {
  return !!(parsed.value &&
    parsed.value.getFullYear() === viewYear.value &&
    parsed.value.getMonth() === viewMonth.value &&
    parsed.value.getDate() === day);
}
</script>

<template>
  <div class="df-wrap">
    <div class="zen-field-label">{{ label }}</div>
    <button ref="triggerRef" type="button" class="zp-ss-trigger" @click="openDrop">
      <span class="df-display" :class="{ 'is-empty': display === '—' }">{{ display }}</span>
      <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
        <rect x="1" y="2" width="12" height="11" rx="1.5"/>
        <line x1="5" y1="1" x2="5" y2="4"/><line x1="9" y1="1" x2="9" y2="4"/>
        <line x1="1" y1="6" x2="13" y2="6"/>
      </svg>
    </button>

    <Teleport to="body">
      <div v-if="open" class="sdf-overlay" @click="open = false" />
      <div v-if="open" class="zp-ss-dropdown df-cal"
        :style="{ position:'fixed', zIndex:99991, top: dropPos.top+'px', left: dropPos.left+'px', width:'240px' }"
        @mousedown.stop>

        <!-- Header: prev / month / year / next -->
        <div class="df-cal-head">
          <button type="button" class="df-nav-btn" @mousedown.prevent @click="prevMonth">‹</button>
          <button type="button" class="zp-ss-opt df-period" :class="{ 'is-sel': mode==='month' }"
            @mousedown.prevent @click="mode = mode==='month' ? 'day' : 'month'">{{ MONTHS[viewMonth] }}</button>
          <button type="button" class="zp-ss-opt df-period" :class="{ 'is-sel': mode==='year' }"
            @mousedown.prevent @click="mode = mode==='year' ? 'day' : 'year'">{{ viewYear }}</button>
          <button type="button" class="df-nav-btn" @mousedown.prevent @click="nextMonth">›</button>
        </div>

        <!-- Year list -->
        <div v-if="mode === 'year'" class="df-year-list">
          <button v-for="yr in years" :key="yr" type="button" class="zp-ss-opt" :class="{ 'is-sel': yr===viewYear }"
            @mousedown.prevent @click="viewYear = yr; mode = 'day'">{{ yr }}</button>
        </div>

        <!-- Month grid -->
        <div v-else-if="mode === 'month'" class="df-month-grid">
          <button v-for="(m, i) in MONTHS" :key="m" type="button" class="zp-ss-opt df-month-btn" :class="{ 'is-sel': i===viewMonth }"
            @mousedown.prevent @click="viewMonth = i; mode = 'day'">{{ m }}</button>
        </div>

        <!-- Day grid -->
        <div v-else class="df-day-wrap">
          <div class="df-dow-row">
            <div v-for="(d,i) in DAYS" :key="i" class="df-dow">{{ d }}</div>
          </div>
          <div class="df-day-grid">
            <div v-for="(_, i) in blanks" :key="'b'+i" />
            <button v-for="day in days" :key="day" type="button"
              class="df-day-btn" :class="{ 'is-sel': isSelected(day) }"
              @mousedown.prevent @click="selectDate(day)">{{ day }}</button>
          </div>
        </div>

      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.df-wrap { position: relative; }
.zen-field-label { font-size: 10.5px; font-weight: 600; color: var(--zg-text-mid); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.zp-ss-trigger { display: flex; align-items: center; gap: 6px; width: 100%; height: 28px; padding: 0 8px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); cursor: pointer; font-size: 12px; color: var(--zg-text); }
.df-display { flex: 1; text-align: left; }
.df-display.is-empty { color: var(--zg-text-dim); }
.sdf-overlay { position: fixed; inset: 0; z-index: 99990; }

.zp-ss-dropdown { background: var(--zg-bg-elev); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); box-shadow: 0 8px 24px oklch(0.05 0.01 250 / 0.5); overflow: hidden; }
.df-cal { padding: 0; }

.df-cal-head { display: flex; align-items: center; gap: 4px; padding: 8px 10px; border-bottom: 1px solid var(--zg-line); }
.df-nav-btn { width: 24px; height: 24px; border: none; background: transparent; cursor: pointer; color: var(--zg-text-mid); font-size: 16px; border-radius: 3px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.df-nav-btn:hover { background: var(--zg-panel-hi); }
.df-period { flex: 1; padding: 2px 6px; font-size: 12px; border-radius: 3px; }
.zp-ss-opt { display: block; width: 100%; padding: 6px 12px; text-align: left; background: transparent; border: none; cursor: pointer; font-size: 12px; color: var(--zg-text-mid); }
.zp-ss-opt:hover { background: var(--zg-panel-hi); color: var(--zg-text); }
.zp-ss-opt.is-sel { background: oklch(0.78 0.18 130 / 0.12); color: var(--zg-accent); font-weight: 600; }

.df-year-list { overflow-y: auto; max-height: 180px; }
.df-month-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 4px; padding: 8px; }
.df-month-btn { padding: 4px; font-size: 12px; text-align: center; }

.df-day-wrap { padding: 8px; }
.df-dow-row { display: grid; grid-template-columns: repeat(7,1fr); gap: 1px; margin-bottom: 4px; }
.df-dow { text-align: center; font-size: 9.5px; color: var(--zg-text-dim); padding: 2px 0; }
.df-day-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 1px; }
.df-day-btn { padding: 3px 0; font-size: 11.5px; border-radius: 4px; background: transparent; color: var(--zg-text); border: none; cursor: pointer; text-align: center; }
.df-day-btn:hover { background: var(--zg-panel-hi); }
.df-day-btn.is-sel { background: var(--zg-accent); color: var(--zg-bg); font-weight: 700; }
</style>
