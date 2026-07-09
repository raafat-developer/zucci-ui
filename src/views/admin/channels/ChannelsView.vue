<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const tab = ref(route.query.tab || 'homepage');
watch(() => route.query.tab, v => { if (v) tab.value = v; });

const TABS = [
  ['homepage',   'Homepage Config'],
  ['pages',      'Page Builder'],
  ['navigation', 'Navigation Menus'],
  ['seo',        'SEO & Meta'],
  ['redirects',  'Redirects'],
];

// ── Data ─────────────────────────────────────────────────
const HOMEPAGE_BLOCKS = ref([
  { id:'hb1', label:'Hero Banner',         enabled:true,  order:1, type:'hero',      note:'Full-width rotating banners' },
  { id:'hb2', label:'Featured Categories', enabled:true,  order:2, type:'grid',      note:'Top 6 categories' },
  { id:'hb3', label:'Flash Sale Strip',    enabled:true,  order:3, type:'strip',     note:'Countdown timer + deal tiles' },
  { id:'hb4', label:'New Arrivals',        enabled:true,  order:4, type:'carousel',  note:'Latest 12 products' },
  { id:'hb5', label:'Brand Spotlight',     enabled:true,  order:5, type:'spotlight', note:'Featured vendor of the week' },
  { id:'hb6', label:'Trending Now',        enabled:true,  order:6, type:'carousel',  note:'AI-personalised trending' },
  { id:'hb7', label:'Loyalty Banner',      enabled:false, order:7, type:'banner',    note:'Points & rewards promo' },
  { id:'hb8', label:'Blog Highlights',     enabled:false, order:8, type:'grid',      note:'3 latest articles' },
]);
const homepageMarket = ref('AE');

const PAGES = ref([
  { id:'pg1', title:'About Zucci',     slug:'/about',    status:'published', template:'Static',   last_edit:'Jun 1, 2025',  author:'Sara Medhat',  markets:'all' },
  { id:'pg2', title:'Careers',         slug:'/careers',  status:'published', template:'Static',   last_edit:'May 28, 2025', author:'Admin',        markets:'all' },
  { id:'pg3', title:'Press & Media',   slug:'/press',    status:'published', template:'Static',   last_edit:'May 20, 2025', author:'Admin',        markets:'all' },
  { id:'pg4', title:'Returns Policy',  slug:'/returns',  status:'published', template:'Policy',   last_edit:'Apr 15, 2025', author:'Sara Medhat',  markets:'all' },
  { id:'pg5', title:'Privacy Policy',  slug:'/privacy',  status:'published', template:'Policy',   last_edit:'Apr 10, 2025', author:'Legal',        markets:'all' },
  { id:'pg6', title:'Eid Sale 2025',   slug:'/eid-2025', status:'published', template:'Campaign', last_edit:'Jun 2, 2025',  author:'Nada Ibrahim', markets:'AE,SA' },
  { id:'pg7', title:'SA Summer Drop',  slug:'/sa-drop',  status:'draft',     template:'Campaign', last_edit:'Jun 3, 2025',  author:'Nada Ibrahim', markets:'SA' },
  { id:'pg8', title:'VIP Landing',     slug:'/vip',      status:'published', template:'Custom',   last_edit:'May 15, 2025', author:'Admin',        markets:'AE' },
]);
const pageSearch = ref('');
const pageStatF  = ref('all');
const filteredPages = computed(() => {
  const sq = pageSearch.value.toLowerCase();
  return PAGES.value.filter(p =>
    (pageStatF.value === 'all' || p.status === pageStatF.value) &&
    (!sq || p.title.toLowerCase().includes(sq) || p.slug.toLowerCase().includes(sq))
  );
});

