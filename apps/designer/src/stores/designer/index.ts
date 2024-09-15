import type { AddWidgetOption, DataLargeScreenField, MenuItem } from '@/types/dataLargeScreen';
import { useMenus } from '@/components/Designer/Menus/useMenus';
import { generateRandomString } from '@yss/utils';
import { defineStore } from 'pinia';

const { getMenuConfig, getWidgetProps } = useMenus();

interface PageConfig {
  background: {
    color: string
    image: string
  }
  width: number
  height: number
}

interface LargeScreenDesigner {
  id: string
  name: string
  pageConfig: PageConfig
  useDatsetIds: string[]
}

export const useLargeScreenDesigner = defineStore('LargeScreenDesigner', () => {
  const state = reactive<LargeScreenDesigner>({
    id: '',
    name: '',
    pageConfig: {
      background: {
        color: '',
        image: '',
      },
      width: 1920,
      height: 1080,
    },
    useDatsetIds: [],
  });

  const canvasRef = ref<HTMLDivElement | null>(null);

  const { widgets, widgetMap, addWidget, removeWidget } = useWidgets();
  // const { setPosition, position, handleMouseDown } = useDraggable();

  /**
   * 临时的状态，仅在设计器中使用
   */
  const temporaryState = reactive({
    currentDatsetId: '',
    currentWidgetId: '',
    scale: 100,
    showDataset: true,
  });

  const currentWidget = computed(() => {
    if (temporaryState.currentWidgetId) {
      return widgetMap[temporaryState.currentWidgetId];
    }
    return null;
  });

  function setCurrentWidget(id: string) {
    temporaryState.currentWidgetId = id;
  }

  function handleBestFitScale() {
    if (!canvasRef.value) {
      return;
    }

    const margin = 30;
    const containerElement = canvasRef.value.parentElement as HTMLElement;
    const canvasElement = canvasRef.value;
    temporaryState.scale = calculateBestFitScale(containerElement, canvasElement, margin);
    const { offsetHeight } = canvasElement;
    const { offsetHeight: containerHeight } = containerElement;
    const y = (containerHeight - offsetHeight * temporaryState.scale / 100) / 2;

    return { x: margin, y };
  }

  function updateCurrentWidgetLocation({ x, y }: { x: number, y: number }) {
    if (!currentWidget.value) {
      return;
    }
    currentWidget.value.location[0] = x;
    currentWidget.value.location[1] = y;
  }

  return { state, temporaryState, canvasRef, widgets, widgetMap, currentWidget, setCurrentWidget, addWidget, removeWidget, handleBestFitScale, updateCurrentWidgetLocation };
});

export function useWidgets() {
  const widgets = reactive<DataLargeScreenField[]>([]);
  const widgetMap = reactive<Record<string, DataLargeScreenField>>({});

  function addWidget(menuItem: MenuItem, options?: AddWidgetOption): DataLargeScreenField {
    const id = generateRandomString(8, 'w');

    const menuConfig = getMenuConfig(menuItem.id);
    const props = getWidgetProps(menuItem.id);
    const { id: component, name } = menuItem;
    const { size = [300, 200] } = menuConfig;

    const widget: DataLargeScreenField = {
      id,
      name,
      component,
      size,
      isLock: false,
      location: [0, 0],
      props: structuredClone(props),
      menuConfig,
      _el: null,
      ...options,
    };

    widgets.push(widget);

    widgetMap[id] = widget;

    return widget;
  }

  function removeWidget(id: string) {
    delete widgetMap[id];
    widgets.splice(widgets.findIndex(item => item.id === id), 1);
  }

  return {
    widgets,
    widgetMap,
    addWidget,
    removeWidget,
  };
}
function calculateBestFitScale(containerElement: HTMLElement, canvasElement: HTMLElement, margin: number = 0) {
  // 获取容器和画布的宽度和高度
  const containerWidth = containerElement.offsetWidth;
  const containerHeight = containerElement.offsetHeight;
  const canvasWidth = canvasElement.offsetWidth;
  const canvasHeight = canvasElement.offsetHeight;

  // 计算容器和画布的宽度和高度比例
  const widthScale = (containerWidth - margin * 2) / canvasWidth;
  const heightScale = (containerHeight - margin * 2) / canvasHeight;

  return Math.round(Math.min(widthScale, heightScale) * 100);
}
