<script setup lang='ts'>
import { gsap } from 'gsap'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const list = ref<Array<any>>([])

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
const liRefs = ref<HTMLElement[]>([])
// 存储 Intersection Observer 实例
const observers = ref<IntersectionObserver[]>([])
// 存储滚动容器引用
const scrollContainerRef = ref<HTMLElement>()
// 存储元素可见度信息
const elementVisibility = ref<Map<number, { progress: number, inView: boolean }>>(new Map())

// 设置引用
function setLiRef(el: HTMLElement | null, index: number) {
  if (el) {
    liRefs.value[index] = el
  }
}

// 初始化滚动容器的 Intersection Observer
function initScrollObserver() {
  if (!scrollContainerRef.value)
    return

  // 为每个列表项创建观察器
  liRefs.value.forEach((el, index) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const rect = entry.boundingClientRect
        const rootBounds = entry.rootBounds
        
        // 计算元素在容器中的可见进度 (0到1)
        let progress = 0
        if (rootBounds) {
          const elementHeight = rect.height
          const visibleHeight = Math.min(rootBounds.bottom, rect.bottom) - Math.max(rootBounds.top, rect.top)
          progress = Math.max(0, Math.min(1, visibleHeight / elementHeight))
        }
        
        // 更新元素可见度信息
        elementVisibility.value.set(index, {
          progress,
          inView: entry.isIntersecting
        })
        
        // 根据滚动进度调整3D变换
        updateElementTransform(index, el, progress)
      })
    }, {
      root: scrollContainerRef.value, // 使用滚动容器作为根
      rootMargin: '50px 0px', // 扩展观察区域
      threshold: Array.from({ length: 21 }, (_, i) => i * 0.05), // 0%, 5%, 10%, ..., 100%
    })

    observer.observe(el)
    observers.value[index] = observer
  })
}

// 根据滚动进度更新元素的3D变换
function updateElementTransform(index: number, el: HTMLElement, progress: number) {
  // 如果元素已经在执行动画，取消之前的动画
  gsap.killTweensOf(el)
  
  // 根据滚动进度计算3D变换参数
  const rotationY = 90 * (1 - progress) // 从90度旋转到0度
  const rotationX = 45 * (1 - progress) // 从45度旋转到0度
  const opacity = 0.5 + 0.5 * progress // 从0.5到1
  const scale = 0.8 + 0.2 * progress // 从0.8到1
  
  gsap.to(el, {
    rotationY,
    rotationX,
    opacity,
    scale,
    duration: 0.1, // 快速更新以匹配滚动
    ease: 'power2.out',
    transformPerspective: 1000,
    transformOrigin: 'center center',
  })
}

// 滚动事件处理 - 为当前可见元素添加微调动画
function handleScroll() {
  if (!scrollContainerRef.value)
    return

  // 获取滚动信息
  const scrollTop = scrollContainerRef.value.scrollTop
  const scrollHeight = scrollContainerRef.value.scrollHeight
  const clientHeight = scrollContainerRef.value.clientHeight
  const scrollPercent = scrollTop / (scrollHeight - clientHeight)

  // 对可见元素执行基于滚动的微调动画
  elementVisibility.value.forEach((visibility, index) => {
    if (visibility.inView) {
      const el = liRefs.value[index]
      if (el) {
        // 基于滚动位置的微调变换
        const elementRect = el.getBoundingClientRect()
        const containerRect = scrollContainerRef.value!.getBoundingClientRect()

        // 计算元素相对于视窗的位置
        const elementPosition = (elementRect.top - containerRect.top) / containerRect.height

        // 根据元素在容器中的位置应用轻微的3D变换
        const rotationX = (elementPosition - 0.5) * 5 * visibility.progress // -2.5 到 2.5 度，根据可见度调整
        const rotationY = scrollPercent * 3 // 基于滚动的 Y 轴轻微旋转

        gsap.to(el, {
          rotationX,
          rotationY,
          scale: 1 + (1 - Math.abs(elementPosition - 0.5)) * 0.05, // 中间元素稍微放大
          duration: 0.1,
          ease: 'none',
          overwrite: 'auto',
          transformPerspective: 1000,
          transformOrigin: 'center center',
        })
      }
    }
  })
}

// 点击时执行 3D 翻转动画
function flipItem(index: number) {
  const el = liRefs.value[index]
  if (el) {
    gsap.to(el, {
      rotationY: 360,
      duration: 0.8,
      ease: 'power2.inOut',
      transformPerspective: 1000,
      transformOrigin: 'center center',
    })
  }
}

// 鼠标悬停时的 3D 效果
function hoverItem(index: number, isHovering: boolean) {
  const el = liRefs.value[index]
  if (el) {
    if (isHovering) {
      gsap.to(el, {
        rotationX: 10,
        rotationY: 10,
        scale: 1.08,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
        transformOrigin: 'center center',
      })
    }
    else {
      // 恢复到基于滚动的动画状态
      const visibility = elementVisibility.value.get(index)
      if (visibility) {
        const elementRect = el.getBoundingClientRect()
        const containerRect = scrollContainerRef.value!.getBoundingClientRect()
        const elementPosition = (elementRect.top - containerRect.top) / containerRect.height
        const rotationX = (elementPosition - 0.5) * 5 * visibility.progress

        gsap.to(el, {
          rotationX,
          rotationY: 0, // 鼠标离开时重置 Y 旋转
          scale: 1 + (1 - Math.abs(elementPosition - 0.5)) * 0.05,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000,
          transformOrigin: 'center center',
        })
      }
    }
  }
}

// 初始化动画
async function initAnimations() {
  await nextTick() // 确保 DOM 已渲染

  // 初始化 Intersection Observer
  initScrollObserver()

  // 为所有元素设置初始堆叠状态
  liRefs.value.forEach((el, index) => {
    // 设置初始状态 - 堆叠状态
    gsap.set(el, {
      rotationY: 90,
      rotationX: 45,
      opacity: 0.5,
      scale: 0.8,
      transformPerspective: 1000,
      transformOrigin: 'center center',
    })
    
    // 初始化可见度信息
    elementVisibility.value.set(index, {
      progress: 0,
      inView: false
    })
  })
}

onMounted(() => {
  initAnimations()

  // 添加滚动事件监听
  nextTick(() => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.addEventListener('scroll', handleScroll, { passive: true })
    }
  })
})

onUnmounted(() => {
  // 清理 Intersection Observer
  observers.value.forEach((observer) => {
    if (observer) {
      observer.disconnect()
    }
  })

  // 移除滚动事件监听
  if (scrollContainerRef.value) {
    scrollContainerRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="h-full flex flex-col justify-center overflow-hidden">
    <div
      ref="scrollContainerRef"
      class="h-150 w-48 overflow-y-auto"
    >
      <ul class="transform3d-container">
        <li
          v-for="(item, index) in list"
          :key="item.value"
          :ref="el => setLiRef(el, index)"
          :style="{ backgroundColor: item.color }"
          class="w-full h-28 text-center leading-30 cursor-pointer transform-style-3d transition-transform duration-300"
          @click="flipItem(index)"
          @mouseenter="hoverItem(index, true)"
          @mouseleave="hoverItem(index, false)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.transform3d-container {
  perspective: 1200px; /* 设置容器透视 */
}

.transform-style-3d {
  transform-style: preserve-3d; /* 保持 3D 变换 */
  backface-visibility: hidden; /* 隐藏背面 */
  transform-origin: center center; /* 设置变换原点 */
  transform: translateZ(0); /* 启用硬件加速 */
}
</style>