<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui';
import { NConfigProvider, NMessageProvider, dateZhCN, zhCN } from 'naive-ui';

const themeOverrides: GlobalThemeOverrides = {
  // common: {
  //   primaryColor: '#18181B',
  //   primaryColorHover: '#18181BE6',
  //   primaryColorPressed: '#18181BE6',
  //   primaryColorSuppl: '#18181BE6',
  // },
  // Button: {
  //   borderRadiusLarge: '6px',
  //   borderRadiusTiny: '6px',
  //   borderRadiusMedium: '6px',
  //   borderRadiusSmall: '6px',
  //   heightMedium: '40px',
  //   textColorTertiary: '#18181BE6',
  //   colorTertiary: '#f4f4f5',
  //   colorTertiaryHover: '#f4f4f5cc',
  // },
};
</script>

<template>
  <NConfigProvider preflight-style-disabled class="h-full" :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <NMessageProvider>
      <RouterView />
    </NMessageProvider>
  </NConfigProvider>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
