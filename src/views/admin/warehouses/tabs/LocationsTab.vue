<script setup>
import { ref, computed } from "vue";
import { ZCW_ZONES } from "@/data/warehouseData";

const props = defineProps({ wh: { type: Object, required: true } });

const zones = computed(() => ZCW_ZONES[props.wh.id] || []);
const openZones = ref({});
const openAisles = ref({});

const utilPct = (used, total) => (total ? Math.round((used / total) * 100) : 0);
const utilCls = (pct) => (pct >= 85 ? "high" : pct >= 60 ? "mid" : "low");
const utilColor = (pct) =>
  pct >= 85
    ? "var(--zg-danger)"
    : pct >= 60
      ? "var(--zg-warn)"
      : "var(--zg-good)";

const isVirtual = computed(
  () =>
    props.wh.types.includes("virtual") || props.wh.types.includes("cross_dock"),
);

const totalBins = computed(
  () =>
    zones.value.flatMap((z) => z.aisles || []).flatMap((a) => a.bins || [])
      .length,
);
const usedBins = computed(
  () =>
    zones.value
      .flatMap((z) => z.aisles || [])
      .flatMap((a) => a.bins || [])
      .filter((b) => (b.current || 0) > 0).length,
);

function toggleZone(id) {
  openZones.value = { ...openZones.value, [id]: !openZones.value[id] };
}
function toggleAisle(key) {
  openAisles.value = { ...openAisles.value, [key]: !openAisles.value[key] };
}

function binColor(b) {
  if (!b.max) return "var(--zg-panel-hi)";
  const pct = utilPct(b.current || 0, b.max);
  return pct >= 85
    ? "var(--zg-danger)"
    : pct >= 60
      ? "var(--zg-warn)"
      : "var(--zg-good)";
}
</script>

<template>
  <div class="zwh-tab-body">
    <!-- Virtual / cross-dock placeholder -->
    <div v-if="isVirtual" class="zwh-empty">
      <div class="zwh-empty-title">No bin locations</div>
      <div class="zwh-empty-sub">
        {{
          wh.types.includes("virtual")
            ? "Virtual warehouses do not have physical bin locations."
            : "Cross-dock facilities do not use bin-level storage."
        }}
      </div>
    </div>

    <!-- Not configured -->
    <div v-else-if="!zones.length" class="zwh-empty">
      <div class="zwh-empty-title">Location map not yet configured</div>
      <div class="zwh-empty-sub">
        Zones and bin locations can be configured in the Settings tab.
      </div>
    </div>

    <!-- Zone/aisle/bin tree -->
    <template v-else>
      <!-- Summary strip -->
      <div
        style="
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 10px;
        "
      >
        <span style="font-size: 12px; color: var(--zg-text-dim)">
          {{ zones.length }} zones ·
          {{ zones.flatMap((z) => z.aisles || []).length }} aisles ·
          {{ totalBins }} bins
        </span>
        <span style="font-size: 12px; color: var(--zg-good)">
          {{ usedBins }} occupied ({{
            totalBins ? Math.round((usedBins / totalBins) * 100) : 0
          }}%)
        </span>
        <div
          style="display: flex; gap: 12px; margin-left: auto; flex-shrink: 0"
        >
          <div
            v-for="[cls, col, lbl] in [
              ['low', 'var(--zg-good)', '< 60%'],
              ['mid', 'var(--zg-warn)', '60–85%'],
              ['high', 'var(--zg-danger)', '> 85%'],
            ]"
            :key="cls"
            style="
              display: flex;
              align-items: center;
              gap: 5px;
              font-size: 10.5px;
              color: var(--zg-text-dim);
            "
          >
            <span
              style="
                width: 8px;
                height: 8px;
                border-radius: 2px;
                display: inline-block;
              "
              :style="{ background: col }"
            />{{ lbl }}
          </div>
        </div>
      </div>

      <div class="zwh-loc-tree">
        <div v-for="zone in zones" :key="zone.id" class="zwh-zone-block">
          <!-- Zone row -->
          <div class="zwh-zone-row" @click="toggleZone(zone.id)">
            <span class="zwh-zone-dot" :style="{ background: zone.color }" />
            <span class="zwh-zone-name">{{ zone.name }}</span>
            <div class="zwh-zone-stats">
              <span class="zwh-zone-stat"
                >{{ (zone.aisles || []).length }} aisles</span
              >
              <span class="zwh-zone-stat"
                >{{
                  (zone.aisles || []).flatMap((a) => a.bins || []).length
                }}
                bins</span
              >
            </div>
            <div class="zwh-zone-util-bar">
              <div
                class="zwh-zone-util-fill zwh-util-fill"
                :class="`is-${utilCls(
                  utilPct(
                    (zone.aisles || [])
                      .flatMap((a) => a.bins || [])
                      .reduce((s, b) => s + (b.current || 0), 0),
                    (zone.aisles || [])
                      .flatMap((a) => a.bins || [])
                      .reduce((s, b) => s + (b.max || 0), 0),
                  ),
                )}`"
                :style="{
                  width:
                    utilPct(
                      (zone.aisles || [])
                        .flatMap((a) => a.bins || [])
                        .reduce((s, b) => s + (b.current || 0), 0),
                      (zone.aisles || [])
                        .flatMap((a) => a.bins || [])
                        .reduce((s, b) => s + (b.max || 0), 0),
                    ) + '%',
                  height: '100%',
                  borderRadius: '2px',
                }"
              />
            </div>
            <svg
              class="zwh-zone-chevron"
              :class="{ open: openZones[zone.id] }"
              viewBox="0 0 8 12"
              width="7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            >
              <path d="M2 2l4 4-4 4" />
            </svg>
          </div>

          <!-- Aisles -->
          <div v-if="openZones[zone.id]" class="zwh-zone-aisles">
            <div
              v-for="aisle in zone.aisles || []"
              :key="aisle.id"
              class="zwh-aisle-block"
            >
              <div
                class="zwh-aisle-row"
                @click="toggleAisle(`${zone.id}-${aisle.id}`)"
              >
                <span class="zwh-aisle-id">{{ aisle.id }}</span>
                <span class="zwh-aisle-name">{{
                  aisle.name || "Aisle " + aisle.id
                }}</span>
                <span class="zwh-aisle-stat"
                  >{{ (aisle.bins || []).length }} bins</span
                >
                <svg
                  class="zwh-zone-chevron"
                  :class="{ open: openAisles[`${zone.id}-${aisle.id}`] }"
                  viewBox="0 0 8 12"
                  width="7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                >
                  <path d="M2 2l4 4-4 4" />
                </svg>
              </div>
              <!-- Bins grid -->
              <div
                v-if="openAisles[`${zone.id}-${aisle.id}`]"
                class="zwh-bins-grid"
              >
                <div
                  v-for="b in aisle.bins || []"
                  :key="b.id"
                  class="zwh-bin-chip"
                  :title="`${b.id}: ${b.current || 0}/${b.max || 0}`"
                  :style="{ borderColor: binColor(b), color: binColor(b) }"
                >
                  <span style="font-size: 9.5px; font-family: var(--zg-mono)">{{
                    b.id
                  }}</span>
                  <span style="font-size: 9px; opacity: 0.7"
                    >{{ b.current || 0 }}/{{ b.max || 0 }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
