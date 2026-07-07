// ordersData.js — Orders module data (ES module port of zucci-orders-data.jsx)

const ZC_ORDER_STATUS_STEPS = [
  'Brand Pickup', 'Courier Pickup', 'Local Departure',
  'Customs', 'Out For Delivery', 'Delivered',
];

const ZC_ORDERS_LIST = [
  { id: '329929328239', customer: 'Abdurahman Abdulmajeed', items: 8,  amount: 2399.92, currency: 'AED', dateRange: 'Nov 23rd to Dec 31st', status: 'transit',   group: 'Today' },
  { id: '329929328240', customer: 'Sara Medhat',            items: 18, amount: 99292.29,currency: 'SAR', dateRange: 'Nov 23rd to Dec 31st', status: 'completed', group: 'Today' },
  { id: '329929328241', customer: 'Yahya Elsherif',         items: 1,  amount: 99292.29,currency: 'SAR', dateRange: 'Nov 23rd to Dec 31st', status: 'cancelled', group: 'Today' },
  { id: '329929328242', customer: 'Omar El Hamzawi',        items: 3,  amount: 99292.29,currency: 'SAR', dateRange: 'Nov 23rd to Dec 31st', status: 'transit',   group: 'Yesterday' },
  { id: '329929328243', customer: 'Sara Medhat',            items: 18, amount: 99292.29,currency: 'SAR', dateRange: 'Nov 23rd to Dec 31st', status: 'completed', group: 'Yesterday' },
  { id: '329929328244', customer: 'Yahya Elsherif',         items: 7,  amount: 99292.29,currency: 'SAR', dateRange: 'Nov 23rd to Dec 31st', status: 'cancelled', group: 'Yesterday' },
  { id: '329929328245', customer: 'Omar El Hamzawi',        items: 3,  amount: 99292.29,currency: 'SAR', dateRange: 'Nov 23rd to Dec 31st', status: 'transit',   group: '7th of Jan 2025' },
  { id: '329929328246', customer: 'Sara Medhat',            items: 10, amount: 99292.29,currency: 'SAR', dateRange: 'Nov 23rd to Dec 31st', status: 'completed', group: '7th of Jan 2025' },
  { id: '329929328247', customer: 'Yahya Elsherif',         items: 5,  amount: 99292.29,currency: 'SAR', dateRange: 'Nov 23rd to Dec 31st', status: 'cancelled', group: '7th of Jan 2025' },
];

// Mock users available for @mention
const ZC_TIMELINE_USERS = [
  { id: 'u-001', name: 'Sara Medhat',   role: 'admin',  initials: 'SM', email: 's.medhat@zucci.com',       dept: 'Operations' },
  { id: 'u-002', name: 'Ahmed Khalil',  role: 'admin',  initials: 'AK', email: 'a.khalil@zucci.com',       dept: 'Customer Success' },
  { id: 'u-003', name: 'Omar Hassan',   role: 'admin',  initials: 'OH', email: 'o.hassan@zucci.com',       dept: 'Warehouse' },
  { id: 'v-001', name: 'Le Maillot EG', role: 'vendor', initials: 'LM', email: 'orders@lemaillot-eg.com',  brand: 'Le Maillot' },
  { id: 'v-002', name: 'Urban Looms',   role: 'vendor', initials: 'UL', email: 'ops@urbanlooms.com',        brand: 'Urban Looms' },
  { id: 'c-001', name: 'Abdurahman A.', role: 'customer',initials:'AA', email: 'abdurahman.abdulmajeed@gmail.com' },
];

