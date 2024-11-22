import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import type { Reactive } from 'vue';

export function useSelectWidgets(widgets: Reactive<DataLargeScreenField[]>) {
  const selectedWidgets = reactive<DataLargeScreenField[]>([]);
  const currentWidget = ref<DataLargeScreenField | null>(null);
  const selectedWidgetIdSet = reactive<Set<string>>(new Set());
  const currentWidgetId = computed(() => currentWidget.value?.id || '');

  function setCurrentWidget(widget: DataLargeScreenField | null, options?: { ctrlKey?: boolean, shiftKey?: boolean, metaKey?: boolean }) {
    currentWidget.value = widget;
    if (!widget) {
      selectedWidgets.forEach(removeSelectedWidget);
      return;
    }

    const isWidgetSelected = selectedWidgetIdSet.has(widget.id);

    if (options?.shiftKey && selectedWidgets.length > 0) {
      const _widgets = getRangeWidgets(widget, selectedWidgets, widgets);
      selectedWidgets.splice(0, selectedWidgets.length, ..._widgets);
    }
    else if (options?.ctrlKey || options?.metaKey) {
      if (isWidgetSelected) {
        removeSelectedWidget(widget);
        currentWidget.value = selectedWidgets.length > 0 ? selectedWidgets[selectedWidgets.length - 1] : null;
        return;
      }
      addSelectedWidget(widget);
    }
    else {
      selectedWidgets.forEach(removeSelectedWidget);
      if (isWidgetSelected) {
        currentWidget.value = null;
        return;
      }
      addSelectedWidget(widget);
    }
  }

  function addSelectedWidget(widget: DataLargeScreenField) {
    selectedWidgetIdSet.add(widget.id);
    selectedWidgets.push(widget);
  }

  function removeSelectedWidget(widget: DataLargeScreenField) {
    selectedWidgetIdSet.delete(widget.id);
    selectedWidgets.splice(selectedWidgets.indexOf(widget), 1);
  }

  function resetSelectedWidgets() {
    selectedWidgets.splice(0, selectedWidgets.length);
    selectedWidgetIdSet.clear();
    currentWidget.value = null;
  }

  function isSelectedWidget(widget: DataLargeScreenField) {
    return selectedWidgets.includes(widget);
  }

  return {
    selectedWidgets,
    currentWidget,
    currentWidgetId,
    selectedWidgetIdSet,
    setCurrentWidget,
    addSelectedWidget,
    removeSelectedWidget,
    resetSelectedWidgets,
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

  widgets.forEach((wgt, index) => {
    if (!selectedIds.includes(wgt.id)) {
      return;
    }
    minIndex = index < minIndex ? index : minIndex;
    maxIndex = index > maxIndex ? index : maxIndex;
  });

  return widgets.slice(minIndex, maxIndex + 1);
}
