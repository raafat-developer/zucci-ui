<script setup>
import { ref, reactive, computed } from "vue";

const v = reactive({
  first: "Sara",
  last: "Medhat",
  email: "s.medhat@zucci.com",
  phone: "+971 50 123 4567",
  role: "Super Admin",
  dept: "Operations",
  bio: "",
  timezone: "Asia/Dubai",
  lang: "en",
});
const name = computed(() => `${v.first} ${v.last}`);
const initials = computed(() =>
  name.value
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
);
</script>

<template>
  <div>
    <div class="up-section-title">Profile</div>
    <div class="up-section-sub">
      Manage your personal information and contact details
    </div>

    <!-- Avatar card -->
    <div class="up-avatar-card">
      <div class="up-avatar">{{ initials }}</div>
      <div style="flex: 1">
        <div style="font-size: 16px; font-weight: 700; color: var(--zg-text)">
          {{ name }}
        </div>
        <div
          style="font-size: 12px; color: var(--zg-text-dim); margin-top: 2px"
        >
          {{ v.role }} · {{ v.dept }}
        </div>
        <div
          style="
            font-size: 11.5px;
            font-family: var(--zg-mono);
            color: var(--zg-text-dim);
            margin-top: 2px;
          "
        >
          {{ v.email }}
        </div>
      </div>
      <label class="up-btn-ghost" style="cursor: pointer">
        <input type="file" accept="image/*" style="display: none" @change="" />
        Change Photo
      </label>
    </div>

    <!-- Fields grid -->
    <div
      style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 16px;
      "
    >
      <div class="up-field">
        <label class="up-lbl">First Name</label
        ><input v-model="v.first" class="up-inp" />
      </div>
      <div class="up-field">
        <label class="up-lbl">Last Name</label
        ><input v-model="v.last" class="up-inp" />
      </div>
      <div class="up-field">
        <label class="up-lbl">Email</label
        ><input v-model="v.email" type="email" class="up-inp" />
      </div>
      <div class="up-field">
        <label class="up-lbl">Phone</label
        ><input
          v-model="v.phone"
          class="up-inp"
          style="font-family: var(--zg-mono)"
        />
      </div>
      <div class="up-field">
        <label class="up-lbl">Role</label
        ><input
          :value="v.role"
          class="up-inp"
          disabled
          style="opacity: 0.6; cursor: not-allowed"
        />
      </div>
      <div class="up-field">
        <label class="up-lbl">Department</label
        ><input
          :value="v.dept"
          class="up-inp"
          disabled
          style="opacity: 0.6; cursor: not-allowed"
        />
      </div>
    </div>
    <div class="up-field" style="margin-bottom: 16px">
      <label class="up-lbl">Bio</label>
      <textarea
        v-model="v.bio"
        placeholder="A short description about you…"
        class="up-inp"
        rows="3"
        style="height: auto; resize: vertical"
      />
    </div>
    <button class="up-btn-primary" @click="">Save Changes</button>
  </div>
</template>
