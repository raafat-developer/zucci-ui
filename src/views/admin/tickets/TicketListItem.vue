<script setup>
import { computed } from 'vue';
import { PRIORITY_META, STATUS_META, CAT_COLORS } from '@/data/ticketsData';

const props = defineProps({
  ticket: { type: Object, required: true },
  active: { type: Boolean, default: false },
});
const emit = defineEmits(['select', 'check']);

const p = computed(() => PRIORITY_META[props.ticket.priority] || {});
const s = computed(() => STATUS_META[props.ticket.status] || {});

function slaBadgeStyle(ticket) {
  if (ticket.sla_remaining < 0)
    return { color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.15)', label:'BREACHED' };
  if (ticket.sla_remaining <= ticket.sla_hours * 0.25)
    return { color:'var(--zg-warn)', bg:'oklch(0.82 0.15 75 / 0.12)', label:`${ticket.sla_remaining}h left` };
  return { color:'var(--zg-good)', bg:'oklch(0.78 0.15 150 / 0.1)', label:`${ticket.sla_remaining}h left` };
}
const sla = computed(() => slaBadgeStyle(props.ticket));
</script>

<template>
  <div class="tkt-row-wrap" :class="{ 'is-active': active }">
    <input type="checkbox" style="margin-top:14px;accent-color:var(--zg-accent);flex-shrink:0;cursor:pointer;" @change.stop="emit('check', ticket.id)" />
    <button class="tkt-row" @click="emit('select', ticket)">
      <!-- ID + priority + status -->
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
        <span style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);flex-shrink:0;">{{ ticket.id }}</span>
        <span class="tkt-badge" :style="{ background: p.color+'22', color: p.color }">{{ p.label }}</span>
        <span class="tkt-badge" style="margin-left:auto;background:var(--zg-panel-hi);" :style="{ color: s.color }">{{ s.label }}</span>
      </div>
      <!-- Subject -->
      <div style="font-size:12.5px;font-weight:600;color:var(--zg-text);line-height:1.35;margin-bottom:4px;">{{ ticket.subject }}</div>
      <!-- Cat + entity + SLA -->
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <span style="font-size:10.5px;font-weight:600;" :style="{ color: CAT_COLORS[ticket.cat] || 'var(--zg-text-dim)' }">{{ ticket.cat }}</span>
        <span style="font-size:10.5px;color:var(--zg-text-dim);">·</span>
        <span style="font-size:10.5px;color:var(--zg-text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px;">{{ ticket.entity }}</span>
        <span class="tkt-sla" :style="{ color: sla.color, background: sla.bg }" style="margin-left:auto;flex-shrink:0;">{{ sla.label }}</span>
      </div>
    </button>
  </div>
</template>

<style scoped>
.tkt-row-wrap { display:flex;align-items:flex-start;gap:6px;padding:2px 6px 2px 10px;border-bottom:1px solid var(--zg-line);transition:background .1s; }
.tkt-row-wrap.is-active { background:var(--zg-panel-hi); }
.tkt-row-wrap:hover { background:var(--zg-panel-hi); }
.tkt-row { flex:1;border:none;text-align:left;background:transparent;cursor:pointer;padding:8px 10px 8px 4px;width:100%; }
.tkt-badge { height:16px;padding:0 5px;border-radius:2px;font-size:9.5px;font-weight:700;display:inline-flex;align-items:center; }
.tkt-sla { font-size:10px;padding:2px 6px;border-radius:2px;font-weight:700;font-family:var(--zg-mono); }
</style>
