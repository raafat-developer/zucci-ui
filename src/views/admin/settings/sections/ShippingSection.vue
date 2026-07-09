<script setup>
import { reactive } from 'vue';

const carriers = reactive([
  { id:'aramex',  name:'Aramex',        markets:['AE','SA','EG','KW','BH','QA','OM'], status:'active',  services:['standard','express','sameday'], cod:true  },
  { id:'smsa',    name:'SMSA Express',  markets:['SA'],                               status:'active',  services:['standard','express'],           cod:true  },
  { id:'bosta',   name:'Bosta',         markets:['EG'],                               status:'active',  services:['standard','express'],           cod:true  },
  { id:'dhl',     name:'DHL',           markets:['AE','SA','EG'],                     status:'active',  services:['express','international'],       cod:false },
  { id:'naqel',   name:'Naqel',         markets:['SA','AE'],                          status:'pending', services:['standard'],                     cod:true  },
]);

const STATUS_COLOR = { active:'var(--zg-good)', pending:'var(--zg-warn)', inactive:'var(--zg-danger)' };
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Shipping Providers</div><div class="zset-content-sub">Carrier integrations, services, and COD configuration</div></div>
      <button class="btn-primary" @click="">+ Add Carrier</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div v-for="c in carriers" :key="c.id" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <span style="font-size:13px;font-weight:700;color:var(--zg-text);">{{ c.name }}</span>
            <span style="font-size:11px;font-weight:600;" :style="{ color: STATUS_COLOR[c.status] }">{{ c.status }}</span>
            <span v-if="c.cod" style="font-size:10px;padding:1px 6px;border-radius:2px;background:oklch(0.82 0.14 215 / 0.12);color:oklch(0.82 0.14 215);font-weight:600;">COD</span>
          </div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            <span v-for="m in c.markets" :key="m" style="height:16px;padding:0 5px;border-radius:2px;background:oklch(0.78 0.18 130 / 0.1);color:var(--zg-accent);font-size:9.5px;font-family:var(--zg-mono);font-weight:700;display:inline-flex;align-items:center;">{{ m }}</span>
            <span v-for="svc in c.services" :key="svc" style="height:16px;padding:0 5px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:9.5px;color:var(--zg-text-dim);display:inline-flex;align-items:center;">{{ svc }}</span>
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="act" @click="">Configure</button>
          <button class="act" style="color:var(--zg-danger);" @click="c.status = c.status==='active'?'inactive':'active'">{{ c.status==='active'?'Disable':'Enable' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
</style>
