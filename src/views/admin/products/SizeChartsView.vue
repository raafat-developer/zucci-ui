<script setup>
/**
 * SizeChartsView — Size Charts module (faithful port of
 * ZucciSizeChartsModule from zucci-size-guides.jsx). KPI strip, search +
 * status/size-type filters, table (view/approve/log), detail/edit drawer,
 * activity log drawer, upload drawer (CSV or manual build).
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ZC_SIZE_CHARTS, ZC_SIZE_TYPES } from '@/data/sizeGuidesData';
import SizeChartDetailDrawer from './sizecharts/SizeChartDetailDrawer.vue';
import ActivityLogDrawer from './sizecharts/ActivityLogDrawer.vue';
import UploadChartDrawer from './sizecharts/UploadChartDrawer.vue';
import { toast } from '@/composables/useToast';

const router = useRouter();
function fmtDt(s) { return s ? new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; }

const charts = ref((ZC_SIZE_CHARTS || []).map((c) => ({ ...c })));
const typeF = ref('all');
const statusF = ref('all');
const search = ref('');
const detail = ref(null);
const logChart = ref(null);
const uploadOpen = ref(false);
const IS_SUPER_ADMIN = true;

const types = computed(() => [...new Set(charts.value.map((c) => c.size_type))]);
const filtered = computed(() => {
  const sq = search.value.toLowerCase();
  return charts.value.filter((c) =>
    (typeF.value === 'all' || c.size_type === typeF.value) &&
    (statusF.value === 'all' || c.status === statusF.value) &&
    (!sq || c.name?.toLowerCase().includes(sq) || c.brand?.toLowerCase().includes(sq) || c.category?.toLowerCase().includes(sq)),
  );
});

const approve = (id) => { charts.value = charts.value.map((c) => (c.id === id ? { ...c, status: 'approved', approved_by: 'Super Admin', approved_at: new Date().toISOString() } : c)); toast.success('Size chart approved'); };
const reject = (id) => { charts.value = charts.value.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c)); toast.warn('Size chart rejected'); };

const handleUploaded = (newChart) => {
  const id = `SC-${String(Date.now()).slice(-3)}`;
  charts.value = [{ id, name: `${newChart.brand} ${newChart.cat} Size Chart`, brand: newChart.brand, category: newChart.cat, size_type: newChart.sizeType, status: 'pending', is_zucci_master: false, uploaded_by: 'Super Admin', uploaded_at: new Date().toISOString(), approved_by: null, approved_at: null, rows: newChart.rows }, ...charts.value];
};

const sizeTypeLabel = (t) => (ZC_SIZE_TYPES || {})[t]?.label || t;
</script>

<template>
  <div class="zcat-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="zwh-bc-back" @click="router.push('/admin/products')"><svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14" /></svg> Products</button>
          <span style="color:var(--zg-text-xdim);font-size:11px">/</span>
          <span style="font-size:13px;font-weight:600;color:var(--zg-text)">Size Charts</span>
        </div>
        <div class="zwh-subtitle">{{ charts.length }} charts · {{ charts.filter((c) => c.status === 'pending').length }} pending approval</div>
      </div>
      <div class="zwh-header-right">
        <button class="zwh-btn-primary" @click="uploadOpen = true">Upload Chart</button>
      </div>
    </div>

    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Total Charts</span><span class="zwh-kpi-val">{{ charts.length }}</span><span class="zwh-kpi-sub">all brands</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Pending</span><span class="zwh-kpi-val" :class="{ 'is-warn': charts.filter((c) => c.status === 'pending').length > 0 }">{{ charts.filter((c) => c.status === 'pending').length }}</span><span class="zwh-kpi-sub">need review</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Approved</span><span class="zwh-kpi-val is-good">{{ charts.filter((c) => c.status === 'approved').length }}</span><span class="zwh-kpi-sub">live</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Brands</span><span class="zwh-kpi-val">{{ new Set(charts.map((c) => c.brand)).size }}</span><span class="zwh-kpi-sub">with charts</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Size Types</span><span class="zwh-kpi-val is-accent">{{ Object.keys(ZC_SIZE_TYPES || {}).length }}</span><span class="zwh-kpi-sub">supported</span></div>
    </div>

    <div class="zcat-content">
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <div style="position:relative;flex-shrink:0">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);pointer-events:none"><circle cx="5.5" cy="5.5" r="4" /><path d="M9.5 9.5l3 3" /></svg>
          <input v-model="search" placeholder="Search by brand, chart name, category…" style="height:30px;padding-left:26px;padding-right:10px;width:260px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-sans);font-size:12px;color:var(--zg-text);outline:none" />
          <button v-if="search" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);border:none;background:transparent;color:var(--zg-text-dim);cursor:pointer;font-size:14px;line-height:1" @click="search = ''">×</button>
        </div>
        <button v-for="[v, l] in [['all','All'],['approved','Approved'],['pending','Pending'],['rejected','Rejected']]" :key="v" class="zwh-filter-chip" :class="{ 'is-active': statusF === v }" @click="statusF = v">{{ l }}</button>
        <div class="zwh-filter-sep" />
        <button class="zwh-filter-chip" :class="{ 'is-active': typeF === 'all' }" @click="typeF = 'all'">All Types</button>
        <button v-for="t in types" :key="t" class="zwh-filter-chip" :class="{ 'is-active': typeF === t }" @click="typeF = typeF === t ? 'all' : t">{{ sizeTypeLabel(t) }}</button>
      </div>

      <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div class="zsc-head"><span>Chart / Brand</span><span>Category</span><span>Size Type</span><span>Status</span><span>Uploaded By</span><span>Approved By</span><span>Date</span><span>Actions</span></div>
        <div v-if="!filtered.length" style="padding:40px 20px;text-align:center;color:var(--zg-text-dim);font-size:12px">No charts match filter</div>
        <div v-for="c in filtered" :key="c.id" class="zsc-row" style="cursor:pointer" @click="detail = c">
          <div style="overflow:hidden">
            <div style="font-size:12.5px;font-weight:600;color:var(--zg-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
              <span v-if="c.is_zucci_master" style="color:var(--zg-accent);margin-right:4px;font-size:10px;font-weight:700">MASTER</span>{{ c.name }}
            </div>
            <div style="font-size:11px;color:var(--zg-text-dim);margin-top:1px">{{ c.brand }}</div>
          </div>
          <span style="font-size:12px;color:var(--zg-text-mid)">{{ c.category }}</span>
          <span style="font-size:11.5px;color:var(--zg-text-dim)">{{ sizeTypeLabel(c.size_type) }}</span>
          <span class="zcat-badge" :class="c.status">{{ c.status.charAt(0).toUpperCase() + c.status.slice(1) }}</span>
          <span style="font-size:11.5px;color:var(--zg-text-mid)">{{ c.uploaded_by || '—' }}</span>
          <span style="font-size:11.5px;color:var(--zg-text-mid)">{{ c.approved_by || '—' }}</span>
          <span style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim)">{{ fmtDt(c.uploaded_at) }}</span>
          <div style="display:flex;gap:4px" @click.stop>
            <button class="zcat-act" @click="detail = c">View</button>
            <button v-if="c.status === 'pending'" class="zcat-act" style="border-color:oklch(0.78 0.15 150 / 0.4);color:var(--zg-good)" @click="approve(c.id)">Approve</button>
            <button class="zcat-act" @click="logChart = c">Log</button>
          </div>
        </div>
      </div>
    </div>

    <SizeChartDetailDrawer :open="!!detail" :chart="detail" :is-super-admin="IS_SUPER_ADMIN" @close="detail = null" @approve="approve" @reject="reject" @log-open="logChart = detail; detail = null" />
    <ActivityLogDrawer :open="!!logChart" :chart="logChart" @close="logChart = null" />
    <UploadChartDrawer :open="uploadOpen" @close="uploadOpen = false" @uploaded="handleUploaded" />
  </div>
</template>
