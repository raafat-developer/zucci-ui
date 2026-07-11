<script setup>
/**
 * AddCareInstructionDrawer — slide-in drawer to create a new Care Instruction.
 * POST /catalog/care-instructions
 * On success: refreshes lookup store → emits 'created' with the new record.
 */
import { ref, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { createCareInstruction } from '@/api/lookup.api';
import { useLookup } from '@/composables/useLookup';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['close', 'created']);

const lookup = useLookup();

// ── form state ────────────────────────────────────────────
const code        = ref('');
const name        = ref('');
const instructions = ref('');
const saving      = ref(false);
const errors      = ref({});

// reset on open
watch(() => props.open, (v) => {
  if (v) {
    code.value         = '';
    name.value         = '';
    instructions.value = '';
    saving.value       = false;
    errors.value       = {};
  }
});

// ── helpers ───────────────────────────────────────────────
function validate() {
  const e = {};
  if (!code.value.trim())         e.code         = 'Code is required';
  if (!name.value.trim())         e.name         = 'Name is required';
  if (!instructions.value.trim()) e.instructions = 'Instructions are required';
  errors.value = e;
  return Object.keys(e).length === 0;
}

async function handleSave() {
  if (!validate()) return;
  saving.value = true;
  try {
    const payload = {
      code: code.value.trim(),
      translations: [
        {
          localeId: 1,
          name: name.value.trim(),
          instructions: instructions.value.trim(),
        },
      ],
    };
    const res = await createCareInstruction(payload);
    // Refresh the lookup list so the parent select shows the new item
    await lookup.refreshCareInstructions();
    toast.success(`Care instruction "${name.value}" created successfully`);
    emit('created', res);
    emit('close');
  } catch (err) {
    toast.error(err?.message || 'Failed to create care instruction');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <ZDrawer
    :open="open"
    title="Add Care Instruction"
    subtitle="Create a new care instruction for products"
    :width="480"
    @close="emit('close')"
  >
    <div class="aci-form">

      <!-- Code -->
      <div class="aci-field">
        <label class="aci-label">Code <span class="aci-req">*</span></label>
        <input
          v-model="code"
          class="aci-input"
          :class="{ 'has-error': errors.code }"
          placeholder="e.g. machine-wash-cold"
          @input="delete errors.code"
        />
        <span v-if="errors.code" class="aci-err">{{ errors.code }}</span>
        <span class="aci-hint">A unique slug-style identifier (no spaces).</span>
      </div>

      <!-- Name -->
      <div class="aci-field">
        <label class="aci-label">Name <span class="aci-req">*</span></label>
        <input
          v-model="name"
          class="aci-input"
          :class="{ 'has-error': errors.name }"
          placeholder="e.g. Machine wash cold"
          @input="delete errors.name"
        />
        <span v-if="errors.name" class="aci-err">{{ errors.name }}</span>
      </div>

      <!-- Instructions -->
      <div class="aci-field">
        <label class="aci-label">Instructions <span class="aci-req">*</span></label>
        <textarea
          v-model="instructions"
          class="aci-textarea"
          :class="{ 'has-error': errors.instructions }"
          placeholder="e.g. Wash with like colors. Do not bleach."
          rows="4"
          @input="delete errors.instructions"
        />
        <span v-if="errors.instructions" class="aci-err">{{ errors.instructions }}</span>
        <span class="aci-hint">Customer-facing care instructions text.</span>
      </div>

    </div>

    <!-- Footer slot -->
    <template #footer>
      <button class="aci-btn aci-btn-ghost" :disabled="saving" @click="emit('close')">
        Cancel
      </button>
      <button class="aci-btn aci-btn-primary" :disabled="saving" @click="handleSave">
        <span v-if="saving" class="aci-spinner" />
        {{ saving ? 'Saving…' : 'Create Instruction' }}
      </button>
    </template>
  </ZDrawer>
</template>

<style scoped>
.aci-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.aci-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.aci-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--zg-text);
  letter-spacing: 0.01em;
}

.aci-req {
  color: var(--zg-danger);
  margin-left: 1px;
}

.aci-input,
.aci-textarea {
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
  resize: vertical;
}

.aci-input:focus,
.aci-textarea:focus {
  border-color: var(--zg-accent);
}

.aci-input.has-error,
.aci-textarea.has-error {
  border-color: var(--zg-danger);
}

.aci-hint {
  font-size: 11px;
  color: var(--zg-text-xdim);
  margin-top: 1px;
}

.aci-err {
  font-size: 11px;
  color: var(--zg-danger);
}

/* Buttons */
.aci-btn {
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

.aci-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.aci-btn-ghost {
  background: var(--zg-panel);
  color: var(--zg-text-dim);
  border: 1px solid var(--zg-line);
}

.aci-btn-ghost:hover:not(:disabled) {
  background: var(--zg-panel-hi);
  color: var(--zg-text);
}

.aci-btn-primary {
  background: var(--zg-accent);
  color: #fff;
}

.aci-btn-primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

/* Spinner */
.aci-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: aci-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes aci-spin {
  to { transform: rotate(360deg); }
}
</style>
