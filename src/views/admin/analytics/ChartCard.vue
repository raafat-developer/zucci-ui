<!-- ChartCard — chart wrapper card (matches React CC component) -->
<script setup>
defineProps({
  title: { type: String, required: true },
  sub:   { type: String, default: '' },
  span:  { type: Number, default: 1 },
  h:     { type: Number, default: 220 },
});
</script>

<template>
  <div class="cc-card" :style="{ gridColumn: `span ${span}` }">
    <div class="cc-head">
      <div class="cc-title">{{ title }}</div>
      <div v-if="sub" class="cc-sub">{{ sub }}</div>
    </div>
    <div class="cc-body" :style="{ height: h + 'px' }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cc-card { background:#15171B;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px 12px;display:flex;flex-direction:column; }
.cc-head { margin-bottom:12px; }
.cc-title { font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#D1D5DB; }
.cc-sub { font-size:10.5px;color:#6B7280;margin-top:2px; }
.cc-body { overflow:hidden;display:flex;align-items:stretch; }
</style>
