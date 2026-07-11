<script setup>
import { reactive } from 'vue';
import SField from '../SField.vue';
const v = reactive({ name:'Zucci Fashion Platform LLC', name_ar:'زوتشي للأزياء', trade_lic:'CN-1234567', vat:'100234567800003', cr:'1010234567', founded:'2023', address_uae:'Office 2401, Opus Tower, Business Bay, Dubai, UAE', address_eg:'12 Hassan Sabry St, Zamalek, Cairo, Egypt', email:'legal@zucci.com', phone:'+971 4 123 4567', website:'https://zucci.com' });
</script>
<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Company Info</div><div class="zset-content-sub">Legal entity details used on invoices, contracts, and tax documents</div></div>
      <button class="zwh-btn-primary">Save Changes</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <SField label="Legal Name (EN)"         :value="v.name"         ph="Company legal name"  @update:value="val => v.name = val" />
      <SField label="Legal Name (AR)"         :value="v.name_ar"      ph="اسم الشركة"          @update:value="val => v.name_ar = val" />
      <SField label="Trade License No."       :value="v.trade_lic"    ph="CN-XXXXXXX" :mono="true" @update:value="val => v.trade_lic = val" />
      <SField label="VAT Registration No."    :value="v.vat"          ph="15 digits"  :mono="true" @update:value="val => v.vat = val" />
      <SField label="Commercial Registration" :value="v.cr"           :mono="true"               @update:value="val => v.cr = val" />
      <SField label="Founded Year"            :value="v.founded"      type="number"              @update:value="val => v.founded = val" />
      <div style="grid-column:1/-1;"><SField label="UAE Address" :value="v.address_uae" @update:value="val => v.address_uae = val" /></div>
      <div style="grid-column:1/-1;"><SField label="Egypt Address" :value="v.address_eg" @update:value="val => v.address_eg = val" /></div>
      <SField label="Legal Email" :value="v.email"   type="email"             @update:value="val => v.email = val" />
      <SField label="Phone"       :value="v.phone"   :mono="true"             @update:value="val => v.phone = val" />
      <div style="grid-column:1/-1;"><SField label="Website" :value="v.website" @update:value="val => v.website = val" /></div>
    </div>
  </div>
</template>
