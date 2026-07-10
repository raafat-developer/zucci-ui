<script setup>
import { ref, watch } from 'vue'
import ZModal from '@/components/ui/ZModal.vue'
import { toast } from '@/composables/useToast'
import { useProductsStore } from '@/stores/products'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const productsStore = useProductsStore()

const phase = ref('upload')
const preview = ref([])
const error = ref('')
const fileRef = ref(null)
const selectedFile = ref(null)

watch(() => props.open, (value) => {
  if (value) {
    phase.value = 'upload'
    preview.value = []
    error.value = ''
    selectedFile.value = null
  }
})

const sampleCsv = () => [
  'name;sku;slug;brand_id;supplier_entity_id;product_status_id;approval_status_id;fulfillment_mode_id;return_policy_id;shipping_unit_id;sync_status_id;is_variable',
  'Demo Product;SKU-1001;demo-product;c7290eba-d80e-4ecd-ac78-74967f64c69e;9d41c51b-35a7-4238-bda2-85b2c26fb59d;101;111;1;1;1;153;1'
].join('\r\n')

const downloadSample = () => {
  try {
    const blob = new Blob(['\ufeff' + sampleCsv()], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'products-sample.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch {
    toast.error('Failed to download sample CSV')
  }
}

const parseCsv = (text) => {
  const normalizedText = text.replace(/\r?\n/g, '\n').trim()
  if (!normalizedText) return []

  const lines = normalizedText.split('\n')
  if (lines.length < 2) return []

  const delimiter = lines[0].includes(';') ? ';' : ','
  const keys = lines[0].split(delimiter).map((key) => key.trim())

  return lines.slice(1).map((row) => {
    const values = row.split(delimiter).map((value) => value.trim().replace(/^"|"$/g, ''))
    return Object.fromEntries(keys.map((key, index) => [key, values[index] || '']))
  })
}

const validateFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected' }

  const allowedExtensions = ['.csv']
  const hasValidExtension = allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
  const allowedMimeTypes = [
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'text/plain'
  ]
  const hasValidMimeType = allowedMimeTypes.includes(file.type) || hasValidExtension

  if (!hasValidExtension && !hasValidMimeType) {
    return { valid: false, error: 'Please select a valid CSV file' }
  }

  return { valid: true }
}

const handleFile = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const validation = validateFile(file)
  if (!validation.valid) {
    error.value = validation.error
    return
  }

  selectedFile.value = file
  const reader = new FileReader()
  reader.onload = (loadEvent) => {
    try {
      preview.value = parseCsv(loadEvent.target.result)
      phase.value = 'preview'
      error.value = ''
    } catch {
      error.value = 'Could not parse CSV file'
    }
  }
  reader.onerror = () => {
    error.value = 'Error reading file'
  }
  reader.readAsText(file)
}

const doImport = async () => {
  try {
    await productsStore.importProducts(selectedFile.value)
    phase.value = 'done'
    toast.success(`${preview.value.length} products imported successfully`)
  } catch {
    error.value = 'Failed to import products. Please try again.'
    toast.error(error.value)
  }
}

const cols = () => Object.keys(preview.value[0] || {})
</script>

<template>
  <ZModal :open="open" :width="600" @close="emit('close')">
    <template #head>
      <div>
        <div style="font-size:14px;font-weight:700;color:var(--zg-text)">Bulk Import Products</div>
        <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px">Catalog products</div>
      </div>
    </template>

    <div style="display:flex;flex-direction:column;gap:14px">
      <template v-if="phase === 'upload'">
        <div style="padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text-dim);line-height:1.6">
          Upload a CSV file to create or update products in bulk. Download the sample to see the expected structure.
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
              <thead><tr style="background:var(--zg-panel-hi)"><th v-for="key in cols()" :key="key" style="padding:7px 12px;text-align:left;font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;border-bottom:1px solid var(--zg-line);white-space:nowrap">{{ key }}</th></tr></thead>
              <tbody>
                <tr v-for="(row, index) in preview.slice(0, 6)" :key="index" :style="{ borderBottom:'1px solid var(--zg-line-soft)', background: index % 2 === 0 ? 'var(--zg-panel)' : 'var(--zg-bg)' }">
                  <td v-for="(value, valueIndex) in Object.values(row)" :key="valueIndex" style="padding:7px 12px;font-size:11.5px;color:var(--zg-text-mid);white-space:nowrap">{{ value || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <div v-else style="text-align:center;padding:32px 20px">
        <div style="font-size:14px;font-weight:700;color:var(--zg-good)">✓ {{ preview.length }} products imported</div>
      </div>
    </div>

    <template #footer>
      <template v-if="phase === 'preview'">
        <button class="zwh-btn-ghost" @click="phase = 'upload'">Back</button>
        <button class="zwh-btn-primary" @click="doImport">Import {{ preview.length }} Products</button>
      </template>
      <button v-else-if="phase === 'done'" class="zwh-btn-primary" @click="emit('close')">Close</button>
      <button v-else class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>
  </ZModal>
</template>
