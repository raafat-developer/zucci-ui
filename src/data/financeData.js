// zucci-finance-data.jsx — Financial Transactions module data.

// ── P&L Summary ───────────────────────────────────────────
const ZCF_PL = {
  period: 'Jun 2025',
  markets: [
    { code:'AE', name:'UAE',   currency:'AED', fx:1,
      gmv:487320,    commissionIncome:58478, platformFees:12200, subscriptionIncome:8490,
      refunds:14220, cancellationFees:2100,  gatewayFees:9746,   logisticsCost:18440,
      chargebacks:1200, taxCollected:24366,  taxRemitted:24366,
      netRevenue:69456, margin:14.2 },
    { code:'SA', name:'KSA',   currency:'SAR', fx:1.02,
      gmv:218900,    commissionIncome:24079, platformFees:5400,  subscriptionIncome:3600,
      refunds:6100,  cancellationFees:880,   gatewayFees:4378,   logisticsCost:8200,
      chargebacks:440, taxCollected:32835,   taxRemitted:32835,
      netRevenue:15041, margin:6.9 },
    { code:'EG', name:'Egypt', currency:'EGP', fx:49.2,
      gmv:9840000,   commissionIncome:1180800, platformFees:220000, subscriptionIncome:148000,
      refunds:294000, cancellationFees:44000,  gatewayFees:196800,  logisticsCost:392000,
      chargebacks:18000, taxCollected:1377600,  taxRemitted:1377600,
      netRevenue:712000, margin:7.2 },
  ],
  consolidated: {
    totalGmvAed: 728494, totalNetRevenueAed: 98941,
    totalRefundsAed: 28100, totalGatewayFeesAed: 18490,
    totalPayoutsAed: 412800, outstandingPayoutsAed: 23976,
    pendingRefundsAed: 4420, margin: 13.6,
  },
};

