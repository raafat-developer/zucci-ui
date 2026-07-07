<template>
  <div class="zv-module">
    <!-- Header -->
        <PageHeader title="Bundles & B2B Wholesale" subtitle="Configure multi-item catalog packages, B2B wholesale pricing levels, and retail partner credit limits" iconColor="var(--zg-accent);">
      <template #icon>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
      </template>
      <template #actions>
        <!-- Sub Module Tab switcher -->
        <div class="view-mode-toggle" style="display: flex; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 2px; margin-right: 12px;">
          <button class="mode-btn" :class="{ 'is-active': activeModuleTab === 'bundles' }" @click="activeModuleTab = 'bundles'" style="padding: 4px 12px; border-radius: 4px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; color: var(--zg-text); background: transparent;">
            Bundles & Kits
          </button>
          <button class="mode-btn" :class="{ 'is-active': activeModuleTab === 'b2b_accounts' }" @click="activeModuleTab = 'b2b_accounts'" style="padding: 4px 12px; border-radius: 4px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; color: var(--zg-text); background: transparent;">
            B2B Accounts
          </button>
          <button class="mode-btn" :class="{ 'is-active': activeModuleTab === 'b2b_prices' }" @click="activeModuleTab = 'b2b_prices'" style="padding: 4px 12px; border-radius: 4px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; color: var(--zg-text); background: transparent;">
            Wholesale Price Lists
          </button>
        </div>

        <button v-if="activeModuleTab === 'bundles'" class="zs-btn zs-btn--primary" @click="openFormModal(null)">+ Add Bundle</button>
        <button v-if="activeModuleTab === 'b2b_accounts'" class="zs-btn zs-btn--primary" @click="b2bFormOpen = true">+ Add Account</button>
      </template>
    </PageHeader>

    <!-- KPI Strip -->
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Total bundles registered</span>
        <span class="zwh-kpi-val">{{ bundles.length }}</span>
        <span class="zwh-kpi-sub">combinations configured</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Active Bundles</span>
        <span class="zwh-kpi-val is-good">{{ bundles.filter(b => b.status === 'active').length }}</span>
        <span class="zwh-kpi-sub">live on storefront catalog</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Units Sold (Lifetime)</span>
        <span class="zwh-kpi-val is-accent">{{ totalUnitsSold.toLocaleString() }}</span>
        <span class="zwh-kpi-sub">bundle sets checkout orders</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">B2B Corporate clients</span>
        <span class="zwh-kpi-val">{{ b2bCustomers.length }}</span>
        <span class="zwh-kpi-sub">validated wholesale accounts</span>
      </div>
    </div>

    <!-- Body contents -->
    <div class="zv-body" style="overflow-y: auto;">

      <!-- ── 1. MODULE: BUNDLES & KITS ── -->
      <div v-if="activeModuleTab === 'bundles'" style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 6px; align-items: center;">
          <button 
            v-for="st in ['all', 'active', 'draft', 'inactive']" 
            :key="st"
            class="zwh-filter-chip"
            :class="{ 'is-active': statusFilter === st }"
            @click="statusFilter = st"
          >
            {{ st.toUpperCase() }}
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div 
            v-for="b in filteredBundles" 
            :key="b.id"
            style="background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 14px 16px; display: grid; grid-template-columns: 1.5fr 1fr 100px 80px 80px 100px 120px; gap: 10px; align-items: center;"
          >
            <div>
              <div style="font-weight: 700; font-size: 13.5px; color: var(--zg-text); margin-bottom: 4px;">{{ b.name }}</div>
              <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                <span 
                  v-for="s in b.skus" 
                  :key="s"
                  style="font-family: var(--zg-mono); font-size: 9.5px; padding: 1px 5px; border-radius: 4px; background: var(--zg-panel-hi); border: 1px solid var(--zg-line); color: var(--zg-text-dim);"
                >
                  {{ s }}
                </span>
              </div>
            </div>
            
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <span 
                v-for="m in b.markets" 
                :key="m"
                style="font-family: var(--zg-mono); font-size: 9.5px; font-weight: 700; padding: 1px 5px; background: var(--zg-accent-tint); color: var(--zg-accent); border-radius: 4px;"
              >
                {{ m }}
              </span>
            </div>

            <div>
              <div style="font-family: var(--zg-mono); font-size: 13px; font-weight: 800; color: var(--zg-text);">AED {{ b.price }}</div>
              <div style="font-family: var(--zg-mono); font-size: 10.5px; color: var(--zg-text-dim); text-decoration: line-through;">AED {{ b.compareAt }}</div>
            </div>

            <span style="font-family: var(--zg-mono); font-size: 12px; color: var(--zg-text-mid);">{{ b.sold }} sold</span>
            <span style="font-family: var(--zg-mono); font-size: 12px;" :class="b.stock < 10 ? 'color: var(--zg-warn); font-weight: 700;' : 'color: var(--zg-text-mid);'">{{ b.stock }} left</span>
            
            <span>
              <span class="zen-bst" :class="b.status === 'active' ? 'zen-bst--active' : 'zen-bst--inactive'">{{ b.status }}</span>
            </span>

            <div style="display: flex; gap: 4px;">
              <button class="zcat-act" @click="openFormModal(b)">Edit</button>
              <button class="zcat-act" @click="toggleBundleStatus(b)">{{ b.status === 'active' ? 'Deactivate' : 'Activate' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── 2. MODULE: B2B ACCOUNTS LIST ── -->
      <div v-if="activeModuleTab === 'b2b_accounts'" style="border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden; background: var(--zg-panel);">
        <div style="display: grid; grid-template-columns: 80px 1.5fr 1fr 80px 1fr 1fr 80px 100px; gap: 10px; padding: 10px 14px; background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line); font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--zg-text-dim); align-items: center;">
          <span>Account ID</span>
          <span>Company / Status</span>
          <span>Account Type</span>
          <span>Country</span>
          <span>Credit limit</span>
          <span>Outstanding balance</span>
          <span>Orders</span>
          <span>Actions</span>
        </div>

        <div 
          v-for="c in b2bCustomers" 
          :key="c.id"
          style="display: grid; grid-template-columns: 80px 1.5fr 1fr 80px 1fr 1fr 80px 100px; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--zg-line-soft); align-items: center; font-size: 12.5px;"
        >
          <span style="font-family: var(--zg-mono); font-size: 11px; color: var(--zg-text-dim);">{{ c.id }}</span>
          <div>
            <div style="font-weight: 700; color: var(--zg-text);">{{ c.name }}</div>
            <div style="font-size: 10.5px; font-weight: 700; margin-top: 2px;" :style="{ color: c.status === 'active' ? 'var(--zg-good)' : 'var(--zg-warn)' }">{{ c.status.toUpperCase() }}</div>
          </div>
          <span style="color: var(--zg-text-mid);">{{ c.type }}</span>
          <span style="font-family: var(--zg-mono); font-weight: 700; color: var(--zg-accent);">{{ c.market }}</span>
          <span style="font-family: var(--zg-mono);">AED {{ (c.creditLimit).toLocaleString() }}</span>
          <span style="font-family: var(--zg-mono);" :style="{ color: c.outstanding > c.creditLimit * 0.8 ? 'var(--zg-danger)' : 'var(--zg-text)' }">
            AED {{ (c.outstanding).toLocaleString() }}
          </span>
          <span style="font-family: var(--zg-mono);">{{ c.orders }}</span>
          <div>
            <button class="zcat-act" @click="alert('Loading wholesale profile for ' + c.name)">View Ledger</button>
          </div>
        </div>
      </div>

      <!-- ── 3. MODULE: WHOLESALE PRICE LISTS ── -->
      <div v-if="activeModuleTab === 'b2b_prices'" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
        <div 
          v-for="pl in priceLists" 
          :key="pl.id"
          style="background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 14px; display: flex; flex-direction: column; justify-content: space-between;"
        >
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div>
                <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: var(--zg-text);">{{ pl.name }}</h4>
                <div style="display: flex; gap: 4px; margin-top: 4px;">
                  <span v-for="m in pl.markets" :key="m" style="font-family: var(--zg-mono); font-size: 9px; padding: 1px 4px; background: var(--zg-accent-tint); color: var(--zg-accent); border-radius: 4px;">{{ m }}</span>
                </div>
              </div>
              <span class="zen-bst" :class="pl.status === 'active' ? 'zen-bst--active' : 'zen-bst--inactive'">{{ pl.status }}</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 12px 0;">
              <div>
                <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim);">Discount</div>
                <div style="font-family: var(--zg-mono); font-size: 15px; font-weight: 800; color: var(--zg-accent); margin-top: 2px;">{{ pl.discount }}% OFF</div>
              </div>
              <div>
                <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim);">Min MOQ</div>
                <div style="font-family: var(--zg-mono); font-size: 14px; font-weight: 700; color: var(--zg-text); margin-top: 2px;">{{ pl.minQty }} items</div>
              </div>
              <div>
                <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim);">Products</div>
                <div style="font-family: var(--zg-mono); font-size: 14px; color: var(--zg-text-mid); margin-top: 2px;">{{ pl.products }} SKUs</div>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 4px; border-top: 1px solid var(--zg-line-soft); padding-top: 10px; margin-top: 6px;">
            <button class="zcat-act" @click="alert('Edit Wholesale price levels')">Edit pricing</button>
            <button class="zcat-act" @click="alert('Price list duplicated')">Duplicate</button>
          </div>
        </div>
      </div>

    </div>

    <!-- ── TELEPORT OVERLAY: ADD / EDIT BUNDLE FORM MODAL ── -->
    <Teleport to="body">
      <div v-if="formOpen" class="modal-backdrop" @click.self="formOpen = false" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center;">
        <div class="modal-dialog" style="width: 480px; max-height: 80vh; background: var(--zg-bg-elev); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-lg); display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.4);">
          
          <div class="modal-header" style="padding: 16px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: var(--zg-text);">
              {{ editingBundle ? 'Edit Bundle details' : 'New Pack Combo Bundle' }}
            </h3>
            <button @click="formOpen = false" style="background: transparent; border: none; font-size: 20px; cursor: pointer; color: var(--zg-text-dim);">&times;</button>
          </div>

          <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto;">
            <div class="zcat-field">
              <label class="zcat-label">Bundle Name *</label>
              <input type="text" v-model="formName" class="zcat-input" placeholder="e.g. Ramadan Gifting Set" />
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Component SKU Barcodes (comma separated) *</label>
              <input type="text" v-model="formSkus" class="zcat-input" placeholder="BH-OUD-50ML, ZL-HIJAB-BLU-OS" style="font-family: var(--zg-mono);" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div class="zcat-field">
                <label class="zcat-label">Price (AED) *</label>
                <input type="number" v-model.number="formPrice" class="zcat-input" style="font-family: var(--zg-mono);" />
              </div>
              <div class="zcat-field">
                <label class="zcat-label">Compare-at original (AED)</label>
                <input type="number" v-model.number="formCompare" class="zcat-input" style="font-family: var(--zg-mono);" />
              </div>
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Active Regional Markets</label>
              <div style="display: flex; gap: 6px;">
                <button 
                  v-for="m in ['AE', 'SA', 'EG', 'QA', 'KW']" 
                  :key="m"
                  class="zwh-filter-chip"
                  :class="{ 'is-active': formMarkets.includes(m) }"
                  @click="toggleMarketSelect(m)"
                >
                  {{ m }}
                </button>
              </div>
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Publish status</label>
              <select v-model="formStatus" class="zcat-select" style="width: 100%; height: 32px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 0 8px; color: var(--zg-text); font-family: inherit;">
                <option value="draft">Draft</option>
                <option value="active">Active Storefront</option>
                <option value="inactive">Inactive / Hidden</option>
              </select>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; justify-content: flex-end; background: var(--zg-bg);">
            <button class="zen-btn-ghost" @click="formOpen = false">Cancel</button>
            <button class="zen-btn-primary" @click="saveBundleChanges">Save Changes</button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ── TELEPORT OVERLAY: ADD B2B WHOLESALE ACCOUNT MODAL ── -->
    <Teleport to="body">
      <div v-if="b2bFormOpen" class="modal-backdrop" @click.self="b2bFormOpen = false" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center;">
        <div class="modal-dialog" style="width: 440px; background: var(--zg-bg-elev); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-lg); overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.4);">
          
          <div class="modal-header" style="padding: 16px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: var(--zg-text);">New B2B Wholesaler Account</h3>
            <button @click="b2bFormOpen = false" style="background: transparent; border: none; font-size: 20px; cursor: pointer; color: var(--zg-text-dim);">&times;</button>
          </div>

          <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 12px;">
            <div class="zcat-field">
              <label class="zcat-label">Company Name *</label>
              <input type="text" v-model="b2bName" class="zcat-input" placeholder="e.g. Al Futtaim Trading LLC" />
            </div>
            
            <div class="zcat-field">
              <label class="zcat-label">Primary Email Contact</label>
              <input type="email" v-model="b2bEmail" class="zcat-input" placeholder="e.g. wholesale@alfuttaim.ae" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div class="zcat-field">
                <label class="zcat-label">Primary Market</label>
                <select v-model="b2bMarket" class="zcat-select" style="width: 100%; height: 32px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 0 8px; color: var(--zg-text); font-family: inherit;">
                  <option value="AE">🇦🇪 AE</option>
                  <option value="SA">🇸🇦 SA</option>
                  <option value="EG">🇪🇬 EG</option>
                </select>
              </div>
              <div class="zcat-field">
                <label class="zcat-label">Client type</label>
                <select v-model="b2bType" class="zcat-select" style="width: 100%; height: 32px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 0 8px; color: var(--zg-text); font-family: inherit;">
                  <option value="Corporate">Corporate Group</option>
                  <option value="Retail Chain">Retail Chain Shop</option>
                  <option value="Distributor">Regional Distributor</option>
                </select>
              </div>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; justify-content: flex-end; background: var(--zg-bg);">
            <button class="zen-btn-ghost" @click="b2bFormOpen = false">Cancel</button>
            <button class="zen-btn-primary" @click="saveB2bAccount">Create Account</button>
          </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ── Mock Data: Bundles and B2B Wholesales ─────────────────
