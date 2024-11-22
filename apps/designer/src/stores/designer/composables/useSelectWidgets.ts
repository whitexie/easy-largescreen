import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import type { Reactive } from 'vue';

export function useSelectWidgets(widgets: Reactive<DataLargeScreenField[]>) {
  const selectedWidget = reactive<DataLargeScreenField[]>([]);

  const currentWidget = computed(() => {
    return selectedWidget.length > 0 ? selectedWidget[selectedWidget.length - 1] : null;
  });

  const currentWidgetId = computed(() => {
    return currentWidget.value?.id || '';
  });

  function setCurrentWidget(widget: DataLargeScreenField | null, options?: { ctrlKey?: boolean, shiftKey?: boolean }) {
    if (!widget) {
      selectedWidget.splice(0, selectedWidget.length);
      return;
    }

    if (options?.shiftKey && selectedWidget.length > 0) {
      const _widgets = getRangeWidgets(widget, selectedWidget, widgets);
      selectedWidget.splice(0, selectedWidget.length, ..._widgets);
    }
    else if (options?.ctrlKey) {
      addSelectedWidget(widget);
    }
    else {
      selectedWidget.splice(0, selectedWidget.length, widget);
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

  function isSelectedWidget(widget: DataLargeScreenField) {
    return selectedWidget.includes(widget);
  }

  return {
    selectedWidget,
    currentWidget,
    currentWidgetId,
    setCurrentWidget,
    addSelectedWidget,
    removeSelectedWidget,
    clearSelectedWidgets,
    isSelectedWidget,
  };
}

function getRangeWidgets(widget: DataLargeScreenField, selectedWidgets: Reactive<DataLargeScreenField[]>, widgets: Reactive<DataLargeScreenField[]>): DataLargeScreenField[] {
  const selectedIds = selectedWidgets.concat(widget).map(item => item.id);
  let minIndex = widgets.length;
  let maxIndex = 0;

  if (widgets.length < 1) {
    return [];
  }

  // 如果已选中的个数只有1个并且是widgets中的第一个，则只需找到widget的下标，无需再遍历widgets
  if (selectedWidgets.length === 1 && widgets[0].id === selectedWidgets[0].id) {
    maxIndex = widgets.findIndex(item => item.id === widget.id);
    return widgets.slice(0, maxIndex + 1);
  }

  widgets.forEach((wgt, index) => {
    if (!selectedIds.includes(wgt.id)) {
      return;
    }
    minIndex = index < minIndex ? index : minIndex;
    maxIndex = index > maxIndex ? index : maxIndex;
  });
  const r = widgets.slice(minIndex, maxIndex + 1);
  return r;
}