// ── Transactions Ledger ───────────────────────────────────
const ZCF_TRANSACTIONS = [
  { id:'TXN-88841', date:'Jun 3, 2026', type:'revenue',      subtype:'order',         market:'AE', currency:'AED', amount:599.98,   gateway:'Geidea',   ref:'ORD-88841', vendor:'Le Maillot',     status:'settled',    gatewayFee:11.99 },
  { id:'TXN-88840', date:'Jun 3, 2026', type:'payout',       subtype:'vendor_payout', market:'AE', currency:'AED', amount:-14200,   gateway:'Bank Transfer', ref:'PYT-2114', vendor:'24K Fashion House', status:'processed', gatewayFee:0 },
  { id:'TXN-88839', date:'Jun 3, 2026', type:'revenue',      subtype:'order',         market:'EG', currency:'EGP', amount:2200,     gateway:'Paymob',   ref:'ORD-87201', vendor:'Le Maillot',     status:'settled',    gatewayFee:44 },
  { id:'TXN-88838', date:'Jun 2, 2026', type:'refund',       subtype:'order_refund',  market:'SA', currency:'SAR', amount:-299.99,  gateway:'Tamara',   ref:'ORD-88290', vendor:'Le Maillot',     status:'processed',  gatewayFee:0 },
  { id:'TXN-88837', date:'Jun 2, 2026', type:'revenue',      subtype:'subscription',  market:'AE', currency:'AED', amount:499,      gateway:'Stripe',   ref:'SUB-Pro-24K', vendor:'24K Fashion House', status:'settled',  gatewayFee:14.47 },
  { id:'TXN-88836', date:'Jun 2, 2026', type:'revenue',      subtype:'order',         market:'SA', currency:'SAR', amount:1199.97,  gateway:'STC Pay',  ref:'ORD-88421', vendor:'7 Wonders',      status:'settled',    gatewayFee:23.99 },
  { id:'TXN-88835', date:'Jun 2, 2026', type:'fee',          subtype:'gateway_fee',   market:'AE', currency:'AED', amount:-48.20,   gateway:'Geidea',   ref:'BATCH-441', vendor:null,             status:'settled',    gatewayFee:0 },
  { id:'TXN-88834', date:'Jun 1, 2026', type:'revenue',      subtype:'bnpl',          market:'AE', currency:'AED', amount:899.00,   gateway:'Tabby',    ref:'ORD-87991', vendor:'7 Wonders',      status:'pending',    gatewayFee:26.97 },
  { id:'TXN-88833', date:'Jun 1, 2026', type:'payout',       subtype:'vendor_payout', market:'EG', currency:'EGP', amount:-720000,  gateway:'Bank Transfer', ref:'PYT-EG-441', vendor:'Cairo Brands', status:'on_hold',   gatewayFee:0 },
  { id:'TXN-88832', date:'Jun 1, 2026', type:'revenue',      subtype:'order',         market:'EG', currency:'EGP', amount:3600,     gateway:'Fawry',    ref:'ORD-86990', vendor:'Burgandy',       status:'settled',    gatewayFee:72 },
  { id:'TXN-88831', date:'May 31, 2026', type:'chargeback',  subtype:'dispute',       market:'SA', currency:'SAR', amount:-449.99,  gateway:'Geidea',   ref:'DSP-002',   vendor:'Le Maillot',     status:'pending',    gatewayFee:0 },
  { id:'TXN-88830', date:'May 31, 2026', type:'revenue',     subtype:'cod',           market:'EG', currency:'EGP', amount:1800,     gateway:'COD',      ref:'ORD-86800', vendor:'Burgandy',       status:'pending_collection', gatewayFee:0 },
  { id:'TXN-88829', date:'May 30, 2026', type:'cost',        subtype:'return_shipping',market:'AE', currency:'AED', amount:-28.50,  gateway:'Bosta',    ref:'RET-441',   vendor:'Le Maillot',     status:'settled',    gatewayFee:0 },
  { id:'TXN-88828', date:'May 30, 2026', type:'revenue',     subtype:'order',         market:'AE', currency:'AED', amount:449.99,   gateway:'Apple Pay',ref:'ORD-88180', vendor:'Burgandy',       status:'settled',    gatewayFee:9.00 },
  { id:'TXN-88827', date:'May 29, 2026', type:'revenue',     subtype:'cancellation_fee',market:'SA', currency:'SAR', amount:44.99,  gateway:'Internal', ref:'ORD-88100', vendor:null,             status:'settled',    gatewayFee:0 },
  { id:'TXN-88826', date:'May 29, 2026', type:'tax',         subtype:'vat_collected', market:'AE', currency:'AED', amount:44.99,   gateway:'Internal', ref:'VAT-AE-441', vendor:null,             status:'remitted',   gatewayFee:0 },
  { id:'TXN-88825', date:'May 28, 2026', type:'revenue',     subtype:'bnpl',          market:'SA', currency:'SAR', amount:599.98,   gateway:'Tamara',   ref:'ORD-88841', vendor:'Le Maillot',     status:'settled',    gatewayFee:17.99 },
  { id:'TXN-88824', date:'May 28, 2026', type:'payout',      subtype:'vendor_payout', market:'SA', currency:'SAR', amount:-11800,   gateway:'Bank Transfer', ref:'PYT-2089', vendor:'24K Fashion House', status:'processed', gatewayFee:0 },
];

