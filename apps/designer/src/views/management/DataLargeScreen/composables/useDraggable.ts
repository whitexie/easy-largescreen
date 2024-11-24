import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import type { ComputedRef } from 'vue';

type Options = ComputedRef<{ scale: number }>;

export function useDraggable(option: Options) {
  const isDragging = ref(false);

  const position = ref({ x: 0, y: 0 });
  const startOffsetPosition = { x: 0, y: 0 };
  const currentWidget = ref<DataLargeScreenField | null>(null);

  function setPosition(newPosition: { x: number, y: number }) {
    const x = Math.round(newPosition.x / option.value.scale);
    const y = Math.round(newPosition.y / option.value.scale);
    position.value.x = Math.round(newPosition.x / option.value.scale);
    position.value.y = Math.round(newPosition.y / option.value.scale);

    if (currentWidget.value) {
      currentWidget.value.location.x = x;
      currentWidget.value.location.y = y;
    }
  }

  function initPosition(newPosition: { x: number, y: number }) {
    position.value.x = newPosition.x;
    position.value.y = newPosition.y;
  }

  function handleMouseDown(event: MouseEvent, widget: DataLargeScreenField) {
    startOffsetPosition.x = (event.clientX - position.value.x * option.value.scale);
    startOffsetPosition.y = (event.clientY - position.value.y * option.value.scale);
    currentWidget.value = widget;

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function handleMove(event: MouseEvent) {
    isDragging.value = true;
    event.stopPropagation();

    const x = event.clientX - startOffsetPosition.x;
    const y = event.clientY - startOffsetPosition.y;
    setPosition({ x, y });
  }

  function handleMouseUp() {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleMouseUp);
    currentWidget.value = null;

    setTimeout(() => {
      isDragging.value = false;
    }, 300);
  }

  return {
    isDragging,
    position,
    handleMouseDown,
    initPosition,
  };
}
