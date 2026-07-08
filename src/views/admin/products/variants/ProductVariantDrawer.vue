<script setup>
/**
 * ProductVariantDrawer — manage one product's variant combinations. Faithful
 * port of ProductVariantDrawer from zucci-variants.jsx: variant-type chips,
 * drag-reorder rows, base/override price, stock, image count, status toggle,
 * Save / Enable All / Cancel.
 */
import { computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { ZC_VARIANT_TYPES } from '@/data/sizeGuidesData';
import { useDnDList } from '@/composables/useDnDList';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false }, config: { type: Object, default: null } });
const emit = defineEmits(['close']);

const { items: variants, dragIdx, overIdx, start, over, drop, end } = useDnDList([]);
watch(() => [props.open, props.config?.id], () => { if (props.open && props.config) variants.value = props.config.variants.map((v) => ({ ...v })); });

const toggleV = (id) => { variants.value = variants.value.map((v) => (v.id === id ? { ...v, status: v.status === 'active' ? 'disabled' : 'active' } : v)); };
const setPrice = (id, val) => { variants.value = variants.value.map((v) => (v.id === id ? { ...v, price_override: val ? Number(val) : null } : v)); };
const enableAll = () => { variants.value = variants.value.map((v) => ({ ...v, status: 'active' })); toast.info('All variants enabled'); };
const save = () => { toast.success('Variant config saved'); emit('close'); };

const vtypes = computed(() => (props.config?.variant_types || []).map((id) => (ZC_VARIANT_TYPES || []).find((t) => t.id === id)?.name || id));
const attrs = (v) => [v.size, v.colour, v.material, v.volume, v.fit].filter(Boolean);
</script>

<template>
  <ZDrawer v-if="config" :open="open" :title="config.product" :subtitle="`SKU: ${config.sku} · Drag rows to reorder`" :width="820" @close="emit('close')">
    <div style="margin:-18px -20px 14px;padding:10px 20px;border-bottom:1px solid var(--zg-line);background:var(--zg-bg-elev);display:flex;gap:6px;flex-wrap:wrap">
      <span v-for="n in vtypes" :key="n" style="height:20px;padding:0 8px;background:var(--zg-accent-tint);color:var(--zg-accent);border-radius:3px;font-size:11px;font-weight:600;display:inline-flex;align-items:center">{{ n }}</span>
    </div>

    <div style="display:grid;grid-template-columns:28px 1fr 80px 100px 70px 60px 80px 70px;gap:10px;padding:0 4px;height:32px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
      <span></span><span>SKU / Variant</span><span>Base</span><span>Override</span><span>Stock</span><span>Imgs</span><span>Status</span><span>Enable</span>
    </div>
    <div
      v-for="(v, i) in variants"
      :key="v.id"
      draggable="true"
      @dragstart="start(i)"
      @dragover.prevent="over(i)"
      @drop.prevent="drop(i)"
      @dragend="end"
      :style="{ display:'grid', gridTemplateColumns:'28px 1fr 80px 100px 70px 60px 80px 70px', gap:'10px', padding:'10px 4px', borderBottom:'1px solid var(--zg-line-soft)', alignItems:'center', cursor:'grab', opacity: v.status !== 'active' ? 0.55 : 1, background: overIdx === i ? 'var(--zg-accent-tint)' : dragIdx === i ? 'oklch(0.25 0.02 250 / 0.5)' : 'var(--zg-panel)', outline: overIdx === i ? '1px dashed var(--zg-accent)' : 'none' }"
    >
      <div style="color:var(--zg-text-xdim);display:flex;align-items:center;cursor:grab"><svg viewBox="0 0 8 12" width="8" fill="currentColor"><circle cx="2" cy="2" r="1.1" /><circle cx="6" cy="2" r="1.1" /><circle cx="2" cy="6" r="1.1" /><circle cx="6" cy="6" r="1.1" /><circle cx="2" cy="10" r="1.1" /><circle cx="6" cy="10" r="1.1" /></svg></div>
      <div>
        <div style="font-size:11px;font-family:var(--zg-mono);color:var(--zg-text);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ v.sku }}</div>
        <div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:1px">{{ attrs(v).join(' · ') }}</div>
      </div>
      <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text-mid)">AED {{ v.price_base }}</span>
      <input type="number" min="0" placeholder="—" :value="v.price_override || ''" style="height:28px;padding:0 8px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:3px;font-family:var(--zg-mono);font-size:12px;color:var(--zg-accent);outline:none;width:100%" @click.stop @input="setPrice(v.id, $event.target.value)" />
      <span :style="{ fontFamily:'var(--zg-mono)', fontSize:'12px', color: v.stock === 0 ? 'var(--zg-danger)' : 'var(--zg-text-mid)', fontWeight: v.stock === 0 ? 700 : 400 }">{{ v.stock }}</span>
      <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text-dim)">{{ v.images }}</span>
      <span class="zcat-badge" :class="v.status === 'active' ? 'active' : 'inactive'">{{ v.status }}</span>
      <div @click.stop><button class="zcat-toggle" :class="v.status === 'active' ? 'on' : 'off'" @click="toggleV(v.id)"><div class="zcat-toggle-knob" /></button></div>
    </div>

    <template #footer>
      <button class="zwh-btn-primary" @click="save">Save Changes</button>
      <button class="zwh-btn-ghost" @click="enableAll">Enable All</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>
  </ZDrawer>
</template>
