<script lang="ts" setup name="Dataset">
import api from '@/api';
import UploadDataset from './components/UploadDataset.vue';

const { datasetList, updateDatasetList, removeDataset } = useDatasetList();

function useDatasetList() {
  const datasetList = reactive<API.Dataset[]>([]);

  async function updateDatasetList() {
    datasetList.splice(0, datasetList.length);
    const result = await api.dataset.getDatasetList();

    if (result.error === 0) {
      datasetList.push(...result.data);
    }
  }

  async function handleRemoveDataset(id: string) {
    if (id) {
      // TODO remove dataset
      // await deleteDataset(id);
    }
    await updateDatasetList();
  }

  onMounted(async () => {
    await updateDatasetList();
  });

  return {
    datasetList,
    updateDatasetList,
    removeDataset: handleRemoveDataset,
  };
}
</script>

<template>
  <div w-full h-full p-1>
    <!--  -->
    <UploadDataset :on-changed="updateDatasetList" />
    <div class="grid card-list mt-3 gap-4 p-2 font-size-4">
      <div
        v-for="dataset in datasetList"
        :key="dataset.id"
        class="rounded-lg bg-gray-100 p-3 relative flex flex-col gap-2 h-20"
      >
        <div>
          <span>名称：</span>
          <NEllipsis style="max-width: 160px">
            {{ dataset.name }}
          </NEllipsis>
        </div>
        <!--        <div> -->
        <!--          <span>字段数：</span> -->
        <!--          <span>{{ dataset.fields.length }}</span> -->
        <!--        </div> -->

        <div class="icons absolute right-3 top-3 flex flex-col gap-2 font-size-1.2em">
          <NPopconfirm
            @positive-click="removeDataset(dataset.id)"
          >
            <template #trigger>
              <div class="i-f7:delete-left color-red cursor-pointer " />
            </template>
            删除后数据将无法恢复！
          </NPopconfirm>
          <div class="i-lucide:edit cursor-pointer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-list {
  grid-template-columns: repeat(auto-fill, 300px);
}
</style>
