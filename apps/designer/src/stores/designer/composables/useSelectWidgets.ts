import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import type { Reactive } from 'vue';

export interface SelectWidgetOptions {
  ctrlKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
}

export function useSelectWidgets(widgets: Reactive<DataLargeScreenField[]>) {
  const selectedWidgets = reactive<DataLargeScreenField[]>([]);
  const currentWidget = ref<DataLargeScreenField | null>(null);
  const selectedWidgetIdSet = reactive<Set<string>>(new Set());
  const currentWidgetId = computed(() => currentWidget.value?.id || '');

  const selectionBounds = computed(() => {
    if (selectedWidgets.length < 1) {
      return null;
    }

    const { rect } = getRectRangeWidgets(
      null,
      selectedWidgets,
      { isOnlyFull: true },
    );
    return rect;
  });

  function setCurrentWidget(widget: DataLargeScreenField | null, options?: SelectWidgetOptions) {
    // 处理空输入
    if (!widget) {
      resetSelectedWidgets();
      return;
    }

    const isWidgetSelected = selectedWidgetIdSet.has(widget.id);
    const isMultiSelectKey = options?.ctrlKey || options?.metaKey;

    // 处理Shift多选
    if (options?.shiftKey && selectedWidgets.length > 0) {
      handleShiftSelect(widget);
      return;
    }

    // 处理Ctrl/Meta多选
    if (isMultiSelectKey) {
      handleMultiSelect(widget, isWidgetSelected);
      return;
    }

    // 处理普通选择
    handleSingleSelect(widget);
  }

  // 辅助函数：处理Shift多选
  function handleShiftSelect(widget: DataLargeScreenField) {
    const rangeWidgets = getRangeWidgets(widget, selectedWidgets, widgets);
    resetSelectedWidgets();
    rangeWidgets.forEach(addSelectedWidget);
    currentWidget.value = widget;
  }

  // 辅助函数：处理Ctrl/Meta多选
  function handleMultiSelect(widget: DataLargeScreenField, isSelected: boolean) {
    if (isSelected) {
      removeSelectedWidget(widget);
      currentWidget.value = selectedWidgets.length > 0
        ? selectedWidgets[selectedWidgets.length - 1]
        : null;
      return;
    }
    addSelectedWidget(widget);
  }

  // 辅助函数：处理普通选择
  function handleSingleSelect(widget: DataLargeScreenField) {
    resetSelectedWidgets();
    addSelectedWidget(widget);
  }

  function addSelectedWidget(widget: DataLargeScreenField) {
    selectedWidgetIdSet.add(widget.id);
    selectedWidgets.push(widget);
    currentWidget.value = widget;
  }

  function removeSelectedWidget(widget: DataLargeScreenField) {
    selectedWidgetIdSet.delete(widget.id);
    const index = selectedWidgets.findIndex(w => w.id === widget.id);
    if (index > -1) {
      selectedWidgets.splice(index, 1);
    }
  }

  function resetSelectedWidgets() {
    selectedWidgets.splice(0, selectedWidgets.length);
    selectedWidgetIdSet.clear();
    currentWidget.value = null;
  }

  function isSelectedWidget(widget: DataLargeScreenField) {
    return selectedWidgets.includes(widget);
  }

  function calculateSelectedWidgetsBounding(_rect: Rect) {
    const { selectedWidgets: _selectedWidgets } = getRectRangeWidgets(_rect, widgets);
    if (_selectedWidgets.length) {
      resetSelectedWidgets();
      _selectedWidgets.map(addSelectedWidget);
    }
  }

  function lockSelectedWidgets() {
    selectedWidgets.forEach(wgt => wgt.isLock = true);
  }

  function unlockSelectedWidgets() {
    selectedWidgets.forEach(wgt => wgt.isLock = false);
  }

  return {
    selectedWidgets,
    currentWidget,
    currentWidgetId,
    selectedWidgetIdSet,
    selectionBounds,
    setCurrentWidget,
    addSelectedWidget,
    removeSelectedWidget,
    resetSelectedWidgets,
    isSelectedWidget,
    calculateSelectedWidgetsBounding,
    lockSelectedWidgets,
    unlockSelectedWidgets,
  };
}

/**
 * 获取选中组件范围
 * @param widget 当前组件
 * @param selectedWidgets 已选中组件
 * @param widgets 所有组件
 * @returns 选中组件范围
 */
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

export interface Rect {
  x: number
  y: number
  width: number
  height: number
};

export interface WidgetRect {
  rect: Rect
  selectedWidgets: DataLargeScreenField[]
}

/**
 * 获取选中组件范围
 * @param selectedRect 选中区域
 * @param widgets 所有组件
 * @returns 选中组件范围
 */
export function getRectRangeWidgets(selectedRect: Rect | null, widgets: Reactive<DataLargeScreenField[]>, options?: { isOnlyFull?: boolean }): WidgetRect {
  if (widgets.length < 1) {
    return { rect: { x: 0, y: 0, width: 0, height: 0 }, selectedWidgets: [] };
  }

  const selectedWidgets: DataLargeScreenField[] = options?.isOnlyFull ? widgets : [];
  let fullSelectedBounding = structuredClone(selectedRect);
  if (!selectedRect) {
    const { location, size } = widgets[0];
    fullSelectedBounding = { ...location, ...size };
  }

  widgets.forEach((widget) => {
    const { location, size } = widget;
    const widgetBounding = { ...location, ...size };

    if (options?.isOnlyFull) {
      updateFullSelectedBounding(fullSelectedBounding!, widgetBounding);
      return;
    }

    // 判断是否相交
    if (isIntersectRect(selectedRect!, widgetBounding)) {
      selectedWidgets.push(widget);
      updateFullSelectedBounding(fullSelectedBounding!, widgetBounding);
    }
  });

  if (selectedWidgets.length === 0) {
    fullSelectedBounding = { x: 0, y: 0, width: 0, height: 0 };
  }

  return { rect: fullSelectedBounding!, selectedWidgets };
}

/**
 * 判断两个矩形是否相交
 * @param rect1 矩形1
 * @param rect2 矩形2
 * @returns 是否相交
 */
function isIntersectRect(rect1: Rect, rect2: Rect) {
  const { width: rect1Width, height: rect1Height } = rect1;
  const { width: rect2Width, height: rect2Height } = rect2;

  // 相交矩形的坐标、宽高
  const x = Math.max(rect1.x, rect2.x);
  const y = Math.max(rect1.y, rect2.y);
  const w = Math.min(rect1.x + rect1Width, rect2.x + rect2Width) - x;
  const h = Math.min(rect1.y + rect1Height, rect2.y + rect2Height) - y;

  return w >= 0 && h >= 0;
};

/**
 * 更新目标矩形最大边距
 */
function updateFullSelectedBounding(target: Rect, rect: Rect) {
  const { x, y, width, height } = rect; // 解构新的矩形边界
  // 计算全选边界的四个角点坐标
  const x1 = Math.min(target.x, x); // 左上角x坐标
  const y1 = Math.min(target.y, y); // 左上角y坐标
  const x2 = Math.max(target.x + target.width, x + width); // 右下角x坐标
  const y2 = Math.max(target.y + target.height, y + height); // 右下角y坐标

  // 更新全选边界的坐标和大小
  target.x = x1;
  target.y = y1;
  target.width = x2 - x1;
  target.height = y2 - y1;
};
