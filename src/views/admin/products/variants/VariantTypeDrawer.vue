<script setup>
/**
 * VariantTypeDrawer — create/edit a variant type. Faithful port of
 * VariantTypeDrawer from zucci-variants.jsx: name/code, input type, status,
 * applies-to category chips, free-form options list (add/remove), requires-
 * size-chart toggle.
 */
import { ref, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false }, vtype: { type: Object, default: null } });
const emit = defineEmits(['close', 'save']);

const CATS = ['clothing', 'footwear', 'accessories', 'beauty', 'fragrance', 'kids', 'sportswear', 'jewellery'];
const blank = () => ({ name: '', code: '', input_type: 'select', applies_to: [], options: [], status: 'active', requires_size_chart: false });
const v = ref(blank());
const newOpt = ref('');

watch(() => [props.open, props.vtype?.id], () => {
  if (props.open) v.value = props.vtype ? { ...props.vtype, options: Array.isArray(props.vtype.options) ? props.vtype.options.map((o) => (typeof o === 'object' ? o.label : o)) : [] } : blank();
});

const addOpt = () => { if (newOpt.value.trim()) { v.value.options = [...v.value.options, newOpt.value.trim()]; newOpt.value = ''; } };
const removeOpt = (i) => { v.value.options = v.value.options.filter((_, idx) => idx !== i); };
const toggleCat = (c) => { v.value.applies_to = v.value.applies_to.includes(c) ? v.value.applies_to.filter((x) => x !== c) : [...v.value.applies_to, c]; };
const save = () => {
  emit('save', { ...v.value });
  toast.success(`Variant type ${props.vtype ? 'updated' : 'created'}: ${v.value.name}`);
  emit('close');
};
</script>

<template>
  <ZDrawer :open="open" :title="vtype ? `Edit: ${vtype.name}` : 'New Variant Type'" :width="620" @close="emit('close')">
    <div class="zcat-form">
      <div class="zcat-form-section-title">Basic</div>
      <div class="zcat-grid-2">
        <div class="zcat-field"><label class="zcat-label">Name <span style="color:var(--zg-danger)">*</span></label><input class="zcat-input" v-model="v.name" placeholder="e.g. Size" /></div>
        <div class="zcat-field"><label class="zcat-label">Code (internal)</label><input class="zcat-input" style="font-family:var(--zg-mono)" v-model="v.code" placeholder="e.g. size" /></div>
      </div>
      <div class="zcat-grid-2">
        <div class="zcat-field">
          <label class="zcat-label">Input Type</label>
          <select class="zcat-select" v-model="v.input_type"><option value="select">Dropdown Select</option><option value="swatch_text">Text Swatches</option><option value="swatch_color">Colour Swatches</option></select>
        </div>
        <div class="zcat-field">
          <label class="zcat-label">Status</label>
          <select class="zcat-select" v-model="v.status"><option value="active">Active</option><option value="inactive">Inactive</option></select>
        </div>
      </div>

      <div class="zcat-form-section-title" style="margin-top:6px">Applies To</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button
          v-for="c in CATS"
          :key="c"
          type="button"
          :style="{ height:'26px', padding:'0 10px', borderRadius:'4px', border:'1px solid', cursor:'pointer', fontSize:'11px', fontFamily:'inherit', fontWeight:600, textTransform:'capitalize', color: v.applies_to.includes(c)?'var(--zg-accent)':'var(--zg-text-dim)', background: v.applies_to.includes(c)?'var(--zg-accent-tint)':'transparent', borderColor: v.applies_to.includes(c)?'var(--zg-accent)':'var(--zg-line)' }"
          @click="toggleCat(c)"
        >{{ c }}</button>
      </div>

      <div class="zcat-form-section-title" style="margin-top:6px">Options</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;min-height:28px">
        <div v-for="(o, i) in v.options" :key="i" style="display:flex;align-items:center;gap:4px;height:26px;padding:0 8px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:4px">
          <span style="font-size:11.5px;color:var(--zg-text);font-weight:500">{{ o }}</span>
          <button type="button" style="width:14px;height:14px;border:none;background:transparent;color:var(--zg-text-dim);cursor:pointer;font-size:13px;line-height:1;padding:0;display:flex;align-items:center;justify-content:center" @click="removeOpt(i)">×</button>
        </div>
        <span v-if="!v.options.length" style="font-size:11px;color:var(--zg-text-xdim);align-self:center">No options yet</span>
      </div>
      <div style="display:flex;gap:8px">
        <input class="zcat-input" style="flex:1" v-model="newOpt" placeholder="Add option…" @keydown.enter="addOpt" />
        <button class="zwh-btn-ghost" :disabled="!newOpt.trim()" :style="{ height:'32px', opacity: newOpt.trim() ? 1 : 0.4 }" @click="addOpt">Add</button>
      </div>

      <div class="zcat-toggle-row" style="margin-top:4px">
        <div class="zcat-toggle-info"><span class="zcat-toggle-info-label">Requires Size Chart</span><span class="zcat-toggle-info-sub">Vendors must upload a size chart before using this variant</span></div>
        <button class="zcat-toggle" :class="v.requires_size_chart ? 'on' : 'off'" @click="v.requires_size_chart = !v.requires_size_chart"><div class="zcat-toggle-knob" /></button>
      </div>
    </div>

    <template #footer>
      <button class="zwh-btn-primary" :disabled="!v.name" :style="{ opacity: v.name ? 1 : 0.4 }" @click="save">{{ vtype ? 'Save Changes' : 'Create Variant Type' }}</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>
  </ZDrawer>
</template>
