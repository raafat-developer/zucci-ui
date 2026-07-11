<script setup>
import { ref, reactive } from 'vue';
import ModalShell from '../ModalShell.vue';
import SField from '../SField.vue';
import SSelect from '../SSelect.vue';

const emit = defineEmits(['close','save']);
const v       = reactive({ name:'', scope:'read_only', expiry:'' });
const created = ref(null);

function generate() {
  const key = 'zuc_live_' + Array.from({length:32}, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random()*36)]).join('');
  const rec = { id:'k-new', name:v.name, key, scope:v.scope, created:'Just now', last:'—' };
  created.value = rec;
  emit('save', rec);
}
function copyKey() { navigator.clipboard?.writeText(created.value.key); }
</script>

<template>
  <ModalShell title="Generate New API Key" @close="emit('close')">
    <template #footer>
      <template v-if="created">
        <button class="zwh-btn-primary" @click="copyKey">Copy Key</button>
        <button class="zwh-btn-ghost"   @click="emit('close')">Done</button>
      </template>
      <template v-else>
        <button class="zwh-btn-primary" :disabled="!v.name" :style="{ opacity: v.name?1:0.4 }" @click="generate">Generate Key</button>
        <button class="zwh-btn-ghost"   @click="emit('close')">Cancel</button>
      </template>
    </template>

    <!-- Form -->
    <div v-if="!created" style="display:flex;flex-direction:column;gap:12px;">
      <SField label="Key Name" :value="v.name" ph="e.g. ERP Integration" :req="true" @update:value="val => v.name = val" />
      <SSelect label="Scope" :value="v.scope" :opts="[['full_access','Full Access'],['read_only','Read Only'],['webhooks','Webhooks Only'],['orders','Orders Only'],['products','Products Only']]" @update:value="val => v.scope = val" />
      <SField label="Expiry Date (optional)" :value="v.expiry" type="date" @update:value="val => v.expiry = val" />
    </div>

    <!-- Created -->
    <div v-else style="display:flex;flex-direction:column;gap:12px;">
      <div style="padding:10px 14px;background:oklch(0.78 0.15 150 / 0.08);border:1px solid oklch(0.78 0.15 150 / 0.3);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-good);">
        Key generated successfully. Copy it now — you won't be able to see it again.
      </div>
      <div style="padding:12px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:11.5px;color:var(--zg-accent);word-break:break-all;line-height:1.6;">
        {{ created.key }}
      </div>
      <div style="font-size:11px;color:var(--zg-text-dim);">Scope: <strong>{{ created.scope }}</strong></div>
    </div>
  </ModalShell>
</template>
