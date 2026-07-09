<script setup>
import { ref, computed } from 'vue';
import { DELIVERY_LOG, CH_LABELS, STATUS_COLORS } from '@/data/commsData';

const search = ref('');
const filtered = computed(() => {
  const sq = search.value.toLowerCase();
  return DELIVERY_LOG.filter(d => !sq || d.template.toLowerCase().includes(sq) || d.recipient.toLowerCase().includes(sq));
});
const stColor = (s) => STATUS_COLORS[s] || 'var(--zg-text-dim)';
</script>

<template>
  <div class="zcat-content">
    <div style="position:relative;margin-bottom:12px;">
      <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round"
        style="position:absolute;left:8px;top:50%;transform:translateY(-50%);pointer-events:none;">
        <circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/>
      </svg>
      <input v-model="search" placeholder="Search by template or recipient…"
        style="width:280px;height:28px;padding-left:26px;padding-right:8px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;" />
    </div>

    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
      <div style="display:grid;grid-template-columns:1fr 160px 70px 70px 70px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;gap:10px;">
        <span>Template</span><span>Recipient</span><span>Channel</span><span>Status</span><span>Time</span>
      </div>
      <div v-for="(d, i) in filtered" :key="d.id"
        style="display:grid;grid-template-columns:1fr 160px 70px 70px 70px;padding:8px 14px;border-bottom:1px solid var(--zg-line);align-items:center;font-size:12px;gap:10px;"
        :style="{ background: i%2===0 ? 'var(--zg-panel)' : 'var(--zg-bg)' }">
        <span style="font-weight:600;color:var(--zg-text);">{{ d.template }}</span>
        <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-dim);">{{ d.recipient }}</span>
        <span style="font-size:11px;color:var(--zg-text-mid);">{{ CH_LABELS[d.channel] || d.channel }}</span>
        <span style="font-size:11px;font-weight:600;" :style="{ color: stColor(d.status) }">{{ d.status }}</span>
        <span style="font-size:11px;color:var(--zg-text-dim);">{{ d.time }}</span>
      </div>
    </div>
  </div>
</template>
