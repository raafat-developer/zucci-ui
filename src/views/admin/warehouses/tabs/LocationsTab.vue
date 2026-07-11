<script setup>
import { ref, computed } from 'vue';
import { ZCW_ZONES } from '@/data/warehouseData';

const props = defineProps({ wh: { type: Object, required: true } });

const openZones  = ref({});
const openAisles = ref({});

const utilPct2  = (u, t) => t ? Math.round((u/t)*100) : 0;
const utilCls   = pct => pct >= 85 ? 'high' : pct >= 60 ? 'mid' : 'low';
const utilColor = pct => pct >= 85 ? 'var(--zg-danger)' : pct >= 60 ? 'var(--zg-warn)' : 'var(--zg-good)';

const isVirtual  = computed(() => props.wh.types.includes('virtual') || props.wh.types.includes('cross_dock'));
const zones      = computed(() => ZCW_ZONES[props.wh.id] || []);
const totalBins  = computed(() => zones.value.flatMap(z => z.aisles).flatMap(a => a.bins).length);
const usedBins   = computed(() => zones.value.flatMap(z => z.aisles).flatMap(a => a.bins).filter(b => b.current > 0).length);

function zPct(zone) {
  const bins = zone.aisles.flatMap(a => a.bins);
  return utilPct2(bins.reduce((s,b)=>s+b.current,0), bins.reduce((s,b)=>s+b.max,0));
}
function aPct(aisle) {
  return utilPct2(aisle.bins.reduce((s,b)=>s+b.current,0), aisle.bins.reduce((s,b)=>s+b.max,0));
}
function toggleZone(id) { openZones.value = { ...openZones.value, [id]: !openZones.value[id] }; }
function toggleAisle(key) { openAisles.value = { ...openAisles.value, [key]: !openAisles.value[key] }; }
</script>

<template>
  <div class="zwh-tab-body">
    <div v-if="isVirtual" class="zwh-empty">
      <div class="zwh-empty-title">No bin locations</div>
      <div class="zwh-empty-sub">{{ wh.types.includes('virtual') ? 'Virtual warehouses do not have physical bin locations.' : 'Cross-dock facilities do not use bin-level storage.' }}</div>
    </div>
    <div v-else-if="!zones.length" class="zwh-empty">
      <div class="zwh-empty-title">Location map not yet configured</div>
      <div class="zwh-empty-sub">Zones and bin locations can be configured in the Settings tab</div>
    </div>
    <template v-else>
      <!-- Summary -->
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">
        <span style="font-size:12px;color:var(--zg-text-dim);">{{ zones.length }} zones · {{ zones.flatMap(z=>z.aisles).length }} aisles · {{ totalBins }} bins</span>
        <span style="font-size:12px;color:var(--zg-good);">{{ usedBins }} occupied ({{ totalBins ? Math.round(usedBins/totalBins*100) : 0 }}%)</span>
        <div style="display:flex;gap:12px;margin-left:auto;">
          <div v-for="[cls,col,lbl] in [['low','var(--zg-good)','< 60%'],['mid','var(--zg-warn)','60–85%'],['high','var(--zg-danger)','> 85%']]" :key="cls"
            style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--zg-text-dim);">
            <span style="width:8px;height:8px;border-radius:2px;display:inline-block;" :style="{ background: col }" />{{ lbl }}
          </div>
        </div>
      </div>

      <!-- Zone tree -->
      <div class="zwh-loc-tree">
        <div v-for="zone in zones" :key="zone.id" class="zwh-zone-block">
          <div class="zwh-zone-row" @click="toggleZone(zone.id)">
            <span class="zwh-zone-dot" :style="{ background: zone.color }" />
            <span class="zwh-zone-name">{{ zone.name }}</span>
            <div class="zwh-zone-stats">
              <span class="zwh-zone-stat">{{ zone.aisles.length }} aisles</span>
              <span class="zwh-zone-stat">{{ zone.aisles.flatMap(a=>a.bins).length }} bins</span>
            </div>
            <div class="zwh-zone-util-bar">
              <div :class="`zwh-zone-util-fill zwh-util-fill is-${utilCls(zPct(zone))}`" :style="{ width: zPct(zone)+'%', height:'100%', borderRadius:'2px' }" />
            </div>
            <span style="font-size:11px;font-family:var(--zg-mono);width:36px;text-align:right;flex-shrink:0;" :style="{ color: utilColor(zPct(zone)) }">{{ zPct(zone) }}%</span>
            <svg :class="`zwh-zone-chevron ${openZones[zone.id] ? 'open' : ''}`" viewBox="0 0 8 12" width="7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 2l4 4-4 4"/></svg>
          </div>

          <div v-if="openZones[zone.id]" class="zwh-zone-aisles">
            <div v-for="aisle in zone.aisles" :key="aisle.id">
              <div class="zwh-aisle-row" @click="toggleAisle(`${zone.id}-${aisle.id}`)">
                <span style="font-size:12px;color:var(--zg-text);flex:1;">{{ aisle.name }}</span>
                <span style="font-size:11px;font-family:var(--zg-mono);color:var(--zg-text-dim);margin-right:8px;">{{ aisle.bins.length }} bins · {{ aPct(aisle) }}% full</span>
                <svg :class="`zwh-aisle-chevron ${openAisles[`${zone.id}-${aisle.id}`] ? 'open' : ''}`" viewBox="0 0 8 12" width="7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 2l4 4-4 4"/></svg>
              </div>
              <div v-if="openAisles[`${zone.id}-${aisle.id}`]" class="zwh-bins-grid">
                <div v-for="bin in aisle.bins" :key="bin.id" class="zwh-bin-card">
                  <div class="zwh-bin-id">{{ bin.id }}</div>
                  <div class="zwh-bin-type">{{ bin.type }}</div>
                  <div class="zwh-bin-bar">
                    <div :class="`zwh-bin-fill ${utilCls(utilPct2(bin.current, bin.max))}`" :style="{ width: utilPct2(bin.current,bin.max)+'%' }" />
                  </div>
                  <div class="zwh-bin-nums">
                    <span style="font-weight:600;" :style="{ color: utilColor(utilPct2(bin.current,bin.max)) }">{{ utilPct2(bin.current,bin.max) }}%</span>
                    <span>{{ bin.current }}/{{ bin.max }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
