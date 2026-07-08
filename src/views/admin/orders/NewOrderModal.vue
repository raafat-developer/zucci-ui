<script setup>
/**
 * NewOrderModal — 4-step manual order creation. Faithful port of
 * NewOrderModal from zucci-new-order.jsx: Customer → Products → Shipping →
 * Review, with step indicators, product picker + running cart, market/
 * payment chips, and final review summary.
 */
import { ref, computed, watch } from 'vue';
import ZModal from '@/components/ui/ZModal.vue';
import { toast } from '@/composables/useToast';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['close']);

const ORDER_PRODUCTS = [
  { sku:'NC-ABAYA-BLK-54', name:'Midnight Abaya', vendor:'Nabila Collective', price:520, currency:'AED' },
  { sku:'DK-SNKR-WHT-42', name:'Cloud Runner Sneakers', vendor:'Desert Kicks', price:449, currency:'AED' },
  { sku:'BH-OUD-50ML', name:'Arabian Night Oud 50ml', vendor:'Bakhoor House', price:380, currency:'AED' },
  { sku:'ZL-HIJAB-BLU-OS', name:'Silk Hijab Ocean Blue', vendor:'Zucci Label', price:89, currency:'AED' },
  { sku:'UL-DRESS-GRN-M', name:'Emerald Wrap Dress', vendor:'Urban Looms', price:299, currency:'AED' },
];
const STEPS = ['Customer', 'Products', 'Shipping', 'Review'];
const MARKETS = [['AE','🇦🇪'],['SA','🇸🇦'],['EG','🇪🇬'],['QA','🇶🇦']];
const PAYMENTS = [['card','Credit Card'],['cod','Cash on Delivery'],['wallet','Digital Wallet']];

const step = ref(0);
const blank = () => ({ customer_name:'', customer_email:'', customer_phone:'', market:'AE', items:[], shipping_name:'', shipping_address:'', shipping_city:'', payment:'card', notes:'' });
const v = ref(blank());
watch(() => props.open, (o) => { if (o) { step.value = 0; v.value = blank(); } });

const addItem = (prod) => {
  const existing = v.value.items.find((i) => i.sku === prod.sku);
  if (existing) v.value.items = v.value.items.map((i) => (i.sku === prod.sku ? { ...i, qty: i.qty + 1 } : i));
  else v.value.items = [...v.value.items, { ...prod, qty: 1 }];
};
const removeItem = (sku) => { v.value.items = v.value.items.filter((i) => i.sku !== sku); };
const bumpQty = (sku, delta) => { v.value.items = v.value.items.map((i) => (i.sku === sku ? { ...i, qty: Math.max(1, i.qty + delta) } : i)); };
const subtotal = computed(() => v.value.items.reduce((s, i) => s + i.price * i.qty, 0));

const canContinue = computed(() => !(step.value === 1 && v.value.items.length === 0));
const createOrder = () => { toast.success(`Order #ORD-${Math.floor(Math.random() * 10000)} created`); emit('close'); };
const goBack = (i) => { if (i < step.value) step.value = i; };
</script>

