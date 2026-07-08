<script setup>
/**
 * SizeChartDetailDrawer — view / edit a size chart's measurement table.
 * Faithful port of SizeChartDetailDrawer from zucci-size-guides.jsx: info
 * grid, super-admin edit mode (add/remove size rows, edit cell values),
 * approve/reject for pending charts, activity-log launcher.
 */
import { ref, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { ZC_SIZE_TYPES } from '@/data/sizeGuidesData';
import { toast } from '@/composables/useToast';

const props = defineProps({
  open: { type: Boolean, default: false },
  chart: { type: Object, default: null },
  isSuperAdmin: { type: Boolean, default: true },
});
const emit = defineEmits(['close', 'approve', 'reject', 'log-open']);

function fmtDt(s) { return s ? new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; }

const editMode = ref(false);
const rows = ref([]);
watch(() => [props.open, props.chart?.id], () => {
  if (props.open && props.chart) { rows.value = (props.chart.rows || []).map((r) => ({ ...r })); editMode.value = false; }
});

const st = computed(() => (ZC_SIZE_TYPES || {})[props.chart?.size_type] || {});
const mkeys = computed(() => st.value.measurements || []);
const colMap = { chest_cm:'Chest', waist_cm:'Waist', hip_cm:'Hip', shoulder_cm:'Shoulder', foot_length_cm:'Foot L.', height_cm:'Height', circumference_mm:'Circ.', diameter_mm:'Diam.' };

const deleteRow = (ri) => { rows.value = rows.value.filter((_, i) => i !== ri); };

const ALL_SIZES = {
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
const sizeOpts = computed(() => (ALL_SIZES[props.chart?.size_type] || []).filter((s) => !rows.value.find((r) => r.size === s)));
const addRow = (size) => {
  const allSizes = ALL_SIZES[props.chart?.size_type] || [];
  const blank = Object.fromEntries(mkeys.value.map((k) => [k, '']));
  rows.value = [...rows.value, { size, ...blank }].sort((a, b) => allSizes.indexOf(a.size) - allSizes.indexOf(b.size));
};
const save = () => { editMode.value = false; toast.success('Size chart updated'); };
</script>

<template>
  <ZDrawer v-if="chart" :open="open" :title="chart.name" :subtitle="`${chart.brand} · ${chart.category}`" :width="760" @close="emit('close')">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
        <div v-for="[l, v] in [['Size Type', st.label || chart.size_type], ['Category', chart.category], ['Brand', chart.brand], ['Status', chart.status], ['Uploaded By', chart.uploaded_by || '—'], ['Approved By', chart.approved_by || '—'], ['Uploaded', fmtDt(chart.uploaded_at)], ['Zucci Master', chart.is_zucci_master ? 'Yes' : 'No']]" :key="l" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:9px 12px">
          <div style="font-size:10px;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:0.07em;font-weight:600;margin-bottom:3px">{{ l }}</div>
          <div style="font-size:12.5px;font-weight:600;color:var(--zg-text)">{{ v }}</div>
        </div>
      </div>

      <div v-if="isSuperAdmin" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <button class="zwh-btn-ghost" style="height:28px;font-size:11px" @click="editMode = !editMode">{{ editMode ? 'Cancel Edit' : 'Edit Chart' }}</button>
        <button class="zwh-btn-ghost" style="height:28px;font-size:11px" @click="emit('log-open')">Activity Log</button>
      </div>

      <div v-if="editMode && sizeOpts.length" style="display:flex;align-items:center;gap:8px;padding:10px 0;border-top:1px solid var(--zg-line);flex-wrap:wrap">
        <span style="font-size:11px;color:var(--zg-text-dim);font-weight:600;flex-shrink:0">Add size:</span>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          <button v-for="s in sizeOpts" :key="s" type="button" style="height:24px;padding:0 9px;border:1px dashed var(--zg-accent);border-radius:3px;background:transparent;color:var(--zg-accent);font-family:var(--zg-mono);font-size:11px;font-weight:700;cursor:pointer" @click="addRow(s)">+ {{ s }}</button>
        </div>
      </div>

      <div class="zsc-table-wrap">
        <table class="zsc-table">
          <thead><tr><th>Size</th><th v-for="k in mkeys" :key="k">{{ colMap[k] || k }}</th></tr></thead>
          <tbody>
            <tr v-for="(row, ri) in rows" :key="ri" :style="{ background: ri % 2 === 0 ? 'var(--zg-panel)' : 'var(--zg-bg)' }">
              <td style="font-weight:700">
                <div style="display:flex;align-items:center;gap:5px">
                  {{ row.size }}
                  <button v-if="editMode" type="button" title="Remove row" style="width:14px;height:14px;border:none;background:transparent;color:var(--zg-danger);cursor:pointer;font-size:13px;line-height:1;padding:0;flex-shrink:0" @click="deleteRow(ri)">×</button>
                </div>
              </td>
              <td v-for="k in mkeys" :key="k">
                <input v-if="editMode" type="number" v-model="row[k]" style="width:68px;padding:3px 6px;background:var(--zg-bg-elev);border:1px solid var(--zg-accent);border-radius:3px;font-family:var(--zg-mono);font-size:12px;color:var(--zg-text);outline:none;text-align:center" />
                <template v-else>{{ row[k] ?? '—' }}</template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template #footer>
      <button v-if="editMode" class="zwh-btn-primary" @click="save">Save Changes</button>
      <template v-else>
        <button v-if="chart.status === 'pending'" class="zwh-btn-primary" @click="emit('approve', chart.id); emit('close')">Approve Chart</button>
        <button v-if="chart.status === 'pending'" class="zwh-btn-ghost" style="color:var(--zg-danger)" @click="emit('reject', chart.id); emit('close')">Reject</button>
        <button v-if="chart.status === 'approved' && isSuperAdmin" class="zwh-btn-ghost" @click="editMode = true">Edit</button>
      </template>
      <button class="zwh-btn-ghost" @click="emit('close')">Close</button>
    </template>
  </ZDrawer>
</template>
