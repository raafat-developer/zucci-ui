<script setup>
/**
 * PaymentDealEditDrawer — create/edit a payment partner deal. Faithful port
 * of PaymentDealEditDrawer from zucci-discounts-completions.jsx: partner
 * name, deal type, discount %, min order, max discount cap, dates, active
 * markets, finance/legal approval toggles.
 */
import { ref, watch, computed } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false }, deal: { type: Object, default: null } });
const emit = defineEmits(['close', 'save']);

const DEAL_TYPES = ['BNPL','Instant Cashback','0% Installment','Discount Code','Cashback Wallet','Points Multiplier'];
const ALL_MARKETS = ['AE','SA','EG','QA','KW','BH','OM'];
const blank = () => ({ partner:'', type:'BNPL', discount:10, minOrderValue:200, maxDiscount:500, markets:['AE'], startDate:'', endDate:'', status:'pending', legalApproved:false, financeApproved:false, notes:'' });
const v = ref(blank());
const isNew = computed(() => !props.deal?.id);

watch(() => [props.open, props.deal?.id], () => { if (props.open) v.value = props.deal ? { ...props.deal } : blank(); });

const toggleMarket = (m) => { v.value.markets = v.value.markets.includes(m) ? v.value.markets.filter((x) => x !== m) : [...v.value.markets, m]; };
const save = () => {
  emit('save', { ...v.value, id: v.value.id || 'PD-' + Date.now() });
  toast.success(isNew.value ? 'Deal created' : 'Deal saved');
  emit('close');
};
</script>

<template>
  <ZDrawer :open="open" :title="isNew ? 'New Payment Deal' : 'Edit Payment Deal'" :width="520" @close="emit('close')">
    <div style="display:flex;flex-direction:column;gap:13px">
      <div style="padding:8px 12px;background:oklch(0.82 0.14 215 / 0.07);border:1px solid oklch(0.82 0.14 215 / 0.25);border-radius:var(--zg-radius-md);font-size:11.5px;color:oklch(0.72 0.14 215)">Payment deals require Finance + Legal approval before activation. Changes reset approval status.</div>

      <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Payment Partner Name</label><input v-model="v.partner" placeholder="e.g. Tabby, Tamara, Fawry" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" /></div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div style="display:flex;flex-direction:column;gap:4px">
          <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Deal Type</label>
          <select v-model="v.type" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;cursor:pointer">
            <option v-for="t in DEAL_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Discount %</label><input type="number" min="0" max="50" v-model.number="v.discount" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:16px;font-weight:700;color:var(--zg-accent);outline:none;text-align:center" /></div>
        <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Min Order Value</label><input type="number" v-model.number="v.minOrderValue" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:13px;color:var(--zg-text);outline:none" /></div>
        <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Max Discount Cap</label><input type="number" v-model.number="v.maxDiscount" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:13px;color:var(--zg-text);outline:none" /></div>
        <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Start Date</label><input type="date" v-model="v.startDate" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" /></div>
        <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">End Date</label><input type="date" v-model="v.endDate" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" /></div>
      </div>

      <div>
        <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:6px">Active Markets</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button v-for="m in ALL_MARKETS" :key="m" type="button" :style="{ height:'24px', padding:'0 9px', border:'1px solid', borderRadius:'3px', cursor:'pointer', fontFamily:'var(--zg-mono)', fontSize:'11px', fontWeight:700, borderColor: v.markets.includes(m) ? 'var(--zg-accent)' : 'var(--zg-line)', background: v.markets.includes(m) ? 'var(--zg-accent-tint)' : 'transparent', color: v.markets.includes(m) ? 'var(--zg-accent)' : 'var(--zg-text-dim)' }" @click="toggleMarket(m)">{{ m }}</button>
        </div>
      </div>

      <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px">
        <div style="font-size:11px;font-weight:700;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:8px">Approval Status</div>
        <div v-for="[l, key] in [['Finance Approval','financeApproved'],['Legal Approval','legalApproved']]" :key="key" style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--zg-line-soft)">
          <span style="font-size:12px;color:var(--zg-text)">{{ l }}</span>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:11px;font-weight:600" :style="{ color: v[key] ? 'var(--zg-good)' : 'var(--zg-text-dim)' }">{{ v[key] ? 'Approved' : 'Pending' }}</span>
            <button type="button" style="height:22px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-family:inherit;font-size:10.5px;color:var(--zg-text-mid)" @click="v[key] = !v[key]">{{ v[key] ? 'Revoke' : 'Approve' }}</button>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Internal Notes (optional)</label><textarea v-model="v.notes" rows="2" placeholder="Context, negotiation terms…" style="padding:8px 10px;resize:vertical;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" /></div>
    </div>

    <template #footer>
      <button class="zwh-btn-primary" :disabled="!v.partner" :style="{ opacity: v.partner ? 1 : 0.4 }" @click="save">{{ isNew ? 'Create Deal' : 'Save Changes' }}</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>
  </ZDrawer>
</template>
