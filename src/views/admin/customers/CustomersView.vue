<script setup>
/**
 * CustomersView — Customers (Buyers) module. Faithful port of
 * ZucciCustomersModule: stats bar, alphabetical list, and buyer detail with
 * all 8 tabs (Profile, Purchases, Addresses, Payment Methods, Loyalty,
 * Analytics, Abandoned Carts, Activity Log). Uses the legacy zen-/byr- CSS.
 */
import { ref, computed, onMounted } from 'vue';
import { useCustomersStore } from '@/stores/customers';
import { ZC_BUYERS as SEED } from '@/data/customersData';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import ZButton from '@/components/ui/ZButton.vue';

const store = useCustomersStore();
onMounted(() => { if (!store.loaded) store.fetchAll(); });
const ZC_BUYERS = computed(() => (store.items.length ? store.items : SEED));

const statsOpen = ref(false);
const query = ref('');
const selectedId = ref(SEED[0].id);
const tab = ref('profile');
const selectedOrder = ref(null);

const STATS = [
  { lbl:'Total Customers', val:'3,241', sub:'across all markets' },
  { lbl:'Verified', val:'2,880', sub:'email + phone confirmed', good:true },
  { lbl:'Phone-only', val:'361', sub:'no email on file' },
  { lbl:'Multi-market', val:'448', sub:'ordered from 2+ markets' },
  { lbl:'Flagged', val:'12', sub:'fraud / blocked', warn:true },
  { lbl:'Avg Orders / Customer', val:'4.2', sub:'lifetime' },
  { lbl:'Avg LTV', val:'AED 2,840', sub:'across all currencies' },
];
const TABS = ['Profile','Purchases','Addresses','Payment Methods','Loyalty','Analytics','Abandoned Carts','Activity Log'];
const TIER_META = {
  Gold: { bg:'oklch(0.82 0.15 75 / 0.15)', color:'var(--zg-warn)', border:'oklch(0.82 0.15 75 / 0.35)' },
  Silver: { bg:'oklch(0.70 0.0 0 / 0.15)', color:'#aaa', border:'rgba(170,170,170,0.3)' },
  Bronze: { bg:'oklch(0.65 0.12 40 / 0.15)', color:'oklch(0.72 0.12 40)', border:'oklch(0.65 0.12 40 / 0.35)' },
  Standard: { bg:'var(--zg-panel-hi)', color:'var(--zg-text-dim)', border:'var(--zg-line)' },
};
const ORDER_STATUS = {
  delivered:{ label:'Delivered', cls:'zen-bst--active' }, in_transit:{ label:'In Transit', cls:'zen-bst--pending' },
  returned:{ label:'Returned', cls:'zen-bst--suspended' }, cancelled:{ label:'Cancelled', cls:'zen-bst--inactive' }, processing:{ label:'Processing', cls:'zen-bst--pending' },
};

const filtered = computed(() => query.value
  ? ZC_BUYERS.value.filter((b) => `${b.firstName} ${b.lastName}`.toLowerCase().includes(query.value.toLowerCase()) || b.email.includes(query.value) || b.id.includes(query.value))
  : ZC_BUYERS.value);
const groups = computed(() => {
  const map = {};
  filtered.value.forEach((b) => { const ch = (b.lastName || b.name || '?')[0]?.toUpperCase() || '#'; const key = /[0-9]/.test(ch) ? '#' : ch; (map[key] = map[key] || []).push(b); });
  return Object.entries(map).sort(([a], [b]) => a === '#' ? -1 : b === '#' ? 1 : a.localeCompare(b));
});
const buyer = computed(() => ZC_BUYERS.value.find((b) => b.id === selectedId.value) || ZC_BUYERS.value[0]);
const tierMeta = (t) => TIER_META[t] || TIER_META.Standard;
const orderStatus = (s) => ORDER_STATUS[s] || ORDER_STATUS.processing;
const tabId = (t) => t.toLowerCase().replace(/\s+/g, '-');

// Score ring
const scoreColor = (s) => s >= 80 ? 'var(--zg-good)' : s >= 60 ? 'oklch(0.82 0.14 215)' : s >= 40 ? 'var(--zg-warn)' : 'var(--zg-danger)';
const ringDash = (s) => { const circ = 2 * Math.PI * 22; return `${(s / 100) * circ} ${circ}`; };

