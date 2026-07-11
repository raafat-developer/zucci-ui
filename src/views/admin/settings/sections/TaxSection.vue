<script setup>
import { ref } from 'vue';
const MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const MARKET_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', KW:'🇰🇼', BH:'🇧🇭', QA:'🇶🇦', OM:'🇴🇲' };
const TAX_DATA = {
  AE:{ vat:5,  reg:'100234567800003', threshold:375000, filing:'quarterly', inc:true,  nextDue:'30 Sep 2025', outstanding:0    },
  SA:{ vat:15, reg:'310234567800003', threshold:375000, filing:'monthly',   inc:true,  nextDue:'15 Jul 2025', outstanding:18400 },
  EG:{ vat:14, reg:'234567891',       threshold:0,      filing:'monthly',   inc:true,  nextDue:'10 Jul 2025', outstanding:0    },
  KW:{ vat:0,  reg:'N/A',            threshold:0,      filing:'N/A',       inc:false, nextDue:'N/A',         outstanding:0    },
  BH:{ vat:10, reg:'BH-VAT-0001',    threshold:37500,  filing:'quarterly', inc:true,  nextDue:'30 Sep 2025', outstanding:0    },
  QA:{ vat:0,  reg:'N/A',            threshold:0,      filing:'N/A',       inc:false, nextDue:'N/A',         outstanding:0    },
  OM:{ vat:5,  reg:'OM-VAT-0001',    threshold:38500,  filing:'quarterly', inc:true,  nextDue:'30 Sep 2025', outstanding:0    },
};
const sel = ref('AE');
</script>
<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Tax & VAT</div><div class="zset-content-sub">VAT rates, registration numbers, and filing schedules per market</div></div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
      <button v-for="code in MARKETS" :key="code" @click="sel = code"
        style="height:28px;padding:0 12px;border:1px solid;border-radius:var(--zg-radius-md);background:transparent;cursor:pointer;font-family:inherit;font-size:12px;transition:all .12s;"
        :style="{ borderColor:sel===code?'var(--zg-accent)':'var(--zg-line)', background:sel===code?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:sel===code?'var(--zg-accent)':'var(--zg-text-mid)', fontWeight:sel===code?700:400 }">
        {{ MARKET_FLAGS[code] }} {{ code }}
        <span v-if="TAX_DATA[code].outstanding > 0" style="font-size:9px;color:var(--zg-danger);margin-left:3px;">●</span>
      </button>
    </div>

    <!-- Alert for outstanding VAT -->
    <div v-if="TAX_DATA[sel].outstanding > 0"
      style="padding:10px 14px;background:oklch(0.70 0.18 25 / 0.08);border:1px solid oklch(0.70 0.18 25 / 0.25);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-danger);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;">
      <span>Outstanding VAT: {{ TAX_DATA[sel].currency||'AED' }} {{ TAX_DATA[sel].outstanding.toLocaleString() }} · Due {{ TAX_DATA[sel].nextDue }}</span>
      <button class="zwh-btn-primary" style="height:26px;font-size:11px;">File Now</button>
    </div>

    <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px;">VAT Rate</div><div style="font-family:var(--zg-mono);font-size:18px;font-weight:700;color:var(--zg-text);">{{ TAX_DATA[sel].vat }}%</div></div>
      <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px;">Registration No.</div><div style="font-family:var(--zg-mono);font-size:13px;font-weight:600;color:var(--zg-text);">{{ TAX_DATA[sel].reg }}</div></div>
      <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px;">Filing Threshold</div><div style="font-family:var(--zg-mono);font-size:13px;font-weight:600;color:var(--zg-text);">{{ TAX_DATA[sel].threshold ? TAX_DATA[sel].threshold.toLocaleString() : '—' }}</div></div>
      <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px;">Filing Frequency</div><div style="font-size:13px;font-weight:600;color:var(--zg-text);text-transform:capitalize;">{{ TAX_DATA[sel].filing }}</div></div>
      <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px;">Next Due Date</div><div style="font-size:13px;font-weight:600;color:var(--zg-text);">{{ TAX_DATA[sel].nextDue }}</div></div>
      <div><div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px;">Price Display</div><div style="font-size:12.5px;font-weight:600;" :style="{ color: TAX_DATA[sel].vat > 0 ? 'var(--zg-text)' : 'var(--zg-text-dim)' }">{{ TAX_DATA[sel].inc ? 'VAT Inclusive' : TAX_DATA[sel].vat === 0 ? 'No VAT market' : 'VAT Exclusive' }}</div></div>
      <div v-if="TAX_DATA[sel].vat === 0" style="grid-column:1/-1;padding:10px 12px;background:oklch(0.78 0.18 130 / 0.06);border:1px solid oklch(0.78 0.18 130 / 0.2);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text-mid);">
        This market has no VAT. No collection or remittance required.
      </div>
    </div>
  </div>
</template>
