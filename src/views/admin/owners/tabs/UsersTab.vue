<script setup>
import { ref } from 'vue';
const props = defineProps({ entity: { type: Object, required: true } });
const inviteOpen = ref(false);
const USERS = ref([
  { id:'u1', name:'Ahmed Mohamed', email:'ahmed@24kfashion.com', role:'Owner', status:'active', mfa:true, lastLogin:'2h ago' },
  { id:'u2', name:'Salwa Safwat',  email:'salwa@24kfashion.com', role:'Finance', status:'active', mfa:false, lastLogin:'1d ago' },
]);
const STATUS_CLS = { active:'zen-bst--active', inactive:'zen-bst--inactive' };
</script>
<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar">
      <div class="zen-tab-toolbar-title">{{ USERS.length }} users</div>
      <button class="zen-btn-primary" @click="inviteOpen = true">+ Invite User</button>
    </div>
    <div class="zen-card" style="overflow:hidden;">
      <div style="display:grid;grid-template-columns:1fr 1fr 100px 50px 80px 80px;gap:10px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;">
        <span>Name</span><span>Email</span><span>Role</span><span>MFA</span><span>Status</span><span>Last Login</span>
      </div>
      <div v-for="u in USERS" :key="u.id" style="display:grid;grid-template-columns:1fr 1fr 100px 50px 80px 80px;gap:10px;padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);align-items:center;font-size:12px;">
        <span style="font-weight:600;color:var(--zg-text);">{{ u.name }}</span>
        <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-dim);">{{ u.email }}</span>
        <span style="font-size:11.5px;color:var(--zg-text-mid);">{{ u.role }}</span>
        <span style="font-size:11px;font-weight:600;" :style="{ color: u.mfa?'var(--zg-good)':'var(--zg-danger)' }">{{ u.mfa?'On':'Off' }}</span>
        <span :class="`zen-bst ${STATUS_CLS[u.status]||'zen-bst--inactive'}`">{{ u.status }}</span>
        <span style="font-size:11px;color:var(--zg-text-dim);">{{ u.lastLogin }}</span>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="inviteOpen" style="position:fixed;inset:0;z-index:9300;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="inviteOpen = false">
        <div style="width:420px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,12px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);font-size:14px;font-weight:700;color:var(--zg-text);display:flex;justify-content:space-between;">Invite User <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="inviteOpen=false">×</button></div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><label class="zen-field-label">Email</label><input class="zen-field-input" type="email" placeholder="user@brand.com" /></div>
            <div><label class="zen-field-label">Role</label><select class="zen-field-input" style="cursor:pointer;"><option>Owner</option><option>Finance</option><option>Operations</option><option>View Only</option></select></div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="zen-btn-primary" @click="inviteOpen=false">Send Invite</button>
            <button class="zen-doc-card-btn" @click="inviteOpen=false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
