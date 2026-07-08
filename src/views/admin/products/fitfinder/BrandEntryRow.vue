<script setup>
/**
 * BrandEntryRow — one row in the Fit Finder "brands you wear" step. Faithful
 * port of BrandEntryRow: brand / category / size / fit-feel selects + remove.
 */
import { computed } from 'vue';
import { ZC_SIZE_CHARTS } from '@/data/sizeGuidesData';

const props = defineProps({
  entry: { type: Object, required: true },
  brands: { type: Array, default: () => [] },
  garments: { type: Array, default: () => [] },
});
const emit = defineEmits(['update', 'remove']);

const FF_FIT_FEEL = ['Too Tight', 'Perfect Fit', 'Slightly Loose', 'Very Loose'];
const sizeOpts = computed(() => (ZC_SIZE_CHARTS || []).find((c) => c.brand === props.entry.brand)?.rows?.map((r) => r.size) || ['XS', 'S', 'M', 'L', 'XL', '2XL']);
</script>

<template>
  <div style="display:grid;grid-template-columns:1fr 110px 80px 120px 28px;gap:8px;align-items:center;padding:10px 12px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md)">
    <select :value="entry.brand" style="height:32px;padding:0 8px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-sm);font-family:var(--zg-sans);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer" @change="emit('update', 'brand', $event.target.value)">
      <option value="">Select brand…</option>
      <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
    </select>
    <select :value="entry.category" style="height:32px;padding:0 8px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-sm);font-family:var(--zg-sans);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer" @change="emit('update', 'category', $event.target.value)">
      <option value="">Category…</option>
      <option v-for="g in garments" :key="g" :value="g">{{ g }}</option>
    </select>
    <select :value="entry.size" style="height:32px;padding:0 8px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-sm);font-family:var(--zg-mono);font-size:12px;font-weight:700;color:var(--zg-text);outline:none;cursor:pointer" @change="emit('update', 'size', $event.target.value)">
      <option value="">Size…</option>
      <option v-for="s in sizeOpts" :key="s" :value="s">{{ s }}</option>
    </select>
    <select :value="entry.feel" :style="{ height:'32px', padding:'0 8px', background:'var(--zg-bg)', border:'1px solid var(--zg-line)', borderRadius:'var(--zg-radius-sm)', fontFamily:'var(--zg-sans)', fontSize:'11px', color: entry.feel==='Perfect Fit'?'var(--zg-good)':entry.feel?'var(--zg-accent)':'var(--zg-text-dim)', outline:'none', cursor:'pointer' }" @change="emit('update', 'feel', $event.target.value)">
      <option value="">How does it fit?</option>
      <option v-for="f in FF_FIT_FEEL" :key="f" :value="f">{{ f }}</option>
    </select>
    <button type="button" style="width:28px;height:28px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-sm);background:transparent;color:var(--zg-danger);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0" @click="emit('remove')">×</button>
  </div>
</template>
