<script setup>
const props = defineProps({ entity: { type: Object, required: true } });
const RISK = { level:'medium', score:62, factors:[{label:'Commercial Registry Expired',sev:'high'},{label:'Return Rate 4.2% — borderline',sev:'medium'},{label:'No ZATCA integration',sev:'low'},{label:'Payment 2× delayed (2024)',sev:'medium'}], actions:[{label:'Request Commercial Registry renewal',done:false},{label:'Schedule quarterly review call',done:true},{label:'Enable 2FA for all users',done:false}] };
const SEV_COLOR = { high:'var(--zg-danger)', medium:'var(--zg-warn)', low:'oklch(0.82 0.14 215)' };
</script>
<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">Risk &amp; Compliance</div></div>
    <!-- Risk score -->
    <div class="zen-card" style="margin-bottom:12px;">
      <div class="zen-card-head"><span class="zen-card-title">Risk Profile</span></div>
      <div style="display:flex;align-items:center;gap:16px;margin-top:8px;">
        <div style="width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;flex-shrink:0;"
          :style="{ background: RISK.level==='high'?'oklch(0.70 0.18 25 / 0.15)':RISK.level==='medium'?'oklch(0.82 0.15 75 / 0.15)':'oklch(0.78 0.15 150 / 0.15)', color: RISK.level==='high'?'var(--zg-danger)':RISK.level==='medium'?'var(--zg-warn)':'var(--zg-good)' }">
          {{ RISK.score }}
        </div>
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--zg-text);text-transform:capitalize;">{{ RISK.level }} Risk</div>
          <div style="font-size:11.5px;color:var(--zg-text-dim);margin-top:2px;">Score {{ RISK.score }}/100 · Last assessed automatically</div>
        </div>
      </div>
    </div>
    <!-- Risk factors -->
    <div class="zen-card" style="margin-bottom:12px;">
      <div class="zen-card-head"><span class="zen-card-title">Risk Factors</span></div>
      <div v-for="f in RISK.factors" :key="f.label" style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--zg-line);">
        <div style="width:8px;height:8px;border-radius:50%;flex-shrink:0;" :style="{ background: SEV_COLOR[f.sev] }" />
        <span style="flex:1;font-size:12.5px;color:var(--zg-text);">{{ f.label }}</span>
        <span style="font-size:10px;padding:1px 6px;border-radius:2px;font-weight:700;" :style="{ color: SEV_COLOR[f.sev], background: SEV_COLOR[f.sev]+'18' }">{{ f.sev }}</span>
      </div>
    </div>
    <!-- Recommended actions -->
    <div class="zen-card">
      <div class="zen-card-head"><span class="zen-card-title">Recommended Actions</span></div>
      <div v-for="a in RISK.actions" :key="a.label" style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--zg-line);">
        <input type="checkbox" :checked="a.done" style="accent-color:var(--zg-accent);" @change="a.done = !a.done" />
        <span style="font-size:12.5px;" :style="{ color:a.done?'var(--zg-text-dim)':'var(--zg-text)', textDecoration:a.done?'line-through':'none' }">{{ a.label }}</span>
      </div>
    </div>
  </div>
</template>