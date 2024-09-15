<script lang="ts" setup>
import { useLargeScreenDesigner } from '@/stores/designer';
import DatasetPane from './DatasetPane.vue';

import PagePane from './PagePane.vue';
import { useWidgetPane } from './useWidgetPane';

const designerStore = useLargeScreenDesigner();

const { widget, widgetPane } = useWidgetPane();

const showDataset = computed({
  get() {
    return designerStore.temporaryState.showDataset;
  },
  set(v: boolean) {
    designerStore.temporaryState.showDataset = v;
  },
});
</script>

<template>
  <div :class="showDataset ? 'w-400px' : 'w-200px'" class="bg-white flex h-full transition-width border-l-solid border-#f2f2f2">
    <div class="w-200px h-full">
      <div class="title select-none flex h-36px justify-between items-center border-b-solid border-#f2f2f2 px-2">
        <span />
        <span>{{ widget ? widget.menuConfig.name : '页面设置' }}</span>
        <div :class="{ 'i-majesticons:menu-expand-left-line': !showDataset }" class="size-1.5em cursor-pointer" @click="showDataset = true" />
      </div>
      <PagePane v-if="!widget" :show-dataset="showDataset" />
      <template v-else>
        <component :is="widgetPane" :widget="widget" />
      </template>
    </div>
    <DatasetPane v-if="showDataset" @close="showDataset = false" />
  </div>
</template>

<style scoped>
</style>
