// opsData.js — mock live-ops data for the auth left panel (from zucci-data.jsx).

export const ZC_OPS_STATS = [
  { lbl: 'Orders / hr', val: '1,284', sub: '+12.4%', subClass: 'is-pos' },
  { lbl: 'GMV today', val: 'AED 318K', sub: '+8.1%', subClass: 'is-pos' },
  { lbl: 'Fulfilment', val: '96.1%', sub: '+0.7%', subClass: 'is-pos' },
  { lbl: 'SLA breach', val: '7', sub: '-2', subClass: 'is-neg' },
];

export const ZC_OPS_FEED = [
  { time: '09:41:02', html: '<b>Order</b> <code>#ZUC-20841</code> dispatched · Dubai South', tag: 'good' },
  { time: '09:40:55', html: '<b>KYC</b> submitted — Adidas Arabia', tag: 'warn' },
  { time: '09:40:31', html: '<b>Return</b> <code>#RET-3821</code> inspection passed', tag: 'good' },
  { time: '09:40:12', html: '<b>Transfer</b> AE → SA · 240 units in transit', tag: null },
  { time: '09:39:58', html: '<b>Low stock</b> Nike Air Max 90 (AE) — 4 left', tag: 'warn' },
  { time: '09:39:40', html: '<b>Payout</b> settled — Mango MENA · AED 42K', tag: 'good' },
];
