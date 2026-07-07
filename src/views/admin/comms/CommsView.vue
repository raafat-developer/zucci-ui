<script setup>
/**
 * CommsView — Notifications & Comms module. Faithful port of ZucciCommsModule:
 * header + KPIs, tabs (Templates, Campaigns, Audiences, A/B Tests, Delivery
 * Log), each with the real data-driven table. Uses legacy zwh-/zcat- CSS.
 */
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  CHANNELS, CH_LABELS, TEMPLATES, CAMPAIGNS, AUDIENCE_SEGMENTS, AB_TESTS, DELIVERY_LOG, STATUS_COLORS,
} from '@/data/commsData';
import ZModal from '@/components/ui/ZModal.vue';

const route = useRoute();
const tab = ref(route.query.tab || 'templates');
watch(() => route.query.tab, (t) => { if (t) tab.value = t; });
const search = ref('');
const chF = ref('all');
const catF = ref('all');
const newOpen = ref(false);

const TABS = [['templates','Templates'],['campaigns','Campaigns'],['audiences','Audiences'],['ab','A/B Tests'],['log','Delivery Log']];
const cats = [...new Set(TEMPLATES.map((t) => t.category))];
const chLabel = (c) => CH_LABELS[c] || c;
const stColor = (s) => STATUS_COLORS[s] || 'var(--zg-text-dim)';

const filteredTemplates = computed(() => {
  const sq = search.value.toLowerCase();
  return TEMPLATES.filter((t) => (chF.value === 'all' || t.channel === chF.value) && (catF.value === 'all' || t.category === catF.value) && (!sq || t.name.toLowerCase().includes(sq)));
});

