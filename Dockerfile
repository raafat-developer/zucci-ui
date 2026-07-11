# syntax=docker/dockerfile:1


ARG NODE_VERSION=20-alpine

# ── Dependencies ──────────────────────────────────────────────
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Development / local (hot reload → api.zucci.xyz, same as staging) ─
FROM node:${NODE_VERSION} AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV CHOKIDAR_USEPOLLING=true
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ── Production build (mode: staging | production) ────────────
FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# staging → api.zucci.xyz | production → api.zucci.com
ARG APP_ENV=production
ENV APP_ENV=$APP_ENV

RUN npm run build -- --mode "$APP_ENV"

# ── Runtime (nginx SPA) ──────────────────────────────────────
FROM nginx:1.27-alpine AS production
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
