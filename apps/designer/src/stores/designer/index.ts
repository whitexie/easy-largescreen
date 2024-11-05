import api from '@/api';
import { defineStore } from 'pinia';
import { useLargeScreenRender } from './composables/useLargeScreenRender';

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

function getDefaultState(): LargeScreenDesigner {
  return {
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
}

function getDefaultTemporaryState() {
  return {
    currentDatasetId: '',
    currentWidgetId: '',
    scale: 100,
    showDataset: true,
  };
}

export const useLargeScreenDesigner = defineStore('LargeScreenDesigner', () => {
  const { state, canvasRef, widgetMap, clearWidgets, getConfig, ...rest } = useLargeScreenRender();

  /** 临时的状态，仅在本地使用，数据不入库 */
  const temporaryState = reactive(getDefaultTemporaryState());

  const currentWidget = computed(() => {
    return widgetMap.get(temporaryState.currentWidgetId) || null;
  });

  async function saveLargeScreen() {
    const { data, error, msg } = await api.largescreen.create(getConfig());

    if (error) {
      window.$message.error(msg);
      return;
    }

    state.id = data.id;
    window.$message.success('保存成功');
  }

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

  async function resetStore() {
    Object.assign(state, getDefaultState());
    Object.assign(temporaryState, getDefaultTemporaryState());
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
    temporaryState,
    canvasRef,
    currentWidget,
    widgetMap,
    clearWidgets,
    getConfig,
    setCurrentWidget,
    handleBestFitScale,
    updateCurrentWidgetLocation,
    saveLargeScreen,
    resetStore,
    ...rest,
  };
});

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
