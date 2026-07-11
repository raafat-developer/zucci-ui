<script setup>
import { ref, computed } from 'vue';
import { ZCW_INVENTORY_ALL } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });
const adjItem = ref(null);
const search  = ref('');

const inv = computed(() => {
  const all = (ZCW_INVENTORY_ALL || []).filter(i => i.warehouse_id === props.wh.id);
  const q = search.value.toLowerCase();
  return q ? all.filter(i => i.sku?.toLowerCase().includes(q) || i.name?.toLowerCase().includes(q) || i.vendor?.toLowerCase().includes(q)) : all;
});
const totalUnits   = computed(() => inv.value.reduce((s,i) => s+i.qty, 0));
const totalDailyCost = computed(() => inv.value.reduce((s,i) => s+(i.daily_cost||0), 0));
const agingColor   = age => age >= 90 ? 'var(--zg-danger)' : age >= 60 ? 'var(--zg-warn)' : 'var(--zg-text-dim)';

const adjVals = ref({ qty: 0, reason:'', condition:'New', notes:'' });

function openAdj(item) { adjItem.value = item; adjVals.value = { qty: item.qty, reason:'', condition:'New', notes:'' }; }
function saveAdj() { adjItem.value = null; }
</script>

<template>
  <div class="zwh-tab-body">
    <div v-if="!inv.length" class="zwh-empty">
      <svg class="zwh-empty-icon" viewBox="0 0 48 48" width="36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="8" y="4" width="32" height="40" rx="3"/><line x1="16" y1="16" x2="32" y2="16"/><line x1="16" y1="24" x2="32" y2="24"/><line x1="16" y1="32" x2="24" y2="32"/></svg>
      <div class="zwh-empty-title">No inventory data for this warehouse</div>
      <div class="zwh-empty-sub">Stock will appear here once items are received</div>
    </div>

    <template v-else>
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;">
        <div style="position:relative;flex:1;max-width:260px;">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:7px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
          <input v-model="search" placeholder="Search SKU, product, vendor…" class="zwh-search-inp" style="padding-left:24px;" />
        </div>
        <span style="font-size:11.5px;color:var(--zg-text-dim);">{{ inv.length }} lines · {{ totalUnits.toLocaleString() }} units</span>
        <span v-if="totalDailyCost > 0" style="font-size:12px;color:var(--zg-warn);font-family:var(--zg-mono);margin-left:auto;">{{ wh.currency }} {{ totalDailyCost.toFixed(2) }}/day</span>
        <button class="zwh-btn-ghost" style="height:28px;font-size:11px;" @click="">Export CSV</button>
      </div>

      <div class="zwh-list-table">
        <div class="zwh-list-head">
          <span class="zwh-col" style="flex:1.2;">SKU / Product</span>
          <span class="zwh-col w120">Vendor</span>
          <span class="zwh-col w110">Ownership</span>
          <span class="zwh-col w60 right">Qty</span>
          <span class="zwh-col w80">Bin</span>
          <span class="zwh-col w60 right">Age (d)</span>
          <span class="zwh-col w100">Lot / Expiry</span>
          <span class="zwh-col w100">Status</span>
          <span class="zwh-col w60 right">Daily</span>
        </div>
        <div v-for="(item, i) in inv" :key="i" class="zwh-list-row" style="cursor:pointer;" @click="openAdj(item)">
          <div class="zwh-col" style="flex:1.2;display:flex;flex-direction:column;gap:2px;overflow:hidden;">
            <span style="font-weight:600;font-size:12px;color:var(--zg-text);font-family:var(--zg-mono);">{{ item.sku }}</span>
            <span style="font-size:11px;color:var(--zg-text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ item.name }}</span>
          </div>
          <span class="zwh-col w120 zwh-dim" style="font-size:11.5px;">{{ item.vendor }}</span>
          <span class="zwh-col w110">
            <span style="display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:3px;font-size:9.5px;font-weight:600;"
              :style="{ color:item.ownership==='owned'?'oklch(0.82 0.14 215)':item.ownership==='consignment'?'var(--zg-warn)':'var(--zg-text-dim)', background:item.ownership==='owned'?'oklch(0.82 0.14 215 / 0.1)':item.ownership==='consignment'?'oklch(0.82 0.15 75 / 0.1)':'var(--zg-panel-hi)' }">
              {{ item.ownership === 'owned' ? 'Zucci-Owned' : item.ownership === 'consignment' ? 'Consignment' : item.ownership }}
            </span>
          </span>
          <span class="zwh-col w60 right zwh-mono" style="font-weight:600;" :style="{ color: item.qty <= item.reorder_point && item.reorder_point > 0 ? 'var(--zg-warn)' : 'var(--zg-text)' }">{{ item.qty }}</span>
          <span class="zwh-col w80 zwh-mono" style="font-size:10.5px;">{{ item.bin }}</span>
          <span class="zwh-col w60 right zwh-mono" :style="{ color: agingColor(item.age) }">{{ item.age }}</span>
          <div class="zwh-col w100" style="display:flex;flex-direction:column;gap:1px;">
            <span style="font-size:10px;color:var(--zg-text-dim);font-family:var(--zg-mono);">{{ item.lot || '—' }}</span>
            <span v-if="item.expiry" style="font-size:10px;color:oklch(0.82 0.14 215);font-family:var(--zg-mono);">{{ item.expiry }}</span>
          </div>
          <span class="zwh-col w100">
            <span style="display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:3px;font-size:9.5px;font-weight:600;background:var(--zg-panel-hi);color:var(--zg-text-dim);">{{ item.aging || 'Active' }}</span>
          </span>
          <span class="zwh-col w60 right zwh-mono" style="font-size:11px;" :style="{ color: item.daily_cost > 0 ? 'var(--zg-warn)' : 'var(--zg-text-xdim)' }">{{ item.daily_cost > 0 ? item.daily_cost.toFixed(2) : '—' }}</span>
        </div>
      </div>
    </template>

    <!-- Stock Adjustment Drawer -->
    <Teleport to="body">
      <div v-if="adjItem" style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.6);" @click="adjItem = null">
        <div style="position:fixed;top:0;right:0;bottom:0;width:460px;background:var(--zg-bg-elev);border-left:1px solid var(--zg-line);display:flex;flex-direction:column;" @click.stop>
          <div style="padding:16px 20px;border-bottom:1px solid var(--zg-line);display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <div style="font-size:14px;font-weight:700;color:var(--zg-text);">Stock Adjustment</div>
              <div style="font-size:11.5px;font-family:var(--zg-mono);color:var(--zg-text-dim);margin-top:2px;">{{ adjItem.sku }} · {{ adjItem.name }}</div>
            </div>
            <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:16px;" @click="adjItem = null">×</button>
          </div>
          <div style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div><div class="zwh-field-label">Current Qty</div><input class="zwh-field-input" type="number" :value="adjItem.qty" readonly style="opacity:0.6;" /></div>
              <div><div class="zwh-field-label">New Qty</div><input class="zwh-field-input" type="number" v-model.number="adjVals.qty" /></div>
              <div><div class="zwh-field-label">Bin Location</div><input class="zwh-field-input" :value="adjItem.bin" readonly style="opacity:0.6;" /></div>
              <div>
                <div class="zwh-field-label">Condition</div>
                <select v-model="adjVals.condition" class="zwh-field-input" style="cursor:pointer;">
                  <option>New</option><option>Grade A</option><option>Grade B</option><option>Damaged</option>
                </select>
              </div>
            </div>
            <div>
              <div class="zwh-field-label">Reason for Adjustment</div>
              <select v-model="adjVals.reason" class="zwh-field-input" style="cursor:pointer;">
                <option value="">Select reason…</option>
                <option>Cycle count discrepancy</option><option>Damaged units</option><option>Found stock</option><option>Returns processing</option><option>Manual correction</option>
              </select>
            </div>
            <div>
              <div class="zwh-field-label">Notes (internal)</div>
              <textarea v-model="adjVals.notes" class="zwh-field-textarea" rows="3" placeholder="Optional notes…" />
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="zwh-btn-primary" @click="saveAdj">Apply Adjustment</button>
            <button class="zwh-btn-ghost"   @click="adjItem = null">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
