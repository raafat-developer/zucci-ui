<script setup>
/**
 * ActivityLogDrawer — size-chart activity timeline. Faithful port of
 * ActivityLogDrawer from zucci-size-guides.jsx.
 */
import { computed } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import { ZC_SIZE_TYPES } from '@/data/sizeGuidesData';

const props = defineProps({ open: { type: Boolean, default: false }, chart: { type: Object, default: null } });
defineEmits(['close']);

function ago(iso) {
  if (!iso) return '—';
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.floor(m / 60)}h ago` : `${Math.floor(m / 1440)}d ago`;
}

const activity = computed(() => {
  if (!props.chart) return [];
  const c = props.chart;
  return [
    { actor: c.approved_by || 'Ops Admin', action: 'Approved size chart', at: c.approved_at || c.uploaded_at, note: 'Chart meets Zucci standards. Activated for storefront display.' },
    { actor: c.uploaded_by, action: 'Uploaded size chart', at: c.uploaded_at, note: `Size type: ${(ZC_SIZE_TYPES || {})[c.size_type]?.label || c.size_type} · ${c.rows?.length || 0} size rows` },
  ].filter((a) => a.at);
});
</script>

<template>
  <ZDrawer :open="open" title="Activity Log" :subtitle="chart?.name || ''" :width="420" @close="$emit('close')">
    <div style="display:flex;flex-direction:column">
      <div v-for="(a, i) in activity" :key="i" style="display:flex;gap:12px;padding-bottom:20px;position:relative">
        <div style="position:relative;flex-shrink:0">
          <div style="width:28px;height:28px;border-radius:50%;background:var(--zg-accent-tint);border:1px solid var(--zg-accent);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--zg-accent);z-index:1">{{ a.actor.charAt(0).toUpperCase() }}</div>
          <div v-if="i < activity.length - 1" style="position:absolute;left:13px;top:28px;width:2px;height:calc(100% - 4px);background:var(--zg-line)" />
        </div>
        <div style="flex:1;padding-top:4px">
          <div style="font-size:12.5px;font-weight:600;color:var(--zg-text)">{{ a.action }}</div>
          <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px">{{ a.actor }} · {{ ago(a.at) }}</div>
          <div v-if="a.note" style="font-size:12px;color:var(--zg-text-mid);margin-top:6px;padding:8px 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-sm);line-height:1.4">{{ a.note }}</div>
        </div>
      </div>
      <div v-if="!activity.length" style="font-size:12px;color:var(--zg-text-dim)">No activity recorded yet.</div>
    </div>
  </ZDrawer>
</template>
