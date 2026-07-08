// zucci-discounts-data.jsx — Discounts & Promotions module data

// ── Discount origin types ─────────────────────────────────
// zucci_platform   = Zucci creates, Zucci pays, no vendor approval
// zucci_cofunded   = Zucci creates, vendor must co-fund approval
// vendor_submitted = Vendor creates, Zucci must approve
// vendor_suggested = Zucci suggests to vendor, vendor accepts/declines
// payment_partner  = Bank/card/BNPL deal, Finance+Legal track

const DISCOUNT_TYPES = {
  percentage:    'Percentage Off',
  fixed:         'Fixed Amount Off',
  free_shipping: 'Free Shipping',
  bogo:          'Buy X Get Y',
  tiered:        'Tiered Spend',
  bundle:        'Bundle Deal',
  first_order:   'First Order',
  loyalty:       'Loyalty Exclusive',
  cashback:      'Cashback',
};

const MARKET_TZ = { AE:'GST (UTC+4)', SA:'AST (UTC+3)', EG:'EET (UTC+2)', QA:'AST (UTC+3)' };
const MARKET_CUR = { AE:'AED', SA:'SAR', EG:'EGP', QA:'QAR' };

// ── Zucci Platform Promotions ─────────────────────────────
const ZCD_ZUCCI_PROMOS = {
  AE: [
    { id:'ZP-AE-001', name:'Summer Sale 2025', type:'percentage', value:15, market:'AE', currency:'AED',
      origin:'zucci_platform', status:'active', fundedBy:'zucci_100', zucciFundPct:100, vendorFundPct:0,
      startDate:'Jun 15, 2025', endDate:'Jul 15, 2025', startTime:'00:00 GST', endTime:'23:59 GST',
      appliesTo:'all', categories:[], brands:[], minOrderValue:0,
      usageCount:1284, totalDiscountGiven:42800, revenueGenerated:287600,
      code:null, autoApply:true, stackable:false,
      markets:['AE'], notes:'Platform-wide summer campaign',
    },
    { id:'ZP-AE-002', name:'First Order Welcome', type:'percentage', value:10, market:'AE', currency:'AED',
      origin:'zucci_platform', status:'active', fundedBy:'zucci_100', zucciFundPct:100, vendorFundPct:0,
      startDate:'Jan 1, 2025', endDate:'Dec 31, 2025', startTime:null, endTime:null,
      appliesTo:'new_customers', categories:[], brands:[], minOrderValue:100,
      usageCount:441, totalDiscountGiven:18200, revenueGenerated:163800,
      code:'WELCOME10', autoApply:false, stackable:false,
      markets:['AE'], notes:'New customer acquisition',
    },
    { id:'ZP-AE-003', name:'Flash Sale — Evening Wear', type:'percentage', value:25, market:'AE', currency:'AED',
      origin:'zucci_platform', status:'scheduled', fundedBy:'split', zucciFundPct:60, vendorFundPct:40,
      startDate:'Jun 20, 2025', endDate:'Jun 20, 2025', startTime:'18:00 GST', endTime:'23:59 GST',
      appliesTo:'category', categories:['Evening Wear','Dresses'], brands:[], minOrderValue:200,
      usageCount:0, totalDiscountGiven:0, revenueGenerated:0,
      code:null, autoApply:true, stackable:false,
      markets:['AE'], notes:'6-hour flash sale',
    },
    { id:'ZP-AE-004', name:'Gold Tier Exclusive', type:'percentage', value:12, market:'AE', currency:'AED',
      origin:'zucci_platform', status:'active', fundedBy:'zucci_100', zucciFundPct:100, vendorFundPct:0,
      startDate:'Jan 1, 2025', endDate:'Dec 31, 2025', startTime:null, endTime:null,
      appliesTo:'loyalty_tier', categories:[], brands:[], minOrderValue:0, loyaltyTier:'Gold',
      usageCount:228, totalDiscountGiven:9140, revenueGenerated:76800,
      code:null, autoApply:true, stackable:true,
      markets:['AE'], notes:'Gold and Platinum tier benefit',
    },
  ],
  SA: [
    { id:'ZP-SA-001', name:'White Friday 2024', type:'percentage', value:20, market:'SA', currency:'SAR',
      origin:'zucci_platform', status:'expired', fundedBy:'split', zucciFundPct:50, vendorFundPct:50,
      startDate:'Nov 29, 2024', endDate:'Dec 2, 2024', startTime:'00:00 AST', endTime:'23:59 AST',
      appliesTo:'all', categories:[], brands:[], minOrderValue:0,
      usageCount:2841, totalDiscountGiven:284100, revenueGenerated:1136400,
      code:null, autoApply:true, stackable:false,
      markets:['SA'], notes:'KSA White Friday campaign',
    },
    { id:'ZP-SA-002', name:'KSA National Day', type:'percentage', value:23, market:'SA', currency:'SAR',
      origin:'zucci_platform', status:'scheduled', fundedBy:'zucci_100', zucciFundPct:100, vendorFundPct:0,
      startDate:'Sep 23, 2025', endDate:'Sep 23, 2025', startTime:'00:00 AST', endTime:'23:59 AST',
      appliesTo:'all', categories:[], brands:[], minOrderValue:0,
      usageCount:0, totalDiscountGiven:0, revenueGenerated:0,
      code:null, autoApply:true, stackable:false, markets:['SA'], notes:'Saudi National Day — 23% to match the date',
    },
  ],
  EG: [
    { id:'ZP-EG-001', name:'Ramadan 2025', type:'percentage', value:20, market:'EG', currency:'EGP',
      origin:'zucci_platform', status:'expired', fundedBy:'split', zucciFundPct:50, vendorFundPct:50,
      startDate:'Mar 1, 2025', endDate:'Mar 31, 2025', startTime:'00:00 EET', endTime:'23:59 EET',
      appliesTo:'all', categories:[], brands:[], minOrderValue:0,
      usageCount:8441, totalDiscountGiven:4220500, revenueGenerated:16882000,
      code:null, autoApply:true, stackable:false, markets:['EG'], notes:'Annual Ramadan platform campaign',
    },
    { id:'ZP-EG-002', name:'Egypt First Order', type:'fixed', value:100, market:'EG', currency:'EGP',
      origin:'zucci_platform', status:'active', fundedBy:'zucci_100', zucciFundPct:100, vendorFundPct:0,
      startDate:'Jan 1, 2025', endDate:'Dec 31, 2025', startTime:null, endTime:null,
      appliesTo:'new_customers', categories:[], brands:[], minOrderValue:500,
      usageCount:1284, totalDiscountGiven:128400, revenueGenerated:769200,
      code:'ZUCCIEG', autoApply:false, stackable:false, markets:['EG'], notes:'EG new user incentive',
    },
  ],
  QA: [],
};

// ── Vendor Promotions (submissions + suggestions) ─────────
const ZCD_VENDOR_PROMOS = [
  { id:'VP-001', name:'Le Maillot — Mid-Season Sale', type:'percentage', value:20,
    market:'AE', currency:'AED', vendor:'24K Fashion House', brand:'Le Maillot',
    origin:'vendor_submitted', status:'pending_approval',
    fundedBy:'vendor_100', zucciFundPct:0, vendorFundPct:100,
    startDate:'Jun 25, 2025', endDate:'Jul 10, 2025', minOrderValue:200,
    appliesTo:'brand', categories:[], brands:['Le Maillot'],
    submittedDate:'Jun 3, 2025', submittedBy:'Ahmed Mohamed',
    approvalNote:'', approvedBy:null, approvedDate:null,
    code:'LMSALE20', autoApply:false, stackable:false,
    conflictsWith:['ZP-AE-001'],
  },
  { id:'VP-002', name:'Burgandy — Ramadan Exclusive', type:'percentage', value:15,
    market:'EG', currency:'EGP', vendor:'24K Fashion House', brand:'Burgandy',
    origin:'vendor_submitted', status:'approved',
    fundedBy:'vendor_100', zucciFundPct:0, vendorFundPct:100,
    startDate:'Mar 5, 2025', endDate:'Mar 31, 2025', minOrderValue:0,
    appliesTo:'brand', categories:[], brands:['Burgandy'],
    submittedDate:'Feb 20, 2025', submittedBy:'Ahmed Mohamed',
    approvalNote:'Approved — runs alongside Zucci Ramadan campaign. Max 35% combined discount applies.',
    approvedBy:'Sara Medhat', approvedDate:'Feb 22, 2025',
    code:null, autoApply:true, stackable:true, conflictsWith:[],
  },
  { id:'VP-003', name:'7 Wonders — KSA Formal Sale', type:'percentage', value:25,
    market:'SA', currency:'SAR', vendor:'7 Wonders Trading', brand:'7 Wonders',
    origin:'vendor_submitted', status:'rejected',
    fundedBy:'vendor_100', zucciFundPct:0, vendorFundPct:100,
    startDate:'Jun 10, 2025', endDate:'Jun 30, 2025', minOrderValue:300,
    appliesTo:'brand', categories:[], brands:['7 Wonders'],
    submittedDate:'Jun 1, 2025', submittedBy:'Tariq Al-Rashid',
    approvalNote:'Rejected — exceeds max 20% single-vendor discount cap in KSA. Resubmit at 20% or below.',
    approvedBy:'Sara Medhat', approvedDate:'Jun 2, 2025',
    code:'7W25KSA', autoApply:false, stackable:false, conflictsWith:[],
  },
  { id:'VP-004', name:'Aurora — Activewear Launch', type:'percentage', value:10,
    market:'SA', currency:'SAR', vendor:'Aurora Fashion SA', brand:'Aurora Fashion',
    origin:'vendor_suggested', status:'suggested',
    fundedBy:'split', zucciFundPct:50, vendorFundPct:50,
    startDate:'Jul 1, 2025', endDate:'Jul 31, 2025', minOrderValue:0,
    appliesTo:'brand', categories:['Activewear'], brands:['Aurora Fashion'],
    submittedDate:null, submittedBy:null,
    suggestedBy:'Sara Medhat', suggestedDate:'Jun 3, 2025',
    suggestedNote:'Aurora just launched activewear line. We suggest a 10% introductory offer co-funded 50/50 for July.',
    vendorResponse:null, vendorResponseDate:null,
    approvalNote:'', approvedBy:null, approvedDate:null,
    code:null, autoApply:true, stackable:false, conflictsWith:[],
  },
  { id:'VP-005', name:'Almaz Couture — Eid Collection', type:'percentage', value:18,
    market:'AE', currency:'AED', vendor:'Almaz Couture LLC', brand:'Almaz Couture',
    origin:'vendor_submitted', status:'pending_approval',
    fundedBy:'vendor_100', zucciFundPct:0, vendorFundPct:100,
    startDate:'Jun 26, 2025', endDate:'Jul 5, 2025', minOrderValue:300,
    appliesTo:'category', categories:['Evening Wear','Dresses'], brands:['Almaz Couture'],
    submittedDate:'Jun 2, 2025', submittedBy:'Nadia Hamdi',
    approvalNote:'', approvedBy:null, approvedDate:null,
    code:'EIDAL18', autoApply:false, stackable:false,
    conflictsWith:['ZP-AE-001'],
  },
];

