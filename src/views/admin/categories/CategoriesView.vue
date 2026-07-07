<script setup>
/**
 * CategoriesView — Products + Marketplace categories. Faithful port of
 * ZucciCategoriesModule: KPI strip, market filter chips, below-minimum flags,
 * Products tree (drag-to-reorder, expand children, inline status toggle,
 * per-market stats, add/edit/sub/delete) and Marketplace table (mapping,
 * commission, expand children). Category drawer + bulk import wired.
 * `?type=products|marketplace` selects the panel.
 */
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ZC_CATEGORIES, ZC_MARKETPLACE_CATS } from '@/data/categoriesData';
import CategoryDrawer from './CategoryDrawer.vue';
import CategoryBulkImport from './CategoryBulkImport.vue';
import { toast } from '@/composables/useToast';

const MKTS = ['AE','SA','EG','KW','BH','QA','OM'];
const route = useRoute();
const isMarketplace = computed(() => route.query.type === 'marketplace');

// ── helpers ──
const belowMin = (cat, m) => { const ms = cat.markets?.[m]; return ms?.enabled && ms.listing_count < ms.min_listings; };
const anyBelowMin = (cat) => MKTS.some((m) => belowMin(cat, m));
const belowMinCount = (list) => list.reduce((s, c) => s + MKTS.filter((m) => belowMin(c, m)).length, 0);
const clone = (arr) => arr.map((c) => ({ ...c, children: (c.children || []).map((ch) => ({ ...ch })) }));

// ── state ──
const prodCats = ref(clone(ZC_CATEGORIES));
const mktCats = ref(clone(ZC_MARKETPLACE_CATS));
const expanded = ref({});
const statsFor = ref(null);
const mktFilter = ref('all');
const drawerOpen = ref(false);
const editCat = ref(null);
const parentCat = ref(null);
const importOpen = ref(false);

watch(isMarketplace, () => { expanded.value = {}; statsFor.value = null; mktFilter.value = 'all'; });

// drag-reorder (products)
const dragIdx = ref(null);
const onDragStart = (i) => { dragIdx.value = i; };
const onDrop = (i) => { if (dragIdx.value === null || dragIdx.value === i) { dragIdx.value = null; return; } const n = [...prodCats.value]; const [m] = n.splice(dragIdx.value, 1); n.splice(i, 0, m); prodCats.value = n; dragIdx.value = null; };

const cats = computed(() => (isMarketplace.value ? mktCats.value : prodCats.value));
const filtered = computed(() => mktFilter.value === 'all' ? cats.value : cats.value.filter((c) => (isMarketplace.value ? c.markets?.[mktFilter.value]?.enabled : c.markets?.[mktFilter.value])));
const INTL = ZC_CATEGORIES || [];

const toggle = (id) => { expanded.value = { ...expanded.value, [id]: !expanded.value[id] }; };
const openAdd = (par = null) => { editCat.value = null; parentCat.value = par; drawerOpen.value = true; };
const openEdit = (c) => { editCat.value = { ...c }; parentCat.value = null; drawerOpen.value = true; };
const openAddMkt = () => { editCat.value = { commission_pct:'', listing_requirements:[], requires_approval:false, markets:Object.fromEntries(MKTS.map((m) => [m, { enabled:false, min_listings:10, commission_pct:15 }])) }; parentCat.value = null; drawerOpen.value = true; };
const toggleStatus = (id, isChild, pid) => {
  prodCats.value = prodCats.value.map((c) => {
    if (!isChild && c.id === id) return { ...c, status: c.status === 'active' ? 'inactive' : 'active' };
    if (isChild && c.id === pid) return { ...c, children: c.children.map((ch) => ch.id === id ? { ...ch, status: ch.status === 'active' ? 'inactive' : 'active' } : ch) };
    return c;
  });
};
const del = (cat) => { if (confirm(`Delete "${cat.label}"?`)) { prodCats.value = prodCats.value.filter((c) => c.id !== cat.id); toast.warn(`"${cat.label}" deleted`); } };
const downloadCsv = () => toast.success('Exporting categories CSV…');

const tagStyle = (cat, m) => {
  const ms = cat.markets?.[m]; if (!ms) return null;
  const dim = mktFilter.value !== 'all' && mktFilter.value !== m;
  if (!ms.enabled) return { enabled:false, opacity: dim ? 0.3 : 0.6 };
  const below = belowMin(cat, m);
  return { enabled:true, below, opacity: dim ? 0.35 : 1 };
};

