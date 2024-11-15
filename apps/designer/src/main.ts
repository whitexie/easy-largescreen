import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import './assets/main.css';
import 'virtual:uno.css';

// 注册物料
import '@/materials';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
