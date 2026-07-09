<script setup>
/**
 * BundlesView — Bundles & Kits module. Faithful port of ZucciBundlesModule
 * from zucci-bundles-b2b.jsx: KPI strip, status filter chips, bundle list
 * (SKUs, markets, price/compare-at, sold/stock, activate/deactivate), and
 * the New/Edit Bundle modal.
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from '@/composables/useToast';

const router = useRouter();

const BUNDLES_DATA = [
  { id:'BND-001', name:'Ramadan Gifting Set', skus:['BH-OUD-50ML','ZL-HIJAB-BLU-OS','NC-ABAYA-BLK-54'], price:849, compareAt:1089, status:'active', markets:['AE','SA'], sold:124, stock:48 },
  { id:'BND-002', name:'Desert Summer Pack', skus:['DK-SNKR-WHT-42','DK-BOOT-BRN-41'], price:699, compareAt:869, status:'active', markets:['AE'], sold:62, stock:31 },
  { id:'BND-003', name:"Men's Friday Essentials", skus:['CC-TOBE-WHT-52','UL-POLO-M-WHT','UL-SHRT-NVY-M'], price:489, compareAt:598, status:'draft', markets:['SA','AE'], sold:0, stock:100 },
  { id:'BND-004', name:'Oud & Bakhoor Collection', skus:['BH-OUD-50ML','BH-BKHR-250G','HO-ATTAR-10ML'], price:420, compareAt:535, status:'active', markets:['AE','SA','EG'], sold:284, stock:62 },
  { id:'BND-005', name:'Abaya + Hijab Combo', skus:['NC-ABAYA-BLK-54','ZL-HIJAB-BLU-OS'], price:589, compareAt:698, status:'inactive', markets:['AE'], sold:18, stock:0 },
];
const STATUS_COLORS = { active:'var(--zg-good)', draft:'var(--zg-text-dim)', inactive:'var(--zg-warn)' };
const ALL_MARKETS = ['AE','SA','EG','QA','KW'];

const bundles = ref(BUNDLES_DATA.map((b) => ({ ...b })));
const editBundle = ref(null);
const newOpen = ref(false);
const statusF = ref('all');
const filtered = computed(() => bundles.value.filter((b) => statusF.value === 'all' || b.status === statusF.value));
const kpis = computed(() => [
  ['Total Bundles', bundles.value.length, ''],
  ['Active', bundles.value.filter((b) => b.status === 'active').length, 'is-good'],
  ['Total Units Sold', bundles.value.reduce((s, b) => s + b.sold, 0).toLocaleString(), 'is-accent'],
  ['Drafts', bundles.value.filter((b) => b.status === 'draft').length, ''],
]);

const toggleActive = (b) => { b.status = b.status === 'active' ? 'inactive' : 'active'; toast.success('Bundle updated'); };
const blank = () => ({ name:'', skus:[], price:'', compareAt:'', markets:['AE'], status:'draft' });
const form = ref(blank());
const openNew = () => { form.value = blank(); newOpen.value = true; };
const openEdit = (b) => { form.value = { ...b, skus: [...b.skus], markets: [...b.markets] }; editBundle.value = b; };
const closeForm = () => { newOpen.value = false; editBundle.value = null; };
const skusText = computed({ get: () => form.value.skus.join(', '), set: (v) => { form.value.skus = v.split(',').map((s) => s.trim()).filter(Boolean); } });
const toggleMarket = (m) => { form.value.markets = form.value.markets.includes(m) ? form.value.markets.filter((x) => x !== m) : [...form.value.markets, m]; };
const valid = computed(() => form.value.name && form.value.skus.length > 0);
const save = () => {
  if (editBundle.value) { Object.assign(editBundle.value, form.value); toast.success('Bundle saved'); }
  else { bundles.value.unshift({ ...form.value, id: 'BND-' + Date.now(), sold: 0, stock: 0 }); toast.success('Bundle created'); }
  closeForm();
};
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;min-height:0">
    <div class="zwh-header" style="flex-shrink:0">
      <div class="zwh-header-left">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="zwh-bc-back" @click="router.push('/admin/discounts')"><svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14" /></svg> Promotions</button>
        </div>
        <div style="font-size:16px;font-weight:700;color:var(--zg-text)">Bundles &amp; Kits</div>
        <div class="zwh-subtitle">{{ bundles.filter((b) => b.status === 'active').length }} active bundles · group products into curated sets</div>
      </div>
      <button class="zwh-btn-primary" @click="openNew">+ New Bundle</button>
    </div>

    <div class="zwh-kpi-strip" style="flex-shrink:0">
      <div v-for="[l, v, cls] in kpis" :key="l" class="zwh-kpi-cell"><span class="zwh-kpi-lbl">{{ l }}</span><span class="zwh-kpi-val" :class="cls">{{ v }}</span></div>
    </div>

    <div style="padding:8px 16px;border-bottom:1px solid var(--zg-line);display:flex;gap:6px;flex-shrink:0">
      <button v-for="[v, l] in [['all','All'],['active','Active'],['draft','Draft'],['inactive','Inactive']]" :key="v" class="zwh-filter-chip" :class="{ 'is-active': statusF === v }" @click="statusF = v">{{ l }}</button>
    </div>

    <div style="flex:1;overflow-y:auto;padding:14px 16px">
      <div style="display:flex;flex-direction:column;gap:8px">
        <div v-for="b in filtered" :key="b.id" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px 16px;display:grid;grid-template-columns:1fr 120px 100px 80px 80px 100px 80px;gap:10px;align-items:center">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--zg-text);margin-bottom:3px">{{ b.name }}</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap"><span v-for="s in b.skus" :key="s" style="height:16px;padding:0 6px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:9.5px;font-family:var(--zg-mono);color:var(--zg-text-dim);display:inline-flex;align-items:center">{{ s }}</span></div>
          </div>
          <div style="display:flex;gap:3px;flex-wrap:wrap"><span v-for="m in b.markets" :key="m" style="height:16px;padding:0 5px;border-radius:2px;background:var(--zg-accent-tint);color:var(--zg-accent);font-size:9.5px;font-family:var(--zg-mono);font-weight:700;display:inline-flex;align-items:center">{{ m }}</span></div>
          <div>
            <div style="font-family:var(--zg-mono);font-size:13px;font-weight:800;color:var(--zg-text)">AED {{ b.price }}</div>
            <div style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);text-decoration:line-through">AED {{ b.compareAt }}</div>
          </div>
          <span style="font-family:var(--zg-mono);font-size:12px">{{ b.sold.toLocaleString() }}</span>
          <span style="font-family:var(--zg-mono);font-size:12px" :style="{ color: b.stock < 10 ? 'var(--zg-warn)' : 'var(--zg-text)' }">{{ b.stock }}</span>
          <span style="font-size:11px;font-weight:600;text-transform:capitalize" :style="{ color: STATUS_COLORS[b.status] || 'var(--zg-text-dim)' }">{{ b.status }}</span>
          <div style="display:flex;gap:4px">
            <button class="zcat-act" @click="openEdit(b)">Edit</button>
            <button class="zcat-act" @click="toggleActive(b)">{{ b.status === 'active' ? 'Deactivate' : 'Activate' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- New/Edit modal -->
    <Teleport to="body">
      <div v-if="newOpen || editBundle" style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center" @click="closeForm">
        <div style="width:520px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg);overflow:hidden" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between">
            <div style="font-size:14px;font-weight:700;color:var(--zg-text)">{{ editBundle ? 'Edit Bundle' : 'New Bundle' }}</div>
            <button style="width:26px;height:26px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:15px" @click="closeForm">×</button>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">
            <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Bundle Name *</label><input v-model="form.name" placeholder="e.g. Ramadan Gifting Set" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" /></div>
            <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Component SKUs (comma-separated) *</label><input v-model="skusText" placeholder="SKU-001, SKU-002, SKU-003" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:12px;color:var(--zg-text);outline:none" /></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Bundle Price (AED)</label><input type="number" v-model.number="form.price" placeholder="0" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:13px;font-weight:700;color:var(--zg-accent);outline:none" /></div>
              <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Compare-at Price</label><input type="number" v-model.number="form.compareAt" placeholder="0" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-mono);font-size:13px;font-weight:700;color:var(--zg-accent);outline:none" /></div>
            </div>
            <div>
              <div style="font-size:11px;font-weight:600;color:var(--zg-text-mid);margin-bottom:6px">Active Markets</div>
              <div style="display:flex;gap:6px">
                <button v-for="m in ALL_MARKETS" :key="m" type="button" :style="{ height:'24px', padding:'0 9px', border:'1px solid', borderRadius:'3px', cursor:'pointer', fontFamily:'var(--zg-mono)', fontSize:'11px', fontWeight:700, borderColor: form.markets.includes(m) ? 'var(--zg-accent)' : 'var(--zg-line)', background: form.markets.includes(m) ? 'var(--zg-accent-tint)' : 'transparent', color: form.markets.includes(m) ? 'var(--zg-accent)' : 'var(--zg-text-dim)' }" @click="toggleMarket(m)">{{ m }}</button>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px">
              <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid)">Status</label>
              <select v-model="form.status" style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;cursor:pointer">
                <option value="draft">Draft</option><option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px">
            <button class="zwh-btn-primary" :disabled="!valid" :style="{ opacity: valid ? 1 : 0.4 }" @click="save">{{ editBundle ? 'Save Changes' : 'Create Bundle' }}</button>
            <button class="zwh-btn-ghost" @click="closeForm">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
