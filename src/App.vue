<script setup>
// Root shell. Router decides whether to show the Auth view (bare)
// or the AdminLayout (rail + topbar + module content).
import { useAuthStore } from '@/stores/auth';
import { useLookupStore } from '@/stores/lookup.store';
import { watch, onMounted } from 'vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';

const authStore = useAuthStore();
const lookupStore = useLookupStore();

onMounted(() => {
  // Watch for when user is authenticated and has permissions
  watch(
    () => authStore.isAuthenticated && authStore.user?.permissions,
    (hasAuth) => {
      if (hasAuth) {
        lookupStore.load({ includeStatuses: false }).catch((e) => console.error('Failed to load lookups:', e));
      }
    },
    { immediate: true }
  );
});
</script>

<template>
  <router-view />
  <ConfirmDialog />
</template>
