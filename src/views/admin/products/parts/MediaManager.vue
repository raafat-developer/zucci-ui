<script setup>
/**
 * MediaManager — product image grid (main + thumbnails + add), synced vs live
 * columns for synced products, and a lightbox. Faithful port of the React
 * ProductMediaManager's structure (drag-reorder simplified to click actions).
 */
import { ref, computed } from 'vue';

const props = defineProps({
  images: { type: Array, default: () => [] },
  syncedImages: { type: Array, default: () => [] },
  isSynced: { type: Boolean, default: false },
});
const emit = defineEmits(['update:images']);

const lightbox = ref(null);
const list = computed(() => props.images);
const main = computed(() => list.value[0] || null);
const thumbs = computed(() => list.value.slice(1));

const addDemo = () => {
  const n = list.value.length + 1;
  emit('update:images', [...list.value, { id: 'img' + Date.now(), url: `https://picsum.photos/seed/${(n * 17) % 300}/800/1000`, alt: 'New image' }]);
};
const remove = (id) => emit('update:images', list.value.filter((i) => i.id !== id));
</script>

<template>
  <div class="zpm" :class="{ 'zpm--synced': isSynced }">
    <!-- Synced column (read-only) -->
    <div v-if="isSynced" class="zpm-col">
      <div class="zp-content-col-head" style="margin-bottom:8px">
        <span class="zp-content-col-title">Synced Images</span>
        <span class="zp-synced-badge">from store</span>
      </div>
      <div class="zpm-grid">
        <div v-for="img in syncedImages" :key="img.id" class="zpm-cell" @click="lightbox = img.url">
          <img :src="img.url" :alt="img.alt" />
        </div>
      </div>
    </div>

    <!-- Live column (editable) -->
    <div class="zpm-col">
      <div v-if="isSynced" class="zp-content-col-head" style="margin-bottom:8px">
        <span class="zp-content-col-title">Live Images</span>
        <span class="zp-live-dot" />
      </div>
      <div class="zpm-main-wrap">
        <div class="zpm-main" @click="main ? (lightbox = main.url) : addDemo()">
          <img v-if="main" :src="main.url" :alt="main.alt" />
          <div v-else class="zpm-img-fallback" style="flex-direction:column;gap:8px;cursor:pointer">
            <svg viewBox="0 0 48 40" width="40" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.3" stroke-linecap="round"><rect x="2" y="8" width="44" height="30" rx="3" /><circle cx="16" cy="20" r="5" /><path d="M2 32l12-10 8 8 8-6 18 14" /></svg>
            <span style="font-size:11px;color:var(--zg-text-xdim);letter-spacing:0.04em">Click to add images</span>
          </div>
          <div v-if="main" class="zpm-main-badge">Main</div>
        </div>
      </div>
      <div class="zpm-thumbs-wrap" style="margin-top:8px">
        <div class="zpm-thumbs">
          <div v-for="img in thumbs" :key="img.id" class="zpm-thumb" @click="lightbox = img.url">
            <img :src="img.url" :alt="img.alt" />
            <button type="button" class="zpm-thumb-x" @click.stop="remove(img.id)">×</button>
          </div>
          <div class="zpm-add-btn" @click="addDemo">
            <svg viewBox="0 0 20 20" width="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><line x1="10" y1="3" x2="10" y2="17" /><line x1="3" y1="10" x2="17" y2="10" /></svg>
            <span>Add</span>
          </div>
        </div>
        <div v-if="list.length" style="font-size:10.5px;color:var(--zg-text-xdim);margin-top:6px">Drag to reorder · First image is the cover</div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightbox" class="zpm-lightbox" @click="lightbox = null">
      <img :src="lightbox" alt="" />
    </div>
  </div>
</template>

<style scoped>
.zpm { display: block; }
.zpm--synced { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.zpm-col { min-width: 0; }
.zpm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.zpm-cell { aspect-ratio: 4/5; border-radius: 8px; overflow: hidden; background: var(--zg-panel); cursor: pointer; }
.zpm-cell img, .zpm-main img, .zpm-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.zpm-main-wrap { }
.zpm-main { position: relative; aspect-ratio: 4/3; max-height: 300px; border-radius: 10px; overflow: hidden; background: var(--zg-panel); border: 1px solid var(--zg-line); display: grid; place-items: center; cursor: pointer; }
.zpm-img-fallback { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.zpm-main-badge { position: absolute; top: 8px; left: 8px; background: var(--zg-accent); color: #0a0b0d; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
.zpm-thumbs { display: flex; gap: 8px; flex-wrap: wrap; }
.zpm-thumb { position: relative; width: 72px; height: 72px; border-radius: 8px; overflow: hidden; background: var(--zg-panel); border: 1px solid var(--zg-line); cursor: pointer; }
.zpm-thumb-x { position: absolute; top: 3px; right: 3px; width: 16px; height: 16px; border: none; border-radius: 50%; background: rgba(0,0,0,0.6); color: #fff; font-size: 11px; cursor: pointer; display: grid; place-items: center; }
.zpm-add-btn { width: 72px; height: 72px; border: 1px dashed var(--zg-muted-line); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; cursor: pointer; color: var(--zg-text-dim); font-size: 10px; }
.zpm-add-btn:hover { border-color: var(--zg-accent); color: var(--zg-accent); }
.zpm-lightbox { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.85); display: grid; place-items: center; cursor: zoom-out; }
.zpm-lightbox img { max-width: 90vw; max-height: 90vh; border-radius: 8px; }
</style>
