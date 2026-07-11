<script setup>
import { ref, reactive } from 'vue';
import { ZCW_TYPE_META } from '@/data/warehouseData';

const emit = defineEmits(['close', 'save']);

const TYPES = Object.keys(ZCW_TYPE_META);
const ALL_MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const COUNTRIES = [
  { code:'AE', name:'UAE',         flag:'🇦🇪', currency:'AED' },
  { code:'SA', name:'Saudi Arabia',flag:'🇸🇦', currency:'SAR' },
  { code:'EG', name:'Egypt',       flag:'🇪🇬', currency:'EGP' },
  { code:'KW', name:'Kuwait',      flag:'🇰🇼', currency:'KWD' },
  { code:'BH', name:'Bahrain',     flag:'🇧🇭', currency:'BHD' },
  { code:'QA', name:'Qatar',       flag:'🇶🇦', currency:'QAR' },
  { code:'OM', name:'Oman',        flag:'🇴🇲', currency:'OMR' },
];

const step = ref(0); // 0:info, 1:capacity, 2:costs

const v = reactive({
  name:'', country:'AE', city:'', district:'', address:'', operator:'', tech_integration:'manual',
  types:['owned'], markets:['AE'], status:'active',
  capacity:{ m2:0, pallets:0, bins:0 },
  costs:{ storage_per_m2_per_day:0, storage_per_pallet_per_day:0, receiving_fee:0, handling_fee:0, fulfillment_fee:0 },
  contact:{ first:'', last:'', phone:'', email:'' },
});

const toggleType = t => { v.types = v.types.includes(t) ? v.types.filter(x=>x!==t) : [...v.types, t]; };
const toggleMkt  = m => { v.markets = v.markets.includes(m) ? v.markets.filter(x=>x!==m) : [...v.markets, m]; };
const currency = () => COUNTRIES.find(c => c.code === v.country)?.currency || 'AED';

function save() { emit('save', { ...v, id:'WH-'+Date.now(), flag:COUNTRIES.find(c=>c.code===v.country)?.flag||'🏭', currency:currency() }); emit('close'); }
</script>

