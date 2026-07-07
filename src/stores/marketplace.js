// src/stores/marketplace.js — Marketplace store (listings + related collections).
import http from '@/api/http';
import { createResourceStore } from './createResourceStore';

export const useMarketplaceStore = createResourceStore('marketplace', 'listings', {
  state: () => ({ rules: [], disputes: [], sellers: [] }),
  actions: {
    async fetchRules() { const { data } = await http.get('/commission-rules'); this.rules = data; return data; },
    async fetchDisputes() { const { data } = await http.get('/disputes'); this.disputes = data; return data; },
    async fetchSellers() { const { data } = await http.get('/sellers'); this.sellers = data; return data; },
    async fetchBundle() { await Promise.all([this.fetchAll(), this.fetchRules(), this.fetchDisputes(), this.fetchSellers()]); },
    async approve(id) { return this.update(id, { status: 'approved' }); },
    async reject(id, issue) { return this.update(id, { status: 'rejected', issue }); },
  },
});
