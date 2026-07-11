<template>
  <header class="zg-top">
    <!-- Left: breadcrumb + market -->
    <div class="zg-top-left">
      <div class="zg-breadcrumb">
        <span class="zg-bc-label">Control Tower</span>
        <span class="zg-bc-sep">/</span>
        <span class="zg-bc-current">{{ moduleLabel }}</span>
      </div>
      <div style="position:relative;display:inline-block;min-width:220px">
        <ZSearchableSelect :model-value="region || ''" :options="MARKET_OPTIONS" placeholder="Assign market…" @update:model-value="setMarket" />
      </div>
    </div>

    <!-- Center: MacBook Spotlight search trigger -->
    <div class="zg-search-trigger" @click="openSearchModal">
      <svg
        class="zg-search-ico"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span class="zg-search-placeholder">Search anywhere — orders, products, customers…</span>
      <kbd class="zg-search-kbd">⌘K</kbd>
    </div>

    <!-- Right: clock + refresh -->
    <div class="zg-top-right">
      <div class="zg-clock">
        <span class="zg-clock-dot"></span>
        <span class="zg-clock-live">LIVE</span>
        <span class="zg-clock-time">{{ clock }}</span>
      </div>
      <button class="zg-icon-btn" title="Refresh" @click="refresh">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12a9 9 0 1 1-2.6-6.4" />
          <path d="M21 3v6h-6" />
        </svg>
      </button>
    </div>

    <!-- Spotlight Search Modal overlay -->
    <div v-if="isSearchModalOpen" class="zg-spotlight-backdrop" @click="closeSearchModal">
      <div class="zg-spotlight-modal" @click.stop>
        <div class="zg-spotlight-header">
          <svg
            class="zg-spotlight-search-ico"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref="spotlightInput"
            v-model="query"
            class="zg-spotlight-input"
            type="text"
            placeholder="Type a command or search…"
            @keydown.enter.prevent="onEnter"
            @keydown.down.prevent="onArrow(1)"
            @keydown.up.prevent="onArrow(-1)"
            @keydown.esc="closeSearchModal"
          />
          <kbd class="zg-spotlight-esc">ESC</kbd>
        </div>

        <div class="zg-spotlight-body">
          <div v-if="results.length" class="zg-spotlight-results">
            <div class="zg-spotlight-section-title">Search Results</div>
            <div
              v-for="(r, i) in results"
              :key="r.path"
              class="zg-spotlight-result-item"
              :class="{ 'is-active': i === activeIdx }"
              @click="go(r)"
              @mouseenter="activeIdx = i"
            >
              <span class="zg-spotlight-result-label">{{ r.label }}</span>
              <span class="zg-spotlight-result-path">{{ r.path }}</span>
            </div>
          </div>
          <div v-else-if="query.trim()" class="zg-spotlight-empty">
            No matches found for "{{ query }}"
          </div>
          <div v-else class="zg-spotlight-recent">
            <div class="zg-spotlight-section-title">Quick Navigation</div>
            <div
              v-for="(r, i) in SEARCH_INDEX.slice(0, 8)"
              :key="r.path"
              class="zg-spotlight-result-item"
              :class="{ 'is-active': i === activeIdx }"
              @click="go(r)"
              @mouseenter="activeIdx = i"
            >
              <span class="zg-spotlight-result-label">{{ r.label }}</span>
              <span class="zg-spotlight-result-path">{{ r.path }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import ZSearchableSelect from '@/components/ui/ZSearchableSelect.vue';

const route = useRoute();
const router = useRouter();

const MARKET_OPTIONS = [
  { value: "all", label: "All Markets", prefix: "🌍", tz: "Asia/Dubai" },
  { value: "mena", label: "MENA + GCC", prefix: "🌍", tz: "Asia/Dubai" },
  { value: "gcc", label: "GCC Only", prefix: "🏳", tz: "Asia/Riyadh" },
  {
    value: "ae",
    label: "United Arab Emirates",
    prefix: "🇦🇪",
    tz: "Asia/Dubai",
  },
  { value: "sa", label: "Saudi Arabia", prefix: "🇸🇦", tz: "Asia/Riyadh" },
  { value: "kw", label: "Kuwait", prefix: "🇰🇼", tz: "Asia/Kuwait" },
  { value: "qa", label: "Qatar", prefix: "🇶🇦", tz: "Asia/Qatar" },
  { value: "om", label: "Oman", prefix: "🇴🇲", tz: "Asia/Muscat" },
  { value: "bh", label: "Bahrain", prefix: "🇧🇭", tz: "Asia/Bahrain" },
];

const MODULE_LABELS = {
  "": "Dashboard",
  dashboard: "Dashboard",
  orders: "Orders",
  products: "Products",
  discounts: "Promotions & Marketing",
  analytics: "Analytics & Data",
  files: "File Manager",
  finance: "Finance & Transactions",
  brands: "Owners & Brands",
  customers: "Customers",
  warehouses: "Warehouses & Storage",
  marketplace: "Marketplace",
  channels: "Channels & CMS",
  comms: "Notifications & Comms",
  shortlinks: "Short Links",
  tickets: "Support Tickets",
  depots: "Depots & Hubs",
  drivers: "Drivers",
  fleet: "Fleet",
  carriers: "Carriers & 3PL",
  directory: "Roles & Permissions",
  developer: "Developer & API",
  inbox: "Inbox",
  returns: "Returns",
  audit: "Audit Log",
  profile: "Profile",
  settings: "Settings",
};

const moduleLabel = computed(() => {
  const seg = route.path.split("/").filter(Boolean)[0] || "";
  return MODULE_LABELS[seg] || route.meta?.title || "Dashboard";
});

const injectedMarket = inject('market', null);
const region = ref(injectedMarket ? injectedMarket.value : "mena");

const currentMarket = computed(
  () =>
    MARKET_OPTIONS.find((m) => m.value === region.value) || MARKET_OPTIONS[1],
);

const setMarket = (val) => {
  region.value = val;
  if (injectedMarket) {
    injectedMarket.value = val;
  }
  refresh();
};

const SEARCH_INDEX = [
  { label: "Dashboard", path: "/" },
  { label: "Orders", path: "/orders" },
  { label: "Products", path: "/products" },
  { label: "Categories", path: "/products/categories" },
  { label: "Variants", path: "/products/variants" },
  { label: "Bundles", path: "/products/bundles" },
  { label: "Promotions & Discounts", path: "/discounts" },
  { label: "Influencers", path: "/discounts/influencers" },
  { label: "Analytics", path: "/analytics" },
  { label: "Files", path: "/files" },
  { label: "Finance", path: "/finance" },
  { label: "Owners & Brands", path: "/brands" },
  { label: "Customers", path: "/customers" },
  { label: "Warehouses", path: "/warehouses" },
  { label: "Inventory", path: "/warehouses/inventory" },
  { label: "Inbound", path: "/warehouses/inbound" },
  { label: "Returns", path: "/warehouses/returns" },
  { label: "Transfers", path: "/warehouses/transfers" },
  { label: "Marketplace", path: "/marketplace" },
  { label: "Channels & CMS", path: "/channels" },
  { label: "Comms", path: "/comms" },
  { label: "Short Links", path: "/shortlinks" },
  { label: "Support Tickets", path: "/tickets" },
  { label: "Settings", path: "/settings" },
  { label: "Profile", path: "/profile" },
];

const query = ref("");
const isSearchModalOpen = ref(false);
const spotlightInput = ref(null);
const activeIdx = ref(0);

const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];
  return SEARCH_INDEX.filter((i) => i.label.toLowerCase().includes(q)).slice(
    0,
    8,
  );
});

