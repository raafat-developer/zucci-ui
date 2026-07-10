<script setup>
import { useConfirmStore } from '@/stores/confirm';
import ZModal from './ZModal.vue';
import ZButton from './ZButton.vue';

const confirmStore = useConfirmStore();

const handleClose = () => confirmStore.cancel();
</script>

<template>
  <ZModal :open="confirmStore.open" :title="confirmStore.title" width="420" @close="handleClose">
    <p style="margin: 0; font-size: 14px; color: var(--zg-text); line-height: 1.6;">{{ confirmStore.message }}</p>
    <template #footer>
      <ZButton variant="ghost" @click="handleClose">{{ confirmStore.cancelText }}</ZButton>
      <ZButton :variant="confirmStore.variant" @click="confirmStore.confirm">{{ confirmStore.confirmText }}</ZButton>
    </template>
  </ZModal>
</template>
