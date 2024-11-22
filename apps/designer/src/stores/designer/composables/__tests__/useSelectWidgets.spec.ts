import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import { describe, expect, it } from 'vitest';
import { useSelectWidgets } from '../useSelectWidgets';
import { useWidgets } from '../useWidgets';
import '@/materials/index';

describe('useSelectWidgets', () => {
  describe('setCurrentWidget', () => {
    it('当widget参数为空时应清空选中组件列表', () => {
      const { setCurrentWidget, selectedWidget } = useSelectWidgets([]);
      setCurrentWidget(null);
      expect(selectedWidget.length).toBe(0);
    });

    it('当选中单个组件时应只包含该组件且设置为当前组件', () => {
      const { addWidgetById, widgets } = useWidgets();
      const { setCurrentWidget, selectedWidget, currentWidgetId } = useSelectWidgets(widgets);

      const widget: DataLargeScreenField = addWidgetById('text', { id: '1' });
      setCurrentWidget(widget);
      expect(selectedWidget.length).toBe(1);
      expect(currentWidgetId.value).toBe(widget.id);
    });

    it('按住Ctrl键选择第二个组件时应同时选中两个组件', () => {
      const { widgets, addWidgetById } = useWidgets();
      const { setCurrentWidget, selectedWidget, currentWidgetId } = useSelectWidgets(widgets);

      const widget1: DataLargeScreenField = addWidgetById('text', { id: '1' });
      const widget2: DataLargeScreenField = addWidgetById('text', { id: '2' });
      setCurrentWidget(widget1);
      setCurrentWidget(widget2, { ctrlKey: true });
      expect(selectedWidget.length).toBe(2);
      expect(currentWidgetId.value).toBe(widget2.id);
    });

    it('按住Shift键选择第三个组件时应该选中中间所有组件', () => {
      const { widgets, addWidgetById } = useWidgets();
      const { setCurrentWidget, selectedWidget, currentWidgetId } = useSelectWidgets(widgets);

      const widget1: DataLargeScreenField = addWidgetById('text', { id: '1' });
      addWidgetById('text', { id: '2' });
      const widget3: DataLargeScreenField = addWidgetById('text', { id: '3' });
      setCurrentWidget(widget1);
      setCurrentWidget(widget3, { shiftKey: true });

      expect(selectedWidget.length).toBe(3);
      expect(currentWidgetId.value).toBe(widget3.id);
    });
  });
});
