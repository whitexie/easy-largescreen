<script setup lang="ts">
import { uploadFile } from '@/utils';

interface Props {
  modelValue?: string
  accept?: string
}

const props = defineProps<Props>();
const modelValue = defineModel<string | string[]>();

async function handleChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    // if (Array.isArray(modelValue.value)) {
    //   const result: string[] = [];
    //   Array.from(files).forEach(async (file) => {
    //     result.push(await uploadFile(file));
    //   });
    //   modelValue.value = result;
    //   return;
    // }

    modelValue.value = await uploadFile(files[0]);
  }
}
</script>

<template>
  <div class="upload-container relative">
    <input v-show="!modelValue" type="file" :accept="props.accept" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleChange">
    <div
      class="w-100px h-100px bg-gray-100 rounded-md border border-gray-300 flex bg-center bg-contain bg-no-repeat items-center justify-center "
      :style="{ backgroundImage: `url(${modelValue})` }"
    >
      <div v-if="!modelValue" class="i-icon-park:upload-one w-2em h-2em" />
      <div v-else class="i-line-md:close-circle w-2em h-2em color-white icon opacity-0 transition cursor-pointer" @click.stop="modelValue = ''" />
    </div>
  </div>
</template>

<style scoped lang="less">
.upload-container {
  &:hover {
    .icon {
      opacity: 1;
    }
  }
}
</style>
