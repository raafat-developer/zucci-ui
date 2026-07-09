<script setup>
import { reactive } from 'vue';

const v = reactive({ theme:'dark', accent:'#b5f23d', font:'system', density:'comfortable', lang:'en', timezone:'Asia/Dubai', dateFormat:'DD/MM/YYYY', currency:'AED' });
</script>

<template>
  <div style="max-width:640px;">
    <div class="up-section-title">Appearance</div>
    <div class="up-section-sub">Personalize your dashboard experience</div>

    <div class="up-card" style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:var(--zg-text);margin-bottom:8px;">Theme</div>
      <div style="display:flex;gap:8px;">
        <button v-for="t in ['dark','light','system']" :key="t"
          style="height:32px;padding:0 14px;border-radius:var(--zg-radius-md);cursor:pointer;font-size:12px;transition:all .1s;"
          :style="{ border: v.theme===t?'1px solid var(--zg-accent)':'1px solid var(--zg-line)', background: v.theme===t?'oklch(0.78 0.18 130 / 0.1)':'transparent', color: v.theme===t?'var(--zg-accent)':'var(--zg-text-dim)', fontWeight: v.theme===t?600:400 }"
          @click="v.theme = t">{{ t.charAt(0).toUpperCase()+t.slice(1) }}</button>
      </div>
    </div>

    <div class="up-card" style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:var(--zg-text);margin-bottom:8px;">Density</div>
      <div style="display:flex;gap:8px;">
        <button v-for="d in ['compact','comfortable','spacious']" :key="d"
          style="height:32px;padding:0 14px;border-radius:var(--zg-radius-md);cursor:pointer;font-size:12px;transition:all .1s;"
          :style="{ border: v.density===d?'1px solid var(--zg-accent)':'1px solid var(--zg-line)', background: v.density===d?'oklch(0.78 0.18 130 / 0.1)':'transparent', color: v.density===d?'var(--zg-accent)':'var(--zg-text-dim)' }"
          @click="v.density = d">{{ d.charAt(0).toUpperCase()+d.slice(1) }}</button>
      </div>
    </div>

    <div class="up-card" style="margin-bottom:12px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="up-field">
          <label class="up-lbl">Language</label>
          <select v-model="v.lang" class="up-inp" style="cursor:pointer;">
            <option value="en">English</option><option value="ar">العربية</option>
          </select>
        </div>
        <div class="up-field">
          <label class="up-lbl">Timezone</label>
          <select v-model="v.timezone" class="up-inp" style="cursor:pointer;">
            <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
            <option value="Asia/Riyadh">Asia/Riyadh (AST, UTC+3)</option>
            <option value="Africa/Cairo">Africa/Cairo (EET, UTC+2)</option>
          </select>
        </div>
        <div class="up-field">
          <label class="up-lbl">Date Format</label>
          <select v-model="v.dateFormat" class="up-inp" style="cursor:pointer;">
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div class="up-field">
          <label class="up-lbl">Display Currency</label>
          <select v-model="v.currency" class="up-inp" style="cursor:pointer;">
            <option v-for="c in ['AED','SAR','EGP','USD']" :key="c">{{ c }}</option>
          </select>
        </div>
      </div>
    </div>
    <button class="up-btn-primary" @click="">Save Preferences</button>
  </div>
</template>
