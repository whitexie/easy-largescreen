<script lang="ts" setup>
import ManagementLayout from '@/components/Layout/ManagementLayout.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const activeId = ref('');
const menus = [
  {
    name: 'Dashboard',
    text: '仪表盘',
    icon: 'i-simple-line-icons:support',
  },
  {
    name: 'Dataset',
    text: '数据集',
    icon: 'i-simple-icons:microsoftexcel',
  },
  {
    name: 'DataLargeScreen',
    text: '数据大屏',
    icon: 'i-simple-line-icons:screen-desktop',
  },
];

function isActiveid(id: string) {
  return id === activeId.value ? 'text-#09090b' : 'text-#09090b80';
}

function handleClickMenu(menu: typeof menus[0]) {
  activeId.value = menu.name;
  router.push({ name: menu.name });
}

watch(
  () => route,
  (val) => {
    if (val.fullPath.includes('management')) {
      activeId.value = route.name as string;
    }
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <ManagementLayout>
    <template #header>
      <div v-for="item in menus" :key="item.name" :class="isActiveid(item.name)" class="mx-4 h-full flex items-center text-4 rounded-md hover:bg-#f5f5f5 px-4 cursor-pointer select-none" @click="handleClickMenu(item)">
        <div class="w-1em h-1em mr-1" :class="item.icon" />
        {{ item.text }}
      </div>
    </template>
    <router-view />
  </ManagementLayout>
</template>

<style scoped></style>
