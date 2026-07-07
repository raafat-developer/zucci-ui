// src/api/mock.js — in-memory mock backend (axios adapter).
//
// Emulates a real REST API over the existing mock data modules so stores/views
// call http exactly as they would against a live backend. When the real API is
// ready, set VITE_API_BASE and this adapter is bypassed automatically (see
// http.js USE_MOCK) — no store/view changes required.
//
// Supported shapes (method + url):
//   POST   /auth/login            → { token, user }
//   POST   /auth/logout           → {}
//   GET    /auth/me               → { user }
//   GET    /<resource>            → [ ...rows ]        (optionally filtered by query)
//   GET    /<resource>/:id        → row
//   POST   /<resource>            → created row
//   PATCH  /<resource>/:id        → updated row
//   DELETE /<resource>/:id        → { ok: true }

import { ZCP_PRODUCTS, ZCP_DETAIL_10001 } from '@/data/productsData';
import { ZC_ORDERS_LIST, ZC_ORDER_DETAIL } from '@/data/ordersData';
import { ZCW_WAREHOUSES, ZCW_ALERTS, ZCW_INVENTORY, ZCW_TRANSFERS, ZCW_RETURNS } from '@/data/warehouseData';
import { ZC_BUYERS } from '@/data/customersData';
import { ZC_TICKETS } from '@/data/ticketsData';
import { TEMPLATES, CAMPAIGNS, AUDIENCE_SEGMENTS, AB_TESTS, DELIVERY_LOG } from '@/data/commsData';
import { LISTINGS_DATA, COMMISSION_RULES, DISPUTES_DATA, SELLER_HUB } from '@/data/marketplaceData';
import {
  ZCF_PL, ZCF_TRANSACTIONS, ZCF_PAYOUTS, ZCF_GATEWAYS, ZCF_VAT, ZCF_RECONCILIATION,
  ZCF_UPCOMING, ZCF_INVOICE_QUEUE, ZCF_WHT, ZCF_CASHFLOW,
} from '@/data/financeData';

// Deep-clone so mutations in stores don't retroactively alter the source seed.
const clone = (v) => JSON.parse(JSON.stringify(v));

// Collection registry (list resources keyed by REST path segment).
const DB = {
  products:            clone(ZCP_PRODUCTS),
  orders:              clone(ZC_ORDERS_LIST),
  warehouses:          clone(ZCW_WAREHOUSES),
  'warehouse-alerts':  clone(ZCW_ALERTS),
  transfers:           clone(ZCW_TRANSFERS),
  returns:             clone(ZCW_RETURNS),
  customers:           clone(ZC_BUYERS),
  tickets:             clone(ZC_TICKETS),
  'comms-templates':   clone(TEMPLATES),
  campaigns:           clone(CAMPAIGNS),
  segments:            clone(AUDIENCE_SEGMENTS),
  'ab-tests':          clone(AB_TESTS),
  'delivery-log':      clone(DELIVERY_LOG),
  listings:            clone(LISTINGS_DATA),
  'commission-rules':  clone(COMMISSION_RULES),
  disputes:            clone(DISPUTES_DATA),
  sellers:             clone(SELLER_HUB),
  transactions:        clone(ZCF_TRANSACTIONS),
  payouts:             clone(ZCF_PAYOUTS),
  gateways:            clone(ZCF_GATEWAYS),
  vat:                 clone(ZCF_VAT),
  wht:                 clone(ZCF_WHT),
  invoices:            clone(ZCF_INVOICE_QUEUE),
};

// Singleton resources (objects, not collections).
const SINGLETONS = {
  'products/detail':  clone(ZCP_DETAIL_10001),
  'orders/detail':    clone(ZC_ORDER_DETAIL),
  'finance/pl':       clone(ZCF_PL),
  'finance/upcoming': clone(ZCF_UPCOMING),
  'finance/cashflow': clone(ZCF_CASHFLOW),
  'finance/reconciliation': clone(ZCF_RECONCILIATION),
};

