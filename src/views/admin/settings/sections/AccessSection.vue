<script setup>
import { ref, reactive } from 'vue';

const users = reactive([
  { id:'u-001', name:'Sara Medhat',    email:'s.medhat@zucci.com',    role:'super_admin',   mfa:true,  status:'active',  last:'2h ago'  },
  { id:'u-002', name:'Ahmed Khalil',   email:'a.khalil@zucci.com',    role:'finance_admin', mfa:true,  status:'active',  last:'1d ago'  },
  { id:'u-003', name:'Omar Hassan',    email:'o.hassan@zucci.com',    role:'ops_manager',   mfa:false, status:'active',  last:'3h ago'  },
  { id:'u-004', name:'Layla Haddad',   email:'l.haddad@zucci.com',    role:'cs_agent',      mfa:false, status:'active',  last:'5h ago'  },
  { id:'u-005', name:'Nada Ibrahim',   email:'n.ibrahim@zucci.com',   role:'marketing',     mfa:true,  status:'active',  last:'1d ago'  },
  { id:'u-006', name:'Tariq Saleh',    email:'t.saleh@zucci.com',     role:'ops_manager',   mfa:true,  status:'active',  last:'3h ago'  },
  { id:'u-007', name:'Khaled Al-Ali',  email:'k.ali@zucci.com',       role:'tech_admin',    mfa:true,  status:'inactive',last:'7d ago'  },
]);

const ROLE_LABELS = { super_admin:'Super Admin', finance_admin:'Finance Admin', ops_manager:'Ops Manager', cs_agent:'CS Agent', marketing:'Marketing', tech_admin:'Tech Admin' };
const STATUS_COLOR = { active:'var(--zg-good)', inactive:'var(--zg-text-dim)', suspended:'var(--zg-danger)' };

const inviteOpen = ref(false);
const invite = reactive({ email:'', role:'cs_agent' });

function saveInvite() {
  users.push({ id:'u-'+Date.now(), name:invite.email.split('@')[0], email:invite.email, role:invite.role, mfa:false, status:'active', last:'Just now' });
  inviteOpen.value = false; invite.email = ''; invite.role = 'cs_agent';
}
function toggleStatus(u) { u.status = u.status === 'active' ? 'inactive' : 'active'; }
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div>
        <div class="zset-content-title">Access Management</div>
        <div class="zset-content-sub">Manage users, roles, and platform access</div>
      </div>
      <button class="btn-primary" @click="inviteOpen = true">+ Invite User</button>
    </div>

    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
      <div style="display:grid;grid-template-columns:1fr 1fr 120px 50px 80px 100px 90px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;gap:10px;">
        <span>Name</span><span>Email</span><span>Role</span><span>MFA</span><span>Status</span><span>Last Active</span><span>Actions</span>
      </div>
      <div v-for="u in users" :key="u.id"
        style="display:grid;grid-template-columns:1fr 1fr 120px 50px 80px 100px 90px;padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);align-items:center;font-size:12px;gap:10px;">
        <div>
          <div style="font-weight:600;color:var(--zg-text);">{{ u.name }}</div>
          <div style="font-size:10px;color:var(--zg-text-dim);margin-top:1px;">{{ u.id }}</div>
        </div>
        <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ u.email }}</span>
        <span style="font-size:11.5px;color:var(--zg-text-mid);">{{ ROLE_LABELS[u.role] || u.role }}</span>
        <span style="font-size:11px;font-weight:700;" :style="{ color: u.mfa ? 'var(--zg-good)' : 'var(--zg-danger)' }">{{ u.mfa ? '✓' : '✗' }}</span>
        <span style="font-size:11px;font-weight:600;text-transform:capitalize;" :style="{ color: STATUS_COLOR[u.status] }">{{ u.status }}</span>
        <span style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);">{{ u.last }}</span>
        <div style="display:flex;gap:4px;">
          <button class="act-btn" @click="">Edit</button>
          <button class="act-btn" :style="{ color: u.status==='active' ? 'var(--zg-danger)' : 'var(--zg-good)' }" @click="toggleStatus(u)">
            {{ u.status === 'active' ? 'Deactivate' : 'Activate' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Invite modal -->
    <Teleport to="body">
      <div v-if="inviteOpen" style="position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="inviteOpen = false">
        <div style="width:440px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:var(--zg-text);">
            Invite User <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="inviteOpen = false">×</button>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><label class="sf-lbl">Email Address</label><input v-model="invite.email" type="email" class="sf-inp" placeholder="user@company.com" /></div>
            <div><label class="sf-lbl">Role</label>
              <select v-model="invite.role" class="sf-inp" style="cursor:pointer;">
                <option v-for="[v,l] in [['super_admin','Super Admin'],['finance_admin','Finance Admin'],['ops_manager','Ops Manager'],['cs_agent','CS Agent'],['marketing','Marketing'],['tech_admin','Tech Admin']]" :key="v" :value="v">{{ l }}</option>
              </select>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="btn-primary" :disabled="!invite.email" :style="{ opacity: invite.email ? 1 : 0.4 }" @click="saveInvite">Send Invite</button>
            <button class="btn-ghost" @click="inviteOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.sf-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:4px;display:block; }
.sf-inp { width:100%;height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box; }
.act-btn { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
</style>
