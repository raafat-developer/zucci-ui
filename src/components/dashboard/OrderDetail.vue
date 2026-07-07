<template>
  <div v-if="order" class="zg-od-backdrop" @click="emit('close')" />
  <aside v-if="order" class="zg-order-detail">
    <header class="zg-od-head">
      <div>
        <div class="zg-od-id">{{ order.id }}</div>
        <div class="zg-od-sub">{{ order.originZone }} → {{ order.destZone }}</div>
      </div>
      <button class="zg-od-close" @click="emit('close')" aria-label="Close">✕</button>
    </header>

    <div class="zg-od-badges">
      <span class="zg-od-chip" :class="'is-' + order.mode">{{ modeLabel[order.mode] || order.mode }}</span>
      <span class="zg-od-chip" :class="'sla-' + order.sla">{{ slaLabel[order.sla] || order.sla }}</span>
      <span v-if="order.isReturn" class="zg-od-chip is-return">Return</span>
      <span v-if="order.hold" class="zg-od-chip is-hold">Hold: {{ order.hold }}</span>
    </div>

    <div class="zg-od-grid">
      <div class="zg-od-cell"><span>ETA</span><b>{{ eta }}</b></div>
      <div class="zg-od-cell"><span>Value</span><b>${{ order.value }}</b></div>
      <div class="zg-od-cell"><span>Pieces</span><b>{{ order.pieces }}</b></div>
      <div class="zg-od-cell"><span>Weight</span><b>{{ order.weightKg }} kg</b></div>
      <div class="zg-od-cell"><span>Carrier</span><b>{{ order.carrier }}</b></div>
      <div class="zg-od-cell"><span>Driver</span><b>{{ order.driverId || '—' }}</b></div>
      <div class="zg-od-cell"><span>Vendor</span><b>{{ order.vendor }}</b></div>
      <div class="zg-od-cell"><span>Customer</span><b>{{ order.customer }}</b></div>
    </div>

    <div class="zg-od-tl">
      <div class="zg-od-tl-title">Progress</div>
      <ol class="zg-od-steps">
        <li v-for="(s, i) in timeline" :key="i" :class="{ done: s.done, current: s.current }">
          <span class="zg-od-dot" /><span class="zg-od-lbl">{{ s.label }}</span>
        </li>
      </ol>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ order: { type: Object, default: null } })
const emit = defineEmits(['close'])

const modeLabel = { zugooo: 'ZUGOOO', mixed: 'Mixed', '3p': '3PL' }
const slaLabel = { 'on-time': 'On time', 'at-risk': 'At risk', 'breached': 'Breached' }

const eta = computed(() => {
  const m = props.order?.etaMin || 0
  if (m < 60) return m + 'm'
  const h = Math.floor(m / 60), r = m % 60
  return r ? h + 'h ' + r + 'm' : h + 'h'
})
const timeline = computed(() => {
  const stages = ['Picked up', 'At depot', 'In transit', 'Out for delivery', 'Delivered']
  const idx = Math.min(Math.round((props.order?.progress || 0) * (stages.length - 1)), stages.length - 1)
  return stages.map((label, i) => ({ label, done: i <= idx, current: i === idx }))
})
</script>

<style scoped>
.zg-od-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1400;animation:odFade .15s ease}
.zg-order-detail{position:fixed;top:0;right:0;bottom:0;z-index:1401;display:flex;flex-direction:column;gap:14px;padding:18px;width:360px;max-width:90vw;background:var(--zg-surface,#12141a);border-left:1px solid var(--zg-border,#242833);box-shadow:-12px 0 40px rgba(0,0,0,.5);overflow:auto;animation:odSlide .2s ease}
@keyframes odFade{from{opacity:0}to{opacity:1}}
@keyframes odSlide{from{transform:translateX(20px);opacity:.4}to{transform:translateX(0);opacity:1}}
.zg-od-head{display:flex;justify-content:space-between;align-items:flex-start}
.zg-od-id{font-weight:700;font-size:15px;color:var(--zg-text,#e8eaf0)}
.zg-od-sub{font-size:12px;color:var(--zg-text-dim,#8b90a0);margin-top:2px}
.zg-od-close{background:none;border:none;color:var(--zg-text-dim,#8b90a0);cursor:pointer;font-size:14px;padding:4px}
.zg-od-close:hover{color:var(--zg-text,#e8eaf0)}
.zg-od-badges{display:flex;flex-wrap:wrap;gap:6px}
.zg-od-chip{font-size:11px;padding:3px 8px;border-radius:99px;background:var(--zg-chip,#1c1f29);color:var(--zg-text,#e8eaf0);border:1px solid var(--zg-border,#242833)}
.zg-od-chip.sla-at-risk{color:#f5b955;border-color:#5a4420}
.zg-od-chip.sla-breached{color:#f06b6b;border-color:#5a2424}
.zg-od-chip.is-hold,.zg-od-chip.is-return{color:#f5b955}
.zg-od-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.zg-od-cell{display:flex;flex-direction:column;gap:2px}
.zg-od-cell span{font-size:11px;color:var(--zg-text-dim,#8b90a0)}
.zg-od-cell b{font-size:13px;color:var(--zg-text,#e8eaf0)}
.zg-od-tl-title{font-size:12px;color:var(--zg-text-dim,#8b90a0);margin-bottom:8px}
.zg-od-steps{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0}
.zg-od-steps li{display:flex;align-items:center;gap:10px;padding:6px 0;position:relative}
.zg-od-dot{width:10px;height:10px;border-radius:99px;background:var(--zg-border,#242833);flex:none}
.zg-od-steps li.done .zg-od-dot{background:#3fb950}
.zg-od-steps li.current .zg-od-dot{background:#58a6ff;box-shadow:0 0 0 3px rgba(88,166,255,.2)}
.zg-od-lbl{font-size:12px;color:var(--zg-text,#e8eaf0)}
</style>
