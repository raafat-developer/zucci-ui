<script setup>
/**
 * SignInIdentity — step 01. Ported from ZucciSignInIdentity (zucci-auth.jsx).
 * Uses shared ZButton / ZInput / ZStepMarker. Emits `next` with the email.
 */
import { ref } from 'vue';
import ZButton from '@/components/ui/ZButton.vue';
import ZInput from '@/components/ui/ZInput.vue';
import ZStepMarker from '@/components/ui/ZStepMarker.vue';

const emit = defineEmits(['next']);

const email = ref('');
const uid = ref('');

function onNext() {
  emit('next', { email: email.value });
}
</script>

<template>
  <ZStepMarker :total="3" :current="1" label="Identify" />

  <div>
    <h1 class="zauth-title">Sign in to Zucci Admin</h1>
    <p class="zauth-sub">Enter your work email and admin ID to continue.</p>
  </div>

  <div class="zauth-fields">
    <div class="zauth-field">
      <label class="zauth-label">Work email</label>
      <ZInput v-model="email" type="email" placeholder="you@zucci.com" autofocus />
    </div>
    <div class="zauth-field">
      <label class="zauth-label">Admin ID</label>
      <ZInput v-model="uid" mono prefix="ZC-" placeholder="0000" />
      <div class="zauth-help">4-digit ID issued at onboarding. Find it in your Zucci welcome email.</div>
    </div>
  </div>

  <ZButton variant="primary" full @click="onNext">Continue →</ZButton>

  <div class="zauth-divider">or</div>

  <ZButton variant="ghost" full>Continue with SSO</ZButton>


</template>
