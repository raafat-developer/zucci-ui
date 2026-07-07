<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FleetCell',
  props: {
    kind: {
      default: undefined
    },
    g: {
      default: () => ({
        owned: 0,
        freelance: 0
      })
    }
  },
  setup(props) {
    return () => {
      const {
        kind
      } = props;
      const g = props.g || {
        owned: 0,
        freelance: 0
      };
      const total = (g.owned || 0) + (g.freelance || 0) || 1;
      return <div class="zg-fleet-cell">
          <div class="zg-fleet-row"><span class="zg-fleet-kind">{props.kind}</span><span class="zg-fleet-total">{(g.owned || 0) + (g.freelance || 0)}</span></div>
          <div class="zg-fleet-bar">
            <span style={{
            width: `${g.owned / total * 100}%`
          }} class="zg-fleet-own" />
            <span style={{
            width: `${g.freelance / total * 100}%`
          }} class="zg-fleet-free" />
          </div>
          <div class="zg-fleet-legend"><span>{g.owned} own</span><span>{g.freelance} fr</span></div>
        </div>;
    };
  }
});
</script>
