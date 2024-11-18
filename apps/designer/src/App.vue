<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui';
import { dateZhCN, NConfigProvider, NMessageProvider, zhCN } from 'naive-ui';

const theme = ref<GlobalThemeOverrides>({});

import('@/assets/themes/shadcn.json').then((res) => {
  theme.value = JSON.parse(JSON.stringify(res));
});
</script>

<template>
  <NConfigProvider preflight-style-disabled class="h-full" :theme-overrides="theme" :locale="zhCN" :date-locale="dateZhCN">
    <NMessageProvider>
      <RouterView />
    </NMessageProvider>
  </NConfigProvider>
</template>
