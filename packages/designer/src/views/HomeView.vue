<script setup lang="ts">
import {parseExcelToJson} from '@yss/dashboard-core'

function handleChange(e: Event) {
  console.log(e)
  const files = (e.target as HTMLInputElement).files
  if (!files?.length)
    return

  const file = files[0]
  parseExcelToJson(file).then(res => {
    console.log(res)
  })
}
</script>

<template>
  <main>
    <input type="file" accept=".xlsx" @change="handleChange">
  </main>
</template>
