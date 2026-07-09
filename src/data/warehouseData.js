// zucci-warehouse-data.jsx — Warehouses & Storage data layer (plain JS, no Babel)

const ZCW_TYPE_META = {
  owned:       { label:'Owned',          color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.12)', border:'oklch(0.82 0.14 215 / 0.3)' },
  leased:      { label:'Leased',         color:'oklch(0.75 0.12 240)', bg:'oklch(0.75 0.12 240 / 0.10)', border:'oklch(0.75 0.12 240 / 0.25)' },
  '3pl_tech':  { label:'3PL · API',      color:'oklch(0.78 0.14 290)', bg:'oklch(0.78 0.14 290 / 0.12)', border:'oklch(0.78 0.14 290 / 0.3)' },
  '3pl_manual':{ label:'3PL · Manual',   color:'var(--zg-warn)',        bg:'oklch(0.82 0.15 75 / 0.10)',  border:'oklch(0.82 0.15 75 / 0.3)' },
  dark_store:  { label:'Dark Store',     color:'oklch(0.78 0.15 180)', bg:'oklch(0.78 0.15 180 / 0.10)', border:'oklch(0.78 0.15 180 / 0.25)' },
  cross_dock:  { label:'Cross-Dock',     color:'oklch(0.85 0.16 55)',  bg:'oklch(0.85 0.16 55 / 0.10)',  border:'oklch(0.85 0.16 55 / 0.25)' },
  virtual:     { label:'Virtual',        color:'var(--zg-text-dim)',   bg:'var(--zg-panel-hi)',           border:'var(--zg-line)' },
};

const ZCW_STATUS_META = {
  active:      { label:'Active',      color:'var(--zg-good)',   bg:'oklch(0.78 0.15 150 / 0.1)' },
  inactive:    { label:'Inactive',    color:'var(--zg-text-dim)', bg:'var(--zg-panel-hi)' },
  full:        { label:'Full',        color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.1)' },
  maintenance: { label:'Maintenance', color:'var(--zg-warn)',   bg:'oklch(0.82 0.15 75 / 0.1)' },
};

