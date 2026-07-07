<script setup>
/**
 * MarketplaceView — Marketplace module. Faithful port of ZucciMarketplaceModule:
 * header + tabs (Listings, Commission, Disputes, Seller Hub), each data-driven.
 * Listings supports status/market filters + approve/reject; disputes + seller
 * hub render the real tables. Uses legacy zwh-/zcat-/zen- CSS.
 */
import { ref, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  MKT_MARKETS, LISTINGS_DATA, COMMISSION_RULES, DISPUTES_DATA, SELLER_HUB, TIER_COLORS, STATUS_COLORS,
} from '@/data/marketplaceData';
import ZModal from '@/components/ui/ZModal.vue';

const route = useRoute();
const tab = ref(route.query.tab || 'listings');
watch(() => route.query.tab, (t) => { if (t) tab.value = t; });
const listings = reactive(LISTINGS_DATA.map((l) => ({ ...l })));
const statusF = ref('pending');
const marketF = ref('all');
const search = ref('');
const preview = ref(null);
const rejecting = ref(null);
const rejectReason = ref('');

const TABS = [['listings','Listings'],['commission','Commission'],['disputes','Disputes'],['seller','Seller Hub']];
const stColor = (s) => STATUS_COLORS[s] || 'var(--zg-text-dim)';
const tierColor = (t) => TIER_COLORS[t] || 'var(--zg-text-dim)';

const filtered = computed(() => {
  const sq = search.value.toLowerCase();
  return listings.filter((l) => (statusF.value === 'all' || l.status === statusF.value) && (marketF.value === 'all' || l.market === marketF.value) && (!sq || l.name.toLowerCase().includes(sq) || l.vendor.toLowerCase().includes(sq) || l.sku.toLowerCase().includes(sq)));
});
const kpis = computed(() => [
  [`Pending`, listings.filter((l) => l.status === 'pending').length, 'is-accent'],
  [`Approved`, listings.filter((l) => l.status === 'approved').length, 'is-good'],
  [`Rejected`, listings.filter((l) => l.status === 'rejected').length, 'is-danger'],
  ['Total', listings.length, ''],
]);
const approve = (id) => { const l = listings.find((x) => x.id === id); if (l) l.status = 'approved'; };
const doReject = () => { const l = listings.find((x) => x.id === rejecting.value); if (l) { l.status = 'rejected'; l.issue = rejectReason.value || 'Missing required information'; } rejecting.value = null; rejectReason.value = ''; };
const statusChips = [['all','All'],['pending','Pending'],['approved','Approved'],['rejected','Rejected']];
const tabs = TABS; const rules = COMMISSION_RULES; const disputes = DISPUTES_DATA; const sellers = SELLER_HUB; const markets = MKT_MARKETS;
</script>

