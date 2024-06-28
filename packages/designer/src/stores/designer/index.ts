import { defineStore } from 'pinia';
import { generateRandomString } from '@yss/utils';
// import { useDraggable } from './useDraggable';
import type { DataLargeScreenField, MenuItem, Widget } from '@/types/dataLargeScreen';
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

  const { widgets, addWidget, removeWidget } = useWidgets();
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

  return { state, temporaryState, canvasRef, widgets, setCurrentWidget, addWidget, removeWidget };
});

export function useWidgets() {
  const widgets = reactive<DataLargeScreenField[]>([]);

  function addWidget(menuItem: MenuItem) {
    const id = generateRandomString(8, 'w');

    const menuConfig = getMenuConfig(menuItem.id);
    const props = getWidgetProps(menuItem.id);
    const { id: component, name } = menuItem;
    const { size = [300, 200] } = menuConfig;

    widgets.push({
      id,
      name,
      component,
      size,
      isLock: false,
      location: [0, 0],
      props: structuredClone(props),
      menuConfig,
      _el: null,
    });
  }

  function removeWidget(id: string) {
    widgets.splice(widgets.findIndex(item => item.id === id), 1);
  }

  return {
    widgets,
    addWidget,
    removeWidget,
  };
}
