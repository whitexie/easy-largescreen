import type { Component } from 'vue';
import { useLargeScreenDesigner } from '@/stores/designer';

const WIDGET_PANE_MAPPING: Record<string, Component> = {};
const reg = 'dataLargeScreenFields/(.+?)/Pane.vue';
const modules = import.meta.glob(`@/dataLargeScreenFields/*/Pane.vue`, { eager: true });

for (const path in modules) {
  const match = path.match(reg);
  const key = match ? match[1] : '';
  if (modules[path]) {
    WIDGET_PANE_MAPPING[key] = (modules[path] as any).default;
  }
}

export function useWidgetPane() {
  const designerStore = useLargeScreenDesigner();

  const widget = computed(() => {
    const id = designerStore.temporaryState.currentWidgetId;
    if (id === '' || !designerStore.widgetMap.has(id)) {
      return null;
    }
    const widget = designerStore.widgetMap.get(id);

    return widget;
  });

  const widgetPane = computed(() => {
    if (!widget.value) {
      return '';
    }
    const key = capitalizeFirstLetter(widget.value.component);
    return WIDGET_PANE_MAPPING[key];
  });

  return {
    widget,
    widgetPane,
    WIDGET_PANE_MAPPING,
  };
}

function capitalizeFirstLetter(str: string) {
  // 如果字符串为空，则直接返回
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
