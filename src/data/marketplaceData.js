// marketplaceData.js — Marketplace data (ES module port of zucci-marketplace.jsx).
export const MKT_MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];

export const LISTINGS_DATA = [
  { id:'lst-001', sku:'UL-DRESS-GRN-M',  name:'Emerald Wrap Dress',          vendor:'Urban Looms',       cat:'Women — Clothing', market:'AE', price:299, currency:'AED', status:'pending',  submitted:'Jun 3, 2025', images:3, variants:4, commission:15, issue:null },
  { id:'lst-002', sku:'DK-SNKR-WHT-42',  name:'Cloud Runner Sneakers White', vendor:'Desert Kicks',      cat:'Footwear',         market:'AE', price:449, currency:'AED', status:'pending',  submitted:'Jun 3, 2025', images:6, variants:6, commission:14, issue:null },
  { id:'lst-003', sku:'BH-OUD-50ML',     name:'Arabian Night Oud 50ml',      vendor:'Bakhoor House',     cat:'Fragrance',        market:'SA', price:380, currency:'SAR', status:'pending',  submitted:'Jun 2, 2025', images:4, variants:1, commission:18, issue:'Missing ingredient list (INCI)' },
  { id:'lst-004', sku:'NC-ABAYA-BLK-54', name:'Midnight Abaya',              vendor:'Nabila Collective', cat:'Women — Clothing', market:'AE', price:520, currency:'AED', status:'approved', submitted:'Jun 1, 2025', images:8, variants:5, commission:15, issue:null },
  { id:'lst-005', sku:'ZL-HIJAB-BLU-OS', name:'Silk Hijab — Ocean Blue',     vendor:'Zucci Label',       cat:'Women — Clothing', market:'AE', price:89,  currency:'AED', status:'approved', submitted:'May 31, 2025', images:5, variants:8, commission:12, issue:null },
  { id:'lst-006', sku:'HO-ATTAR-10ML',   name:'Rose Attar 10ml',             vendor:'House of Oud',      cat:'Fragrance',        market:'SA', price:210, currency:'SAR', status:'pending',  submitted:'Jun 3, 2025', images:3, variants:2, commission:18, issue:null },
  { id:'lst-007', sku:'DK-BOOT-BRN-41',  name:'Desert Chelsea Boot Brown',   vendor:'Desert Kicks',      cat:'Footwear',         market:'SA', price:620, currency:'SAR', status:'rejected', submitted:'May 30, 2025', images:2, variants:3, commission:14, issue:'Size chart missing EU/UK/US — required for SA market' },
  { id:'lst-008', sku:'AM-KAFTAN-GLD-L', name:'Golden Thread Kaftan',        vendor:'Amara Threads',     cat:'Women — Clothing', market:'EG', price:890, currency:'EGP', status:'approved', submitted:'May 29, 2025', images:7, variants:3, commission:16, issue:null },
  { id:'lst-009', sku:'CC-TOBE-WHT-52',  name:'Classic White Tobe',          vendor:'Coral Collections', cat:'Men — Clothing',   market:'SA', price:320, currency:'SAR', status:'pending',  submitted:'Jun 3, 2025', images:4, variants:4, commission:13, issue:null },
  { id:'lst-010', sku:'UL-SHRT-NVY-M',   name:'Linen Casual Shirt Navy',     vendor:'Urban Looms',       cat:'Men — Clothing',   market:'AE', price:189, currency:'AED', status:'approved', submitted:'May 28, 2025', images:5, variants:5, commission:13, issue:null },
];
export const COMMISSION_RULES = [
  { id:'cr1', cat:'Women — Clothing', market:'all', rate:15, vendor_override:null, notes:'Standard rate' },
  { id:'cr2', cat:'Men — Clothing',   market:'all', rate:13, vendor_override:null, notes:'Standard rate' },
  { id:'cr3', cat:'Fragrance',        market:'all', rate:18, vendor_override:null, notes:'Premium category' },
  { id:'cr4', cat:'Footwear',         market:'all', rate:14, vendor_override:null, notes:'Standard rate' },
  { id:'cr5', cat:'Women — Clothing', market:'EG',  rate:16, vendor_override:null, notes:'EG surcharge +1%' },
  { id:'cr6', cat:'Women — Clothing', market:'SA',  rate:14, vendor_override:'Urban Looms', notes:'Volume discount' },
  { id:'cr7', cat:'Fragrance',        market:'SA',  rate:18, vendor_override:'Bakhoor House', notes:'Premium SA fragrance' },
];
export const DISPUTES_DATA = [
  { id:'dsp-001', type:'Commission', vendor:'Almaz Couture',     market:'AE', amount:'AED 1,840', status:'open',     filed:'Jun 1, 2025', subject:'Q2 commission rate applied incorrectly', assignee:'Ahmed Khalil' },
  { id:'dsp-002', type:'Order',      vendor:'Urban Looms',       market:'AE', amount:'AED 420',   status:'resolved', filed:'May 28, 2025',subject:'Customer refund not reflected in payout',  assignee:'Sara Medhat' },
  { id:'dsp-003', type:'Listing',    vendor:'Desert Kicks',      market:'SA', amount:'—',         status:'open',     filed:'Jun 2, 2025', subject:'Listing rejected without sufficient reason', assignee:'Nada Ibrahim' },
  { id:'dsp-004', type:'Commission', vendor:'Bakhoor House',     market:'SA', amount:'SAR 2,100', status:'pending',  filed:'Jun 3, 2025', subject:'Missing May payout reconciliation',          assignee:'Ahmed Khalil' },
  { id:'dsp-005', type:'Order',      vendor:'Nabila Collective', market:'AE', amount:'AED 650',   status:'resolved', filed:'May 25, 2025',subject:'Double-charged fulfilment fee',             assignee:'Sara Medhat' },
];
export const SELLER_HUB = [
  { vendor:'Urban Looms',       market:'AE', gmv:284100, orders:1841, returns:92,  return_pct:5.0,  rating:4.7, listings:48, status:'gold' },
  { vendor:'Nabila Collective', market:'AE', gmv:198400, orders:1210, returns:48,  return_pct:4.0,  rating:4.9, listings:32, status:'platinum' },
  { vendor:'Desert Kicks',      market:'SA', gmv:164200, orders:984,  returns:112, return_pct:11.4, rating:4.2, listings:28, status:'silver' },
  { vendor:'Bakhoor House',     market:'SA', gmv:142800, orders:1842, returns:28,  return_pct:1.5,  rating:4.8, listings:64, status:'gold' },
  { vendor:'Amara Threads',     market:'EG', gmv:98400,  orders:2841, returns:184, return_pct:6.5,  rating:4.4, listings:84, status:'silver' },
  { vendor:'House of Oud',      market:'SA', gmv:84200,  orders:621,  returns:12,  return_pct:1.9,  rating:4.6, listings:24, status:'bronze' },
  { vendor:'Coral Collections', market:'SA', gmv:62100,  orders:484,  returns:62,  return_pct:12.8, rating:4.0, listings:18, status:'bronze' },
  { vendor:'5th Avenue Cairo',  market:'EG', gmv:48400,  orders:1241, returns:98,  return_pct:7.9,  rating:4.3, listings:42, status:'silver' },
];
export const TIER_COLORS = { platinum:'oklch(0.90 0.06 280)', gold:'oklch(0.82 0.15 75)', silver:'var(--zg-text-mid)', bronze:'oklch(0.70 0.12 45)' };
export const STATUS_COLORS = { approved:'var(--zg-good)', pending:'var(--zg-accent)', rejected:'var(--zg-danger)', open:'var(--zg-warn)', resolved:'var(--zg-good)', active:'var(--zg-good)' };