const initialBundles = [
  { id: 'BND-001', name: 'Ramadan Gifting Set',       skus: ['BH-OUD-50ML', 'ZL-HIJAB-BLU-OS', 'NC-ABAYA-BLK-54'], price: 849, compareAt: 1089, status: 'active',  markets: ['AE', 'SA'], sold: 124, stock: 48 },
  { id: 'BND-002', name: 'Desert Summer Pack',        skus: ['DK-SNKR-WHT-42', 'DK-BOOT-BRN-41'],                price: 699, compareAt: 869,  status: 'active',  markets: ['AE'],      sold: 62,  stock: 31 },
  { id: 'BND-003', name: 'Men\'s Friday Essentials',  skus: ['CC-TOBE-WHT-52', 'UL-POLO-M-WHT', 'UL-SHRT-NVY-M'],price: 489, compareAt: 598,  status: 'draft',   markets: ['SA', 'AE'], sold: 0,   stock: 100 },
  { id: 'BND-004', name: 'Oud & Bakhoor Collection',  skus: ['BH-OUD-50ML', 'BH-BKHR-250G', 'HO-ATTAR-10ML'],    price: 420, compareAt: 535,  status: 'active',  markets: ['AE', 'SA', 'EG'], sold: 284, stock: 62 },
  { id: 'BND-005', name: 'Abaya + Hijab Combo',       skus: ['NC-ABAYA-BLK-54', 'ZL-HIJAB-BLU-OS'],             price: 589, compareAt: 698,  status: 'inactive',markets: ['AE'],      sold: 18,  stock: 0  },
]

