import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useBoxSelection } from '../useBoxSelection';

describe('useBoxSelection', () => {
  let boxSelection: ReturnType<typeof useBoxSelection>;
  let scale = 1;
  const container = ref<HTMLElement | null>(null);

  beforeEach(() => {
    // 重置scale和container
    scale = 1;
    container.value = document.createElement('div');
    boxSelection = useBoxSelection(container);
  });

  describe('startBrush', () => {
    it('应该正确初始化刷选状态', () => {
      const mockEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 200,
      });
      Object.defineProperties(mockEvent, {
        offsetX: { value: 100 },
        offsetY: { value: 200 },
        target: { value: container.value },
      });

      boxSelection.startBrush(mockEvent);

      expect(boxSelection.boxSelectionRect.value).toMatchObject({
        left: 100,
        top: 200,
        width: 0,
        height: 0,
      });
    });
  });

  describe('updateBrush', () => {
    it('应该正确更新刷选框尺寸 - 向右下方拖动', () => {
      const rectMock = new DOMRect(0, 0, 800, 600);
      vi.spyOn(container.value!, 'getBoundingClientRect').mockReturnValue(rectMock);

      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      });
      Object.defineProperties(startEvent, {
        offsetX: { value: 100 },
        offsetY: { value: 100 },
        target: { value: container.value },
      });

      boxSelection.startBrush(startEvent);

      const moveEvent = new MouseEvent('mousemove', {
        clientX: 200,
        clientY: 200,
      });

      window.dispatchEvent(moveEvent);

      expect(boxSelection.boxSelectionRect.value).toMatchObject({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
      });
    });

    it('应该正确更新刷选框尺寸 - 向左上方拖动', () => {
      const rectMock = new DOMRect(0, 0, 800, 600);
      vi.spyOn(container.value!, 'getBoundingClientRect').mockReturnValue(rectMock);

      const startEvent = new MouseEvent('mousedown', {
        clientX: 200,
        clientY: 200,
      });
      Object.defineProperties(startEvent, {
        offsetX: { value: 200 },
        offsetY: { value: 200 },
        target: { value: container.value },
      });
      boxSelection.startBrush(startEvent);

      const moveEvent1 = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 100,
      });

      const moveEvent2 = new MouseEvent('mousemove', {
        clientX: 50,
        clientY: 50,
      });

      window.dispatchEvent(moveEvent1);
      window.dispatchEvent(moveEvent2);

      expect(boxSelection.boxSelectionRect.value).toMatchObject({
        left: 50,
        top: 50,
        width: 150,
        height: 150,
      });
    });
  });

  describe('缩放功能', () => {
    it('应该根据缩放比例正确计算刷选框尺寸', () => {
      const rectMock = new DOMRect(0, 0, 800, 600);
      vi.spyOn(container.value!, 'getBoundingClientRect').mockReturnValue(rectMock);

      // 设置缩放比例
      scale = 2;

      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      });
      Object.defineProperties(startEvent, {
        offsetX: { value: 100 },
        offsetY: { value: 100 },
        target: { value: container.value },
      });

      boxSelection.startBrush(startEvent, scale);

      const moveEvent = new MouseEvent('mousemove', {
        clientX: 400,
        clientY: 400,
      });

      window.dispatchEvent(moveEvent);

      expect(boxSelection.boxSelectionRect.value).toMatchObject({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
      });
    });
  });

  describe('事件清理', () => {
    it('应该在结束刷选时移除事件监听器', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      });
      Object.defineProperties(startEvent, {
        offsetX: { value: 100 },
        offsetY: { value: 100 },
        target: { value: container.value },
      });

      boxSelection.startBrush(startEvent, scale);

      // 触发mouseup事件结束刷选
      window.dispatchEvent(new MouseEvent('mouseup'));

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    });
  });
});
