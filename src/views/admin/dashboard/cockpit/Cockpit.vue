<script lang="tsx">
import { defineComponent, ref, computed } from 'vue'
import { ZG_DRIVERS, ZG_FACILITIES, ZG_ZONES, ZG_SHIPMENTS, SHIPMENTS, DRIVER_POSITIONS, STAGES, ZC_STAGES, KPIS, ZC_KPIS } from '../../../../data/dashboard.js'
import MapCanvas from './MapCanvas.vue'
import PipelinePanel from './PipelinePanel.vue'
import KpiStrip from './KpiStrip.vue'
import OrderDetail from '../../../../components/dashboard/OrderDetail.vue'

export default defineComponent({
  name: 'AdminDashboardCockpit',
  setup() {
      const activeKpi = ref(null);
      const hoverId = ref(null);
      const selection = ref(null);
      const filters = ref({
        vehicle: ['bike', 'van', 'truck', 'car'],
        fleet: ['owned', 'freelance', '3p'],
        fac: ['owned', '3p']
      });
      const driverPositions = typeof DRIVER_POSITIONS !== 'undefined' ? DRIVER_POSITIONS : {};
      const shipments = computed(() => typeof SHIPMENTS !== 'undefined' ? SHIPMENTS : typeof ZG_SHIPMENTS !== 'undefined' ? ZG_SHIPMENTS : []);
      const kpis = typeof KPIS !== 'undefined' ? KPIS : typeof ZC_KPIS !== 'undefined' ? ZC_KPIS : [];
      const stages = typeof ZC_STAGES !== 'undefined' ? ZC_STAGES : typeof STAGES !== 'undefined' ? STAGES : [];
      const onlineCount = computed(() => ZG_DRIVERS.filter(d => d.online).length);
      const transitCount = computed(() => shipments.value.filter(s => ['picked', 'transit', 'out'].includes(s.stage)).length);
      const tp3Count = computed(() => shipments.value.filter(s => s.mode === '3p').length);
    return () => {
      return <div class="zg-cockpit" style="display:flex;flex-direction:column;height:100%;width:100%;min-height:0;">
        <KpiStrip kpis={kpis} activeKpi={activeKpi.value} onKpiClick={id => {
          activeKpi.value = activeKpi.value === id ? null : id;
        }} />
        <div class="zg-stage" style="position:relative;flex:1;min-height:0;display:flex;">
          <MapCanvas shipments={shipments.value} drivers={ZG_DRIVERS.filter(d => filters.value.vehicle.includes(d.vehicle))} driverPositions={driverPositions} facilities={ZG_FACILITIES} zones={ZG_ZONES} filters={filters.value} selection={selection.value} hoverId={hoverId.value} onHoverId={v => hoverId.value = v} onSelectShipment={s => selection.value = { type: 'shipment', ...s }} />
          <div class="zg-mapbadge">
            <span class="zg-mapbadge-dot" />
            {onlineCount.value} couriers active · {transitCount.value} orders in transit · {tp3Count.value} 3PL orders
          </div>
        <PipelinePanel shipments={shipments.value} stages={stages} selection={selection.value} hoverId={hoverId.value} onHoverId={v => hoverId.value = v} onSelect={s => selection.value = { type: 'shipment', ...s }} />
        {selection.value && selection.value.type !== 'facility' && <OrderDetail order={selection.value} onClose={() => selection.value = null} />}
      </div>
          </div>;
    };
  }
});
</script>
