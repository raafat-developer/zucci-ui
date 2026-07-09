<script setup>
import { ref, reactive } from 'vue';
import { COMMISSION_RULES } from '@/data/marketplaceData';

const rules   = reactive(COMMISSION_RULES.map(r => ({ ...r })));
const editRule = ref(null);
const addOpen  = ref(false);

// Simple add/edit form
const form = ref({ cat:'', market:'all', rate:'', vendor_override:'', notes:'' });

function openAdd() { form.value = { cat:'', market:'all', rate:'', vendor_override:'', notes:'' }; addOpen.value = true; }
function openEdit(r) { form.value = { ...r }; editRule.value = r.id; }
function saveRule() {
  if (editRule.value) {
    const idx = rules.findIndex(r => r.id === editRule.value);
    if (idx >= 0) Object.assign(rules[idx], { ...form.value });
  } else {
    rules.push({ ...form.value, id: 'r-' + Date.now() });
  }
  addOpen.value = false; editRule.value = null;
}
function deleteRule(id) { const idx = rules.findIndex(r => r.id === id); if (idx >= 0) rules.splice(idx, 1); }
</script>

<template>
  <div class="zcat-content">
    <div style="display:flex;justify-content:flex-end;gap:6px;margin-bottom:12px;">
      <button class="zwh-btn-primary" @click="openAdd">+ Add Rule</button>
    </div>

    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
      <div style="display:grid;grid-template-columns:1fr 80px 80px 140px 1fr 120px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;gap:10px;">
        <span>Category</span><span>Market</span><span>Rate</span><span>Vendor Override</span><span>Notes</span><span>Actions</span>
      </div>
      <div v-for="r in rules" :key="r.id"
        style="display:grid;grid-template-columns:1fr 80px 80px 140px 1fr 120px;padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);align-items:center;font-size:12px;gap:10px;">
        <span style="font-weight:600;color:var(--zg-text);">{{ r.cat }}</span>
        <span style="font-family:var(--zg-mono);font-size:11px;font-weight:700;" :style="{ color: r.market==='all'?'var(--zg-text-dim)':'var(--zg-accent)' }">
          {{ r.market === 'all' ? 'Global' : r.market }}
        </span>
        <span style="font-family:var(--zg-mono);font-size:14px;font-weight:800;color:var(--zg-accent);">{{ r.rate }}%</span>
        <span style="font-size:11px;" :style="{ color: r.vendor_override?'var(--zg-warn)':'var(--zg-text-dim)' }">{{ r.vendor_override || '—' }}</span>
        <span style="font-size:11px;color:var(--zg-text-dim);">{{ r.notes }}</span>
        <div style="display:flex;gap:4px;">
          <button class="zcat-act" @click="openEdit(r)">Edit</button>
          <button class="zcat-act danger" @click="deleteRule(r.id)">Delete</button>
        </div>
      </div>
    </div>

    <div style="margin-top:14px;padding:12px 16px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-text-dim);line-height:1.6;">
      Rules are evaluated from most specific to most general. Vendor overrides take priority over category rules, which take priority over global defaults.
    </div>

    <!-- Add / Edit Drawer -->
    <Teleport to="body">
      <div v-if="addOpen || editRule" class="mkt-modal-backdrop" @click="addOpen=false;editRule=null;">
        <div class="mkt-modal" @click.stop>
          <div class="mkt-modal-head">
            <span>{{ editRule ? 'Edit Commission Rule' : 'Add Commission Rule' }}</span>
            <button @click="addOpen=false;editRule=null;">×</button>
          </div>
          <div class="mkt-modal-body">
            <div style="display:flex;flex-direction:column;gap:12px;">
              <div>
                <label class="mkt-field-lbl">Category</label>
                <input v-model="form.cat" class="mkt-input" placeholder="e.g. Women's Fashion" />
              </div>
              <div>
                <label class="mkt-field-lbl">Market</label>
                <select v-model="form.market" class="mkt-input">
                  <option value="all">Global (all markets)</option>
                  <option v-for="m in ['AE','SA','EG','KW','BH','QA','OM']" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
              <div>
                <label class="mkt-field-lbl">Commission Rate (%)</label>
                <input v-model="form.rate" type="number" class="mkt-input" placeholder="e.g. 12" />
              </div>
              <div>
                <label class="mkt-field-lbl">Vendor Override (optional)</label>
                <input v-model="form.vendor_override" class="mkt-input" placeholder="e.g. Hessa Fashion 10%" />
              </div>
              <div>
                <label class="mkt-field-lbl">Notes</label>
                <input v-model="form.notes" class="mkt-input" placeholder="Optional note…" />
              </div>
            </div>
          </div>
          <div class="mkt-modal-foot">
            <button class="zwh-btn-primary" @click="saveRule">Save Rule</button>
            <button class="zwh-btn-ghost" @click="addOpen=false;editRule=null;">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mkt-field-lbl { display:block;font-size:10.5px;font-weight:600;color:var(--zg-text-mid);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.05em; }
.mkt-input { width:100%;height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box; }
.mkt-modal-backdrop { position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center; }
.mkt-modal { width:480px;max-height:85vh;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;display:flex;flex-direction:column; }
.mkt-modal-head { padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:var(--zg-text); }
.mkt-modal-head button { width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim); }
.mkt-modal-body { padding:16px 20px;overflow-y:auto;flex:1; }
.mkt-modal-foot { padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px; }
.zcat-act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.zcat-act.danger { color:var(--zg-danger);border-color:oklch(0.70 0.18 25 / 0.4); }
.zwh-btn-primary { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }
.zwh-btn-ghost { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
</style>
