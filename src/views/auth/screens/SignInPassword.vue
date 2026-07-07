<script setup>
/**
 * SignInPassword — step 02. Password entry with show/hide + forgot link.
 * Emits `next`, `back`, `forgot`.
 */
import { ref } from 'vue';
import ZButton from '@/components/ui/ZButton.vue';
import ZInput from '@/components/ui/ZInput.vue';
import ZStepMarker from '@/components/ui/ZStepMarker.vue';

defineEmits(['next', 'back', 'forgot']);
const pw = ref('');
const show = ref(false);
</script>

<template>
  <ZStepMarker :total="3" :current="2" label="Password" />

  <div>
    <h1 class="zauth-title">Enter your password</h1>
    <p class="zauth-sub">Signing in as <b>layla.haddad@zucci.com</b></p>
  </div>

  <div class="zauth-fields">
    <div class="zauth-field">
      <label class="zauth-label">
        Password
        <button class="zauth-label-link" @click="$emit('forgot')">Forgot?</button>
      </label>
      <ZInput v-model="pw" :type="show ? 'text' : 'password'" placeholder="••••••••••">
        <template #affix>
          <button class="pw-toggle" type="button" @click="show = !show">{{ show ? 'Hide' : 'Show' }}</button>
        </template>
      </ZInput>
    </div>
  </div>

  <div class="zauth-btn-row">
    <ZButton variant="ghost" @click="$emit('back')">Back</ZButton>
    <ZButton variant="primary" full @click="$emit('next')">Continue →</ZButton>
  </div>
</template>

<style scoped>
.zauth-btn-row { display: flex; gap: 10px; }
.pw-toggle {
  background: transparent; border: 0; cursor: pointer;
  color: var(--zg-text-dim); font-size: 11px; font-family: inherit;
}
.pw-toggle:hover { color: var(--zg-text); }
</style>
