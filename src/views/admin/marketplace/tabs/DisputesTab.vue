<script setup>
import { ref, reactive } from 'vue';
import { DISPUTES_DATA } from '@/data/marketplaceData';

const disputes   = reactive(DISPUTES_DATA.map(d => ({ ...d })));
const detailDisp = ref(null);
const logOpen    = ref(false);
const newDispute = ref({ subject:'', vendor:'', market:'AE', type:'Payout', amount:'—' });

const STATUS_COLOR = {
  open:     'var(--zg-warn)',
  resolved: 'var(--zg-good)',
  escalated:'var(--zg-danger)',
};

function resolve(id) {
  const d = disputes.find(x => x.id === id);
  if (d) d.status = 'resolved';
  if (detailDisp.value?.id === id) detailDisp.value = { ...detailDisp.value, status:'resolved' };
}

function logDispute() {
  disputes.unshift({ ...newDispute.value, id:'DSP-' + Date.now(), status:'open', assignee:'Sara Medhat' });
  logOpen.value = false;
  newDispute.value = { subject:'', vendor:'', market:'AE', type:'Payout', amount:'—' };
}
</script>

<template>
  <div class="zcat-content">
    <div style="display:flex;justify-content:flex-end;gap:6px;margin-bottom:12px;">
      <button class="zwh-btn-primary" @click="logOpen = true">+ Log Dispute</button>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;">
      <div v-for="d in disputes" :key="d.id"
        style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px 16px;display:grid;grid-template-columns:80px 1fr 100px 80px 100px 100px 120px;gap:10px;align-items:center;font-size:12px;">
        <span style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);">{{ d.id }}</span>
        <div>
          <div style="font-weight:600;color:var(--zg-text);margin-bottom:2px;">{{ d.subject }}</div>
          <div style="font-size:11px;color:var(--zg-text-dim);">{{ d.vendor }} · {{ d.market }}</div>
        </div>
        <span style="font-size:11px;padding:2px 7px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);color:var(--zg-text-mid);font-weight:600;">{{ d.type }}</span>
        <span style="font-family:var(--zg-mono);font-size:11.5px;font-weight:700;" :style="{ color: d.amount!=='—'?'var(--zg-warn)':'var(--zg-text-dim)' }">{{ d.amount }}</span>
        <span style="font-size:10.5px;font-weight:700;text-transform:capitalize;" :style="{ color: STATUS_COLOR[d.status] || 'var(--zg-text-dim)' }">{{ d.status }}</span>
        <span style="font-size:11px;color:var(--zg-text-mid);">{{ d.assignee }}</span>
        <div style="display:flex;gap:4px;">
          <button class="zcat-act" @click="detailDisp = d">View</button>
          <button v-if="d.status==='open'" class="zcat-act" style="color:var(--zg-good);" @click="resolve(d.id)">Resolve</button>
        </div>
      </div>
    </div>

    <!-- Detail drawer -->
    <Teleport to="body">
      <div v-if="detailDisp" class="mkt-modal-backdrop" @click="detailDisp = null">
        <div class="mkt-modal" style="max-width:520px;" @click.stop>
          <div class="mkt-modal-head">
            <span>{{ detailDisp.id }} — {{ detailDisp.subject }}</span>
            <button @click="detailDisp = null">×</button>
          </div>
          <div class="mkt-modal-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div v-for="[k,v] in [['Vendor',detailDisp.vendor],['Market',detailDisp.market],['Type',detailDisp.type],['Amount',detailDisp.amount],['Status',detailDisp.status],['Assignee',detailDisp.assignee]]" :key="k">
                <div style="font-size:10.5px;font-weight:600;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;">{{ k }}</div>
                <div style="font-size:13px;font-weight:600;color:var(--zg-text);">{{ v }}</div>
              </div>
            </div>
          </div>
          <div class="mkt-modal-foot">
            <button v-if="detailDisp.status==='open'" class="zwh-btn-primary" @click="resolve(detailDisp.id)">Mark Resolved</button>
            <button class="zwh-btn-ghost" @click="detailDisp = null">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Log dispute modal -->
    <Teleport to="body">
      <div v-if="logOpen" class="mkt-modal-backdrop" @click="logOpen = false">
        <div class="mkt-modal" @click.stop>
          <div class="mkt-modal-head"><span>Log New Dispute</span><button @click="logOpen = false">×</button></div>
          <div class="mkt-modal-body">
            <div style="display:flex;flex-direction:column;gap:10px;">
              <div><label class="mkt-field-lbl">Subject</label><input v-model="newDispute.subject" class="mkt-input" /></div>
              <div><label class="mkt-field-lbl">Vendor</label><input v-model="newDispute.vendor" class="mkt-input" /></div>
              <div><label class="mkt-field-lbl">Market</label><select v-model="newDispute.market" class="mkt-input"><option v-for="m in ['AE','SA','EG','KW','BH','QA','OM']" :key="m">{{ m }}</option></select></div>
              <div><label class="mkt-field-lbl">Type</label><select v-model="newDispute.type" class="mkt-input"><option>Payout</option><option>Listing</option><option>Returns</option><option>SLA</option><option>Other</option></select></div>
              <div><label class="mkt-field-lbl">Amount (optional)</label><input v-model="newDispute.amount" class="mkt-input" placeholder="e.g. AED 1,200" /></div>
            </div>
          </div>
          <div class="mkt-modal-foot">
            <button class="zwh-btn-primary" @click="logDispute">Log Dispute</button>
            <button class="zwh-btn-ghost" @click="logOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mkt-field-lbl { display:block;font-size:10.5px;font-weight:600;color:var(--zg-text-dim);margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em; }
.mkt-input { width:100%;height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box; }
.mkt-modal-backdrop { position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center; }
.mkt-modal { width:480px;max-height:85vh;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;display:flex;flex-direction:column; }
.mkt-modal-head { padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:var(--zg-text); }
.mkt-modal-head button { width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim); }
.mkt-modal-body { padding:16px 20px;overflow-y:auto;flex:1; }
.mkt-modal-foot { padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px; }
.zcat-act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.zwh-btn-primary { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }
.zwh-btn-ghost { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
</style>
