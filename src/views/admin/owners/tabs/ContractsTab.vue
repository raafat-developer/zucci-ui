<script setup>
import { ref } from 'vue';
const props = defineProps({ entity: { type: Object, required: true } });
const c = props.entity.contract || {};
const addOpen = ref(false);
const STATUS_CLS = { active:'zen-bst--active', expired:'zen-bst--suspended', pending:'zen-bst--pending' };
</script>
<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">Contracts</div><button class="zen-btn-primary" @click="addOpen=true">+ New Contract</button></div>
    <div v-if="c.type" class="zen-card">
      <div class="zen-card-head"><span class="zen-card-title">Active Contract</span><span :class="`zen-bst ${STATUS_CLS[c.status]||'zen-bst--inactive'}`">{{ c.status }}</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;">
        <div v-for="[l,v] in [['Type',c.type],['Start Date',c.startDate],['Renewal Date',c.renewalDate],['Commission Tier',c.commissionTier],['Signed By',c.signedBy],['Signed Date',c.signedDate]]" :key="l" class="zen-cd-field">
          <div class="zen-field-label">{{ l }}</div><div class="zen-field-val">{{ v }}</div>
        </div>
        <div style="grid-column:1/-1;" class="zen-cd-field"><div class="zen-field-label">Notes</div><div class="zen-field-val" style="color:var(--zg-text-mid);font-size:11.5px;">{{ c.notes }}</div></div>
      </div>
      <div style="display:flex;gap:6px;margin-top:12px;">
        <button class="zen-doc-card-btn">Download PDF</button>
        <button class="zen-doc-card-btn">Request Renewal</button>
        <button class="zen-doc-card-btn" style="color:var(--zg-danger);">Terminate</button>
      </div>
    </div>
    <div v-else class="zen-tab-ph"><div class="zen-tab-ph-label">No contract on file</div><button class="zen-btn-primary" style="margin-top:10px;" @click="addOpen=true">Create Contract</button></div>
    <Teleport to="body">
      <div v-if="addOpen" style="position:fixed;inset:0;z-index:9300;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="addOpen=false">
        <div style="width:480px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,12px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);font-size:14px;font-weight:700;color:var(--zg-text);display:flex;justify-content:space-between;">New Contract<button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="addOpen=false">×</button></div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><label class="zen-field-label">Contract Type</label><select class="zen-field-input" style="cursor:pointer;"><option>Consignment</option><option>Wholesale</option><option>Dropship</option></select></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div><label class="zen-field-label">Start Date</label><input class="zen-field-input" type="date" /></div>
              <div><label class="zen-field-label">Duration (years)</label><input class="zen-field-input" type="number" value="1" /></div>
              <div><label class="zen-field-label">Commission %</label><input class="zen-field-input" type="number" value="12" /></div>
            </div>
            <div><label class="zen-field-label">Notes</label><textarea class="zen-field-textarea" rows="2" /></div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;"><button class="zen-btn-primary" @click="addOpen=false">Create</button><button class="zen-doc-card-btn" @click="addOpen=false">Cancel</button></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>