// ── Payment Partner Deals ─────────────────────────────────
const ZCD_PAYMENT_DEALS = [
  { id:'PPD-001', partner:'HSBC Egypt', partnerType:'bank', logo:'🏦',
    market:'EG', currency:'EGP',
    dealType:'cashback', value:10, unit:'percentage',
    maxCashbackPerTx:200, maxCashbackPerMonth:400,
    appliesTo:'all', minOrderValue:500,
    paymentMethods:['HSBC Credit Card','HSBC Debit Card'],
    status:'active', startDate:'Jan 1, 2025', endDate:'Dec 31, 2025',
    fundedBy:'partner_100', contractRef:'HSBC-EG-2025-ZCI-001',
    contractUploaded:true, legalApproved:true, financeApproved:true,
    txnCount:441, totalCashbackPaid:88200, totalRevenue:1764000,
    notes:'HSBC co-branded campaign. HSBC pays 100% of cashback amount.',
  },
  { id:'PPD-002', partner:'Banque Misr', partnerType:'bank', logo:'🏦',
    market:'EG', currency:'EGP',
    dealType:'instant_discount', value:5, unit:'percentage',
    maxCashbackPerTx:100, maxCashbackPerMonth:null,
    appliesTo:'all', minOrderValue:300,
    paymentMethods:['Banque Misr Meeza Card'],
    status:'active', startDate:'Apr 1, 2025', endDate:'Sep 30, 2025',
    fundedBy:'split', contractRef:'BM-EG-2025-ZCI-002',
    contractUploaded:true, legalApproved:true, financeApproved:true,
    txnCount:228, totalCashbackPaid:22800, totalRevenue:912000,
    notes:'Instant discount at checkout. Split 50/50 with Banque Misr.',
  },
  { id:'PPD-003', partner:'Tabby', partnerType:'bnpl', logo:'💳',
    market:'AE', currency:'AED',
    dealType:'installments_zero', value:0, unit:'percentage',
    maxCashbackPerTx:null, maxCashbackPerMonth:null,
    appliesTo:'all', minOrderValue:200,
    paymentMethods:['Tabby Pay Later','Tabby Installments'],
    status:'active', startDate:'Jan 1, 2025', endDate:'Dec 31, 2025',
    fundedBy:'partner_100', contractRef:'TABBY-AE-2025-ZCI-001',
    contractUploaded:true, legalApproved:true, financeApproved:true,
    txnCount:328, totalCashbackPaid:0, totalRevenue:142800,
    notes:'0% installments — Tabby absorbs financing cost. No Zucci cost.',
  },
  { id:'PPD-004', partner:'STC Pay', partnerType:'wallet', logo:'📱',
    market:'SA', currency:'SAR',
    dealType:'cashback', value:8, unit:'percentage',
    maxCashbackPerTx:100, maxCashbackPerMonth:200,
    appliesTo:'all', minOrderValue:200,
    paymentMethods:['STC Pay Wallet'],
    status:'pending_legal', startDate:null, endDate:null,
    fundedBy:'partner_100', contractRef:'STCP-SA-2025-ZCI-001',
    contractUploaded:true, legalApproved:false, financeApproved:true,
    txnCount:0, totalCashbackPaid:0, totalRevenue:0,
    notes:'Awaiting KSA legal team approval. Expected go-live: Jul 1, 2025.',
  },
  { id:'PPD-005', partner:'CIB Egypt', partnerType:'bank', logo:'🏦',
    market:'EG', currency:'EGP',
    dealType:'cashback', value:12, unit:'percentage',
    maxCashbackPerTx:300, maxCashbackPerMonth:600,
    appliesTo:'category', minOrderValue:800,
    paymentMethods:['CIB Credit Card','CIB World Card'],
    status:'negotiating', startDate:null, endDate:null,
    fundedBy:'partner_100', contractRef:null,
    contractUploaded:false, legalApproved:false, financeApproved:false,
    txnCount:0, totalCashbackPaid:0, totalRevenue:0,
    notes:'In negotiation. CIB wants exclusivity on fashion vertical for 6 months.',
  },
];

// ── Seasonal Campaigns ────────────────────────────────────
const ZCD_CAMPAIGNS = [
  { id:'CAM-001', name:'Ramadan 2026', icon:'☽',
    markets:{ EG:{ start:'Feb 28, 2026', end:'Mar 30, 2026', tz:'EET', status:'planned' }, SA:{ start:'Feb 28, 2026', end:'Mar 30, 2026', tz:'AST', status:'planned' }, AE:{ start:'Feb 28, 2026', end:'Mar 30, 2026', tz:'GST', status:'planned' } },
    defaultDiscount:20, fundingModel:'split_50_50',
    participatingBrands:['Le Maillot','Burgandy','7 Wonders','Aurora Fashion','Almaz Couture'],
    optedOutBrands:[],
    totalBudget:{ EG:2000000, SA:500000, AE:200000 },
    status:'planned', createdBy:'Sara Medhat', createdDate:'Jun 1, 2025',
    notes:'Annual Ramadan mega campaign. Brands opt-in by Jan 15.',
  },
  { id:'CAM-002', name:'White Friday 2025', icon:'🛍',
    markets:{ SA:{ start:'Nov 28, 2025', end:'Dec 1, 2025', tz:'AST', status:'planned' }, AE:{ start:'Nov 28, 2025', end:'Dec 1, 2025', tz:'GST', status:'planned' } },
    defaultDiscount:25, fundingModel:'split_50_50',
    participatingBrands:['Le Maillot','Burgandy','7 Wonders'],
    optedOutBrands:['Almaz Couture'],
    totalBudget:{ SA:800000, AE:300000 },
    status:'planned', createdBy:'Sara Medhat', createdDate:'Jun 1, 2025',
    notes:'Black Friday equivalent for GCC markets.',
  },
  { id:'CAM-003', name:'Summer Sale 2025', icon:'☀',
    markets:{ AE:{ start:'Jun 15, 2025', end:'Jul 15, 2025', tz:'GST', status:'active' }, SA:{ start:'Jun 20, 2025', end:'Jul 20, 2025', tz:'AST', status:'active' } },
    defaultDiscount:15, fundingModel:'zucci_60_vendor_40',
    participatingBrands:['Le Maillot','Aurora Fashion','Almaz Couture'],
    optedOutBrands:['Burgandy','7 Wonders'],
    totalBudget:{ AE:150000, SA:100000 },
    status:'active', createdBy:'Sara Medhat', createdDate:'May 15, 2025',
    notes:'Summer clearance. Swimwear and activewear focus.',
  },
  { id:'CAM-004', name:'Back to School 2025', icon:'📚',
    markets:{ EG:{ start:'Sep 1, 2025', end:'Sep 30, 2025', tz:'EET', status:'planned' } },
    defaultDiscount:10, fundingModel:'zucci_100',
    participatingBrands:['7 Wonders','Cairo Essentials'],
    optedOutBrands:[],
    totalBudget:{ EG:300000 },
    status:'planned', createdBy:'Sara Medhat', createdDate:'Jun 1, 2025',
    notes:'Egypt only. Kids and casual wear focus.',
  },
];

// ── Discount Rules ────────────────────────────────────────
const ZCD_RULES = {
  stackingPriority: [
    { rank:1, type:'payment_partner',  label:'Payment Partner Deals', note:'Always applied first — partner-funded' },
    { rank:2, type:'campaign',         label:'Seasonal Campaigns',    note:'Platform campaigns override vendor promos' },
    { rank:3, type:'loyalty',          label:'Loyalty Tier Benefits', note:'Auto-applied for eligible tier' },
    { rank:4, type:'vendor_promo',     label:'Vendor Promotions',     note:'Brand-specific discounts' },
    { rank:5, type:'discount_code',    label:'Discount Codes',        note:'Manual code entry — lowest priority' },
  ],
  maxDiscountCap: { AE:40, SA:35, EG:45, QA:30 }, // percentage
  maxStackCount:  2, // max number of discounts that can stack on one order
  codeCombineRule:'no_combine', // codes cannot be combined with campaign discounts
  markets: {
    AE: { currency:'AED', tz:'GST (UTC+4)', minOrderValues:{ percentage:0, fixed:100, free_shipping:150 }, vendorMaxDiscount:20, requiresLegalReview:false },
    SA: { currency:'SAR', tz:'AST (UTC+3)', minOrderValues:{ percentage:0, fixed:80, free_shipping:120 }, vendorMaxDiscount:20, requiresLegalReview:true, legalNote:'KSA Ministry of Commerce requires promotional price to be lower than original for 30+ days' },
    EG: { currency:'EGP', tz:'EET (UTC+2)', minOrderValues:{ percentage:0, fixed:300, free_shipping:600 }, vendorMaxDiscount:25, requiresLegalReview:false },
    QA: { currency:'QAR', tz:'AST (UTC+3)', minOrderValues:{ percentage:0, fixed:100, free_shipping:150 }, vendorMaxDiscount:20, requiresLegalReview:false },
  },
  exclusions: [
    { id:'exc1', type:'category',  value:'Gift Cards',  reason:'Gift cards cannot be discounted' },
    { id:'exc2', type:'tag',       value:'final_sale',  reason:'Final sale items already at markdown' },
    { id:'exc3', type:'brand',     value:'Almaz Couture',reason:'Brand opted out of platform-wide campaigns' },
  ],
};

