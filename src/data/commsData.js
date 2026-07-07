// commsData.js — Notifications & Comms data (ES module port of zucci-comms.jsx).
export const CHANNELS = ['email','sms','push','in_app'];
export const CH_LABELS = { email:'Email', sms:'SMS / WhatsApp', push:'Push', in_app:'In-App' };

export const TEMPLATES = [
  { id:'t1', name:'Order Confirmed',         channel:'email', category:'Transactional', status:'active', langs:['en','ar'], last_sent:'2h ago',  sent_count:18420 },
  { id:'t2', name:'Order Shipped',           channel:'email', category:'Transactional', status:'active', langs:['en','ar'], last_sent:'3h ago',  sent_count:16240 },
  { id:'t3', name:'Order Delivered',         channel:'push',  category:'Transactional', status:'active', langs:['en','ar'], last_sent:'1h ago',  sent_count:14180 },
  { id:'t4', name:'Return Approved',         channel:'email', category:'Transactional', status:'active', langs:['en','ar'], last_sent:'1d ago',  sent_count:2841  },
  { id:'t5', name:'Flash Sale — Eid Promo',  channel:'push',  category:'Marketing',     status:'active', langs:['en','ar'], last_sent:'2d ago',  sent_count:84210 },
  { id:'t6', name:'Abandoned Cart Reminder', channel:'email', category:'Marketing',     status:'active', langs:['en','ar'], last_sent:'4h ago',  sent_count:12480 },
  { id:'t7', name:'Back in Stock',           channel:'push',  category:'Marketing',     status:'active', langs:['en','ar'], last_sent:'6h ago',  sent_count:4210  },
  { id:'t8', name:'New Arrivals This Week',  channel:'email', category:'Marketing',     status:'draft',  langs:['en'],      last_sent:'—',       sent_count:0     },
  { id:'t9', name:'OTP / Verification Code', channel:'sms',   category:'Auth',          status:'active', langs:['en','ar'], last_sent:'12m ago', sent_count:48210 },
  { id:'t10',name:'Payout Processed',        channel:'email', category:'Finance',       status:'active', langs:['en','ar'], last_sent:'3d ago',  sent_count:1240  },
  { id:'t11',name:'Document Expiry Warning', channel:'in_app',category:'Compliance',    status:'active', langs:['en','ar'], last_sent:'1d ago',  sent_count:842   },
  { id:'t12',name:'Loyalty Points Earned',   channel:'push',  category:'Loyalty',       status:'active', langs:['en','ar'], last_sent:'5h ago',  sent_count:22410 },
];
export const CAMPAIGNS = [
  { id:'c1', name:'Eid Al-Adha 2025 — Flash Sale', channels:['push','email','sms'], status:'scheduled', scheduled:'Jun 4, 2025 10:00 GST', audience:'All AE + SA customers', sent:null,   open_rate:null, ctr:null, conversions:null },
  { id:'c2', name:'Ramadan Re-engagement',          channels:['email','push'],       status:'sent',      scheduled:'Mar 1, 2025',          audience:'Dormant 60d+ AE/SA',    sent:24180,  open_rate:38.4, ctr:12.1, conversions:1841 },
  { id:'c3', name:'New Arrivals — June Drop',       channels:['push','in_app'],      status:'sent',      scheduled:'Jun 1, 2025',          audience:'All active customers',  sent:58420,  open_rate:44.2, ctr:18.4, conversions:3214 },
  { id:'c4', name:'EG Market Launch',               channels:['email','sms','push'], status:'sent',      scheduled:'Feb 15, 2025',         audience:'EG customers + leads',  sent:18410,  open_rate:31.2, ctr:9.8,  conversions:821 },
  { id:'c5', name:'Win-Back: Inactive 90d',         channels:['email'],              status:'draft',     scheduled:'—',                    audience:'Inactive 90d all mkts', sent:null,   open_rate:null, ctr:null, conversions:null },
  { id:'c6', name:'Summer Sale — All Markets',      channels:['push','email'],       status:'running',   scheduled:'Jun 5–30, 2025',       audience:'All markets',           sent:142810, open_rate:36.1, ctr:14.8, conversions:8421 },
];
export const AUDIENCE_SEGMENTS = [
  { id:'s1', name:'All Active Customers',       size:84210, markets:['AE','SA','EG','QA'], filters:['status=active'] },
  { id:'s2', name:'AE + SA VIP (Tier Gold+)',   size:4218,  markets:['AE','SA'],           filters:['tier=gold','tier=platinum'] },
  { id:'s3', name:'Abandoned Cart 7d',          size:8420,  markets:['AE','SA','EG'],      filters:['cart_abandoned_days<=7'] },
  { id:'s4', name:'Dormant 60–90d',             size:12480, markets:['AE','SA','EG','QA'], filters:['last_order_days>=60','last_order_days<=90'] },
  { id:'s5', name:'First-time buyers',          size:6241,  markets:['AE','SA','EG'],      filters:['order_count=1'] },
  { id:'s6', name:'High-value (LTV > 2000 AED)',size:2841,  markets:['AE','SA'],           filters:['ltv>=2000'] },
];
export const AB_TESTS = [
  { id:'ab1', name:'Subject line: "Eid" vs "Sale"', campaign:'Eid Al-Adha 2025', status:'running',  variant_a:{ label:'Eid Mubarak — Shop Now', open:42.1 }, variant_b:{ label:'Sale Up to 50% Off', open:38.4 }, winner:null },
  { id:'ab2', name:'Push CTA: "Shop" vs "Explore"', campaign:'June Drop',        status:'complete', variant_a:{ label:'Shop New Arrivals', open:44.8 }, variant_b:{ label:'Explore the Drop', open:39.2 }, winner:'A' },
];
export const DELIVERY_LOG = [
  { id:'d1', template:'Order Confirmed',     recipient:'hessa.al@email.com', channel:'email', status:'delivered', time:'2m ago',  market:'AE' },
  { id:'d2', template:'OTP Code',            recipient:'+971 50 *** 4821',   channel:'sms',   status:'delivered', time:'5m ago',  market:'AE' },
  { id:'d3', template:'Order Shipped',       recipient:'saleha.m@email.com', channel:'email', status:'opened',    time:'12m ago', market:'SA' },
  { id:'d4', template:'Back in Stock',       recipient:'+20 10 *** 8821',    channel:'push',  status:'delivered', time:'18m ago', market:'EG' },
  { id:'d5', template:'Abandoned Cart',      recipient:'tariq.s@email.com',  channel:'email', status:'bounced',   time:'1h ago',  market:'AE' },
  { id:'d6', template:'Loyalty Points',      recipient:'nour.m@email.com',   channel:'push',  status:'clicked',   time:'1h ago',  market:'SA' },
  { id:'d7', template:'New Arrivals — June', recipient:'layla.h@email.com',  channel:'email', status:'opened',    time:'2h ago',  market:'AE' },
  { id:'d8', template:'Payout Processed',    recipient:'vendor@almaz.com',   channel:'email', status:'delivered', time:'3h ago',  market:'AE' },
];
export const STATUS_COLORS = { active:'var(--zg-good)', draft:'var(--zg-text-dim)', scheduled:'var(--zg-accent)', running:'oklch(0.82 0.14 215)', sent:'var(--zg-text-dim)', delivered:'var(--zg-good)', opened:'var(--zg-accent)', clicked:'oklch(0.82 0.14 215)', bounced:'var(--zg-danger)' };
