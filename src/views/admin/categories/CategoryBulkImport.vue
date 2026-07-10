<script setup>
/**
 * CategoryBulkImport — CSV bulk import modal (sample download, upload, preview,
 * import). Faithful port of BulkImportModal from zucci-categories.jsx.
 */
import { ref, watch } from 'vue';
import ZModal from '@/components/ui/ZModal.vue';
import { toast } from '@/composables/useToast';
import { useCategoriesStore } from '@/stores/categories';
import { exportCsv } from '@/utils/exportCsv';

const props = defineProps({ open: { type: Boolean, default: false }, tab: { type: String, default: 'products' } });
const emit = defineEmits(['close']);

const categoriesStore = useCategoriesStore();

const phase = ref('upload');
const preview = ref([]);
const error = ref('');
const fileRef = ref(null);
const selectedFile = ref(null);

watch(() => props.open, (v) => { if (v) { phase.value = 'upload'; preview.value = []; error.value = ''; selectedFile.value = null; } });

const sampleCsv = (tab) => tab === 'products'
  ? 'slug,name,parent_slug,status_id,is_featured,is_private,fit_finder_size_guide_code\nwomens-fashion,Women\'s Fashion,,161,1,0,\nabayas,Abayas,womens-fashion,161,0,0,'
  : 'slug,label,mapped_to_slug,commission_pct,requires_approval,status\nwomen-clothing,Women — Clothing,womens-fashion,15,true,active';

const downloadSample = async () => {
  try {
    const filename = `categories-sample-${props.tab}.csv`;
    const csvText = sampleCsv(props.tab);
    // Create a blob and use our export utility
    const blob = new Blob(['\ufeff' + csvText], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    toast.error('Failed to download sample CSV');
  }
};

// Helper to parse CSV (handles both commas and semicolons)
const parseCsv = (text) => {
  // Normalize line endings
  const normalizedText = text.replace(/\r?\n/g, '\n').trim();
  if (!normalizedText) return [];
  
  const lines = normalizedText.split('\n');
  if (lines.length < 2) return [];
  
  // Determine if we should split by semicolon or comma
  const firstLine = lines[0];
  const hasSemicolons = firstLine.includes(';');
  const delimiter = hasSemicolons ? ';' : ',';
  
  const keys = firstLine.split(delimiter).map((k) => k.trim());
  return lines.slice(1).map((row) => {
    const vals = row.split(delimiter).map((v) => v.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(keys.map((k, i) => [k, vals[i] || '']));
  });
};

const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  // Check file extension
  const allowedExtensions = ['.csv', '.CSV'];
  const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  
  // Check MIME type
  const allowedMimeTypes = [
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  const hasValidMimeType = allowedMimeTypes.includes(file.type) || hasValidExtension;
  
  if (!hasValidExtension && !hasValidMimeType) {
    return { valid: false, error: 'Please select a valid CSV file' };
  }
  
  return { valid: true };
};

const handleFile = (e) => {
  const f = e.target.files[0];
  if (!f) return;
  
  const validation = validateFile(f);
  if (!validation.valid) {
    error.value = validation.error;
    return;
  }
  
  selectedFile.value = f;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      preview.value = parseCsv(ev.target.result);
      phase.value = 'preview';
      error.value = '';
    } catch {
      error.value = 'Could not parse CSV file';
    }
  };
  reader.onerror = () => {
    error.value = 'Error reading file';
  };
  reader.readAsText(f);
};

const doImport = async () => {
  try {
    await categoriesStore.importCategories(selectedFile.value);
    phase.value = 'done';
    toast.success(`${preview.value.length} categories imported successfully`);
  } catch (err) {
    error.value = 'Failed to import categories. Please try again.';
    toast.error(error.value);
  }
};

const cols = () => Object.keys(preview.value[0] || {});
</script>

<template>
  <ZModal :open="open" :width="600" @close="emit('close')">
    <template #head>
      <div>
        <div style="font-size:14px;font-weight:700;color:var(--zg-text)">Bulk Import Categories</div>
        <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px">{{ tab === 'products' ? 'Internal taxonomy' : 'Marketplace categories' }}</div>
      </div>
    </template>

    <div style="display:flex;flex-direction:column;gap:14px">
      <template v-if="phase === 'upload'">
        <div style="padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text-dim);line-height:1.6">
          Upload a CSV file to create or update categories in bulk. Download the sample to see the expected structure.
        </div>
        <button class="zwh-btn-ghost" style="width:fit-content" @click="downloadSample">Download sample CSV</button>
        <div style="border:2px dashed var(--zg-line);border-radius:var(--zg-radius-md);padding:32px 20px;text-align:center;cursor:pointer" @click="fileRef.click()">
          <svg viewBox="0 0 24 24" width="28" fill="none" stroke="var(--zg-text-xdim)" stroke-width="1.5" stroke-linecap="round" style="display:block;margin:0 auto 8px"><path d="M12 3v12M8 9l4-4 4 4M3 20h18" /></svg>
          <div style="font-size:13px;color:var(--zg-text-mid);font-weight:600">Click to choose CSV file</div>
        </div>
        <input ref="fileRef" type="file" accept=".csv,text/csv" style="display:none" @change="handleFile" />
        <div v-if="error" style="font-size:12px;color:var(--zg-danger)">{{ error }}</div>
      </template>

      <template v-else-if="phase === 'preview'">
        <div style="font-size:12px;color:var(--zg-text-dim)">{{ preview.length }} rows ready to import</div>
        <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;min-width:400px">
              <thead><tr style="background:var(--zg-panel-hi)"><th v-for="k in cols()" :key="k" style="padding:7px 12px;text-align:left;font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;border-bottom:1px solid var(--zg-line);white-space:nowrap">{{ k }}</th></tr></thead>
              <tbody>
                <tr v-for="(row, i) in preview.slice(0, 6)" :key="i" :style="{ borderBottom:'1px solid var(--zg-line-soft)', background: i % 2 === 0 ? 'var(--zg-panel)' : 'var(--zg-bg)' }">
                  <td v-for="(v, j) in Object.values(row)" :key="j" style="padding:7px 12px;font-size:11.5px;color:var(--zg-text-mid);white-space:nowrap">{{ v || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <div v-else style="text-align:center;padding:32px 20px">
        <div style="font-size:14px;font-weight:700;color:var(--zg-good)">✓ {{ preview.length }} categories imported</div>
      </div>
    </div>

    <template #footer>
      <template v-if="phase === 'preview'">
        <button class="zwh-btn-ghost" @click="phase = 'upload'">Back</button>
        <button class="zwh-btn-primary" @click="doImport">Import {{ preview.length }} Categories</button>
      </template>
      <button v-else-if="phase === 'done'" class="zwh-btn-primary" @click="emit('close')">Close</button>
      <button v-else class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>
  </ZModal>
</template>
