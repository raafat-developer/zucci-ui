<script setup>
import ZDrawer from '@/components/ui/ZDrawer.vue';
defineProps({ open: Boolean, order: Object });
defineEmits(['close']);
</script>

<template>
  <ZDrawer :open="open" title="Cancel Order" subtitle="This action cannot be undone" size="sm" @close="$emit('close')">
    <template #footer>
      <button class="co-btn-ghost" @click="$emit('close')">Back</button>
      <button class="co-btn-danger" @click="$emit('close')">Confirm Cancellation</button>
    </template>
    <div style="display:flex;flex-direction:column;gap:14px;padding:4px 0;">
      <div style="padding:12px 14px;background:oklch(0.70 0.18 25 / 0.08);border:1px solid oklch(0.70 0.18 25 / 0.3);border-radius:var(--zg-radius-md);font-size:12.5px;color:var(--zg-danger);">
        Cancelling this order will notify the customer and trigger a refund if payment was captured.
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <label class="co-lbl">Cancellation Reason</label>
        <select class="co-input">
          <option>Customer requested cancellation</option>
          <option>Out of stock</option>
          <option>Fraud / suspicious order</option>
          <option>Duplicate order</option>
          <option>Payment issue</option>
          <option>Other</option>
        </select>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <label class="co-lbl">Notes (optional)</label>
        <textarea class="co-input" rows="3" style="height:auto;resize:vertical;" placeholder="Add internal notes…" />
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <label class="co-lbl">Refund</label>
        <div style="display:flex;gap:8px;">
          <button class="co-chip is-active">Full Refund</button>
          <button class="co-chip">Partial Refund</button>
          <button class="co-chip">No Refund</button>
        </div>
      </div>
    </div>
  </ZDrawer>
</template>

<style scoped>
.co-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.co-input { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
.co-chip { height:28px;padding:0 10px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11.5px;color:var(--zg-text-dim); }
.co-chip.is-active { border-color:var(--zg-accent);color:var(--zg-accent);background:oklch(0.78 0.18 130 / 0.1); }
.co-btn-ghost { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
.co-btn-danger { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-danger);color:#fff;font-weight:700;font-size:12px;cursor:pointer; }
</style>
