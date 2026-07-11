<script setup>
/**
 * UploadChartDrawer — upload a new size chart for a brand. Faithful port of
 * UploadChartDrawer from zucci-size-guides.jsx: brand/category/size-type
 * selectors, CSV upload OR manual size-by-size table build, template
 * download, preview, validation.
 */
import { ref, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { ZC_SIZE_CHARTS, ZC_SIZE_TYPES } from '@/data/sizeGuidesData';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['close', 'uploaded']);

const brand = ref(''); const cat = ref(''); const sizeType = ref('');
const file = ref(null); const parsed = ref(null); const error = ref('');
const fileRef = ref(null);
const mode = ref('csv'); // 'csv' | 'manual'
const manualRows = ref([]);

watch(() => props.open, (v) => {
  if (v) { brand.value = ''; cat.value = ''; sizeType.value = ''; file.value = null; parsed.value = null; error.value = ''; mode.value = 'csv'; manualRows.value = []; }
});
watch(sizeType, () => { manualRows.value = []; });

const ST_SIZES = {
  clothing_intl:    ['XXXS','XXS','XS','S','M','L','XL','2XL','3XL','4XL','5XL','6XL'],
  clothing_numeric: ['34','36','38','40','42','44','46','48','50','52','54','56'],
  footwear_eu:      ['35','36','37','38','39','40','41','42','43','44','45','46','47','48'],
  footwear_uk:      ['2','3','4','5','6','7','8','9','10','11','12','13'],
  footwear_us:      ['5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12'],
  footwear_us_mens: ['6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','13'],
  footwear_cm:      ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','27.5','28','29','30'],
  ring_size:        ['46','48','50','52','54','56','58','60','62','64','66'],
  kids_by_age:      ['NB','3M','6M','12M','18M','24M','3Y','4Y','5Y','6Y','7Y','8Y','9Y','10Y','12Y','14Y','16Y'],
  one_size:         ['ONE SIZE'],
};
const colMap = { chest_cm:'Chest (cm)', waist_cm:'Waist (cm)', hip_cm:'Hip (cm)', shoulder_cm:'Shoulder (cm)', foot_length_cm:'Foot L. (cm)', height_cm:'Height (cm)', circumference_mm:'Circ. (mm)', diameter_mm:'Diam. (mm)' };

const availSizes  = computed(() => (sizeType.value ? (ST_SIZES[sizeType.value] || []).filter((s) => !manualRows.value.find((r) => r.size === s)) : []));
const curMeasures = computed(() => (sizeType.value ? ((ZC_SIZE_TYPES || {})[sizeType.value]?.measurements || []) : []));
const addManualRow = (size) => {
  const allSizes = ST_SIZES[sizeType.value] || [];
  const blank = Object.fromEntries(curMeasures.value.map((k) => [k, '']));
  manualRows.value = [...manualRows.value, { size, ...blank }].sort((a, b) => allSizes.indexOf(a.size) - allSizes.indexOf(b.size));
};
const delManualRow = (ri) => { manualRows.value = manualRows.value.filter((_, i) => i !== ri); };

import { useLookup } from '@/composables/useLookup';
const lookup = useLookup();
const brands = computed(() => {
  return lookup.get('brands').map((b) => b.name || b.translations?.[0]?.name).filter(Boolean);
});
const sizeTypes = ZC_SIZE_TYPES || {};
const cats = computed(() => {
  return lookup.get('categories').map((c) => c.name || c.label || c.translations?.[0]?.name).filter(Boolean);
});

const handleFile = (e) => {
  const f = e.target.files[0]; if (!f) return;
  file.value = f; error.value = '';
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const text = ev.target.result;
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      const rows = lines.slice(1).map((l) => {
        const vals = l.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
        return Object.fromEntries(headers.map((h, i) => [h, vals[i] || '']));
      });
      parsed.value = { headers, rows };
    } catch { error.value = 'Could not parse CSV — check format.'; parsed.value = null; }
  };
  reader.readAsText(f);
};

