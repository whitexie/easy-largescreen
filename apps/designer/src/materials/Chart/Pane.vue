<script name="TextPane" lang="ts" setup>
import type { ChartRenderState } from '@/types/charts';
import type { MaterialProps } from '@/types/dataLargeScreen';
import { loadAsyncComponent } from '@/utils/component';
import { nextTick } from 'vue';

const props = defineProps<MaterialProps>();

const ChartDesigner = loadAsyncComponent(() => import('@/components/ChartDesigner/ChartDesigner.vue'));

const showDesigner = ref(false);

function handleSave(value: ChartRenderState) {
  // console.log(value);
  props.widget.props.chartConfig = {};
  nextTick(() => {
    props.widget.props.chartConfig = value;
  });
  showDesigner.value = false;
}
</script>

<template>
  <div>
    <n-collapse :default-expanded-names="['1', '2']" class="mt-4">
      <n-collapse-item title="图表配置" name="1">
        <div class="px-2">
          <n-button size="small" type="primary" @click="showDesigner = true">
            设计图表
          </n-button>
        </div>
      </n-collapse-item>
    </n-collapse>
    <n-drawer v-model:show="showDesigner" placement="bottom" height="95vh">
      <ChartDesigner :chart-config="props.widget.props.chartConfig" @save="handleSave" />
    </n-drawer>
  </div>
</template>

<style scoped>
</style>
