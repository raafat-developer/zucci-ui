import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useConfirmStore = defineStore('confirm', () => {
  const open = ref(false);
  const title = ref('Confirm');
  const message = ref('Are you sure you want to proceed?');
  const confirmText = ref('Confirm');
  const cancelText = ref('Cancel');
  const variant = ref('primary'); // primary (default), danger
  let resolvePromise = null;

  const show = (options = {}) => {
    title.value = options.title || 'Confirm';
    message.value = options.message || 'Are you sure you want to proceed?';
    confirmText.value = options.confirmText || 'Confirm';
    cancelText.value = options.cancelText || 'Cancel';
    variant.value = options.variant || 'primary';
    open.value = true;
    return new Promise((resolve) => {
      resolvePromise = resolve;
    });
  };

  const confirm = () => {
    open.value = false;
    if (resolvePromise) resolvePromise(true);
  };

  const cancel = () => {
    open.value = false;
    if (resolvePromise) resolvePromise(false);
  };

  return { open, title, message, confirmText, cancelText, variant, show, confirm, cancel };
});
