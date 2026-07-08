<script setup>
/**
 * CustomerTargetingTab — faithful port of CustomerTargetingTab from
 * zucci-discounts-extra.jsx: Targeted Rules / Gift Cards / Store Credit
 * sub-views with issue-gift-card and add-store-credit drawers.
 */
import { ref, computed } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import StatusBadge from './StatusBadge.vue';
import { ZCD_GIFT_CARDS, ZCD_STORE_CREDITS, ZCD_TARGETED_RULES } from '@/data/discountsData';
import { MARKET_CUR } from '@/data/discountsData';
import { toast } from '@/composables/useToast';

const props = defineProps({ market: { type: String, required: true } });
const view = ref('rules');
const showGCForm = ref(false);
const showCreditForm = ref(false);
const cur = computed(() => MARKET_CUR[props.market] || 'AED');

const giftCards = computed(() => (ZCD_GIFT_CARDS || []).filter((g) => g.market === props.market));
const credits = computed(() => (ZCD_STORE_CREDITS || []).filter((c) => c.market === props.market));
const targetedRules = computed(() => (ZCD_TARGETED_RULES || []).filter((r) => r.market === props.market || r.market === 'all'));

const TRIGGER_LABELS = { first_order:'First Order', first_order_app:'First Order (App Only)', loyalty_subscription:'Zucci Plus Subscriber', inactive_90_days:'Inactive 90+ Days', birthday:'Birthday', cart_abandonment:'Cart Abandonment' };
const trig = (t) => TRIGGER_LABELS[t] || t;
const copyCode = (code) => { navigator.clipboard?.writeText(code); toast.success('Code copied'); };
</script>

