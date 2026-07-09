<script setup>
import { ref, reactive } from 'vue';
import SToggle from '../SToggle.vue';

const MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const sel = ref('AE');

const rules = reactive({
  AE:{ window:14, cross_border:false, aging:[{day:30,action:'10% restocking fee'},{day:60,action:'25% restocking fee'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  SA:{ window:14, cross_border:true,  aging:[{day:30,action:'15% restocking fee'},{day:60,action:'30% restocking fee'},{day:180,action:'write-off'}], cond_new:true, cond_used:true },
  EG:{ window:7,  cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  KW:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  BH:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  QA:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  OM:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
});
</script>

<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Return Policies</div><div class="zset-content-sub">Per-market return windows, conditions, and aging rules</div></div>
      <button class="btn-primary" @click="">Save</button>
    </div>
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px;">
      <button v-for="m in MARKETS" :key="m" class="mkt-chip" :class="{ 'is-active': sel === m }" @click="sel = m">{{ m }}</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div>
        <label class="sf-lbl">Return Window (days)</label>
        <input type="number" v-model.number="rules[sel].window" class="sf-inp" />
      </div>
      <div style="display:flex;flex-direction:column;justify-content:flex-end;">
        <SToggle label="Cross-border Returns" sub="Allow returns from other markets" :value="rules[sel].cross_border" @update:value="v => rules[sel].cross_border = v" />
      </div>
      <div style="grid-column:1/-1;">
        <SToggle label="Accept New Condition Returns" :value="rules[sel].cond_new" @update:value="v => rules[sel].cond_new = v" />
        <SToggle label="Accept Used / Opened Returns" :value="rules[sel].cond_used" @update:value="v => rules[sel].cond_used = v" />
      </div>
      <div style="grid-column:1/-1;">
        <div class="sf-lbl" style="margin-bottom:8px;">Aging Rules</div>
        <div style="border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
          <div v-for="(rule, i) in rules[sel].aging" :key="i" style="display:grid;grid-template-columns:80px 1fr 60px;gap:10px;padding:10px 14px;background:var(--zg-panel);border-bottom:1px solid var(--zg-line);align-items:center;font-size:12px;">
            <div>
              <div class="sf-lbl">Day</div>
              <input type="number" v-model.number="rule.day" class="sf-inp-sm" />
            </div>
            <div>
              <div class="sf-lbl">Action</div>
              <input v-model="rule.action" class="sf-inp-sm" />
            </div>
            <button class="btn-ghost" style="height:24px;font-size:11px;color:var(--zg-danger);" @click="rules[sel].aging.splice(i,1)">Remove</button>
          </div>
        </div>
        <button class="btn-ghost" style="margin-top:8px;height:28px;font-size:11.5px;" @click="rules[sel].aging.push({day:90,action:'Action'})">+ Add Rule</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sf-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.sf-inp { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
.sf-inp-sm { height:28px;padding:0 8px;background:var(--zg-bg);border:1px solid var(--zg-line);border-radius:3px;font-size:11.5px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
.mkt-chip { height:26px;padding:0 10px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
.mkt-chip.is-active { border-color:var(--zg-accent);color:var(--zg-accent);background:oklch(0.78 0.18 130 / 0.1); }
</style>
