import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import { describe, expect, it } from 'vitest';
import { useSelectWidgets } from '../useSelectWidgets';
import { useWidgets } from '../useWidgets';
import '@/materials/index';

describe('useSelectWidgets', () => {
  describe('setCurrentWidget', () => {
    it('当widget参数为null时应清空选中组件列表', () => {
      const { setCurrentWidget, selectedWidgets } = useSelectWidgets([]);
      setCurrentWidget(null);
      expect(selectedWidgets).toHaveLength(0);
    });

    it('当选中1个组件时应只包含该组件', () => {
      const { addWidgetById, widgets } = useWidgets();
      const { setCurrentWidget, selectedWidgets, currentWidgetId } = useSelectWidgets(widgets);
      const widget: DataLargeScreenField = addWidgetById('text', { id: '1' });

      setCurrentWidget(widget);

      expect(selectedWidgets).toHaveLength(1);
      expect(currentWidgetId.value).toBe(widget.id);
    });

    it('当对1个组件连续选中2次时，取消选中状态', () => {
      const { addWidgetById, widgets } = useWidgets();
      const { setCurrentWidget, selectedWidgets, currentWidgetId } = useSelectWidgets(widgets);
      const widget: DataLargeScreenField = addWidgetById('text', { id: '1' });

      setCurrentWidget(widget);
      setCurrentWidget(widget);

      expect(selectedWidgets).toHaveLength(0);
      expect(currentWidgetId.value).toBe('');
    });

    it('依次选中3个组件, 结果应为选中最后一个组件', () => {
      const { widgets, addWidgetById } = useWidgets();
      const { setCurrentWidget, selectedWidgets, currentWidgetId } = useSelectWidgets(widgets);
      const [widget1, widget2, widget3] = ['1', '2', '3'].map(id => addWidgetById('text', { id }));

      setCurrentWidget(widget1);
      setCurrentWidget(widget2);
      setCurrentWidget(widget3);

      expect(selectedWidgets).toHaveLength(1);
      expect(currentWidgetId.value).toBe(widget3.id);
    });

    describe.each([
      { name: 'Ctrl', options: { ctrlKey: true } },
      { name: 'Meta', options: { metaKey: true } },
    ])('按住$name键下的场景', ({ options }) => {
      it('选中第二个组件时应同时选中两个组件', () => {
        const { widgets, addWidgetById } = useWidgets();
        const { setCurrentWidget, selectedWidgets, currentWidgetId } = useSelectWidgets(widgets);

        const [widget1, widget2] = ['1', '2'].map(id => addWidgetById('text', { id }));

        setCurrentWidget(widget1);
        setCurrentWidget(widget2, options);
        expect(selectedWidgets).toHaveLength(2);
        expect(currentWidgetId.value).toBe(widget2.id);
      });

      it('对一个组件选中两次时，取消该组件选中状态', () => {
        const { widgets, addWidgetById } = useWidgets();
        const { setCurrentWidget, selectedWidgets, currentWidgetId } = useSelectWidgets(widgets);
        const [widget1, widget2] = ['1', '2'].map(id => addWidgetById('text', { id }));

        setCurrentWidget(widget1);
        setCurrentWidget(widget2, options);
        setCurrentWidget(widget2, options);

        expect(selectedWidgets).toHaveLength(1);
        expect(currentWidgetId.value).toBe(widget1.id);
      });
    });

    it('按住Shift键选择第三个组件时应该选中中间所有组件', () => {
      const { widgets, addWidgetById } = useWidgets();
      const { setCurrentWidget, selectedWidgets, currentWidgetId } = useSelectWidgets(widgets);
      const [widget1,, widget3] = ['1', '2', '3'].map(id => addWidgetById('text', { id }));

      setCurrentWidget(widget1);
      setCurrentWidget(widget3, { shiftKey: true });

      expect(selectedWidgets).toHaveLength(3);
      expect(currentWidgetId.value).toBe(widget3.id);
    });

    it('按住Shift键分别选择第三、一个时应该选中中间所有组件', () => {
      const { widgets, addWidgetById } = useWidgets();
      const { setCurrentWidget, selectedWidgets, currentWidgetId } = useSelectWidgets(widgets);

      // 准备数据
      const [widget1, , widget3] = ['1', '2', '3'].map(id => addWidgetById('text', { id }));

      // 执行过程
      setCurrentWidget(widget3);
      setCurrentWidget(widget1, { shiftKey: true });

      // 断言
      expect(selectedWidgets).toHaveLength(3);
      expect(currentWidgetId.value).toBe(widget1.id);
    });

    it('按住Shift键分别选择第二、一、四个时应该选中中间所有组件', () => {
      const { widgets, addWidgetById } = useWidgets();
      const { setCurrentWidget, selectedWidgets, currentWidgetId } = useSelectWidgets(widgets);

      // 准备数据
      const [widget1, widget2,,widget4] = ['1', '2', '3', '4', '5'].map(id => addWidgetById('text', { id }));

      // 执行过程
      setCurrentWidget(widget2);
      setCurrentWidget(widget1, { ctrlKey: true });
      setCurrentWidget(widget4, { shiftKey: true });

      // 断言
      expect(selectedWidgets).toHaveLength(4);
      expect(currentWidgetId.value).toBe(widget4.id);
    });

    it('按住Shift键选中4个组件后, 再选中第一个组件时, 选中组件只有第一个组件', () => {
      const { widgets, addWidgetById } = useWidgets();
      const { setCurrentWidget, selectedWidgets, currentWidgetId } = useSelectWidgets(widgets);

      const [widget1,,, widget4] = ['1', '2', '3', '4'].map(id => addWidgetById('text', { id }));

      setCurrentWidget(widget1, { shiftKey: true });
      setCurrentWidget(widget4, { shiftKey: true });
      setCurrentWidget(widget1);

      expect(selectedWidgets).toHaveLength(1);
      expect(currentWidgetId.value).toBe(widget1.id);
    });

    it('按住Shift键选中4个组件后, 再按住Ctrl键选中第一个组件时, 已选中组件包含第二、三、四个', () => {
      const { widgets, addWidgetById } = useWidgets();
      const { setCurrentWidget, selectedWidgets, currentWidgetId } = useSelectWidgets(widgets);

      const [widget1, widget2, widget3, widget4] = ['1', '2', '3', '4'].map(id => addWidgetById('text', { id }));

      setCurrentWidget(widget1, { shiftKey: true });
      setCurrentWidget(widget4, { shiftKey: true });
      setCurrentWidget(widget1, { ctrlKey: true });

      expect(selectedWidgets).toHaveLength(3);
      expect(selectedWidgets).toEqual([widget2, widget3, widget4]);
      expect(currentWidgetId.value).toBe(widget4.id);
    });
  });

  describe('resetSelectedWidgets', () => {
    it('应清空选中组件列表', () => {
      const { widgets, addWidgetById } = useWidgets();
      const { resetSelectedWidgets, selectedWidgets, selectedWidgetIdSet, setCurrentWidget, currentWidget, currentWidgetId } = useSelectWidgets(widgets);

      ['1', '2', '3'].map(id => setCurrentWidget(addWidgetById('text', { id }), { ctrlKey: true }));

      resetSelectedWidgets();

      expect(selectedWidgets).toHaveLength(0);
      expect(selectedWidgetIdSet.size).toBe(0);
      expect(currentWidget.value).toBeNull();
      expect(currentWidgetId.value).toBe('');
    });
  });
});
