<script setup>
import { ref, reactive } from 'vue';
import DrawerShell from '../DrawerShell.vue';

const PERMS_RESOURCES = ['orders','products','customers','warehouses','marketplace','finance','analytics','tickets','settings','brands','discounts','comms'];
const PERMS_ACTIONS   = ['view','create','edit','delete','export'];

const props = defineProps({ role: Object });
const emit  = defineEmits(['close', 'save']);

function initPerms() {
  const p = {};
  PERMS_RESOURCES.forEach(r => {
    p[r] = {};
    PERMS_ACTIONS.forEach(a => {
      p[r][a] = props.role?.id === 'super_admin' ? true
               : props.role?.id === 'read_only'   ? a === 'view'
               : false;
    });
  });
  return p;
}

const perms = reactive(initPerms());
function toggle(r, a) { perms[r][a] = !perms[r][a]; }
function setRow(r, val) { PERMS_ACTIONS.forEach(a => perms[r][a] = val); }
function setCol(a, val) { PERMS_RESOURCES.forEach(r => perms[r][a] = val); }
const allCol = a => PERMS_RESOURCES.every(r => perms[r][a]);
const allRow = r => PERMS_ACTIONS.every(a => perms[r][a]);
</script>

<template>
  <DrawerShell :title="`Edit Permissions — ${role?.label}`" :sub="`${role?.users} user${role?.users !== 1 ? 's' : ''} with this role`" width="720px" @close="emit('close')">
    <template #footer>
      <button class="zwh-btn-primary" @click="emit('save', role?.id, perms); emit('close')">Save Permissions</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>

    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:11.5px;">
        <thead>
          <tr style="background:var(--zg-panel-hi);">
            <th style="padding:8px 12px;text-align:left;color:var(--zg-text-dim);font-weight:600;font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;border-bottom:1px solid var(--zg-line);white-space:nowrap;">Resource</th>
            <th v-for="a in PERMS_ACTIONS" :key="a"
              style="padding:8px 10px;text-align:center;color:var(--zg-text-dim);font-weight:600;font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;border-bottom:1px solid var(--zg-line);cursor:pointer;white-space:nowrap;"
              @click="setCol(a, !allCol(a))">{{ a }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(res, i) in PERMS_RESOURCES" :key="res" :style="{ background: i%2===0 ? 'var(--zg-panel)' : 'var(--zg-bg)' }">
            <td style="padding:8px 12px;font-weight:600;color:var(--zg-text);border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;text-transform:capitalize;"
              @click="setRow(res, !allRow(res))">{{ res }}</td>
            <td v-for="a in PERMS_ACTIONS" :key="a" style="padding:8px 10px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);">
              <input type="checkbox" :checked="perms[res][a]" @change="toggle(res, a)"
                style="width:14px;height:14px;cursor:pointer;accent-color:var(--zg-accent);" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="margin-top:12px;font-size:11px;color:var(--zg-text-dim);">Click a column header to toggle all · Click a row name to toggle all actions for that resource</div>
  </DrawerShell>
</template>
