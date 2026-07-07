// ticketsData.js — Tickets module data (ES module port of zucci-tickets.jsx).
export const ZC_TICKETS = [
  { id:'TKT-4821', subject:'Commercial Registry renewal required', cat:'KYC/KYB', priority:'high',    status:'open',           assignee:'Sara Medhat',  team:'Compliance',  entity:'24K Fashion House LLC', market:'AE', created:'Jun 3, 2025', updated:'2h ago', sla_hours:2,    sla_remaining:0.5, order_ref:null,       tags:['document','renewal'] },
  { id:'TKT-4820', subject:'Payout not received for May cycle',    cat:'Finance', priority:'critical', status:'open',           assignee:'Ahmed Khalil', team:'Finance',     entity:'Almaz Couture',        market:'AE', created:'Jun 2, 2025', updated:'4h ago', sla_hours:24,   sla_remaining:-4,  order_ref:null,       tags:['payout','finance'] },
  { id:'TKT-4819', subject:'Product image rejected — wrong dimensions', cat:'Brand', priority:'medium', status:'in_progress',  assignee:'Omar Hassan',  team:'Merchandise', entity:'909 Designs',          market:'SA', created:'Jun 2, 2025', updated:'6h ago', sla_hours:48,   sla_remaining:8,   order_ref:null,       tags:['product','image'] },
  { id:'TKT-4818', subject:'Duplicate order — request cancellation', cat:'Orders', priority:'high',   status:'in_progress',   assignee:'Sara Medhat',  team:'Operations',  entity:'Aurora Fashion',        market:'AE', created:'Jun 1, 2025', updated:'1h ago', sla_hours:4,    sla_remaining:1,   order_ref:'ORD-18820', tags:['order','cancel'] },
  { id:'TKT-4817', subject:'Brand name change request',            cat:'Brand',   priority:'low',      status:'pending_vendor', assignee:'Omar Hassan',  team:'Merchandise', entity:'5th Avenue Cairo',     market:'EG', created:'May 31, 2025',updated:'1d ago', sla_hours:168,  sla_remaining:120, order_ref:null,       tags:['brand','update'] },
  { id:'TKT-4816', subject:'VAT certificate expired — upload required', cat:'KYC/KYB', priority:'high', status:'resolved',    assignee:'Sara Medhat',  team:'Compliance',  entity:'360 Elegance',         market:'AE', created:'May 30, 2025',updated:'3d ago', sla_hours:24,   sla_remaining:0,   order_ref:null,       tags:['vat','document'],    csat:5 },
  { id:'TKT-4815', subject:'Shopify integration sync error',       cat:'Tech',    priority:'critical', status:'resolved',      assignee:'System',       team:'Tech',        entity:'7 Wonders Wear',       market:'AE', created:'May 29, 2025',updated:'4d ago', sla_hours:8,    sla_remaining:0,   order_ref:null,       tags:['tech','integration'], csat:4 },
  { id:'TKT-4814', subject:'Commission rate dispute — Q2 invoice', cat:'Finance', priority:'medium',   status:'closed',        assignee:'Ahmed Khalil', team:'Finance',     entity:'Amara Threads',        market:'SA', created:'May 28, 2025',updated:'5d ago', sla_hours:48,   sla_remaining:0,   order_ref:null,       tags:['commission','dispute'], csat:3 },
  { id:'TKT-4813', subject:'Wrong item delivered to customer',     cat:'Orders',  priority:'high',     status:'in_progress',   assignee:'Layla Haddad', team:'Operations',  entity:'Bakhoor House',        market:'AE', created:'Jun 2, 2025', updated:'8h ago', sla_hours:8,    sla_remaining:2,   order_ref:'ORD-18817', tags:['order','delivery'] },
  { id:'TKT-4812', subject:'Vendor requested price increase approval', cat:'Brand', priority:'medium', status:'open',          assignee:'Nada Ibrahim', team:'Merchandise', entity:'Coral Collections',    market:'SA', created:'Jun 1, 2025', updated:'2d ago', sla_hours:72,   sla_remaining:48,  order_ref:null,       tags:['pricing','approval'] },
  { id:'TKT-4811', subject:'Return label not generated',           cat:'Orders',  priority:'high',     status:'open',          assignee:'Layla Haddad', team:'Operations',  entity:'Customer: Hessa Al Mansoori', market:'AE', created:'Jun 3, 2025', updated:'30m ago', sla_hours:4, sla_remaining:3, order_ref:'RMA-0891', tags:['return','label'] },
  { id:'TKT-4810', subject:'Customs clearance delay — SA shipment', cat:'Logistics', priority:'high', status:'in_progress',   assignee:'Tariq Saleh',  team:'Operations',  entity:'Desert Kicks',         market:'SA', created:'Jun 1, 2025', updated:'1h ago', sla_hours:24,   sla_remaining:6,   order_ref:'TRF-0221', tags:['customs','shipping'] },
];
export const CANNED = [
  { id:'c1', title:'Request missing document',       body:'Hi {name}, we noticed that your account is missing {document}. Please upload it within {days} days to avoid any service interruption.' },
  { id:'c2', title:'Payout under review',            body:'We have received your payout inquiry. Our finance team is currently reviewing the {month} cycle. Expected resolution: {eta}.' },
  { id:'c3', title:'Product listing update required',body:'Your listing for "{product}" requires the following update: {issue}. Please action this within 48 hours.' },
  { id:'c4', title:'Ticket resolved — closing',      body:'Your ticket has been resolved. If you have further questions, please open a new ticket referencing this ID: {ticket_id}.' },
  { id:'c5', title:'Escalated to senior team',       body:'We have escalated your ticket to our senior {team} team. Expected response time: {eta}.' },
  { id:'c6', title:'Awaiting vendor response',       body:'We are awaiting your response to proceed. Please reply within {days} days or this ticket will be auto-closed.' },
];
export const TIMELINE_DATA = {
  'TKT-4820': [
    { time:'Jun 2, 09:14', user:'System',       action:'Ticket created',                          type:'create' },
    { time:'Jun 2, 09:15', user:'System',       action:'Auto-assigned to Finance team',           type:'assign' },
    { time:'Jun 2, 10:30', user:'Ahmed Khalil', action:'Status changed to In Progress',           type:'status' },
    { time:'Jun 2, 11:00', user:'Ahmed Khalil', action:'Comment: "Checking with finance system"', type:'comment' },
    { time:'Jun 3, 09:00', user:'System',       action:'SLA breached — 24h window exceeded',      type:'sla'    },
    { time:'Jun 3, 09:01', user:'System',       action:'Escalated to Ops Admin',                  type:'escalate' },
  ],
};
export const PRIORITY_META = { critical:{label:'Critical',color:'var(--zg-danger)'}, high:{label:'High',color:'oklch(0.82 0.15 45)'}, medium:{label:'Medium',color:'var(--zg-warn)'}, low:{label:'Low',color:'var(--zg-text-dim)'} };
export const STATUS_META = { open:{label:'Open',color:'var(--zg-accent)'}, in_progress:{label:'In Progress',color:'oklch(0.82 0.14 215)'}, pending_vendor:{label:'Pending Vendor',color:'var(--zg-warn)'}, resolved:{label:'Resolved',color:'var(--zg-good)'}, closed:{label:'Closed',color:'var(--zg-text-dim)'} };
export const CAT_COLORS = { 'KYC/KYB':'var(--zg-accent)', Finance:'var(--zg-warn)', Brand:'oklch(0.82 0.14 215)', Orders:'oklch(0.72 0.15 290)', Tech:'var(--zg-danger)', Logistics:'oklch(0.80 0.14 170)' };
export const TEAMS = ['Compliance','Finance','Operations','Merchandise','Tech','CS'];
export const ASSIGNEES = ['Sara Medhat','Ahmed Khalil','Omar Hassan','Layla Haddad','Nada Ibrahim','Tariq Saleh','Unassigned'];
