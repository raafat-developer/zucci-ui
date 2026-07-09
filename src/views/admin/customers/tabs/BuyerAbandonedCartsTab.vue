<script setup>
const props = defineProps({ buyer: { type: Object, required: true } });

const CARTS = [
  { id:'CART-441', date:'Jun 1, 2026',  items:2, value:899.98, currency:'SAR', brands:['Le Maillot'], recoveryEmail:'Sent · Jun 2',  recovered:false },
  { id:'CART-388', date:'May 10, 2026', items:1, value:449.99, currency:'SAR', brands:['Burgandy'],   recoveryEmail:'Sent · May 11', recovered:true  },
];
</script>

<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar">
      <div class="zen-tab-toolbar-title">
        {{ CARTS.filter(c => !c.recovered).length }} active · {{ CARTS.filter(c => c.recovered).length }} recovered
      </div>
      <button class="zen-btn-primary" style="font-size:11.5px;height:28px;" @click="">Send Recovery Email</button>
    </div>

    <div v-for="c in CARTS" :key="c.id" class="zen-card" style="margin-bottom:8px;">
      <div class="zen-card-head">
        <span class="zen-pd-order-id">{{ c.id }}</span>
        <span class="zen-bst" :style="{
          background: c.recovered ? 'oklch(0.78 0.15 150 / 0.1)' : 'oklch(0.82 0.15 75 / 0.1)',
          color: c.recovered ? 'var(--zg-good)' : 'var(--zg-warn)'
        }">{{ c.recovered ? 'Recovered' : 'Abandoned' }}</span>
        <span class="zen-pd-date" style="margin-left:auto;">{{ c.date }}</span>
      </div>
      <div class="zen-bank-fields" style="margin-top:8px;">
        <div class="zen-bank-field"><div class="zen-field-label">Items</div><div class="zen-field-val">{{ c.items }} item{{ c.items !== 1 ? 's' : '' }} · {{ c.brands.join(', ') }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Cart Value</div><div class="zen-field-val zen-field-mono">{{ c.currency }} {{ c.value.toFixed(2) }}</div></div>
        <div class="zen-bank-field"><div class="zen-field-label">Recovery Email</div><div class="zen-field-val">{{ c.recoveryEmail }}</div></div>
      </div>
      <div v-if="!c.recovered" style="display:flex;gap:6px;margin-top:10px;">
        <button class="zen-doc-card-btn" @click="">Resend Recovery Email</button>
        <button class="zen-doc-card-btn" @click="">View Cart</button>
      </div>
    </div>
  </div>
</template>
