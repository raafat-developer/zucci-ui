// zucci-size-variants-data.jsx — Size guides + variant data

// ── Size type definitions ─────────────────────────────────
const ZC_SIZE_TYPES = {
  clothing_intl: {
    id:'clothing_intl', label:'Clothing (International)', applies_to:['womens-fashion','mens-fashion','kids','sports-outdoor'],
    columns:['XXXS','XXS','XS','S','M','L','XL','2XL','3XL','4XL','5XL'],
    measurements:['chest_cm','waist_cm','hip_cm','shoulder_cm'],
  },
  clothing_numeric: {
    id:'clothing_numeric', label:'Clothing (Numeric)', applies_to:['mens-fashion'],
    columns:['36','38','40','42','44','46','48','50','52','54','56'],
    measurements:['chest_cm','waist_cm'],
  },
  footwear_eu: {
    id:'footwear_eu', label:'Footwear — EU', applies_to:['footwear'],
    columns:['36','37','38','39','40','41','42','43','44','45','46','47','48'],
    measurements:['foot_length_cm'],
  },
  footwear_uk: {
    id:'footwear_uk', label:'Footwear — UK', applies_to:['footwear'],
    columns:['3','4','5','6','7','8','9','10','11','12','13'],
    measurements:['foot_length_cm'],
  },
  footwear_us: {
    id:'footwear_us', label:'Footwear — US (Women)', applies_to:['footwear'],
    columns:['5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11'],
    measurements:['foot_length_cm'],
  },
  footwear_us_mens: {
    id:'footwear_us_mens', label:'Footwear — US (Men)', applies_to:['footwear'],
    columns:['6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','13'],
    measurements:['foot_length_cm'],
  },
  footwear_cm: {
    id:'footwear_cm', label:'Footwear — CM', applies_to:['footwear'],
    columns:['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','27.5','28','29','30'],
    measurements:['foot_length_cm'],
  },
  ring_size: {
    id:'ring_size', label:'Ring Size', applies_to:['jewellery'],
    columns:['46','48','50','52','54','56','58','60','62','64','66'],
    measurements:['circumference_mm','diameter_mm'],
  },
  kids_by_age: {
    id:'kids_by_age', label:'Kids (by Age)', applies_to:['kids'],
    columns:['NB','3M','6M','12M','18M','24M','3Y','4Y','5Y','6Y','7Y','8Y','9Y','10Y','12Y','14Y','16Y'],
    measurements:['height_cm','chest_cm','waist_cm'],
  },
  one_size: {
    id:'one_size', label:'One Size / Free Size', applies_to:['accessories','hijabs-scarves'],
    columns:['ONE SIZE'],
    measurements:[],
  },
};

