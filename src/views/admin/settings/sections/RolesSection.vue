<script setup>
import { ref, reactive } from 'vue';

const ROLES = reactive([
  { id:'super_admin',   label:'Super Admin',      desc:'Full access to all modules and settings',                   users:1, color:'var(--zg-danger)' },
  { id:'tech_admin',    label:'Tech Admin',        desc:'API, webhooks, integrations, system settings',             users:1, color:'oklch(0.82 0.14 215)' },
  { id:'ops_manager',   label:'Ops Manager',       desc:'Orders, warehouses, returns, shipments',                   users:2, color:'var(--zg-accent)' },
  { id:'finance_admin', label:'Finance Admin',      desc:'Finance, payouts, reconciliation, tax',                   users:1, color:'var(--zg-warn)' },
  { id:'marketing',     label:'Marketing',          desc:'Promotions, comms, analytics, short links',               users:1, color:'oklch(0.78 0.15 150)' },
  { id:'cs_agent',      label:'CS Agent',           desc:'Tickets, customers — read-only order access',             users:1, color:'oklch(0.82 0.14 215)' },
  { id:'brand_manager', label:'Brand Manager',      desc:'Marketplace listings, KYB, contracts',                    users:0, color:'var(--zg-text-dim)' },
]);

const PERMISSIONS = {
  super_admin:   { orders:'full', products:'full', finance:'full', customers:'full', settings:'full', analytics:'full' },
  tech_admin:    { orders:'read', products:'read', finance:'none', customers:'none', settings:'full', analytics:'read' },
  ops_manager:   { orders:'full', products:'write', finance:'read', customers:'read', settings:'none', analytics:'read' },
  finance_admin: { orders:'read', products:'none', finance:'full', customers:'read', settings:'none', analytics:'full' },
  marketing:     { orders:'read', products:'read', finance:'none', customers:'read', settings:'none', analytics:'full' },
  cs_agent:      { orders:'read', products:'none', finance:'none', customers:'full', settings:'none', analytics:'none' },
  brand_manager: { orders:'none', products:'full', finance:'none', customers:'none', settings:'none', analytics:'read' },
};

const editRole = ref(null);
const PERM_LEVELS = ['none','read','write','full'];
const PERM_COLOR = { none:'var(--zg-text-dim)', read:'oklch(0.82 0.14 215)', write:'var(--zg-warn)', full:'var(--zg-good)' };
const MODULES = ['orders','products','finance','customers','settings','analytics'];
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div>
        <div class="zset-content-title">Roles &amp; Permissions</div>
        <div class="zset-content-sub">Define what each role can see and do across the platform</div>
      </div>
      <button class="btn-primary" @click="">+ Create Role</button>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;">
      <div v-for="role in ROLES" :key="role.id"
        style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px 16px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:10px;height:10px;border-radius:50%;flex-shrink:0;" :style="{ background: role.color }" />
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--zg-text);">{{ role.label }}</div>
              <div style="font-size:11.5px;color:var(--zg-text-dim);margin-top:2px;">{{ role.desc }}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
            <span style="font-size:11px;color:var(--zg-text-dim);font-family:var(--zg-mono);">{{ role.users }} user{{ role.users !== 1 ? 's' : '' }}</span>
            <button class="act-btn" @click="editRole = editRole === role.id ? null : role.id">
              {{ editRole === role.id ? 'Done' : 'Edit Permissions' }}
            </button>
          </div>
        </div>

        <!-- Permission grid -->
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">
          <div v-for="mod in MODULES" :key="mod">
            <div style="font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:4px;text-align:center;">{{ mod }}</div>
            <template v-if="editRole === role.id">
              <select
                :value="PERMISSIONS[role.id]?.[mod] || 'none'"
                @change="e => { if (!PERMISSIONS[role.id]) PERMISSIONS[role.id] = {}; PERMISSIONS[role.id][mod] = e.target.value; }"
                style="width:100%;height:26px;padding:0 4px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:3px;font-size:10px;cursor:pointer;outline:none;text-align:center;">
                <option v-for="l in PERM_LEVELS" :key="l" :value="l">{{ l }}</option>
              </select>
            </template>
            <div v-else style="height:26px;display:flex;align-items:center;justify-content:center;border-radius:3px;font-size:10px;font-weight:700;"
              :style="{ background: (PERM_COLOR[PERMISSIONS[role.id]?.[mod]] || PERM_COLOR.none) + '18', color: PERM_COLOR[PERMISSIONS[role.id]?.[mod]] || PERM_COLOR.none }">
              {{ PERMISSIONS[role.id]?.[mod] || 'none' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.act-btn { height:28px;padding:0 12px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;cursor:pointer;font-size:11.5px;color:var(--zg-text-mid); }
.act-btn:hover { border-color:var(--zg-accent);color:var(--zg-accent); }
</style>
