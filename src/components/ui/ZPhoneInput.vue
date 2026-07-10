<script setup>
/**
 * ZPhoneInput — global phone number input with country code selector.
 * Searchable country list, flag emoji, dial code prefix.
 * Emits 'update:modelValue' with full E.164-style string: "+971 50 123 4567"
 *
 * Usage:
 *   <ZPhoneInput v-model="phone" placeholder="50 123 4567" />
 *   <ZPhoneInput v-model="phone" :default-country="'EG'" />
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue:     { type: String, default: '' },
  defaultCountry: { type: String, default: 'AE' },
  placeholder:    { type: String, default: '' },
  disabled:       { type: Boolean, default: false },
  label:          { type: String,  default: '' },
  error:          { type: String,  default: '' },
});
const emit = defineEmits(['update:modelValue']);

const COUNTRIES = [
  { code:'AE', flag:'🇦🇪', name:'United Arab Emirates',  dial:'+971' },
  { code:'SA', flag:'🇸🇦', name:'Saudi Arabia',           dial:'+966' },
  { code:'EG', flag:'🇪🇬', name:'Egypt',                  dial:'+20'  },
  { code:'KW', flag:'🇰🇼', name:'Kuwait',                 dial:'+965' },
  { code:'BH', flag:'🇧🇭', name:'Bahrain',                dial:'+973' },
  { code:'QA', flag:'🇶🇦', name:'Qatar',                  dial:'+974' },
  { code:'OM', flag:'🇴🇲', name:'Oman',                   dial:'+968' },
  { code:'JO', flag:'🇯🇴', name:'Jordan',                 dial:'+962' },
  { code:'LB', flag:'🇱🇧', name:'Lebanon',                dial:'+961' },
  { code:'IQ', flag:'🇮🇶', name:'Iraq',                   dial:'+964' },
  { code:'SY', flag:'🇸🇾', name:'Syria',                  dial:'+963' },
  { code:'MA', flag:'🇲🇦', name:'Morocco',                dial:'+212' },
  { code:'TN', flag:'🇹🇳', name:'Tunisia',                dial:'+216' },
  { code:'GB', flag:'🇬🇧', name:'United Kingdom',         dial:'+44'  },
  { code:'US', flag:'🇺🇸', name:'United States',          dial:'+1'   },
  { code:'FR', flag:'🇫🇷', name:'France',                 dial:'+33'  },
  { code:'DE', flag:'🇩🇪', name:'Germany',                dial:'+49'  },
  { code:'IN', flag:'🇮🇳', name:'India',                  dial:'+91'  },
  { code:'PK', flag:'🇵🇰', name:'Pakistan',               dial:'+92'  },
  { code:'TR', flag:'🇹🇷', name:'Turkey',                 dial:'+90'  },
];

const open      = ref(false);
const search    = ref('');
const number    = ref('');
const selected  = ref(COUNTRIES.find(c => c.code === props.defaultCountry) || COUNTRIES[0]);
const dropEl    = ref(null);

const filtered = computed(() => {
  const q = search.value.toLowerCase();
  return q ? COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q)) : COUNTRIES;
});

// Parse incoming modelValue
watch(() => props.modelValue, val => {
  if (!val) return;
  const match = COUNTRIES.find(c => val.startsWith(c.dial));
  if (match) { selected.value = match; number.value = val.slice(match.dial.length).trim(); }
  else number.value = val;
}, { immediate: true });

function emit_val() {
  emit('update:modelValue', `${selected.value.dial} ${number.value}`);
}
function pick(c) { selected.value = c; open.value = false; search.value = ''; emit_val(); }

// Close on outside click
function onOutside(e) {
  if (dropEl.value && !dropEl.value.contains(e.target)) { open.value = false; search.value = ''; }
}
onMounted(() => document.addEventListener('mousedown', onOutside));
onUnmounted(() => document.removeEventListener('mousedown', onOutside));
</script>

<template>
  <div class="zpi-wrap" ref="dropEl">
    <label v-if="label" class="zpi-label">{{ label }}</label>

    <div class="zpi-row" :class="{ 'is-disabled': disabled, 'is-error': error }">
      <!-- Country selector trigger -->
      <button type="button" class="zpi-country-btn" :disabled="disabled" @click="open = !open">
        <span class="zpi-flag">{{ selected.flag }}</span>
        <span class="zpi-dial">{{ selected.dial }}</span>
        <svg viewBox="0 0 10 6" width="8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0;opacity:0.5;">
          <path d="M1 1l4 4 4-4"/>
        </svg>
      </button>

      <!-- Divider -->
      <div class="zpi-divider" />

      <!-- Number input -->
      <input
        v-model="number"
        type="tel"
        class="zpi-input"
        :placeholder="placeholder || `${selected.dial.replace('+','')} XXX XXXX`"
        :disabled="disabled"
        @input="emit_val"
      />
    </div>

    <!-- Error message -->
    <div v-if="error" class="zpi-error">{{ error }}</div>

    <!-- Dropdown -->
    <Teleport to="body">
      <div v-if="open" class="zpi-dropdown"
        :style="{ top: (dropEl?.getBoundingClientRect().bottom + 4)+'px', left: (dropEl?.getBoundingClientRect().left)+'px', width: Math.max(dropEl?.getBoundingClientRect().width || 280, 280)+'px' }">
        <!-- Search -->
        <div class="zpi-search-wrap">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:9px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
          <input v-model="search" class="zpi-search" placeholder="Search country or dial code…" @click.stop />
        </div>
        <!-- Country list -->
        <div class="zpi-list">
          <button v-for="c in filtered" :key="c.code" type="button"
            class="zpi-option" :class="{ 'is-selected': c.code === selected.code }"
            @click="pick(c)">
            <span class="zpi-flag">{{ c.flag }}</span>
            <span class="zpi-name">{{ c.name }}</span>
            <span class="zpi-dial-sm">{{ c.dial }}</span>
          </button>
          <div v-if="!filtered.length" style="padding:12px;text-align:center;font-size:12px;color:var(--zg-text-dim);">No countries found</div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.zpi-wrap { display:flex;flex-direction:column;gap:4px;position:relative; }
.zpi-label { font-size:11px;font-weight:600;color:var(--zg-text-mid); }

.zpi-row {
  display: flex; align-items: center; height: 36px;
  background: var(--zg-panel); border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md); overflow: hidden;
  transition: border-color .12s;
}
.zpi-row:focus-within { border-color: var(--zg-accent); }
.zpi-row.is-error { border-color: var(--zg-danger); }
.zpi-row.is-disabled { opacity: 0.5; pointer-events: none; }

.zpi-country-btn {
  display: flex; align-items: center; gap: 5px;
  height: 100%; padding: 0 10px; border: none; background: transparent;
  cursor: pointer; flex-shrink: 0; white-space: nowrap;
}
.zpi-country-btn:hover { background: var(--zg-panel-hi); }
.zpi-flag { font-size: 16px; line-height: 1; }
.zpi-dial { font-family: var(--zg-mono); font-size: 12px; font-weight: 600; color: var(--zg-text); }
.zpi-divider { width: 1px; height: 18px; background: var(--zg-line); flex-shrink: 0; }

.zpi-input {
  flex: 1; height: 100%; padding: 0 10px; border: none; background: transparent;
  font-family: var(--zg-mono); font-size: 13px; color: var(--zg-text); outline: none; min-width: 0;
}
.zpi-input::placeholder { color: var(--zg-text-dim); font-family: var(--zg-sans); font-size: 12px; }

.zpi-error { font-size: 11px; color: var(--zg-danger); }

/* Dropdown */
.zpi-dropdown {
  position: fixed; z-index: 9600;
  background: var(--zg-bg-elev); border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md); box-shadow: 0 8px 24px oklch(0.05 0.01 250 / 0.5);
  overflow: hidden;
}
.zpi-search-wrap { position: relative; padding: 6px 8px; border-bottom: 1px solid var(--zg-line); }
.zpi-search { width: 100%; height: 28px; padding: 0 8px 0 26px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: 4px; font-size: 12px; color: var(--zg-text); outline: none; box-sizing: border-box; }
.zpi-list { max-height: 240px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }
.zpi-option {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 12px;
  border: none; background: transparent; cursor: pointer; text-align: left; font-family: inherit;
}
.zpi-option:hover { background: var(--zg-panel); }
.zpi-option.is-selected { background: oklch(0.78 0.18 130 / 0.08); }
.zpi-name { flex: 1; font-size: 12.5px; color: var(--zg-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.zpi-dial-sm { font-family: var(--zg-mono); font-size: 11px; color: var(--zg-text-dim); flex-shrink: 0; }
</style>
