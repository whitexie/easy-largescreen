import { defineStore } from 'pinia';

interface PageConfig {
  background: {
    color: string
    image: string
  }
  width: number
  height: number
}

interface LargeScreenDesigner {
  id: string
  name: string
  pageConfig: PageConfig
  useDatsetIds: string[]
}

export const useLargeScreenDesigner = defineStore('LargeScreenDesigner', () => {
  const state = reactive<LargeScreenDesigner>({
    id: '',
    name: '',
    pageConfig: {
      background: {
        color: '',
        image: '',
      },
      width: 1920,
      height: 1080,
    },
    useDatsetIds: [],
  });

  /**
   * 临时的状态，仅在设计器中使用
   */
  const temporaryState = reactive({
    currentDatsetId: '',
    scale: 100,
    showDataset: true,
  });

  return { state, temporaryState };
});
