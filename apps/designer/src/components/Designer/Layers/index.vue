<script name="Layers" lang="ts" setup>
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import { useLargeScreenDesigner } from '@/stores/designer';
import { VueDraggable } from 'vue-draggable-plus';
import LayerItem from './LayerItem.vue';

const isExpand = ref(false);

const icon = computed(() => isExpand.value
  ? 'i-fluent:panel-right-expand-16-filled'
  : ['i-fluent:panel-right-contract-16-filled', 'm-auto'],
);

const layersClass = computed(() => isExpand.value ? ['w-200px'] : ['w-40px']);

const designerStore = useLargeScreenDesigner();

const widgets = computed({
  get() {
    return designerStore.widgets.map(item => item).reverse();
  },
  set(value) {
    designerStore.widgets.splice(0, designerStore.widgets.length, ...value.reverse());
  },
});

function handleClickLayerItem(data: { item: DataLargeScreenField, event: Event }) {
  const { item, event } = data;
  designerStore.setCurrentWidget(item, event as PointerEvent);
}
</script>

<template>
  <div class="layers  h-full bg-white w-200px overflow-hidden z-1001" :class="layersClass">
    <div
      :class="isExpand && 'px-2'"
      class="title flex items-center select-none justify-between h-40px border-b border-gray-200 border-b-solid"
    >
      <span v-show="isExpand" class="pl-3 whitespace-nowrap flex-1 text-center">页面图层</span>
      <div :class="icon" class="size-1.6em cursor-pointer shrink-0" @click="isExpand = !isExpand" />
    </div>
    <div>
      <VueDraggable v-model="widgets" group="people" :animation="200" item-key="id" handle=".cursor-move">
        <div v-for="item in widgets" :key="item.id">
          <LayerItem
            :item="item"
            :is-expand="isExpand"
            :is-selected="designerStore.isSelectedWidget(item)"
            @click="handleClickLayerItem"
          />
        </div>
      </VueDraggable>
    </div>
  </div>
</template>

<style lang="less" scoped>
.layers {
  --primary-color: #18a058;
  --primary-color-hover: #18a05810;
  transition: width 0.3s;
}

.layer-item {
  &.selected {
    color: var(--primary-color);
    background-color: var(--primary-color-hover);
  }
}
</style>
