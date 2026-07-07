<script lang="tsx">
import { defineComponent } from 'vue'
import ChipIcon from './ChipIcon.vue'

export default defineComponent({
  name: 'FilterChip',
  props: {
    active: {
      default: undefined
    },
    onClick: {
      default: undefined
    },
    children: {
      default: undefined
    },
    swatch: {
      default: undefined
    },
    icon: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        active,
        onClick,
        children,
        swatch,
        icon
      } = props;
      return <button class={`zg-chip ${active ? 'is-on' : ''}`} onClick={onClick}>
      {swatch && <span class={`zg-chip-swatch zg-chip-swatch--${swatch}`} />}
      {icon && <ChipIcon kind={icon} />}
      {children}
    </button>;
    };
  }
});
</script>
