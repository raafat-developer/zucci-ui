<script setup>
/**
 * DashboardView — a representative converted module: KPI strip + live panels,
 * market-aware via injected `market`. Mirrors ZucciLiveDashboard's structure.
 */
import { inject, computed } from 'vue';
import ZStatusPill from '@/components/ui/ZStatusPill.vue';

const market = inject('market');

const KPI_BY_MARKET = {
  all: [
    { label: 'Orders Today', value: '1,284', delta: '+8.9%', tone: 'good' },
    { label: 'GMV Today', value: 'AED 318K', delta: '+6.3%', tone: 'good' },
    { label: 'Pending Orders', value: '247', delta: '+24', tone: 'warn' },
    { label: 'Returns Open', value: '83', delta: '+12', tone: 'warn' },
    { label: 'Active Brands', value: '312', delta: '+14', tone: 'good' },
    { label: 'Fulfilment', value: '96.1%', delta: '+0.7%', tone: 'good' },
  ],
  ae: [
    { label: 'Orders Today', value: '621', delta: '+11%', tone: 'good' },
    { label: 'GMV Today', value: 'AED 182K', delta: '+9%', tone: 'good' },
    { label: 'Pending Orders', value: '118', delta: '+18', tone: 'warn' },
    { label: 'Returns Open', value: '34', delta: '+6', tone: 'warn' },
    { label: 'Active Brands', value: '289', delta: '+9', tone: 'good' },
    { label: 'Fulfilment', value: '97.1%', delta: '+0.6%', tone: 'good' },
  ],
  sa: [
    { label: 'Orders Today', value: '412', delta: '+12%', tone: 'good' },
    { label: 'GMV Today', value: 'AED 96.8K', delta: '+8%', tone: 'good' },
    { label: 'Pending Orders', value: '88', delta: '+14', tone: 'warn' },
    { label: 'Returns Open', value: '29', delta: '+4', tone: 'warn' },
    { label: 'Active Brands', value: '201', delta: '+7', tone: 'good' },
    { label: 'Fulfilment', value: '95.3%', delta: '+0.6%', tone: 'good' },
  ],
  eg: [
    { label: 'Orders Today', value: '251', delta: '+23%', tone: 'good' },
    { label: 'GMV Today', value: 'AED 39.6K', delta: '+8%', tone: 'good' },
    { label: 'Pending Orders', value: '41', delta: '+12', tone: 'warn' },
    { label: 'Returns Open', value: '20', delta: '+2', tone: 'warn' },
    { label: 'Active Brands', value: '98', delta: '+7', tone: 'good' },
    { label: 'Fulfilment', value: '94.2%', delta: '+1.1%', tone: 'good' },
  ],
  qa: [
    { label: 'Orders Today', value: '120', delta: '+6%', tone: 'good' },
    { label: 'GMV Today', value: 'AED 18.4K', delta: '+3%', tone: 'good' },
    { label: 'Pending Orders', value: '19', delta: '+3', tone: 'warn' },
    { label: 'Returns Open', value: '8', delta: '+1', tone: 'warn' },
    { label: 'Active Brands', value: '64', delta: '+2', tone: 'good' },
    { label: 'Fulfilment', value: '96.8%', delta: '+0.4%', tone: 'good' },
  ],
};

const RECENT = [
  { id: '#ZUC-20841', customer: 'Layla Al Mansouri', mk: 'AE', amount: 'AED 420', status: 'Dispatched', tone: 'good' },
  { id: '#ZUC-20840', customer: 'Ahmed Khalid', mk: 'SA', amount: 'SAR 310', status: 'Pending', tone: 'warn' },
  { id: '#ZUC-20839', customer: 'Sara Ibrahim', mk: 'EG', amount: 'EGP 890', status: 'Processing', tone: 'accent' },
  { id: '#ZUC-20838', customer: 'Omar Yousef', mk: 'AE', amount: 'AED 1,240', status: 'Dispatched', tone: 'good' },
  { id: '#ZUC-20837', customer: 'Fatima Al Rashid', mk: 'SA', amount: 'SAR 580', status: 'Pending', tone: 'warn' },
];

