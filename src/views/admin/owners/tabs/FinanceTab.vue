<script setup>
import { ref } from 'vue';
const props = defineProps({ entity: { type: Object, required: true } });
const payouts = ref([...(props.entity.payouts || [])]);
const STATUS_CLS = { processed:'zen-bst--active', pending:'zen-bst--pending', on_hold:'zen-bst--suspended', failed:'zen-bst--suspended' };
const fmtCur = (n, c) => `${c} ${Number(n).toLocaleString()}`;
</script>
<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar">
      <div class="zen-tab-toolbar-title">Payouts</div>
      <div style="display:flex;gap:6px;">
        <button class="zen-doc-card-btn">Export</button>
        <button class="zen-btn-primary">+ Manual Payout</button>
      </div>
    </div>
    <!-- Bank summary -->
    <div v-if="entity.bank" class="zen-card" style="margin-bottom:12px;">
      <div class="zen-card-head">
        <span class="zen-card-title">Payout Account</span>
        <span class="zen-bst" :class="entity.bank.verifiedStatus === 'verified' ? 'zen-bst--active' : 'zen-bst--pending'">{{ entity.bank.verifiedStatus }}</span>
      </div>
      <div style="display:flex;gap:20px;flex-wrap:wrap;margin-top:8px;font-size:12px;">
        <div><div style="font-size:10px;color:var(--zg-text-dim);margin-bottom:2px;">Bank</div><div style="color:var(--zg-text);font-weight:600;">{{ entity.bank.bankName }}</div></div>
        <div><div style="font-size:10px;color:var(--zg-text-dim);margin-bottom:2px;">IBAN</div><div style="font-family:var(--zg-mono);color:var(--zg-text);">{{ entity.bank.iban }}</div></div>
        <div><div style="font-size:10px;color:var(--zg-text-dim);margin-bottom:2px;">Currency</div><div style="font-family:var(--zg-mono);color:var(--zg-text);">{{ entity.bank.currency }}</div></div>
      </div>
    </div>
    <!-- Payouts table -->
    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
      <div style="display:grid;grid-template-columns:100px 100px 1fr 100px 70px 80px;gap:10px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;">
        <span>ID</span><span>Cycle</span><span>Method / Ref</span><span class="right">Amount</span><span>Date</span><span>Status</span>
      </div>
      <div v-for="p in payouts" :key="p.id" style="display:grid;grid-template-columns:100px 100px 1fr 100px 70px 80px;gap:10px;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);align-items:center;font-size:12px;">
        <span style="font-family:var(--zg-mono);font-size:10.5px;">{{ p.id }}</span>
        <span style="color:var(--zg-text);">{{ p.cycle }}</span>
        <div><div style="font-size:11.5px;color:var(--zg-text);">{{ p.method }}</div><div style="font-size:10px;font-family:var(--zg-mono);color:var(--zg-text-dim);">{{ p.ref }}</div></div>
        <span style="font-family:var(--zg-mono);font-weight:600;color:var(--zg-accent);text-align:right;">{{ fmtCur(p.amount, p.currency) }}</span>
        <span style="font-size:11px;color:var(--zg-text-dim);">{{ p.date }}</span>
        <span :class="`zen-bst ${STATUS_CLS[p.status]||'zen-bst--inactive'}`">{{ p.status }}</span>
      </div>
      <div v-if="!payouts.length" style="padding:24px;text-align:center;font-size:12px;color:var(--zg-text-dim);">No payouts yet</div>
    </div>
  </div>
</template>