// ── Vendor Payouts ────────────────────────────────────────
const ZCF_PAYOUTS = [
  { id:'PYT-2114', vendor:'24K Fashion House', market:'AE', currency:'AED', amount:14200, status:'processed', dueDate:'Jun 1, 2026', processedDate:'Jun 1, 2026', bank:'ENBD', method:'Bank Transfer', ref:'ENBD-251100', ordersCount:28, commission:1704 },
  { id:'PYT-2115', vendor:'7 Wonders Wear',    market:'AE', currency:'AED', amount:28080, status:'processed', dueDate:'Jun 1, 2026', processedDate:'Jun 1, 2026', bank:'ENBD', method:'Bank Transfer', ref:'ENBD-251101', ordersCount:42, commission:3120 },
  { id:'PYT-2116', vendor:'Almaz Couture',     market:'AE', currency:'AED', amount:18400, status:'pending',   dueDate:'Jun 1, 2026', processedDate:null,          bank:'ADCB', method:'Bank Transfer', ref:null,          ordersCount:19, commission:2208 },
  { id:'PYT-2117', vendor:'5th Avenue Cairo',  market:'EG', currency:'EGP', amount:94800, status:'on_hold',   dueDate:'Jun 1, 2026', processedDate:null,          bank:'Banque Misr', method:'Bank Transfer', ref:null, ordersCount:12, holdReason:'Bank account verification pending', commission:11376 },
  { id:'PYT-2118', vendor:'Aurora Fashion',    market:'SA', currency:'SAR', amount:11800, status:'processed', dueDate:'Jun 1, 2026', processedDate:'Jun 2, 2026', bank:'SNB',  method:'Bank Transfer', ref:'SNB-251200', ordersCount:16, commission:1416 },
  { id:'PYT-2119', vendor:'Le Maillot',        market:'SA', currency:'SAR', amount:8240,  status:'failed',    dueDate:'Jun 1, 2026', processedDate:null,          bank:'SNB',  method:'Bank Transfer', ref:null,          ordersCount:11, failReason:'Invalid IBAN', commission:988.8 },
  { id:'PYT-2120', vendor:'909 Designs',       market:'EG', currency:'EGP', amount:31400, status:'upcoming',  dueDate:'Jul 1, 2026', processedDate:null,          bank:'CIB',  method:'Bank Transfer', ref:null,          ordersCount:8,  commission:3768 },
  { id:'PYT-2121', vendor:'24K Fashion House', market:'EG', currency:'EGP', amount:62800, status:'upcoming',  dueDate:'Jul 1, 2026', processedDate:null,          bank:'CIB',  method:'Bank Transfer', ref:null,          ordersCount:22, commission:7536 },
];

// ── Gateway Reconciliation ────────────────────────────────
const ZCF_GATEWAYS = [
  { id:'gw1',  name:'Geidea',    markets:['AE','SA'], type:'card',    txnCount:1284, volume:486200, fees:9724,  settled:486200, pending:0,     discrepancy:0,   lastSettlement:'Jun 2, 2026' },
  { id:'gw2',  name:'Paymob',    markets:['EG','KW'], type:'card',    txnCount:2841, volume:9640000, fees:192800, settled:9447200, pending:192800, discrepancy:220, lastSettlement:'Jun 1, 2026' },
  { id:'gw3',  name:'Stripe',    markets:['AE','SA','global'], type:'card', txnCount:441, volume:124400, fees:3609, settled:124400, pending:0,   discrepancy:0,   lastSettlement:'Jun 3, 2026' },
  { id:'gw4',  name:'Tamara',    markets:['AE','SA','KW'], type:'bnpl', txnCount:328, volume:142800, fees:4284, settled:138516, pending:4284, discrepancy:0,   lastSettlement:'Jun 2, 2026' },
  { id:'gw5',  name:'Tabby',     markets:['AE','SA','EG'], type:'bnpl', txnCount:218, volume:98400,  fees:2952, settled:95448,  pending:2952, discrepancy:0,   lastSettlement:'Jun 1, 2026' },
  { id:'gw6',  name:'Instapay',  markets:['EG'],      type:'wallet',  txnCount:448, volume:1840000, fees:18400, settled:1821600, pending:0,   discrepancy:0,   lastSettlement:'Jun 3, 2026' },
  { id:'gw7',  name:'Fawry',     markets:['EG'],      type:'wallet',  txnCount:612, volume:2448000, fees:48960, settled:2399040, pending:48960, discrepancy:880, lastSettlement:'Jun 1, 2026' },
  { id:'gw8',  name:'STC Pay',   markets:['SA'],      type:'wallet',  txnCount:184, volume:73600,  fees:1472, settled:72128,  pending:1472, discrepancy:0,   lastSettlement:'Jun 2, 2026' },
  { id:'gw9',  name:'COD',       markets:['EG','SA'], type:'cod',     txnCount:384, volume:691200, fees:0,    settled:614280, pending:76920, discrepancy:0,   collectionRate:88.8 },
  { id:'gw10', name:'Apple Pay', markets:['AE','SA'], type:'wallet',  txnCount:241, volume:96400,  fees:2892, settled:96400,  pending:0,   discrepancy:0,   lastSettlement:'Jun 3, 2026' },
  { id:'gw11', name:'KNET',      markets:['KW'],      type:'card',    txnCount:48,  volume:14400,  fees:288,  settled:14400,  pending:0,   discrepancy:0,   lastSettlement:'Jun 2, 2026' },
];

