// src/stores/auth.js — authentication + session (Pinia).
// Token is persisted in a cookie (see http.js tokenStore). Exposes isAuthenticated
// and role helpers used by the router guard to protect admin routes.
import { defineStore } from 'pinia';
import http, { tokenStore } from '@/api/http';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: tokenStore.get(),
    user: tokenStore.getUser(),
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    role: (s) => s.user?.role || null,
    isAdmin: (s) => s.user?.role === 'admin',
    isSupplier: (s) => s.user?.role === 'supplier',
    displayName: (s) => (s.user ? `${s.user.firstName} ${s.user.lastName}` : ''),
  },
  actions: {
    async login({ email, password, remember = true }) {
      this.loading = true; this.error = null;
      try {
        const { data } = await http.post('/auth/login', { email, password });
        this.token = data.token;
        this.user = data.user;
        tokenStore.set(data.token, remember);
        tokenStore.setUser(data.user);
        return data.user;
      } catch (e) {
        this.error = e.message || 'Login failed';
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      try {
        const { data } = await http.get('/auth/me');
        this.user = data.user;
        tokenStore.setUser(data.user);
        return data.user;
      } catch { return null; }
    },
    logout() {
      http.post('/auth/logout').catch(() => {});
      this.token = null;
      this.user = null;
      tokenStore.clear();
    },
  },
});
