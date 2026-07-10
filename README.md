# Zucci Admin Dashboard — Vue 3 Application

A **Vite + Vue 3 (Composition API)** conversion of the Zucci Admin Dashboard.
Reusable components, Vue Router, scoped CSS, no inline styles, responsive shell —
built as a real, runnable project (not a single HTML file).

---

## Quick start

```bash
cd vue-app
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the build
```

Fonts (Geist / Geist Mono) load from Google Fonts in `index.html`.

---

## What's included (fully converted & working)

| Area | Status | Files |
|------|--------|-------|
| **Project scaffold** | ✅ | `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/App.vue` |
| **Design tokens** (all `--zg-*` vars) | ✅ | `src/assets/styles/tokens.css` |
| **Global base + resets** | ✅ | `src/assets/styles/base.css` |
| **Vue Router** (auth flow + all module routes) | ✅ | `src/router/index.js` |
| **Reusable UI kit** (scoped CSS) | ✅ | `src/components/ui/*` |
| **Auth flow** (split screen, ops panel, 8 step screens, step navigator) | ✅ | `src/views/auth/*` |
| **App shell** (icon rail + topbar + layout grid) | ✅ | `src/layouts/AdminLayout.vue`, `src/components/shell/*` |
| **Dashboard** (market-aware KPI strip + live orders panel) | ✅ | `src/views/DashboardView.vue` |
| **Analytics charts** (vue-echarts reference pattern) | ✅ | `src/views/AnalyticsView.vue` |
| **Module scaffolds** (routed, shell-wired, UI-kit demo) | ✅ | `src/views/ModuleStub.vue` |

### Reusable UI components (`src/components/ui/`)

- **ZButton** — primary / ghost / quiet variants, `full`
- **ZInput** — prefix, right-affix slot, mono, error state, `v-model`
- **ZBanner** — error / warn / info / good tones
- **ZStatusPill** — good / warn / danger / accent / neutral
- **ZStepMarker** — dotted "Step N of M" progress
- **ZSearchableSelect** — type-to-filter, keyboard nav, outside-click close, viewport flip
- **ZDrawer** — right slide-in, backdrop + Esc close, animates **both** directions
- **ZModal** — centered fade + pop, backdrop + Esc close

### Composables (`src/composables/`)

- **useClickOutside** — deferred-listener outside-click (fixes the "dropdown closes on first click" bug)
- **useTheme** — runtime accent theming (writes `--zg-accent` / `--zg-accent-tint`)

---

## Architecture

```
vue-app/
├── index.html                 # Vite entry, loads fonts
├── vite.config.js             # @ alias → src/
├── package.json
└── src/
    ├── main.js                # createApp + router + global css
    ├── App.vue                # <router-view/>
    ├── router/index.js        # /auth/:step (bare) + / (AdminLayout children)
    ├── assets/styles/
    │   ├── tokens.css         # GLOBAL — CSS vars (must not be scoped)
    │   ├── base.css           # GLOBAL — resets, scrollbars, links
    │   └── authForm.css       # shared auth form chrome
    ├── composables/
    │   ├── useClickOutside.js
    │   └── useTheme.js
    ├── components/
    │   ├── ui/                # reusable kit (scoped CSS each)
    │   └── shell/             # SidebarRail, TopBar
    ├── layouts/
    │   ├── AdminLayout.vue    # rail + topbar + <router-view/>, provides market
    │   └── SupplierLayout.vue # 2nd user type — vendor/brand portal shell
    ├── views/
    │   ├── auth/              # AuthView, AuthFlow, OpsPanel, screens/*  (shared)
    │   ├── admin/             # ADMIN user type
    │   │   ├── DashboardView.vue
    │   │   ├── AnalyticsView.vue
    │   │   ├── ProfileView.vue     # my-account (profile/security/devices/activity…)
    │   │   └── ModuleScreen.vue    # config-driven list+detail for every module
    │   └── supplier/          # SUPPLIER user type (2nd)
    │       └── SupplierDashboard.vue
    └── data/
        ├── opsData.js         # auth ops-panel mock data
        ├── authSteps.js       # auth step registry
        └── adminModules.js    # KPIs/columns/rows/tabs for every admin module

### Two user types

The app serves two audiences off one codebase, split by route + layout:

| Area | Route prefix | Layout | Who |
|------|-------------|--------|-----|
| **Admin console** | `/admin/*` | `AdminLayout` | Internal ops / Zucci staff |
| **Supplier portal** | `/supplier/*` | `SupplierLayout` | Vendors / brand owners (2nd type) |
| **Auth** | `/auth/:step` | (bare) | Shared |

Each layout provides its own rail + market state. Swap in a real auth guard
(`router.beforeEach`) to route users to `/admin` or `/supplier` by role once a
backend is wired.

### Admin modules (config-driven)

Every admin list module — Orders, Products, Warehouses, Marketplace, Customers,
Finance, Promotions, Comms, Tickets — renders through **`ModuleScreen.vue`**,
which reads its KPIs, tabs, columns, rows and detail fields from
`src/data/adminModules.js` keyed by route name. Each screen is a real working
view: KPI strip, tab filters, live search, market filtering, a sortable-ready
table, and a row-detail drawer. To deepen any module into its full bespoke React
equivalent, replace its `component: adminModule` in `router/index.js` with a
dedicated `<Module>View.vue` (Dashboard, Analytics and Profile already are).
```

### CSS strategy

- **Global (not scoped):** design tokens + base resets only. CSS custom properties
  *must* be global — every scoped block references them.
- **Scoped (`<style scoped>`):** every component owns its styles. Class names are
  preserved from the React build so the design is identical.
- **No inline styles** in components (a couple of one-line demo hints in the stub
  aside; the real modules use scoped classes throughout).
- Large namespaced layout CSS (the `.zauth-*` ops panel) is co-located in its
  component's scoped block, split out of the original monolithic `styles-auth.css`.

### State & routing

- `useState` → `ref` / `reactive`; `useEffect` → `watch` / `onMounted`;
  `useMemo` → `computed`; portals → `<Teleport>`. (Full table in the original
  `Vue Conversion Brief.md`.)
- Cross-cutting state (selected **market**) is shared via `provide`/`inject`
  from `AdminLayout` → `TopBar` + module views. Swap in Pinia if you prefer a
  store as the app grows.
- The React app was a single fixed screen with a JS-driven view switch; here each
  module is a **route**, so deep links (`/warehouses`, `/analytics`) work and the
  browser back button behaves.

### Charts

The React build used Recharts. Vue uses **vue-echarts** (ECharts) — the idiomatic
Vue 3 charting lib. `AnalyticsView.vue` shows the option-object pattern (area +
bar, interactive tooltips). Every React `<AreaChart>` / `<BarChart>` / `<PieChart>`
maps onto an ECharts `option` object.

---
