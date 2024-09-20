<script setup lang="ts">
import type { BoxId, Field, OriginalField } from '@/types/charts';
import FieldPane from '@/components/Designer/PropsPane/FieldPane.vue';
import ChartRender from '../Charts/ChartRender.vue';
import { useChartDesigner } from './composables/useChartDesigner';
import { useDatasetList, useFields } from './composables/useDatasetList';
import DropFields from './DropFields.vue';

const { datasetId, state, addField, removeField, updateFiledIndex, chartConfig, data } = useChartDesigner();
const { datasetList } = useDatasetList();
const { dimensionFields, metricFields } = useFields(datasetId);

const datasetListOptions = computed(() => {
  return datasetList.map((item) => {
    const { id: value, name: label } = item;

    return { value, label };
  });
});

function handleAdd(boxId: BoxId, data: { field: OriginalField, index: number }) {
  addField(boxId, data.field, data.index);
}

function handleDelete(boxId: BoxId, data: Field) {
  removeField(boxId, data.id);
}
</script>

<template>
  <div class="w-full h-full bg-gray-200 p-1">
    <div class="header h-40px border-b-solid bg-white rounded-md border-gray-200 flex items-center justify-between px-2">
      <n-select v-model:value="datasetId" class="w-150px" size="small" :options="datasetListOptions" />
      <n-button type="primary" size="small" round>
        预览
      </n-button>
    </div>
    <div class="main-content flex gap-1">
      <div class="h-full w-120px border-r-solid bg-white rounded-md border-gray-200 px-1">
        <FieldPane drop-group="123" class="field-pane" title="维度" type="dimension" :fields="dimensionFields" />
        <FieldPane drop-group="123" class="field-pane" title="度量" type="metric" :fields="metricFields" />
      </div>

      <div class="input-fields w-160px h-full border-r-solid border-gray-200">
        <DropFields
          v-for="item in state.dropBoxSettings"
          :key="item.id"
          v-model:fields="item.fields"
          :title="item.title"
          :type="item.fieldType"
          drop-group="123"
          class="bg-white rounded-md py-1"
          @add="(e) => handleAdd(item.id, e)"
          @update="(e) => updateFiledIndex(item.id, e.field, e.newIndex)"
          @delete="(e) => handleDelete(item.id, e)"
        />
      </div>

      <div class="renderer-container h-full flex-1 bg-white rounded-md">
        <ChartRender :chart-config="chartConfig" :data="data" />
      </div>
      <div class="props-pane h-full w-200px border-l-solid border-gray-200 bg-white rounded-md">
        <!--  -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  margin-top: 4px;
  height: calc(100% - 40px - 4px);

  .field-pane {
    max-height: 50%;
  }
}
</style>
