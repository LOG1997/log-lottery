<script setup lang="ts">
import { provide } from 'vue'
import { loadingKey, loadingState } from '@/components/Loading'
// import PlayMusic from '@/components/PlayMusic/index.vue'

provide(loadingKey, loadingState)
</script>

<template>
  <router-view />
</template>

<style scoped lang="scss"></style>