// ── VAT Summary ───────────────────────────────────────────
const ZCF_VAT = [
  { market:'AE', name:'UAE',    rate:5,  currency:'AED', collected:24366, remitted:24366, outstanding:0,   nextDueDate:'Jul 28, 2026', filingStatus:'filed',   filingPeriod:'Q2 2026' },
  { market:'SA', name:'KSA',    rate:15, currency:'SAR', collected:32835, remitted:32835, outstanding:0,   nextDueDate:'Jul 31, 2026', filingStatus:'filed',   filingPeriod:'Q2 2026' },
  { market:'EG', name:'Egypt',  rate:14, currency:'EGP', collected:1377600, remitted:1200000, outstanding:177600, nextDueDate:'Jun 30, 2026', filingStatus:'pending', filingPeriod:'May 2026' },
  { market:'QA', name:'Qatar',  rate:0,  currency:'QAR', collected:0,    remitted:0,     outstanding:0,   nextDueDate:'N/A',           filingStatus:'exempt',  filingPeriod:'—' },
];

// ── Reconciliation ────────────────────────────────────────
const ZCF_RECONCILIATION = [
  { id:'REC-441', gateway:'Paymob', date:'Jun 1, 2026', systemAmount:9640000, gatewayAmount:9639780, diff:220, status:'discrepancy', note:'EGP 220 shortfall — investigating' },
  { id:'REC-440', gateway:'Fawry',  date:'Jun 1, 2026', systemAmount:2448000, gatewayAmount:2447120, diff:880, status:'discrepancy', note:'EGP 880 shortfall — Fawry ticket raised' },
  { id:'REC-439', gateway:'Geidea', date:'Jun 2, 2026', systemAmount:486200,  gatewayAmount:486200,  diff:0,   status:'matched',     note:'' },
  { id:'REC-438', gateway:'Stripe', date:'Jun 3, 2026', systemAmount:124400,  gatewayAmount:124400,  diff:0,   status:'matched',     note:'' },
  { id:'REC-437', gateway:'COD-EG', date:'Jun 2, 2026', systemAmount:691200,  gatewayAmount:614280,  diff:76920, status:'pending_collection', note:'COD orders awaiting courier collection' },
];

// ── Upcoming cycle ────────────────────────────────────────
const ZCF_UPCOMING = {
  nextPayoutDate: 'Jul 1, 2026',
  expectedVendorCount: 18,
  expectedAmountAed: 312400,
  breakdown: [
    { market:'AE', currency:'AED', amount:148200, vendors:8 },
    { market:'SA', currency:'SAR', amount:82400,  vendors:5 },
    { market:'EG', currency:'EGP', amount:2840000,vendors:5 },
  ],
};

