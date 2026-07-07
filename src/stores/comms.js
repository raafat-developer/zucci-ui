// src/stores/comms.js — Notifications & Comms store.
import http from '@/api/http';
import { defineStore } from 'pinia';

export const useCommsStore = defineStore('comms', {
  state: () => ({ templates: [], campaigns: [], segments: [], abTests: [], deliveryLog: [], loading: false, error: null, loaded: false }),
  actions: {
    async fetchBundle() {
      this.loading = true; this.error = null;
      try {
        const [t, c, s, ab, dl] = await Promise.all([
          http.get('/comms-templates'), http.get('/campaigns'), http.get('/segments'), http.get('/ab-tests'), http.get('/delivery-log'),
        ]);
        this.templates = t.data; this.campaigns = c.data; this.segments = s.data; this.abTests = ab.data; this.deliveryLog = dl.data;
        this.loaded = true;
      } catch (e) { this.error = e.message; throw e; }
      finally { this.loading = false; }
    },
    async createCampaign(payload) { const { data } = await http.post('/campaigns', payload); this.campaigns.unshift(data); return data; },
  },
});