// ── Brand size charts ─────────────────────────────────────
const ZC_SIZE_CHARTS = [
  {
    id:'SC-001', brand_id:'VND-AE-001', brand:'Zucci Label',
    category_id:'CAT-001', category:'Women\'s Fashion',
    size_type:'clothing_intl', name:'Zucci Women\'s Standard',
    status:'approved', is_zucci_master:true,
    uploaded_by:'Fatima Al-Nuaimi', uploaded_at:'2024-01-15T10:00:00Z',
    approved_by:'Zucci Admin', approved_at:'2024-01-15T11:00:00Z',
    rows:[
      { size:'XS',  chest:80,  waist:62,  hip:86,  shoulder:36 },
      { size:'S',   chest:84,  waist:66,  hip:90,  shoulder:37 },
      { size:'M',   chest:88,  waist:70,  hip:94,  shoulder:38 },
      { size:'L',   chest:93,  waist:75,  hip:99,  shoulder:39.5 },
      { size:'XL',  chest:99,  waist:81,  hip:105, shoulder:41 },
      { size:'2XL', chest:105, waist:87,  hip:111, shoulder:42.5 },
      { size:'3XL', chest:111, waist:93,  hip:117, shoulder:44 },
      { size:'4XL', chest:118, waist:100, hip:124, shoulder:45.5 },
    ]
  },
  {
    id:'SC-002', brand_id:'VND-SA-003', brand:'Urban Looms',
    category_id:'CAT-001', category:'Women\'s Fashion',
    size_type:'clothing_intl', name:'Urban Looms Women\'s Sizing',
    status:'approved', is_zucci_master:false,
    uploaded_by:'Rania Al-Qassim', uploaded_at:'2024-03-10T09:30:00Z',
    approved_by:'Sara Ahmed', approved_at:'2024-03-11T14:00:00Z',
    rows:[
      { size:'XS',  chest:78,  waist:60,  hip:84,  shoulder:35.5 },
      { size:'S',   chest:82,  waist:64,  hip:88,  shoulder:36.5 },
      { size:'M',   chest:86,  waist:68,  hip:92,  shoulder:37.5 },
      { size:'L',   chest:92,  waist:74,  hip:98,  shoulder:39 },
      { size:'XL',  chest:98,  waist:80,  hip:104, shoulder:40.5 },
      { size:'2XL', chest:104, waist:86,  hip:110, shoulder:42 },
    ]
  },
  {
    id:'SC-003', brand_id:'VND-AE-007', brand:'Desert Kicks',
    category_id:'CAT-006', category:'Footwear',
    size_type:'footwear_eu', name:'Desert Kicks EU Size Chart',
    status:'approved', is_zucci_master:false,
    uploaded_by:'Khaled Mansouri', uploaded_at:'2024-04-02T08:00:00Z',
    approved_by:'Ops Admin', approved_at:'2024-04-03T10:00:00Z',
    rows:[
      { size:'38', foot_length_cm:24.0 },
      { size:'39', foot_length_cm:24.6 },
      { size:'40', foot_length_cm:25.3 },
      { size:'41', foot_length_cm:25.9 },
      { size:'42', foot_length_cm:26.6 },
      { size:'43', foot_length_cm:27.3 },
      { size:'44', foot_length_cm:27.9 },
      { size:'45', foot_length_cm:28.6 },
      { size:'46', foot_length_cm:29.3 },
    ]
  },
  {
    id:'SC-004', brand_id:'VND-AE-002', brand:'Bakhoor House',
    category_id:'CAT-002', category:'Men\'s Fashion',
    size_type:'clothing_intl', name:'Bakhoor House Kandura Sizing',
    status:'pending', is_zucci_master:false,
    uploaded_by:'Hassan Al-Otaibi', uploaded_at:'2024-06-05T11:00:00Z',
    approved_by:null, approved_at:null,
    rows:[
      { size:'S',  chest:96,  waist:88,  shoulder:44 },
      { size:'M',  chest:100, waist:92,  shoulder:45 },
      { size:'L',  chest:104, waist:96,  shoulder:46 },
      { size:'XL', chest:108, waist:100, shoulder:47 },
      { size:'2XL',chest:112, waist:104, shoulder:48 },
      { size:'3XL',chest:116, waist:108, shoulder:49 },
    ]
  },
  {
    id:'SC-005', brand_id:'VND-AE-012', brand:'Nabila Collective',
    category_id:'CAT-001', category:'Women\'s Fashion',
    size_type:'clothing_intl', name:'Nabila Collective Modest Sizing',
    status:'approved', is_zucci_master:false,
    uploaded_by:'Nabila Hassan', uploaded_at:'2024-02-20T12:00:00Z',
    approved_by:'Fatima Al-Nuaimi', approved_at:'2024-02-21T09:00:00Z',
    rows:[
      { size:'36', chest:80,  waist:62,  hip:86 },
      { size:'38', chest:84,  waist:66,  hip:90 },
      { size:'40', chest:88,  waist:70,  hip:94 },
      { size:'42', chest:92,  waist:74,  hip:98 },
      { size:'44', chest:96,  waist:78,  hip:102 },
      { size:'46', chest:100, waist:82,  hip:106 },
      { size:'48', chest:104, waist:86,  hip:110 },
      { size:'50', chest:108, waist:90,  hip:114 },
    ]
  },
];

