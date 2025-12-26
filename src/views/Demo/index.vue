<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref } from 'vue'
import { transform } from 'zod'

gsap.registerPlugin(ScrollTrigger)

const list = ref([])

list.value = [{
  label: 1,
  value: 1,
  color: 'red',
}, {
  label: 2,
  value: 2,
  color: 'blue',
}, {
  label: 3,
  value: 3,
  color: 'yellow',
}, {
  label: 4,
  value: 4,
  color: 'green',
}, {
  label: 5,
  value: 5,
  color: 'pink',
}, {
  label: 6,
  value: 6,
  color: 'orange',
}, {
  label: 7,
  value: 7,
  color: 'purple',
}, {
  label: 8,
  value: 8,
  color: 'brown',
}, {
  label: 9,
  value: 9,
  color: 'gray',
}, {
  label: 10,
  value: 10,
  color: 'cyan',
}]

// 为每个 li 元素创建引用
const liRefs = ref()
const scrollContainerRef = ref()
const main = ref()
const ctx = ref()
onMounted(() => {
  ctx.value = gsap.context(() => {
    liRefs.value.forEach((box) => {
      gsap.fromTo(box, { rotationX: -90, opacity: 0 }, {
        rotationX: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: box,
          scroller: scrollContainerRef.value, // <- Specify the scroller!
          start: 'bottom 100%',
          end: 'top 70%',
          scrub: true,
          enable: true,

        },
      })
    })
    // 如果当前元素在屏幕内达到99%，直接到最终位置
  }, main.value) // <- Scope!
})

onUnmounted(() => {
  ctx.value.revert() // <- Easy Cleanup!
})
</script>

<template>
  <div class="h-full flex flex-col justify-center overflow-hidden">
    <div
      ref="scrollContainerRef"
      class="h-150 w-48 overflow-y-auto"
    >
      <ul ref="main">
        <li
          v-for="item in list"
          :key="item.value"
          ref="liRefs"
          :style="{ backgroundColor: item.color }"
          class="w-full h-28 text-center leading-30 cursor-pointer duration-300"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
</style>
