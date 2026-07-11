<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({ alertMsg: { type: String, default: '' } });
const emit  = defineEmits(['close', 'confirm']);

const duration = ref('4h');
const note     = ref('');

const OPTIONS = [
  { value:'1h',  label:'1 hour'         },
  { value:'2h',  label:'2 hours'        },
  { value:'4h',  label:'4 hours'        },
  { value:'8h',  label:'8 hours'        },
  { value:'24h', label:'24 hours (1 day)' },
  { value:'48h', label:'48 hours (2 days)' },
  { value:'72h', label:'72 hours (3 days)' },
];

function confirm() { emit('confirm', duration.value, note.value); emit('close'); }
</script>

<template>
  <Teleport to="body">
    <div style="position:fixed;inset:0;z-index:9300;background:oklch(0.1 0.01 250 / 0.6);" @click="emit('close')" />
    <div style="position:fixed;top:0;right:0;bottom:0;width:400px;z-index:9301;background:var(--zg-bg-elev);border-left:1px solid var(--zg-line);display:flex;flex-direction:column;" @click.stop>
      <div style="padding:16px 20px;border-bottom:1px solid var(--zg-line);display:flex;justify-content:space-between;align-items:flex-start;flex-shrink:0;">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--zg-text);">Snooze Alert</div>
          <div style="font-size:11.5px;color:var(--zg-text-dim);margin-top:2px;">Alert will re-activate after the selected duration</div>
        </div>
        <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:16px;" @click="emit('close')">×</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;">
        <div v-if="alertMsg" style="padding:10px 14px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-size:12px;color:var(--zg-text-mid);line-height:1.4;">{{ alertMsg }}</div>
        <div>
          <div class="zwh-field-label" style="margin-bottom:8px;">Snooze duration</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button v-for="opt in OPTIONS" :key="opt.value" @click="duration = opt.value"
              style="height:36px;border:1px solid;border-radius:var(--zg-radius-md);background:transparent;cursor:pointer;font-family:inherit;font-size:12.5px;font-weight:500;transition:all .14s;"
              :style="{ borderColor:duration===opt.value?'var(--zg-accent)':'var(--zg-line)', background:duration===opt.value?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:duration===opt.value?'var(--zg-accent)':'var(--zg-text-mid)' }">
              {{ opt.label }}
            </button>
          </div>
        </div>
        <div>
          <div class="zwh-field-label" style="margin-bottom:5px;">Note <span style="font-size:10px;color:var(--zg-text-dim);">(optional)</span></div>
          <textarea v-model="note" style="padding:8px 10px;resize:vertical;min-height:60px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;width:100%;box-sizing:border-box;" placeholder="Reason for snoozing…" />
        </div>
      </div>
      <div style="padding:14px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;flex-shrink:0;">
        <button class="zwh-btn-primary" @click="confirm">Snooze for {{ OPTIONS.find(o=>o.value===duration)?.label }}</button>
        <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
      </div>
    </div>
  </Teleport>
</template>
