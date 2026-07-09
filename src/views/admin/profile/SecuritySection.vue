<script setup>
import { ref, reactive } from 'vue';

const pwStep  = ref(false);
const pw      = reactive({ current:'', next:'', confirm:'' });
const twoFA   = ref(true);
const passkeys = ref([{ id:'pk1', name:'MacBook Pro — Touch ID', created:'Jun 1, 2025', last:'2h ago' }]);

function updatePassword() { pwStep.value = false; pw.current = pw.next = pw.confirm = ''; }
</script>

<template>
  <div style="max-width:640px;">
    <div class="up-section-title">Security</div>
    <div class="up-section-sub">Manage your password, two-factor authentication, and passkeys</div>

    <!-- Password -->
    <div class="up-card" style="margin-bottom:12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;" :style="{ marginBottom: pwStep ? '14px' : 0 }">
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--zg-text);">Password</div>
          <div style="font-size:11px;color:var(--zg-text-dim);margin-top:1px;">Last changed 30 days ago</div>
        </div>
        <button class="up-btn-ghost" @click="pwStep = !pwStep">{{ pwStep ? 'Cancel' : 'Change Password' }}</button>
      </div>
      <div v-if="pwStep" style="display:flex;flex-direction:column;gap:10px;">
        <div v-for="[k,l] in [['current','Current Password'],['next','New Password'],['confirm','Confirm New Password']]" :key="k" class="up-field">
          <label class="up-lbl">{{ l }}</label>
          <input type="password" v-model="pw[k]" class="up-inp" />
        </div>
        <button class="up-btn-primary" style="width:fit-content;" @click="updatePassword">Update Password</button>
      </div>
    </div>

    <!-- 2FA -->
    <div class="up-card" style="margin-bottom:12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--zg-text);">Two-Factor Authentication</div>
          <div style="font-size:11px;color:var(--zg-text-dim);margin-top:1px;">Require TOTP code on every login</div>
        </div>
        <button class="up-toggle" :class="{ 'is-on': twoFA }" @click="twoFA = !twoFA"><div class="up-toggle-knob"/></button>
      </div>
      <div v-if="twoFA" style="margin-top:10px;font-size:11.5px;color:var(--zg-good);font-weight:600;">2FA is active — using authenticator app (TOTP)</div>
      <div v-else style="margin-top:10px;padding:8px 12px;background:oklch(0.70 0.18 25 / 0.08);border:1px solid oklch(0.70 0.18 25 / 0.3);border-radius:var(--zg-radius-md);font-size:11.5px;color:var(--zg-danger);">
        2FA is disabled. Your account is less secure.
      </div>
    </div>

    <!-- Passkeys -->
    <div class="up-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--zg-text);">Passkeys</div>
          <div style="font-size:11px;color:var(--zg-text-dim);margin-top:1px;">Biometric login — no password needed</div>
        </div>
        <button class="up-btn-ghost" @click="">+ Register Passkey</button>
      </div>
      <div v-for="pk in passkeys" :key="pk.id" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--zg-line);">
        <div>
          <div style="font-size:12.5px;font-weight:600;color:var(--zg-text);">{{ pk.name }}</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:1px;">Created {{ pk.created }} · Last used {{ pk.last }}</div>
        </div>
        <button class="up-act" style="color:var(--zg-danger);" @click="passkeys = passkeys.filter(x=>x.id!==pk.id)">Remove</button>
      </div>
    </div>
  </div>
</template>
