// adminModules.js — data-driven config for every admin module screen.
// Each module: KPIs, table columns, rows, filters, and detail fields.
// Ported/condensed from the React modules' mock data. Extend freely.

const pill = (label, tone) => ({ label, tone });

export const MODULES = {
  orders: {
    title: 'Orders',
    subtitle: 'All marketplace orders across markets',
    primaryAction: 'New Order',
    kpis: [
      { label: 'Open', value: '247', tone: 'warn' },
      { label: 'Processing', value: '512', tone: 'accent' },
      { label: 'Dispatched Today', value: '1,284', tone: 'good' },
      { label: 'Returns Open', value: '83', tone: 'danger' },
    ],
    tabs: ['All', 'Pending', 'Processing', 'Dispatched', 'Delivered', 'Returned'],
    columns: [
      { key: 'id', label: 'Order', mono: true, accent: true },
      { key: 'customer', label: 'Customer' },
      { key: 'mk', label: 'Mkt', mono: true, dim: true },
      { key: 'items', label: 'Items', mono: true },
      { key: 'total', label: 'Total', mono: true },
      { key: 'status', label: 'Status', pill: true },
      { key: 'date', label: 'Date', mono: true, dim: true },
    ],
    rows: [
      { id: '#ZUC-20841', customer: 'Layla Al Mansouri', mk: 'AE', items: 3, total: 'AED 420', status: pill('Dispatched', 'good'), date: 'Jul 07', cod: false },
      { id: '#ZUC-20840', customer: 'Ahmed Khalid', mk: 'SA', items: 1, total: 'SAR 310', status: pill('Pending', 'warn'), date: 'Jul 07', cod: true },
      { id: '#ZUC-20839', customer: 'Sara Ibrahim', mk: 'EG', items: 2, total: 'EGP 890', status: pill('Processing', 'accent'), date: 'Jul 07', cod: false },
      { id: '#ZUC-20838', customer: 'Omar Yousef', mk: 'AE', items: 5, total: 'AED 1,240', status: pill('Dispatched', 'good'), date: 'Jul 06', cod: false },
      { id: '#ZUC-20837', customer: 'Fatima Al Rashid', mk: 'SA', items: 2, total: 'SAR 580', status: pill('Pending', 'warn'), date: 'Jul 06', cod: true },
      { id: '#ZUC-20836', customer: 'Khaled Nasser', mk: 'AE', items: 1, total: 'AED 220', status: pill('Delivered', 'good'), date: 'Jul 06', cod: false },
      { id: '#ZUC-20835', customer: 'Nour Hassan', mk: 'EG', items: 4, total: 'EGP 1,450', status: pill('Processing', 'accent'), date: 'Jul 05', cod: false },
      { id: '#ZUC-20834', customer: 'Reem Al Zaabi', mk: 'AE', items: 2, total: 'AED 760', status: pill('Returned', 'danger'), date: 'Jul 05', cod: false },
    ],
  },

  products: {
    title: 'Products',
    subtitle: 'Catalog across all brands and markets',
    primaryAction: 'Add Product',
    kpis: [
      { label: 'Active', value: '4,812', tone: 'good' },
      { label: 'Pending Review', value: '128', tone: 'warn' },
      { label: 'Draft', value: '341', tone: 'accent' },
      { label: 'Out of Stock', value: '96', tone: 'danger' },
    ],
    tabs: ['All', 'Active', 'Pending Review', 'Draft', 'Out of Stock'],
    columns: [
      { key: 'sku', label: 'SKU', mono: true, accent: true },
      { key: 'name', label: 'Product' },
      { key: 'brand', label: 'Brand' },
      { key: 'category', label: 'Category', dim: true },
      { key: 'markets', label: 'Markets', mono: true },
      { key: 'stock', label: 'Stock', mono: true },
      { key: 'status', label: 'Status', pill: true },
      { key: 'sync', label: 'Sync', dim: true },
    ],
    rows: [
      { sku: 'JNS-LME-SC24-10001', name: 'High-Rise Slim Jeans', brand: 'Le Maillot', category: 'Jeans', markets: 'AE·SA·EG', stock: 249, status: pill('Active', 'good'), sync: 'Shopify' },
      { sku: 'SWM-LME-SC24-10002', name: 'One-Piece Swimsuit', brand: 'Le Maillot', category: 'Swimwear', markets: 'AE·SA', stock: 83, status: pill('Active', 'good'), sync: 'Shopify' },
      { sku: 'BTY-ROS-SC24-10044', name: 'Rose Attar 10ml', brand: 'Rose House', category: 'Fragrance', markets: 'AE·SA·EG·QA', stock: 441, status: pill('Active', 'good'), sync: 'Manual' },
      { sku: 'SHO-CLD-SC24-10071', name: 'Cloud Runner Sneakers', brand: 'Cloud', category: 'Shoes', markets: 'AE', stock: 4, status: pill('Out of Stock', 'danger'), sync: 'API' },
      { sku: 'DRS-EMR-SC24-10088', name: 'Emerald Wrap Dress', brand: 'Emerald', category: 'Dresses', markets: 'AE·SA', stock: 0, status: pill('Pending Review', 'warn'), sync: 'Manual' },
      { sku: 'TOP-BOSS-SC24-101', name: 'Boss Slim Shirt', brand: 'Boss', category: 'Tops', markets: 'SA', stock: 62, status: pill('Draft', 'accent'), sync: 'Manual' },
    ],
  },

  warehouses: {
    title: 'Warehouses & Storage',
    subtitle: 'Multi-country fulfilment network',
    primaryAction: 'New Warehouse',
    kpis: [
      { label: 'Warehouses', value: '14', tone: 'accent' },
      { label: 'Avg Utilization', value: '78%', tone: 'good' },
      { label: 'Inbound Queue', value: '32', tone: 'warn' },
      { label: 'Transfers Active', value: '9', tone: 'accent' },
    ],
    tabs: ['All', 'Owned', 'Leased', '3PL', 'Dark Store', 'Cross-dock'],
    columns: [
      { key: 'code', label: 'Code', mono: true, accent: true },
      { key: 'name', label: 'Warehouse' },
      { key: 'country', label: 'Country', mono: true, dim: true },
      { key: 'type', label: 'Type' },
      { key: 'util', label: 'Utilization', mono: true },
      { key: 'skus', label: 'SKUs', mono: true },
      { key: 'status', label: 'Status', pill: true },
    ],
    rows: [
      { code: 'AE-DXB-01', name: 'Dubai South DC', country: 'AE', type: 'Owned', util: '82%', skus: '12,410', status: pill('Live', 'good') },
      { code: 'AE-DXB-02', name: 'Al Quoz Dark Store', country: 'AE', type: 'Dark Store', util: '64%', skus: '2,180', status: pill('Live', 'good') },
      { code: 'SA-RUH-01', name: 'Riyadh Fulfilment', country: 'SA', type: 'Leased', util: '91%', skus: '9,320', status: pill('Live', 'good') },
      { code: 'SA-JED-01', name: 'Jeddah 3PL (Aramex)', country: 'SA', type: '3PL', util: '73%', skus: '5,610', status: pill('Live', 'good') },
      { code: 'EG-CAI-01', name: 'Cairo Transit Hub', country: 'EG', type: 'Cross-dock', util: '58%', skus: '3,140', status: pill('Live', 'good') },
      { code: 'AE-DXB-03', name: 'JAFZA Overflow', country: 'AE', type: 'Leased', util: '96%', skus: '1,020', status: pill('Near Full', 'warn') },
    ],
  },

  marketplace: {
    title: 'Marketplace',
    subtitle: 'Vendor listings, commission & disputes',
    primaryAction: 'Invite Vendor',
    kpis: [
      { label: 'Active Vendors', value: '312', tone: 'good' },
      { label: 'Pending KYC', value: '18', tone: 'warn' },
      { label: 'New Listings', value: '241', tone: 'accent' },
      { label: 'Open Disputes', value: '7', tone: 'danger' },
    ],
    tabs: ['Listings', 'Commission', 'Disputes', 'Seller Hub'],
    columns: [
      { key: 'id', label: 'Vendor ID', mono: true, accent: true },
      { key: 'name', label: 'Vendor / Brand' },
      { key: 'markets', label: 'Markets', mono: true },
      { key: 'listings', label: 'Listings', mono: true },
      { key: 'commission', label: 'Commission', mono: true },
      { key: 'status', label: 'Status', pill: true },
    ],
    rows: [
      { id: 'VND-AE-001', name: 'Le Maillot', markets: 'AE·SA·EG', listings: '412', commission: '18%', status: pill('Active', 'good') },
      { id: 'VND-SA-018', name: 'Adidas Arabia', markets: 'SA·AE', listings: '0', commission: '15%', status: pill('KYC Review', 'warn') },
      { id: 'VND-AE-024', name: 'Mango MENA', markets: 'AE', listings: '188', commission: '20%', status: pill('Active', 'good') },
      { id: 'VND-AE-009', name: 'H&M Gulf', markets: 'AE·SA', listings: '621', commission: '17%', status: pill('Dispute', 'danger') },
      { id: 'VND-EG-031', name: 'Stradivarius EG', markets: 'EG', listings: '54', commission: '19%', status: pill('Active', 'good') },
    ],
  },

  customers: {
    title: 'Customers',
    subtitle: 'Buyers, loyalty tiers & addresses',
    primaryAction: 'Export',
    kpis: [
      { label: 'Total Buyers', value: '184K', tone: 'accent' },
      { label: 'New (30d)', value: '6,412', tone: 'good' },
      { label: 'VIP / Platinum', value: '1,204', tone: 'good' },
      { label: 'Open Tickets', value: '38', tone: 'warn' },
    ],
    tabs: ['All', 'New', 'Returning', 'VIP', 'Flagged'],
    columns: [
      { key: 'id', label: 'ID', mono: true, accent: true },
      { key: 'name', label: 'Customer' },
      { key: 'mk', label: 'Mkt', mono: true, dim: true },
      { key: 'orders', label: 'Orders', mono: true },
      { key: 'ltv', label: 'LTV', mono: true },
      { key: 'tier', label: 'Tier', pill: true },
    ],
    rows: [
      { id: 'CU-40118', name: 'Layla Al Mansouri', mk: 'AE', orders: 42, ltv: 'AED 18.4K', tier: pill('Platinum', 'accent') },
      { id: 'CU-40117', name: 'Ahmed Khalid', mk: 'SA', orders: 12, ltv: 'SAR 4.2K', tier: pill('Gold', 'warn') },
      { id: 'CU-40116', name: 'Sara Ibrahim', mk: 'EG', orders: 3, ltv: 'EGP 1.8K', tier: pill('Silver', 'neutral') },
      { id: 'CU-40115', name: 'Omar Yousef', mk: 'AE', orders: 88, ltv: 'AED 58K', tier: pill('VIP', 'good') },
      { id: 'CU-40114', name: 'Nour Hassan', mk: 'EG', orders: 1, ltv: 'EGP 420', tier: pill('Bronze', 'neutral') },
    ],
  },

  finance: {
    title: 'Finance',
    subtitle: 'P&L, transactions, payouts & tax',
    primaryAction: 'Export',
    kpis: [
      { label: 'GMV (Jun)', value: 'AED 402K', tone: 'good' },
      { label: 'Net Revenue', value: 'AED 281K', tone: 'good' },
      { label: 'Pending Payouts', value: 'AED 142K', tone: 'warn' },
      { label: 'Refunds', value: 'AED 22K', tone: 'danger' },
    ],
    tabs: ['Transactions', 'Payouts', 'Gateways', 'Tax / VAT', 'Cash Flow'],
    columns: [
      { key: 'id', label: 'Txn', mono: true, accent: true },
      { key: 'type', label: 'Type' },
      { key: 'party', label: 'Party' },
      { key: 'mk', label: 'Mkt', mono: true, dim: true },
      { key: 'amount', label: 'Amount', mono: true },
      { key: 'status', label: 'Status', pill: true },
    ],
    rows: [
      { id: 'TXN-88214', type: 'Payout', party: 'Le Maillot', mk: 'AE', amount: 'AED 42,100', status: pill('Settled', 'good') },
      { id: 'TXN-88213', type: 'Order', party: 'CU-40118', mk: 'AE', amount: 'AED 420', status: pill('Captured', 'good') },
      { id: 'TXN-88212', type: 'Refund', party: 'CU-40114', mk: 'EG', amount: 'EGP 890', status: pill('Processing', 'accent') },
      { id: 'TXN-88211', type: 'Payout', party: 'Mango MENA', mk: 'AE', amount: 'AED 18,400', status: pill('Pending', 'warn') },
      { id: 'TXN-88210', type: 'Chargeback', party: 'CU-40109', mk: 'SA', amount: 'SAR 1,240', status: pill('Disputed', 'danger') },
    ],
  },

  discounts: {
    title: 'Promotions',
    subtitle: 'Coupons, campaigns, influencers & gift cards',
    primaryAction: 'New Promotion',
    kpis: [
      { label: 'Active Promos', value: '24', tone: 'good' },
      { label: 'Coupons Live', value: '148', tone: 'accent' },
      { label: 'Redemptions (7d)', value: '12,410', tone: 'good' },
      { label: 'Budget Used', value: '68%', tone: 'warn' },
    ],
    tabs: ['Promotions', 'Coupons', 'Influencers', 'Gift Cards', 'Budgets'],
    columns: [
      { key: 'code', label: 'Code', mono: true, accent: true },
      { key: 'name', label: 'Promotion' },
      { key: 'type', label: 'Type' },
      { key: 'markets', label: 'Markets', mono: true },
      { key: 'used', label: 'Used', mono: true },
      { key: 'status', label: 'Status', pill: true },
    ],
    rows: [
      { code: 'SUMMER25', name: 'Summer Edit 25% Off', type: '% Discount', markets: 'AE·SA', used: '4,120', status: pill('Live', 'good') },
      { code: 'WELCOME10', name: 'New Customer AED 10', type: 'Fixed', markets: 'AE', used: '18,240', status: pill('Live', 'good') },
      { code: 'EIDGIFT', name: 'Eid Gift Card Bonus', type: 'Gift Card', markets: 'AE·SA·EG', used: '2,410', status: pill('Scheduled', 'accent') },
      { code: 'NOURxZUC', name: 'Influencer — Nour', type: 'Affiliate', markets: 'EG', used: '890', status: pill('Live', 'good') },
      { code: 'FLASH50', name: 'Flash Friday 50%', type: '% Discount', markets: 'AE', used: '6,200', status: pill('Ended', 'neutral') },
    ],
  },

  comms: {
    title: 'Notifications & Comms',
    subtitle: 'Push, SMS, WhatsApp, email & in-app',
    primaryAction: 'New Campaign',
    kpis: [
      { label: 'Sent (7d)', value: '1.2M', tone: 'accent' },
      { label: 'Open Rate', value: '38%', tone: 'good' },
      { label: 'Scheduled', value: '14', tone: 'warn' },
      { label: 'Opt-out Rate', value: '0.4%', tone: 'good' },
    ],
    tabs: ['Campaigns', 'Templates', 'Audiences', 'Scheduled', 'Analytics'],
    columns: [
      { key: 'id', label: 'ID', mono: true, accent: true },
      { key: 'name', label: 'Campaign' },
      { key: 'channel', label: 'Channel' },
      { key: 'audience', label: 'Audience', dim: true },
      { key: 'sent', label: 'Sent', mono: true },
      { key: 'status', label: 'Status', pill: true },
    ],
    rows: [
      { id: 'CMP-512', name: 'Summer Sale Blast', channel: 'Push + Email', audience: 'AE · Lapsed 30d', sent: '241K', status: pill('Sent', 'good') },
      { id: 'CMP-511', name: 'Abandoned Cart', channel: 'WhatsApp', audience: 'All · Cart >1h', sent: '18K', status: pill('Active', 'accent') },
      { id: 'CMP-510', name: 'Eid Teaser', channel: 'Push', audience: 'SA · VIP', sent: '0', status: pill('Scheduled', 'warn') },
      { id: 'CMP-509', name: 'Order Update (txn)', channel: 'SMS', audience: 'System', sent: '412K', status: pill('Live', 'good') },
      { id: 'CMP-508', name: 'Win-back A/B', channel: 'Email', audience: 'EG · Churned', sent: '62K', status: pill('Sent', 'good') },
    ],
  },

  tickets: {
    title: 'Tickets',
    subtitle: 'Support & internal ops tickets',
    primaryAction: 'New Ticket',
    kpis: [
      { label: 'Open', value: '38', tone: 'warn' },
      { label: 'Breaching SLA', value: '4', tone: 'danger' },
      { label: 'Resolved (7d)', value: '212', tone: 'good' },
      { label: 'CSAT', value: '4.6', tone: 'good' },
    ],
    tabs: ['All', 'Open', 'Pending', 'Escalated', 'Resolved'],
    columns: [
      { key: 'id', label: 'Ticket', mono: true, accent: true },
      { key: 'subject', label: 'Subject' },
      { key: 'type', label: 'Type', dim: true },
      { key: 'assignee', label: 'Assignee' },
      { key: 'sla', label: 'SLA', mono: true },
      { key: 'status', label: 'Status', pill: true },
    ],
    rows: [
      { id: 'TKT-9214', subject: 'Refund not received', type: 'Customer', assignee: 'M. Saeed', sla: '2h left', status: pill('Open', 'warn') },
      { id: 'TKT-9213', subject: '3PL sync failure — Jeddah', type: 'Ops', assignee: 'Tech', sla: 'Breached', status: pill('Escalated', 'danger') },
      { id: 'TKT-9212', subject: 'Wrong size delivered', type: 'Customer', assignee: 'A. Nasser', sla: '5h left', status: pill('Pending', 'accent') },
      { id: 'TKT-9211', subject: 'Vendor payout dispute', type: 'Vendor', assignee: 'Finance', sla: '1d left', status: pill('Open', 'warn') },
      { id: 'TKT-9210', subject: 'App crash on checkout', type: 'Ops', assignee: 'Tech', sla: '—', status: pill('Resolved', 'good') },
    ],
  },
};

export const MODULE_KEYS = Object.keys(MODULES);
