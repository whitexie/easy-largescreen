<script lang="ts" setup>
const isExpand = ref(false);

const icon = computed(() => {
  return isExpand.value ? 'i-fluent:panel-right-expand-16-filled' : ['i-fluent:panel-right-contract-16-filled', 'm-auto'];
});

const layersClass = computed(() => {
  return isExpand.value ? ['w-200px'] : ['w-40px'];
});

function handleClick() {
  isExpand.value = !isExpand.value;
}
</script>

<template>
  <div class="layers  h-full bg-white w-200px overflow-hidden z-1001" :class="layersClass">
    <div :class="isExpand && 'px-2'" class="title flex items-center select-none justify-between h-40px border-b border-gray-200 border-b-solid">
      <span v-show="isExpand" class="pl-3 whitespace-nowrap flex-1 text-center">页面图层</span>
      <div :class="icon" class="size-1.6em cursor-pointer shrink-0" @click="handleClick" />
    </div>
  </div>
</template>

<style scoped>
.layers {
  transition: width 0.3s;
  /* transition-delay: 300ms; */
}
</style>
