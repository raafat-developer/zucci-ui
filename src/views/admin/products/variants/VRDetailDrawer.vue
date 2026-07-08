<script setup>
/**
 * VRDetailDrawer — variant request detail + approval flow. Faithful port of
 * VRDetailDrawer from zucci-variants.jsx: info grid, requested values,
 * reason, step timeline (pending → cat_review → ops_review → approved/
 * rejected) with per-step dot state, review note, stage-appropriate actions.
 */
import { ref, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';

const props = defineProps({ open: { type: Boolean, default: false }, req: { type: Object, default: null } });
const emit = defineEmits(['close', 'action']);

const note = ref('');
watch(() => props.open, (v) => { if (v) note.value = ''; });

function vTimeAgo(iso) { if (!iso) return '—'; const m = Math.floor((Date.now() - new Date(iso)) / 60000); return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.floor(m / 60)}h ago` : `${Math.floor(m / 1440)}d ago`; }
const SM = { pending:{ label:'Pending', color:'var(--zg-text-dim)' }, cat_review:{ label:'Cat. Review', color:'var(--zg-warn)' }, ops_review:{ label:'Ops Review', color:'var(--zg-accent)' }, approved:{ label:'Approved', color:'var(--zg-good)' }, rejected:{ label:'Rejected', color:'var(--zg-danger)' } };
const sm = computed(() => SM[props.req?.status] || SM.pending);

const dotState = (step) => {
  if (!step.at) {
    if (props.req.status === 'cat_review' && step.role === 'cat_mgr') return 'active';
    if (props.req.status === 'ops_review' && step.role === 'ops') return 'active';
    if (props.req.status === 'pending' && step.role === 'vendor') return 'active';
    return 'pending';
  }
  return step.note?.toLowerCase().includes('reject') ? 'rejected' : 'done';
};
const dotBg = (ds) => (ds === 'done' ? 'var(--zg-good)' : ds === 'rejected' ? 'var(--zg-danger)' : ds === 'active' ? 'var(--zg-accent)' : 'var(--zg-panel)');

const doAction = (action) => { emit('action', props.req.id, action, note.value); emit('close'); };
</script>

<template>
  <ZDrawer v-if="req" :open="open" :title="`${req.id} — ${req.variant_type_name}`" :subtitle="`${req.product} · ${req.vendor}`" :width="620" @close="emit('close')">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div v-for="[l, val] in [['Product', req.product], ['SKU', req.product_sku], ['Brand', req.vendor], ['Requested By', req.requested_by], ['Variant Type', req.variant_type_name], ['Submitted', new Date(req.requested_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })]]" :key="l" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:9px 12px">
          <div style="font-size:10px;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:0.07em;font-weight:600;margin-bottom:3px">{{ l }}</div>
          <div style="font-size:12.5px;font-weight:600;color:var(--zg-text)">{{ val }}</div>
        </div>
        <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:9px 12px">
          <div style="font-size:10px;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:0.07em;font-weight:600;margin-bottom:3px">Status</div>
          <div style="font-size:12.5px;font-weight:700" :style="{ color: sm.color }">{{ sm.label }}</div>
        </div>
      </div>

      <div>
        <div style="font-size:10px;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:0.07em;font-weight:700;margin-bottom:8px">Requested Values</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          <span v-for="v in (req.requested_values || [])" :key="v" style="height:22px;padding:0 10px;background:var(--zg-accent-tint);color:var(--zg-accent);border-radius:3px;font-size:11px;font-weight:700;display:inline-flex;align-items:center">{{ v }}</span>
        </div>
      </div>

      <div style="padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12.5px;color:var(--zg-text-mid);line-height:1.5">{{ req.reason }}</div>

      <div>
        <div style="font-size:10px;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:0.07em;font-weight:700;margin-bottom:12px">Approval Flow</div>
        <div v-for="(step, i) in (req.steps || [])" :key="i" style="display:flex;gap:12px;padding-bottom:16px;position:relative">
          <div style="position:relative;flex-shrink:0">
            <div :style="{ width:'28px', height:'28px', borderRadius:'50%', background: dotBg(dotState(step)), border: dotState(step)==='pending' ? '1px solid var(--zg-line)' : 'none', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:700, color: dotState(step)==='pending' ? 'var(--zg-text-dim)' : dotState(step)==='active' ? 'oklch(0.18 0.04 130)' : '#fff', zIndex:1 }">
              {{ dotState(step) === 'done' ? '✓' : dotState(step) === 'rejected' ? '✕' : i + 1 }}
            </div>
            <div v-if="i < (req.steps || []).length - 1" style="position:absolute;left:13px;top:28px;width:2px;height:calc(100% - 4px);background:var(--zg-line)" />
          </div>
          <div style="flex:1;padding-top:4px">
            <div style="font-size:12.5px;font-weight:600;color:var(--zg-text)">{{ step.label }}</div>
            <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px">
              <span v-if="step.actor">By {{ step.actor }}</span><span v-else style="color:var(--zg-text-xdim)">Awaiting…</span>
              <span v-if="step.at" style="margin-left:8px">{{ vTimeAgo(step.at) }}</span>
            </div>
            <div v-if="step.note" style="font-size:12px;color:var(--zg-text-mid);margin-top:6px;padding:8px 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:3px;line-height:1.4">{{ step.note }}</div>
          </div>
        </div>
      </div>

      <div v-if="['pending','cat_review','ops_review'].includes(req.status)" style="display:flex;flex-direction:column;gap:5px">
        <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Review Note</label>
        <textarea v-model="note" placeholder="Add a review note…" style="padding:8px 10px;resize:vertical;min-height:56px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-sans);font-size:12px;color:var(--zg-text);outline:none" />
      </div>
    </div>

    <template #footer>
      <button v-if="req.status === 'pending'" class="zwh-btn-ghost" style="color:var(--zg-accent)" @click="doAction('assign')">Assign to Cat. Manager</button>
      <button v-if="req.status === 'cat_review'" class="zwh-btn-primary" @click="doAction('cat_approve')">Approve — Send to Ops</button>
      <button v-if="req.status === 'ops_review'" class="zwh-btn-primary" @click="doAction('ops_approve')">Confirm &amp; Approve</button>
      <button v-if="['cat_review','ops_review'].includes(req.status)" class="zwh-btn-ghost" style="color:var(--zg-danger)" @click="doAction('reject')">Reject</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Close</button>
    </template>
  </ZDrawer>
</template>
