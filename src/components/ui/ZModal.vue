<script setup>
/**
 * ZModal — centered modal with fade + pop. Kept mounted (Teleport + v-show)
 * so open/close both animate. Backdrop click + Esc emit `close`.
 */
import { watch, onUnmounted } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: [String, Number], default: 480 },
});
const emit = defineEmits(['close']);

const onKey = (e) => { if (e.key === 'Escape' && props.open) emit('close'); };
watch(() => props.open, (v) => {
  if (v) document.addEventListener('keydown', onKey);
  else document.removeEventListener('keydown', onKey);
});
onUnmounted(() => document.removeEventListener('keydown', onKey));
</script>

<template>
  <Teleport to="body">
    <div class="zmodal-root" :class="{ 'is-open': open }">
      <div class="zmodal-backdrop" @click="emit('close')" />
      <div
        class="zmodal-card"
        :style="{ width: typeof width === 'number' ? width + 'px' : width }"
        role="dialog"
      >
        <header v-if="title || $slots.head" class="zmodal-head">
          <div class="zmodal-title">{{ title }}</div>
          <button class="zmodal-x" @click="emit('close')" aria-label="Close">×</button>
        </header>
        <div class="zmodal-body"><slot /></div>
        <footer v-if="$slots.footer" class="zmodal-foot"><slot name="footer" /></footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.zmodal-root {
  position: fixed;
  inset: 0;
  z-index: 9300;
  display: grid;
  place-items: center;
  pointer-events: none;
}
.zmodal-backdrop {
  position: absolute;
  inset: 0;
  background: oklch(0.1 0.01 250 / 0.7);
  opacity: 0;
  transition: opacity 0.18s ease;
}
.zmodal-card {
  position: relative;
  max-width: 94vw;
  background: var(--zg-bg-elev);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-lg);
  overflow: hidden;
  opacity: 0;
  transform: scale(0.96) translateY(8px);
  transition: opacity 0.18s ease, transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.zmodal-root.is-open { pointer-events: auto; }
.zmodal-root.is-open .zmodal-backdrop { opacity: 1; }
.zmodal-root.is-open .zmodal-card { opacity: 1; transform: scale(1) translateY(0); }

.zmodal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--zg-line);
}
.zmodal-title { font-size: 14px; font-weight: 700; color: var(--zg-text); }
.zmodal-x {
  width: 26px;
  height: 26px;
  border: none;
  background: var(--zg-panel);
  border-radius: 4px;
  cursor: pointer;
  color: var(--zg-text-dim);
  font-size: 15px;
}
.zmodal-x:hover { color: var(--zg-text); }
.zmodal-body { padding: 18px 20px; }
.zmodal-foot {
  padding: 12px 20px;
  border-top: 1px solid var(--zg-line);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
