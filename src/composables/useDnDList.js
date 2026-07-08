// src/composables/useDnDList.js — drag-reorder list helper (port of useVDnD).
import { ref } from 'vue';

export function useDnDList(initial) {
  const items = ref(initial);
  const dragIdx = ref(null);
  const overIdx = ref(null);

  const start = (i) => { dragIdx.value = i; };
  const over = (i) => { overIdx.value = i; };
  const drop = (i) => {
    if (dragIdx.value === null || dragIdx.value === i) { dragIdx.value = null; overIdx.value = null; return; }
    const next = [...items.value];
    const [m] = next.splice(dragIdx.value, 1);
    next.splice(i, 0, m);
    items.value = next;
    dragIdx.value = null; overIdx.value = null;
  };
  const end = () => { dragIdx.value = null; overIdx.value = null; };

  return { items, dragIdx, overIdx, start, over, drop, end };
}
