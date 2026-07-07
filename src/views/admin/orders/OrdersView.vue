<script setup>
/**
 * OrdersView — Orders module shell. Toolbar (New Order + Restock/Return/Refund/
 * Edit/Print/More), three-column layout (list · detail · panel), the timeline
 * user drawer, and the action drawers. Faithful port of ZucciOrdersModule.
 */
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/stores/orders';
import { ZC_ORDERS_LIST as SEED_LIST, ZC_ORDER_DETAIL as SEED_DETAIL } from '@/data/ordersData';
import OrderDetail from './OrderDetail.vue';
import OrderPanel from './OrderPanel.vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import ZButton from '@/components/ui/ZButton.vue';

const route = useRoute();
const store = useOrdersStore();
onMounted(() => { if (!store.loaded) store.fetchAll(); if (!store.detail) store.fetchDetail(); });
const order = computed(() => store.detail || SEED_DETAIL);
const ordersList = computed(() => (store.items.length ? store.items : SEED_LIST));

const selectedId = ref(SEED_DETAIL.id);
const searchQ = ref('');
const statusFilter = ref(route.query.status || 'all');
const marketFilter = ref('all');
const dateFilter = ref('');
const filterOpen = ref(false);
const printMenuOpen = ref(false);
const activeDrawer = ref(null);
const drawerUser = ref(null);

const STATUS_LABEL = { transit:'In Transit', completed:'Completed', cancelled:'Cancelled', progress:'In Progress' };

const groups = computed(() => {
  const map = {}; const sq = searchQ.value.toLowerCase();
  ordersList.value.filter((o) => {
    const ms = statusFilter.value === 'all' || o.status === statusFilter.value;
    const mm = marketFilter.value === 'all' || (o.market || 'AE') === marketFilter.value;
    const mq = !sq || (o.id || '').toLowerCase().includes(sq) || (o.customer || '').toLowerCase().includes(sq);
    return ms && mm && mq;
  }).forEach((o) => {
    const grp = statusFilter.value !== 'all' ? o.status : o.group;
    (map[grp] = map[grp] || []).push(o);
  });
  return map;
});

const fmt = (n, cur) => cur + ' ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const printItems = [
  ['Print This Order', 'Print the currently selected order'],
  ['Print All Prepared', 'Print all orders in Prepared/Ready status'],
  ['Print Packing Slips', "Packing slips for today's outbound"],
  ['Print Shipping Labels', 'Carrier labels for dispatched orders'],
  ['Export to PDF', 'Download order list as PDF'],
];
const statusChips = [['all','All'],['transit','In Transit'],['progress','Processing'],['completed','Completed'],['cancelled','Cancelled']];
const marketChips = [['all','All'],['AE','🇦🇪 AE'],['SA','🇸🇦 SA'],['EG','🇪🇬 EG'],['QA','🇶🇦 QA']];
const clearFilters = () => { statusFilter.value = 'all'; marketFilter.value = 'all'; dateFilter.value = ''; searchQ.value = ''; };
const prints = printItems;
const statuses = statusChips;
const mkts = marketChips;
const labels = STATUS_LABEL;
const drawerTitle = computed(() => {
  const t = { 'edit-order':'Edit Order', restock:'Restock Items', return:'Return / Exchange', refund:'Issue Refund', 'status-history':'Status History', 'cancel-order':'Cancel Order' };
  return t[activeDrawer.value] || (activeDrawer.value || '').replace(/-/g, ' ');
});
</script>