const kpis = [
  ['Sent (7d)', '1.2M', 'is-accent'],
  ['Open Rate', '38%', 'is-good'],
  ['Active Templates', String(TEMPLATES.filter((t) => t.status === 'active').length), ''],
  ['Scheduled', String(CAMPAIGNS.filter((c) => c.status === 'scheduled').length), 'is-warn'],
  ['Opt-out Rate', '0.4%', 'is-good'],
];
const channels = CHANNELS; const templates = TEMPLATES; const campaigns = CAMPAIGNS;
const segments = AUDIENCE_SEGMENTS; const abTests = AB_TESTS; const log = DELIVERY_LOG;
const tabs = TABS;
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;min-height:0">
    <div class="zwh-header" style="flex-shrink:0">
      <div class="zwh-header-left">
        <div style="font-size:16px;font-weight:700;color:var(--zg-text)">Notifications &amp; Comms</div>
        <div class="zwh-subtitle">Push · SMS / WhatsApp · Email · In-App across all markets</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="zwh-btn-ghost">Delivery Log</button>
        <button class="zwh-btn-primary" @click="newOpen = true">+ New Campaign</button>
      </div>
    </div>

    <div class="zwh-kpi-strip" style="flex-shrink:0">
      <div v-for="[l, v, cls] in kpis" :key="l" class="zwh-kpi-cell"><span class="zwh-kpi-lbl">{{ l }}</span><span class="zwh-kpi-val" :class="cls">{{ v }}</span></div>
    </div>

    <div style="display:flex;border-bottom:1px solid var(--zg-line);background:var(--zg-bg-elev);flex-shrink:0;padding:0 20px">
      <button v-for="[v, l] in tabs" :key="v" style="height:40px;padding:0 14px;border:none;background:transparent;font-family:inherit;font-size:12.5px;cursor:pointer" :style="{ color: tab === v ? 'var(--zg-accent)' : 'var(--zg-text-dim)', borderBottom: tab === v ? '2px solid var(--zg-accent)' : '2px solid transparent', fontWeight: tab === v ? 600 : 400 }" @click="tab = v">{{ l }}</button>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <!-- Templates -->
      <div v-if="tab === 'templates'">
        <div style="display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap;margin-bottom:12px">
          <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center">
            <input v-model="search" placeholder="Search templates…" style="height:28px;padding:0 10px;width:200px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" />
            <button v-for="ch in ['all', ...channels]" :key="ch" class="zwh-filter-chip" :class="{ 'is-active': chF === ch }" @click="chF = ch">{{ ch === 'all' ? 'All' : chLabel(ch) }}</button>
            <div style="width:1px;height:16px;background:var(--zg-line)" />
            <button v-for="c in ['all', ...cats]" :key="c" class="zwh-filter-chip" :class="{ 'is-active': catF === c }" @click="catF = c">{{ c }}</button>
          </div>
          <button class="zwh-btn-primary" @click="newOpen = true">+ New Template</button>
        </div>
        <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
          <div style="display:grid;grid-template-columns:1fr 100px 110px 80px 80px 100px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
            <span>Template Name</span><span>Channel</span><span>Category</span><span>Status</span><span>Languages</span><span>Sent</span>
          </div>
          <div v-for="t in filteredTemplates" :key="t.id" style="display:grid;grid-template-columns:1fr 100px 110px 80px 80px 100px;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;font-size:12px">
            <span style="font-weight:600;color:var(--zg-text)">{{ t.name }}</span>
            <span style="font-size:11px;color:var(--zg-text-mid)">{{ chLabel(t.channel) }}</span>
            <span style="font-size:11px;color:var(--zg-text-dim)">{{ t.category }}</span>
            <span style="font-size:11px;font-weight:600" :style="{ color: stColor(t.status) }">{{ t.status }}</span>
            <div style="display:flex;gap:3px"><span v-for="l in t.langs" :key="l" style="height:16px;padding:0 4px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:9.5px;font-family:var(--zg-mono);color:var(--zg-text-dim);display:inline-flex;align-items:center">{{ l }}</span></div>
            <span style="font-family:var(--zg-mono);font-size:11px">{{ t.sent_count > 0 ? t.sent_count.toLocaleString() : '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Campaigns -->
      <div v-else-if="tab === 'campaigns'" style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:1fr 120px 100px 90px 80px 80px 90px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span>Campaign</span><span>Channels</span><span>Status</span><span>Sent</span><span>Open</span><span>CTR</span><span>Conv.</span>
        </div>
        <div v-for="c in campaigns" :key="c.id" style="display:grid;grid-template-columns:1fr 120px 100px 90px 80px 80px 90px;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;font-size:12px">
          <div><div style="font-weight:600;color:var(--zg-text)">{{ c.name }}</div><div style="font-size:10.5px;color:var(--zg-text-dim)">{{ c.audience }} · {{ c.scheduled }}</div></div>
          <span style="font-size:10.5px;color:var(--zg-text-mid)">{{ c.channels.map(chLabel).join(', ') }}</span>
          <span style="font-size:11px;font-weight:600" :style="{ color: stColor(c.status) }">{{ c.status }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px">{{ c.sent ? c.sent.toLocaleString() : '—' }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px">{{ c.open_rate != null ? c.open_rate + '%' : '—' }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px">{{ c.ctr != null ? c.ctr + '%' : '—' }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px">{{ c.conversions != null ? c.conversions.toLocaleString() : '—' }}</span>
        </div>
      </div>

      <!-- Audiences -->
      <div v-else-if="tab === 'audiences'" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
        <div v-for="s in segments" :key="s.id" class="zen-card">
          <div class="zen-card-head"><span class="zen-card-title">{{ s.name }}</span></div>
          <div style="font-family:var(--zg-mono);font-size:22px;font-weight:700;color:var(--zg-accent);line-height:1;margin:6px 0">{{ s.size.toLocaleString() }}</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);margin-bottom:8px">customers · {{ s.markets.join(', ') }}</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <span v-for="f in s.filters" :key="f" style="height:18px;padding:0 6px;border-radius:2px;background:var(--zg-panel-hi);border:1px solid var(--zg-line);font-size:10px;font-family:var(--zg-mono);color:var(--zg-text-dim);display:inline-flex;align-items:center">{{ f }}</span>
          </div>
        </div>
      </div>

      <!-- A/B Tests -->
      <div v-else-if="tab === 'ab'" style="display:flex;flex-direction:column;gap:12px">
        <div v-for="t in abTests" :key="t.id" class="zen-card">
          <div class="zen-card-head"><span class="zen-card-title">{{ t.name }}</span><span style="font-size:11px;font-weight:600" :style="{ color: stColor(t.status) }">{{ t.status }}</span></div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);margin-bottom:10px">Campaign: {{ t.campaign }}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div :style="{ padding:'10px 12px', border:'1px solid', borderRadius:'var(--zg-radius-md)', borderColor: t.winner === 'A' ? 'var(--zg-good)' : 'var(--zg-line)', background: t.winner === 'A' ? 'oklch(0.78 0.15 150 / 0.06)' : 'var(--zg-panel)' }">
              <div style="font-size:10px;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Variant A <span v-if="t.winner === 'A'" style="color:var(--zg-good)">· Winner</span></div>
              <div style="font-size:12.5px;color:var(--zg-text);margin-bottom:6px">{{ t.variant_a.label }}</div>
              <div style="font-family:var(--zg-mono);font-size:16px;font-weight:700;color:var(--zg-accent)">{{ t.variant_a.open }}% open</div>
            </div>
            <div :style="{ padding:'10px 12px', border:'1px solid', borderRadius:'var(--zg-radius-md)', borderColor: t.winner === 'B' ? 'var(--zg-good)' : 'var(--zg-line)', background: t.winner === 'B' ? 'oklch(0.78 0.15 150 / 0.06)' : 'var(--zg-panel)' }">
              <div style="font-size:10px;color:var(--zg-text-dim);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Variant B <span v-if="t.winner === 'B'" style="color:var(--zg-good)">· Winner</span></div>
              <div style="font-size:12.5px;color:var(--zg-text);margin-bottom:6px">{{ t.variant_b.label }}</div>
              <div style="font-family:var(--zg-mono);font-size:16px;font-weight:700;color:var(--zg-accent)">{{ t.variant_b.open }}% open</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Log -->
      <div v-else style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:1fr 1fr 90px 90px 70px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span>Template</span><span>Recipient</span><span>Channel</span><span>Status</span><span>When</span>
        </div>
        <div v-for="d in log" :key="d.id" style="display:grid;grid-template-columns:1fr 1fr 90px 90px 70px;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;font-size:12px">
          <span style="font-weight:600;color:var(--zg-text)">{{ d.template }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-dim)">{{ d.recipient }}</span>
          <span style="font-size:11px;color:var(--zg-text-mid)">{{ chLabel(d.channel) }}</span>
          <span style="font-size:11px;font-weight:600" :style="{ color: stColor(d.status) }">{{ d.status }}</span>
          <span style="font-size:10.5px;color:var(--zg-text-xdim)">{{ d.time }}</span>
        </div>
      </div>
    </div>

    <ZModal :open="newOpen" title="New Campaign" :width="520" @close="newOpen = false">
      <div style="color:var(--zg-text-mid);font-size:12.5px;line-height:1.6">Compose a new campaign — pick channels, audience segment, template, schedule and A/B variants.</div>
      <template #footer>
        <button class="zwh-btn-ghost" @click="newOpen = false">Cancel</button>
        <button class="zwh-btn-primary" @click="newOpen = false">Create</button>
      </template>
    </ZModal>
  </div>
</template>

