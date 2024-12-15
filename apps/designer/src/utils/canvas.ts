export function calculateBestFitScale(containerElement: HTMLElement, canvasElement: HTMLElement, margin: number = 0) {
  // 获取容器和画布的宽度和高度
  const containerWidth = containerElement.offsetWidth;
  const containerHeight = containerElement.offsetHeight;
  const canvasWidth = canvasElement.offsetWidth;
  const canvasHeight = canvasElement.offsetHeight;

  // 计算容器和画布的宽度和高度比例
  const widthScale = (containerWidth - margin * 2) / canvasWidth;
  const heightScale = (containerHeight - margin * 2) / canvasHeight;

  return Math.round(Math.min(widthScale, heightScale) * 100);
}

interface BoxSelectionRect {
  left: number
  top: number
  width: number
  height: number
}

interface CanvasCoordinates {
  width: number
  height: number
  x: number
  y: number
}

/**
 * 计算框选区域在画布中的实际坐标和尺寸
 * @param params 计算所需的参数
 * @returns 返回计算后的坐标和尺寸
 */
export function calculateBoxSelectionCoordinates(params: {
  canvasRef: HTMLElement
  containerRef: HTMLElement
  boxSelectionRect: BoxSelectionRect
  scale: number
}): CanvasCoordinates | undefined {
  const { canvasRef, containerRef, boxSelectionRect, scale } = params;

  if (!canvasRef || !containerRef) {
    return;
  }

  const scaleRatio = scale / 100;
  let { left: x, top: y, width, height } = boxSelectionRect;

  // 计算相对位置
  const { left: containerLeft, top: containerTop } = containerRef.getBoundingClientRect();
  const { left, top } = canvasRef.getBoundingClientRect();

  x = x - (left - containerLeft);
  y = y - (top - containerTop);

  // 根据缩放比例调整坐标和尺寸
  if (scaleRatio !== 1) {
    // 如果x,y大于0，代表从画布外进行框选，不需要除以scaleRatio，否则除以scaleRatio
    x = x > 0 ? x / scaleRatio : x;
    y = y > 0 ? y / scaleRatio : y;
    width = width / scaleRatio;
    height = height / scaleRatio;
  }

  return { width, height, x, y };
}
