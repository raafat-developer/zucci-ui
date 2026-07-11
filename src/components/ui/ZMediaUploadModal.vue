<script setup>
/**
 * ZMediaUploadModal — global reusable media picker modal.
 *
 * Features:
 * - Drag & drop + click-to-browse file upload
 * - URL import tab
 * - Library tab (previously uploaded assets)
 * - Multi-select with preview
 * - File type + size validation
 * - Emits 'confirm' with selected files array
 *
 * Usage:
 *   <ZMediaUploadModal :open="mediaOpen" @close="mediaOpen=false" @confirm="onMedia" />
 *   function onMedia(files) { /* files: [{ id, url, name, size, type }] *\/ }
 */
import { ref, reactive, computed, watch, onMounted } from "vue";
import { getFiles, uploadFile } from "@/api/files";

const props = defineProps({
  open: { type: Boolean, default: false },
  multiple: { type: Boolean, default: true },
  accept: { type: String, default: "image/*" },
  maxSizeMb: { type: Number, default: 20 },
  title: { type: String, default: "Add Media" },
});
const emit = defineEmits(["close", "confirm"]);

const tab = ref("upload"); // upload | url
const dragging = ref(false);
const urlInput = ref("");
const urlError = ref("");
const selected = ref([]); // ids of selected library items
const queued = ref([]); // files staged for upload
const library = ref([]); // files from API
const loadingLibrary = ref(false);
const uploading = ref(false);

// ── Library from API ──────────────────────────────────────────
const libSearch = ref("");
const filteredLib = computed(() => {
  const q = libSearch.value.toLowerCase();
  return q
    ? library.value.filter((f) => f.name?.toLowerCase().includes(q))
    : library.value;
});

async function fetchLibrary() {
  if (loadingLibrary.value) return;
  loadingLibrary.value = true;
  try {
    const response = await getFiles();
    const responseData = response.data?.data || response.data || [];

    library.value = responseData.map((f) => ({
      id: f.id || f.fileId,
      url: f.url,
      name: f.filename || f.name,
      size: f.sizeBytes
        ? f.sizeBytes < 1024 * 1024
          ? (f.sizeBytes / 1024).toFixed(0) + " KB"
          : (f.sizeBytes / 1024 / 1024).toFixed(1) + " MB"
        : "—",
      type: f.mimeType || "image/jpeg",
      used: f.usageCount || 0,
    }));
  } catch (error) {
    console.error("Failed to fetch library:", error);
    library.value = [];
  } finally {
    loadingLibrary.value = false;
  }
}

// Fetch library when component mounts
onMounted(() => {
  fetchLibrary();
});

// ── Reset on close ─────────────────────────────────────────
watch(
  () => props.open,
  (v) => {
    if (v) {
      fetchLibrary();
    } else {
      queued.value = [];
      selected.value = [];
      urlInput.value = "";
      urlError.value = "";
      tab.value = "upload";
    }
  },
);

// ── Drag & Drop ────────────────────────────────────────────
function onDrop(e) {
  e.preventDefault();
  dragging.value = false;
  processFiles([...e.dataTransfer.files]);
}
function onFileInput(e) {
  processFiles([...e.target.files]);
}

function processFiles(files) {
  const valid = files.filter((f) => {
    if (f.size > props.maxSizeMb * 1024 * 1024) return false;
    if (props.accept === "image/*" && !f.type.startsWith("image/"))
      return false;
    return true;
  });
  const previews = valid.map((f) => ({
    id: "q-" + Date.now() + "-" + Math.random().toString(36).slice(2),
    name: f.name,
    size:
      f.size / 1024 < 1024
        ? (f.size / 1024).toFixed(0) + " KB"
        : (f.size / 1024 / 1024).toFixed(1) + " MB",
    type: f.type,
    url: URL.createObjectURL(f),
    file: f,
  }));
  if (!props.multiple) queued.value = previews.slice(0, 1);
  else queued.value = [...queued.value, ...previews];
}

function removeQueued(id) {
  queued.value = queued.value.filter((f) => f.id !== id);
}

// ── URL Import ─────────────────────────────────────────────
function addUrl() {
  urlError.value = "";
  const u = urlInput.value.trim();
  if (!u) {
    urlError.value = "Enter a valid URL";
    return;
  }
  try {
    new URL(u);
  } catch {
    urlError.value = "Invalid URL format";
    return;
  }
  const ext = u.split("?")[0].split(".").pop().toLowerCase();
  const name = u.split("/").pop().split("?")[0] || "image.jpg";
  const item = {
    id: "url-" + Date.now(),
    url: u,
    name,
    size: "—",
    type: `image/${ext || "jpeg"}`,
  };
  if (!props.multiple) queued.value = [item];
  else queued.value = [...queued.value, item];
  urlInput.value = "";
}

