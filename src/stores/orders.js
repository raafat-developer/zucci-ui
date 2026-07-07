// src/stores/orders.js — Orders module store.
import http from '@/api/http';
import { createResourceStore } from './createResourceStore';

export const useOrdersStore = createResourceStore('orders', 'orders', {
  state: () => ({ detail: null }),
  getters: {
    byStatus: (s) => (status) => (status === 'all' ? s.items : s.items.filter((o) => o.status === status)),
  },
  actions: {
    async fetchDetail(id) {
      const { data } = await http.get(id ? `/orders/detail` : '/orders/detail');
      this.detail = data; return data;
    },
    async setStatus(id, status) { return this.update(id, { status }); },
    async addTag(id, tag) { const o = this.items.find((x) => x.id === id); return this.update(id, { tags: [...((o && o.tags) || []), tag] }); },
  },
});
