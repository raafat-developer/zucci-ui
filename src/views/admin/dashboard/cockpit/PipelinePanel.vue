<script lang="tsx">
import { defineComponent, computed } from 'vue'
import OrderRow from './OrderRow.vue'

export default defineComponent({
  name: 'PipelinePanel',
  props: {
    shipments: {
      default: undefined
    },
    stages: {
      default: undefined
    },
    selection: {
      default: undefined
    },
    onSelect: {
      default: undefined
    },
    hoverId: {
      default: undefined
    },
    onHoverId: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        shipments,
        stages,
        selection,
        onSelect,
        hoverId,
        onHoverId
      } = props;
      const byStage = computed(() => {
        const m = {};
        stages.forEach(s => {
          m[s.id] = [];
        });
        shipments.forEach(s => {
          if (m[s.stage]) m[s.stage].push(s);
        });
        return m;
      });
      const returns = shipments.filter(s => s.isReturn);
      return <section class="zg-pipeline">
      <div class="zg-pipe-head">
        <div>
          <div class="zg-pipe-title">Order Pipeline</div>
          <div class="zg-pipe-sub">{shipments.length} active · live</div>
        </div>
        <div class="zg-pipe-actions">
          <button class="zg-tinybtn" title="Collapse">–</button>
          <button class="zg-tinybtn" title="More">⋯</button>
        </div>
      </div>

      <div class="zg-pipe-stages">
        {stages.map((stage, i) => {
            const list = byStage.value[stage.id] || [];
            return <div key={stage.id} class="zg-pipe-stage">
              <div class="zg-pipe-stagehd">
                <div class="zg-pipe-stepmark">
                  <span class="zg-pipe-stepnum">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div class="zg-pipe-stepname">{stage.label}</div>
                <div class="zg-pipe-stepcount">{list.length}</div>
              </div>
              <div class="zg-pipe-rail">
                <span class="zg-pipe-railfill" style={{
                  width: `${Math.min(100, list.length * 12)}%`
                }} />
              </div>
              <div class="zg-pipe-list">
                {list.slice(0, 4).map((s, idx) => <OrderRow key={s.id} s={s} idx={idx} active={selection?.type === 'shipment' && selection.id === s.id} hovered={hoverId === s.id} onClick={() => onSelect(s)} onMouseEnter={() => onHoverId(s.id)} onMouseLeave={() => onHoverId(null)} />)}
                {list.length > 4 && <button class="zg-pipe-more">+{list.length - 4} more in {stage.label}</button>}
              </div>
            </div>;
          })}
      </div>

      {returns.length > 0 && <div class="zg-returns">
          <div class="zg-returns-hd">
            <div class="zg-returns-title">
              <span class="zg-returns-glyph">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 4L3 7L6 10 M3 7H11A3 3 0 0114 10V13" />
                </svg>
              </span>
              Return Cycle
            </div>
            <span class="zg-returns-count">{returns.length}</span>
          </div>
          <div class="zg-returns-flow">
            <span>Buyer</span><span class="zg-dash">·</span>
            <span>Collection</span><span class="zg-dash">·</span>
            <span>Zucci WH</span><span class="zg-dash">·</span>
            <span>QC Check</span><span class="zg-dash">·</span>
            <span>Brand</span>
          </div>
          <div class="zg-pipe-list">
            {returns.slice(0, 3).map((s, idx) => <OrderRow key={s.id} s={s} idx={idx} isReturn active={selection?.type === 'shipment' && selection.id === s.id} onClick={() => onSelect(s)} />)}
          </div>
        </div>}
    </section>;
    };
  }
});
</script>
