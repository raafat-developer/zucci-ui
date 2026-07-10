import { useLookupStore } from '@/stores/lookup.store'

export function useLookup() {
  const store = useLookupStore()

  return {
    loading: store.loading,
    loaded: store.loaded,
    data: store.data,
    get: store.get,
    getOptions: store.getOptions,
    getLabel: store.getLabel,
    refresh: store.refresh,
    getStatus: store.getStatus,
    getStatusLabel: store.getStatusLabel,
    getEnum: store.getEnum,
    getEnumLabel: store.getEnumLabel,
    loadProductOptions: store.loadProductOptions
  }
}
