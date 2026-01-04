<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'

gsap.registerPlugin(ScrollTrigger)

const list = ref<any[]>([])

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
}, {
    label: 11,
    value: 11,
    color: 'white',
}, {
    label: 12,
    value: 12,
    color: 'black',
}, {
    label: 13,
    value: 13,
    color: 'orange',
}, {
    label: 14,
    value: 14,
    color: 'yellow',
}, {
    label: 15,
    value: 14,
    color: 'pink',
}, {
    label: 15,
    value: 15,
    color: 'orange',
}, {
    label: 16,
    value: 16,
    color: 'yellow',
}, {
    label: 17,
    value: 17,
    color: 'green',
}, {
    label: 18,
    value: 18,
    color: 'purple',
}]

// 为每个 li 元素创建引用
const liRefs = ref()
const scrollContainerRef = ref()
const ctx = ref()
const showUpButton = ref(false)
const showDownButton = ref(true)

function initGsapAnimation() {
    ctx.value = gsap.context(() => {
        liRefs.value.forEach((box: any) => {
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
        })
    }, scrollContainerRef.value) // <- Scope!
}

function disposeGsapAnimation() {
    ctx.value.revert() // <- Easy Cleanup!
}
function scrollHandler() {
    const scrollHeight = scrollContainerRef.value.scrollHeight
    const scrollTop = scrollContainerRef.value.scrollTop
    const containerHeight = scrollContainerRef.value.clientHeight
    // 滚动滑到底部
    if (scrollTop + containerHeight >= scrollHeight) {
        showDownButton.value = false
        showUpButton.value = true
    }
    // 在中间
    else if (scrollTop && scrollTop + containerHeight < scrollHeight) {
        showDownButton.value = true
        showUpButton.value = true
    }
    // 滚动滑到顶部
    else {
        showDownButton.value = true
        showUpButton.value = false
    }
}
function listenScrollContainer() {
    scrollContainerRef.value.addEventListener('scroll', scrollHandler)
}
function removeScrollContainer() {
    if (scrollContainerRef.value) {
        scrollContainerRef.value.removeEventListener('scroll', scrollHandler)
    }
}

function handleScroll(h: number) {
    scrollContainerRef.value.scrollTop += h
}
onMounted(() => {
    initGsapAnimation()
    listenScrollContainer()
})
onBeforeUnmount(() => {
    removeScrollContainer()
})
onUnmounted(() => {
    disposeGsapAnimation()
})
</script>

<template>
  <div class="h-full w-48 flex flex-col justify-center overflow-hidden relative">
    <div class="w-full h-16 flex justify-center scroll-button scroll-button-up">
      <SvgIcon v-show="showUpButton" name="chevron-up" size="64px" class="text-gray-200/80 cursor-pointer" @click="handleScroll(-100)" />
    </div>
    <div ref="scrollContainerRef" class="h-150 w-48 overflow-y-auto overflow-x-hidden relative scroll-smooth hide-scrollbar">
      <ul class="li-container relative bg-slate-500/50">
        <li
          v-for="item in list" :key="item.value" ref="liRefs" :style="{ backgroundColor: item.color }"
          class="w-full h-28 text-center leading-30 cursor-pointer duration-300"
        >
          {{ item.label }}
        </li>
        <li class="h-16" />
      </ul>
    </div>
    <div class="w-full h-16 flex justify-center scroll-button scroll-button-down">
      <SvgIcon v-show="showDownButton" name="chevron-down" size="64px" class="text-gray-200/80 cursor-pointer" @click="handleScroll(100)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-button::before,
.scroll-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transform: translate(12px 12px);
}

.scroll-button::before {
  transform: translate(0, -6px);
  opacity: 0.6;
}

.scroll-button::after {
  transform: translate(0, 6px);
  opacity: 0.4;
}

/* 添加动画效果 */
.scroll-button-down {
  animation: bounce-down 2s infinite;
}
/* 添加动画效果 */
.scroll-button-up {
  animation: bounce-up 2s infinite;
}

@keyframes bounce-down {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-2px);
  }
}
@keyframes bounce-up {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(5px);
  }
  60% {
    transform: translateY(2px);
  }
}

.scroll-button:hover {
  transform: translateY(-3px);
}
</style>
