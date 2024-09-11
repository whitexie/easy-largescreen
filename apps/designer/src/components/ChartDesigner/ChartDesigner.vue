<script setup lang="ts">
import FieldPane from '@/components/Designer/PropsPane/FieldPane.vue';
</script>

<template>
  <div class="w-full h-full">
    <div class="header h-40px border-b-solid border-gray-200">
      <!--  -->
    </div>
    <div class="pane-field w-120px border-r-solid border-gray-200">
      <FieldPane title="指标" type="metric" :fields="[]" />
      <FieldPane title="维度" type="dimension" :fields="[]" />
    </div>
  </div>
</template>

<style scoped>
.pane-field {
  height: calc(100% - 40px);
}
</style>
