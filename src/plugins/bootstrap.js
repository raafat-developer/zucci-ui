import { useAuthStore } from '@/stores/auth'
import { useLookupStore } from '@/stores/lookup.store'
import { watch } from 'vue'

export function createBootstrapPlugin() {
  return {
    install(app) {
      const authStore = useAuthStore()
      const lookupStore = useLookupStore()

      // Watch for when user is authenticated and has permissions
      watch(() => authStore.isAuthenticated && authStore.user?.permissions, (hasAuth) => {
        if (hasAuth) {
          lookupStore.load().catch(e => console.error('Failed to load lookups:', e))
        }
      }, { immediate: true })
    }
  }
}
