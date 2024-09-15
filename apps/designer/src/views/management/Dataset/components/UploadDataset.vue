<script setup lang="ts">
import type { Dataset } from '@/types/dataset';
import type { UploadFileInfo } from 'naive-ui';
import { createDataset } from '@/api';
import { ParseExcel, type RawData } from '@yss/dashboard-core';
import { useMessage } from 'naive-ui';
import { ref, toRaw, watch } from 'vue';
import { useDataPreview } from '../composables/useDataPreview';

const props = defineProps<{
  onChanged?: () => void
}>();

const fileList = ref<UploadFileInfo[]>([]);
const parse = new ParseExcel();
const message = useMessage();
const curDataset = reactive<Dataset>({
  name: '',
  fields: [],
  data: [],
});
const { tableProps } = useDataPreview(curDataset);

const showDrawer = computed(() => {
  return curDataset.name !== '';
});

watch(fileList, async () => {
  if (!fileList.value.length) {
    return;
  }

  const { name, file } = fileList.value[0];
  await parse.init(file as File);
  try {
    const fields = parse.getFieldsMate();
    const data = parse.getData<RawData>(undefined, { header: undefined });

    curDataset.name = name;
    curDataset.data = data;
    curDataset.fields = fields;
  }
  catch {
    message.error('解析失败');
    fileList.value = [];
  }
});

async function handleSaveDataset() {
  await createDataset(toRaw(curDataset));
  message.success('保存成功');
  props?.onChanged?.();
  clearCurDataset();
}

function clearCurDataset() {
  curDataset.name = '';
  curDataset.fields = [];
  curDataset.data = [];
  fileList.value.splice(0, 1);
}
</script>

<template>
  <NUpload v-model:file-list="fileList" accept=".xlsx,.xls" :show-file-list="false" :default-upload="true" :max="1">
    <NButton type="primary">
      +添加数据集
    </NButton>
  </NUpload>

  <NDrawer
    :show="showDrawer"
    default-width="100vw"
    placement="right"
    resizable
  >
    <NDrawerContent>
      <NSpace :vertical="true">
        <label class="flex items-center">
          <span class="shrink-0">数据集名称：</span>
          <NInput v-model:value="curDataset.name" />
        </label>
        <NCard>
          <template #header>
            数据集字段
            <span class="text-3">({{ curDataset.fields.length }}个字段)</span>
          </template>
          <NSpace>
            <NTag v-for="item in curDataset.fields" :key="item.name" type="success">
              {{ item.name }}
            </NTag>
          </NSpace>
        </NCard>

        <NCard>
          <template #header>
            数据预览
            <span class="text-3">({{ curDataset.data.length }}行数据)</span>
          </template>
          <NDataTable v-if="curDataset.fields.length" v-bind="tableProps" />
        </NCard>

        <div class="flex gap-2">
          <NButton type="primary" @click="handleSaveDataset">
            保存数据集
          </NButton>
          <NButton tertiary type="primary" @click="clearCurDataset">
            关闭
          </NButton>
        </div>
      </NSpace>
    </NDrawerContent>
  </NDrawer>
</template>