// ── Brand-to-brand size mapping for Fit Finder ────────────
const ZC_SIZE_BRAND_MAPPING = {
  // [from_brand SC] size → [to_brand SC] recommended size
  // Key format: `${from_chart_id}_${to_chart_id}`
  'SC-001_SC-002': {
    XS:'XS', S:'S', M:'M', L:'L', XL:'XL', '2XL':'2XL',
    notes:'Zucci Label runs 1cm larger in chest — same size recommended'
  },
  'SC-002_SC-001': {
    XS:'S', S:'M', M:'L', L:'XL', XL:'2XL',
    notes:'Urban Looms runs 2-3cm smaller — size up recommended'
  },
};

// ── Variant types (master definitions) ───────────────────
const ZC_VARIANT_TYPES = [
  {
    id:'VT-001', name:'Size', code:'size', icon:'📏', status:'active',
    applies_to:['clothing','footwear','kids','sportswear'],
    input_type:'swatch_text',
    options:['XXXS','XXS','XS','S','M','L','XL','2XL','3XL','4XL','5XL','6XL','One Size'],
    requires_size_chart:true, sort:1,
  },
  {
    id:'VT-002', name:'Colour', code:'colour', icon:'🎨', status:'active',
    applies_to:['clothing','footwear','accessories','kids','beauty'],
    input_type:'swatch_color',
    options:[
      {label:'Black',    hex:'#1a1a1a'}, {label:'White',    hex:'#f5f5f5'},
      {label:'Navy',     hex:'#1a2a4a'}, {label:'Grey',     hex:'#888888'},
      {label:'Beige',    hex:'#d4b896'}, {label:'Brown',    hex:'#7a5230'},
      {label:'Red',      hex:'#cc2200'}, {label:'Burgundy', hex:'#6b1528'},
      {label:'Green',    hex:'#2d6a2d'}, {label:'Olive',    hex:'#6b6b2d'},
      {label:'Blue',     hex:'#1a4a8a'}, {label:'Sky Blue', hex:'#5aaad4'},
      {label:'Pink',     hex:'#e87c99'}, {label:'Lilac',    hex:'#c4a0d4'},
      {label:'Yellow',   hex:'#f0c040'}, {label:'Orange',   hex:'#e87030'},
      {label:'Gold',     hex:'#c8a830'}, {label:'Silver',   hex:'#a0a8b0'},
      {label:'Khaki',    hex:'#b0a070'}, {label:'Camel',    hex:'#c8903c'},
      {label:'Teal',     hex:'#2a8080'}, {label:'Coral',    hex:'#e86848'},
      {label:'Mint',     hex:'#78c8a0'}, {label:'Cream',    hex:'#f4ede0'},
      {label:'Charcoal', hex:'#404040'}, {label:'Mauve',    hex:'#b07880'},
      {label:'Rose Gold',hex:'#d49080'}, {label:'Ivory',    hex:'#f8f4e8'},
    ],
    requires_size_chart:false, sort:2,
  },
  {
    id:'VT-003', name:'Material', code:'material', icon:'🧵', status:'active',
    applies_to:['clothing','accessories'],
    input_type:'select',
    options:['Cotton','Linen','Silk','Polyester','Nylon','Viscose','Chiffon','Crepe','Jersey','Denim','Leather','Faux Leather','Satin','Velvet','Wool','Cashmere','Mixed / Blend'],
    requires_size_chart:false, sort:3,
  },
  {
    id:'VT-004', name:'Scent', code:'scent', icon:'🌸', status:'active',
    applies_to:['beauty','fragrance'],
    input_type:'select',
    options:['Oud','Rose','Musk','Amber','Jasmine','Sandalwood','Vanilla','Citrus','Lavender','Bergamot','Neroli','Patchouli','Vetiver','Cedar','Custom Blend'],
    requires_size_chart:false, sort:4,
  },
  {
    id:'VT-005', name:'Volume / Concentration', code:'volume', icon:'🧴', status:'active',
    applies_to:['beauty','fragrance'],
    input_type:'select',
    options:['5ml','10ml','15ml','20ml','25ml','30ml','50ml','60ml','75ml','100ml','125ml','150ml','200ml','EDP','EDT','EDP Intense','Parfum','Oil'],
    requires_size_chart:false, sort:5,
  },
  {
    id:'VT-006', name:'Width / Fit', code:'fit', icon:'↔️', status:'active',
    applies_to:['footwear'],
    input_type:'swatch_text',
    options:['Narrow (2A)','Standard (D)','Wide (2E)','Extra Wide (4E)'],
    requires_size_chart:false, sort:6,
  },
  {
    id:'VT-007', name:'Length', code:'length', icon:'📐', status:'active',
    applies_to:['clothing'],
    input_type:'select',
    options:['Short','Regular','Long','Extra Long','Petite','Tall'],
    requires_size_chart:false, sort:7,
  },
  {
    id:'VT-008', name:'Style / Cut', code:'style', icon:'✂️', status:'active',
    applies_to:['clothing'],
    input_type:'select',
    options:['Slim Fit','Regular Fit','Relaxed Fit','Oversized','Straight Leg','Bootcut','Flared','A-Line','Bodycon'],
    requires_size_chart:false, sort:8,
  },
];

