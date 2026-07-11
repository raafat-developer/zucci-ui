<script setup>
import { reactive } from 'vue';
import DrawerShell from '../DrawerShell.vue';
import SField from '../SField.vue';
import SSelect from '../SSelect.vue';
import SToggle from '../SToggle.vue';

const ALL_MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const props = defineProps({ gateway: Object });
const emit  = defineEmits(['close', 'save']);

const v = reactive({ ...props.gateway, test_key: props.gateway?.key?.replace('live','test')||'', webhook_secret:'whsk_••••••••••••1234' });
const toggleMarket = m => {
  const ms = v.markets || [];
  v.markets = ms.includes(m) ? ms.filter(x => x !== m) : [...ms, m];
};
</script>

<template>
  <DrawerShell :title="`Configure — ${gateway?.name}`" sub="API credentials and per-market settings" @close="emit('close')">
    <template #footer>
      <button class="zwh-btn-primary" @click="emit('save', v); emit('close')">Save Configuration</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>

    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <SField label="Live API Key"           :value="v.key"            :mono="true" ph="pk_live_…"   @update:value="val => v.key = val" />
        <SField label="Test API Key"           :value="v.test_key"       :mono="true" ph="pk_test_…"   @update:value="val => v.test_key = val" />
        <SField label="Webhook URL"            :value="v.webhook"        :mono="true" ph="https://…"   @update:value="val => v.webhook = val" />
        <SField label="Webhook Signing Secret" :value="v.webhook_secret" :mono="true" ph="whsk_…"      @update:value="val => v.webhook_secret = val" />
      </div>

      <SSelect label="Environment" :value="v.env" :opts="[['production','Production'],['sandbox','Sandbox']]" @update:value="val => v.env = val" />

      <div>
        <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:8px;">Active Markets</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button v-for="m in ALL_MARKETS" :key="m" @click="toggleMarket(m)"
            style="height:26px;padding:0 10px;border:1px solid;border-radius:3px;cursor:pointer;font-family:var(--zg-mono);font-size:11px;font-weight:700;transition:all .12s;"
            :style="{ borderColor:(v.markets||[]).includes(m)?'var(--zg-accent)':'var(--zg-line)', background:(v.markets||[]).includes(m)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:(v.markets||[]).includes(m)?'var(--zg-accent)':'var(--zg-text-dim)' }">
            {{ m }}
          </button>
        </div>
      </div>

      <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px;">
        <SToggle label="3D Secure (3DS)" sub="Require 3DS authentication for all transactions" :value="v.threeds||false" @update:value="val => v.threeds = val" />
        <SToggle label="Auto-retry failed payments" sub="Retry failed authorisations once after 30 minutes" :value="v.retry !== false" @update:value="val => v.retry = val" />
        <SToggle label="Save cards" sub="Allow customers to save card for future purchases" :value="v.save_cards !== false" @update:value="val => v.save_cards = val" />
      </div>
    </div>
  </DrawerShell>
</template>
