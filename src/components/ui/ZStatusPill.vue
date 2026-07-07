<script setup>
/**
 * ZStatusPill — small coloured status chip used across tables/detail views.
 * tone: good | warn | danger | neutral | accent
 */
defineProps({
  tone: { type: String, default: 'neutral' },
  label: { type: String, required: true },
});
</script>

<template>
  <span :class="['zpill', `zpill--${tone}`]">{{ label }}</span>
</template>

<style scoped>
.zpill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid transparent;
  white-space: nowrap;
}
.zpill--good    { color: var(--zg-good);   background: oklch(0.78 0.15 150 / 0.1); border-color: oklch(0.78 0.15 150 / 0.35); }
.zpill--warn    { color: var(--zg-warn);   background: oklch(0.82 0.15 75 / 0.1);  border-color: oklch(0.82 0.15 75 / 0.35); }
.zpill--danger  { color: var(--zg-danger); background: oklch(0.70 0.18 25 / 0.1);  border-color: oklch(0.70 0.18 25 / 0.35); }
.zpill--accent  { color: var(--zg-accent); background: var(--zg-accent-tint);      border-color: oklch(0.88 0.19 130 / 0.35); }
.zpill--neutral { color: var(--zg-text-dim); background: var(--zg-panel); border-color: var(--zg-line); }
</style>
