<script setup lang="ts">
import { useChartDesigner } from './composables/useChartDesigner';
import { useDatasetList } from './composables/useDatasetList';
import FieldPane from '@/components/Designer/PropsPane/FieldPane.vue';

const { datasetId, metricFields, dimensionFields } = useChartDesigner();
const { datasetList } = useDatasetList();

const datasetListOptions = computed(() => {
  return datasetList.map((item) => {
    const { id: value, name: label } = item;

    return { value, label };
  });
});
</script>

<template>
  <div class="w-full h-full">
    <div class="header h-40px border-b-solid border-gray-200">
      <!--  -->
    </div>
    <div class="pane-field w-120px border-r-solid border-gray-200">
      <n-select v-model:value="datasetId" class="" size="small" :options="datasetListOptions" />
      <FieldPane title="指标" type="metric" :fields="metricFields" />
      <FieldPane title="维度" type="dimension" :fields="dimensionFields" />
    </div>
  </div>
</template>

<style scoped>
.pane-field {
  height: calc(100% - 40px);
}
</style>
