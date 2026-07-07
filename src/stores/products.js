// src/stores/products.js — Products module store.
import http from '@/api/http';
import { createResourceStore } from './createResourceStore';

export const useProductsStore = createResourceStore('products', 'products', {
  state: () => ({ detail: null }),
  getters: {
    byStatus: (s) => (status) => (status === 'all' ? s.items : s.items.filter((p) => p.status === status || p.approvalStatus === status)),
    brands: (s) => [...new Set(s.items.map((p) => p.brand))],
    vendors: (s) => [...new Set(s.items.map((p) => p.vendor))],
    categories: (s) => [...new Set(s.items.map((p) => p.category))],
  },
  actions: {
    async fetchDetail(id) {
      // PRD-10001 has a rich detail record; others resolve from the list.
      if (id === 'PRD-10001') { const { data } = await http.get('/products/detail'); this.detail = data; return data; }
      const { data } = await http.get(`/products/${id}`);
      this.detail = data; return data;
    },
    async approve(id) { return this.update(id, { approvalStatus: 'approved', status: 'active' }); },
    async reject(id, reason) { return this.update(id, { approvalStatus: 'rejected', status: 'draft', rejectionReason: reason }); },
    async submitForReview(id) { return this.update(id, { approvalStatus: 'pending' }); },
    async setStatus(id, status) { return this.update(id, { status }); },
  },
});
