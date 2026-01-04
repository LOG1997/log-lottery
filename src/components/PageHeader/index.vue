<script setup lang='ts'>
const props = defineProps<{
    title: string
}>()
</script>

<template>
  <header>
    <h1 class="text-lg leading-10">
      {{ props.title }}
    </h1>
    <div class="button-group my-4">
      <slot name="buttons" />
    </div>
    <div class="divider mt-0" />
    <div>
      <slot name="alerts" />
    </div>
  </header>
</template>

<style scoped>

</style>
