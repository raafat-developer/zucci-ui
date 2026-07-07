import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import './assets/styles/tokens.css';
import './assets/styles/base.css';
// Real Zucci stylesheets (verbatim from the React build) — imported globally so
// ported module markup renders with identical classes. UI-kit components keep
// their own scoped CSS on top of these.
import './assets/styles/legacy/styles.css';
import './assets/styles/legacy/styles-zucci-entities.css';
import './assets/styles/legacy/styles-zucci-settings.css';
import './assets/styles/legacy/styles-zucci-products.css';
import './assets/styles/legacy/styles-zucci-orders.css';
import './assets/styles/legacy/styles-zucci-warehouses.css';
import './assets/styles/legacy/styles-zucci-finance.css';
import './assets/styles/legacy/styles-zucci-categories.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
