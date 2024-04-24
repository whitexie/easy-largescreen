import type { UnwrapNestedRefs } from 'vue';
import type { Dataset } from '@/types/dataset';

export function useDataPreview(dataset: UnwrapNestedRefs<Dataset>) {
  const data = computed(() => {
    return dataset.data.slice(0, 20);
  });

  const columns = computed(() => {
    return dataset.fields.map((item) => {
      const { name } = item;
      return {
        title: name,
        key: name,
      };
    });
  });

  const tableProps = computed(() => {
    return {
      'size': 'small',
      'max-height': '300px',
      'data': data.value,
      'columns': columns.value,
    } as const;
  });

  return {
    tableProps,
  };
}
