<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { FILE_DATA, FOLDERS } from '@/data/filesData';
import FileCard from './FileCard.vue';
import FileRow from './FileRow.vue';
import FileDetailPanel from './FileDetailPanel.vue';
import UploadZone from './UploadZone.vue';

const route = useRoute();
const files     = ref([...FILE_DATA]);
const folder    = ref(route.query.folder || 'all');
const search    = ref('');
const viewMode  = ref('grid'); // grid | list
const selected  = ref(new Set());
const detail    = ref(null);
const typeF     = ref('all');
const globalDrag= ref(false);
const uploading = ref([]); // [{id,name,size,progress,done}]

watch(() => route.query.folder, v => { if (v) folder.value = v; });

const folders = computed(() =>
  FOLDERS.map(f => ({ ...f, count: files.value.filter(x => f.id === 'all' || x.folder === f.id).length }))
);

const filtered = computed(() => {
  const sq = search.value.toLowerCase();
  return files.value.filter(f =>
    (folder.value === 'all' || f.folder === folder.value) &&
    (typeF.value === 'all' || f.type === typeF.value) &&
    (!sq || f.name.toLowerCase().includes(sq) || f.tags.some(t => t.includes(sq)) || f.uploader.toLowerCase().includes(sq))
  );
});

const totalSize = computed(() =>
  filtered.value.reduce((s, f) => s + parseFloat(f.size), 0).toFixed(1)
);

function toggleSelect(id) {
  const n = new Set(selected.value);
  n.has(id) ? n.delete(id) : n.add(id);
  selected.value = n;
}
function selectAll()  { selected.value = new Set(filtered.value.map(f => f.id)); }
function clearSelect(){ selected.value = new Set(); }

function deleteFile(id) {
  files.value = files.value.filter(f => f.id !== id);
  const n = new Set(selected.value); n.delete(id); selected.value = n;
}
function deleteSelected() {
  const ids = selected.value;
  files.value = files.value.filter(f => !ids.has(f.id));
  clearSelect();
}

function handleUpload(file) {
  const newFile = {
    id: 'f-' + Date.now(),
    name: file.name,
    type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'doc',
    size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
    dims: '—',
    folder: folder.value === 'all' ? 'images' : folder.value,
    uploaded: 'Just now',
    uploader: 'Sara Medhat',
    url: file.type.startsWith('image') ? URL.createObjectURL(file) : null,
    tags: [],
  };
  files.value = [newFile, ...files.value];
}

function onGlobalDrop(e) {
  e.preventDefault();
  globalDrag.value = false;
  const droppedFiles = [...e.dataTransfer.files];
  if (!droppedFiles.length) return;
  const newUploads = droppedFiles.map(f => ({
    id: Date.now() + Math.random(),
    name: f.name,
    size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
    progress: 0, done: false,
  }));
  uploading.value = [...newUploads, ...uploading.value];
  newUploads.forEach((u, idx) => {
    let pct = 0;
    const iv = setInterval(() => {
      pct += Math.random() * 30 + 10;
      if (pct >= 100) {
        pct = 100;
        clearInterval(iv);
        uploading.value = uploading.value.map(x => x.id === u.id ? { ...x, progress: 100, done: true } : x);
        setTimeout(() => { uploading.value = uploading.value.filter(x => x.id !== u.id); }, 2000);
        handleUpload(droppedFiles[idx]);
      } else {
        uploading.value = uploading.value.map(x => x.id === u.id ? { ...x, progress: Math.round(pct) } : x);
      }
    }, 150 + idx * 80);
  });
}
</script>