// ── Library select ─────────────────────────────────────────
function toggleLibItem(id) {
  if (!props.multiple) {
    selected.value = selected.value[0] === id ? [] : [id];
    return;
  }
  const idx = selected.value.indexOf(id);
  idx >= 0 ? selected.value.splice(idx, 1) : selected.value.push(id);
}

// ── Confirm ────────────────────────────────────────────────
const confirmCount = computed(
  () => queued.value.length + selected.value.length,
);

async function confirm() {
  if (uploading.value) return;
  uploading.value = true;
  try {
    const uploadedFiles = [];
    // 1. Upload queued files if they have file objects
    for (const f of queued.value) {
      if (f.file) {
        const res = await uploadFile(f.file);
        const uploaded = res.data || res;
        uploadedFiles.push({
          id: uploaded.id || uploaded.fileId,
          url: uploaded.url,
          name: f.name || uploaded.filename || "image.jpg",
          size: f.size,
          type: f.type,
        });
      } else {
        // If it's a URL import and has no f.file (option direct)
        uploadedFiles.push(f);
      }
    }

    // 2. Map selected library files
    const libFiles = library.value.filter((f) => selected.value.includes(f.id));

    emit("confirm", [...uploadedFiles, ...libFiles]);
    emit("close");
  } catch (error) {
    console.error("Failed to upload queued files:", error);
    window.toast?.error(error.message || "Failed to upload staged files");
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      style="
        position: fixed;
        inset: 0;
        z-index: 9500;
        background: oklch(0.1 0.01 250 / 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
      "
      @click="emit('close')"
    >
      <div class="zm-modal" @click.stop>
        <!-- Header -->
        <div class="zm-head">
          <div>
            <div class="zm-title">{{ title }}</div>
            <div class="zm-sub">
              {{ multiple ? "Select one or more files" : "Select a file" }}
            </div>
          </div>
          <button class="zm-close" @click="emit('close')">×</button>
        </div>

        <!-- Tabs -->
        <div class="zm-tabs">
          <button
            v-for="[v, l] in [
              ['upload', 'Upload'],
              ['url', 'From URL'],
            ]"
            :key="v"
            class="zm-tab"
            :class="{ 'is-active': tab === v }"
            @click="tab = v"
          >
            {{ l }}
          </button>
        </div>

        <!-- Content -->
        <div class="zm-body">
          <!-- Upload tab -->
          <template v-if="tab === 'upload'">
            <!-- Drop zone -->
            <div
              class="zm-dropzone"
              :class="{ 'is-drag': dragging }"
              @dragover.prevent="dragging = true"
              @dragleave="dragging = false"
              @drop="onDrop"
            >
              <svg
                viewBox="0 0 40 40"
                width="36"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                style="color: var(--zg-text-dim); margin-bottom: 10px"
              >
                <path d="M20 28V12M13 19l7-7 7 7" />
                <rect
                  x="4"
                  y="28"
                  width="32"
                  height="8"
                  rx="3"
                  stroke-dasharray="3 3"
                />
              </svg>
              <div class="zm-drop-title">
                {{ dragging ? "Drop files here" : "Drag & drop files here" }}
              </div>
              <div class="zm-drop-sub">
                Supports JPG, PNG, WebP, GIF · Max {{ maxSizeMb }}MB each
              </div>
              <label class="zm-browse-btn">
                <input
                  type="file"
                  :accept="accept"
                  :multiple="multiple"
                  style="display: none"
                  @change="onFileInput"
                />
                Browse Files
              </label>
            </div>

            <!-- Queued files -->
            <div
              v-if="queued.length"
              style="
                margin-top: 14px;
                display: flex;
                flex-direction: column;
                gap: 6px;
              "
            >
              <div class="zm-section-title">
                Staged for upload ({{ queued.length }})
              </div>
              <div v-for="f in queued" :key="f.id" class="zm-file-row">
                <div class="zm-file-thumb">
                  <img
                    :src="f.url"
                    :alt="f.name"
                    style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 3px;
                    "
                  />
                </div>
                <div class="zm-file-info">
                  <div class="zm-file-name">{{ f.name }}</div>
                  <div class="zm-file-meta">{{ f.size }} · {{ f.type }}</div>
                </div>
                <button class="zm-file-remove" @click="removeQueued(f.id)">
                  ×
                </button>
              </div>
            </div>

            <div
              style="
                display: flex;
                flex-direction: column;
                gap: 10px;
                height: 100%;
              "
            >
              <div
                v-if="loadingLibrary"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 40px;
                  color: var(--zg-text-dim);
                  font-size: 12px;
                "
              >
                Loading library…
              </div>
              <template v-else>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                  "
                >
                  <div class="zm-lib-search">
                    <svg
                      viewBox="0 0 14 14"
                      width="12"
                      fill="none"
                      stroke="var(--zg-text-dim)"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      style="
                        position: absolute;
                        left: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        pointer-events: none;
                      "
                    >
                      <circle cx="5.5" cy="5.5" r="4" />
                      <path d="M9.5 9.5l3 3" />
                    </svg>
                    <input
                      v-model="libSearch"
                      placeholder="Search library…"
                      class="zm-lib-search-inp"
                    />
                  </div>
                  <span style="font-size: 11.5px; color: var(--zg-text-dim)"
                    >{{ library.length }} assets ·
                    {{ selected.length }} selected</span
                  >
                </div>
                <div
                  v-if="library.length === 0"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    color: var(--zg-text-dim);
                    font-size: 12px;
                  "
                >
                  No files in library
                </div>
                <div v-else class="zm-lib-grid">
                  <div
                    v-for="f in filteredLib"
                    :key="f.id"
                    class="zm-lib-item"
                    :class="{ 'is-selected': selected.includes(f.id) }"
                    @click="toggleLibItem(f.id)"
                  >
                    <img :src="f.url" :alt="f.name" />
                    <!-- Selection indicator -->
                    <div
                      class="zm-lib-check"
                      :class="{ 'is-on': selected.includes(f.id) }"
                    >
                      <svg
                        v-if="selected.includes(f.id)"
                        viewBox="0 0 12 12"
                        width="10"
                        fill="none"
                        stroke="oklch(0.18 0.04 130)"
                        stroke-width="2"
                        stroke-linecap="round"
                      >
                        <polyline points="2 6 5 9 10 3" />
                      </svg>
                    </div>
                    <!-- Used badge -->
                    <div v-if="f.used > 0" class="zm-lib-used">
                      Used {{ f.used }}×
                    </div>
                    <!-- Name tooltip on hover -->
                    <div class="zm-lib-name">{{ f.name }}</div>
                  </div>
                </div>
              </template>
            </div>
          </template>

          <!-- URL tab -->
          <template v-else-if="tab === 'url'">
            <div style="display: flex; flex-direction: column; gap: 10px">
              <div class="zm-section-title">Import from URL</div>
              <div style="font-size: 11.5px; color: var(--zg-text-dim)">
                Enter a direct link to an image. CDN and HTTPS links work best.
              </div>
              <div style="display: flex; gap: 8px">
                <input
                  v-model="urlInput"
                  class="zm-url-input"
                  placeholder="https://example.com/image.jpg"
                  @keydown.enter="addUrl"
                />
                <button class="zm-url-btn" @click="addUrl">Add</button>
              </div>
              <div
                v-if="urlError"
                style="font-size: 11.5px; color: var(--zg-danger)"
              >
                {{ urlError }}
              </div>

              <!-- Staged URL files -->
              <div
                v-if="queued.filter((f) => f.id.startsWith('url-')).length"
                style="
                  display: flex;
                  flex-direction: column;
                  gap: 6px;
                  margin-top: 4px;
                "
              >
                <div
                  v-for="f in queued.filter((q) => q.id.startsWith('url-'))"
                  :key="f.id"
                  class="zm-file-row"
                >
                  <div
                    class="zm-file-thumb"
                    style="
                      background: var(--zg-bg);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <svg
                      viewBox="0 0 14 14"
                      width="12"
                      fill="none"
                      stroke="var(--zg-text-dim)"
                      stroke-width="1.4"
                    >
                      <rect x="1" y="1" width="12" height="12" rx="2" />
                      <path d="M1 9l3-3 3 3 2-2 4 4" />
                    </svg>
                  </div>
                  <div class="zm-file-info">
                    <div class="zm-file-name">{{ f.name }}</div>
                    <div class="zm-file-meta zm-url-text">{{ f.url }}</div>
                  </div>
                  <button class="zm-file-remove" @click="removeQueued(f.id)">
                    ×
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Footer -->
        <div class="zm-foot">
          <span style="font-size: 11.5px; color: var(--zg-text-dim)">
            {{ confirmCount }} file{{ confirmCount !== 1 ? "s" : "" }} selected
          </span>
          <div style="display: flex; gap: 8px">
            <button class="zm-btn-ghost" @click="emit('close')">Cancel</button>
            <button
              class="zm-btn-primary"
              :disabled="confirmCount === 0 || uploading"
              :style="{ opacity: confirmCount > 0 && !uploading ? 1 : 0.4 }"
              @click="confirm"
            >
              <span v-if="uploading">Uploading...</span>
              <span v-else
                >Add {{ confirmCount > 0 ? confirmCount : "" }} File{{
                  confirmCount !== 1 ? "s" : ""
                }}</span
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.zm-modal {
  width: 820px;
  max-width: 95vw;
  max-height: 90vh;
  background: var(--zg-bg-elev);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-lg, 12px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px oklch(0.05 0.01 250 / 0.6);
}

/* Header */
.zm-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--zg-line);
  flex-shrink: 0;
}
.zm-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--zg-text);
}
.zm-sub {
  font-size: 11.5px;
  color: var(--zg-text-dim);
  margin-top: 2px;
}
.zm-close {
  width: 30px;
  height: 30px;
  border: none;
  background: var(--zg-panel);
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  color: var(--zg-text-dim);
}

