import { ref } from 'vue'
import { defineStore } from 'pinia'

// Seed data inlined directly into refs — delete the inline literal and call load() when wiring the API.

export const useVariantsStore = defineStore('variants', () => {
  const variantTypes = ref([
  {
    id: 'VT-001', name: 'Size', code: 'size', icon: '📏', status: 'active',
    applies_to: ['clothing', 'footwear', 'kids', 'sportswear'],
    input_type: 'swatch_text',
    options: ['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', 'One Size'],
    requires_size_chart: true, sort: 1
  },
  {
    id: 'VT-002', name: 'Colour', code: 'colour', icon: '🎨', status: 'active',
    applies_to: ['clothing', 'footwear', 'accessories', 'kids', 'beauty'],
    input_type: 'swatch_color',
    options: [
      { label: 'Black', hex: '#1a1a1a' }, { label: 'White', hex: '#f5f5f5' },
      { label: 'Navy', hex: '#1a2a4a' }, { label: 'Grey', hex: '#888888' },
      { label: 'Beige', hex: '#d4b896' }, { label: 'Burgundy', hex: '#6b1528' },
      { label: 'Olive', hex: '#6b6b2d' }
    ],
    requires_size_chart: false, sort: 2
  },
  {
    id: 'VT-003', name: 'Material', code: 'material', icon: '🧵', status: 'active',
    applies_to: ['clothing', 'accessories'],
    input_type: 'select',
    options: ['Cotton', 'Linen', 'Silk', 'Polyester', 'Viscose', 'Chiffon', 'Satin', 'Velvet'],
    requires_size_chart: false, sort: 3
  },
  {
    id: 'VT-004', name: 'Scent', code: 'scent', icon: '🌸', status: 'active',
    applies_to: ['beauty', 'fragrance'],
    input_type: 'select',
    options: ['Oud', 'Rose', 'Musk', 'Amber', 'Jasmine', 'Vanilla'],
    requires_size_chart: false, sort: 4
  }
])

  const productVariants = ref([
  {
    id: 'PV-001', sku: 'ABAYA-001', product: 'Classic Open Abaya', brand: 'Zucci Label',
    variant_types: ['VT-001', 'VT-002', 'VT-003'],
    variants: [
      { id: 'PV-001-001', sku: 'ABAYA-001-BLK-M-CREP', size: 'M', colour: 'Black', material: 'Crepe', price_base: 189, price_override: null, stock: 48, images: 1, status: 'active' },
      { id: 'PV-001-002', sku: 'ABAYA-001-BLK-L-CREP', size: 'L', colour: 'Black', material: 'Crepe', price_base: 189, price_override: null, stock: 32, images: 1, status: 'active' },
      { id: 'PV-001-003', sku: 'ABAYA-001-NVY-M-CREP', size: 'M', colour: 'Navy', material: 'Crepe', price_base: 189, price_override: null, stock: 0, images: 1, status: 'disabled' },
      { id: 'PV-001-004', sku: 'ABAYA-001-BEI-XL-CREP', size: 'XL', colour: 'Beige', material: 'Crepe', price_base: 189, price_override: 189, stock: 21, images: 1, status: 'active' },
    ]
  },
  {
    id: 'PV-002', sku: 'SNEAKR-42', product: 'Urban Runner Sneakers', brand: 'Desert Kicks',
    variant_types: ['VT-001', 'VT-002'],
    variants: [
      { id: 'PV-002-001', sku: 'SNEAKR-42-W40-BLK', size: '40', colour: 'Black', price_base: 349, price_override: null, stock: 56, images: 3, status: 'active' },
      { id: 'PV-002-002', sku: 'SNEAKR-42-W41-BLK', size: '41', colour: 'Black', price_base: 349, price_override: null, stock: 43, images: 3, status: 'active' },
    ]
  }
])

  const variantRequests = ref([
  {
    id: 'VR-001', product_sku: 'ABAYA-001', product: 'Classic Open Abaya',
    vendor_id: 'VND-AE-001', vendor: 'Zucci Label',
    requested_by: 'Rania Al-Qassim', requested_at: '2026-06-07T10:00:00Z',
    variant_type: 'VT-001', variant_type_name: 'Size',
    requested_values: ['XXXL', '4XL', '5XL'],
    reason: 'Strong customer demand for extended sizes in AE market — 40+ requests logged in last 30 days',
    status: 'cat_review',
    steps: [
      { role: 'vendor',   label: 'Submitted',             actor: 'Rania Al-Qassim',    at: '2026-06-07T10:00:00Z', note: 'Request includes 3 new size variants.' },
      { role: 'cat_mgr',  label: 'Category Manager Review',actor: null,                at: null,                   note: null },
      { role: 'ops',      label: 'Ops Confirmation',       actor: null,                at: null,                   note: null },
    ],
    cat_manager_id: 'Sara Ahmed', assigned_at: '2026-06-07T14:00:00Z',
  },
  {
    id: 'VR-002', product_sku: 'SNEAKR-42', product: 'Urban Runner Sneakers',
    vendor_id: 'VND-AE-007', vendor: 'Desert Kicks',
    requested_by: 'Khaled Mansouri', requested_at: '2026-06-05T08:00:00Z',
    variant_type: 'VT-002', variant_type_name: 'Colour',
    requested_values: ['Olive', 'Forest Green', 'Khaki'],
    reason: 'Summer 2026 collection launch — need earth tones for new campaign',
    status: 'ops_review',
    steps: [
      { role: 'vendor',  label: 'Submitted',              actor: 'Khaled Mansouri',    at: '2026-06-05T08:00:00Z', note: 'New colour additions for summer line.' },
      { role: 'cat_mgr', label: 'Category Manager Review', actor: 'Sara Ahmed',         at: '2026-06-05T16:00:00Z', note: 'Approved — earth tones align with footwear category standards.' },
      { role: 'ops',     label: 'Ops Confirmation',        actor: null,                at: null,                   note: null },
    ],
    cat_manager_id: 'Sara Ahmed', assigned_at: '2026-06-05T08:30:00Z',
  }
])

  async function load(){ /* TODO: replace refs above with API data */ }

  return { variantTypes, productVariants, variantRequests, load }
})
