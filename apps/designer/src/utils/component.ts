import Loading from '@/components/Loading/index.vue';
import { type AsyncComponentLoader, defineAsyncComponent } from 'vue';

export function loadAsyncComponent(component: AsyncComponentLoader) {
  return defineAsyncComponent({
    loader: component,
    loadingComponent: Loading,
    delay: 200,
  });
}

export function createComponentMap(modules: Record<string, any>) {
  const componentMap: Record<string, any> = {};
  Object.entries(modules).forEach(([key, value]) => {
    const stringList = key.split('/');
    const componentName = stringList[1];
    componentMap[componentName] = loadAsyncComponent(value);
  });
  return componentMap;
}