// ── Product variant configs ───────────────────────────────
const ZC_PRODUCT_VARIANTS = [
  {
    id:'PV-001', sku:'ABAYA-001', product:'Classic Open Abaya', brand:'Zucci Label',
    variant_types:['VT-001','VT-002','VT-003'],
    variants:[
      { id:'PV-001-001', sku:'ABAYA-001-BLK-M-CREP', size:'M', colour:'Black', material:'Crepe', price_base:189, price_override:null, stock:48, images:1, status:'active' },
      { id:'PV-001-002', sku:'ABAYA-001-BLK-L-CREP', size:'L', colour:'Black', material:'Crepe', price_base:189, price_override:null, stock:32, images:1, status:'active' },
      { id:'PV-001-003', sku:'ABAYA-001-NVY-M-CREP', size:'M', colour:'Navy', material:'Crepe', price_base:189, price_override:null, stock:0, images:1, status:'disabled' },
      { id:'PV-001-004', sku:'ABAYA-001-BEI-XL-CREP', size:'XL', colour:'Beige', material:'Crepe', price_base:189, price_override:189, stock:21, images:1, status:'active' },
      { id:'PV-001-005', sku:'ABAYA-001-BLK-XL-SILK', size:'XL', colour:'Black', material:'Silk', price_base:189, price_override:249, stock:15, images:2, status:'active' },
    ]
  },
  {
    id:'PV-002', sku:'SNEAKR-42', product:'Urban Runner Sneakers', brand:'Desert Kicks',
    variant_types:['VT-001','VT-002','VT-006'],
    variants:[
      { id:'PV-002-001', sku:'SNEAKR-42-W40-BLK', size:'40', colour:'Black', fit:'Standard (D)', price_base:349, price_override:null, stock:56, images:3, status:'active' },
      { id:'PV-002-002', sku:'SNEAKR-42-W41-BLK', size:'41', colour:'Black', fit:'Standard (D)', price_base:349, price_override:null, stock:43, images:3, status:'active' },
      { id:'PV-002-003', sku:'SNEAKR-42-W42-BLK', size:'42', colour:'Black', fit:'Standard (D)', price_base:349, price_override:null, stock:28, images:3, status:'active' },
      { id:'PV-002-004', sku:'SNEAKR-42-W40-WHT', size:'40', colour:'White', fit:'Standard (D)', price_base:349, price_override:null, stock:34, images:2, status:'active' },
      { id:'PV-002-005', sku:'SNEAKR-42-W43-WHT', size:'43', colour:'White', fit:'Standard (D)', price_base:349, price_override:null, stock:0, images:2, status:'inactive' },
    ]
  },
  {
    id:'PV-003', sku:'PERF-OUD-50', product:'Oud Noir Intense', brand:'Bakhoor House',
    variant_types:['VT-005'],
    variants:[
      { id:'PV-003-001', sku:'PERF-OUD-50-50ML', volume:'50ml', price_base:420, price_override:null, stock:68, images:2, status:'active' },
      { id:'PV-003-002', sku:'PERF-OUD-50-100ML', volume:'100ml', price_base:695, price_override:null, stock:32, images:2, status:'active' },
      { id:'PV-003-003', sku:'PERF-OUD-50-10ML', volume:'10ml', price_base:95, price_override:null, stock:0, images:1, status:'disabled' },
    ]
  },
];