<template>
  <div class="zcd-tab-body">
    <div class="zf-section-title" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0">
      <span>Customer Targeting · {{ market }}</span>
      <div style="display:flex;gap:6px">
        <button v-if="view === 'rules'" class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="toast.info('New targeted rule form')">+ New Rule</button>
        <button v-if="view === 'gift_cards'" class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="showGCForm = true">+ Issue Gift Card</button>
        <button v-if="view === 'credits'" class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="showCreditForm = true">+ Add Store Credit</button>
      </div>
    </div>

    <div class="zf-filter-row">
      <button v-for="[v, l] in [['rules','Targeted Rules'],['gift_cards','Gift Cards'],['credits','Store Credit']]" :key="v" class="zen-filter-chip" :class="{ 'is-on': view === v }" @click="view = v">{{ l }}</button>
    </div>

    <template v-if="view === 'rules'">
      <div v-if="!targetedRules.length" class="zcd-empty">No targeted rules for {{ market }}.</div>
      <div v-for="r in targetedRules" :key="r.id" class="zcd-vendor-card">
        <div class="zcd-vendor-card-head">
          <div>
            <div class="zcd-promo-name">{{ r.name }}</div>
            <div class="zcd-promo-meta" style="margin-top:3px">
              <span class="zen-brand-cat-tag">{{ trig(r.trigger) }}</span>
              <span class="zcd-promo-value">{{ r.discountType === 'percentage' ? `${r.value}% off` : r.marketValues ? `${cur} ${r.marketValues[market] || '—'} off` : `${cur} ${r.value} off` }}</span>
              <span class="zen-brand-cat-tag">{{ r.channel === 'app_only' ? 'App Only' : r.channel === 'email' ? 'Email' : 'All Channels' }}</span>
              <span v-if="r.maxValue" class="zen-pd-ref">max {{ cur }} {{ r.maxValue }}</span>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <StatusBadge :status="r.status" />
            <button class="zen-act-btn-sm" title="Edit" @click="toast.info('Edit rule')"><svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M9.5 1.5L12.5 4.5L5 12H2V9L9.5 1.5Z" /></svg></button>
          </div>
        </div>
        <div class="zcd-vendor-card-body" style="grid-template-columns:repeat(4,1fr)">
          <div class="zen-bank-field"><div class="zen-field-label">Min Order</div><div class="zen-field-val">{{ r.minOrderValue ? `${cur} ${r.minOrderValue}` : 'None' }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Usage Limit</div><div class="zen-field-val">{{ (r.usageLimit || '').replace('_',' ') }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Times Used</div><div class="zen-field-val">{{ (r.usageCount || 0).toLocaleString() }}</div></div>
          <div class="zen-bank-field"><div class="zen-field-label">Discount Given</div><div class="zen-field-val" style="color:var(--zg-danger)">{{ r.totalDiscountGiven ? `${cur} ${r.totalDiscountGiven.toLocaleString()}` : '—' }}</div></div>
        </div>
        <div v-if="r.notes" class="zcd-notes-strip">{{ r.notes }}</div>
      </div>
    </template>

    <template v-else-if="view === 'gift_cards'">
      <div v-if="!giftCards.length" class="zcd-empty">No gift cards issued for {{ market }}.</div>
      <div v-for="gc in giftCards" :key="gc.id" class="zcd-payment-card">
        <div class="zcd-payment-head">
          <div class="zcd-payment-logo" style="font-size:18px">🎁</div>
          <div class="zcd-payment-info"><div class="zcd-promo-name">{{ gc.code }}</div><div class="zcd-promo-meta"><span>{{ gc.issuedTo }}</span><span class="zcd-promo-value">{{ gc.currency }} {{ gc.value }}</span><span v-if="gc.balance > 0" class="zen-pd-ref">Balance: {{ gc.currency }} {{ gc.balance }}</span></div></div>
          <StatusBadge :status="gc.status" />
        </div>
        <div class="zcd-payment-body" style="grid-template-columns:repeat(4,1fr)">
          <div class="zcd-payment-kpi"><div class="zf-kpi-lbl">Issued By</div><div class="zcd-stat-val">{{ gc.issuedBy }}</div></div>
          <div class="zcd-payment-kpi"><div class="zf-kpi-lbl">Issued Date</div><div class="zcd-stat-val">{{ gc.issuedDate }}</div></div>
          <div class="zcd-payment-kpi"><div class="zf-kpi-lbl">Expiry</div><div class="zcd-stat-val">{{ gc.expiryDate }}</div></div>
          <div class="zcd-payment-kpi"><div class="zf-kpi-lbl">Used Count</div><div class="zcd-stat-val">{{ gc.usedCount }}</div></div>
        </div>
        <div v-if="gc.notes" class="zcd-notes-strip">{{ gc.notes }}</div>
        <div class="zcd-card-foot">
          <button class="zen-doc-card-btn" @click="copyCode(gc.code)">Copy Code</button>
          <button v-if="gc.status === 'active'" class="zen-doc-card-btn zen-doc-card-btn--reject" @click="toast.warn('Gift card cancelled')">Cancel</button>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="!credits.length" class="zcd-empty">No store credits issued for {{ market }}.</div>
      <div v-for="sc in credits" :key="sc.id" class="zcd-promo-row">
        <div class="zcd-promo-main">
          <div class="zcd-promo-name">{{ sc.customerName }} <span class="zen-pd-ref">{{ sc.customerId }}</span></div>
          <div class="zcd-promo-meta"><span>{{ sc.reason }}</span><span class="zen-pd-ref">Added by {{ sc.addedBy }} · {{ sc.addedDate }}</span><span class="zen-pd-ref">Expires {{ sc.expiryDate }}</span></div>
        </div>
        <div class="zcd-promo-stats">
          <div><div class="zf-kpi-lbl">Total</div><div class="zcd-stat-val">{{ sc.currency }} {{ sc.amount }}</div></div>
          <div><div class="zf-kpi-lbl">Used</div><div class="zcd-stat-val is-neg">{{ sc.currency }} {{ sc.used }}</div></div>
          <div><div class="zf-kpi-lbl">Remaining</div><div class="zcd-stat-val is-good">{{ sc.currency }} {{ sc.amount - sc.used }}</div></div>
        </div>
        <StatusBadge :status="sc.status" />
      </div>
    </template>

    <ZDrawer :open="showGCForm" title="Issue Gift Card" :subtitle="`${market} · ${cur}`" :width="420" @close="showGCForm = false">
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="zf-props-field"><label class="zf-props-label">Issue To</label><select class="zp-field-h" style="width:100%"><option>Specific Customer</option><option>Bulk — by segment</option><option>Bulk — upload CSV</option></select></div>
        <div class="zf-props-field"><label class="zf-props-label">Customer</label><input class="zp-field-h" style="width:100%;box-sizing:border-box" placeholder="Search customer name or ID…" /></div>
        <div class="zf-props-field"><label class="zf-props-label">Value ({{ cur }})</label><input type="number" class="zp-field-h" style="width:100%;box-sizing:border-box" placeholder="e.g. 500" /></div>
        <div class="zf-props-field"><label class="zf-props-label">Expiry Date</label><input type="date" class="zp-field-h" style="width:100%;box-sizing:border-box" /></div>
        <div class="zf-props-field"><label class="zf-props-label">Note</label><textarea class="zp-seo-textarea" rows="2" placeholder="e.g. Birthday gift, complaint resolution…" /></div>
      </div>
      <template #footer>
        <button class="zen-btn-ghost" @click="showGCForm = false">Cancel</button>
        <button class="zen-btn-primary" @click="toast.success('Gift card issued'); showGCForm = false">Issue Gift Card</button>
      </template>
    </ZDrawer>

    <ZDrawer :open="showCreditForm" title="Add Store Credit" :subtitle="`${market} · ${cur}`" :width="420" @close="showCreditForm = false">
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="zf-props-field"><label class="zf-props-label">Customer</label><input class="zp-field-h" style="width:100%;box-sizing:border-box" placeholder="Search customer name or ID…" /></div>
        <div class="zf-props-field"><label class="zf-props-label">Credit Amount ({{ cur }})</label><input type="number" class="zp-field-h" style="width:100%;box-sizing:border-box" placeholder="e.g. 200" /></div>
        <div class="zf-props-field"><label class="zf-props-label">Reason</label><select class="zp-field-h" style="width:100%"><option>Return compensation</option><option>Complaint resolution</option><option>Order cancellation refund</option><option>Loyalty reward</option><option>Manual adjustment</option><option>Other</option></select></div>
        <div class="zf-props-field"><label class="zf-props-label">Expiry (optional)</label><input type="date" class="zp-field-h" style="width:100%;box-sizing:border-box" /></div>
      </div>
      <template #footer>
        <button class="zen-btn-ghost" @click="showCreditForm = false">Cancel</button>
        <button class="zen-btn-primary" @click="toast.success('Store credit added'); showCreditForm = false">Add Credit</button>
      </template>
    </ZDrawer>
  </div>
</template>
