<script setup>
/**
 * InfluencerTab — Influencer & UGC management. Faithful (consolidated) port
 * of zucci-influencers.jsx: list with status/tier filters, and an 80vw detail
 * drawer with 10 tabs (Profile, Contact & KYC, Banking, Networks, Performance,
 * Posts, Codes & Links, Contracts, Agreement, Payouts).
 * Note: the original's dedicated searchable-dropdown/date field components
 * (SDropField/DateField from zucci-inf-fields.jsx, not available) are
 * represented here as plain labeled inputs — same data, simpler control.
 */
import { ref, computed, watch } from 'vue';
import ZDrawer from '@/components/ui/ZDrawer.vue';
import SDropField from '@/components/ui/SDropField.vue';
import DateField  from '@/components/ui/DateField.vue';
import { ZCD_INFLUENCERS, MARKET_CUR } from '@/data/discountsData';
import { toast } from '@/composables/useToast';

const INF_NATIONALITIES = ['🇦🇫 Afghan','🇦🇱 Albanian','🇩🇿 Algerian','🇺🇸 American','🇦🇷 Argentinian','🇦🇺 Australian','🇦🇹 Austrian','🇧🇭 Bahraini','🇧🇩 Bangladeshi','🇧🇪 Belgian','🇧🇷 Brazilian','🇬🇧 British','🇨🇦 Canadian','🇨🇱 Chilean','🇨🇳 Chinese','🇨🇴 Colombian','🇩🇰 Danish','🇳🇱 Dutch','🇪🇬 Egyptian','🇦🇪 Emirati','🇫🇷 French','🇩🇪 German','🇬🇭 Ghanaian','🇬🇷 Greek','🇮🇳 Indian','🇮🇩 Indonesian','🇮🇷 Iranian','🇮🇶 Iraqi','🇮🇹 Italian','🇯🇵 Japanese','🇯🇴 Jordanian','🇰🇪 Kenyan','🇰🇷 Korean','🇰🇼 Kuwaiti','🇱🇧 Lebanese','🇱🇾 Libyan','🇲🇾 Malaysian','🇲🇦 Moroccan','🇳🇬 Nigerian','🇳🇴 Norwegian','🇴🇲 Omani','🇵🇰 Pakistani','🇵🇸 Palestinian','🇵🇱 Polish','🇵🇹 Portuguese','🇶🇦 Qatari','🇷🇺 Russian','🇸🇦 Saudi','🇸🇬 Singaporean','🇿🇦 South African','🇪🇸 Spanish','🇱🇰 Sri Lankan','🇸🇩 Sudanese','🇸🇪 Swedish','🇨🇭 Swiss','🇸🇾 Syrian','🇹🇼 Taiwanese','🇹🇭 Thai','🇹🇳 Tunisian','🇹🇷 Turkish','🇺🇦 Ukrainian','🇻🇳 Vietnamese','🇾🇪 Yemeni'].sort();
const INF_GENDERS   = ['Female','Male','Non-binary','Prefer not to say'];
const INF_LANGUAGES = ['Arabic','Chinese','English','French','German','Hindi','Indonesian','Italian','Japanese','Korean','Malay','Persian','Portuguese','Russian','Spanish','Turkish','Urdu','Vietnamese'];
const INF_BIZ_TYPES = ['Individual','Sole Proprietor','LLC / Limited Liability Company','Content Creator Agency','Joint Stock Company','Partnership','Other'];

const props = defineProps({ market: { type: String, required: true } });

