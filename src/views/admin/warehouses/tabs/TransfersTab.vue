<script setup>
import { ref, computed } from 'vue';
import { ZCW_TRANSFERS, ZCW_WAREHOUSES } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });
const filter = ref('all');

const STATUS_MAP = {
  requested:   { label:'Requested',  color:'var(--zg-text-dim)',   bg:'var(--zg-panel-hi)' },
  approved:    { label:'Approved',   color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.12)' },
  packing:     { label:'Packing',    color:'var(--zg-warn)',        bg:'oklch(0.82 0.15 75 / 0.12)' },
  in_transit:  { label:'In Transit', color:'var(--zg-accent)',      bg:'oklch(0.78 0.18 130 / 0.12)' },
  completed:   { label:'Completed',  color:'var(--zg-good)',        bg:'oklch(0.78 0.15 150 / 0.1)' },
};
const sm = s => STATUS_MAP[s] || STATUS_MAP.requested;

const whName = id => ZCW_WAREHOUSES.find(w => w.id === id)?.name || id;

const all   = computed(() => (ZCW_TRANSFERS || []).filter(t => t.from_id === props.wh.id || t.to_id === props.wh.id));
const items = computed(() => filter.value === 'all' ? all.value : all.value.filter(t => t.status === filter.value));

const newTransfer = ref(false);
const tf = ref({ to_id:'', items:1, notes:'' });
</script>

<template>
  <div class="zwh-tab-body">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
      <div style="display:flex;gap:5px;flex-wrap:wrap;">
        <button v-for="[v,l] in [['all','All'],['requested','Requested'],['approved','Approved'],['in_transit','In Transit'],['completed','Completed']]" :key="v"
          class="zwh-filter-chip" :class="{ 'is-active': filter === v }" @click="filter = v">{{ l }}</button>
      </div>
      <button class="zwh-btn-primary" style="height:28px;font-size:11.5px;" @click="newTransfer = true">+ New Transfer</button>
    </div>

    <div v-if="!items.length" class="zwh-empty">
      <div class="zwh-empty-title">No stock transfers</div>
      <div class="zwh-empty-sub">No transfers involving this warehouse</div>
    </div>

    <div v-else class="zwh-list-table">
      <div class="zwh-list-head">
        <span class="zwh-col w100">Transfer ID</span><span class="zwh-col">From</span><span class="zwh-col">To</span><span class="zwh-col w60 right">Units</span><span class="zwh-col w80">Customs</span><span class="zwh-col w110">ETA</span><span class="zwh-col w110">Status</span>
      </div>
      <div v-for="t in items" :key="t.id" class="zwh-list-row">
        <span class="zwh-col w100 zwh-mono" style="font-size:10.5px;">{{ t.id }}</span>
        <span class="zwh-col" style="font-size:11.5px;color:var(--zg-text);">{{ whName(t.from_id) }}</span>
        <span class="zwh-col" style="font-size:11.5px;color:var(--zg-text);">{{ whName(t.to_id) }}</span>
        <span class="zwh-col w60 right zwh-mono">{{ t.total_units }}</span>
        <span class="zwh-col w80">
          <span v-if="t.customs" style="font-size:9.5px;padding:1px 5px;border-radius:2px;font-weight:600;background:oklch(0.82 0.14 215 / 0.12);color:oklch(0.82 0.14 215);">{{ t.customs }}</span>
          <span v-else style="font-size:11px;color:var(--zg-text-dim);">N/A</span>
        </span>
        <span class="zwh-col w110" style="font-size:11px;color:var(--zg-text-dim);">{{ t.eta }}</span>
        <span class="zwh-col w110"><span class="zwh-badge" :style="{ color:sm(t.status).color, background:sm(t.status).bg }">{{ sm(t.status).label }}</span></span>
      </div>
    </div>

    <!-- New Transfer Modal -->
    <Teleport to="body">
      <div v-if="newTransfer" style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="newTransfer = false">
        <div style="width:460px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,12px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);font-size:14px;font-weight:700;color:var(--zg-text);display:flex;justify-content:space-between;align-items:center;">
            New Stock Transfer <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="newTransfer = false">×</button>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><div class="zwh-field-label">From Warehouse</div><input class="zwh-field-input" :value="wh.name" readonly style="opacity:0.6;" /></div>
            <div>
              <div class="zwh-field-label">Destination Warehouse</div>
              <select v-model="tf.to_id" class="zwh-field-input" style="cursor:pointer;">
                <option value="">Select destination…</option>
                <option v-for="w in ZCW_WAREHOUSES.filter(w => w.id !== wh.id)" :key="w.id" :value="w.id">{{ w.flag }} {{ w.name }}</option>
              </select>
            </div>
            <div><div class="zwh-field-label">Estimated Units</div><input class="zwh-field-input" type="number" v-model.number="tf.items" /></div>
            <div><div class="zwh-field-label">Notes (internal)</div><textarea v-model="tf.notes" class="zwh-field-textarea" rows="2" /></div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="zwh-btn-primary" :disabled="!tf.to_id" :style="{ opacity: tf.to_id?1:0.4 }" @click="newTransfer = false">Create Transfer</button>
            <button class="zwh-btn-ghost" @click="newTransfer = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
