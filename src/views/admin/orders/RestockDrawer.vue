<script setup>
import { reactive } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';

const props = defineProps({ open: Boolean });
const emit  = defineEmits(['close']);

const ITEMS = reactive([
  { sku:'NC-ABAYA-BLK-54',  name:'Midnight Abaya',         qty:1, wh:'WH-AE-001', binLoc:'A-04-B2', stock:3,  restockQty:1, destination:'WH-AE-001' },
  { sku:'ZL-HIJAB-BLU-OS',  name:'Silk Hijab Ocean Blue',  qty:2, wh:'WH-AE-001', binLoc:'B-02-A1', stock:12, restockQty:2, destination:'WH-AE-001' },
]);
const WAREHOUSES = ['WH-AE-001','WH-AE-002','WH-SA-001','WH-EG-001'];
</script>

<template>
  <ZDrawer :open="open" title="Restock Items" subtitle="Return items to warehouse inventory" @close="emit('close')">
    <template #footer>
      <button style="height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer;" @click="emit('close')">Cancel</button>
      <button style="height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer;" @click="emit('close')">Confirm Restock</button>
    </template>

    <div style="display:flex;flex-direction:column;gap:12px;padding:4px 0;">
      <div style="padding:8px 12px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-text-dim);">
        Restocking will add items back to warehouse inventory. This triggers an inbound receipt and stock adjustment.
      </div>

      <div v-for="(item, idx) in ITEMS" :key="item.sku" class="rs-card">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--zg-text);">{{ item.name }}</div>
            <div style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);margin-top:1px;">{{ item.sku }}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px;color:var(--zg-text-dim);">Current stock</div>
            <div style="font-family:var(--zg-mono);font-size:13px;font-weight:700;" :style="{ color: item.stock < 5 ? 'var(--zg-warn)' : 'var(--zg-text)' }">{{ item.stock }} units</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div>
            <label class="rs-lbl">Restock Qty</label>
            <input type="number" :min="1" :max="item.qty" v-model.number="item.restockQty"
              style="width:100%;height:32px;padding:0 10px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:15px;font-weight:700;color:var(--zg-accent);outline:none;text-align:center;box-sizing:border-box;" />
          </div>
          <div>
            <label class="rs-lbl">Destination Warehouse</label>
            <select v-model="item.destination" style="width:100%;height:32px;padding:0 8px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer;">
              <option v-for="wh in WAREHOUSES" :key="wh" :value="wh">{{ wh }}</option>
            </select>
          </div>
          <div>
            <label class="rs-lbl">Current Bin Location</label>
            <div style="height:32px;padding:0 10px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:12px;color:var(--zg-text-dim);display:flex;align-items:center;">{{ item.binLoc }}</div>
          </div>
          <div>
            <label class="rs-lbl">Condition</label>
            <select style="width:100%;height:32px;padding:0 8px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer;">
              <option>New / Unopened</option>
              <option>Grade A — Like New</option>
              <option>Grade B — Minor Defect</option>
              <option>Write-off</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </ZDrawer>
</template>

<style scoped>
.rs-card { background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px; }
.rs-lbl { display:block;font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:4px; }
</style>
