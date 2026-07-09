<script setup>
import { ref, reactive } from 'vue';

const MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const MARKET_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', KW:'🇰🇼', BH:'🇧🇭', QA:'🇶🇦', OM:'🇴🇲' };

const ROLES_DATA = [
  { id:'super_admin',   label:'Super Admin',       perms:['all'],                                  users:2 },
  { id:'ops_admin',     label:'Ops Admin',         perms:['orders','warehouse','returns'],          users:3 },
  { id:'finance_admin', label:'Finance Admin',     perms:['finance','payouts','invoices'],          users:2 },
  { id:'cs_agent',      label:'CS Agent',          perms:['tickets','orders_read','customers'],     users:4 },
  { id:'merch_manager', label:'Merch Manager',     perms:['products','categories','brands'],        users:3 },
  { id:'warehouse_ops', label:'Warehouse Ops',     perms:['warehouse','inventory'],                 users:6 },
  { id:'compliance',    label:'Compliance',        perms:['kyc','documents','brands_read'],         users:2 },
  { id:'read_only',     label:'Read Only',         perms:['all_read'],                             users:1 },
];

const users = reactive([
  { id:'u-001', name:'Sara Medhat',   email:'s.medhat@zucci.com',  role:'super_admin',   mfa:true,  status:'active',   last:'2h ago'  },
  { id:'u-002', name:'Ahmed Khalil',  email:'a.khalil@zucci.com',  role:'finance_admin', mfa:true,  status:'active',   last:'1d ago'  },
  { id:'u-003', name:'Omar Hassan',   email:'o.hassan@zucci.com',  role:'warehouse_ops', mfa:false, status:'active',   last:'4h ago'  },
  { id:'u-004', name:'Layla Haddad',  email:'l.haddad@zucci.com',  role:'cs_agent',      mfa:true,  status:'active',   last:'30m ago' },
  { id:'u-005', name:'Khaled Nour',   email:'k.nour@zucci.com',    role:'compliance',    mfa:false, status:'inactive', last:'14d ago' },
  { id:'u-006', name:'Nada Ibrahim',  email:'n.ibrahim@zucci.com', role:'merch_manager', mfa:true,  status:'active',   last:'6h ago'  },
  { id:'u-007', name:'Tariq Saleh',   email:'t.saleh@zucci.com',   role:'ops_admin',     mfa:true,  status:'active',   last:'3h ago'  },
]);

const tab = ref('users');
const inviteOpen = ref(false);
const invite = reactive({ email:'', role:'cs_agent', markets:['AE','SA','EG'] });
const editRole = ref(null);

const roleLabel = (id) => ROLES_DATA.find(r => r.id === id)?.label || id;

