// src/api/http.js — axios instance + interceptors.
//
// Token is stored in a cookie (js-cookie). The request interceptor attaches it
// as a Bearer header; the response interceptor unwraps the payload and handles
// 401 (clear session + redirect to auth) and normalizes errors.
//
// Set VITE_API_BASE in .env to point to the real API. To use the in-memory mock
// instead (offline dev), set VITE_USE_MOCK=true.

import axios from 'axios';
import Cookies from 'js-cookie';
import { mockAdapter } from './mock';

export const TOKEN_COOKIE = 'zucci_token';
export const USER_COOKIE = 'zucci_user';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const tokenStore = {
  get: () => Cookies.get(TOKEN_COOKIE) || null,
  set: (token, remember = true) => Cookies.set(TOKEN_COOKIE, token, { expires: remember ? 7 : undefined, sameSite: 'strict', secure: location.protocol === 'https:' }),
  clear: () => { Cookies.remove(TOKEN_COOKIE); Cookies.remove(USER_COOKIE); },
  getUser: () => { try { return JSON.parse(Cookies.get(USER_COOKIE) || 'null'); } catch { return null; } },
  setUser: (u) => Cookies.set(USER_COOKIE, JSON.stringify(u), { expires: 7, sameSite: 'strict' }),
};

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://api.zucci.xyz/api/v1/',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Use the in-memory mock adapter only when explicitly opted-in.
if (USE_MOCK) http.defaults.adapter = mockAdapter;

// ── Request: attach bearer token + global custom headers ──
http.interceptors.request.use(
  (config) => {
    const token = tokenStore.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Global headers required by the Zucci API
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['X-Locale-Id'] = config.headers['X-Locale-Id'] || '1';
    config.headers['X-Market-Id'] = config.headers['X-Market-Id'] || '1';

    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response: unwrap { data } and handle auth errors ──────
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

http.interceptors.response.use(
  (response) => {
    // For blob responses, return full response (so we can get headers too
    if (response.config.responseType === 'blob') {
      return response;
    }
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      tokenStore.clear();
      if (onUnauthorized) onUnauthorized();
    }
    const message = error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject({ status, message, raw: error });
  },
);

export default http;
