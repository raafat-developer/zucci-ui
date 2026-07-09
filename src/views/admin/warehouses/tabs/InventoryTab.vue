<script setup>
import { ref, computed } from 'vue';
import { ZCW_INVENTORY_ALL } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });

const search  = ref('');
const adjItem = ref(null);

const inv = computed(() => {
  const all = ZCW_INVENTORY_ALL || [];
  const items = all.filter(i => i.warehouse_id === props.wh.id);
  const q = search.value.toLowerCase();
  if (!q) return items;
  return items.filter(i => i.sku.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || i.vendor.toLowerCase().includes(q));
});

const AGING_COLOR = { 'D0-D30':'var(--zg-good)', 'D30-D60':'oklch(0.82 0.14 215)', 'D60-D90':'var(--zg-warn)', 'D90-D120':'var(--zg-danger)', 'D120+':'var(--zg-danger)' };
</script>

<template>
  <div class="zwh-tab-body">
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;">
      <div style="position:relative;flex:1;max-width:260px;">
        <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round"
          style="position:absolute;left:7px;top:50%;transform:translateY(-50%);pointer-events:none;">
          <circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/>
        </svg>
        <input v-model="search" placeholder="Search SKU, product, vendor…" class="zwh-field-input" style="padding-left:24px;height:28px;" />
      </div>
      <span style="font-size:11.5px;color:var(--zg-text-dim);">{{ inv.length }} items</span>
      <button class="zwh-btn-ghost" style="margin-left:auto;" @click="">Export CSV</button>
    </div>

    <div v-if="!inv.length" class="zwh-empty">
      <div class="zwh-empty-title">No inventory records</div>
      <div class="zwh-empty-sub">No items found for this warehouse.</div>
    </div>

    <div v-else class="zwh-inv-table">
      <div class="zwh-inv-head">
        <span>SKU</span><span>Product</span><span>Vendor</span><span>Qty</span><span>Bin</span><span>Aging</span><span>Daily Cost</span><span>Actions</span>
      </div>
      <div v-for="item in inv" :key="item.id" class="zwh-inv-row">
        <span class="zwh-table-mono" style="font-size:10.5px;">{{ item.sku }}</span>
        <div>
          <div style="font-size:12px;font-weight:500;color:var(--zg-text);">{{ item.name }}</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);">{{ item.market }}</div>
        </div>
        <span style="font-size:11.5px;color:var(--zg-text-mid);">{{ item.vendor }}</span>
        <span class="zwh-table-mono">{{ item.qty }}</span>
        <span class="zwh-table-mono" style="font-size:10.5px;color:var(--zg-text-dim);">{{ item.bin }}</span>
        <span v-if="item.aging" class="zwh-badge" :style="{ color: AGING_COLOR[item.aging] || 'var(--zg-text-dim)', background: (AGING_COLOR[item.aging] || 'var(--zg-text-dim)') + '18' }">
          {{ item.aging }}
        </span>
        <span v-else style="color:var(--zg-text-dim);font-size:11px;">—</span>
        <span class="zwh-table-mono" style="color:var(--zg-warn);">{{ item.daily_cost ? `AED ${item.daily_cost}` : '—' }}</span>
        <button class="zwh-btn-ghost" style="height:24px;font-size:11px;" @click="adjItem = item">Adjust</button>
      </div>
    </div>

    <!-- Stock Adjustment modal -->
    <Teleport to="body">
      <div v-if="adjItem" class="zwh-modal-backdrop" @click="adjItem = null">
        <div class="zwh-modal" @click.stop>
          <div class="zwh-modal-head">
            <span>Stock Adjustment — {{ adjItem.sku }}</span>
            <button @click="adjItem = null">×</button>
          </div>
          <div class="zwh-modal-body">
            <div class="zwh-field">
              <label class="zwh-field-label">Current Qty</label>
              <input class="zwh-field-input" type="number" :value="adjItem.qty" readonly />
            </div>
            <div class="zwh-field">
              <label class="zwh-field-label">New Qty</label>
              <input class="zwh-field-input" type="number" :value="adjItem.qty" />
            </div>
            <div class="zwh-field">
              <label class="zwh-field-label">Reason</label>
              <select class="zwh-field-input">
                <option>Cycle count discrepancy</option>
                <option>Damaged units</option>
                <option>Found stock</option>
                <option>Manual correction</option>
              </select>
            </div>
            <div class="zwh-field">
              <label class="zwh-field-label">Notes</label>
              <textarea class="zwh-field-textarea" rows="2" />
            </div>
          </div>
          <div style="padding:12px 16px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="zwh-btn-primary" @click="adjItem = null">Apply Adjustment</button>
            <button class="zwh-btn-ghost" @click="adjItem = null">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
