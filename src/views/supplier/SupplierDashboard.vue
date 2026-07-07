<script setup>
/**
 * SupplierDashboard — landing view for the vendor/brand portal (2nd user type).
 * Scaffolded to match the admin visual language; the full supplier modules
 * (products, size charts, orders, payouts, KYC) build out per the
 * SUPPLIER_*_SPEC.md handoff docs.
 */
import ZStatusPill from '@/components/ui/ZStatusPill.vue';

const kpis = [
  { label: 'Live Listings', value: '412', tone: 'good' },
  { label: 'Pending Review', value: '18', tone: 'warn' },
  { label: 'Orders (7d)', value: '1,204', tone: 'accent' },
  { label: 'Payout Due', value: 'AED 42K', tone: 'good' },
];
const tasks = [
  { task: 'Upload size chart for Women’s Fashion', due: 'Required', tone: 'warn' },
  { task: 'Approve 12 new variant requests', due: '2 pending', tone: 'accent' },
  { task: 'Confirm July payout details', due: 'Jul 10', tone: 'neutral' },
];
</script>

<template>
  <div class="sd">
    <div class="sd-kpis">
      <div v-for="k in kpis" :key="k.label" class="sd-kpi">
        <span class="sd-kpi-lbl">{{ k.label }}</span>
        <span class="sd-kpi-val" :class="`is-${k.tone}`">{{ k.value }}</span>
      </div>
    </div>

    <div class="sd-panel">
      <div class="sd-panel-head">Action items</div>
      <div v-for="(t, i) in tasks" :key="i" class="sd-task">
        <span class="sd-task-txt">{{ t.task }}</span>
        <ZStatusPill :tone="t.tone" :label="t.due" />
      </div>
    </div>

    <p class="sd-note">
      Supplier Connect portal scaffold. Full modules (Products, Size Charts,
      Variant Manager, Orders, Payouts, KYC) build out per the
      <code>SUPPLIER_PRODUCTS_MODULE_SPEC.md</code> and
      <code>SUPPLIER_SIZE_CHART_SPEC.md</code> handoff documents.
    </p>
  </div>
</template>

<style scoped>
.sd { padding: 0 0 20px; }
.sd-kpis { display: flex; border-bottom: 1px solid var(--zg-line); background: var(--zg-panel); }
.sd-kpi { flex: 1; padding: 14px 20px; border-right: 1px solid var(--zg-line); display: flex; flex-direction: column; gap: 4px; }
.sd-kpi:last-child { border-right: 0; }
.sd-kpi-lbl { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); font-weight: 600; }
.sd-kpi-val { font-family: var(--zg-mono); font-size: 22px; font-weight: 700; line-height: 1; }
.sd-kpi-val.is-good { color: var(--zg-good); }
.sd-kpi-val.is-warn { color: var(--zg-warn); }
.sd-kpi-val.is-accent { color: var(--zg-accent); }
.sd-panel { margin: 16px 20px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: var(--zg-bg-elev); overflow: hidden; }
.sd-panel-head { padding: 10px 14px; border-bottom: 1px solid var(--zg-line); font-size: 10px; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; color: var(--zg-text-mid); }
.sd-task { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid var(--zg-line-soft); }
.sd-task:last-child { border-bottom: 0; }
.sd-task-txt { font-size: 12.5px; color: var(--zg-text); }
.sd-note { margin: 16px 20px 0; font-size: 11.5px; color: var(--zg-text-dim); line-height: 1.6; max-width: 680px; }
.sd-note code { font-family: var(--zg-mono); color: var(--zg-accent); background: var(--zg-accent-tint); padding: 1px 5px; border-radius: 3px; }
</style>
