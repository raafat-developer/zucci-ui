<script setup>
/**
 * MediaManager — faithful Vue port using exact .zpm-* CSS classes from
 * styles-zucci-products.css. Layout: main image (186px) + 2-row 90px thumb grid.
 * Drag-to-reorder, lightbox with prev/next nav, Add Media modal.
 */
import { ref, computed, reactive } from "vue";
import ZMediaUploadModal from "@/components/ui/ZMediaUploadModal.vue";

const props = defineProps({
  images: { type: Array, default: () => [] },
  syncedImages: { type: Array, default: () => [] },
  isSynced: { type: Boolean, default: false },
  brand: { type: String, default: "" },
});
const emit = defineEmits(["update:images"]);

// ── Media upload modal ────────────────────────────────────
const mediaOpen = ref(false);

// ── Computed list ─────────────────────────────────────────
const main = computed(() => props.images[0] || null);
const thumbs = computed(() => props.images.slice(1));

// ── Lightbox ──────────────────────────────────────────────
const lbIdx = ref(null);
const lbImg = computed(() =>
  lbIdx.value !== null ? props.images[lbIdx.value] : null,
);
function openLb(idx) {
  lbIdx.value = idx;
}
function closeLb() {
  lbIdx.value = null;
}
function lbPrev() {
  if (lbIdx.value > 0) lbIdx.value--;
}
function lbNext() {
  if (lbIdx.value < props.images.length - 1) lbIdx.value++;
}

// ── Actions ───────────────────────────────────────────────
function remove(id) {
  emit(
    "update:images",
    props.images.filter((i) => i.id !== id),
  );
}

function setMain(id) {
  const arr = [...props.images];
  const idx = arr.findIndex((i) => i.id === id);
  if (idx < 1) return;
  const [item] = arr.splice(idx, 1);
  arr.unshift(item);
  emit("update:images", arr);
}

function onMediaConfirm(files) {
  const newImgs = files.map((f) => ({ id: f.id, url: f.url, alt: f.name }));
  emit("update:images", [...props.images, ...newImgs]);
}

// ── Drag-to-reorder ──────────────────────────────────────
const drag = reactive({ from: null, over: null, overMain: false });

function dstart(e, thumbIdx) {
  drag.from = thumbIdx;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", String(thumbIdx));
}
function dover(e, thumbIdx) {
  e.preventDefault();
  drag.over = thumbIdx;
  drag.overMain = false;
}
function doverMain(e) {
  e.preventDefault();
  drag.overMain = true;
  drag.over = null;
}
function ddrop(e, thumbIdx) {
  e.preventDefault();
  if (drag.from !== null && drag.from !== thumbIdx) {
    const arr = [...props.images];
    const [item] = arr.splice(drag.from + 1, 1);
    arr.splice(thumbIdx + 1, 0, item);
    emit("update:images", arr);
  }
  drag.from = null;
  drag.over = null;
  drag.overMain = false;
}
function ddropMain(e) {
  e.preventDefault();
  if (drag.from !== null) {
    // Move dragged thumb to position 0 (make it main)
    const arr = [...props.images];
    const [item] = arr.splice(drag.from + 1, 1);
    arr.unshift(item);
    emit("update:images", arr);
  }
  drag.from = null;
  drag.over = null;
  drag.overMain = false;
}
function dend() {
  drag.from = null;
  drag.over = null;
  drag.overMain = false;
}
</script>

