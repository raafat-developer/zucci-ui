<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const mainTab = ref(route.query.tab || 'links');
watch(() => route.query.tab, v => { if (v) mainTab.value = v; });

const BASE = 'zuc.ci';

const TYPE_META = {
  campaign:  { label:'Campaign',   color:'var(--zg-accent)' },
  page:      { label:'Page',       color:'oklch(0.82 0.14 215)' },
  deeplink:  { label:'Deep Link',  color:'oklch(0.78 0.15 150)' },
  affiliate: { label:'Affiliate',  color:'var(--zg-warn)' },
};

const links = ref([
  { id:'l1',  slug:'eid25',      dest:'https://zucci.com/collections/eid-2025',           type:'campaign',  group:'Eid 2025',      status:'active',  expiry:'Jul 1, 2025',  clicks:48210, unique:31420, markets:{AE:22100,SA:14810,EG:8210,KW:1840,QA:1250}, qr:true,  utm:{source:'instagram',medium:'social',campaign:'eid25'} },
  { id:'l2',  slug:'sale',       dest:'https://zucci.com/sale',                           type:'page',      group:'Sale',          status:'active',  expiry:null,           clicks:28410, unique:19840, markets:{AE:14200,SA:8810,EG:4100,KW:810,QA:490},    qr:true,  utm:{source:'email',medium:'newsletter',campaign:'sale'} },
  { id:'l3',  slug:'app',        dest:'app://zucci/home',                                 type:'deeplink',  group:'App',           status:'active',  expiry:null,           clicks:18410, unique:14210, markets:{AE:9810,SA:5810,EG:2100,KW:410,QA:280},     qr:true,  utm:null },
  { id:'l4',  slug:'app-dress',  dest:'app://zucci/product/SKU-4821-DRESS-M-BLK',        type:'deeplink',  group:'App',           status:'active',  expiry:null,           clicks:4210,  unique:3810,  markets:{AE:2810,SA:1100,EG:180,KW:80,QA:40},        qr:false, utm:null },
  { id:'l5',  slug:'influencer-hessa', dest:'https://zucci.com/?ref=hessa',              type:'affiliate', group:'Influencers',   status:'active',  expiry:null,           clicks:12480, unique:9810,  markets:{AE:8810,SA:2480,EG:980,KW:120,QA:90},       qr:false, utm:{source:'instagram',medium:'influencer',campaign:'hessa_q2'} },
  { id:'l6',  slug:'new-men',    dest:'https://zucci.com/collections/new-mens',           type:'page',      group:'New Arrivals',  status:'active',  expiry:null,           clicks:8210,  unique:6410,  markets:{AE:4810,SA:2100,EG:980,KW:200,QA:120},      qr:true,  utm:{source:'push',medium:'notification',campaign:'june_drop'} },
  { id:'l7',  slug:'cart-save',  dest:'app://zucci/cart/recover/{cart_id}',              type:'deeplink',  group:'Cart Recovery', status:'active',  expiry:null,           clicks:2841,  unique:2810,  markets:{AE:1810,SA:710,EG:240,KW:51,QA:30},         qr:false, utm:null },
  { id:'l8',  slug:'vip',        dest:'https://zucci.com/vip',                            type:'campaign',  group:'VIP',           status:'active',  expiry:null,           clicks:1210,  unique:1180,  markets:{AE:980,SA:190,EG:30,KW:5,QA:5},             qr:true,  utm:{source:'email',medium:'crm',campaign:'vip_launch'} },
  { id:'l9',  slug:'eid24-promo',dest:'https://zucci.com/collections/eid-2024',           type:'campaign',  group:'Eid 2024',      status:'expired', expiry:'Jul 1, 2024',  clicks:84210, unique:62410, markets:{AE:38100,SA:24810,EG:14100,KW:4200,QA:3000},qr:false, utm:{source:'email',medium:'newsletter',campaign:'eid24'} },
  { id:'l10', slug:'sa-launch',  dest:'https://zucci.com/sa',                             type:'campaign',  group:'SA Launch',     status:'expired', expiry:'Apr 1, 2025',  clicks:18410, unique:14210, markets:{AE:2100,SA:14210,EG:1100,KW:0,QA:0},        qr:true,  utm:{source:'ads',medium:'paid',campaign:'sa_launch'} },
]);

