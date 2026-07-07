<script setup>
/**
 * OtpEnter — step 05. Six-box authenticator code entry with auto-advance.
 * Emits `next`, `back`, `backup`.
 */
import { ref } from 'vue';
import ZButton from '@/components/ui/ZButton.vue';
import ZStepMarker from '@/components/ui/ZStepMarker.vue';

defineEmits(['next', 'back', 'backup']);
const digits = ref(['', '', '', '', '', '']);
const boxes = ref([]);

function onInput(i, e) {
  const v = e.target.value.replace(/\D/g, '').slice(-1);
  digits.value[i] = v;
  if (v && i < 5) boxes.value[i + 1]?.focus();
}
function onKeydown(i, e) {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) boxes.value[i - 1]?.focus();
}
</script>

<template>
  <ZStepMarker :total="3" :current="3" label="Authenticator" />

  <div>
    <h1 class="zauth-title">Two-factor authentication</h1>
    <p class="zauth-sub">Enter the 6-digit code from your authenticator app.</p>
  </div>

  <div class="zauth-otp">
    <input
      v-for="(d, i) in digits"
      :key="i"
      ref="boxes"
      class="zauth-otp-box"
      :class="{ 'is-filled': d }"
      inputmode="numeric"
      maxlength="1"
      :value="d"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
    />
  </div>

  <div class="zauth-btn-row">
    <ZButton variant="ghost" @click="$emit('back')">Back</ZButton>
    <ZButton variant="primary" full @click="$emit('next')">Verify →</ZButton>
  </div>

  <div class="zauth-foot">
    Lost your device? <a href="#" @click.prevent="$emit('backup')">Use a backup code</a>
  </div>
</template>

<style scoped>
.zauth-btn-row { display: flex; gap: 10px; }
</style>
