<script setup>
import { ref, computed } from 'vue';
import BuyerOrderDrawer from '../BuyerOrderDrawer.vue';

const props = defineProps({ buyer: { type: Object, required: true } });
const selectedOrder = ref(null);

const grouped = computed(() => {
  const map = {};
  props.buyer.purchases.forEach(o => {
    if (!map[o.currency]) map[o.currency] = [];
    map[o.currency].push(o);
  });
  return map;
});

const ORDER_STATUS = {
  delivered:  { label:'Delivered',  cls:'zen-bst--active' },
  in_transit: { label:'In Transit', cls:'zen-bst--pending' },
  returned:   { label:'Returned',   cls:'zen-bst--suspended' },
  cancelled:  { label:'Cancelled',  cls:'zen-bst--inactive' },
  processing: { label:'Processing', cls:'zen-bst--pending' },
};
const osMeta = s => ORDER_STATUS[s] || ORDER_STATUS.processing;

function exportCSV() {
  const b = new Blob(['Orders export'], { type:'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = 'orders.csv'; a.click();
}
</script>

<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar">
      <div class="zen-tab-toolbar-title">{{ buyer.purchases.length }} orders</div>
      <button class="zen-btn-ghost" @click="exportCSV">Export</button>
    </div>

    <div v-for="[currency, orders] in Object.entries(grouped)" :key="currency">
      <div class="zen-doc-section-title">
        {{ currency }} orders · {{ currency }} {{ orders.reduce((s, o) => s + o.amount, 0).toLocaleString() }}
      </div>
      <div class="byr-orders-table">
        <div class="byr-orders-head">
          <span>Order ID</span><span>Date</span><span>Brand</span><span>Items</span><span>Status</span><span>Amount</span>
        </div>
        <div v-for="o in orders" :key="o.id" class="byr-order-row" @click="selectedOrder = o">
          <span class="zen-pd-order-id">{{ o.id }}</span>
          <span class="zen-pd-date">{{ o.date }}</span>
          <span>{{ o.brand }}</span>
          <span class="zen-pd-ref">{{ o.items }}</span>
          <span><span class="zen-bst" :class="osMeta(o.status).cls">{{ osMeta(o.status).label }}</span></span>
          <span class="zen-payout-amount">{{ o.currency }} {{ o.amount.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <BuyerOrderDrawer :order="selectedOrder" @close="selectedOrder = null" />
  </div>
</template>