// ── Tax Authority Integrations ────────────────────────────
const ZCF_TAX_INTEGRATIONS = [
  { id:'zatca', name:'ZATCA',  country:'SA', fullName:'Zakat, Tax and Customs Authority',
    status:'connected', phase:'Phase 2 (Integrated)', lastSync:'Jun 3, 2026 · 9:44 AM',
    trn:'300123456789003', invoiceQueue:{ pending:2, failed:0, cleared:8841 },
    features:['Real-time clearance','QR code B2C','XML B2B submission'],
    nextFiling:'Jul 31, 2026', filingFrequency:'Monthly', color:'var(--zg-good)' },
  { id:'eta',   name:'ETA',    country:'EG', fullName:'Egyptian Tax Authority',
    status:'connected', phase:'Phase 1 (Generation)', lastSync:'Jun 3, 2026 · 8:12 AM',
    trn:'312-441-8809', invoiceQueue:{ pending:14, failed:3, cleared:22481 },
    features:['XML invoice generation','ETA portal submission','Digital signature'],
    nextFiling:'Jun 30, 2026', filingFrequency:'Monthly', color:'var(--zg-warn)',
    errors:[ { code:'ETA-4041', msg:'3 invoices rejected — invalid TRN on vendor record', date:'Jun 2, 2026' } ] },
  { id:'fta',   name:'FTA',    country:'AE', fullName:'Federal Tax Authority (UAE)',
    status:'connected', phase:'EmaraTax Portal', lastSync:'Jun 3, 2026 · 7:30 AM',
    trn:'100441882900003', invoiceQueue:{ pending:0, failed:0, cleared:3241 },
    features:['Quarterly VAT return','EmaraTax integration','VAT invoice generation'],
    nextFiling:'Jul 28, 2026', filingFrequency:'Quarterly', color:'var(--zg-good)' },
  { id:'gta',   name:'GTA',    country:'QA', fullName:'General Tax Authority (Qatar)',
    status:'monitoring', phase:'No VAT currently', lastSync:'N/A',
    trn:'N/A', invoiceQueue:{ pending:0, failed:0, cleared:0 },
    features:['Monitoring for 2025 VAT rollout'],
    nextFiling:'TBD', filingFrequency:'TBD', color:'var(--zg-text-dim)' },
  { id:'istd',  name:'ISTD',   country:'JO', fullName:'Income & Sales Tax Dept (Jordan)',
    status:'not_connected', phase:'e-Invoicing pilot',  lastSync:'N/A',
    trn:'N/A', invoiceQueue:{ pending:0, failed:0, cleared:0 },
    features:['Pilot phase — integration required Q3 2026'],
    nextFiling:'TBD', filingFrequency:'TBD', color:'var(--zg-text-dim)' },
];

// ── Invoice Queue ─────────────────────────────────────────
const ZCF_INVOICE_QUEUE = [
  { id:'INV-ETA-22481', market:'EG', authority:'ETA', type:'B2B', amount:'EGP 3,600', status:'cleared',  date:'Jun 3, 2026', ref:'ORD-86990', vendor:'Burgandy' },
  { id:'INV-ETA-22482', market:'EG', authority:'ETA', type:'B2B', amount:'EGP 2,200', status:'pending',  date:'Jun 3, 2026', ref:'ORD-87201', vendor:'Le Maillot' },
  { id:'INV-ETA-22483', market:'EG', authority:'ETA', type:'B2C', amount:'EGP 1,800', status:'pending',  date:'Jun 3, 2026', ref:'ORD-86800', vendor:'Burgandy' },
  { id:'INV-ETA-22479', market:'EG', authority:'ETA', type:'B2B', amount:'EGP 4,400', status:'failed',   date:'Jun 2, 2026', ref:'ORD-86700', vendor:'Cairo Brands', error:'Invalid vendor TRN' },
  { id:'INV-ETA-22480', market:'EG', authority:'ETA', type:'B2B', amount:'EGP 2,800', status:'failed',   date:'Jun 2, 2026', ref:'ORD-86701', vendor:'Cairo Brands', error:'Missing product HS code' },
  { id:'INV-ZATCA-8841',market:'SA', authority:'ZATCA',type:'B2B', amount:'SAR 599.98',status:'cleared',  date:'Jun 3, 2026', ref:'ORD-88841', vendor:'Le Maillot' },
  { id:'INV-ZATCA-8840',market:'SA', authority:'ZATCA',type:'B2C', amount:'SAR 1,199.97',status:'pending',date:'Jun 3, 2026', ref:'ORD-88421', vendor:'7 Wonders' },
  { id:'INV-FTA-3241',  market:'AE', authority:'FTA',  type:'B2C', amount:'AED 599.98', status:'cleared', date:'Jun 3, 2026', ref:'ORD-88841', vendor:'Le Maillot' },
];

