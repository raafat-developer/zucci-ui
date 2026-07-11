<script setup>
import ModalShell from '../ModalShell.vue';

const props = defineProps({ apiKey: Object });
const emit  = defineEmits(['close','revoke']);
</script>

<template>
  <ModalShell title="Revoke API Key" @close="emit('close')">
    <template #footer>
      <button style="height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-danger);color:#fff;font-weight:700;font-size:12px;cursor:pointer;"
        @click="emit('revoke', apiKey?.id); emit('close')">Revoke Key</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>

    <div style="display:flex;flex-direction:column;gap:12px;">
      <div style="padding:10px 14px;background:oklch(0.70 0.18 25 / 0.08);border:1px solid oklch(0.70 0.18 25 / 0.25);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-danger);line-height:1.5;">
        This cannot be undone. Any integrations using this key will stop working immediately.
      </div>
      <div style="padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);">
        <div style="font-weight:700;font-size:13px;color:var(--zg-text);margin-bottom:4px;">{{ apiKey?.name }}</div>
        <div style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-dim);">{{ apiKey?.key }}</div>
        <div style="font-size:11px;color:var(--zg-text-dim);margin-top:4px;">Scope: {{ apiKey?.scope }} · Last used: {{ apiKey?.last }}</div>
      </div>
    </div>
  </ModalShell>
</template>
