<script setup>
import { ref, computed } from 'vue';
import { ZCF_PAYOUTS } from '@/data/financeData';

const cap = s => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
const PAYOUT_STATUS_META = {
  processed: { label:'Processed', color:'var(--zg-good)',    bg:'oklch(0.78 0.15 150 / 0.1)' },
  pending:   { label:'Pending',   color:'var(--zg-warn)',    bg:'oklch(0.82 0.15 75 / 0.1)' },
  on_hold:   { label:'On Hold',   color:'var(--zg-danger)',  bg:'oklch(0.70 0.18 25 / 0.1)' },
  failed:    { label:'Failed',    color:'var(--zg-danger)',  bg:'oklch(0.70 0.18 25 / 0.1)' },
  upcoming:  { label:'Upcoming',  color:'oklch(0.82 0.14 215)', bg:'oklch(0.82 0.14 215 / 0.1)' },
};
const payoutMeta = s => PAYOUT_STATUS_META[s] || PAYOUT_STATUS_META.pending;

const payoutFilter   = ref('all');
const payoutDetail   = ref(null);
const payoutStatuses = ['all','processed','pending','on_hold','failed','upcoming'];
const filteredPayouts = computed(() =>
  payoutFilter.value === 'all' ? ZCF_PAYOUTS : ZCF_PAYOUTS.filter(p => p.status === payoutFilter.value)
);
const payoutCounts = computed(() => {
  const out = {};
  payoutStatuses.forEach(s => { if (s !== 'all') out[s] = ZCF_PAYOUTS.filter(p => p.status === s).length; });
  return out;
});
</script>

<template>
    <div class="zf-filter-row" style="margin-bottom:8px;justify-content:space-between;flex-wrap:wrap;">
      <div style="display:flex;gap:5px;flex-wrap:wrap;">
        <button v-for="s in payoutStatuses" :key="s" class="zen-filter-chip" :class="{ 'is-on': payoutFilter === s }" @click="payoutFilter = s">
          {{ cap(s) }}<span v-if="s!=='all' && payoutCounts[s]" style="margin-left:4px;opacity:0.7">{{ payoutCounts[s] }}</span>
        </button>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="zwh-btn-ghost" style="height:26px;font-size:11px;" @click="">Export Payout File</button>
        <button class="zwh-btn-primary" style="height:26px;font-size:11px;" @click="">Process All Pending</button>
      </div>
    </div>
    <div class="zf-payout-table">
      <div class="zf-payout-head"><span>Payout ID</span><span>Vendor</span><span>Market</span><span>Bank</span><span>Orders</span><span>Commission</span><span>Status</span><span>Amount</span><span>Due</span></div>
      <div v-for="p in filteredPayouts" :key="p.id" class="zf-payout-row" style="cursor:pointer;" @click="payoutDetail = p">
        <span class="zf-txn-id">{{ p.id }}</span>
        <span>{{ p.vendor }}</span>
        <span class="zen-pd-ref">{{ p.market }} · {{ p.currency }}</span>
        <span class="zen-pd-ref">{{ p.bank }}</span>
        <span class="zen-pd-ref">{{ p.ordersCount }}</span>
        <span class="zf-amount is-neg">{{ p.currency }} {{ p.commission.toLocaleString() }}</span>
        <span><span class="zf-type-badge" :style="{ background: payoutMeta(p.status).bg, color: payoutMeta(p.status).color }">{{ payoutMeta(p.status).label }}</span></span>
        <span class="zf-amount is-pos">{{ p.currency }} {{ p.amount.toLocaleString() }}</span>
        <span class="zen-pd-date">{{ p.dueDate }}</span>
      </div>
    </div>

    <!-- Payout Detail Panel -->
    <Teleport to="body">
      <div v-if="payoutDetail" style="position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.4);" @click="payoutDetail = null">
        <div style="position:fixed;top:0;right:0;bottom:0;width:420px;background:var(--zg-bg-elev);border-left:1px solid var(--zg-line);display:flex;flex-direction:column;z-index:501;" @click.stop>
          <div style="padding:16px 20px;border-bottom:1px solid var(--zg-line);display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <div style="font-size:14px;font-weight:700;color:var(--zg-text);">{{ payoutDetail.id }}</div>
              <div style="font-size:11.5px;color:var(--zg-text-dim);margin-top:2px;">{{ payoutDetail.vendor }} · {{ payoutDetail.market }}</div>
            </div>
            <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim);" @click="payoutDetail = null">×</button>
          </div>
          <div style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;">
              <div>
                <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:4px;">Payout Amount</div>
                <div style="font-family:var(--zg-mono);font-size:24px;font-weight:800;color:var(--zg-accent);">{{ payoutDetail.currency }} {{ payoutDetail.amount.toLocaleString() }}</div>
              </div>
              <span style="height:24px;padding:0 10px;border-radius:4px;font-size:11px;font-weight:700;display:flex;align-items:center;" :style="{ background: payoutMeta(payoutDetail.status).bg, color: payoutMeta(payoutDetail.status).color }">{{ payoutMeta(payoutDetail.status).label }}</span>
            </div>
            <div style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px 14px;display:grid;grid-template-columns:auto 1fr;gap:6px 16px;">
              <template v-for="([l,v]) in [['Vendor',payoutDetail.vendor],['Bank',payoutDetail.bank],['Market',payoutDetail.market],['Currency',payoutDetail.currency],['Due Date',payoutDetail.dueDate],['Orders',payoutDetail.ordersCount],['Commission',`${payoutDetail.currency} ${payoutDetail.commission?.toLocaleString()}`]]" :key="l">
                <span style="font-size:11px;color:var(--zg-text-dim);">{{ l }}</span>
                <span style="font-size:12px;font-weight:500;color:var(--zg-text);text-align:right;">{{ v }}</span>
              </template>
            </div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button v-if="payoutDetail.status === 'pending'" class="zwh-btn-primary" @click="">Process Payout</button>
            <button class="zwh-btn-ghost" @click="">Export</button>
            <button class="zwh-btn-ghost" @click="payoutDetail = null">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
</template>
