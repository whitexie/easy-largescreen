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

export function useLargeScreenRender() {
  const state = reactive<LargeScreenDesigner>(getDefaultState());
  const canvasRef = ref<HTMLDivElement | null>(null);
  const { widgets, widgetMap, addWidget, removeWidget, clearWidgets, addWidgetById } = useWidgets();

  const canvasStyle = computed(() => {
    const { pageConfig: { width, height } } = state;
    return {
      width: `${width}px`,
      height: `${height}px`,
      // backgroundColor: color,
      // backgroundImage: image,
      // backgroundSize: 'cover',
    };
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

  async function initConfig(id: string) {
    const { error, data } = await api.largescreen.detail({ id });
    if (error) {
      return;
    }
    state.id = data.id;
    state.name = data.name;
    state.pageConfig = data.pageConfig;
    data.widgets.forEach((item) => {
      addWidgetById(item.component, item);
    });
  }

  return {
    state,
    canvasRef,
    widgets,
    widgetMap,
    canvasStyle,
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
