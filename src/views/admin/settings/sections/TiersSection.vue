<script setup>
import { ref, reactive } from 'vue';
const activeGroup = ref('vendor');
const VENDOR_TIERS = reactive([
  { id:'platinum', label:'Platinum', color:'oklch(0.85 0.06 280)', gmvMin:500000, commission:8,  benefits:['Dedicated AM','Priority listing','0% storage fee 60d','Monthly payout'] },
  { id:'gold',     label:'Gold',     color:'oklch(0.82 0.15 75)',  gmvMin:100000, commission:10, benefits:['Bi-weekly payout','Featured placement','Reduced return fee'] },
  { id:'silver',   label:'Silver',   color:'oklch(0.70 0.02 240)', gmvMin:25000,  commission:12, benefits:['Standard support','Weekly reporting'] },
  { id:'bronze',   label:'Bronze',   color:'oklch(0.72 0.12 40)',  gmvMin:0,      commission:15, benefits:['Basic dashboard access'] },
]);
const CUSTOMER_TIERS = reactive([
  { id:'vip',      label:'VIP',      color:'oklch(0.85 0.06 280)', pointsMin:20000, discount:15, benefits:['Personal stylist','Free express shipping','Exclusive drops'] },
  { id:'gold',     label:'Gold',     color:'oklch(0.82 0.15 75)',  pointsMin:5000,  discount:10, benefits:['2× points per AED','Early access sales','Unlimited free returns'] },
  { id:'silver',   label:'Silver',   color:'oklch(0.70 0.02 240)', pointsMin:1000,  discount:5,  benefits:['1.5× points','Birthday reward','2 free returns/year'] },
  { id:'bronze',   label:'Bronze',   color:'oklch(0.72 0.12 40)',  pointsMin:0,     discount:0,  benefits:['1× points','Birthday reward'] },
]);
</script>
<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Tiers Management</div><div class="zset-content-sub">Configure vendor and customer tier thresholds, commissions, and benefits</div></div>
      <button class="zwh-btn-primary">+ Add Tier</button>
    </div>
    <div style="display:flex;gap:4px;margin-bottom:16px;">
      <button v-for="[v,l] in [['vendor','Vendor Tiers'],['customer','Customer Tiers']]" :key="v"
        style="height:30px;padding:0 14px;border:1px solid;border-radius:var(--zg-radius-md);background:transparent;cursor:pointer;font-family:inherit;font-size:12px;transition:all .1s;"
        :style="{ borderColor:activeGroup===v?'var(--zg-accent)':'var(--zg-line)', background:activeGroup===v?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:activeGroup===v?'var(--zg-accent)':'var(--zg-text-dim)', fontWeight:activeGroup===v?600:400 }"
        @click="activeGroup = v">{{ l }}</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;">
      <div v-for="tier in activeGroup==='vendor' ? VENDOR_TIERS : CUSTOMER_TIERS" :key="tier.id"
        style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:16px;display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:12px;height:12px;border-radius:50%;flex-shrink:0;" :style="{ background: tier.color }" />
          <span style="font-size:15px;font-weight:800;color:var(--zg-text);">{{ tier.label }}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div v-if="activeGroup === 'vendor'">
            <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px;">Min GMV / month</div>
            <div style="font-family:var(--zg-mono);font-size:14px;font-weight:700;color:var(--zg-text);">AED {{ tier.gmvMin.toLocaleString() }}</div>
          </div>
          <div v-else>
            <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px;">Min Points</div>
            <div style="font-family:var(--zg-mono);font-size:14px;font-weight:700;color:var(--zg-text);">{{ tier.pointsMin.toLocaleString() }}</div>
          </div>
          <div>
            <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px;">{{ activeGroup==='vendor' ? 'Commission' : 'Discount' }}</div>
            <div style="font-family:var(--zg-mono);font-size:14px;font-weight:700;" :style="{ color: tier.color }">{{ activeGroup==='vendor' ? tier.commission+'%' : (tier.discount > 0 ? tier.discount+'%' : '—') }}</div>
          </div>
        </div>
        <div>
          <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:6px;">Benefits</div>
          <div v-for="b in tier.benefits" :key="b" style="font-size:11.5px;color:var(--zg-text-mid);padding:2px 0;border-bottom:1px solid var(--zg-line);">· {{ b }}</div>
        </div>
        <button class="zwh-btn-ghost" style="height:28px;font-size:11.5px;">Edit Tier</button>
      </div>
    </div>
  </div>
</template>
