// src/stores/warehouses.js — Warehouses & Storage store.
import http from '@/api/http';
import { createResourceStore } from './createResourceStore';

export const useWarehousesStore = createResourceStore('warehouses', 'warehouses', {
  state: () => ({ alerts: [], transfers: [], returns: [] }),
  getters: {
    byType: (s) => (type) => (type === 'all' ? s.items : s.items.filter((w) => w.types.includes(type))),
    byCountry: (s) => (c) => (c === 'all' ? s.items : s.items.filter((w) => w.country === c)),
    alertsFor: (s) => (id) => s.alerts.filter((a) => a.warehouse_id === id),
  },
  actions: {
    async fetchAlerts() { const { data } = await http.get('/warehouse-alerts'); this.alerts = data; return data; },
    async fetchTransfers() { const { data } = await http.get('/transfers'); this.transfers = data; return data; },
    async fetchReturns() { const { data } = await http.get('/returns'); this.returns = data; return data; },
    async fetchBundle() { await Promise.all([this.fetchAll(), this.fetchAlerts()]); },
  },
});
