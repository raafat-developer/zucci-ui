// discountsShared.js — shared constants for the Discounts & Promotions module.
export const MKT_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', QA:'🇶🇦' };
export const MKT_NAMES = { AE:'UAE', SA:'KSA', EG:'Egypt', QA:'Qatar' };
export const ALL_MARKETS = ['AE','SA','EG','QA'];
export const FUNDING_LABELS = {
  zucci_100:'Zucci 100%', vendor_100:'Vendor 100%', split:'Split',
  partner_100:'Partner 100%', zucci_60_vendor_40:'Zucci 60% / Vendor 40%',
  split_50_50:'50 / 50',
};
export const STATUS_META = {
  active:{label:'Active',color:'var(--zg-good)',bg:'oklch(0.78 0.15 150 / 0.1)'},
  scheduled:{label:'Scheduled',color:'oklch(0.82 0.14 215)',bg:'oklch(0.82 0.14 215 / 0.1)'},
  expired:{label:'Expired',color:'var(--zg-text-dim)',bg:'var(--zg-panel-hi)'},
  pending_approval:{label:'Pending Approval',color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.1)'},
  approved:{label:'Approved',color:'var(--zg-good)',bg:'oklch(0.78 0.15 150 / 0.1)'},
  rejected:{label:'Rejected',color:'var(--zg-danger)',bg:'oklch(0.70 0.18 25 / 0.1)'},
  suggested:{label:'Suggested',color:'oklch(0.72 0.15 290)',bg:'oklch(0.72 0.15 290 / 0.1)'},
  paused:{label:'Paused',color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.08)'},
  planned:{label:'Planned',color:'oklch(0.82 0.14 215)',bg:'oklch(0.82 0.14 215 / 0.1)'},
  pending_legal:{label:'Pending Legal',color:'var(--zg-warn)',bg:'oklch(0.82 0.15 75 / 0.1)'},
  negotiating:{label:'Negotiating',color:'oklch(0.72 0.15 290)',bg:'oklch(0.72 0.15 290 / 0.1)'},
};
