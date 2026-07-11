<script setup>
const props = defineProps({ entity: { type: Object, required: true } });
const CERTS = [
  { name:'ISO 9001:2015 Quality Management', issuer:'Bureau Veritas', issue:'Jan 2023', expiry:'Jan 2026', status:'approved' },
  { name:'GOTS Organic Textile Certification', issuer:'Control Union', issue:'Mar 2022', expiry:'Mar 2025', status:'expiring' },
  { name:'OEKO-TEX Standard 100', issuer:'OEKO-TEX', issue:'Nov 2023', expiry:'Nov 2026', status:'approved' },
  { name:'Factory Audit (A Grade)', issuer:'Zucci Internal', issue:'Jun 2024', expiry:'Jun 2025', status:'pending' },
];
const ST = { approved:{color:'var(--zg-good)',bg:'oklch(0.78 0.15 150 / 0.12)',label:'Valid'}, pending:{color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.12)',label:'Pending'}, expiring:{color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.12)',label:'Expiring'}, expired:{color:'var(--zg-danger)',bg:'oklch(0.70 0.18 25 / 0.1)',label:'Expired'}, not_submitted:{color:'var(--zg-text-dim)',bg:'var(--zg-panel-hi)',label:'Not Submitted'} };
const s = k => ST[k]||ST.not_submitted;
</script>
<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">Certifications &amp; Factory Audits</div><button class="zen-btn-primary">+ Add Certification</button></div>
    <div class="zen-card">
      <div v-for="c in CERTS" :key="c.name" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--zg-line);">
        <div style="flex:1;">
          <div style="font-size:12.5px;font-weight:600;color:var(--zg-text);">{{ c.name }}</div>
          <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px;">{{ c.issuer }} · Issued {{ c.issue }} · Expires {{ c.expiry }}</div>
        </div>
        <span class="zen-badge" :style="{ color:s(c.status).color, background:s(c.status).bg }">{{ s(c.status).label }}</span>
        <button class="zen-doc-card-btn">View</button>
      </div>
    </div>
  </div>
</template>