const ZCW_WAREHOUSES = [
  {
    id:'WH-AE-001', name:'Dubai Main Fulfillment Center',
    types:['owned','leased'], status:'active',
    country:'AE', city:'Dubai', district:'Al Quoz', flag:'🇦🇪',
    address:'Warehouse 7, Al Quoz Industrial Area 3, Dubai, UAE',
    markets:['AE','SA','QA'],
    currency:'AED', operator:'Zucci',
    tech_integration:'native', last_sync:null,
    capacity:{ m2:5000, pallets:800, bins:4200, used_m2:3840, used_pallets:612, used_bins:3150 },
    costs:{ storage_per_m2_per_day:0.85, storage_per_pallet_per_day:5.20, receiving_fee:150, handling_fee:1.50, fulfillment_fee:12.00 },
    contact:{ first:'Ahmed', last:'Al-Rashidi', phone:'+971 50 123 4567', email:'ahmed@zucci.ae' },
    stats:{ total_skus:1847, active_vendors:38, pending_inbound:12, pending_outbound:48, pending_returns:7, open_transfers:3, open_alerts:2 },
    notes:'Primary UAE fulfillment hub. Handles bulk of AE + cross-border SA/QA orders.',
    created_at:'2023-03-15',
  },
  {
    id:'WH-AE-002', name:'Sharjah Cross-Dock Hub',
    types:['cross_dock'], status:'active',
    country:'AE', city:'Sharjah', district:'Industrial Area 11', flag:'🇦🇪',
    address:'Cross-Dock Facility, Industrial Area 11, Sharjah, UAE',
    markets:['AE','SA','QA','KW','BH','OM'],
    currency:'AED', operator:'Zucci',
    tech_integration:'native', last_sync:null,
    capacity:{ m2:1200, pallets:200, bins:0, used_m2:890, used_pallets:148, used_bins:0 },
    costs:{ storage_per_m2_per_day:0.60, storage_per_pallet_per_day:3.50, receiving_fee:80, handling_fee:1.00, fulfillment_fee:8.00 },
    contact:{ first:'Khalid', last:'Mansour', phone:'+971 55 987 6543', email:'khalid.m@zucci.ae' },
    stats:{ total_skus:0, active_vendors:0, pending_inbound:34, pending_outbound:34, pending_returns:0, open_transfers:9, open_alerts:0 },
    notes:'Transit-only facility. No long-term stock storage. Used for GCC distribution splits.',
    created_at:'2023-07-01',
  },
  {
    id:'WH-AE-003', name:'Abu Dhabi Retail Hub',
    types:['owned'], status:'active',
    country:'AE', city:'Abu Dhabi', district:'Mussafah', flag:'🇦🇪',
    address:'Unit 22, Mussafah Industrial Zone, Abu Dhabi, UAE',
    markets:['AE'],
    currency:'AED', operator:'Zucci',
    tech_integration:'native', last_sync:null,
    capacity:{ m2:2200, pallets:320, bins:1600, used_m2:1430, used_pallets:198, used_bins:1040 },
    costs:{ storage_per_m2_per_day:0.78, storage_per_pallet_per_day:4.80, receiving_fee:120, handling_fee:1.20, fulfillment_fee:10.00 },
    contact:{ first:'Fatima', last:'Al-Nuaimi', phone:'+971 50 445 6789', email:'fatima.nuaimi@zucci.ae' },
    stats:{ total_skus:742, active_vendors:21, pending_inbound:4, pending_outbound:17, pending_returns:2, open_transfers:1, open_alerts:1 },
    notes:'Serves Abu Dhabi + Northern Emirates.',
    created_at:'2024-01-10',
  },
  {
    id:'WH-SA-001', name:'Riyadh Fulfillment Center',
    types:['owned'], status:'active',
    country:'SA', city:'Riyadh', district:'Second Industrial City', flag:'🇸🇦',
    address:'Building 14A, Second Industrial City, Riyadh 14251, KSA',
    markets:['SA'],
    currency:'SAR', operator:'Zucci',
    tech_integration:'native', last_sync:null,
    capacity:{ m2:4200, pallets:600, bins:3500, used_m2:3024, used_pallets:408, used_bins:2380 },
    costs:{ storage_per_m2_per_day:0.75, storage_per_pallet_per_day:4.50, receiving_fee:130, handling_fee:1.30, fulfillment_fee:11.00 },
    contact:{ first:'Sultan', last:'Al-Qahtani', phone:'+966 50 234 5678', email:'sultan.q@zucci.sa' },
    stats:{ total_skus:1240, active_vendors:29, pending_inbound:9, pending_outbound:31, pending_returns:5, open_transfers:2, open_alerts:1 },
    notes:'Main KSA fulfillment node.',
    created_at:'2023-06-20',
  },
  {
    id:'WH-SA-002', name:'Jeddah 3PL — Al-Qahtani Logistics',
    types:['3pl_manual'], status:'active',
    country:'SA', city:'Jeddah', district:'Port Area', flag:'🇸🇦',
    address:'Al-Qahtani Logistics Park, Port Road, Jeddah 21441, KSA',
    markets:['SA'],
    currency:'SAR', operator:'Al-Qahtani Logistics',
    tech_integration:'manual', last_sync:'2026-06-07T09:00:00Z',
    capacity:{ m2:3100, pallets:450, bins:2200, used_m2:1860, used_pallets:270, used_bins:1320 },
    costs:{ storage_per_m2_per_day:0.65, storage_per_pallet_per_day:4.00, receiving_fee:100, handling_fee:1.10, fulfillment_fee:9.50 },
    contact:{ first:'Waleed', last:'Al-Qahtani', phone:'+966 55 111 2233', email:'ops@alqahtani-log.sa' },
    stats:{ total_skus:618, active_vendors:14, pending_inbound:6, pending_outbound:22, pending_returns:3, open_transfers:0, open_alerts:3 },
    notes:'Manual updates via WhatsApp / CSV. Last CSV received June 7. Discrepancy in SKU SWIM-L-BLK (system: 48, partner: 44).',
    created_at:'2023-09-01',
  },
  {
    id:'WH-EG-001', name:'Cairo Distribution Center — Aramex',
    types:['3pl_tech'], status:'active',
    country:'EG', city:'Cairo', district:'New Cairo', flag:'🇪🇬',
    address:'Aramex Facility, Industrial Zone A, New Cairo, Egypt',
    markets:['EG'],
    currency:'EGP', operator:'Aramex Egypt',
    tech_integration:'api_wms', last_sync:'2026-06-08T07:30:00Z',
    capacity:{ m2:2800, pallets:400, bins:2100, used_m2:1960, used_pallets:272, used_bins:1430 },
    costs:{ storage_per_m2_per_day:12.50, storage_per_pallet_per_day:75.00, receiving_fee:400, handling_fee:8.00, fulfillment_fee:60.00 },
    contact:{ first:'Mariam', last:'El-Sayed', phone:'+20 100 333 4455', email:'mariam.elsayed@aramex.com' },
    stats:{ total_skus:923, active_vendors:22, pending_inbound:7, pending_outbound:28, pending_returns:11, open_transfers:2, open_alerts:1 },
    notes:'API-synced every 2 hours via Aramex WMS connector. Generally reliable.',
    created_at:'2023-11-15',
  },
  {
    id:'WH-EG-002', name:'Alexandria Dark Store',
    types:['dark_store'], status:'active',
    country:'EG', city:'Alexandria', district:'Smouha', flag:'🇪🇬',
    address:'12 Port Said Street, Smouha, Alexandria, Egypt',
    markets:['EG'],
    currency:'EGP', operator:'Zucci',
    tech_integration:'native', last_sync:null,
    capacity:{ m2:320, pallets:40, bins:280, used_m2:214, used_pallets:26, used_bins:188 },
    costs:{ storage_per_m2_per_day:10.00, storage_per_pallet_per_day:60.00, receiving_fee:200, handling_fee:6.00, fulfillment_fee:40.00 },
    contact:{ first:'Karim', last:'Hossam', phone:'+20 100 777 8899', email:'karim.h@zucci.eg' },
    stats:{ total_skus:148, active_vendors:9, pending_inbound:2, pending_outbound:9, pending_returns:1, open_transfers:0, open_alerts:0 },
    notes:'Hyperlocal same-day hub for Alexandria. Fast-moving SKUs only.',
    created_at:'2024-04-01',
  },
  {
    id:'WH-EG-003', name:'Giza Consignment Vault',
    types:['virtual'], status:'active',
    country:'EG', city:'Giza', district:'6th of October City', flag:'🇪🇬',
    address:'Vendor-held; tracked virtually — Urban Looms warehouse, 6 October City, Egypt',
    markets:['EG'],
    currency:'EGP', operator:'Urban Looms (Vendor)',
    tech_integration:'manual', last_sync:'2026-06-06T14:00:00Z',
    capacity:{ m2:0, pallets:0, bins:0, used_m2:0, used_pallets:0, used_bins:0 },
    costs:{ storage_per_m2_per_day:0, storage_per_pallet_per_day:0, receiving_fee:0, handling_fee:4.00, fulfillment_fee:30.00 },
    contact:{ first:'Nour', last:'Ibrahim', phone:'+20 111 222 3344', email:'nour@urbanlooms.com' },
    stats:{ total_skus:214, active_vendors:1, pending_inbound:0, pending_outbound:6, pending_returns:0, open_transfers:0, open_alerts:0 },
    notes:'Vendor holds their own stock. Zucci receives fulfillment confirmations. No physical Zucci presence.',
    created_at:'2024-02-20',
  },
  {
    id:'WH-KW-001', name:'Kuwait City Fulfillment Hub',
    types:['leased'], status:'active',
    country:'KW', city:'Kuwait City', district:'Shuwaikh Industrial', flag:'🇰🇼',
    address:'Block 3, Shuwaikh Industrial Area, Kuwait City, Kuwait',
    markets:['KW','BH'],
    currency:'KWD', operator:'Zucci',
    tech_integration:'native', last_sync:null,
    capacity:{ m2:1800, pallets:280, bins:1400, used_m2:1116, used_pallets:168, used_bins:840 },
    costs:{ storage_per_m2_per_day:0.95, storage_per_pallet_per_day:5.80, receiving_fee:160, handling_fee:1.60, fulfillment_fee:13.00 },
    contact:{ first:'Yousef', last:'Al-Mutairi', phone:'+965 9988 7766', email:'yousef.m@zucci.kw' },
    stats:{ total_skus:528, active_vendors:16, pending_inbound:3, pending_outbound:14, pending_returns:4, open_transfers:2, open_alerts:0 },
    notes:'Leased from Al-Mutairi Properties. Lease expires Dec 2027.',
    created_at:'2024-03-01',
  },
  {
    id:'WH-BH-001', name:'Manama Cross-Border Returns Hub',
    types:['leased'], status:'active',
    country:'BH', city:'Manama', district:'Hidd Industrial Area', flag:'🇧🇭',
    address:'Zone 2, Hidd Industrial Area, Manama, Bahrain',
    markets:['BH','KW','QA'],
    currency:'BHD', operator:'Zucci',
    tech_integration:'native', last_sync:null,
    capacity:{ m2:900, pallets:120, bins:700, used_m2:594, used_pallets:78, used_bins:448 },
    costs:{ storage_per_m2_per_day:0.88, storage_per_pallet_per_day:5.00, receiving_fee:90, handling_fee:1.40, fulfillment_fee:10.50 },
    contact:{ first:'Sara', last:'Al-Khalifa', phone:'+973 3344 5566', email:'sara.k@zucci.bh' },
    stats:{ total_skus:312, active_vendors:11, pending_inbound:1, pending_outbound:8, pending_returns:19, open_transfers:4, open_alerts:2 },
    notes:'Primary cross-border returns processing hub for GCC. Holds aging returned items.',
    created_at:'2024-05-15',
  },
];