const openSearchModal = () => {
  isSearchModalOpen.value = true;
  query.value = "";
  activeIdx.value = 0;
  setTimeout(() => {
    spotlightInput.value && spotlightInput.value.focus();
  }, 50);
};

const closeSearchModal = () => {
  isSearchModalOpen.value = false;
  query.value = "";
};

function go(item) {
  if (!item) return;
  router.push(item.path);
  closeSearchModal();
}

function onEnter() {
  const list = results.value.length ? results.value : SEARCH_INDEX.slice(0, 8);
  go(list[activeIdx.value] || list[0]);
}

function onArrow(d) {
  const list = results.value.length ? results.value : SEARCH_INDEX.slice(0, 8);
  if (!list.length) return;
  activeIdx.value = (activeIdx.value + d + list.length) % list.length;
}

function onKey(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openSearchModal();
  } else if (e.key.toLowerCase() === "k" && !isSearchModalOpen.value) {
    const activeEl = document.activeElement;
    const isTyping = activeEl && (
      activeEl.tagName === "INPUT" || 
      activeEl.tagName === "TEXTAREA" || 
      activeEl.isContentEditable
    );
    if (!isTyping) {
      e.preventDefault();
      openSearchModal();
    }
  }
}

const now = ref(new Date());
let timer = null;
const clock = computed(() => {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: currentMarket.value.tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now.value);
  } catch {
    return now.value.toLocaleTimeString();
  }
});

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
  window.addEventListener("keydown", onKey);
});

onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("keydown", onKey);
});

function refresh() {
  router.go(0);
}
</script>

<style scoped>
.zg-top {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding: 0 16px;
  border-bottom: 1px solid var(--zg-line);
  background: var(--zg-bg-elev);
}
.zg-top-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}
.zg-breadcrumb {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
}
.zg-bc-label {
  color: var(--zg-text-dim);
}
.zg-bc-sep {
  color: var(--zg-line);
}
.zg-bc-current {
  color: var(--zg-text);
  font-weight: 600;
}

/* Command Trigger style */
.zg-search-trigger {
  position: relative;
  flex: 1;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--zg-line);
  border-radius: 8px;
  background: var(--zg-panel);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.zg-search-trigger:hover {
  border-color: var(--zg-accent);
  background: var(--zg-bg-elev);
}
.zg-search-ico {
  color: var(--zg-text-dim);
  margin-right: 10px;
}
.zg-search-placeholder {
  font-size: 12.5px;
  color: var(--zg-text-dim);
  flex: 1;
}
.zg-search-kbd {
  font-size: 10px;
  font-family: var(--zg-mono);
  color: var(--zg-text-dim);
  border: 1px solid var(--zg-line);
  border-radius: 4px;
  padding: 1px 5px;
  background: var(--zg-bg-elev);
}

/* Spotlight modal styles */
.zg-spotlight-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  z-index: 100000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
}
.zg-spotlight-modal {
  width: 600px;
  background: var(--zg-bg-elev);
  border: 1px solid var(--zg-line);
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 450px;
  animation: spotlightFadeIn 0.15s ease-out;
}
@keyframes spotlightFadeIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.zg-spotlight-header {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--zg-line);
  gap: 12px;
}
.zg-spotlight-search-ico {
  color: var(--zg-accent);
  flex-shrink: 0;
}
.zg-spotlight-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 15px;
  color: var(--zg-text);
  outline: none;
}
.zg-spotlight-esc {
  font-family: inherit;
  font-size: 9px;
  padding: 2px 5px;
  border: 1px solid var(--zg-line);
  border-radius: 4px;
  color: var(--zg-text-dim);
  background: var(--zg-panel);
}
.zg-spotlight-body {
  overflow-y: auto;
  padding: 8px;
}
.zg-spotlight-section-title {
  padding: 8px 12px 4px;
  font-size: 9.5px;
  font-weight: 700;
  color: var(--zg-text-xdim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.zg-spotlight-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}
.zg-spotlight-result-item.is-active {
  background: var(--zg-accent-tint);
}
.zg-spotlight-result-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--zg-text);
}
.zg-spotlight-result-path {
  font-size: 11px;
  color: var(--zg-text-dim);
  font-family: var(--zg-mono);
}
.zg-spotlight-empty {
  padding: 30px;
  text-align: center;
  font-size: 13px;
  color: var(--zg-text-dim);
}

.zg-top-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.zg-clock {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--zg-mono);
  font-size: 12px;
  color: var(--zg-text);
  padding: 5px 10px;
  border: 1px solid var(--zg-line);
  border-radius: 8px;
  background: var(--zg-panel);
}
.zg-clock-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--zg-good);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--zg-good) 25%, transparent);
  animation: topbarPulse 1.8s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes topbarPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.35); }
}
.zg-clock-live {
  font-family: var(--zg-mono);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--zg-good);
  text-transform: uppercase;
  background: oklch(0.78 0.15 150 / 0.12);
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid oklch(0.78 0.15 150 / 0.25);
}
.zg-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--zg-line);
  border-radius: 8px;
  background: var(--zg-panel);
  color: var(--zg-text-dim);
  cursor: pointer;
}
.zg-icon-btn:hover {
  background: var(--zg-bg-elev);
  color: var(--zg-text);
}
</style>
