<script lang="ts" setup>
interface Props {
  activeComponent: Record<string, any> | null
}
defineProps<Props>();
</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style scoped>
</style>