const initialB2bCustomers = [
  { id: 'B2B-001', name: 'Al Tayer Group',          type: 'Corporate',    market: 'AE', status: 'active',  creditLimit: 500000, outstanding: 142000, orders: 48,  lastOrder: 'Jun 2, 2025'  },
  { id: 'B2B-002', name: 'Landmark Retail',         type: 'Retail Chain', market: 'AE', status: 'active',  creditLimit: 250000, outstanding: 84000,  orders: 31,  lastOrder: 'Jun 1, 2025'  },
  { id: 'B2B-003', name: 'Alhokair Fashion Retail', type: 'Retail Chain', market: 'SA', status: 'active',  creditLimit: 380000, outstanding: 210000, orders: 62,  lastOrder: 'Jun 3, 2025'  },
  { id: 'B2B-004', name: 'Majid Al Futtaim',        type: 'Corporate',    market: 'AE', status: 'pending', creditLimit: 0,      outstanding: 0,      orders: 0,   lastOrder: '—'            },
]

const initialPriceLists = [
  { id: 'PL-001', name: 'Gold Tier Wholesale',    discount: 25, minQty: 10,  markets: ['AE', 'SA'],     products: 284, status: 'active'  },
  { id: 'PL-002', name: 'Silver Tier Wholesale',  discount: 18, minQty: 5,   markets: ['AE', 'SA', 'EG'],products: 284, status: 'active'  },
  { id: 'PL-003', name: 'Retail Partner Pricing', discount: 12, minQty: 3,   markets: ['AE'],          products: 124, status: 'active'  },
]