<template>
  <div class="zco-wrap">
    <!-- Toolbar -->
    <div class="zco-toolbar">
      <div class="zco-toolbar-left">
        <button class="zco-btn-new" @click="activeDrawer = 'new-order'">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="2" x2="8" y2="14" /><line x1="2" y1="8" x2="14" y2="8" /></svg>
          New Order
        </button>
      </div>
      <div class="zco-toolbar-right">
        <button class="zco-btn-action" @click="activeDrawer = 'restock'">Restock</button>
        <button class="zco-btn-action" @click="activeDrawer = 'return'">Return</button>
        <button class="zco-btn-action" @click="activeDrawer = 'refund'">Refund</button>
        <button class="zco-btn-action" @click="activeDrawer = 'edit-order'">Edit</button>
        <div style="position:relative">
          <button class="zco-btn-action" @click="printMenuOpen = !printMenuOpen">
            Print
            <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3.5L5 6.5L8 3.5" /></svg>
          </button>
          <div v-if="printMenuOpen" style="position:absolute;top:calc(100% + 4px);right:0;z-index:50;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);min-width:180px;box-shadow:0 8px 24px oklch(0.05 0.01 250 / 0.4)" @mouseleave="printMenuOpen = false">
            <button v-for="[l, sub] in prints" :key="l" style="width:100%;padding:9px 14px;border:none;border-bottom:1px solid var(--zg-line-soft);background:transparent;cursor:pointer;text-align:left;font-family:inherit" @click="printMenuOpen = false">
              <div style="font-size:12.5px;font-weight:600;color:var(--zg-text)">{{ l }}</div>
              <div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:1px">{{ sub }}</div>
            </button>
          </div>
        </div>
        <button class="zco-btn-action" @click="activeDrawer = 'more'">
          More actions
          <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3.5L5 6.5L8 3.5" /></svg>
        </button>
      </div>
    </div>

    <!-- 3-column layout -->
    <div class="zco-layout" style="position:relative">
      <!-- List -->
      <div class="zco-list">
        <div class="zco-list-search">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4" /><line x1="10" y1="10" x2="14" y2="14" /></svg>
          <input type="text" placeholder="Search orders, customers…" v-model="searchQ" style="outline:none;background:transparent;border:none;color:var(--zg-text);font-family:inherit;font-size:12.5px;flex:1" />
          <button :style="{ background:'transparent', border:'none', cursor:'pointer', color: filterOpen ? 'var(--zg-accent)' : 'var(--zg-text-dim)', padding:'0 2px', display:'flex', alignItems:'center' }" @click="filterOpen = !filterOpen">
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="2" y1="4" x2="14" y2="4" /><line x1="4" y1="8" x2="12" y2="8" /><line x1="6" y1="12" x2="10" y2="12" /></svg>
          </button>
        </div>

        <div v-if="filterOpen" style="padding:10px 12px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);display:flex;flex-direction:column;gap:8px;flex-shrink:0">
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <span style="font-size:10.5px;font-weight:600;color:var(--zg-text-dim);align-self:center">Status:</span>
            <button v-for="[v, l] in statuses" :key="v" class="zwh-filter-chip" :class="{ 'is-active': statusFilter === v }" style="font-size:10px;height:20px" @click="statusFilter = v">{{ l }}</button>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <span style="font-size:10.5px;font-weight:600;color:var(--zg-text-dim);align-self:center">Market:</span>
            <button v-for="[v, l] in mkts" :key="v" class="zwh-filter-chip" :class="{ 'is-active': marketFilter === v }" style="font-size:10px;height:20px" @click="marketFilter = v">{{ l }}</button>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:10.5px;font-weight:600;color:var(--zg-text-dim)">Date from:</span>
            <input type="date" v-model="dateFilter" style="height:24px;padding:0 8px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-sm);font-family:inherit;font-size:11px;color:var(--zg-text);outline:none" />
            <button v-if="statusFilter !== 'all' || marketFilter !== 'all' || dateFilter || searchQ" style="font-size:11px;color:var(--zg-danger);background:transparent;border:none;cursor:pointer;font-family:inherit" @click="clearFilters">Clear filters</button>
          </div>
        </div>

        <div class="zco-list-scroll">
          <div v-for="(list, group) in groups" :key="group">
            <div class="zco-list-group">{{ group }}</div>
            <div v-for="o in list" :key="o.id" class="zco-list-row" :class="{ 'is-active': o.id === selectedId }" @click="selectedId = o.id">
              <div class="zco-list-row-top">
                <div class="zco-list-id">#{{ o.id }}</div>
                <div class="zco-list-amount">{{ fmt(o.amount, o.currency) }}</div>
              </div>
              <div class="zco-list-customer">{{ o.customer }} · {{ o.items }} items</div>
              <div class="zco-list-row-bot">
                <div class="zco-list-date">{{ o.dateRange }}</div>
                <span class="zco-pill" :class="`zco-pill--${o.status}`">{{ labels[o.status] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail -->
      <OrderDetail :order="order" @user-click="drawerUser = $event" @status-expand="activeDrawer = 'status-history'" />

      <!-- Panel -->
      <OrderPanel :order="order" @add-tag="(t) => store.addTag(order.id, t)" />

      <!-- Timeline user drawer -->
      <div class="zco-user-drawer" :class="{ 'is-open': drawerUser }">
        <div class="zco-user-drawer-head">
          <span class="zco-user-drawer-title">User Info</span>
          <button class="zco-user-drawer-close" @click="drawerUser = null">✕</button>
        </div>
        <div v-if="drawerUser" class="zco-user-drawer-body">
          <div class="zco-user-drawer-avatar-row">
            <div class="zco-user-drawer-avatar" style="background:var(--zg-accent-tint);color:var(--zg-accent)">{{ drawerUser.initials }}</div>
            <div>
              <div class="zco-user-drawer-name">{{ drawerUser.name }}</div>
              <span class="zco-user-drawer-role-badge" style="background:var(--zg-accent-tint);color:var(--zg-accent)">{{ drawerUser.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action drawers -->
    <ZDrawer :open="!!activeDrawer" :title="drawerTitle" subtitle="Order #329929328239" @close="activeDrawer = null">
      <div style="color:var(--zg-text-mid);font-size:12.5px;line-height:1.6">
        <template v-if="activeDrawer === 'restock'">Select items to return to stock and confirm quantities.</template>
        <template v-else-if="activeDrawer === 'return'">Start a return or exchange for one or more line items.</template>
        <template v-else-if="activeDrawer === 'refund'">Choose refund amount and reason. Customer will be notified.</template>
        <template v-else-if="activeDrawer === 'edit-order'">Edit shipping address, line items, or quantities.</template>
        <template v-else-if="activeDrawer === 'status-history'">Full order status history timeline.</template>
        <template v-else-if="activeDrawer === 'new-order'">Create a manual order on behalf of a customer.</template>
        <template v-else>Additional order actions.</template>
      </div>
      <template #footer>
        <ZButton variant="ghost" @click="activeDrawer = null">Cancel</ZButton>
        <ZButton variant="primary" @click="activeDrawer = null">Confirm</ZButton>
      </template>
    </ZDrawer>
  </div>
</template>

