<script setup>
import { reactive } from 'vue';
import ModalShell from '../ModalShell.vue';
import SField from '../SField.vue';

const CARRIER_PROVIDERS = ['Aramex','DHL','FedEx','SMSA','Bosta','J&T Express','Naqel','Imile','Quiqup','Fetchr','Other'];
const ALL_MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];

const emit = defineEmits(['close','save']);
const v = reactive({ name:'', account_no:'', api_key:'', markets:['AE'], services:['standard'], cod:true, status:'active' });
</script>

<template>
  <ModalShell title="Add Shipping Carrier" @close="emit('close')">
    <template #footer>
      <button class="zwh-btn-primary" :disabled="!v.name" :style="{ opacity: v.name?1:0.4 }"
        @click="emit('save', { ...v, id: v.name.toLowerCase().replace(/\s/g,'_') }); emit('close')">Add Carrier</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>

    <div style="display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;flex-direction:column;gap:4px;">
        <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid);">Carrier Name <span style="color:var(--zg-danger);">*</span></label>
        <select v-model="v.name" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;cursor:pointer;">
          <option value="">Select carrier…</option>
          <option v-for="c in CARRIER_PROVIDERS" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <SField label="Account No." :value="v.account_no" :mono="true" ph="ACC-XXXXXX" @update:value="val => v.account_no = val" />
        <SField label="API Key"     :value="v.api_key"    :mono="true" ph="Optional"   @update:value="val => v.api_key = val" />
      </div>
      <div>
        <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:8px;">Markets</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button v-for="m in ALL_MARKETS" :key="m" @click="v.markets = v.markets.includes(m) ? v.markets.filter(x=>x!==m) : [...v.markets,m]"
            style="height:24px;padding:0 9px;border:1px solid;border-radius:3px;cursor:pointer;font-family:var(--zg-mono);font-size:11px;font-weight:700;transition:all .12s;"
            :style="{ borderColor:v.markets.includes(m)?'var(--zg-accent)':'var(--zg-line)', background:v.markets.includes(m)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:v.markets.includes(m)?'var(--zg-accent)':'var(--zg-text-dim)' }">
            {{ m }}
          </button>
        </div>
      </div>
    </div>
  </ModalShell>
</template>
