import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import http from '@/api/http'
import { exportCsv } from '@/utils/exportCsv'

const DEFAULT_TAB_COUNTS = {
  all: 0,
  active: 0,
  pending_review: 0,
  draft: 0,
  rejected: 0,
  out_of_stock: 0,
  suspended: 0,
  archived: 0
}

const normalizeKey = (value) => String(value || '')
  .trim()
  .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
  .replace(/[\s-]+/g, '_')
  .toLowerCase()

const normalizeMarketValue = (market) => {
  if (market == null) return null
  if (typeof market === 'string' || typeof market === 'number') return String(market)
  return market?.code || market?.marketCode || market?.name || market?.id || market?.marketId || null
}

const normalizeProduct = (product) => ({
  ...product,
  brand: product.brand?.name || product.brandName || product.brand || '',
  vendor: product.vendor?.displayName || product.vendorName || product.vendor || '',
  source: product.source || product.syncSource || 'manual',
  syncSource: typeof product.source === 'string' ? product.source : product.syncSource,
  thumbnail: product.thumbUrl || product.thumbnail || null,
  returnPolicy: product.isNonReturnable ? 'non_returnable' : 'standard',
  nonReturnableReason: product.nonReturnableReason,
  status: normalizeKey(product.status || product.productStatus),
  productStatus: normalizeKey(product.productStatus || product.status),
  approvalStatus: normalizeKey(product.approvalStatus),
  markets: Array.isArray(product.markets)
    ? product.markets.map(normalizeMarketValue).filter(Boolean)
    : Array.isArray(product.marketSettings)
      ? product.marketSettings.map((market) => normalizeMarketValue(market?.marketId ?? market)).filter(Boolean)
      : []
})

const normalizeTabs = (tabs = {}) => {
  const normalized = { ...DEFAULT_TAB_COUNTS }

  Object.entries(tabs).forEach(([key, value]) => {
    normalized[normalizeKey(key)] = Number(value || 0)
  })

  normalized.all = Number(normalized.all || 0)
  return normalized
}

export const useProductsStore = defineStore('products', () => {
  const items = ref([])
  const detail = ref(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)
  const loaded = ref(false)
  const page = ref(1)
  const perPage = ref(5)
  const total = ref(0)
  const lastPage = ref(1)
  const tabs = ref({ ...DEFAULT_TAB_COUNTS })

  const brands = computed(() => [...new Set(items.value.map((product) => product.brand).filter(Boolean))])
  const vendors = computed(() => [...new Set(items.value.map((product) => product.vendor).filter(Boolean))])
  const categories = computed(() => [...new Set(items.value.map((product) => product.category).filter(Boolean))])

  async function load(params = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await http.get('/catalog/products', {
        params: {
          page: params.page || page.value,
          perPage: params.perPage || perPage.value,
          ...params
        }
      })

      items.value = (response.data || []).map(normalizeProduct)
      page.value = response.meta?.current_page || page.value
      perPage.value = response.meta?.per_page || perPage.value
      total.value = response.meta?.total || 0
      lastPage.value = response.meta?.last_page || 1
      tabs.value = normalizeTabs(response.tabs)
      loaded.value = true

      return items.value
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchAll(params = {}) {
    return load(params)
  }

  async function fetchDetail(id) {
    loading.value = true
    error.value = null

    try {
      const response = await http.get(`/catalog/products/${id}`)
      detail.value = normalizeProduct(response.data || response)
      return detail.value
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }
  async function createProduct(payload) {
    saving.value = true
    error.value = null
    try {
      const response = await http.post(`/catalog/products/${id}`, payload)
      window.toast?.success('Product Added Successfully!');
      window.location.replace(`/admin/products`)
      return response
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      saving.value = false
    }  
  }

  async function updateProduct(id, payload) {
    saving.value = true
    error.value = null

    try {
      const response = await http.patch(`/catalog/products/${id}`, payload)
      const updated = normalizeProduct(response.data || response)
      const index = items.value.findIndex((item) => String(item.id) === String(id))
      if (index >= 0) items.value[index] = { ...items.value[index], ...updated }
      if (detail.value && String(detail.value.id) === String(id)) detail.value = { ...detail.value, ...updated }
      return updated
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      saving.value = false
    }
  }

  async function approve(id) {
    return updateProduct(id, { approvalStatus: 'approved', status: 'active' })
  }

  async function reject(id, reason) {
    return updateProduct(id, { approvalStatus: 'rejected', status: 'draft', rejectionReason: reason })
  }

  async function submitForReview(id) {
    return updateProduct(id, { approvalStatus: 'pending_review' })
  }

  async function setStatus(id, status) {
    return updateProduct(id, { status })
  }

  async function bulkAction(action, ids) {
    saving.value = true
    error.value = null

    try {
      const normalizedAction = normalizeKey(action)
      const normalizedIds = (Array.isArray(ids) ? ids : [ids])
        .map((id) => String(id || '').trim())
        .filter(Boolean)

      if (!normalizedAction || normalizedIds.length === 0) {
        throw new Error('Please select a valid bulk action and at least one product')
      }

      const response = await http.post('/catalog/products/bulk', {
        action: normalizedAction,
        ids: normalizedIds
      })

      let refreshError = null
      try {
        await load({ page: page.value, perPage: perPage.value })
      } catch (e) {
        refreshError = e
      }

      error.value = null
      return { response, refreshError }
    } catch (e) {
      error.value = e.message || 'Request failed'
      throw e
    } finally {
      saving.value = false
    }
  }

  async function exportProducts() {
    loading.value = true
    error.value = null

    try {
      await exportCsv('/catalog/products/export', {
        defaultFilename: `products_export_${new Date().toISOString().split('T')[0]}.csv`,
        useSemicolonSeparator: true
      })
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function importProducts(file) {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await http.post('/catalog/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await load({ page: page.value, perPage: perPage.value })
      return response
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    detail,
    loading,
    saving,
    error,
    loaded,
    page,
    perPage,
    total,
    lastPage,
    tabs,
    brands,
    vendors,
    categories,
    load,
    fetchAll,
    fetchDetail,
    approve,
    reject,
    createProduct,
    submitForReview,
    setStatus,
    bulkAction,
    exportProducts,
    importProducts
  }
})
