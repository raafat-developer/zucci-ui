<script setup>
/**
 * AddSizeGuideDrawer — slide-in drawer to create a new Size Guide.
 * POST /catalog/size-guides
 * On success: refreshes lookup store → emits 'created' with the new record id so
 * the parent can auto-select it.
 */
import { ref, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import ZSearchableSelect from '@/components/ui/ZSearchableSelect.vue';
import { createSizeGuide } from '@/api/lookup.api';
import { useLookup } from '@/composables/useLookup';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['close', 'created']);

const lookup = useLookup();

// ── form state ─────────────────────────────────────────────
const code                = ref('');
const guideName           = ref('');
const gender              = ref('');
const brandId             = ref('');
const categoryId          = ref('');
const measurementSystemId = ref(1);

// Single example row
const sizeCode            = ref('');
const measurementCode     = ref('chest');
const measurementValue    = ref('');

const saving = ref(false);
const errors = ref({});

// ── options ────────────────────────────────────────────────
const genderOptions = [
  { value: 1, label: 'Men' },
  { value: 2, label: 'Women' },
  { value: 3, label: 'Unisex' },
  { value: 4, label: 'Kids' },
  { value: 5, label: 'Girls' },
  { value: 6, label: 'Boys' },
];

const measurementSystemOptions = [
  { value: 1, label: 'Metric (cm / kg)' },
  { value: 2, label: 'Imperial (in / lbs)' },
];

const brandOptions = computed(() => [
  { value: '', label: 'Select brand…' },
  ...lookup.get('brands').map((b) => ({
    value: b.id,
    label: b.name || b.translations?.[0]?.name || b.code || b.id,
  })),
]);

const categoryOptions = computed(() => [
  { value: '', label: 'Select category…' },
  ...lookup.get('categories').map((c) => ({
    value: c.id,
    label: c.name || c.translations?.[0]?.name || c.slug || c.id,
  })),
]);

// ── reset on open ─────────────────────────────────────────
watch(() => props.open, (v) => {
  if (v) {
    code.value                = '';
    guideName.value           = '';
    gender.value              = '';
    brandId.value             = '';
    categoryId.value          = '';
    measurementSystemId.value = 1;
    sizeCode.value            = '';
    measurementCode.value     = 'chest';
    measurementValue.value    = '';
    saving.value              = false;
    errors.value              = {};
  }
});

// ── validation ────────────────────────────────────────────
function validate() {
  const e = {};
  if (!code.value.trim())      e.code      = 'Code is required';
  if (!guideName.value.trim()) e.guideName  = 'Name is required';
  if (!gender.value)           e.gender    = 'Gender is required';
  if (!brandId.value)          e.brandId   = 'Brand is required';
  if (!categoryId.value)       e.categoryId = 'Category is required';
  errors.value = e;
  return Object.keys(e).length === 0;
}

