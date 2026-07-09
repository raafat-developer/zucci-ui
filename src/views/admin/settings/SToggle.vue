<!-- SToggle — settings toggle row -->
<script setup>
defineProps({
  label: { type: String, required: true },
  sub:   { type: String, default: '' },
  value: { type: Boolean, default: false },
});
defineEmits(['update:value']);
</script>

<template>
  <div class="st-row">
    <div>
      <div class="st-label">{{ label }}</div>
      <div v-if="sub" class="st-sub">{{ sub }}</div>
    </div>
    <button class="st-btn" :class="{ 'is-on': value }" @click="$emit('update:value', !value)">
      <div class="st-knob" />
    </button>
  </div>
</template>

<style scoped>
.st-row { display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--zg-line); }
.st-label { font-size:12.5px;font-weight:500;color:var(--zg-text); }
.st-sub { font-size:11px;color:var(--zg-text-dim);margin-top:1px; }
.st-btn { width:36px;height:20px;border-radius:10px;border:none;cursor:pointer;background:var(--zg-line);position:relative;flex-shrink:0;transition:background .14s; }
.st-btn.is-on { background:var(--zg-accent); }
.st-knob { width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:3px;left:3px;transition:left .14s; }
.st-btn.is-on .st-knob { left:18px; }
</style>