// ── Zones / Locations for key warehouses ─────────────────
const ZCW_ZONES = {
  'WH-AE-001': [
    {
      id:'Z-A', name:'Zone A — Fast Moving', color:'oklch(0.78 0.15 150)', aisles:[
        { id:'A01', name:'Aisle A01', bins:[
          { id:'A01-01', type:'standard', max:80, current:72 },
          { id:'A01-02', type:'standard', max:80, current:78 },
          { id:'A01-03', type:'standard', max:80, current:45 },
          { id:'A01-04', type:'standard', max:80, current:80 },
          { id:'A01-05', type:'standard', max:80, current:61 },
        ]},
        { id:'A02', name:'Aisle A02', bins:[
          { id:'A02-01', type:'standard', max:80, current:55 },
          { id:'A02-02', type:'standard', max:80, current:67 },
          { id:'A02-03', type:'oversize', max:20, current:18 },
          { id:'A02-04', type:'standard', max:80, current:80 },
        ]},
      ]
    },
    {
      id:'Z-B', name:'Zone B — Apparel', color:'oklch(0.82 0.14 215)', aisles:[
        { id:'B01', name:'Aisle B01', bins:[
          { id:'B01-01', type:'standard', max:100, current:88 },
          { id:'B01-02', type:'standard', max:100, current:72 },
          { id:'B01-03', type:'standard', max:100, current:91 },
          { id:'B01-04', type:'standard', max:100, current:44 },
        ]},
        { id:'B02', name:'Aisle B02', bins:[
          { id:'B02-01', type:'standard', max:100, current:66 },
          { id:'B02-02', type:'standard', max:100, current:100 },
          { id:'B02-03', type:'standard', max:100, current:77 },
        ]},
      ]
    },
    {
      id:'Z-C', name:'Zone C — Cold Storage', color:'oklch(0.82 0.14 215)', aisles:[
        { id:'C01', name:'Aisle C01', bins:[
          { id:'C01-01', type:'cold', max:40, current:32 },
          { id:'C01-02', type:'cold', max:40, current:38 },
          { id:'C01-03', type:'cold', max:40, current:21 },
        ]},
      ]
    },
    {
      id:'Z-D', name:'Zone D — Returns Staging', color:'oklch(0.70 0.18 25)', aisles:[
        { id:'D01', name:'Aisle D01', bins:[
          { id:'D01-01', type:'standard', max:60, current:14 },
          { id:'D01-02', type:'standard', max:60, current:22 },
          { id:'D01-03', type:'standard', max:60, current:8 },
        ]},
      ]
    },
  ],
  'WH-SA-001': [
    {
      id:'Z-A', name:'Zone A — Premium', color:'oklch(0.85 0.16 55)', aisles:[
        { id:'A01', name:'Aisle A01', bins:[
          { id:'A01-01', type:'standard', max:80, current:74 },
          { id:'A01-02', type:'standard', max:80, current:62 },
          { id:'A01-03', type:'standard', max:80, current:80 },
        ]},
        { id:'A02', name:'Aisle A02', bins:[
          { id:'A02-01', type:'standard', max:80, current:58 },
          { id:'A02-02', type:'oversize', max:25, current:19 },
        ]},
      ]
    },
    {
      id:'Z-B', name:'Zone B — General', color:'oklch(0.78 0.14 290)', aisles:[
        { id:'B01', name:'Aisle B01', bins:[
          { id:'B01-01', type:'standard', max:100, current:82 },
          { id:'B01-02', type:'standard', max:100, current:70 },
          { id:'B01-03', type:'standard', max:100, current:56 },
        ]},
      ]
    },
  ],
  'WH-EG-001': [
    {
      id:'Z-A', name:'Zone A — Apparel & Fashion', color:'oklch(0.78 0.14 290)', aisles:[
        { id:'A01', name:'Aisle A01', bins:[
          { id:'A01-01', type:'standard', max:80, current:68 },
          { id:'A01-02', type:'standard', max:80, current:55 },
          { id:'A01-03', type:'standard', max:80, current:73 },
        ]},
        { id:'A02', name:'Aisle A02', bins:[
          { id:'A02-01', type:'standard', max:80, current:80 },
          { id:'A02-02', type:'standard', max:80, current:42 },
        ]},
      ]
    },
    {
      id:'Z-B', name:'Zone B — Returns', color:'oklch(0.70 0.18 25)', aisles:[
        { id:'B01', name:'Aisle B01', bins:[
          { id:'B01-01', type:'standard', max:60, current:48 },
          { id:'B01-02', type:'standard', max:60, current:31 },
        ]},
      ]
    },
  ],
};

