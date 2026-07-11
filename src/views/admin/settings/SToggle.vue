<!-- SToggle.vue — shared settings toggle row -->
<script setup>
defineProps({ label:String, sub:String, value:Boolean });
defineEmits(['update:value']);
</script>
<template>
  <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--zg-line);">
    <div>
      <div style="font-size:12.5px;font-weight:500;color:var(--zg-text);">{{ label }}</div>
      <div v-if="sub" style="font-size:11px;color:var(--zg-text-dim);margin-top:1px;">{{ sub }}</div>
    </div>
    <button @click="$emit('update:value', !value)"
      style="width:34px;height:18px;border-radius:9px;border:none;cursor:pointer;position:relative;flex-shrink:0;transition:background .14s;"
      :style="{ background: value ? 'var(--zg-accent)' : 'var(--zg-line)' }">
      <div style="width:13px;height:13px;border-radius:50%;background:#fff;position:absolute;top:2.5px;transition:left .14s;"
        :style="{ left: value ? '17.5px' : '2px' }"/>
    </button>
  </div>
</template>