const NAV_MENUS = ref([
  { id:'m1', name:'Main Navigation (Desktop)', items:['Home','Women','Men','Kids','Beauty','Shoes','Sale'], markets:['AE','SA','EG','QA'] },
  { id:'m2', name:'Main Navigation (Mobile)',  items:['Home','Women','Men','Beauty','Sale'],                markets:['AE','SA','EG','QA'] },
  { id:'m3', name:'Footer — Quick Links',      items:['About Us','Careers','Press','Contact'],             markets:['AE','SA','EG','QA'] },
  { id:'m4', name:'Footer — Help',             items:['FAQs','Returns','Shipping','Size Guide'],            markets:['AE','SA','EG','QA'] },
]);
const activeMenu = ref('m1');
const menuItems  = computed(() => NAV_MENUS.value.find(m => m.id === activeMenu.value)?.items || []);
const localItems = ref([...menuItems.value]);
watch(activeMenu, () => { localItems.value = [...menuItems.value]; });

const SEO_CONFIGS = {
  AE: { title:'Zucci — Fashion Marketplace UAE',     desc:'Shop the latest fashion from top brands in the UAE.',    og_image:'og-ae.jpg', hreflang:'en-AE,ar-AE' },
  SA: { title:'زوتشي — بوابة الأزياء السعودية',      desc:'تسوق أحدث صيحات الموضة من أفضل الماركات في السعودية.', og_image:'og-sa.jpg', hreflang:'ar-SA,en-SA' },
  EG: { title:'Zucci — Fashion Marketplace Egypt',   desc:'Shop the latest fashion from top brands in Egypt.',      og_image:'og-eg.jpg', hreflang:'ar-EG,en-EG' },
  QA: { title:'Zucci — Fashion Marketplace Qatar',   desc:'Shop the latest fashion from top brands in Qatar.',      og_image:'og-qa.jpg', hreflang:'en-QA,ar-QA' },
};
const seoMarket = ref('AE');
const seoForm   = ref({ ...SEO_CONFIGS.AE });
watch(seoMarket, m => { seoForm.value = { ...SEO_CONFIGS[m] || SEO_CONFIGS.AE }; });

const REDIRECTS = ref([
  { id:'r1', from:'/old-womens',     to:'/womens-fashion',         type:'301', hits:2841,  created:'Jan 2025' },
  { id:'r2', from:'/collection/eid', to:'/collections/eid-2025',   type:'302', hits:18410, created:'May 2025' },
  { id:'r3', from:'/shop',           to:'/',                       type:'301', hits:8420,  created:'Jan 2025' },
  { id:'r4', from:'/sale-sa',        to:'/sa/sale',                type:'301', hits:4210,  created:'Mar 2025' },
  { id:'r5', from:'/brands',         to:'/marketplace',            type:'301', hits:1241,  created:'Feb 2025' },
]);

