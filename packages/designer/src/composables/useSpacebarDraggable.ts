export function useSpacebarDraggable() {
  const canvasRef = ref<HTMLElement | null>(null);
  const isDragging = ref(false);
  const spacePressed = ref(false);
  const offset = reactive({ x: 0, y: 0 });
  let startX = 0;
  let startY = 0;

  const cursorStyle = computed(() => {
    if (isDragging.value)
      return 'grabbing';
    else if (spacePressed.value)
      return 'grab';
    else return 'default';
  });

  const offsetStyle = computed(() => {
    return {
      left: `${offset.x}px`,
      top: `${offset.y}px`,
    };
  });

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging.value)
      return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;
    const canvasEl = canvasRef.value as HTMLElement;
    offset.x = canvasEl.offsetLeft + dx;
    offset.y = canvasEl.offsetTop + dy;
  };

  function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    isDragging.value = false;
  };

  function handleMouseDown(e: MouseEvent) {
    if (spacePressed.value) {
      isDragging.value = true;
      startX = e.clientX;
      startY = e.clientY;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  function handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space') {
      const targetElement = e.target as HTMLElement;
      if (targetElement.tagName === 'INPUT')
        return;

      // 防止滚动
      e.preventDefault();
      spacePressed.value = true;
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.code === 'Space')
      spacePressed.value = false;
  }

  function initOffset() {
    const canvas = canvasRef.value as HTMLElement;
    if (!canvas)
      return;
    offset.x = canvas.offsetLeft;
    offset.y = canvas.offsetTop;
  }

  function setOffset(_offset: { x?: number, y?: number }) {
    if (_offset.x)
      offset.x = _offset.x;

    if (_offset.y)
      offset.y = _offset.y;
  }

  onMounted(() => {
    initOffset();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  });

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  });

  return {
    spacePressed,
    canvasRef,
    cursorStyle,
    offsetStyle,
    setOffset,
    handleMouseDown,
  };
}