const PM = { instagram:{label:'Instagram',color:'#E1306C',bg:'rgba(225,48,108,0.1)'}, tiktok:{label:'TikTok',color:'#69C9D0',bg:'rgba(105,201,208,0.1)'}, youtube:{label:'YouTube',color:'#FF0000',bg:'rgba(255,0,0,0.1)'}, snapchat:{label:'Snapchat',color:'#DDB700',bg:'rgba(221,183,0,0.12)'}, x:{label:'X',color:'var(--zg-text)',bg:'var(--zg-panel-hi)'} };
const TIER = { nano:{label:'Nano',range:'1K–10K',color:'var(--zg-good)',bg:'oklch(0.78 0.15 150 / 0.1)'}, micro:{label:'Micro',range:'10K–100K',color:'oklch(0.82 0.14 215)',bg:'oklch(0.82 0.14 215 / 0.1)'}, macro:{label:'Macro',range:'100K–1M',color:'oklch(0.72 0.15 290)',bg:'oklch(0.72 0.15 290 / 0.1)'}, mega:{label:'Mega',range:'1M+',color:'oklch(0.82 0.15 75)',bg:'oklch(0.82 0.15 75 / 0.1)'} };
const ISTATUS = { active:{label:'Active',color:'var(--zg-good)',bg:'oklch(0.78 0.15 150 / 0.1)'}, paused:{label:'Paused',color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.1)'}, pending_contract:{label:'Pending Contract',color:'oklch(0.82 0.14 215)',bg:'oklch(0.82 0.14 215 / 0.1)'}, inactive:{label:'Inactive',color:'var(--zg-text-dim)',bg:'var(--zg-panel-hi)'} };
const CSTATUS = { active:{label:'Active',color:'var(--zg-good)',bg:'oklch(0.78 0.15 150/0.1)'}, completed:{label:'Completed',color:'var(--zg-text-dim)',bg:'var(--zg-panel-hi)'}, draft:{label:'Draft',color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75/0.1)'} };
const DSTATUS = { approved:{color:'var(--zg-good)',label:'Approved'}, pending:{color:'var(--zg-warn)',label:'Pending'}, rejected:{color:'var(--zg-danger)',label:'Rejected'}, missing:{color:'var(--zg-text-dim)',label:'Missing'} };
const KSTATUS = { approved:{label:'KYC Approved',color:'var(--zg-good)',bg:'oklch(0.78 0.15 150/0.1)'}, pending:{label:'KYC Pending',color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75/0.1)'}, not_started:{label:'Not Started',color:'var(--zg-text-dim)',bg:'var(--zg-panel-hi)'}, rejected:{label:'KYC Rejected',color:'var(--zg-danger)',bg:'oklch(0.70 0.18 25/0.1)'} };
function fmt(n) { if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'; if (n >= 1000) return (n / 1000).toFixed(0) + 'K'; return String(n || 0); }
const copy = (v, label = 'Copied') => { navigator.clipboard?.writeText(v || ''); toast.success(label); };

const selected = ref(null);
const filter = ref('all');
const tierF = ref('all');
const tab = ref('Profile');
const TABS = ['Profile','Contact & KYC','Banking','Networks','Performance','Posts','Codes & Links','Contracts','Agreement','Payouts'];
const CTYPE = { email:'Email', whatsapp:'WhatsApp', instagram_dm:'Instagram DM', telegram:'Telegram', phone:'Phone' };

const all = computed(() => (ZCD_INFLUENCERS || []).filter((inf) => inf.markets.includes(props.market)));
const filtered = computed(() => all.value.filter((inf) => (filter.value === 'all' || inf.status === filter.value) && (tierF.value === 'all' || inf.tier === tierF.value)));
const cur = computed(() => MARKET_CUR[props.market] || 'AED');
const totalGMV = computed(() => all.value.reduce((s, i) => s + (i.performance.gmv || 0), 0));
const totalOrders = computed(() => all.value.reduce((s, i) => s + (i.performance.ordersGenerated || 0), 0));
const totalComm = computed(() => all.value.reduce((s, i) => s + (i.performance.commissionEarned || 0), 0));

const openInf = (inf) => { selected.value = inf; tab.value = 'Profile'; };
const d = computed(() => selected.value);
const perfMonthly = computed(() => { const p = d.value?.performance || {}; return [0.12,0.14,0.22,0.15,0.18,0.19].map((f, i) => ({ m: ['Jan','Feb','Mar','Apr','May','Jun'][i], orders: Math.round((p.ordersGenerated || 0) * f) })); });
const maxOrders = computed(() => Math.max(...perfMonthly.value.map((m) => m.orders), 1));
const payoutOpen = ref(null);
const mockOrdersFor = (p) => [
  { id:'ORD-88841', brand:'Le Maillot', amount: Math.round(p.amount * 0.4) },
  { id:'ORD-88720', brand:'Burgandy', amount: Math.round(p.amount * 0.35) },
  { id:'ORD-88601', brand:'Le Maillot', amount: Math.round(p.amount * 0.25) },
];
</script>

<template>
  <div class="zcd-tab-body">
    <div class="zf-section-title" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0">
      <span>Influencer &amp; UGC · {{ market }} · {{ all.length }} profiles</span>
      <button class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="toast.info('Add influencer')">+ Add Influencer</button>
    </div>
    <div class="zf-kpi-strip">
      <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Influencers</div><div class="zf-kpi-val">{{ all.length }}</div></div>
      <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Active</div><div class="zf-kpi-val is-good">{{ all.filter((i) => i.status === 'active').length }}</div></div>
      <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Orders</div><div class="zf-kpi-val">{{ totalOrders.toLocaleString() }}</div></div>
      <div class="zf-kpi-cell"><div class="zf-kpi-lbl">GMV Generated</div><div class="zf-kpi-val is-good">{{ cur }} {{ totalGMV.toLocaleString() }}</div></div>
      <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Commission Paid</div><div class="zf-kpi-val is-neg">{{ cur }} {{ totalComm.toLocaleString() }}</div></div>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <div class="zf-filter-row">
        <button v-for="s in ['all','active','paused','pending_contract']" :key="s" class="zen-filter-chip" :class="{ 'is-on': filter === s }" @click="filter = s">{{ s === 'all' ? 'All' : s === 'pending_contract' ? 'Pending Contract' : s.charAt(0).toUpperCase() + s.slice(1) }}</button>
      </div>
      <div class="zf-filter-row">
        <button v-for="t in ['all','nano','micro','macro','mega']" :key="t" class="zen-filter-chip" :class="{ 'is-on': tierF === t }" @click="tierF = t">{{ t === 'all' ? 'All Tiers' : t.charAt(0).toUpperCase() + t.slice(1) }}</button>
      </div>
    </div>

    <div v-if="!filtered.length" class="zcd-empty">No influencers match this filter.</div>
    <div v-for="inf in filtered" :key="inf.id" class="zcd-inf-card" @click="openInf(inf)">
      <div class="zcd-inf-avatar-wrap"><img :src="inf.avatar" :alt="inf.name" class="zcd-inf-avatar" /></div>
      <div class="zcd-inf-info">
        <div class="zcd-inf-name">{{ inf.firstName || inf.name }} {{ inf.lastName || '' }}<span class="zen-pd-ref">{{ inf.handle }}</span><span v-if="inf.representation?.hasManager" class="zen-brand-cat-tag" style="font-size:9px">Managed</span></div>
        <div class="zcd-inf-meta">
          <span class="zcd-badge" :style="{ background: (TIER[inf.tier] || TIER.micro).bg, color: (TIER[inf.tier] || TIER.micro).color, fontSize:'9px' }">{{ (TIER[inf.tier] || TIER.micro).label }}</span>
          <span class="zcd-badge" :style="{ background: (ISTATUS[inf.status] || ISTATUS.active).bg, color: (ISTATUS[inf.status] || ISTATUS.active).color, fontSize:'9px' }">{{ (ISTATUS[inf.status] || ISTATUS.active).label }}</span>
          <span v-for="n in inf.networks" :key="n.platform" class="zen-brand-cat-tag" :style="{ background: (PM[n.platform] || PM.x).bg, color: (PM[n.platform] || PM.x).color }">{{ (PM[n.platform] || PM.x).label }}</span>
        </div>
      </div>
      <div class="zcd-inf-stats">
        <div><div class="zf-kpi-lbl">Followers</div><div class="zcd-stat-val">{{ fmt(inf.networks.reduce((s, n) => s + n.followers, 0)) }}</div></div>
        <div><div class="zf-kpi-lbl">Orders</div><div class="zcd-stat-val is-good">{{ (inf.performance.ordersGenerated || 0).toLocaleString() }}</div></div>
        <div><div class="zf-kpi-lbl">GMV</div><div class="zcd-stat-val">{{ inf.agreement.currency }} {{ (inf.performance.gmv || 0).toLocaleString() }}</div></div>
        <div><div class="zf-kpi-lbl">Code</div><code class="zcd-code-pill">{{ inf.code }}</code></div>
      </div>
      <svg viewBox="0 0 8 14" width="7" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0"><path d="M1 1L7 7L1 13" /></svg>
    </div>

    <!-- Detail drawer -->
    <ZDrawer :open="!!selected" :title="d?.name || ''" :subtitle="d ? `${d.handle} · ${d.city}, ${d.country}` : ''" width="80vw" @close="selected = null">
      <div style="display:flex;gap:0;border-bottom:1px solid var(--zg-line);margin:-18px -20px 16px;padding:0 20px;overflow-x:auto">
        <button v-for="t in TABS" :key="t" style="padding:8px 12px;background:none;border:none;cursor:pointer;font-family:var(--zg-sans);font-size:12px;white-space:nowrap" :style="{ color: tab === t ? 'var(--zg-accent)' : 'var(--zg-text-dim)', borderBottom: tab === t ? '2px solid var(--zg-accent)' : '2px solid transparent', marginBottom:'-1px' }" @click="tab = t">{{ t }}</button>
      </div>

      <div v-if="d">
        <!-- Profile -->
        <div v-if="tab === 'Profile'" style="display:flex;flex-direction:column;gap:14px">
          <div style="display:flex;gap:16px;align-items:flex-start">
            <img :src="d.avatar" :alt="d.name" style="width:80px;height:80px;border-radius:50%;border:2px solid var(--zg-line);flex-shrink:0;object-fit:cover" />
            <div style="flex:1">
              <div style="font-size:15px;font-weight:600;color:var(--zg-text);margin-bottom:4px">{{ d.firstName || '' }} {{ d.lastName || d.name }}</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px">
                <span class="zcd-badge" :style="{ background: (TIER[d.tier] || TIER.micro).bg, color: (TIER[d.tier] || TIER.micro).color }">{{ (TIER[d.tier] || TIER.micro).label }} · {{ (TIER[d.tier] || TIER.micro).range }}</span>
                <span class="zcd-badge" :style="{ background: (ISTATUS[d.status] || ISTATUS.active).bg, color: (ISTATUS[d.status] || ISTATUS.active).color }">{{ (ISTATUS[d.status] || ISTATUS.active).label }}</span>
                <span v-for="m in d.markets" :key="m" class="zcd-market-pill">{{ m }}</span>
              </div>
              <div style="font-size:12.5px;color:var(--zg-text-dim);line-height:1.5">{{ d.bio }}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
            <div class="zen-card" style="padding:14px">
              <div class="zen-card-head"><span class="zen-card-title">Personal Information</span></div>
              <div class="zen-bank-fields">
                <div class="zen-bank-field"><div class="zen-field-label">First Name</div><div class="zen-field-val">{{ d.firstName || '—' }}</div></div>
                <div class="zen-bank-field"><div class="zen-field-label">Last Name</div><div class="zen-field-val">{{ d.lastName || '—' }}</div></div>
                <DateField  label="Date of Birth" :value="d.dob || ''"        @change="v => selected.dob = v" />
                <SDropField label="Nationality"  :value="d.nationality || ''" :options="INF_NATIONALITIES" @change="v => selected.nationality = v" />
                <SDropField label="Gender"       :value="d.gender || ''"      :options="INF_GENDERS"       @change="v => selected.gender = v" />
                <div style="grid-column:1/-1">
                  <SDropField label="Languages" :value="(d.languages||[]).join(', ')" :options="INF_LANGUAGES" :multi="true" @change="v => selected.languages = v.split(', ').filter(Boolean)" />
                </div>
                <SDropField label="Business Entity" :value="d.businessEntity || ''" :options="INF_BIZ_TYPES" @change="v => selected.businessEntity = v" />
                <div v-if="d.companyName" class="zen-bank-field"><div class="zen-field-label">Company Name</div><div class="zen-field-val">{{ d.companyName }}</div></div>
              </div>
            </div>
            <div class="zen-card" style="padding:14px">
              <div class="zen-card-head"><span class="zen-card-title">Content &amp; Audience</span></div>
              <div class="zen-bank-fields">
                <template v-if="d.audienceDemographics">
                  <div class="zen-bank-field"><div class="zen-field-label">Primary Country</div><div class="zen-field-val">{{ d.audienceDemographics.primaryCountry || '—' }}</div></div>
                  <div class="zen-bank-field"><div class="zen-field-label">Age Group</div><div class="zen-field-val">{{ d.audienceDemographics.ageGroup || '—' }}</div></div>
                  <div class="zen-bank-field"><div class="zen-field-label">Gender Split</div><div class="zen-field-val">{{ d.audienceDemographics.genderSplit || '—' }}</div></div>
                  <div class="zen-bank-field"><div class="zen-field-label">Top Cities</div><div class="zen-field-val">{{ (d.audienceDemographics.topCities || []).join(', ') }}</div></div>
                </template>
                <div class="zen-bank-field" style="grid-column:1/-1"><div class="zen-field-label" style="margin-bottom:4px">Content Categories</div><div style="display:flex;gap:5px;flex-wrap:wrap"><span v-for="c in (d.contentCategories || [])" :key="c" class="zen-brand-cat-tag">{{ c }}</span></div></div>
              </div>
            </div>
            <div class="zen-card" style="padding:14px">
              <div class="zen-card-head"><span class="zen-card-title">Management &amp; Representation</span><span class="zcd-badge" :style="d.representation?.hasManager ? { background:'oklch(0.82 0.14 215/0.1)', color:'oklch(0.82 0.14 215)' } : { background:'var(--zg-panel-hi)', color:'var(--zg-text-dim)' }">{{ d.representation?.hasManager ? 'Has Manager' : 'Self-Managed' }}</span></div>
              <div v-if="d.representation?.hasManager" class="zen-bank-fields">
                <div class="zen-bank-field"><div class="zen-field-label">Manager</div><div class="zen-field-val">{{ d.representation.managerName }}</div></div>
                <div class="zen-bank-field"><div class="zen-field-label">Phone</div><div class="zen-field-val">{{ d.representation.managerPhone || '—' }}</div></div>
                <div class="zen-bank-field" style="grid-column:1/-1"><div class="zen-field-label">Email</div><div class="zen-field-val">{{ d.representation.managerEmail || '—' }}</div></div>
                <div v-if="d.representation.agencyName" class="zen-bank-field"><div class="zen-field-label">Agency</div><div class="zen-field-val">{{ d.representation.agencyName }}</div></div>
              </div>
              <div v-else style="font-size:12.5px;color:var(--zg-text-dim);padding:4px 0">No manager or agency on file.</div>
            </div>
            <div class="zen-card" style="padding:14px">
              <div class="zen-card-head"><span class="zen-card-title">Exclusivity</span><span v-if="d.exclusivity" class="zcd-badge" :style="d.exclusivity.hasExclusivity ? { background:'oklch(0.82 0.15 75/0.1)', color:'var(--zg-warn)' } : { background:'oklch(0.78 0.15 150/0.1)', color:'var(--zg-good)' }">{{ d.exclusivity.hasExclusivity ? 'Exclusive' : 'Non-Exclusive' }}</span></div>
              <div v-if="(d.exclusivity?.competingBrands || []).length" style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px"><span v-for="b in d.exclusivity.competingBrands" :key="b" class="zcd-badge" style="background:oklch(0.70 0.18 25/0.1);color:var(--zg-danger)">{{ b }}</span></div>
              <div style="font-size:12px;color:var(--zg-text-dim)">{{ d.exclusivity?.notes || 'No exclusivity restrictions.' }}</div>
            </div>
          </div>
        </div>

        <!-- Contact & KYC -->
        <div v-else-if="tab === 'Contact & KYC'" style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div class="zen-card" style="padding:14px">
            <div class="zen-card-head"><span class="zen-card-title">Contact Methods</span><button class="zen-doc-request-btn" @click="toast.info('Add contact')">+ Add</button></div>
            <div v-for="(c, i) in (d.contactMethods || [{ type:'email', value: d.contact?.email }, { type:'whatsapp', value: d.contact?.whatsapp, preferred:true }])" :key="i" class="zen-pd-simple-row">
              <div style="flex:1"><div style="font-size:11px;color:var(--zg-text-dim);text-transform:capitalize">{{ c.label || CTYPE[c.type] || c.type }}</div><span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text-mid)">{{ c.value }}</span></div>
              <span v-if="c.preferred" class="zcd-badge" style="background:var(--zg-accent-tint);color:var(--zg-accent);font-size:9px">Preferred</span>
              <button class="zen-copy-btn" @click="copy(c.value)"><svg viewBox="0 0 16 16" width="10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="5" y="5" width="9" height="9" rx="1.5" /><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" /></svg></button>
            </div>
          </div>
          <div class="zen-card" style="padding:14px">
            <div class="zen-card-head"><span class="zen-card-title">KYC Status</span><span class="zcd-badge" :style="{ background: (KSTATUS[d.kyc?.kycStatus] || KSTATUS.not_started).bg, color: (KSTATUS[d.kyc?.kycStatus] || KSTATUS.not_started).color }">{{ (KSTATUS[d.kyc?.kycStatus] || KSTATUS.not_started).label }}</span></div>
            <div v-if="!(d.kyc?.documents || []).length" style="font-size:12px;color:var(--zg-text-dim)">No documents uploaded yet.</div>
            <div v-for="(doc, i) in (d.kyc?.documents || [])" :key="i" style="display:flex;align-items:center;gap:12px;padding:9px 12px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:7px;margin-bottom:6px">
              <div style="flex:1"><div style="font-size:12.5px;font-weight:500;color:var(--zg-text)">{{ doc.type }}</div><div v-if="doc.uploadDate" style="font-size:10.5px;color:var(--zg-text-dim);margin-top:2px">Uploaded {{ doc.uploadDate }}<template v-if="doc.expiryDate"> · Expires {{ doc.expiryDate }}</template></div></div>
              <span class="zcd-badge" :style="{ background: (DSTATUS[doc.status] || DSTATUS.pending).color + '22', color: (DSTATUS[doc.status] || DSTATUS.pending).color }">{{ (DSTATUS[doc.status] || DSTATUS.pending).label }}</span>
              <button class="zen-doc-card-btn" @click="toast.info('Viewing…')">View</button>
            </div>
            <button class="zen-doc-request-btn" style="margin-top:8px" @click="toast.info('Upload document')">+ Upload Document</button>
          </div>
        </div>

        <!-- Banking -->
        <div v-else-if="tab === 'Banking'" style="display:flex;flex-direction:column;gap:14px">
          <div style="display:flex;justify-content:flex-end"><button class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="toast.info('Add payout method')">+ Add Payout Method</button></div>
          <div v-if="!(d.banking || []).length" class="zcd-empty">No banking details on file.</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
            <div v-for="acc in (d.banking || [])" :key="acc.id" class="zen-card" style="padding:14px">
              <div class="zen-card-head">
                <div><div style="font-size:13px;font-weight:500;color:var(--zg-text)">{{ acc.bankName }}</div><div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px">{{ acc.type }} · {{ acc.currency }} · {{ (acc.markets || []).join(', ') }}</div></div>
                <div style="display:flex;gap:6px;align-items:center"><span v-if="acc.isDefault" class="zen-pm-default">Default</span><span class="zen-bst" :class="acc.verified ? 'zen-bst--active' : 'zen-bst--pending'">{{ acc.verified ? 'Verified' : 'Pending' }}</span></div>
              </div>
              <div class="zen-bank-fields">
                <div class="zen-bank-field"><div class="zen-field-label">Account Name</div><div class="zen-field-val">{{ acc.accountName }}</div></div>
                <div class="zen-bank-field"><div class="zen-field-label">IBAN</div><div class="zen-field-val zen-field-mono" style="font-size:11px">{{ acc.iban.slice(0, 14) }}…</div></div>
                <div class="zen-bank-field"><div class="zen-field-label">SWIFT / BIC</div><div class="zen-field-val zen-field-mono">{{ acc.swift }}</div></div>
                <div class="zen-bank-field"><div class="zen-field-label">Currency</div><div class="zen-field-val">{{ acc.currency }}</div></div>
              </div>
              <div style="display:flex;gap:8px;margin-top:12px">
                <button v-if="!acc.isDefault" class="zen-doc-request-btn" @click="toast.success('Default updated')">Set as Default</button>
                <button class="zen-doc-card-btn" @click="toast.info('View letter')">View Letter</button>
                <button class="zen-doc-card-btn" @click="toast.info('Edit account')">Edit</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Networks -->
        <div v-else-if="tab === 'Networks'" style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div v-for="(n, i) in d.networks" :key="i" class="zen-card" style="padding:14px">
            <div class="zen-card-head"><span class="zen-card-title"><span class="zen-brand-cat-tag" :style="{ background: (PM[n.platform] || PM.x).bg, color: (PM[n.platform] || PM.x).color }">{{ (PM[n.platform] || PM.x).label }}</span> {{ n.handle }}<span v-if="n.verified" style="color:oklch(0.82 0.14 215);font-size:10px;margin-left:4px">✓ Verified</span></span><button class="zen-doc-card-btn" @click="toast.info('Opening…')">View Profile</button></div>
            <div class="zf-kpi-strip" style="border:none;padding:0;margin:0">
              <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Followers</div><div class="zf-kpi-val">{{ fmt(n.followers) }}</div></div>
              <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Engagement Rate</div><div class="zf-kpi-val" :class="{ 'is-good': n.engagementRate >= 5 }">{{ n.engagementRate }}%</div></div>
              <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Growth Rate</div><div class="zf-kpi-val is-good">{{ n.followerGrowthRate || '—' }}</div></div>
              <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Post Frequency</div><div class="zf-kpi-val">{{ n.postFrequency || '—' }}</div></div>
            </div>
            <div v-if="(n.contentPillars || []).length" style="margin-top:10px"><div class="zen-field-label" style="margin-bottom:4px">Content Pillars</div><div style="display:flex;gap:5px;flex-wrap:wrap"><span v-for="p in n.contentPillars" :key="p" class="zen-brand-cat-tag">{{ p }}</span></div></div>
          </div>
        </div>

        <!-- Performance -->
        <div v-else-if="tab === 'Performance'" style="display:flex;flex-direction:column;gap:14px">
          <div class="zf-kpi-strip">
            <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Orders Generated</div><div class="zf-kpi-val">{{ (d.performance.ordersGenerated || 0).toLocaleString() }}</div></div>
            <div class="zf-kpi-cell"><div class="zf-kpi-lbl">GMV Generated</div><div class="zf-kpi-val is-good">{{ cur }} {{ (d.performance.gmv || 0).toLocaleString() }}</div></div>
            <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Commission Earned</div><div class="zf-kpi-val is-neg">{{ cur }} {{ (d.performance.commissionEarned || 0).toLocaleString() }}</div></div>
            <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Avg Order Value</div><div class="zf-kpi-val">{{ cur }} {{ (d.performance.avgOrderValue || 0).toLocaleString() }}</div></div>
            <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Conversion Rate</div><div class="zf-kpi-val" :class="{ 'is-good': (d.performance.conversionRate || 0) >= 3 }">{{ d.performance.conversionRate || 0 }}%</div></div>
          </div>
          <div class="zf-section-title">Monthly Orders (last 6 months)</div>
          <div style="display:flex;align-items:flex-end;gap:8px;padding:12px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);min-height:100px">
            <div v-for="m in perfMonthly" :key="m.m" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
              <div style="width:100%;background:var(--zg-accent);border-radius:3px 3px 0 0;opacity:0.85" :style="{ height: Math.max(4, (m.orders / maxOrders) * 70) + 'px' }" />
              <div style="font-size:9.5px;color:var(--zg-text-dim)">{{ m.m }}</div>
              <div style="font-family:var(--zg-mono);font-size:9px;color:var(--zg-text-dim)">{{ m.orders }}</div>
            </div>
          </div>
        </div>

        <!-- Posts -->
        <div v-else-if="tab === 'Posts'" style="display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;justify-content:flex-end"><button class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="toast.info('Add post')">+ Add Post</button></div>
          <div v-if="!(d.posts || []).length" class="zcd-empty">No posts recorded yet.</div>
          <div v-for="(p, i) in (d.posts || [])" :key="i" class="zen-card" style="padding:10px 12px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span class="zen-pd-date">{{ p.date }}</span><span v-if="p.approved" class="zen-bst zen-bst--active" style="font-size:9px">Approved</span></div>
            <div v-if="p.caption" style="font-size:12px;color:var(--zg-text-mid);line-height:1.4">{{ p.caption }}</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:6px">
              <span style="font-size:11.5px;color:var(--zg-text-dim)">👁 {{ fmt(p.views) }}</span>
              <span style="font-size:11.5px;color:var(--zg-text-dim)">🔗 {{ p.clicks.toLocaleString() }} clicks</span>
              <span style="font-size:11.5px;color:var(--zg-good);font-weight:600">🛒 {{ p.ordersConverted }} orders</span>
            </div>
          </div>
        </div>

        <!-- Codes & Links -->
        <div v-else-if="tab === 'Codes & Links'" style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;gap:8px"><button class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="toast.info('Add code')">+ Add Code</button><button class="zen-btn-ghost" style="height:28px;font-size:11.5px" @click="toast.info('Add link')">+ Add Referral Link</button></div>
          <template v-if="(d.codes || []).length">
            <div class="zf-section-title">Discount Codes</div>
            <div v-for="c in d.codes" :key="c.id" class="zen-card" style="padding:14px">
              <div class="zen-card-head">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><code class="zcd-code-pill" style="font-size:13px;padding:3px 12px">{{ c.code }}</code><span class="zcd-promo-value">{{ c.discount }}% off</span></div>
                <button class="zen-copy-btn" @click="copy(c.code, 'Code copied')"><svg viewBox="0 0 16 16" width="10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="5" y="5" width="9" height="9" rx="1.5" /><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" /></svg></button>
              </div>
              <div class="zf-kpi-strip" style="border:none;padding:10px 0 0;margin:0">
                <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Clicks</div><div class="zf-kpi-val">{{ c.clicks.toLocaleString() }}</div></div>
                <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Orders</div><div class="zf-kpi-val is-good">{{ c.orders.toLocaleString() }}</div></div>
                <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Revenue</div><div class="zf-kpi-val is-good">{{ c.currency }} {{ c.revenue.toLocaleString() }}</div></div>
                <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Conv. Rate</div><div class="zf-kpi-val" :class="{ 'is-good': c.conversionRate >= 4 }">{{ c.conversionRate }}%</div></div>
              </div>
            </div>
          </template>
          <div v-if="!(d.codes || []).length && !(d.referralLinks || []).length" class="zcd-empty">No codes or links yet.</div>
        </div>

        <!-- Contracts -->
        <div v-else-if="tab === 'Contracts'" style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;justify-content:flex-end"><button class="zen-btn-primary" style="height:28px;font-size:11.5px" @click="toast.info('New contract')">+ New Contract</button></div>
          <div v-if="!(d.contracts || []).length" class="zcd-empty">No contracts on file. Add one above.</div>
          <div v-for="c in (d.contracts || [])" :key="c.id" class="zen-card" style="padding:14px">
            <div class="zen-card-head">
              <div><div style="font-size:13px;font-weight:600;color:var(--zg-text)">{{ c.type }}</div><div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px">{{ c.ref || '—' }} · {{ c.startDate || 'TBD' }} → {{ c.endDate || 'TBD' }}</div></div>
              <span class="zcd-badge" :style="{ background: (CSTATUS[c.status] || CSTATUS.draft).bg, color: (CSTATUS[c.status] || CSTATUS.draft).color }">{{ (CSTATUS[c.status] || CSTATUS.draft).label }}</span>
            </div>
            <div class="zen-bank-fields">
              <div class="zen-bank-field"><div class="zen-field-label">Posts / Month</div><div class="zen-field-val">{{ c.postsPerMonth || '—' }}</div></div>
              <div class="zen-bank-field"><div class="zen-field-label">Commission</div><div class="zen-field-val">{{ c.commission }}%</div></div>
              <div class="zen-bank-field"><div class="zen-field-label">Fixed Fee</div><div class="zen-field-val">{{ c.currency }} {{ (c.fixedFee || 0).toLocaleString() }}</div></div>
              <div class="zen-bank-field"><div class="zen-field-label">Markets</div><div class="zen-field-val">{{ (c.markets || []).join(', ') || '—' }}</div></div>
            </div>
            <div style="display:flex;gap:8px;margin-top:10px"><button class="zen-doc-card-btn" @click="toast.info('Edit contract')">Edit</button></div>
          </div>
        </div>

        <!-- Agreement -->
        <div v-else-if="tab === 'Agreement'" class="zen-card" style="padding:14px">
          <div class="zen-card-head"><span class="zen-card-title">Commission Agreement</span><span class="zcd-badge" :style="d.agreement.contractUploaded ? { background:'oklch(0.78 0.15 150/0.1)', color:'var(--zg-good)' } : { background:'oklch(0.82 0.15 75/0.1)', color:'var(--zg-warn)' }">{{ d.agreement.contractUploaded ? 'Signed' : 'Pending Signature' }}</span></div>
          <div class="zen-bank-fields">
            <div class="zen-bank-field"><div class="zen-field-label">Commission Rate</div><div class="zen-field-val">{{ d.agreement.commissionPct }}%</div></div>
            <div class="zen-bank-field"><div class="zen-field-label">Fixed Fee / Post</div><div class="zen-field-val">{{ d.agreement.currency }} {{ (d.agreement.fixedFeePerPost || 0).toLocaleString() }}</div></div>
            <div class="zen-bank-field"><div class="zen-field-label">Contract Ref</div><div class="zen-field-val zen-field-mono">{{ d.agreement.contractRef || '—' }}</div></div>
            <div class="zen-bank-field"><div class="zen-field-label">Signed Date</div><div class="zen-field-val">{{ d.agreement.signedDate || 'Not signed' }}</div></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px"><button class="zen-doc-card-btn" @click="toast.info('Edit agreement')">Edit Agreement</button></div>
        </div>

        <!-- Payouts -->
        <div v-else style="display:flex;flex-direction:column;gap:12px">
          <div class="zf-kpi-strip">
            <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Total Earned</div><div class="zf-kpi-val is-accent">{{ d.agreement.currency }} {{ d.payouts.reduce((s, p) => s + p.amount, 0).toLocaleString() }}</div></div>
            <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Pending</div><div class="zf-kpi-val is-warn">{{ d.agreement.currency }} {{ d.payouts.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0).toLocaleString() }}</div></div>
            <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Paid</div><div class="zf-kpi-val is-good">{{ d.agreement.currency }} {{ d.payouts.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0).toLocaleString() }}</div></div>
          </div>
          <div class="zcd-table">
            <div class="zcd-table-head" style="grid-template-columns:100px 1fr 110px 110px 80px"><span>Payout ID</span><span>Period</span><span>Amount</span><span>Paid Date</span><span>Status</span></div>
            <template v-for="p in d.payouts" :key="p.id">
              <div class="zcd-table-row" style="grid-template-columns:100px 1fr 110px 110px 80px" @click="payoutOpen = payoutOpen === p.id ? null : p.id">
                <span class="zf-txn-id">{{ p.id }}</span><span>{{ p.period }}</span><span class="zf-amount">{{ d.agreement.currency }} {{ p.amount.toLocaleString() }}</span><span class="zen-pd-date">{{ p.paidDate || '—' }}</span>
                <span class="zen-bst" :class="p.status === 'paid' ? 'zen-bst--active' : 'zen-bst--pending'">{{ p.status }}</span>
              </div>
              <div v-if="payoutOpen === p.id" style="padding:0 12px 10px;border-top:1px solid var(--zg-line);background:var(--zg-bg)">
                <div style="font-size:10.5px;font-weight:600;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:0.07em;margin:8px 0 6px">Linked Sales</div>
                <div v-for="o in mockOrdersFor(p)" :key="o.id" style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--zg-line-soft)">
                  <span class="zf-txn-id">{{ o.id }}</span><span style="flex:1;font-size:12px;color:var(--zg-text-mid)">{{ o.brand }}</span><span class="zf-amount is-good">{{ d.agreement.currency }} {{ o.amount.toLocaleString() }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="zen-btn-ghost" @click="selected = null">Close</button>
        <button class="zen-btn-primary" @click="toast.success('Saved')">Save Changes</button>
      </template>
    </ZDrawer>
  </div>
</template>
