<script setup>
const props = defineProps({ entity: { type: Object, required: true } });
const TC = [
  { version:'v3.1', date:'Jun 15, 2023', status:'accepted', signedBy:'Ahmed Mohamed', markets:['AE','SA','EG'] },
  { version:'v2.8', date:'Jan 10, 2022', status:'superseded', signedBy:'Ahmed Mohamed', markets:['AE'] },
];
</script>
<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">Terms &amp; Conditions</div><button class="zen-btn-primary">Issue New T&C</button></div>
    <div class="zen-card">
      <div v-for="tc in TC" :key="tc.version" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--zg-line);">
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:600;color:var(--zg-text);">{{ tc.version }}</div>
          <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px;">Signed by {{ tc.signedBy }} · {{ tc.date }}</div>
          <div style="display:flex;gap:4px;margin-top:4px;">
            <span v-for="m in tc.markets" :key="m" style="height:16px;padding:0 5px;border-radius:2px;background:oklch(0.78 0.18 130 / 0.1);color:var(--zg-accent);font-size:9.5px;font-family:var(--zg-mono);font-weight:700;display:inline-flex;align-items:center;">{{ m }}</span>
          </div>
        </div>
        <span class="zen-bst" :class="tc.status==='accepted'?'zen-bst--active':'zen-bst--inactive'">{{ tc.status }}</span>
        <button class="zen-doc-card-btn">View</button>
      </div>
    </div>
  </div>
</template>