const active = ref(null);
const search  = ref('');
const typeF   = ref('all');
const statusF = ref('active');
const newOpen = ref(false);

// New link form
const newForm = ref({ slug:'', dest:'', type:'page', group:'', expiry:'', has_utm:false, utm_source:'', utm_medium:'', utm_campaign:'' });

const filtered = computed(() => {
  const sq = search.value.toLowerCase();
  return links.value.filter(l =>
    (typeF.value === 'all'   || l.type === typeF.value) &&
    (statusF.value === 'all' || l.status === statusF.value) &&
    (!sq || l.slug.toLowerCase().includes(sq) || l.dest.toLowerCase().includes(sq) || l.group.toLowerCase().includes(sq))
  );
});

const kpis = computed(() => [
  ['Total Links',   links.value.length,                                                  ''],
  ['Total Clicks',  links.value.reduce((s,l)=>s+l.clicks,0).toLocaleString(),            'is-accent'],
  ['Active',        links.value.filter(l=>l.status==='active').length,                    'is-good'],
  ['Deep Links',    links.value.filter(l=>l.type==='deeplink').length,                    ''],
  ['Expired',       links.value.filter(l=>l.status==='expired').length,                   ''],
]);

// UTM builder state
const utmForm = ref({ base:'https://zucci.com/', source:'email', medium:'newsletter', campaign:'', term:'', content:'' });
const utmPreview = computed(() => {
  const p = new URLSearchParams();
  if (utmForm.value.source)   p.set('utm_source',   utmForm.value.source);
  if (utmForm.value.medium)   p.set('utm_medium',   utmForm.value.medium);
  if (utmForm.value.campaign) p.set('utm_campaign',  utmForm.value.campaign);
  if (utmForm.value.term)     p.set('utm_term',      utmForm.value.term);
  if (utmForm.value.content)  p.set('utm_content',   utmForm.value.content);
  return utmForm.value.base + (utmForm.value.base.includes('?') ? '&' : '?') + p.toString();
});

