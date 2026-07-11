<script setup>
import { ref } from 'vue';
import ModalShell from '../ModalShell.vue';

const props = defineProps({ user: Object });
const emit  = defineEmits(['close', 'confirm']);

const reason = ref('');
const isDeactivating = props.user?.status === 'active';
</script>

<template>
  <ModalShell :title="isDeactivating ? 'Deactivate User' : 'Activate User'" @close="emit('close')">
    <template #footer>
      <button :style="{ background: isDeactivating?'var(--zg-danger)':'var(--zg-accent)', color: isDeactivating?'#fff':'oklch(0.18 0.04 130)', height:'32px', padding:'0 14px', border:'none', borderRadius:'var(--zg-radius-md)', fontWeight:700, fontSize:'12px', cursor: isDeactivating&&!reason ? 'not-allowed':'pointer', opacity: isDeactivating&&!reason ? 0.4:1 }"
        :disabled="isDeactivating && !reason"
        @click="emit('confirm', user, reason); emit('close')">
        {{ isDeactivating ? 'Deactivate' : 'Activate' }} User
      </button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>

    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="padding:12px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);">
        <div style="font-weight:600;font-size:13px;color:var(--zg-text);">{{ user?.name }}</div>
        <div style="font-size:11.5px;font-family:var(--zg-mono);color:var(--zg-text-dim);margin-top:2px;">{{ user?.email }} · {{ user?.role }}</div>
      </div>

      <template v-if="isDeactivating">
        <div style="padding:10px 14px;background:oklch(0.70 0.18 25 / 0.08);border:1px solid oklch(0.70 0.18 25 / 0.25);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-danger);line-height:1.5;">
          This user will immediately lose access to the platform. All active sessions will be terminated.
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid);">Reason for deactivation <span style="color:var(--zg-danger);">*</span></label>
          <select v-model="reason" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;cursor:pointer;">
            <option value="">Select reason…</option>
            <option v-for="r in ['Employee left','Role change — new account created','Security concern','Account no longer needed','Other']" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
      </template>
    </div>
  </ModalShell>
</template>
