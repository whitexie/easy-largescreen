import type { Ref } from 'vue';
import { useMagicKeys } from '@vueuse/core';
import { onBeforeUnmount, onMounted } from 'vue';

export function useCanvasMove(targetRef?: Ref<HTMLElement | null>) {
  const canvasRef = targetRef || ref<HTMLElement | null>(null);
  const isDragging = ref(false);
  const { space: spacePressed } = useMagicKeys();
  const offset = reactive({ x: 30, y: 30 });
  let startX = 0;
  let startY = 0;

  const cursorStyle = computed(() => {
    if (isDragging.value) {
      return 'grabbing !important';
    }
    else if (spacePressed.value) {
      return 'grab !important';
    }

    return 'default';
  });

  const offsetStyle = computed(() => {
    return {
      left: `${offset.x}px`,
      top: `${offset.y}px`,
    };
  });

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging.value) {
      return;
    }
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;
    const canvasEl = canvasRef.value as HTMLElement;
    offset.x = canvasEl.offsetLeft + dx;
    offset.y = canvasEl.offsetTop + dy;
  }

  function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    isDragging.value = false;
  }

  function handleMouseDown(e: MouseEvent) {
    if (spacePressed.value) {
      isDragging.value = true;
      startX = e.clientX;
      startY = e.clientY;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }

  function initOffset() {
    const canvas = canvasRef.value as HTMLElement;
    if (!canvas) {
      return;
    }
    offset.x = canvas.offsetLeft;
    offset.y = canvas.offsetTop;
  }

  onMounted(() => {
    initOffset();
  });

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  });

  return {
    spacePressed,
    canvasRef,
    cursorStyle,
    offsetStyle,
    handleMouseDown,
  };
}
