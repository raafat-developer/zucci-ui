<script setup>
/**
 * VariantsPricingTable — generate-from-attributes + per-market pricing table.
 * Ported from the React VariantsPricingTable. Market tabs switch the selling-
 * price column; out-of-range prices flag a warning.
 */
import { ref, computed } from 'vue';
import { ZCP_ALL_MARKETS, COLOR_SWATCH } from '@/data/productsMeta';
import { ZCP_CATEGORY_CODES } from '@/data/productsData';

const props = defineProps({
  product: { type: Object, required: true },
  activeMkts: { type: Array, default: () => [] },
});
const emit = defineEmits(['update']);

const mktTab = ref(props.product.markets?.[0] || 'AE');
const variants = computed(() => props.product.variants || []);
const hasVariants = computed(() => variants.value.length > 0);
const displayMkts = computed(() => (props.activeMkts.length ? props.activeMkts : ZCP_ALL_MARKETS.slice(0, 3)));
const mktCur = computed(() => ZCP_ALL_MARKETS.find((m) => m.code === mktTab.value)?.currency || mktTab.value);
const swatch = (c) => COLOR_SWATCH[c] || 'var(--zg-muted-line)';

function generate() {
  const attrs = props.product.attributes || {};
  const colors = attrs.color?.length ? attrs.color : ['Default'];
  const sizes = attrs.size?.length ? attrs.size : ['One Size'];
  const catCode = ZCP_CATEGORY_CODES[props.product.category] || 'GEN';
  const gen = []; let idx = 1;
  colors.forEach((col) => sizes.forEach((sz) => {
    gen.push({
      id: 'v' + idx++, color: col, size: sz,
      material: (attrs.material || [])[0] || '', style: (attrs.style || [])[0] || '',
      sourceCurrency: props.product.currency || 'AED', sourcePrice: props.product.price || 0,
      commissionPct: 12, netVendor: Math.round((props.product.price || 0) * 0.88),
      marketPrices: Object.fromEntries(ZCP_ALL_MARKETS.map((m) => [m.code, 0])),
      recommendedLow: null, recommendedHigh: null, stock: 0,
      sku: catCode + '-' + (props.product.brandCode || 'BRD') + '-SC25-' + col.slice(0, 3).toUpperCase() + '-' + String(sz).toUpperCase(),
    });
  }));
  emit('update', 'variants', gen);
}

const priceFor = (v) => (v.marketPrices || {})[mktTab.value] || 0;
const recLow = (v) => v.recommendedLow?.[mktTab.value] || null;
const recHi = (v) => v.recommendedHigh?.[mktTab.value] || null;
const isWarn = (v) => { const mp = priceFor(v); const lo = recLow(v); const hi = recHi(v); return lo && hi && mp > 0 && (mp < lo || mp > hi); };
</script>

<template>
  <div style="margin-top:8px">
    <div class="zp-section-label" style="margin-bottom:8px">
      Variations &amp; Pricing
      <div style="display:inline-flex;gap:4px;margin-left:12px">
        <button
          v-for="m in displayMkts"
          :key="m.code"
          type="button"
          class="zen-filter-chip"
          :class="{ 'is-on': mktTab === m.code }"
          style="height:22px;font-size:10px;padding:0 8px"
          @click="mktTab = m.code"
        >{{ m.code }} · {{ m.currency }}</button>
      </div>
    </div>

    <div v-if="!hasVariants" class="zp-variants-empty">
      <div>
        <div style="font-size:12.5px;color:var(--zg-text-dim);margin-bottom:6px">No variants configured. Add attribute values above, then generate.</div>
        <div style="font-size:11px;color:var(--zg-text-dim)">Variants are generated from every Color × Size combination.</div>
      </div>
      <button type="button" class="zen-btn-primary" style="height:30px;font-size:11.5px;flex-shrink:0" @click="generate">Generate Variants from Attributes</button>
    </div>

    <div v-else class="zp-var-table-wrap">
      <table class="zp-var-table">
        <thead>
          <tr>
            <th style="width:28px"></th>
            <th>Color</th><th>Size</th>
            <th>Source Price</th><th>Commission</th><th>Net to Vendor</th>
            <th style="color:var(--zg-accent)">{{ mktCur }} Selling</th>
            <th style="font-size:9px;color:var(--zg-text-dim)">Rec. Range</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in variants" :key="v.id" class="zp-var-row">
            <td><div class="zp-var-color-swatch" :style="{ background: swatch(v.color) }" /></td>
            <td style="font-size:12px">{{ v.color }}</td>
            <td style="font-size:12px">{{ v.size }}</td>
            <td><span class="zp-price-val">{{ v.sourceCurrency }} {{ (v.sourcePrice || 0).toLocaleString() }}</span></td>
            <td>
              <span style="font-size:10px;color:var(--zg-text-dim)">{{ v.commissionPct }}% </span>
              <span class="zp-price-neg">−{{ Math.round((v.sourcePrice || 0) * v.commissionPct / 100) }}</span>
            </td>
            <td><span class="zp-price-val" style="color:var(--zg-good)">{{ v.sourceCurrency }} {{ v.netVendor }}</span></td>
            <td>
              <div style="display:flex;align-items:center;gap:4px">
                <input type="number" class="zp-price-input zp-field-h" :value="priceFor(v)" :style="{ borderColor: isWarn(v) ? 'var(--zg-warn)' : undefined }" />
                <span v-if="isWarn(v)" title="Outside recommended range" style="color:var(--zg-warn);font-size:11px">⚠</span>
              </div>
            </td>
            <td><span style="font-size:10px;color:var(--zg-text-dim)">{{ recLow(v) && recHi(v) ? `${recLow(v)}–${recHi(v)}` : '—' }}</span></td>
            <td :class="{ 'zp-stock-zero': v.stock === 0 }">{{ v.stock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
