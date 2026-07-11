<template>
  <div class="zcat-wrap">
    <!-- Header -->
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="font-size: 13px; font-weight: 600; color: var(--zg-text)"
            >Sync Check Integration</span
          >
        </div>
        <div class="zwh-subtitle">
          Monitor connection status, catalog imports, and sync discrepancies
          across external store channels
        </div>
      </div>
      <div class="zwh-header-right">
        <button
          class="zwh-btn-primary"
          :disabled="reSyncingAll"
          @click="triggerReSyncAll"
        >
          {{ reSyncingAll ? "Re-syncing catalog..." : "Re-sync All Platforms" }}
        </button>
      </div>
    </div>

    <!-- KPI Strip -->
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Connected Integrations</span>
        <span class="zwh-kpi-val is-good">{{ connectedCount }}</span>
        <span class="zwh-kpi-sub">live platform pipes</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Fully Synced</span>
        <span class="zwh-kpi-val is-accent">{{ syncedCount }}</span>
        <span class="zwh-kpi-sub">no discrepancies reported</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Sync errors alert</span>
        <span class="zwh-kpi-val" :class="{ 'is-danger': errorsCount > 0 }">{{
          errorsCount
        }}</span>
        <span class="zwh-kpi-sub">mismatched sizes / prices</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Disconnected Channels</span>
        <span class="zwh-kpi-val">{{ disconnectedCount }}</span>
        <span class="zwh-kpi-sub">need authentication re-validation</span>
      </div>
    </div>

    <!-- Body contents -->
    <div class="zcat-content" style="overflow-y: auto">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <div
          v-for="p in platforms"
          :key="p.id"
          class="sync-card"
          @click="toggleSelectPlatform(p.id)"
          style="
            background: var(--zg-panel);
            border: 1px solid var(--zg-line);
            border-radius: var(--zg-radius-md);
            padding: 14px 16px;
            cursor: pointer;
            transition: border-color 0.15s;
          "
          :style="{
            borderColor:
              selectedPlatformId === p.id
                ? 'var(--zg-accent)'
                : 'var(--zg-line)',
          }"
        >
          <div
            style="
              display: grid;
              grid-template-columns: 1.5fr 1fr 100px 100px 100px 1.2fr;
              gap: 10px;
              align-items: center;
            "
          >
            <div>
              <div
                style="
                  font-weight: 700;
                  font-size: 13.5px;
                  color: var(--zg-text);
                  margin-bottom: 2px;
                "
              >
                {{ p.name }}
              </div>
              <div style="font-size: 11px; color: var(--zg-text-dim)">
                {{ p.platform }} ·
                <span style="font-family: var(--zg-mono); font-size: 10px">{{
                  p.shop
                }}</span>
              </div>
            </div>

            <!-- Status tag -->
            <div>
              <span
                class="zen-bst"
                :style="{
                  background: STATUS_META[p.status].bg,
                  color: STATUS_META[p.status].color,
                }"
                style="
                  padding: 3px 8px;
                  border-radius: 4px;
                  font-size: 9.5px;
                  font-weight: 700;
                  text-transform: uppercase;
                "
              >
                {{ STATUS_META[p.status].label }}
              </span>
            </div>

            <!-- Products count synced -->
            <span
              style="
                font-family: var(--zg-mono);
                font-size: 12.5px;
                color: var(--zg-text-mid);
              "
              >{{ p.products }} items</span
            >

            <!-- Failed SKUs count -->
            <span
              style="font-family: var(--zg-mono); font-size: 12.5px"
              :class="
                p.failed > 0
                  ? 'color: var(--zg-danger); font-weight: 700;'
                  : 'color: var(--zg-text-xdim);'
              "
            >
              {{ p.failed > 0 ? `${p.failed} errors` : "—" }}
            </span>

            <!-- Pending SKUs count -->
            <span
              style="font-family: var(--zg-mono); font-size: 12.5px"
              :class="
                p.pending > 0
                  ? 'color: var(--zg-warn); font-weight: 700;'
                  : 'color: var(--zg-text-xdim);'
              "
            >
              {{ p.pending > 0 ? `${p.pending} pending` : "—" }}
            </span>

            <!-- Sync control button -->
            <div
              style="
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 10px;
              "
              @click.stop
            >
              <span style="font-size: 11px; color: var(--zg-text-xdim)">{{
                p.lastSync
              }}</span>
              <button
                class="zcat-act"
                :disabled="p.lastSync === 'syncing...'"
                @click="reSyncPlatform(p)"
              >
                Sync
              </button>
            </div>
          </div>

          <!-- Error details display -->
          <div
            v-if="selectedPlatformId === p.id && mockErrorsMap[p.id]"
            style="
              margin-top: 14px;
              padding: 12px;
              background: oklch(0.7 0.18 25 / 0.05);
              border: 1px solid oklch(0.7 0.18 25 / 0.2);
              border-radius: var(--zg-radius-md);
            "
            @click.stop
          >
            <div
              style="
                font-size: 10.5px;
                font-weight: 700;
                color: var(--zg-danger);
                text-transform: uppercase;
                margin-bottom: 8px;
              "
            >
              Sync Discrepancy logs ({{ mockErrorsMap[p.id].length }})
            </div>
            <div
              v-for="(err, idx) in mockErrorsMap[p.id]"
              :key="idx"
              style="
                display: flex;
                gap: 8px;
                align-items: center;
                font-size: 12px;
                color: var(--zg-text-mid);
                padding: 4px 0;
                border-bottom: 1px solid var(--zg-line-soft);
              "
            >
              <span
                style="
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                  background: var(--zg-danger);
                  flex-shrink: 0;
                "
              ></span>
              {{ err }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// ── Mock Data: Sync Integration Platforms ────────────────
const initialPlatforms = [
  {
    id: "shopify_lemaillot",
    name: "Le Maillot Storefront",
    platform: "Shopify",
    shop: "lemaillot-eg.myshopify.com",
    status: "synced",
    lastSync: "4 minutes ago",
    products: 84,
    failed: 0,
    pending: 0,
  },
  {
    id: "shopify_5th",
    name: "5th Ave Cairo Modest",
    platform: "Shopify",
    shop: "5thavenuecairo.myshopify.com",
    status: "error",
    lastSync: "2 days ago",
    products: 42,
    failed: 12,
    pending: 3,
  },
  {
    id: "api_burgandy",
    name: "Burgandy API Endpoint",
    platform: "API Client",
    shop: "api.burgandy.com/zucci",
    status: "synced",
    lastSync: "12 minutes ago",
    products: 40,
    failed: 7,
    pending: 0,
  },
  {
    id: "shopify_zeyylan",
    name: "Zeyylan Saudi Outlet",
    platform: "Shopify",
    shop: "zeyylan.myshopify.com",
    status: "disconnected",
    lastSync: "12 days ago",
    products: 22,
    failed: 4,
    pending: 0,
  },
  {
    id: "api_desertk",
    name: "Desert Kicks Retail",
    platform: "WooCommerce",
    shop: "desertcollection.com",
    status: "synced",
    lastSync: "8 minutes ago",
    products: 28,
    failed: 0,
    pending: 2,
  },
];

// Status labels & colors
const STATUS_META = {
  synced: {
    label: "Synced & Healthy",
    color: "var(--zg-good)",
    bg: "oklch(0.78 0.15 150 / 0.1)",
  },
  error: {
    label: "Sync Errors",
    color: "var(--zg-danger)",
    bg: "oklch(0.70 0.18 25 / 0.1)",
  },
  disconnected: {
    label: "Offline / Disconnected",
    color: "var(--zg-text-dim)",
    bg: "var(--zg-line-soft)",
  },
  warning: {
    label: "Warnings",
    color: "var(--zg-warn)",
    bg: "oklch(0.82 0.15 75 / 0.1)",
  },
};

const mockErrorsMap = {
  shopify_5th: [
    "Missing mandatory size chart on SKU: ABAYA-001-BLK-L",
    "Image resolution too low (540×540px) on product ID: 88299120",
    "Price mismatch: Shopify listing shows EGP 4,200 vs Zucci EGP 3,600",
    "Category mapping failure: modesty-wear taxonomy not configured",
  ],
  api_burgandy: [
    "API connection timeout during batch export",
    "Invalid authentication token signature",
    "Missing inventory stock level override on 2 SKUs",
  ],
  shopify_zeyylan: [
    "API credentials expired or revoked",
    "Webhook verification failed",
  ],
};

// ── State variables ───────────────────────────────────────
const platforms = ref(initialPlatforms);
const selectedPlatformId = ref(null);
const reSyncingAll = ref(false);

// ── Computed Properties ───────────────────────────────────
const connectedCount = computed(() => {
  return platforms.value.filter((p) => p.status !== "disconnected").length;
});

const syncedCount = computed(() => {
  return platforms.value.filter((p) => p.status === "synced").length;
});

const errorsCount = computed(() => {
  return platforms.value.filter((p) => p.status === "error").length;
});

const disconnectedCount = computed(() => {
  return platforms.value.filter((p) => p.status === "disconnected").length;
});

// ── Methods ───────────────────────────────────────────────
const toggleSelectPlatform = (id) => {
  if (selectedPlatformId.value === id) {
    selectedPlatformId.value = null;
  } else {
    selectedPlatformId.value = id;
  }
};

const reSyncPlatform = (p) => {
  p.lastSync = "syncing...";
  setTimeout(() => {
    p.status = "synced";
    p.lastSync = "Just now";
    p.failed = 0;
    p.pending = 0;
  }, 1200);
};

const triggerReSyncAll = () => {
  reSyncingAll.value = true;
  platforms.value.forEach((p) => {
    p.lastSync = "syncing...";
  });

  setTimeout(() => {
    platforms.value.forEach((p) => {
      if (p.status !== "disconnected") {
        p.status = "synced";
        p.failed = 0;
        p.pending = 0;
      }
      p.lastSync = "Just now";
    });
    reSyncingAll.value = false;
  }, 1500);
};
</script>

<style scoped>
.zv-module {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
