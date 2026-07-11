<!-- SSelect.vue — shared settings select -->
<script setup>
defineProps({ label:String, value:String, opts:{type:Array,default:()=>[]}, req:Boolean });
defineEmits(['update:value']);
</script>
<template>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid);">{{ label }}<span v-if="req" style="color:var(--zg-danger);"> *</span></label>
    <select :value="value" @change="$emit('update:value', $event.target.value)"
      style="height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;cursor:pointer;width:100%;">
      <option v-for="[v,l] in opts" :key="v" :value="v">{{ l }}</option>
    </select>
  </div>
</template>
