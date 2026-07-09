<script setup>
import { ref, reactive } from 'vue';
import { CHANNELS, CH_LABELS, CAMPAIGNS, AUDIENCE_SEGMENTS, STATUS_COLORS } from '@/data/commsData';

const campaigns = reactive(CAMPAIGNS.map(c => ({ ...c })));
const newOpen   = ref(false);
const reportC   = ref(null);
const newForm   = ref({ name:'', scheduled:'', channels:[], audience_id:'' });

const stColor = (s) => STATUS_COLORS[s] || 'var(--zg-text-dim)';

function toggleChannel(ch) {
  const idx = newForm.value.channels.indexOf(ch);
  if (idx >= 0) newForm.value.channels.splice(idx, 1);
  else newForm.value.channels.push(ch);
}
function saveCampaign() {
  campaigns.unshift({ id:'c-'+Date.now(), name:newForm.value.name, channels:newForm.value.channels, status:'draft', scheduled:'—', audience:'Selected segment', sent:null, open_rate:null, ctr:null, conversions:null });
  newOpen.value = false;
}
function cancelCampaign(id) {
  const c = campaigns.find(x => x.id === id);
  if (c) c.status = 'cancelled';
}

const CH_ICONS_SVG = {
  email: 'M1 5l7 5 7-5M1 3h14v10H1z',
  sms:   'M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2z',
  push:  'M3 10a4 4 0 018 0M2 10h12M6 13a2 2 0 004 0M8 2v2',
  in_app:'M2 2h12v12H2z M5 6h6M5 9h4',
};
</script>

