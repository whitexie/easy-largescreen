import ShadcnTheme from '@/assets/themes/shadcn.json';
import { dateZhCN, NConfigProvider, NMessageProvider, zhCN } from 'naive-ui';
import { createPinia } from 'pinia';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/main.css';
import 'virtual:uno.css';

// 注册物料
import '@/materials';

const app = createApp(
  <NConfigProvider
    preflight-style-disabled
    class="h-full"
    themeOverrides={ShadcnTheme}
    locale={zhCN}
    dateLocale={dateZhCN}
  >
    <NMessageProvider>
      <App />
    </NMessageProvider>
  </NConfigProvider>,
);

app.use(createPinia());
app.use(router);

app.mount('#app');
