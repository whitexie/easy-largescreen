import { Chart } from '@antv/g2';
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';

export function useChart(options: unknown, $attrs: Record<string, any>) {
  const containerElement = ref<HTMLElement>();
  const chart = shallowRef<Chart | null>(null);

  function render(options: any) {
    if (chart.value) {
      // console.log('render', options);
      chart.value.options(options);
      chart.value.render();
    }
  }

  function bindEvents() {
    Object.keys($attrs).filter(key => key.startsWith('on')).forEach((key) => {
      const eventName = key.slice(2).toLowerCase();
      const eventHandler = $attrs[key];
      chart.value?.on(eventName, eventHandler);
    });
  }

  onMounted(() => {
    if (containerElement.value) {
      chart.value = new Chart({
        container: containerElement.value,
        autoFit: true,
      });

      bindEvents();

      if (options) {
        render(options);
      }
    }
  });

  onBeforeUnmount(() => {
    if (chart.value) {
      chart.value.destroy();
    }
  });

  return {
    chart,
    containerElement,
    render,
  };
}