<template>
  <Teleport to="body">
    <div style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.6);" @click="emit('close')" />
    <div style="position:fixed;top:0;right:0;bottom:0;width:560px;z-index:9201;background:var(--zg-bg-elev);border-left:1px solid var(--zg-line);display:flex;flex-direction:column;box-shadow:-8px 0 32px oklch(0.05 0.01 250 / 0.5);" @click.stop>
      <!-- Head -->
      <div style="padding:16px 20px;border-bottom:1px solid var(--zg-line);display:flex;justify-content:space-between;align-items:flex-start;flex-shrink:0;">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--zg-text);">New Warehouse</div>
          <div style="font-size:11.5px;color:var(--zg-text-dim);margin-top:2px;">Step {{ step+1 }} of 3 — {{ ['Basic Info','Capacity','Cost Rates'][step] }}</div>
        </div>
        <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:16px;" @click="emit('close')">×</button>
      </div>

      <!-- Steps nav -->
      <div style="display:flex;border-bottom:1px solid var(--zg-line);flex-shrink:0;">
        <button v-for="(l,i) in ['Basic Info','Capacity','Cost Rates']" :key="i"
          style="flex:1;height:34px;border:none;background:transparent;cursor:pointer;font-family:inherit;font-size:12px;border-bottom:2px solid transparent;transition:all .1s;"
          :style="{ color:step===i?'var(--zg-accent)':'var(--zg-text-dim)', borderBottomColor:step===i?'var(--zg-accent)':'transparent', fontWeight:step===i?600:400 }"
          @click="step=i">{{ l }}</button>
      </div>

      <!-- Body -->
      <div style="flex:1;overflow-y:auto;padding:20px;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;">
        <!-- Step 0: Basic Info -->
        <div v-if="step === 0" style="display:flex;flex-direction:column;gap:14px;">
          <div class="zwh-field"><label class="zwh-field-label">Warehouse Name <span style="color:var(--zg-danger);">*</span></label><input class="zwh-field-input" v-model="v.name" placeholder="e.g. Zucci Dubai Hub" /></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="zwh-field">
              <label class="zwh-field-label">Country</label>
              <select class="zwh-field-input" v-model="v.country" style="cursor:pointer;">
                <option v-for="c in COUNTRIES" :key="c.code" :value="c.code">{{ c.flag }} {{ c.name }}</option>
              </select>
            </div>
            <div class="zwh-field"><label class="zwh-field-label">City</label><input class="zwh-field-input" v-model="v.city" /></div>
            <div class="zwh-field"><label class="zwh-field-label">District / Zone</label><input class="zwh-field-input" v-model="v.district" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Operator / 3PL</label><input class="zwh-field-input" v-model="v.operator" placeholder="e.g. Aramex Fulfillment" /></div>
          </div>
          <div class="zwh-field"><label class="zwh-field-label">Address</label><textarea class="zwh-field-textarea" v-model="v.address" rows="2" /></div>
          <div>
            <div class="zwh-field-label" style="margin-bottom:8px;">Warehouse Types</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button v-for="t in TYPES" :key="t" @click="toggleType(t)"
                style="height:26px;padding:0 10px;border:1px solid;border-radius:3px;cursor:pointer;font-size:11px;font-weight:600;transition:all .12s;"
                :style="{ borderColor:v.types.includes(t)?'var(--zg-accent)':'var(--zg-line)', background:v.types.includes(t)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:v.types.includes(t)?'var(--zg-accent)':'var(--zg-text-dim)' }">
                {{ ZCW_TYPE_META[t]?.label || t }}
              </button>
            </div>
          </div>
          <div>
            <div class="zwh-field-label" style="margin-bottom:8px;">Markets Served</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button v-for="m in ALL_MARKETS" :key="m" @click="toggleMkt(m)"
                style="height:26px;padding:0 10px;border:1px solid;border-radius:3px;cursor:pointer;font-family:var(--zg-mono);font-size:11px;font-weight:700;transition:all .12s;"
                :style="{ borderColor:v.markets.includes(m)?'var(--zg-accent)':'var(--zg-line)', background:v.markets.includes(m)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:v.markets.includes(m)?'var(--zg-accent)':'var(--zg-text-dim)' }">
                {{ m }}
              </button>
            </div>
          </div>
          <div>
            <div class="zwh-field-label" style="margin-bottom:8px;">Tech Integration</div>
            <div style="display:flex;gap:6px;">
              <button v-for="[val,lbl] in [['manual','Manual / CSV'],['api_wms','API / WMS'],['rfid','RFID']]" :key="val"
                style="height:28px;padding:0 12px;border:1px solid;border-radius:3px;cursor:pointer;font-size:11.5px;transition:all .12s;"
                :style="{ borderColor:v.tech_integration===val?'var(--zg-accent)':'var(--zg-line)', background:v.tech_integration===val?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:v.tech_integration===val?'var(--zg-accent)':'var(--zg-text-dim)' }"
                @click="v.tech_integration = val">{{ lbl }}</button>
            </div>
          </div>
          <!-- Contact -->
          <div class="zwh-section-label">Contact Person</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div class="zwh-field"><label class="zwh-field-label">First Name</label><input class="zwh-field-input" v-model="v.contact.first" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Last Name</label><input class="zwh-field-input" v-model="v.contact.last" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Phone</label><input class="zwh-field-input" v-model="v.contact.phone" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Email</label><input class="zwh-field-input" type="email" v-model="v.contact.email" /></div>
          </div>
        </div>

        <!-- Step 1: Capacity -->
        <div v-else-if="step === 1" style="display:flex;flex-direction:column;gap:14px;">
          <div class="zwh-section-label">Physical Capacity</div>
          <div class="zwh-costs-grid">
            <div class="zwh-field"><label class="zwh-field-label">Floor Space (m²)</label><input class="zwh-field-input" type="number" v-model.number="v.capacity.m2" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Used Space (m²)</label><input class="zwh-field-input" type="number" :value="0" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Pallet Positions</label><input class="zwh-field-input" type="number" v-model.number="v.capacity.pallets" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Bin Locations</label><input class="zwh-field-input" type="number" v-model.number="v.capacity.bins" /></div>
          </div>
          <div style="padding:10px 14px;background:oklch(0.78 0.18 130 / 0.06);border:1px solid oklch(0.78 0.18 130 / 0.2);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-text-mid);">
            Leave capacity fields at 0 for virtual / cross-dock warehouses.
          </div>
          <div>
            <div class="zwh-field-label" style="margin-bottom:8px;">Initial Status</div>
            <div style="display:flex;gap:6px;">
              <button v-for="[val,lbl] in [['active','Active'],['inactive','Inactive'],['maintenance','Maintenance']]" :key="val"
                style="height:28px;padding:0 12px;border:1px solid;border-radius:3px;cursor:pointer;font-size:11.5px;transition:all .12s;"
                :style="{ borderColor:v.status===val?'var(--zg-accent)':'var(--zg-line)', background:v.status===val?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:v.status===val?'var(--zg-accent)':'var(--zg-text-dim)' }"
                @click="v.status = val">{{ lbl }}</button>
            </div>
          </div>
        </div>

        <!-- Step 2: Costs -->
        <div v-else style="display:flex;flex-direction:column;gap:14px;">
          <div class="zwh-section-label">Cost Rates ({{ currency() }})</div>
          <div class="zwh-costs-grid">
            <div class="zwh-field"><label class="zwh-field-label">Storage / m² / day</label><input class="zwh-field-input" type="number" v-model.number="v.costs.storage_per_m2_per_day" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Storage / pallet / day</label><input class="zwh-field-input" type="number" v-model.number="v.costs.storage_per_pallet_per_day" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Receiving / shipment</label><input class="zwh-field-input" type="number" v-model.number="v.costs.receiving_fee" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Handling / unit</label><input class="zwh-field-input" type="number" v-model.number="v.costs.handling_fee" /></div>
            <div class="zwh-field"><label class="zwh-field-label">Fulfillment / order</label><input class="zwh-field-input" type="number" v-model.number="v.costs.fulfillment_fee" /></div>
          </div>
          <div style="padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-text-dim);">
            Cost rates are used to calculate daily storage accruals and finance reporting. Leave at 0 if managed by 3PL invoices.
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;flex-shrink:0;">
        <button v-if="step > 0" class="zwh-btn-ghost" @click="step--">← Back</button>
        <button v-if="step < 2" class="zwh-btn-primary" :disabled="!v.name && step === 0" :style="{ opacity: (!v.name && step===0)?0.4:1 }" @click="step++">Next →</button>
        <button v-if="step === 2" class="zwh-btn-primary" @click="save">Create Warehouse</button>
        <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
      </div>
    </div>
  </Teleport>
</template>