// ── Inventory sample (top 2 warehouses) ──────────────────
const ZCW_INVENTORY = {
  'WH-AE-001': [
    { sku:'SWIM-L-BLK', name:'Swim Leggings — Black L',         vendor:'Urban Looms',   ownership:'consignment', qty:142, bin:'B01-01', lot:'L2024-08', expiry:null,         age:12,  daily_cost:2.25 },
    { sku:'SWIM-M-PC',  name:'Swim Leggings — Pina Colada M',   vendor:'Urban Looms',   ownership:'consignment', qty:88,  bin:'B01-02', lot:'L2024-08', expiry:null,         age:12,  daily_cost:1.40 },
    { sku:'ABAYD-S-BLK',name:'Abaya Dress — Black S',           vendor:'Nour Modest',   ownership:'owned',       qty:204, bin:'A01-01', lot:null,       expiry:null,         age:45,  daily_cost:3.20 },
    { sku:'CREM-50ML',  name:'Rose Face Cream 50ml',             vendor:'DermaBiotica',  ownership:'owned',       qty:317, bin:'C01-01', lot:'CR-2025-Q1',expiry:'2027-03-01', age:31,  daily_cost:4.90 },
    { sku:'SNEAKR-42-W',name:'Court Sneakers — White EU42',      vendor:'Sole District', ownership:'consignment', qty:56,  bin:'A02-03', lot:null,       expiry:null,         age:78,  daily_cost:0.88 },
    { sku:'HIJAB-CREP', name:'Crepe Hijab — Dusty Rose',         vendor:'Nour Modest',   ownership:'consignment', qty:480, bin:'A01-03', lot:null,       expiry:null,         age:8,   daily_cost:7.50 },
    { sku:'PERF-OUD-50',name:'Oud Noir EDP 50ml',                vendor:'Bakhoor House', ownership:'owned',       qty:92,  bin:'A02-01', lot:'OUD-2025',  expiry:'2028-06-01', age:22,  daily_cost:1.45 },
    { sku:'TSHRT-OS-WHT',name:'Oversized Tee — White OS',        vendor:'Urban Looms',   ownership:'consignment', qty:163, bin:'B02-01', lot:null,       expiry:null,         age:55,  daily_cost:2.55 },
  ],
  'WH-SA-001': [
    { sku:'ABAYA-M-BLK', name:'Premium Abaya — Black M',         vendor:'Nour Modest',   ownership:'consignment', qty:184, bin:'A01-01', lot:null,       expiry:null,         age:19,  daily_cost:2.88 },
    { sku:'KAND-L-WH',   name:'Kandura — White L',               vendor:'Al-Fares',      ownership:'owned',       qty:98,  bin:'B01-01', lot:null,       expiry:null,         age:34,  daily_cost:1.54 },
    { sku:'PERF-OUD-100',name:'Oud Noir EDP 100ml',              vendor:'Bakhoor House', ownership:'owned',       qty:67,  bin:'A02-01', lot:'OUD-2025',  expiry:'2028-06-01', age:22,  daily_cost:1.06 },
    { sku:'SNEAKR-44-W', name:'Court Sneakers — White EU44',     vendor:'Sole District', ownership:'consignment', qty:44,  bin:'B01-03', lot:null,       expiry:null,         age:61,  daily_cost:0.69 },
  ],
};

