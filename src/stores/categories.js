import { ref } from 'vue'
import { defineStore } from 'pinia'

// Seed data inlined directly into refs — delete the inline literal and call load() when wiring the API.

export const useCategoriesStore = defineStore('categories', () => {
  const internalCategories = ref([
  {
    id: 'CAT-001', slug: 'womens-fashion', label: "Women's Fashion",
    description: "All women's clothing, modest wear, and accessories",
    status: 'active', private: false, featured: true, sort: 1,
    seo_title: "Women's Fashion | Zucci", seo_desc: "Shop the latest women's fashion at Zucci.", seo_slug: 'womens-fashion',
    product_count: 1842, banner: null, created_by: 'Zucci Admin', created_at: '2024-01-15',
    markets: {
      AE: { enabled: true,  min_listings: 80, listing_count: 842, vendor_count: 28 },
      SA: { enabled: true,  min_listings: 60, listing_count: 614, vendor_count: 22 },
      EG: { enabled: true,  min_listings: 40, listing_count: 218, vendor_count: 14 },
      KW: { enabled: true,  min_listings: 30, listing_count: 98,  vendor_count: 9  },
      BH: { enabled: true,  min_listings: 20, listing_count: 42,  vendor_count: 6  },
      QA: { enabled: true,  min_listings: 20, listing_count: 61,  vendor_count: 7  },
      OM: { enabled: false, min_listings: 20, listing_count: 0,   vendor_count: 0  },
    },
    children: [
      { id: 'CAT-001-01', slug: 'abayas',           label: 'Abayas',            status: 'active', private: false, sort: 1, product_count: 412, markets: { AE: {enabled:true,min_listings:30,listing_count:184,vendor_count:12}, SA: {enabled:true,min_listings:25,listing_count:142,vendor_count:10}, EG: {enabled:true,min_listings:15,listing_count:62,vendor_count:7}, KW: {enabled:true,min_listings:10,listing_count:24,vendor_count:4}, BH: {enabled:true,min_listings:8,listing_count:9,vendor_count:3}, QA: {enabled:true,min_listings:8,listing_count:11,vendor_count:3}, OM: {enabled:false,min_listings:8,listing_count:0,vendor_count:0} } },
      { id: 'CAT-001-02', slug: 'modest-tops',       label: 'Modest Tops',       status: 'active', private: false, sort: 2, product_count: 318, markets: { AE: {enabled:true,min_listings:25,listing_count:148,vendor_count:10}, SA: {enabled:true,min_listings:20,listing_count:101,vendor_count:8}, EG: {enabled:true,min_listings:12,listing_count:44,vendor_count:5}, KW: {enabled:true,min_listings:8,listing_count:18,vendor_count:3}, BH: {enabled:false,min_listings:8,listing_count:0,vendor_count:0}, QA: {enabled:true,min_listings:8,listing_count:7,vendor_count:2}, OM: {enabled:false,min_listings:8,listing_count:0,vendor_count:0} } },
      { id: 'CAT-001-03', slug: 'modest-dresses',    label: 'Modest Dresses',    status: 'active', private: false, sort: 3, product_count: 285, markets: { AE: {enabled:true,min_listings:20,listing_count:128,vendor_count:9}, SA: {enabled:true,min_listings:15,listing_count:94,vendor_count:7}, EG: {enabled:true,min_listings:10,listing_count:38,vendor_count:5}, KW: {enabled:true,min_listings:8,listing_count:16,vendor_count:3}, BH: {enabled:true,min_listings:6,listing_count:4,vendor_count:2}, QA: {enabled:true,min_listings:6,listing_count:8,vendor_count:2}, OM: {enabled:false,min_listings:6,listing_count:0,vendor_count:0} } },
      { id: 'CAT-001-04', slug: 'hijabs-scarves',    label: 'Hijabs & Scarves',  status: 'active', private: false, sort: 4, product_count: 224, markets: { AE: {enabled:true,min_listings:20,listing_count:98,vendor_count:8}, SA: {enabled:true,min_listings:15,listing_count:78,vendor_count:7}, EG: {enabled:true,min_listings:10,listing_count:32,vendor_count:4}, KW: {enabled:true,min_listings:8,listing_count:14,vendor_count:3}, BH: {enabled:true,min_listings:6,listing_count:6,vendor_count:2}, QA: {enabled:true,min_listings:6,listing_count:7,vendor_count:2}, OM: {enabled:false,min_listings:6,listing_count:0,vendor_count:0} } },
    ]
  },
  {
    id: 'CAT-002', slug: 'mens-fashion', label: "Men's Fashion",
    description: "Men's clothing, kanduras, thobes, and accessories",
    status: 'active', private: false, featured: true, sort: 2,
    seo_title: "Men's Fashion | Zucci", seo_desc: "Shop men's fashion at Zucci.", seo_slug: 'mens-fashion',
    product_count: 986, banner: null, created_by: 'Zucci Admin', created_at: '2024-01-15',
    markets: {
      AE: { enabled: true,  min_listings: 50, listing_count: 412, vendor_count: 18 },
      SA: { enabled: true,  min_listings: 40, listing_count: 298, vendor_count: 15 },
      EG: { enabled: true,  min_listings: 25, listing_count: 142, vendor_count: 10 },
      KW: { enabled: true,  min_listings: 20, listing_count: 74,  vendor_count: 7  },
      BH: { enabled: true,  min_listings: 15, listing_count: 38,  vendor_count: 5  },
      QA: { enabled: true,  min_listings: 15, listing_count: 44,  vendor_count: 5  },
      OM: { enabled: true,  min_listings: 15, listing_count: 21,  vendor_count: 4  },
    },
    children: [
      { id: 'CAT-002-01', slug: 'kanduras-thobes', label: 'Kanduras & Thobes', status: 'active', private: false, sort: 1, product_count: 312, markets: { AE: {enabled:true,min_listings:20,listing_count:168,vendor_count:12}, SA: {enabled:true,min_listings:18,listing_count:142,vendor_count:10}, EG: {enabled:true,min_listings:10,listing_count:62,vendor_count:7}, KW: {enabled:true,min_listings:8,listing_count:34,vendor_count:5}, BH: {enabled:true,min_listings:6,listing_count:18,vendor_count:3}, QA: {enabled:true,min_listings:6,listing_count:22,vendor_count:3}, OM: {enabled:true,min_listings:6,listing_count:11,vendor_count:2} } },
      { id: 'CAT-002-02', slug: 'mens-casual',     label: 'Casual Wear',       status: 'active', private: false, sort: 2, product_count: 198, markets: { AE: {enabled:true,min_listings:15,listing_count:104,vendor_count:9}, SA: {enabled:true,min_listings:12,listing_count:78,vendor_count:7}, EG: {enabled:true,min_listings:8,listing_count:44,vendor_count:5}, KW: {enabled:true,min_listings:6,listing_count:22,vendor_count:3}, BH: {enabled:true,min_listings:5,listing_count:9,vendor_count:2}, QA: {enabled:true,min_listings:5,listing_count:11,vendor_count:2}, OM: {enabled:true,min_listings:5,listing_count:6,vendor_count:1} } },
    ]
  },
  {
    id: 'CAT-003', slug: 'beauty-fragrance', label: 'Beauty & Fragrance',
    description: "Perfumes, ouds, skincare, and makeup",
    status: 'active', private: false, featured: true, sort: 3,
    seo_title: "Beauty & Fragrance | Zucci", seo_desc: "Shop beauty and fragrance.", seo_slug: 'beauty-fragrance',
    product_count: 743, banner: null, created_by: 'Zucci Admin', created_at: '2024-01-20',
    markets: {
      AE: { enabled: true,  min_listings: 40, listing_count: 312, vendor_count: 24 },
      SA: { enabled: true,  min_listings: 35, listing_count: 228, vendor_count: 18 },
      EG: { enabled: true,  min_listings: 20, listing_count: 112, vendor_count: 12 },
      KW: { enabled: true,  min_listings: 15, listing_count: 62,  vendor_count: 8  },
      BH: { enabled: true,  min_listings: 10, listing_count: 28,  vendor_count: 5  },
      QA: { enabled: true,  min_listings: 10, listing_count: 38,  vendor_count: 6  },
      OM: { enabled: true,  min_listings: 10, listing_count: 21,  vendor_count: 4  },
    },
    children: [
      { id: 'CAT-003-01', slug: 'oud-bakhoor', label: 'Oud & Bakhoor', status: 'active', private: false, sort: 1, product_count: 186, markets: { AE: {enabled:true,min_listings:15,listing_count:84,vendor_count:12}, SA: {enabled:true,min_listings:12,listing_count:68,vendor_count:10}, EG: {enabled:true,min_listings:8,listing_count:34,vendor_count:6}, KW: {enabled:true,min_listings:6,listing_count:22,vendor_count:4}, BH: {enabled:true,min_listings:4,listing_count:12,vendor_count:3}, QA: {enabled:true,min_listings:4,listing_count:14,vendor_count:3}, OM: {enabled:true,min_listings:4,listing_count:8,vendor_count:2} } },
    ]
  }
])

  const marketplaceCategories = ref([
  {
    id: 'MC-001', slug: 'women-clothing', label: 'Women — Clothing',
    mapped_to: 'CAT-001', mapped_label: "Women's Fashion",
    status: 'active', vendor_count: 48, listing_count: 3241,
    commission_pct: 15, requires_approval: true,
    listing_requirements: ['Brand certification', 'Authentic product photos', 'Size chart upload required'],
    markets: {
      AE: { enabled: true,  commission_pct: 15, min_listings: 80, listing_count: 1484, vendor_count: 28 },
      SA: { enabled: true,  commission_pct: 14, min_listings: 60, listing_count: 984,  vendor_count: 22 },
      EG: { enabled: true,  commission_pct: 16, min_listings: 40, listing_count: 412,  vendor_count: 14 },
      KW: { enabled: true,  commission_pct: 15, min_listings: 30, listing_count: 184,  vendor_count: 9  },
      BH: { enabled: true,  commission_pct: 15, min_listings: 20, listing_count: 82,   vendor_count: 6  },
      QA: { enabled: true,  commission_pct: 15, min_listings: 20, listing_count: 95,   vendor_count: 7  },
      OM: { enabled: false, commission_pct: 15, min_listings: 20, listing_count: 0,    vendor_count: 0  },
    },
    children: [
      { id: 'MC-001-01', slug: 'modest-clothing', label: 'Modest Wear',    mapped_to: 'CAT-001-01', commission_pct: 15, status: 'active', listing_count: 1102 },
      { id: 'MC-001-02', slug: 'formal-wear',     label: 'Formal & Evening',mapped_to: 'CAT-001-03', commission_pct: 14, status: 'active', listing_count: 544  },
    ]
  },
  {
    id: 'MC-002', slug: 'men-clothing', label: "Men — Clothing",
    mapped_to: 'CAT-002', mapped_label: "Men's Fashion",
    status: 'active', vendor_count: 32, listing_count: 1654,
    commission_pct: 13, requires_approval: false,
    listing_requirements: ['Authentic product photos', 'Size chart upload required'],
    markets: {
      AE: { enabled: true,  commission_pct: 13, min_listings: 50, listing_count: 684, vendor_count: 18 },
      SA: { enabled: true,  commission_pct: 12, min_listings: 40, listing_count: 484, vendor_count: 15 },
      EG: { enabled: true,  commission_pct: 14, min_listings: 25, listing_count: 284, vendor_count: 10 },
      KW: { enabled: true,  commission_pct: 13, min_listings: 20, listing_count: 124, vendor_count: 7  },
      BH: { enabled: true,  commission_pct: 13, min_listings: 15, listing_count: 48,  vendor_count: 5  },
      QA: { enabled: true,  commission_pct: 13, min_listings: 15, listing_count: 62,  vendor_count: 5  },
      OM: { enabled: true,  commission_pct: 13, min_listings: 15, listing_count: 28,  vendor_count: 4  },
    },
    children: [
      { id: 'MC-002-01', slug: 'traditional-wear', label: 'Traditional & Cultural', mapped_to: 'CAT-002-01', commission_pct: 12, status: 'active', listing_count: 612 },
    ]
  }
])

  async function load(){ /* TODO: replace refs above with API data */ }

  return { internalCategories, marketplaceCategories, load }
})
