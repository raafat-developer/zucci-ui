import { useConfirmStore } from '@/stores/confirm';

export function useConfirm() {
  const confirmStore = useConfirmStore();

  const confirm = (options) => confirmStore.show(options);

  return { confirm };
}
