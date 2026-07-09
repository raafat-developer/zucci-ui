<script setup>
/**
 * ProfileView — My Account full-page view.
 * 7 sections: Profile · Security · Devices · Activity · Notif Prefs · Appearance · Help
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ProfileSection    from './profile/ProfileSection.vue';
import SecuritySection   from './profile/SecuritySection.vue';
import DevicesSection    from './profile/DevicesSection.vue';
import ActivitySection   from './profile/ActivitySection.vue';
import NotifPrefsSection from './profile/NotifPrefsSection.vue';
import AppearanceSection from './profile/AppearanceSection.vue';
import HelpSection       from './profile/HelpSection.vue';

const router = useRouter();
const sec = ref('profile');

const SECTIONS = [
  { id:'profile',     label:'Profile' },
  { id:'security',    label:'Security' },
  { id:'devices',     label:'Devices & Sessions' },
  { id:'activity',    label:'Activity Log' },
  { id:'notif_prefs', label:'Notification Prefs' },
  { id:'appearance',  label:'Appearance' },
  { id:'help',        label:'Help & Docs' },
];

function logout() { router.push('/auth/signin-id'); }
</script>

<template>
  <div class="up-wrap">
    <!-- Sidebar -->
    <nav class="up-nav">
      <!-- Avatar -->
      <div class="up-nav-avatar-row">
        <div class="up-avatar up-avatar-sm">SM</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--zg-text);">Sara Medhat</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim);">Super Admin</div>
        </div>
      </div>

      <button v-for="s in SECTIONS" :key="s.id"
        class="up-nav-btn" :class="{ 'is-active': sec === s.id }"
        @click="sec = s.id">
        {{ s.label }}
      </button>

      <div style="margin-top:auto;padding-top:12px;border-top:1px solid var(--zg-line);">
        <button class="up-nav-btn" style="color:var(--zg-danger);" @click="logout">Sign Out</button>
      </div>
    </nav>

    <!-- Content -->
    <div class="up-body">
      <ProfileSection    v-if="sec === 'profile'" />
      <SecuritySection   v-else-if="sec === 'security'" />
      <DevicesSection    v-else-if="sec === 'devices'" />
      <ActivitySection   v-else-if="sec === 'activity'" />
      <NotifPrefsSection v-else-if="sec === 'notif_prefs'" />
      <AppearanceSection v-else-if="sec === 'appearance'" />
      <HelpSection       v-else-if="sec === 'help'" />
    </div>
  </div>
</template>

<style scoped>
.up-wrap { display:flex;height:100%;min-height:0;width:100%; }

/* Sidebar */
.up-nav { width:200px;flex-shrink:0;border-right:1px solid var(--zg-line);background:var(--zg-bg-elev);display:flex;flex-direction:column;padding:16px 0;overflow-y:auto;scrollbar-width:thin;height:100%;box-sizing:border-box; }
.up-nav-avatar-row { display:flex;align-items:center;gap:10px;padding:0 14px 14px;border-bottom:1px solid var(--zg-line);margin-bottom:6px; }
.up-nav-btn { width:100%;height:34px;padding:0 16px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;font-family:inherit;font-size:12px;color:var(--zg-text-dim);text-align:left;transition:all .1s; }
.up-nav-btn:hover { background:var(--zg-panel);color:var(--zg-text-mid); }
.up-nav-btn.is-active { background:var(--zg-panel);color:var(--zg-text);font-weight:600;border-right:2px solid var(--zg-accent); }

/* Content */
.up-body { flex:1;overflow-y:auto;padding:24px;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;min-width:0;height:100%;box-sizing:border-box; }

/* Shared section styles (deep) */
:deep(.up-section-title) { font-size:18px;font-weight:700;color:var(--zg-text);margin-bottom:4px; }
:deep(.up-section-sub) { font-size:12px;color:var(--zg-text-dim);margin-bottom:24px; }
:deep(.up-avatar) { width:56px;height:56px;border-radius:50%;background:var(--zg-accent);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:17px;font-weight:800;color:oklch(0.18 0.04 130);letter-spacing:-.02em; }
:deep(.up-avatar-sm) { width:36px;height:36px;font-size:12px; }
:deep(.up-avatar-card) { display:flex;align-items:center;gap:16px;margin-bottom:24px;padding:16px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md); }
:deep(.up-card) { background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);padding:14px 16px; }
:deep(.up-field) { display:flex;flex-direction:column;gap:4px; }
:deep(.up-lbl) { font-size:11px;font-weight:600;color:var(--zg-text-mid); }
:deep(.up-inp) { height:32px;padding:0 10px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box; }
:deep(.up-btn-primary) { height:32px;padding:0 14px;border:none;border-radius:var(--zg-radius-md);background:var(--zg-accent);color:oklch(0.18 0.04 130);font-weight:700;font-size:12px;cursor:pointer; }
:deep(.up-btn-ghost) { height:32px;padding:0 14px;border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);background:transparent;color:var(--zg-text-mid);font-size:12px;cursor:pointer; }
:deep(.up-act) { height:24px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:11px;color:var(--zg-text-dim); }
:deep(.up-toggle) { width:36px;height:20px;border-radius:10px;border:none;cursor:pointer;background:var(--zg-line);position:relative;flex-shrink:0;transition:background .14s; }
:deep(.up-toggle.is-on) { background:var(--zg-accent); }
:deep(.up-toggle-knob) { width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:3px;left:3px;transition:left .14s; }
:deep(.up-toggle.is-on .up-toggle-knob) { left:18px; }
</style>
