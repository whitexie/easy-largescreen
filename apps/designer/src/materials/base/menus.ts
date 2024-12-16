import type { MenuBaseConfig, MenuItem } from '@/types/dataLargeScreen';
import { getMaterial } from '@/materials/base';
import { pick } from 'lodash-es';

export const MENUS = reactive<MenuItem[]>([
  {
    id: 'text',
    name: '文本',
    type: 'field',
    icon: 'i-fluent:draw-text-24-regular',
  },
  {
    id: 'chart',
    name: '图表',
    type: 'field',
    icon: 'i-solar:chart-bold',
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
    icon: 'i-lucide:image',
  },
]);

export function getMenuConfig(id: string): MenuBaseConfig {
  const material = getMaterial(id);
  if (material) {
    return structuredClone(pick(material, ['id', 'name', 'icon', 'size']));
  }

  throw new Error(`Widget ${id} not found`);
}

export function getWidgetProps(id: string) {
  const material = getMaterial(id);
  if (material) {
    return structuredClone(material.props);
  }

  throw new Error(`Widget ${id} not found`);
}

export function useMenus() {
  return {
    MENUS,
    getWidgetProps,
    getMenuConfig,
  };
}
