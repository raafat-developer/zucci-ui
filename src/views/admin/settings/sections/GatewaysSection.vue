<script setup>
import { ref, reactive } from 'vue';
import GatewayConfigDrawer from '../drawers/GatewayConfigDrawer.vue';
import GatewayTestModal    from '../drawers/GatewayTestModal.vue';
import AddGatewayModal     from '../drawers/AddGatewayModal.vue';

const gateways = reactive([
  { id:'stripe',  name:'Stripe',        env:'production', key:'sk_live_••••4242', webhook:'https://api.zucci.com/webhooks/stripe',  markets:['AE','SA','QA'], type:'card', status:'active',  threeds:true,  retry:true, save_cards:true },
  { id:'paymob',  name:'Paymob',        env:'production', key:'pk_••••8841',      webhook:'https://api.zucci.com/webhooks/paymob',  markets:['EG'],          type:'card', status:'active',  threeds:false, retry:true, save_cards:false },
  { id:'tamara',  name:'Tamara (BNPL)', env:'production', key:'tamara_live_••••', webhook:'https://api.zucci.com/webhooks/tamara',  markets:['AE','SA'],      type:'bnpl', status:'active',  threeds:false, retry:false, save_cards:false },
  { id:'tabby',   name:'Tabby (BNPL)',  env:'sandbox',    key:'tabby_test_••••',  webhook:'https://api.zucci.com/webhooks/tabby',   markets:['AE','SA','EG'], type:'bnpl', status:'testing', threeds:false, retry:false, save_cards:false },
  { id:'knet',    name:'KNET',          env:'sandbox',    key:'knet_sandbox_••••',webhook:'https://api.zucci.com/webhooks/knet',    markets:['KW'],           type:'card', status:'pending', threeds:true,  retry:true, save_cards:false },
]);

const STATUS_COLORS = { active:'var(--zg-good)', testing:'var(--zg-warn)', pending:'var(--zg-text-dim)', inactive:'var(--zg-danger)' };
const configGw = ref(null);
const testGw   = ref(null);
const addOpen  = ref(false);

function saveGateway(updated) {
  const idx = gateways.findIndex(g => g.id === updated.id);
  if (idx >= 0) Object.assign(gateways[idx], updated);
}
function addGateway(gw) { gateways.push({ id: gw.name.toLowerCase().replace(/\s/g,'_'), ...gw, status:'active' }); }
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Payment Gateways</div><div class="zset-content-sub">Configure and manage payment integrations per market</div></div>
      <button class="zwh-btn-primary" @click="addOpen = true">+ Add Gateway</button>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;">
      <div v-for="gw in gateways" :key="gw.id"
        style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px 16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--zg-text);">{{ gw.name }}</div>
            <div style="display:flex;gap:5px;margin-top:4px;flex-wrap:wrap;">
              <span v-for="m in gw.markets" :key="m" style="height:16px;padding:0 5px;border-radius:2px;background:oklch(0.78 0.18 130 / 0.1);color:var(--zg-accent);font-size:9.5px;font-family:var(--zg-mono);font-weight:700;display:inline-flex;align-items:center;">{{ m }}</span>
              <span style="height:16px;padding:0 5px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:9.5px;color:var(--zg-text-dim);display:inline-flex;align-items:center;">{{ gw.type }}</span>
              <span style="height:16px;padding:0 5px;border-radius:2px;font-size:9.5px;font-weight:600;display:inline-flex;align-items:center;" :style="{ color: STATUS_COLORS[gw.status], background: (STATUS_COLORS[gw.status])+'18' }">{{ gw.status }} · {{ gw.env }}</span>
            </div>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="zcat-act" @click="testGw = gw">Test</button>
            <button class="zcat-act" @click="configGw = gw">Configure</button>
          </div>
        </div>
        <div style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);background:var(--zg-bg);padding:6px 10px;border-radius:3px;border:1px solid var(--zg-line);">{{ gw.key }}</div>
      </div>
    </div>

    <GatewayConfigDrawer v-if="configGw" :gateway="configGw" @close="configGw = null" @save="saveGateway" />
    <GatewayTestModal    v-if="testGw"   :gateway="testGw"   @close="testGw = null" />
    <AddGatewayModal     v-if="addOpen"                       @close="addOpen = false" @save="addGateway" />
  </div>
</template>
<style scoped>
.zcat-act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
</style>
