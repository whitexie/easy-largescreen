import type { ComputedRef } from 'vue';

type Options = ComputedRef<{ scale: number, beforeMouseDown?: () => void[] }>;

export function useDraggable(option: Options) {
  let isDragging = false;

  const position = ref({ x: 0, y: 0 });
  const startOffsetPosition = { x: 0, y: 0 };

  function setPosition(newPosition: { x: number, y: number }) {
    position.value.x = newPosition.x / option.value.scale;
    position.value.y = newPosition.y / option.value.scale;
  }

  function initPosition(newPosition: { x: number, y: number }) {
    position.value.x = newPosition.x;
    position.value.y = newPosition.y;
  }

  function handleMouseDown(event: MouseEvent) {
    startOffsetPosition.x = (event.clientX - position.value.x * option.value.scale);
    startOffsetPosition.y = (event.clientY - position.value.y * option.value.scale);
    console.log('handleMouseDown', startOffsetPosition, option.value.scale);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMove(event: MouseEvent) {
    isDragging = true;
    event.stopPropagation();
    // console.log('handleMove');

    const x = event.clientX - startOffsetPosition.x;
    const y = event.clientY - startOffsetPosition.y;
    setPosition({ x, y });
  }

  function handleMouseUp() {
    console.log('handleMouseUp', position.value);
    isDragging = false;
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
