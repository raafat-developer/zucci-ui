<script setup>
import { ref, reactive } from 'vue';

const keys = reactive([
  { id:'k1', name:'Zucci Admin API — Production', key:'zcc_live_••••••••••••a842', created:'Jan 15, 2025', last:'5m ago', scope:'read_write' },
  { id:'k2', name:'Analytics Dashboard',          key:'zcc_live_••••••••••••f291', created:'Mar 1, 2025',  last:'2h ago', scope:'read_only' },
  { id:'k3', name:'Staging Environment',          key:'zcc_test_••••••••••••c128', created:'Apr 10, 2025', last:'1d ago', scope:'read_write' },
]);
const hooks = reactive([
  { id:'w1', url:'https://erp.company.com/zucci-hook',       events:['order.created','order.delivered'],       status:'active',  last:'2m ago',  failures:0 },
  { id:'w2', url:'https://analytics.company.com/events',     events:['order.created'],                          status:'active',  last:'5m ago',  failures:0 },
  { id:'w3', url:'https://whatsapp-gateway.com/notify',      events:['ticket.created','ticket.resolved'],       status:'active',  last:'1h ago',  failures:0 },
  { id:'w4', url:'https://legacy.zucci.com/sync',            events:['inventory.updated'],                      status:'failing', last:'4h ago',  failures:12 },
]);

const genOpen = ref(false);
const newKey  = ref({ name:'', scope:'read_only' });
const newHook = ref({ url:'', events:[] });
const hookOpen = ref(false);
const ALL_EVENTS = ['order.created','order.delivered','order.returned','ticket.created','ticket.resolved','inventory.updated','payout.processed'];
const copied = ref('');

function copyKey(id, val) { navigator.clipboard?.writeText(val); copied.value = id; setTimeout(() => (copied.value = ''), 2000); }
function generateKey() { keys.push({ id:'k-'+Date.now(), name:newKey.value.name, key:'zcc_live_••••••••••••'+Math.random().toString(36).slice(2,6), created:'Just now', last:'—', scope:newKey.value.scope }); genOpen.value = false; newKey.value = { name:'', scope:'read_only' }; }
function toggleEvent(ev) { const idx = newHook.value.events.indexOf(ev); idx>=0 ? newHook.value.events.splice(idx,1) : newHook.value.events.push(ev); }
function saveHook() { hooks.push({ id:'w-'+Date.now(), ...newHook.value, status:'active', last:'—', failures:0 }); hookOpen.value = false; newHook.value = { url:'', events:[] }; }
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">API & Webhooks</div><div class="zset-content-sub">Manage API keys and webhook endpoints</div></div>
    </div>

    <!-- API Keys -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <div class="sf-section-title">API Keys</div>
      <button class="btn-primary" style="height:28px;font-size:11.5px;" @click="genOpen = true">+ Generate Key</button>
    </div>
    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;margin-bottom:20px;">
      <div v-for="k in keys" :key="k.id" style="padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
          <span style="font-size:12.5px;font-weight:600;color:var(--zg-text);">{{ k.name }}</span>
          <div style="display:flex;gap:6px;align-items:center;">
            <span style="font-size:9.5px;padding:1px 5px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);color:var(--zg-text-dim);">{{ k.scope }}</span>
            <button class="act" @click="copyKey(k.id, k.key)">{{ copied === k.id ? 'Copied!' : 'Copy' }}</button>
            <button class="act" style="color:var(--zg-danger);" @click="keys.splice(keys.indexOf(k),1)">Revoke</button>
          </div>
        </div>
        <div style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);background:var(--zg-bg);padding:5px 8px;border-radius:3px;border:1px solid var(--zg-line);">{{ k.key }}</div>
        <div style="font-size:10px;color:var(--zg-text-dim);margin-top:4px;">Created {{ k.created }} · Last used {{ k.last }}</div>
      </div>
    </div>

    <!-- Webhooks -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <div class="sf-section-title">Webhooks</div>
      <button class="btn-primary" style="height:28px;font-size:11.5px;" @click="hookOpen = true">+ Add Webhook</button>
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
            <span style="font-size:11px;font-weight:600;" :style="{ color: h.status==='failing'?'var(--zg-danger)':h.status==='active'?'var(--zg-good)':'var(--zg-text-dim)' }">{{ h.status }}</span>
            <span v-if="h.failures > 0" style="font-size:10px;color:var(--zg-danger);">{{ h.failures }} fails</span>
            <button class="act" @click="">Edit</button>
            <button class="act" style="color:var(--zg-danger);" @click="hooks.splice(hooks.indexOf(h),1)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Generate Key Modal -->
    <Teleport to="body">
      <div v-if="genOpen" style="position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="genOpen = false">
        <div style="width:420px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:var(--zg-text);">Generate API Key<button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="genOpen = false">×</button></div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><label class="sf-lbl">Key Name</label><input v-model="newKey.name" class="sf-inp" placeholder="e.g. ERP Integration" /></div>
            <div><label class="sf-lbl">Scope</label>
              <select v-model="newKey.scope" class="sf-sel"><option value="read_only">Read Only</option><option value="read_write">Read & Write</option></select>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="btn-primary" :disabled="!newKey.name" :style="{ opacity: newKey.name?1:0.4 }" @click="generateKey">Generate</button>
            <button class="btn-ghost" @click="genOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add Webhook Modal -->
    <Teleport to="body">
      <div v-if="hookOpen" style="position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="hookOpen = false">
        <div style="width:480px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:var(--zg-text);">Add Webhook<button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="hookOpen = false">×</button></div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><label class="sf-lbl">Endpoint URL</label><input v-model="newHook.url" class="sf-inp" style="font-family:var(--zg-mono);" placeholder="https://your-server.com/webhook" /></div>
            <div>
              <label class="sf-lbl" style="margin-bottom:6px;">Events</label>
              <div style="display:flex;flex-wrap:wrap;gap:5px;">
                <button v-for="ev in ALL_EVENTS" :key="ev"
                  style="height:24px;padding:0 8px;border-radius:3px;cursor:pointer;font-size:10.5px;font-family:var(--zg-mono);transition:all .1s;"
                  :style="{ border: newHook.events.includes(ev)?'1px solid var(--zg-accent)':'1px solid var(--zg-line)', background: newHook.events.includes(ev)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color: newHook.events.includes(ev)?'var(--zg-accent)':'var(--zg-text-dim)' }"
                  @click="toggleEvent(ev)">{{ ev }}</button>
              </div>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="btn-primary" :disabled="!newHook.url || !newHook.events.length" :style="{ opacity: (newHook.url&&newHook.events.length)?1:0.4 }" @click="saveHook">Add Webhook</button>
            <button class="btn-ghost" @click="hookOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.sf-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.sf-section-title { font-size:13px;font-weight:700;color:var(--zg-text); }
.sf-inp { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
.sf-sel { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer;width:100%; }
.act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
</style>
