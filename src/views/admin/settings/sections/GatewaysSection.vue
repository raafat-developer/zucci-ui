<script setup>
import { ref, reactive } from 'vue';

const gateways = reactive([
  { id:'stripe',    name:'Stripe',         env:'live',     status:'active',  markets:['AE','SA','QA'],  key:'sk_live_••••4242', webhook:'https://api.zucci.com/webhooks/stripe',    type:'card' },
  { id:'paymob',    name:'Paymob',         env:'live',     status:'active',  markets:['EG'],            key:'pk_••••8841',      webhook:'https://api.zucci.com/webhooks/paymob',    type:'card' },
  { id:'tamara',    name:'Tamara (BNPL)',   env:'live',     status:'active',  markets:['AE','SA'],       key:'tamara_live_••••', webhook:'https://api.zucci.com/webhooks/tamara',    type:'bnpl' },
  { id:'tabby',     name:'Tabby (BNPL)',    env:'sandbox',  status:'testing', markets:['AE','SA','EG'],  key:'tabby_test_••••',  webhook:'https://api.zucci.com/webhooks/tabby',     type:'bnpl' },
  { id:'knet',      name:'KNET',           env:'sandbox',  status:'pending', markets:['KW'],            key:'knet_sandbox_••••',webhook:'https://api.zucci.com/webhooks/knet',      type:'card' },
]);

const STATUS_COLOR = { active:'var(--zg-good)', testing:'var(--zg-warn)', pending:'var(--zg-text-dim)', inactive:'var(--zg-danger)' };
const configGw = ref(null);
const testOpen = ref(false);
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Payment Gateways</div><div class="zset-content-sub">Configure and manage payment integrations per market</div></div>
      <button class="btn-primary" @click="">+ Add Gateway</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div v-for="gw in gateways" :key="gw.id" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px 16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--zg-text);">{{ gw.name }}</div>
            <div style="display:flex;gap:5px;margin-top:4px;flex-wrap:wrap;">
              <span v-for="m in gw.markets" :key="m" style="height:16px;padding:0 5px;border-radius:2px;background:oklch(0.78 0.18 130 / 0.1);color:var(--zg-accent);font-size:9.5px;font-family:var(--zg-mono);font-weight:700;display:inline-flex;align-items:center;">{{ m }}</span>
              <span style="height:16px;padding:0 5px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:9.5px;color:var(--zg-text-dim);display:inline-flex;align-items:center;">{{ gw.type }}</span>
              <span style="height:16px;padding:0 5px;border-radius:2px;font-size:9.5px;font-weight:600;display:inline-flex;align-items:center;" :style="{ color: STATUS_COLOR[gw.status], background: STATUS_COLOR[gw.status]+'18' }">{{ gw.status }} · {{ gw.env }}</span>
            </div>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="act" @click="testOpen = true">Test</button>
            <button class="act" @click="configGw = gw">Configure</button>
          </div>
        </div>
        <div style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);background:var(--zg-bg);padding:6px 10px;border-radius:3px;border:1px solid var(--zg-line);">{{ gw.key }}</div>
      </div>
    </div>

    <!-- Config modal -->
    <Teleport to="body">
      <div v-if="configGw" style="position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="configGw = null">
        <div style="width:480px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:var(--zg-text);">Configure {{ configGw.name }}<button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="configGw = null">×</button></div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><label class="sf-lbl">API Key</label><input :value="configGw.key" class="sf-inp" style="font-family:var(--zg-mono);" /></div>
            <div><label class="sf-lbl">Webhook URL</label><input :value="configGw.webhook" class="sf-inp" style="font-family:var(--zg-mono);" /></div>
            <div><label class="sf-lbl">Environment</label>
              <select v-model="configGw.env" class="sf-sel"><option value="live">Live</option><option value="sandbox">Sandbox</option></select>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="btn-primary" @click="configGw = null">Save</button>
            <button class="btn-ghost" @click="configGw = null">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.sf-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.sf-inp { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
.sf-sel { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer;width:100%; }
.act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
</style>
