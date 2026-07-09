<script setup>
import { ref, computed } from 'vue';

const STORAGE_COSTS = ref([
  { id:'SC-0441', item:'Midnight Abaya (XRMA-0038)',    wh:'WH-AE-001', vendor:'Nabila Collective',  market:'SA→AE', daysInWH:124, dailyCost:3.0,  totalCost:372,   status:'accruing', aging:'D120' },
  { id:'SC-0440', item:'Cloud Runner Sneakers (XRMA)',  wh:'WH-AE-001', vendor:'Desert Kicks',       market:'EG→AE', daysInWH:72,  dailyCost:2.5,  totalCost:180,   status:'accruing', aging:'D60'  },
  { id:'SC-0439', item:'Arabian Night Oud (XRMA-0032)', wh:'WH-AE-001', vendor:'Bakhoor House',      market:'QA→AE', daysInWH:31,  dailyCost:1.5,  totalCost:46.5,  status:'accruing', aging:'D30'  },
  { id:'SC-0438', item:'Golden Thread Kaftan (XRMA)',   wh:'WH-AE-001', vendor:'Amara Threads',      market:'SA→AE', daysInWH:185, dailyCost:4.0,  totalCost:740,   status:'write_off',aging:'D180' },
  { id:'SC-0420', item:'Silk Hijab Ocean Blue',         wh:'WH-AE-001', vendor:'Zucci Label',        market:'AE',    daysInWH:14,  dailyCost:0.5,  totalCost:7,     status:'settled',  aging:null   },
  { id:'SC-0415', item:'Desert Chelsea Boot (12 pcs)',  wh:'WH-SA-001', vendor:'Desert Kicks',       market:'SA',    daysInWH:28,  dailyCost:6.0,  totalCost:168,   status:'settled',  aging:null   },
]);
const storageSF = ref('all');
const filteredStorage = computed(() =>
  storageSF.value === 'all' ? STORAGE_COSTS.value : STORAGE_COSTS.value.filter(i => i.status === storageSF.value)
);
const scAccruing = computed(() => STORAGE_COSTS.value.filter(i=>i.status==='accruing').reduce((s,i)=>s+i.totalCost,0));
const scWriteOff = computed(() => STORAGE_COSTS.value.filter(i=>i.status==='write_off').reduce((s,i)=>s+i.totalCost,0));
const SC_STATUS_COLOR = { accruing:'var(--zg-warn)', settled:'var(--zg-good)', write_off:'var(--zg-danger)' };
</script>

<template>
    <div class="zen-grid-2" style="grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px;">
      <div class="zen-card" style="padding:10px 12px;"><div class="zf-kpi-lbl">Accruing Storage</div><div class="zf-kpi-val is-warn">AED {{ scAccruing.toFixed(0) }}</div></div>
      <div class="zen-card" style="padding:10px 12px;"><div class="zf-kpi-lbl">Write-off Pending</div><div class="zf-kpi-val is-neg">AED {{ scWriteOff.toFixed(0) }}</div></div>
      <div class="zen-card" style="padding:10px 12px;"><div class="zf-kpi-lbl">Total Line Items</div><div class="zf-kpi-val">{{ STORAGE_COSTS.length }}</div></div>
      <div class="zen-card" style="padding:10px 12px;"><div class="zf-kpi-lbl">Vendors Affected</div><div class="zf-kpi-val">{{ new Set(STORAGE_COSTS.map(i=>i.vendor)).size }}</div></div>
    </div>
    <div class="zf-filter-row" style="margin-bottom:10px;">
      <button v-for="[v,l] in [['all','All'],['accruing','Accruing'],['settled','Settled'],['write_off','Write-off']]" :key="v"
        class="zen-filter-chip" :class="{ 'is-on': storageSF === v }" @click="storageSF = v">{{ l }}</button>
    </div>
    <div class="zf-ledger-table">
      <div class="zf-ledger-head" style="grid-template-columns:80px 1fr 100px 80px 70px 80px 80px 80px">
        <span>ID</span><span>Item</span><span>Vendor</span><span>Market</span><span>Days</span><span>Daily</span><span>Total</span><span>Status</span>
      </div>
      <div v-for="(item, i) in filteredStorage" :key="item.id" class="zf-ledger-row" style="grid-template-columns:80px 1fr 100px 80px 70px 80px 80px 80px">
        <span class="zf-txn-id">{{ item.id }}</span>
        <div><div style="font-weight:500;color:var(--zg-text);font-size:12px;">{{ item.item }}</div><div style="font-size:10.5px;color:var(--zg-text-dim);">{{ item.wh }}</div></div>
        <span class="zen-pd-ref">{{ item.vendor }}</span>
        <span class="zf-txn-id" style="color:var(--zg-accent);">{{ item.market }}</span>
        <span class="zf-amount" :class="item.daysInWH>=120?'is-neg':item.daysInWH>=60?'is-warn':''">{{ item.daysInWH }}d</span>
        <span class="zen-pd-ref">AED {{ item.dailyCost }}</span>
        <span class="zf-amount" :style="{ color: SC_STATUS_COLOR[item.status] }">{{ item.totalCost.toFixed(0) }}</span>
        <span style="font-size:11px;font-weight:600;text-transform:capitalize;" :style="{ color: SC_STATUS_COLOR[item.status] }">{{ item.status }}</span>
      </div>
    </div>
</template>
