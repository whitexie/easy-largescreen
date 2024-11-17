import type { BoxId, ChartImplementaion, ChartRederStateOptions, ChartRenderState, DropBoxSettings, Field, FieldType, OriginalField } from '@/types/charts';
import api from '@/api';
import ChartImplementations from '@/components/Charts/chart-implementations';
import { CalculateType } from '@/types/charts';
import { generateId, hasOwn } from '@yss/utils';
import { pick } from 'lodash-es';
import { computed, reactive, toRaw } from 'vue';

const CHARTS = Object.keys(ChartImplementations).map(key => key.replace('Chart', ''));

export function useChartRender(options?: Partial<ChartRederStateOptions>) {
  const state = reactive<ChartRenderState>({
    datasetId: '',
    chartType: CHARTS[0],
    dropBoxSettings: {},
    chartProps: {},
  });

  let __autoRequestData = true;
  const data = reactive<Record<string, string | number>[]>([]);

  const shallowChart = shallowRef<ChartImplementaion | null>(null);

  const datasetId = computed({
    get() {
      return state.datasetId;
    },
    set(val) {
      state.datasetId = val;
    },
  });

  const chartConfig = computed(() => {
    return state;
  });

  const listenSource = computed(() => {
    return Object.values(state.dropBoxSettings);
  });

  function getChartConfig() {
    return structuredClone(toRaw(state));
  }

  function updateState(options: ChartRederStateOptions) {
    const { autoRequestData, ...args } = JSON.parse(JSON.stringify(options));
    __autoRequestData = typeof autoRequestData === 'boolean' ? autoRequestData : true;
    const keys = Object.keys(args) as Array<keyof ChartRenderState>;
    keys.forEach((key) => {
      if (key in state && args[key] !== undefined) {
        (state[key] as any) = args[key];
      }
    });

    if (!state.chartType) {
      state.chartType = CHARTS[0];
    }

    const chartClassName = `${state.chartType}Chart` as keyof typeof ChartImplementations;
    if (!(chartClassName in ChartImplementations)) {
      throw new Error(`chart type is not supported => ${state.chartType}`);
    }
    shallowChart.value = new ChartImplementations[chartClassName]();

    if (!hasOwn(args, 'dropBoxSettings')) {
      const dropBoxSettings = shallowChart.value.getDefaultDropBoxSettings();
      for (const key in dropBoxSettings) {
        dropBoxSettings[key].fields = [];
      }

      state.dropBoxSettings = dropBoxSettings as Record<string, Required<DropBoxSettings>>;
      state.chartProps = shallowChart.value.getDefaultProps();
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

  /**
   * 添加字段
   * @param boxId 盒子id
   * @param fieldOption 字段配置
   * @param index 索引
   * @returns
   */
  function addField(boxId: BoxId, fieldOption: OriginalField, index?: number): Field {
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
          dimensionFields.push(toRaw(field));
        }
        else {
          metricFields.push(toRaw(field));
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

  function buildG2Options() {
    if (!shallowChart.value) {
      throw new Error('chart is not initialized');
    }

    const { dropBoxSettings, chartProps: props } = state;
    shallowChart.value.validate({ dropBoxSettings, props });
    return shallowChart.value.buildOptions({ dropBoxSettings, data: toRaw(data) });
  }

  if (options) {
    updateState(options);
  }

  if (__autoRequestData) {
    watch(
      () => listenSource.value,
      () => {
        if (!shallowChart.value) {
          return;
        }
        try {
          const { dropBoxSettings, chartProps: props } = state;
          shallowChart.value.validate({ dropBoxSettings, props });
          requestData();
        }
        catch (error) {
          console.log(error);
        }
      },
      { deep: true, immediate: true },
    );
  }

  return {
    state,
    datasetId,
    data,
    chartConfig,
    updateState,
    addField,
    removeField,
    requestData,
    getChartConfig,
    buildG2Options,
  };
}
