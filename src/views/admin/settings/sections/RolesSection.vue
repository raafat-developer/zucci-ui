<script setup>
/**
 * RolesSection — faithful Vue port of React roles tab + EditRolePermissionsDrawer.
 * Shows role cards (2-column grid) each with permission tags + user count.
 * "Edit Permissions" opens a full permission matrix (resources × actions).
 */
import { ref, reactive } from 'vue';

const PERMS_RESOURCES = ['orders','products','customers','warehouses','marketplace','finance','analytics','tickets','settings','brands','discounts','comms'];
const PERMS_ACTIONS   = ['view','create','edit','delete','export'];

const ROLES = reactive([
  { id:'super_admin',   label:'Super Admin',       perms:['all'],                                  users:2 },
  { id:'ops_admin',     label:'Ops Admin',         perms:['orders','warehouse','returns'],          users:3 },
  { id:'finance_admin', label:'Finance Admin',     perms:['finance','payouts','invoices'],          users:2 },
  { id:'cs_agent',      label:'CS Agent',          perms:['tickets','orders_read','customers'],     users:4 },
  { id:'merch_manager', label:'Merch Manager',     perms:['products','categories','brands'],        users:3 },
  { id:'warehouse_ops', label:'Warehouse Ops',     perms:['warehouse','inventory'],                 users:6 },
  { id:'compliance',    label:'Compliance',        perms:['kyc','documents','brands_read'],         users:2 },
  { id:'read_only',     label:'Read Only',         perms:['all_read'],                             users:1 },
]);

const editRole    = ref(null);
const createOpen  = ref(false);
const newRole     = reactive({ label:'', perms:'' });

// Permission matrix state per role
const permsMatrix = ref({});

function initMatrix(role) {
  const p = {};
  PERMS_RESOURCES.forEach(r => {
    p[r] = {};
    PERMS_ACTIONS.forEach(a => {
      p[r][a] = role.id === 'super_admin' || (a === 'view');
    });
  });
  return p;
}

function openEdit(role) {
  editRole.value = role;
  permsMatrix.value = initMatrix(role);
}

function toggleCell(res, act) {
  permsMatrix.value[res][act] = !permsMatrix.value[res][act];
}
function toggleRow(res) {
  const allOn = PERMS_ACTIONS.every(a => permsMatrix.value[res][a]);
  PERMS_ACTIONS.forEach(a => { permsMatrix.value[res][a] = !allOn; });
}
function toggleCol(act) {
  const allOn = PERMS_RESOURCES.every(r => permsMatrix.value[r][act]);
  PERMS_RESOURCES.forEach(r => { permsMatrix.value[r][act] = !allOn; });
}

