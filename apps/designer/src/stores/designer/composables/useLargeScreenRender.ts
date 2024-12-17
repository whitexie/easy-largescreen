import api from '@/api';
import { omit } from 'lodash-es';
import { useWidgets } from './useWidgets';

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

export interface CanvasBackgroundStyle {
  backgroundColor: string
  backgroundImage?: string
  backgroundSize?: string
}

export function useLargeScreenRender() {
  const state = reactive<LargeScreenDesigner>(getDefaultState());
  const canvasRef = ref<HTMLDivElement | null>(null);
  const { widgets, widgetMap, addWidget, removeWidget, clearWidgets, addWidgetById } = useWidgets();

  const canvasStyle = computed(() => {
    const { pageConfig: { width, height } } = state;
    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  });

  const canvasBackgroundStyle = computed(() => {
    const { pageConfig: { background: { color, image } } } = state;
    const style: CanvasBackgroundStyle = {
      backgroundColor: color,
    };
    if (image) {
      style.backgroundImage = `url(${image})`;
      style.backgroundSize = 'cover';
    }
    return style;
  });

  function getConfig(): API.SaveLargescreenDto {
    const { id, ...rest } = state;
    const config = {
      ...rest,
      widgets: widgets.map((item) => {
        return omit(item, ['menuConfig', '_el', 'isLock']);
      }),
    };

    return id ? { ...config, id } : config;
  }

  function __assignState(data: Partial<API.LargeScreenDetailDto>) {
    if (data.id) {
      state.id = data.id;
    }
    if (data.name) {
      state.name = data.name;
    }
    if (data.pageConfig) {
      state.pageConfig = data.pageConfig;
    }
    if (data.widgets) {
      data.widgets.forEach((item) => {
        addWidgetById(item.component, item);
      });
    }
  }

  async function initConfigById(id: string) {
    const { error, data } = await api.largescreen.detail({ id });
    if (error) {
      return;
    }

    __assignState(data);
  }

  async function initConfig(option: string | Partial<API.LargeScreenDetailDto>) {
    if (typeof option === 'string') {
      await initConfigById(option);
    }
    else {
      __assignState(option);
    }
  }

  return {
    state,
    canvasRef,
    widgets,
    widgetMap,
    canvasStyle,
    canvasBackgroundStyle,
    getConfig,
    initConfig,
    addWidget,
    removeWidget,
    clearWidgets,
    addWidgetById,
  };
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
