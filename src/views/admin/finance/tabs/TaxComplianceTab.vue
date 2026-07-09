<script setup>
import { ref, computed } from 'vue';
import { ZCF_PL, ZCF_VAT, ZCF_TAX_INTEGRATIONS, ZCF_INVOICE_QUEUE, ZCF_WHT } from '@/data/financeData';

const vatView    = ref('vat');
const vatSubNavs = [['vat','VAT Summary'],['integrations','Tax Integrations'],['invoices','Invoice Queue'],['wht','Withholding Tax']];
const cur = (n, c) => `${c} ${Number(n).toLocaleString()}`;
const TAX_STATUS_META = {
  connected:     { label:'Connected',     color:'var(--zg-good)',    bg:'oklch(0.78 0.15 150 / 0.1)' },
  monitoring:    { label:'Monitoring',    color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.1)' },
  not_connected: { label:'Not Connected', color:'var(--zg-text-dim)', bg:'var(--zg-panel-hi)' },
  error:         { label:'Error',         color:'var(--zg-danger)',  bg:'oklch(0.70 0.18 25 / 0.1)' },
};
const taxStatus = s => TAX_STATUS_META[s] || TAX_STATUS_META.monitoring;
const whtTotals = computed(() => ({
  deducted: ZCF_WHT.filter(w=>w.status==='deducted').reduce((s,w)=>s+w.whtAmount,0),
  pending:  ZCF_WHT.filter(w=>w.status==='pending').reduce((s,w)=>s+w.whtAmount,0),
  upcoming: ZCF_WHT.filter(w=>w.status==='upcoming').reduce((s,w)=>s+w.whtAmount,0),
}));
</script>

