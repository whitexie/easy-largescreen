<script lang="ts" setup>
import PagePane from './PagePane.vue';
import { useWidgetPane } from './useWidgetPane';

const { widget, widgetPane } = useWidgetPane();
</script>

<template>
  <div class="bg-white flex w-240px h-full transition-width border-l-solid border-#f2f2f2">
    <div class="w-full h-full">
      <div class="title select-none flex h-36px justify-center items-center border-b-solid border-#f2f2f2 px-2">
        <span>{{ widget ? widget.menuConfig.name : '页面设置' }}</span>
      </div>
      <PagePane v-if="!widget" />
      <template v-else>
        <component :is="widgetPane" :widget="widget" />
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