// ── State variables ───────────────────────────────────────
const activeModuleTab = ref('bundles') // 'bundles' | 'b2b_accounts' | 'b2b_prices'
const bundles = ref(initialBundles)
const statusFilter = ref('all')
const b2bCustomers = ref(initialB2bCustomers)
const priceLists = ref(initialPriceLists)

// Form states
const formOpen = ref(false)
const editingBundle = ref(null)
const formName = ref('')
const formSkus = ref('')
const formPrice = ref(0)
const formCompare = ref(0)
const formMarkets = ref(['AE'])
const formStatus = ref('draft')

// B2B form modal state
const b2bFormOpen = ref(false)
const b2bName = ref('')
const b2bEmail = ref('')
const b2bPhone = ref('')
const b2bMarket = ref('AE')
const b2bType = ref('Corporate')

// ── Computed Properties ───────────────────────────────────
const filteredBundles = computed(() => {
  return bundles.value.filter(b => statusFilter.value === 'all' || b.status === statusFilter.value)
})

const totalUnitsSold = computed(() => {
  return bundles.value.reduce((s, b) => s + b.sold, 0)
})

// ── Methods ───────────────────────────────────────────────
const toggleBundleStatus = (bundle) => {
  bundle.status = bundle.status === 'active' ? 'inactive' : 'active'
}

