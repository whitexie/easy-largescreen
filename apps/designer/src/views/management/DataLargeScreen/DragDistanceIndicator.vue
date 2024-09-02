<script lang="ts" setup>
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import { useLargeScreenDesigner } from '@/stores/designer';

interface Props {
  isDragging: boolean
  widget: DataLargeScreenField | null
}

const props = withDefaults(defineProps<Props>(), {
  isDragging: false,
});

const designerStore = useLargeScreenDesigner();
const widgetMargins = reactive({ top: 0, left: 0, right: 0, bottom: 0, horizontalLength: 0, verticalLength: 0 });

function calculateMargins() {
  const { widget } = props;

  if (!widget) {
    return;
  }
  const [widgetX, widgetY] = widget.location;
  const [widgetW, widgetH] = widget.size;
  const left = widgetX + widgetW / 2;
  const top = widgetY + widgetH / 2;
  const right = designerStore.state.pageConfig.width - widgetX - widgetW / 2;
  const bottom = designerStore.state.pageConfig.height - widgetY - widgetH / 2;

  widgetMargins.left = left;
  widgetMargins.top = top;
  widgetMargins.right = right;
  widgetMargins.bottom = bottom;
  widgetMargins.verticalLength = (left > right ? right : left) - widgetW / 2;
  widgetMargins.horizontalLength = (top > bottom ? bottom : top) - widgetH / 2;
}

const horizontalStyle = computed(() => {
  const topOrBottom = widgetMargins.top > widgetMargins.bottom ? 'bottom' : 'top';

  return {
    [topOrBottom]: `0px`,
    left: `${widgetMargins.left}px`,
    height: `${widgetMargins.horizontalLength}px`,
  };
});

const verticalStyle = computed(() => {
  const leftOrRight = widgetMargins.left > widgetMargins.right ? 'right' : 'left';

  return {
    [leftOrRight]: `0px`,
    top: `${widgetMargins.top}px`,
    width: `${widgetMargins.verticalLength}px`,
  };
});

const horizontalVisible = computed(() => props.isDragging && widgetMargins.horizontalLength > 0);
const verticalVisible = computed(() => props.isDragging && widgetMargins.verticalLength > 0);

watch(
  () => props.widget?.location,
  () => calculateMargins(),
  { deep: true },
);
</script>

<template>
  <div v-show="horizontalVisible" class="auxiliary-line absolute z-10 horizontal w-5px" :style="horizontalStyle">
    <span class="distance-text inline-block absolute left-10px text-xs translate-y--100% top-50% px-1 text-white">{{ widgetMargins.horizontalLength }}</span>
  </div>
  <div v-show="verticalVisible" class="auxiliary-line absolute z-10 vertical h-5px" :style="verticalStyle">
    <span class="distance-text inline-block absolute top-10px text-xs translate-x--100% left-50% px-1 text-white">{{ widgetMargins.verticalLength }}</span>
  </div>
</template>

<style lang="less" scoped>
.auxiliary-line {
  --line-color: #18a058;
  --line-width: 5px;
  --dashed-line-length: 10px;
  --direction: bottom;
  background: linear-gradient(
    to var(--direction),
    var(--line-color),
    var(--line-color) var(--dashed-line-length),
    transparent var(--dashed-line-length),
    transparent
  );

  &.horizontal {
    --direction: bottom;
    background-size: 100% calc(var(--dashed-line-length) * 2);
  }

  &.vertical {
    --direction: right;
    background-size: calc(var(--dashed-line-length) * 2) 100%;
  }

  .distance-text {
    background-color: var(--line-color);
  }
}
</style>