<template>
  <div
    class="zfl-wrap"
    @dragover.prevent="globalDrag = true"
    @dragleave="e => { if (!$el.contains(e.relatedTarget)) globalDrag = false; }"
    @drop="onGlobalDrop"
  >
    <!-- Global drop overlay -->
    <div v-if="globalDrag" class="zfl-global-drop">
      <svg viewBox="0 0 40 40" width="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20 8v16M12 16l8-8 8 8"/><path d="M6 30h28"/></svg>
      <div class="zfl-drop-title">Drop files to upload</div>
      <div class="zfl-drop-sub">Images, videos, PDFs, documents</div>
    </div>

    <!-- Upload progress toasts -->
    <div v-if="uploading.length" class="zfl-progress-stack">
      <div v-for="u in uploading" :key="u.id" class="zfl-progress-card">
        <div class="zfl-progress-row">
          <span class="zfl-progress-name">{{ u.name }}</span>
          <span class="zfl-progress-pct" :class="{ 'is-done': u.done }">{{ u.done ? 'Done' : u.progress + '%' }}</span>
        </div>
        <div class="zfl-progress-bar">
          <div class="zfl-progress-fill" :class="{ 'is-done': u.done }" :style="{ width: u.progress + '%' }" />
        </div>
        <div class="zfl-progress-size">{{ u.size }}</div>
      </div>
    </div>

    <!-- Header -->
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div class="zwh-title">Files</div>
        <div class="zwh-subtitle">{{ files.length }} files · {{ totalSize }} MB in current view</div>
      </div>
      <div class="zfl-header-actions">
        <button v-if="selected.size > 0" class="zfl-btn-delete-sel" @click="deleteSelected">Delete {{ selected.size }}</button>
        <button v-if="selected.size > 0" class="zwh-btn-ghost zfl-btn-desel" @click="clearSelect">Deselect</button>
        <button class="zfl-view-toggle" @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'" title="Toggle view">
          <svg v-if="viewMode==='grid'" viewBox="0 0 12 12" width="12" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="2" x2="12" y2="2"/><line x1="0" y1="6" x2="12" y2="6"/><line x1="0" y1="10" x2="12" y2="10"/></svg>
          <svg v-else viewBox="0 0 12 12" width="12" fill="currentColor"><rect x="0" y="0" width="5" height="5"/><rect x="7" y="0" width="5" height="5"/><rect x="0" y="7" width="5" height="5"/><rect x="7" y="7" width="5" height="5"/></svg>
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="zfl-body">
      <!-- Left: folder nav -->
      <aside class="zfl-sidebar">
        <div class="zfl-sidebar-upload">
          <UploadZone @upload="handleUpload" />
        </div>
        <nav class="zfl-folder-nav">
          <button
            v-for="f in folders" :key="f.id"
            class="zfl-folder-btn"
            :class="{ 'is-active': folder === f.id }"
            @click="folder = f.id"
          >
            <svg viewBox="0 0 16 16" width="14" fill="none" stroke="var(--zg-accent)" stroke-width="1.4" stroke-linecap="round"><path d="M1 4c0-1 .6-1.5 1.5-1.5h4l1.5 1.5H14c.8 0 1.5.6 1.5 1.5v7c0 .8-.7 1.5-1.5 1.5H2.5C1.7 14 1 13.3 1 12.5V4z"/></svg>
            <span class="zfl-folder-label">{{ f.label }}</span>
            <span class="zfl-folder-count">{{ f.count }}</span>
          </button>
        </nav>
      </aside>

      <!-- Main content -->
      <div class="zfl-main">
        <!-- Toolbar -->
        <div class="zfl-toolbar">
          <div class="zfl-search-wrap">
            <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" class="zfl-search-icon"><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
            <input v-model="search" placeholder="Search by name, tag, uploader…" class="zfl-search" />
          </div>
          <button
            v-for="t in ['all','image','pdf','doc','video']" :key="t"
            class="zwh-filter-chip"
            :class="{ 'is-active': typeF === t }"
            @click="typeF = t"
            style="font-size: 10.5px; height: 24px; text-transform: capitalize;"
          >{{ t === 'all' ? 'All' : t }}</button>
          <button class="zfl-select-all" @click="selectAll">Select All</button>
          <span class="zfl-count">{{ filtered.length }} file{{ filtered.length !== 1 ? 's' : '' }}</span>
        </div>

        <!-- Files area -->
        <div class="zfl-content">
          <div class="zfl-scroll" :class="viewMode === 'grid' ? 'is-grid-pad' : ''">
            <div v-if="filtered.length === 0" class="zfl-empty">
              <svg viewBox="0 0 24 24" width="40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
              <span>No files found</span>
            </div>

            <!-- Grid -->
            <div v-else-if="viewMode === 'grid'" class="zfl-grid">
              <FileCard
                v-for="f in filtered" :key="f.id"
                :file="f"
                :selected="selected.has(f.id)"
                @select="toggleSelect"
                @open="detail = $event"
              />
            </div>

            <!-- List -->
            <template v-else>
              <div class="zfl-list-head">
                <span></span><span></span><span>Name</span><span>Type</span><span>Size</span><span>Dimensions</span><span>Uploaded</span>
              </div>
              <FileRow
                v-for="(f, i) in filtered" :key="f.id"
                :file="f" :idx="i"
                :selected="selected.has(f.id)"
                @select="toggleSelect"
                @open="detail = $event"
              />
            </template>
          </div>

          <!-- Detail panel -->
          <FileDetailPanel
            v-if="detail"
            :file="detail"
            @close="detail = null"
            @delete="deleteFile"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zfl-wrap {
  display: flex; flex-direction: column; height: 100%; min-height: 0; position: relative;
}

/* Global drop overlay */
.zfl-global-drop {
  position: absolute; inset: 0; z-index: 100;
  background: oklch(0.88 0.19 130 / 0.08);
  border: 3px dashed var(--zg-accent); border-radius: var(--zg-radius-md);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; pointer-events: none; color: var(--zg-accent);
}
.zfl-drop-title { font-size: 18px; font-weight: 700; margin-top: 8px; }
.zfl-drop-sub { font-size: 13px; opacity: 0.7; }