// ── Inbound shipments queue ───────────────────────────────
const ZCW_INBOUND = [
  { id:'INB-001', warehouse_id:'WH-AE-001', vendor:'Urban Looms',   po:'PO-2026-0441', skus:8,  units:640,  expected:'2026-06-10', status:'in_transit', carrier:'Aramex', tracking:'ARX99281741' },
  { id:'INB-002', warehouse_id:'WH-AE-001', vendor:'DermaBiotica',  po:'PO-2026-0448', skus:3,  units:200,  expected:'2026-06-09', status:'arrived',    carrier:'Bosta',  tracking:'BST8812990' },
  { id:'INB-003', warehouse_id:'WH-AE-001', vendor:'Bakhoor House', po:'PO-2026-0451', skus:5,  units:120,  expected:'2026-06-11', status:'expected',   carrier:'DHL',    tracking:null },
  { id:'INB-004', warehouse_id:'WH-SA-001', vendor:'Nour Modest',   po:'PO-2026-0438', skus:12, units:850,  expected:'2026-06-08', status:'receiving',  carrier:'Aramex', tracking:'ARX99112344' },
  { id:'INB-005', warehouse_id:'WH-SA-001', vendor:'Al-Fares',      po:'PO-2026-0455', skus:4,  units:200,  expected:'2026-06-12', status:'expected',   carrier:'FedEx',  tracking:null },
  { id:'INB-006', warehouse_id:'WH-EG-001', vendor:'Urban Looms',   po:'PO-2026-0442', skus:6,  units:400,  expected:'2026-06-09', status:'in_transit', carrier:'Aramex', tracking:'ARX99303011' },
  { id:'INB-007', warehouse_id:'WH-KW-001', vendor:'Sole District', po:'PO-2026-0449', skus:3,  units:180,  expected:'2026-06-11', status:'expected',   carrier:'Aramex', tracking:null },
];