const idKey = (row) => (row.id != null ? 'id' : row.sku != null ? 'sku' : 'code');
const matchQuery = (row, query) => Object.entries(query || {}).every(([k, v]) => v == null || v === 'all' || String(row[k]).toLowerCase() === String(v).toLowerCase());

// Mock users for auth.
const USERS = [
  { email: 'layla.haddad@zucci.com', password: 'admin', user: { id: 'ZC-4178', firstName: 'Layla', lastName: 'Al Mansouri', email: 'layla.haddad@zucci.com', role: 'admin', roleLabel: 'Super Admin', initials: 'LH' } },
  { email: 'vendor@lemaillot.com',   password: 'vendor', user: { id: 'VND-AE-001', firstName: 'Ahmed', lastName: 'M.', email: 'vendor@lemaillot.com', role: 'supplier', roleLabel: 'Brand Owner', initials: 'AM' } },
];

function makeToken(user) {
  // Fake JWT-ish token (header.payload.signature) — decodable but not verified.
  const payload = btoa(JSON.stringify({ sub: user.id, role: user.role, iat: Date.now() }));
  return `mock.${payload}.sig`;
}

function resolve(method, path, body, query) {
  // ── Auth ──
  if (path === 'auth/login' && method === 'post') {
    const found = USERS.find((u) => u.email.toLowerCase() === String(body.email || '').toLowerCase());
    if (!found || (body.password && body.password !== found.password && body.password !== 'admin')) {
      const err = new Error('Invalid credentials'); err.status = 401; throw err;
    }
    return { token: makeToken(found.user), user: found.user };
  }
  if (path === 'auth/logout' && method === 'post') return {};
  if (path === 'auth/me' && method === 'get') return { user: USERS[0].user };

  // ── Singletons ──
  if (SINGLETONS[path] !== undefined) {
    if (method === 'get') return clone(SINGLETONS[path]);
    if (method === 'patch' || method === 'put') { SINGLETONS[path] = { ...SINGLETONS[path], ...body }; return clone(SINGLETONS[path]); }
  }

  // ── Collections: /<resource> and /<resource>/:id ──
  const [resource, id] = path.split('/');
  const coll = DB[resource];
  if (coll) {
    if (!id) {
      if (method === 'get') return clone(coll.filter((r) => matchQuery(r, query)));
      if (method === 'post') { const row = { ...body, id: body.id || `${resource.toUpperCase()}-${Date.now()}` }; coll.unshift(row); return clone(row); }
    } else {
      const key = coll[0] ? idKey(coll[0]) : 'id';
      const idx = coll.findIndex((r) => String(r[key]) === String(id));
      if (method === 'get') return idx >= 0 ? clone(coll[idx]) : null;
      if (method === 'patch' || method === 'put') { if (idx >= 0) { coll[idx] = { ...coll[idx], ...body }; return clone(coll[idx]); } }
      if (method === 'delete') { if (idx >= 0) coll.splice(idx, 1); return { ok: true }; }
    }
  }

  const err = new Error(`Mock: no handler for ${method.toUpperCase()} /${path}`);
  err.status = 404;
  throw err;
}

// Axios adapter signature: (config) => Promise<AxiosResponse>
export function mockAdapter(config) {
  const method = (config.method || 'get').toLowerCase();
  const path = String(config.url || '').replace(/^\/+/, '').replace(/\?.*$/, '');
  const query = config.params || {};
  let body = {};
  try { body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {}; } catch { body = {}; }

  const latency = 120 + Math.random() * 260;
  return new Promise((resolve_, reject) => {
    setTimeout(() => {
      try {
        const data = resolve(method, path, body, query);
        resolve_({ data: { data }, status: 200, statusText: 'OK', headers: {}, config });
      } catch (e) {
        const status = e.status || 500;
        reject({ response: { status, data: { message: e.message } }, config, message: e.message });
      }
    }, latency);
  });
}
