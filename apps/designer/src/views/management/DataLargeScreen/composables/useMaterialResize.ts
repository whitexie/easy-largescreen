import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import { onUnmounted } from 'vue';

export function useMaterialResize() {
  let activeWidget: DataLargeScreenField | null = null;
  let horizontalDirection = 0; // -1 左 0 未选中 1 右
  let verticalDirection = 0; // -1 上 0 未选中 1 下
  let rectBounds: DOMRect | null = null;
  let canvasRect: DOMRect | null = null;
  let scaleRadio = 1;
  let frameId: number | null = null;

  const isResizing = ref(false);

  function handleActiveResize(widget: DataLargeScreenField, canvasEl: HTMLElement | null, horizontal: -1 | 0 | 1, vertical: -1 | 0 | 1, scale: number) {
    activeWidget = widget;
    horizontalDirection = horizontal;
    verticalDirection = vertical;
    scaleRadio = scale;

    initElementBounds(canvasEl); // 初始化元素边界
    registerEvent();
  }

  function initElementBounds(canvasEl: HTMLElement | null) {
    if (!activeWidget || !canvasEl) {
      return;
    }

    if (!activeWidget._el) {
      console.error('element not found, widget id =>', activeWidget.id);
      return;
    }

    canvasRect = canvasEl.getBoundingClientRect();
    rectBounds = activeWidget._el.getBoundingClientRect();
  }

  function registerEvent() {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event: MouseEvent) {
    isResizing.value = true;
    // 使用requestAnimationFrame包裹实际的逻辑处理
    // 这确保了每次屏幕刷新前只执行一次，减少不必要的计算和DOM操作
    if (frameId !== null) {
      // 如果已经有一个帧请求在队列中，则取消它，确保不会有重复的调用
      cancelAnimationFrame(frameId);
    }

    frameId = requestAnimationFrame(() => {
      if (!activeWidget || !activeWidget._el || !rectBounds || !canvasRect) {
        return;
      }

      // 根据方向计算新的宽度和高度
      let newWidth = rectBounds.width;
      let newHeight = rectBounds.height;
      let newLeft = rectBounds.left - canvasRect.left;
      let newTop = rectBounds.top - canvasRect.top;

      if (horizontalDirection === -1) { // 向左移动
        newWidth = rectBounds.right - event.clientX;
        newLeft = event.clientX - canvasRect.left;
      }
      else if (horizontalDirection === 1) { // 向右移动
        newWidth = event.clientX - rectBounds.left;
      }

      if (verticalDirection === -1) { // 向上移动
        newHeight = rectBounds.bottom - event.clientY;
        newTop = event.clientY - canvasRect.top;
      }
      else if (verticalDirection === 1) { // 向下移动
        newHeight = event.clientY - rectBounds.top;
      }

      // 更新组件状态
      activeWidget.size.width = newWidth / scaleRadio;
      activeWidget.size.height = newHeight / scaleRadio;
      activeWidget.location.x = newLeft / scaleRadio;
      activeWidget.location.y = newTop / scaleRadio;

      // 在操作完成后，重置frameId以便于下一次重新请求
      frameId = null;
    });
  }

  function handleMouseUp(event: MouseEvent) {
    event.stopPropagation();

    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    setTimeout(() => {
      isResizing.value = false;
    }, 200);

    removeEventListener();
  }

  function removeEventListener() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  onUnmounted(() => {
    removeEventListener();
  });

  return {
    handleActiveResize,
    isResizing,
  };
}
