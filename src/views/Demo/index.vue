<script setup lang="ts">
import FileUpload from '@/components/FileUpload/index.vue'
</script>

<template>
  <div class="flex flex-col gap-3">
    <FileUpload mode="file" limit-type="image" :is-directory="true" />
  </div>
</template>

<style lang="scss" scoped></style>
