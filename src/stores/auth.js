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
        const res = await http.post('/auth/admin/login', { email, password });
        // Map the real API response to our internal user shape.
        const actor = res.actor || {};
        const user = {
          id: actor.id,
          email: actor.email,
          firstName: actor.first_name,
          lastName: actor.last_name,
          role: actor.type,                                    // 'admin' | 'supplier'
          roleLabel: res.roles?.[0]?.name || actor.type,       // 'Super Admin'
          roles: res.roles || [],
          permissions: res.permissions || [],
          markets: res.markets || [],
          brands: res.brands || [],
          initials: `${(actor.first_name || '')[0] || ''}${(actor.last_name || '')[0] || ''}`.toUpperCase(),
        };
        this.token = res.token;
        this.user = user;
        window.toast?.success('Login successful');
        tokenStore.set(res.token, remember);
        tokenStore.setUser(user);
        return user;
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
      // http.post('/auth/logout').catch(() => {});
      this.token = null;
      this.user = null;
      tokenStore.clear();
      tokenStore.setUser(null);
      window.toast?.success('Logged out successfully');
    },
  },
});
