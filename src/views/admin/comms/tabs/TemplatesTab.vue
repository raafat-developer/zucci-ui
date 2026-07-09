<script setup>
import { ref, computed, reactive } from 'vue';
import {
  CHANNELS, CH_LABELS, TEMPLATES, STATUS_COLORS,
} from '@/data/commsData';

const templates = reactive(TEMPLATES.map(t => ({ ...t })));
const search    = ref('');
const chF       = ref('all');
const catF      = ref('all');
const editTpl   = ref(null);
const newTplOpen = ref(false);

const CH_ICONS_SVG = {
  email: 'M1 5l7 5 7-5M1 3h14v10H1z',
  sms:   'M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2z',
  push:  'M3 10a4 4 0 018 0M2 10h12M6 13a2 2 0 004 0M8 2v2',
  in_app:'M2 2h12v12H2z M5 6h6M5 9h4',
};

const cats = computed(() => [...new Set(TEMPLATES.map(t => t.category))]);

const filtered = computed(() => {
  const sq = search.value.toLowerCase();
  return templates.filter(t =>
    (chF.value === 'all' || t.channel === chF.value) &&
    (catF.value === 'all' || t.category === catF.value) &&
    (!sq || t.name.toLowerCase().includes(sq))
  );
});

const stColor = (s) => STATUS_COLORS[s] || 'var(--zg-text-dim)';
</script>

<template>
  <div class="zcat-content">
    <div style="display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap;margin-bottom:12px;">
      <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
        <div style="position:relative;">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:7px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
          <input v-model="search" placeholder="Search templates…" style="height:28px;padding-left:24px;padding-right:8px;width:200px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;" />
        </div>
        <button v-for="ch in ['all', ...CHANNELS]" :key="ch"
          class="chip" :class="{ 'is-active': chF === ch }" @click="chF = ch">
          {{ ch === 'all' ? 'All' : CH_LABELS[ch] }}
        </button>
        <div style="width:1px;height:16px;background:var(--zg-line);" />
        <button v-for="c in ['all', ...cats]" :key="c"
          class="chip" :class="{ 'is-active': catF === c }" @click="catF = c">{{ c }}</button>
      </div>
      <button class="btn-primary" @click="newTplOpen = true">+ New Template</button>
    </div>

    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
      <div class="tpl-head">
        <span>Template Name</span><span>Channel</span><span>Category</span><span>Status</span><span>Languages</span><span>Sent</span><span>Actions</span>
      </div>
      <div v-for="t in filtered" :key="t.id" class="tpl-row">
        <div style="display:flex;align-items:center;gap:8px;">
          <svg viewBox="0 0 16 16" width="14" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.4" stroke-linecap="round">
            <path :d="CH_ICONS_SVG[t.channel]" />
          </svg>
          <span style="font-weight:600;color:var(--zg-text);">{{ t.name }}</span>
        </div>
        <span style="font-size:11px;color:var(--zg-text-mid);">{{ CH_LABELS[t.channel] }}</span>
        <span style="font-size:11px;color:var(--zg-text-dim);">{{ t.category }}</span>
        <span style="font-size:11px;font-weight:600;" :style="{ color: stColor(t.status) }">{{ t.status }}</span>
        <div style="display:flex;gap:3px;">
          <span v-for="l in t.langs" :key="l" style="height:16px;padding:0 4px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:9.5px;font-family:var(--zg-mono);color:var(--zg-text-dim);display:inline-flex;align-items:center;">{{ l }}</span>
        </div>
        <span style="font-family:var(--zg-mono);font-size:11px;">{{ t.sent_count > 0 ? t.sent_count.toLocaleString() : '—' }}</span>
        <div style="display:flex;gap:4px;">
          <button class="act" @click="editTpl = t">Edit</button>
          <button class="act" @click="">Preview</button>
        </div>
      </div>
    </div>

    <!-- Edit / New Template modal -->
    <Teleport to="body">
      <div v-if="editTpl || newTplOpen" class="modal-bd" @click="editTpl=null;newTplOpen=false;">
        <div class="modal" @click.stop>
          <div class="modal-head">
            <span>{{ editTpl ? 'Edit Template' : 'New Template' }}</span>
            <button @click="editTpl=null;newTplOpen=false;">×</button>
          </div>
          <div class="modal-body">
            <div class="field"><label class="lbl">Template Name</label><input class="inp" :value="editTpl?.name || ''" placeholder="e.g. Order Confirmed" /></div>
            <div class="field"><label class="lbl">Channel</label>
              <select class="inp">
                <option v-for="ch in CHANNELS" :key="ch" :value="ch" :selected="editTpl?.channel === ch">{{ CH_LABELS[ch] }}</option>
              </select>
            </div>
            <div class="field"><label class="lbl">Category</label><input class="inp" :value="editTpl?.category || ''" placeholder="e.g. Transactional" /></div>
            <div class="field"><label class="lbl">Subject / Title</label><input class="inp" placeholder="Template subject line or push title…" /></div>
            <div class="field"><label class="lbl">Body</label><textarea class="inp" rows="4" style="height:auto;resize:vertical;" placeholder="Template body content…">{{ editTpl ? '' : '' }}</textarea></div>
          </div>
          <div class="modal-foot">
            <button class="btn-primary" @click="editTpl=null;newTplOpen=false;">Save Template</button>
            <button class="btn-ghost" @click="editTpl=null;newTplOpen=false;">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tpl-head { display:grid;grid-template-columns:1fr 80px 100px 80px 80px 100px 80px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;gap:10px; }
.tpl-row { display:grid;grid-template-columns:1fr 80px 100px 80px 80px 100px 80px;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);align-items:center;font-size:12px;gap:10px; }
.tpl-row:nth-child(odd) { background:var(--zg-bg); }
.chip { height:26px;padding:0 10px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim);white-space:nowrap; }
.chip.is-active { background:var(--zg-panel-hi);color:var(--zg-text);border-color:var(--zg-accent); }
.act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.btn-primary { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }
.btn-ghost { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
.modal-bd { position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center; }
.modal { width:520px;max-height:85vh;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;display:flex;flex-direction:column; }
.modal-head { padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:var(--zg-text); }
.modal-head button { width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim); }
.modal-body { padding:16px 20px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:12px; }
.modal-foot { padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px; }
.field { display:flex;flex-direction:column;gap:4px; }
.lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.inp { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
</style>
