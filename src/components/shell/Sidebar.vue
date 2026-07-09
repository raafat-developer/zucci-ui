<script setup>
/**
 * Sidebar — faithful Vue port of the React Sidebar (zucci-panels.jsx).
 * Collapsed by default (icon rail). The collapse/expand toggle sits above
 * Notifications in the foot. When expanded: full labels + accordion sub-menus
 * (opening one closes others). When collapsed: hovering an item shows a fly-out
 * of its sub-items. Foot has collapse toggle, notifications, settings, and the
 * user/account row. Uses the real .zg-rail* CSS (imported globally).
 */
import { ref, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({ isOpen: { type: Boolean, default: false } });
const emit = defineEmits([
  "toggle",
  "open-notifs",
  "open-settings",
  "open-profile",
]);

const route = useRoute();
const router = useRouter();

const ITEMS = [
  { id: "home", label: "Dashboard", icon: "live", sub: [] },
  {
    id: "orders",
    label: "Orders",
    icon: "box",
    sub: [
      "All Orders",
      "Processing",
      "Fulfilled",
      "Returns & Refunds",
      "COD Orders",
      "Cross-Border Returns",
      "Cancelled",
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: "tag",
    sub: [
      "All Products",
      "Add New Product",
      "Categories",
      "Size Charts",
      "Size Picker / Fit Finder",
      "Variant Manager",
      "Variant Requests",
    ],
  },
  {
    id: "discounts",
    label: "Promotions & Marketing",
    icon: "percent",
    sub: [
      "Promotions",
      "Coupons & Codes",
      "Gift Cards",
      "Campaigns",
      "Flash Sales",
      "Influencers",
      "Automated Rules",
      "Payment Deals",
      "Bundles",
    ],
  },
  {
    id: "analytics",
    label: "Analytics & Data",
    icon: "chart",
    sub: [
      "Overview",
      "Sales Analytics",
      "Customer Insights",
      "Product Performance",
      "Market Reports",
      "Export Data",
    ],
  },
  { id:"files", label:"Files", icon:"folder", sub:["All Files","Images","Videos","Documents","Media Library"] },
  { id:"finance", label:"Financial Transactions", icon:"coin", sub:["Overview / P&L","Transactions Ledger","Vendor Payouts","Gateway Reconciliation","VAT & Tax","Cash Flow","Invoices"] },
  { id:"owners", label:"Owners & Brands", icon:"building", sub:["Individuals","Businesses & Brands","KYB Reviews","Contracts","Onboarding"] },
  {
    id: "customers",
    label: "Customers",
    icon: "people",
    sub: [
      "All Customers",
      "Loyalty & Referrals",
      "Loyalty Tiers",
      "Abandoned Carts",
      "Wishlists & Gift Registry",
      "Flagged / Blocked",
    ],
  },
  {
    id: "warehouses",
    label: "Warehouses & Storage",
    icon: "warehouse",
    sub: [
      "All Warehouses",
      "Inventory Master",
      "Inbound Shipments",
      "Returns Queue",
      "Aging Dashboard",
      "Transfers",
      "Finance Summary",
    ],
  },
  { id:"marketplace", label:"Marketplace", icon:"store", sub:["Listings","Seller Hub","Categories","Commission Rules","Disputes"] },
  { id:"channels", label:"Channels", icon:"layers", sub:["Homepage Config","Page Builder","Navigation Menus","SEO Settings","Redirects"] },
  {
    id: "comms",
    label: "Notifications & Comms",
    icon: "comms",
    sub: [
      "Templates",
      "Campaigns",
      "Audience Segments",
      "A/B Tests",
      "Delivery Log",
    ],
  },
  { id:"shortlinks", label:"Short Links & Deep Links", icon:"link", sub:["All Links","Campaign Links","Analytics","UTM Builder"] },
  { id:"tickets", label:"Tickets", icon:"ticket", sub:["All Tickets","Open","In Progress","Resolved","Escalated","SLA Breached"] },
];

// Map sub-item label → route query. `status` for Orders filter; `tab` for the
// tab-based modules (each module reads route.query.tab to preselect its tab).
const SUB_QUERY = {
  orders: {
    Processing: "progress",
    Fulfilled: "completed",
    "Returns & Refunds": "returned",
    Cancelled: "cancelled",
  },
};
const SUB_TAB = {
  finance: {
    "Overview / P&L": "overview",
    "Transactions Ledger": "transactions",
    "Vendor Payouts": "payouts",
    "Gateway Reconciliation": "reconciliation",
    "VAT & Tax": "tax-compliance",
    "Cash Flow": "cash-flow",
    "Invoices": "tax-compliance",
    "Storage Costs": "storage-costs",
    "Reports": "reports",
  },
  marketplace: {
    Listings: "listings",
    "Seller Hub": "seller",
    "Commission Rules": "commission",
    Disputes: "disputes",
  },
  comms: {
    Templates: "templates",
    Campaigns: "campaigns",
    "Audience Segments": "audiences",
    "A/B Tests": "ab",
    "Delivery Log": "log",
  },
  warehouses: {
    "Inventory Master": "inventory",
    "Aging Dashboard": "aging",
    Transfers: "transfers",
    "Finance Summary": "finance",
    "Returns Queue": "alerts",
    "Inbound Shipments": "alerts",
  },
  discounts: {
    "Promotions":       "zucci",
    "Coupons & Codes":  "zucci",
    "Gift Cards":       "gift-cards",
    "Campaigns":        "campaigns",
    "Flash Sales":      "zucci",
    "Influencers":      "influencers",
    "Automated Rules":  "automated",
    "Payment Deals":    "payment",
  },
  files: {
    Images: "images",
    Videos: "videos",
    Documents: "documents",
    "Media Library": "media",
  },
  tickets: {
    Open: "open",
    "In Progress": "inprogress",
    Resolved: "resolved",
    Escalated: "escalated",
    "SLA Breached": "sla",
  },
  owners: {
    Individuals: "individuals",
    "Businesses & Brands": "businesses",
    "KYB Reviews": "kyb",
    Contracts: "contracts",
    Onboarding: "onboarding",
  },
  channels: {
    "Homepage Config": "homepage",
    "Page Builder": "pages",
    "Navigation Menus": "navigation",
    "SEO Settings": "seo",
    Redirects: "redirects",
  },
  shortlinks: {
    "All Links": "all",
    "Campaign Links": "campaigns",
    Analytics: "analytics",
    "UTM Builder": "utm",
  },
};
const SUB_PATH = {
  products: {
    "Add New Product": "/admin/products/new",
    "Size Charts": "/admin/products/size-charts",
    "Size Picker / Fit Finder": "/admin/products/fit-finder",
    "Variant Manager": "/admin/products/variants",
    "Variant Requests": "/admin/products/variant-requests",
  },
  discounts: {
    Bundles: "/admin/discounts/bundles",
  },
};

const ICONS = {
  live:        { vb:'0 0 24 24', d:'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0' },
  box:         { vb:'0 0 24 24', d:'M3 7L12 3L21 7V17L12 21L3 17Z M3 7L12 11L21 7 M12 11V21' },
  tag:         { vb:'0 0 24 24', d:'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7L7.01 7' },
  percent:     { vb:'0 0 24 24', d:'M19 5L5 19 M6.5 6.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0 M17.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0' },
  chart:       { vb:'0 0 24 24', d:'M4 20V4 M4 20H20 M8 16V12 M12 16V8 M16 16V10 M20 16V6' },
  file:        { vb:'0 0 24 24', d:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2L14 8L20 8 M8 13L16 13 M8 17L16 17' },
  coin:        { vb:'0 0 24 24', d:'M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M15 9C14 8 10 8 10 10C10 12 14 12 14 14C14 16 10 16 9 15 M12 7V17' },
  people:      { vb:'0 0 24 24', d:'M9 9m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M17 10m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0 M3 19C3 15 6 13 9 13C12 13 15 15 15 19 M15 18C15 15 17 14 17.5 14C19 14 21 15.5 21 18' },
  warehouse:   { vb:'0 0 24 24', d:'M3 10L12 4L21 10V20H3Z M7 20V14H17V20' },
  store:       { vb:'0 0 24 24', d:'M3 9l1-5h16l1 5 M3 9h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z M9 21V12h6v9' },
  comms:       { vb:'0 0 24 24', d:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
  channels:    { vb:'0 0 24 24', d:'M2 4h14a2 2 0 012 2v6a2 2 0 01-2 2H2V4z M2 10h14 M8 14v4 M5 18h6 M18 8h4a1 1 0 011 1v5a1 1 0 01-1 1h-4V8z M20 15v2' },
  ticket:      { vb:'0 0 24 24', d:'M2 8h20v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8z M2 8l3-4h14l3 4 M9 12h6' },
  building:    { vb:'0 0 24 24', d:'M5 21V6L13 3V21 M13 21V10L19 11V21 M5 21H21 M8 9H10 M8 13H10 M8 17H10 M16 14H17 M16 17H17' },
  link:        { vb:'0 0 24 24', d:'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' },
  folder:      { vb:'0 0 24 24', d:'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z' },
  layers:      { vb:'0 0 24 24', d:'M12 2L2 7l10 5 10-5-10-5 M2 17l10 5 10-5 M2 12l10 5 10-5' },
  bell:        { vb:'0 0 24 24', d:'M6 9A6 6 0 0118 9V14L20 17H4L6 14Z M10 20A2 2 0 0014 20' },
  gear:        { vb:'0 0 24 24', d:'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
  'panel-open':{ vb:'0 0 24 24', d:'M3 6L21 6 M3 12L14 12 M3 18L14 18 M18 9l3 3-3 3' },
  'panel-close':{ vb:'0 0 24 24', d:'M3 6L21 6 M3 12L21 12 M3 18L21 18 M21 9l-3 3 3 3' },
};

const expanded = ref([]);
const flyout = ref(null); // { id, y }
let closeTimer = null;

const activeId = computed(() => {
  const seg = route.path.split("/")[2];
  return seg === undefined || seg === "" || seg === "dashboard" ? "home" : seg;
});

watch(
  () => props.isOpen,
  (v) => {
    if (v) expanded.value = [activeId.value].filter((x) => x !== "home");
  },
);

const toggleExpand = (id) => {
  expanded.value = expanded.value.includes(id)
    ? expanded.value.filter((x) => x !== id)
    : [id];
};

const go = (id, sub) => {
  // Categories are a dedicated page shared by Products + Marketplace.
  if (sub === "Categories") {
    router.push({
      path: "/admin/categories",
      query: { type: id === "marketplace" ? "marketplace" : "products" },
    });
    flyout.value = null;
    return;
  }
  if (sub && SUB_PATH[id]?.[sub]) {
    router.push({ path: SUB_PATH[id][sub] });
    flyout.value = null;
    return;
  }
  const path = id === "home" ? "/admin/dashboard" : `/admin/${id}`;
  let q;
  if (sub && SUB_QUERY[id]?.[sub]) q = { status: SUB_QUERY[id][sub] };
  else if (id === 'files' && sub && SUB_TAB.files?.[sub]) q = { folder: SUB_TAB.files[sub] };
  else if (sub && SUB_TAB[id]?.[sub]) q = { tab: SUB_TAB[id][sub] };
  router.push(q ? { path, query: q } : path);
  flyout.value = null;
};

const onItemClick = (item) => {
  if (props.isOpen && item.sub.length) toggleExpand(item.id);
  else go(item.id);
  flyout.value = null;
};

const openFlyout = (e, item) => {
  if (props.isOpen || !item.sub.length) return;
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  const rect = e.currentTarget.getBoundingClientRect();
  flyout.value = { id: item.id, y: rect.top };
};
const scheduleClose = () => {
  closeTimer = setTimeout(() => {
    flyout.value = null;
  }, 160);
};
const cancelClose = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};
const flyoutItem = computed(
  () => ITEMS.find((i) => i.id === flyout.value?.id) || null,
);

const items = ITEMS;
const icons = ICONS;
</script>

<template>
  <aside class="zg-rail" :class="{ 'is-expanded': isOpen }">
    <div class="zg-logo" aria-label="Zucci">
      <!-- Collapsed: Zucci icon mark -->
      <svg
        v-if="!isOpen"
        viewBox="175 25 430 115"
        fill="var(--zg-accent)"
        aria-label="Zucci"
        width="36px"
        class="zg-logo-svg"
      >
        <path
          d="M194.85,127.94v-18.04l30.51-43.15h-29.33v-23.26h70.12v18.2l-28.99,42.98h29.67v23.26h-71.98Z"
        />
        <path
          d="M325.15,129.29c-14.27,0-25.43-3.62-33.46-10.87-8.04-7.25-12.05-17.28-12.05-30.09v-44.84h34.72v46.35c0,4.5.98,7.81,2.95,9.95,1.96,2.14,4.64,3.2,8.01,3.2s5.81-1.07,7.67-3.2c1.85-2.13,2.78-5.45,2.78-9.95v-46.35h34.05v44.84c0,12.92-3.91,22.98-11.72,30.17-7.81,7.19-18.79,10.79-32.95,10.79Z"
        />
        <path
          d="M427.47,129.29c-9.44,0-17.59-1.85-24.44-5.56-6.86-3.71-12.14-8.79-15.84-15.25-3.71-6.46-5.56-13.91-5.56-22.33s1.91-15.79,5.73-22.42c3.82-6.63,9.19-11.85,16.1-15.68,6.91-3.82,14.92-5.73,24.02-5.73,10.9,0,19.49,2.25,25.79,6.74l-3.71,22.92c-2.81-1.24-5.45-2.11-7.92-2.61-2.47-.51-4.83-.76-7.08-.76-5.51,0-9.86,1.55-13.06,4.64-3.2,3.09-4.8,7.28-4.8,12.56s1.57,9.35,4.72,12.56c3.14,3.2,7.3,4.81,12.47,4.81,4.49,0,9.78-.95,15.84-2.87l3.2,23.6c-3.71,1.8-7.56,3.15-11.55,4.05-3.99.9-8.63,1.35-13.91,1.35Z"
        />
        <path
          d="M506.52,129.29c-9.44,0-17.59-1.85-24.44-5.56-6.86-3.71-12.14-8.79-15.84-15.25-3.71-6.46-5.56-13.91-5.56-22.33s1.91-15.79,5.73-22.42c3.82-6.63,9.19-11.85,16.1-15.68,6.91-3.82,14.92-5.73,24.02-5.73,10.9,0,19.49,2.25,25.79,6.74l-3.71,22.92c-2.81-1.24-5.45-2.11-7.92-2.61-2.47-.51-4.83-.76-7.08-.76-5.51,0-9.86,1.55-13.06,4.64-3.2,3.09-4.8,7.28-4.8,12.56s1.57,9.35,4.72,12.56c3.14,3.2,7.3,4.81,12.47,4.81,4.49,0,9.78-.95,15.84-2.87l3.2,23.6c-3.71,1.8-7.56,3.15-11.55,4.05-3.99.9-8.63,1.35-13.91,1.35Z"
        />
        <path
          d="M562.31,34.22c-5.17,0-9.61-1.66-13.32-4.97-3.71-3.31-5.56-7.39-5.56-12.22,0-3.37.9-6.32,2.7-8.85,1.8-2.53,4.16-4.52,7.08-5.98,2.92-1.46,5.95-2.19,9.1-2.19,3.48,0,6.66.79,9.52,2.36,2.87,1.57,5.17,3.65,6.91,6.24,1.74,2.58,2.61,5.39,2.61,8.43,0,3.37-.93,6.35-2.78,8.94s-4.21,4.61-7.08,6.07c-2.86,1.46-5.93,2.19-9.19,2.19ZM576.13,129.29c-7.53,0-13.63-1.35-18.29-4.05-4.66-2.7-8.06-6.35-10.2-10.96-2.14-4.61-3.2-9.78-3.2-15.51v-55.29h35.57v50.4c0,2.59.76,4.58,2.28,5.98,1.52,1.41,3.34,2.11,5.48,2.11,2.25,0,4.55-.67,6.91-2.02l1.85,23.43c-2.47,1.91-5.67,3.37-9.61,4.38-3.94,1.01-7.53,1.52-10.79,1.52Z"
        />
      </svg>
      <!-- Expanded: Zucci full wordmark -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2073.43 377.57"
        class="zg-logo-svg"
        style="
          height: 20px;
          width: auto;
          display: block;
          fill: var(--zg-accent);
          flex-shrink: 0;
        "
      >
        <g>
          <path
            d="M1711.81,117.33l-.17,46.36v48.24c0,10.22-6.89,19.68-16.94,21.49-13.21,2.38-24.71-7.7-24.71-20.47v-2.89h-37.2l-28.86,75.59,102.42-.88c39.7-.34,71.7-32.62,71.7-72.32v-95.11h-66.24Z"
          />
          <path
            d="M1310.34,142.12c3.74.25,7.47.7,11.17,1.38,22.49,4.09,43.84,16.87,55.69,36.42,7.66,12.63,11.13,27.6,10.81,42.37-.46,21.25-10.06,15.93-6.49,36.88-3.6-4.25-5.61,17.95-9.2,13.69-10.87,14.36-26.91,24.28-44.03,29.89-17.12,5.61-35.33,7.17-53.34,7-22.21-.21-45.03-3.18-64.41-14.01-20.51-11.46-35.93-31.58-42.02-54.27-8.64-32.22,1.07-66.19,10.73-98.12,20,0,40-.01,60.01-.02-4.19,12.94-10.06,25.31-13.93,38.36-3.87,13.04-5.66,27.21-1.54,40.18,2.43,7.65,8.15,15.19,13.73,20.99,3.43,3.57,17.29,12.83,29.33,14.49,16.52,2.28,33.77-1.99,41.4-6.19,8.97-4.93,13.79-15.57,14.38-25.79.62-10.76-3.8-22.05-12.56-28.33-6.12-4.38-13.8-6.04-21.37-5.91"
          />
          <path
            d="M1602.38,117.27v96.47c0,5.2-4.22,9.43-9.43,9.43s-9.43-4.22-9.43-9.43v-96.41h-67.67v89.25c0,.8-.04,1.41-.06,2.09v5.19c0,5.21-4.22,9.43-9.43,9.43s-9.43-4.22-9.43-9.43v-96.53h-67.67v105.6l-78.07.33.17,61.06,160.65.67c19.46,0,32.08-5.5,37.87-16.51,15.01,11.46,33.03,17.18,54.05,17.18,19.57,0,35.53-6.45,47.88-19.35,12.34-12.9,18.62-27.69,18.18-44.37l.33-104.59-67.95-.06Z"
          />
          <path
            d="M2041.45,99.07c-8.5,0-15.81-2.73-21.91-8.18-6.1-5.45-9.16-12.16-9.16-20.11,0-5.55,1.48-10.4,4.44-14.56,2.96-4.16,6.84-7.44,11.65-9.85,4.8-2.4,9.8-3.61,14.97-3.61,5.73,0,10.95,1.3,15.67,3.89,4.72,2.59,8.5,6.01,11.37,10.26,2.87,4.25,4.3,8.88,4.3,13.87,0,5.54-1.53,10.44-4.58,14.7-3.05,4.25-6.94,7.58-11.65,9.99-4.72,2.4-9.76,3.6-15.12,3.6Z"
          />
          <path
            d="M1777.31,100.04c-8.5,0-15.81-2.73-21.91-8.18-6.1-5.45-9.16-12.16-9.16-20.11,0-5.55,1.48-10.4,4.44-14.56,2.96-4.16,6.84-7.44,11.65-9.85,4.8-2.4,9.8-3.61,14.97-3.61,5.73,0,10.95,1.3,15.67,3.89,4.72,2.59,8.5,6.01,11.37,10.26,2.87,4.25,4.3,8.88,4.3,13.87,0,5.54-1.53,10.44-4.58,14.7-3.05,4.25-6.94,7.58-11.65,9.99-4.72,2.4-9.76,3.6-15.12,3.6Z"
          />
          <path
            d="M1712.28,100.04c-8.5,0-15.81-2.73-21.91-8.18-6.1-5.45-9.16-12.16-9.16-20.11,0-5.55,1.48-10.4,4.44-14.56,2.96-4.16,6.84-7.44,11.65-9.85,4.8-2.4,9.8-3.61,14.97-3.61,5.73,0,10.95,1.3,15.67,3.89,4.72,2.59,8.5,6.01,11.37,10.26,2.87,4.25,4.3,8.88,4.3,13.87,0,5.54-1.53,10.44-4.58,14.7-3.05,4.25-6.94,7.58-11.65,9.99-4.72,2.4-9.76,3.6-15.12,3.6Z"
          />
          <path
            d="M2002.21,355.12c-8.29,0-15.96-.75-23.04-2.27-7.07-1.51-13.23-3.38-18.48-5.6l9.09-43.34c3.44,1.21,6.87,2.12,10.31,2.73,3.44.61,6.57.91,9.4.91,7.07,0,12.17-1.82,15.31-5.46,3.13-3.64,4.7-9.5,4.7-17.58V116.66h63.95v162.38c0,24.45-5.86,43.24-17.58,56.38-11.72,13.13-29.6,19.7-53.65,19.7Z"
          />
          <path
            d="M1879.07,114.98c-16.58,0-31.16,3.65-43.74,10.93-12.59,7.3-22.36,17.27-29.32,29.92-5.75,10.46-8.99,22.07-9.98,34.72-.21,2.66-.45,5.3-.45,8.06,0,16.08,3.38,30.3,10.13,42.63,6.75,12.33,16.37,22.04,28.85,29.12l.26.15c15.35,8.61,33.79,9.9,50.71,5.08.8-.23,1.64-.53,2.45-.78v9.69c0,8.08-1.57,13.94-4.7,17.58-3.14,3.64-8.24,5.46-15.31,5.46-2.83,0-5.96-.31-9.4-.91-3.43-.61-6.87-1.51-10.31-2.73l-9.09,43.34c5.26,2.22,11.42,4.09,18.49,5.61,7.07,1.52,14.75,2.27,23.04,2.27,24.04,0,41.93-6.56,53.65-19.7,11.72-13.14,17.58-31.93,17.58-56.38V114.98h-72.86ZM1895.55,221.08h-20.44c-11.29,0-20.44-9.15-20.44-20.44s9.15-20.44,20.44-20.44h20.44v40.87Z"
          />
          <path
            d="M1549.6,100.04c-8.5,0-15.81-2.73-21.91-8.18-6.1-5.45-9.16-12.16-9.16-20.11,0-5.55,1.48-10.4,4.44-14.56,2.96-4.16,6.84-7.44,11.65-9.85,4.8-2.4,9.8-3.61,14.97-3.61,5.73,0,10.95,1.3,15.67,3.89,4.72,2.59,8.5,6.01,11.37,10.26,2.87,4.25,4.3,8.88,4.3,13.87,0,5.54-1.53,10.44-4.58,14.7-3.05,4.25-6.94,7.58-11.65,9.99-4.72,2.4-9.76,3.6-15.12,3.6Z"
          />
          <path
            d="M1484.57,100.04c-8.5,0-15.81-2.73-21.91-8.18-6.1-5.45-9.16-12.16-9.16-20.11,0-5.55,1.48-10.4,4.44-14.56,2.96-4.16,6.84-7.44,11.65-9.85,4.8-2.4,9.8-3.61,14.97-3.61,5.73,0,10.95,1.3,15.67,3.89,4.72,2.59,8.5,6.01,11.37,10.26,2.87,4.25,4.3,8.88,4.3,13.87,0,5.54-1.53,10.44-4.58,14.7-3.05,4.25-6.94,7.58-11.65,9.99-4.72,2.4-9.76,3.6-15.12,3.6Z"
          />
          <path
            d="M1614.62,100.04c-8.5,0-15.81-2.73-21.91-8.18-6.1-5.45-9.16-12.16-9.16-20.11,0-5.55,1.48-10.4,4.44-14.56,2.96-4.16,6.84-7.44,11.65-9.85,4.8-2.4,9.8-3.61,14.97-3.61,5.73,0,10.95,1.3,15.67,3.89,4.72,2.59,8.5,6.01,11.37,10.26,2.87,4.25,4.3,8.88,4.3,13.87,0,5.54-1.53,10.44-4.58,14.7-3.05,4.25-6.94,7.58-11.65,9.99-4.72,2.4-9.76,3.6-15.12,3.6Z"
          />
          <path
            d="M1307.66,377.57c-8.5,0-15.81-2.73-21.91-8.18-6.1-5.45-9.16-12.16-9.16-20.11,0-5.55,1.48-10.4,4.44-14.56,2.96-4.16,6.84-7.44,11.65-9.85,4.8-2.4,9.8-3.61,14.97-3.61,5.73,0,10.95,1.3,15.67,3.89,4.72,2.59,8.5,6.01,11.37,10.26,2.87,4.25,4.3,8.88,4.3,13.87,0,5.54-1.53,10.44-4.58,14.7s-6.94,7.58-11.65,9.99c-4.72,2.4-9.76,3.6-15.12,3.6Z"
          />
          <path
            d="M1242.63,377.57c-8.5,0-15.81-2.73-21.91-8.18-6.1-5.45-9.16-12.16-9.16-20.11,0-5.55,1.48-10.4,4.44-14.56,2.96-4.16,6.84-7.44,11.65-9.85,4.8-2.4,9.8-3.61,14.97-3.61,5.73,0,10.95,1.3,15.67,3.89,4.72,2.59,8.5,6.01,11.37,10.26,2.87,4.25,4.3,8.88,4.3,13.87,0,5.54-1.53,10.44-4.58,14.7-3.05,4.25-6.94,7.58-11.65,9.99-4.72,2.4-9.76,3.6-15.12,3.6Z"
          />
        </g>
        <g>
          <path
            d="M0,321.54v-45.33l76.68-108.45H2.97v-58.46h176.23v45.75l-72.87,108.03h74.56v58.46H0Z"
          />
          <path
            d="M327.47,324.93c-35.87,0-63.9-9.11-84.09-27.32-20.2-18.22-30.29-43.42-30.29-75.62v-112.69h87.27v116.5c0,11.3,2.47,19.64,7.41,25,4.94,5.37,11.65,8.05,20.12,8.05s14.61-2.68,19.28-8.05c4.66-5.36,6.99-13.7,6.99-25v-116.5h85.57v112.69c0,32.48-9.82,57.76-29.44,75.83-19.63,18.08-47.23,27.11-82.82,27.11Z"
          />
          <path
            d="M584.62,324.93c-23.72,0-44.21-4.66-61.43-13.98-17.23-9.32-30.5-22.09-39.82-38.34-9.32-16.24-13.98-34.95-13.98-56.13s4.8-39.68,14.4-56.35c9.6-16.66,23.09-29.79,40.46-39.4,17.37-9.6,37.49-14.41,60.37-14.41,27.39,0,49,5.66,64.82,16.94l-9.32,57.62c-7.06-3.11-13.7-5.3-19.91-6.57-6.22-1.27-12.15-1.9-17.79-1.9-13.84,0-24.78,3.88-32.83,11.65-8.05,7.77-12.07,18.29-12.07,31.56s3.95,23.51,11.86,31.56c7.9,8.05,18.35,12.08,31.35,12.08,11.29,0,24.57-2.4,39.82-7.21l8.05,59.31c-9.32,4.52-19,7.91-29.02,10.17-10.03,2.26-21.68,3.39-34.95,3.39Z"
          />
          <path
            d="M783.3,324.93c-23.72,0-44.21-4.66-61.43-13.98-17.23-9.32-30.5-22.09-39.82-38.34-9.32-16.24-13.98-34.95-13.98-56.13s4.8-39.68,14.4-56.35c9.6-16.66,23.09-29.79,40.46-39.4,17.37-9.6,37.49-14.41,60.37-14.41,27.39,0,49,5.66,64.82,16.94l-9.32,57.62c-7.06-3.11-13.7-5.3-19.91-6.57-6.22-1.27-12.15-1.9-17.79-1.9-13.84,0-24.78,3.88-32.83,11.65-8.05,7.77-12.07,18.29-12.07,31.56s3.95,23.51,11.86,31.56c7.9,8.05,18.35,12.08,31.35,12.08,11.29,0,24.57-2.4,39.82-7.21l8.05,59.31c-9.32,4.52-19,7.91-29.02,10.17-10.03,2.26-21.68,3.39-34.95,3.39Z"
          />
          <path
            d="M923.52,85.99c-12.99,0-24.15-4.16-33.47-12.5-9.32-8.33-13.98-18.57-13.98-30.72,0-8.47,2.26-15.88,6.78-22.24,4.51-6.35,10.45-11.36,17.79-15.03,7.34-3.67,14.97-5.51,22.88-5.51,8.75,0,16.73,1.98,23.93,5.93,7.21,3.96,12.99,9.18,17.37,15.68,4.37,6.5,6.57,13.55,6.57,21.18,0,8.48-2.33,15.96-6.99,22.46-4.66,6.5-10.59,11.58-17.8,15.25-7.2,3.68-14.9,5.51-23.09,5.51ZM958.25,324.93c-18.92,0-34.24-3.39-45.96-10.17-11.72-6.78-20.27-15.96-25.63-27.54-5.37-11.58-8.05-24.57-8.05-38.97V109.3h89.39v126.66c0,6.5,1.91,11.51,5.72,15.04,3.81,3.53,8.4,5.3,13.77,5.3,5.64,0,11.44-1.69,17.37-5.08l4.66,58.89c-6.22,4.8-14.26,8.48-24.14,11.01-9.89,2.54-18.93,3.81-27.12,3.81Z"
          />
        </g>
      </svg>
    </div>

    <nav class="zg-rail-nav">
      <div
        v-for="item in items"
        :key="item.id"
        class="zg-rail-item-wrap"
        @mouseenter="openFlyout($event, item)"
        @mouseleave="scheduleClose"
      >
        <button
          class="zg-rail-btn"
          :class="{ 'is-active': activeId === item.id }"
          :title="!isOpen ? item.label : undefined"
          @click="onItemClick(item)"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path :d="icons[item.icon]?.d || icons[item.icon]" />
          </svg>
          <span v-if="isOpen" class="zg-rail-label">{{ item.label }}</span>
          <svg
            v-if="isOpen && item.sub.length"
            class="zg-rail-chevron"
            :class="{ open: expanded.includes(item.id) }"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <span v-if="!isOpen" class="zg-rail-tip">{{ item.label }}</span>
        </button>
        <div
          v-if="isOpen && item.sub.length"
          class="zg-rail-subitems"
          :class="{ 'is-open': expanded.includes(item.id) }"
        >
          <button
            v-for="(s, i) in item.sub"
            :key="i"
            class="zg-rail-subitem"
            @click="go(item.id, s)"
          >
            {{ s }}
          </button>
        </div>

        <!-- Collapsed flyout — rendered inside the group for seamless hover bridging -->
        <div
          v-if="!isOpen && flyout && flyout.id === item.id && item.sub.length"
          class="zg-rail-flyout"
          :style="{ top: flyout.y + 'px' }"
          @mouseenter="cancelClose"
          @mouseleave="scheduleClose"
        >
          <div class="zg-rail-flyout-title">{{ item.label }}</div>
          <button
            v-for="(s, si) in item.sub"
            :key="si"
            class="zg-rail-flyout-item"
            @click="go(item.id, s)"
          >
            {{ s }}
          </button>
        </div>
      </div>
    </nav>

    <div class="zg-rail-foot">
      <button
        class="zg-rail-btn"
        :title="isOpen ? 'Collapse menu' : 'Expand menu'"
        @click="emit('toggle')"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path :d="isOpen ? icons['panel-close']?.d : icons['panel-open']?.d" />
        </svg>
        <span
          v-if="isOpen"
          class="zg-rail-label"
          style="color: var(--zg-text-dim); font-size: 11.5px"
          >Collapse</span
        >
        <span v-else class="zg-rail-tip">Expand menu</span>
      </button>
      <button
        class="zg-rail-btn"
        title="Notifications"
        @click="emit('open-notifs')"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path :d="icons.bell?.d || icons.bell" />
        </svg>
        <span v-if="isOpen" class="zg-rail-label">Notifications</span>
        <span v-else class="zg-rail-tip">Notifications</span>
        <span class="zg-rail-dot" />
      </button>
      <button
        class="zg-rail-btn"
        title="Settings"
        @click="emit('open-settings')"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path :d="icons.gear?.d || icons.gear" />
        </svg>
        <span v-if="isOpen" class="zg-rail-label">Settings</span>
        <span v-else class="zg-rail-tip">Settings</span>
      </button>
      <div
        class="zg-rail-avatar"
        title="My Profile"
        style="cursor: pointer"
        @click="emit('open-profile')"
      >
        <span>ZC</span>
        <span
          v-if="isOpen"
          class="zg-rail-label"
          style="font-size: 12px; color: var(--zg-text-mid); font-weight: 500"
          >Sara Medhat</span
        >
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* ─── Expanded sidebar override ─── */
.zg-rail.is-expanded {
  width: 260px;
  align-items: stretch;
  padding: 10px 8px;
  overflow: visible;
}

/* ─── Logo ─── */
.zg-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 0 6px;
}
.is-expanded .zg-logo {
  justify-content: flex-start;
  padding-left: 10px;
}
.zg-logo-svg {
  display: block;
}

/* ─── Nav scroll area ─── */
.is-expanded .zg-rail-nav {
  padding: 4px 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--zg-line) transparent;
}
.is-expanded .zg-rail-nav::-webkit-scrollbar {
  width: 5px;
}
.is-expanded .zg-rail-nav::-webkit-scrollbar-track {
  background: transparent;
}
.is-expanded .zg-rail-nav::-webkit-scrollbar-thumb {
  background: var(--zg-line);
  border-radius: 3px;
}

/* ─── Item wrap ─── */
.zg-rail-item-wrap {
  position: relative;
}

/* ─── Button (expanded) ─── */
.is-expanded .zg-rail-btn {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  justify-content: flex-start;
}
.is-expanded .zg-rail-btn svg:first-child {
  flex-shrink: 0;
}

/* ─── Label ─── */
.zg-rail-label {
  flex: 1;
  min-width: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: 500;
  color: inherit;
}

/* ─── Chevron ─── */
.zg-rail-chevron {
  flex-shrink: 0;
  margin-left: auto;
  transition: transform 0.18s ease;
}
.zg-rail-chevron.open {
  transform: rotate(180deg);
}

/* ─── Accordion sub-items (expanded mode) ─── */
.zg-rail-subitems {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.22s ease,
    margin 0.22s ease,
    opacity 0.18s ease;
  opacity: 0;
  margin: 0 0 0 30px;
  padding-left: 8px;
  border-left: 1px solid var(--zg-line);
}
.zg-rail-subitems.is-open {
  max-height: 600px;
  opacity: 1;
  margin: 2px 0 4px 30px;
}

.zg-rail-subitem {
  display: block;
  width: 100%;
  text-align: left;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--zg-text-dim);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: inherit;
}
.zg-rail-subitem:hover {
  background: var(--zg-panel);
  color: var(--zg-text);
}

/* ─── Foot (expanded) ─── */
.is-expanded .zg-rail-foot {
  align-items: stretch;
}
.is-expanded .zg-rail-avatar {
  width: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px;
  border-radius: 8px;
}
.is-expanded .zg-rail-avatar:hover {
  background: var(--zg-panel);
}

/* ─── Collapsed flyout menu ─── */
.zg-rail-flyout {
  position: fixed;
  left: 60px;
  z-index: 9999;
  min-width: 200px;
  max-height: 70vh;
  overflow-y: auto;
  background: var(--zg-bg-elev);
  border: 1px solid var(--zg-line);
  border-radius: 10px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.45);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  animation: zg-flyIn 0.12s ease;
}
/* Invisible bridge between rail and flyout so hover doesn't break */
.zg-rail-flyout::before {
  content: "";
  position: absolute;
  left: -14px;
  top: 0;
  width: 14px;
  height: 100%;
}

@keyframes zg-flyIn {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.zg-rail-flyout-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--zg-accent);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 6px 10px 5px;
  white-space: nowrap;
}

.zg-rail-flyout-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 12.5px;
  color: var(--zg-text-dim);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
}
.zg-rail-flyout-item:hover {
  background: var(--zg-panel-hi);
  color: var(--zg-text);
}
</style>
