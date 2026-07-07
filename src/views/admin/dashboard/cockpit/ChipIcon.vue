<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ChipIcon',
  props: {
    kind: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        kind
      } = props;
      if (kind === 'solid') return <svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="var(--zg-accent)" /></svg>;
      if (kind === 'ring') return <svg width="10" height="10"><circle cx="5" cy="5" r="3" fill="none" stroke="var(--zg-accent)" strokeWidth="1.5" /></svg>;
      if (kind === 'dashed') return <svg width="10" height="10"><circle cx="5" cy="5" r="3.5" fill="none" stroke="var(--zg-muted-line)" strokeWidth="1.2" strokeDasharray="2 1.5" /></svg>;
      if (kind === 'diamond-solid') return <svg width="10" height="10"><rect x="1.5" y="1.5" width="7" height="7" transform="rotate(45 5 5)" fill="var(--zg-accent)" /></svg>;
      if (kind === 'diamond-ring') return <svg width="10" height="10"><rect x="1.5" y="1.5" width="7" height="7" transform="rotate(45 5 5)" fill="none" stroke="var(--zg-muted-line)" strokeWidth="1.2" strokeDasharray="2 1.5" /></svg>;
      return null;
    };
  }
});
</script>
