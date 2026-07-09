<template>
  <header class="zg-top">
    <!-- Left: breadcrumb + market -->
    <div class="zg-top-left">
      <div class="zg-breadcrumb">
        <span class="zg-bc-label">Control Tower</span>
        <span class="zg-bc-sep">/</span>
        <span class="zg-bc-current">{{ moduleLabel }}</span>
      </div>
      <div class="zg-market" @click.stop="marketOpen = !marketOpen">
        <span class="zg-market-flag">{{ currentMarket.prefix }}</span>
        <span class="zg-market-label">{{ currentMarket.label }}</span>
        <span class="zg-market-caret">▾</span>
        <div v-if="marketOpen" class="zg-market-menu" @click.stop>
          <div
            v-for="m in MARKET_OPTIONS"
            :key="m.value"
            class="zg-market-opt"
            :class="{ 'is-on': m.value === region }"
            @click="pickMarket(m)"
          >
            <span>{{ m.prefix }}</span
            ><span>{{ m.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Center: search-anywhere INPUT -->
    <div class="zg-search-wrap">
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
      <input
        ref="searchEl"
        v-model="query"
        class="zg-search-input"
        type="text"
        placeholder="Search anywhere — orders, brands, customers, pages…"
        @input="onInput"
        @focus="showResults = true"
        @blur="onBlur"
        @keydown.enter.prevent="onEnter"
        @keydown.down.prevent="onArrow(1)"
        @keydown.up.prevent="onArrow(-1)"
      />
      <kbd class="zg-search-kbd">⌘K</kbd>
      <div v-if="showResults && results.length" class="zg-search-results">
        <div
          v-for="(r, i) in results"
          :key="r.path"
          class="zg-search-result"
          :class="{ 'is-active': i === activeIdx }"
          @mousedown.prevent="go(r)"
          @mouseenter="activeIdx = i"
        >
          <span>{{ r.label }}</span
          ><span class="zg-search-path">{{ r.path }}</span>
        </div>
      </div>
      <div v-else-if="showResults && query.trim()" class="zg-search-results">
        <div class="zg-search-empty">No matches for "{{ query }}"</div>
      </div>
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
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
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

// Route → module breadcrumb label
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

// Market selector - hook up to the injected market if provided
const injectedMarket = inject('market', null);
const region = ref(injectedMarket ? injectedMarket.value : "mena");
const marketOpen = ref(false);
const currentMarket = computed(
  () =>
    MARKET_OPTIONS.find((m) => m.value === region.value) || MARKET_OPTIONS[1],
);
function pickMarket(m) {
  region.value = m.value;
  if (injectedMarket) {
    injectedMarket.value = m.value;
  }
  marketOpen.value = false;
}

// ── Search-anywhere command bar (real input) ──
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
const searchEl = ref(null);
const query = ref("");
const showResults = ref(false);
const activeIdx = ref(0);
const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];
  return SEARCH_INDEX.filter((i) => i.label.toLowerCase().includes(q)).slice(
    0,
    8,
  );
});
function onInput() {
  showResults.value = true;
  activeIdx.value = 0;
}
function go(item) {
  if (!item) return;
  router.push(item.path);
  query.value = "";
  showResults.value = false;
  searchEl.value && searchEl.value.blur();
}
function onEnter() {
  go(results.value[activeIdx.value] || results.value[0]);
}
function onArrow(d) {
  if (!results.value.length) return;
  activeIdx.value =
    (activeIdx.value + d + results.value.length) % results.value.length;
}
function onBlur() {
  setTimeout(() => {
    showResults.value = false;
  }, 150);
}

// ⌘K / Ctrl+K focus
function onKey(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    searchEl.value && searchEl.value.focus();
  }
  if (e.key === "Escape") {
    showResults.value = false;
    searchEl.value && searchEl.value.blur();
  }
}

// Live clock
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
.zg-market {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid var(--zg-line);
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  background: var(--zg-panel);
  color: var(--zg-text);
}
.zg-market-caret {
  color: var(--zg-text-dim);
  font-size: 9px;
}
.zg-market-menu {
  position: absolute;
  top: 36px;
  left: 0;
  min-width: 200px;
  background: var(--zg-bg-elev);
  border: 1px solid var(--zg-line);
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, .18);
  z-index: 50;
}
.zg-market-opt {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 9px;
  border-radius: 7px;
  font-size: 12px;
  color: var(--zg-text);
  cursor: pointer;
}
.zg-market-opt:hover {
  background: var(--zg-panel);
}
.zg-market-opt.is-on {
  background: var(--zg-panel);
  font-weight: 600;
}
.zg-search-wrap {
  position: relative;
  flex: 1;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.zg-search-ico {
  position: absolute;
  left: 12px;
  color: var(--zg-text-dim);
  pointer-events: none;
}
.zg-search-input {
  width: 100%;
  height: 30px;
  padding: 0 64px 0 36px;
  border: 1px solid var(--zg-line);
  border-radius: 6px;
  background: var(--zg-panel);
  color: var(--zg-text);
  font-size: 12.5px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.zg-search-input:focus {
  border-color: var(--zg-accent);
}
.zg-search-input::placeholder {
  color: var(--zg-text-dim);
}
.zg-search-kbd {
  position: absolute;
  right: 10px;
  font-size: 10px;
  font-family: var(--zg-mono);
  color: var(--zg-text-dim);
  border: 1px solid var(--zg-line);
  border-radius: 5px;
  padding: 2px 6px;
  background: var(--zg-bg-elev);
}
.zg-search-results {
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  background: var(--zg-bg-elev);
  border: 1px solid var(--zg-line);
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 10px 34px rgba(0, 0, 0, 0.2);
  z-index: 50;
  max-height: 340px;
  overflow: auto;
}
.zg-search-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 7px;
  font-size: 12px;
  color: var(--zg-text);
  cursor: pointer;
}
.zg-search-result.is-active,
.zg-search-result:hover {
  background: var(--zg-panel);
}
.zg-search-path {
  font-family: var(--zg-mono);
  font-size: 10.5px;
  color: var(--zg-text-dim);
}
.zg-search-empty {
  padding: 10px;
  font-size: 12px;
  color: var(--zg-text-dim);
  text-align: center;
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
