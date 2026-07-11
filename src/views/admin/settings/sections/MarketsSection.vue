<script setup>
import { ref, reactive } from 'vue';
import SField from '../SField.vue';
import SSelect from '../SSelect.vue';

const MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const MARKET_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', KW:'🇰🇼', BH:'🇧🇭', QA:'🇶🇦', OM:'🇴🇲' };
const PAY_METHODS = ['card','apple_pay','google_pay','cod','stc_pay','knet','benefit','fawry','valu','omannet','tabby','tamara'];
const STATUS_COLORS = { active:'var(--zg-good)', pending:'var(--zg-warn)', planned:'var(--zg-text-dim)', suspended:'var(--zg-danger)' };

const sel = ref('AE');
const data = reactive({
  AE:{ name:'UAE',         currency:'AED', rate:3.672,  vat:5,  langs:['en','ar'], payMethods:['card','apple_pay','google_pay','cod'], status:'active',  launchDate:'2024-01-15' },
  SA:{ name:'Saudi Arabia',currency:'SAR', rate:3.75,   vat:15, langs:['ar','en'], payMethods:['card','apple_pay','stc_pay','cod'],    status:'active',  launchDate:'2024-03-01' },
  EG:{ name:'Egypt',       currency:'EGP', rate:49.2,   vat:14, langs:['ar','en'], payMethods:['card','fawry','valu','cod'],           status:'active',  launchDate:'2024-02-15' },
  KW:{ name:'Kuwait',      currency:'KWD', rate:0.308,  vat:0,  langs:['ar','en'], payMethods:['card','knet','cod'],                   status:'pending', launchDate:'2025-Q2' },
  BH:{ name:'Bahrain',     currency:'BHD', rate:0.376,  vat:10, langs:['ar','en'], payMethods:['card','benefit','cod'],                status:'pending', launchDate:'2025-Q3' },
  QA:{ name:'Qatar',       currency:'QAR', rate:3.641,  vat:0,  langs:['ar','en'], payMethods:['card','cod'],                         status:'active',  launchDate:'2024-06-01' },
  OM:{ name:'Oman',        currency:'OMR', rate:0.385,  vat:5,  langs:['ar','en'], payMethods:['card','omannet','cod'],                status:'planned', launchDate:'2025-Q4' },
});
const m = ref(data['AE']);
function selectMkt(code) { sel.value = code; m.value = data[code]; }
function togglePay(pm) {
  const d = data[sel.value];
  d.payMethods = d.payMethods.includes(pm) ? d.payMethods.filter(x => x !== pm) : [...d.payMethods, pm];
}
function toggleLang(lang) {
  const d = data[sel.value];
  d.langs = d.langs.includes(lang) ? d.langs.filter(x => x !== lang) : [...d.langs, lang];
}
</script>
<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Markets</div><div class="zset-content-sub">Per-market currency, tax, payment methods, and language configuration</div></div>
      <button class="zwh-btn-primary">Save Changes</button>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
      <button v-for="code in MARKETS" :key="code" @click="selectMkt(code)"
        style="height:32px;padding:0 12px;border:1px solid;border-radius:var(--zg-radius-md);background:transparent;cursor:pointer;font-family:inherit;font-size:12px;transition:all .12s;"
        :style="{ borderColor:sel===code?'var(--zg-accent)':'var(--zg-line)', background:sel===code?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:sel===code?'var(--zg-accent)':'var(--zg-text-mid)', fontWeight:sel===code?700:400 }">
        {{ MARKET_FLAGS[code] }} {{ code }} <span style="font-size:10px;margin-left:3px;" :style="{ color: STATUS_COLORS[data[code].status] }">●</span>
      </button>
    </div>
    <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <SField label="Country Name"          :value="data[sel].name"     :disabled="true" />
      <SField label="Currency Code"         :value="data[sel].currency" :disabled="true" :mono="true" />
      <SField label="Exchange Rate (vs USD)" :value="String(data[sel].rate)" type="number" :mono="true" @update:value="val => data[sel].rate = parseFloat(val)" />
      <SSelect label="Status" :value="data[sel].status" :opts="[['active','Active'],['pending','Pending'],['planned','Planned'],['suspended','Suspended']]" @update:value="val => data[sel].status = val" />
      <SField label="Launch Date" :value="data[sel].launchDate" :disabled="data[sel].status === 'active'" @update:value="val => data[sel].launchDate = val" />
      <div style="grid-column:1/-1;">
        <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:6px;">Payment Methods</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button v-for="pm in PAY_METHODS" :key="pm" @click="togglePay(pm)"
            style="height:26px;padding:0 10px;border-radius:3px;border:1px solid;cursor:pointer;font-size:11px;font-family:var(--zg-mono);font-weight:600;transition:all .12s;"
            :style="{ borderColor:data[sel].payMethods?.includes(pm)?'var(--zg-accent)':'var(--zg-line)', background:data[sel].payMethods?.includes(pm)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:data[sel].payMethods?.includes(pm)?'var(--zg-accent)':'var(--zg-text-dim)' }">{{ pm }}</button>
        </div>
      </div>
      <div style="grid-column:1/-1;">
        <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:6px;">Languages</div>
        <div style="display:flex;gap:6px;">
          <button v-for="lang in ['ar','en','fr','tr']" :key="lang" @click="toggleLang(lang)"
            style="height:26px;padding:0 12px;border-radius:3px;border:1px solid;cursor:pointer;font-size:11px;font-family:var(--zg-mono);font-weight:700;transition:all .12s;"
            :style="{ borderColor:data[sel].langs?.includes(lang)?'var(--zg-accent)':'var(--zg-line)', background:data[sel].langs?.includes(lang)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:data[sel].langs?.includes(lang)?'var(--zg-accent)':'var(--zg-text-dim)' }">{{ lang.toUpperCase() }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