// KPIs
const kpis = computed(() => {
  const list = isMarketplace.value ? mktCats.value : prodCats.value;
  if (isMarketplace.value) return [
    ['Marketplace Cats', list.length, '', 'vendor-facing'],
    ['Mapped', list.filter((c) => c.mapped_to).length, 'is-good', 'linked to internal'],
    ['Approval Required', list.filter((c) => c.requires_approval).length, 'is-warn', 'need review'],
    ['Avg Commission', Math.round(list.reduce((s, c) => s + (c.commission_pct || 0), 0) / Math.max(1, list.length)) + '%', 'is-accent', 'across categories'],
    ['Total Listings', list.reduce((s, c) => s + (c.listing_count || 0), 0).toLocaleString(), '', 'active'],
    ['Below Min', belowMinCount(list), belowMinCount(list) > 0 ? 'is-warn' : '', 'market thresholds'],
  ];
  return [
    ['Total Categories', list.length + list.reduce((s, c) => s + (c.children?.length || 0), 0), '', 'all levels'],
    ['Top-level', list.length, '', 'parent categories'],
    ['Active', list.filter((c) => c.status === 'active').length, 'is-good', 'live on storefront'],
    ['Private', list.filter((c) => c.private).length, 'is-accent', 'B2B / VIP / hidden'],
    ['Total Products', list.reduce((s, c) => s + (c.product_count || 0), 0).toLocaleString(), '', 'across all'],
    ['Below Min', belowMinCount(list), belowMinCount(list) > 0 ? 'is-warn' : '', 'market thresholds'],
  ];
});
const statsCat = computed(() => {
  if (!statsFor.value) return null;
  for (const c of cats.value) { if (c.id === statsFor.value) return c; const ch = (c.children || []).find((x) => x.id === statsFor.value); if (ch) return ch; }
  return null;
});
const mkts = MKTS;
</script>

