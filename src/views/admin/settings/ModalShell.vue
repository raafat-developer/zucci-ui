<!-- ModalShell.vue — reusable centered modal -->
<script setup>
defineProps({ title:String, sub:String, width:{ default:'480px' } });
defineEmits(['close']);
</script>
<template>
  <Teleport to="body">
    <div style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="$emit('close')">
      <div style="max-height:90vh;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,12px);display:flex;flex-direction:column;overflow:hidden;" :style="{ width }" @click.stop>
        <div style="padding:16px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--zg-text);">{{ title }}</div>
            <div v-if="sub" style="font-size:11.5px;color:var(--zg-text-dim);margin-top:2px;">{{ sub }}</div>
          </div>
          <button @click="$emit('close')" style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:16px;">×</button>
        </div>
        <div style="flex:1;overflow-y:auto;padding:16px 20px;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;">
          <slot />
        </div>
        <div v-if="$slots.footer" style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;flex-shrink:0;">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
