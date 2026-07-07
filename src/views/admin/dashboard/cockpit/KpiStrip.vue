<script lang="tsx">
import { defineComponent } from 'vue'
import Sparkline from './Sparkline.vue'
import FleetCell from './FleetCell.vue'

export default defineComponent({
  name: 'KpiStrip',
  props: {
    kpis: {
      default: undefined
    },
    onKpiClick: {
      default: undefined
    },
    activeKpi: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        kpis,
        onKpiClick,
        activeKpi
      } = props;
      const tiles = [{
        id: 'active',
        label: 'Active Orders',
        value: kpis.activeOrders,
        delta: '+3.4%',
        deltaKind: 'pos',
        mini: [4, 6, 5, 7, 8, 7, 9]
      }, {
        id: 'transit',
        label: 'In Transit',
        value: kpis.inTransit,
        delta: '+1.1%',
        deltaKind: 'pos',
        mini: [3, 4, 5, 5, 6, 7, 7]
      }, {
        id: 'pickup',
        label: 'Pending Pickup',
        value: kpis.pendingPickup,
        delta: '-2.0%',
        deltaKind: 'pos',
        mini: [6, 5, 4, 5, 4, 3, 3]
      }, {
        id: 'qc',
        label: 'QC Holds',
        value: kpis.qcHolds,
        delta: '+2 new',
        deltaKind: 'warn',
        mini: [1, 1, 2, 2, 3, 4, 5]
      }, {
        id: 'returns',
        label: 'Returns In Progress',
        value: kpis.returnsInProgress,
        delta: '+6',
        deltaKind: 'warn',
        mini: [2, 2, 3, 3, 4, 4, 5]
      }, {
        id: 'ontime',
        label: 'On-Time Rate',
        value: (kpis.onTimeRate * 100).toFixed(1) + '%',
        delta: '-0.3pp',
        deltaKind: 'neg',
        mini: [8, 8, 7, 8, 7, 6, 7]
      }, {
        id: 'sla',
        label: 'SLA Breaches',
        value: kpis.slaBreaches,
        delta: '+2',
        deltaKind: 'neg',
        mini: [0, 1, 1, 2, 3, 3, 4]
      }];
      return <div class="zg-kpis">
      {tiles.map(t => <button key={t.id} class={`zg-kpi ${activeKpi === t.id ? 'is-active' : ''}`} onClick={() => onKpiClick(t.id)}>
          <div class="zg-kpi-head">
            <span class="zg-kpi-label">{t.label}</span>
            <span class={`zg-kpi-delta zg-kpi-delta--${t.deltaKind}`}>{t.delta}</span>
          </div>
          <div class="zg-kpi-value">{t.value}</div>
          <Sparkline values={t.mini} kind={t.deltaKind} />
        </button>)}
      <div class="zg-kpi zg-kpi--fleet" aria-label="Fleet breakdown">
        <div class="zg-kpi-head"><span class="zg-kpi-label">Fleet Online</span><span class="zg-kpi-delta zg-kpi-delta--muted">now</span></div>
        <div class="zg-fleet-grid">
          <FleetCell kind="Cars" g={kpis.fleet.cars} />
          <FleetCell kind="Bikes" g={kpis.fleet.bikes} />
          <FleetCell kind="Trucks" g={kpis.fleet.trucks} />
        </div>
      </div>
    </div>;
    };
  }
});
</script>
