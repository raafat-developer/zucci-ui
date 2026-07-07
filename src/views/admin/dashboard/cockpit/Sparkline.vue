<script lang="tsx">
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'Sparkline',
  props: {
    values: {
      default: undefined
    },
    kind: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        values,
        kind
      } = props;
      const w = 64,
        h = 18;
      const max = Math.max(...values),
        min = Math.min(...values);
      const step = w / (values.length - 1);
      const points = values.map((v, i) => {
        const x = i * step;
        const y = h - (v - min) / Math.max(1, max - min) * h;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      const stroke = kind === 'neg' ? 'var(--zg-danger)' : kind === 'warn' ? 'var(--zg-warn)' : 'var(--zg-accent)';
      return <svg class="zg-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.3" />
    </svg>;
    };
  }
});
</script>
