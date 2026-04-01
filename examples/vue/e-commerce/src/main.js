import { createApp } from 'vue';
import InstantSearch from 'vue-instantsearch';

import './Theme.css';
import './App.css';
import './App.mobile.css';
import './widgets/PriceSlider.css';
import App from './App.vue';

const app = createApp(App);
app.use(InstantSearch);
app.mount('#app');
