// src/stores/createResourceStore.js — factory for a CRUD-backed module store.
//
// Every module store is built on this. It gives consistent state (items, item,
// loading, error, loaded) and actions (fetchAll, fetchOne, create, update,
// remove) that talk to the API through http — mocked today, real backend later
// with no changes. Domain-specific actions are layered on top per module.
import { defineStore } from 'pinia';
import http from '@/api/http';

export function createResourceStore(name, resource, extra = {}) {
  return defineStore(name, {
    state: () => ({
      items: [],
      item: null,
      loading: false,
      saving: false,
      error: null,
      loaded: false,
      ...(extra.state ? extra.state() : {}),
    }),
    getters: { ...(extra.getters || {}) },
    actions: {
      async fetchAll(params) {
        this.loading = true; this.error = null;
        try {
          const { data } = await http.get(`/${resource}`, { params });
          this.items = data;
          this.loaded = true;
          return data;
        } catch (e) { this.error = e.message; throw e; }
        finally { this.loading = false; }
      },
      async fetchOne(id) {
        this.loading = true; this.error = null;
        try {
          const { data } = await http.get(`/${resource}/${id}`);
          this.item = data;
          return data;
        } catch (e) { this.error = e.message; throw e; }
        finally { this.loading = false; }
      },
      async create(payload) {
        this.saving = true;
        try {
          const { data } = await http.post(`/${resource}`, payload);
          this.items.unshift(data);
          return data;
        } catch (e) { this.error = e.message; throw e; }
        finally { this.saving = false; }
      },
      async update(id, patch) {
        this.saving = true;
        try {
          const { data } = await http.patch(`/${resource}/${id}`, patch);
          const key = this.items[0] && this.items[0].id != null ? 'id' : this.items[0] && this.items[0].sku != null ? 'sku' : 'id';
          const idx = this.items.findIndex((r) => String(r[key]) === String(id));
          if (idx >= 0) this.items[idx] = { ...this.items[idx], ...data };
          if (this.item && String(this.item[key]) === String(id)) this.item = { ...this.item, ...data };
          return data;
        } catch (e) { this.error = e.message; throw e; }
        finally { this.saving = false; }
      },
      async remove(id) {
        try {
          await http.delete(`/${resource}/${id}`);
          this.items = this.items.filter((r) => String(r.id) !== String(id) && String(r.sku) !== String(id));
        } catch (e) { this.error = e.message; throw e; }
      },
      ...(extra.actions || {}),
    },
  });
}
