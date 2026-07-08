<script setup>
/**
 * EditOrderDrawer — edit shipping address, internal notes, tags, COD toggle.
 * Faithful port of EditOrderDrawer from zucci-orders-extra.jsx.
 */
import { ref, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false }, order: { type: Object, default: null } });
const emit = defineEmits(['close']);

const COUNTRIES = [['AE','🇦🇪 UAE'],['SA','🇸🇦 Saudi Arabia'],['EG','🇪🇬 Egypt'],['QA','🇶🇦 Qatar'],['KW','🇰🇼 Kuwait'],['BH','🇧🇭 Bahrain'],['OM','🇴🇲 Oman']];
const blank = () => ({
  shippingName: '', shippingPhone: '+971 50 000 0000', shippingAddress: '',
  shippingCity: '', shippingCountry: 'AE', shippingZip: '', notes: '', tags: '', codEnabled: false,
});
const v = ref(blank());

watch(() => [props.open, props.order?.id], () => {
  if (props.open && props.order) {
    const o = props.order;
    v.value = {
      shippingName: `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim(),
      shippingPhone: o.customer?.phone || '+971 50 000 0000',
      shippingAddress: [o.shippingAddr?.building, o.shippingAddr?.street].filter(Boolean).join(' ') || '',
      shippingCity: o.shippingAddr?.city || '',
      shippingCountry: 'AE',
      shippingZip: o.shippingAddr?.postal || '',
      notes: o.internalNotes || '',
      tags: (o.tags || []).join(', '),
      codEnabled: o.paymentMethod === 'COD',
    };
  }
});

const fields = [['shippingName','Recipient Name',''],['shippingPhone','Phone',''],['shippingAddress','Street Address',''],['shippingCity','City',''],['shippingZip','Postal Code','']];
const save = () => { toast.success('Order updated'); emit('close'); };
</script>

<template>
  <ZDrawer :open="open" title="Edit Order" :subtitle="order ? `#${order.id} · ${order.customer?.firstName || ''} ${order.customer?.lastName || ''}` : ''" :width="520" @close="emit('close')">
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px;display:flex;flex-direction:column;gap:10px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim)">Shipping Address</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div v-for="[k, l, ph] in fields" :key="k" :style="{ display:'flex', flexDirection:'column', gap:'4px', gridColumn: k === 'shippingAddress' ? '1 / -1' : undefined }">
            <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">{{ l }}</label>
            <input v-model="v[k]" :placeholder="ph" style="height:32px;padding:0 10px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" />
          </div>
          <div style="display:flex;flex-direction:column;gap:4px">
            <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Country</label>
            <select v-model="v.shippingCountry" style="height:32px;padding:0 10px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;cursor:pointer">
              <option v-for="[val, l] in COUNTRIES" :key="val" :value="val">{{ l }}</option>
            </select>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:4px">
        <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Internal Notes (not shown to customer)</label>
        <textarea v-model="v.notes" placeholder="Add note visible only to your team…" style="height:72px;padding:8px 10px;resize:none;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" />
      </div>

      <div style="display:flex;flex-direction:column;gap:4px">
        <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Tags (comma-separated)</label>
        <input v-model="v.tags" placeholder="e.g. VIP, gift, express" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" />
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md)">
        <div><div style="font-size:12.5px;font-weight:500;color:var(--zg-text)">Cash on Delivery</div><div style="font-size:11px;color:var(--zg-text-dim);margin-top:1px">Toggle requires Ops approval if market has COD restrictions</div></div>
        <button type="button" :style="{ width:'34px', height:'18px', borderRadius:'9px', border:'none', cursor:'pointer', background: v.codEnabled ? 'var(--zg-accent)' : 'var(--zg-line)', position:'relative', flexShrink:0 }" @click="v.codEnabled = !v.codEnabled">
          <div :style="{ width:'13px', height:'13px', borderRadius:'50%', background:'#fff', position:'absolute', top:'2.5px', left: v.codEnabled ? '17.5px' : '2px', transition:'left .14s' }" />
        </button>
      </div>

      <div style="padding:8px 12px;background:oklch(0.82 0.15 75 / 0.08);border:1px solid oklch(0.82 0.15 75 / 0.25);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-warn)">
        Address changes will trigger a re-validation against carrier zones. Customer will not be notified automatically.
      </div>
    </div>

    <template #footer>
      <button class="zwh-btn-primary" @click="save">Save Changes</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>
  </ZDrawer>
</template>
