// src/stores/customers.js — Customers (Buyers) store.
import { createResourceStore } from './createResourceStore';

export const useCustomersStore = createResourceStore('customers', 'customers', {
  getters: {
    grouped: (s) => {
      const map = {};
      s.items.forEach((b) => { const ch = (b.lastName || b.name || '?')[0]?.toUpperCase() || '#'; const key = /[0-9]/.test(ch) ? '#' : ch; (map[key] = map[key] || []).push(b); });
      return Object.entries(map).sort(([a], [b]) => (a === '#' ? -1 : b === '#' ? 1 : a.localeCompare(b)));
    },
  },
  actions: {
    async suspend(id) { return this.update(id, { status: 'suspended' }); },
    async flag(id) { return this.update(id, { flagged: true }); },
  },
});