function saveRole() {
  createOpen.value = false; newRole.label = ''; newRole.perms = '';
}
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div>
        <div class="zset-content-title">Roles &amp; Permissions</div>
        <div class="zset-content-sub">Define platform roles and the access each role grants across all modules</div>
      </div>
      <button class="btn-primary" @click="createOpen = true">+ Create Role</button>
    </div>

    <!-- Role cards — 2-column grid matching React -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div v-for="r in ROLES" :key="r.id"
        style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px;">
        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:13px;font-weight:600;color:var(--zg-text);">{{ r.label }}</span>
          <span style="font-size:11px;color:var(--zg-text-dim);">{{ r.users }} user{{ r.users!==1?'s':'' }}</span>
        </div>
        <!-- Permission badge tags -->
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;">
          <span v-for="p in r.perms" :key="p"
            style="height:18px;padding:0 7px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:10px;font-family:var(--zg-mono);color:var(--zg-text-dim);display:inline-flex;align-items:center;">
            {{ p }}
          </span>
        </div>
        <button class="act-btn" @click="openEdit(r)">Edit Permissions</button>
      </div>
    </div>

    <!-- Edit Role Permissions Drawer (720px) — full permission matrix table -->
    <Teleport to="body">
      <div v-if="editRole" style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.6);" @click="editRole = null">
        <div style="position:fixed;top:0;right:0;bottom:0;width:720px;z-index:9201;background:var(--zg-bg-elev);border-left:1px solid var(--zg-line);display:flex;flex-direction:column;box-shadow:-8px 0 32px oklch(0.05 0.01 250 / 0.5);" @click.stop>
          <!-- Drawer head -->
          <div style="padding:16px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0;">
            <div>
              <div style="font-size:15px;font-weight:700;color:var(--zg-text);">Edit Permissions — {{ editRole.label }}</div>
              <div style="font-size:11.5px;color:var(--zg-text-dim);margin-top:2px;">{{ editRole.users }} user{{ editRole.users!==1?'s':'' }} with this role</div>
            </div>
            <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:16px;" @click="editRole = null">×</button>
          </div>
          <!-- Permission matrix -->
          <div style="flex:1;overflow-y:auto;padding:20px;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;">
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:11.5px;">
                <thead>
                  <tr style="background:var(--zg-panel-hi);">
                    <th style="padding:8px 12px;text-align:left;color:var(--zg-text-dim);font-weight:600;font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;border-bottom:1px solid var(--zg-line);white-space:nowrap;">Resource</th>
                    <th v-for="a in PERMS_ACTIONS" :key="a"
                      style="padding:8px 10px;text-align:center;color:var(--zg-text-dim);font-weight:600;font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;border-bottom:1px solid var(--zg-line);cursor:pointer;white-space:nowrap;"
                      @click="toggleCol(a)">{{ a }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(res, i) in PERMS_RESOURCES" :key="res" :style="{ background: i%2===0?'var(--zg-panel)':'var(--zg-bg)' }">
                    <td style="padding:8px 12px;font-weight:600;color:var(--zg-text);border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;text-transform:capitalize;"
                      @click="toggleRow(res)">{{ res }}</td>
                    <td v-for="a in PERMS_ACTIONS" :key="a"
                      style="padding:8px 10px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);">
                      <input type="checkbox"
                        :checked="permsMatrix[res]?.[a]"
                        @change="toggleCell(res, a)"
                        style="width:14px;height:14px;cursor:pointer;accent-color:var(--zg-accent);" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="margin-top:12px;font-size:11px;color:var(--zg-text-dim);">Click a column header to toggle all · Click a row name to toggle all actions for that resource</div>
          </div>
          <!-- Footer -->
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;flex-shrink:0;">
            <button class="btn-primary" @click="editRole = null">Save Permissions</button>
            <button class="btn-ghost" @click="editRole = null">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Create Role Modal -->
    <Teleport to="body">
      <div v-if="createOpen" style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="createOpen = false">
        <div style="width:480px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:700;color:var(--zg-text);">
            Create Role <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="createOpen = false">×</button>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><label class="sf-lbl">Role Name</label><input v-model="newRole.label" class="sf-inp" placeholder="e.g. Regional Manager" /></div>
            <div>
              <label class="sf-lbl">Permission Tags (comma-separated)</label>
              <input v-model="newRole.perms" class="sf-inp" placeholder="orders, warehouse, analytics" />
              <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;">
                <button v-for="p in PERMS_RESOURCES" :key="p"
                  style="height:18px;padding:0 7px;border:1px solid var(--zg-line);border-radius:2px;background:transparent;cursor:pointer;font-size:9.5px;font-family:var(--zg-mono);color:var(--zg-text-dim);"
                  @click="newRole.perms = newRole.perms ? newRole.perms+', '+p : p">{{ p }}</button>
              </div>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="btn-primary" :disabled="!newRole.label" :style="{ opacity: newRole.label?1:0.4 }" @click="saveRole">Create Role</button>
            <button class="btn-ghost" @click="createOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.sf-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:4px;display:block; }
.sf-inp { width:100%;height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box; }
.act-btn { height:28px;padding:0 12px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;cursor:pointer;font-size:11.5px;color:var(--zg-text-mid); }
.act-btn:hover { border-color:var(--zg-accent);color:var(--zg-accent); }
</style>
