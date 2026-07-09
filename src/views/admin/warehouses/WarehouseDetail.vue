<script setup>
/**
 * WarehouseDetail — 9-tab detail shell. Faithful port of React WarehouseDetail.
 * Tabs: Overview · Inventory · Inbound · Outbound · Returns ·
 *       Transfers · Locations · Finance · Settings
 */
import { ref, computed } from 'vue';
import {
  ZCW_TYPE_META, ZCW_STATUS_META, ZCW_ALERTS as SEED_ALERTS,
  ZCW_INBOUND, ZCW_RETURNS, ZCW_TRANSFERS,
} from '@/data/warehouseData';

import OverviewTab   from './tabs/OverviewTab.vue';
import InventoryTab  from './tabs/InventoryTab.vue';
import InboundTab    from './tabs/InboundTab.vue';
import OutboundTab   from './tabs/OutboundTab.vue';
import ReturnsTab    from './tabs/ReturnsTab.vue';
import TransfersTab  from './tabs/TransfersTab.vue';
import LocationsTab  from './tabs/LocationsTab.vue';
import FinanceTab    from './tabs/FinanceTab.vue';
import SettingsTab   from './tabs/SettingsTab.vue';

const props = defineProps({ wh: { type: Object, required: true } });
const emit  = defineEmits(['back']);

const tab = ref('overview');

const typeMeta   = (t) => ZCW_TYPE_META[t] || {};
const statusMeta = (s) => ZCW_STATUS_META[s] || ZCW_STATUS_META.active;

const alerts    = computed(() => SEED_ALERTS.filter(a => a.warehouse_id === props.wh.id));
const danger    = computed(() => alerts.value.filter(a => a.severity === 'danger').length);
const inbound   = computed(() => (ZCW_INBOUND   || []).filter(i => i.warehouse_id === props.wh.id));
const returns   = computed(() => (ZCW_RETURNS   || []).filter(r => r.warehouse_id === props.wh.id));
const transfers = computed(() => (ZCW_TRANSFERS || []).filter(t => t.from_id === props.wh.id || t.to_id === props.wh.id));

const TABS = computed(() => [
  { id:'overview',   label:'Overview' },
  { id:'inventory',  label:'Inventory',  badge: props.wh.stats.total_skus > 0 ? String(props.wh.stats.total_skus) : null, badgeCls:'accent' },
  { id:'inbound',    label:'Inbound',    badge: inbound.value.length > 0 ? String(inbound.value.length) : null, badgeCls: inbound.value.some(i=>i.status==='arrived')?'warn':'accent' },
  { id:'outbound',   label:'Outbound',   badge: props.wh.stats.pending_outbound > 0 ? String(props.wh.stats.pending_outbound) : null, badgeCls:'accent' },
  { id:'returns',    label:'Returns',    badge: returns.value.length > 0 ? String(returns.value.length) : null, badgeCls:'warn' },
  { id:'transfers',  label:'Transfers',  badge: transfers.value.filter(t=>t.status!=='completed').length > 0 ? String(transfers.value.filter(t=>t.status!=='completed').length) : null },
  { id:'locations',  label:'Locations' },
  { id:'finance',    label:'Finance' },
  { id:'settings',   label:'Settings' },
]);
</script>

<template>
  <div class="zwh-detail">
    <!-- Breadcrumb header -->
    <div class="zwh-detail-header">
      <button class="zwh-bc-back" @click="emit('back')">
        <svg viewBox="0 0 10 16" width="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2L2 8L8 14"/></svg>
        Warehouses
      </button>
      <span class="zwh-bc-sep">/</span>
      <span class="zwh-bc-name">{{ wh.flag }} {{ wh.name }}</span>
      <div class="zwh-detail-meta">
        <span v-for="t in wh.types" :key="t" class="zwh-type-badge"
          :style="{ color: typeMeta(t).color, background: typeMeta(t).bg, borderColor: typeMeta(t).border }">
          {{ typeMeta(t).label }}
        </span>
        <span class="zwh-status-pill"
          :style="{ color: statusMeta(wh.status).color, background: statusMeta(wh.status).bg }">
          {{ statusMeta(wh.status).label }}
        </span>
        <span v-if="danger > 0" style="display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--zg-danger);background:oklch(0.70 0.18 25 / 0.1);padding:3px 8px;border-radius:4px;border:1px solid oklch(0.70 0.18 25 / 0.3);">
          <svg viewBox="0 0 12 12" width="10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 1L11 10H1L6 1Z"/><line x1="6" y1="5" x2="6" y2="7.5"/></svg>
          {{ danger }} critical alert{{ danger > 1 ? 's' : '' }}
        </span>
        <button class="zwh-btn-ghost" style="margin-left:8px;" @click="tab = 'settings'">
          <svg viewBox="0 0 14 14" width="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="7" cy="7" r="2.5"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.93 2.93l1.41 1.41M9.66 9.66l1.41 1.41M2.93 11.07l1.41-1.41M9.66 4.34l1.41-1.41"/>
          </svg>
          Settings
        </button>
      </div>
    </div>

    <!-- Tab bar -->
    <div class="zwh-tab-bar">
      <button v-for="t in TABS" :key="t.id"
        class="zwh-tab" :class="{ 'is-active': tab === t.id }"
        @click="tab = t.id">
        {{ t.label }}
        <span v-if="t.badge" class="zwh-tab-badge" :class="t.badgeCls || ''">{{ t.badge }}</span>
      </button>
    </div>

    <!-- Tab content -->
    <div class="zwh-tab-content">
      <OverviewTab   v-if="tab === 'overview'"   :wh="wh" />
      <InventoryTab  v-else-if="tab === 'inventory'"  :wh="wh" />
      <InboundTab    v-else-if="tab === 'inbound'"    :wh="wh" />
      <OutboundTab   v-else-if="tab === 'outbound'"   :wh="wh" />
      <ReturnsTab    v-else-if="tab === 'returns'"    :wh="wh" />
      <TransfersTab  v-else-if="tab === 'transfers'"  :wh="wh" />
      <LocationsTab  v-else-if="tab === 'locations'"  :wh="wh" />
      <FinanceTab    v-else-if="tab === 'finance'"    :wh="wh" />
      <SettingsTab   v-else-if="tab === 'settings'"   :wh="wh" />
    </div>
  </div>
</template>