window.MARKET_CUR         = window.MARKET_CUR || MARKET_CUR;
window.MARKET_TZ          = window.MARKET_TZ  || MARKET_TZ;
// ── Customer Targeting ─────────────────────────────────────
const ZCD_GIFT_CARDS = [
  { id:'GC-001', code:'ZUCCI-2025-XMAS-8841', value:500, currency:'AED', market:'AE',
    issuedTo:'Layla Hassan', issuedToId:'BYR-1029', issuedBy:'Sara Medhat',
    issuedDate:'Dec 25, 2024', expiryDate:'Dec 31, 2025',
    balance:200, status:'partial', usedCount:2, notes:'Christmas gift — loyal customer' },
  { id:'GC-002', code:'ZUCCI-EG-EIDGIFT-441', value:1000, currency:'EGP', market:'EG',
    issuedTo:'Bulk — 50 customers', issuedToId:null, issuedBy:'Sara Medhat',
    issuedDate:'Apr 8, 2024', expiryDate:'Jun 30, 2024',
    balance:0, status:'expired', usedCount:38, notes:'Eid gift card campaign — EG only' },
  { id:'GC-003', code:'ZUCCI-VIP-AE-2025', value:1000, currency:'AED', market:'AE',
    issuedTo:'Ahmed Al-Rashid', issuedToId:'BYR-2841', issuedBy:'Sara Medhat',
    issuedDate:'Jan 1, 2025', expiryDate:'Dec 31, 2025',
    balance:1000, status:'active', usedCount:0, notes:'VIP customer gift — Gold tier' },
  { id:'GC-004', code:'ZUCCI-SA-WELCOME', value:200, currency:'SAR', market:'SA',
    issuedTo:'Bulk — new KSA customers Jan 2025', issuedToId:null, issuedBy:'System',
    issuedDate:'Jan 15, 2025', expiryDate:'Mar 31, 2025',
    balance:0, status:'expired', usedCount:284, notes:'KSA new user gift card batch' },
];

const ZCD_STORE_CREDITS = [
  { id:'SC-001', customerId:'BYR-1029', customerName:'Layla Hassan', market:'AE', currency:'AED',
    amount:150, reason:'Return compensation — damaged item', addedBy:'CS Agent',
    addedDate:'May 15, 2025', expiryDate:'Aug 15, 2025', used:0, status:'active' },
  { id:'SC-002', customerId:'BYR-0441', customerName:'Mohamed Karim', market:'EG', currency:'EGP',
    amount:500, reason:'Complaint resolution — late delivery', addedBy:'Sara Medhat',
    addedDate:'May 10, 2025', expiryDate:'Aug 10, 2025', used:500, status:'used' },
  { id:'SC-003', customerId:'BYR-2841', customerName:'Ahmed Al-Rashid', market:'AE', currency:'AED',
    amount:300, reason:'Order cancellation refund as credit', addedBy:'System',
    addedDate:'Jun 1, 2025', expiryDate:'Sep 1, 2025', used:150, status:'partial' },
  { id:'SC-004', customerId:'BYR-3301', customerName:'Fatima Al-Zahra', market:'SA', currency:'SAR',
    amount:100, reason:'Loyalty milestone reward — 10th order', addedBy:'System (auto)',
    addedDate:'Jun 3, 2025', expiryDate:'Sep 3, 2025', used:0, status:'active' },
];

const ZCD_TARGETED_RULES = [
  { id:'TR-001', name:'New Customer Welcome — UAE', market:'AE', currency:'AED',
    trigger:'first_order', discountType:'percentage', value:10, maxValue:50,
    channel:'all', minOrderValue:150, usageLimit:'one_per_customer',
    status:'active', createdDate:'Jan 1, 2025',
    usageCount:441, totalDiscountGiven:18200,
    notes:'10% off first order, max AED 50, min cart AED 150' },
  { id:'TR-002', name:'App-Exclusive First Order — EG', market:'EG', currency:'EGP',
    trigger:'first_order_app', discountType:'percentage', value:15, maxValue:200,
    channel:'app_only', minOrderValue:500, usageLimit:'one_per_customer',
    status:'active', createdDate:'Jan 15, 2025',
    usageCount:284, totalDiscountGiven:56800,
    notes:'15% off first order via app only — EG market' },
  { id:'TR-003', name:'Zucci Plus Subscriber Benefit', market:'AE', currency:'AED',
    trigger:'loyalty_subscription', discountType:'percentage', value:5, maxValue:null,
    channel:'all', minOrderValue:0, usageLimit:'always_on',
    status:'active', createdDate:'Mar 1, 2025',
    usageCount:1284, totalDiscountGiven:48200,
    notes:'Ongoing 5% for Zucci Plus subscribers' },
  { id:'TR-004', name:'Dormant Customer Winback — SA', market:'SA', currency:'SAR',
    trigger:'inactive_90_days', discountType:'percentage', value:20, maxValue:100,
    channel:'email', minOrderValue:200, usageLimit:'one_per_customer',
    status:'active', createdDate:'Apr 1, 2025',
    usageCount:88, totalDiscountGiven:8800,
    notes:'20% off for customers inactive 90+ days. Triggered via automated email.' },
  { id:'TR-005', name:'Birthday Discount', market:'all', currency:'varies',
    trigger:'birthday', discountType:'fixed', value:null, marketValues:{ AE:50, SA:50, EG:200 },
    channel:'app_push', minOrderValue:0, usageLimit:'one_per_year',
    status:'active', createdDate:'Jan 1, 2025',
    usageCount:228, totalDiscountGiven:null,
    notes:'Auto-triggered on customer birthday. App push notification.' },
];

// ── Automated Rules (Warehouse Aging + Other) ─────────────
const ZCD_AUTO_RULES = [
  { id:'AR-001', name:'Cross-Border Return — Warehouse Aging Discount',
    type:'warehouse_aging', status:'active',
    markets:['AE','SA'], warehouses:['WH-DXB-01','WH-RUH-01'],
    triggers:[
      { days:30,  discountPct:10, action:'auto_apply',  note:'10% off after 30 days in non-origin warehouse' },
      { days:60,  discountPct:20, action:'auto_apply',  note:'20% off after 60 days' },
      { days:90,  discountPct:30, action:'auto_apply',  note:'30% off after 90 days' },
      { days:120, discountPct:50, action:'auto_apply',  note:'50% off — clearance pricing' },
      { days:180, discountPct:null,action:'notify_ops', note:'Flag for write-off or donate — ops review required' },
    ],
    fundedBy:'zucci_100',
    dailyStorageCostAed:2.5,
    applyTo:'returned_items_non_origin',
    stackable:false,
    notifyVendorAt:60,
    createdBy:'Sara Medhat', createdDate:'Jan 1, 2025',
    activeItems:14, totalStorageCostToDate:8400,
    notes:'Items returned from non-origin country held in local WH. Aging discount auto-applies to get them sold. Vendor notified at 60-day mark.',
  },
  { id:'AR-002', name:'Out-of-Season Auto Clearance',
    type:'seasonal_clearance', status:'active',
    markets:['AE','EG'],
    triggers:[
      { days:30,  discountPct:15, action:'auto_apply',  note:'15% off after season end + 30 days' },
      { days:60,  discountPct:25, action:'auto_apply',  note:'25% off after 60 days past season' },
      { days:90,  discountPct:40, action:'notify_vendor',note:'40% off — vendor notified to pull stock or accept clearance' },
    ],
    fundedBy:'split', zucciFundPct:50, vendorFundPct:50,
    applyTo:'seasonal_unsold_stock',
    stackable:false,
    notifyVendorAt:90,
    createdBy:'Sara Medhat', createdDate:'Feb 1, 2025',
    activeItems:28, totalStorageCostToDate:0,
    notes:'Applies to seasonal collections (SC/FC tagged SKUs) after end of season.',
  },
  { id:'AR-003', name:'Low Stock Urgency Discount',
    type:'low_stock', status:'active',
    markets:['AE','SA','EG'],
    triggers:[
      { threshold:5,  discountPct:0,  action:'show_urgency_badge', note:'Show "Only 5 left" badge' },
      { threshold:2,  discountPct:5,  action:'auto_apply',         note:'5% off when ≤2 units left' },
    ],
    fundedBy:'zucci_100',
    applyTo:'variants_below_threshold',
    stackable:true,
    notifyVendorAt:2,
    createdBy:'System', createdDate:'Jan 1, 2025',
    activeItems:44, totalStorageCostToDate:0,
    notes:'Creates urgency signal and small discount for near-zero stock variants.',
  },
];