<template>
    <div class="zf-filter-row" style="margin-bottom:12px;">
      <button v-for="[id,lbl] in vatSubNavs" :key="id" class="zen-filter-chip" :class="{ 'is-on': vatView === id }" @click="vatView = id">{{ lbl }}</button>
    </div>

    <!-- VAT Summary -->
    <template v-if="vatView === 'vat'">
      <div class="zf-section-title">VAT Status · {{ ZCF_PL.period }}</div>
      <div v-for="v in ZCF_VAT.filter(v=>v.outstanding>0)" :key="v.market" class="zf-alert zf-alert--danger">
        {{ v.name }}: {{ v.currency }} {{ v.outstanding.toLocaleString() }} outstanding · Due {{ v.nextDueDate }}
        <button class="zen-doc-card-btn" style="margin-left:auto;" @click="">File Now</button>
      </div>
      <div class="zf-ledger-table">
        <div class="zf-ledger-head" style="grid-template-columns:1fr 60px 100px 100px 100px 100px 90px">
          <span>Market</span><span>Rate</span><span>Collected</span><span>Remitted</span><span>Outstanding</span><span>Next Due</span><span>Filing</span>
        </div>
        <div v-for="v in ZCF_VAT" :key="v.market" class="zf-ledger-row" style="grid-template-columns:1fr 60px 100px 100px 100px 100px 90px">
          <span><strong>{{ v.name }}</strong></span>
          <span class="zen-pd-ref">{{ v.rate }}%</span>
          <span class="zf-amount is-pos">{{ cur(v.collected, v.currency) }}</span>
          <span class="zf-amount">{{ cur(v.remitted, v.currency) }}</span>
          <span class="zf-amount" :class="{ 'is-neg': v.outstanding > 0 }">{{ v.outstanding > 0 ? cur(v.outstanding, v.currency) : '—' }}</span>
          <span class="zen-pd-date">{{ v.nextDueDate }}</span>
          <span><span class="zen-bst" :class="v.filingStatus==='filed'?'zen-bst--active':v.filingStatus==='pending'?'zen-bst--pending':'zen-bst--inactive'">{{ v.filingStatus }}</span></span>
        </div>
      </div>
    </template>

    <!-- Tax Integrations -->
    <template v-else-if="vatView === 'integrations'">
      <div class="zf-section-title">{{ ZCF_TAX_INTEGRATIONS.length }} tax authority integrations</div>
      <div v-for="t in ZCF_TAX_INTEGRATIONS.filter(t=>t.errors?.length)" :key="t.id" class="zf-alert zf-alert--danger">
        {{ t.name }}: {{ t.errors[0].msg }}
        <button class="zen-doc-card-btn" style="margin-left:auto;" @click="">View Errors</button>
      </div>
      <div class="zf-gateway-grid">
        <div v-for="intg in ZCF_TAX_INTEGRATIONS" :key="intg.id" class="zf-gw-card" :class="{ 'is-discrepancy': intg.errors?.length }">
          <div class="zf-gw-head">
            <div>
              <div class="zf-gw-name">{{ intg.name }} <span class="zen-brand-cat-tag">{{ intg.country }}</span></div>
              <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px;">{{ intg.fullName }}</div>
            </div>
            <span class="zf-type-badge" :style="{ background: taxStatus(intg.status).bg, color: taxStatus(intg.status).color }">{{ taxStatus(intg.status).label }}</span>
          </div>
          <div class="zf-gw-stats">
            <div><div class="zf-kpi-lbl">TRN</div><div class="zf-gw-val" style="font-size:10px;">{{ intg.trn }}</div></div>
            <div><div class="zf-kpi-lbl">Phase</div><div class="zf-gw-val" style="font-size:11px;">{{ intg.phase }}</div></div>
            <div><div class="zf-kpi-lbl">Invoices Cleared</div><div class="zf-gw-val is-good">{{ intg.invoiceQueue.cleared.toLocaleString() }}</div></div>
            <div><div class="zf-kpi-lbl">Queue</div><div class="zf-gw-val" :class="intg.invoiceQueue.pending + intg.invoiceQueue.failed > 0 ? (intg.invoiceQueue.failed > 0 ? 'is-neg' : 'is-warn') : ''">{{ intg.invoiceQueue.pending + intg.invoiceQueue.failed > 0 ? `${intg.invoiceQueue.pending + intg.invoiceQueue.failed} pending` : 'Clear' }}</div></div>
            <div><div class="zf-kpi-lbl">Next Filing</div><div class="zf-gw-val" style="font-size:11px;">{{ intg.nextFiling }}</div></div>
            <div><div class="zf-kpi-lbl">Frequency</div><div class="zf-gw-val" style="font-size:11px;">{{ intg.filingFrequency }}</div></div>
          </div>
          <div class="zf-gw-footer">{{ intg.features.join(' · ') }}</div>
          <div v-if="intg.lastSync !== 'N/A'" class="zf-gw-footer">Last sync: {{ intg.lastSync }}</div>
          <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">
            <button v-if="intg.status==='connected'" class="zen-doc-card-btn" @click="">Sync Now</button>
            <button class="zen-doc-card-btn" @click="">Settings</button>
            <button v-if="intg.invoiceQueue.failed > 0" class="zen-doc-card-btn" style="color:var(--zg-danger);" @click="">Retry Failed</button>
          </div>
        </div>
      </div>
    </template>

    <!-- Invoice Queue -->
    <template v-else-if="vatView === 'invoices'">
      <div class="zf-section-title">E-Invoice Queue · {{ ZCF_INVOICE_QUEUE.filter(i=>i.status==='pending').length }} pending · {{ ZCF_INVOICE_QUEUE.filter(i=>i.status==='failed').length }} failed</div>
      <div v-for="inv in ZCF_INVOICE_QUEUE.filter(i=>i.status==='failed')" :key="inv.id" class="zf-alert zf-alert--danger">
        {{ inv.id }} · {{ inv.error }}
        <button class="zen-doc-card-btn" style="margin-left:auto;" @click="">Retry</button>
      </div>
      <div class="zf-ledger-table">
        <div class="zf-ledger-head" style="grid-template-columns:140px 60px 70px 80px 100px 1fr 100px">
          <span>Invoice ID</span><span>Market</span><span>Authority</span><span>Type</span><span>Amount</span><span>Vendor / Order</span><span>Status</span>
        </div>
        <div v-for="inv in ZCF_INVOICE_QUEUE" :key="inv.id" class="zf-ledger-row" style="grid-template-columns:140px 60px 70px 80px 100px 1fr 100px">
          <span class="zf-txn-id">{{ inv.id }}</span>
          <span class="zen-pd-ref">{{ inv.market }}</span>
          <span class="zen-pd-ref">{{ inv.authority }}</span>
          <span class="zen-pd-ref">{{ inv.type }}</span>
          <span class="zf-amount is-pos">{{ inv.amount }}</span>
          <span class="zf-vendor-ref">{{ inv.vendor }} · {{ inv.ref }}</span>
          <span><span class="zf-type-badge" :style="{ background: inv.status==='cleared'?'oklch(0.78 0.15 150 / 0.1)':inv.status==='failed'?'oklch(0.70 0.18 25 / 0.1)':'oklch(0.82 0.15 75 / 0.1)', color: inv.status==='cleared'?'var(--zg-good)':inv.status==='failed'?'var(--zg-danger)':'var(--zg-warn)' }">{{ inv.status }}</span></span>
        </div>
      </div>
    </template>

    <!-- WHT -->
    <template v-else-if="vatView === 'wht'">
      <div class="zf-section-title">Withholding Tax (WHT) · Egypt 1% on vendor payouts</div>
      <div class="zf-kpi-strip" style="margin-bottom:4px;">
        <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Total WHT Deducted</div><div class="zf-kpi-val">EGP {{ whtTotals.deducted.toLocaleString() }}</div></div>
        <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Pending Deduction</div><div class="zf-kpi-val is-warn">EGP {{ whtTotals.pending.toLocaleString() }}</div></div>
        <div class="zf-kpi-cell"><div class="zf-kpi-lbl">Upcoming</div><div class="zf-kpi-val">EGP {{ whtTotals.upcoming.toLocaleString() }}</div></div>
      </div>
      <div class="zf-ledger-table">
        <div class="zf-ledger-head" style="grid-template-columns:90px 1fr 60px 100px 5% 100px 90px 80px">
          <span>WHT ID</span><span>Vendor</span><span>Mkt</span><span>Payout Ref</span><span>Rate</span><span>Payout Amt</span><span>WHT</span><span>Status</span>
        </div>
        <div v-for="w in ZCF_WHT" :key="w.id" class="zf-ledger-row" style="grid-template-columns:90px 1fr 60px 100px 5% 100px 90px 80px">
          <span class="zf-txn-id">{{ w.id }}</span>
          <span>{{ w.vendor }}</span>
          <span class="zen-pd-ref">{{ w.market }}</span>
          <span class="zf-txn-id">{{ w.payoutId }}</span>
          <span class="zen-pd-ref">{{ w.rate }}%</span>
          <span class="zf-amount">EGP {{ w.payoutAmount.toLocaleString() }}</span>
          <span class="zf-amount is-neg">EGP {{ w.whtAmount }}</span>
          <span><span class="zen-bst" :class="w.status==='deducted'?'zen-bst--active':w.status==='pending'?'zen-bst--pending':'zen-bst--inactive'">{{ w.status }}</span></span>
        </div>
      </div>
    </template>
</template>
