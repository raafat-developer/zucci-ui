<script setup>
/**
 * AuthFlow — resolves the current step (from the :step route param) to its
 * screen component and wires the shared navigation events. Mirrors the
 * STEPS render(go) map from Zucci Auth.html, but router-driven.
 */
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { findStep } from '@/data/authSteps';
import { useAuthStore } from '@/stores/auth';

import SignInIdentity from './screens/SignInIdentity.vue';
import SignInPassword from './screens/SignInPassword.vue';
import OtpEnter from './screens/OtpEnter.vue';
import TrustDevice from './screens/TrustDevice.vue';
import ForgotRequest from './screens/ForgotRequest.vue';
import ForgotSent from './screens/ForgotSent.vue';

const SCREENS = {
  SignInIdentity,
  SignInPassword,
  SignInPasswordError: SignInPassword,
  SignInLocked: SignInPassword,
  OtpEnter,
  OtpBackup: OtpEnter,
  TrustDevice,
  ForgotRequest,
  ForgotSent,
  ResetPassword: ForgotRequest,
};

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const step = computed(() => findStep(route.params.step));
const current = computed(() => SCREENS[step.value.screen] || SignInIdentity);

const go = (id) => router.push(`/auth/${id}`);

// Event → target-step routing table (mirrors the React onNext/onBack wiring).
const NAV = {
  'signin-id':   { next: 'signin-pw' },
  'signin-pw':   { next: 'otp', back: 'signin-id', forgot: 'forgot' },
  'otp':         { next: 'trust', back: 'signin-pw', backup: 'otp-backup' },
  'trust':       { next: 'dashboard', skip: 'dashboard' },
  'forgot':      { next: 'forgot-sent', back: 'signin-id' },
  'forgot-sent': { back: 'signin-id' },
  'reset':       { next: 'signin-id', back: 'signin-id' },
};

async function handle(event) {
  const map = NAV[step.value.id] || {};
  const target = map[event];
  if (!target) return;
  // Authenticate the session when the password step advances (mock login).
  if (step.value.id === 'signin-pw' && event === 'next') {
    try { await auth.login({ email: 'layla.haddad@zucci.com', password: 'admin' }); }
    catch { /* stay on step; error surfaced via auth.error */ return; }
  }
  if (target === 'dashboard') {
    if (!auth.isAuthenticated) { try { await auth.login({ email: 'layla.haddad@zucci.com', password: 'admin' }); } catch { return; } }
    const redirect = route.query.redirect;
    router.push(redirect || (auth.role === 'supplier' ? '/supplier/dashboard' : '/admin/dashboard'));
  } else {
    go(target);
  }
}
</script>

<template>
  <component
    :is="current"
    @next="handle('next')"
    @back="handle('back')"
    @forgot="handle('forgot')"
    @backup="handle('backup')"
    @skip="handle('skip')"
  />
</template>