<template>
  <div style="display:flex;flex-direction:column;height:100%;min-height:0">
    <div class="zwh-header" style="flex-shrink:0">
      <div class="zwh-header-left">
        <div style="font-size:16px;font-weight:700;color:var(--zg-text)">Marketplace</div>
        <div class="zwh-subtitle">Vendor listings, commission rules, disputes &amp; seller performance</div>
      </div>
      <div style="display:flex;gap:6px"><button class="zwh-btn-primary">Invite Vendor</button></div>
    </div>

    <div style="display:flex;border-bottom:1px solid var(--zg-line);background:var(--zg-bg-elev);flex-shrink:0;padding:0 20px">
      <button v-for="[v, l] in tabs" :key="v" style="height:40px;padding:0 14px;border:none;background:transparent;font-family:inherit;font-size:12.5px;cursor:pointer" :style="{ color: tab === v ? 'var(--zg-accent)' : 'var(--zg-text-dim)', borderBottom: tab === v ? '2px solid var(--zg-accent)' : '2px solid transparent', fontWeight: tab === v ? 600 : 400 }" @click="tab = v">{{ l }}</button>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <!-- Listings -->
      <div v-if="tab === 'listings'">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
          <div v-for="[l, v, cls] in kpis" :key="l" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:10px 14px;display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:11.5px;color:var(--zg-text-mid)">{{ l }}</span>
            <span style="font-family:var(--zg-mono);font-size:18px;font-weight:800" :style="{ color: cls === 'is-accent' ? 'var(--zg-accent)' : cls === 'is-good' ? 'var(--zg-good)' : cls === 'is-danger' ? 'var(--zg-danger)' : 'var(--zg-text)' }">{{ v }}</span>
          </div>
        </div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
          <input v-model="search" placeholder="Search listings…" style="height:28px;padding:0 10px;width:200px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none" />
          <button v-for="[v, l] in statusChips" :key="v" class="zwh-filter-chip" :class="{ 'is-active': statusF === v }" @click="statusF = v">{{ l }}</button>
          <div style="width:1px;height:14px;background:var(--zg-line)" />
          <button v-for="m in ['all', ...markets]" :key="m" class="zwh-filter-chip" :class="{ 'is-active': marketF === m }" @click="marketF = m">{{ m === 'all' ? 'All Markets' : m }}</button>
        </div>
        <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
          <div style="display:grid;grid-template-columns:1fr 130px 120px 60px 70px 70px 80px 130px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
            <span>Listing</span><span>Vendor</span><span>Category</span><span>Market</span><span>Price</span><span>Status</span><span>Comm.</span><span>Actions</span>
          </div>
          <div v-for="l in filtered" :key="l.id" style="display:grid;grid-template-columns:1fr 130px 120px 60px 70px 70px 80px 130px;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;font-size:12px">
            <div>
              <div style="font-weight:600;color:var(--zg-text);font-size:12.5px">{{ l.name }}</div>
              <div style="font-family:var(--zg-mono);font-size:10px;color:var(--zg-text-dim);margin-top:1px">{{ l.sku }}</div>
              <div v-if="l.issue" style="font-size:10px;color:var(--zg-danger);margin-top:2px">Issue: {{ l.issue }}</div>
            </div>
            <span style="font-size:11.5px;color:var(--zg-text-mid)">{{ l.vendor }}</span>
            <span style="font-size:11px;color:var(--zg-text-dim)">{{ l.cat }}</span>
            <span style="font-family:var(--zg-mono);font-size:11px;font-weight:700;color:var(--zg-accent)">{{ l.market }}</span>
            <span style="font-family:var(--zg-mono);font-size:12px;font-weight:700;color:var(--zg-text)">{{ l.price }} <span style="font-size:10px;color:var(--zg-text-dim)">{{ l.currency }}</span></span>
            <span style="font-size:10.5px;font-weight:700;text-transform:capitalize" :style="{ color: stColor(l.status) }">{{ l.status }}</span>
            <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-accent);font-weight:700">{{ l.commission }}%</span>
            <div style="display:flex;gap:4px">
              <button class="zcat-act" @click="preview = l">Preview</button>
              <button v-if="l.status === 'pending'" class="zcat-act" style="color:var(--zg-good)" @click="approve(l.id)">Approve</button>
              <button v-if="l.status === 'pending'" class="zcat-act danger" @click="rejecting = l.id">Reject</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Commission -->
      <div v-else-if="tab === 'commission'" style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:1fr 90px 80px 1fr 1fr;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span>Category</span><span>Market</span><span>Rate</span><span>Vendor Override</span><span>Notes</span>
        </div>
        <div v-for="r in rules" :key="r.id" style="display:grid;grid-template-columns:1fr 90px 80px 1fr 1fr;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;font-size:12px">
          <span style="font-weight:600;color:var(--zg-text)">{{ r.cat }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-mid)">{{ r.market === 'all' ? 'All' : r.market }}</span>
          <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-accent);font-weight:700">{{ r.rate }}%</span>
          <span style="font-size:11.5px;color:var(--zg-text-mid)">{{ r.vendor_override || '—' }}</span>
          <span style="font-size:11px;color:var(--zg-text-dim)">{{ r.notes }}</span>
        </div>
      </div>

      <!-- Disputes -->
      <div v-else-if="tab === 'disputes'" style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:110px 110px 1fr 60px 110px 90px 120px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span>Type</span><span>Vendor</span><span>Subject</span><span>Mkt</span><span>Amount</span><span>Status</span><span>Assignee</span>
        </div>
        <div v-for="d in disputes" :key="d.id" style="display:grid;grid-template-columns:110px 110px 1fr 60px 110px 90px 120px;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;font-size:12px">
          <span style="font-weight:600;color:var(--zg-text)">{{ d.type }}</span>
          <span style="font-size:11.5px;color:var(--zg-text-mid)">{{ d.vendor }}</span>
          <span style="font-size:11px;color:var(--zg-text-dim)">{{ d.subject }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-accent)">{{ d.market }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text)">{{ d.amount }}</span>
          <span style="font-size:10.5px;font-weight:700;text-transform:capitalize" :style="{ color: stColor(d.status) }">{{ d.status }}</span>
          <span style="font-size:11px;color:var(--zg-text-mid)">{{ d.assignee }}</span>
        </div>
      </div>

      <!-- Seller Hub -->
      <div v-else style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="display:grid;grid-template-columns:1fr 60px 110px 80px 90px 70px 70px 80px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center">
          <span>Vendor</span><span>Mkt</span><span>GMV</span><span>Orders</span><span>Return %</span><span>Rating</span><span>Listings</span><span>Tier</span>
        </div>
        <div v-for="s in sellers" :key="s.vendor" style="display:grid;grid-template-columns:1fr 60px 110px 80px 90px 70px 70px 80px;padding:9px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line-soft);align-items:center;font-size:12px">
          <span style="font-weight:600;color:var(--zg-text)">{{ s.vendor }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-accent)">{{ s.market }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text)">{{ s.gmv.toLocaleString() }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-mid)">{{ s.orders.toLocaleString() }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px" :style="{ color: s.return_pct > 10 ? 'var(--zg-danger)' : s.return_pct > 6 ? 'var(--zg-warn)' : 'var(--zg-good)' }">{{ s.return_pct }}%</span>
          <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-mid)">★ {{ s.rating }}</span>
          <span style="font-family:var(--zg-mono);font-size:11px;color:var(--zg-text-mid)">{{ s.listings }}</span>
          <span style="font-size:10.5px;font-weight:700;text-transform:capitalize" :style="{ color: tierColor(s.status) }">{{ s.status }}</span>
        </div>
      </div>
    </div>

    <!-- Preview modal -->
    <ZModal :open="!!preview" :title="preview ? preview.name : ''" :width="420" @close="preview = null">
      <div v-if="preview" class="zen-bank-fields">
        <div class="zen-bank-field"><div class="zen-field-label">SKU</div><div class="zen-field-val zen-field-mono">{{ preview.sku }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Vendor</div><div class="zen-field-val">{{ preview.vendor }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Category</div><div class="zen-field-val">{{ preview.cat }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Price</div><div class="zen-field-val zen-field-mono">{{ preview.price }} {{ preview.currency }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Images / Variants</div><div class="zen-field-val">{{ preview.images }} images · {{ preview.variants }} variants</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Commission</div><div class="zen-field-val">{{ preview.commission }}%</div></div>
      </div>
      <template #footer>
        <button class="zwh-btn-ghost" @click="preview = null">Close</button>
        <button v-if="preview && preview.status === 'pending'" class="zwh-btn-primary" style="background:var(--zg-good)" @click="approve(preview.id); preview = null">Approve</button>
      </template>
    </ZModal>

    <!-- Reject modal -->
    <ZModal :open="!!rejecting" title="Reject Listing" :width="420" @close="rejecting = null">
      <div style="display:flex;flex-direction:column;gap:6px">
        <label style="font-size:11px;color:var(--zg-text-mid)">Rejection reason</label>
        <textarea v-model="rejectReason" rows="3" placeholder="Explain what needs fixing…" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:8px 10px;font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;resize:vertical" />
      </div>
      <template #footer>
        <button class="zwh-btn-ghost" @click="rejecting = null">Cancel</button>
        <button class="zwh-btn-primary" style="background:var(--zg-danger)" @click="doReject">Reject Listing</button>
      </template>
    </ZModal>
  </div>
</template>
