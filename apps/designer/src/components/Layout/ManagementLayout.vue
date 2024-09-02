<script lang="tsx" setup>

</script>

<template>
  <div w-full h-full>
    <nav class="h-12 border-b-solid border-b bg-#fff9 border-#e4e4e7  flex justify-center items-center p-2 ">
      <slot name="header" />
    </nav>
    <main class="management-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.management-main {
  height: calc(100% - 3rem);
}
</style>
