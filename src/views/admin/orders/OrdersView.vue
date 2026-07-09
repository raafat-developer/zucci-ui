<script setup>
/**
 * OrdersView — Orders module shell. Toolbar (New Order + Restock/Return/Refund/
 * Edit/Print/More), three-column layout (list · detail · panel), the timeline
 * user drawer, and the action drawers. Faithful port of ZucciOrdersModule.
 */
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/stores/orders';
import { ZC_ORDERS_LIST as SEED_LIST, ZC_ORDER_DETAIL as SEED_DETAIL } from '@/data/ordersData';
import OrderDetail from './OrderDetail.vue';
import OrderPanel from './OrderPanel.vue';
import EditOrderDrawer from './EditOrderDrawer.vue';
import RestockDrawer from './RestockDrawer.vue';
import CustomerProfileDrawer from './CustomerProfileDrawer.vue';
import ReturnExchangeDrawer from './ReturnExchangeDrawer.vue';
import RefundDrawer from './RefundDrawer.vue';
import StatusHistoryDrawer from './StatusHistoryDrawer.vue';
import NewOrderModal from './NewOrderModal.vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import ZButton from '@/components/ui/ZButton.vue';
import ContextMenuDropdown from './ContextMenuDropdown.vue';
import CancelOrderDrawer    from './CancelOrderDrawer.vue';
import EditShippingDrawer   from './EditShippingDrawer.vue';
import AuditTrailDrawer     from './AuditTrailDrawer.vue';

const route = useRoute();
const store = useOrdersStore();
onMounted(() => { if (!store.loaded) store.fetchAll(); if (!store.detail) store.fetchDetail(); });
const order = computed(() => store.detail || SEED_DETAIL);
const ordersList = computed(() => (store.items.length ? store.items : SEED_LIST));

const selectedId = ref(SEED_DETAIL.id);
const searchQ = ref('');
const statusFilter = ref(route.query.status || 'all');
watch(() => route.query.status, (s) => { statusFilter.value = s || 'all'; });
const marketFilter = ref('all');
const dateFilter = ref('');
const filterOpen = ref(false);
const printMenuOpen = ref(false);
const activeDrawer = ref(null);
const drawerUser = ref(null);
const profileCustomer = ref(null);

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
const ctxMenu = ref(null);

const moreMenuItems = computed(() => [
  { label:'View Customer Profile', icon:'M12 12a4 4 0 100-8 4 4 0 000 8zm-8 8a8 8 0 0116 0', action:() => { activeDrawer.value = 'customer-profile'; ctxMenu.value = null; } },
  { label:'Edit Shipping Address',  icon:'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', action:() => { activeDrawer.value = 'edit-shipping'; ctxMenu.value = null; } },
  { label:'Full Audit Trail',       icon:'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5', action:() => { activeDrawer.value = 'audit-trail'; ctxMenu.value = null; } },
  { divider: true },
  { label:'Cancel Order',           icon:'M18 6L6 18M6 6l12 12', action:() => { activeDrawer.value = 'cancel-order'; ctxMenu.value = null; }, danger:true },
]);

function openMoreMenu(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const menuW = 224;
  const x = Math.min(rect.right - menuW, window.innerWidth - menuW - 8);
  ctxMenu.value = { x: Math.max(8, x), y: rect.bottom + 4 };
}

const drawerTitle = computed(() => {
  const t = { 'edit-order':'Edit Order', restock:'Restock Items', return:'Return / Exchange', refund:'Issue Refund', 'status-history':'Status History', 'cancel-order':'Cancel Order', 'edit-shipping':'Edit Shipping', 'audit-trail':'Audit Trail', 'customer-profile':'Customer Profile' };
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
        <button class="zco-btn-action" @click="openMoreMenu">
          More actions
          <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3.5L5 6.5L8 3.5" /></svg>
        </button>
      </div>
    </div>

    <!-- 3-column layout -->
    <div class="zco-layout" style="position:relative;overflow:hidden;">
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
      <div style="display:flex;flex-direction:column;min-height:0;overflow:hidden;">
        <OrderDetail :order="order" @user-click="drawerUser = $event" @status-expand="activeDrawer = 'status-history'" @more-click="(section, e) => { if (section === 'cancel-order') activeDrawer = 'cancel-order'; }" />
      </div>

      <!-- Panel -->
      <div style="min-height:0;overflow-y:auto;border-left:1px solid var(--zg-line);">
        <OrderPanel :order="order" @add-tag="(t) => store.addTag(order.id, t)" @view-profile="profileCustomer = $event" />
      </div>

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
    <EditOrderDrawer       :open="activeDrawer === 'edit-order'"       :order="order"  @close="activeDrawer = null" />
    <RestockDrawer         :open="activeDrawer === 'restock'"                          @close="activeDrawer = null" />
    <ReturnExchangeDrawer  :open="activeDrawer === 'return'"            :order="order"  @close="activeDrawer = null" />
    <RefundDrawer          :open="activeDrawer === 'refund'"            :order="order"  @close="activeDrawer = null" />
    <StatusHistoryDrawer   :open="activeDrawer === 'status-history'"   :order="order"  @close="activeDrawer = null" />
    <NewOrderModal         :open="activeDrawer === 'new-order'"                        @close="activeDrawer = null" />
    <CustomerProfileDrawer :open="activeDrawer === 'customer-profile' || !!profileCustomer" :customer="profileCustomer" @close="activeDrawer = null; profileCustomer = null" />
    <CancelOrderDrawer     :open="activeDrawer === 'cancel-order'"     :order="order"  @close="activeDrawer = null" />
    <EditShippingDrawer    :open="activeDrawer === 'edit-shipping'"    :order="order"  @close="activeDrawer = null" />
    <AuditTrailDrawer      :open="activeDrawer === 'audit-trail'"      :order="order"  @close="activeDrawer = null" />

    <!-- Context menu for More Actions -->
    <ContextMenuDropdown
      v-if="ctxMenu"
      :items="moreMenuItems"
      :x="ctxMenu.x" :y="ctxMenu.y"
      @close="ctxMenu = null"
    />
  </div>
</template>