const kpis = computed(() => KPI_BY_MARKET[market.value] || KPI_BY_MARKET.all);
const recent = computed(() =>
  market.value === 'all' ? RECENT : RECENT.filter((r) => r.mk === market.value.toUpperCase())
);
</script>

<template>
  <div class="dash">
    <div class="dash-kpis">
      <div v-for="k in kpis" :key="k.label" class="dash-kpi">
        <span class="dash-kpi-lbl">{{ k.label }}</span>
        <div class="dash-kpi-row">
          <span class="dash-kpi-val">{{ k.value }}</span>
          <span class="dash-kpi-delta" :class="`is-${k.tone}`">{{ k.delta }}</span>
        </div>
      </div>
    </div>

    <div class="dash-panel">
      <div class="dash-panel-head">
        <span class="dash-panel-title">Recent Orders</span>
        <span class="dash-panel-count">{{ recent.length }}</span>
      </div>
      <table class="dash-table">
        <thead>
          <tr><th>Order</th><th>Customer</th><th>Market</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr v-for="o in recent" :key="o.id">
            <td class="mono accent">{{ o.id }}</td>
            <td>{{ o.customer }}</td>
            <td class="mono dim">{{ o.mk }}</td>
            <td class="mono">{{ o.amount }}</td>
            <td><ZStatusPill :tone="o.tone" :label="o.status" /></td>
          </tr>
          <tr v-if="!recent.length"><td colspan="5" class="dash-empty">No orders for this market</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dash { height: 100%; overflow-y: auto; background: var(--zg-bg); }
.dash-kpis {
  display: grid; grid-template-columns: repeat(6, 1fr);
  border-bottom: 1px solid var(--zg-line); background: var(--zg-panel);
}
.dash-kpi { padding: 12px 20px; border-right: 1px solid var(--zg-line); display: flex; flex-direction: column; gap: 4px; }
.dash-kpi:last-child { border-right: 0; }
.dash-kpi-lbl { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-dim); font-weight: 600; }
.dash-kpi-row { display: flex; align-items: baseline; gap: 8px; }
.dash-kpi-val { font-family: var(--zg-mono); font-size: 22px; font-weight: 700; color: var(--zg-accent); letter-spacing: -0.02em; line-height: 1; }
.dash-kpi-delta { font-size: 10px; font-weight: 700; }
.dash-kpi-delta.is-good { color: var(--zg-good); }
.dash-kpi-delta.is-warn { color: var(--zg-warn); }
.dash-kpi-delta.is-danger { color: var(--zg-danger); }

.dash-panel { margin: 16px 20px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: var(--zg-bg-elev); overflow: hidden; }
.dash-panel-head { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid var(--zg-line); }
.dash-panel-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; color: var(--zg-text-mid); }
.dash-panel-count { font-family: var(--zg-mono); font-size: 10px; font-weight: 700; color: var(--zg-text-dim); background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: 3px; padding: 1px 5px; }

.dash-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
.dash-table th {
  text-align: left; padding: 6px 14px; font-family: var(--zg-mono); font-size: 9px;
  text-transform: uppercase; letter-spacing: 0.07em; color: var(--zg-text-xdim);
  font-weight: 700; border-bottom: 1px solid var(--zg-line); background: var(--zg-panel);
}
.dash-table td { padding: 8px 14px; border-bottom: 1px solid var(--zg-line-soft); color: var(--zg-text); }
.dash-table .mono { font-family: var(--zg-mono); }
.dash-table .accent { color: var(--zg-accent); font-weight: 700; }
.dash-table .dim { color: var(--zg-text-dim); }
.dash-empty { text-align: center; color: var(--zg-text-xdim); padding: 24px; }
</style>
