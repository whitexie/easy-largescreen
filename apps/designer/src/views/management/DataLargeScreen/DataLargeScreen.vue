<script setup lang="ts">
import api from '@/api';
import { NButton, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';

const router = useRouter();
const message = useMessage();

const largeScreenList = reactive<API.LargeScreenDto[]>([]);

function handleClick(id: string) {
  router.push({ name: 'DataLargeScreenDesigner', params: { id } });
}

async function handleDelete(id: string) {
  await api.largescreen.remove({ id });
  await initLargeScreenList();
}

async function handleRelease(data: API.LargeScreenDto) {
  const { id, isRelease } = data;
  const { error, msg } = await api.largescreen.release({ id, isRelease: isRelease === 1 ? 0 : 1 });

  if (error === 0) {
    message.success(msg);
  }
  else {
    message.error(msg);
  }
  await initLargeScreenList();
}

async function initLargeScreenList() {
  const data = await api.largescreen.list();
  largeScreenList.splice(0, largeScreenList.length, ...(data?.data || []));
}

onMounted(async () => {
  await initLargeScreenList();
});
</script>

<template>
  <div class="p3">
    <NButton type="primary" @click="handleClick('new')">
      创建大屏
    </NButton>
  </div>

  <div class="flex gap-2 p-2">
    <n-empty v-if="!largeScreenList.length" class="flex-1" />
    <div v-for="item in largeScreenList" :key="item.id" class="rounded-lg border-solid border-width-1 border-color-#e4e4e7 justify-between flex-col flex w-50">
      <div class="text-lg font-bold text-color-#333 py-1 px-3">
        {{ item.name }}
      </div>
      <div class="action mt-3 flex justify-end flex-shrink-0 p-1">
        <div class="action-item p-1 flex justify-center items-center">
          <div class="i-material-symbols:edit-square-outline icon cursor-pointer" @click="handleClick(item.id)" />
        </div>

        <n-popconfirm
          @positive-click="handleRelease(item)"
        >
          <template #trigger>
            <div class="action-item p-1 flex justify-center items-center">
              <div class="icon cursor-pointer" :class="[item.isRelease === 1 ? 'i-material-symbols:share-off' : 'i-material-symbols:share-outline']" />
            </div>
          </template>
          {{ item.isRelease === 1 ? '取消发布后，其他用户将无法访问！' : '发布后将可以被其他用户访问！' }}
        </n-popconfirm>

        <n-popconfirm
          @positive-click="handleDelete(item.id)"
        >
          <template #trigger>
            <div class="action-item p-1 flex justify-center items-center">
              <div class="i-material-symbols:delete-outline icon cursor-pointer mt-1 color-red" />
            </div>
          </template>
          删除后将无法恢复！
        </n-popconfirm>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.action-item {
  color: #333;
  width: 2em;
  height: 2em;
  > .icon {
    width: 1.2em;
    height: 1.2em;
  }

  &:hover {
    background-color: #f2f2f2;
    border-radius: 5px;
  }
}
</style>
