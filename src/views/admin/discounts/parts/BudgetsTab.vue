<script setup>
/** BudgetsTab — faithful port of BudgetsTab from zucci-discounts-completions.jsx. */
import { computed } from 'vue';
import { toast } from '@/composables/useToast';
const props = defineProps({ market: { type: String, required: true } });
const cur = computed(() => ({ AE:'AED', SA:'SAR', EG:'EGP', QA:'QAR' }[props.market] || 'AED'));
const BUDGETS = [
  { id:'b1', name:'Ramadan Campaign 2025', allocated:50000, spent:31200, status:'active', type:'Campaign', endDate:'Apr 10, 2025' },
  { id:'b2', name:'Eid Flash Sale', allocated:25000, spent:18400, status:'active', type:'Flash Sale', endDate:'Jun 30, 2025' },
  { id:'b3', name:'New Vendor Welcome', allocated:10000, spent:4200, status:'active', type:'Vendor', endDate:'Dec 31, 2025' },
  { id:'b4', name:'Q2 Co-Marketing', allocated:80000, spent:80000, status:'depleted', type:'Campaign', endDate:'Jun 30, 2025' },
];
</script>
<template>
  <div class="zcd-tab-body">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px">
      <div v-for="[l, v, cls] in [['Total Allocated', cur + ' ' + BUDGETS.reduce((s, b) => s + b.allocated, 0).toLocaleString(), 'is-accent'],['Total Spent', cur + ' ' + BUDGETS.reduce((s, b) => s + b.spent, 0).toLocaleString(), 'is-warn'],['Remaining', cur + ' ' + BUDGETS.reduce((s, b) => s + (b.allocated - b.spent), 0).toLocaleString(), 'is-good']]" :key="l" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px 14px">
        <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px">{{ l }}</div>
        <div style="font-family:var(--zg-mono);font-size:18px;font-weight:800" :style="{ color: cls === 'is-accent' ? 'var(--zg-accent)' : cls === 'is-good' ? 'var(--zg-good)' : 'var(--zg-warn)' }">{{ v }}</div>
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-bottom:10px"><button class="zen-btn-primary" @click="toast.success('New budget created')">+ Create Budget</button></div>
    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
      <div v-for="(b, i) in BUDGETS" :key="b.id" :style="{ padding:'12px 14px', background: i % 2 === 0 ? 'var(--zg-panel)' : 'var(--zg-bg)', borderBottom:'1px solid var(--zg-line-soft)' }">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <div><div style="font-size:13px;font-weight:600;color:var(--zg-text)">{{ b.name }}</div><div style="font-size:11px;color:var(--zg-text-dim);margin-top:1px">{{ b.type }} · Ends {{ b.endDate }}</div></div>
          <span style="font-size:11px;font-weight:700;text-transform:capitalize" :style="{ color: b.status === 'depleted' ? 'var(--zg-danger)' : 'var(--zg-good)' }">{{ b.status }}</span>
        </div>
        <div style="height:6px;background:var(--zg-panel-hi);border-radius:3px;overflow:hidden;margin-bottom:4px"><div :style="{ height:'100%', width: Math.round(b.spent / b.allocated * 100) + '%', background: b.spent >= b.allocated ? 'var(--zg-danger)' : 'var(--zg-accent)', borderRadius:'3px' }" /></div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--zg-text-dim)"><span>Spent: {{ cur }} {{ b.spent.toLocaleString() }}</span><span>Allocated: {{ cur }} {{ b.allocated.toLocaleString() }}</span></div>
      </div>
    </div>
  </div>
</template>
