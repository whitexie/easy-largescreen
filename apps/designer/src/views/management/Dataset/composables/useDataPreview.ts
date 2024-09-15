import type { Dataset } from '@/types/dataset';
import { h, type UnwrapNestedRefs } from 'vue';

export function useDataPreview(dataset: UnwrapNestedRefs<Dataset>) {
  const data = computed(() => {
    return dataset.data.slice(0, 20);
  });

  const columns = computed(() => {
    return dataset.fields.map((item) => {
      const { name, id } = item;
      return {
        'width': 150,
        'min-width': 150,
        'ma-width': 300,
        'title': name,
        'key': id,
      };
    });
  });

  const tableProps = computed(() => {
    return {
      'size': 'small',
      'max-height': '300px',
      'data': data.value,
      'columns': [
        {
          title: '序号',
          key: 'index',
          width: 60,
          titleAlign: 'center',
          align: 'center',
          render: (_: object, rowIndex: number) => {
            return h('div', {}, rowIndex + 1);
          },
        },
        ...columns.value,
      ],
      'table-layout': 'fixed',
      'scroll-x': columns.value.length * 150 + 60,
    } as const;
  });

  return {
    tableProps,
  };
}
