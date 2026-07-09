<script setup>
import { reactive } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';

const props = defineProps({ open: Boolean, order: Object });
const emit  = defineEmits(['close']);

const addr = reactive({
  firstName: 'Layla', lastName: 'Al Mansouri',
  phone: '+971 50 123 4567',
  country: 'AE', city: 'Dubai', district: 'Business Bay',
  street: 'Sheikh Zayed Rd', building: 'Opus Tower, Floor 24',
  postal: '00000', notes: '',
});
</script>

<template>
  <ZDrawer :open="open" title="Edit Shipping Address" subtitle="Update the delivery address for this order" @close="emit('close')">
    <template #footer>
      <button style="height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer;" @click="emit('close')">Cancel</button>
      <button style="height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer;" @click="emit('close')">Save Address</button>
    </template>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:4px 0;">
      <div class="es-field"><label class="es-lbl">First Name</label><input v-model="addr.firstName" class="es-inp" /></div>
      <div class="es-field"><label class="es-lbl">Last Name</label><input v-model="addr.lastName" class="es-inp" /></div>
      <div class="es-field" style="grid-column:1/-1;"><label class="es-lbl">Phone</label><input v-model="addr.phone" class="es-inp" style="font-family:var(--zg-mono);" /></div>
      <div class="es-field">
        <label class="es-lbl">Country</label>
        <select v-model="addr.country" class="es-inp">
          <option v-for="c in ['AE','SA','EG','KW','BH','QA','OM']" :key="c">{{ c }}</option>
        </select>
      </div>
      <div class="es-field"><label class="es-lbl">City</label><input v-model="addr.city" class="es-inp" /></div>
      <div class="es-field"><label class="es-lbl">District / Area</label><input v-model="addr.district" class="es-inp" /></div>
      <div class="es-field"><label class="es-lbl">Street</label><input v-model="addr.street" class="es-inp" /></div>
      <div class="es-field" style="grid-column:1/-1;"><label class="es-lbl">Building / Apt</label><input v-model="addr.building" class="es-inp" /></div>
      <div class="es-field"><label class="es-lbl">Postal Code</label><input v-model="addr.postal" class="es-inp" /></div>
      <div class="es-field" style="grid-column:1/-1;"><label class="es-lbl">Delivery Notes</label><textarea v-model="addr.notes" class="es-inp" rows="2" style="height:auto;resize:vertical;" placeholder="Gate code, floor, landmarks…" /></div>
    </div>
  </ZDrawer>
</template>

<style scoped>
.es-field { display:flex;flex-direction:column;gap:4px; }
.es-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.es-inp { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
</style>
