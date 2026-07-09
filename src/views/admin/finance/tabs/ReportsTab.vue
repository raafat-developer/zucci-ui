<script setup>
const REPORTS = [
  { title:'Vendor Payout File',      desc:'Bulk bank transfer file for all pending payouts. Format per bank (CIB Egypt, ENBD UAE, SNB KSA).',  type:'Excel / CSV',  action:'Generate Payout File' },
  { title:'P&L Statement',           desc:'Revenue, costs, fees, and net margin by market and consolidated. Current month or custom range.',    type:'Excel',        action:'Export P&L' },
  { title:'Transaction Ledger',      desc:'All debits and credits with gateway, market, order ref, vendor, and status.',                         type:'CSV',          action:'Export Ledger' },
  { title:'VAT Report',              desc:'VAT collected and remitted per market. Ready for tax authority submission.',                           type:'Excel / PDF',  action:'Export VAT Report' },
  { title:'Gateway Reconciliation',  desc:'System vs. gateway settlement comparison with discrepancy log.',                                       type:'Excel',        action:'Export Reconciliation' },
  { title:'Chargeback Report',       desc:'All chargebacks and disputes with vendor, order, amount, and resolution status.',                     type:'CSV',          action:'Export Chargebacks' },
  { title:'Bank Info Export',        desc:'All vendor banking details for payout verification. Includes IBAN, SWIFT, bank name, verification.', type:'Excel',        action:'Export Bank Info' },
  { title:'SWIFT MT103 File',        desc:'ISO standard file for international wire transfers to vendor banks.',                                  type:'SWIFT MT103',  action:'Generate SWIFT File' },
  { title:'Refunds Report',          desc:'All refunds issued by market, gateway, vendor, and reason.',                                          type:'CSV',          action:'Export Refunds' },
  { title:'Subscription Revenue',    desc:'Brand tier subscription and Zucci Plus revenue by month.',                                            type:'Excel',        action:'Export Subscriptions' },
];
</script>

<template>
    <div class="zf-report-grid">
      <div v-for="(r, i) in REPORTS" :key="i" class="zf-report-card">
        <div class="zf-report-title">{{ r.title }}</div>
        <div class="zf-report-desc">{{ r.desc }}</div>
        <div class="zf-report-footer">
          <span class="zen-brand-cat-tag">{{ r.type }}</span>
          <button class="zen-btn-primary" style="height:28px;font-size:11.5px;" @click="">
            {{ r.action }}
            <svg viewBox="0 0 14 14" width="10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" style="margin-left:4px;"><path d="M7 1v8M4 7L7 10L10 7M2 12h10"/></svg>
          </button>
        </div>
      </div>
    </div>
</template>

<style scoped>
.zf-report-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;padding:16px; }
.zf-report-card { background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px 16px;display:flex;flex-direction:column;gap:8px; }
.zf-report-title { font-size:13px;font-weight:700;color:var(--zg-text); }
.zf-report-desc { font-size:11.5px;color:var(--zg-text-dim);line-height:1.5;flex:1; }
.zf-report-footer { display:flex;align-items:center;justify-content:space-between;margin-top:4px; }
</style>
