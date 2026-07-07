// src/stores/finance.js — Finance store (P&L + collections + singletons).
import http from '@/api/http';
import { defineStore } from 'pinia';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    pl: null, upcoming: null, cashflow: null,
    transactions: [], payouts: [], gateways: [], vat: [], wht: [], invoices: [],
    loading: false, error: null, loaded: false,
  }),
  actions: {
    async fetchBundle() {
      this.loading = true; this.error = null;
      try {
        const [pl, up, cf, tx, po, gw, vat, wht, inv] = await Promise.all([
          http.get('/finance/pl'), http.get('/finance/upcoming'), http.get('/finance/cashflow'),
          http.get('/transactions'), http.get('/payouts'), http.get('/gateways'),
          http.get('/vat'), http.get('/wht'), http.get('/invoices'),
        ]);
        this.pl = pl.data; this.upcoming = up.data; this.cashflow = cf.data;
        this.transactions = tx.data; this.payouts = po.data; this.gateways = gw.data;
        this.vat = vat.data; this.wht = wht.data; this.invoices = inv.data;
        this.loaded = true;
      } catch (e) { this.error = e.message; throw e; }
      finally { this.loading = false; }
    },
    async processPayout(id) { const { data } = await http.patch(`/payouts/${id}`, { status: 'processed' }); const i = this.payouts.findIndex((p) => p.id === id); if (i >= 0) this.payouts[i] = data; return data; },
  },
});
