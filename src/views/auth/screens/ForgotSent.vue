<script setup>
/**
 * ForgotSent — step 12. Confirmation that the reset link was emailed.
 * Emits `back`.
 */
import ZButton from '@/components/ui/ZButton.vue';
defineEmits(['back']);
</script>

<template>
  <div class="zauth-illust zauth-illust--good">✓</div>

  <div>
    <h1 class="zauth-title">Check your inbox</h1>
    <p class="zauth-sub">
      We sent a reset link to <b>layla.haddad@zucci.com</b>. It expires in 30 minutes.
    </p>
  </div>

  <ZButton variant="ghost" full @click="$emit('back')">Back to sign in</ZButton>

  <div class="zauth-foot">
    Didn't get it? Check spam or <a href="#">resend</a>.
  </div>
</template>
