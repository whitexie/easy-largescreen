<script setup lang="ts">
import type { BoxId, ChartRenderState, Field, OriginalField } from '@/types/charts';
import FieldPane from '@/components/Designer/PropsPane/FieldPane.vue';
import { loadAsyncComponent } from '@/utils/component';
import { useChartDesigner } from './composables/useChartDesigner';
import { useDatasetList, useFields } from './composables/useDatasetList';
import DropFields from './DropFields.vue';

const props = defineProps<{
  chartConfig: Partial<ChartRenderState>
}>();

const emit = defineEmits<{
  (e: 'save', value: ChartRenderState): void
}>();
const { datasetId, state, addField, removeField, updateFiledIndex, chartConfig, data, getChartConfig } = useChartDesigner(props.chartConfig);
const { datasetList } = useDatasetList();
const { dimensionFields, metricFields } = useFields(datasetId);

const ChartRender = loadAsyncComponent(() => import('@/components/Charts/ChartRender.vue'));

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

function handleSave() {
  emit('save', getChartConfig());
}
</script>

<template>
  <div class="w-full h-full bg-gray-200 p-1">
    <div class="header h-40px border-b-solid bg-white rounded-md border-gray-200 flex items-center justify-between px-2">
      <div class="flex gap-1 items-center">
        <n-select v-model:value="datasetId" class="w-150px" size="small" :options="datasetListOptions" />
        <!-- <div class="i-eos-icons:bubble-loading w-1em h-1em" /> -->
      </div>

      <n-button type="primary" size="small" round @click="handleSave">
        保存
      </n-button>
    </div>
    <div class="main-content flex gap-1">
      <div class="field-pane-container h-full border-r-solid bg-white rounded-md border-gray-200 px-1 flex-shrink-0">
        <FieldPane drop-group="123" class="field-pane" title="维度" type="dimension" :fields="dimensionFields" />
        <FieldPane drop-group="123" class="field-pane" title="度量" type="metric" :fields="metricFields" />
      </div>

      <div class="input-fields-container  h-full border-r-solid border-gray-200 flex-shrink-0">
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

      <div class="renderer-container h-full flex-1 bg-white rounded-md flex items-center justify-center">
        <ChartRender v-if="chartConfig.datasetId" :chart-config="chartConfig" :data="data" />
        <n-empty v-else description="请先选择数据集" />
      </div>
      <div class="props-pane-container h-full border-l-solid border-gray-200 bg-white rounded-md flex-shrink-0">
        <!--  -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  --field-pane-width: 120px;
  --input-fields-width: 160px;
  --props-pane-width: 200px;

  margin-top: 4px;
  height: calc(100% - 40px - 4px);

  .field-pane-container {
    width: var(--field-pane-width);
  }

  .input-fields-container {
    width: var(--input-fields-width);
  }

  .field-pane {
    max-height: 50%;
  }

  .renderer-container {
    max-width: calc(100% - var(--field-pane-width) - var(--input-fields-width) - var(--props-pane-width));
    overflow: hidden;
  }

  .props-pane-container {
    width: var(--props-pane-width);
  }
}
</style>
