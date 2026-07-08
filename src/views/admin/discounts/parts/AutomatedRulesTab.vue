<script setup>
/**
 * AutomatedRulesTab — faithful port of AutomatedRulesTab from
 * zucci-discounts-extra.jsx: warehouse-aging info box, expandable rule
 * cards with trigger timelines and stats.
 */
import { ref, computed } from 'vue';
import StatusBadge from './StatusBadge.vue';
import FundingTag from './FundingTag.vue';
import { ZCD_AUTO_RULES, MARKET_CUR } from '@/data/discountsData';
import { toast } from '@/composables/useToast';

const props = defineProps({ market: { type: String, required: true } });
const rules = computed(() => (ZCD_AUTO_RULES || []).filter((r) => !r.markets || r.markets.includes(props.market)));
const expanded = ref(rules.value[0]?.id || null);
const cur = computed(() => MARKET_CUR[props.market] || 'AED');

const TYPE_META = {
  warehouse_aging:{ label:'Warehouse Aging', color:'var(--zg-danger)', desc:'Auto-discounts returned items sitting in non-origin warehouse', icon:'🏚' },
  seasonal_clearance:{ label:'Seasonal Clearance', color:'var(--zg-warn)', desc:'Discounts unsold seasonal stock after season end', icon:'📦' },
  low_stock:{ label:'Low Stock Urgency', color:'oklch(0.82 0.14 215)', desc:'Creates urgency signals and discounts for near-zero stock', icon:'⚡' },
};
const meta = (t) => TYPE_META[t] || TYPE_META.warehouse_aging;
const storageCostLabel = computed(() => (cur.value === 'AED' ? 'AED 2.50' : cur.value === 'EGP' ? 'EGP 15' : 'SAR 3.00'));
</script>

<template>
  <div class="zcd-tab-body">
    <div class="zf-section-title" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0">
      <span>Automated Rules · {{ market }}</span>
      <button class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="toast.info('New automated rule')">+ New Rule</button>
    </div>

    <div class="zf-alert" style="background:oklch(0.70 0.18 25 / 0.06);border-color:oklch(0.70 0.18 25 / 0.25);color:var(--zg-text-mid)">
      <svg viewBox="0 0 14 14" width="13" fill="none" stroke="var(--zg-danger)" stroke-width="1.5" stroke-linecap="round"><path d="M7 2L13 12H1L7 2Z" /><line x1="7" y1="6" x2="7" y2="8.5" /><circle cx="7" cy="10.5" r="0.5" fill="var(--zg-danger)" /></svg>
      <div><strong>Cross-border return logic:</strong> When a customer in {{ market }} returns an item originating from another country, it stays in the {{ market }} warehouse — returning it would cost more than the item's value. Zucci incurs a daily storage cost of {{ storageCostLabel }}/day. The warehouse aging rule auto-discounts these items to sell them faster.</div>
    </div>

    <div v-for="rule in rules" :key="rule.id" class="zcd-auto-rule-card">
      <div class="zcd-auto-rule-head" @click="expanded = expanded === rule.id ? null : rule.id">
        <div class="zcd-auto-rule-icon" :style="{ background: meta(rule.type).color + '1a', borderColor: meta(rule.type).color + '40', color: meta(rule.type).color }">{{ meta(rule.type).icon }}</div>
        <div style="flex:1;min-width:0">
          <div class="zcd-promo-name">{{ rule.name }}</div>
          <div class="zcd-promo-meta" style="margin-top:3px">
            <span class="zen-brand-cat-tag" :style="{ color: meta(rule.type).color, background: meta(rule.type).color + '1a' }">{{ meta(rule.type).label }}</span>
            <span class="zen-pd-ref">{{ meta(rule.type).desc }}</span>
            <span v-if="rule.activeItems > 0" style="color:var(--zg-warn);font-family:var(--zg-mono);font-size:10.5px">{{ rule.activeItems }} items currently affected</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
          <FundingTag :model="rule.fundedBy" />
          <StatusBadge :status="rule.status" />
          <svg viewBox="0 0 10 6" width="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" :style="{ transform: expanded === rule.id ? 'rotate(180deg)' : 'none', transition:'transform .2s' }"><path d="M1 1L5 5L9 1" /></svg>
        </div>
      </div>

      <div v-if="expanded === rule.id" class="zcd-auto-rule-body">
        <div class="zf-section-title" style="margin-bottom:8px">Discount Trigger Timeline</div>
        <div class="zcd-trigger-timeline">
          <div v-for="(t, i) in (rule.triggers || [])" :key="i" class="zcd-trigger-step">
            <div class="zcd-trigger-badge">{{ t.days ? `Day ${t.days}` : t.threshold ? `≤${t.threshold} units` : '—' }}</div>
            <div class="zcd-trigger-arrow">→</div>
            <div class="zcd-trigger-action">
              <span v-if="t.discountPct != null" style="font-family:var(--zg-mono);font-size:13px;font-weight:700;color:var(--zg-accent)">{{ t.discountPct }}% off</span>
              <span v-else style="color:var(--zg-warn);font-size:12px">Ops Review Required</span>
            </div>
            <div class="zcd-trigger-note">{{ t.note }}</div>
            <button class="zen-act-btn-sm" title="Edit" @click="toast.info('Edit trigger')"><svg viewBox="0 0 14 14" width="10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M9.5 1.5L12.5 4.5L5 12H2V9L9.5 1.5Z" /></svg></button>
          </div>
          <button class="zcd-trigger-add" @click="toast.info('Add trigger step')">+ Add Step</button>
        </div>

        <div class="zf-kpi-strip" style="margin:8px 0 0">
          <div v-if="rule.activeItems != null" class="zf-kpi-cell"><div class="zf-kpi-lbl">Active Items</div><div class="zf-kpi-val is-warn">{{ rule.activeItems }}</div></div>
          <div v-if="rule.totalStorageCostToDate > 0" class="zf-kpi-cell"><div class="zf-kpi-lbl">Storage Cost to Date</div><div class="zf-kpi-val is-neg">AED {{ rule.totalStorageCostToDate.toLocaleString() }}</div></div>
          <div v-if="rule.dailyStorageCostAed" class="zf-kpi-cell"><div class="zf-kpi-lbl">Daily Cost / Item</div><div class="zf-kpi-val">AED {{ rule.dailyStorageCostAed }}</div></div>
          <div v-if="rule.notifyVendorAt" class="zf-kpi-cell"><div class="zf-kpi-lbl">Vendor Notified At</div><div class="zf-kpi-val">Day {{ rule.notifyVendorAt }}</div></div>
        </div>

        <div v-if="rule.notes" class="zcd-notes-strip" style="margin-top:8px">{{ rule.notes }}</div>

        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="toast.info('Viewing affected items…')">View {{ rule.activeItems || 0 }} Affected Items</button>
          <button class="zen-btn-ghost" style="height:28px;font-size:11.5px" @click="toast.info('Edit rule')">Edit Rule</button>
          <button class="zen-btn-ghost" style="height:28px;font-size:11.5px;color:var(--zg-danger)" @click="toast.warn('Rule paused')">Pause</button>
        </div>
      </div>
    </div>
  </div>
</template>
