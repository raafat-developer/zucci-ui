<script setup>
import { reactive } from 'vue';

const MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];

const flags = reactive([
  { id:'cod_limit',       label:'COD Order Limit',           desc:'Maximum order value eligible for Cash on Delivery',    global:true,  markets:{AE:true,SA:true,EG:true,KW:false,BH:false,QA:true,OM:false} },
  { id:'cross_border',    label:'Cross-Border Returns',      desc:'Allow customers to return items cross-market',          global:false, markets:{AE:true,SA:true,EG:false,KW:false,BH:false,QA:false,OM:false} },
  { id:'b2b',             label:'B2B / Wholesale Mode',      desc:'Enable B2B ordering with volume pricing',              global:false, markets:{AE:true,SA:false,EG:false,KW:false,BH:false,QA:false,OM:false} },
  { id:'loyalty',         label:'Loyalty & Points',          desc:'Customer loyalty points and tier rewards',             global:true,  markets:{AE:true,SA:true,EG:false,KW:false,BH:false,QA:true,OM:false} },
  { id:'influencer',      label:'Influencer Affiliate Links', desc:'Affiliate short link generation for influencers',      global:false, markets:{AE:true,SA:true,EG:false,KW:false,BH:false,QA:false,OM:false} },
  { id:'live_commerce',   label:'Live Commerce / Stream',    desc:'Live video shopping integration',                      global:false, markets:{AE:false,SA:false,EG:false,KW:false,BH:false,QA:false,OM:false} },
  { id:'gift_registry',   label:'Gift Registry',             desc:'Wishlist and gift registry for customers',             global:true,  markets:{AE:true,SA:false,EG:false,KW:false,BH:false,QA:false,OM:false} },
  { id:'smart_search',    label:'AI Smart Search',           desc:'Vector-based product search and recommendations',      global:true,  markets:{AE:true,SA:true,EG:true,KW:false,BH:false,QA:true,OM:false} },
]);

function toggleGlobal(flag) { flag.global = !flag.global; }
function toggleMarket(flag, mkt) { flag.markets[mkt] = !flag.markets[mkt]; }
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Feature Flags</div><div class="zset-content-sub">Enable or disable platform features globally or per market</div></div>
    </div>
    <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
      <div v-for="f in flags" :key="f.id" style="padding:12px 16px;border-bottom:1px solid var(--zg-line);background:var(--zg-panel);">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:8px;">
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--zg-text);">{{ f.label }}</div>
            <div style="font-size:11px;color:var(--zg-text-dim);margin-top:2px;">{{ f.desc }}</div>
          </div>
          <!-- Global toggle -->
          <div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex-shrink:0;">
            <div style="font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);">Global</div>
            <button class="toggle-btn" :class="{ 'is-on': f.global }" @click="toggleGlobal(f)">
              <div class="toggle-knob" />
            </button>
          </div>
        </div>
        <!-- Per-market toggles -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button v-for="mkt in MARKETS" :key="mkt"
            style="height:22px;padding:0 8px;border-radius:3px;cursor:pointer;font-size:10px;font-family:var(--zg-mono);font-weight:700;transition:all .1s;"
            :style="{ border: f.markets[mkt]?'1px solid var(--zg-accent)':'1px solid var(--zg-line)', background: f.markets[mkt]?'oklch(0.78 0.18 130 / 0.1)':'transparent', color: f.markets[mkt]?'var(--zg-accent)':'var(--zg-text-dim)' }"
            @click="toggleMarket(f, mkt)">{{ mkt }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toggle-btn { width:36px;height:20px;border-radius:10px;border:none;cursor:pointer;background:var(--zg-line);position:relative;flex-shrink:0;transition:background .14s; }
.toggle-btn.is-on { background:var(--zg-accent); }
.toggle-knob { width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:3px;left:3px;transition:left .14s; }
.toggle-btn.is-on .toggle-knob { left:18px; }
</style>
