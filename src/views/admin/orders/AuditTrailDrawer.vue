<script setup>
import ZDrawer from '@/components/ui/ZDrawer.vue';
const props = defineProps({ open: Boolean, order: Object });
defineEmits(['close']);

const AUDIT = [
  { time:'Jun 3, 2025 · 09:14', user:'System',       role:'system',  action:'Order created via storefront', ip:'185.x.x.x' },
  { time:'Jun 3, 2025 · 09:15', user:'System',       role:'system',  action:'Payment captured — Stripe (AED 389)', ip:'internal' },
  { time:'Jun 3, 2025 · 09:16', user:'System',       role:'system',  action:'Auto-assigned to WH-AE-001', ip:'internal' },
  { time:'Jun 3, 2025 · 10:30', user:'Omar Hassan',  role:'ops',     action:'Status changed: Pending → Processing', ip:'212.x.x.x' },
  { time:'Jun 3, 2025 · 11:45', user:'System',       role:'system',  action:'Picking task created — Bin A04', ip:'internal' },
  { time:'Jun 3, 2025 · 13:00', user:'Omar Hassan',  role:'ops',     action:'Items picked & packed — 3 items', ip:'212.x.x.x' },
  { time:'Jun 3, 2025 · 14:12', user:'System',       role:'system',  action:'Dispatched via Aramex — tracking: 1Z999AA10123456784', ip:'internal' },
  { time:'Jun 3, 2025 · 14:13', user:'System',       role:'system',  action:'Customer notified: dispatch SMS + email sent', ip:'internal' },
];
const ROLE_COLOR = { system:'var(--zg-text-dim)', ops:'oklch(0.82 0.14 215)', admin:'var(--zg-danger)', customer:'var(--zg-good)' };
</script>

<template>
  <ZDrawer :open="open" title="Full Audit Trail" :subtitle="order ? `Order ${order.id}` : ''" width="60vw" @close="$emit('close')">
    <template #footer>
      <button style="height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer;" @click="$emit('close')">Close</button>
      <button style="height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-panel);color:var(--zg-text-mid);font-size:12px;cursor:pointer;" @click="">Export CSV</button>
    </template>

    <div style="padding:4px 0;">
      <div v-for="(e, i) in AUDIT" :key="i" style="display:flex;gap:12px;padding-bottom:14px;">
        <!-- Timeline line -->
        <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
          <div style="width:8px;height:8px;border-radius:50%;background:var(--zg-accent);margin-top:3px;" />
          <div v-if="i < AUDIT.length-1" style="width:1px;flex:1;background:var(--zg-line);min-height:16px;margin-top:3px;" />
        </div>
        <!-- Entry -->
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
            <span style="font-size:12.5px;font-weight:600;color:var(--zg-text);">{{ e.action }}</span>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <span style="font-size:10.5px;font-weight:700;" :style="{ color: ROLE_COLOR[e.role] }">{{ e.user }}</span>
            <span style="font-family:var(--zg-mono);font-size:10px;color:var(--zg-text-dim);">{{ e.time }}</span>
            <span style="font-family:var(--zg-mono);font-size:10px;color:var(--zg-text-dim);">{{ e.ip }}</span>
          </div>
        </div>
      </div>
    </div>
  </ZDrawer>
</template>
