<script setup>
import { ref, reactive } from 'vue';
import DrawerShell from '../DrawerShell.vue';
import SField from '../SField.vue';
import SSelect from '../SSelect.vue';
import SToggle from '../SToggle.vue';

const ROLES_DATA = [
  ['super_admin','Super Admin'],['ops_admin','Ops Admin'],['finance_admin','Finance Admin'],
  ['cs_agent','CS Agent'],['merch_manager','Merch Manager'],['warehouse_ops','Warehouse Ops'],
  ['compliance','Compliance'],['read_only','Read Only'],
];
const ALL_MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];

const props = defineProps({ user: Object });
const emit  = defineEmits(['close','save']);

const v = reactive({ ...props.user });
const toggleMarket = m => {
  const ms = v.markets || ALL_MARKETS;
  v.markets = ms.includes(m) ? ms.filter(x => x !== m) : [...ms, m];
};
</script>

<template>
  <DrawerShell :title="`Edit User — ${user.name}`" :sub="user.email" @close="emit('close')">
    <template #footer>
      <button class="zwh-btn-primary" @click="emit('save', v); emit('close')">Save Changes</button>
      <button class="zwh-btn-ghost"   @click="emit('close')">Cancel</button>
    </template>

    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <SField label="First Name" :value="v.name?.split(' ')[0]" :req="true" @update:value="val => v.name = val + ' ' + (v.name?.split(' ')[1]||'')" />
        <SField label="Last Name"  :value="v.name?.split(' ')[1]||''" @update:value="val => v.name = (v.name?.split(' ')[0]||'') + ' ' + val" />
        <SField label="Email" :value="v.email" type="email" :req="true" @update:value="val => v.email = val" />
        <SField label="Phone" :value="v.phone||''" ph="+971 5X XXX XXXX" :mono="true" @update:value="val => v.phone = val" />
      </div>

      <SSelect label="Role" :value="v.role" :opts="ROLES_DATA" :req="true" @update:value="val => v.role = val" />
      <SField label="Department" :value="v.department||''" ph="e.g. Operations" @update:value="val => v.department = val" />

      <div>
        <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:8px;">Market Access</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button v-for="m in ALL_MARKETS" :key="m" @click="toggleMarket(m)"
            style="height:26px;padding:0 10px;border-radius:3px;border:1px solid;cursor:pointer;font-family:var(--zg-mono);font-size:11px;font-weight:700;transition:all .12s;"
            :style="{ borderColor:(v.markets||ALL_MARKETS).includes(m)?'var(--zg-accent)':'var(--zg-line)', background:(v.markets||ALL_MARKETS).includes(m)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:(v.markets||ALL_MARKETS).includes(m)?'var(--zg-accent)':'var(--zg-text-dim)' }">
            {{ m }}
          </button>
        </div>
      </div>

      <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px;">
        <SToggle label="MFA Required" sub="Force two-factor authentication for this user" :value="v.mfa" @update:value="val => v.mfa = val" />
        <SToggle label="Active" sub="User can log in and access the platform" :value="v.status === 'active'" @update:value="val => v.status = val ? 'active' : 'inactive'" />
      </div>

      <div style="display:flex;flex-direction:column;gap:4px;">
        <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid);">Admin Notes (internal)</label>
        <textarea v-model="v.notes" placeholder="Optional internal notes about this user…"
          style="height:60px;padding:8px 10px;resize:none;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box;" />
      </div>
    </div>
  </DrawerShell>
</template>
