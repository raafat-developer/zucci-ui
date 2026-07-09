<script setup>
import { ref, computed } from 'vue';
import { SELLER_HUB, MKT_MARKETS, TIER_COLORS } from '@/data/marketplaceData';

const marketF    = ref('all');
const vendorDetail = ref(null);

const filtered = computed(() =>
  marketF.value === 'all'
    ? [...SELLER_HUB].sort((a, b) => b.gmv - a.gmv)
    : SELLER_HUB.filter(s => s.market === marketF.value).sort((a, b) => b.gmv - a.gmv)
);

const tierColor = (t) => TIER_COLORS[t] || 'var(--zg-text-dim)';
const returnColor = (pct) => pct > 10 ? 'var(--zg-danger)' : pct > 6 ? 'var(--zg-warn)' : 'var(--zg-good)';
</script>

<template>
  <div class="zcat-content">
    <div style="display:flex;gap:5px;margin-bottom:12px;flex-wrap:wrap;">
      <button v-for="m in ['all', ...MKT_MARKETS]" :key="m"
        class="zwh-filter-chip" :class="{ 'is-active': marketF === m }" @click="marketF = m">
        {{ m === 'all' ? 'All Markets' : m }}
      </button>
    </div>

    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
      <div style="display:grid;grid-template-columns:1fr 60px 100px 80px 80px 80px 60px 80px 80px;padding:0 14px;height:30px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--zg-text-dim);font-weight:600;align-items:center;gap:8px;">
        <span>Vendor</span><span>Market</span><span>GMV</span><span>Orders</span><span>Returns</span><span>Return %</span><span>Rating</span><span>Listings</span><span>Tier</span>
      </div>
      <div v-for="(s, i) in filtered" :key="s.vendor + s.market"
        style="display:grid;grid-template-columns:1fr 60px 100px 80px 80px 80px 60px 80px 80px;padding:10px 14px;align-items:center;font-size:12px;gap:8px;cursor:pointer;transition:background .1s;"
        :style="{ background: i % 2 === 0 ? 'var(--zg-panel)' : 'var(--zg-bg)' }"
        @click="vendorDetail = s"
        @mouseenter="e => e.currentTarget.style.background = 'var(--zg-panel-hi)'"
        @mouseleave="e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--zg-panel)' : 'var(--zg-bg)'">
        <span style="font-weight:700;color:var(--zg-text);font-size:12.5px;">{{ s.vendor }}</span>
        <span style="font-family:var(--zg-mono);font-size:11px;font-weight:700;color:var(--zg-accent);">{{ s.market }}</span>
        <span style="font-family:var(--zg-mono);font-size:12px;font-weight:700;color:var(--zg-text);">{{ (s.gmv/1000).toFixed(0) }}K</span>
        <span style="font-family:var(--zg-mono);font-size:12px;">{{ s.orders.toLocaleString() }}</span>
        <span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-warn);">{{ s.returns }}</span>
        <span style="font-family:var(--zg-mono);font-size:12px;font-weight:600;" :style="{ color: returnColor(s.return_pct) }">{{ s.return_pct }}%</span>
        <span style="font-family:var(--zg-mono);font-size:12px;font-weight:700;color:var(--zg-accent);">{{ s.rating }}</span>
        <span style="font-family:var(--zg-mono);font-size:12px;">{{ s.listings }}</span>
        <span style="font-weight:700;font-size:11px;text-transform:capitalize;" :style="{ color: tierColor(s.status) }">{{ s.status }}</span>
      </div>
    </div>

    <!-- Vendor detail drawer -->
    <Teleport to="body">
      <div v-if="vendorDetail" class="mkt-modal-backdrop" @click="vendorDetail = null">
        <div class="mkt-modal" style="max-width:540px;" @click.stop>
          <div class="mkt-modal-head">
            <span>{{ vendorDetail.vendor }} · {{ vendorDetail.market }}</span>
            <button @click="vendorDetail = null">×</button>
          </div>
          <div class="mkt-modal-body">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
              <div v-for="[l,v,cls] in [
                ['GMV', (vendorDetail.gmv/1000).toFixed(0)+'K', 'accent'],
                ['Orders', vendorDetail.orders.toLocaleString(), ''],
                ['Return %', vendorDetail.return_pct+'%', vendorDetail.return_pct>10?'danger':vendorDetail.return_pct>6?'warn':'good'],
                ['Rating', vendorDetail.rating, 'accent'],
                ['Listings', vendorDetail.listings, ''],
                ['Tier', vendorDetail.status, ''],
              ]" :key="l"
                style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:10px 12px;">
                <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;margin-bottom:3px;">{{ l }}</div>
                <div style="font-family:var(--zg-mono);font-size:18px;font-weight:800;" :class="`is-${cls||'text'}`">{{ v }}</div>
              </div>
            </div>
          </div>
          <div class="mkt-modal-foot">
            <button class="zwh-btn-ghost" @click="vendorDetail = null">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mkt-modal-backdrop { position:fixed;inset:0;z-index:500;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center; }
.mkt-modal { width:480px;max-height:85vh;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,10px);overflow:hidden;display:flex;flex-direction:column; }
.mkt-modal-head { padding:14px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;color:var(--zg-text); }
.mkt-modal-head button { width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;font-size:16px;color:var(--zg-text-dim); }
.mkt-modal-body { padding:16px 20px;overflow-y:auto;flex:1; }
.mkt-modal-foot { padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px; }
.zwh-filter-chip { height:26px;padding:0 10px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim);white-space:nowrap; }
.zwh-filter-chip.is-active { background:var(--zg-panel-hi);color:var(--zg-text);border-color:var(--zg-accent); }
.zwh-btn-ghost { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
.is-accent { color:var(--zg-accent) !important; }
.is-good { color:var(--zg-good) !important; }
.is-warn { color:var(--zg-warn) !important; }
.is-danger { color:var(--zg-danger) !important; }
.is-text { color:var(--zg-text) !important; }
</style>
