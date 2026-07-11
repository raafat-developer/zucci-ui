<!-- SField.vue — shared settings input field -->
<script setup>
defineProps({ label:String, value:[String,Number], type:{default:'text'}, mono:Boolean, ph:String, disabled:Boolean, req:Boolean });
defineEmits(['update:value']);
</script>
<template>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid);">{{ label }}<span v-if="req" style="color:var(--zg-danger);"> *</span></label>
    <input :type="type" :value="value||''" :placeholder="ph" :disabled="disabled"
      @input="$emit('update:value', $event.target.value)"
      :style="{height:'32px',padding:'0 10px',background:disabled?'var(--zg-panel-hi)':'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:mono?'var(--zg-mono)':'var(--zg-sans)',fontSize:'12px',color:'var(--zg-text)',outline:'none',opacity:disabled?0.6:1,width:'100%',boxSizing:'border-box'}" />
  </div>
</template>
