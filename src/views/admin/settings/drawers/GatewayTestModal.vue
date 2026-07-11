<script setup>
import { ref } from 'vue';
import ModalShell from '../ModalShell.vue';

const props = defineProps({ gateway: Object });
const emit  = defineEmits(['close']);

const running = ref(false);
const result  = ref(null);

function run() {
  running.value = true; result.value = null;
  setTimeout(() => {
    running.value = false;
    result.value = { success:true, latency:'142ms', code:'00', message:'Authorised', tx_id:'TEST-'+Math.random().toString(36).slice(2,10).toUpperCase(), amount:'AED 1.00', card:'4*** **** **** 4242' };
  }, 1800);
}
</script>

<template>
  <ModalShell :title="`Test Gateway — ${gateway?.name}`" sub="Sends a AED 1.00 test authorisation" @close="emit('close')">
    <template #footer>
      <button class="zwh-btn-primary" :disabled="running" @click="run">{{ running ? 'Running…' : 'Run Test' }}</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Close</button>
    </template>

    <div style="display:flex;flex-direction:column;gap:12px;">
      <div style="padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">
        <div v-for="[l, val] in [['Provider', gateway?.name], ['Environment', gateway?.env], ['Markets', (gateway?.markets||[]).join(', ')]]" :key="l">
          <div style="font-size:10px;color:var(--zg-text-dim);font-weight:600;margin-bottom:2px;text-transform:uppercase;letter-spacing:.05em;">{{ l }}</div>
          <div style="color:var(--zg-text);font-weight:600;">{{ val }}</div>
        </div>
      </div>

      <div v-if="running" style="padding:20px;text-align:center;color:var(--zg-text-dim);font-size:12px;">
        <div style="width:20px;height:20px;border:2px solid var(--zg-accent);border-top-color:transparent;border-radius:50%;margin:0 auto 8px;animation:spin 0.8s linear infinite;" />
        Sending test transaction…
      </div>

      <div v-if="result" :style="{ padding:'14px', background: result.success?'oklch(0.78 0.15 150 / 0.08)':'oklch(0.70 0.18 25 / 0.08)', border:'1px solid', borderColor: result.success?'oklch(0.78 0.15 150 / 0.3)':'oklch(0.70 0.18 25 / 0.3)', borderRadius:'var(--zg-radius-md)' }">
        <div :style="{ fontSize:'13px', fontWeight:700, color: result.success?'var(--zg-good)':'var(--zg-danger)', marginBottom:'10px' }">
          {{ result.success ? '✓ Test Passed' : '✗ Test Failed' }}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11.5px;">
          <div v-for="[k, v] in Object.entries(result).filter(([k]) => k !== 'success')" :key="k">
            <div style="font-size:10px;color:var(--zg-text-dim);font-weight:600;margin-bottom:1px;text-transform:uppercase;letter-spacing:.05em;">{{ k.replace('_', ' ') }}</div>
            <div style="font-family:var(--zg-mono);color:var(--zg-text);font-weight:600;">{{ v }}</div>
          </div>
        </div>
      </div>
    </div>
  </ModalShell>
</template>

<style>
@keyframes spin { to { transform: rotate(360deg); } }
</style>
