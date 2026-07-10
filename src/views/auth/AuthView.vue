<script setup>
/**
 * AuthView — split-screen auth shell. Left: live-ops panel. Right: the
 * current step screen (nested router-view → AuthFlow). Bottom: step navigator
 * for jumping between the flow's screens (dev/demo aid, same as React build).
 */
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { STEP_GROUPS } from '@/data/authSteps';
import OpsPanel from './OpsPanel.vue';

import '@/assets/styles/authForm.css';

const route = useRoute();
const router = useRouter();
const groups = STEP_GROUPS;
const activeStep = computed(() => route.params.step || 'signin-id');
const go = (id) => router.push(`/auth/${id}`);
</script>

<template>
  <div class="zauth">
    <OpsPanel :tagline="true" />

    <div class="zauth-form">
      <div class="zauth-form-inner">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.zauth {
  position: fixed; inset: 0;
  display: grid; grid-template-columns: 1fr 1fr;
  background: var(--zg-bg); color: var(--zg-text);
  font-family: var(--zg-sans); font-size: 13px; overflow: hidden;
}
.zauth-form {
  position: relative; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 32px; background: var(--zg-bg); min-width: 0; overflow-y: auto;
}
:deep(.zauth-form-inner) { width: 100%; max-width: 380px; }

.zauth-stepnav {
  position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 4px; padding: 6px;
  background: rgba(14, 16, 19, 0.9);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--zg-line); border-radius: 999px; z-index: 50;
  font-family: var(--zg-mono); max-width: calc(100% - 32px);
  overflow-x: auto; scrollbar-width: none;
}
.zauth-stepnav::-webkit-scrollbar { display: none; }
.zauth-stepnav-btn {
  background: transparent; border: 0; padding: 5px 10px; border-radius: 999px;
  font-family: var(--zg-mono); font-size: 10.5px; letter-spacing: 0.04em;
  color: var(--zg-text-dim); cursor: pointer; white-space: nowrap;
  display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;
}
.zauth-stepnav-btn:hover { color: var(--zg-text); }
.zauth-stepnav-btn.is-on { background: var(--zg-accent); color: #0a0b0d; font-weight: 600; }
.zauth-stepnav-num { font-size: 9px; color: var(--zg-text-xdim); letter-spacing: 0; }
.zauth-stepnav-btn.is-on .zauth-stepnav-num { color: rgba(10, 11, 13, 0.6); }
.zauth-stepnav-sep { width: 1px; height: 14px; background: var(--zg-line); margin: 0 4px; flex-shrink: 0; }
.zauth-stepnav-group-lbl { font-size: 9px; color: var(--zg-text-xdim); letter-spacing: 0.1em; text-transform: uppercase; padding: 0 8px 0 6px; flex-shrink: 0; }

@media (max-width: 880px) { .zauth { grid-template-columns: 1fr; } }
</style>