const valid = computed(() => brand.value && cat.value && sizeType.value && (mode.value === 'csv' ? parsed.value : manualRows.value.length > 0));

const handleUpload = () => {
  const rows = mode.value === 'csv' ? (parsed.value?.rows || []) : manualRows.value;
  toast.success(`Size chart uploaded for ${brand.value} — pending approval`);
  emit('uploaded', { brand: brand.value, cat: cat.value, sizeType: sizeType.value, rows });
  emit('close');
};

const downloadSample = () => {
  const st = sizeTypes[sizeType.value];
  const cols = st ? ['size', ...(st.measurements || [])] : ['size', 'chest_cm', 'waist_cm', 'hip_cm'];
  const header = cols.join(',');
  const sample = [header, 'XS,80,62,86', 'S,84,66,90', 'M,88,70,94'].join('\n');
  const blob = new Blob([sample], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `size-chart-template-${sizeType.value || 'clothing'}.csv`; a.click();
};
</script>

<template>
  <ZDrawer :open="open" title="Upload Size Chart" subtitle="Add a new size chart for a brand" :width="720" @close="emit('close')">
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="display:flex;flex-direction:column;gap:5px">
          <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Brand <span style="color:var(--zg-danger)">*</span></label>
          <select v-model="brand" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-sans);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer">
            <option value="">Select brand…</option>
            <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>
        <div style="display:flex;flex-direction:column;gap:5px">
          <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Category <span style="color:var(--zg-danger)">*</span></label>
          <select v-model="cat" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-sans);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer">
            <option value="">Select category…</option>
            <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:5px">
        <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Size Type <span style="color:var(--zg-danger)">*</span></label>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
          <button
            v-for="[k, st] in Object.entries(sizeTypes)"
            :key="k"
            type="button"
            :style="{ padding:'8px 10px', border:'1px solid', borderRadius:'var(--zg-radius-md)', cursor:'pointer', fontSize:'11px', fontFamily:'inherit', fontWeight:600, textAlign:'left', lineHeight:1.3, borderColor: sizeType===k?'var(--zg-accent)':'var(--zg-line)', background: sizeType===k?'var(--zg-accent-tint)':'transparent', color: sizeType===k?'var(--zg-accent)':'var(--zg-text-mid)' }"
            @click="sizeType = k"
          >{{ st.label }}</button>
        </div>
      </div>

      <div v-if="sizeType" style="padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);display:flex;align-items:center;justify-content:space-between;gap:10">
        <span style="font-size:11.5px;color:var(--zg-text-dim)">Expected columns: <span style="font-family:var(--zg-mono);color:var(--zg-text-mid)">size, {{ (sizeTypes[sizeType]?.measurements || []).join(', ') }}</span></span>
        <button class="zwh-btn-ghost" style="height:26px;font-size:11px;flex-shrink:0" @click="downloadSample">Download template</button>
      </div>

      <div v-if="sizeType" style="display:flex;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;width:fit-content">
        <button type="button" :style="{ height:'30px', padding:'0 14px', border:'none', borderRight:'1px solid var(--zg-line)', fontFamily:'inherit', fontSize:'11.5px', fontWeight:600, cursor:'pointer', background: mode==='csv'?'var(--zg-accent)':'var(--zg-panel)', color: mode==='csv'?'oklch(0.18 0.04 130)':'var(--zg-text-dim)' }" @click="mode = 'csv'">Upload CSV</button>
        <button type="button" :style="{ height:'30px', padding:'0 14px', border:'none', fontFamily:'inherit', fontSize:'11.5px', fontWeight:600, cursor:'pointer', background: mode==='manual'?'var(--zg-accent)':'var(--zg-panel)', color: mode==='manual'?'oklch(0.18 0.04 130)':'var(--zg-text-dim)' }" @click="mode = 'manual'">Build Manually</button>
      </div>

      <!-- CSV mode -->
      <div v-if="mode === 'csv'">
        <div
          :style="{ border:'2px dashed var(--zg-line)', borderRadius:'var(--zg-radius-md)', padding:'24px', textAlign:'center', cursor:'pointer', background: file ? 'oklch(0.78 0.15 150 / 0.05)' : 'transparent', borderColor: file ? 'var(--zg-good)' : 'var(--zg-line)' }"
          @click="fileRef.click()"
        >
          <span v-if="file" style="font-size:13px;color:var(--zg-good);font-weight:600">✓ {{ file.name }} ({{ parsed?.rows?.length || 0 }} rows)</span>
          <template v-else>
            <svg viewBox="0 0 24 24" width="28" fill="none" stroke="var(--zg-text-xdim)" stroke-width="1.5" stroke-linecap="round" style="display:block;margin:0 auto 8px"><path d="M12 3v12M8 9l4-4 4 4M3 20h18" /></svg>
            <div style="font-size:12.5px;color:var(--zg-text-mid);font-weight:600">Click to upload CSV file</div>
          </template>
        </div>
        <input ref="fileRef" type="file" accept=".csv,text/csv" style="display:none" @change="handleFile" />
        <div v-if="error" style="margin-top:8px;font-size:12px;color:var(--zg-danger)">{{ error }}</div>
      </div>

      <!-- Manual mode -->
      <div v-if="mode === 'manual' && sizeType" style="display:flex;flex-direction:column;gap:10px">
        <div v-if="availSizes.length" style="display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap">
          <span style="font-size:11px;color:var(--zg-text-dim);font-weight:600;padding-top:4px;flex-shrink:0">Add size:</span>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            <button v-for="s in availSizes" :key="s" type="button" style="height:26px;padding:0 10px;border:1px dashed var(--zg-accent);border-radius:4px;background:transparent;color:var(--zg-accent);font-family:var(--zg-mono);font-size:11.5px;font-weight:700;cursor:pointer" @click="addManualRow(s)">+ {{ s }}</button>
          </div>
        </div>

        <div v-if="manualRows.length" class="zsc-table-wrap">
          <table class="zsc-table">
            <thead><tr><th>Size</th><th v-for="k in curMeasures" :key="k">{{ colMap[k] || k }}</th><th></th></tr></thead>
            <tbody>
              <tr v-for="(row, ri) in manualRows" :key="ri">
                <td style="font-weight:700">{{ row.size }}</td>
                <td v-for="k in curMeasures" :key="k"><input type="number" v-model="row[k]" style="width:72px;padding:4px 8px;background:var(--zg-bg-elev);border:1px solid var(--zg-accent);border-radius:3px;font-family:var(--zg-mono);font-size:12px;color:var(--zg-text);outline:none;text-align:center" /></td>
                <td><button type="button" style="width:20px;height:20px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;color:var(--zg-danger);cursor:pointer;font-size:13px" @click="delManualRow(ri)">×</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else style="padding:24px;text-align:center;border:1px dashed var(--zg-line);border-radius:var(--zg-radius-md);color:var(--zg-text-dim);font-size:12px">Click a size above to add it to the table</div>
      </div>

      <div v-if="parsed" style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="padding:8px 12px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600">Preview — {{ parsed.rows.length }} rows</div>
        <div style="overflow-x:auto">
          <table class="zsc-table">
            <thead><tr><th v-for="h in parsed.headers" :key="h">{{ h }}</th></tr></thead>
            <tbody><tr v-for="(r, i) in parsed.rows.slice(0, 6)" :key="i"><td v-for="h in parsed.headers" :key="h">{{ r[h] || '—' }}</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
      <button class="zwh-btn-primary" :disabled="!valid" :style="{ opacity: valid ? 1 : 0.4 }" @click="handleUpload">Upload Chart</button>
    </template>
  </ZDrawer>
</template>
