<script setup>
import { ref, reactive } from 'vue';
import CarrierConfigDrawer from '../drawers/CarrierConfigDrawer.vue';
import AddCarrierModal     from '../drawers/AddCarrierModal.vue';
import SToggle from '../SToggle.vue';

const carriers = reactive([
  { id:'aramex', name:'Aramex',       markets:['AE','SA','EG','KW','BH','QA','OM'], services:['standard','express','same_day'], cod:true,  status:'active'  },
  { id:'smsa',   name:'SMSA Express', markets:['SA'],                               services:['standard','express'],            cod:true,  status:'active'  },
  { id:'bosta',  name:'Bosta',        markets:['EG'],                               services:['standard','express'],            cod:true,  status:'active'  },
  { id:'dhl',    name:'DHL',          markets:['AE','SA','EG'],                     services:['express','international'],       cod:false, status:'active'  },
  { id:'naqel',  name:'Naqel',        markets:['SA','AE'],                          services:['standard'],                      cod:true,  status:'pending' },
]);

const STATUS_COLORS = { active:'var(--zg-good)', pending:'var(--zg-warn)', inactive:'var(--zg-danger)' };
const configCarrier = ref(null);
const addOpen       = ref(false);

function saveCarrier(updated) {
  const idx = carriers.findIndex(c => c.id === updated.id);
  if (idx >= 0) Object.assign(carriers[idx], updated);
}
function addCarrier(carrier) { carriers.push(carrier); }
function toggleStatus(c) { c.status = c.status === 'active' ? 'inactive' : 'active'; }
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Shipping Providers</div><div class="zset-content-sub">Carrier integrations, services, and COD configuration</div></div>
      <button class="zwh-btn-primary" @click="addOpen = true">+ Add Carrier</button>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;">
      <div v-for="c in carriers" :key="c.id"
        style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <span style="font-size:13px;font-weight:700;color:var(--zg-text);">{{ c.name }}</span>
            <span style="font-size:11px;font-weight:600;" :style="{ color: STATUS_COLORS[c.status] }">{{ c.status }}</span>
            <span v-if="c.cod" style="font-size:10px;padding:1px 6px;border-radius:2px;background:oklch(0.82 0.14 215 / 0.12);color:oklch(0.82 0.14 215);font-weight:600;">COD</span>
          </div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            <span v-for="m in c.markets" :key="m" style="height:16px;padding:0 5px;border-radius:2px;background:oklch(0.78 0.18 130 / 0.1);color:var(--zg-accent);font-size:9.5px;font-family:var(--zg-mono);font-weight:700;display:inline-flex;align-items:center;">{{ m }}</span>
            <span v-for="svc in c.services" :key="svc" style="height:16px;padding:0 5px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:9.5px;color:var(--zg-text-dim);display:inline-flex;align-items:center;">{{ svc }}</span>
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="zcat-act" @click="configCarrier = c">Configure</button>
          <button class="zcat-act" :class="{ danger: c.status === 'active' }" @click="toggleStatus(c)">{{ c.status === 'active' ? 'Disable' : 'Enable' }}</button>
        </div>
      </div>
    </div>

    <CarrierConfigDrawer v-if="configCarrier" :carrier="configCarrier" @close="configCarrier = null" @save="saveCarrier" />
    <AddCarrierModal     v-if="addOpen"                               @close="addOpen = false"       @save="addCarrier" />
  </div>
</template>
<style scoped>
.zcat-act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.zcat-act.danger { color:var(--zg-danger); }
</style>