// ── Returns queue ─────────────────────────────────────────
const ZCW_RETURNS = [
  { id:'RET-001', warehouse_id:'WH-AE-001', order:'ORD-8812341', customer:'Noura Al-Rashid',  sku:'SWIM-L-BLK',  condition:'Good',    disposition:'Restock',      days_waiting:2,  cross_border:false, origin:'AE' },
  { id:'RET-002', warehouse_id:'WH-AE-001', order:'ORD-8809912', customer:'Sara Abdulaziz',   sku:'SNEAKR-42-W', condition:'Damaged', disposition:'Quarantine',   days_waiting:5,  cross_border:false, origin:'AE' },
  { id:'RET-003', warehouse_id:'WH-BH-001', order:'ORD-8791034', customer:'Lena Mohammed',    sku:'ABAYD-S-BLK', condition:'Good',    disposition:'Pending',      days_waiting:38, cross_border:true,  origin:'AE' },
  { id:'RET-004', warehouse_id:'WH-BH-001', order:'ORD-8788210', customer:'Dana Al-Sayed',    sku:'PERF-OUD-50', condition:'Good',    disposition:'Pending',      days_waiting:67, cross_border:true,  origin:'AE' },
  { id:'RET-005', warehouse_id:'WH-BH-001', order:'ORD-8771002', customer:'Rania Farouk',     sku:'SWIM-M-PC',   condition:'Good',    disposition:'Clearance',    days_waiting:122,cross_border:true,  origin:'AE' },
  { id:'RET-006', warehouse_id:'WH-BH-001', order:'ORD-8744001', customer:'Mona El-Sherif',   sku:'HIJAB-CREP',  condition:'Good',    disposition:'Pending WO',   days_waiting:181,cross_border:true,  origin:'EG' },
  { id:'RET-007', warehouse_id:'WH-EG-001', order:'ORD-8800011', customer:'Amira Hassan',     sku:'TSHRT-OS-WHT',condition:'Good',    disposition:'Restock',      days_waiting:1,  cross_border:false, origin:'EG' },
];

