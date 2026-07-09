<script setup>
import { ref, reactive } from 'vue';
import { AB_TESTS } from '@/data/commsData';

const tests   = reactive((AB_TESTS || []).map(t => ({ ...t })));
const newOpen = ref(false);
const newForm = ref({ name:'', campaign:'', variant_a:{ label:'', open:0 }, variant_b:{ label:'', open:0 } });

function saveTest() {
  tests.unshift({ ...newForm.value, id:'ab-'+Date.now(), status:'running', winner:null });
  newOpen.value = false;
}
function pickWinner(test, variant) {
  test.winner = variant;
  test.status = 'completed';
}
</script>

<template>
  <div class="zcat-content">
    <div style="display:flex;justify-content:flex-end;gap:6px;margin-bottom:12px;">
      <button class="btn-primary" @click="newOpen = true">+ New A/B Test</button>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;">
      <div v-for="ab in tests" :key="ab.id"
        style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px 16px;">
        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--zg-text);">{{ ab.name }}</div>
            <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px;">
              {{ ab.campaign }} ·
              <span style="font-weight:600;" :style="{ color: ab.status==='running'?'var(--zg-accent)':'var(--zg-text-dim)' }">{{ ab.status }}</span>
            </div>
          </div>
          <span v-if="ab.winner" style="font-size:12px;font-weight:700;padding:3px 10px;background:oklch(0.78 0.15 150 / 0.1);border:1px solid oklch(0.78 0.15 150 / 0.3);border-radius:var(--zg-radius-md);color:var(--zg-good);">
            Winner: Variant {{ ab.winner }}
          </span>
        </div>
        <!-- Variant cards -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div v-for="[lbl, v] in [['A', ab.variant_a], ['B', ab.variant_b]]" :key="lbl"
            style="border-radius:var(--zg-radius-md);padding:12px;"
            :style="{ background:'var(--zg-bg)', border: ab.winner===lbl ? '1px solid var(--zg-good)' : '1px solid var(--zg-line)' }">
            <div style="font-size:10px;font-weight:700;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;">Variant {{ lbl }}</div>
            <div style="font-size:12.5px;font-weight:600;color:var(--zg-text);margin-bottom:6px;">{{ v.label }}</div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="flex:1;height:6px;background:var(--zg-panel-hi);border-radius:3px;overflow:hidden;">
                <div style="height:100%;border-radius:3px;transition:width .5s;"
                  :style="{ width: (v.open||0)+'%', background: ab.winner===lbl ? 'var(--zg-good)' : 'var(--zg-accent)' }" />
              </div>
              <span style="font-family:var(--zg-mono);font-size:12px;font-weight:700;flex-shrink:0;"
                :style="{ color: ab.winner===lbl?'var(--zg-good)':'var(--zg-accent)' }">{{ v.open || 0 }}% open</span>
            </div>
            <div v-if="ab.status==='running' && !ab.winner" style="margin-top:8px;">
              <button class="act" @click="pickWinner(ab, lbl)">Pick as Winner</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New A/B Test modal -->
    <Teleport to="body">
      <div v-if="newOpen" class="modal-bd" @click="newOpen = false">
        <div class="modal" @click.stop>
          <div class="modal-head"><span>New A/B Test</span><button @click="newOpen = false">×</button></div>
          <div class="modal-body">
            <div class="field"><label class="lbl">Test Name</label><input v-model="newForm.name" class="inp" placeholder="e.g. Subject line test" /></div>
            <div class="field"><label class="lbl">Campaign</label><input v-model="newForm.campaign" class="inp" placeholder="Campaign name" /></div>
            <div class="field"><label class="lbl">Variant A Label</label><input v-model="newForm.variant_a.label" class="inp" placeholder="e.g. 'Flash Sale Ends Tonight!'" /></div>
            <div class="field"><label class="lbl">Variant B Label</label><input v-model="newForm.variant_b.label" class="inp" placeholder="e.g. 'Last Chance — 40% Off'" /></div>
          </div>
          <div class="modal-foot">
            <button class="btn-primary" @click="saveTest">Create Test</button>
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
</style>
