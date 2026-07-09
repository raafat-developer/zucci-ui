<script setup>
const props = defineProps({ buyer: { type: Object, required: true } });
const a = props.buyer.analytics;
const maxCat   = a.topCategories[0]?.pct || 100;
const maxBrand = a.topBrands[0]?.orders || 1;
</script>

<template>
  <div class="zen-tab-body">
    <div class="zen-adv-kpi-grid">
      <div v-for="[lbl, val] in [
        ['Purchase Frequency', a.purchaseFrequency],
        ['Avg Days Between Orders', `${a.avgDaysBetweenOrders} days`],
        ['Preferred Day', a.preferredDay],
        ['Preferred Time', a.preferredTime],
      ]" :key="lbl" class="zen-adv-kpi-card">
        <div class="zen-adv-kpi-lbl">{{ lbl }}</div>
        <div class="zen-adv-kpi-val" style="font-size:13px;">{{ val }}</div>
      </div>
    </div>

    <div class="zen-grid-2">
      <!-- Top categories -->
      <div class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title">Top Categories</span></div>
        <div class="byr-bar-list">
          <div v-for="c in a.topCategories" :key="c.name" class="byr-bar-row">
            <span class="byr-bar-label">{{ c.name }}</span>
            <div class="byr-bar-track"><div class="byr-bar-fill" :style="{ width: c.pct + '%' }" /></div>
            <span class="byr-bar-pct">{{ c.pct }}%</span>
          </div>
        </div>
      </div>

      <!-- Top brands -->
      <div class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title">Top Brands</span></div>
        <div class="byr-bar-list">
          <div v-for="b in a.topBrands" :key="b.name" class="byr-bar-row">
            <span class="byr-bar-label">{{ b.name }}</span>
            <div class="byr-bar-track"><div class="byr-bar-fill" :style="{ width: (b.orders / maxBrand * 100) + '%' }" /></div>
            <span class="byr-bar-pct">{{ b.orders }} orders</span>
          </div>
        </div>
      </div>

      <!-- Device breakdown -->
      <div class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title">Device Breakdown</span></div>
        <div class="byr-device-row">
          <div class="byr-device-bar">
            <div class="byr-device-fill byr-device-fill--mobile" :style="{ width: a.deviceBreakdown.mobile + '%' }" />
            <div class="byr-device-fill byr-device-fill--desktop" :style="{ width: a.deviceBreakdown.desktop + '%' }" />
          </div>
          <div class="byr-device-legend">
            <span><span class="byr-device-dot byr-device-dot--mobile"/>Mobile {{ a.deviceBreakdown.mobile }}%</span>
            <span><span class="byr-device-dot byr-device-dot--desktop"/>Desktop {{ a.deviceBreakdown.desktop }}%</span>
          </div>
        </div>
      </div>

      <!-- Return reasons -->
      <div class="zen-card">
        <div class="zen-card-head"><span class="zen-card-title">Return Reasons</span></div>
        <div v-if="!a.returnReasons.length" style="font-size:12px;color:var(--zg-text-dim);">No returns yet.</div>
        <div v-for="r in a.returnReasons" :key="r.reason"
          class="zen-bank-field" style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;">
          <span class="zen-field-label" style="margin-bottom:0;">{{ r.reason }}</span>
          <span class="zen-field-val">{{ r.count }}×</span>
        </div>
      </div>
    </div>
  </div>
</template>