// ── Variant requests ──────────────────────────────────────
const ZC_VARIANT_REQUESTS = [
  {
    id:'VR-001', product_sku:'ABAYA-001', product:'Classic Open Abaya',
    vendor_id:'VND-AE-001', vendor:'Zucci Label',
    requested_by:'Rania Al-Qassim', requested_at:'2026-06-07T10:00:00Z',
    variant_type:'VT-001', variant_type_name:'Size',
    requested_values:['XXXL','4XL','5XL'],
    reason:'Strong customer demand for extended sizes in AE market — 40+ requests logged in last 30 days',
    status:'cat_review',
    steps:[
      { role:'vendor',   label:'Submitted',             actor:'Rania Al-Qassim',    at:'2026-06-07T10:00:00Z', note:'Request includes 3 new size variants.' },
      { role:'cat_mgr',  label:'Category Manager Review',actor:null,                at:null,                   note:null },
      { role:'ops',      label:'Ops Confirmation',       actor:null,                at:null,                   note:null },
    ],
    cat_manager_id:'Sara Ahmed', assigned_at:'2026-06-07T14:00:00Z',
  },
  {
    id:'VR-002', product_sku:'SNEAKR-42', product:'Urban Runner Sneakers',
    vendor_id:'VND-AE-007', vendor:'Desert Kicks',
    requested_by:'Khaled Mansouri', requested_at:'2026-06-05T08:00:00Z',
    variant_type:'VT-002', variant_type_name:'Colour',
    requested_values:['Olive','Forest Green','Khaki'],
    reason:'Summer 2026 collection launch — need earth tones for new campaign',
    status:'ops_review',
    steps:[
      { role:'vendor',  label:'Submitted',              actor:'Khaled Mansouri',    at:'2026-06-05T08:00:00Z', note:'New colour additions for summer line.' },
      { role:'cat_mgr', label:'Category Manager Review', actor:'Sara Ahmed',         at:'2026-06-05T16:00:00Z', note:'Approved — earth tones align with footwear category standards.' },
      { role:'ops',     label:'Ops Confirmation',        actor:null,                at:null,                   note:null },
    ],
    cat_manager_id:'Sara Ahmed', assigned_at:'2026-06-05T08:30:00Z',
  },
  {
    id:'VR-003', product_sku:'PERF-OUD-50', product:'Oud Noir Intense',
    vendor_id:'VND-AE-002', vendor:'Bakhoor House',
    requested_by:'Hassan Al-Otaibi', requested_at:'2026-06-01T11:00:00Z',
    variant_type:'VT-005', variant_type_name:'Volume / Concentration',
    requested_values:['200ml','25ml Travel'],
    reason:'Customer research shows demand for travel size + luxury large format',
    status:'approved',
    steps:[
      { role:'vendor',  label:'Submitted',              actor:'Hassan Al-Otaibi',   at:'2026-06-01T11:00:00Z', note:'Two new size variants requested.' },
      { role:'cat_mgr', label:'Category Manager Review', actor:'Lara Nakhoul',       at:'2026-06-02T10:00:00Z', note:'Approved — consistent with fragrance policy.' },
      { role:'ops',     label:'Ops Confirmation',        actor:'Ops Admin',          at:'2026-06-03T09:00:00Z', note:'Confirmed. Vendor notified to proceed with photography and stock.' },
    ],
    cat_manager_id:'Lara Nakhoul', assigned_at:'2026-06-01T12:00:00Z',
  },
  {
    id:'VR-004', product_sku:'HIJAB-CREP', product:'Crepe Hijab Collection',
    vendor_id:'VND-SA-003', vendor:'Urban Looms',
    requested_by:'Nadia Khaled', requested_at:'2026-06-08T09:00:00Z',
    variant_type:'VT-003', variant_type_name:'Material',
    requested_values:['Bamboo Silk','Recycled Polyester'],
    reason:'Launching sustainable line — new eco-friendly materials for Ramadan 2027 collection',
    status:'pending',
    steps:[
      { role:'vendor',  label:'Submitted',              actor:'Nadia Khaled',       at:'2026-06-08T09:00:00Z', note:'Eco-materials for sustainability line.' },
      { role:'cat_mgr', label:'Category Manager Review', actor:null,                at:null,                   note:null },
      { role:'ops',     label:'Ops Confirmation',        actor:null,                at:null,                   note:null },
    ],
    cat_manager_id:null, assigned_at:null,
  },
  {
    id:'VR-005', product_sku:'KAND-L-WH', product:'Premium Kandura White',
    vendor_id:'VND-AE-002', vendor:'Bakhoor House',
    requested_by:'Hassan Al-Otaibi', requested_at:'2026-05-28T14:00:00Z',
    variant_type:'VT-001', variant_type_name:'Size',
    requested_values:['Tall (Long)','Petite (Short)'],
    reason:'UAE market requests — customers are requesting fit adjustments for height',
    status:'rejected',
    steps:[
      { role:'vendor',  label:'Submitted',              actor:'Hassan Al-Otaibi',   at:'2026-05-28T14:00:00Z', note:'Height-based length variants requested.' },
      { role:'cat_mgr', label:'Category Manager Review', actor:'Sara Ahmed',         at:'2026-05-29T11:00:00Z', note:'Rejected — Zucci does not currently support length variants for kanduras. Suggest alternate solution via custom orders.' },
      { role:'ops',     label:'Ops Confirmation',        actor:null,                at:null,                   note:'N/A — rejected at category review stage.' },
    ],
    cat_manager_id:'Sara Ahmed', assigned_at:'2026-05-28T14:30:00Z',
  },
];


// Auto-detect size type from product category
function detectSizeType(category) {
  const cat = (category||'').toLowerCase();
  if (/fragrance|perfume|oud|attar|cologne/.test(cat)) return ['liquid_ml','fragrance_concentration','packaging_type'];
  if (/beauty|skincare|hair|body/.test(cat)) return ['liquid_ml','packaging_type'];
  if (/shoe|footwear|sneaker|boot|sandal/.test(cat)) return ['shoes_eu','shoes_us'];
  if (/kid|children|baby/.test(cat)) return ['clothing_kids'];
  if (/sport|active/.test(cat)) return ['clothing_intl'];
  return ['clothing_intl'];
}

export { ZC_SIZE_TYPES, ZC_SIZE_CHARTS, ZC_SIZE_BRAND_MAPPING, ZC_VARIANT_TYPES, ZC_PRODUCT_VARIANTS, ZC_VARIANT_REQUESTS };
