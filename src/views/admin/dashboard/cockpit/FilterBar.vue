<script lang="tsx">
import { defineComponent } from 'vue'
import FilterChip from './FilterChip.vue'
import FilterGroup from './FilterGroup.vue'

export default defineComponent({
  name: 'FilterBar',
  props: {
    filters: {
      default: undefined
    },
    onChange: {
      default: undefined
    }
  },
  setup(props) {
    return () => {
      const {
        filters,
        onChange
      } = props;
      const toggle = (key, val) => {
        const set = new Set(filters[key]);
        if (set.has(val)) set.delete(val);else set.add(val);
        onChange({
          ...filters,
          [key]: Array.from(set)
        });
      };
      return <div class="zg-filterbar">
      <FilterGroup label="Mode">
        <FilterChip active={filters.mode.includes('zugooo')} onClick={() => toggle('mode', 'zugooo')} swatch="accent">ZUGOOO</FilterChip>
        <FilterChip active={filters.mode.includes('mixed')} onClick={() => toggle('mode', 'mixed')} swatch="accent-dim">Mixed</FilterChip>
        <FilterChip active={filters.mode.includes('3p')} onClick={() => toggle('mode', '3p')} swatch="muted">3P</FilterChip>
      </FilterGroup>
      <FilterGroup label="Fleet">
        <FilterChip active={filters.fleet.includes('owned')} onClick={() => toggle('fleet', 'owned')} icon="solid">Owned</FilterChip>
        <FilterChip active={filters.fleet.includes('freelance')} onClick={() => toggle('fleet', 'freelance')} icon="ring">Freelance</FilterChip>
        <FilterChip active={filters.fleet.includes('3p')} onClick={() => toggle('fleet', '3p')} icon="dashed">3P (NLT)</FilterChip>
      </FilterGroup>
      <FilterGroup label="Vehicle">
        <FilterChip active={filters.vehicle.includes('car')} onClick={() => toggle('vehicle', 'car')}>Cars</FilterChip>
        <FilterChip active={filters.vehicle.includes('bike')} onClick={() => toggle('vehicle', 'bike')}>Bikes</FilterChip>
        <FilterChip active={filters.vehicle.includes('truck')} onClick={() => toggle('vehicle', 'truck')}>Trucks</FilterChip>
      </FilterGroup>
      <FilterGroup label="Facilities">
        <FilterChip active={filters.fac.includes('owned')} onClick={() => toggle('fac', 'owned')} icon="diamond-solid">Depots / WH · Own</FilterChip>
        <FilterChip active={filters.fac.includes('3p')} onClick={() => toggle('fac', '3p')} icon="diamond-ring">Depots / WH · 3P</FilterChip>
      </FilterGroup>
    </div>;
    };
  }
});
</script>
