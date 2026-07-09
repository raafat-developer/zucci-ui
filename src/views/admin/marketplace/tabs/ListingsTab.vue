<script setup>
import { ref, computed, reactive } from 'vue';
import { LISTINGS_DATA, MKT_MARKETS } from '@/data/marketplaceData';

const listings = reactive(LISTINGS_DATA.map(l => ({ ...l })));
const search   = ref('');
const statusF  = ref('pending');
const marketF  = ref('all');
const active   = ref(null);
const rejecting = ref(null);
const rejectReason = ref('');
const previewListing = ref(null);

const STATUS_COLORS = { approved:'var(--zg-good)', pending:'var(--zg-accent)', rejected:'var(--zg-danger)' };

const filtered = computed(() => {
  const sq = search.value.toLowerCase();
  return listings.filter(l =>
    (statusF.value === 'all' || l.status === statusF.value) &&
    (marketF.value === 'all' || l.market === marketF.value) &&
    (!sq || l.name.toLowerCase().includes(sq) || l.vendor.toLowerCase().includes(sq) || l.sku.toLowerCase().includes(sq))
  );
});

const kpis = computed(() => [
  [`Pending (${listings.filter(l=>l.status==='pending').length})`, listings.filter(l=>l.status==='pending').length, 'is-accent'],
  ['Approved', listings.filter(l=>l.status==='approved').length, 'is-good'],
  ['Rejected', listings.filter(l=>l.status==='rejected').length, 'is-danger'],
  ['Total', listings.length, ''],
]);

function approve(id) {
  const l = listings.find(x => x.id === id);
  if (l) l.status = 'approved';
}
function doReject() {
  const l = listings.find(x => x.id === rejecting.value);
  if (l) { l.status = 'rejected'; l.issue = rejectReason.value || 'Missing required information'; }
  rejecting.value = null; rejectReason.value = '';
}
function toggleActive(id) { active.value = active.value === id ? null : id; }
</script>

