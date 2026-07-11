<script setup>
import { ref, reactive } from 'vue';
import EditUserDrawer from '../drawers/EditUserDrawer.vue';
import DeactivateUserModal from '../drawers/DeactivateUserModal.vue';

const ROLES_DATA = [
  { id:'super_admin',   label:'Super Admin',    perms:['all'],                                  users:2 },
  { id:'ops_admin',     label:'Ops Admin',       perms:['orders','warehouse','returns'],          users:3 },
  { id:'finance_admin', label:'Finance Admin',   perms:['finance','payouts','invoices'],          users:2 },
  { id:'cs_agent',      label:'CS Agent',        perms:['tickets','orders_read','customers'],     users:4 },
  { id:'merch_manager', label:'Merch Manager',   perms:['products','categories','brands'],        users:3 },
  { id:'warehouse_ops', label:'Warehouse Ops',   perms:['warehouse','inventory'],                 users:6 },
  { id:'compliance',    label:'Compliance',      perms:['kyc','documents','brands_read'],         users:2 },
  { id:'read_only',     label:'Read Only',       perms:['all_read'],                             users:1 },
];

const users = reactive([
  { id:'u-001', name:'Sara Medhat',   email:'s.medhat@zucci.com',  role:'super_admin',   mfa:true,  status:'active',   last:'2h ago',  markets:['AE','SA','EG','KW','BH','QA','OM'] },
  { id:'u-002', name:'Ahmed Khalil',  email:'a.khalil@zucci.com',  role:'finance_admin', mfa:true,  status:'active',   last:'1d ago',  markets:['AE','SA','EG'] },
  { id:'u-003', name:'Omar Hassan',   email:'o.hassan@zucci.com',  role:'warehouse_ops', mfa:false, status:'active',   last:'4h ago',  markets:['AE'] },
  { id:'u-004', name:'Layla Haddad',  email:'l.haddad@zucci.com',  role:'cs_agent',      mfa:true,  status:'active',   last:'30m ago', markets:['AE','SA','EG'] },
  { id:'u-005', name:'Khaled Nour',   email:'k.nour@zucci.com',    role:'compliance',    mfa:false, status:'inactive', last:'14d ago', markets:['AE','SA'] },
  { id:'u-006', name:'Nada Ibrahim',  email:'n.ibrahim@zucci.com', role:'merch_manager', mfa:true,  status:'active',   last:'6h ago',  markets:['AE','SA','EG','QA'] },
  { id:'u-007', name:'Tariq Saleh',   email:'t.saleh@zucci.com',   role:'ops_admin',     mfa:true,  status:'active',   last:'3h ago',  markets:['AE','SA'] },
]);

const tab          = ref('users');
const inviteOpen   = ref(false);
const editUser     = ref(null);
const deactUser    = ref(null);
const invite       = reactive({ email:'', role:'cs_agent', markets:['AE','SA','EG'] });
const ALL_MARKETS  = ['AE','SA','EG','KW','BH','QA','OM'];

const roleLabel = id => ROLES_DATA.find(r => r.id === id)?.label || id;

