<script setup>
import { ref, reactive, computed } from 'vue';
import SField from '../SField.vue';

const MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const MARKET_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', KW:'🇰🇼', BH:'🇧🇭', QA:'🇶🇦', OM:'🇴🇲' };
const PAY_METHODS = ['card','apple_pay','google_pay','cod','stc_pay','knet','benefit','fawry','valu','omannet','tabby','tamara'];
const STATUS_COLOR = { active:'var(--zg-good)', pending:'var(--zg-warn)', planned:'var(--zg-text-dim)' };

const sel = ref('AE');
const data = reactive({
  AE:{name:'UAE',         currency:'AED',rate:3.672, vat:5,  langs:['en','ar'],payMethods:['card','apple_pay','google_pay','cod'],status:'active',  launchDate:'2024-01-15'},
  SA:{name:'Saudi Arabia',currency:'SAR',rate:3.75,  vat:15, langs:['ar','en'],payMethods:['card','apple_pay','stc_pay','cod'],   status:'active',  launchDate:'2024-03-01'},
  EG:{name:'Egypt',       currency:'EGP',rate:49.2,  vat:14, langs:['ar','en'],payMethods:['card','fawry','valu','cod'],          status:'active',  launchDate:'2024-02-15'},
  KW:{name:'Kuwait',      currency:'KWD',rate:0.308, vat:0,  langs:['ar','en'],payMethods:['card','knet','cod'],                  status:'pending', launchDate:'2025-Q2'},
  BH:{name:'Bahrain',     currency:'BHD',rate:0.376, vat:10, langs:['ar','en'],payMethods:['card','benefit','cod'],               status:'pending', launchDate:'2025-Q3'},
  QA:{name:'Qatar',       currency:'QAR',rate:3.641, vat:0,  langs:['ar','en'],payMethods:['card','cod'],                        status:'active',  launchDate:'2024-06-01'},
  OM:{name:'Oman',        currency:'OMR',rate:0.385, vat:5,  langs:['ar','en'],payMethods:['card','omannet','cod'],               status:'planned', launchDate:'2025-Q4'},
});

const m = computed(() => data[sel.value]);

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
      <button class="btn-primary" @click="">Save Changes</button>
    </div>
    <!-- Market tabs -->
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
      <button v-for="code in MARKETS" :key="code"
        style="height:32px;padding:0 12px;border-radius:var(--zg-radius-md);cursor:pointer;font-size:12px;transition:all .12s;"
        :style="{ border: sel===code?'1px solid var(--zg-accent)':'1px solid var(--zg-line)', background: sel===code?'oklch(0.78 0.18 130 / 0.1)':'transparent', color: sel===code?'var(--zg-accent)':'var(--zg-text-mid)', fontWeight: sel===code?700:400 }"
        @click="sel = code">
        {{ MARKET_FLAGS[code] }} {{ code }}
        <span style="font-size:10px;margin-left:3px;" :style="{ color: STATUS_COLOR[data[code].status] }">●</span>
      </button>
    </div>
    <!-- Market config -->
    <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <SField label="Country Name" :value="m.name" disabled />
      <SField label="Currency Code" :value="m.currency" disabled mono />
      <SField label="Exchange Rate (vs USD)" :value="m.rate" type="number" mono @update:value="v => data[sel].rate = parseFloat(v)" />
      <div>
        <label class="sf-lbl">Status</label>
        <select v-model="data[sel].status" class="sf-sel">
          <option value="active">Active</option><option value="pending">Pending</option>
          <option value="planned">Planned</option><option value="suspended">Suspended</option>
        </select>
      </div>
      <SField label="Launch Date" :value="m.launchDate" :disabled="m.status==='active'" @update:value="v => data[sel].launchDate = v" />
      <!-- Payment methods -->
      <div style="grid-column:1/-1;">
        <div class="sf-lbl" style="margin-bottom:6px;">Payment Methods</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button v-for="pm in PAY_METHODS" :key="pm"
            style="height:26px;padding:0 10px;border-radius:3px;cursor:pointer;font-size:11px;font-family:var(--zg-mono);font-weight:600;transition:all .12s;"
            :style="{ border: m.payMethods?.includes(pm)?'1px solid var(--zg-accent)':'1px solid var(--zg-line)', background: m.payMethods?.includes(pm)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color: m.payMethods?.includes(pm)?'var(--zg-accent)':'var(--zg-text-dim)' }"
            @click="togglePay(pm)">{{ pm }}</button>
        </div>
      </div>
      <!-- Languages -->
      <div style="grid-column:1/-1;">
        <div class="sf-lbl" style="margin-bottom:6px;">Languages</div>
        <div style="display:flex;gap:6px;">
          <button v-for="lang in ['ar','en','fr','tr']" :key="lang"
            style="height:26px;padding:0 12px;border-radius:3px;cursor:pointer;font-size:11px;font-weight:700;transition:all .12s;"
            :style="{ border: m.langs?.includes(lang)?'1px solid var(--zg-accent)':'1px solid var(--zg-line)', background: m.langs?.includes(lang)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color: m.langs?.includes(lang)?'var(--zg-accent)':'var(--zg-text-dim)' }"
            @click="toggleLang(lang)">{{ lang.toUpperCase() }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sf-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.sf-sel { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer;width:100%; }
</style>
