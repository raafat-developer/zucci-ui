<script setup>
import { ref } from 'vue';

const emit = defineEmits(['upload']);
const dragging = ref(false);
const uploading = ref(false);

function handleFiles(files) {
  if (!files.length) return;
  uploading.value = true;
  setTimeout(() => {
    files.forEach(f => emit('upload', f));
    uploading.value = false;
  }, 1200);
}

function onDrop(e) {
  e.preventDefault();
  dragging.value = false;
  handleFiles([...e.dataTransfer.files]);
}

function onFileInput(e) {
  handleFiles([...e.target.files]);
}
</script>

<template>
  <label
    class="zfl-upload-zone"
    :class="{ 'is-dragging': dragging }"
    @dragover.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop="onDrop"
  >
    <input
      type="file" multiple
      accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
      style="display: none;"
      @change="onFileInput"
    />
    <div v-if="uploading" class="zfl-uploading">
      <div class="zfl-spin" />
      <span>Uploading…</span>
    </div>
    <template v-else>
      <svg viewBox="0 0 20 20" width="28" fill="none"
        :stroke="dragging ? 'var(--zg-accent)' : 'var(--zg-text-dim)'"
        stroke-width="1.5" stroke-linecap="round">
        <path d="M10 3v10M6 7l4-4 4 4"/><path d="M3 17h14"/>
      </svg>
      <div>
        <div class="zfl-upload-primary" :class="{ 'is-dragging': dragging }">Drop files or click to upload</div>
        <div class="zfl-upload-sub">Images, videos, PDF, Word, Excel · max 50 MB</div>
      </div>
    </template>
  </label>
</template>

<style scoped>
.zfl-upload-zone {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  height: 120px; border: 2px dashed var(--zg-line); border-radius: var(--zg-radius-md);
  background: transparent; cursor: pointer; transition: all .15s; text-align: center;
}
.zfl-upload-zone.is-dragging { border-color: var(--zg-accent); background: oklch(0.78 0.18 130 / 0.06); }
.zfl-uploading { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 12px; color: var(--zg-text-dim); }
.zfl-spin { width: 24px; height: 24px; border: 2px solid var(--zg-accent); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.zfl-upload-primary { font-size: 12.5px; font-weight: 600; color: var(--zg-text-mid); }
.zfl-upload-primary.is-dragging { color: var(--zg-accent); }
.zfl-upload-sub { font-size: 11px; color: var(--zg-text-dim); margin-top: 2px; }
</style>
