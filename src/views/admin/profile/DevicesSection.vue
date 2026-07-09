<script setup>
const SESSIONS = [
  {
    id: "s1",
    device: "MacBook Pro — Chrome 124",
    location: "Dubai, UAE",
    ip: "196.46.x.x",
    last: "Active now",
    current: true,
  },
  {
    id: "s2",
    device: "iPhone 15 Pro — Safari",
    location: "Dubai, UAE",
    ip: "196.46.x.x",
    last: "2h ago",
    current: false,
  },
  {
    id: "s3",
    device: "iPad Air — Chrome",
    location: "Riyadh, KSA",
    ip: "185.92.x.x",
    last: "1d ago",
    current: false,
  },
  {
    id: "s4",
    device: "Windows PC — Firefox",
    location: "Cairo, Egypt",
    ip: "196.30.x.x",
    last: "3d ago",
    current: false,
  },
];
import { ref } from "vue";
const sessions = ref([...SESSIONS]);
</script>

<template>
  <div>
    <div class="up-section-title">Devices & Sessions</div>
    <div class="up-section-sub">Active sessions across all your devices</div>
    <div class="up-card">
      <div
        v-for="s in sessions"
        :key="s.id"
        style="
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--zg-line);
        "
      >
        <div style="flex: 1">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 3px;
            "
          >
            <span
              style="font-size: 12.5px; font-weight: 600; color: var(--zg-text)"
              >{{ s.device }}</span
            >
            <span
              v-if="s.current"
              style="
                height: 16px;
                padding: 0 5px;
                border-radius: 2px;
                background: oklch(0.78 0.15 150 / 0.1);
                color: var(--zg-good);
                font-size: 9.5px;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
              "
              >Current</span
            >
          </div>
          <div style="font-size: 11px; color: var(--zg-text-dim)">
            {{ s.location }} · {{ s.ip }} · {{ s.last }}
          </div>
        </div>
        <button
          v-if="!s.current"
          class="up-act"
          style="color: var(--zg-danger)"
          @click="sessions = sessions.filter((x) => x.id !== s.id)"
        >
          Revoke
        </button>
      </div>
    </div>
    <button
      class="up-btn-ghost"
      style="margin-top: 12px; color: var(--zg-danger)"
      @click="sessions = sessions.filter((s) => s.current)"
    >
      Sign out all other sessions
    </button>
  </div>
</template>
