<script setup>
import { reactive } from 'vue';
import SToggle from '../SToggle.vue';
const v = reactive({ theme:'dark', accent:'#b5f23d', bg:'#0a0b0d', font:'system', radius:'medium', density:'comfortable', lang:'en', tz:'Asia/Dubai', dateFormat:'DD/MM/YYYY' });
</script>
<template>
  <div class="zset-content">
    <div class="zset-content-head">
      <div><div class="zset-content-title">Appearance</div><div class="zset-content-sub">Theme colors, typography, density, and locale settings</div></div>
      <button class="zwh-btn-primary">Save</button>
    </div>

    <!-- Colors -->
    <div class="zset-card" style="margin-bottom:12px;">
      <div class="zset-card-title">Brand Colors</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div><div class="sf-lbl">Primary Accent</div><div style="display:flex;align-items:center;gap:8px;margin-top:4px;"><input type="color" v-model="v.accent" class="color-pick" /><span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text);">{{ v.accent }}</span></div></div>
        <div><div class="sf-lbl">Background</div><div style="display:flex;align-items:center;gap:8px;margin-top:4px;"><input type="color" v-model="v.bg" class="color-pick" /><span style="font-family:var(--zg-mono);font-size:12px;color:var(--zg-text);">{{ v.bg }}</span></div></div>
      </div>
    </div>

    <!-- Logo -->
    <div class="zset-card" style="margin-bottom:12px;">
      <div class="zset-card-title">Logo Upload</div>
      <div style="display:flex;align-items:center;gap:12px;margin-top:4px;">
        <div style="width:64px;height:64px;background:var(--zg-panel-hi);border:1px dashed var(--zg-line);border-radius:var(--zg-radius-md);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--zg-text-dim);">Logo</div>
        <label style="height:30px;padding:0 12px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;font-size:11.5px;cursor:pointer;color:var(--zg-text-mid);display:flex;align-items:center;">
          <input type="file" accept="image/*" style="display:none;" @change="" />Upload Logo
        </label>
      </div>
    </div>

    <!-- Typography -->
    <div class="zset-card" style="margin-bottom:12px;">
      <div class="zset-card-title">Typography</div>
      <div class="sf-lbl" style="margin-bottom:6px;">UI Font</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button v-for="f in ['system','inter','dm-sans','geist']" :key="f" class="opt-btn" :class="{ 'is-on': v.font===f }" @click="v.font=f">{{ {system:'System',inter:'Inter','dm-sans':'DM Sans',geist:'Geist'}[f] }}</button>
      </div>
    </div>

    <!-- Border radius -->
    <div class="zset-card" style="margin-bottom:12px;">
      <div class="zset-card-title">Border Radius</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
        <button v-for="r in ['none','small','medium','large']" :key="r" class="opt-btn" :class="{ 'is-on': v.radius===r }" @click="v.radius=r">{{ r.charAt(0).toUpperCase()+r.slice(1) }}</button>
      </div>
    </div>

    <!-- Density -->
    <div class="zset-card" style="margin-bottom:12px;">
      <div class="zset-card-title">Density</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
        <button v-for="d in ['compact','comfortable','spacious']" :key="d" class="opt-btn" :class="{ 'is-on': v.density===d }" @click="v.density=d">{{ d.charAt(0).toUpperCase()+d.slice(1) }}</button>
      </div>
    </div>

    <!-- Locale -->
    <div class="zset-card">
      <div class="zset-card-title">Locale</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px;">
        <div><div class="sf-lbl">Language</div><select v-model="v.lang" class="sf-sel"><option value="en">English</option><option value="ar">العربية</option></select></div>
        <div><div class="sf-lbl">Timezone</div><select v-model="v.tz" class="sf-sel"><option value="Asia/Dubai">GST (UTC+4)</option><option value="Asia/Riyadh">AST (UTC+3)</option><option value="Africa/Cairo">EET (UTC+2)</option></select></div>
        <div><div class="sf-lbl">Date Format</div><select v-model="v.dateFormat" class="sf-sel"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.zset-card { background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px 16px; }
.zset-card-title { font-size:13px;font-weight:600;color:var(--zg-text);margin-bottom:10px; }
.sf-lbl { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
.sf-sel { width:100%;height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;cursor:pointer; }
.color-pick { width:36px;height:36px;border:1px solid var(--zg-line);border-radius:4px;cursor:pointer;padding:2px; }
.opt-btn { height:28px;padding:0 12px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:12px;color:var(--zg-text-dim);transition:all .1s; }
.opt-btn.is-on { border-color:var(--zg-accent);color:var(--zg-accent);background:oklch(0.78 0.18 130 / 0.1); }
</style>