// ── Actions ───────────────────────────────────────────────
function toggleBlock(id) {
  const b = HOMEPAGE_BLOCKS.value.find(b => b.id === id);
  if (b) b.enabled = !b.enabled;
}
function moveBlock(i, dir) {
  const arr = HOMEPAGE_BLOCKS.value;
  const j = dir === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
function moveNavItem(i, dir) {
  const arr = localItems.value;
  const j = dir === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
function removeNavItem(i) { localItems.value.splice(i, 1); }
function deleteRedirect(id) { REDIRECTS.value = REDIRECTS.value.filter(r => r.id !== id); }
function publishPage(id) {
  const p = PAGES.value.find(p => p.id === id);
  if (p) p.status = 'published';
}
</script>

<template>
  <div class="zch-wrap">
    <!-- Header -->
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div class="zwh-title">Channels</div>
        <div class="zwh-subtitle">Storefront configuration — pages, navigation, SEO, and redirects</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="zch-tabs">
      <button v-for="[v, l] in TABS" :key="v" class="zch-tab" :class="{ 'is-active': tab === v }" @click="tab = v">{{ l }}</button>
    </div>

    <!-- Content -->
    <div class="zch-content">

      <!-- Homepage Config -->
      <div v-if="tab === 'homepage'" class="zcat-content">
        <div class="zch-toolbar">
          <div class="zch-chips">
            <button v-for="m in ['AE','SA','EG','QA']" :key="m" class="zwh-filter-chip" :class="{ 'is-active': homepageMarket === m }" @click="homepageMarket = m">{{ m }}</button>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="zwh-btn-ghost" @click="">Preview</button>
            <button class="zwh-btn-primary" @click="">Save Changes</button>
          </div>
        </div>
        <div class="zch-table">
          <div class="zch-table-head" style="grid-template-columns:32px 28px 1fr 80px 1fr 80px">
            <span>#</span><span></span><span>Block</span><span>Type</span><span>Note</span><span>Enabled</span>
          </div>
          <div v-for="(b, i) in HOMEPAGE_BLOCKS" :key="b.id" class="zch-table-row" style="grid-template-columns:32px 28px 1fr 80px 1fr 80px">
            <div class="zch-sort-btns">
              <button @click="moveBlock(i,'up')" :disabled="i===0" class="zch-sort-btn">
                <svg viewBox="0 0 8 6" width="8" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 5l3-4 3 4"/></svg>
              </button>
              <button @click="moveBlock(i,'down')" :disabled="i===HOMEPAGE_BLOCKS.length-1" class="zch-sort-btn">
                <svg viewBox="0 0 8 6" width="8" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 1l3 4 3-4"/></svg>
              </button>
            </div>
            <div class="zch-drag-handle">
              <svg viewBox="0 0 8 12" width="8" fill="currentColor"><circle cx="2" cy="2" r="1.1"/><circle cx="6" cy="2" r="1.1"/><circle cx="2" cy="6" r="1.1"/><circle cx="6" cy="6" r="1.1"/><circle cx="2" cy="10" r="1.1"/><circle cx="6" cy="10" r="1.1"/></svg>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="zch-block-label" :class="{ 'is-dim': !b.enabled }">{{ b.label }}</span>
              <button class="zcat-act" @click="">Config</button>
            </div>
            <span class="zch-type-badge">{{ b.type }}</span>
            <span class="zch-note">{{ b.note }}</span>
            <button class="zch-toggle" :class="{ 'is-on': b.enabled }" @click="toggleBlock(b.id)">
              <div class="zch-toggle-knob" />
            </button>
          </div>
        </div>
      </div>

      <!-- Page Builder -->
      <div v-if="tab === 'pages'" class="zcat-content">
        <div class="zch-toolbar">
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
            <div style="position:relative;">
              <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:7px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
              <input v-model="pageSearch" placeholder="Search pages…" class="zch-search" />
            </div>
            <button v-for="[v,l] in [['all','All'],['published','Published'],['draft','Drafts']]" :key="v" class="zwh-filter-chip" :class="{ 'is-active': pageStatF === v }" @click="pageStatF = v">{{ l }}</button>
          </div>
          <button class="zwh-btn-primary" @click="">+ New Page</button>
        </div>
        <div class="zch-table">
          <div class="zch-table-head" style="grid-template-columns:1fr 140px 80px 80px 100px 100px 80px">
            <span>Page Title</span><span>URL Slug</span><span>Template</span><span>Markets</span><span>Status</span><span>Last Edit</span><span>Actions</span>
          </div>
          <div v-for="p in filteredPages" :key="p.id" class="zch-table-row" style="grid-template-columns:1fr 140px 80px 80px 100px 100px 80px">
            <span class="zch-cell-name">{{ p.title }}</span>
            <span class="zch-mono zch-dim">{{ p.slug }}</span>
            <span class="zch-dim">{{ p.template }}</span>
            <span class="zch-dim">{{ p.markets }}</span>
            <span class="zch-status-badge" :class="p.status === 'published' ? 'is-good' : 'is-warn'">{{ p.status }}</span>
            <span class="zch-xdim">{{ p.last_edit }}</span>
            <div style="display:flex;gap:4px;">
              <button class="zcat-act" @click="">Edit</button>
              <button v-if="p.status === 'draft'" class="zcat-act" style="color:var(--zg-good)" @click="publishPage(p.id)">Publish</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Menus -->
      <div v-if="tab === 'navigation'" class="zcat-content zch-nav-grid">
        <div>
          <div class="zch-section-lbl">Menus</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <button v-for="m in NAV_MENUS" :key="m.id" class="zch-menu-btn" :class="{ 'is-active': activeMenu === m.id }" @click="activeMenu = m.id">
              <div class="zch-menu-name">{{ m.name }}</div>
              <div class="zch-menu-markets">{{ m.markets.join(', ') }}</div>
            </button>
            <button class="zwh-btn-ghost" style="margin-top:4px;" @click="">+ Add Menu</button>
          </div>
        </div>
        <div>
          <div class="zch-toolbar" style="margin-bottom:12px;">
            <span class="zch-section-lbl" style="margin-bottom:0;">{{ NAV_MENUS.find(m=>m.id===activeMenu)?.name }}</span>
            <div style="display:flex;gap:6px;">
              <button class="zwh-btn-ghost" style="height:28px;font-size:11px;" @click="">+ Add Item</button>
              <button class="zwh-btn-primary" style="height:28px;font-size:11px;" @click="">Save</button>
            </div>
          </div>
          <div class="zch-table">
            <div v-for="(item, i) in localItems" :key="item+i" class="zch-nav-row">
              <div class="zch-drag-handle">
                <svg viewBox="0 0 8 12" width="8" fill="currentColor"><circle cx="2" cy="2" r="1.1"/><circle cx="6" cy="2" r="1.1"/><circle cx="2" cy="6" r="1.1"/><circle cx="6" cy="6" r="1.1"/><circle cx="2" cy="10" r="1.1"/><circle cx="6" cy="10" r="1.1"/></svg>
              </div>
              <span class="zch-nav-label">{{ item }}</span>
              <div style="display:flex;gap:4px;">
                <button @click="moveNavItem(i,'up')" :disabled="i===0" class="zch-arr-btn">
                  <svg viewBox="0 0 8 8" width="8" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7V1M1 4l3-3 3 3"/></svg>
                </button>
                <button @click="moveNavItem(i,'down')" :disabled="i===localItems.length-1" class="zch-arr-btn">
                  <svg viewBox="0 0 8 8" width="8" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 1v6M1 4l3 3 3-3"/></svg>
                </button>
                <button class="zcat-act" @click="">Edit</button>
                <button class="zcat-act danger" @click="removeNavItem(i)">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEO & Meta -->
      <div v-if="tab === 'seo'" class="zcat-content">
        <div class="zch-chips" style="margin-bottom:16px;">
          <button v-for="m in ['AE','SA','EG','QA','KW','BH','OM']" :key="m" class="zwh-filter-chip" :class="{ 'is-active': seoMarket === m }" @click="seoMarket = m">{{ m }}</button>
        </div>
        <div class="zch-seo-form">
          <div v-for="[label, key, max] in [['Meta Title (Homepage)','title',60],['Meta Description','desc',160],['Hreflang Tags','hreflang',0],['OG Image Filename','og_image',0]]" :key="key" class="zch-field">
            <label class="zch-label">{{ label }}</label>
            <input v-model="seoForm[key]" class="zch-input" />
            <span v-if="max" class="zch-char-count" :class="{ 'is-over': seoForm[key]?.length > max }">{{ seoForm[key]?.length || 0 }}/{{ max }} chars</span>
          </div>
          <button class="zwh-btn-primary" style="width:fit-content;" @click="">Save SEO Config</button>
        </div>
      </div>

      <!-- Redirects -->
      <div v-if="tab === 'redirects'" class="zcat-content">
        <div class="zch-toolbar" style="margin-bottom:12px;">
          <div />
          <div style="display:flex;gap:6px;">
            <button class="zwh-btn-ghost" @click="">Bulk Import</button>
            <button class="zwh-btn-primary" @click="">+ Add Redirect</button>
          </div>
        </div>
        <div class="zch-table">
          <div class="zch-table-head" style="grid-template-columns:1fr 1fr 60px 70px 80px 80px">
            <span>From</span><span>To</span><span>Type</span><span>Hits</span><span>Created</span><span>Actions</span>
          </div>
          <div v-for="r in REDIRECTS" :key="r.id" class="zch-table-row" style="grid-template-columns:1fr 1fr 60px 70px 80px 80px">
            <span class="zch-mono">{{ r.from }}</span>
            <span class="zch-mono" style="color:var(--zg-accent);">{{ r.to }}</span>
            <span class="zch-redir-type" :class="r.type === '301' ? 'is-good' : 'is-warn'">{{ r.type }}</span>
            <span class="zch-mono zch-dim">{{ r.hits.toLocaleString() }}</span>
            <span class="zch-dim">{{ r.created }}</span>
            <div style="display:flex;gap:4px;">
              <button class="zcat-act" @click="">Edit</button>
              <button class="zcat-act danger" @click="deleteRedirect(r.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.zch-wrap { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.zwh-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--zg-line); flex-shrink: 0; }
.zwh-header-left { display: flex; flex-direction: column; gap: 2px; }
.zwh-title { font-size: 16px; font-weight: 700; color: var(--zg-text); }
.zwh-subtitle { font-size: 11.5px; color: var(--zg-text-dim); }

.zch-tabs { display: flex; border-bottom: 1px solid var(--zg-line); background: var(--zg-bg-elev); flex-shrink: 0; padding: 0 20px; }
.zch-tab { height: 40px; padding: 0 14px; border: none; background: transparent; font-size: 12.5px; cursor: pointer; color: var(--zg-text-dim); border-bottom: 2px solid transparent; margin-bottom: -1px; font-weight: 400; transition: color .1s; }
.zch-tab.is-active { color: var(--zg-accent); border-bottom-color: var(--zg-accent); font-weight: 600; }

.zch-content { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }
.zcat-content { padding: 16px 20px; }

.zch-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.zch-chips { display: flex; gap: 5px; flex-wrap: wrap; }
.zch-search { height: 28px; padding-left: 24px; padding-right: 8px; width: 200px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-size: 12px; color: var(--zg-text); outline: none; }

.zch-table { border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden; }
.zch-table-head { display: grid; padding: 0 14px; height: 30px; background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line); font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); font-weight: 600; align-items: center; gap: 10px; }
.zch-table-row { display: grid; padding: 9px 14px; background: var(--zg-panel); border-bottom: 1px solid var(--zg-line, #1c1f24); align-items: center; font-size: 12px; gap: 10px; }
.zch-table-row:last-child { border-bottom: none; }
.zch-table-row:nth-child(odd) { background: var(--zg-bg); }

.zch-sort-btns { display: flex; flex-direction: column; gap: 2px; }
.zch-sort-btn { width: 14px; height: 14px; border: none; background: transparent; cursor: pointer; color: var(--zg-text-dim); padding: 0; display: flex; align-items: center; justify-content: center; }
.zch-sort-btn:disabled { opacity: 0.2; cursor: not-allowed; }
.zch-drag-handle { cursor: grab; color: var(--zg-text-dim); display: flex; align-items: center; }

.zch-block-label { font-size: 13px; font-weight: 600; color: var(--zg-text); }
.zch-block-label.is-dim { color: var(--zg-text-dim); }
.zch-type-badge { font-size: 10.5px; padding: 1px 5px; border-radius: 2px; background: var(--zg-panel-hi); border: 1px solid var(--zg-line); color: var(--zg-text-dim); font-family: var(--zg-mono); }
.zch-note { font-size: 11px; color: var(--zg-text-dim); }
.zch-toggle { width: 34px; height: 18px; border-radius: 9px; border: none; cursor: pointer; background: var(--zg-line); position: relative; transition: background .14s; }
.zch-toggle.is-on { background: var(--zg-accent); }
.zch-toggle-knob { width: 13px; height: 13px; border-radius: 50%; background: #fff; position: absolute; top: 2.5px; left: 2px; transition: left .14s; }
.zch-toggle.is-on .zch-toggle-knob { left: 17.5px; }

.zch-cell-name { font-weight: 600; color: var(--zg-text); }
.zch-mono { font-family: var(--zg-mono); font-size: 11.5px; }
.zch-dim { font-size: 11px; color: var(--zg-text-dim); }
.zch-xdim { font-size: 11px; color: var(--zg-text-dim); }
.zch-status-badge { font-size: 11px; font-weight: 600; }
.zch-status-badge.is-good { color: var(--zg-good); }
.zch-status-badge.is-warn { color: var(--zg-warn); }

.zch-nav-grid { display: grid; grid-template-columns: 260px 1fr; gap: 16px; }
.zch-section-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); margin-bottom: 8px; }
.zch-menu-btn { padding: 8px 12px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: var(--zg-panel); cursor: pointer; text-align: left; font-size: 12px; transition: all .1s; color: var(--zg-text-mid); width: 100%; margin-bottom: 4px; }
.zch-menu-btn.is-active { border-color: var(--zg-accent); background: oklch(0.78 0.18 130 / 0.08); color: var(--zg-accent); }
.zch-menu-name { font-weight: 600; margin-bottom: 2px; }
.zch-menu-markets { font-size: 10.5px; opacity: 0.7; }
.zch-nav-row { display: flex; align-items: center; gap: 10px; padding: 9px 14px; background: var(--zg-panel); border-bottom: 1px solid var(--zg-line); }
.zch-nav-label { flex: 1; font-size: 13px; font-weight: 500; color: var(--zg-text); }
.zch-arr-btn { width: 22px; height: 22px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; color: var(--zg-text-dim); display: flex; align-items: center; justify-content: center; }
.zch-arr-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.zch-seo-form { display: flex; flex-direction: column; gap: 12px; max-width: 680px; }
.zch-field { display: flex; flex-direction: column; gap: 4px; }
.zch-label { font-size: 11px; font-weight: 600; color: var(--zg-text-mid); }
.zch-input { height: 32px; padding: 0 10px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-size: 12px; color: var(--zg-text); outline: none; }
.zch-char-count { font-size: 10.5px; color: var(--zg-text-dim); }
.zch-char-count.is-over { color: var(--zg-danger); }

.zch-redir-type { font-size: 11px; padding: 1px 5px; border-radius: 2px; background: var(--zg-panel-hi); border: 1px solid var(--zg-line); font-family: var(--zg-mono); font-weight: 700; }
.zch-redir-type.is-good { color: var(--zg-good); }
.zch-redir-type.is-warn { color: var(--zg-warn); }

.zwh-filter-chip { height: 28px; padding: 0 10px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 11.5px; color: var(--zg-text-dim); white-space: nowrap; }
.zwh-filter-chip.is-active { background: var(--zg-panel-hi); color: var(--zg-text); border-color: var(--zg-accent); }
.zwh-btn-primary { height: 32px; padding: 0 14px; border: none; border-radius: var(--zg-radius-md); background: var(--zg-accent); color: oklch(0.18 0.04 130); font-weight: 700; font-size: 12px; cursor: pointer; }
.zwh-btn-ghost { height: 32px; padding: 0 14px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: transparent; color: var(--zg-text-mid); font-size: 12px; cursor: pointer; }
.zcat-act { height: 24px; padding: 0 8px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 11px; color: var(--zg-text-dim); }
.zcat-act.danger { color: var(--zg-danger); border-color: oklch(0.70 0.18 25 / 0.4); }
</style>