// ── submit ────────────────────────────────────────────────
async function handleSave() {
  if (!validate()) return;
  saving.value = true;
  try {
    const payload = {
      code: code.value.trim(),
      gender: Number(gender.value),
      brandId: brandId.value,
      measurementSystemId: Number(measurementSystemId.value),
      categoryId: categoryId.value,
      translations: [{ localeId: 1, name: guideName.value.trim() }],
      rows: [],
    };

    // Attach the optional starter row if filled in
    if (sizeCode.value.trim() && measurementValue.value !== '') {
      payload.rows.push({
        sizeCode: sizeCode.value.trim(),
        measurements: [
          { code: measurementCode.value.trim(), value: Number(measurementValue.value) },
        ],
      });
    }

    const res = await createSizeGuide(payload);
    // Refresh lookup so the select shows the new entry
    await lookup.refreshSizeGuides();
    toast.success(`Size guide "${guideName.value}" created successfully`);
    emit('created', res);
    emit('close');
  } catch (err) {
    toast.error(err?.message || 'Failed to create size guide');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <ZDrawer
    :open="open"
    title="Add Size Guide"
    subtitle="Create a new size guide for products"
    :width="500"
    @close="emit('close')"
  >
    <div class="asg-form">

      <!-- Code -->
      <div class="asg-field">
        <label class="asg-label">Code <span class="asg-req">*</span></label>
        <input
          v-model="code"
          class="asg-input"
          :class="{ 'has-error': errors.code }"
          placeholder="e.g. mens-shirts-eu"
          @input="delete errors.code"
        />
        <span v-if="errors.code" class="asg-err">{{ errors.code }}</span>
        <span class="asg-hint">Unique slug identifier (no spaces).</span>
      </div>

      <!-- Name -->
      <div class="asg-field">
        <label class="asg-label">Name <span class="asg-req">*</span></label>
        <input
          v-model="guideName"
          class="asg-input"
          :class="{ 'has-error': errors.guideName }"
          placeholder="e.g. Men's EU Shirt Size Guide"
          @input="delete errors.guideName"
        />
        <span v-if="errors.guideName" class="asg-err">{{ errors.guideName }}</span>
      </div>

      <!-- Row: Gender + Measurement System -->
      <div class="asg-row">
        <div class="asg-field">
          <label class="asg-label">Gender <span class="asg-req">*</span></label>
          <ZSearchableSelect
            :model-value="gender"
            :options="genderOptions"
            placeholder="Select gender…"
            @update:model-value="v => { gender = v; delete errors.gender; }"
          />
          <span v-if="errors.gender" class="asg-err">{{ errors.gender }}</span>
        </div>
        <div class="asg-field">
          <label class="asg-label">Measurement System</label>
          <ZSearchableSelect
            :model-value="measurementSystemId"
            :options="measurementSystemOptions"
            @update:model-value="v => measurementSystemId = v"
          />
        </div>
      </div>

      <!-- Brand -->
      <div class="asg-field">
        <label class="asg-label">Brand <span class="asg-req">*</span></label>
        <ZSearchableSelect
          :model-value="brandId"
          :options="brandOptions"
          placeholder="Select brand…"
          @update:model-value="v => { brandId = v; delete errors.brandId; }"
        />
        <span v-if="errors.brandId" class="asg-err">{{ errors.brandId }}</span>
      </div>

      <!-- Category -->
      <div class="asg-field">
        <label class="asg-label">Category <span class="asg-req">*</span></label>
        <ZSearchableSelect
          :model-value="categoryId"
          :options="categoryOptions"
          placeholder="Select category…"
          @update:model-value="v => { categoryId = v; delete errors.categoryId; }"
        />
        <span v-if="errors.categoryId" class="asg-err">{{ errors.categoryId }}</span>
      </div>

      <!-- Optional starter row -->
      <div class="asg-section-label">Starter Row <span class="asg-optional">(optional)</span></div>
      <div class="asg-row asg-row--3">
        <div class="asg-field">
          <label class="asg-label">Size Code</label>
          <input v-model="sizeCode" class="asg-input" placeholder="e.g. M" />
        </div>
        <div class="asg-field">
          <label class="asg-label">Measurement</label>
          <input v-model="measurementCode" class="asg-input" placeholder="e.g. chest" />
        </div>
        <div class="asg-field">
          <label class="asg-label">Value</label>
          <input v-model="measurementValue" type="number" class="asg-input" placeholder="e.g. 90" />
        </div>
      </div>

    </div>

    <!-- Footer -->
    <template #footer>
      <button class="asg-btn asg-btn-ghost" :disabled="saving" @click="emit('close')">
        Cancel
      </button>
      <button class="asg-btn asg-btn-primary" :disabled="saving" @click="handleSave">
        <span v-if="saving" class="asg-spinner" />
        {{ saving ? 'Saving…' : 'Create Size Guide' }}
      </button>
    </template>
  </ZDrawer>
</template>

<style scoped>
.asg-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.asg-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0;
}
.asg-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.asg-row--3 {
  grid-template-columns: 1fr 1fr 1fr;
}
.asg-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--zg-text);
  letter-spacing: 0.01em;
}
.asg-req { color: var(--zg-danger); margin-left: 1px; }
.asg-optional { font-size: 10.5px; font-weight: 400; color: var(--zg-text-xdim); }

.asg-section-label {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--zg-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-top: 1px solid var(--zg-line);
  padding-top: 12px;
  margin-top: 2px;
}
.asg-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 11px;
  background: var(--zg-panel);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  color: var(--zg-text);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.14s;
}
.asg-input:focus { border-color: var(--zg-accent); }
.asg-input.has-error { border-color: var(--zg-danger); }
.asg-hint { font-size: 11px; color: var(--zg-text-xdim); }
.asg-err  { font-size: 11px; color: var(--zg-danger); }

/* Buttons */
.asg-btn {
  height: 34px;
  padding: 0 16px;
  border: none;
  border-radius: var(--zg-radius-md);
  font-size: 12.5px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: background 0.13s, opacity 0.13s;
}
.asg-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.asg-btn-ghost {
  background: var(--zg-panel);
  color: var(--zg-text-dim);
  border: 1px solid var(--zg-line);
}
.asg-btn-ghost:hover:not(:disabled) { background: var(--zg-panel-hi); color: var(--zg-text); }
.asg-btn-primary { background: var(--zg-accent); color: #fff; }
.asg-btn-primary:hover:not(:disabled) { filter: brightness(1.1); }

.asg-spinner {
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: asg-spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes asg-spin { to { transform: rotate(360deg); } }
</style>
