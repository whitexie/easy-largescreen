import type { ComputedRef } from 'vue';

type Options = ComputedRef<{ scale: number, beforeMouseDown?: () => void[] }>;

export function useDraggable(option: Options) {
  const isDragging = ref(false);

  const position = ref({ x: 0, y: 0 });
  const startOffsetPosition = { x: 0, y: 0 };

  function setPosition(newPosition: { x: number, y: number }) {
    position.value.x = Math.round(newPosition.x / option.value.scale);
    position.value.y = Math.round(newPosition.y / option.value.scale);
  }

  function initPosition(newPosition: { x: number, y: number }) {
    position.value.x = newPosition.x;
    position.value.y = newPosition.y;
  }

  function handleMouseDown(event: MouseEvent) {
    startOffsetPosition.x = (event.clientX - position.value.x * option.value.scale);
    startOffsetPosition.y = (event.clientY - position.value.y * option.value.scale);
    console.log('[useDraggable] handleMouseDown', startOffsetPosition, option.value.scale);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMove(event: MouseEvent) {
    isDragging.value = true;
    event.stopPropagation();
    // console.log('handleMove');

    const x = event.clientX - startOffsetPosition.x;
    const y = event.clientY - startOffsetPosition.y;
    setPosition({ x, y });
  }

  function handleMouseUp() {
    isDragging.value = false;
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  return {
    isDragging,
    position,
    handleMouseDown,
    initPosition,
  };
}
