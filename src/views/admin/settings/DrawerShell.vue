<!-- DrawerShell.vue — reusable right-slide drawer -->
<script setup>
defineProps({ title:String, sub:String, width:{ default:'560px' } });
defineEmits(['close']);
</script>
<template>
  <Teleport to="body">
    <div style="position:fixed;inset:0;z-index:9200;background:oklch(0.1 0.01 250 / 0.6);" @click="$emit('close')"/>
    <div style="position:fixed;top:0;right:0;bottom:0;z-index:9201;background:var(--zg-bg-elev);border-left:1px solid var(--zg-line);display:flex;flex-direction:column;box-shadow:-8px 0 32px oklch(0.05 0.01 250 / 0.5);" :style="{ width }">
      <div style="padding:16px 20px;border-bottom:1px solid var(--zg-line);display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0;" @click.stop>
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--zg-text);">{{ title }}</div>
          <div v-if="sub" style="font-size:11.5px;color:var(--zg-text-dim);margin-top:2px;">{{ sub }}</div>
        </div>
        <button @click="$emit('close')" style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:16px;display:flex;align-items:center;justify-content:center;">×</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent;" @click.stop>
        <slot />
      </div>
      <div v-if="$slots.footer" style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;flex-shrink:0;" @click.stop>
        <slot name="footer" />
      </div>
    </div>
  </Teleport>
</template>