<template>
  <div class="zcat-content">
    <!-- KPI mini strip -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;">
      <div v-for="[l,v,cls] in kpis" :key="l" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:11.5px;color:var(--zg-text-mid);">{{ l }}</span>
        <span style="font-family:var(--zg-mono);font-size:18px;font-weight:800;" :class="cls">{{ v }}</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div style="display:flex;gap:6px;justify-content:space-between;flex-wrap:wrap;margin-bottom:10px;">
      <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
        <div style="position:relative;">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style="position:absolute;left:7px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
          <input v-model="search" placeholder="Search listings…" style="height:28px;padding-left:24px;padding-right:8px;width:200px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;" />
        </div>
        <button v-for="[v,l] in [['all','All'],['pending','Pending'],['approved','Approved'],['rejected','Rejected']]" :key="v"
          class="zwh-filter-chip" :class="{ 'is-active': statusF === v }" @click="statusF = v">{{ l }}</button>
        <div style="width:1px;height:14px;background:var(--zg-line);" />
        <button v-for="m in ['all', ...MKT_MARKETS]" :key="m"
          class="zwh-filter-chip" :class="{ 'is-active': marketF === m }" @click="marketF = m">{{ m === 'all' ? 'All Markets' : m }}</button>
      </div>
    </div>

    <!-- Table -->
    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
      <div class="mkt-table-head">
        <span>Listing</span><span>Vendor</span><span>Category</span><span>Market</span><span>Price</span><span>Status</span><span>Commission</span><span>Actions</span>
      </div>
      <div v-for="l in filtered" :key="l.id"
        class="mkt-table-row" :class="{ 'is-active': active === l.id }"
        @click="toggleActive(l.id)">
        <div>
          <div style="font-weight:600;color:var(--zg-text);font-size:12.5px;">{{ l.name }}</div>
          <div style="font-family:var(--zg-mono);font-size:10px;color:var(--zg-text-dim);margin-top:1px;">{{ l.sku }}</div>
          <div v-if="l.issue" style="font-size:10px;color:var(--zg-danger);margin-top:2px;">Issue: {{ l.issue }}</div>
        </div>
        <span style="font-size:11.5px;color:var(--zg-text-mid);">{{ l.vendor }}</span>
        <span style="font-size:11px;color:var(--zg-text-dim);">{{ l.cat }}</span>
        <span style="font-family:var(--zg-mono);font-size:11px;font-weight:700;color:var(--zg-accent);">{{ l.market }}</span>
        <span style="font-family:var(--zg-mono);font-size:12px;font-weight:700;color:var(--zg-text);">{{ l.price }} <span style="font-size:10px;color:var(--zg-text-dim);">{{ l.currency }}</span></span>
        <span style="font-size:10.5px;font-weight:700;text-transform:capitalize;" :style="{ color: STATUS_COLORS[l.status] || 'var(--zg-text-dim)' }">{{ l.status }}</span>
        <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-accent);font-weight:700;">{{ l.commission }}%</span>
        <div style="display:flex;gap:4px;" @click.stop>
          <button class="zcat-act" @click="previewListing = l">Preview</button>
          <button v-if="l.status==='pending'" class="zcat-act" style="color:var(--zg-good);" @click="approve(l.id)">Approve</button>
          <button v-if="l.status==='pending'" class="zcat-act danger" @click="rejecting = l.id">Reject</button>
        </div>
      </div>
    </div>

    <!-- Reject reason modal -->
    <Teleport to="body">
      <div v-if="rejecting" class="mkt-modal-backdrop" @click="rejecting = null">
        <div class="mkt-modal" @click.stop>
          <div class="mkt-modal-head"><span>Reject Listing</span><button @click="rejecting = null">×</button></div>
          <div class="mkt-modal-body">
            <label class="zwh-field-label">Reason for rejection</label>
            <textarea class="zwh-field-textarea" v-model="rejectReason" rows="3" placeholder="e.g. Missing product images, incorrect pricing…" />
          </div>
          <div class="mkt-modal-foot">
            <button class="zwh-btn-primary" style="background:var(--zg-danger);border-color:var(--zg-danger);" @click="doReject">Confirm Reject</button>
            <button class="zwh-btn-ghost" @click="rejecting = null">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Preview modal -->
    <Teleport to="body">
      <div v-if="previewListing" class="mkt-modal-backdrop" @click="previewListing = null">
        <div class="mkt-modal" style="max-width:600px;" @click.stop>
          <div class="mkt-modal-head"><span>{{ previewListing.name }}</span><button @click="previewListing = null">×</button></div>
          <div class="mkt-modal-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div v-for="[k,v] in [['Vendor',previewListing.vendor],['SKU',previewListing.sku],['Category',previewListing.cat],['Market',previewListing.market],['Price',`${previewListing.price} ${previewListing.currency}`],['Commission',`${previewListing.commission}%`],['Status',previewListing.status]]" :key="k">
                <div class="zwh-field-label">{{ k }}</div>
                <div style="font-size:12.5px;font-weight:600;color:var(--zg-text);">{{ v }}</div>
              </div>
            </div>
            <div v-if="previewListing.issue" style="margin-top:10px;padding:10px;background:oklch(0.70 0.18 25 / 0.08);border:1px solid oklch(0.70 0.18 25 / 0.3);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-danger);">
              Issue: {{ previewListing.issue }}
            </div>
          </div>
          <div class="mkt-modal-foot">
            <button v-if="previewListing.status === 'pending'" class="zwh-btn-primary" @click="approve(previewListing.id); previewListing = null">Approve</button>
            <button v-if="previewListing.status === 'pending'" class="zwh-btn-ghost" style="color:var(--zg-danger);" @click="rejecting = previewListing.id; previewListing = null">Reject</button>
            <button class="zwh-btn-ghost" @click="previewListing = null">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mkt-table-head {
  display: grid; grid-template-columns: 1fr 130px 120px 60px 70px 60px 80px 120px;
  padding: 0 14px; height: 30px; background: var(--zg-panel-hi);
  border-bottom: 1px solid var(--zg-line); font-size: 9.5px;
  text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim);
  font-weight: 600; align-items: center; gap: 10px;
}
.mkt-table-row {
  display: grid; grid-template-columns: 1fr 130px 120px 60px 70px 60px 80px 120px;
  padding: 9px 14px; background: var(--zg-panel); border-bottom: 1px solid var(--zg-line);
  align-items: center; font-size: 12px; cursor: pointer; transition: background .1s; gap: 10px;
}
.mkt-table-row:hover, .mkt-table-row.is-active { background: var(--zg-panel-hi); }
.mkt-modal-backdrop { position: fixed; inset: 0; z-index: 500; background: oklch(0.1 0.01 250 / 0.7); display: flex; align-items: center; justify-content: center; }
.mkt-modal { width: 480px; max-height: 85vh; background: var(--zg-bg-elev); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-lg, 10px); overflow: hidden; display: flex; flex-direction: column; }
.mkt-modal-head { padding: 14px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 700; color: var(--zg-text); }
.mkt-modal-head button { width: 28px; height: 28px; border: none; background: var(--zg-panel); border-radius: 4px; cursor: pointer; font-size: 16px; color: var(--zg-text-dim); }
.mkt-modal-body { padding: 16px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
.mkt-modal-foot { padding: 12px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; }
.zwh-filter-chip { height: 26px; padding: 0 10px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 11px; color: var(--zg-text-dim); white-space: nowrap; }
.zwh-filter-chip.is-active { background: var(--zg-panel-hi); color: var(--zg-text); border-color: var(--zg-accent); }
.zcat-act { height: 24px; padding: 0 8px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 11px; color: var(--zg-text-dim); }
.zcat-act.danger { color: var(--zg-danger); border-color: oklch(0.70 0.18 25 / 0.4); }
.zwh-btn-primary { height: 32px; padding: 0 14px; border: none; border-radius: var(--zg-radius-md); background: var(--zg-accent); color: oklch(0.18 0.04 130); font-weight: 700; font-size: 12px; cursor: pointer; }
.zwh-btn-ghost { height: 32px; padding: 0 14px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: transparent; color: var(--zg-text-mid); font-size: 12px; cursor: pointer; }
.zwh-field-label { font-size: 10.5px; font-weight: 600; color: var(--zg-text-mid); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.zwh-field-textarea { width: 100%; padding: 8px 10px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-size: 12px; color: var(--zg-text); outline: none; resize: vertical; box-sizing: border-box; }
.is-accent { color: var(--zg-accent) !important; }
.is-good { color: var(--zg-good) !important; }
.is-danger { color: var(--zg-danger) !important; }
</style>
