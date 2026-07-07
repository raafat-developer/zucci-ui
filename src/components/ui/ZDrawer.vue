<script setup>
/**
 * ZDrawer — right-side sliding drawer, ported from ZucciDrawer.
 *
 * Fixes the two known React bugs from the conversion brief:
 *  1. First-open has no animation — solved by keeping the element mounted
 *     (Teleport + v-show), never v-if, so the CSS transition always fires.
 *  2. Slides both in AND out — closing state is driven purely by the
 *     `open` prop toggling the transform class.
 *
 * Backdrop click and Esc both emit `close`.
 */
import { watch, onUnmounted } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  width: { type: [String, Number], default: 520 },
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
    <div class="zdrawer-root" :class="{ 'is-open': open }" aria-hidden="true">
      <div class="zdrawer-backdrop" @click="emit('close')" />
      <aside
        class="zdrawer-panel"
        :style="{ width: typeof width === 'number' ? width + 'px' : width }"
        role="dialog"
      >
        <header class="zdrawer-head">
          <div class="zdrawer-titles">
            <div class="zdrawer-title">{{ title }}</div>
            <div v-if="subtitle" class="zdrawer-sub">{{ subtitle }}</div>
          </div>
          <button class="zdrawer-x" @click="emit('close')" aria-label="Close">×</button>
        </header>
        <div class="zdrawer-body"><slot /></div>
        <footer v-if="$slots.footer" class="zdrawer-foot"><slot name="footer" /></footer>
      </aside>
    </div>
  </Teleport>
</template>

<style scoped>
.zdrawer-root {
  position: fixed;
  inset: 0;
  z-index: 9200;
  pointer-events: none;
}
.zdrawer-backdrop {
  position: absolute;
  inset: 0;
  background: oklch(0.1 0.01 250 / 0.6);
  opacity: 0;
  transition: opacity 0.22s ease;
}
.zdrawer-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  max-width: 96vw;
  background: var(--zg-bg-elev);
  border-left: 1px solid var(--zg-line);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1);
  box-shadow: -24px 0 60px rgba(0, 0, 0, 0.45);
}
.zdrawer-root.is-open { pointer-events: auto; }
.zdrawer-root.is-open .zdrawer-backdrop { opacity: 1; }
.zdrawer-root.is-open .zdrawer-panel { transform: translateX(0); }

.zdrawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--zg-line);
  flex-shrink: 0;
}
.zdrawer-title { font-size: 14px; font-weight: 600; color: var(--zg-text); }
.zdrawer-sub { font-size: 11px; color: var(--zg-text-dim); margin-top: 2px; }
.zdrawer-x {
  width: 28px;
  height: 28px;
  border: none;
  background: var(--zg-panel);
  border-radius: 4px;
  cursor: pointer;
  color: var(--zg-text-dim);
  font-size: 16px;
}
.zdrawer-x:hover { color: var(--zg-text); background: var(--zg-panel-hi); }
.zdrawer-body { flex: 1; overflow-y: auto; padding: 18px 20px; }
.zdrawer-foot {
  flex-shrink: 0;
  padding: 12px 20px;
  border-top: 1px solid var(--zg-line);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
