<script setup>
/**
 * TrustDevice — step 15. Post-2FA "trust this device" confirmation.
 * Emits `next`, `skip`.
 */
import { ref } from 'vue';
import ZButton from '@/components/ui/ZButton.vue';
import ZStepMarker from '@/components/ui/ZStepMarker.vue';

defineEmits(['next', 'skip']);
const trust = ref(true);
</script>

<template>
  <ZStepMarker :total="3" :current="3" label="Trust device" />

  <div>
    <h1 class="zauth-title">Trust this device?</h1>
    <p class="zauth-sub">Skip 2FA on this device for 30 days. Only do this on devices you own.</p>
  </div>

  <div class="ztrust">
    <div class="ztrust-icon">✓</div>
    <dl class="ztrust-rows">
      <div class="ztrust-row"><dt>Device</dt><dd>MacBook Pro · Chrome</dd></div>
      <div class="ztrust-row"><dt>Location</dt><dd>Dubai, AE</dd></div>
      <div class="ztrust-row"><dt>IP</dt><dd>94.200.xx.xx</dd></div>
    </dl>
  </div>

  <label class="zcheck" :class="{ 'is-on': trust }" @click="trust = !trust">
    <span class="zcheck-box">{{ trust ? '✓' : '' }}</span>
    <span class="zcheck-text">
      Trust this device for 30 days
      <small>You won't be asked for a 2FA code here until then.</small>
    </span>
  </label>

  <div class="zauth-btn-row">
    <ZButton variant="ghost" @click="$emit('skip')">Not now</ZButton>
    <ZButton variant="primary" full @click="$emit('next')">Continue to dashboard →</ZButton>
  </div>
</template>

<style scoped>
.zauth-btn-row { display: flex; gap: 10px; }
.ztrust {
  display: grid; grid-template-columns: auto 1fr; gap: 14px; padding: 14px;
  background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md);
}
.ztrust-icon {
  width: 40px; height: 40px; background: var(--zg-bg-elev); border: 1px solid var(--zg-line);
  border-radius: 8px; display: grid; place-items: center; color: var(--zg-accent); font-size: 18px;
}
.ztrust-rows { display: flex; flex-direction: column; gap: 4px; font-size: 11px; margin: 0; }
.ztrust-row { display: flex; gap: 8px; }
.ztrust-row dt { color: var(--zg-text-dim); width: 80px; flex-shrink: 0; font-size: 10.5px; letter-spacing: 0.04em; text-transform: uppercase; }
.ztrust-row dd { color: var(--zg-text); font-family: var(--zg-mono); font-size: 11.5px; margin: 0; }
.zcheck {
  display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px;
  background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); cursor: pointer;
}
.zcheck.is-on { border-color: oklch(0.88 0.19 130 / 0.4); background: oklch(0.88 0.19 130 / 0.05); }
.zcheck-box {
  width: 16px; height: 16px; border: 1px solid var(--zg-muted-line); border-radius: 3px;
  display: grid; place-items: center; flex-shrink: 0; margin-top: 1px; background: var(--zg-bg-elev);
  font-size: 11px; color: #0a0b0d;
}
.zcheck.is-on .zcheck-box { background: var(--zg-accent); border-color: var(--zg-accent); }
.zcheck-text { font-size: 12px; color: var(--zg-text); line-height: 1.5; }
.zcheck-text small { display: block; color: var(--zg-text-dim); margin-top: 2px; }
</style>
