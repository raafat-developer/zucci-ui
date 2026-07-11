import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getCountries,
  getCurrencies,
  getLocales,
  getMarkets,
  getStatuses,
  getEnums,
  getProductOptions,
  getBrands,
  getCategories,
  getSizeGuides,
  getCareInstructions,
  getAttributes,
  getAttributeValues,
} from '@/api/lookup.api'

const STATUS_DOMAINS = [
  'product_lifecycle',
  'product_approval',
  'product_listing',
  'size_guide',
  'variant_request',
  'product_sync',
  'category',
  'bundle',
  'b2b_account',
  'b2b_price_list',
  'order',
  'supplier'
]

const ENUM_TYPES = [
  'integration_provider',
  'fulfillment_mode',
  'return_policy',
  'weight_unit',
  'gender',
  'rejection_reason',
  'attribute_input_type',
  'category_banner_type',
  'file_category',
]

export const useLookupStore = defineStore('lookup', () => {
  const loading = ref(false)
  const loaded = ref(false)
  const data = ref({
    countries: [],
    currencies: [],
    locales: [],
    markets: [],
    statuses: {},
    enums: {},
    productOptions: {},
    brands: [],
    categories: [],
    sizeGuides: [],
    careInstructions: [],
    attributes: [],
    attributeValues: {},
    fulfillmentModes: [],
    returnPolicies: [],
    shippingUnits: []
  })

  let loadPromise = null
  const statusPromises = new Map()

  async function load(options = {}) {
    const { includeStatuses = false, statusDomains = [], markets = false } = options

    if (!loaded.value) {
      if (!loadPromise) {
        loadPromise = _doLoad()
      }

      try {
        await loadPromise
      } finally {
        loadPromise = null
      }
    }

    if (includeStatuses) {
      await loadStatuses(statusDomains.length ? statusDomains : STATUS_DOMAINS)
    }

    if (markets && (!data.value.markets || !data.value.markets.length)) {
      try {
        const res = await getMarkets()
        data.value.markets = getArray(res)
      } catch (e) {
        console.error('Failed to load markets explicitly:', e)
      }
    }
  }

  const getArray = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.items)) return res.items;
    return [];
  };

  async function _doLoad() {
    loading.value = true
    try {
      const promises = [
        getCountries().then(res => data.value.countries = getArray(res)).catch(e => console.error('Failed to load countries:', e)),
        getCurrencies().then(res => data.value.currencies = getArray(res)).catch(e => console.error('Failed to load currencies:', e)),
        getLocales().then(res => data.value.locales = getArray(res)).catch(e => console.error('Failed to load locales:', e)),
        getMarkets().then(res => data.value.markets = getArray(res)).catch(e => console.error('Failed to load markets:', e)),
        getBrands().then(res => data.value.brands = getArray(res)).catch(e => console.error('Failed to load brands:', e)),
        getCategories().then(res => data.value.categories = getArray(res)).catch(e => console.error('Failed to load categories:', e)),
        getSizeGuides().then(res => data.value.sizeGuides = getArray(res)).catch(e => console.error('Failed to load size guides:', e)),
        getCareInstructions().then(res => data.value.careInstructions = getArray(res)).catch(e => console.error('Failed to load care instructions:', e)),
        getAttributes().then(res => data.value.attributes = getArray(res)).catch(e => console.error('Failed to load attributes:', e)),
        loadEnums()
      ]
      await Promise.all(promises)
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    statusPromises.clear()
    loadPromise = null
    data.value = {
      countries: [],
      currencies: [],
      locales: [],
      markets: [],
      statuses: {},
      enums: {},
      productOptions: {}
    }
    loaded.value = false
    await load()
  }

  async function loadStatuses(domains = STATUS_DOMAINS) {
    const list = Array.isArray(domains) ? domains : [domains]
    await Promise.all(list.map(domain => loadStatusDomain(domain)))
  }

  async function loadStatusDomain(domain) {
    if (!domain) return []
    if (data.value.statuses[domain]?.length) return data.value.statuses[domain]
    if (statusPromises.has(domain)) return statusPromises.get(domain)

    const request = getStatuses(domain)
      .then(res => {
        data.value.statuses[domain] = getArray(res)
        return data.value.statuses[domain]
      })
      .catch(e => {
        console.error(`Failed to load statuses for ${domain}:`, e)
        return []
      })
      .finally(() => {
        statusPromises.delete(domain)
      })

    statusPromises.set(domain, request)
    return request
  }

  async function loadEnums() {
    try {
      // Single request returns: { localeId, enums: { type_name: [{ id, label, sortOrder }] } }
      const res = await getEnums(ENUM_TYPES)
      const enumsMap = res?.enums || {}
      ENUM_TYPES.forEach(type => {
        data.value.enums[type] = Array.isArray(enumsMap[type]) ? enumsMap[type] : []
      })
    } catch (e) {
      console.error('Failed to load enums:', e)
    }
  }

  async function loadProductOptions(productId) {
    if (data.value.productOptions[productId]) return data.value.productOptions[productId]
    try {
      const res = await getProductOptions(productId)
      data.value.productOptions[productId] = res.data || []
      return data.value.productOptions[productId]
    } catch (e) {
      console.error(`Failed to load product options for ${productId}:`, e)
      return []
    }
  }

  async function loadAttributeValues(attributeId) {
    if (data.value.attributeValues[attributeId]) return data.value.attributeValues[attributeId]
    try {
      const res = await getAttributeValues(attributeId)
      data.value.attributeValues[attributeId] = res.data || []
      return data.value.attributeValues[attributeId]
    } catch (e) {
      console.error(`Failed to load attribute values for ${attributeId}:`, e)
      return []
    }
  }

  // Helper methods
  function get(name) {
    return data.value[name] || []
  }

  function getStatus(domain) {
    return data.value.statuses[domain] || []
  }

  function getEnum(type) {
    return data.value.enums[type] || []
  }

  function getOptions(name) {
    const items = get(name)
    return items.map(item => ({
      value: item.id || item.value || item.code,
      label: item.label || item.name || item.title
    }))
  }

  function getLabel(name, id) {
    const items = get(name)
    const item = items.find(i => (i.id || i.value || i.code) === id)
    return item?.label || item?.name || item?.title || ''
  }

  function getStatusLabel(domain, id) {
    const items = getStatus(domain)
    const item = items.find(i => i.id === id)
    return item?.label || item?.name || ''
  }

  function getEnumLabel(type, id) {
    const items = getEnum(type)
    const item = items.find(i => (i.id || i.value) === id)
    return item?.label || item?.name || ''
  }

  return {
    loading,
    loaded,
    data,
    load,
    refresh,
    loadStatuses,
    loadStatusDomain,
    loadEnums,
    loadProductOptions,
    loadAttributeValues,
    get,
    getStatus,
    getEnum,
    getOptions,
    getLabel,
    getStatusLabel,
    getEnumLabel
  }
})
