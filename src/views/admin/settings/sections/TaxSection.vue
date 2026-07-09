<script setup>
import { ref } from 'vue';

const MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const sel = ref('AE');

const taxes = {
  AE:{ vat:5,  reg:'100234567800003', threshold:375000, filing:'quarterly', inc:true  },
  SA:{ vat:15, reg:'310234567800003', threshold:375000, filing:'monthly',   inc:true  },
  EG:{ vat:14, reg:'234567891',       threshold:0,      filing:'monthly',   inc:true  },
  KW:{ vat:0,  reg:'N/A',            threshold:0,      filing:'N/A',       inc:false },
  BH:{ vat:10, reg:'BH-VAT-0001',    threshold:37500,  filing:'quarterly', inc:true  },
  QA:{ vat:0,  reg:'N/A',            threshold:0,      filing:'N/A',       inc:false },
  OM:{ vat:5,  reg:'OM-VAT-0001',    threshold:38500,  filing:'quarterly', inc:true  },
};
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Tax & VAT</div><div class="zset-content-sub">VAT rates, registration numbers, and filing schedules per market</div></div>
      <button class="btn-primary" @click="">Save</button>
    </div>
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px;">
      <button v-for="m in MARKETS" :key="m" class="mkt-chip" :class="{ 'is-active': sel === m }" @click="sel = m">{{ m }}</button>
    </div>
    <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div><div class="sf-lbl">VAT Rate (%)</div><div class="sf-val">{{ taxes[sel]?.vat }}%</div></div>
      <div><div class="sf-lbl">Registration No.</div><div class="sf-val mono">{{ taxes[sel]?.reg }}</div></div>
      <div><div class="sf-lbl">Registration Threshold</div><div class="sf-val mono">{{ taxes[sel]?.threshold ? taxes[sel].threshold.toLocaleString() : '—' }}</div></div>
      <div><div class="sf-lbl">Filing Frequency</div><div class="sf-val">{{ taxes[sel]?.filing }}</div></div>
      <div style="grid-column:1/-1;">
        <div class="sf-lbl">Price Display</div>
        <div style="font-size:12.5px;font-weight:600;color:var(--zg-text);margin-top:4px;">{{ taxes[sel]?.inc ? 'VAT Inclusive — prices shown with VAT' : 'VAT Exclusive — VAT added at checkout' }}</div>
      </div>
      <div v-if="taxes[sel]?.vat === 0" style="grid-column:1/-1;padding:10px 12px;background:oklch(0.78 0.18 130 / 0.06);border:1px solid oklch(0.78 0.18 130 / 0.2);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text-mid);">
        This market has no VAT. No collection or remittance required.
      </div>
    </div>
  </div>
</template>

<style scoped>
.sf-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:3px; }
.sf-val { font-size:13px;font-weight:600;color:var(--zg-text); }
.sf-val.mono { font-family:var(--zg-mono); }
.mkt-chip { height:26px;padding:0 10px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.mkt-chip.is-active { border-color:var(--zg-accent);color:var(--zg-accent);background:oklch(0.78 0.18 130 / 0.1); }
</style>