const ZC_ORDER_DETAIL = {
  id: '329929328239',
  status: 'transit',
  refundWindow: '14 days refund window',
  carrier: 'BOSTA',
  internalTracking:      'Order #33420541',
  internationalTracking: 'Order #33420541',
  estimatedDelivery: 'Nov 23rd to Dec 31st, 2025',
  currentStep: 1, // 0-indexed; 0=Brand Pickup done, 1=Courier Pickup done

  lineItems: [
    { brand: 'Le Maillot',           name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001', price: 299.99, qty: 2 },
    { brand: 'Basma Khater Designs', name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001', price: 299.99, qty: 2 },
    { brand: 'Ascia',                name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001', price: 299.99, qty: 2 },
    { brand: 'Urban Looms',          name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001', price: 299.99, qty: 2 },
  ],

  subtotal: 2399.92,
  shippingLabel: '3–7 working days (3.2 kg, charged 4 kg)',
  shippingCost: 55.05,
  total: 2399.92,
  refunded: 0,
  paid: 2399.92,
  settlementNote: '8 days till settlement from gateway',

  brandGroups: [
    { name: 'Le Maillot', items: [
        { name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001',
          stage: 'received',   updatedBy: 'Ahmed K.', updatedAt: '45m ago', qcFailReason: null, notes: [], flagged: false },
        { name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001',
          stage: 'qc_check',  updatedBy: 'Sara M.',  updatedAt: '12m ago', qcFailReason: null, notes: [], flagged: false },
    ]},
    { name: 'Basma Khater Designs', items: [
        { name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001',
          stage: 'dispatched', updatedBy: 'Omar H.',  updatedAt: '1h ago',  qcFailReason: null, notes: [], flagged: false },
        { name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001',
          stage: 'packed',     updatedBy: 'Omar H.',  updatedAt: '2h ago',  qcFailReason: null, notes: [], flagged: false },
    ]},
    { name: 'Ascia', items: [
        { name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001',
          stage: 'qc_passed',  updatedBy: 'Sara M.',  updatedAt: '3h ago',  qcFailReason: null, notes: [], flagged: false },
        { name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001',
          stage: 'qc_passed',  updatedBy: 'Sara M.',  updatedAt: '3h ago',  qcFailReason: null, notes: [], flagged: false },
    ]},
    { name: 'Urban Looms', items: [
        { name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001',
          stage: 'awaiting_brand', updatedBy: null,       updatedAt: null,      qcFailReason: null,      notes: [], flagged: false },
        { name: 'Swim Leggings – Pina Colada', variant: 'Pina Colada / XXL', sku: 'CHAIR-001',
          stage: 'qc_failed',  updatedBy: 'Sara M.',  updatedAt: '5h ago',  qcFailReason: 'Damaged', notes: [{ text: 'Left sleeve seam is torn. Notified brand.', by: 'Sara M.', at: '5h ago' }], flagged: true },
    ]},
  ],

  customer: {
    firstName: 'Abdurahman', lastName: 'Abdulmajeed',
    phone: '+966 5123 45678',
    email: 'abdurahman.abdulmajeed@gmail.com',
  },

  shippingAddr: {
    building: '4458',           street: 'Wadi Naam',
    district: 'Al Malqa District', postal: '13525',
    city: 'Riyadh',             country: 'Saudi Arabia',
    w3w: '///seasonal.words.whispers',
    latlong: '24.7811175950327, 46.651972846197665',
  },

  activityLog: [
    { user: 'Sara Medhat', action: 'Canceled Order', datetime: 'September 23rd, 2024 · 16:11:03 PM (GTC +3)' },
    { user: 'Sara Medhat', action: 'Canceled Order', datetime: 'September 23rd, 2024 · 16:11:03 PM (GTC +3)' },
    { user: 'Sara Medhat', action: 'Canceled Order', datetime: 'September 23rd, 2024 · 16:11:03 PM (GTC +3)' },
    { user: 'Sara Medhat', action: 'Canceled Order', datetime: 'September 23rd, 2024 · 16:11:03 PM (GTC +3)' },
    { user: 'Sara Medhat', action: 'Canceled Order', datetime: 'September 23rd, 2024 · 16:11:03 PM (GTC +3)' },
  ],

  timeline: [
    { date: 'June 5, 2024', entries: [
      { type: 'admin',    actor: { id:'u-001', name:'Sara Medhat',   role:'admin',  initials:'SM' }, text: 'Order marked as fulfilled by Zucci operations.',                                                         time: '1:52 pm', visibility: 'internal' },
    ]},
    { date: 'June 3, 2024', entries: [
      { type: 'note',     actor: { id:'u-002', name:'Ahmed Khalil',  role:'admin',  initials:'AK' }, text: '@Le_Maillot_EG please confirm dispatch date for the remaining items — customer has been waiting.',        time: '10:14 am', visibility: 'shared', mentions: ['v-001'] },
      { type: 'vendor',   actor: { id:'v-001', name:'Le Maillot EG', role:'vendor', initials:'LM' }, text: 'Items will be dispatched by end of day. Apologies for the delay.',                                       time: '11:32 am', visibility: 'shared' },
    ]},
    { date: 'June 2, 2024', entries: [
      { type: 'system',   actor: null,                                                                text: 'Order received at Zucci warehouse (Cairo, Egypt).',                                                       time: '1:52 pm', visibility: 'shared' },
      { type: 'vendor',   actor: { id:'v-001', name:'Le Maillot EG', role:'vendor', initials:'LM' }, text: 'Dispatched order to Zucci\'s warehouse (Cairo, Egypt).',                                                  time: '1:52 pm', visibility: 'shared' },
      { type: 'system',   actor: null,                                                                text: 'Order confirmation email was sent to Le Maillot Egypt (orders@lemaillot-eg.com).',                        time: '1:52 pm', visibility: 'shared', viewEmail: true },
      { type: 'system',   actor: null,                                                                text: 'Confirmation #5NUDOV4NP was generated for this order.',                                                    time: '1:52 pm', visibility: 'shared' },
      { type: 'system',   actor: null,                                                                text: 'Payment confirmed.',                                                                                       time: '1:52 pm', visibility: 'shared' },
      { type: 'customer', actor: { id:'c-001', name:'Abdurahman A.', role:'customer',initials:'AA'}, text: 'Placed an order via online store.',                                                                         time: '1:52 pm', visibility: 'shared' },
    ]},
  ],

  tags: [],
};

export {
  ZC_ORDER_STATUS_STEPS, ZC_ORDERS_LIST, ZC_ORDER_DETAIL, ZC_TIMELINE_USERS,
};
