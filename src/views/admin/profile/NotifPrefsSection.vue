<script setup>
import { reactive } from 'vue';

const prefs = reactive({
  email_orders:   true,
  email_tickets:  true,
  email_payouts:  false,
  email_reports:  true,
  push_orders:    true,
  push_tickets:   true,
  push_system:    false,
  sms_critical:   true,
  in_app_all:     true,
  digest_weekly:  true,
});

const TOGGLES = [
  { group:'Email', items:[
    { key:'email_orders',  label:'Order Updates',        sub:'New orders, status changes' },
    { key:'email_tickets', label:'Ticket Notifications', sub:'New and updated tickets' },
    { key:'email_payouts', label:'Payout Statements',    sub:'Weekly payout summaries' },
    { key:'email_reports', label:'Weekly Reports',       sub:'Performance and analytics digest' },
  ]},
  { group:'Push Notifications', items:[
    { key:'push_orders',  label:'Order Alerts',    sub:'Urgent order issues' },
    { key:'push_tickets', label:'Ticket Alerts',   sub:'SLA breaches and escalations' },
    { key:'push_system',  label:'System Alerts',   sub:'Downtime and maintenance' },
  ]},
  { group:'SMS', items:[
    { key:'sms_critical', label:'Critical Alerts Only', sub:'SLA breaches, payment failures' },
  ]},
  { group:'In-App', items:[
    { key:'in_app_all',    label:'All Notifications',  sub:'Show notification dot on bell' },
    { key:'digest_weekly', label:'Weekly Digest Email', sub:'Summary every Monday 9:00 GST' },
  ]},
];
</script>

<template>
  <div style="max-width:640px;">
    <div class="up-section-title">Notification Preferences</div>
    <div class="up-section-sub">Choose which notifications you receive and how</div>
    <div v-for="grp in TOGGLES" :key="grp.group" class="up-card" style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:var(--zg-text);margin-bottom:4px;">{{ grp.group }}</div>
      <div v-for="item in grp.items" :key="item.key" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--zg-line);">
        <div>
          <div style="font-size:12.5px;font-weight:500;color:var(--zg-text);">{{ item.label }}</div>
          <div style="font-size:11px;color:var(--zg-text-dim);margin-top:1px;">{{ item.sub }}</div>
        </div>
        <button class="up-toggle" :class="{ 'is-on': prefs[item.key] }" @click="prefs[item.key] = !prefs[item.key]">
          <div class="up-toggle-knob" />
        </button>
      </div>
    </div>
    <button class="up-btn-primary" @click="">Save Preferences</button>
  </div>
</template>
