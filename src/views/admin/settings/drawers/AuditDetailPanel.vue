
<template>
  <Teleport to="body">
    <div
      v-if="entry"
      style="
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 360px;
        z-index: 9150;
        background: var(--zg-bg-elev);
        border-left: 1px solid var(--zg-line);
        display: flex;
        flex-direction: column;
        box-shadow: -4px 0 20px oklch(0.05 0.01 250 / 0.4);
      "
    >
      <div
        style="
          padding: 14px 16px;
          border-bottom: 1px solid var(--zg-line);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        "
      >
        <div style="font-size: 13px; font-weight: 700; color: var(--zg-text)">
          Audit Entry
        </div>
        <button
          @click="$emit('close')"
          style="
            width: 26px;
            height: 26px;
            border: none;
            background: var(--zg-panel);
            border-radius: 4px;
            cursor: pointer;
            color: var(--zg-text-dim);
            font-size: 15px;
          "
        >
          ×
        </button>
      </div>
      <div
        style="
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          scrollbar-width: thin;
          scrollbar-color: var(--zg-line) transparent;
        "
      >
        <div style="display: flex; flex-direction: column; gap: 12px">
          <div
            v-for="[l, v] in [
              ['User', entry.user],
              ['Action', entry.action],
              ['Module', entry.module],
              ['Time', entry.time],
              ['IP Address', entry.ip],
            ]"
            :key="l"
            style="
              background: var(--zg-panel);
              border: 1px solid var(--zg-line);
              border-radius: var(--zg-radius-md);
              padding: 10px 12px;
            "
          >
            <div
              style="
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.07em;
                color: var(--zg-text-dim);
                font-weight: 600;
                margin-bottom: 4px;
              "
            >
              {{ l }}
            </div>
            <div
              style="font-size: 12.5px; font-weight: 600; color: var(--zg-text)"
              :style="{
                fontFamily:
                  l === 'IP Address' || l === 'Module'
                    ? 'var(--zg-mono)'
                    : 'inherit',
              }"
            >
              {{ v }}
            </div>
          </div>

          <div
            style="
              background: var(--zg-panel);
              border: 1px solid var(--zg-line);
              border-radius: var(--zg-radius-md);
              padding: 10px 12px;
            "
          >
            <div
              style="
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.07em;
                color: var(--zg-text-dim);
                font-weight: 600;
                margin-bottom: 8px;
              "
            >
              Payload (sample)
            </div>
            <pre
              style="
                font-family: var(--zg-mono);
                font-size: 10.5px;
                color: var(--zg-accent);
                line-height: 1.5;
                margin: 0;
                white-space: pre-wrap;
                word-break: break-all;
              "
              >
              {{ payload }}
              </pre
            >
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  entry: Object
})

defineEmits(['close'])

const payload = computed(() =>
  JSON.stringify(
    {
      action: props.entry?.action,
      module: props.entry?.module,
      timestamp: new Date().toISOString(),
      user_id: 'u-001',
      session: 'sess_xxx',
      changes: {
        field: 'status',
        from: 'pending',
        to: 'active'
      }
    },
    null,
    2
  )
)
</script>