<script setup>
/**
 * ForgotRequest — step 11. Request a password-reset link.
 * Emits `next`, `back`.
 */
import { ref } from 'vue';
import ZButton from '@/components/ui/ZButton.vue';
import ZInput from '@/components/ui/ZInput.vue';

defineEmits(['next', 'back']);
const email = ref('layla.haddad@zucci.com');
</script>

<template>
  <div>
    <h1 class="zauth-title">Reset your password</h1>
    <p class="zauth-sub">We'll email you a secure link to set a new password.</p>
  </div>

  <div class="zauth-fields">
    <div class="zauth-field">
      <label class="zauth-label">Work email</label>
      <ZInput v-model="email" type="email" placeholder="you@zucci.com" autofocus />
    </div>
  </div>

  <div class="zauth-btn-row">
    <ZButton variant="ghost" @click="$emit('back')">Back</ZButton>
    <ZButton variant="primary" full @click="$emit('next')">Send reset link →</ZButton>
  </div>
</template>

<style scoped>
.zauth-btn-row { display: flex; gap: 10px; }
</style>