const groupedPurchases = computed(() => {
  const map = {}; (buyer.value.purchases || []).forEach((o) => { (map[o.currency] = map[o.currency] || []).push(o); }); return map;
});
const purchaseTotal = (orders) => orders.reduce((s, o) => s + o.amount, 0);

const stats = STATS; const tabs = TABS;
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;width:100%;min-height:0;overflow:hidden">
    <!-- Stats bar -->
    <div class="byr-statsbar">
      <button class="byr-statsbar-toggle" @click="statsOpen = !statsOpen">
        <span>Customer Overview</span>
        <svg viewBox="0 0 10 6" width="9" height="6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" :style="{ transform: statsOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }"><path d="M1 1L5 5L9 1" /></svg>
      </button>
      <div v-if="statsOpen" class="byr-statsbar-grid">
        <div v-for="(s, i) in stats" :key="i" class="byr-statsbar-cell">
          <div class="zen-perf-lbl">{{ s.lbl }}</div>
          <div class="zen-perf-val" :class="{ 'is-warn': s.warn, 'is-good': s.good }">{{ s.val }}</div>
          <div class="zen-adv-kpi-sub">{{ s.sub }}</div>
        </div>
        <div class="byr-statsbar-actions">
          <ZButton variant="primary" style="height:28px;font-size:11.5px">Export</ZButton>
          <ZButton variant="ghost" style="height:28px;font-size:11.5px">Merge Duplicates</ZButton>
        </div>
      </div>
    </div>

    <div class="zen-wrap" style="flex:1;min-height:0">
      <!-- List -->
      <div class="zen-list">
        <div class="zen-list-search">
          <svg viewBox="0 0 16 16" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4" /><line x1="10" y1="10" x2="14" y2="14" /></svg>
          <input v-model="query" placeholder="Search customers…" />
        </div>
        <div class="zen-list-scroll">
          <div v-for="[letter, buyers] in groups" :key="letter">
            <div class="zen-list-group">{{ letter }}</div>
            <button v-for="b in buyers" :key="b.id" class="zen-list-row" :class="{ 'is-active': b.id === selectedId }" @click="selectedId = b.id; tab = 'profile'">
              <div class="zen-list-row-name">{{ b.firstName }} {{ b.lastName }}</div>
              <div class="zen-list-row-meta">#{{ b.id }} · {{ b.stats.totalOrders }} orders · {{ b.currency }} {{ b.stats.totalSpend.toLocaleString() }}</div>
            </button>
          </div>
          <div v-if="!groups.length" style="padding:16px 12px;font-size:12px;color:var(--zg-text-dim)">No results</div>
        </div>
      </div>

      <!-- Detail -->
      <div class="zen-detail">
        <div class="zen-detail-head">
          <div class="zen-entity-avatar" :style="{ background: buyer.color + '22', color: buyer.color }">{{ buyer.initials }}</div>
          <div class="zen-entity-info">
            <div class="zen-entity-name">{{ buyer.firstName }} {{ buyer.lastName }}</div>
            <div class="zen-entity-meta">
              <span class="zen-entity-id">#{{ buyer.id }}</span>
              <span class="zen-entity-type">{{ buyer.country }} · {{ buyer.city }}</span>
              <span class="zen-tier-badge" :style="{ background: tierMeta(buyer.tier).bg, color: tierMeta(buyer.tier).color, borderColor: tierMeta(buyer.tier).border }">{{ buyer.tier }}</span>
              <span class="zen-bst" :class="buyer.status === 'active' ? 'zen-bst--active' : 'zen-bst--inactive'">{{ buyer.status }}</span>
            </div>
          </div>
          <div class="zen-entity-actions">
            <button class="zen-head-act" title="Call">☎</button>
            <button class="zen-head-act" title="Email">✉</button>
            <button class="zen-head-act zen-head-act--danger" title="Flag">⚑</button>
          </div>
        </div>

        <div class="zen-tabs">
          <button v-for="t in tabs" :key="t" class="zen-tab" :class="{ 'is-active': tab === tabId(t) }" @click="tab = tabId(t)">{{ t }}</button>
        </div>

        <div class="zen-tab-content">
          <!-- Profile -->
          <div v-if="tab === 'profile'" class="zen-tab-body">
            <div class="byr-profile-strip">
              <div class="byr-score-ring">
                <svg width="56" height="56" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="var(--zg-line)" stroke-width="4" />
                  <circle cx="28" cy="28" r="22" fill="none" :stroke="scoreColor(buyer.buyerScore)" stroke-width="4" :stroke-dasharray="ringDash(buyer.buyerScore)" stroke-linecap="round" transform="rotate(-90 28 28)" />
                  <text x="28" y="33" text-anchor="middle" font-size="13" font-weight="700" :fill="scoreColor(buyer.buyerScore)" font-family="var(--zg-mono)">{{ buyer.buyerScore }}</text>
                </svg>
                <div class="byr-score-label">Buyer Score</div>
              </div>
              <div class="byr-strip-kpis">
                <div class="byr-strip-kpi"><div class="zen-perf-lbl">Total Orders</div><div class="byr-strip-val">{{ buyer.stats.totalOrders }}</div></div>
                <div class="byr-strip-kpi"><div class="zen-perf-lbl">Lifetime Value</div><div class="byr-strip-val">{{ buyer.currency }} {{ buyer.stats.lifetimeValue.toLocaleString() }}</div></div>
                <div class="byr-strip-kpi"><div class="zen-perf-lbl">Avg Order Value</div><div class="byr-strip-val">{{ buyer.currency }} {{ buyer.stats.avgOrderValue }}</div></div>
                <div class="byr-strip-kpi"><div class="zen-perf-lbl">Return Rate</div><div class="byr-strip-val" :class="{ 'is-warn': buyer.stats.returnRate > 7 }">{{ buyer.stats.returnRate }}%</div></div>
                <div class="byr-strip-kpi"><div class="zen-perf-lbl">Last Order</div><div class="byr-strip-val">{{ buyer.stats.lastOrderDate }}</div></div>
              </div>
            </div>
            <div class="zen-grid-2">
              <div class="zen-card">
                <div class="zen-card-head"><span class="zen-card-title">Personal Information</span></div>
                <div class="zen-bank-fields">
                  <div class="zen-bank-field"><div class="zen-field-label">First Name</div><div class="zen-field-val">{{ buyer.firstName }}</div></div>
                  <div class="zen-bank-field"><div class="zen-field-label">Last Name</div><div class="zen-field-val">{{ buyer.lastName }}</div></div>
                  <div class="zen-bank-field"><div class="zen-field-label">Email</div><div class="zen-field-val zen-field-mono" style="font-size:11.5px">{{ buyer.email }}</div></div>
                  <div class="zen-bank-field"><div class="zen-field-label">Phone</div><div class="zen-field-val zen-field-mono" style="font-size:11.5px">{{ buyer.phone }}</div></div>
                  <div class="zen-bank-field"><div class="zen-field-label">Nationality</div><div class="zen-field-val">{{ buyer.nationality }}</div></div>
                  <div class="zen-bank-field"><div class="zen-field-label">Currency</div><div class="zen-field-val">{{ buyer.currency }}</div></div>
                  <div class="zen-bank-field"><div class="zen-field-label">Registered</div><div class="zen-field-val">{{ buyer.registeredDate }}</div></div>
                  <div class="zen-bank-field"><div class="zen-field-label">Last Login</div><div class="zen-field-val">{{ buyer.lastLogin }}</div></div>
                </div>
              </div>
              <div class="zen-card">
                <div class="zen-card-head"><span class="zen-card-title">Communication Preferences</span></div>
                <div class="zen-bank-fields">
                  <div class="zen-bank-field" style="flex-direction:row;align-items:center;justify-content:space-between"><div class="zen-field-label" style="margin-bottom:0">Email Marketing</div><span class="zen-bst" :class="buyer.marketingOptIn ? 'zen-bst--active' : 'zen-bst--inactive'">{{ buyer.marketingOptIn ? 'Opted In' : 'Opted Out' }}</span></div>
                  <div class="zen-bank-field" style="flex-direction:row;align-items:center;justify-content:space-between"><div class="zen-field-label" style="margin-bottom:0">SMS Notifications</div><span class="zen-bst" :class="buyer.smsOptIn ? 'zen-bst--active' : 'zen-bst--inactive'">{{ buyer.smsOptIn ? 'Opted In' : 'Opted Out' }}</span></div>
                  <div class="zen-bank-field" style="flex-direction:row;align-items:center;justify-content:space-between"><div class="zen-field-label" style="margin-bottom:0">Push Notifications</div><span class="zen-bst" :class="buyer.pushOptIn ? 'zen-bst--active' : 'zen-bst--inactive'">{{ buyer.pushOptIn ? 'Opted In' : 'Opted Out' }}</span></div>
                </div>
                <div class="zen-card-head" style="margin-top:14px"><span class="zen-card-title">Account Actions</span></div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button class="zen-doc-card-btn">Send Password Reset</button>
                  <button class="zen-doc-card-btn">Send Message</button>
                  <button class="zen-doc-card-btn zen-doc-card-btn--reject">Suspend Account</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Purchases -->
          <div v-else-if="tab === 'purchases'" class="zen-tab-body">
            <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">{{ buyer.purchases.length }} orders</div><button class="zen-btn-ghost">Export</button></div>
            <div v-for="(orders, currency) in groupedPurchases" :key="currency">
              <div class="zen-doc-section-title">{{ currency }} orders · {{ currency }} {{ purchaseTotal(orders).toLocaleString() }}</div>
              <div class="byr-orders-table">
                <div class="byr-orders-head"><span>Order ID</span><span>Date</span><span>Brands</span><span>Items</span><span>Status</span><span>Amount</span></div>
                <div v-for="o in orders" :key="o.id" class="byr-order-row" @click="selectedOrder = o">
                  <span class="zen-pd-order-id">{{ o.id }}</span>
                  <span class="zen-pd-date">{{ o.date }}</span>
                  <span>{{ o.brand }}</span>
                  <span class="zen-pd-ref">{{ o.items }}</span>
                  <span><span class="zen-bst" :class="orderStatus(o.status).cls">{{ orderStatus(o.status).label }}</span></span>
                  <span class="zen-payout-amount">{{ o.currency }} {{ o.amount.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Addresses -->
          <div v-else-if="tab === 'addresses'" class="zen-tab-body">
            <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">{{ buyer.addresses.length }} saved addresses</div><button class="zen-btn-primary">+ Add Address</button></div>
            <div class="byr-addresses-grid">
              <div v-for="addr in buyer.addresses" :key="addr.id" class="byr-address-card" :class="{ 'is-default': addr.isDefault }">
                <div class="byr-addr-head"><span class="byr-addr-label">{{ addr.label }}</span><span v-if="addr.isDefault" class="zen-pm-default">Default</span></div>
                <div class="byr-addr-name">{{ addr.firstName }} {{ addr.lastName }}</div>
                <div class="byr-addr-lines"><span v-if="addr.building">{{ addr.building }}, </span><span v-if="addr.street">{{ addr.street }}, </span><span v-if="addr.district">{{ addr.district }}, </span><span v-if="addr.city">{{ addr.city }}</span></div>
                <div v-if="addr.w3w" class="byr-addr-w3w">{{ addr.w3w }}</div>
                <div class="byr-addr-phone">{{ addr.phone }}</div>
              </div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div v-else-if="tab === 'payment-methods'" class="zen-tab-body">
            <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">{{ buyer.paymentMethods.length }} payment methods</div></div>
            <div v-for="pm in buyer.paymentMethods" :key="pm.id" class="byr-pm-card">
              <div class="byr-pm-info">
                <div class="byr-pm-row">
                  <span v-if="pm.type === 'card'"><span class="byr-card-brand">{{ pm.brand }}</span> <span class="byr-pm-number">•••• {{ pm.last4 }}</span></span>
                  <span v-else class="byr-pm-wallet">{{ pm.brand }}</span>
                  <span v-if="pm.isDefault" class="zen-pm-default">Default</span>
                </div>
                <div v-if="pm.expiry" class="byr-pm-expiry">Expires {{ pm.expiry }}</div>
              </div>
              <span class="zen-bst" :class="pm.status === 'active' ? 'zen-bst--active' : 'zen-bst--inactive'" style="margin-left:auto">{{ pm.status }}</span>
            </div>
          </div>

          <!-- Loyalty -->
          <div v-else-if="tab === 'loyalty'" class="zen-tab-body">
            <div class="zen-card byr-loyalty-card">
              <div class="byr-loyalty-top">
                <div><div class="byr-loyalty-tier-label">Current Tier</div><span class="zen-tier-badge" :style="{ background: tierMeta(buyer.tier).bg, color: tierMeta(buyer.tier).color, borderColor: tierMeta(buyer.tier).border }">{{ buyer.tier }}</span></div>
                <div class="byr-loyalty-points"><div class="byr-loyalty-pts-val">{{ (buyer.buyerScore * 48 + 220).toLocaleString() }}</div><div class="byr-loyalty-pts-lbl">points</div></div>
              </div>
            </div>
          </div>

          <!-- Analytics -->
          <div v-else-if="tab === 'analytics'" class="zen-tab-body">
            <div class="zen-adv-kpi-grid">
              <div class="zen-adv-kpi-card"><div class="zen-adv-kpi-lbl">Purchase Frequency</div><div class="zen-adv-kpi-val" style="font-size:13px">{{ buyer.analytics.purchaseFrequency }}</div></div>
              <div class="zen-adv-kpi-card"><div class="zen-adv-kpi-lbl">Avg Days Between Orders</div><div class="zen-adv-kpi-val" style="font-size:13px">{{ buyer.analytics.avgDaysBetweenOrders }} days</div></div>
              <div class="zen-adv-kpi-card"><div class="zen-adv-kpi-lbl">Preferred Day</div><div class="zen-adv-kpi-val" style="font-size:13px">{{ buyer.analytics.preferredDay }}</div></div>
              <div class="zen-adv-kpi-card"><div class="zen-adv-kpi-lbl">Preferred Time</div><div class="zen-adv-kpi-val" style="font-size:13px">{{ buyer.analytics.preferredTime }}</div></div>
            </div>
            <div class="zen-grid-2">
              <div class="zen-card">
                <div class="zen-card-head"><span class="zen-card-title">Top Categories</span></div>
                <div class="byr-bar-list">
                  <div v-for="(c, i) in buyer.analytics.topCategories" :key="i" class="byr-bar-row"><span class="byr-bar-label">{{ c.name }}</span><div class="byr-bar-track"><div class="byr-bar-fill" :style="{ width: c.pct + '%' }" /></div><span class="byr-bar-pct">{{ c.pct }}%</span></div>
                </div>
              </div>
              <div class="zen-card">
                <div class="zen-card-head"><span class="zen-card-title">Top Brands</span></div>
                <div class="byr-bar-list">
                  <div v-for="(b, i) in buyer.analytics.topBrands" :key="i" class="byr-bar-row"><span class="byr-bar-label">{{ b.name }}</span><div class="byr-bar-track"><div class="byr-bar-fill" :style="{ width: (b.orders / buyer.analytics.topBrands[0].orders * 100) + '%' }" /></div><span class="byr-bar-pct">{{ b.orders }} orders</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Abandoned Carts -->
          <div v-else-if="tab === 'abandoned-carts'" class="zen-tab-body">
            <div class="zen-tab-toolbar"><div class="zen-tab-toolbar-title">Abandoned carts</div><button class="zen-btn-primary" style="font-size:11.5px;height:28px">Send Recovery Email</button></div>
            <div class="zen-card" style="font-size:12.5px;color:var(--zg-text-mid)">Recovery workflow for this customer's abandoned carts.</div>
          </div>

          <!-- Activity Log -->
          <div v-else class="zen-tab-body">
            <div class="zen-act-timeline">
              <div v-for="(entry, i) in buyer.activityLog" :key="i" class="zen-act-entry">
                <div class="zen-act-entry-left"><div class="zen-act-icon-wrap"><span /></div><div v-if="i < buyer.activityLog.length - 1" class="zen-act-vline" /></div>
                <div class="zen-act-entry-body">
                  <div class="zen-act-entry-head"><span class="zen-act-actor">{{ entry.actor }}</span><span class="zen-act-role" :class="`zen-act-role--${entry.role}`">{{ entry.role.toUpperCase() }}</span></div>
                  <div class="zen-act-action">{{ entry.action }}</div>
                  <div class="zen-act-time">{{ entry.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order drawer -->
    <ZDrawer :open="!!selectedOrder" :title="selectedOrder ? selectedOrder.id : ''" :subtitle="selectedOrder ? `${selectedOrder.date} · ${selectedOrder.brand}` : ''" @close="selectedOrder = null">
      <div v-if="selectedOrder" class="zen-bank-fields">
        <div class="zen-bank-field"><div class="zen-field-label">Order ID</div><div class="zen-field-val zen-field-mono">{{ selectedOrder.id }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Brand</div><div class="zen-field-val">{{ selectedOrder.brand }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Items</div><div class="zen-field-val">{{ selectedOrder.items }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Total</div><div class="zen-field-val zen-field-mono" style="font-size:16px;font-weight:700;color:var(--zg-accent)">{{ selectedOrder.currency }} {{ selectedOrder.amount.toLocaleString() }}</div></div>
      </div>
      <template #footer>
        <ZButton variant="ghost" @click="selectedOrder = null">Close</ZButton>
        <ZButton variant="primary">Open Full Order →</ZButton>
      </template>
    </ZDrawer>
  </div>
</template>
