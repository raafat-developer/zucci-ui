<script setup>
const props = defineProps({ entity: { type: Object, required: true } });
const LOG = [
  { type:'kyc',     actor:'System',      msg:'KYB status changed to Approved',           time:'Jun 1, 2025 · 09:14' },
  { type:'payout',  actor:'Ahmed Khalil',msg:'Payout PYT-2114 processed — AED 14,200',   time:'Jun 1, 2025 · 10:30' },
  { type:'brand',   actor:'Nada Ibrahim',msg:'Brand "Le Maillot" synced — 84 products',  time:'May 28, 2025 · 14:22' },
  { type:'doc',     actor:'Sara Medhat', msg:'Trade License uploaded and verified',       time:'May 20, 2025 · 11:05' },
  { type:'system',  actor:'System',      msg:'Contract auto-renewed for 3 years',         time:'May 15, 2025 · 00:00' },
  { type:'payout',  actor:'Ahmed Khalil',msg:'Payout PYT-2089 processed — AED 11,800',   time:'May 2, 2025 · 10:30' },
];
const COLORS = { kyc:'var(--zg-accent)', payout:'var(--zg-good)', brand:'oklch(0.82 0.14 215)', doc:'var(--zg-warn)', system:'var(--zg-text-dim)', default:'var(--zg-text-dim)' };
</script>
<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">Activity Log</div><button class="zen-doc-card-btn">Export CSV</button></div>
    <div class="zen-card">
      <div v-for="(e, i) in LOG" :key="i" style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--zg-line);">
        <div style="width:8px;height:8px;border-radius:50%;margin-top:4px;flex-shrink:0;" :style="{ background: COLORS[e.type]||COLORS.default }" />
        <div style="flex:1;min-width:0;">
          <div style="font-size:12.5px;color:var(--zg-text);">{{ e.msg }}</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:2px;">{{ e.actor }} · {{ e.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
