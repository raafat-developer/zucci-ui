<script setup>
import { ref, reactive } from 'vue';
import { AUDIENCE_SEGMENTS } from '@/data/commsData';

const segs     = reactive(AUDIENCE_SEGMENTS.map(s => ({ ...s })));
const buildOpen = ref(false);
const editSeg   = ref(null);
const newSeg    = ref({ name:'', size:0, markets:[], filters:[] });
const newFilter = ref('');

function addFilter() {
  if (newFilter.value.trim()) { newSeg.value.filters.push(newFilter.value.trim()); newFilter.value = ''; }
}
function saveSegment() {
  segs.push({ ...newSeg.value, id:'s-'+Date.now() });
  buildOpen.value = false;
  newSeg.value = { name:'', size:0, markets:[], filters:[] };
}
</script>

<template>
  <div class="zcat-content">
    <div style="display:flex;justify-content:flex-end;gap:6px;margin-bottom:12px;">
      <button class="btn-primary" @click="buildOpen = true">+ Build Segment</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;">
      <div v-for="s in segs" :key="s.id"
        style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px;">
        <div style="font-size:13px;font-weight:700;color:var(--zg-text);margin-bottom:4px;">{{ s.name }}</div>
        <div style="font-size:24px;font-weight:800;font-family:var(--zg-mono);color:var(--zg-accent);margin-bottom:4px;">{{ s.size.toLocaleString() }}</div>
        <div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:8px;">
          <span v-for="m in s.markets" :key="m" style="height:16px;padding:0 5px;border-radius:2px;background:oklch(0.78 0.18 130 / 0.1);color:var(--zg-accent);font-size:9.5px;font-family:var(--zg-mono);font-weight:700;display:inline-flex;align-items:center;">{{ m }}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:2px;margin-bottom:10px;">
          <span v-for="(f,i) in s.filters" :key="i" style="font-size:10.5px;font-family:var(--zg-mono);color:var(--zg-text-dim);">• {{ f }}</span>
        </div>
        <div style="display:flex;gap:4px;">
          <button class="act" @click="">Use in Campaign</button>
          <button class="act" @click="editSeg = s">Edit</button>
        </div>
      </div>
    </div>

    <!-- Build / Edit segment modal -->
    <Teleport to="body">
      <div v-if="buildOpen || editSeg" class="modal-bd" @click="buildOpen=false;editSeg=null;">
        <div class="modal" @click.stop>
          <div class="modal-head">
            <span>{{ editSeg ? 'Edit Segment' : 'Build Segment' }}</span>
            <button @click="buildOpen=false;editSeg=null;">×</button>
          </div>
          <div class="modal-body">
            <div class="field"><label class="lbl">Segment Name</label><input v-model="newSeg.name" class="inp" placeholder="e.g. AE VIP Customers" /></div>
            <div class="field"><label class="lbl">Estimated Size</label><input v-model.number="newSeg.size" type="number" class="inp" placeholder="0" /></div>
            <div class="field">
              <label class="lbl">Markets</label>
              <div style="display:flex;gap:5px;flex-wrap:wrap;">
                <button v-for="m in ['AE','SA','EG','KW','BH','QA','OM']" :key="m"
                  class="chip" :class="{ 'is-active': newSeg.markets.includes(m) }"
                  @click="newSeg.markets.includes(m) ? newSeg.markets.splice(newSeg.markets.indexOf(m),1) : newSeg.markets.push(m)">
                  {{ m }}
                </button>
              </div>
            </div>
            <div class="field">
              <label class="lbl">Filters</label>
              <div style="display:flex;gap:6px;margin-bottom:6px;">
                <input v-model="newFilter" class="inp" style="flex:1;" placeholder="e.g. tier=gold" @keydown.enter="addFilter" />
                <button class="btn-ghost" @click="addFilter">Add</button>
              </div>
              <div style="display:flex;flex-direction:column;gap:3px;">
                <div v-for="(f,i) in newSeg.filters" :key="i" style="display:flex;align-items:center;gap:6px;font-size:11px;font-family:var(--zg-mono);color:var(--zg-text-dim);">
                  <span>• {{ f }}</span>
                  <button style="border:none;background:transparent;cursor:pointer;color:var(--zg-danger);font-size:12px;" @click="newSeg.filters.splice(i,1)">×</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-primary" @click="saveSegment">Save Segment</button>
            <button class="btn-ghost" @click="buildOpen=false;editSeg=null;">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.chip { height:26px;padding:0 10px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.chip.is-active { background:oklch(0.78 0.18 130 / 0.1);color:var(--zg-accent);border-color:var(--zg-accent); }
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
</style>
