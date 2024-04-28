<script lang="ts" setup>
import DatasetPane from './DatasetPane.vue';
import PagePane from './PagePane.vue';

import { useLargeScreenDesigner } from '@/stores/designer';

const designerStore = useLargeScreenDesigner();

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
    <PagePane :show-dataset="showDataset" @open="showDataset = true" />
    <DatasetPane v-if="showDataset" @close="showDataset = false" />
  </div>
</template>

<style scoped>
</style>
