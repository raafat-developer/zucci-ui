<script lang="tsx">
import { defineComponent } from 'vue'
import { formatEta } from './helpers.js'
import { ZC_BRANDS_SAMPLE, ZC_DEST_CITIES } from '../../../../data/dashboard.js'
import FulfillmentBadge from './FulfillmentBadge.vue'

export default defineComponent({
  name: 'OrderRow',
  props: {
    s: {
      default: undefined
    },
    idx: {
      default: undefined
    },
    active: {
      default: undefined
    },
    hovered: {
      default: undefined
    },
    onClick: {
      default: undefined
    },
    onMouseEnter: {
      default: undefined
    },
    onMouseLeave: {
      default: undefined
    },
    isReturn: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        s,
        idx,
        active,
        hovered,
        onClick,
        onMouseEnter,
        onMouseLeave,
        isReturn
      } = props;
      const brand = ZC_BRANDS_SAMPLE[(s.id.charCodeAt(s.id.length - 1) + idx) % ZC_BRANDS_SAMPLE.length];
      const city = ZC_DEST_CITIES[(s.id.charCodeAt(s.id.length - 2) + idx) % ZC_DEST_CITIES.length];
      const orderId = 'ORD-' + s.id.replace(/\D/g, '').slice(-5).padStart(5, '0');
      return <button class={`zg-ship ${active ? 'is-active' : ''} ${hovered ? 'is-hover' : ''}`} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div class="zg-ship-left">
        <FulfillmentBadge mode={s.mode} />
        <div class="zg-ship-id-col">
          <div class="zg-ship-id">{orderId}{isReturn && <span class="zg-ship-ret"> · RET</span>}</div>
          <div class="zg-ship-route">
            <span style={{
                maxWidth: 80,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{brand}</span>
            <svg width="10" height="6" viewBox="0 0 10 6"><path d="M0 3H8 M5 1L8 3L5 5" stroke="currentColor" strokeWidth="1" fill="none" /></svg>
            <span>{city}</span>
          </div>
        </div>
      </div>
      <div class="zg-ship-mid">
        {s.hold && <span class="zg-pill zg-pill--warn">VERIFY</span>}
        {s.sla === 'breached' && <span class="zg-pill zg-pill--danger">SLA</span>}
        {s.sla === 'risk' && !s.hold && <span class="zg-pill zg-pill--warn">AT RISK</span>}
        {s.mode === '3p' && <span class="zg-pill zg-pill--muted">3PL</span>}
      </div>
      <div class="zg-ship-right">
        <div class="zg-ship-eta">
          {s.mode === '3p' ? <><span class="zg-ship-etalbl">last</span><span>{s.lastSeenMin}m</span></> : <><span class="zg-ship-etalbl">ETA</span><span>{formatEta(s.etaMin)}</span></>}
        </div>
      </div>
    </button>;
    };
  }
});
</script>
