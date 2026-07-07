<script setup>
/**
 * AttrSelect — multi-value attribute picker (color/size/material/style) with
 * preset search, custom-value add, colour swatches, and (for size) the size-
 * system view switch. Ported from the React AttrSelect.
 */
import { ref, computed } from 'vue';
import { ATTR_PRESETS, COLOR_SWATCH } from '@/data/productsMeta';
import { useClickOutside } from '@/composables/useClickOutside';

const props = defineProps({
  attr: { type: String, required: true },
  values: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:values']);

const { isOpen, rootRef, toggle, close } = useClickOutside();
const search = ref('');
const sizeSystem = ref('EU');

const presets = computed(() => ATTR_PRESETS[props.attr] || []);
const filtered = computed(() =>
  search.value ? presets.value.filter((p) => p.toLowerCase().includes(search.value.toLowerCase())) : presets.value,
);
const unselected = computed(() => filtered.value.filter((p) => !props.values.includes(p)));

const removeVal = (v) => emit('update:values', props.values.filter((x) => x !== v));
const addVal = (v) => { if (!props.values.includes(v)) emit('update:values', [...props.values, v]); };
const addCustom = () => { if (search.value.trim()) { addVal(search.value.trim()); search.value = ''; close(); } };
const swatch = (v) => COLOR_SWATCH[v] || 'var(--zg-muted-line)';
</script>

<template>
  <div ref="rootRef" style="position:relative">
    <div class="zp-attr-vals" style="margin-bottom:4px">
      <span v-for="v in values" :key="v" class="zp-attr-val">{{ v }}
        <button type="button" @click="removeVal(v)">×</button>
      </span>
      <button type="button" class="zp-attr-add-btn" @click="toggle">+ Add {{ attr }}</button>
    </div>
    <div v-show="isOpen" class="zp-ss-dropdown" style="width:100%;max-width:260px">
      <input class="zp-ss-search" v-model="search" :placeholder="`Search ${attr} or add custom…`" />
      <div style="overflow-y:auto;max-height:180px">
        <button v-for="v in unselected" :key="v" type="button" class="zp-ss-opt" @click="addVal(v)">
          <span v-if="attr === 'color'" :style="{ width:'10px', height:'10px', borderRadius:'50%', display:'inline-block', marginRight:'6px', flexShrink:0, background: swatch(v) }" />
          {{ v }}
        </button>
        <button v-if="!unselected.length && !filtered.length && search" type="button" class="zp-ss-opt zp-ss-opt-special" @click="addCustom">+ Add "{{ search }}" as custom value</button>
        <div v-if="!unselected.length && !search" class="zp-ss-empty">All preset values selected</div>
        <button type="button" class="zp-ss-opt zp-ss-opt-special">+ Request new {{ attr }} value</button>
      </div>
      <div v-if="attr === 'size'" class="zp-size-system-row">
        <span style="font-size:9.5px;color:var(--zg-text-dim);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-right:4px">View as:</span>
        <button
          v-for="sys in ['EU','UK','US','INT','IT','JP']"
          :key="sys"
          type="button"
          class="zp-size-system-btn"
          :class="{ 'is-on': sizeSystem === sys }"
          @click.stop="sizeSystem = sys"
        >{{ sys }}</button>
        <span class="zp-size-equiv">{{ sizeSystem }} sizes shown</span>
      </div>
    </div>
  </div>
</template>
