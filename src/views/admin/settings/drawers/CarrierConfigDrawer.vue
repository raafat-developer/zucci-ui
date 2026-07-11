<script setup>
import { reactive } from 'vue';
import DrawerShell from '../DrawerShell.vue';
import SField from '../SField.vue';
import SToggle from '../SToggle.vue';

const ALL_MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const SERVICES = ['standard','express','same_day','next_day','international'];

const props = defineProps({ carrier: Object });
const emit  = defineEmits(['close','save']);

const v = reactive({ ...props.carrier, account_no:'ACC-'+props.carrier?.id, pickup_time:'09:00', cod_fee_pct:1.5 });
const toggleMkt = m => { const ms = v.markets||[]; v.markets = ms.includes(m) ? ms.filter(x=>x!==m) : [...ms,m]; };
const toggleSvc = s => { const ss = v.services||[]; v.services = ss.includes(s) ? ss.filter(x=>x!==s) : [...ss,s]; };
</script>

<template>
  <DrawerShell :title="`Configure — ${carrier?.name}`" @close="emit('close')">
    <template #footer>
      <button class="zwh-btn-primary" @click="emit('save', v); emit('close')">Save</button>
      <button class="zwh-btn-ghost"   @click="emit('close')">Cancel</button>
    </template>

    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <SField label="Account Number"     :value="v.account_no"  :mono="true" @update:value="val => v.account_no = val" />
        <SField label="API Key"            :value="v.api_key||''" :mono="true" ph="API key or token" @update:value="val => v.api_key = val" />
        <SField label="Pickup Cutoff Time" :value="v.pickup_time" type="time" @update:value="val => v.pickup_time = val" />
        <SField label="COD Fee %"          :value="v.cod_fee_pct" type="number" :mono="true" @update:value="val => v.cod_fee_pct = parseFloat(val)" />
      </div>

      <div>
        <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:8px;">Active Markets</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button v-for="m in ALL_MARKETS" :key="m" @click="toggleMkt(m)"
            style="height:26px;padding:0 10px;border:1px solid;border-radius:3px;cursor:pointer;font-family:var(--zg-mono);font-size:11px;font-weight:700;transition:all .12s;"
            :style="{ borderColor:(v.markets||[]).includes(m)?'var(--zg-accent)':'var(--zg-line)', background:(v.markets||[]).includes(m)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:(v.markets||[]).includes(m)?'var(--zg-accent)':'var(--zg-text-dim)' }">
            {{ m }}
          </button>
        </div>
      </div>

      <div>
        <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:8px;">Service Types</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button v-for="s in SERVICES" :key="s" @click="toggleSvc(s)"
            style="height:24px;padding:0 9px;border:1px solid;border-radius:3px;cursor:pointer;font-family:var(--zg-mono);font-size:10.5px;transition:all .12s;"
            :style="{ borderColor:(v.services||[]).includes(s)?'var(--zg-accent)':'var(--zg-line)', background:(v.services||[]).includes(s)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:(v.services||[]).includes(s)?'var(--zg-accent)':'var(--zg-text-dim)' }">
            {{ s }}
          </button>
        </div>
      </div>

      <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px;">
        <SToggle label="Cash on Delivery (COD)" sub="Accept COD orders through this carrier" :value="!!v.cod" @update:value="val => v.cod = val" />
        <SToggle label="Active" sub="Use this carrier for new shipments" :value="v.status==='active'" @update:value="val => v.status = val ? 'active' : 'inactive'" />
      </div>
    </div>
  </DrawerShell>
</template>
