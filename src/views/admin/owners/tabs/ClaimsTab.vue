<script setup>
const props = defineProps({ entity: { type: Object, required: true } });
const CLAIMS = [
  { id:'CLM-0041', type:'Insurance Claim', desc:'Damaged shipment — 12 units Swimwear', amount:'AED 3,800', status:'settled', date:'Mar 15, 2025' },
  { id:'CLM-0028', type:'Dispute', desc:'Chargeback dispute — customer order ORD-88012', amount:'AED 420', status:'rejected', date:'Jan 8, 2025' },
  { id:'CLM-0019', type:'Insurance Claim', desc:'Lost shipment via Aramex — 5 units', amount:'AED 1,200', status:'pending', date:'Nov 22, 2024' },
];
const STATUS_CLS = { settled:'zen-bst--active', rejected:'zen-bst--suspended', pending:'zen-bst--pending', open:'zen-bst--pending' };
</script>
<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">Claims &amp; Disputes</div><button class="zen-btn-primary">+ New Claim</button></div>
    <div class="zen-card">
      <div v-for="c in CLAIMS" :key="c.id" style="display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--zg-line);">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);">{{ c.id }}</span>
            <span style="font-size:11px;padding:1px 6px;border-radius:2px;background:oklch(0.82 0.14 215 / 0.1);color:oklch(0.82 0.14 215);">{{ c.type }}</span>
          </div>
          <div style="font-size:12.5px;color:var(--zg-text);">{{ c.desc }}</div>
          <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px;">{{ c.date }}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-family:var(--zg-mono);font-size:13px;font-weight:700;color:var(--zg-text);margin-bottom:4px;">{{ c.amount }}</div>
          <span :class="`zen-bst ${STATUS_CLS[c.status]||'zen-bst--inactive'}`">{{ c.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>