// ── Transfers ──────────────────────────────────────────────
const ZCW_TRANSFERS = [
  { id:'TRF-001', from_id:'WH-AE-001', from:'Dubai Main FC',          to_id:'WH-SA-001', to:'Riyadh FC',          sku:'SWIM-L-BLK',  qty:50,  reason:'Stock rebalancing', customs:true,  customs_status:'Cleared',  status:'in_transit',  requested:'2026-06-02' },
  { id:'TRF-002', from_id:'WH-AE-001', from:'Dubai Main FC',          to_id:'WH-KW-001', to:'Kuwait City Hub',     sku:'HIJAB-CREP',  qty:100, reason:'Market demand',    customs:true,  customs_status:'Pending',  status:'packing',     requested:'2026-06-06' },
  { id:'TRF-003', from_id:'WH-SA-001', from:'Riyadh FC',              to_id:'WH-AE-001', to:'Dubai Main FC',       sku:'KAND-L-WH',   qty:20,  reason:'Low AE stock',     customs:true,  customs_status:'Filed',    status:'requested',   requested:'2026-06-08' },
  { id:'TRF-004', from_id:'WH-AE-003', from:'Abu Dhabi Retail Hub',   to_id:'WH-AE-001', to:'Dubai Main FC',       sku:'CREM-50ML',   qty:80,  reason:'Consolidation',    customs:false, customs_status:null,       status:'completed',   requested:'2026-06-01' },
];

