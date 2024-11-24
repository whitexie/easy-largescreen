import { getPaneComponent } from '@/materials/base';
import { useLargeScreenDesigner } from '@/stores/designer';

export function useWidgetPane() {
  const designerStore = useLargeScreenDesigner();

  const widget = computed(() => {
    const id = designerStore.currentWidgetId;
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
    const key = widget.value.component;
    return getPaneComponent(key);
  });

  return {
    widget,
    widgetPane,
  };
}
