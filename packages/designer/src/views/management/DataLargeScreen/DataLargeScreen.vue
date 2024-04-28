<script setup lang="ts">
import { NButton } from 'naive-ui';
import { useRouter } from 'vue-router';

const router = useRouter();

function handleClick() {
  router.push({ name: 'DataLargeScreenDesigner' });
}
</script>

<template>
  <div class="p3">
    <NButton type="primary" @click="handleClick">
      创建大屏
    </NButton>
  </div>
</template>

<style scoped></style>
