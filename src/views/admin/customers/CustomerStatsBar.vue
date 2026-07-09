<script setup>
const STATS = [
  { lbl:'Total Customers',       val:'3,241',    sub:'across all markets' },
  { lbl:'Verified',              val:'2,880',    sub:'email + phone confirmed', good:true },
  { lbl:'Phone-only',            val:'361',      sub:'no email on file' },
  { lbl:'Multi-market',          val:'448',      sub:'ordered from 2+ markets' },
  { lbl:'Flagged',               val:'12',       sub:'fraud / blocked', warn:true },
  { lbl:'Avg Orders / Customer', val:'4.2',      sub:'lifetime' },
  { lbl:'Avg LTV',               val:'AED 2,840',sub:'across all currencies' },
];
import { ref } from 'vue';
const open = ref(false);
function exportCSV() {
  const b = new Blob(['Customer export'], { type:'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'customers.csv';
  a.click();
}
</script>

<template>
  <div class="byr-statsbar">
    <button class="byr-statsbar-toggle" @click="open = !open">
      <span>Customer Overview</span>
      <svg viewBox="0 0 10 6" width="9" height="6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
        :style="{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform .2s' }">
        <path d="M1 1L5 5L9 1"/>
      </svg>
    </button>
    <div v-if="open" class="byr-statsbar-grid">
      <div v-for="s in STATS" :key="s.lbl" class="byr-statsbar-cell">
        <div class="zen-perf-lbl">{{ s.lbl }}</div>
        <div class="zen-perf-val" :class="{ 'is-warn': s.warn, 'is-good': s.good }">{{ s.val }}</div>
        <div class="zen-adv-kpi-sub">{{ s.sub }}</div>
      </div>
      <div class="byr-statsbar-actions">
        <button class="zen-btn-primary" style="height:28px;font-size:11.5px;" @click="exportCSV">Export</button>
        <button class="zen-btn-ghost" style="height:28px;font-size:11.5px;" @click="">Merge Duplicates</button>
      </div>
    </div>
  </div>
</template>
