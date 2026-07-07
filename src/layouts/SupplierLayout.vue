<script setup>
/**
 * SupplierLayout — shell for the SECOND user type (vendor / brand portal).
 * Same visual language as the admin console but a supplier-scoped rail.
 * The full supplier modules (per SUPPLIER_*_SPEC.md) mount as children here.
 */
import { provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const market = ref('all');
provide('market', market);

const NAV = [
  { id: 'supplier-dashboard', label: 'Dashboard', path: '/supplier/dashboard' },
];
const nav = NAV;
const isActive = (id) => route.name === id;
</script>

<template>
  <div class="sup-app">
    <nav class="sup-rail">
      <div class="sup-logo">Z<span>·</span>Connect</div>
      <div class="sup-rail-nav">
        <button
          v-for="item in nav"
          :key="item.id"
          class="sup-rail-btn"
          :class="{ 'is-active': isActive(item.id) }"
          @click="router.push(item.path)"
        >{{ item.label }}</button>
      </div>
      <button class="sup-switch" @click="router.push('/admin/dashboard')">Switch to Admin →</button>
    </nav>
    <header class="sup-top">
      <div class="sup-top-title">Supplier Connect</div>
      <div class="sup-top-brand">Le Maillot · VND-AE-001</div>
    </header>
    <main class="sup-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.sup-app { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 46px 1fr; height: 100vh; background: var(--zg-bg); }
.sup-rail { grid-column: 1; grid-row: 1 / -1; background: var(--zg-bg-elev); border-right: 1px solid var(--zg-line); display: flex; flex-direction: column; padding: 14px 12px; gap: 4px; }
.sup-logo { font-family: var(--zg-mono); font-weight: 600; letter-spacing: 0.08em; color: var(--zg-accent); font-size: 15px; padding: 4px 8px 16px; }
.sup-logo span { color: var(--zg-text-dim); margin: 0 2px; }
.sup-rail-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.sup-rail-btn { text-align: left; height: 34px; padding: 0 12px; border: none; background: transparent; color: var(--zg-text-dim); font-family: inherit; font-size: 12.5px; cursor: pointer; border-radius: var(--zg-radius-md); }
.sup-rail-btn:hover { color: var(--zg-text); background: var(--zg-panel); }
.sup-rail-btn.is-active { color: var(--zg-accent); background: var(--zg-accent-tint); font-weight: 600; }
.sup-switch { margin-top: auto; height: 32px; border: 1px solid var(--zg-line); background: var(--zg-panel); color: var(--zg-text-mid); font-family: inherit; font-size: 11.5px; cursor: pointer; border-radius: var(--zg-radius-md); }
.sup-switch:hover { color: var(--zg-text); border-color: var(--zg-muted-line); }
.sup-top { grid-column: 2; grid-row: 1; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; background: var(--zg-bg-elev); border-bottom: 1px solid var(--zg-line); }
.sup-top-title { font-size: 13px; font-weight: 600; color: var(--zg-text); }
.sup-top-brand { font-family: var(--zg-mono); font-size: 11px; color: var(--zg-text-dim); }
.sup-main { grid-column: 2; grid-row: 2; overflow: auto; position: relative; }
</style>