function sendInvite() {
  if (!invite.email) return;
  users.push({ id:'u-'+Date.now(), name:invite.email.split('@')[0], email:invite.email, role:invite.role, mfa:false, status:'active', last:'Just now', markets:[...invite.markets] });
  inviteOpen.value = false; invite.email = '';
}
function toggleInvMkt(m) { invite.markets = invite.markets.includes(m) ? invite.markets.filter(x=>x!==m) : [...invite.markets, m]; }
function saveUser(updated) { const idx = users.findIndex(u => u.id === updated.id); if (idx >= 0) Object.assign(users[idx], updated); }
function confirmDeact(user, reason) { const idx = users.findIndex(u => u.id === user.id); if (idx >= 0) users[idx].status = users[idx].status === 'active' ? 'inactive' : 'active'; }
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Access Management</div><div class="zset-content-sub">Platform users, roles, and permissions</div></div>
      <button class="zwh-btn-primary" @click="inviteOpen = true">+ Invite User</button>
    </div>

    <!-- Tabs -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--zg-line);margin-bottom:16px;">
      <button v-for="[v, l] in [['users', `Users (${users.length})`], ['roles', `Roles (${ROLES_DATA.length})`]]" :key="v"
        style="height:34px;padding:0 14px;border:none;background:transparent;font-family:inherit;font-size:12.5px;cursor:pointer;margin-bottom:-1px;border-bottom:2px solid transparent;transition:all .1s;"
        :style="{ color: tab===v?'var(--zg-accent)':'var(--zg-text-dim)', borderBottomColor: tab===v?'var(--zg-accent)':'transparent', fontWeight: tab===v?600:400 }"
        @click="tab = v">{{ l }}</button>
    </div>

    <!-- Users table -->
    <template v-if="tab === 'users'">
      <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
        <div style="display:grid;grid-template-columns:1fr 130px 60px 70px 80px 100px;gap:10px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;">
          <span>User</span><span>Role</span><span>MFA</span><span>Status</span><span>Last Active</span><span>Actions</span>
        </div>
        <div v-for="u in users" :key="u.id"
          style="display:grid;grid-template-columns:1fr 130px 60px 70px 80px 100px;gap:10px;padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);align-items:center;">
          <div>
            <div style="font-weight:600;font-size:12.5px;color:var(--zg-text);">{{ u.name }}</div>
            <div style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);">{{ u.email }}</div>
          </div>
          <span style="font-size:11.5px;color:var(--zg-text-mid);">{{ roleLabel(u.role) }}</span>
          <span style="font-size:11px;font-weight:600;" :style="{ color: u.mfa?'var(--zg-good)':'var(--zg-danger)' }">{{ u.mfa ? 'On' : 'Off' }}</span>
          <span style="font-size:11px;font-weight:600;text-transform:capitalize;" :style="{ color: u.status==='active'?'var(--zg-good)':'var(--zg-text-dim)' }">{{ u.status }}</span>
          <span style="font-size:11px;color:var(--zg-text-dim);">{{ u.last }}</span>
          <div style="display:flex;gap:4px;">
            <button class="zcat-act" @click="editUser = u">Edit</button>
            <button class="zcat-act danger" @click="deactUser = u">{{ u.status==='active' ? 'Deactivate' : 'Activate' }}</button>
          </div>
        </div>
      </div>
    </template>

    <!-- Roles grid -->
    <template v-else>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div v-for="r in ROLES_DATA" :key="r.id"
          style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:13px;font-weight:600;color:var(--zg-text);">{{ r.label }}</span>
            <span style="font-size:11px;color:var(--zg-text-dim);">{{ r.users }} user{{ r.users!==1?'s':'' }}</span>
          </div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;">
            <span v-for="p in r.perms" :key="p"
              style="height:18px;padding:0 7px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:10px;font-family:var(--zg-mono);color:var(--zg-text-dim);display:inline-flex;align-items:center;">{{ p }}</span>
          </div>
          <button class="zcat-act" @click="">Edit Permissions</button>
        </div>
      </div>
    </template>

    <!-- Invite Modal -->
    <Teleport to="body">
      <div v-if="inviteOpen" style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="inviteOpen = false">
        <div style="width:460px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,12px);overflow:hidden;" @click.stop>
          <div style="padding:16px 20px;border-bottom:1px solid var(--zg-line);font-size:14px;font-weight:700;color:var(--zg-text);display:flex;justify-content:space-between;align-items:center;">
            Invite User <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:16px;" @click="inviteOpen = false">×</button>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;flex-direction:column;gap:4px;">
              <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid);">Email Address <span style="color:var(--zg-danger);">*</span></label>
              <input v-model="invite.email" type="email" placeholder="name@company.com"
                style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box;" />
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;">
              <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid);">Role</label>
              <select v-model="invite.role" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;cursor:pointer;">
                <option v-for="r in ROLES_DATA" :key="r.id" :value="r.id">{{ r.label }}</option>
              </select>
            </div>
            <div>
              <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:8px;">Market Access</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button v-for="m in ALL_MARKETS" :key="m" @click="toggleInvMkt(m)"
                  style="height:26px;padding:0 10px;border:1px solid;border-radius:3px;cursor:pointer;font-family:var(--zg-mono);font-size:11px;font-weight:700;transition:all .12s;"
                  :style="{ borderColor:invite.markets.includes(m)?'var(--zg-accent)':'var(--zg-line)', background:invite.markets.includes(m)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:invite.markets.includes(m)?'var(--zg-accent)':'var(--zg-text-dim)' }">{{ m }}</button>
              </div>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="zwh-btn-primary" :disabled="!invite.email" :style="{ opacity: invite.email?1:0.4 }" @click="sendInvite">Send Invite</button>
            <button class="zwh-btn-ghost" @click="inviteOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit User Drawer -->
    <EditUserDrawer v-if="editUser" :user="editUser" @close="editUser = null" @save="saveUser" />
    <!-- Deactivate Modal -->
    <DeactivateUserModal v-if="deactUser" :user="deactUser" @close="deactUser = null" @confirm="confirmDeact" />
  </div>
</template>

<style scoped>
.zcat-act { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.zcat-act.danger { color:var(--zg-danger); }
</style>