const openFormModal = (b = null) => {
  editingBundle.value = b
  if (b) {
    formName.value = b.name
    formSkus.value = b.skus.join(', ')
    formPrice.value = b.price
    formCompare.value = b.compareAt
    formMarkets.value = [...b.markets]
    formStatus.value = b.status
  } else {
    formName.value = ''
    formSkus.value = ''
    formPrice.value = 0
    formCompare.value = 0
    formMarkets.value = ['AE']
    formStatus.value = 'draft'
  }
  formOpen.value = true
}

const saveBundleChanges = () => {
  if (!formName.value.trim()) {
    alert('Bundle Name is required')
    return
  }

  const finalSkus = formSkus.value.split(',').map(s => s.trim()).filter(Boolean)

  const payload = {
    name: formName.value,
    skus: finalSkus,
    price: formPrice.value,
    compareAt: formCompare.value,
    markets: formMarkets.value,
    status: formStatus.value
  }

  if (editingBundle.value) {
    Object.assign(editingBundle.value, payload)
  } else {
    bundles.value.unshift({
      id: `BND-${Date.now()}`,
      sold: 0,
      stock: 50,
      ...payload
    })
  }

  formOpen.value = false
}

const toggleMarketSelect = (m) => {
  if (formMarkets.value.includes(m)) {
    formMarkets.value = formMarkets.value.filter(x => x !== m)
  } else {
    formMarkets.value.push(m)
  }
}

// B2B Add Account Helper
const saveB2bAccount = () => {
  if (!b2bName.value.trim()) {
    alert('Company Name is required')
    return
  }
  b2bCustomers.value.push({
    id: `B2B-${Date.now()}`,
    name: b2bName.value,
    type: b2bType.value,
    market: b2bMarket.value,
    status: 'pending',
    creditLimit: 150000,
    outstanding: 0,
    orders: 0,
    lastOrder: '—'
  })
  b2bFormOpen.value = false
  b2bName.value = ''
  b2bEmail.value = ''
  b2bPhone.value = ''
}
</script>

<style scoped>
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.zv-module {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.mode-btn.is-active {
  background: var(--zg-accent) !important;
  color: #fff !important;
  box-shadow: 0 2px 8px var(--zg-accent-tint);
}
</style>