// ── Alerts ────────────────────────────────────────────────
const ZCW_ALERTS = [
  { id:'ALT-001', warehouse_id:'WH-AE-001', type:'low_stock',    severity:'warn',   msg:'SNEAKR-42-W below reorder point (56 units, threshold: 60)',                created:'2026-06-08T06:00:00Z' },
  { id:'ALT-002', warehouse_id:'WH-AE-001', type:'capacity',     severity:'warn',   msg:'Zone B approaching 90% utilization',                                      created:'2026-06-07T22:00:00Z' },
  { id:'ALT-003', warehouse_id:'WH-SA-002', type:'sync',         severity:'danger', msg:'CSV update overdue — last received June 7. Expected daily.',              created:'2026-06-08T08:00:00Z' },
  { id:'ALT-004', warehouse_id:'WH-SA-002', type:'discrepancy',  severity:'danger', msg:'SKU SWIM-L-BLK: system 48 vs partner 44 (−4 units)',                      created:'2026-06-07T09:00:00Z' },
  { id:'ALT-005', warehouse_id:'WH-SA-002', type:'discrepancy',  severity:'warn',   msg:'SKU HIJAB-CREP: system 112 vs partner 108 (−4 units)',                   created:'2026-06-07T09:00:00Z' },
  { id:'ALT-006', warehouse_id:'WH-AE-003', type:'vendor_alloc', severity:'warn',   msg:'Urban Looms allocation 91% used — 1,040 of 1,140 max bins',               created:'2026-06-07T18:00:00Z' },
  { id:'ALT-007', warehouse_id:'WH-BH-001', type:'aging_180',    severity:'danger', msg:'RET-006: HIJAB-CREP at 181 days — write-off / donation review required', created:'2026-06-08T00:00:00Z' },
  { id:'ALT-008', warehouse_id:'WH-BH-001', type:'aging_120',    severity:'warn',   msg:'RET-005: SWIM-M-PC at 122 days — 50% clearance applied',                 created:'2026-06-08T00:00:00Z' },
  { id:'ALT-009', warehouse_id:'WH-SA-001', type:'low_stock',    severity:'warn',   msg:'KAND-L-WH below reorder point (98 units, threshold: 100)',                created:'2026-06-08T05:00:00Z' },
];

// ── Activity log (most recent first) ─────────────────────
const ZCW_ACTIVITY = {
  'WH-AE-001': [
    { ts:'2026-06-08T07:45:00Z', actor:'System',        type:'inbound',    msg:'INB-002 arrived — DermaBiotica 200 units (PO-2026-0448)' },
    { ts:'2026-06-08T06:00:00Z', actor:'System',        type:'alert',      msg:'Low stock alert triggered for SNEAKR-42-W' },
    { ts:'2026-06-07T15:30:00Z', actor:'Ahmed Al-Rashidi', type:'adjust',  msg:'Cycle count Z-A: +2 HIJAB-CREP (correction)' },
    { ts:'2026-06-07T11:00:00Z', actor:'System',        type:'transfer',   msg:'TRF-001 dispatched to Riyadh FC — 50× SWIM-L-BLK' },
    { ts:'2026-06-06T09:20:00Z', actor:'Fatima Al-Nuaimi', type:'return',  msg:'RET-002 inspected — SNEAKR-42-W damaged, quarantined' },
    { ts:'2026-06-05T14:00:00Z', actor:'System',        type:'inbound',    msg:'INB-001 confirmed — Urban Looms 640 units received' },
  ],
  'WH-SA-001': [
    { ts:'2026-06-08T08:00:00Z', actor:'System',        type:'inbound',    msg:'INB-004 receiving started — Nour Modest 850 units' },
    { ts:'2026-06-08T05:00:00Z', actor:'System',        type:'alert',      msg:'Low stock alert triggered for KAND-L-WH' },
    { ts:'2026-06-07T13:00:00Z', actor:'Sultan Al-Qahtani', type:'transfer', msg:'TRF-003 requested — 20× KAND-L-WH to Dubai Main FC' },
  ],
};

// Add ZCW_INVENTORY_ALL as flat array for InventoryTab
const ZCW_INVENTORY_ALL = Object.entries(ZCW_INVENTORY).flatMap(([wh_id, items]) =>
  items.map(i => ({ ...i, warehouse_id: wh_id }))
);

// ── Finance ops data (referenced by FinanceTab.vue) ─────────
const ZCW_COST_EVENTS = [];
const ZCW_VENDOR_COSTS_MTD = [];
const ZCW_3PL_INVOICES = [];

export {
  ZCW_TYPE_META, ZCW_STATUS_META, ZCW_WAREHOUSES, ZCW_ZONES, ZCW_INVENTORY, ZCW_INVENTORY_ALL,
  ZCW_INBOUND, ZCW_RETURNS, ZCW_TRANSFERS, ZCW_ALERTS, ZCW_ACTIVITY,
  ZCW_COST_EVENTS, ZCW_VENDOR_COSTS_MTD, ZCW_3PL_INVOICES,
};
