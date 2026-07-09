<script setup>
/**
 * CampaignsTab — seasonal campaigns list + detail. Faithful port of
 * CampaignsTab from zucci-discounts.jsx.
 */
import { ref, computed } from 'vue';
import StatusBadge from './StatusBadge.vue';
import { ZCD_CAMPAIGNS, MARKET_CUR } from '@/data/discountsData';
import { MKT_FLAGS, MKT_NAMES, FUNDING_LABELS } from '@/data/discountsShared';
import { toast } from '@/composables/useToast';

const props = defineProps({ market: { type: String, required: true } });
const campaigns = computed(() => ZCD_CAMPAIGNS.filter((c) => c.markets[props.market]));
const selected = ref(campaigns.value[0]?.id || null);
const sel = computed(() => campaigns.value.find((c) => c.id === selected.value));
const cur = computed(() => MARKET_CUR[props.market] || 'AED');
const mktData = computed(() => sel.value?.markets[props.market] || {});
</script>

<template>
  <div style="display:flex;flex-direction:row;flex:1;min-height:0;height:100%;overflow:hidden">
    <div class="zcd-campaign-list">
      <div class="zcd-list-header"><span style="font-size:12.5px;font-weight:600;color:var(--zg-text)">Campaigns</span><button class="zen-btn-primary" style="height:26px;font-size:11px" @click="toast.success('Campaign creation form — set name, dates, brands, and budget')">+ New</button></div>
      <button v-for="c in campaigns" :key="c.id" class="zcd-campaign-item" :class="{ 'is-active': selected === c.id }" @click="selected = c.id">
        <div class="zcd-campaign-icon">{{ c.icon }}</div>
        <div style="flex:1;min-width:0"><div class="zcd-promo-name" style="font-size:12px">{{ c.name }}</div><StatusBadge :status="c.status" /></div>
      </button>
      <div v-if="!campaigns.length" class="zcd-empty" style="padding:12px 14px">No campaigns for {{ MKT_NAMES[market] }}.</div>
    </div>

    <div v-if="sel" class="zcd-campaign-detail">
      <div class="zcd-campaign-detail-head">
        <div class="zcd-campaign-icon" style="width:40px;height:40px;font-size:20px">{{ sel.icon }}</div>
        <div><div style="font-size:15px;font-weight:600;color:var(--zg-text)">{{ sel.name }}</div><div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px">{{ MKT_FLAGS[market] }} {{ MKT_NAMES[market] }} · {{ mktData.start }} → {{ mktData.end }} ({{ mktData.tz }})</div></div>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center"><StatusBadge :status="mktData.status || sel.status" /><button class="zen-doc-card-btn" @click="toast.info('Edit campaign')">Edit</button></div>
      </div>

      <div class="zf-kpi-strip" style="margin:0 0 4px">
        <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Default Discount</div><div class="zf-kpi-val is-accent">{{ sel.defaultDiscount }}%</div></div>
        <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Funding Model</div><div class="zf-kpi-val" style="font-size:12px">{{ FUNDING_LABELS[sel.fundingModel] || sel.fundingModel }}</div></div>
        <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Total Budget ({{ cur }})</div><div class="zf-kpi-val">{{ (sel.totalBudget[market] || 0).toLocaleString() }}</div></div>
        <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Participating Brands</div><div class="zf-kpi-val">{{ sel.participatingBrands.length }}</div></div>
      </div>

      <div class="zf-section-title">Participating Brands</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <div v-for="b in sel.participatingBrands" :key="b" class="zcd-brand-pill is-in"><svg viewBox="0 0 12 12" width="9" fill="none" stroke="var(--zg-good)" stroke-width="2" stroke-linecap="round"><path d="M2 6L5 9L10 3" /></svg>{{ b }}</div>
      </div>
      <template v-if="sel.optedOutBrands.length">
        <div class="zf-section-title" style="margin-top:8px">Opted Out</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <div v-for="b in sel.optedOutBrands" :key="b" class="zcd-brand-pill is-out"><svg viewBox="0 0 10 10" width="9" fill="none" stroke="var(--zg-danger)" stroke-width="1.5" stroke-linecap="round"><path d="M2 8L8 2 M2 2L8 8" /></svg>{{ b }}</div>
        </div>
      </template>

      <div v-if="sel.notes" class="zcd-notes-strip" style="margin-top:8px">{{ sel.notes }}</div>

      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="toast.success('Campaign published')">{{ sel.status === 'planned' ? 'Publish Campaign' : 'Manage Campaign' }}</button>
        <button class="zen-btn-ghost" style="height:28px;font-size:11.5px" @click="toast.success('Invitation sent to all eligible brands')">Invite Brands</button>
      </div>
    </div>
    <div v-else class="zcd-campaign-detail" style="align-items:center;justify-content:center"><div class="zcd-empty">Select a campaign to view details</div></div>
  </div>
</template>
