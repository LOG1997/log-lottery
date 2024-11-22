<script setup lang='ts'>
import { useElementSize } from '@vueuse/core'
import Sparticles from 'sparticles'
import { onMounted, onUnmounted, ref } from 'vue'

const starRef = ref()

const { width, height } = useElementSize(starRef)
const options = ref({ shape: 'star', parallax: 1.2, rotate: true, twinkle: true, speed: 10, count: 200 })
function addSparticles(node: any, width: number, height: number) {
  // eslint-disable-next-line no-new
  new Sparticles(node, options.value, width, height)
}
// 页面大小改变时
function listenWindowSize() {
  window.addEventListener('resize', () => {
    if (width.value && height.value) {
      addSparticles(starRef.value, width.value, height.value)
    }
  })
}

onMounted(() => {
  addSparticles(starRef.value, width.value, height.value)
  listenWindowSize()
})
onUnmounted(() => {
  window.removeEventListener('resize', listenWindowSize)
})
</script>

<template>
  <div ref="starRef" class="w-screen h-screen overflow-hidden bg-transparent" />
</template>

<style lang='scss' scoped></style>
