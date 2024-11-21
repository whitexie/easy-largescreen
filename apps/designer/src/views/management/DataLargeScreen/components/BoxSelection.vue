<script setup lang="ts">
const props = defineProps<{
  isBrushing: boolean
  boxSelectionRect: {
    left: number
    top: number
    width: number
    height: number
  }
}>();

const boxSelectStyle = computed(() => {
  const { boxSelectionRect: { left, top, width, height }, isBrushing } = props;
  return {
    display: isBrushing ? 'block' : 'none',
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  };
});
</script>

<template>
  <div class="brush-area absolute" :style="boxSelectStyle" />
</template>

<style scoped>
.brush-area {
  pointer-events: none;
  border: 1px solid #103ffa50;
  background-color: rgba(52, 152, 251, 0.24);
}
</style>
