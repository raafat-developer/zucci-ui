<script setup>
/**
 * ZButton — reusable button. Mirrors .zauth-btn variants.
 * variant: primary | ghost | quiet   |  full: stretch to 100%
 */
defineProps({
  variant: { type: String, default: 'primary' },
  full: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['zbtn', `zbtn--${variant}`, { 'zbtn--full': full }]"
  >
    <slot />
  </button>
</template>

<style scoped>
.zbtn {
  height: 44px;
  padding: 0 18px;
  border-radius: var(--zg-radius-md);
  font-family: var(--zg-sans);
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: -0.005em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.1s, border-color 0.1s, transform 0.05s;
  text-decoration: none;
  border: 1px solid transparent;
  box-sizing: border-box;
}
.zbtn:active { transform: translateY(0.5px); }

.zbtn--primary {
  background: var(--zg-accent);
  color: #0a0b0d;
  border-color: var(--zg-accent);
}
.zbtn--primary:hover { background: oklch(0.92 0.19 130); }
.zbtn--primary:disabled { opacity: 0.4; cursor: not-allowed; }

.zbtn--ghost {
  background: var(--zg-panel);
  color: var(--zg-text);
  border-color: var(--zg-line);
}
.zbtn--ghost:hover { background: var(--zg-panel-hi); border-color: var(--zg-muted-line); }

.zbtn--quiet {
  background: transparent;
  color: var(--zg-text-dim);
  border: 0;
  height: auto;
  padding: 4px 0;
  font-size: 12px;
}
.zbtn--quiet:hover { color: var(--zg-text); }

.zbtn--full { width: 100%; }
</style>
