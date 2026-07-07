<script lang="tsx">
import { defineComponent, ref, computed, h } from 'vue'
import { MAP_SIZE, projectLL, LAND_PATHS, landPathToSvg } from './helpers.js'
import VehicleGlyph from './VehicleGlyph.vue'

export default defineComponent({
  name: 'MapCanvas',
  props: {
    shipments: {
      default: undefined
    },
    drivers: {
      default: undefined
    },
    driverPositions: {
      default: undefined
    },
    facilities: {
      default: undefined
    },
    zones: {
      default: undefined
    },
    accent: {
      default: undefined
    },
    filters: {
      default: undefined
    },
    selection: {
      default: undefined
    },
    onSelectShipment: {
      default: undefined
    },
    onSelectDriver: {
      default: undefined
    },
    onSelectFacility: {
      default: undefined
    },
    hoverId: {
      default: undefined
    },
    onHoverId: {
      default: undefined
    },
    mapStyle: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        shipments,
        drivers,
        driverPositions,
        facilities,
        zones,
        accent,
        filters,
        selection,
        onSelectShipment,
        onSelectDriver,
        onSelectFacility,
        hoverId,
        onHoverId,
        mapStyle
      } = props;
      const svgRef = ref(null);
      const posByDriver = computed(() => {
        const m = {};
        driverPositions.forEach(p => {
          m[p.driverId] = p;
        });
        return m;
      });
      const showOwned = filters.fleet.includes('owned');
      const showFreelance = filters.fleet.includes('freelance');
      const show3P = filters.fleet.includes('3p');
      const showOwnedFac = filters.fac.includes('owned');
      const show3PFac = filters.fac.includes('3p');
      const modeSet = new Set(filters.mode);
      const routes = computed(() => {
        return shipments.filter(s => modeSet.has(s.mode) && ['transit', 'handoff', 'lastmile'].includes(s.stage)).map(s => {
          const o = zones.find(z => z.id === s.originZone);
          const d = zones.find(z => z.id === s.destZone);
          if (!o || !d) return null;
          const op = projectLL(o.lng, o.lat);
          const dp = projectLL(d.lng, d.lat);
          const mx = (op.x + dp.x) / 2;
          const my = (op.y + dp.y) / 2;
          const dx = dp.x - op.x,
            dy = dp.y - op.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = -dy / len,
            ny = dx / len;
          const curve = Math.min(180, len * 0.18);
          const cx = mx + nx * curve;
          const cy = my + ny * curve;
          return {
            id: s.id,
            mode: s.mode,
            sla: s.sla,
            d: `M ${op.x} ${op.y} Q ${cx} ${cy} ${dp.x} ${dp.y}`
          };
        }).filter(Boolean);
      });
      const routeColor = r => {
        if (r.mode === '3p') return 'var(--zg-muted-line)';
        if (r.sla === 'breached') return 'var(--zg-danger)';
        if (r.sla === 'risk') return 'var(--zg-warn)';
        return r.mode === 'mixed' ? 'var(--zg-accent-dim)' : 'var(--zg-accent)';
      };
      return <svg ref={svgRef} class="zg-map" viewBox={`0 0 ${MAP_SIZE.w} ${MAP_SIZE.h}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="zg-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--zg-grid)" strokeWidth="0.5" />
        </pattern>
        <pattern id="zg-grid-fine" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--zg-grid-fine)" strokeWidth="0.25" />
        </pattern>
        <radialGradient id="zg-pulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--zg-accent)" stopOpacity="0.6" />
          <stop offset="70%" stopColor="var(--zg-accent)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--zg-accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="zg-pulse-red" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--zg-danger)" stopOpacity="0.55" />
          <stop offset="70%" stopColor="var(--zg-danger)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--zg-danger)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {}
      <rect width={MAP_SIZE.w} height={MAP_SIZE.h} fill="var(--zg-map-bg)" />
      <rect width={MAP_SIZE.w} height={MAP_SIZE.h} fill="url(#zg-grid-fine)" />
      <rect width={MAP_SIZE.w} height={MAP_SIZE.h} fill="url(#zg-grid)" />

      {}
      {mapStyle === 'tactical' && <g opacity="0.35">
          <line x1={MAP_SIZE.w / 2} y1="0" x2={MAP_SIZE.w / 2} y2={MAP_SIZE.h} stroke="var(--zg-grid)" strokeWidth="0.75" strokeDasharray="4 8" />
          <line x1="0" y1={MAP_SIZE.h / 2} x2={MAP_SIZE.w} y2={MAP_SIZE.h / 2} stroke="var(--zg-grid)" strokeWidth="0.75" strokeDasharray="4 8" />
        </g>}

      {}
      <g class="zg-land">
        {LAND_PATHS.map((p, i) => <path key={i} d={landPathToSvg(p)} fill="var(--zg-land)" stroke="var(--zg-land-stroke)" strokeWidth="1.25" />)}
      </g>

      {}
      <g class="zg-zones">
        {zones.map(z => {
            const p = projectLL(z.lng, z.lat);
            return <g key={z.id} transform={`translate(${p.x} ${p.y})`}>
              <circle r="70" fill="var(--zg-zone)" opacity="0.35" />
              <text y="-80" textAnchor="middle" class="zg-zone-label">{z.id}</text>
            </g>;
          })}
      </g>

      {}
      <g class="zg-routes">
        {routes.value.map(r => <path key={r.id} d={r.d} fill="none" stroke={routeColor(r)} strokeWidth={selection?.type === 'shipment' && selection.id === r.id ? 3 : 1.25} strokeDasharray={r.mode === '3p' ? '6 8' : r.mode === 'mixed' ? '14 6' : 'none'} opacity={selection && !(selection.type === 'shipment' && selection.id === r.id) ? 0.28 : 0.75} class="zg-route" />)}
      </g>

      {}
      <g class="zg-facilities">
        {facilities.filter(f => f.owner === 'owned' ? showOwnedFac : show3PFac).map(f => {
            const p = projectLL(f.lng, f.lat);
            const isOwn = f.owner === 'owned';
            const size = f.kind === 'warehouse' ? 14 : 10;
            return <g key={f.id} transform={`translate(${p.x} ${p.y})`} class="zg-fac" onClick={() => onSelectFacility(f)} onMouseEnter={() => onHoverId(f.id)} onMouseLeave={() => onHoverId(null)}>
              <rect x={-size} y={-size} width={size * 2} height={size * 2} transform="rotate(45)" fill={isOwn ? 'var(--zg-panel)' : 'transparent'} stroke={isOwn ? 'var(--zg-accent)' : 'var(--zg-muted-line)'} strokeWidth="2" strokeDasharray={isOwn ? 'none' : '4 3'} />
              <text y={size + 20} textAnchor="middle" class="zg-fac-label">{f.id}</text>
            </g>;
          })}
      </g>

      {}
      <g class="zg-drivers">
        {drivers.map(d => {
            const showKind = d.kind === 'owned' && showOwned || d.kind === 'freelance' && showFreelance;
            if (!showKind) return null;
            const pos = posByDriver.value[d.id];
            if (!pos) return null;
            const p = projectLL(pos.lng, pos.lat);
            const isSel = selection?.type === 'driver' && selection.id === d.id;
            const isOwned = d.kind === 'owned';
            return <g key={d.id} transform={`translate(${p.x} ${p.y})`} class="zg-pin" onClick={e => {
              e.stopPropagation();
              onSelectDriver(d);
            }} onMouseEnter={() => onHoverId(d.id)} onMouseLeave={() => onHoverId(null)}>
              {isSel && <circle r="34" fill="url(#zg-pulse)" />}
              {d.online && <circle r="18" fill="url(#zg-pulse)" opacity="0.55" />}
              {}
              <circle r="9" fill={isOwned ? 'var(--zg-accent)' : 'var(--zg-panel)'} stroke="var(--zg-accent)" strokeWidth={isOwned ? 0 : 2.5} />
              <VehicleGlyph kind={d.vehicle} color={isOwned ? 'var(--zg-bg)' : 'var(--zg-accent)'} />
            </g>;
          })}
      </g>

      {}
      {show3P && <g class="zg-3p">
          {shipments.filter(s => s.mode === '3p' && modeSet.has('3p') && ['transit', 'handoff', 'lastmile'].includes(s.stage)).map(s => {
            const p = projectLL(s.lng, s.lat);
            const isSel = selection?.type === 'shipment' && selection.id === s.id;
            return <g key={s.id} transform={`translate(${p.x} ${p.y})`} class="zg-pin zg-pin-3p" onClick={e => {
              e.stopPropagation();
              onSelectShipment(s);
            }} onMouseEnter={() => onHoverId(s.id)} onMouseLeave={() => onHoverId(null)}>
                {isSel && <circle r="30" fill="url(#zg-pulse)" />}
                <circle r="8" fill="transparent" stroke="var(--zg-muted-line)" strokeWidth="1.5" strokeDasharray="3 2.5" />
                <circle r="2" fill="var(--zg-muted-line)" />
                <text y="-14" textAnchor="middle" class="zg-nlt-label">NLT</text>
              </g>;
          })}
        </g>}

      {}
      <g class="zg-alerts">
        {shipments.filter(s => s.sla === 'breached' && modeSet.has(s.mode)).slice(0, 8).map(s => {
            const p = projectLL(s.lng, s.lat);
            return <g key={s.id} transform={`translate(${p.x} ${p.y})`}>
              <circle r="26" fill="url(#zg-pulse-red)">
                <animate attributeName="r" values="18;32;18" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.4s" repeatCount="indefinite" />
              </circle>
            </g>;
          })}
      </g>
    </svg>;
    };
  }
});
</script>
