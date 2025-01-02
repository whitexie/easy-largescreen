import type { AddWidgetOption, MenuItem } from '@/types/dataLargeScreen';
import { getMenuConfig } from '@/materials/base/menus';
import { useLargeScreenDesigner } from '@/stores/designer';
import { createSharedComposable } from '@vueuse/core';

export function useMaterialDragAdd() {
  const isDraging = ref(false);
  const dragPlaceholderElement = ref<HTMLElement | null>(null);
  const placeholderElementSize = reactive({ width: 200, height: 50 });
  const designerStore = useLargeScreenDesigner();

  function startDrag(e: DragEvent, item: MenuItem) {
    const config = getMenuConfig(item.id);
    const { width = 100, height = 50 } = config.size;
    placeholderElementSize.width = width;
    placeholderElementSize.height = height;
    isDraging.value = true;
    // TODO: 设置物料拖拽到画布时的样式，后续使用图片，目前还没有这个字段
    e.dataTransfer?.setData('text/plain', JSON.stringify(item));
    if (dragPlaceholderElement?.value) {
      e.dataTransfer?.setDragImage(dragPlaceholderElement.value!, width / 2, height / 2);
    }
  }

  function dragDrop(e: DragEvent, canvasElement: HTMLDivElement) {
    if (!isDraging.value) {
      return;
    }
    const menuItem = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}') as MenuItem;
    if (!menuItem.id) {
      throw new Error('Invalid menu item data');
    }
    const widgetConfig = getMenuConfig(menuItem.id);

    const canvasRect = canvasElement.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const scale = designerStore.scale / 100;
    const width = widgetConfig.size.width / scale;
    const height = widgetConfig.size.height / scale;

    const option: AddWidgetOption = {
      location: {
        x: x / scale - width / 2,
        y: y / scale - height / 2,
      },
      size: { width, height },
    };

    const widget = designerStore.addWidget(menuItem, option);
    designerStore.setCurrentWidget(widget);
    isDraging.value = false;
  }

  function dragover(e: DragEvent) {
    if (isDraging.value) {
      e.preventDefault();
    }
  }

  return {
    isDraging,
    dragPlaceholderElement,
    placeholderElementSize,
    startDrag,
    dragover,
    dragDrop,
  };
}

export const useSharedMaterialDragAdd = createSharedComposable(useMaterialDragAdd);
