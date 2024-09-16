import type { BoxId, ChartRederStateOptions, Field, FieldType, OriginalField } from '@/types/charts';
import { getAnlysisData } from '@/api';
import { CalculateType } from '@/types/charts';
import { generateId, hasOwn } from '@yss/utils';
import { computed, reactive, unref } from 'vue';

export function useChartRender(options?: Partial<ChartRederStateOptions>) {
  const state = reactive<ChartRederStateOptions>({
    datasetId: '',
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

  const data = reactive<any[]>([]);

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

  function addField(boxId: BoxId, fieldOption: OriginalField, index?: number) {
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

  function conversionFields() {
    const dimensionFields: Field[] = [];
    const metricFields: Field[] = [];

    Object.values(state.dropBoxSettings).forEach((box) => {
      box.fields.forEach((field) => {
        if (field.fieldType === 'dimension') {
          dimensionFields.push(unref(field));
        }
        else {
          metricFields.push(unref(field));
        }
      });
    });

    return {
      dimensionFields,
      metricFields,
    };
  }

  async function requestData() {
    const { dimensionFields, metricFields } = conversionFields();
    const { datasetId } = state;
    const result = await getAnlysisData({
      datasetId,
      dimensionFields,
      metricFields,
    });
    data.splice(0, data.length);
    data.push(...result);

    return result;
  }

  if (options) {
    updateState(options);
  }

  return {
    state,
    datasetId,
    data,
    addField,
    removeField,
    requestData,
  };
}
