<script lang="tsx">
import { defineComponent } from 'vue'
import { MAP_CENTER, MAP_SPAN, MAP_SIZE, projectLL } from './helpers.js'

export default defineComponent({
  name: 'VehicleGlyph',
  props: {
    kind: {
      default: undefined
    },
    color: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        kind,
        color
      } = props;
      const c = props.color || 'currentColor';
      if (props.kind === 'truck') {
        return <g stroke={c} strokeWidth="1.2" fill="none">
            <rect x="-5" y="-3" width="6" height="5" />
            <rect x="1" y="-1" width="4" height="3" />
          </g>;
      }
      if (props.kind === 'bike') {
        return <g stroke={c} strokeWidth="1.2" fill="none">
            <circle cx="-3" cy="1" r="2" />
            <circle cx="3" cy="1" r="2" />
            <path d="M -3 1 L 0 -3 L 3 1" />
          </g>;
      }
      return <g stroke={c} strokeWidth="1.2" fill="none">
          <rect x="-4" y="-2" width="8" height="4" rx="1" />
          <path d="M -2 -2 L -1 -4 L 1 -4 L 2 -2" />
        </g>;
    };
  }
});
</script>