<template>
  <div class="zpm-wrap">
    <!-- Column label row -->
    <div v-if="isSynced && syncedImages.length" class="zpm-two-col">
      <!-- Live column label -->
      <div>
        <div class="zpm-col-label">Live Images</div>
        <!-- Live grid -->
        <div
          v-if="!images.length"
          class="zpm-empty-drop"
          @click="mediaOpen = true"
        >
          <svg
            viewBox="0 0 40 32"
            width="34"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
            style="color: var(--zg-text-dim)"
          >
            <rect x="2" y="2" width="36" height="28" rx="3" />
            <circle cx="13" cy="13" r="4" />
            <path d="M2 24l10-9 7 7 6-5 13 10" />
            <path d="M30 0v8M26 4l4-4 4 4" />
          </svg>
          <div class="zpm-empty-label">Click to add images</div>
          <div class="zpm-empty-sub">JPG, PNG, WebP — min 1200×1200 px</div>
        </div>
        <template v-else>
          <div class="zpm-grid">
            <!-- Main -->
            <div
              class="zpm-main zpm-draggable"
              :class="{ 'is-over': drag.overMain }"
              @click="openLb(0)"
              @dragover="doverMain"
              @drop="ddropMain"
            >
              <img :src="main.url" :alt="main.alt" />
              <span class="zpm-main-badge">Main</span>
              <div class="zpm-hover-actions">
                <button
                  class="zpm-act-btn zpm-act-btn--del"
                  title="Remove"
                  @click.stop="remove(main.id)"
                >
                  <svg
                    viewBox="0 0 12 12"
                    width="11"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  >
                    <path d="M2 2l8 8M10 2l-8 8" />
                  </svg>
                </button>
              </div>
            </div>
            <!-- Thumb grid -->
            <div class="zpm-thumbs-wrap">
              <div class="zpm-thumbs">
                <div
                  v-for="(img, i) in thumbs"
                  :key="img.id"
                  class="zpm-thumb zpm-draggable"
                  :class="{ 'is-over': drag.over === i }"
                  draggable="true"
                  @dragstart="(e) => dstart(e, i)"
                  @dragover="(e) => dover(e, i)"
                  @drop="(e) => ddrop(e, i)"
                  @dragend="dend"
                  @click="openLb(i + 1)"
                >
                  <img :src="img.url" :alt="img.alt" draggable="false" />
                  <div class="zpm-thumb-drag-hint" />
                  <div class="zpm-hover-actions">
                    <button
                      class="zpm-act-btn"
                      title="Set as main"
                      @click.stop="setMain(img.id)"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        width="11"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      >
                        <path
                          d="M6 1l1.3 2.6 2.7.4-2 1.9.4 2.7L6 7.4l-2.4 1.2.4-2.7-2-1.9 2.7-.4z"
                        />
                      </svg>
                    </button>
                    <button
                      class="zpm-act-btn zpm-act-btn--del"
                      title="Remove"
                      @click.stop="remove(img.id)"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        width="11"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                      >
                        <path d="M2 2l8 8M10 2l-8 8" />
                      </svg>
                    </button>
                  </div>
                </div>
                <!-- Add btn -->
                <div class="zpm-add-btn" @click="mediaOpen = true">
                  <svg
                    viewBox="0 0 14 14"
                    width="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  >
                    <line x1="7" y1="1" x2="7" y2="13" />
                    <line x1="1" y1="7" x2="13" y2="7" />
                  </svg>
                  <span>Add</span>
                </div>
              </div>
              <div class="zpm-hint">
                Drag to reorder · First image is the cover
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Synced column -->
      <div>
        <div class="zpm-col-label">
          Synced Images
          <span class="zpm-src-badge">from store</span>
          <span class="zpm-hint" style="margin-left: 4px"
            >{{ syncedImages.length }} images</span
          >
        </div>
        <div v-if="!syncedImages.length" class="zpm-empty-readonly">
          No synced images
        </div>
        <div v-else class="zpm-grid">
          <div class="zpm-main">
            <img
              :src="syncedImages[0].url"
              :alt="syncedImages[0].alt"
              @click="openLb(0)"
            />
            <span class="zpm-main-badge">Main</span>
          </div>
          <div class="zpm-thumbs-wrap">
            <div class="zpm-thumbs">
              <div
                v-for="img in syncedImages.slice(1)"
                :key="img.id"
                class="zpm-thumb"
                @click="openLb(syncedImages.indexOf(img))"
              >
                <img :src="img.url" :alt="img.alt" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Non-synced: single column -->
    <template v-else>
      <!-- Empty state -->
      <div
        v-if="!images.length"
        class="zpm-empty-drop"
        @click="mediaOpen = true"
      >
        <svg
          viewBox="0 0 40 32"
          width="34"
          fill="none"
          stroke="currentColor"
          stroke-width="1.2"
          stroke-linecap="round"
          style="color: var(--zg-text-dim)"
        >
          <rect x="2" y="2" width="36" height="28" rx="3" />
          <circle cx="13" cy="13" r="4" />
          <path d="M2 24l10-9 7 7 6-5 13 10" />
          <path d="M30 0v8M26 4l4-4 4 4" />
        </svg>
        <div class="zpm-empty-label">Click to add images</div>
        <div class="zpm-empty-sub">JPG, PNG, WebP — min 1200×1200 px</div>
      </div>

      <!-- Filled state -->
      <template v-else>
        <div class="zpm-grid">
          <!-- Main image -->
          <div
            class="zpm-main zpm-draggable"
            :class="{ 'is-over': drag.overMain }"
            @click="openLb(0)"
            @dragover="doverMain"
            @drop="ddropMain"
          >
            <img :src="main.url" :alt="main.alt" />
            <span class="zpm-main-badge">Main</span>
            <div class="zpm-hover-actions">
              <button
                class="zpm-act-btn zpm-act-btn--del"
                title="Remove"
                @click.stop="remove(main.id)"
              >
                <svg
                  viewBox="0 0 12 12"
                  width="11"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                >
                  <path d="M2 2l8 8M10 2l-8 8" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Thumbnail 2-row grid -->
          <div class="zpm-thumbs-wrap">
            <div class="zpm-thumbs">
              <div
                v-for="(img, i) in thumbs"
                :key="img.id"
                class="zpm-thumb zpm-draggable"
                :class="{ 'is-over': drag.over === i }"
                draggable="true"
                @dragstart="(e) => dstart(e, i)"
                @dragover="(e) => dover(e, i)"
                @drop="(e) => ddrop(e, i)"
                @dragend="dend"
                @click="openLb(i + 1)"
              >
                <img :src="img.url" :alt="img.alt" draggable="false" />
                <div class="zpm-thumb-drag-hint" />
                <div class="zpm-hover-actions">
                  <button
                    class="zpm-act-btn"
                    title="Set as main"
                    @click.stop="setMain(img.id)"
                  >
                    <svg
                      viewBox="0 0 12 12"
                      width="11"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    >
                      <path
                        d="M6 1l1.3 2.6 2.7.4-2 1.9.4 2.7L6 7.4l-2.4 1.2.4-2.7-2-1.9 2.7-.4z"
                      />
                    </svg>
                  </button>
                  <button
                    class="zpm-act-btn zpm-act-btn--del"
                    title="Remove"
                    @click.stop="remove(img.id)"
                  >
                    <svg
                      viewBox="0 0 12 12"
                      width="11"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    >
                      <path d="M2 2l8 8M10 2l-8 8" />
                    </svg>
                  </button>
                </div>
              </div>
              <!-- Add button -->
              <div class="zpm-add-btn" @click="mediaOpen = true">
                <svg
                  viewBox="0 0 14 14"
                  width="16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                >
                  <line x1="7" y1="1" x2="7" y2="13" />
                  <line x1="1" y1="7" x2="13" y2="7" />
                </svg>
                <span>Add</span>
              </div>
            </div>
            <div class="zpm-hint">
              Drag to reorder · First image is the cover
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- ── Lightbox ── -->
    <Teleport to="body">
      <div v-if="lbImg" class="zpm-lightbox" @click="closeLb">
        <img :src="lbImg.url" :alt="lbImg.alt" @click.stop />
        <!-- Prev/Next -->
        <button
          v-if="lbIdx > 0"
          class="zpm-lb-nav zpm-lb-nav--prev"
          @click.stop="lbPrev"
        >
          <svg
            viewBox="0 0 10 16"
            width="10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M8 2L2 8L8 14" />
          </svg>
        </button>
        <button
          v-if="lbIdx < images.length - 1"
          class="zpm-lb-nav zpm-lb-nav--next"
          @click.stop="lbNext"
        >
          <svg
            viewBox="0 0 10 16"
            width="10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M2 2L8 8L2 14" />
          </svg>
        </button>
        <!-- Counter -->
        <div class="zpm-lb-counter">{{ lbIdx + 1 }} / {{ images.length }}</div>
        <!-- Close -->
        <button class="zpm-lb-close" @click.stop="closeLb">×</button>
      </div>
    </Teleport>

    <!-- ── Media Upload Modal ── -->
    <ZMediaUploadModal
      :open="mediaOpen"
      title="Add Product Images"
      :multiple="true"
      @close="mediaOpen = false"
      @confirm="onMediaConfirm"
    />
  </div>
</template>
