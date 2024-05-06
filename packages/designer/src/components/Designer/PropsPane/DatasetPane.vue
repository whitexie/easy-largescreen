<script lang="ts" setup>
import type { Ref } from 'vue';
import type { Field } from '@yss/dashboard-core/data-set/types';
import FieldPane from './FieldPane.vue';
import { useLargeScreenDesigner } from '@/stores/designer';
import { getDatasetFields, getDatasetList } from '@/api';
import type { DatasetList } from '@/types/dataset';

const emits = defineEmits(['close']);

const designerStore = useLargeScreenDesigner();

const datasetId = computed({
  get() {
    return designerStore.temporaryState.currentDatsetId;
  },
  set(val) {
    designerStore.temporaryState.currentDatsetId = val;
  },
});

const { dimensionFields, metricFields } = useFields(datasetId);
const datasetList = reactive<DatasetList[]>([]);

async function initDatasetList() {
  const result = await getDatasetList();
  datasetList.push(...result);
}

const datasetListOptions = computed(() => {
  return datasetList.map((item) => {
    const { id: value, name: label } = item;

    return { value, label };
  });
});

function useFields(id: Ref<string>) {
  const fields = reactive<Field[]>([]);

  const dimensionFields = computed(() => {
    return fields.filter(item => item.type !== 'number');
  });
  const metricFields = computed(() => {
    return fields.filter(item => item.type === 'number');
  });

  watch(
    () => id.value,
    async (val) => {
      if (!val)
        return;

      const result = await getDatasetFields(val);
      if (result)
        fields.push(...result);
    },
    {
      immediate: true,
    },
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