function sendInvite() {
  if (!invite.email) return;
  users.push({ id:'u-'+Date.now(), name:invite.email.split('@')[0], email:invite.email, role:invite.role, mfa:false, status:'active', last:'Just now' });
  inviteOpen.value = false; invite.email = '';
}
function toggleMarket(m) {
  const idx = invite.markets.indexOf(m);
  idx >= 0 ? invite.markets.splice(idx, 1) : invite.markets.push(m);
}
function toggleStatus(u) { u.status = u.status === 'active' ? 'inactive' : 'active'; }
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Access Management</div><div class="zset-content-sub">Platform users, roles, and permissions</div></div>
      <button class="btn-primary" @click="inviteOpen = true">+ Invite User</button>
    </div>

    <!-- Sub-tabs: Users | Roles -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--zg-line);margin-bottom:16px;">
      <button v-for="[v,l] in [['users',`Users (${users.length})`],['roles',`Roles (${ROLES_DATA.length})`]]" :key="v"
        @click="tab = v"
        style="height:34px;padding:0 14px;border:none;background:transparent;font-family:inherit;font-size:12.5px;cursor:pointer;margin-bottom:-1px;"
        :style="{ color: tab===v?'var(--zg-accent)':'var(--zg-text-dim)', borderBottom: tab===v?'2px solid var(--zg-accent)':'2px solid transparent', fontWeight: tab===v?600:400 }">
        {{ l }}
      </button>
    </div>

    <!-- Users tab -->
    <template v-if="tab === 'users'">
      <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
        <div style="display:grid;grid-template-columns:1fr 130px 60px 70px 80px 100px;gap:10px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;">
          <span>User</span><span>Role</span><span>MFA</span><span>Status</span><span>Last Active</span><span>Actions</span>
        </div>
        <div v-for="u in users" :key="u.id"
          style="display:grid;grid-template-columns:1fr 130px 60px 70px 80px 100px;gap:10px;padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);align-items:center;font-size:12px;">
          <div>
            <div style="font-weight:600;font-size:12.5px;color:var(--zg-text);">{{ u.name }}</div>
            <div style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);">{{ u.email }}</div>
          </div>
          <span style="font-size:11.5px;color:var(--zg-text-mid);">{{ roleLabel(u.role) }}</span>
          <span style="font-size:11px;font-weight:600;" :style="{ color: u.mfa?'var(--zg-good)':'var(--zg-danger)' }">{{ u.mfa ? 'On' : 'Off' }}</span>
          <span style="font-size:11px;font-weight:600;" :style="{ color: u.status==='active'?'var(--zg-good)':'var(--zg-text-dim)' }">{{ u.status }}</span>
          <span style="font-size:11px;color:var(--zg-text-dim);">{{ u.last }}</span>
          <div style="display:flex;gap:4px;">
            <button class="act-btn" @click="">Edit</button>
            <button class="act-btn" :class="{ danger: u.status==='active' }" @click="toggleStatus(u)">{{ u.status === 'active' ? 'Deactivate' : 'Activate' }}</button>
          </div>
        </div>
      </div>
    </template>

    <!-- Roles tab -->
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
          <button class="act-btn" @click="editRole = r">Edit Permissions</button>
        </div>
      </div>
    </template>

    <!-- Invite modal -->
    <Teleport to="body">
      <div v-if="inviteOpen" style="position:fixed;inset:0;z-index:9999;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="inviteOpen = false">
        <div style="width:440px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);padding:24px;display:flex;flex-direction:column;gap:14px;" @click.stop>
          <div style="font-size:15px;font-weight:700;color:var(--zg-text);">Invite User</div>
          <div class="sf-field"><label class="sf-lbl">Email Address</label><input v-model="invite.email" type="email" class="sf-inp" placeholder="name@company.com" /></div>
          <div class="sf-field">
            <label class="sf-lbl">Role</label>
            <select v-model="invite.role" class="sf-inp" style="cursor:pointer;">
              <option v-for="r in ROLES_DATA" :key="r.id" :value="r.id">{{ r.label }}</option>
            </select>
          </div>
          <div>
            <div class="sf-lbl" style="margin-bottom:8px;">Market Access</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button v-for="m in MARKETS" :key="m"
                style="height:24px;padding:0 9px;border-radius:3px;cursor:pointer;font-family:var(--zg-mono);font-size:11px;font-weight:700;transition:all .12s;"
                :style="{ border: invite.markets.includes(m)?'1px solid var(--zg-accent)':'1px solid var(--zg-line)', background: invite.markets.includes(m)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color: invite.markets.includes(m)?'var(--zg-accent)':'var(--zg-text-dim)' }"
                @click="toggleMarket(m)">{{ m }}</button>
            </div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn-primary" :disabled="!invite.email" :style="{ opacity: invite.email?1:0.4 }" @click="sendInvite">Send Invite</button>
            <button class="btn-ghost" @click="inviteOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Role Permissions -->
    <Teleport to="body">
      <div v-if="editRole" style="position:fixed;inset:0;z-index:9999;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="editRole = null">
        <div style="width:480px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:700;color:var(--zg-text);">
            Edit Permissions — {{ editRole.label }}
            <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="editRole = null">×</button>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:8px;">
            <div v-for="p in ['orders','warehouse','returns','finance','payouts','products','customers','tickets','kyc','analytics','settings']" :key="p">
              <label style="display:flex;align-items:center;gap:10px;padding:8px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);cursor:pointer;font-size:12px;font-family:var(--zg-mono);color:var(--zg-text-mid);">
                <input type="checkbox" :checked="editRole.perms.includes(p)"
                  @change="() => { const idx = editRole.perms.indexOf(p); idx>=0?editRole.perms.splice(idx,1):editRole.perms.push(p); }"
                  style="accent-color:var(--zg-accent);" />
                {{ p }}
              </label>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="btn-primary" @click="editRole = null">Save</button>
            <button class="btn-ghost" @click="editRole = null">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.sf-field { display:flex;flex-direction:column;gap:4px; }
.sf-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.sf-inp { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
.act-btn { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.act-btn.danger { color:var(--zg-danger);border-color:oklch(0.70 0.18 25 / 0.4); }
</style>
