<script setup>
import { ref, reactive } from 'vue';
import GenerateAPIKeyModal from '../drawers/GenerateAPIKeyModal.vue';
import RevokeKeyModal      from '../drawers/RevokeKeyModal.vue';
import WebhookModal        from '../drawers/WebhookModal.vue';

const ALL_WEBHOOK_EVENTS = ['order.created','order.updated','order.shipped','order.delivered','order.cancelled','return.created','return.resolved','product.created','product.updated','inventory.updated','payout.sent','invoice.created','vendor.approved','customer.created'];

const keys = reactive([
  { id:'k1', name:'Zucci Admin API — Production', key:'zcc_live_••••••••••••a842', scope:'full_access', created:'Jan 15, 2025', last:'5m ago' },
  { id:'k2', name:'Analytics Dashboard',          key:'zcc_live_••••••••••••f291', scope:'read_only',   created:'Mar 1, 2025',  last:'2h ago' },
  { id:'k3', name:'Staging Environment',          key:'zcc_test_••••••••••••c128', scope:'read_only',   created:'Apr 10, 2025', last:'1d ago' },
]);
const hooks = reactive([
  { id:'w1', url:'https://erp.company.com/zucci-hook',   events:['order.created','order.delivered'],      status:'active',  last:'2m ago', failures:0 },
  { id:'w2', url:'https://analytics.company.com/events', events:['order.created'],                        status:'active',  last:'5m ago', failures:0 },
  { id:'w3', url:'https://legacy.zucci.com/sync',        events:['inventory.updated'],                    status:'failing', last:'4h ago', failures:12 },
]);

const genOpen    = ref(false);
const revokeKey  = ref(null);
const hookModal  = ref(null); // null = closed, {} = new, {id,...} = edit
const copied     = ref('');

function copyKey(id, val) { navigator.clipboard?.writeText(val||''); copied.value = id; setTimeout(() => (copied.value = ''), 1800); }
function addKey(k)   { keys.push(k); }
function doRevoke(id){ const idx = keys.findIndex(k => k.id === id); if (idx >= 0) keys.splice(idx, 1); }
function saveHook(h) {
  if (h.id) { const idx = hooks.findIndex(w => w.id === h.id); if (idx >= 0) Object.assign(hooks[idx], h); }
  else hooks.push({ id:'w-'+Date.now(), ...h, status:'active', last:'—', failures:0 });
}
function deleteHook(id) { const idx = hooks.findIndex(w => w.id === id); if (idx >= 0) hooks.splice(idx, 1); }
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">API & Webhooks</div><div class="zset-content-sub">Manage API keys and webhook endpoints</div></div>
    </div>

    <!-- API Keys -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <div style="font-size:13px;font-weight:700;color:var(--zg-text);">API Keys</div>
      <button class="zwh-btn-primary" style="height:28px;font-size:11.5px;" @click="genOpen = true">+ Generate Key</button>
    </div>
    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;margin-bottom:20px;">
      <div v-for="k in keys" :key="k.id" style="padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
          <span style="font-size:12.5px;font-weight:600;color:var(--zg-text);">{{ k.name }}</span>
          <div style="display:flex;gap:6px;align-items:center;">
            <span style="font-size:9.5px;padding:1px 5px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);color:var(--zg-text-dim);">{{ k.scope }}</span>
            <button class="zcat-act" @click="copyKey(k.id, k.key)">{{ copied === k.id ? '✓ Copied' : 'Copy' }}</button>
            <button class="zcat-act danger" @click="revokeKey = k">Revoke</button>
          </div>
        </div>
        <div style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);background:var(--zg-bg);padding:5px 8px;border-radius:3px;border:1px solid var(--zg-line);">{{ k.key }}</div>
        <div style="font-size:10px;color:var(--zg-text-dim);margin-top:4px;">Created {{ k.created }} · Last used {{ k.last }}</div>
      </div>
    </div>

    <!-- Webhooks -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <div style="font-size:13px;font-weight:700;color:var(--zg-text);">Webhooks</div>
      <button class="zwh-btn-primary" style="height:28px;font-size:11.5px;" @click="hookModal = {}">+ Add Webhook</button>
    </div>
    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
      <div v-for="h in hooks" :key="h.id" style="padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
          <div style="flex:1;min-width:0;">
            <div style="font-family:var(--zg-mono);font-size:11.5px;color:var(--zg-accent);margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ h.url }}</div>
            <div style="display:flex;gap:3px;flex-wrap:wrap;">
              <span v-for="ev in h.events" :key="ev" style="height:15px;padding:0 5px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:9px;font-family:var(--zg-mono);color:var(--zg-text-dim);display:inline-flex;align-items:center;">{{ ev }}</span>
            </div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
            <span style="font-size:11px;font-weight:600;" :style="{ color: h.status==='failing'?'var(--zg-danger)':'var(--zg-good)' }">{{ h.status }}</span>
            <span v-if="h.failures > 0" style="font-size:10px;color:var(--zg-danger);">{{ h.failures }} fails</span>
            <button class="zcat-act" @click="hookModal = h">Edit</button>
            <button class="zcat-act danger" @click="deleteHook(h.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <GenerateAPIKeyModal v-if="genOpen"   @close="genOpen = false"   @save="addKey" />
    <RevokeKeyModal      v-if="revokeKey" :api-key="revokeKey" @close="revokeKey = null" @revoke="doRevoke" />
    <WebhookModal        v-if="hookModal !== null" :webhook="hookModal?.id ? hookModal : null" @close="hookModal = null" @save="saveHook" />
  </div>
</template>
<style scoped>
.zcat-act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.zcat-act.danger { color:var(--zg-danger); }
</style>
