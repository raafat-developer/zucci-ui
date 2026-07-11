<script setup>
import { ref } from 'vue';
const MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const MARKET_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', KW:'🇰🇼', BH:'🇧🇭', QA:'🇶🇦', OM:'🇴🇲' };
const RETURN_RULES = {
  AE:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:90,action:'40% off'},{day:120,action:'vendor notified'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  SA:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:90,action:'40% off'},{day:120,action:'vendor notified'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  EG:{ window:14, cross_border:true,  aging:[{day:30,action:'15% off'},{day:60,action:'30% off'},{day:90,action:'50% off'},{day:120,action:'vendor notified'},{day:180,action:'write-off'}], cond_new:true, cond_used:true },
  KW:{ window:7,  cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  BH:{ window:7,  cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  QA:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  OM:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
};
const sel = ref('AE');
const r = () => RETURN_RULES[sel.value] || RETURN_RULES.AE;
</script>
<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Return Policies</div><div class="zset-content-sub">Market-specific return windows, conditions, and aging escalation rules</div></div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
      <button v-for="code in MARKETS" :key="code" @click="sel = code"
        style="height:28px;padding:0 12px;border:1px solid;border-radius:var(--zg-radius-md);background:transparent;cursor:pointer;font-family:inherit;font-size:12px;transition:all .12s;"
        :style="{ borderColor:sel===code?'var(--zg-accent)':'var(--zg-line)', background:sel===code?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:sel===code?'var(--zg-accent)':'var(--zg-text-mid)', fontWeight:sel===code?700:400 }">
        {{ MARKET_FLAGS[code] }} {{ code }}
      </button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px;">
        <div style="font-size:11px;font-weight:700;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px;">Policy</div>
        <div style="display:grid;gap:8px;">
          <div v-for="[lbl,val,color] in [
            ['Return window', r().window + ' days', 'var(--zg-text)'],
            ['Cross-border allowed', r().cross_border ? 'Yes' : 'No', r().cross_border ? 'var(--zg-good)' : 'var(--zg-danger)'],
            ['New condition returns', r().cond_new ? 'Accepted' : 'Rejected', r().cond_new ? 'var(--zg-good)' : 'var(--zg-danger)'],
            ['Used condition returns', r().cond_used ? 'Accepted' : 'Rejected', r().cond_used ? 'var(--zg-good)' : 'var(--zg-danger)'],
          ]" :key="lbl" style="display:flex;justify-content:space-between;font-size:12px;">
            <span style="color:var(--zg-text-mid);">{{ lbl }}</span>
            <span style="font-weight:600;" :style="{ color }">{{ val }}</span>
          </div>
        </div>
      </div>
      <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px;">
        <div style="font-size:11px;font-weight:700;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px;">Aging Escalation</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <div v-for="(a, i) in r().aging" :key="i" style="display:flex;align-items:center;gap:8px;">
            <div style="width:48px;height:20px;border-radius:3px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
              :style="{ background: a.day>=180?'oklch(0.70 0.18 25 / 0.15)':a.day>=120?'oklch(0.82 0.15 75 / 0.15)':'var(--zg-panel-hi)', border:'1px solid var(--zg-line)' }">
              <span style="font-family:var(--zg-mono);font-size:10.5px;font-weight:700;"
                :style="{ color: a.day>=180?'var(--zg-danger)':a.day>=120?'var(--zg-warn)':'var(--zg-text-mid)' }">D{{ a.day }}</span>
            </div>
            <span style="font-size:11.5px;color:var(--zg-text-mid);">{{ a.action }}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:11px;color:var(--zg-text-dim);">
      Return policies are defined per market and enforced automatically. To edit rules, update RULES.md or contact the operations team.
    </div>
  </div>
</template>
