<script setup>
/**
 * CustomersView — Customers (Buyers) module shell.
 * Faithful port of ZucciCustomersModule: stats bar, alphabetical list groups,
 * search, and BuyerDetail panel with all 8 tabs.
 * Composed from: CustomerStatsBar, CustomerListRow, BuyerDetail.
 */
import { ref, computed, onMounted } from 'vue';
import { ZC_BUYERS as SEED } from '@/data/customersData';
import { useCustomersStore } from '@/stores/customers';
import CustomerStatsBar from './CustomerStatsBar.vue';
import CustomerListRow  from './CustomerListRow.vue';
import BuyerDetail      from './BuyerDetail.vue';

const store = useCustomersStore();
onMounted(() => { if (!store.loaded) store.fetchAll(); });

const buyers = computed(() => store.items.length ? store.items : SEED);
const query      = ref('');
const selectedId = ref(SEED[0].id);

const filtered = computed(() => {
  const q = query.value.toLowerCase();
  if (!q) return buyers.value;
  return buyers.value.filter(b =>
    `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
    b.email?.includes(q) || b.id.includes(q)
  );
});

// Alphabetical groups by last name initial
const groups = computed(() => {
  const map = {};
  filtered.value.forEach(b => {
    const ch  = (b.lastName || b.name || '?')[0]?.toUpperCase() || '#';
    const key = /[0-9]/.test(ch) ? '#' : (ch || '#');
    if (!map[key]) map[key] = [];
    map[key].push(b);
  });
  return Object.entries(map).sort(([a],[b]) =>
    a === '#' ? -1 : b === '#' ? 1 : a.localeCompare(b)
  );
});

const selected = computed(() =>
  buyers.value.find(b => b.id === selectedId.value) || buyers.value[0]
);
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;width:100%;min-height:0;overflow:hidden;">
    <!-- Collapsible stats bar -->
    <CustomerStatsBar />

    <!-- Two-column layout: list + detail -->
    <div class="zen-wrap" style="flex:1;min-height:0;">
      <!-- Left: search + alphabetical list -->
      <div class="zen-list">
        <div class="zen-list-search">
          <svg viewBox="0 0 16 16" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="6.5" cy="6.5" r="4"/><line x1="10" y1="10" x2="14" y2="14"/>
          </svg>
          <input v-model="query" placeholder="Search customers…" />
          <button class="zen-filter-btn" title="Filter">
            <svg viewBox="0 0 16 16" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <line x1="2" y1="4" x2="14" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="6" y1="12" x2="10" y2="12"/>
            </svg>
          </button>
        </div>

        <div class="zen-list-scroll">
          <template v-for="[letter, group] in groups" :key="letter">
            <div class="zen-list-group">{{ letter }}</div>
            <CustomerListRow
              v-for="b in group" :key="b.id"
              :buyer="b"
              :active="b.id === selectedId"
              @click="selectedId = b.id"
            />
          </template>
          <div v-if="groups.length === 0" style="padding:16px 12px;font-size:12px;color:var(--zg-text-dim);">
            No results
          </div>
        </div>
      </div>

      <!-- Right: buyer detail panel -->
      <div class="zen-detail-wrap" style="flex:1;overflow:hidden;display:flex;flex-direction:column;">
        <BuyerDetail v-if="selected" :buyer="selected" :key="selected.id" />
      </div>
    </div>
  </div>
</template>
