<script setup>
const props = defineProps({ model: { type: String, default: '' } });
const FUNDING_LABELS = { zucci_100:'Zucci 100%', vendor_100:'Vendor 100%', split:'Split', partner_100:'Partner 100%', zucci_60_vendor_40:'Zucci 60% / Vendor 40%', split_50_50:'50 / 50' };
const label = FUNDING_LABELS[props.model] || props.model;
const cls = props.model === 'zucci_100' ? 'is-zucci' : props.model === 'vendor_100' ? 'is-vendor' : 'is-split';
</script>
<template><span class="zcd-funding-tag" :class="cls">{{ label }}</span></template>
