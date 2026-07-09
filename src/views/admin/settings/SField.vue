<!-- SField — reusable settings input field -->
<script setup>
defineProps({
  label:    { type: String,  required: true },
  value:    { type: [String, Number], default: '' },
  type:     { type: String,  default: 'text' },
  ph:       { type: String,  default: '' },
  mono:     { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
defineEmits(['update:value']);
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <label class="sf-lbl">{{ label }}</label>
    <input
      :type="type"
      :value="value"
      :placeholder="ph"
      :disabled="disabled"
      class="sf-inp"
      :class="{ 'is-mono': mono, 'is-disabled': disabled }"
      @input="$emit('update:value', $event.target.value)"
    />
  </div>
</template>

<style scoped>
.sf-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.sf-inp { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:var(--zg-sans);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
.sf-inp.is-mono { font-family:var(--zg-mono); }
.sf-inp.is-disabled { background:var(--zg-panel-hi);opacity:0.6;cursor:not-allowed; }
</style>
