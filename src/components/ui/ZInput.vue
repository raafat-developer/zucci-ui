<script setup>
/**
 * ZInput — text field with optional prefix, affix (right icon slot),
 * mono style, and error state. Mirrors .zauth-input.
 * v-model compatible.
 */
defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  prefix: { type: String, default: '' },
  mono: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
});
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="zinput-wrap">
    <span v-if="prefix" class="zinput-prefix">{{ prefix }}</span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autofocus="autofocus"
      :class="['zinput', { 'is-mono': mono, 'has-prefix': prefix, 'has-affix': $slots.affix, 'is-error': error }]"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="$slots.affix" class="zinput-affix">
      <slot name="affix" />
    </span>
  </div>
</template>

<style scoped>
.zinput-wrap { position: relative; display: flex; align-items: center; }

.zinput {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  background: var(--zg-panel);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  color: var(--zg-text);
  font-family: var(--zg-sans);
  font-size: 14px;
  letter-spacing: -0.005em;
  outline: none;
  transition: border-color 0.12s, background 0.12s;
  box-sizing: border-box;
}
.zinput::placeholder { color: var(--zg-text-xdim); }
.zinput:hover { border-color: var(--zg-muted-line); }
.zinput:focus { border-color: var(--zg-accent); background: var(--zg-panel-hi); }
.zinput.is-mono { font-family: var(--zg-mono); font-size: 13px; letter-spacing: 0.02em; }
.zinput.is-error { border-color: var(--zg-danger); }
.zinput.has-affix { padding-right: 44px; }
.zinput.has-prefix { padding-left: 56px; }

.zinput-prefix {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--zg-mono);
  font-size: 12px;
  color: var(--zg-text-dim);
  pointer-events: none;
}
.zinput-affix {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: var(--zg-text-dim);
}
</style>
