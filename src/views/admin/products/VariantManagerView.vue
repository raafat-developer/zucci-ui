<script setup>
/**
 * VariantManagerView — Variant Manager (faithful port of
 * ZucciVariantManagerModule): KPI strip, Variant Types tab (drag-reorder,
 * colour/text swatch preview, applies-to, status toggle, edit) and Product
 * Configs tab (variant types badges, SKU/disabled counts, Manage → drawer).
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ZC_VARIANT_TYPES, ZC_PRODUCT_VARIANTS } from '@/data/sizeGuidesData';
import { useDnDList } from '@/composables/useDnDList';
import VariantTypeDrawer from './variants/VariantTypeDrawer.vue';
import ProductVariantDrawer from './variants/ProductVariantDrawer.vue';

const router = useRouter();
const { items: types, dragIdx, overIdx, start, over, drop, end } = useDnDList((ZC_VARIANT_TYPES || []).map((t) => ({ ...t })));
const tab = ref('types');
const typeEdit = ref(null);
const typeOpen = ref(false);
const pvEdit = ref(null);
const pvOpen = ref(false);

const openType = (t = null) => { typeEdit.value = t; typeOpen.value = true; };
const openPv = (pv) => { pvEdit.value = pv; pvOpen.value = true; };
const toggleType = (id) => { types.value = types.value.map((t) => (t.id === id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t)); };
const onSaveType = (saved) => {
  if (typeEdit.value) types.value = types.value.map((t) => (t.id === typeEdit.value.id ? { ...t, ...saved } : t));
  else types.value = [...types.value, { id: `VT-${Date.now()}`, sort: types.value.length + 1, ...saved }];
};

const disabledTotal = computed(() => (ZC_PRODUCT_VARIANTS || []).reduce((s, p) => s + p.variants.filter((v) => v.status !== 'active').length, 0));
const productVariants = ZC_PRODUCT_VARIANTS || [];
const vNamesFor = (pv) => (pv.variant_types || []).map((id) => (ZC_VARIANT_TYPES || []).find((t) => t.id === id)?.name || id);
const disabledFor = (pv) => pv.variants.filter((v) => v.status !== 'active').length;
const kpis = computed(() => [
  ['Variant Types', types.value.length, '', 'defined'],
  ['Active', types.value.filter((t) => t.status === 'active').length, 'is-good', 'enabled'],
  ['Products', productVariants.length, 'is-accent', 'configured'],
  ['Total SKUs', productVariants.reduce((s, p) => s + p.variants.length, 0), '', 'combinations'],
  ['Disabled', disabledTotal.value, disabledTotal.value > 0 ? 'is-warn' : '', 'out of stock / off'],
]);
</script>

<template>
  <div class="zcat-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="zwh-bc-back" @click="router.push('/admin/products')"><svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14" /></svg> Products</button>
          <span style="color:var(--zg-text-xdim);font-size:11px">/</span>
          <span style="font-size:13px;font-weight:600;color:var(--zg-text)">Variant Manager</span>
        </div>
        <div class="zwh-subtitle">{{ types.filter((t) => t.status === 'active').length }} active variant types · {{ productVariants.length }} product configs</div>
      </div>
      <div class="zwh-header-right"><button class="zwh-btn-primary" @click="openType(null)">+ New Variant Type</button></div>
    </div>

    <div class="zwh-kpi-strip">
      <div v-for="[l, v, cls, sub] in kpis" :key="l" class="zwh-kpi-cell"><span class="zwh-kpi-lbl">{{ l }}</span><span class="zwh-kpi-val" :class="cls">{{ v }}</span><span class="zwh-kpi-sub">{{ sub }}</span></div>
    </div>

    <div style="display:flex;border-bottom:1px solid var(--zg-line);background:var(--zg-bg-elev);flex-shrink:0;padding:0 20px">
      <button v-for="[v, l] in [['types','Variant Types'],['products','Product Configs']]" :key="v" style="height:40px;padding:0 14px;border:none;background:transparent;font-family:inherit;font-size:12.5px;cursor:pointer" :style="{ color: tab === v ? 'var(--zg-accent)' : 'var(--zg-text-dim)', borderBottom: tab === v ? '2px solid var(--zg-accent)' : '2px solid transparent', marginBottom:'-1px', fontWeight: tab === v ? 600 : 400 }" @click="tab = v">{{ l }}</button>
    </div>

    <div class="zcat-content">
      <!-- Variant Types -->
      <div v-if="tab === 'types'" style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:28px 1fr 100px 120px 80px 80px 80px;gap:10px;padding:0 14px;height:32px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span></span><span>Variant Type</span><span>Input</span><span>Applies To</span><span>Options</span><span>Status</span><span>Actions</span>
        </div>
        <div
          v-for="(t, i) in types"
          :key="t.id"
          draggable="true"
          @dragstart="start(i)"
          @dragover.prevent="over(i)"
          @drop.prevent="drop(i)"
          @dragend="end"
          :style="{ display:'grid', gridTemplateColumns:'28px 1fr 100px 120px 80px 80px 80px', gap:'10px', padding:'12px 14px', background: overIdx === i ? 'var(--zg-accent-tint)' : dragIdx === i ? 'oklch(0.25 0.02 250 / 0.5)' : t.status !== 'active' ? 'var(--zg-bg)' : 'var(--zg-panel)', borderBottom:'1px solid var(--zg-line-soft)', alignItems:'center', cursor:'grab', opacity: t.status !== 'active' ? 0.55 : 1, outline: overIdx === i ? '1px dashed var(--zg-accent)' : 'none' }"
        >
          <div style="color:var(--zg-text-xdim);cursor:grab"><svg viewBox="0 0 8 12" width="8" fill="currentColor"><circle cx="2" cy="2" r="1.1" /><circle cx="6" cy="2" r="1.1" /><circle cx="2" cy="6" r="1.1" /><circle cx="6" cy="6" r="1.1" /><circle cx="2" cy="10" r="1.1" /><circle cx="6" cy="10" r="1.1" /></svg></div>
          <div><div style="font-size:13px;font-weight:600;color:var(--zg-text)">{{ t.name }}</div><div style="font-size:10px;font-family:var(--zg-mono);color:var(--zg-text-dim);margin-top:1px">{{ t.code }}</div></div>
          <span style="font-size:11px;color:var(--zg-text-dim)">{{ t.input_type === 'select' ? 'Dropdown' : t.input_type === 'swatch_color' ? 'Colour' : 'Text Swatches' }}</span>
          <div style="font-size:10.5px;color:var(--zg-text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ (t.applies_to || []).join(', ') || '—' }}</div>
          <div style="display:flex;gap:3px;flex-wrap:wrap">
            <template v-if="t.input_type === 'swatch_color'">
              <div v-for="(o, j) in (t.options || []).slice(0, 6)" :key="j" v-show="typeof o === 'object' && o.hex" :style="{ width:'14px', height:'14px', borderRadius:'3px', background: typeof o === 'object' ? o.hex : '', border:'1px solid oklch(1 0 0 / 0.15)', flexShrink:0 }" :title="typeof o === 'object' ? o.label : o" />
            </template>
            <template v-else>
              <span v-for="(o, j) in (t.options || []).slice(0, 4)" :key="j" style="font-size:9.5px;padding:1px 5px;background:var(--zg-panel-hi);border-radius:2px;color:var(--zg-text-dim);border:1px solid var(--zg-line);font-weight:600;white-space:nowrap">{{ typeof o === 'object' ? o.label : o }}</span>
            </template>
            <span v-if="(t.options || []).length > (t.input_type === 'swatch_color' ? 6 : 4)" style="font-size:9px;color:var(--zg-text-xdim);align-self:center">+{{ t.options.length - (t.input_type === 'swatch_color' ? 6 : 4) }}</span>
          </div>
          <div @click.stop><button class="zcat-toggle" :class="t.status === 'active' ? 'on' : 'off'" @click="toggleType(t.id)"><div class="zcat-toggle-knob" /></button></div>
          <div style="display:flex;gap:4px" @click.stop><button class="zcat-act" style="opacity:1" @click="openType(t)">Edit</button></div>
        </div>
      </div>

      <!-- Product Configs -->
      <div v-else style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:1fr 100px 140px 70px 70px 90px;gap:10px;padding:0 14px;height:32px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span>Product</span><span>Brand</span><span>Variant Types</span><span>SKUs</span><span>Disabled</span><span></span>
        </div>
        <div v-for="pv in productVariants" :key="pv.id" style="display:grid;grid-template-columns:1fr 100px 140px 70px 70px 90px;gap:10px;padding:12px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;cursor:pointer" @click="openPv(pv)">
          <div><div style="font-size:12.5px;font-weight:600;color:var(--zg-text)">{{ pv.product }}</div><div style="font-size:10px;font-family:var(--zg-mono);color:var(--zg-text-dim);margin-top:1px">{{ pv.sku }}</div></div>
          <span style="font-size:12px;color:var(--zg-text-mid)">{{ pv.brand }}</span>
          <div style="display:flex;flex-wrap:wrap;gap:3px"><span v-for="n in vNamesFor(pv)" :key="n" style="font-size:9.5px;padding:1px 5px;background:var(--zg-panel-hi);border-radius:2px;color:var(--zg-text-dim);font-weight:600;border:1px solid var(--zg-line)">{{ n }}</span></div>
          <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text-mid)">{{ pv.variants.length }}</span>
          <span :style="{ fontFamily:'var(--zg-mono)', fontSize:'12px', color: disabledFor(pv) > 0 ? 'var(--zg-warn)' : 'var(--zg-text-dim)', fontWeight: disabledFor(pv) > 0 ? 700 : 400 }">{{ disabledFor(pv) || '—' }}</span>
          <button class="zcat-act" style="opacity:1" @click.stop="openPv(pv)">Manage</button>
        </div>
      </div>
    </div>

    <VariantTypeDrawer :open="typeOpen" :vtype="typeEdit" @close="typeOpen = false" @save="onSaveType" />
    <ProductVariantDrawer :open="pvOpen" :config="pvEdit" @close="pvOpen = false" />
  </div>
</template>
