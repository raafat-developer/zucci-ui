import { createRouter, createWebHistory } from 'vue-router';

/**
 * Two user types share one app:
 *   /auth/:step            → bare auth flow (shared)
 *   /admin/*               → AdminLayout  (internal ops console)
 *   /supplier/*            → SupplierLayout (vendor / brand portal — scaffold)
 *
 * The generic list modules render through ModuleScreen, which reads its
 * config from src/data/adminModules.js by route name. Dashboard, Analytics
 * and Profile are dedicated views.
 */

const adminModule = () => import('@/views/admin/ModuleScreen.vue');

const routes = [
  // ── Auth (shared, bare) ────────────────────────────────
  {
    path: '/auth',
    component: () => import('@/views/auth/AuthView.vue'),
    children: [
      { path: '', redirect: '/auth/signin-id' },
      { path: ':step', name: 'auth', component: () => import('@/views/auth/AuthFlow.vue') },
    ],
  },

  // ── Admin console (protected: authenticated + admin role) ──
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'analytics', name: 'analytics', component: () => import('@/views/admin/AnalyticsView.vue'), meta: { title: 'Analytics & Data' } },
      { path: 'profile', name: 'profile', component: () => import('@/views/admin/ProfileView.vue'), meta: { title: 'My Account' } },
      // generic list modules (config-driven)
      { path: 'orders', name: 'orders', component: () => import('@/views/admin/orders/OrdersView.vue'), meta: { title: 'Orders' } },
      // Products — full faithful module (list + new + detail)
      { path: 'products', name: 'products', component: () => import('@/views/admin/products/index.vue'), meta: { title: 'Products' } },
      { path: 'products/new', name: 'product-new', component: () => import('@/views/admin/products/Create.vue'), meta: { title: 'New Product' } },
      { path: 'products/size-charts', name: 'admin-products-size-charts', component: () => import('@/views/admin/products/SizeChartsView.vue'), meta: { title: 'Size Charts' } },
      { path: 'products/fit-finder', name: 'admin-products-fit-finder', component: () => import('@/views/admin/products/FitFinderView.vue'), meta: { title: 'Size Picker / Fit Finder' } },
      { path: 'products/variants', name: 'admin-products-variants', component: () => import('@/views/admin/products/VariantManagerView.vue'), meta: { title: 'Variant Manager' } },
      { path: 'products/variant-requests', name: 'admin-products-variant-requests', component: () => import('@/views/admin/products/VariantRequestsView.vue'), meta: { title: 'Variant Requests' } },
      { path: 'products/bundle-kits', name: 'admin-products-bundle-kits', component: () => import('@/views/admin/products/BundlesView.vue'), meta: { title: 'Bundle Kits' } },
      { path: 'products/sync-view', name: 'admin-products-sync-view', component: () => import('@/views/admin/products/SyncView.vue'), meta: { title: 'Sync View' } },
      { path: 'products/:id', name: 'product-detail', component: () => import('@/views/admin/products/ProductDetailView.vue'), meta: { title: 'Product' } },
      { path: 'categories', name: 'categories', component: () => import('@/views/admin/categories/CategoriesView.vue'), meta: { title: 'Categories' } },
      { path: 'warehouses', name: 'warehouses', component: () => import('@/views/admin/warehouses/WarehousesView.vue'), meta: { title: 'Warehouses & Storage' } },
      { path: 'marketplace', name: 'marketplace', component: () => import('@/views/admin/marketplace/MarketplaceView.vue'), meta: { title: 'Marketplace' } },
      { path: 'customers', name: 'customers', component: () => import('@/views/admin/customers/CustomersView.vue'), meta: { title: 'Customers' } },
      { path: 'finance', name: 'finance', component: () => import('@/views/admin/finance/FinanceView.vue'), meta: { title: 'Finance' } },
      { path: 'discounts', name: 'discounts', component: () => import('@/views/admin/discounts/DiscountsView.vue'), meta: { title: 'Promotions' } },
      { path: 'discounts/bundles', name: 'discounts-bundles', component: () => import('@/views/admin/discounts/BundlesView.vue'), meta: { title: 'Bundles & Kits' } },
      { path: 'comms', name: 'comms', component: () => import('@/views/admin/comms/CommsView.vue'), meta: { title: 'Notifications & Comms' } },
      { path: 'tickets', name: 'tickets', component: () => import('@/views/admin/tickets/TicketsView.vue'), meta: { title: 'Tickets' } },
      { path: 'files', name: 'files', component: () => import('@/views/admin/files/FilesView.vue'), meta: { title: 'Files' } },
      { path: 'channels', name: 'channels', component: () => import('@/views/admin/channels/ChannelsView.vue'), meta: { title: 'Channels' } },
      { path: 'shortlinks', name: 'shortlinks', component: () => import('@/views/admin/shortlinks/ShortLinksView.vue'), meta: { title: 'Short Links' } },
      { path: 'owners', name: 'owners', component: () => import('@/views/admin/owners/OwnersView.vue'), meta: { title: 'Owners & Brands' } },
      { path: 'settings', name: 'settings', component: () => import('@/views/admin/SettingsView.vue'), meta: { title: 'Global Settings' } },
    ],
  },

  // ── Supplier portal (protected: authenticated + supplier role) ──
  {
    path: '/supplier',
    component: () => import('@/layouts/SupplierLayout.vue'),
    meta: { requiresAuth: true, role: 'supplier' },
    children: [
      { path: '', redirect: '/supplier/dashboard' },
      { path: 'dashboard', name: 'supplier-dashboard', component: () => import('@/views/supplier/SupplierDashboard.vue'), meta: { title: 'Supplier Dashboard' } },
    ],
  },

  { path: '/', redirect: '/admin/dashboard' },
  { path: '/:pathMatch(.*)*', redirect: '/admin/dashboard' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Navigation guard — protects routes flagged requiresAuth. Unauthenticated
 * users are sent to the auth flow (with a redirect back). Authenticated users
 * whose role does not match the area's required role are routed to their own
 * home. Wire the 401 interceptor to bounce to auth on token expiry.
 */
import { useAuthStore } from '@/stores/auth';
import { setUnauthorizedHandler } from '@/api/http';

const homeFor = (role) => (role === 'supplier' ? '/supplier/dashboard' : '/admin/dashboard');

router.beforeEach((to) => {
  const auth = useAuthStore();
  const needsAuth = to.matched.some((r) => r.meta?.requiresAuth);
  const requiredRole = to.matched.find((r) => r.meta?.role)?.meta.role;

  if (needsAuth && !auth.isAuthenticated) {
    return { path: '/auth/signin-id', query: { redirect: to.fullPath } };
  }
  if (needsAuth && requiredRole && auth.role !== requiredRole) {
    return homeFor(auth.role);
  }
  // Already signed in but visiting the auth flow → send home.
  if (to.path.startsWith('/auth') && auth.isAuthenticated) {
    return homeFor(auth.role);
  }
  return true;
});

// On 401 from the API, drop the session and return to the auth screen.
setUnauthorizedHandler(() => router.replace('/auth/signin-id'));

export default router;
