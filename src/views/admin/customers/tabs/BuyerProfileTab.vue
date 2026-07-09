<script setup>
import { ref } from 'vue';
import BuyerScoreRing from '../BuyerScoreRing.vue';
import BuyerTierBadge from '../BuyerTierBadge.vue';

const props = defineProps({ buyer: { type: Object, required: true } });

const notes    = ref(props.buyer.notes || '');
const editNotes = ref(false);

const fieldRows = [
  ['First Name',  () => props.buyer.firstName],
  ['Last Name',   () => props.buyer.lastName],
  ['Email',       () => props.buyer.email,    true],
  ['Phone',       () => props.buyer.phone,    true],
  ['Alt Phone',   () => props.buyer.altPhone, true],
  ['Date of Birth',() => props.buyer.dob],
  ['Gender',      () => props.buyer.gender],
  ['Nationality', () => props.buyer.nationality],
  ['Language',    () => props.buyer.language === 'ar' ? 'Arabic' : 'English'],
  ['Currency',    () => props.buyer.currency],
  ['Registered',  () => props.buyer.registeredDate],
  ['Last Login',  () => props.buyer.lastLogin],
];

const kpis = [
  { lbl:'Total Orders',    val: () => props.buyer.stats.totalOrders },
  { lbl:'Lifetime Value',  val: () => `${props.buyer.currency} ${props.buyer.stats.lifetimeValue.toLocaleString()}` },
  { lbl:'Avg Order Value', val: () => `${props.buyer.currency} ${props.buyer.stats.avgOrderValue}` },
  { lbl:'Return Rate',     val: () => `${props.buyer.stats.returnRate}%`, warn: () => props.buyer.stats.returnRate > 7 },
  { lbl:'Last Order',      val: () => props.buyer.stats.lastOrderDate },
];

const commsPrefs = [
  { lbl:'Email Marketing',    key:'marketingOptIn' },
  { lbl:'SMS Notifications',  key:'smsOptIn' },
  { lbl:'Push Notifications', key:'pushOptIn' },
];

function saveNotes() { editNotes.value = false; }
</script>

<template>
  <div class="zen-tab-body">
    <!-- Score + KPI strip -->
    <div class="byr-profile-strip">
      <BuyerScoreRing :score="buyer.buyerScore" />
      <div class="byr-strip-kpis">
        <div v-for="k in kpis" :key="k.lbl" class="byr-strip-kpi">
          <div class="zen-perf-lbl">{{ k.lbl }}</div>
          <div class="byr-strip-val" :class="{ 'is-warn': k.warn?.() }">{{ k.val() }}</div>
        </div>
      </div>
      <div class="byr-tier-block">
        <BuyerTierBadge :tier="buyer.tier" />
        <span class="byr-status-dot" :class="{ 'is-active': buyer.status === 'active' }">{{ buyer.status }}</span>
      </div>
    </div>

    <!-- Personal info + Comms prefs -->
    <div class="zen-grid-2">
      <div class="zen-card">
        <div class="zen-card-head">
          <span class="zen-card-title">Personal Information</span>
          <button class="zen-card-edit" @click="">
            <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M9.5 1.5L12.5 4.5L5 12H2V9L9.5 1.5Z"/></svg>
          </button>
        </div>
        <div class="zen-bank-fields">
          <template v-for="([lbl, valFn, mono]) in fieldRows" :key="lbl">
            <div v-if="valFn()" class="zen-bank-field">
              <div class="zen-field-label">{{ lbl }}</div>
              <div class="zen-field-val" :class="{ 'zen-field-mono': mono }" :style="mono ? { fontSize:'11.5px' } : {}">{{ valFn() }}</div>
            </div>
          </template>
        </div>
      </div>

      <div class="zen-card">
        <div class="zen-card-head">
          <span class="zen-card-title">Communication Preferences</span>
          <button class="zen-card-edit" @click="">
            <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M9.5 1.5L12.5 4.5L5 12H2V9L9.5 1.5Z"/></svg>
          </button>
        </div>
        <div class="zen-bank-fields">
          <div v-for="p in commsPrefs" :key="p.lbl" class="zen-bank-field"
            style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;">
            <div class="zen-field-label" style="margin-bottom:0;">{{ p.lbl }}</div>
            <span class="zen-bst" :class="buyer[p.key] ? 'zen-bst--active' : 'zen-bst--inactive'">{{ buyer[p.key] ? 'Opted In' : 'Opted Out' }}</span>
          </div>
        </div>
        <div class="zen-card-head" style="margin-top:14px;"><span class="zen-card-title">Account Actions</span></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="zen-doc-card-btn" @click="">Send Password Reset</button>
          <button class="zen-doc-card-btn" @click="">Send Message</button>
          <button class="zen-doc-card-btn zen-doc-card-btn--reject" @click="">Suspend Account</button>
        </div>
      </div>
    </div>

    <!-- Internal notes -->
    <div class="zen-card">
      <div class="zen-card-head">
        <span class="zen-card-title">Internal Notes</span>
        <button class="zen-card-edit" @click="editNotes = !editNotes">
          <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M9.5 1.5L12.5 4.5L5 12H2V9L9.5 1.5Z"/></svg>
        </button>
      </div>
      <div v-if="editNotes" style="display:flex;flex-direction:column;gap:8px;">
        <textarea class="zen-notes-textarea" v-model="notes" rows="3" />
        <div style="display:flex;gap:8px;">
          <button class="zen-btn-primary" style="height:28px;font-size:11.5px;" @click="saveNotes">Save</button>
          <button class="zen-btn-ghost" style="height:28px;font-size:11.5px;" @click="editNotes = false">Cancel</button>
        </div>
      </div>
      <div v-else class="zen-notes-text" @click="editNotes = true">
        <span v-if="notes">{{ notes }}</span>
        <span v-else style="color:var(--zg-text-dim);font-style:italic;">No internal notes. Click to add.</span>
      </div>
    </div>
  </div>
</template>
