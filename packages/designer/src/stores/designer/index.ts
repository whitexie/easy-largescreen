import { defineStore } from 'pinia';
import { generateRandomString } from '@yss/utils';
import type { DataLargeScreenField, MenuItem } from '@/types/dataLargeScreen';
import { useMenus } from '@/components/Designer/Menus/useMenus';

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

  function setCurrentWidget(id: string) {
    temporaryState.currentWidgetId = id;
  }

  return { state, temporaryState, canvasRef, widgets, widgetMap, setCurrentWidget, addWidget, removeWidget };
});

export function useWidgets() {
  const widgets = reactive<DataLargeScreenField[]>([]);
  const widgetMap = reactive<Record<string, DataLargeScreenField>>({});

  function addWidget(menuItem: MenuItem): DataLargeScreenField {
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
