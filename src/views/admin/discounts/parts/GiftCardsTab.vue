<script setup>
/**
 * GiftCardsTab — issued gift cards list + bulk issuance. Faithful port of
 * GiftCardsTab from zucci-discounts.jsx (sample dataset preserved).
 */
import { ref, computed } from 'vue';
import { toast } from '@/composables/useToast';

const SAMPLE_GC = [
  { code:'GC-EID2025-001', recipient:'Hessa Al Mansoori', amount:200, currency:'AED', balance:150, status:'active', expiry:'Dec 31, 2025', issued:'Jun 1, 2025' },
  { code:'GC-EID2025-002', recipient:'Ahmed Khalil', amount:500, currency:'AED', balance:500, status:'active', expiry:'Dec 31, 2025', issued:'Jun 1, 2025' },
  { code:'GC-VIP-003', recipient:'Nora Al Rashidi', amount:1000, currency:'AED', balance:0, status:'used', expiry:'Mar 1, 2025', issued:'Jan 1, 2025' },
  { code:'GC-PROMO-004', recipient:'Layla Hassan', amount:150, currency:'AED', balance:150, status:'active', expiry:'Sep 30, 2025', issued:'May 15, 2025' },
  { code:'GC-BDAY-005', recipient:'Sara Medhat', amount:300, currency:'AED', balance:300, status:'active', expiry:'Jun 30, 2026', issued:'Jun 3, 2025' },
];
const STATUS_C = { active:'var(--zg-good)', used:'var(--zg-text-dim)', expired:'var(--zg-danger)' };
const codes = ref([...SAMPLE_GC]);
const totalIssued = computed(() => codes.value.reduce((s, c) => s + c.amount, 0));
const totalBalance = computed(() => codes.value.reduce((s, c) => s + c.balance, 0));
const voidCard = (code) => { codes.value = codes.value.map((x) => (x.code === code ? { ...x, status:'expired' } : x)); toast.warn('Gift card deactivated'); };
</script>

<template>
  <div class="zcd-tab-body">
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">
      <div v-for="[l, v, cls] in [['Total Gift Cards', codes.length, ''],['Active', codes.filter((c) => c.status === 'active').length, 'is-good'],['Total Issued', 'AED ' + totalIssued.toLocaleString(), 'is-accent'],['Outstanding Balance', 'AED ' + totalBalance.toLocaleString(), 'is-warn']]" :key="l" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:12px 14px">
        <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px">{{ l }}</div>
        <div style="font-family:var(--zg-mono);font-size:18px;font-weight:800" :style="{ color: cls === 'is-accent' ? 'var(--zg-accent)' : cls === 'is-good' ? 'var(--zg-good)' : cls === 'is-warn' ? 'var(--zg-warn)' : 'var(--zg-text)' }">{{ v }}</div>
      </div>
    </div>
    <div style="display:flex;gap:6px;margin-bottom:12px">
      <button class="zwh-btn-primary" @click="toast.success('Bulk issuance form opening…')">+ Bulk Issue Gift Cards</button>
      <button class="zwh-btn-ghost" @click="toast.info('Create single gift card')">Issue Single Card</button>
      <button class="zwh-btn-ghost" @click="toast.success('Exported to CSV')">Export CSV</button>
    </div>
    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
      <div style="display:grid;grid-template-columns:130px 1fr 70px 70px 70px 80px 80px 60px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;gap:8px">
        <span>Code</span><span>Recipient</span><span>Value</span><span>Balance</span><span>Status</span><span>Expiry</span><span>Issued</span><span>Actions</span>
      </div>
      <div v-for="(c, i) in codes" :key="c.code" :style="{ display:'grid', gridTemplateColumns:'130px 1fr 70px 70px 70px 80px 80px 60px', padding:'9px 14px', background: i % 2 === 0 ? 'var(--zg-panel)' : 'var(--zg-bg)', borderBottom:'1px solid var(--zg-line-soft)', alignItems:'center', fontSize:'12px', gap:'8px' }">
        <span style="font-family:var(--zg-mono);font-size:10.5px;font-weight:700;color:var(--zg-accent)">{{ c.code }}</span>
        <span style="font-weight:500;color:var(--zg-text)">{{ c.recipient }}</span>
        <span style="font-family:var(--zg-mono);font-size:11px">{{ c.amount }}</span>
        <span :style="{ fontFamily:'var(--zg-mono)', fontSize:'11px', color: c.balance === 0 ? 'var(--zg-text-dim)' : c.balance < c.amount * 0.2 ? 'var(--zg-warn)' : 'var(--zg-text)', fontWeight:600 }">{{ c.balance }}</span>
        <span style="font-size:11px;font-weight:700;text-transform:capitalize" :style="{ color: STATUS_C[c.status] || 'var(--zg-text-dim)' }">{{ c.status }}</span>
        <span style="font-size:10.5px;color:var(--zg-text-dim)">{{ c.expiry }}</span>
        <span style="font-size:10.5px;color:var(--zg-text-dim)">{{ c.issued }}</span>
        <div style="display:flex;gap:3px">
          <button class="zcat-act" @click="toast.info('View card details')">View</button>
          <button v-if="c.status === 'active'" class="zcat-act danger" @click="voidCard(c.code)">Void</button>
        </div>
      </div>
    </div>
  </div>
</template>
