<script setup>
import { ref } from 'vue';
const props = defineProps({ buyer: { type: Object, required: true } });
const editAddr = ref(null);
</script>

<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar">
      <div class="zen-tab-toolbar-title">{{ buyer.addresses.length }} saved address{{ buyer.addresses.length !== 1 ? 'es' : '' }}</div>
      <button class="zen-btn-primary" @click="editAddr = {}">+ Add Address</button>
    </div>
    <div class="byr-addresses-grid">
      <div v-for="addr in buyer.addresses" :key="addr.id" class="byr-address-card" :class="{ 'is-default': addr.isDefault }">
        <div class="byr-addr-head">
          <span class="byr-addr-label">{{ addr.label }}</span>
          <span v-if="addr.isDefault" class="zen-pm-default">Default</span>
        </div>
        <div class="byr-addr-name">{{ addr.firstName }} {{ addr.lastName }}</div>
        <div class="byr-addr-lines">
          <span v-if="addr.building">{{ addr.building }}, </span>
          <span v-if="addr.street">{{ addr.street }}, </span>
          <span v-if="addr.district">{{ addr.district }}, </span>
          <span v-if="addr.city">{{ addr.city }}</span>
        </div>
        <div v-if="addr.w3w" class="byr-addr-w3w">{{ addr.w3w }}</div>
        <div class="byr-addr-phone">{{ addr.phone }}</div>
        <div class="byr-addr-actions">
          <button v-if="!addr.isDefault" class="zen-doc-request-btn" @click="">Set Default</button>
          <button class="zen-doc-card-btn" @click="editAddr = addr">Edit</button>
          <button v-if="!addr.isDefault" class="zen-doc-card-btn zen-doc-card-btn--reject" @click="">Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>
