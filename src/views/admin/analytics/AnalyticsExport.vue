<script setup>
const EXPORTS = [
  { label:'GMV & Revenue Report',          desc:'Monthly GMV, net revenue, refunds by market',                       format:'CSV / XLSX', icon:'chart' },
  { label:'Orders Report',                 desc:'All orders with status, market, brand, amount, dates',               format:'CSV',        icon:'box' },
  { label:'Customer Behaviour Report',     desc:'New vs returning, LTV by tier, cohort retention, geography',        format:'XLSX',       icon:'people' },
  { label:'Product Performance Report',   desc:'GMV, units sold, return rate, sell-through by product & category',  format:'CSV / XLSX', icon:'tag' },
  { label:'Returns & Refunds Report',      desc:'Return reasons, resolution time, financial impact by market',       format:'CSV',        icon:'undo' },
  { label:'Market Comparison Report',      desc:'Side-by-side KPIs for AE, SA, EG, QA, KW, BH, OM',                format:'XLSX',       icon:'globe' },
  { label:'Vendor Payout Report',          desc:'Commission, payouts, disputes per vendor per market',               format:'CSV / XLSX', icon:'coin' },
  { label:'SLA & Fulfilment Report',       desc:'On-time delivery, carrier performance, warehouse SLA',              format:'CSV',        icon:'truck' },
  { label:'Financial Summary',             desc:'Revenue, COGS, gross margin, net margin by period and market',      format:'XLSX',       icon:'percent' },
  { label:'Custom Date Range Export',      desc:'Build a custom report for any metric, date range, and market',      format:'CSV / XLSX', icon:'calendar' },
];

const ICON_PATHS = {
  chart:   'M4 20V4 M4 20H20 M8 16V12 M12 16V8 M16 16V10 M20 16V6',
  box:     'M3 7L12 3L21 7V17L12 21L3 17Z M3 7L12 11L21 7 M12 11V21',
  people:  'M9 9m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M3 19C3 15 6 13 9 13C12 13 15 15 15 19',
  tag:     'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z',
  undo:    'M3 7V3H7M3 7a6 6 0 100 2',
  globe:   'M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c-2.7 4-2.7 16 0 20m0-20c2.7 4 2.7 16 0 20M2 12h20',
  coin:    'M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M12 7V17',
  truck:   'M1 5h11v11H1zM12 8h3l2.5 3v5h-5.5V8z',
  percent: 'M19 5L5 19 M6.5 6.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0 M17.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  calendar:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
};
</script>

<template>
  <div style="padding:16px 20px;background:#0E1013;min-height:100%;">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6B7280;margin-bottom:14px;">Available Reports</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px;">
      <div v-for="exp in EXPORTS" :key="exp.label"
        style="background:#15171B;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <div style="width:32px;height:32px;border-radius:6px;background:rgba(163,230,53,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg viewBox="0 0 24 24" width="16" fill="none" stroke="#A3E635" stroke-width="1.6" stroke-linecap="round">
              <path :d="ICON_PATHS[exp.icon]" />
            </svg>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:12.5px;font-weight:700;color:#D1D5DB;margin-bottom:3px;">{{ exp.label }}</div>
            <div style="font-size:11px;color:#6B7280;line-height:1.4;">{{ exp.desc }}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px;">
          <span style="font-size:10px;padding:2px 7px;border-radius:3px;background:rgba(255,255,255,0.06);color:#9CA3AF;font-family:monospace;">{{ exp.format }}</span>
          <button style="height:28px;padding:0 12px;border:none;border-radius:6px;background:#A3E635;color:#0E1013;font-weight:700;font-size:11.5px;cursor:pointer;display:flex;align-items:center;gap:5px;" @click="">
            Export
            <svg viewBox="0 0 14 14" width="10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 1v8M4 7l3 3 3-3M2 12h10"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
