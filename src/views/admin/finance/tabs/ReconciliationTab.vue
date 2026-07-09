<script setup>
import { ZCF_RECONCILIATION } from '@/data/financeData';
</script>

<template>
    <div class="zf-section-title">Gateway Reconciliation</div>
    <div v-for="r in ZCF_RECONCILIATION.filter(r=>r.diff>0)" :key="r.id"
      :class="`zf-alert ${r.status==='discrepancy'?'zf-alert--danger':'zf-alert--warn'}`">
      {{ r.gateway }}: {{ r.diff.toLocaleString() }} discrepancy · {{ r.note }}
      <button class="zen-doc-card-btn" style="margin-left:auto;" @click="">Raise Ticket</button>
    </div>
    <div class="zf-ledger-table">
      <div class="zf-recon-head"><span>ID</span><span>Gateway</span><span>Date</span><span>System</span><span>Gateway</span><span>Diff</span><span>Status</span></div>
      <div v-for="r in ZCF_RECONCILIATION" :key="r.id" class="zf-recon-row">
        <span class="zf-txn-id">{{ r.id }}</span>
        <span>{{ r.gateway }}</span>
        <span class="zen-pd-date">{{ r.date }}</span>
        <span class="zf-amount">{{ r.systemAmount.toLocaleString() }}</span>
        <span class="zf-amount">{{ r.gatewayAmount.toLocaleString() }}</span>
        <span class="zf-amount" :class="r.diff > 0 ? 'is-neg' : ''">{{ r.diff > 0 ? r.diff.toLocaleString() : '—' }}</span>
        <span><span class="zen-bst" :class="r.status==='matched'?'zen-bst--active':r.status==='discrepancy'?'zen-bst--suspended':'zen-bst--pending'">{{ r.status.replace('_',' ') }}</span></span>
      </div>
    </div>
</template>

<style scoped>
.zf-recon-head { display:grid;grid-template-columns:80px 120px 100px 1fr 1fr 80px 90px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;gap:8px; }
.zf-recon-row { display:grid;grid-template-columns:80px 120px 100px 1fr 1fr 80px 90px;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);align-items:center;font-size:12px;gap:8px; }
.zf-recon-row:nth-child(odd) { background:var(--zg-bg); }
</style>
