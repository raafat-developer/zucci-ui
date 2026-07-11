<script setup>
import { ref } from 'vue';

const props = defineProps({ entity: { type: Object, required: true } });

const copied = ref('');
const editingNotes = ref(false);
const notes = ref(props.entity.internalNotes || '');

function copy(val, key) {
  navigator.clipboard?.writeText(val||'');
  copied.value = key;
  setTimeout(() => (copied.value = ''), 1400);
}

const fmtAed = n => n >= 1000 ? 'AED ' + (n/1000).toFixed(0) + 'K' : 'AED ' + (n||0);
const DOC_STATUS = {
  active:  { label:'Valid',    color:'var(--zg-good)',    bg:'oklch(0.78 0.15 150 / 0.15)' },
  warning: { label:'Expiring', color:'var(--zg-warn)',    bg:'oklch(0.82 0.15 75 / 0.12)' },
  expired: { label:'Expired',  color:'var(--zg-danger)',  bg:'oklch(0.70 0.18 25 / 0.10)' },
};
const ds = s => DOC_STATUS[s] || DOC_STATUS.active;
const MKT_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', QA:'🇶🇦', KW:'🇰🇼', BH:'🇧🇭', OM:'🇴🇲' };
const MKT_NAMES = { AE:'UAE', SA:'KSA', EG:'Egypt', QA:'Qatar', KW:'Kuwait', BH:'Bahrain', OM:'Oman' };
const mktCls = s => s === 'approved' ? 'zen-mkt-pill--active' : s === 'pending' ? 'zen-mkt-pill--pending' : 'zen-mkt-pill--inactive';
const p = props.entity.performance || {};
const b = props.entity.bank || {};
const c = props.entity.contract || {};
const r = props.entity.registration || {};
const d = props.entity.contactDetails || {};
</script>