// ── WHT (Withholding Tax) ─────────────────────────────────
const ZCF_WHT = [
  { id:'WHT-441', vendor:'24K Fashion House', market:'EG', payoutId:'PYT-2114', payoutAmount:62800, rate:1, whtAmount:628, status:'deducted', date:'Jun 1, 2026' },
  { id:'WHT-440', vendor:'Almaz Couture',     market:'EG', payoutId:'PYT-2116', payoutAmount:18400, rate:1, whtAmount:184, status:'pending',  date:'Jun 1, 2026' },
  { id:'WHT-439', vendor:'909 Designs',       market:'EG', payoutId:'PYT-2120', payoutAmount:31400, rate:1, whtAmount:314, status:'upcoming', date:'Jul 1, 2026' },
];

// ── Cash Flow ─────────────────────────────────────────────
const ZCF_CASHFLOW = {
  currentBalance: { AED: 284200, SAR: 144800, EGP: 4200000 },
  months: [
    { month:'Apr 2026', inflow:312400, outflow:248200, net:64200 },
    { month:'May 2026', inflow:388100, outflow:294400, net:93700 },
    { month:'Jun 2026', inflow:421800, outflow:312200, net:109600 },
    { month:'Jul 2026', inflow:449200, outflow:338100, net:111100, forecast:true },
    { month:'Aug 2026', inflow:398000, outflow:310000, net:88000,  forecast:true },
    { month:'Sep 2026', inflow:512000, outflow:381000, net:131000, forecast:true },
  ],
  upcoming30Days: {
    inflows: [
      { label:'Expected order revenue',     amount:186400, currency:'AED', date:'Rolling' },
      { label:'ZATCA VAT refund (SA)',       amount:12400,  currency:'SAR', date:'Jun 15, 2026' },
      { label:'Tamara settlement T+14',      amount:48200,  currency:'AED', date:'Jun 17, 2026' },
    ],
    outflows: [
      { label:'Vendor payouts cycle Jul 1', amount:312400, currency:'AED', date:'Jul 1, 2026', type:'payout' },
      { label:'ETA VAT remittance',         amount:177600, currency:'EGP', date:'Jun 30, 2026', type:'tax' },
      { label:'Gateway fees (Geidea)',      amount:9724,   currency:'AED', date:'Jun 10, 2026', type:'fee' },
      { label:'Bosta logistics invoice',   amount:18440,  currency:'AED', date:'Jun 14, 2026', type:'logistics' },
      { label:'Tabby settlement deduction', amount:2952,   currency:'AED', date:'Jun 20, 2026', type:'fee' },
    ],
  },
  aged: {
    payables:  [ { range:'0–7 days', amount:14200 }, { range:'8–30 days', amount:9776 }, { range:'31–60 days', amount:0 }, { range:'60+ days', amount:0 } ],
    receivables:[ { range:'0–7 days', amount:48200 }, { range:'8–30 days', amount:76920 }, { range:'31–60 days', amount:4220 }, { range:'60+ days', amount:0 } ],
  },
};


export {
  ZCF_PL, ZCF_TRANSACTIONS, ZCF_PAYOUTS, ZCF_GATEWAYS, ZCF_VAT,
  ZCF_RECONCILIATION, ZCF_UPCOMING, ZCF_TAX_INTEGRATIONS, ZCF_INVOICE_QUEUE, ZCF_WHT, ZCF_CASHFLOW,
};
