<script setup>
/**
 * VariantRequestsView — Variant Requests module. Faithful port of
 * ZucciVariantRequestsModule from zucci-variants.jsx: KPI strip, status
 * filter chips with counts, table (product/brand, variant type, requested
 * values, submitted, status), detail/approval drawer.
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ZC_VARIANT_REQUESTS } from '@/data/sizeGuidesData';
import VRDetailDrawer from './variants/VRDetailDrawer.vue';
import { toast } from '@/composables/useToast';

const router = useRouter();
function vTimeAgo(iso) { if (!iso) return '—'; const m = Math.floor((Date.now() - new Date(iso)) / 60000); return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.floor(m / 60)}h ago` : `${Math.floor(m / 1440)}d ago`; }

const reqs = ref((ZC_VARIANT_REQUESTS || []).map((r) => ({ ...r })));
const statusF = ref('all');
const detail = ref(null);

const countFor = (s) => reqs.value.filter((r) => r.status === s).length;
const filtered = computed(() => reqs.value.filter((r) => statusF.value === 'all' || r.status === statusF.value));

const SM = { pending:'inactive', cat_review:'pending', ops_review:'pending', approved:'approved', rejected:'rejected' };
const SL = { pending:'Pending', cat_review:'Cat. Review', ops_review:'Ops Review', approved:'Approved', rejected:'Rejected' };

const handleAction = (id, action, note) => {
  const now = new Date().toISOString();
  reqs.value = reqs.value.map((r) => {
    if (r.id !== id) return r;
    if (action === 'assign') { toast.info('Assigned to Category Manager'); return { ...r, status: 'cat_review' }; }
    if (action === 'cat_approve') { toast.success('Approved — sent to Ops'); return { ...r, status: 'ops_review', steps: r.steps.map((s, i) => (i === 1 ? { ...s, actor: 'Category Manager', at: now, note: note || 'Approved' } : s)) }; }
    if (action === 'ops_approve') { toast.success('Approved — vendor notified'); return { ...r, status: 'approved', steps: r.steps.map((s, i) => (i === 2 ? { ...s, actor: 'Ops Admin', at: now, note: note || 'Confirmed.' } : s)) }; }
    if (action === 'reject') { toast.warn('Request rejected'); return { ...r, status: 'rejected', steps: r.steps.map((s) => (!s.at ? { ...s, actor: 'Reviewer', at: now, note: note || 'Rejected.' } : s)) }; }
    return r;
  });
};

const statusChips = computed(() => [['all','All',reqs.value.length],['pending','Pending',countFor('pending')],['cat_review','Cat. Review',countFor('cat_review')],['ops_review','Ops Review',countFor('ops_review')],['approved','Approved',countFor('approved')],['rejected','Rejected',countFor('rejected')]]);
const kpis = computed(() => [
  ['Total', reqs.value.length, '', 'all requests'],
  ['Pending', countFor('pending'), countFor('pending') > 0 ? 'is-warn' : '', 'unassigned'],
  ['In Review', countFor('cat_review') + countFor('ops_review'), countFor('cat_review') + countFor('ops_review') > 0 ? 'is-accent' : '', 'cat + ops'],
  ['Approved', countFor('approved'), 'is-good', ''],
  ['Rejected', countFor('rejected'), '', ''],
]);
</script>

<template>
  <div class="zcat-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="zwh-bc-back" @click="router.push('/admin/products')"><svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14" /></svg> Products</button>
          <span style="color:var(--zg-text-xdim);font-size:11px">/</span>
          <span style="font-size:13px;font-weight:600;color:var(--zg-text)">Variant Requests</span>
        </div>
        <div class="zwh-subtitle">{{ countFor('pending') + countFor('cat_review') + countFor('ops_review') }} pending review</div>
      </div>
    </div>

    <div class="zwh-kpi-strip">
      <div v-for="[l, v, cls, sub] in kpis" :key="l" class="zwh-kpi-cell"><span class="zwh-kpi-lbl">{{ l }}</span><span class="zwh-kpi-val" :class="cls">{{ v }}</span><span class="zwh-kpi-sub">{{ sub }}</span></div>
    </div>

    <div class="zcat-content">
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button v-for="[v, l, cnt] in statusChips" :key="v" class="zwh-filter-chip" :class="{ 'is-active': statusF === v }" @click="statusF = v">{{ l }} ({{ cnt }})</button>
      </div>

      <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:80px 1.5fr 1fr 1.5fr 100px 100px;gap:10px;padding:0 14px;height:32px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span>ID</span><span>Product / Brand</span><span>Variant Type</span><span>Requested Values</span><span>Submitted</span><span>Status</span>
        </div>
        <div v-if="!filtered.length" style="padding:40px 20px;text-align:center;color:var(--zg-text-dim);font-size:12px">No requests match filter</div>
        <div v-for="req in filtered" :key="req.id" style="display:grid;grid-template-columns:80px 1.5fr 1fr 1.5fr 100px 100px;gap:10px;padding:12px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;cursor:pointer" @click="detail = req">
          <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-dim)">{{ req.id }}</span>
          <div style="overflow:hidden"><div style="font-size:12.5px;font-weight:600;color:var(--zg-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ req.product }}</div><div style="font-size:11px;color:var(--zg-text-dim);margin-top:1px">{{ req.vendor }}</div></div>
          <div><div style="font-size:12px;color:var(--zg-text-mid);font-weight:500">{{ req.variant_type_name }}</div><div style="font-size:10px;color:var(--zg-text-dim);margin-top:1px">{{ req.requested_by }}</div></div>
          <div style="display:flex;flex-wrap:wrap;gap:3px">
            <span v-for="v in (req.requested_values || []).slice(0, 3)" :key="v" style="height:18px;padding:0 7px;background:var(--zg-accent-tint);color:var(--zg-accent);border-radius:3px;font-size:10.5px;font-weight:600;display:inline-flex;align-items:center">{{ v }}</span>
            <span v-if="(req.requested_values || []).length > 3" style="font-size:10px;color:var(--zg-text-dim)">+{{ req.requested_values.length - 3 }}</span>
          </div>
          <span style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim)">{{ vTimeAgo(req.requested_at) }}</span>
          <span class="zcat-badge" :class="SM[req.status] || 'inactive'">{{ SL[req.status] || req.status }}</span>
        </div>
      </div>
    </div>

    <VRDetailDrawer :open="!!detail" :req="detail" @close="detail = null" @action="handleAction" />
  </div>
</template>