<template>
  <div class="zcat-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <span style="font-size:13px;font-weight:600;color:var(--zg-text)">{{ isMarketplace ? 'Marketplace Categories' : 'Categories' }}</span>
        <div class="zwh-subtitle">{{ isMarketplace ? `${mktCats.length} vendor-facing categories mapped to internal taxonomy` : `${prodCats.length} top-level · ${prodCats.reduce((s, c) => s + (c.children?.length || 0), 0)} sub-categories · internal taxonomy` }}</div>
      </div>
    </div>

    <div class="zwh-kpi-strip">
      <div v-for="[lbl, val, cls, sub] in kpis" :key="lbl" class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">{{ lbl }}</span>
        <span class="zwh-kpi-val" :class="cls">{{ val }}</span>
        <span class="zwh-kpi-sub">{{ sub }}</span>
      </div>
    </div>

    <div class="zcat-content">
      <!-- Toolbar -->
      <div style="display:flex;gap:6px;justify-content:space-between;flex-wrap:wrap;margin-bottom:12px">
        <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center">
          <button v-for="m in ['all', ...mkts]" :key="m" class="zwh-filter-chip" :class="{ 'is-active': mktFilter === m }" @click="mktFilter = m">{{ m === 'all' ? 'All Markets' : m }}</button>
          <span v-if="belowMinCount(cats) > 0" style="height:20px;padding:0 8px;background:oklch(0.70 0.18 25 / 0.1);border:1px solid oklch(0.70 0.18 25 / 0.3);border-radius:3px;font-size:10px;font-weight:700;color:var(--zg-danger);display:inline-flex;align-items:center">{{ belowMinCount(cats) }} below minimum</span>
        </div>
        <div style="display:flex;gap:6px">
          <button class="zwh-btn-ghost" @click="importOpen = true">Bulk Import</button>
          <button v-if="!isMarketplace" class="zwh-btn-ghost" @click="downloadCsv">Export CSV</button>
          <button class="zwh-btn-primary" @click="isMarketplace ? openAddMkt() : openAdd(null)">+ Add Category</button>
        </div>
      </div>

      <!-- Products tree -->
      <div v-if="!isMarketplace" class="zcat-tree">
        <template v-for="(cat, idx) in filtered" :key="cat.id">
          <div class="zcat-root-row" draggable="true" @dragstart="onDragStart(idx)" @dragover.prevent @drop.prevent="onDrop(idx)">
            <span class="zcat-drag-handle" title="Drag to reorder"><svg viewBox="0 0 8 12" width="8" fill="currentColor"><circle cx="2" cy="2" r="1.1" /><circle cx="6" cy="2" r="1.1" /><circle cx="2" cy="6" r="1.1" /><circle cx="6" cy="6" r="1.1" /><circle cx="2" cy="10" r="1.1" /><circle cx="6" cy="10" r="1.1" /></svg></span>
            <button v-if="cat.children?.length" class="zcat-expand-btn" @click="toggle(cat.id)"><svg class="zcat-expand-chevron" :class="{ open: expanded[cat.id] }" viewBox="0 0 8 12" width="7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 2l4 4-4 4" /></svg></button>
            <span v-else style="width:20px" />
            <span class="zcat-name">{{ cat.label }}</span>
            <span v-if="anyBelowMin(cat)" title="Some markets below minimum" style="width:16px;height:16px;border-radius:50%;background:var(--zg-danger);color:#fff;font-size:10px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">!</span>
            <span v-if="cat.private" class="zcat-badge private">Private</span>
            <div style="flex:1;min-width:0">
              <div style="display:flex;gap:3px;flex-wrap:wrap;align-items:center">
                <span v-for="m in mkts" :key="m" v-show="cat.markets?.[m]" :style="{ height:'16px', padding:'0 5px', borderRadius:'2px', fontSize:'9px', fontWeight: tagStyle(cat, m)?.enabled ? 700 : 600, fontFamily:'var(--zg-mono)', background: !tagStyle(cat, m)?.enabled ? 'var(--zg-panel-hi)' : tagStyle(cat, m)?.below ? 'oklch(0.70 0.18 25 / 0.12)' : 'var(--zg-accent-tint)', color: !tagStyle(cat, m)?.enabled ? 'var(--zg-text-xdim)' : tagStyle(cat, m)?.below ? 'var(--zg-danger)' : 'var(--zg-accent)', border: `1px solid ${!tagStyle(cat, m)?.enabled ? 'var(--zg-line)' : tagStyle(cat, m)?.below ? 'oklch(0.70 0.18 25 / 0.3)' : 'oklch(0.78 0.18 130 / 0.3)'}`, opacity: tagStyle(cat, m)?.opacity, display:'inline-flex', alignItems:'center', gap:'2px' }">{{ m }}<span v-if="tagStyle(cat, m)?.below" style="font-size:8px;font-weight:900">!</span></span>
              </div>
            </div>
            <span class="zcat-count">{{ (cat.product_count || 0).toLocaleString() }} products</span>
            <button class="zcat-toggle" :class="cat.status === 'active' ? 'on' : 'off'" @click.stop="toggleStatus(cat.id, false, null)"><div class="zcat-toggle-knob" /></button>
            <div class="zcat-row-actions">
              <button class="zcat-act" @click.stop="statsFor = statsFor === cat.id ? null : cat.id">Stats</button>
              <button class="zcat-act" @click.stop="openAdd(cat)">+ Sub</button>
              <button class="zcat-act" @click.stop="openEdit(cat)">Edit</button>
              <button class="zcat-act danger" @click.stop="del(cat)">Del</button>
            </div>
          </div>

          <div v-if="statsFor === cat.id" style="padding:10px 14px 14px;background:var(--zg-bg);border-bottom:1px solid var(--zg-line)">
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">
              <div v-for="m in mkts" :key="m" v-show="cat.markets?.[m]" :style="{ background:'var(--zg-panel)', border:`1px solid ${belowMin(cat, m) ? 'oklch(0.70 0.18 25 / 0.4)' : cat.markets?.[m]?.enabled ? 'var(--zg-line)' : 'var(--zg-line-soft)'}`, borderRadius:'var(--zg-radius-md)', padding:'8px 10px', opacity: cat.markets?.[m]?.enabled ? 1 : 0.45 }">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><span style="font-size:10px;font-weight:700;font-family:var(--zg-mono)">{{ m }}</span><span :style="{ width:'6px', height:'6px', borderRadius:'50%', background: cat.markets?.[m]?.enabled ? (belowMin(cat, m) ? 'var(--zg-danger)' : 'var(--zg-good)') : 'var(--zg-line)' }" /></div>
                <template v-if="cat.markets?.[m]?.enabled">
                  <div :style="{ fontSize:'13px', fontWeight:700, fontFamily:'var(--zg-mono)', color: belowMin(cat, m) ? 'var(--zg-danger)' : 'var(--zg-text)' }">{{ cat.markets[m].listing_count }}</div>
                  <div style="font-size:9.5px;color:var(--zg-text-dim);margin-top:1px">/ {{ cat.markets[m].min_listings }} min</div>
                  <div v-if="cat.markets[m].vendor_count" style="font-size:9px;color:var(--zg-text-xdim);margin-top:3px">{{ cat.markets[m].vendor_count }} vendors</div>
                </template>
                <div v-else style="font-size:10px;color:var(--zg-text-xdim);margin-top:4px">Disabled</div>
              </div>
            </div>
          </div>

          <template v-if="expanded[cat.id]">
            <div v-for="ch in (cat.children || [])" :key="ch.id" class="zcat-child-row">
              <span style="width:8px" /><span style="font-family:monospace;color:var(--zg-text-xdim);font-size:11px">└</span>
              <span class="zcat-child-name">{{ ch.label }}</span>
              <span v-if="anyBelowMin(ch)" style="width:14px;height:14px;border-radius:50%;background:var(--zg-danger);color:#fff;font-size:9px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">!</span>
              <div style="flex:1;min-width:0"><div style="display:flex;gap:3px;flex-wrap:wrap">
                <span v-for="m in mkts" :key="m" v-show="ch.markets?.[m]?.enabled" style="height:15px;padding:0 4px;border-radius:2px;font-size:8.5px;font-weight:700;font-family:var(--zg-mono)" :style="{ background: belowMin(ch, m) ? 'oklch(0.70 0.18 25 / 0.12)' : 'var(--zg-accent-tint)', color: belowMin(ch, m) ? 'var(--zg-danger)' : 'var(--zg-accent)' }">{{ m }}</span>
              </div></div>
              <span class="zcat-count">{{ (ch.product_count || 0).toLocaleString() }}</span>
              <button class="zcat-toggle" :class="ch.status === 'active' ? 'on' : 'off'" @click="toggleStatus(ch.id, true, cat.id)"><div class="zcat-toggle-knob" /></button>
              <div class="zcat-row-actions">
                <button class="zcat-act" @click="statsFor = statsFor === ch.id ? null : ch.id">Stats</button>
                <button class="zcat-act" @click="openEdit(ch)">Edit</button>
              </div>
            </div>
          </template>
        </template>
      </div>

      <!-- Marketplace table -->
      <div v-else style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:1fr 130px 80px 80px 80px 120px 80px;gap:10px;padding:0 14px;height:32px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span>Category</span><span>Maps to</span><span>Commission</span><span>Vendors</span><span>Listings</span><span>Markets</span><span>Actions</span>
        </div>
        <template v-for="cat in filtered" :key="cat.id">
          <div style="display:grid;grid-template-columns:1fr 130px 80px 80px 80px 120px 80px;gap:10px;padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;cursor:pointer" @click="toggle(cat.id)">
            <div style="overflow:hidden">
              <div style="display:flex;align-items:center;gap:6px"><span style="font-size:12.5px;font-weight:600;color:var(--zg-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ cat.label }}</span><span v-if="anyBelowMin(cat)" style="width:14px;height:14px;border-radius:50%;background:var(--zg-danger);color:#fff;font-size:9px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">!</span></div>
              <div style="font-size:10px;color:var(--zg-text-dim);font-family:var(--zg-mono)">{{ cat.slug }}</div>
            </div>
            <div><div style="font-size:11.5px;color:var(--zg-text-mid);font-weight:500">{{ cat.mapped_label }}</div><div style="font-size:10px;color:var(--zg-text-dim);font-family:var(--zg-mono)">{{ cat.mapped_to }}</div></div>
            <span style="font-family:var(--zg-mono);font-size:13px;font-weight:700;color:var(--zg-accent)">{{ mktFilter !== 'all' && cat.markets?.[mktFilter] ? cat.markets[mktFilter].commission_pct : cat.commission_pct }}%</span>
            <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text-mid)">{{ mktFilter !== 'all' && cat.markets?.[mktFilter] ? cat.markets[mktFilter].vendor_count : cat.vendor_count }}</span>
            <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text-mid)">{{ (mktFilter !== 'all' && cat.markets?.[mktFilter] ? cat.markets[mktFilter].listing_count : cat.listing_count)?.toLocaleString() }}</span>
            <div style="display:flex;gap:3px;flex-wrap:wrap"><span v-for="m in mkts" :key="m" v-show="cat.markets?.[m]?.enabled" style="height:15px;padding:0 4px;border-radius:2px;font-size:8.5px;font-weight:700;font-family:var(--zg-mono)" :style="{ background: belowMin(cat, m) ? 'oklch(0.70 0.18 25 / 0.12)' : 'var(--zg-accent-tint)', color: belowMin(cat, m) ? 'var(--zg-danger)' : 'var(--zg-accent)' }">{{ m }}</span></div>
            <div style="display:flex;gap:4px" @click.stop>
              <button class="zcat-act" style="opacity:1" @click="statsFor = statsFor === cat.id ? null : cat.id">Stats</button>
              <button class="zcat-act" style="opacity:1" @click="openEdit(cat)">Edit</button>
            </div>
          </div>
          <div v-if="statsFor === cat.id" style="padding:10px 14px 14px;background:var(--zg-bg);border-bottom:1px solid var(--zg-line)">
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">
              <div v-for="m in mkts" :key="m" v-show="cat.markets?.[m]" :style="{ background:'var(--zg-panel)', border:`1px solid ${belowMin(cat, m) ? 'oklch(0.70 0.18 25 / 0.4)' : cat.markets?.[m]?.enabled ? 'var(--zg-line)' : 'var(--zg-line-soft)'}`, borderRadius:'var(--zg-radius-md)', padding:'8px 10px', opacity: cat.markets?.[m]?.enabled ? 1 : 0.45 }">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><span style="font-size:10px;font-weight:700;font-family:var(--zg-mono)">{{ m }}</span></div>
                <template v-if="cat.markets?.[m]?.enabled">
                  <div :style="{ fontSize:'13px', fontWeight:700, fontFamily:'var(--zg-mono)', color: belowMin(cat, m) ? 'var(--zg-danger)' : 'var(--zg-text)' }">{{ cat.markets[m].listing_count }}</div>
                  <div style="font-size:9.5px;color:var(--zg-text-dim);margin-top:1px">/ {{ cat.markets[m].min_listings }} min</div>
                  <div style="font-size:9.5px;color:var(--zg-accent);font-weight:700;margin-top:2px">{{ cat.markets[m].commission_pct }}% comm.</div>
                </template>
                <div v-else style="font-size:10px;color:var(--zg-text-xdim);margin-top:4px">Disabled</div>
              </div>
            </div>
          </div>
          <template v-if="expanded[cat.id]">
            <div v-for="ch in (cat.children || [])" :key="ch.id" style="display:grid;grid-template-columns:1fr 130px 80px 80px 80px 120px 80px;gap:10px;padding:8px 14px 8px 44px;background:var(--zg-bg);border-bottom:1px solid var(--zg-line-soft);align-items:center">
              <div style="display:flex;align-items:center;gap:6px;overflow:hidden"><span style="color:var(--zg-text-xdim);font-size:11px;font-family:monospace">└</span><span style="font-size:12.5px;color:var(--zg-text-mid);font-weight:500">{{ ch.label }}</span></div>
              <span style="font-size:11.5px;color:var(--zg-text-dim)">{{ INTL.find((c) => c.id === ch.mapped_to)?.label || ch.mapped_to || '—' }}</span>
              <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-accent)">{{ ch.commission_pct }}%</span>
              <span style="font-size:11px;color:var(--zg-text-dim)">—</span>
              <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text-mid)">{{ ch.listing_count?.toLocaleString() }}</span>
              <span />
              <div style="display:flex;gap:4px"><button class="zcat-act" style="opacity:1" @click="openEdit(ch)">Edit</button></div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <CategoryDrawer :open="drawerOpen" :cat="editCat" :parent-cat="parentCat" :is-marketplace="isMarketplace" @close="drawerOpen = false" @save="() => {}" />
    <CategoryBulkImport :open="importOpen" :tab="isMarketplace ? 'marketplace' : 'products'" @close="importOpen = false" />
  </div>
</template>
