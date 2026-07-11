<script setup>
import { ref, reactive } from 'vue';
import ModalShell from '../ModalShell.vue';
import SField from '../SField.vue';
import SSelect from '../SSelect.vue';
import SToggle from '../SToggle.vue';

const GATEWAY_PROVIDERS = ['Checkout.com','Stripe','Adyen','Tabby','Tamara','Fawry','valU','STC Pay','KNET','BENEFIT','OmanNet','Apple Pay','Google Pay'];
const ALL_MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];

const emit = defineEmits(['close','save']);
const step = ref(0);
const v    = reactive({ name:'', env:'sandbox', key:'', webhook:'', markets:['AE'], threeds:true });
const toggleMkt = m => { v.markets = v.markets.includes(m) ? v.markets.filter(x => x !== m) : [...v.markets, m]; };
</script>

<template>
  <ModalShell title="Add Payment Gateway" :sub="['1. Select Provider','2. Credentials','3. Markets & Settings'][step]" @close="emit('close')">
    <template #footer>
      <button v-if="step > 0" class="zwh-btn-ghost" @click="step--">Back</button>
      <button v-if="step < 2" class="zwh-btn-primary" :disabled="step===0&&!v.name || step===1&&!v.key" :style="{ opacity: (step===0&&!v.name||step===1&&!v.key)?0.4:1 }" @click="step++">Next →</button>
      <button v-if="step === 2" class="zwh-btn-primary" @click="emit('save', v); emit('close')">Add Gateway</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>

    <!-- Step 0: Provider picker -->
    <div v-if="step === 0" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <button v-for="p in GATEWAY_PROVIDERS" :key="p" @click="v.name = p"
        style="padding:10px 14px;border:1px solid;border-radius:var(--zg-radius-md);background:var(--zg-panel);cursor:pointer;font-family:inherit;font-size:12.5px;font-weight:600;text-align:left;transition:all .12s;"
        :style="{ borderColor: v.name===p?'var(--zg-accent)':'var(--zg-line)', background: v.name===p?'oklch(0.78 0.18 130 / 0.1)':'var(--zg-panel)', color: v.name===p?'var(--zg-accent)':'var(--zg-text)' }">
        {{ p }}
      </button>
    </div>

    <!-- Step 1: Credentials -->
    <div v-else-if="step === 1" style="display:flex;flex-direction:column;gap:12px;">
      <SSelect label="Environment" :value="v.env" :opts="[['sandbox','Sandbox (test)'],['production','Production (live)']]" @update:value="val => v.env = val" />
      <SField label="API Key" :value="v.key" :mono="true" ph="pk_live_…" :req="true" @update:value="val => v.key = val" />
      <SField label="Webhook URL" :value="v.webhook" :mono="true" ph="https://api.zucci.com/webhooks/…" @update:value="val => v.webhook = val" />
    </div>

    <!-- Step 2: Markets & Settings -->
    <div v-else style="display:flex;flex-direction:column;gap:14px;">
      <div>
        <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:8px;">Active Markets</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button v-for="m in ALL_MARKETS" :key="m" @click="toggleMkt(m)"
            style="height:26px;padding:0 10px;border:1px solid;border-radius:3px;cursor:pointer;font-family:var(--zg-mono);font-size:11px;font-weight:700;transition:all .12s;"
            :style="{ borderColor: v.markets.includes(m)?'var(--zg-accent)':'var(--zg-line)', background: v.markets.includes(m)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color: v.markets.includes(m)?'var(--zg-accent)':'var(--zg-text-dim)' }">
            {{ m }}
          </button>
        </div>
      </div>
      <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px;">
        <SToggle label="3D Secure" sub="Require 3DS for all transactions" :value="v.threeds" @update:value="val => v.threeds = val" />
      </div>
    </div>
  </ModalShell>
</template>
