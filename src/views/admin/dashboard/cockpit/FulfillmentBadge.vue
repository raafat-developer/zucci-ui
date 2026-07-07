<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FulfillmentBadge',
  props: {
    mode: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        mode
      } = props;
      if (mode === 'zugooo') return <span class="zg-mode zg-mode--own" title="Consignment">C</span>;
      if (mode === 'mixed') return <span class="zg-mode zg-mode--mix" title="Shopify Connect">S</span>;
      return <span class="zg-mode zg-mode--3p" title="3PL">3P</span>;
    };
  }
});
</script>
