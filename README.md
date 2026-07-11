# Zucci Admin Dashboard — Vue 3 Application

Vite + Vue 3 (Composition API) admin dashboard for Zucci.
Reusable components, Vue Router, Pinia, scoped CSS, responsive shell.

---

## Quick start

### With Make + Docker (recommended)

```bash
make help          # list all targets
make local         # hot-reload dev  → http://localhost:5173
make staging       # staging nginx   → http://localhost:8081
make prod          # production nginx → http://localhost:8080
```

### With npm (no Docker)

```bash
npm install
npm run dev              # http://localhost:5173
npm run build:staging    # dist/ → staging API
npm run build:prod       # dist/ → production API
npm run preview
```

Fonts (Geist / Geist Mono) load from Google Fonts in `index.html`.

---

## Environments

| Env | Vite mode | API base | Docker / Make | Port |
|-----|-----------|----------|---------------|------|
| **local / dev** | `development` | `https://api.zucci.xyz/api/v1/` | `make local` | `5173` |
| **staging** | `staging` | `https://api.zucci.xyz/api/v1/` | `make staging` | `8081` |
| **production** | `production` | `https://api.zucci.com/api/v1/` | `make prod` | `8080` |

Config files:

- `.env.development` — local / `npm run dev`
- `.env.staging` — staging builds
- `.env.production` — production builds
- `.env.example` — documented template
- `.env.local` — optional local overrides (gitignored)

---

## Make targets

```bash
make help
```

| Target | Description |
|--------|-------------|
| `make install` | `npm ci` |
| `make dev` | Vite on the host (no Docker) |
| `make local` | Docker Vite hot-reload → `:5173` |
| `make local-build` | Rebuild & start local |
| `make staging` | Build & run staging nginx → `:8081` |
| `make prod` | Build & run production nginx → `:8080` |
| `make tf-plan ENV=staging` | Plan AWS infra |
| `make tf-apply ENV=prod` | Apply AWS infra |
| `make tf-output ENV=staging` | Print role ARN / bucket / CF id |
| `make logs SERVICE=staging` | Tail container logs |
| `make down` | Stop all compose services |
| `make clean` | Remove `dist/` |
| `make clean-all` | Stop containers + remove volumes |

---

## CI / CD (GitHub Actions + Terraform)

Mirrors **zucci-api**: OIDC (no long-lived AWS keys), branch → environment.

| Branch / trigger | Environment | How it deploys | URL |
|------------------|-------------|----------------|-----|
| `staging` push | staging | ECR image (arm64) → SSM on shared API EC2 `:8080` | `admin.zucci.xyz` → EIP:8080 |
| `main` push | prod | Vite build → S3 sync → CloudFront invalidation | `https://admin.zucci.com` |
| **Manual Deploy** (Actions UI) | staging or prod | Same pipelines — pick env, no commit needed | — |

Manual run: **Actions → Manual Deploy → Run workflow** (choose `staging` or `prod`).

### One-time setup

```bash
# 1. Staging infra (ECR + GitHub OIDC role) — requires API EC2 already up
make tf-apply ENV=staging
make tf-output ENV=staging   # copy github_actions_role_arn

# 2. Production infra (S3 + CloudFront + OIDC role)
make tf-apply ENV=prod
make tf-output ENV=prod      # copy role ARN + cloudfront_distribution_id
```

GitHub repo → **Settings → Environments**:

| Secret / variable | staging | prod |
|-------------------|---------|------|
| `AWS_ROLE_ARN` (secret) | ✅ | ✅ |
| `CLOUDFRONT_DISTRIBUTION_ID` (variable) | — | ✅ |
| `AWS_REGION` (variable, optional) | `us-east-1` | `us-east-1` |

Also open API CORS for `https://admin.zucci.xyz` / `https://admin.zucci.com` (see `infra/terraform/README.md`).

Full details: [`infra/terraform/README.md`](infra/terraform/README.md).

---

## Docker

Multi-stage `Dockerfile`:

1. **development** — Node + Vite (hot reload)
2. **build** — `vite build --mode <staging|production>`
3. **production** — nginx serving `dist/` (SPA + `/healthz`)

```bash
# equivalent to make targets
docker compose up local
docker compose up staging -d --build
docker compose up prod -d --build
docker compose down
```

---

## What's included

| Area | Status | Files |
|------|--------|-------|
| **Project scaffold** | ✅ | `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/App.vue` |
| **Docker / Make** | ✅ | `Dockerfile`, `docker-compose.yml`, `Makefile`, `docker/nginx/` |
| **CI / CD + Terraform** | ✅ | `.github/workflows/`, `infra/terraform/` |
| **Design tokens** (all `--zg-*` vars) | ✅ | `src/assets/styles/tokens.css` |
| **Global base + resets** | ✅ | `src/assets/styles/base.css` |
| **Vue Router** (auth flow + all module routes) | ✅ | `src/router/index.js` |
| **Reusable UI kit** (scoped CSS) | ✅ | `src/components/ui/*` |
| **Auth flow** | ✅ | `src/views/auth/*` |
| **App shell** | ✅ | `src/layouts/AdminLayout.vue`, `src/components/shell/*` |
| **Dashboard** | ✅ | `src/views/DashboardView.vue` |
| **Analytics charts** (vue-echarts) | ✅ | `src/views/AnalyticsView.vue` |

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

- **useClickOutside** — deferred-listener outside-click
- **useTheme** — runtime accent theming (`--zg-accent` / `--zg-accent-tint`)

---

## Architecture

```
Front-end-admin/
├── Makefile                   # make local | staging | prod | tf-apply | …
├── Dockerfile                 # multi-stage: development → build → nginx
├── docker-compose.yml         # local / staging / prod services
├── docker/nginx/default.conf  # SPA + healthz
├── .github/workflows/         # CI + Deploy (OIDC → EC2 / S3+CF)
├── infra/terraform/           # staging EC2 sidecar + prod static site
├── .env.development           # local → api.zucci.xyz
├── .env.staging               # staging → api.zucci.xyz
├── .env.production            # prod → api.zucci.com
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.js
    ├── App.vue
    ├── api/                   # axios http client + mock adapter
    ├── router/index.js
    ├── assets/styles/
    ├── composables/
    ├── components/
    │   ├── ui/
    │   └── shell/
    ├── layouts/
    │   ├── AdminLayout.vue
    │   └── SupplierLayout.vue
    ├── views/
    │   ├── auth/
    │   ├── admin/
    │   └── supplier/
    └── data/
```

### Two user types

| Area | Route prefix | Layout | Who |
|------|-------------|--------|-----|
| **Admin console** | `/admin/*` | `AdminLayout` | Internal ops / Zucci staff |
| **Supplier portal** | `/supplier/*` | `SupplierLayout` | Vendors / brand owners |
| **Auth** | `/auth/:step` | (bare) | Shared |

### CSS strategy

- **Global (not scoped):** design tokens + base resets only.
- **Scoped (`<style scoped>`):** every component owns its styles.
- **No inline styles** in components.

### State & routing

- Cross-cutting state (selected **market**) via `provide`/`inject` from `AdminLayout`.
- Each module is a **route** — deep links and browser back work.

### Charts

**vue-echarts** (ECharts). See `AnalyticsView.vue` for the option-object pattern.

### API client

`src/api/http.js` reads `VITE_API_BASE` from the active Vite mode.
Set `VITE_USE_MOCK=true` for the in-memory mock adapter.