<template>
  <div class="zen-overview">
    <!-- Stats strip -->
    <div class="zen-stats-strip">
      <div class="zen-stats-date">
        <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="1" y="2" width="12" height="11" rx="1.5"/><line x1="1" y1="5" x2="13" y2="5"/><line x1="4" y1="1" x2="4" y2="3"/><line x1="10" y1="1" x2="10" y2="3"/></svg>
        Last 30 days
      </div>
      <div v-for="[lbl, val] in [['Total orders', entity.stats?.totalOrders], ['Ordered over time', entity.stats?.orderedOverTime], ['Returns', entity.stats?.returns], ['Fulfilled over time', entity.stats?.fulfilledOverTime], ['Delivered over time', entity.stats?.deliveredOverTime], ['Time to fulfill', (entity.stats?.timeToFulfill||0)+' Min']]" :key="lbl" class="zen-stat-cell">
        <div class="zen-stat-label">{{ lbl }}</div>
        <div class="zen-stat-val">{{ val ?? '—' }}</div>
      </div>
    </div>

    <!-- Three-column cards -->
    <div class="zen-grid-3">
      <!-- Registration -->
      <div class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title">Registration Details</span><button class="zen-card-edit">✏</button></div>
        <div v-if="r.commercialId" class="zen-reg-field">
          <div class="zen-field-label">Commercial ID #</div>
          <div class="zen-field-val-row">
            <span class="zen-field-mono">{{ r.commercialId }}</span>
            <span class="zen-doc-status" :style="{ background:ds(r.commercialStatus).bg, color:ds(r.commercialStatus).color }"><span class="zen-doc-dot" :style="{ background:ds(r.commercialStatus).color }" />{{ ds(r.commercialStatus).label }}</span>
            <button class="zen-copy-btn" @click="copy(r.commercialId, 'cid')">{{ copied==='cid' ? '✓' : '⎘' }}</button>
          </div>
        </div>
        <div class="zen-reg-field">
          <div class="zen-field-label">Tax ID #</div>
          <div class="zen-field-val-row">
            <span class="zen-field-mono">{{ r.taxId }}</span>
            <span class="zen-doc-status" :style="{ background:ds(r.taxStatus).bg, color:ds(r.taxStatus).color }"><span class="zen-doc-dot" :style="{ background:ds(r.taxStatus).color }" />{{ ds(r.taxStatus).label }}</span>
            <button class="zen-copy-btn" @click="copy(r.taxId, 'tid')">{{ copied==='tid' ? '✓' : '⎘' }}</button>
          </div>
        </div>
        <div v-if="r.vatId" class="zen-reg-field">
          <div class="zen-field-label">VAT ID #</div>
          <div class="zen-field-val-row">
            <span class="zen-field-mono">{{ r.vatId }}</span>
            <span class="zen-doc-status" :style="{ background:ds(r.vatStatus).bg, color:ds(r.vatStatus).color }"><span class="zen-doc-dot" :style="{ background:ds(r.vatStatus).color }" />{{ ds(r.vatStatus).label }}</span>
            <button class="zen-copy-btn" @click="copy(r.vatId, 'vid')">{{ copied==='vid' ? '✓' : '⎘' }}</button>
          </div>
        </div>
        <div class="zen-reg-field"><div class="zen-field-label">Registration Type</div><div class="zen-field-val">{{ r.regType }}</div></div>
      </div>

      <!-- Owners -->
      <div class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title">Owners and Contacts</span><button class="zen-card-edit">✏</button></div>
        <div v-if="entity.owners" v-for="owner in entity.owners" :key="owner.id" class="zen-owner-card">
          <div class="zen-owner-avatar" :style="{ background:entity.color+'22', color:entity.color }">{{ owner.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() }}</div>
          <div class="zen-owner-info">
            <div class="zen-owner-name">{{ owner.name }}</div>
            <div class="zen-owner-meta">
              <span class="zen-owner-role">{{ owner.role }}</span>
              <span class="zen-owner-pct zen-owner-pct--bar">
                <span class="zen-owner-pct-fill" :style="{ width: owner.ownership+'%' }" />
                <span class="zen-owner-pct-label">{{ owner.ownership }}%</span>
              </span>
            </div>
          </div>
          <div class="zen-contact-actions">
            <button class="zen-act-btn" title="Call">📞</button>
            <button class="zen-act-btn" title="Email">✉</button>
          </div>
        </div>
        <div v-else-if="entity.contacts?.primary" class="zen-contact-block">
          <div class="zen-contact-type">Primary Contact</div>
          <div class="zen-contact-name">{{ entity.contacts.primary.name }}</div>
        </div>
      </div>

      <!-- Contact Details -->
      <div class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title">Contact Details</span><button class="zen-card-edit">✏</button></div>
        <div v-if="d.email" class="zen-cd-field"><div class="zen-field-label">Email</div><div class="zen-field-val-row"><span class="zen-cd-val">{{ d.email }}</span><button class="zen-copy-btn" @click="copy(d.email,'em')">{{ copied==='em'?'✓':'⎘' }}</button></div></div>
        <div v-if="d.altEmail" class="zen-cd-field"><div class="zen-field-label">Alt Email</div><div class="zen-field-val-row"><span class="zen-cd-val">{{ d.altEmail }}</span><button class="zen-copy-btn" @click="copy(d.altEmail,'em2')">{{ copied==='em2'?'✓':'⎘' }}</button></div></div>
        <div v-if="d.mobile" class="zen-cd-field"><div class="zen-field-label">Mobile</div><div class="zen-field-val-row"><span class="zen-cd-val zen-field-mono">{{ d.mobile }}</span><button class="zen-copy-btn" @click="copy(d.mobile,'mob')">{{ copied==='mob'?'✓':'⎘' }}</button></div></div>
        <div v-if="d.altMobile" class="zen-cd-field"><div class="zen-field-label">Alt Mobile</div><div class="zen-field-val-row"><span class="zen-cd-val zen-field-mono">{{ d.altMobile }}</span><button class="zen-copy-btn" @click="copy(d.altMobile,'mob2')">{{ copied==='mob2'?'✓':'⎘' }}</button></div></div>
      </div>
    </div>

    <!-- Performance strip -->
    <div class="zen-perf-strip">
      <div class="zen-perf-cell zen-perf-cell--accent"><div class="zen-perf-lbl">GMV This Month</div><div class="zen-perf-val">{{ fmtAed(p.gmvMonth) }}</div></div>
      <div class="zen-perf-cell"><div class="zen-perf-lbl">GMV All Time</div><div class="zen-perf-val">{{ fmtAed(p.gmvAllTime) }}</div></div>
      <div class="zen-perf-cell"><div class="zen-perf-lbl">Avg Order Value</div><div class="zen-perf-val">AED {{ p.avgOrderValue || 0 }}</div></div>
      <div class="zen-perf-cell"><div class="zen-perf-lbl">Return Rate</div><div class="zen-perf-val" :class="{ 'is-warn': (p.returnRate||0) > 5 }">{{ p.returnRate || 0 }}%</div></div>
      <div class="zen-perf-cell"><div class="zen-perf-lbl">Fulfillment Rate</div><div class="zen-perf-val" :class="(p.fulfillRate||0) < 95 ? 'is-warn' : 'is-good'">{{ p.fulfillRate || 0 }}%</div></div>
      <div class="zen-perf-cell"><div class="zen-perf-lbl">Seller Score</div><div class="zen-perf-val"><span class="zen-seller-score" :class="(p.sellerScore||0)>=90?'is-great':(p.sellerScore||0)>=75?'is-good':'is-warn'">{{ p.sellerScore || 0 }}</span><span class="zen-perf-sub">/100</span></div></div>
    </div>

    <!-- Bank + Contract -->
    <div class="zen-grid-2">
      <div class="zen-card">
        <div class="zen-card-head">
          <span class="zen-card-title">Bank &amp; Payout Details</span>
          <span :class="`zen-bank-verify-badge ${b.verifiedStatus === 'verified' ? 'is-verified' : 'is-pending'}`">{{ b.verifiedStatus === 'verified' ? 'Verified' : 'Pending' }}</span>
        </div>
        <div v-if="b.bankName" style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">
          <div v-for="[lbl,val] in [['Bank', b.bankName],['Account Name', b.accountName],['IBAN', b.iban],['SWIFT', b.swift],['Currency', b.currency]]" :key="lbl" class="zen-cd-field">
            <div class="zen-field-label">{{ lbl }}</div>
            <div class="zen-field-val-row">
              <span class="zen-field-mono" style="font-size:11px;">{{ val }}</span>
              <button class="zen-copy-btn" @click="copy(val, 'b-'+lbl)">{{ copied==='b-'+lbl?'✓':'⎘' }}</button>
            </div>
          </div>
        </div>
        <div v-else style="font-size:12px;color:var(--zg-text-dim);padding:8px 0;">No bank details on file</div>
      </div>

      <div class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title">Contract</span><span class="zen-bst" :class="c.status==='active'?'zen-bst--active':'zen-bst--inactive'">{{ c.status }}</span></div>
        <div v-if="c.type" style="display:flex;flex-direction:column;gap:6px;margin-top:4px;">
          <div v-for="[lbl,val] in [['Type', c.type],['Start Date', c.startDate],['Renewal', c.renewalDate],['Commission', c.commissionTier],['Signed By', c.signedBy]]" :key="lbl" class="zen-cd-field">
            <div class="zen-field-label">{{ lbl }}</div>
            <div class="zen-field-val">{{ val }}</div>
          </div>
          <div v-if="c.notes" style="font-size:11px;color:var(--zg-text-dim);background:var(--zg-panel-hi);padding:6px 8px;border-radius:4px;margin-top:4px;">{{ c.notes }}</div>
        </div>
      </div>
    </div>

    <!-- Market approvals -->
    <div v-if="entity.marketApprovals?.length" class="zen-card">
      <div class="zen-card-head"><span class="zen-card-title">Market Approvals</span></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">
        <span v-for="m in entity.marketApprovals" :key="m.code" :class="`zen-mkt-pill ${mktCls(m.status)}`">
          {{ MKT_FLAGS[m.code] || '' }} {{ MKT_NAMES[m.code] || m.code }}
        </span>
      </div>
    </div>

    <!-- Internal Notes -->
    <div class="zen-card">
      <div class="zen-card-head">
        <span class="zen-card-title">Internal Notes</span>
        <button class="zen-card-edit" @click="editingNotes = !editingNotes">{{ editingNotes ? 'Save' : '✏' }}</button>
      </div>
      <textarea v-if="editingNotes" v-model="notes"
        style="width:100%;min-height:80px;padding:8px 10px;resize:vertical;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box;" />
      <p v-else style="font-size:12px;color:var(--zg-text-mid);line-height:1.6;margin:6px 0 0;">{{ notes || 'No internal notes.' }}</p>
    </div>
  </div>
</template>
