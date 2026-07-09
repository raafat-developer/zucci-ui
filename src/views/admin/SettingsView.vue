<script setup>
/**
 * SettingsView — Global Settings shell with sidebar nav + section routing.
 * Splits into 11 section components under settings/sections/.
 * Uses the real .zset-* CSS (from styles-zucci-settings.css globally imported).
 */
import { ref } from 'vue';
import CompanySection  from './settings/sections/CompanySection.vue';
import MarketsSection  from './settings/sections/MarketsSection.vue';
import ReturnsSection  from './settings/sections/ReturnsSection.vue';
import AccessSection   from './settings/sections/AccessSection.vue';
import RolesSection    from './settings/sections/RolesSection.vue';
import TiersSection    from './settings/sections/TiersSection.vue';
import GatewaysSection from './settings/sections/GatewaysSection.vue';
import ShippingSection from './settings/sections/ShippingSection.vue';
import TaxSection      from './settings/sections/TaxSection.vue';
import BrandingSection from './settings/sections/BrandingSection.vue';
import APISection      from './settings/sections/APISection.vue';
import AuditSection    from './settings/sections/AuditSection.vue';
import FlagsSection    from './settings/sections/FlagsSection.vue';

const sec = ref('company');

const GROUPS = [
  { group:'Company', sections:[
    { id:'company',  label:'Company Info',       icon:'building' },
    { id:'branding', label:'Appearance',         icon:'palette'  },
  ]},
  { group:'Markets & Regions', sections:[
    { id:'markets',  label:'Markets',            icon:'globe'    },
    { id:'returns',  label:'Return Policies',    icon:'undo'     },
    { id:'tax',      label:'Tax & VAT',          icon:'percent'  },
    { id:'flags',    label:'Feature Flags',      icon:'flag'     },
  ]},
  { group:'Team & Access', sections:[
    { id:'access',   label:'Access Management',   icon:'shield' },
    { id:'roles',    label:'Roles & Permissions', icon:'shield', indent:true },
    { id:'tiers',    label:'Tiers Management',    icon:'tier'   },
  ]},
  { group:'Payments & Shipping', sections:[
    { id:'gateways', label:'Payment Gateways',   icon:'card'     },
    { id:'shipping', label:'Shipping Providers', icon:'truck'    },
  ]},
  { group:'Developer', sections:[
    { id:'api',      label:'API & Webhooks',     icon:'plug'     },
    { id:'audit',    label:'Audit Log',          icon:'log'      },
  ]},
];

const ICONS = {
  building:"M3 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 21v-6h6v6M3 21h18M9 9h2M13 9h2",
  palette: "M8 2a6 6 0 100 12c.5 0 2-.5 2-2 0-.7-.3-1-.3-1.5A1.5 1.5 0 0111.2 9a1.5 1.5 0 011.5 1.5A1.5 1.5 0 0114 12a4 4 0 01-6 3.5",
  globe:   "M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c-2.7 4-2.7 16 0 20m0-20c2.7 4 2.7 16 0 20M2 12h20",
  undo:    "M3 7V3H7M3 7a6 6 0 100 2",
  percent: "M19 5L5 19M6.5 6.5h.01M17.5 17.5h.01",
  flag:    "M3 2v12M3 2h8l-2 4 2 4H3",
  shield:  "M12 2L3 7v5c0 5 4 9 9 10 5-1 9-5 9-10V7z",
  card:    "M1 7h22v12H1zM1 11h22",
  truck:   "M1 5h11v11H1zM12 8h3l2.5 3v5h-5.5V8zM4 16a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM14.5 16a1.5 1.5 0 100 3 1.5 1.5 0 000-3z",
  plug:    "M7 1v4M17 1v4M5 5h14v3a7 7 0 01-14 0V5zM12 15v4",
  tier:    "M12 2l3 6 7 1-5.5 5 1.5 7L12 18l-6 3 1.5-7L2 9l7-1z",
};
</script>

<template>
  <div class="zset-wrap">
    <!-- Sidebar nav -->
    <nav class="zset-nav">
      <div v-for="grp in GROUPS" :key="grp.group" class="zset-nav-group">
        <div class="zset-nav-group-label">{{ grp.group }}</div>
        <button v-for="s in grp.sections" :key="s.id"
          class="zset-nav-btn" :class="{ 'is-active': sec === s.id, 'is-indent': s.indent }"
          @click="sec = s.id">
          <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="ICONS[s.icon] || ICONS.log" />
          </svg>
          {{ s.label }}
        </button>
      </div>
    </nav>

    <!-- Content area -->
    <div class="zset-body">
      <CompanySection  v-if="sec === 'company'" />
      <BrandingSection v-else-if="sec === 'branding'" />
      <MarketsSection  v-else-if="sec === 'markets'" />
      <ReturnsSection  v-else-if="sec === 'returns'" />
      <TaxSection      v-else-if="sec === 'tax'" />
      <FlagsSection    v-else-if="sec === 'flags'" />
      <AccessSection   v-if="sec === 'access'" />
      <RolesSection    v-else-if="sec === 'roles'" />
      <TiersSection    v-else-if="sec === 'tiers'" />
      <GatewaysSection v-else-if="sec === 'gateways'" />
      <ShippingSection v-else-if="sec === 'shipping'" />
      <APISection      v-else-if="sec === 'api'" />
      <AuditSection    v-else-if="sec === 'audit'" />
    </div>
  </div>
</template>

<style scoped>
.zset-wrap { display:flex;height:100%;min-height:0;width:100%; }

/* Sidebar */
.zset-nav { width:220px;flex-shrink:0;border-right:1px solid var(--zg-line);background:var(--zg-bg-elev);overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;padding:8px 0;height:100%;box-sizing:border-box; }
.zset-nav-group { margin-bottom:4px; }
.zset-nav-group-label { padding:8px 16px 4px;font-size:9px;text-transform:uppercase;letter-spacing:.09em;color:var(--zg-text-dim);font-weight:700; }
.zset-nav-btn { width:100%;height:34px;padding:0 16px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:inherit;font-size:12px;color:var(--zg-text-dim);text-align:left;transition:all .1s; }
.zset-nav-btn:hover { background:var(--zg-panel);color:var(--zg-text-mid); }
.zset-nav-btn.is-indent { padding-left:28px;font-size:11.5px;color:var(--zg-text-dim); }

/* Content */
.zset-body { flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;min-width:0; }

/* Shared section styles (inherited by section components) */
:deep(.zset-content) { padding:20px 24px;max-width:100%; }
:deep(.zset-content-head) { display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap; }
:deep(.zset-content-title) { font-size:18px;font-weight:700;color:var(--zg-text);margin-bottom:4px; }
:deep(.zset-content-sub) { font-size:12px;color:var(--zg-text-dim); }
:deep(.sf-grid) { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
:deep(.btn-primary) { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer;flex-shrink:0; }
:deep(.btn-ghost) { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
</style>