/* Tabs */
.zm-tabs {
  display: flex;
  border-bottom: 1px solid var(--zg-line);
  flex-shrink: 0;
}
.zm-tab {
  height: 36px;
  padding: 0 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 12.5px;
  color: var(--zg-text-dim);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.zm-tab.is-active {
  color: var(--zg-accent);
  border-bottom-color: var(--zg-accent);
  font-weight: 600;
}

/* Body */
.zm-body {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--zg-line) transparent;
  min-height: 0;
}

/* Drop zone */
.zm-dropzone {
  border: 2px dashed var(--zg-line);
  border-radius: var(--zg-radius-md);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.14s;
  cursor: pointer;
}
.zm-dropzone.is-drag {
  border-color: var(--zg-accent);
  background: oklch(0.78 0.18 130 / 0.06);
}
.zm-drop-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--zg-text);
  margin-bottom: 4px;
}
.zm-drop-sub {
  font-size: 11.5px;
  color: var(--zg-text-dim);
  margin-bottom: 12px;
}
.zm-browse-btn {
  height: 32px;
  padding: 0 16px;
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  background: var(--zg-panel);
  cursor: pointer;
  font-size: 12px;
  color: var(--zg-text-mid);
  display: inline-flex;
  align-items: center;
}
.zm-browse-btn:hover {
  border-color: var(--zg-accent);
  color: var(--zg-accent);
}

