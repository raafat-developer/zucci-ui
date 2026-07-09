<script setup>
/** LiveShoppingTab — faithful port from zucci-discounts-completions.jsx. */
import { toast } from '@/composables/useToast';
const EVENTS = [
  { id:'e1', name:'Eid Collection Live', host:'Hessa Al Mansoori', date:'Jun 25, 2025 20:00 GST', status:'scheduled', products:12, viewers:0 },
  { id:'e2', name:'Summer Drop Preview', host:'Sara Medhat', date:'Jun 15, 2025 19:00 GST', status:'live', products:8, viewers:1241 },
  { id:'e3', name:'Fragrance Masterclass', host:'Ahmad Khalil', date:'May 30, 2025', status:'completed', products:6, viewers:3842 },
];
</script>
<template>
  <div class="zcd-tab-body">
    <div style="display:flex;justify-content:flex-end;margin-bottom:12px"><button class="zen-btn-primary" @click="toast.success('New live shopping event scheduled')">+ Schedule Event</button></div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <div v-for="e in EVENTS" :key="e.id" :style="{ background:'var(--zg-panel)', border:'1px solid ' + (e.status === 'live' ? 'var(--zg-danger)' : 'var(--zg-line)'), borderRadius:'var(--zg-radius-md)', padding:'12px 16px', display:'grid', gridTemplateColumns:'1fr 120px 120px 80px 80px 60px', gap:10, alignItems:'center' }">
        <div>
          <div style="display:flex;align-items:center;gap:8px"><span style="font-size:13px;font-weight:700;color:var(--zg-text)">{{ e.name }}</span><span v-if="e.status === 'live'" style="font-size:10px;padding:1px 6px;border-radius:2px;background:oklch(0.70 0.18 25 / 0.15);color:var(--zg-danger);font-weight:700">LIVE</span></div>
          <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px">Host: {{ e.host }}</div>
        </div>
        <span style="font-size:11.5px;color:var(--zg-text-mid)">{{ e.date }}</span>
        <span style="font-size:11px;color:var(--zg-text-dim)">{{ e.products }} products</span>
        <span style="font-family:var(--zg-mono);font-size:12px" :style="{ fontWeight: e.viewers > 0 ? 700 : 400, color: e.viewers > 0 ? 'var(--zg-accent)' : 'var(--zg-text-dim)' }">{{ e.viewers > 0 ? e.viewers.toLocaleString() : '—' }}</span>
        <span style="font-size:11px;font-weight:700;text-transform:capitalize" :style="{ color: e.status === 'live' ? 'var(--zg-danger)' : e.status === 'completed' ? 'var(--zg-text-dim)' : 'var(--zg-accent)' }">{{ e.status }}</span>
        <button class="zcat-act" @click="toast.info('Manage event')">Manage</button>
      </div>
    </div>
  </div>
</template>
