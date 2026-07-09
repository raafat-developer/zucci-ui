<script setup>
import { ZCF_GATEWAYS } from '@/data/financeData';
</script>

<template>
    <div class="zf-section-title">{{ ZCF_GATEWAYS.length }} payment gateways</div>
    <div class="zf-gateway-grid">
      <div v-for="gw in ZCF_GATEWAYS" :key="gw.id" class="zf-gw-card"
        :class="{ 'is-discrepancy': gw.discrepancy > 0, 'is-pending': gw.discrepancy === 0 && gw.pending > 0 }">
        <div class="zf-gw-head">
          <div>
            <div class="zf-gw-name">{{ gw.name }}</div>
            <div class="zf-gw-meta">
              <span class="zen-brand-cat-tag">{{ gw.type }}</span>
              <span v-for="m in gw.markets" :key="m" class="zen-brand-cat-tag">{{ m }}</span>
            </div>
          </div>
          <span v-if="gw.discrepancy > 0" class="zen-bst zen-bst--suspended">Discrepancy</span>
          <span v-else-if="gw.pending > 0" class="zen-bst zen-bst--pending">Pending</span>
          <span v-else class="zen-bst zen-bst--active">Settled</span>
        </div>
        <div class="zf-gw-stats">
          <div><div class="zf-kpi-lbl">Volume</div><div class="zf-gw-val">{{ gw.volume.toLocaleString() }}</div></div>
          <div><div class="zf-kpi-lbl">Transactions</div><div class="zf-gw-val">{{ gw.txnCount.toLocaleString() }}</div></div>
          <div><div class="zf-kpi-lbl">Fees</div><div class="zf-gw-val is-neg">{{ gw.fees.toLocaleString() }}</div></div>
          <div v-if="gw.collectionRate"><div class="zf-kpi-lbl">Collection Rate</div><div class="zf-gw-val" :class="gw.collectionRate < 90 ? 'is-warn' : 'is-good'">{{ gw.collectionRate }}%</div></div>
          <div v-if="gw.discrepancy > 0"><div class="zf-kpi-lbl">Discrepancy</div><div class="zf-gw-val is-neg">{{ gw.discrepancy.toLocaleString() }}</div></div>
          <div v-if="gw.pending > 0"><div class="zf-kpi-lbl">Pending</div><div class="zf-gw-val is-warn">{{ gw.pending.toLocaleString() }}</div></div>
        </div>
        <div v-if="gw.lastSettlement" class="zf-gw-footer">Last settlement: {{ gw.lastSettlement }}</div>
      </div>
    </div>
</template>
