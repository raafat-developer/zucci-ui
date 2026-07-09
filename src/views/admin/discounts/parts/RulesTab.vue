<script setup>
/**
 * RulesTab — stacking priority, market rules, exclusion list. Faithful port
 * of RulesTab from zucci-discounts.jsx.
 */
import { computed } from 'vue';
import { ZCD_RULES, MARKET_CUR } from '@/data/discountsData';
import { MKT_FLAGS, MKT_NAMES } from '@/data/discountsShared';
import { toast } from '@/composables/useToast';

const props = defineProps({ market: { type: String, required: true } });
const rules = ZCD_RULES;
const mktRule = computed(() => rules.markets[props.market] || {});
const cur = computed(() => MARKET_CUR[props.market] || 'AED');
</script>

<template>
  <div class="zcd-tab-body">
    <div class="zf-section-title">{{ MKT_FLAGS[market] }} {{ MKT_NAMES[market] }} · Discount Rules &amp; Limits</div>

    <div class="zen-card" style="padding:14px">
      <div class="zen-card-head"><span class="zen-card-title">Stacking Priority</span><button class="zen-doc-request-btn" @click="toast.info('Drag to reorder stacking priority rules')">Edit</button></div>
      <div v-for="r in rules.stackingPriority" :key="r.rank" class="zcd-priority-row">
        <div class="zcd-priority-rank">{{ r.rank }}</div>
        <div><div style="font-size:12.5px;font-weight:500;color:var(--zg-text)">{{ r.label }}</div><div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px">{{ r.note }}</div></div>
      </div>
    </div>

    <div class="zen-card" style="padding:14px">
      <div class="zen-card-head"><span class="zen-card-title">Market-Specific Rules · {{ MKT_NAMES[market] }}</span></div>
      <div class="zen-bank-fields">
        <div class="zen-bank-field"><div class="zen-field-label">Max Discount Cap</div><div class="zen-field-val" style="font-family:var(--zg-mono);font-weight:700;color:var(--zg-accent);font-size:16px">{{ rules.maxDiscountCap[market] }}%</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Max Stacking Count</div><div class="zen-field-val">{{ rules.maxStackCount }} promotions per order</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Code + Campaign Combine</div><div class="zen-field-val">{{ rules.codeCombineRule === 'no_combine' ? 'Not allowed — exclusive' : 'Allowed' }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Vendor Max Discount</div><div class="zen-field-val">{{ mktRule.vendorMaxDiscount }}%</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Min Order — Fixed</div><div class="zen-field-val">{{ cur }} {{ mktRule.minOrderValues?.fixed || 0 }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Min Order — Free Shipping</div><div class="zen-field-val">{{ cur }} {{ mktRule.minOrderValues?.free_shipping || 0 }}</div></div>
        <div v-if="mktRule.requiresLegalReview" class="zen-bank-field" style="grid-column:1/-1"><div class="zen-field-label">Legal Note</div><div class="zen-field-val" style="color:var(--zg-warn);font-size:12px">{{ mktRule.legalNote }}</div></div>
      </div>
    </div>

    <div class="zen-card" style="padding:14px">
      <div class="zen-card-head"><span class="zen-card-title">Exclusion List</span><button class="zen-doc-request-btn" @click="toast.info('Add excluded product or category')">+ Add</button></div>
      <div v-for="e in rules.exclusions" :key="e.id" class="zen-pd-simple-row">
        <span class="zen-brand-cat-tag">{{ e.type }}</span>
        <span style="font-weight:500;font-size:12.5px">{{ e.value }}</span>
        <span style="font-size:11.5px;color:var(--zg-text-dim);flex:1">{{ e.reason }}</span>
        <button class="zen-act-btn-sm zen-act-btn-sm--danger" @click="toast('Exclusion removed')"><svg viewBox="0 0 12 12" width="10" fill="none" stroke="var(--zg-danger)" stroke-width="1.5" stroke-linecap="round"><line x1="2" y1="6" x2="10" y2="6" /></svg></button>
      </div>
    </div>
  </div>
</template>
