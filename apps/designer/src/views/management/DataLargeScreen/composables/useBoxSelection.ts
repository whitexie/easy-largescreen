import type { Ref } from 'vue';
import { onBeforeUnmount } from 'vue';

export function useBoxSelection(targetRef: Ref<HTMLElement | null>) {
  let scale = 1;

  const isBrushing = ref(false);
  const brushStart = reactive({ x: 0, y: 0 });
  const brushEnd = reactive({ x: 0, y: 0 });

  const boxSelectionRect = computed(() => {
    return {
      left: Math.min(brushStart.x, brushEnd.x),
      top: Math.min(brushStart.y, brushEnd.y),
      width: Math.abs(brushEnd.x - brushStart.x),
      height: Math.abs(brushEnd.y - brushStart.y),
    };
  });

  function startBrush(event: MouseEvent, _scale?: number) {
    isBrushing.value = true;
    const { left, top } = targetRef.value!.getBoundingClientRect();

    brushStart.x = brushEnd.x = event.clientX - left;
    brushStart.y = brushEnd.y = event.clientY - top;

    scale = _scale || 1;

    window.addEventListener('mousemove', updateBrush);
    window.addEventListener('mouseup', endBrush);
  }

  function updateBrush(event: MouseEvent) {
    if (!isBrushing.value) {
      return;
    }
    const { clientX, clientY } = event;
    const { left, top } = targetRef.value!.getBoundingClientRect();

    const offsetX = clientX / scale - left;
    const offsetY = clientY / scale - top;
    brushEnd.x = offsetX;
    brushEnd.y = offsetY;
  }

  function endBrush() {
    isBrushing.value = false;
    window.removeEventListener('mousemove', updateBrush);
    window.removeEventListener('mouseup', endBrush);
  }

  onMounted(() => {
    targetRef.value?.addEventListener('mousedown', startBrush);
  });

  onBeforeUnmount(() => {
    targetRef.value?.removeEventListener('mousedown', startBrush);
  });

  return {
    isBrushing,
    boxSelectionRect,
    startBrush,
  };
}
