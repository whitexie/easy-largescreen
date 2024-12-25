import { getPaneComponent } from '@/materials/base';
import { useLargeScreenDesigner } from '@/stores/designer';

export function useWidgetPane() {
  const designerStore = useLargeScreenDesigner();

  const widget = computed(() => {
    return designerStore.currentWidget;
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
