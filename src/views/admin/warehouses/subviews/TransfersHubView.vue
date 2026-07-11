<script setup>
import { ref, computed } from 'vue';
import { ZCW_TRANSFERS, ZCW_WAREHOUSES } from '@/data/warehouseData';
const emit = defineEmits(['back']);
const filter = ref('all');
const STATUS_MAP = { requested:{label:'Requested',color:'var(--zg-text-dim)',bg:'var(--zg-panel-hi)'}, approved:{label:'Approved',color:'oklch(0.82 0.14 215)',bg:'oklch(0.82 0.14 215 / 0.12)'}, packing:{label:'Packing',color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.12)'}, in_transit:{label:'In Transit',color:'var(--zg-accent)',bg:'oklch(0.78 0.18 130 / 0.12)'}, completed:{label:'Completed',color:'var(--zg-good)',bg:'oklch(0.78 0.15 150 / 0.1)'} };
const sm = s => STATUS_MAP[s] || STATUS_MAP.requested;
const whs = ZCW_WAREHOUSES;
const whName = id => whs.find(w => w.id === id)?.name || id;
const all = computed(() => ZCW_TRANSFERS || []);
const items = computed(() => filter.value === 'all' ? all.value : all.value.filter(t => t.status === filter.value));
const kpis = computed(() => ({ total:all.value.length, inTransit:all.value.filter(t=>t.status==='in_transit').length, pending:all.value.filter(t=>['requested','approved'].includes(t.status)).length, completed:all.value.filter(t=>t.status==='completed').length }));
const newOpen = ref(false);
const tf = ref({ from_id:'', to_id:'', units:1, notes:'' });
</script>
<template>
  <div class="zwh-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <button class="zwh-bc-back" @click="emit('back')"><svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14"/></svg> Warehouses</button>
        <div class="zwh-title" style="margin-left:10px;">Transfers Hub</div>
        <div class="zwh-subtitle">{{ kpis.total }} transfers · {{ kpis.inTransit }} in transit</div>
      </div>
      <button class="zwh-btn-primary" @click="newOpen=true">+ New Transfer</button>
    </div>
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Total</span><span class="zwh-kpi-val is-accent">{{ kpis.total }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Pending Approval</span><span class="zwh-kpi-val">{{ kpis.pending }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">In Transit</span><span class="zwh-kpi-val is-warn">{{ kpis.inTransit }}</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Completed</span><span class="zwh-kpi-val is-good">{{ kpis.completed }}</span></div>
    </div>
    <div class="zwh-filters">
      <button v-for="[v,l] in [['all','All'],['requested','Requested'],['approved','Approved'],['packing','Packing'],['in_transit','In Transit'],['completed','Completed']]" :key="v"
        class="zwh-filter-chip" :class="{ 'is-active': filter===v }" @click="filter=v">{{ l }}</button>
    </div>
    <div class="zwh-content"><div class="zwh-content-pad">
      <div class="zwh-list-table">
        <div class="zwh-list-head">
          <span class="zwh-col w100">Transfer ID</span><span class="zwh-col">From</span><span class="zwh-col">To</span><span class="zwh-col w60 right">Units</span><span class="zwh-col w80">Customs</span><span class="zwh-col w100">ETA</span><span class="zwh-col w110">Status</span>
        </div>
        <div v-for="t in items" :key="t.id" class="zwh-list-row">
          <span class="zwh-col w100 zwh-mono" style="font-size:10.5px;">{{ t.id }}</span>
          <span class="zwh-col" style="font-size:11.5px;color:var(--zg-text);">{{ whName(t.from_id) }}</span>
          <span class="zwh-col" style="font-size:11.5px;color:var(--zg-text);">{{ whName(t.to_id) }}</span>
          <span class="zwh-col w60 right zwh-mono">{{ t.total_units }}</span>
          <span class="zwh-col w80"><span v-if="t.customs" style="font-size:9.5px;padding:1px 5px;border-radius:2px;font-weight:600;background:oklch(0.82 0.14 215 / 0.12);color:oklch(0.82 0.14 215);">{{ t.customs }}</span><span v-else style="color:var(--zg-text-dim);font-size:11px;">N/A</span></span>
          <span class="zwh-col w100" style="font-size:11px;color:var(--zg-text-dim);">{{ t.eta }}</span>
          <span class="zwh-col w110"><span class="zwh-badge" :style="{ color:sm(t.status).color, background:sm(t.status).bg }">{{ sm(t.status).label }}</span></span>
        </div>
        <div v-if="!items.length" class="zwh-empty"><div class="zwh-empty-title">No transfers match</div></div>
      </div>
    </div></div>
    <Teleport to="body">
      <div v-if="newOpen" style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="newOpen=false">
        <div style="width:460px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,12px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);font-size:14px;font-weight:700;color:var(--zg-text);display:flex;justify-content:space-between;">New Transfer <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="newOpen=false">×</button></div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><label class="zwh-field-label">From Warehouse</label><select v-model="tf.from_id" class="zwh-field-input" style="cursor:pointer;"><option value="">Select…</option><option v-for="w in whs" :key="w.id" :value="w.id">{{ w.flag }} {{ w.name }}</option></select></div>
            <div><label class="zwh-field-label">To Warehouse</label><select v-model="tf.to_id" class="zwh-field-input" style="cursor:pointer;"><option value="">Select…</option><option v-for="w in whs.filter(w=>w.id!==tf.from_id)" :key="w.id" :value="w.id">{{ w.flag }} {{ w.name }}</option></select></div>
            <div><label class="zwh-field-label">Estimated Units</label><input class="zwh-field-input" type="number" v-model.number="tf.units" /></div>
            <div><label class="zwh-field-label">Notes</label><textarea class="zwh-field-textarea" v-model="tf.notes" rows="2" /></div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;"><button class="zwh-btn-primary" :disabled="!tf.from_id||!tf.to_id" :style="{ opacity:tf.from_id&&tf.to_id?1:0.4 }" @click="newOpen=false">Create Transfer</button><button class="zwh-btn-ghost" @click="newOpen=false">Cancel</button></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
