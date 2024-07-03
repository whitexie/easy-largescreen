<script lang="ts" setup>
import { useLargeScreenDesigner } from '@/stores/designer';

defineProps<{ showDataset: boolean }>();
const designerStore = useLargeScreenDesigner();
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
        <!-- <n-input /> -->
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style scoped>
</style>
