<script setup>
import { ref, computed } from 'vue';

const props = defineProps({ buyer: { type: Object, required: true } });
const query = ref('');

const ACT_META = {
  check:  { color:'var(--zg-good)',          bg:'oklch(0.78 0.15 150 / 0.12)' },
  upload: { color:'oklch(0.82 0.14 215)',    bg:'oklch(0.82 0.14 215 / 0.1)' },
  alert:  { color:'var(--zg-danger)',         bg:'oklch(0.70 0.18 25 / 0.1)' },
};
const log = computed(() => {
  const q = query.value.toLowerCase();
  return props.buyer.activityLog.filter(e =>
    !q || e.action.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q)
  );
});
const meta = icon => ACT_META[icon] || ACT_META.check;
</script>

<template>
  <div class="zen-tab-body">
    <div class="zen-actlog-search">
      <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="5.5" cy="5.5" r="3.5"/><line x1="8.5" y1="8.5" x2="12.5" y2="12.5"/></svg>
      <input v-model="query" placeholder="Search activity…" />
      <button v-if="query" class="zen-actlog-clear" @click="query = ''">×</button>
    </div>

    <div class="zen-act-timeline">
      <div v-for="(entry, i) in log" :key="i" class="zen-act-entry">
        <div class="zen-act-entry-left">
          <div class="zen-act-icon-wrap" :style="{ background: meta(entry.icon).bg }">
            <svg viewBox="0 0 12 10" width="10" fill="none" :stroke="meta(entry.icon).color" stroke-width="1.8" stroke-linecap="round">
              <polyline v-if="entry.icon === 'check'" points="1 5 4 8 11 1"/>
              <path v-else-if="entry.icon === 'alert'" d="M6 2L11 10H1L6 2Z"/>
              <path v-else d="M6 8V2 M3 5L6 2L9 5 M1 10h10"/>
            </svg>
          </div>
          <div v-if="i < log.length - 1" class="zen-act-vline" />
        </div>
        <div class="zen-act-entry-body">
          <div class="zen-act-entry-head">
            <span class="zen-act-actor">{{ entry.actor }}</span>
            <span class="zen-act-role" :class="`zen-act-role--${entry.role}`">{{ entry.role.toUpperCase() }}</span>
          </div>
          <div class="zen-act-action">{{ entry.action }}</div>
          <div class="zen-act-time">{{ entry.time }}</div>
        </div>
      </div>
      <div v-if="log.length === 0" class="zen-actlog-empty">
        No activity found.
        <button class="zen-actlog-reset" @click="query = ''">Clear</button>
      </div>
    </div>
  </div>
</template>
