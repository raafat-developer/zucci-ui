<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FilterGroup',
  props: {
    label: {
      default: undefined
    },
    children: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        label,
        children
      } = props;
      return <div class="zg-filter-group">
      <div class="zg-filter-lbl">{label}</div>
      <div class="zg-filter-chips">{children}</div>
    </div>;
    };
  }
});
</script>