const copied = ref(false);
function copyUrl() {
  navigator.clipboard?.writeText(BASE + '/' + (active.value?.slug || ''));
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
function copyUtm() {
  navigator.clipboard?.writeText(utmPreview.value);
}

function createLink() {
  if (!newForm.value.slug || !newForm.value.dest) return;
  const l = {
    id: 'l-' + Date.now(), slug: newForm.value.slug, dest: newForm.value.dest,
    type: newForm.value.type, group: newForm.value.group || 'General',
    status: 'active', expiry: newForm.value.expiry || null,
    clicks: 0, unique: 0,
    markets: { AE:0,SA:0,EG:0,KW:0,QA:0 }, qr: false,
    utm: newForm.value.has_utm ? { source: newForm.value.utm_source, medium: newForm.value.utm_medium, campaign: newForm.value.utm_campaign } : null,
  };
  links.value = [l, ...links.value];
  active.value = l;
  newOpen.value = false;
  newForm.value = { slug:'', dest:'', type:'page', group:'', expiry:'', has_utm:false, utm_source:'', utm_medium:'', utm_campaign:'' };
}

function deactivateLink(l) {
  l.status = 'expired';
}
function duplicateLink(l) {
  const dup = { ...l, id:'l-'+Date.now(), slug:l.slug+'-copy', clicks:0, unique:0, markets:{AE:0,SA:0,EG:0,KW:0,QA:0} };
  links.value = [dup, ...links.value];
  active.value = dup;
}

// on first load select first
if (filtered.value.length) active.value = filtered.value[0];
</script>

<template>
  <div class="zsl-wrap">
    <!-- Header -->
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="zwh-title">Short Links &amp; Deep Links</span>
          <span class="zsl-domain-badge">{{ BASE }}</span>
        </div>
        <div class="zwh-subtitle">URL shortener, QR codes, UTM builder, and deep link routing</div>
      </div>
      <div style="display:flex;align-items:center;gap:0;">
        <button v-for="[v,l] in [['links','Links'],['analytics','Analytics'],['campaigns','Campaigns'],['utm','UTM Builder']]" :key="v"
          class="zsl-tab" :class="{ 'is-active': mainTab === v }" @click="mainTab = v">{{ l }}</button>
      </div>
      <button class="zwh-btn-primary" @click="newOpen = true">+ New Link</button>
    </div>

    <!-- KPI strip -->
    <div class="zwh-kpi-strip">
      <div v-for="[l,v,cls] in kpis" :key="l" class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">{{ l }}</span>
        <span class="zwh-kpi-val" :class="cls">{{ v }}</span>
      </div>
    </div>

    <!-- Analytics tab -->
    <div v-if="mainTab === 'analytics'" class="zsl-content">
      <div class="zsl-analytics-grid">
        <div v-for="l in links.slice(0,5)" :key="l.id" class="zsl-analytics-card">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
            <span class="zsl-slug">{{ BASE }}/{{ l.slug }}</span>
            <span class="zsl-type-badge" :style="{ color: TYPE_META[l.type]?.color }">{{ TYPE_META[l.type]?.label }}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
            <div class="zsl-stat-box"><div class="zsl-stat-val" style="color:var(--zg-accent)">{{ l.clicks.toLocaleString() }}</div><div class="zsl-stat-lbl">Clicks</div></div>
            <div class="zsl-stat-box"><div class="zsl-stat-val">{{ l.unique.toLocaleString() }}</div><div class="zsl-stat-lbl">Unique</div></div>
          </div>
          <div v-for="[m,v] in Object.entries(l.markets).sort((a,b)=>b[1]-a[1]).slice(0,3)" :key="m" class="zsl-market-row">
            <span class="zsl-market-code">{{ m }}</span>
            <div class="zsl-market-bar-bg"><div class="zsl-market-bar-fill" :style="{ width: (l.clicks ? v/l.clicks*100 : 0) + '%' }" /></div>
            <span class="zsl-market-num">{{ v.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaigns tab -->
    <div v-if="mainTab === 'campaigns'" class="zsl-content">
      <div class="zsl-table">
        <div class="zsl-table-head">
          <span>Group / Campaign</span><span>Links</span><span>Total Clicks</span><span>Unique</span><span>Top Market</span>
        </div>
        <div v-for="group in [...new Set(links.map(l=>l.group))]" :key="group" class="zsl-table-row">
          <span class="zsl-cell-name">{{ group }}</span>
          <span class="zsl-mono">{{ links.filter(l=>l.group===group).length }}</span>
          <span class="zsl-mono" style="color:var(--zg-accent)">{{ links.filter(l=>l.group===group).reduce((s,l)=>s+l.clicks,0).toLocaleString() }}</span>
          <span class="zsl-mono">{{ links.filter(l=>l.group===group).reduce((s,l)=>s+l.unique,0).toLocaleString() }}</span>
          <span class="zsl-dim">AE</span>
        </div>
      </div>
    </div>

    <!-- UTM Builder tab -->
    <div v-if="mainTab === 'utm'" class="zsl-content">
      <div class="zsl-utm-wrap">
        <div class="zsl-utm-form">
          <h3 style="font-size:13px;font-weight:700;color:var(--zg-text);margin:0 0 16px;">UTM Parameter Builder</h3>
          <div v-for="[label, key, placeholder] in [
            ['Base URL','base','https://zucci.com/collections/...'],
            ['utm_source','source','email, instagram, google'],
            ['utm_medium','medium','newsletter, social, cpc'],
            ['utm_campaign','campaign','eid2025, summer_drop'],
            ['utm_term','term','keyword (optional)'],
            ['utm_content','content','ad-variant (optional)'],
          ]" :key="key" class="zsl-utm-field">
            <label class="zsl-utm-label">{{ label }}</label>
            <input v-model="utmForm[key]" :placeholder="placeholder" class="zsl-utm-input" :class="{ 'is-mono': key === 'base' }" />
          </div>
          <div class="zsl-utm-preview-box">
            <div class="zsl-utm-preview-label">Generated URL</div>
            <div class="zsl-utm-preview-url">{{ utmPreview }}</div>
            <div style="display:flex;gap:6px;margin-top:8px;">
              <button class="zwh-btn-primary" style="height:28px;font-size:11px;" @click="copyUtm">Copy URL</button>
              <button class="zwh-btn-ghost" style="height:28px;font-size:11px;" @click="">Create Short Link</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Links tab -->
    <div v-if="mainTab === 'links'" class="zsl-body">
      <!-- List panel -->
      <div class="zsl-list-panel">
        <div class="zsl-list-toolbar">
          <div style="position:relative;">
            <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:7px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
            <input v-model="search" placeholder="Search links…" class="zsl-search" />
          </div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            <button v-for="[v,l] in [['all','All'],['active','Active'],['expired','Expired']]" :key="v"
              class="zwh-filter-chip" :class="{ 'is-active': statusF === v }" @click="statusF = v" style="font-size:10px;height:20px;">{{ l }}</button>
            <div class="zsl-divider" />
            <button v-for="[v,l] in [['all','All'],['campaign','Campaign'],['page','Page'],['deeplink','Deep Link'],['affiliate','Affiliate']]" :key="v"
              class="zwh-filter-chip" :class="{ 'is-active': typeF === v }" @click="typeF = v" style="font-size:10px;height:20px;">{{ l }}</button>
          </div>
        </div>
        <div class="zsl-list-scroll">
          <div v-for="l in filtered" :key="l.id"
            class="zsl-link-row" :class="{ 'is-active': active?.id === l.id }"
            @click="active = l">
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
                <span class="zsl-slug">{{ BASE }}/{{ l.slug }}</span>
                <span class="zsl-type-badge" :style="{ color: TYPE_META[l.type]?.color, background: TYPE_META[l.type]?.color + '22' }">{{ TYPE_META[l.type]?.label }}</span>
                <span v-if="l.status === 'expired'" class="zsl-expired-badge">Expired</span>
              </div>
              <div class="zsl-dest">{{ l.dest }}</div>
              <div class="zsl-meta">{{ l.group }} · {{ l.clicks.toLocaleString() }} clicks</div>
            </div>
          </div>
        </div>
        <div class="zsl-list-foot">{{ filtered.length }} links</div>
      </div>

      <!-- Detail panel -->
      <div class="zsl-detail-panel">
        <div v-if="!active" class="zsl-empty">Select a link</div>
        <div v-else class="zsl-detail-scroll">
          <!-- Short URL -->
          <div class="zsl-detail-card">
            <div class="zsl-detail-label">Short URL</div>
            <div style="display:flex;align-items:center;gap:10px;">
              <div class="zsl-url-display">
                <span class="zsl-url-base">{{ BASE }}</span>
                <span class="zsl-url-slug">/{{ active.slug }}</span>
              </div>
              <button class="zwh-btn-primary" style="height:34px;padding:0 16px;" @click="copyUrl">{{ copied ? 'Copied!' : 'Copy' }}</button>
              <div v-if="active.qr" class="zsl-qr-placeholder">
                <div class="zsl-qr-grid">
                  <div v-for="i in 49" :key="i" class="zsl-qr-cell" :class="{ 'is-on': Math.random() > 0.5 }" />
                </div>
                <button class="zsl-qr-dl" @click="">Download</button>
              </div>
            </div>
          </div>

          <!-- Destination -->
          <div class="zsl-detail-card">
            <div class="zsl-detail-label">Destination</div>
            <div class="zsl-dest-val">{{ active.dest }}</div>
            <div style="display:flex;gap:6px;margin-top:8px;">
              <button class="zcat-act" @click="">Edit Destination</button>
              <span v-if="active.expiry" style="font-size:11px;color:var(--zg-text-dim);align-self:center;">Expires: {{ active.expiry }}</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="zsl-stats-row">
            <div class="zsl-stat-box"><div class="zsl-stat-val" style="color:var(--zg-accent)">{{ active.clicks.toLocaleString() }}</div><div class="zsl-stat-lbl">Total Clicks</div></div>
            <div class="zsl-stat-box"><div class="zsl-stat-val">{{ active.unique.toLocaleString() }}</div><div class="zsl-stat-lbl">Unique Visitors</div></div>
            <div class="zsl-stat-box"><div class="zsl-stat-val" style="color:var(--zg-good)">{{ active.clicks ? ((active.unique/active.clicks)*100).toFixed(1) : 0 }}%</div><div class="zsl-stat-lbl">Conversion Rate</div></div>
          </div>

          <!-- Market breakdown -->
          <div class="zsl-detail-card">
            <div class="zsl-detail-label">Clicks by Market</div>
            <div v-for="[m, v] in Object.entries(active.markets).sort((a,b)=>b[1]-a[1])" :key="m" class="zsl-market-row">
              <span class="zsl-market-code">{{ m }}</span>
              <div class="zsl-market-bar-bg"><div class="zsl-market-bar-fill" :style="{ width: (active.clicks ? v/active.clicks*100 : 0) + '%' }" /></div>
              <span class="zsl-market-num">{{ v.toLocaleString() }} ({{ active.clicks ? Math.round(v/active.clicks*100) : 0 }}%)</span>
            </div>
          </div>

          <!-- UTM -->
          <div v-if="active.utm" class="zsl-detail-card">
            <div class="zsl-detail-label">UTM Parameters</div>
            <div class="zsl-utm-params">
              <div v-for="[k,v] in Object.entries(active.utm)" :key="k">
                <div class="zsl-utm-key">utm_{{ k }}</div>
                <div class="zsl-utm-val">{{ v }}</div>
              </div>
            </div>
            <button class="zcat-act" style="margin-top:8px;" @click="">Edit UTM</button>
          </div>

          <!-- Actions -->
          <div style="display:flex;gap:6px;flex-wrap:wrap;padding:0 20px 20px;">
            <button class="zwh-btn-ghost" @click="">Edit Link</button>
            <button class="zwh-btn-ghost" @click="duplicateLink(active)">Duplicate</button>
            <button v-if="active.status === 'active'" class="zwh-btn-ghost" style="color:var(--zg-danger);border-color:oklch(0.70 0.18 25 / 0.4);" @click="deactivateLink(active)">Deactivate</button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Link Modal -->
    <Teleport to="body">
      <div v-if="newOpen" class="zsl-modal-backdrop" @click="newOpen = false">
        <div class="zsl-modal" @click.stop>
          <div class="zsl-modal-head">
            <span class="zsl-modal-title">New Short Link</span>
            <button class="zsl-modal-close" @click="newOpen = false">×</button>
          </div>
          <div class="zsl-modal-body">
            <!-- Slug -->
            <div class="zsl-slug-preview">
              <span class="zsl-url-base">{{ BASE }}/</span>
              <input v-model="newForm.slug" placeholder="your-slug" class="zsl-slug-input" @input="newForm.slug = newForm.slug.replace(/[^a-z0-9-_]/g,'')" />
            </div>
            <!-- Dest -->
            <div class="zsl-utm-field">
              <label class="zsl-utm-label">Destination URL / Deep Link</label>
              <input v-model="newForm.dest" placeholder="https://zucci.com/… or app://zucci/…" class="zsl-utm-input is-mono" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div class="zsl-utm-field">
                <label class="zsl-utm-label">Link Type</label>
                <select v-model="newForm.type" class="zsl-utm-input">
                  <option value="page">Page</option>
                  <option value="campaign">Campaign</option>
                  <option value="deeplink">Deep Link</option>
                  <option value="affiliate">Affiliate</option>
                </select>
              </div>
              <div class="zsl-utm-field">
                <label class="zsl-utm-label">Group / Campaign</label>
                <input v-model="newForm.group" placeholder="e.g. Eid 2025" class="zsl-utm-input" />
              </div>
              <div class="zsl-utm-field">
                <label class="zsl-utm-label">Expiry Date (optional)</label>
                <input type="date" v-model="newForm.expiry" class="zsl-utm-input" />
              </div>
            </div>
            <!-- UTM toggle -->
            <label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:var(--zg-text-mid);cursor:pointer;">
              <button class="zch-toggle" :class="{ 'is-on': newForm.has_utm }" @click="newForm.has_utm = !newForm.has_utm" style="flex-shrink:0;">
                <div class="zch-toggle-knob" />
              </button>
              Add UTM Parameters
            </label>
            <div v-if="newForm.has_utm" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
              <div v-for="k in ['utm_source','utm_medium','utm_campaign']" :key="k" class="zsl-utm-field">
                <label class="zsl-utm-label" style="font-family:var(--zg-mono);">{{ k }}</label>
                <input v-model="newForm[k.replace('utm_','')]" :placeholder="k.split('_')[1]" class="zsl-utm-input is-mono" />
              </div>
            </div>
          </div>
          <div class="zsl-modal-foot">
            <button class="zwh-btn-primary" :disabled="!newForm.slug || !newForm.dest" :style="{ opacity: newForm.slug && newForm.dest ? 1 : 0.4 }" @click="createLink">Create Link</button>
            <button class="zwh-btn-ghost" @click="newOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.zsl-wrap { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.zwh-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--zg-line); flex-shrink: 0; flex-wrap: wrap; }
.zwh-header-left { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.zwh-title { font-size: 16px; font-weight: 700; color: var(--zg-text); }
.zwh-subtitle { font-size: 11.5px; color: var(--zg-text-dim); }
.zsl-domain-badge { font-family: var(--zg-mono); font-size: 12px; padding: 2px 8px; background: oklch(0.78 0.18 130 / 0.1); color: var(--zg-accent); border-radius: 3px; font-weight: 700; }

.zsl-tab { height: 32px; padding: 0 14px; border: none; background: transparent; font-size: 12.5px; cursor: pointer; color: var(--zg-text-dim); border-bottom: 2px solid transparent; font-weight: 400; }
.zsl-tab.is-active { color: var(--zg-accent); border-bottom-color: var(--zg-accent); font-weight: 600; }

.zwh-kpi-strip { display: flex; align-items: stretch; border-bottom: 1px solid var(--zg-line); background: var(--zg-panel); flex-shrink: 0; }
.zwh-kpi-cell { flex: 1; padding: 8px 16px; border-right: 1px solid var(--zg-line); display: flex; flex-direction: column; gap: 2px; }
.zwh-kpi-cell:last-child { border-right: none; }
.zwh-kpi-lbl { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); font-weight: 600; }
.zwh-kpi-val { font-family: var(--zg-mono); font-size: 18px; font-weight: 800; color: var(--zg-text); }
.zwh-kpi-val.is-accent { color: var(--zg-accent); }
.zwh-kpi-val.is-good { color: var(--zg-good); }

.zsl-body { flex: 1; display: flex; min-height: 0; }
.zsl-content { flex: 1; overflow-y: auto; padding: 20px; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }

/* List panel */
.zsl-list-panel { width: 320px; flex-shrink: 0; border-right: 1px solid var(--zg-line); display: flex; flex-direction: column; min-height: 0; }
.zsl-list-toolbar { padding: 8px 12px; border-bottom: 1px solid var(--zg-line); display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
.zsl-search { width: 100%; height: 28px; padding-left: 24px; padding-right: 8px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-size: 12px; color: var(--zg-text); outline: none; box-sizing: border-box; }
.zsl-divider { width: 1px; height: 16px; background: var(--zg-line); align-self: center; }
.zsl-list-scroll { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }
.zsl-link-row { padding: 9px 16px; border-bottom: 1px solid var(--zg-line); background: var(--zg-panel); cursor: pointer; display: flex; gap: 10px; align-items: flex-start; transition: background .1s; }
.zsl-link-row:hover { background: var(--zg-panel-hi); }
.zsl-link-row.is-active { background: var(--zg-panel-hi); border-left: 2px solid var(--zg-accent); }
.zsl-list-foot { padding: 6px 12px; border-top: 1px solid var(--zg-line); font-size: 11px; color: var(--zg-text-dim); flex-shrink: 0; }

.zsl-slug { font-family: var(--zg-mono); font-size: 12px; font-weight: 700; color: var(--zg-accent); }
.zsl-type-badge { height: 16px; padding: 0 5px; border-radius: 2px; font-size: 9.5px; font-weight: 700; display: inline-flex; align-items: center; }
.zsl-expired-badge { height: 16px; padding: 0 5px; border-radius: 2px; font-size: 9.5px; font-weight: 600; background: var(--zg-panel-hi); color: var(--zg-danger); display: inline-flex; align-items: center; }
.zsl-dest { font-size: 11px; color: var(--zg-text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.zsl-meta { font-size: 10.5px; color: var(--zg-text-dim); margin-top: 2px; }

/* Detail panel */
.zsl-detail-panel { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.zsl-empty { display: flex; align-items: center; justify-content: center; height: 100%; font-size: 13px; color: var(--zg-text-dim); }
.zsl-detail-scroll { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; display: flex; flex-direction: column; gap: 14px; padding: 20px; }
.zsl-detail-card { background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 14px; }
.zsl-detail-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); font-weight: 600; margin-bottom: 8px; }
.zsl-url-display { flex: 1; display: flex; align-items: center; gap: 2px; padding: 8px 12px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); }
.zsl-url-base { font-family: var(--zg-mono); font-size: 15px; font-weight: 700; color: var(--zg-text); }
.zsl-url-slug { font-family: var(--zg-mono); font-size: 15px; font-weight: 700; color: var(--zg-accent); }
.zsl-dest-val { font-family: var(--zg-mono); font-size: 11.5px; color: var(--zg-text-mid); word-break: break-all; line-height: 1.4; }

.zsl-qr-placeholder { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.zsl-qr-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 1px; width: 60px; height: 60px; border-radius: 4px; overflow: hidden; }
.zsl-qr-cell { background: var(--zg-panel-hi); }
.zsl-qr-cell.is-on { background: var(--zg-accent); }
.zsl-qr-dl { height: 18px; padding: 0 6px; border: 1px solid var(--zg-line); border-radius: 2px; background: transparent; cursor: pointer; font-size: 9.5px; color: var(--zg-text-dim); }

.zsl-stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.zsl-stat-box { background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 12px; text-align: center; }
.zsl-stat-val { font-family: var(--zg-mono); font-size: 20px; font-weight: 800; color: var(--zg-text); margin-bottom: 2px; }
.zsl-stat-lbl { font-size: 10.5px; color: var(--zg-text-dim); }

.zsl-market-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.zsl-market-code { font-family: var(--zg-mono); font-size: 11px; font-weight: 700; color: var(--zg-text); width: 28px; flex-shrink: 0; }
.zsl-market-bar-bg { flex: 1; height: 6px; background: var(--zg-panel-hi); border-radius: 3px; overflow: hidden; }
.zsl-market-bar-fill { height: 100%; background: var(--zg-accent); border-radius: 3px; transition: width .4s; }
.zsl-market-num { font-family: var(--zg-mono); font-size: 11px; color: var(--zg-text-mid); width: 90px; text-align: right; flex-shrink: 0; }

.zsl-utm-params { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.zsl-utm-key { font-size: 9.5px; color: var(--zg-text-dim); font-weight: 600; margin-bottom: 2px; }
.zsl-utm-val { font-family: var(--zg-mono); font-size: 12px; font-weight: 600; color: var(--zg-text); }

/* Analytics grid */
.zsl-analytics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 14px; }
.zsl-analytics-card { background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 14px; }

/* Campaigns */
.zsl-table { border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden; }
.zsl-table-head { display: grid; grid-template-columns: 1fr 80px 120px 120px 80px; padding: 0 14px; height: 30px; background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line); font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); font-weight: 600; align-items: center; gap: 10px; }
.zsl-table-row { display: grid; grid-template-columns: 1fr 80px 120px 120px 80px; padding: 9px 14px; background: var(--zg-panel); border-bottom: 1px solid var(--zg-line); align-items: center; font-size: 12px; gap: 10px; }
.zsl-cell-name { font-weight: 600; color: var(--zg-text); }
.zsl-mono { font-family: var(--zg-mono); font-size: 11.5px; }
.zsl-dim { font-size: 11px; color: var(--zg-text-dim); }

/* UTM builder */
.zsl-utm-wrap { max-width: 680px; }
.zsl-utm-form { display: flex; flex-direction: column; gap: 12px; }
.zsl-utm-field { display: flex; flex-direction: column; gap: 4px; }
.zsl-utm-label { font-size: 11px; font-weight: 600; color: var(--zg-text-mid); font-family: var(--zg-mono); }
.zsl-utm-input { height: 32px; padding: 0 10px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-size: 12px; color: var(--zg-text); outline: none; }
.zsl-utm-input.is-mono { font-family: var(--zg-mono); }
.zsl-utm-preview-box { background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 12px; }
.zsl-utm-preview-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--zg-text-dim); font-weight: 600; margin-bottom: 6px; }
.zsl-utm-preview-url { font-family: var(--zg-mono); font-size: 11px; color: var(--zg-accent); word-break: break-all; line-height: 1.5; }

