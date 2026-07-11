<script setup>
import { ref, reactive } from 'vue';
import EditRolePermissionsDrawer from '../drawers/EditRolePermissionsDrawer.vue';

const ROLES = reactive([
  { id:'super_admin',   label:'Super Admin',     perms:['all'],                                  users:2 },
  { id:'ops_admin',     label:'Ops Admin',       perms:['orders','warehouse','returns'],          users:3 },
  { id:'finance_admin', label:'Finance Admin',   perms:['finance','payouts','invoices'],          users:2 },
  { id:'cs_agent',      label:'CS Agent',        perms:['tickets','orders_read','customers'],     users:4 },
  { id:'merch_manager', label:'Merch Manager',   perms:['products','categories','brands'],        users:3 },
  { id:'warehouse_ops', label:'Warehouse Ops',   perms:['warehouse','inventory'],                 users:6 },
  { id:'compliance',    label:'Compliance',      perms:['kyc','documents','brands_read'],         users:2 },
  { id:'read_only',     label:'Read Only',       perms:['all_read'],                             users:1 },
]);
const editRole   = ref(null);
const createOpen = ref(false);
const newRole    = reactive({ label:'', perms:'' });
const PERMS_RESOURCES = ['orders','products','customers','warehouses','marketplace','finance','analytics','tickets','settings','brands','discounts','comms'];

function saveRole() {
  ROLES.push({ id:'r-'+Date.now(), label:newRole.label, perms:newRole.perms.split(',').map(p=>p.trim()).filter(Boolean), users:0 });
  createOpen.value = false; newRole.label = ''; newRole.perms = '';
}
function savePerms(roleId, perms) { /* perms saved in drawer state */ }
</script>
<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Roles &amp; Permissions</div><div class="zset-content-sub">Define platform roles and the access each role grants across all modules</div></div>
      <button class="zwh-btn-primary" @click="createOpen = true">+ Create Role</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div v-for="r in ROLES" :key="r.id"
        style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:13px;font-weight:600;color:var(--zg-text);">{{ r.label }}</span>
          <span style="font-size:11px;color:var(--zg-text-dim);">{{ r.users }} user{{ r.users!==1?'s':'' }}</span>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;">
          <span v-for="p in r.perms" :key="p"
            style="height:18px;padding:0 7px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:10px;font-family:var(--zg-mono);color:var(--zg-text-dim);display:inline-flex;align-items:center;">{{ p }}</span>
        </div>
        <button class="act-btn" @click="editRole = r">Edit Permissions</button>
      </div>
    </div>

    <EditRolePermissionsDrawer v-if="editRole" :role="editRole" @close="editRole = null" @save="savePerms" />

    <!-- Create Role Modal -->
    <Teleport to="body">
      <div v-if="createOpen" style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="createOpen = false">
        <div style="width:480px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,12px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:700;color:var(--zg-text);">
            Create Role <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="createOpen = false">×</button>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;flex-direction:column;gap:4px;">
              <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid);">Role Name <span style="color:var(--zg-danger);">*</span></label>
              <input v-model="newRole.label" class="sf-inp" placeholder="e.g. Regional Manager" />
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;">
              <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid);">Permission Tags (comma-separated)</label>
              <input v-model="newRole.perms" class="sf-inp" placeholder="orders, warehouse, analytics" />
              <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">
                <button v-for="p in PERMS_RESOURCES" :key="p"
                  style="height:18px;padding:0 7px;border:1px solid var(--zg-line);border-radius:2px;background:transparent;cursor:pointer;font-size:9.5px;font-family:var(--zg-mono);color:var(--zg-text-dim);"
                  @click="newRole.perms = newRole.perms ? newRole.perms+', '+p : p">{{ p }}</button>
              </div>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="zwh-btn-primary" :disabled="!newRole.label" :style="{ opacity: newRole.label?1:0.4 }" @click="saveRole">Create Role</button>
            <button class="zwh-btn-ghost" @click="createOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<style scoped>
.act-btn { height:28px;padding:0 12px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;cursor:pointer;font-size:11.5px;color:var(--zg-text-mid); }
.act-btn:hover { border-color:var(--zg-accent);color:var(--zg-accent); }
.sf-inp { width:100%;height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box; }
</style>