<template>
  <ZModal :open="open" :width="640" @close="emit('close')">
    <template #head>
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
        <div style="font-size:15px;font-weight:700;color:var(--zg-text)">New Order</div>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="display:flex;align-items:center;gap:4px">
            <template v-for="(s, i) in STEPS" :key="s">
              <div
                :style="{ width:'22px', height:'22px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700, flexShrink:0, cursor: i < step ? 'pointer' : 'default', background: i < step ? 'var(--zg-good)' : i === step ? 'var(--zg-accent)' : 'var(--zg-panel)', border: i === step ? 'none' : '1px solid var(--zg-line)', color: i <= step ? '#111' : 'var(--zg-text-dim)' }"
                @click="goBack(i)"
              >{{ i < step ? '✓' : i + 1 }}</div>
              <div v-if="i < STEPS.length - 1" :style="{ width:'20px', height:'2px', background: i < step ? 'var(--zg-good)' : 'var(--zg-line)', borderRadius:'1px' }" />
            </template>
          </div>
          <button type="button" style="width:26px;height:26px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:15px" @click="emit('close')">×</button>
        </div>
      </div>
    </template>

    <div style="min-height:280px">
      <!-- Step 0: Customer -->
      <div v-if="step === 0" style="display:flex;flex-direction:column;gap:12px">
        <div style="font-size:13px;font-weight:600;color:var(--zg-text);margin-bottom:4px">Customer Information</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div v-for="[k, l, ph] in [['customer_name','Full Name','Hessa Al Mansoori'],['customer_email','Email','customer@email.com'],['customer_phone','Phone','+971 5X XXX XXXX']]" :key="k" :style="{ display:'flex', flexDirection:'column', gap:'4px', gridColumn: k === 'customer_name' ? '1 / -1' : undefined }">
            <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">{{ l }}</label>
            <input v-model="v[k]" :placeholder="ph" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" />
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Market</label>
          <div style="display:flex;gap:6px">
            <button v-for="[code, flag] in MARKETS" :key="code" type="button" :style="{ height:'32px', padding:'0 12px', border:'1px solid', borderRadius:'var(--zg-radius-md)', cursor:'pointer', fontFamily:'var(--zg-mono)', fontSize:'12px', fontWeight:700, borderColor: v.market === code ? 'var(--zg-accent)' : 'var(--zg-line)', background: v.market === code ? 'var(--zg-accent-tint)' : 'var(--zg-panel)', color: v.market === code ? 'var(--zg-accent)' : 'var(--zg-text-mid)' }" @click="v.market = code">{{ flag }} {{ code }}</button>
          </div>
        </div>
      </div>

      <!-- Step 1: Products -->
      <div v-else-if="step === 1" style="display:flex;flex-direction:column;gap:10px">
        <div style="font-size:13px;font-weight:600;color:var(--zg-text);margin-bottom:4px">Add Products</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div v-for="p in ORDER_PRODUCTS" :key="p.sku" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md)">
            <div style="flex:1"><div style="font-size:12.5px;font-weight:600;color:var(--zg-text)">{{ p.name }}</div><div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:1px">{{ p.vendor }} · {{ p.sku }}</div></div>
            <span style="font-family:var(--zg-mono);font-weight:700;color:var(--zg-text);font-size:13px">AED {{ p.price }}</span>
            <button type="button" style="height:28px;padding:0 12px;border:1px solid var(--zg-accent);border-radius:var(--zg-radius-md);background:var(--zg-accent-tint);cursor:pointer;font-family:inherit;font-size:11.5px;font-weight:600;color:var(--zg-accent)" @click="addItem(p)">+ Add</button>
          </div>
        </div>
        <div v-if="v.items.length" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);margin-bottom:8px">Order ({{ v.items.length }} items)</div>
          <div v-for="item in v.items" :key="item.sku" style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--zg-line-soft);font-size:12px">
            <span style="flex:1;color:var(--zg-text);font-weight:500">{{ item.name }}</span>
            <div style="display:flex;align-items:center;gap:4px">
              <button type="button" style="width:22px;height:22px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:14px;color:var(--zg-text-dim)" @click="bumpQty(item.sku, -1)">−</button>
              <span style="font-family:var(--zg-mono);width:20px;text-align:center;font-size:13px;font-weight:700">{{ item.qty }}</span>
              <button type="button" style="width:22px;height:22px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:14px;color:var(--zg-text-dim)" @click="bumpQty(item.sku, 1)">+</button>
            </div>
            <span style="font-family:var(--zg-mono);font-size:12px;font-weight:600;width:70px;text-align:right">AED {{ item.price * item.qty }}</span>
            <button type="button" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;color:var(--zg-danger);font-size:14px" @click="removeItem(item.sku)">×</button>
          </div>
          <div style="display:flex;justify-content:space-between;padding-top:8px;font-family:var(--zg-mono);font-weight:700"><span style="font-size:13px;color:var(--zg-text)">Subtotal</span><span style="font-size:14px;color:var(--zg-accent)">AED {{ subtotal }}</span></div>
        </div>
      </div>

      <!-- Step 2: Shipping -->
      <div v-else-if="step === 2" style="display:flex;flex-direction:column;gap:12px">
        <div style="font-size:13px;font-weight:600;color:var(--zg-text);margin-bottom:4px">Shipping Details</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div v-for="[k, l, ph] in [['shipping_name','Recipient Name',''],['shipping_address','Street Address',''],['shipping_city','City','']]" :key="k" :style="{ display:'flex', flexDirection:'column', gap:'4px', gridColumn: k === 'shipping_address' ? '1 / -1' : undefined }">
            <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">{{ l }}</label>
            <input v-model="v[k]" :placeholder="ph" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" />
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Payment Method</label>
          <div style="display:flex;gap:6px">
            <button v-for="[val, lbl] in PAYMENTS" :key="val" type="button" :style="{ height:'30px', padding:'0 12px', border:'1px solid', borderRadius:'var(--zg-radius-md)', cursor:'pointer', fontFamily:'inherit', fontSize:'11.5px', fontWeight:600, borderColor: v.payment === val ? 'var(--zg-accent)' : 'var(--zg-line)', background: v.payment === val ? 'var(--zg-accent-tint)' : 'var(--zg-panel)', color: v.payment === val ? 'var(--zg-accent)' : 'var(--zg-text-mid)' }" @click="v.payment = val">{{ lbl }}</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Internal Notes</label>
          <textarea v-model="v.notes" placeholder="Delivery instructions, special handling…" style="height:60px;padding:8px 10px;resize:none;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" />
        </div>
      </div>

      <!-- Step 3: Review -->
      <div v-else style="display:flex;flex-direction:column;gap:12px">
        <div style="font-size:13px;font-weight:600;color:var(--zg-text);margin-bottom:4px">Order Review</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div v-for="[l, val] in [['Customer', v.customer_name || '—'],['Email', v.customer_email || '—'],['Phone', v.customer_phone || '—'],['Market', v.market],['Payment', v.payment],['Items', v.items.length + ' products'],['Subtotal', 'AED ' + subtotal]]" :key="l" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:8px 12px">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-xdim);font-weight:600;margin-bottom:2px">{{ l }}</div>
            <div style="font-size:13px;font-weight:600;color:var(--zg-text)">{{ val }}</div>
          </div>
        </div>
        <div style="padding:10px 14px;background:oklch(0.78 0.15 150 / 0.06);border:1px solid oklch(0.78 0.15 150 / 0.25);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-good)">Submitting will create the order and trigger the fulfillment workflow.</div>
      </div>
    </div>

    <template #footer>
      <button v-if="step > 0" class="zwh-btn-ghost" @click="step--">Back</button>
      <button v-if="step < 3" class="zwh-btn-primary" :disabled="!canContinue" :style="{ opacity: canContinue ? 1 : 0.4 }" @click="step++">{{ step === 1 && !v.items.length ? 'Add at least 1 product' : 'Continue →' }}</button>
      <button v-if="step === 3" class="zwh-btn-primary" @click="createOrder">Create Order</button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>
  </ZModal>
</template>
