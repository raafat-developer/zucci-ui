<script setup>
/**
 * FitFinderView — Size Picker / Fit Finder. Faithful port of
 * ZucciFitFinderModule from zucci-size-guides.jsx: KPI strip, 3 admin tabs
 * (Customer Flow preview / Matching Rules / Accuracy Report), the full 5-step
 * customer onboarding flow (brand entries → personal info → measurements →
 * results) with a live accuracy score.
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ZC_SIZE_CHARTS, ZC_SIZE_TYPES } from '@/data/sizeGuidesData';
import BrandEntryRow from './fitfinder/BrandEntryRow.vue';
import FFSteps from './fitfinder/FFSteps.vue';
import { toast } from '@/composables/useToast';

const router = useRouter();

const FF_GARMENTS  = ['T-Shirt','Shirt','Hoodie','Dress','Abaya','Jeans','Shoes','Sportswear','Jacket','Sweater','Shorts','Skirt','Suit'];
const FF_FIT_STYLE = ['Slim Fit','Regular Fit','Relaxed Fit','Oversized'];
const FF_MEASURES  = [
  { key:'chest',    label:'Chest',          hint:'Around the fullest part of your chest' },
  { key:'waist',    label:'Waist',          hint:'Around the narrowest part of your waist' },
  { key:'hips',     label:'Hips',           hint:'Around the fullest part of your hips' },
  { key:'shoulder', label:'Shoulder Width', hint:'From shoulder tip to shoulder tip' },
  { key:'inseam',   label:'Inseam',         hint:'From crotch to ankle along inner leg' },
  { key:'neck',     label:'Neck',           hint:'Around the base of your neck' },
  { key:'sleeve',   label:'Sleeve Length',  hint:'From shoulder tip to wrist' },
];
const FF_ACCURACY_DATA = [
  { brand:'Zucci Label',       total:1248, correct:1136, pct:91, saved:212 },
  { brand:'Urban Looms',       total:876,  correct:771,  pct:88, saved:148 },
  { brand:'Desert Kicks',      total:543,  correct:462,  pct:85, saved:89  },
  { brand:'Bakhoor House',     total:321,  correct:270,  pct:84, saved:62  },
  { brand:'Nabila Collective', total:198,  correct:162,  pct:82, saved:41  },
];

function calcAccuracy(brandEntries, personal, measures) {
  let s = 0;
  if (brandEntries.length >= 1) s += 40;
  if (brandEntries.length >= 2) s += 15;
  if (brandEntries.length >= 3) s += 10;
  if (brandEntries.filter((e) => e.feel === 'Perfect Fit').length > 0) s += 5;
  if (personal.height && personal.weight) s += 12;
  if (personal.gender) s += 4;
  if (personal.fit_style) s += 4;
  s += Math.min(Object.values(measures).filter(Boolean).length * 2, 10);
  return Math.min(s, 97);
}

const adminTab = ref('flow');
const step = ref(0);
const brandEntries = ref([{ id: Date.now(), brand:'', category:'', size:'', feel:'' }]);
const personal = ref({ height:'', weight:'', age:'', gender:'', fit_style:'' });
const measures = ref({});
const saved = ref(false);
const STEPS_TOTAL = 5;

const allBrands = computed(() => [...new Set((ZC_SIZE_CHARTS || []).map((c) => c.brand))]);
const validEntries = computed(() => brandEntries.value.filter((e) => e.brand && e.category && e.size));
const accuracy = computed(() => calcAccuracy(validEntries.value, personal.value, measures.value));

const addEntry = () => { brandEntries.value = [...brandEntries.value, { id: Date.now(), brand:'', category:'', size:'', feel:'' }]; };
const updEntry = (id, k, v) => { brandEntries.value = brandEntries.value.map((e) => (e.id === id ? { ...e, [k]: v } : e)); };
const remEntry = (id) => { brandEntries.value = brandEntries.value.filter((e) => e.id !== id); };
const updPersonal = (k, v) => { personal.value = { ...personal.value, [k]: v }; };
const updMeasure = (k, v) => { measures.value = { ...measures.value, [k]: v }; };
const resetFlow = () => { step.value = 0; brandEntries.value = [{ id: Date.now(), brand:'', category:'', size:'', feel:'' }]; personal.value = { height:'', weight:'', age:'', gender:'', fit_style:'' }; measures.value = {}; saved.value = false; };
const saveProfile = () => { saved.value = true; toast.success('Fit profile saved'); };

const sizeTypeLabel = (t) => (ZC_SIZE_TYPES || {})[t]?.label || t;
const genders = ['Female','Male','Non-binary','Prefer not to say'];
const measuresList = FF_MEASURES;
const fitStyles = FF_FIT_STYLE;
const accuracyData = FF_ACCURACY_DATA;
</script>

<template>
  <div class="zcat-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="zwh-bc-back" @click="router.push('/admin/products')"><svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14" /></svg> Products</button>
          <span style="color:var(--zg-text-xdim);font-size:11px">/</span>
          <span style="font-size:13px;font-weight:600;color:var(--zg-text)">Size Picker / Fit Finder</span>
        </div>
        <div class="zwh-subtitle">Reduce size-related returns — personalised recommendation engine</div>
      </div>
    </div>

    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Recommendations</span><span class="zwh-kpi-val is-accent">3,186</span><span class="zwh-kpi-sub">last 30 days</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Accuracy</span><span class="zwh-kpi-val is-good">88%</span><span class="zwh-kpi-sub">correct size</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Returns Prevented</span><span class="zwh-kpi-val is-good">552</span><span class="zwh-kpi-sub">avoided</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Brands Mapped</span><span class="zwh-kpi-val">{{ allBrands.length }}</span><span class="zwh-kpi-sub">with charts</span></div>
      <div class="zwh-kpi-cell"><span class="zwh-kpi-lbl">Avg Confidence</span><span class="zwh-kpi-val">87%</span><span class="zwh-kpi-sub">per rec.</span></div>
    </div>

    <div style="display:flex;border-bottom:1px solid var(--zg-line);background:var(--zg-bg-elev);flex-shrink:0;padding:0 20px">
      <button v-for="[v, l] in [['flow','Customer Flow'],['rules','Matching Rules'],['accuracy','Accuracy Report']]" :key="v" style="height:40px;padding:0 14px;border:none;background:transparent;font-family:inherit;font-size:12.5px;cursor:pointer" :style="{ color: adminTab === v ? 'var(--zg-accent)' : 'var(--zg-text-dim)', borderBottom: adminTab === v ? '2px solid var(--zg-accent)' : '2px solid transparent', marginBottom:'-1px', fontWeight: adminTab === v ? 600 : 400 }" @click="adminTab = v">{{ l }}</button>
    </div>

    <!-- Customer flow preview -->
    <div v-if="adminTab === 'flow'" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;min-height:0">
      <div style="margin:12px 20px 0;padding:8px 12px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:11px;color:var(--zg-text-dim);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-shrink:0">
        <span>Admin preview — this is the customer-facing Fit Finder onboarding flow</span>
        <button style="height:22px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;font-family:inherit;font-size:10.5px;cursor:pointer;color:var(--zg-text-dim);flex-shrink:0" @click="resetFlow">Reset</button>
      </div>

      <FFSteps v-if="step > 0" :current="step" :total="STEPS_TOTAL" />

      <div style="flex:1">
        <!-- Step 0: intro -->
        <div v-if="step === 0" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:40px 24px;text-align:center">
          <div style="width:76px;height:76px;border-radius:50%;background:var(--zg-accent-tint);border:2px solid var(--zg-accent);display:flex;align-items:center;justify-content:center">
            <svg viewBox="0 0 40 40" width="38" fill="none" stroke="var(--zg-accent)" stroke-width="2" stroke-linecap="round"><circle cx="20" cy="14" r="6" /><path d="M8 36c0-6.627 5.373-12 12-12 6.627 0 12 5.373 12 12" /><path d="M32 10l3 3-3 3M8 10l-3 3 3 3" /></svg>
          </div>
          <div>
            <div style="font-size:22px;font-weight:800;color:var(--zg-text);margin-bottom:8px">Find Your Perfect Fit</div>
            <div style="font-size:13px;color:var(--zg-text-mid);line-height:1.6;max-width:380px">Get personalised size recommendations across every brand on Zucci — without guessing.</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:340px">
            <div v-for="[l, sub] in [['Tell us your size in existing brands','Most accurate · 2 minutes'],['Add height & weight','Good estimate · 1 minute'],['Enter body measurements','Highest accuracy · 3 minutes']]" :key="l" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);text-align:left">
              <div style="width:22px;height:22px;border-radius:50%;background:var(--zg-accent-tint);color:var(--zg-accent);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">{{ [['Tell us your size in existing brands'],['Add height & weight'],['Enter body measurements']].findIndex((x) => x[0] === l) + 1 }}</div>
              <div><div style="font-size:12.5px;font-weight:600;color:var(--zg-text)">{{ l }}</div><div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:1px">{{ sub }}</div></div>
            </div>
          </div>
          <button class="zwh-btn-primary" style="height:44px;font-size:14px;font-weight:700;padding-left:32px;padding-right:32px;margin-top:4px" @click="step = 1">Find My Size</button>
        </div>

        <!-- Step 1: brand entries -->
        <div v-else-if="step === 1" style="display:flex;flex-direction:column;gap:14px;padding:20px">
          <div>
            <div style="font-size:16px;font-weight:700;color:var(--zg-text);margin-bottom:4px">Which brands do you currently wear?</div>
            <div style="font-size:12px;color:var(--zg-text-dim)">Tell us your size in brands you know. This is our most accurate signal.</div>
          </div>
          <div>
            <div style="display:grid;grid-template-columns:1fr 110px 80px 120px 28px;gap:8px;padding:6px 12px;font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600">
              <span>Brand</span><span>Category</span><span>Your Size</span><span>How it fits</span><span></span>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <BrandEntryRow v-for="e in brandEntries" :key="e.id" :entry="e" :brands="allBrands" :garments="FF_GARMENTS" @update="(k, v) => updEntry(e.id, k, v)" @remove="remEntry(e.id)" />
            </div>
          </div>
          <button class="zwh-btn-ghost" style="width:fit-content;height:28px;font-size:11px" @click="addEntry">+ Add another brand</button>
          <div v-if="validEntries.length" style="padding:10px 14px;background:var(--zg-accent-tint);border:1px solid oklch(0.78 0.18 130 / 0.3);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-accent);display:flex;align-items:center;gap:8px">
            <span style="font-weight:700">{{ validEntries.length }}</span> brand{{ validEntries.length > 1 ? 's' : '' }} added · Profile accuracy: <span style="font-weight:700">{{ accuracy }}%</span>
          </div>
        </div>

        <!-- Step 2: personal info -->
        <div v-else-if="step === 2" style="display:flex;flex-direction:column;gap:14px;padding:20px">
          <div>
            <div style="font-size:16px;font-weight:700;color:var(--zg-text);margin-bottom:2px">Personal Information <span style="font-size:12px;color:var(--zg-text-dim);font-weight:400">(optional)</span></div>
            <div style="font-size:12px;color:var(--zg-text-dim)">Improves recommendation accuracy by up to 15%</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
            <div v-for="[k, l, ph] in [['height','Height (cm)','165'],['weight','Weight (kg)','62'],['age','Age','28']]" :key="k" style="display:flex;flex-direction:column;gap:5px">
              <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">{{ l }}</label>
              <input type="number" :value="personal[k]" :placeholder="ph" style="height:36px;padding:0 12px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:16px;font-weight:600;color:var(--zg-text);outline:none;text-align:center" @input="updPersonal(k, $event.target.value)" />
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px">
            <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Gender</label>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button v-for="g in genders" :key="g" type="button" :style="{ height:'32px', padding:'0 14px', border:'1px solid', borderRadius:'var(--zg-radius-md)', background: personal.gender===g?'var(--zg-accent-tint)':'transparent', cursor:'pointer', fontSize:'12px', fontFamily:'inherit', fontWeight:600, borderColor: personal.gender===g?'var(--zg-accent)':'var(--zg-line)', color: personal.gender===g?'var(--zg-accent)':'var(--zg-text-mid)' }" @click="updPersonal('gender', personal.gender === g ? '' : g)">{{ g }}</button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Preferred Fit Style</label>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
              <button v-for="fs in fitStyles" :key="fs" type="button" :style="{ padding:'10px 8px', border:'1px solid', borderRadius:'var(--zg-radius-md)', background: personal.fit_style===fs?'var(--zg-accent-tint)':'transparent', cursor:'pointer', fontSize:'11.5px', fontFamily:'inherit', fontWeight:600, borderColor: personal.fit_style===fs?'var(--zg-accent)':'var(--zg-line)', color: personal.fit_style===fs?'var(--zg-accent)':'var(--zg-text-mid)' }" @click="updPersonal('fit_style', personal.fit_style === fs ? '' : fs)">{{ fs }}</button>
            </div>
          </div>
        </div>

        <!-- Step 3: measurements -->
        <div v-else-if="step === 3" style="display:flex;flex-direction:column;gap:14px;padding:20px">
          <div>
            <div style="font-size:16px;font-weight:700;color:var(--zg-text);margin-bottom:2px">Body Measurements <span style="font-size:12px;color:var(--zg-text-dim);font-weight:400">(optional)</span></div>
            <div style="font-size:12px;color:var(--zg-text-dim)">All values in centimetres (cm). Enter as many or as few as you like.</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
            <div v-for="m in measuresList" :key="m.key" style="display:flex;flex-direction:column;gap:4px">
              <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">{{ m.label }}</label>
              <input type="number" :value="measures[m.key]" placeholder="—" style="height:34px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:14px;font-weight:600;color:var(--zg-text);outline:none;text-align:center" @input="updMeasure(m.key, $event.target.value)" />
              <span style="font-size:9.5px;color:var(--zg-text-xdim);line-height:1.3">{{ m.hint }}</span>
            </div>
          </div>
          <div style="padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-text-dim);line-height:1.5">Use a soft measuring tape. Measure over light clothing or directly on skin — pull snug but not tight.</div>
        </div>

        <!-- Step 4: results -->
        <div v-else-if="step === 4" style="display:flex;flex-direction:column;gap:14px;padding:20px">
          <div style="font-size:16px;font-weight:700;color:var(--zg-text)">Your Fit Profile</div>
          <div :style="{ padding:'16px 20px', background: accuracy>=80?'oklch(0.78 0.15 150 / 0.08)':'oklch(0.82 0.15 75 / 0.08)', border:'1px solid', borderRadius:'var(--zg-radius-md)', borderColor: accuracy>=80?'oklch(0.78 0.15 150 / 0.3)':'oklch(0.82 0.15 75 / 0.3)', display:'flex', alignItems:'center', gap:16 }">
            <div style="text-align:center;flex-shrink:0">
              <div :style="{ fontSize:'40px', fontWeight:800, fontFamily:'var(--zg-mono)', color: accuracy>=80?'var(--zg-good)':'var(--zg-warn)', lineHeight:1 }">{{ accuracy }}%</div>
              <div style="font-size:10px;color:var(--zg-text-dim);margin-top:2px">Fit Accuracy</div>
            </div>
            <div style="flex:1">
              <div style="height:8px;background:var(--zg-panel-hi);border-radius:4px;margin-bottom:6px;overflow:hidden"><div :style="{ height:'100%', width: accuracy + '%', background: accuracy>=80?'var(--zg-good)':'var(--zg-warn)', borderRadius:'4px' }" /></div>
              <div style="font-size:11.5px;color:var(--zg-text-mid)">{{ accuracy>=85?'Excellent — highly personalised recommendations':accuracy>=65?'Good — solid recommendations across most brands':'Basic — add more brands or measurements to improve' }}</div>
            </div>
          </div>
          <div v-if="validEntries.length" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
            <div style="padding:7px 14px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600">Brand Profiles ({{ validEntries.length }})</div>
            <div v-for="(e, i) in validEntries" :key="i" style="display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid var(--zg-line-soft)">
              <span style="font-size:12.5px;font-weight:600;color:var(--zg-text);flex:1">{{ e.brand }}</span>
              <span style="font-size:11.5px;color:var(--zg-text-mid)">{{ e.category }}</span>
              <span style="font-family:var(--zg-mono);font-size:13px;font-weight:700;color:var(--zg-accent);min-width:28px;text-align:right">{{ e.size }}</span>
              <span v-if="e.feel" :style="{ fontSize:'10.5px', padding:'2px 7px', background: e.feel==='Perfect Fit'?'var(--zg-accent-tint)':'var(--zg-panel-hi)', borderRadius:'3px', color: e.feel==='Perfect Fit'?'var(--zg-accent)':'var(--zg-text-dim)', fontWeight:600 }">{{ e.feel }}</span>
            </div>
          </div>
          <div v-if="personal.height || personal.weight || personal.gender || personal.fit_style" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
            <div style="padding:7px 14px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600">Personal Info</div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr)">
              <div v-for="[l, v] in [['Height', personal.height?personal.height+'cm':'—'],['Weight', personal.weight?personal.weight+'kg':'—'],['Gender', personal.gender||'—'],['Fit Style', personal.fit_style||'—']]" :key="l" style="padding:10px 14px;border-right:1px solid var(--zg-line-soft)">
                <div style="font-size:10px;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px">{{ l }}</div>
                <div style="font-size:12.5px;font-weight:600;color:var(--zg-text)">{{ v }}</div>
              </div>
            </div>
          </div>
          <div v-if="Object.values(measures).some(Boolean)" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
            <div style="padding:7px 14px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600">Measurements</div>
            <div style="display:flex;flex-wrap:wrap">
              <div v-for="m in measuresList.filter((m) => measures[m.key])" :key="m.key" style="padding:10px 14px;border-right:1px solid var(--zg-line-soft);border-bottom:1px solid var(--zg-line-soft)">
                <div style="font-size:10px;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px">{{ m.label }}</div>
                <div style="font-size:13px;font-weight:700;font-family:var(--zg-mono);color:var(--zg-text)">{{ measures[m.key] }} cm</div>
              </div>
            </div>
          </div>
          <div v-if="saved" style="padding:12px 16px;background:oklch(0.78 0.15 150 / 0.1);border:1px solid oklch(0.78 0.15 150 / 0.3);border-radius:var(--zg-radius-md);font-size:13px;font-weight:600;color:var(--zg-good);text-align:center">Fit profile saved</div>
        </div>
      </div>

      <div style="padding:14px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap">
        <button v-if="step > 0" class="zwh-btn-ghost" @click="step--">Back</button>
        <button v-if="step === 0" class="zwh-btn-primary" style="height:40px;font-size:13px;font-weight:700" @click="step = 1">Find My Size</button>
        <button v-if="step >= 1 && step <= 3" class="zwh-btn-primary" style="height:40px" :disabled="step === 1 && !validEntries.length" :style="{ opacity: step === 1 && !validEntries.length ? 0.4 : 1 }" @click="step++">{{ step === 1 && !validEntries.length ? 'Add at least 1 brand to continue' : 'Continue →' }}</button>
        <button v-if="step >= 2 && step <= 3" class="zwh-btn-ghost" @click="step++">Skip this step</button>
        <button v-if="step === 4 && !saved" class="zwh-btn-primary" style="height:40px;font-size:13px;font-weight:700" @click="saveProfile">Save My Fit Profile</button>
      </div>
    </div>

    <!-- Matching rules -->
    <div v-else-if="adminTab === 'rules'" class="zcat-content">
      <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:130px 1fr 1fr 1fr 80px;gap:10px;padding:0 14px;height:32px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span>Brand</span><span>Size Type</span><span>Primary Rule</span><span>Fit Adjustment</span><span>Status</span>
        </div>
        <div v-for="c in (ZC_SIZE_CHARTS || []).filter((c) => c.status === 'approved')" :key="c.id" style="display:grid;grid-template-columns:130px 1fr 1fr 1fr 80px;gap:10px;padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;font-size:12px">
          <span style="font-weight:600;color:var(--zg-text)">{{ c.brand }}</span>
          <span style="color:var(--zg-text-dim)">{{ sizeTypeLabel(c.size_type) }}</span>
          <span style="color:var(--zg-text-mid);font-family:var(--zg-mono);font-size:11px">brand size → chart mapping</span>
          <span style="color:var(--zg-text-dim);font-size:11px">Slim −1 · Oversized +2</span>
          <span class="zcat-badge approved">Active</span>
        </div>
      </div>
    </div>

    <!-- Accuracy report -->
    <div v-else class="zcat-content">
      <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:1fr 70px 70px 110px 140px;gap:10px;padding:0 14px;height:32px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span>Brand</span><span>Total</span><span>Correct</span><span>Accuracy</span><span>Returns Prevented</span>
        </div>
        <div v-for="r in accuracyData" :key="r.brand" style="display:grid;grid-template-columns:1fr 70px 70px 110px 140px;gap:10px;padding:12px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center">
          <span style="font-weight:600;font-size:13px;color:var(--zg-text)">{{ r.brand }}</span>
          <span style="font-family:var(--zg-mono);font-size:12px">{{ r.total.toLocaleString() }}</span>
          <span style="font-family:var(--zg-mono);font-size:12px">{{ r.correct.toLocaleString() }}</span>
          <div style="display:flex;align-items:center;gap:6px">
            <div style="width:44px;height:4px;background:var(--zg-panel-hi);border-radius:2px"><div :style="{ height:'100%', width: r.pct + '%', background: r.pct>=90?'var(--zg-good)':'var(--zg-accent)', borderRadius:'2px' }" /></div>
            <span :style="{ fontFamily:'var(--zg-mono)', fontSize:'12px', fontWeight:700, color: r.pct>=90?'var(--zg-good)':'var(--zg-accent)' }">{{ r.pct }}%</span>
          </div>
          <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-good);font-weight:600">↓ {{ r.saved }} returns</span>
        </div>
      </div>
    </div>
  </div>
</template>
