<script setup>
/**
 * CommsView — Notifications & Comms module shell.
 * 5 tabs: Templates · Campaigns · Audiences · A/B Tests · Delivery Log
 */
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { CAMPAIGNS } from '@/data/commsData';
import TemplatesTab  from './tabs/TemplatesTab.vue';
import CampaignsTab  from './tabs/CampaignsTab.vue';
import AudiencesTab  from './tabs/AudiencesTab.vue';
import ABTestsTab    from './tabs/ABTestsTab.vue';
import DeliveryLogTab from './tabs/DeliveryLogTab.vue';

const route = useRoute();
const tab = ref(route.query.tab || 'templates');
watch(() => route.query.tab, t => { if (t) tab.value = t; });

const TABS = [
  ['templates', 'Templates'],
  ['campaigns', 'Campaigns'],
  ['audiences', 'Audiences'],
  ['ab',        'A/B Tests'],
  ['log',       'Delivery Log'],
];

const activeCampaigns = computed(() =>
  CAMPAIGNS.filter(c => c.status === 'running' || c.status === 'scheduled').length
);

const kpis = [
  { lbl:'Sent Today',        val:'142,810', cls:'is-accent', sub:'all channels' },
  { lbl:'Open Rate',         val:'38.4%',   cls:'is-good',   sub:'last 30d' },
  { lbl:'Click Rate',        val:'14.8%',   cls:'is-good',   sub:'last 30d' },
  { lbl:'Unsubscribes',      val:'0.3%',    cls:'',          sub:'last 30d' },
];
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;min-height:0;">
    <!-- Header -->
    <div class="zwh-header" style="flex-shrink:0;">
      <div class="zwh-header-left">
        <div style="font-size:16px;font-weight:700;color:var(--zg-text);">Notifications &amp; Comms</div>
        <div class="zwh-subtitle">Email · SMS / WhatsApp · Push · In-App — all channels in one place</div>
      </div>
    </div>

    <!-- KPI strip -->
    <div class="zwh-kpi-strip" style="flex-shrink:0;">
      <div v-for="k in kpis" :key="k.lbl" class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">{{ k.lbl }}</span>
        <span class="zwh-kpi-val" :class="k.cls">{{ k.val }}</span>
        <span class="zwh-kpi-sub" v-if="k.sub">{{ k.sub }}</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Active Campaigns</span>
        <span class="zwh-kpi-val is-accent">{{ activeCampaigns }}</span>
        <span class="zwh-kpi-sub">running + scheduled</span>
      </div>
    </div>

    <!-- Tabs -->
    <div style="display:flex;border-bottom:1px solid var(--zg-line);background:var(--zg-bg-elev);flex-shrink:0;padding:0 20px;overflow-x:auto;scrollbar-width:none;">
      <button v-for="[v,l] in TABS" :key="v"
        style="height:40px;padding:0 14px;border:none;background:transparent;font-family:inherit;font-size:12.5px;cursor:pointer;white-space:nowrap;"
        :style="{ color: tab===v?'var(--zg-accent)':'var(--zg-text-dim)', borderBottom: tab===v?'2px solid var(--zg-accent)':'2px solid transparent', marginBottom:'-1px', fontWeight: tab===v?600:400 }"
        @click="tab = v">{{ l }}</button>
    </div>

    <!-- Tab content -->
    <div style="flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;">
      <TemplatesTab   v-if="tab === 'templates'" />
      <CampaignsTab   v-else-if="tab === 'campaigns'" />
      <AudiencesTab   v-else-if="tab === 'audiences'" />
      <ABTestsTab     v-else-if="tab === 'ab'" />
      <DeliveryLogTab v-else-if="tab === 'log'" />
    </div>
  </div>
</template>

<style scoped>
.zwh-header { display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--zg-line);flex-wrap:wrap;gap:8px; }
.zwh-header-left { display:flex;flex-direction:column;gap:2px; }
.zwh-subtitle { font-size:11.5px;color:var(--zg-text-dim); }
.zwh-kpi-strip { display:flex;align-items:stretch;border-bottom:1px solid var(--zg-line);background:var(--zg-panel); }
.zwh-kpi-cell { flex:1;padding:8px 16px;border-right:1px solid var(--zg-line);display:flex;flex-direction:column;gap:2px;min-width:0; }
.zwh-kpi-cell:last-child { border-right:none; }
.zwh-kpi-lbl { font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600; }
.zwh-kpi-val { font-family:var(--zg-mono);font-size:18px;font-weight:800;color:var(--zg-text); }
.zwh-kpi-val.is-accent { color:var(--zg-accent); }
.zwh-kpi-val.is-good { color:var(--zg-good); }
.zwh-kpi-sub { font-size:10px;color:var(--zg-text-dim); }
</style>
