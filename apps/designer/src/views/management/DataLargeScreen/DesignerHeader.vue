<script lang="ts" setup>
import Menus from '@/components/Designer/Menus/Menus.vue';
import { useLargeScreenDesigner } from '@/stores/designer';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { useRouter } from 'vue-router';

const designerStore = useLargeScreenDesigner();
const router = useRouter();

function handleBack() {
  router.back();
}
</script>

<template>
  <div class="px-2">
    <div class="border-b-1px gap-2 flex items-center justify-between border-gray-200 border-b-solid h-50px">
      <div class="start flex items-center gap-1 cursor-pointer">
        <Icon class="" icon="ion:arrow-back" @click="handleBack" />
        <n-input v-model:value="designerStore.state.name" placeholder="大屏名称" class="w-160px!" />
      </div>
      <div class="center flex-1 h-full">
        <Menus />
      </div>
      <div class="end">
        <div class="flex items-center gap-2">
          <n-button>预览</n-button>
          <n-button type="primary" @click.stop="designerStore.saveLargeScreen">
            保存
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
