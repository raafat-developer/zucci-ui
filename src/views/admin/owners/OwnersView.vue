<script setup>
import { ref, computed } from 'vue';
// import { ZC_ENTITIES } from '@/data/ownersData';
import EntityDetail from './EntityDetail.vue';

// const entities = ref([...ZC_ENTITIES]);
const selectedId = ref(entities.value[0]?.id);
const query      = ref('');

const selected = computed(() => entities.value.find(e => e.id === selectedId.value) || entities.value[0]);

const filtered = computed(() => {
  const q = query.value.toLowerCase();
  return q ? entities.value.filter(e => e.name.toLowerCase().includes(q) || e.id.includes(q)) : entities.value;
});

const groups = computed(() => {
  const map = {};
  filtered.value.forEach(e => {
    const ch = e.name[0].toUpperCase();
    const key = /[0-9]/.test(ch) ? '#' : ch;
    if (!map[key]) map[key] = [];
    map[key].push(e);
  });
  return Object.entries(map).sort(([a],[b]) => a === '#' ? -1 : b === '#' ? 1 : a.localeCompare(b));
});
</script>

<template>
  <div class="zen-wrap">
    <!-- Left list -->
    <div class="zen-list">
      <div class="zen-list-search">
        <svg viewBox="0 0 16 16" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4"/><line x1="10" y1="10" x2="14" y2="14"/></svg>
        <input v-model="query" placeholder="Search" />
        <button class="zen-filter-btn" title="Filter">
          <svg viewBox="0 0 16 16" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="2" y1="4" x2="14" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="6" y1="12" x2="10" y2="12"/></svg>
        </button>
      </div>
      <div class="zen-list-scroll">
        <div v-for="[letter, ents] in groups" :key="letter">
          <div class="zen-list-group">{{ letter }}</div>
          <button v-for="e in ents" :key="e.id"
            class="zen-list-row" :class="{ 'is-active': e.id === selectedId }"
            @click="selectedId = e.id">
            <div class="zen-list-row-name">{{ e.name }}</div>
            <div class="zen-list-row-meta">#{{ e.id }} · {{ e.brands?.length || 0 }} brand{{ (e.brands?.length||0) !== 1 ? 's' : '' }}</div>
          </button>
        </div>
        <div v-if="groups.length === 0" style="padding:16px 12px;font-size:12px;color:var(--zg-text-dim);">No results</div>
      </div>
    </div>

    <!-- Detail -->
    <EntityDetail v-if="selected" :entity="selected" />
  </div>
</template>