// ── Bulk sample promos (auto-generated) ─────────────────────
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-100',name:'Weekend Flash Sale 2025',type:'percentage',value:5,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-101',name:'Loyalty Exclusive 2026',type:'fixed',value:100,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:7,totalDiscountGiven:560,revenueGenerated:3360,code:'LOYALT3S',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-102',name:'Mid-Season Markdown 2025',type:'free_shipping',value:150,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:14,totalDiscountGiven:1680,revenueGenerated:10080,code:'MIDSEA4T',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-103',name:'App Launch Special 2026',type:'bogo',value:200,market:'AE',currency:'AED',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-104',name:'Bundle Save 2025',type:'tiered',value:50,market:'AE',currency:'AED',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:244,totalDiscountGiven:9760,revenueGenerated:58560,code:'BUNDLE6V',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-105',name:'Free Shipping Day 2026',type:'percentage',value:30,market:'AE',currency:'AED',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'FREESH7W',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-106',name:'First Order Bonus 2025',type:'fixed',value:150,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:42,totalDiscountGiven:5040,revenueGenerated:30240,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-107',name:'Clearance Week 2026',type:'free_shipping',value:200,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:49,totalDiscountGiven:7840,revenueGenerated:47040,code:'CLEARA9Y',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-108',name:'VIP Early Access 2025',type:'bogo',value:50,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:56,totalDiscountGiven:2240,revenueGenerated:13440,code:'VIPEARAZ',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-109',name:'Category Deal Dresses 2026',type:'tiered',value:100,market:'AE',currency:'AED',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-110',name:'Category Deal Denim 2025',type:'percentage',value:25,market:'AE',currency:'AED',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:310,totalDiscountGiven:6200,revenueGenerated:37200,code:'CATEGOD1',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-111',name:'New Arrival Discount 2026',type:'fixed',value:200,market:'AE',currency:'AED',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'NEWARRE2',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-112',name:'Limited Time Offer 2025',type:'free_shipping',value:50,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:84,totalDiscountGiven:3360,revenueGenerated:20160,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-113',name:'Double Points Day 2026',type:'bogo',value:100,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:91,totalDiscountGiven:7280,revenueGenerated:43680,code:'DOUBLEG4',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-114',name:'Referral Bonus 2025',type:'tiered',value:150,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:98,totalDiscountGiven:11760,revenueGenerated:70560,code:'REFERRH5',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-115',name:'Birthday Month Deal 2026',type:'percentage',value:20,market:'AE',currency:'AED',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-116',name:'Back in Stock Sale 2025',type:'fixed',value:50,market:'AE',currency:'AED',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:376,totalDiscountGiven:15040,revenueGenerated:90240,code:'BACKINJ7',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-117',name:'Festive Special 2026',type:'free_shipping',value:100,market:'AE',currency:'AED',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'FESTIVK8',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-118',name:'Brand Launch 2025',type:'bogo',value:150,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:126,totalDiscountGiven:15120,revenueGenerated:90720,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-119',name:'End Season Clearance 2026',type:'tiered',value:200,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:133,totalDiscountGiven:21280,revenueGenerated:127680,code:'ENDSEAMA',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-120',name:'Weekend Flash Sale 2025',type:'percentage',value:15,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:140,totalDiscountGiven:1680,revenueGenerated:10080,code:'WEEKENNB',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-121',name:'Loyalty Exclusive 2026',type:'fixed',value:100,market:'AE',currency:'AED',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-122',name:'Mid-Season Markdown 2025',type:'free_shipping',value:150,market:'AE',currency:'AED',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:442,totalDiscountGiven:53040,revenueGenerated:318240,code:'MIDSEAPD',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-123',name:'App Launch Special 2026',type:'bogo',value:200,market:'AE',currency:'AED',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'APPLAUQE',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-124',name:'Bundle Save 2025',type:'tiered',value:50,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:168,totalDiscountGiven:6720,revenueGenerated:40320,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-125',name:'Free Shipping Day 2026',type:'percentage',value:10,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:175,totalDiscountGiven:1400,revenueGenerated:8400,code:'FREESHSG',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-126',name:'First Order Bonus 2025',type:'fixed',value:150,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:182,totalDiscountGiven:21840,revenueGenerated:131040,code:'FIRSTOTH',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-127',name:'Clearance Week 2026',type:'free_shipping',value:200,market:'AE',currency:'AED',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-128',name:'VIP Early Access 2025',type:'bogo',value:50,market:'AE',currency:'AED',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:508,totalDiscountGiven:20320,revenueGenerated:121920,code:'VIPEARVJ',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-129',name:'Category Deal Dresses 2026',type:'tiered',value:100,market:'AE',currency:'AED',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'CATEGOWK',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-130',name:'Category Deal Denim 2025',type:'percentage',value:5,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:210,totalDiscountGiven:840,revenueGenerated:5040,code:null,autoApply:true,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.AE = ZCD_ZUCCI_PROMOS.AE || [];
ZCD_ZUCCI_PROMOS['AE'].push({id:'ZP-AE-131',name:'New Arrival Discount 2026',type:'fixed',value:200,market:'AE',currency:'AED',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:217,totalDiscountGiven:34720,revenueGenerated:208320,code:'NEWARRYM',autoApply:false,stackable:false,markets:['AE'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-100',name:'Weekend Flash Sale 2025',type:'percentage',value:5,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-101',name:'Loyalty Exclusive 2026',type:'fixed',value:100,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:7,totalDiscountGiven:840,revenueGenerated:5040,code:'LOYALT3S',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-102',name:'Mid-Season Markdown 2025',type:'free_shipping',value:150,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:14,totalDiscountGiven:2520,revenueGenerated:15120,code:'MIDSEA4T',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-103',name:'App Launch Special 2026',type:'bogo',value:200,market:'SA',currency:'SAR',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-104',name:'Bundle Save 2025',type:'tiered',value:50,market:'SA',currency:'SAR',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:244,totalDiscountGiven:14640,revenueGenerated:87840,code:'BUNDLE6V',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-105',name:'Free Shipping Day 2026',type:'percentage',value:30,market:'SA',currency:'SAR',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'FREESH7W',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-106',name:'First Order Bonus 2025',type:'fixed',value:150,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:42,totalDiscountGiven:7560,revenueGenerated:45360,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-107',name:'Clearance Week 2026',type:'free_shipping',value:200,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:49,totalDiscountGiven:11760,revenueGenerated:70560,code:'CLEARA9Y',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-108',name:'VIP Early Access 2025',type:'bogo',value:50,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:56,totalDiscountGiven:3360,revenueGenerated:20160,code:'VIPEARAZ',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-109',name:'Category Deal Dresses 2026',type:'tiered',value:100,market:'SA',currency:'SAR',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-110',name:'Category Deal Denim 2025',type:'percentage',value:25,market:'SA',currency:'SAR',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:310,totalDiscountGiven:9300,revenueGenerated:55800,code:'CATEGOD1',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-111',name:'New Arrival Discount 2026',type:'fixed',value:200,market:'SA',currency:'SAR',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'NEWARRE2',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-112',name:'Limited Time Offer 2025',type:'free_shipping',value:50,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:84,totalDiscountGiven:5040,revenueGenerated:30240,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-113',name:'Double Points Day 2026',type:'bogo',value:100,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:91,totalDiscountGiven:10920,revenueGenerated:65520,code:'DOUBLEG4',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-114',name:'Referral Bonus 2025',type:'tiered',value:150,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:98,totalDiscountGiven:17640,revenueGenerated:105840,code:'REFERRH5',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-115',name:'Birthday Month Deal 2026',type:'percentage',value:20,market:'SA',currency:'SAR',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-116',name:'Back in Stock Sale 2025',type:'fixed',value:50,market:'SA',currency:'SAR',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:376,totalDiscountGiven:22560,revenueGenerated:135360,code:'BACKINJ7',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-117',name:'Festive Special 2026',type:'free_shipping',value:100,market:'SA',currency:'SAR',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'FESTIVK8',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-118',name:'Brand Launch 2025',type:'bogo',value:150,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:126,totalDiscountGiven:22680,revenueGenerated:136080,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-119',name:'End Season Clearance 2026',type:'tiered',value:200,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:133,totalDiscountGiven:31920,revenueGenerated:191520,code:'ENDSEAMA',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-120',name:'Weekend Flash Sale 2025',type:'percentage',value:15,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:140,totalDiscountGiven:2520,revenueGenerated:15120,code:'WEEKENNB',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-121',name:'Loyalty Exclusive 2026',type:'fixed',value:100,market:'SA',currency:'SAR',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-122',name:'Mid-Season Markdown 2025',type:'free_shipping',value:150,market:'SA',currency:'SAR',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:442,totalDiscountGiven:79560,revenueGenerated:477360,code:'MIDSEAPD',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-123',name:'App Launch Special 2026',type:'bogo',value:200,market:'SA',currency:'SAR',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'APPLAUQE',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-124',name:'Bundle Save 2025',type:'tiered',value:50,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:168,totalDiscountGiven:10080,revenueGenerated:60480,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-125',name:'Free Shipping Day 2026',type:'percentage',value:10,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:175,totalDiscountGiven:2100,revenueGenerated:12600,code:'FREESHSG',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-126',name:'First Order Bonus 2025',type:'fixed',value:150,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:182,totalDiscountGiven:32760,revenueGenerated:196560,code:'FIRSTOTH',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-127',name:'Clearance Week 2026',type:'free_shipping',value:200,market:'SA',currency:'SAR',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-128',name:'VIP Early Access 2025',type:'bogo',value:50,market:'SA',currency:'SAR',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:508,totalDiscountGiven:30480,revenueGenerated:182880,code:'VIPEARVJ',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-129',name:'Category Deal Dresses 2026',type:'tiered',value:100,market:'SA',currency:'SAR',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'CATEGOWK',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-130',name:'Category Deal Denim 2025',type:'percentage',value:5,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:210,totalDiscountGiven:1260,revenueGenerated:7560,code:null,autoApply:true,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.SA = ZCD_ZUCCI_PROMOS.SA || [];
ZCD_ZUCCI_PROMOS['SA'].push({id:'ZP-SA-131',name:'New Arrival Discount 2026',type:'fixed',value:200,market:'SA',currency:'SAR',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:217,totalDiscountGiven:52080,revenueGenerated:312480,code:'NEWARRYM',autoApply:false,stackable:false,markets:['SA'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-100',name:'Weekend Flash Sale 2025',type:'percentage',value:5,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-101',name:'Loyalty Exclusive 2026',type:'fixed',value:100,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:7,totalDiscountGiven:1050,revenueGenerated:6300,code:'LOYALT3S',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-102',name:'Mid-Season Markdown 2025',type:'free_shipping',value:150,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:14,totalDiscountGiven:3150,revenueGenerated:18900,code:'MIDSEA4T',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-103',name:'App Launch Special 2026',type:'bogo',value:200,market:'EG',currency:'EGP',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-104',name:'Bundle Save 2025',type:'tiered',value:50,market:'EG',currency:'EGP',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:244,totalDiscountGiven:18300,revenueGenerated:109800,code:'BUNDLE6V',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-105',name:'Free Shipping Day 2026',type:'percentage',value:30,market:'EG',currency:'EGP',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'FREESH7W',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-106',name:'First Order Bonus 2025',type:'fixed',value:150,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:42,totalDiscountGiven:9450,revenueGenerated:56700,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-107',name:'Clearance Week 2026',type:'free_shipping',value:200,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:49,totalDiscountGiven:14700,revenueGenerated:88200,code:'CLEARA9Y',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-108',name:'VIP Early Access 2025',type:'bogo',value:50,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:56,totalDiscountGiven:4200,revenueGenerated:25200,code:'VIPEARAZ',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-109',name:'Category Deal Dresses 2026',type:'tiered',value:100,market:'EG',currency:'EGP',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-110',name:'Category Deal Denim 2025',type:'percentage',value:25,market:'EG',currency:'EGP',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:310,totalDiscountGiven:11625,revenueGenerated:69750,code:'CATEGOD1',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-111',name:'New Arrival Discount 2026',type:'fixed',value:200,market:'EG',currency:'EGP',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'NEWARRE2',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-112',name:'Limited Time Offer 2025',type:'free_shipping',value:50,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:84,totalDiscountGiven:6300,revenueGenerated:37800,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-113',name:'Double Points Day 2026',type:'bogo',value:100,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:91,totalDiscountGiven:13650,revenueGenerated:81900,code:'DOUBLEG4',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-114',name:'Referral Bonus 2025',type:'tiered',value:150,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:98,totalDiscountGiven:22050,revenueGenerated:132300,code:'REFERRH5',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-115',name:'Birthday Month Deal 2026',type:'percentage',value:20,market:'EG',currency:'EGP',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-116',name:'Back in Stock Sale 2025',type:'fixed',value:50,market:'EG',currency:'EGP',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:376,totalDiscountGiven:28200,revenueGenerated:169200,code:'BACKINJ7',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-117',name:'Festive Special 2026',type:'free_shipping',value:100,market:'EG',currency:'EGP',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'FESTIVK8',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-118',name:'Brand Launch 2025',type:'bogo',value:150,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:126,totalDiscountGiven:28350,revenueGenerated:170100,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-119',name:'End Season Clearance 2026',type:'tiered',value:200,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:133,totalDiscountGiven:39900,revenueGenerated:239400,code:'ENDSEAMA',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-120',name:'Weekend Flash Sale 2025',type:'percentage',value:15,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:140,totalDiscountGiven:3150,revenueGenerated:18900,code:'WEEKENNB',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-121',name:'Loyalty Exclusive 2026',type:'fixed',value:100,market:'EG',currency:'EGP',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-122',name:'Mid-Season Markdown 2025',type:'free_shipping',value:150,market:'EG',currency:'EGP',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:442,totalDiscountGiven:99450,revenueGenerated:596700,code:'MIDSEAPD',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-123',name:'App Launch Special 2026',type:'bogo',value:200,market:'EG',currency:'EGP',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'APPLAUQE',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-124',name:'Bundle Save 2025',type:'tiered',value:50,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:168,totalDiscountGiven:12600,revenueGenerated:75600,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-125',name:'Free Shipping Day 2026',type:'percentage',value:10,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:175,totalDiscountGiven:2625,revenueGenerated:15750,code:'FREESHSG',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-126',name:'First Order Bonus 2025',type:'fixed',value:150,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:182,totalDiscountGiven:40950,revenueGenerated:245700,code:'FIRSTOTH',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-127',name:'Clearance Week 2026',type:'free_shipping',value:200,market:'EG',currency:'EGP',origin:'zucci_platform',status:'scheduled',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:150,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-128',name:'VIP Early Access 2025',type:'bogo',value:50,market:'EG',currency:'EGP',origin:'zucci_platform',status:'expired',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:200,usageCount:508,totalDiscountGiven:38100,revenueGenerated:228600,code:'VIPEARVJ',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-129',name:'Category Deal Dresses 2026',type:'tiered',value:100,market:'EG',currency:'EGP',origin:'zucci_platform',status:'paused',fundedBy:'split',zucciFundPct:50,vendorFundPct:50,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:300,usageCount:0,totalDiscountGiven:0,revenueGenerated:0,code:'CATEGOWK',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-130',name:'Category Deal Denim 2025',type:'percentage',value:5,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'zucci_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:0,usageCount:210,totalDiscountGiven:1575,revenueGenerated:9450,code:null,autoApply:true,stackable:false,markets:['EG'],notes:''});
ZCD_ZUCCI_PROMOS.EG = ZCD_ZUCCI_PROMOS.EG || [];
ZCD_ZUCCI_PROMOS['EG'].push({id:'ZP-EG-131',name:'New Arrival Discount 2026',type:'fixed',value:200,market:'EG',currency:'EGP',origin:'zucci_platform',status:'active',fundedBy:'vendor_100',zucciFundPct:100,vendorFundPct:0,startDate:'Jun 1, 2025',endDate:'Dec 31, 2025',appliesTo:'all',brands:[],minOrderValue:100,usageCount:217,totalDiscountGiven:65100,revenueGenerated:390600,code:'NEWARRYM',autoApply:false,stackable:false,markets:['EG'],notes:''});
ZCD_VENDOR_PROMOS.push({id:'VP-100',name:'Weekend Flash Sale VP',type:'percentage',value:10,market:'AE',currency:'AED',vendor:'24K Fashion House',brand:'Le Maillot',origin:'vendor_submitted',status:'pending_approval',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:0,appliesTo:'brand',categories:[],brands:['Le Maillot'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:null,approvedDate:null,code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-101',name:'Loyalty Exclusive VP',type:'percentage',value:15,market:'SA',currency:'SAR',vendor:'24K Fashion House',brand:'Burgandy',origin:'vendor_submitted',status:'approved',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:100,appliesTo:'brand',categories:[],brands:['Burgandy'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:"Sara Medhat",approvedDate:"Jun 2, 2025",code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-102',name:'Mid-Season Markdown VP',type:'percentage',value:20,market:'EG',currency:'EGP',vendor:'24K Fashion House',brand:'7 Wonders',origin:'vendor_submitted',status:'rejected',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:200,appliesTo:'brand',categories:[],brands:['7 Wonders'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'Exceeds market cap.',approvedBy:null,approvedDate:null,code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-103',name:'App Launch Special VP',type:'percentage',value:25,market:'AE',currency:'AED',vendor:'24K Fashion House',brand:'Aurora Fashion',origin:'vendor_suggested',status:'suggested',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:0,appliesTo:'brand',categories:[],brands:['Aurora Fashion'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:null,approvedDate:null,code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-104',name:'Bundle Save VP',type:'percentage',value:10,market:'SA',currency:'SAR',vendor:'24K Fashion House',brand:'Almaz Couture',origin:'vendor_submitted',status:'approved',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:100,appliesTo:'brand',categories:[],brands:['Almaz Couture'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:"Sara Medhat",approvedDate:"Jun 2, 2025",code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-105',name:'Free Shipping Day VP',type:'percentage',value:15,market:'AE',currency:'AED',vendor:'24K Fashion House',brand:'Le Maillot',origin:'vendor_submitted',status:'pending_approval',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:200,appliesTo:'brand',categories:[],brands:['Le Maillot'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:null,approvedDate:null,code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-106',name:'First Order Bonus VP',type:'percentage',value:20,market:'SA',currency:'SAR',vendor:'24K Fashion House',brand:'Burgandy',origin:'vendor_submitted',status:'approved',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:0,appliesTo:'brand',categories:[],brands:['Burgandy'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:"Sara Medhat",approvedDate:"Jun 2, 2025",code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-107',name:'Clearance Week VP',type:'percentage',value:25,market:'EG',currency:'EGP',vendor:'24K Fashion House',brand:'7 Wonders',origin:'vendor_submitted',status:'rejected',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:100,appliesTo:'brand',categories:[],brands:['7 Wonders'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'Exceeds market cap.',approvedBy:null,approvedDate:null,code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-108',name:'VIP Early Access VP',type:'percentage',value:10,market:'AE',currency:'AED',vendor:'24K Fashion House',brand:'Aurora Fashion',origin:'vendor_suggested',status:'suggested',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:200,appliesTo:'brand',categories:[],brands:['Aurora Fashion'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:null,approvedDate:null,code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-109',name:'Category Deal Dresses VP',type:'percentage',value:15,market:'SA',currency:'SAR',vendor:'24K Fashion House',brand:'Almaz Couture',origin:'vendor_submitted',status:'approved',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:0,appliesTo:'brand',categories:[],brands:['Almaz Couture'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:"Sara Medhat",approvedDate:"Jun 2, 2025",code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-110',name:'Category Deal Denim VP',type:'percentage',value:20,market:'AE',currency:'AED',vendor:'24K Fashion House',brand:'Le Maillot',origin:'vendor_submitted',status:'pending_approval',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:100,appliesTo:'brand',categories:[],brands:['Le Maillot'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:null,approvedDate:null,code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-111',name:'New Arrival Discount VP',type:'percentage',value:25,market:'SA',currency:'SAR',vendor:'24K Fashion House',brand:'Burgandy',origin:'vendor_submitted',status:'approved',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:200,appliesTo:'brand',categories:[],brands:['Burgandy'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:"Sara Medhat",approvedDate:"Jun 2, 2025",code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-112',name:'Limited Time Offer VP',type:'percentage',value:10,market:'EG',currency:'EGP',vendor:'24K Fashion House',brand:'7 Wonders',origin:'vendor_submitted',status:'rejected',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:0,appliesTo:'brand',categories:[],brands:['7 Wonders'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'Exceeds market cap.',approvedBy:null,approvedDate:null,code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-113',name:'Double Points Day VP',type:'percentage',value:15,market:'AE',currency:'AED',vendor:'24K Fashion House',brand:'Aurora Fashion',origin:'vendor_suggested',status:'suggested',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:100,appliesTo:'brand',categories:[],brands:['Aurora Fashion'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:null,approvedDate:null,code:null,autoApply:true,stackable:false,conflictsWith:[]});
ZCD_VENDOR_PROMOS.push({id:'VP-114',name:'Referral Bonus VP',type:'percentage',value:20,market:'SA',currency:'SAR',vendor:'24K Fashion House',brand:'Almaz Couture',origin:'vendor_submitted',status:'approved',fundedBy:'vendor_100',zucciFundPct:0,vendorFundPct:100,startDate:'Jul 1, 2025',endDate:'Jul 31, 2025',minOrderValue:200,appliesTo:'brand',categories:[],brands:['Almaz Couture'],submittedDate:'Jun 1, 2025',submittedBy:'Ahmed Mohamed',approvalNote:'',approvedBy:"Sara Medhat",approvedDate:"Jun 2, 2025",code:null,autoApply:true,stackable:false,conflictsWith:[]});

const ZCD_ANALYTICS = {
  AE:{totalPromos:28,activePromos:12,scheduledPromos:4,totalCodesIssued:18,totalCodesUsed:14,
    totalDiscountGiven:{value:284200,currency:'AED'},totalRevenueFromPromos:{value:1420000,currency:'AED'},avgDiscount:8.4,
    topPromos:[
      {id:'ZP-AE-001',name:'Summer Sale 2025',usageCount:1284,discountGiven:42800,revenue:287600,conversionRate:6.8},
      {id:'ZP-AE-002',name:'First Order Welcome',usageCount:441,discountGiven:18200,revenue:163800,conversionRate:12.4},
      {id:'ZP-AE-004',name:'Gold Tier Exclusive',usageCount:228,discountGiven:9140,revenue:76800,conversionRate:18.2},
    ],
    monthlyBreakdown:[
      {month:'Jan 2025',discountGiven:18400,revenue:92000,promoOrders:284},
      {month:'Feb 2025',discountGiven:21200,revenue:106000,promoOrders:328},
      {month:'Mar 2025',discountGiven:44100,revenue:220500,promoOrders:681},
      {month:'Apr 2025',discountGiven:28400,revenue:142000,promoOrders:441},
      {month:'May 2025',discountGiven:32800,revenue:164000,promoOrders:508},
      {month:'Jun 2025',discountGiven:48200,revenue:241000,promoOrders:748},
    ],
  },
  SA:{totalPromos:18,activePromos:8,scheduledPromos:3,totalCodesIssued:10,totalCodesUsed:8,
    totalDiscountGiven:{value:142000,currency:'SAR'},totalRevenueFromPromos:{value:710000,currency:'SAR'},avgDiscount:7.1,
    topPromos:[
      {id:'ZP-SA-001',name:'White Friday 2024',usageCount:2841,discountGiven:284100,revenue:1136400,conversionRate:22.4},
    ],
    monthlyBreakdown:[
      {month:'Jan 2025',discountGiven:8400,revenue:42000,promoOrders:88},
      {month:'Feb 2025',discountGiven:9200,revenue:46000,promoOrders:96},
      {month:'Mar 2025',discountGiven:14100,revenue:70500,promoOrders:148},
      {month:'Apr 2025',discountGiven:11800,revenue:59000,promoOrders:124},
      {month:'May 2025',discountGiven:13400,revenue:67000,promoOrders:140},
      {month:'Jun 2025',discountGiven:18200,revenue:91000,promoOrders:192},
    ],
  },
  EG:{totalPromos:22,activePromos:10,scheduledPromos:2,totalCodesIssued:14,totalCodesUsed:11,
    totalDiscountGiven:{value:6420000,currency:'EGP'},totalRevenueFromPromos:{value:32100000,currency:'EGP'},avgDiscount:9.2,
    topPromos:[
      {id:'ZP-EG-001',name:'Ramadan 2025',usageCount:8441,discountGiven:4220500,revenue:16882000,conversionRate:28.4},
      {id:'ZP-EG-002',name:'Egypt First Order',usageCount:1284,discountGiven:128400,revenue:769200,conversionRate:14.2},
    ],
    monthlyBreakdown:[
      {month:'Jan 2025',discountGiven:284000,revenue:1420000,promoOrders:881},
      {month:'Feb 2025',discountGiven:342000,revenue:1710000,promoOrders:1060},
      {month:'Mar 2025',discountGiven:4421000,revenue:22105000,promoOrders:8841},
      {month:'Apr 2025',discountGiven:448000,revenue:2240000,promoOrders:1388},
      {month:'May 2025',discountGiven:481000,revenue:2405000,promoOrders:1490},
      {month:'Jun 2025',discountGiven:444000,revenue:2220000,promoOrders:1375},
    ],
  },
};
// ── Influencer / UGC Profiles ─────────────────────────────
const ZCD_INFLUENCERS = [
  { id:'INF-001', name:'Sara Al-Masri', handle:'@saramasri', country:'EG', city:'Cairo',
    tier:'micro', status:'active',
    contact:{ email:'sara@saramasri.com', whatsapp:'+2 0100 123 4567', preferredContact:'whatsapp' },
    bio:'Fashion & lifestyle content creator based in Cairo. Known for modest fashion and everyday looks.',
    avatar:'https://i.pravatar.cc/80?img=47',
    networks:[
      { platform:'instagram', handle:'@saramasri',  followers:284000, engagementRate:4.8, verified:true,  url:'https://instagram.com/saramasri' },
      { platform:'tiktok',    handle:'@saramasri',  followers:441000, engagementRate:6.2, verified:false, url:'https://tiktok.com/@saramasri' },
      { platform:'youtube',   handle:'Sara Masri',  followers:28000,  engagementRate:3.1, verified:false, url:'https://youtube.com/@saramasri' },
    ],
    markets:['EG'],
    code:'SARA15', codeDiscount:15, codeType:'percentage',
    referralLinks:{ EG:'https://zucci.com/eg?ref=sara15', AE:'https://zucci.com/ae?ref=sara15' },
    agreement:{ commissionPct:8, fixedFeePerPost:500, currency:'EGP', contractUploaded:true, contractRef:'INF-EG-2025-001', signedDate:'Jan 15, 2025', expiryDate:'Jan 14, 2026' },
    performance:{ ordersGenerated:441, gmv:220500, commissionEarned:17640, avgOrderValue:500, conversionRate:3.2, topProducts:['Le Maillot Black Swimsuit','Burgandy Evening Dress'] },
    posts:[
      { platform:'instagram', url:'https://instagram.com/p/abc123', date:'Jun 1, 2025', views:184000, clicks:2840, ordersConverted:88, type:'story' },
      { platform:'tiktok',    url:'https://tiktok.com/@saramasri/video/1', date:'May 28, 2025', views:441000, clicks:6200, ordersConverted:142, type:'video' },
    ],
    payouts:[ { id:'INF-PAY-001', amount:8820, currency:'EGP', period:'May 2025', status:'paid', paidDate:'Jun 5, 2025' }, { id:'INF-PAY-002', amount:8820, currency:'EGP', period:'Jun 2025', status:'pending', paidDate:null } ],
  },
  { id:'INF-002', name:'Khalid Al-Rashidi', handle:'@khalidstyle', country:'SA', city:'Riyadh',
    tier:'macro', status:'active',
    contact:{ email:'khalid@khalidstyle.com', whatsapp:'+966 50 123 4567', preferredContact:'email' },
    bio:'Saudi menswear and streetwear influencer. Partnerships with GCC fashion brands.',
    avatar:'https://i.pravatar.cc/80?img=12',
    networks:[
      { platform:'instagram', handle:'@khalidstyle', followers:841000, engagementRate:3.2, verified:true,  url:'https://instagram.com/khalidstyle' },
      { platform:'snapchat',  handle:'khalidstyle',  followers:284000, engagementRate:5.8, verified:false, url:'https://snapchat.com/add/khalidstyle' },
      { platform:'tiktok',    handle:'@khalidstyle', followers:228000, engagementRate:4.1, verified:false, url:'https://tiktok.com/@khalidstyle' },
    ],
    markets:['SA','AE'],
    code:'KHALID10', codeDiscount:10, codeType:'percentage',
    referralLinks:{ SA:'https://zucci.com/sa?ref=khalid10', AE:'https://zucci.com/ae?ref=khalid10' },
    agreement:{ commissionPct:7, fixedFeePerPost:2000, currency:'SAR', contractUploaded:true, contractRef:'INF-SA-2025-001', signedDate:'Feb 1, 2025', expiryDate:'Jan 31, 2026' },
    performance:{ ordersGenerated:328, gmv:148000, commissionEarned:10360, avgOrderValue:451, conversionRate:2.8, topProducts:['7 Wonders Formal Blazer','7 Wonders Trousers'] },
    posts:[
      { platform:'instagram', url:'https://instagram.com/p/xyz456', date:'Jun 2, 2025', views:284000, clicks:3200, ordersConverted:64, type:'reel' },
      { platform:'snapchat',  url:'https://snapchat.com/s/abc', date:'May 30, 2025', views:184000, clicks:2800, ordersConverted:56, type:'story' },
    ],
    payouts:[ { id:'INF-PAY-003', amount:5180, currency:'SAR', period:'May 2025', status:'paid', paidDate:'Jun 5, 2025' }, { id:'INF-PAY-004', amount:5180, currency:'SAR', period:'Jun 2025', status:'pending', paidDate:null } ],
  },
  { id:'INF-003', name:'Nour El-Sayed', handle:'@nour.style', country:'AE', city:'Dubai',
    tier:'nano', status:'active',
    contact:{ email:'nour@nourstyle.ae', whatsapp:'+971 50 987 6543', preferredContact:'whatsapp' },
    bio:'Dubai-based fashion micro-influencer. Focuses on modest luxury and occasion wear.',
    avatar:'https://i.pravatar.cc/80?img=23',
    networks:[
      { platform:'instagram', handle:'@nour.style',  followers:28400, engagementRate:8.4, verified:false, url:'https://instagram.com/nour.style' },
      { platform:'tiktok',    handle:'@nourstyle_ae',followers:41000, engagementRate:7.2, verified:false, url:'https://tiktok.com/@nourstyle_ae' },
    ],
    markets:['AE'],
    code:'NOUR20', codeDiscount:20, codeType:'percentage',
    referralLinks:{ AE:'https://zucci.com/ae?ref=nour20' },
    agreement:{ commissionPct:10, fixedFeePerPost:500, currency:'AED', contractUploaded:true, contractRef:'INF-AE-2025-001', signedDate:'Mar 1, 2025', expiryDate:'Feb 28, 2026' },
    performance:{ ordersGenerated:88, gmv:35200, commissionEarned:3520, avgOrderValue:400, conversionRate:4.8, topProducts:['Almaz Couture Evening Dress'] },
    posts:[
      { platform:'instagram', url:'https://instagram.com/p/nour1', date:'Jun 3, 2025', views:42000, clicks:1840, ordersConverted:28, type:'post' },
    ],
    payouts:[ { id:'INF-PAY-005', amount:1760, currency:'AED', period:'May 2025', status:'paid', paidDate:'Jun 5, 2025' }, { id:'INF-PAY-006', amount:1760, currency:'AED', period:'Jun 2025', status:'pending', paidDate:null } ],
  },
  { id:'INF-004', name:'Layla Boutique', handle:'@laylaboutique', country:'AE', city:'Abu Dhabi',
    tier:'mega', status:'paused',
    contact:{ email:'collab@laylaboutique.com', whatsapp:'+971 55 111 2233', preferredContact:'email' },
    bio:'UAE mega influencer — 1M+ followers. Luxury and high-end fashion focus.',
    avatar:'https://i.pravatar.cc/80?img=35',
    networks:[
      { platform:'instagram', handle:'@laylaboutique', followers:1240000, engagementRate:2.1, verified:true, url:'https://instagram.com/laylaboutique' },
      { platform:'youtube',   handle:'Layla Boutique', followers:284000, engagementRate:3.4, verified:true, url:'https://youtube.com/@laylaboutique' },
    ],
    markets:['AE','SA'],
    code:'LAYLA12', codeDiscount:12, codeType:'percentage',
    referralLinks:{ AE:'https://zucci.com/ae?ref=layla12', SA:'https://zucci.com/sa?ref=layla12' },
    agreement:{ commissionPct:5, fixedFeePerPost:8000, currency:'AED', contractUploaded:false, contractRef:null, signedDate:null, expiryDate:null },
    performance:{ ordersGenerated:0, gmv:0, commissionEarned:0, avgOrderValue:0, conversionRate:0, topProducts:[] },
    posts:[],
    payouts:[],
  },
  { id:'INF-005', name:'Ahmed Tarek', handle:'@ahmedtarek_eg', country:'EG', city:'Alexandria',
    tier:'micro', status:'pending_contract',
    contact:{ email:'ahmed@ahmedtarek.com', whatsapp:'+2 0111 555 8888', preferredContact:'whatsapp' },
    bio:'Egypt-based streetwear and denim creator. Youth fashion focus.',
    avatar:'https://i.pravatar.cc/80?img=8',
    networks:[
      { platform:'instagram', handle:'@ahmedtarek_eg', followers:84000, engagementRate:6.8, verified:false, url:'https://instagram.com/ahmedtarek_eg' },
      { platform:'tiktok',    handle:'@ahmedtarek',    followers:228000, engagementRate:9.2, verified:false, url:'https://tiktok.com/@ahmedtarek' },
    ],
    markets:['EG'],
    code:'AHMED15', codeDiscount:15, codeType:'percentage',
    referralLinks:{ EG:'https://zucci.com/eg?ref=ahmed15' },
    agreement:{ commissionPct:8, fixedFeePerPost:300, currency:'EGP', contractUploaded:false, contractRef:null, signedDate:null, expiryDate:null },
    performance:{ ordersGenerated:0, gmv:0, commissionEarned:0, avgOrderValue:0, conversionRate:0, topProducts:[] },
    posts:[],
    payouts:[],
  },
];

// ── Enrich influencers with codes/links tracking ──────────
if (window.ZCD_INFLUENCERS) {
  window.ZCD_INFLUENCERS[0].codes = [
    { id:'C1', code:'SARA15', type:'discount_code', discount:15, market:'EG', currency:'EGP',
      clicks:8441, orders:441, revenue:220500, newCustomers:284, existingCustomers:157,
      conversionRate:5.2, createdDate:'Jan 15, 2025', expiryDate:'Jan 14, 2026', status:'active' },
    { id:'C2', code:'SARA20', type:'discount_code', discount:20, market:'EG', currency:'EGP',
      clicks:2841, orders:88, revenue:44000, newCustomers:72, existingCustomers:16,
      conversionRate:3.1, createdDate:'Mar 1, 2025', expiryDate:'Mar 31, 2025', status:'expired' },
  ];
  window.ZCD_INFLUENCERS[0].referralLinks = [
    { id:'L1', market:'EG', url:'https://zucci.com/eg?ref=sara15', clicks:11282, orders:529,
      revenue:264500, newCustomers:356, existingCustomers:173, conversionRate:4.7, createdDate:'Jan 15, 2025' },
  ];
  window.ZCD_INFLUENCERS[1].codes = [
    { id:'C3', code:'KHALID10', type:'discount_code', discount:10, market:'SA', currency:'SAR',
      clicks:4841, orders:228, revenue:102600, newCustomers:184, existingCustomers:44,
      conversionRate:4.7, createdDate:'Feb 1, 2025', expiryDate:'Jan 31, 2026', status:'active' },
    { id:'C4', code:'KHALID10AE', type:'discount_code', discount:10, market:'AE', currency:'AED',
      clicks:1284, orders:100, revenue:45000, newCustomers:78, existingCustomers:22,
      conversionRate:7.8, createdDate:'Feb 1, 2025', expiryDate:'Jan 31, 2026', status:'active' },
  ];
  window.ZCD_INFLUENCERS[1].referralLinks = [
    { id:'L2', market:'SA', url:'https://zucci.com/sa?ref=khalid10', clicks:6125, orders:328,
      revenue:147600, newCustomers:262, existingCustomers:66, conversionRate:5.4, createdDate:'Feb 1, 2025' },
    { id:'L3', market:'AE', url:'https://zucci.com/ae?ref=khalid10', clicks:2568, orders:200,
      revenue:90000, newCustomers:156, existingCustomers:44, conversionRate:7.8, createdDate:'Feb 1, 2025' },
  ];
  window.ZCD_INFLUENCERS[2].codes = [
    { id:'C5', code:'NOUR20', type:'discount_code', discount:20, market:'AE', currency:'AED',
      clicks:1840, orders:88, revenue:35200, newCustomers:71, existingCustomers:17,
      conversionRate:4.8, createdDate:'Mar 1, 2025', expiryDate:'Feb 28, 2026', status:'active' },
  ];
  window.ZCD_INFLUENCERS[2].referralLinks = [
    { id:'L4', market:'AE', url:'https://zucci.com/ae?ref=nour20', clicks:2210, orders:106,
      revenue:42400, newCustomers:85, existingCustomers:21, conversionRate:4.8, createdDate:'Mar 1, 2025' },
  ];
}

// ── Enrich influencer profiles with full data ──────────────
setTimeout(() => {
  if (!window.ZCD_INFLUENCERS) return;

  // Enrich Sara Al-Masri
  Object.assign(window.ZCD_INFLUENCERS[0], {
    firstName:'Sara', middleName:'Ahmed', lastName:'Al-Masri',
    fullName: 'Sara Ahmed Fawzy Al-Masri',
    dob: 'Mar 14, 1995',
    nationality: 'Egyptian',
    gender: 'Female',
    languages: ['Arabic','English'],
    contentCategories: ['Fashion','Lifestyle','Beauty','Modest Fashion'],
    businessEntity: 'individual',
    companyName: null,
    tradeLicenseNo: null,
    internalTags: ['Top Performer','Ramadan Ready','EG Market'],
    internalNotes: 'Highly responsive, delivers on-time. Works best with modest fashion brands. Prefers Whatsapp for communication.',
    representation: {
      hasManager: true,
      managerName: 'Mona Galal',
      managerEmail: 'mona@talenteg.com',
      managerPhone: '+20 100 555 1234',
      agencyName: 'Talent Egypt',
      agencyCommissionPct: 15,
    },
    exclusivity: { hasExclusivity: false, competingBrands: [], notes: 'Not exclusive — can work with similar brands.' },
    audienceDemographics: { primaryCountry: 'EG', ageGroup: '18–34', genderSplit: '82% Female', topCities: ['Cairo','Alexandria','Giza'] },
    kyc: {
      documents: [
        { type: 'National ID', status: 'approved', uploadDate: 'Jan 10, 2025', expiryDate: 'Jan 10, 2030', ref: 'KYC-INF-001-NID' },
        { type: 'Tax ID (TIN)', status: 'approved', uploadDate: 'Jan 10, 2025', expiryDate: null, ref: 'KYC-INF-001-TAX' },
        { type: 'Proof of Address', status: 'approved', uploadDate: 'Jan 12, 2025', expiryDate: null, ref: 'KYC-INF-001-POA' },
      ],
      kycStatus: 'approved',
      kycApprovedBy: 'Sara Medhat',
      kycApprovedDate: 'Jan 15, 2025',
    },
    banking: [
      { id: 'B1', type: 'Bank Transfer', bankName: 'CIB Egypt', accountName: 'Sara Ahmed Al-Masri', iban: 'EG380019000100000012345678', swift: 'CIBEEGCX', currency: 'EGP', markets: ['EG'], isDefault: true, verified: true, bankLetterUploaded: true },
    ],
    contactMethods: [
      { type: 'email', value: 'sara@saramasri.com', preferred: false },
      { type: 'whatsapp', value: '+2 0100 123 4567', preferred: true },
      { type: 'instagram_dm', value: '@saramasri', preferred: false },
    ],
  });

  // Enrich Khalid
  Object.assign(window.ZCD_INFLUENCERS[1], {
    firstName:'Khalid', middleName:'Nasser', lastName:'Al-Rashidi',
    fullName: 'Khalid Nasser Al-Rashidi',
    dob: 'Aug 22, 1991',
    nationality: 'Saudi Arabian',
    gender: 'Male',
    languages: ['Arabic','English'],
    contentCategories: ['Menswear','Streetwear','Sneakers','Lifestyle'],
    businessEntity: 'company',
    companyName: 'Khalid Style LLC',
    tradeLicenseNo: 'SA-TL-2023-8841',
    internalTags: ['GCC Market','Menswear','High Value'],
    internalNotes: 'Managed by agency. All comms go through manager. Requires 7-day content approval window.',
    representation: {
      hasManager: true,
      managerName: 'Tariq Al-Harbi',
      managerEmail: 'tariq@khalidstyle.com',
      managerPhone: '+966 55 999 8877',
      agencyName: null,
      agencyCommissionPct: 0,
    },
    exclusivity: { hasExclusivity: true, competingBrands: ['Brand X','Competitor Y'], notes: 'Exclusive for menswear in KSA — cannot promote competing menswear brands.' },
    audienceDemographics: { primaryCountry: 'SA', ageGroup: '18–34', genderSplit: '78% Male', topCities: ['Riyadh','Jeddah','Dammam'] },
    kyc: {
      documents: [
        { type: 'Iqama / Residency ID', status: 'approved', uploadDate: 'Jan 25, 2025', expiryDate: 'Jan 24, 2027', ref: 'KYC-INF-002-ID' },
        { type: 'Commercial Registration', status: 'approved', uploadDate: 'Jan 25, 2025', expiryDate: 'Dec 31, 2026', ref: 'KYC-INF-002-CR' },
        { type: 'ZATCA Tax Registration', status: 'approved', uploadDate: 'Jan 26, 2025', expiryDate: null, ref: 'KYC-INF-002-ZATCA' },
      ],
      kycStatus: 'approved',
      kycApprovedBy: 'Sara Medhat',
      kycApprovedDate: 'Feb 1, 2025',
    },
    banking: [
      { id: 'B2', type: 'Bank Transfer', bankName: 'Al Rajhi Bank', accountName: 'Khalid Style LLC', iban: 'SA4420000001234567891234', swift: 'RJHISARI', currency: 'SAR', markets: ['SA'], isDefault: true, verified: true, bankLetterUploaded: true },
      { id: 'B3', type: 'Bank Transfer', bankName: 'ENBD UAE', accountName: 'Khalid Style LLC', iban: 'AE070331234567890123456', swift: 'EBILAEAD', currency: 'AED', markets: ['AE'], isDefault: false, verified: true, bankLetterUploaded: true },
    ],
    contactMethods: [
      { type: 'email', value: 'khalid@khalidstyle.com', preferred: false },
      { type: 'email', value: 'tariq@khalidstyle.com', preferred: true, label: 'Manager (preferred)' },
      { type: 'whatsapp', value: '+966 55 999 8877', preferred: true, label: 'Manager WhatsApp' },
    ],
  });
}, 300);

// ── Enrich influencers with contracts + enriched networks/posts ──
setTimeout(() => {
  if (!window.ZCD_INFLUENCERS) return;

  // Contracts for Sara
  window.ZCD_INFLUENCERS[0].contracts = [
    { id:'CNT-INF-001', type:'Content Agreement', status:'active',
      startDate:'Jan 15, 2025', endDate:'Jan 14, 2026',
      postsPerMonth:4, contentTypes:['Instagram Story','TikTok Video','Instagram Reel'],
      markets:['EG'], commission:8, fixedFee:500, currency:'EGP',
      requiresApproval:true, approvalWindowDays:2,
      ftcDisclosure:true, exclusivity:false,
      contractUploaded:true, ref:'CNT-INF-EG-2025-001',
      signedDate:'Jan 15, 2025', signedBy:'Sara Al-Masri & Zucci Legal' },
    { id:'CNT-INF-002', type:'Ramadan Campaign', status:'completed',
      startDate:'Mar 1, 2025', endDate:'Mar 31, 2025',
      postsPerMonth:8, contentTypes:['TikTok Video','Instagram Story'],
      markets:['EG'], commission:10, fixedFee:2000, currency:'EGP',
      requiresApproval:false, approvalWindowDays:1,
      ftcDisclosure:true, exclusivity:false,
      contractUploaded:true, ref:'CNT-INF-EG-2025-RAM',
      signedDate:'Feb 20, 2025', signedBy:'Sara Al-Masri & Zucci Legal' },
  ];

  // Enrich codes with expiry
  if (window.ZCD_INFLUENCERS[0].codes) {
    window.ZCD_INFLUENCERS[0].codes[0].expiryDate = 'Jan 14, 2026';
    window.ZCD_INFLUENCERS[0].codes[1].expiryDate = 'Mar 31, 2025';
    window.ZCD_INFLUENCERS[0].referralLinks[0].expiryDate = 'Jan 14, 2026';
  }

  // Enrich Sara networks
  window.ZCD_INFLUENCERS[0].networks = [
    { platform:'instagram', handle:'@saramasri', followers:284000, engagementRate:4.8, verified:true, url:'https://instagram.com/saramasri',
      avgViews:{ reel:148000, story:62000, post:38000 }, postFrequency:'5x/week', followerGrowthRate:'+2.4%/mo',
      contentPillars:['Modest Fashion','Daily Outfits','Brand Reviews'], topHashtags:['#modeststyle','#egyptfashion','#ootd'] },
    { platform:'tiktok', handle:'@saramasri', followers:441000, engagementRate:6.2, verified:false, url:'https://tiktok.com/@saramasri',
      avgViews:{ video:284000 }, postFrequency:'3x/week', followerGrowthRate:'+4.1%/mo',
      contentPillars:['Fashion Hauls','Outfit Ideas','Day in My Life'], topHashtags:['#fashion','#cairo','#modestfashion'] },
    { platform:'youtube', handle:'Sara Masri', followers:28000, engagementRate:3.1, verified:false, url:'https://youtube.com/@saramasri',
      avgViews:{ video:14000 }, postFrequency:'1x/week', followerGrowthRate:'+0.8%/mo',
      contentPillars:['Monthly Hauls','Styling Tips'], topHashtags:[] },
  ];

  // Enrich Sara posts
  window.ZCD_INFLUENCERS[0].posts = [
    { platform:'instagram', url:'https://instagram.com/p/abc123', date:'Jun 1, 2025',
      views:184000, clicks:2840, ordersConverted:88, type:'reel',
      caption:'Summer 2025 picks from @zucci_eg — use code SARA15 for 15% off!',
      hashtags:['#zucci','#summerfashion','#modestwear'], likes:8441, comments:284,
      contractRef:'CNT-INF-001', boosted:false, approved:true },
    { platform:'tiktok', url:'https://tiktok.com/@saramasri/video/1', date:'May 28, 2025',
      views:441000, clicks:6200, ordersConverted:142, type:'video',
      caption:'اشتريت كل ده من zucci! 😍 كود SARA15 لخصم 15%',
      hashtags:['#zucci','#مصر','#أزياء'], likes:28400, comments:1284,
      contractRef:'CNT-INF-001', boosted:true, approved:true },
    { platform:'instagram', url:'https://instagram.com/p/xyz789', date:'May 20, 2025',
      views:96000, clicks:1420, ordersConverted:41, type:'story',
      caption:'Swipe up for my Zucci picks!', hashtags:[], likes:0, comments:0,
      contractRef:'CNT-INF-001', boosted:false, approved:true },
  ];
}, 400);

export { DISCOUNT_TYPES, MARKET_TZ, MARKET_CUR, ZCD_ZUCCI_PROMOS, ZCD_VENDOR_PROMOS, ZCD_PAYMENT_DEALS, ZCD_CAMPAIGNS, ZCD_RULES, ZCD_GIFT_CARDS, ZCD_STORE_CREDITS, ZCD_TARGETED_RULES, ZCD_AUTO_RULES, ZCD_ANALYTICS, ZCD_INFLUENCERS };
