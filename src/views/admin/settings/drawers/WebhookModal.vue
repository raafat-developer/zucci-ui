<script setup>
import { ref, reactive, computed } from 'vue';
import ModalShell from '../ModalShell.vue';
import SField from '../SField.vue';

const ALL_WEBHOOK_EVENTS = ['order.created','order.updated','order.shipped','order.delivered','order.cancelled','return.created','return.resolved','product.created','product.updated','inventory.updated','payout.sent','invoice.created','vendor.approved','customer.created'];

const props = defineProps({ webhook: { default: null } });
const emit  = defineEmits(['close','save']);

const isEdit = computed(() => !!props.webhook?.id);
const v = reactive(props.webhook?.url ? { ...props.webhook } : { url:'', events:[], secret:'' });
const toggleEv = ev => { v.events = v.events.includes(ev) ? v.events.filter(x => x !== ev) : [...v.events, ev]; };
const selectAll = () => { v.events = [...ALL_WEBHOOK_EVENTS]; };
</script>

<template>
  <ModalShell :title="isEdit ? 'Edit Webhook' : 'Add Webhook Endpoint'" width="520px" @close="emit('close')">
    <template #footer>
      <button class="zwh-btn-primary"
        :disabled="!v.url || !v.events.length"
        :style="{ opacity: (v.url && v.events.length) ? 1 : 0.4 }"
        @click="emit('save', v); emit('close')">
        {{ isEdit ? 'Save Changes' : 'Add Endpoint' }}
      </button>
      <button class="zwh-btn-ghost" @click="emit('close')">Cancel</button>
    </template>

    <div style="display:flex;flex-direction:column;gap:14px;">
      <SField label="Endpoint URL" :value="v.url" :mono="true" ph="https://…" :req="true" @update:value="val => v.url = val" />
      <SField label="Signing Secret (optional)" :value="v.secret" :mono="true" ph="whsk_…" @update:value="val => v.secret = val" />

      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <label style="font-size:11px;font-weight:600;color:var(--zg-text-mid);">Events to send <span style="color:var(--zg-danger);">*</span></label>
          <button style="font-size:11px;background:transparent;border:none;cursor:pointer;color:var(--zg-text-dim);font-family:inherit;" @click="selectAll">Select all</button>
        </div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;">
          <button v-for="ev in ALL_WEBHOOK_EVENTS" :key="ev" @click="toggleEv(ev)"
            style="height:22px;padding:0 8px;border:1px solid;border-radius:2px;cursor:pointer;font-family:var(--zg-mono);font-size:10.5px;transition:all .1s;"
            :style="{ borderColor:v.events.includes(ev)?'var(--zg-accent)':'var(--zg-line)', background:v.events.includes(ev)?'oklch(0.78 0.18 130 / 0.1)':'transparent', color:v.events.includes(ev)?'var(--zg-accent)':'var(--zg-text-dim)' }">
            {{ ev }}
          </button>
        </div>
      </div>

      <!-- Last 5 deliveries for edit mode -->
      <div v-if="isEdit" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden;">
        <div style="padding:7px 12px;background:var(--zg-panel-hi);border-bottom:1px solid var(--zg-line);font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600;">Last 5 deliveries</div>
        <div v-for="(t, i) in ['2m ago','1h ago','3h ago','8h ago','1d ago']" :key="i"
          style="display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--zg-line);font-size:11px;">
          <span style="font-family:var(--zg-mono);font-size:9.5px;padding:1px 5px;border-radius:2px;font-weight:700;"
            :style="{ background: i===2?'oklch(0.70 0.18 25 / 0.12)':'oklch(0.78 0.15 150 / 0.08)', color: i===2?'var(--zg-danger)':'var(--zg-good)' }">
            {{ i === 2 ? 'FAILED' : '200' }}
          </span>
          <span style="font-family:var(--zg-mono);font-size:10.5px;color:var(--zg-text-dim);">{{ v.events?.[i % Math.max(v.events.length,1)] || 'order.created' }}</span>
          <span style="margin-left:auto;color:var(--zg-text-dim);">{{ t }}</span>
        </div>
      </div>
    </div>
  </ModalShell>
</template>
