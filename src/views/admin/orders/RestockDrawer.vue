<script setup>
/**
 * RestockDrawer — return items to warehouse inventory. Faithful port of
 * RestockDrawer from zucci-orders-extra.jsx.
 */
import { ref, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['close']);

const WAREHOUSES = ['WH-AE-001', 'WH-AE-002', 'WH-SA-001', 'WH-EG-001'];
const SEED = [
  { sku:'NC-ABAYA-BLK-54', name:'Midnight Abaya', qty:1, wh:'WH-AE-001', binLoc:'A-04-B2', stock:3 },
  { sku:'ZL-HIJAB-BLU-OS', name:'Silk Hijab Ocean Blue', qty:2, wh:'WH-AE-001', binLoc:'B-02-A1', stock:12 },
];
const items = ref(SEED.map((i) => ({ ...i, restockQty: i.qty, destination: 'WH-AE-001', inspected: false })));
watch(() => props.open, (v) => { if (v) items.value = SEED.map((i) => ({ ...i, restockQty: i.qty, destination: 'WH-AE-001', inspected: false })); });

const confirmRestock = () => {
  const total = items.value.reduce((s, i) => s + i.restockQty, 0);
  toast.success(`${total} items restocked`);
  emit('close');
};
</script>

<template>
  <ZDrawer :open="open" title="Restock Items" subtitle="Return items to warehouse inventory" :width="520" @close="emit('close')">
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="padding:8px 12px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-text-dim)">
        Restocking will add items back to warehouse inventory. This triggers an inbound receipt and stock adjustment.
      </div>
      <div v-for="(item, idx) in items" :key="item.sku" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px;display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:flex-start;justify-content:space-between">
          <div><div style="font-size:13px;font-weight:600;color:var(--zg-text)">{{ item.name }}</div><div style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);margin-top:1px">{{ item.sku }}</div></div>
          <div style="text-align:right"><div style="font-size:11px;color:var(--zg-text-dim)">Current stock</div><div :style="{ fontFamily:'var(--zg-mono)', fontSize:'13px', fontWeight:700, color: item.stock < 5 ? 'var(--zg-warn)' : 'var(--zg-text)' }">{{ item.stock }} units</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="display:flex;flex-direction:column;gap:4px">
            <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Restock Qty</label>
            <input type="number" min="1" :max="item.qty" v-model.number="items[idx].restockQty" style="height:32px;padding:0 10px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:15px;font-weight:700;color:var(--zg-accent);outline:none;text-align:center" />
          </div>
          <div style="display:flex;flex-direction:column;gap:4px">
            <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Destination Warehouse</label>
            <select v-model="items[idx].destination" style="height:32px;padding:0 10px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;cursor:pointer">
              <option v-for="wh in WAREHOUSES" :key="wh" :value="wh">{{ wh }}</option>
            </select>
          </div>
        </div>
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--zg-text-mid)">
          <input type="checkbox" v-model="items[idx].inspected" style="accent-color:var(--zg-accent)" /> Item inspected before restocking
        </label>
      </div>
    </div>

    <template #footer>
      <button class="zwh-btn-primary" @click="confirmRestock">Confirm Restock</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>
  </ZDrawer>
</template>