/* Upload progress stack */
.zfl-progress-stack {
  position: absolute; bottom: 16px; right: 16px; z-index: 200;
  display: flex; flex-direction: column; gap: 6px; min-width: 260px; max-width: 320px;
}
.zfl-progress-card {
  background: var(--zg-bg-elev); border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md); padding: 8px 12px;
  box-shadow: 0 4px 16px oklch(0.05 0.01 250 / 0.4);
}
.zfl-progress-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
.zfl-progress-name { font-size: 11.5px; font-weight: 600; color: var(--zg-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.zfl-progress-pct { font-size: 10.5px; font-family: var(--zg-mono); font-weight: 700; color: var(--zg-accent); margin-left: 8px; flex-shrink: 0; }
.zfl-progress-pct.is-done { color: var(--zg-good); }
.zfl-progress-bar { height: 4px; background: var(--zg-panel-hi); border-radius: 2px; overflow: hidden; }
.zfl-progress-fill { height: 100%; background: var(--zg-accent); border-radius: 2px; transition: width .15s; }
.zfl-progress-fill.is-done { background: var(--zg-good); }
.zfl-progress-size { font-size: 10px; color: var(--zg-text-dim); margin-top: 3px; }

/* Header */
.zwh-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--zg-line); flex-shrink: 0; }
.zwh-header-left { display: flex; flex-direction: column; gap: 2px; }
.zwh-title { font-size: 16px; font-weight: 700; color: var(--zg-text); }
.zwh-subtitle { font-size: 11.5px; color: var(--zg-text-dim); }
.zfl-header-actions { display: flex; gap: 6px; align-items: center; }
.zfl-btn-delete-sel { height: 30px; padding: 0 12px; border: 1px solid var(--zg-danger); border-radius: var(--zg-radius-md); background: transparent; font-size: 12px; cursor: pointer; color: var(--zg-danger); }
.zfl-btn-desel { height: 30px; font-size: 12px; }
.zfl-view-toggle { width: 30px; height: 30px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: var(--zg-panel); cursor: pointer; color: var(--zg-text-dim); display: flex; align-items: center; justify-content: center; }

/* Body layout */
.zfl-body { flex: 1; display: flex; min-height: 0; }

/* Left sidebar */
.zfl-sidebar {
  width: 200px; flex-shrink: 0; border-right: 1px solid var(--zg-line);
  display: flex; flex-direction: column; background: var(--zg-bg-elev);
}
.zfl-sidebar-upload { padding: 12px 14px; border-bottom: 1px solid var(--zg-line); flex-shrink: 0; }
.zfl-folder-nav { flex: 1; padding: 8px 0; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }
.zfl-folder-btn {
  width: 100%; height: 36px; padding: 0 14px; border: none;
  background: transparent; cursor: pointer; display: flex; align-items: center; gap: 8px;
  font-size: 12.5px; font-weight: 400; color: var(--zg-text-mid);
  border-left: 2px solid transparent; transition: all .1s; text-align: left;
}
.zfl-folder-btn.is-active { background: var(--zg-panel); font-weight: 600; color: var(--zg-text); border-left-color: var(--zg-accent); }
.zfl-folder-label { flex: 1; }
.zfl-folder-count { font-size: 10.5px; color: var(--zg-text-dim); font-family: var(--zg-mono); }

/* Main area */
.zfl-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

.zfl-toolbar {
  padding: 8px 14px; border-bottom: 1px solid var(--zg-line);
  display: flex; gap: 8px; align-items: center; flex-shrink: 0; flex-wrap: wrap;
}
.zfl-search-wrap { position: relative; flex: 1; max-width: 280px; }
.zfl-search-icon { position: absolute; left: 7px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.zfl-search {
  width: 100%; height: 28px; padding-left: 24px; padding-right: 8px;
  background: var(--zg-panel); border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md); font-size: 12px; color: var(--zg-text); outline: none; box-sizing: border-box;
}
.zfl-select-all { margin-left: auto; height: 26px; padding: 0 8px; border: 1px solid var(--zg-line); border-radius: 3px; background: transparent; cursor: pointer; font-size: 11px; color: var(--zg-text-dim); }
.zfl-count { font-size: 11px; color: var(--zg-text-dim); white-space: nowrap; }

/* Files content area */
.zfl-content { flex: 1; display: flex; min-height: 0; }
.zfl-scroll { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--zg-line) transparent; }
.zfl-scroll.is-grid-pad { padding: 14px; }

.zfl-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 10px; color: var(--zg-text-dim); font-size: 13px; }
.zfl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }

.zfl-list-head {
  display: grid; grid-template-columns: 28px 36px 1fr 80px 100px 80px 100px;
  gap: 10px; padding: 0 14px; height: 30px;
  background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line);
  font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.07em;
  color: var(--zg-text-dim); font-weight: 600; align-items: center;
}

/* Filter chips */
.zwh-filter-chip {
  height: 28px; padding: 0 10px; border: 1px solid var(--zg-line); border-radius: 3px;
  background: transparent; cursor: pointer; font-size: 11.5px; color: var(--zg-text-dim); white-space: nowrap;
}
.zwh-filter-chip.is-active { background: var(--zg-panel-hi); color: var(--zg-text); border-color: var(--zg-accent); }
</style>
