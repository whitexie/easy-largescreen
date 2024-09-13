import { computed, reactive } from 'vue';
import { generateId, hasOwn } from '@yss/utils';
import type { BoxId, ChartRederStateOptions, Field, FieldType, OriginalField } from '@/types/charts';
import { CalculateType } from '@/types/charts';

export function useChartRender(options?: Partial<ChartRederStateOptions>) {
  const state = reactive<ChartRederStateOptions>({
    datasetId: '',
    // 拖拽框设置
    dropBoxSettings: {
      xAxis: {
        id: 'xAxis',
        title: 'X轴',
        fieldType: 'dimension',
        fields: [],
      },
      yAxis: {
        id: 'yAxis',
        title: 'Y轴',
        fieldType: 'metric',
        fields: [],
      },
    },
  });

  const datasetId = computed({
    get() {
      return state.datasetId;
    },
    set(val) {
      state.datasetId = val;
    },
  });

  function updateState(options: Partial<ChartRederStateOptions>) {
    const keys = Object.keys(options) as Array<keyof ChartRederStateOptions>;
    keys.forEach((key) => {
      if (hasOwn(state, key) && options[key] !== undefined) {
        (state[key] as any) = options[key];
      }
    });
  }

  function createField(fieldOption: OriginalField, type: FieldType): Field {
    const { id: fieldCode, ...args } = fieldOption;
    return {
      ...args,
      fieldCode,
      fieldType: type,
      datasetId: state.datasetId,
      id: generateId(),
      calculateType: CalculateType.SUM,
    };
  }

  function addField(boxId: BoxId, fieldOption: OriginalField, index: number) {
    const box = state.dropBoxSettings[boxId];
    const length = box.fields.length;
    const fieldType = box.fieldType;
    const field = createField(fieldOption, fieldType);
    if (field.valueType !== 'number') {
      field.calculateType = CalculateType.COUNT;
    }
    state.dropBoxSettings[boxId].fields.splice(index || length, 0, field);

    return field;
  }

  function removeField(boxId: BoxId, fieldId: string) {
    const box = state.dropBoxSettings[boxId];
    const index = box.fields.findIndex(field => field.id === fieldId);
    if (index !== -1) {
      box.fields.splice(index, 1);
    }
  }

  if (options) {
    updateState(options);
  }

  return {
    state,
    datasetId,
    addField,
    removeField,
  };
}