/* Modal */
.zsl-modal-backdrop { position: fixed; inset: 0; z-index: 9998; background: oklch(0.1 0.01 250 / 0.7); display: flex; align-items: center; justify-content: center; }
.zsl-modal { width: 560px; background: var(--zg-bg-elev); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-lg, 10px); overflow: hidden; max-height: 90vh; display: flex; flex-direction: column; }
.zsl-modal-head { padding: 16px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between; }
.zsl-modal-title { font-size: 14px; font-weight: 700; color: var(--zg-text); }
.zsl-modal-close { width: 28px; height: 28px; border: none; background: var(--zg-panel); border-radius: 4px; cursor: pointer; color: var(--zg-text-dim); font-size: 16px; }
.zsl-modal-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex: 1; }
.zsl-modal-foot { padding: 12px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; }

.zsl-slug-preview { display: flex; align-items: center; gap: 4px; padding: 10px 12px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); }
.zsl-slug-input { flex: 1; border: none; background: transparent; font-family: var(--zg-mono); font-size: 14px; font-weight: 700; color: var(--zg-accent); outline: none; }

/* Toggle (reuse from channels) */
.zch-toggle { width: 34px; height: 18px; border-radius: 9px; border: none; cursor: pointer; background: var(--zg-line); position: relative; transition: background .14s; }
.zch-toggle.is-on { background: var(--zg-accent); }
.zch-toggle-knob { width: 13px; height: 13px; border-radius: 50%; background: #fff; position: absolute; top: 2.5px; left: 2px; transition: left .14s; }
.zch-toggle.is-on .zch-toggle-knob { left: 17.5px; }

/* Shared */
.zwh-filter-chip { height: 28px; padding: 0 10px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 11.5px; color: var(--zg-text-dim); white-space: nowrap; }
.zwh-filter-chip.is-active { background: var(--zg-panel-hi); color: var(--zg-text); border-color: var(--zg-accent); }
.zwh-btn-primary { height: 32px; padding: 0 14px; border: none; border-radius: var(--zg-radius-md); background: var(--zg-accent); color: oklch(0.18 0.04 130); font-weight: 700; font-size: 12px; cursor: pointer; }
.zwh-btn-ghost { height: 32px; padding: 0 14px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: transparent; color: var(--zg-text-mid); font-size: 12px; cursor: pointer; }
.zcat-act { height: 24px; padding: 0 8px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 11px; color: var(--zg-text-dim); }
</style>
