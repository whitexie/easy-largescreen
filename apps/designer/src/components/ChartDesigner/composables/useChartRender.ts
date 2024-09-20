import type { BoxId, ChartRederStateOptions, ChartRenderState, DropBoxSettings, Field, FieldType, OriginalField } from '@/types/charts';
import api from '@/api';
import { CHART_MAPPING } from '@/components/Charts/constants/chart';
import { CalculateType } from '@/types/charts';
import { generateId, hasOwn } from '@yss/utils';
import { pick } from 'lodash-es';
import { computed, reactive, unref, type WatchHandle } from 'vue';

const CHARTS = Object.values(CHART_MAPPING);

export function useChartRender(options?: Partial<ChartRederStateOptions>) {
  const state = reactive<ChartRenderState>({
    datasetId: '',
    chartType: CHARTS[0].id,
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
    chartProps: {},
  });
  const data = reactive<any[]>([]);

  const watchHandle: WatchHandle | null = null;

  const datasetId = computed({
    get() {
      return state.datasetId;
    },
    set(val) {
      state.datasetId = val;
    },
  });

  const chartConfig = computed(() => {
    return unref(state);
  });

  const listenSource = computed(() => {
    return Object.values(state.dropBoxSettings);
  });

  function getChartConfig() {
    return structuredClone(unref(state));
  }

  function updateState(options: Partial<ChartRederStateOptions>) {
    if (watchHandle) {
      watchHandle();
    }
    const keys = Object.keys(options) as Array<keyof ChartRederStateOptions>;
    keys.forEach((key) => {
      if (hasOwn(state, key) && options[key] !== undefined) {
        (state[key] as any) = options[key];
      }
    });

    if (options.chartType && !hasOwn(options, 'dropBoxSettings')) {
      if (options.chartType in CHART_MAPPING) {
        const chartConfig = CHART_MAPPING[options.chartType];
        const dropBoxSettings = structuredClone(chartConfig.dropBoxSettings);
        for (const key in dropBoxSettings) {
          dropBoxSettings[key].fields = [];
        }
        state.dropBoxSettings = dropBoxSettings as Record<string, Required<DropBoxSettings>>;
        state.chartProps = structuredClone(chartConfig.props);
      }
    }
  }

  function createField(fieldOption: OriginalField, type: FieldType): Field {
    const whiteList: (keyof OriginalField)[] = ['fieldCode', 'name', 'valueType'];
    return {
      ...pick(fieldOption, whiteList),
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
    const result = await api.dataset.searchData({
      datasetId,
      dimensionFields,
      metricFields,
    });
    data.splice(0, data.length);
    data.push(...result.data);

    return result.data;
  }

  if (options) {
    updateState(options);
  }

  watch(
    () => listenSource.value,
    () => {
      // console.log('listenSource changed');
      requestData();
    },
    {
      deep: true,
    },
  );

  return {
    state,
    datasetId,
    data,
    chartConfig,
    addField,
    removeField,
    requestData,
    getChartConfig,
  };
}
