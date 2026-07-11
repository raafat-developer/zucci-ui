import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '@/api/http'
import { exportCsv } from '@/utils/exportCsv'

const MARKET_MAP = {
  1: 'AE',
  2: 'SA',
  3: 'EG',
  4: 'KW',
  5: 'BH',
  6: 'QA',
  7: 'OM'
}

function transformCategoryForUI(category) {
  const markets = {}
  category.marketSettings.forEach(ms => {
    const marketCode = MARKET_MAP[ms.marketId]
    if (marketCode) {
      markets[marketCode] = {
        enabled: ms.isActive,
        min_listings: ms.minListings,
        listing_count: ms.listingCount ?? ms.listing_count ?? ms.productCount ?? ms.product_count ?? category.productCount ?? category.product_count ?? 0,
        vendor_count: ms.vendorCount ?? ms.vendor_count ?? 0
      }
    }
  })
  
  return {
    id: category.id,
    slug: category.slug,
    label: category.label,
    description: category.description,
    status: category.status,
    statusId: category.statusId,
    private: category.private,
    featured: category.featured,
    product_count: category.productCount,
    children: [],
    childrenCount: category.childrenCount,
    hasChildren: category.hasChildren,
    markets,
    parentId: category.parentId,
    isSubCategory: category.isSubCategory,
    sortOrder: category.sortOrder
  }
}

export const useCategoriesStore = defineStore('categories', () => {
  const internalCategories = ref([])
  const marketplaceCategories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const perPage = ref(5)
  const total = ref(0)
  const lastPage = ref(1)
  const kpis = ref({
    total: 0,
    topLevel: 0,
    subCategories: 0,
    active: 0,
    private: 0,
    totalProducts: 0,
    belowMin: 0,
    summary: '',
    taxonomyTrees: 0,
    activeStorefront: 0,
    privateB2bTiers: 0,
    totalCatalogItems: 0,
    thresholdWarnings: 0
  })

  async function load(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data: categoriesData, meta, kpis: kpisData } = await http.get('/catalog/categories', { 
        params: {
          page: params.page || page.value,
          perPage: params.perPage || perPage.value,
          ...params
        }
      })
      
      // Process categories into hierarchical structure
      const categoryMap = new Map()
      const rootCategories = []
      
      // First pass: create map of all categories
      categoriesData.forEach(cat => {
        const transformed = transformCategoryForUI(cat)
        categoryMap.set(cat.id, transformed)
      })
      
      // Second pass: build hierarchy
      categoriesData.forEach(cat => {
        const transformed = categoryMap.get(cat.id)
        if (cat.parentId && categoryMap.has(cat.parentId)) {
          categoryMap.get(cat.parentId).children.push(transformed)
        } else {
          rootCategories.push(transformed)
        }
      })
      
      internalCategories.value = rootCategories
      marketplaceCategories.value = []
      
      total.value = meta?.total || 0
      page.value = meta?.current_page || page.value
      perPage.value = meta?.per_page || perPage.value
      lastPage.value = meta?.last_page || 1
      
      if (kpisData) {
        kpis.value = kpisData
      }
      
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createCategory(data) {
    loading.value = true
    error.value = null
    try {
      await http.post('/catalog/categories', data)
      await load() // Reload categories after creating
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id, data) {
    loading.value = true
    error.value = null
    try {
      await http.patch(`/catalog/categories/${id}`, data)
      await load() // Reload categories after updating
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id) {
    loading.value = true
    error.value = null
    try {
      await http.delete(`/catalog/categories/${id}`)
      await load() // Reload categories after deleting
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function exportCategories() {
    loading.value = true
    error.value = null
    try {
      await exportCsv('/catalog/categories/export', {
        defaultFilename: `categories_export_${new Date().toISOString().split('T')[0]}.csv`,
        useSemicolonSeparator: true
      })
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function importCategories(file) {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await http.post('/catalog/categories/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await load() // Reload categories after import
      return response
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { 
    internalCategories, 
    marketplaceCategories, 
    load, 
    createCategory,
    updateCategory,
    deleteCategory,
    exportCategories,
    importCategories,
    loading, 
    error, 
    page, 
    perPage, 
    total,
    lastPage,
    kpis
  }
})
