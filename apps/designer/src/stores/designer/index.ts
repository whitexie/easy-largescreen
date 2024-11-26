import api from '@/api';
import { calculateBestFitScale } from '@/utils';
import { useBoxSelection } from '@/views/management/DataLargeScreen/composables/useBoxSelection';
import { defineStore } from 'pinia';
import { useLargeScreenRender } from './composables/useLargeScreenRender';
import { useSelectWidgets } from './composables/useSelectWidgets';

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
  useDatasetIds: string[]
}

const DEFAULT_STATE: LargeScreenDesigner = {
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
  useDatasetIds: [],
};

export const useLargeScreenDesigner = defineStore('LargeScreenDesigner', () => {
  const { state, canvasRef, widgetMap, clearWidgets, getConfig, ...rest } = useLargeScreenRender();

  /** 临时的状态，仅在本地使用，数据不入库 */
  const canvasContainerRef = ref<HTMLDivElement | null>(null);
  const { currentWidgetId, currentWidget, setCurrentWidget, resetSelectedWidgets, ...SelectWidgetRest } = useSelectWidgets(rest.widgets);
  const boxSelection = useBoxSelection(canvasContainerRef);

  const currentDatasetId = ref('');
  const scale = ref(100);

  async function saveLargeScreen() {
    const { data, error, msg } = await api.largescreen.create(getConfig());

    if (error) {
      window.$message.error(msg);
      return;
    }

    state.id = data.id;
    window.$message.success('保存成功');
  }

  function handleBestFitScale() {
    if (!canvasRef.value) {
      return;
    }

    const margin = 30;
    const containerElement = canvasRef.value.parentElement as HTMLElement;
    const canvasElement = canvasRef.value;
    scale.value = calculateBestFitScale(containerElement, canvasElement, margin);
    const { offsetHeight } = canvasElement;
    const { offsetHeight: containerHeight } = containerElement;
    const y = (containerHeight - offsetHeight * scale.value / 100) / 2;

    return { x: margin, y };
  }

  async function $reset() {
    resetSelectedWidgets();
    Object.assign(state, structuredClone(DEFAULT_STATE));
    scale.value = 100;
    currentDatasetId.value = '';
    clearWidgets();
  }

  function updateCurrentWidgetLocation({ x, y }: { x: number, y: number }) {
    if (!currentWidget.value) {
      return;
    }
    currentWidget.value.location.x = x;
    currentWidget.value.location.y = y;
  }

  return {
    state,
    canvasRef,
    currentWidget,
    widgetMap,
    scale,
    currentWidgetId,
    currentDatasetId,
    canvasContainerRef,
    clearWidgets,
    getConfig,
    setCurrentWidget,
    handleBestFitScale,
    updateCurrentWidgetLocation,
    saveLargeScreen,
    $reset,
    ...rest,
    ...SelectWidgetRest,
    ...boxSelection,
  };
});
