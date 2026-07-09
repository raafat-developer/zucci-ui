<script setup>
import { ref } from 'vue';
import { TYPE_COLORS } from '@/data/filesData';

const props = defineProps({ file: Object });
const emit  = defineEmits(['close', 'delete']);

const copied = ref(false);
const fakeUrl = () => `https://cdn.zucci.com/${props.file.folder}/${props.file.name}`;

function copy() {
  navigator.clipboard?.writeText(fakeUrl());
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

const META = ['Type', 'Size', 'Dimensions', 'Uploaded', 'Uploaded by'];
function metaValue(label) {
  const f = props.file;
  return { Type: f.type, Size: f.size, Dimensions: f.dims, Uploaded: f.uploaded, 'Uploaded by': f.uploader }[label];
}
</script>

<template>
  <div class="zfl-detail">
    <!-- Header -->
    <div class="zfl-detail-head">
      <span class="zfl-detail-title">File Details</span>
      <button class="zfl-detail-close" @click="emit('close')">×</button>
    </div>

    <div class="zfl-detail-body">
      <!-- Preview -->
      <div class="zfl-detail-preview">
        <img v-if="file.url" :src="file.url" :alt="file.name" />
        <div v-else class="zfl-detail-preview-icon" :style="{ color: TYPE_COLORS[file.type] }">
          <svg v-if="file.type==='image'" viewBox="0 0 16 16" width="32" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="1" y="3" width="14" height="10" rx="1.5"/><circle cx="5.5" cy="6.5" r="1.2"/><path d="M1 11l4-4 3 3 2-2 5 4"/></svg>
          <svg v-else-if="file.type==='pdf'" viewBox="0 0 16 16" width="32" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2" y="1" width="12" height="14" rx="1"/><path d="M5 7h2M5 10h6M5 4h6"/></svg>
          <svg v-else-if="file.type==='video'" viewBox="0 0 16 16" width="32" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="1" y="3" width="10" height="10" rx="1"/><path d="M11 6l4-2v8l-4-2v-4z"/></svg>
          <svg v-else viewBox="0 0 16 16" width="32" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2" y="1" width="12" height="14" rx="1"/><path d="M5 5h6M5 8h6M5 11h4"/></svg>
          <span class="zfl-detail-type-label">{{ file.type.toUpperCase() }}</span>
        </div>
      </div>

      <!-- Info -->
      <div class="zfl-detail-section">
        <div class="zfl-detail-filename">{{ file.name }}</div>
        <div class="zfl-detail-folder">{{ file.folder }}</div>
      </div>

      <!-- Metadata -->
      <div class="zfl-detail-section zfl-meta-grid">
        <template v-for="label in META" :key="label">
          <span class="zfl-meta-label">{{ label }}</span>
          <span class="zfl-meta-value">{{ metaValue(label) }}</span>
        </template>
      </div>

      <!-- CDN URL -->
      <div class="zfl-detail-section">
        <div class="zfl-url-box">
          <div class="zfl-url-label">CDN URL</div>
          <div class="zfl-url-val">{{ fakeUrl() }}</div>
          <button class="zfl-url-copy" :class="{ 'is-copied': copied }" @click="copy">
            {{ copied ? 'Copied!' : 'Copy URL' }}
          </button>
        </div>
      </div>

      <!-- Tags -->
      <div class="zfl-detail-section">
        <div class="zfl-section-label">Tags</div>
        <div class="zfl-tags-wrap">
          <span v-for="tag in file.tags" :key="tag" class="zfl-tag-pill">{{ tag }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="zfl-detail-section zfl-actions">
        <button class="zfl-btn-download">Download</button>
        <button class="zfl-btn-copy-folder">Copy to folder</button>
        <button class="zfl-btn-delete" @click="() => { emit('delete', file.id); emit('close'); }">Delete file</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zfl-detail {
  width: 280px; flex-shrink: 0;
  border-left: 1px solid var(--zg-line);
  display: flex; flex-direction: column;
  background: var(--zg-bg-elev); height: 100%; min-height: 0;
}
.zfl-detail-head {
  padding: 12px 14px; border-bottom: 1px solid var(--zg-line);
  display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
}
.zfl-detail-title { font-size: 12.5px; font-weight: 700; color: var(--zg-text); }
.zfl-detail-close { width: 24px; height: 24px; border: none; background: transparent; cursor: pointer; color: var(--zg-text-dim); font-size: 16px; line-height: 1; }

.zfl-detail-body { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }

.zfl-detail-preview {
  height: 160px; background: var(--zg-panel-hi);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.zfl-detail-preview img { width: 100%; height: 100%; object-fit: cover; }
.zfl-detail-preview-icon { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.zfl-detail-type-label { font-size: 11px; color: var(--zg-text-dim); margin-top: 8px; }

.zfl-detail-section { padding: 12px 14px; border-bottom: 1px solid var(--zg-line); }
.zfl-detail-filename { font-size: 12.5px; font-weight: 700; color: var(--zg-text); word-break: break-all; line-height: 1.4; }
.zfl-detail-folder { font-size: 11px; color: var(--zg-text-dim); margin-top: 3px; }

.zfl-meta-grid { display: grid; grid-template-columns: auto 1fr; gap: 5px 12px; }
.zfl-meta-label { font-size: 11.5px; color: var(--zg-text-dim); white-space: nowrap; }
.zfl-meta-value { font-size: 11.5px; font-weight: 500; color: var(--zg-text); text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.zfl-url-box { background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 8px 10px; }
.zfl-url-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--zg-text-dim); font-weight: 600; margin-bottom: 4px; }
.zfl-url-val { font-family: var(--zg-mono); font-size: 10px; color: var(--zg-text-mid); word-break: break-all; line-height: 1.5; margin-bottom: 6px; }
.zfl-url-copy { height: 24px; padding: 0 8px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 10.5px; color: var(--zg-text-dim); }
.zfl-url-copy.is-copied { color: var(--zg-good); }

.zfl-section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--zg-text-dim); font-weight: 600; margin-bottom: 6px; }
.zfl-tags-wrap { display: flex; gap: 4px; flex-wrap: wrap; }
.zfl-tag-pill { height: 20px; padding: 0 7px; border-radius: 2px; background: var(--zg-panel); border: 1px solid var(--zg-line); font-size: 10.5px; color: var(--zg-text-dim); display: inline-flex; align-items: center; }

.zfl-actions { display: flex; flex-direction: column; gap: 6px; border-bottom: none; }
.zfl-btn-download { height: 32px; border: 1px solid var(--zg-accent); border-radius: var(--zg-radius-md); background: var(--zg-accent-tint, oklch(0.78 0.18 130 / 0.08)); cursor: pointer; font-size: 12px; font-weight: 600; color: var(--zg-accent); }
.zfl-btn-copy-folder { height: 32px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: transparent; cursor: pointer; font-size: 12px; color: var(--zg-text-mid); }
.zfl-btn-delete { height: 32px; border: 1px solid oklch(0.70 0.18 25 / 0.4); border-radius: var(--zg-radius-md); background: transparent; cursor: pointer; font-size: 12px; color: var(--zg-danger); }
</style>
