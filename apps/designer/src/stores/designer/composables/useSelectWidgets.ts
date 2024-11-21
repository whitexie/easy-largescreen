import type { DataLargeScreenField } from '@/types/dataLargeScreen';

export function useSelectWidgets() {
  const selectedWidget = reactive<DataLargeScreenField[]>([]);

  const currentWidget = computed(() => {
    return selectedWidget.length > 0 ? selectedWidget[selectedWidget.length - 1] : null;
  });

  const currentWidgetId = computed(() => {
    return currentWidget.value?.id || '';
  });

  function setCurrentWidget(widget: DataLargeScreenField | null) {
    selectedWidget.splice(0, selectedWidget.length);
    if (widget) {
      selectedWidget.push(widget);
    }
  }

  function addSelectedWidget(widget: DataLargeScreenField) {
    selectedWidget.push(widget);
  }

  function removeSelectedWidget(widget: DataLargeScreenField) {
    selectedWidget.splice(selectedWidget.indexOf(widget), 1);
  }

  function clearSelectedWidgets() {
    selectedWidget.splice(0, selectedWidget.length);
  }

  return {
    selectedWidget,
    currentWidget,
    currentWidgetId,
    setCurrentWidget,
    addSelectedWidget,
    removeSelectedWidget,
    clearSelectedWidgets,
  };
}
