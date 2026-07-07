import { ref } from 'vue';

/**
 * Runtime accent theming, ported from the React auth app's useEffect that
 * wrote --zg-accent / --zg-accent-tint onto :root.
 */
const accent = ref('oklch(0.88 0.19 130)');

export function useTheme() {
  const setAccent = (value) => {
    accent.value = value;
    document.documentElement.style.setProperty('--zg-accent', value);
    const tint = value.startsWith('#')
      ? `${value}26`
      : value.replace(/\)\s*$/, ' / 0.15)');
    document.documentElement.style.setProperty('--zg-accent-tint', tint);
  };
  return { accent, setAccent };
}
