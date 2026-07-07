<script setup>
/**
 * AdminLayout — app shell: collapsible Sidebar + TopBar + module content.
 * Owns the sidebar open/collapsed state (collapsed by default, like React),
 * animates the grid column width on toggle, and routes settings/profile.
 * Provides shared `market` state to descendants.
 */
import { provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/shell/Sidebar.vue';
import TopBar from '@/components/shell/TopBar.vue';

const router = useRouter();
const market = ref('all');
provide('market', market);

const sidebarOpen = ref(false); // collapsed by default
</script>

<template>
  <div class="zg-app" :class="{ 'sidebar-open': sidebarOpen }">
    <Sidebar
      class="zg-rail-area"
      :is-open="sidebarOpen"
      @toggle="sidebarOpen = !sidebarOpen"
      @open-settings="router.push('/admin/settings')"
      @open-profile="router.push('/admin/profile')"
      @open-notifs="() => {}"
    />
    <TopBar class="zg-top-area" />
    <main class="zg-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.zg-app {
  display: grid;
  grid-template-columns: 56px 1fr;
  grid-template-rows: 46px 1fr;
  height: 100vh;
  background: var(--zg-bg);
  transition: grid-template-columns 0.24s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.zg-app.sidebar-open { grid-template-columns: 248px 1fr; }
.zg-rail-area { grid-column: 1; grid-row: 1 / -1; }
.zg-top-area { grid-column: 2; grid-row: 1; }
.zg-main { grid-column: 2; grid-row: 2; overflow: hidden; position: relative; }
</style>
