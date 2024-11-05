<script lang="ts" setup>
import type { OriginalField } from '@/types/charts';
import type { Ref } from 'vue';
import api from '@/api';
import { useLargeScreenDesigner } from '@/stores/designer';
import FieldPane from './FieldPane.vue';

const emits = defineEmits(['close']);

const designerStore = useLargeScreenDesigner();

const datasetId = computed({
  get() {
    return designerStore.temporaryState.currentDatasetId;
  },
  set(val) {
    designerStore.temporaryState.currentDatasetId = val;
  },
});

const { dimensionFields, metricFields } = useFields(datasetId);
const datasetList = reactive<API.Dataset[]>([]);

async function initDatasetList() {
  const result = await api.dataset.getDatasetList();
  datasetList.push(...result.data);
}

const datasetListOptions = computed(() => {
  return datasetList.map((item) => {
    const { id: value, name: label } = item;

    return { value, label };
  });
});

function useFields(id: Ref<string>) {
  const fields = reactive<OriginalField[]>([]);

  const dimensionFields = computed(() => {
    return fields.filter(item => item.valueType !== 'number');
  });
  const metricFields = computed(() => {
    return fields.filter(item => item.valueType === 'number');
  });

  watch(
    () => id.value,
    async (val) => {
      if (!val) {
        return;
      }

      const result = await api.dataset.getFieldsByDatasetId({ datasetId: val });
      if (result.error === 0) {
        fields.splice(0, fields.length);
        fields.push(...result.data);
      }
    },
    { immediate: true },
  );

  return {
    dimensionFields,
    metricFields,
  };
}

function handleClick() {
  emits('close');
}

onMounted(async () => {
  await initDatasetList();
});
</script>

<template>
  <div class="bg-white w-200px border-l-solid border-#f2f2f2">
    <div class="flex items-center select-none justify-between h-36px border-b-solid border-#f2f2f2 w-full px-2">
      <div class="i-majesticons:menu-expand-right-line size-1.5em cursor-pointer" @click="handleClick" />
      <span>
        数据集
      </span>
      <span class="size-1.5em" />
    </div>
    <div class="h-calc[100%-36px]">
      <div class="flex items-center p-2 px-1 gap-1">
        <!-- <div class="i-uil:plus size-1.3em shrink-0" /> -->
        <n-select v-model:value="datasetId" class="" size="small" :options="datasetListOptions" />
      </div>
      <n-split direction="vertical" class="border-t-solid border-#f2f2f2 h-calc[100%-44px]">
        <template #1>
          <FieldPane type="dimension" title="维度" :fields="dimensionFields" />
        </template>
        <template #2>
          <FieldPane type="metric" title="度量" :fields="metricFields" />
        </template>
      </n-split>
    </div>
  </div>
</template>

<style scoped>
</style>
