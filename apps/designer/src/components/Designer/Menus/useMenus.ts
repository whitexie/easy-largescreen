import type { MenuBaseConfig, MenuItem, WidgetModule } from '@/types/dataLargeScreen';

const WIDGET_PROPS_MAPPING: Record<string, any> = {};
const MENU_CONFIG_MAPPING: Record<string, MenuBaseConfig> = {};
const modules = import.meta.glob('@/dataLargeScreenFields/*/config.ts', { eager: true });

for (const key in modules) {
  const name = getWidgetName(key);
  const module = modules[key] as WidgetModule;
  const { Props, MenuConfig } = module;
  MENU_CONFIG_MAPPING[name] = MenuConfig;
  WIDGET_PROPS_MAPPING[name] = Props;
}

const MENUS = reactive<MenuItem[]>([
  {
    id: 'text',
    name: '文本',
    type: 'field',
    icon: 'fluent:draw-text-24-regular',
  },
  {
    id: 'chart',
    name: '图表',
    type: 'field',
    icon: 'solar:chart-bold',
    // children: [
    //   {
    //     id: 'bar',
    //     name: '柱状图',
    //     type: 'field',
    //     icon: 'solar:chart-bold',
    //   },
    //   {
    //     id: 'line',
    //     name: '折线图',
    //     type: 'field',
    //     icon: 'carbon:chart-line',
    //   },
    //   {
    //     id: 'pie',
    //     name: '饼图',
    //     type: 'field',
    //     icon: 'carbon:chart-pie',
    //   },
    // ],
  },
  {
    id: 'image',
    name: '图片',
    type: 'field',
    icon: 'lucide:image',
  },
]);

export function useMenus() {
  function getWidgetProps(id: keyof typeof WIDGET_PROPS_MAPPING) {
    return WIDGET_PROPS_MAPPING[id];
  }

  function getMenuConfig(id: keyof typeof MENU_CONFIG_MAPPING) {
    return structuredClone(MENU_CONFIG_MAPPING[id]) || {};
  }

  return {
    MENUS,
    getWidgetProps,
    getMenuConfig,
  };
}

function getWidgetName(path: string) {
  const regex = /\/([^/]+)\/config\.ts$/;
  const matches = path.match(regex);
  if (!matches) {
    return '';
  }

  return matches[1].toLowerCase();
}
