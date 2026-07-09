<script setup>
import { reactive } from 'vue';
import SField from '../SField.vue';

const v = reactive({ name:'Zucci Fashion Platform LLC', name_ar:'زوتشي للأزياء', trade_lic:'CN-1234567', vat:'100234567800003', cr:'1010234567', founded:'2023', address_uae:'Office 2401, Opus Tower, Business Bay, Dubai, UAE', address_eg:'12 Hassan Sabry St, Zamalek, Cairo, Egypt', email:'legal@zucci.com', phone:'+971 4 123 4567', website:'https://zucci.com' });
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Company Info</div><div class="zset-content-sub">Legal entity details used on invoices, contracts, and tax documents</div></div>
      <button class="btn-primary" @click="">Save Changes</button>
    </div>
    <div class="sf-grid">
      <SField label="Legal Name (EN)" v-model:value="v.name" ph="Company legal name" />
      <SField label="Legal Name (AR)" v-model:value="v.name_ar" ph="اسم الشركة" />
      <SField label="Trade License No." v-model:value="v.trade_lic" mono ph="CN-XXXXXXX" />
      <SField label="VAT Registration No." v-model:value="v.vat" mono ph="15 digits" />
      <SField label="Commercial Registration" v-model:value="v.cr" mono />
      <SField label="Founded Year" v-model:value="v.founded" type="number" />
      <div style="grid-column:1/-1;"><SField label="UAE Address" v-model:value="v.address_uae" /></div>
      <div style="grid-column:1/-1;"><SField label="Egypt Address" v-model:value="v.address_eg" /></div>
      <SField label="Legal Email" v-model:value="v.email" type="email" />
      <SField label="Phone" v-model:value="v.phone" mono />
      <div style="grid-column:1/-1;"><SField label="Website" v-model:value="v.website" /></div>
    </div>
  </div>
</template>
