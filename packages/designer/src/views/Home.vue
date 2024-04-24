<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui';
import { NButton, NUpload } from 'naive-ui';
import { ref } from 'vue';

const fileList = ref<UploadFileInfo[]>([]);
</script>

<template>
  <div>
    <NUpload v-model:file-list="fileList" accept=".xlsx,.xls" :default-upload="true" :max="1">
      <NButton :disabled="fileList.length > 0">
        上传文件
      </NButton>
    </NUpload>
  </div>
</template>
