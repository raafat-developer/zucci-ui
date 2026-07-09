<script setup>
import { ref, reactive } from 'vue';
import { TEAMS, ASSIGNEES } from '@/data/ticketsData';

defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['close', 'save']);

const form = reactive({
  subject: '', cat: 'Orders', priority: 'medium',
  entity: '', market: 'AE', order_ref: '', team: 'Operations',
  assignee: 'Unassigned', notes: '',
});

function save() {
  emit('save', {
    ...form,
    id: 'TKT-' + (4800 + Math.floor(Math.random() * 99)),
    status: 'open', created: 'Just now', updated: 'Just now',
    sla_hours: 24, sla_remaining: 24, tags: [], csat: null,
  });
  Object.assign(form, { subject:'', cat:'Orders', priority:'medium', entity:'', market:'AE', order_ref:'', team:'Operations', assignee:'Unassigned', notes:'' });
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="nt-backdrop" @click="emit('close')">
      <div class="nt-modal" @click.stop>
        <div class="nt-head"><span>New Ticket</span><button @click="emit('close')">×</button></div>
        <div class="nt-body">
          <div class="nt-field"><label class="nt-lbl">Subject *</label><input v-model="form.subject" class="nt-inp" placeholder="Brief description of the issue…" /></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div class="nt-field">
              <label class="nt-lbl">Category</label>
              <select v-model="form.cat" class="nt-inp">
                <option v-for="c in ['Orders','Finance','Brand','KYC/KYB','Tech','Logistics']" :key="c">{{ c }}</option>
              </select>
            </div>
            <div class="nt-field">
              <label class="nt-lbl">Priority</label>
              <select v-model="form.priority" class="nt-inp">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div class="nt-field">
              <label class="nt-lbl">Market</label>
              <select v-model="form.market" class="nt-inp">
                <option v-for="m in ['AE','SA','EG','KW','BH','QA','OM']" :key="m">{{ m }}</option>
              </select>
            </div>
            <div class="nt-field">
              <label class="nt-lbl">Team</label>
              <select v-model="form.team" class="nt-inp">
                <option v-for="t in TEAMS" :key="t">{{ t }}</option>
              </select>
            </div>
            <div class="nt-field">
              <label class="nt-lbl">Assignee</label>
              <select v-model="form.assignee" class="nt-inp">
                <option v-for="a in ASSIGNEES" :key="a">{{ a }}</option>
              </select>
            </div>
            <div class="nt-field">
              <label class="nt-lbl">Linked Order / Ref</label>
              <input v-model="form.order_ref" class="nt-inp" placeholder="e.g. ORD-18820" />
            </div>
          </div>
          <div class="nt-field"><label class="nt-lbl">Entity / Vendor / Customer</label><input v-model="form.entity" class="nt-inp" placeholder="Company or customer name…" /></div>
          <div class="nt-field"><label class="nt-lbl">Notes</label><textarea v-model="form.notes" class="nt-inp" rows="3" style="height:auto;resize:vertical;" placeholder="Additional context…" /></div>
        </div>
        <div class="nt-foot">
          <button class="nt-btn-primary" :disabled="!form.subject" :style="{ opacity: form.subject ? 1 : 0.4 }" @click="save">Create Ticket</button>
          <button class="nt-btn-ghost" @click="emit('close')">Cancel</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.nt-backdrop { position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center; }
.nt-modal { width:560px;max-height:90vh;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;display:flex;flex-direction:column; }
.nt-head { padding:16px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:var(--zg-text); }
.nt-head button { width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim); }
.nt-body { padding:16px 20px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:12px; }
.nt-foot { padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px; }
.nt-field { display:flex;flex-direction:column;gap:4px; }
.nt-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.nt-inp { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
.nt-btn-primary { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }
.nt-btn-ghost { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
</style>
