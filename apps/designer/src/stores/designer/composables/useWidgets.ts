import type { AddWidgetOption, DataLargeScreenField, MenuItem } from '@/types/dataLargeScreen';
import { getMenuConfig, getWidgetProps } from '@/materials/base/menus';

import { generateRandomString } from '@yss/utils';
import { merge } from 'lodash-es';

export function useWidgets() {
  const widgets = reactive<DataLargeScreenField[]>([]);
  const widgetMap = reactive(new Map<string, DataLargeScreenField>());

  function addWidget(menuItem: MenuItem, options?: AddWidgetOption): DataLargeScreenField {
    return addWidgetById(menuItem.id, options);
  }

  function addWidgetById(component: string, options?: AddWidgetOption) {
    const id = generateRandomString(8, 'w');
    const menuConfig = getMenuConfig(component);
    const props = getWidgetProps(component);
    const { name } = menuConfig;
    const { size = { width: 300, height: 200 } } = menuConfig;

    const widget: DataLargeScreenField = {
      id,
      name,
      component,
      size,
      isLock: false,
      location: { x: 0, y: 0 },
      props: merge(props, options?.props),
      menuConfig,
      _el: null,
      ...options,
    };

    widgets.push(widget);
    widgetMap.set(widget.id, widget);

    return widget;
  }

  function removeWidget(id: string) {
    widgetMap.delete(id);
    widgets.splice(widgets.findIndex(item => item.id === id), 1);
  }

  function clearWidgets() {
    widgets.splice(0, widgets.length);
    widgetMap.clear();
  }

  return {
    widgets,
    widgetMap,
    addWidget,
    removeWidget,
    clearWidgets,
    addWidgetById,
  };
}
