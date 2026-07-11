<script setup>
import { ref } from 'vue';
const props = defineProps({ entity: { type: Object, required: true } });
const brands = ref([...(props.entity.brands || [])]);
const expandedId = ref(null);
const addOpen = ref(false);

const STATUS_CLS = { active:'zen-bst--active', inactive:'zen-bst--inactive', suspended:'zen-bst--suspended', pending:'zen-bst--pending' };
const MARKET_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', QA:'🇶🇦', KW:'🇰🇼', BH:'🇧🇭', OM:'🇴🇲' };
const MARKET_NAMES = { AE:'UAE', SA:'KSA', EG:'Egypt', QA:'Qatar', KW:'Kuwait', BH:'Bahrain', OM:'Oman' };
const intCls = s => s === 'connected' ? 'zen-bst--active' : s === 'disconnected' ? 'zen-bst--suspended' : 'zen-bst--pending';
const fmtAed = n => n >= 1000 ? 'AED '+(n/1000).toFixed(0)+'K' : 'AED '+(n||0);
</script>

<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar">
      <div class="zen-tab-toolbar-title">{{ brands.length }} brand{{ brands.length !== 1 ? 's' : '' }}</div>
      <button class="zen-btn-primary" @click="addOpen = true">
        <svg viewBox="0 0 12 12" width="10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="6" y1="1" x2="6" y2="11"/><line x1="1" y1="6" x2="11" y2="6"/></svg>
        Add Brand
      </button>
    </div>

    <div v-for="brand in brands" :key="brand.id" class="zen-brand-card" :class="{ 'is-expanded': expandedId === brand.id }">
      <!-- Card head -->
      <div class="zen-brand-card-head" @click="expandedId = expandedId === brand.id ? null : brand.id">
        <div class="zen-brand-avatar">{{ brand.name[0] }}</div>
        <div class="zen-brand-card-info">
          <div class="zen-brand-card-name">{{ brand.name }}</div>
          <div class="zen-brand-card-meta">
            <span :class="`zen-bst ${STATUS_CLS[brand.status]||'zen-bst--inactive'}`">{{ brand.status }}</span>
            <span class="zen-brand-fulfill">{{ brand.fulfillment === 'consignment' ? 'Consignment' : brand.fulfillment === 'shopify' ? 'Shopify Connect' : '3PL' }}</span>
            <span class="zen-brand-commission">{{ brand.commission }}% commission</span>
          </div>
          <div class="zen-brand-cats">
            <span v-for="c in (brand.categories||[])" :key="c" class="zen-brand-cat-tag">{{ c }}</span>
          </div>
        </div>
        <div class="zen-brand-card-kpis">
          <div class="zen-brand-kpi"><div class="zen-brand-kpi-lbl">Products</div><div class="zen-brand-kpi-val">{{ brand.productCount }}</div></div>
          <div class="zen-brand-kpi"><div class="zen-brand-kpi-lbl">GMV / mo</div><div class="zen-brand-kpi-val is-accent">{{ fmtAed(brand.gmvMonth) }}</div></div>
          <div class="zen-brand-kpi"><div class="zen-brand-kpi-lbl">Return Rate</div><div class="zen-brand-kpi-val" :class="{ 'is-warn': brand.returnRate > 5 }">{{ brand.returnRate }}%</div></div>
        </div>
        <div class="zen-brand-card-actions" @click.stop>
          <button class="zen-doc-card-btn" @click="brand.status = brand.status === 'active' ? 'inactive' : 'active'">{{ brand.status === 'active' ? 'Disable' : 'Enable' }}</button>
          <svg class="zen-brand-chevron" :class="{ open: expandedId === brand.id }" viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 2L8 8L2 14"/></svg>
        </div>
      </div>

      <!-- Expanded body -->
      <div v-if="expandedId === brand.id" class="zen-brand-expanded">
        <!-- Markets -->
        <div class="zen-brand-exp-section">
          <div class="zen-brand-exp-title">Markets</div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;">
            <span v-for="m in (brand.markets||[])" :key="m" class="zen-mkt-pill zen-mkt-pill--active">{{ MARKET_FLAGS[m]||'' }} {{ MARKET_NAMES[m]||m }}</span>
          </div>
        </div>
        <!-- Integration -->
        <div v-if="brand.integration" class="zen-brand-exp-section">
          <div class="zen-brand-exp-title">Integration</div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <span class="zen-brand-cat-tag">{{ brand.integration.type }}</span>
            <span :class="`zen-bst ${intCls(brand.integration.status)}`">{{ brand.integration.status }}</span>
            <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-dim);">{{ brand.integration.shop }}</span>
            <span style="font-size:11px;color:var(--zg-text-dim);">Last sync: {{ brand.integration.lastSync }}</span>
            <button class="zen-doc-card-btn" @click="">Sync Now</button>
          </div>
          <div v-if="brand.integration.failedSync > 0" style="margin-top:6px;font-size:11.5px;color:var(--zg-danger);">{{ brand.integration.failedSync }} failed syncs — review required</div>
        </div>
        <!-- Pending products -->
        <div v-if="brand.pendingProducts > 0" class="zen-brand-exp-section">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:12px;color:var(--zg-warn);">{{ brand.pendingProducts }} products pending approval</span>
            <button class="zen-doc-card-btn" @click="">Review Products</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Brand Modal -->
    <Teleport to="body">
      <div v-if="addOpen" style="position:fixed;inset:0;z-index:9300;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="addOpen = false">
        <div style="width:440px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,12px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);font-size:14px;font-weight:700;color:var(--zg-text);display:flex;justify-content:space-between;">
            Add Brand <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:16px;" @click="addOpen = false">×</button>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><label class="zen-field-label">Brand Name</label><input class="zen-field-input" placeholder="e.g. My Brand" /></div>
            <div><label class="zen-field-label">Commission %</label><input class="zen-field-input" type="number" value="12" /></div>
            <div><label class="zen-field-label">Fulfillment Type</label>
              <select class="zen-field-input" style="cursor:pointer;"><option>consignment</option><option>shopify</option><option>3pl</option></select>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="zen-btn-primary" @click="addOpen = false">Add Brand</button>
            <button class="zen-doc-card-btn" @click="addOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