/* File rows */
.zm-section-title {
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--zg-text-dim);
  font-weight: 600;
}
.zm-file-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--zg-panel);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
}
.zm-file-thumb {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background: var(--zg-panel-hi);
  flex-shrink: 0;
  overflow: hidden;
}
.zm-file-info {
  flex: 1;
  min-width: 0;
}
.zm-file-name {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--zg-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.zm-file-meta {
  font-size: 10.5px;
  color: var(--zg-text-dim);
  margin-top: 2px;
}
.zm-file-remove {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--zg-text-dim);
  font-size: 16px;
  flex-shrink: 0;
}
.zm-file-remove:hover {
  color: var(--zg-danger);
}

/* URL tab */
.zm-url-input {
  flex: 1;
  height: 32px;
  padding: 0 10px;
  background: var(--zg-panel);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  font-family: var(--zg-mono);
  font-size: 12px;
  color: var(--zg-text);
  outline: none;
}
.zm-url-btn {
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: var(--zg-radius-md);
  background: var(--zg-accent);
  color: oklch(0.18 0.04 130);
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0;
}
.zm-url-text {
  word-break: break-all;
  color: var(--zg-accent);
  font-family: var(--zg-mono);
  font-size: 10px;
}

/* Library */
.zm-lib-search {
  position: relative;
  flex: 1;
}
.zm-lib-search-inp {
  width: 100%;
  height: 30px;
  padding: 0 8px 0 26px;
  background: var(--zg-panel);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  font-size: 12px;
  color: var(--zg-text);
  outline: none;
  box-sizing: border-box;
}
.zm-lib-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
  overflow-y: auto;
}
.zm-lib-item {
  position: relative;
  aspect-ratio: 4/5;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.1s;
}
.zm-lib-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.zm-lib-item.is-selected {
  border-color: var(--zg-accent);
}
.zm-lib-check {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.4);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
}
.zm-lib-check.is-on {
  background: var(--zg-accent);
  border-color: var(--zg-accent);
}
.zm-lib-used {
  position: absolute;
  bottom: 4px;
  left: 4px;
  height: 15px;
  padding: 0 5px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.zm-lib-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 5px 4px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  font-size: 9.5px;
  opacity: 0;
  transition: opacity 0.12s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.zm-lib-item:hover .zm-lib-name {
  opacity: 1;
}

/* Footer */
.zm-foot {
  padding: 12px 20px;
  border-top: 1px solid var(--zg-line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: var(--zg-bg-elev);
}
.zm-btn-primary {
  height: 34px;
  padding: 0 18px;
  border: none;
  border-radius: var(--zg-radius-md);
  background: var(--zg-accent);
  color: oklch(0.18 0.04 130);
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
}
.zm-btn-ghost {
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  background: transparent;
  color: var(--zg-text-mid);
  font-size: 12.5px;
  cursor: pointer;
}
</style>
