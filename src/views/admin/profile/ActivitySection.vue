<script setup>
import { ref, computed } from 'vue';

const search = ref('');
const LOG = [
  { id:'e1',  action:'Logged in',                    module:'Auth',              time:'5m ago',   type:'auth'   },
  { id:'e2',  action:'Approved listing L-0441',      module:'Marketplace',       time:'2h ago',   type:'action' },
  { id:'e3',  action:'Resolved ticket TKT-4818',     module:'Tickets',           time:'3h ago',   type:'action' },
  { id:'e4',  action:'Updated company settings',     module:'Settings',          time:'5h ago',   type:'action' },
  { id:'e5',  action:'Processed payout PAY-4820',    module:'Finance',           time:'1d ago',   type:'action' },
  { id:'e6',  action:'Logged in from new device',    module:'Auth',              time:'2d ago',   type:'auth'   },
  { id:'e7',  action:'Invited n.ibrahim@zucci.com',  module:'Settings › Access', time:'5d ago',   type:'action' },
  { id:'e8',  action:'Exported warehouse CSV',       module:'Warehouses',        time:'6d ago',   type:'export' },
];
const filtered = computed(() => {
  const q = search.value.toLowerCase();
  return LOG.filter(e => !q || e.action.toLowerCase().includes(q) || e.module.toLowerCase().includes(q));
});
const TYPE_COLOR = { auth:'var(--zg-accent)', action:'var(--zg-text-dim)', export:'oklch(0.82 0.14 215)' };
</script>

<template>
  <div style="max-width:640px;">
    <div class="up-section-title">Activity Log</div>
    <div class="up-section-sub">Your recent actions across the platform</div>
    <div style="position:relative;margin-bottom:12px;">
      <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:7px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
      <input v-model="search" placeholder="Search activity…" style="width:100%;height:28px;padding-left:24px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box;" />
    </div>
    <div class="up-card">
      <div v-for="e in filtered" :key="e.id" style="display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--zg-line);">
        <div style="width:8px;height:8px;border-radius:50%;margin-top:4px;flex-shrink:0;" :style="{ background: TYPE_COLOR[e.type] }" />
        <div style="flex:1;">
          <div style="font-size:12.5px;color:var(--zg-text);">{{ e.action }}</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:1px;">{{ e.module }} · {{ e.time }}</div>
        </div>
      </div>
      <div v-if="!filtered.length" style="padding:20px;text-align:center;font-size:12px;color:var(--zg-text-dim);">No activity found</div>
    </div>
  </div>
</template>
