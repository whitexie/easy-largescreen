<script lang="ts" setup>
import type { UploadCustomRequestOptions } from 'naive-ui';
import { useLargeScreenDesigner } from '@/stores/designer';
import { uploadFile } from '@/utils';

const designerStore = useLargeScreenDesigner();

async function customRequest(options: UploadCustomRequestOptions) {
  const { file } = options;
  if (file.file) {
    designerStore.state.pageConfig.background.image = await uploadFile(file.file);
  }
}

const fileList = computed(() => {
  const { image } = designerStore.state.pageConfig.background;

  return image ? [{ id: image, url: image, status: 'finished', thumbnailUrl: image }] : [];
});
</script>

<template>
  <div>
    <n-collapse :default-expanded-names="['pageSize', 'background']" class="mt-4">
      <n-collapse-item title="页面尺寸" name="pageSize">
        <n-space class="px-2">
          <n-input-number v-model:value="designerStore.state.pageConfig.width">
            <template #prefix>
              <div class="mr-2">
                宽度
              </div>
            </template>
          </n-input-number>
          <n-input-number v-model:value="designerStore.state.pageConfig.height">
            <template #prefix>
              <div class="mr-2">
                高度
              </div>
            </template>
          </n-input-number>
        </n-space>
      </n-collapse-item>
      <n-collapse-item title="背景" name="background">
        <div class="p-2 px-1 flex gap-1 items-center">
          <span class="shrink-0">颜色</span>
          <n-color-picker
            v-model:value="designerStore.state.pageConfig.background.color"
            size="small"
            :actions="['clear']"
          />
        </div>
        <div class="p-2 px-1 flex gap-1 items-center mt-2">
          <span class="shrink-0">图片</span>
          <n-upload
            :default-file-list="fileList"
            :custom-request="customRequest"
            :max="1"
            accept="image/jpg,image/jpeg,image/png"
            list-type="image-card"
          />
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style scoped>
</style>