<template>
  <div class="zcat-content">
    <div style="display:flex;justify-content:flex-end;gap:6px;margin-bottom:12px;">
      <button class="btn-primary" @click="newOpen = true">+ New Campaign</button>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;">
      <div v-for="c in campaigns" :key="c.id"
        style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px 16px;">
        <!-- Header row -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px;">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--zg-text);margin-bottom:2px;">{{ c.name }}</div>
            <div style="font-size:11px;color:var(--zg-text-dim);">Audience: {{ c.audience }} · Scheduled: {{ c.scheduled }}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
            <span style="font-size:11px;font-weight:700;text-transform:capitalize;" :style="{ color: stColor(c.status) }">{{ c.status }}</span>
            <div style="display:flex;gap:4px;">
              <button v-if="c.status==='draft'" class="btn-primary" style="height:26px;font-size:11px;" @click="">Schedule</button>
              <button v-if="c.status==='scheduled'" class="btn-ghost" style="height:26px;font-size:11px;" @click="cancelCampaign(c.id)">Cancel</button>
              <button class="act" @click="reportC = c">Report</button>
            </div>
          </div>
        </div>
        <!-- Stats + channels -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <div style="display:flex;gap:4px;">
            <span v-for="ch in c.channels" :key="ch"
              style="height:20px;padding:0 8px;border-radius:3px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:10.5px;color:var(--zg-text-mid);display:inline-flex;align-items:center;gap:4px;">
              <svg viewBox="0 0 16 16" width="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path :d="CH_ICONS_SVG[ch]" /></svg>
              {{ CH_LABELS[ch] }}
            </span>
          </div>
          <template v-if="c.sent">
            <span style="font-size:11px;font-family:var(--zg-mono);color:var(--zg-text-dim);">Sent: <strong style="color:var(--zg-text);">{{ c.sent.toLocaleString() }}</strong></span>
            <span style="font-size:11px;font-family:var(--zg-mono);color:var(--zg-text-dim);">Open: <strong style="color:var(--zg-accent);">{{ c.open_rate }}%</strong></span>
            <span style="font-size:11px;font-family:var(--zg-mono);color:var(--zg-text-dim);">CTR: <strong style="color:var(--zg-good);">{{ c.ctr }}%</strong></span>
            <span style="font-size:11px;font-family:var(--zg-mono);color:var(--zg-text-dim);">Conv: <strong style="color:oklch(0.82 0.14 215);">{{ c.conversions?.toLocaleString() }}</strong></span>
          </template>
        </div>
      </div>
    </div>

    <!-- Campaign Report modal -->
    <Teleport to="body">
      <div v-if="reportC" class="modal-bd" @click="reportC = null">
        <div class="modal" style="max-width:580px;" @click.stop>
          <div class="modal-head"><span>Campaign Report — {{ reportC.name }}</span><button @click="reportC = null">×</button></div>
          <div class="modal-body">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
              <div v-for="[l,v,cls] in [
                ['Sent',    reportC.sent?.toLocaleString() || '—', 'accent'],
                ['Open Rate', reportC.open_rate ? reportC.open_rate+'%' : '—', 'good'],
                ['CTR',     reportC.ctr ? reportC.ctr+'%' : '—', 'good'],
                ['Conversions', reportC.conversions?.toLocaleString() || '—', ''],
              ]" :key="l" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px;text-align:center;">
                <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:4px;">{{ l }}</div>
                <div style="font-family:var(--zg-mono);font-size:20px;font-weight:800;" :class="`is-${cls||'text'}`">{{ v }}</div>
              </div>
            </div>
            <div style="font-size:12px;color:var(--zg-text-dim);">Audience: {{ reportC.audience }}</div>
            <div style="font-size:12px;color:var(--zg-text-dim);">Scheduled: {{ reportC.scheduled }}</div>
          </div>
          <div class="modal-foot"><button class="btn-ghost" @click="reportC = null">Close</button></div>
        </div>
      </div>
    </Teleport>

    <!-- New Campaign modal -->
    <Teleport to="body">
      <div v-if="newOpen" class="modal-bd" @click="newOpen = false">
        <div class="modal" style="max-width:540px;" @click.stop>
          <div class="modal-head"><span>New Campaign</span><button @click="newOpen = false">×</button></div>
          <div class="modal-body">
            <div class="field"><label class="lbl">Campaign Name</label><input v-model="newForm.name" class="inp" placeholder="e.g. Summer Sale 2025" /></div>
            <div class="field"><label class="lbl">Scheduled Date / Time</label><input v-model="newForm.scheduled" type="datetime-local" class="inp" /></div>
            <div class="field">
              <label class="lbl">Channels</label>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button v-for="ch in CHANNELS" :key="ch"
                  style="height:28px;padding:0 10px;border-radius:var(--zg-radius-md);font-size:11px;cursor:pointer;display:flex;align-items:center;gap:6px;"
                  :style="{ border: newForm.channels.includes(ch) ? '1px solid var(--zg-accent)' : '1px solid var(--zg-line)', background: newForm.channels.includes(ch) ? 'oklch(0.78 0.18 130 / 0.1)' : 'transparent', color: newForm.channels.includes(ch) ? 'var(--zg-accent)' : 'var(--zg-text-mid)' }"
                  @click="toggleChannel(ch)">
                  {{ CH_LABELS[ch] }}
                </button>
              </div>
            </div>
            <div class="field">
              <label class="lbl">Audience Segment</label>
              <select v-model="newForm.audience_id" class="inp">
                <option v-for="seg in AUDIENCE_SEGMENTS" :key="seg.id" :value="seg.id">{{ seg.name }} ({{ seg.size.toLocaleString() }})</option>
              </select>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-primary" @click="saveCampaign">Save Campaign</button>
            <button class="btn-ghost" @click="newOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.btn-primary { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }
.btn-ghost { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
.modal-bd { position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center; }
.modal { width:480px;max-height:85vh;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;display:flex;flex-direction:column; }
.modal-head { padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:var(--zg-text); }
.modal-head button { width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim); }
.modal-body { padding:16px 20px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:12px; }
.modal-foot { padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px; }
.field { display:flex;flex-direction:column;gap:4px; }
.lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.inp { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
.is-accent { color:var(--zg-accent) !important; }
.is-good { color:var(--zg-good) !important; }
.is-text { color:var(--zg-text) !important; }
</style>
