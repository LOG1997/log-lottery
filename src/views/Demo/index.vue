<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref } from 'vue'

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
      gsap.fromTo(box, { rotationX: -90, rotateZ: -20, opacity: 0 }, {
        rotationX: 0,
        rotateZ: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: box,
          scroller: scrollContainerRef.value, // <- Specify the scroller!
          start: 'bottom 100%',
          end: 'top 70%',
          scrub: true,
        },
      })
      gsap.to(box, {
        rotationX: -90,
        rotateZ: -20,
        opacity: 0,
        scrollTrigger: {
          trigger: box,
          scroller: scrollContainerRef.value, // <- Specify the scroller!
          start: 'bottom 10%',
          end: 'top 70%',
          scrub: true,
        },
      })
    })
  }, main.value) // <- Scope!
})

onUnmounted(() => {
  ctx.value.revert() // <- Easy Cleanup!
})
</script>

<template>
  <div class="h-full flex flex-col justify-center overflow-hidden relative">
    <div ref="scrollContainerRef" class="h-150 w-48 overflow-y-auto overflow-x-hidden relative">
      <ul ref="main" class="li-container relative">
        <li
          v-for="item in list" :key="item.value" ref="liRefs" :style="{ backgroundColor: item.color }"
          class="w-full h-28 text-center leading-30 cursor-pointer duration-300"
        >
          {{ item.label }}
        </li>
        <li class="h-16" />
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.li-first {
    transform-style: preserve-3d;
    transform: rotate3d(1, 0, 0, 60deg);
    ;
}

.li-end {
    transform-style: preserve-3d;
    transform: rotate3d(1, 0, 0, -60deg);
    ;
}

.arrow-down-btn {
    bottom: 20px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 10px;
    z-index: 10;

    .arrow-container {
        position: relative;
        width: 30px;
        height: 30px;
    }

    .arrow {
        width: 30px;
        height: 30px;
        border-right: 3px solid rgba(107, 114, 128, 0.6); // 灰色半透明
        border-bottom: 3px solid rgba(107, 114, 128, 0.6); // 灰色半透明
        transform: rotate(45deg);
        position: absolute;
        top: 0;
        left: 0;
        animation: bounce 1.5s infinite;
    }

    .arrow-shadow {
        transform: rotate(45deg) translate(3px, 3px); // 偏移创建阴影效果
        opacity: 0.4;
        z-index: -1;
        animation: none; // 阴影不需要动画
    }

    .arrow:hover {
        border-right-color: rgba(75, 85, 99, 0.8);
        border-bottom-color: rgba(75, 85, 99, 0.8);
    }
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0) rotate(45deg);
    }

    40% {
        transform: translateY(-10px) rotate(45deg);
    }

    60% {
        transform: translateY(-5px) rotate(45deg);
    }
}
</style>
