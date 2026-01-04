<script setup lang="ts">
import type { Ref } from 'vue'
import { throttle } from 'lodash-es' // lodash-es 节流
import Masonry from 'masonry-layout'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

// 布局参数 Props
interface MasonryWaterfallProps {
    columnWidth?: number | string // 列宽（px/选择器）
    gutter?: number // 列/行间距
    fitWidth?: boolean // 容器宽度自适应居中
}

// 默认参数
const props = withDefaults(defineProps<MasonryWaterfallProps>(), {
    columnWidth: 120,
    gutter: 16,
    fitWidth: true,
})

// Vue Ref 管理 DOM 容器和 masonry 实例
const masonryContainer: Ref<HTMLDivElement | null> = ref(null)
const masonryInstance: Ref<Masonry | null> = ref(null)

// 初始化 masonry（仅执行一次，因卡片固定）
async function initMasonry() {
    if (!masonryContainer.value)
        return

    // 等待插槽内容（固定卡片）完全渲染
    await nextTick()

    // 初始化 masonry 实例（固定卡片无需销毁旧实例）
    masonryInstance.value = new Masonry(masonryContainer.value, {
        itemSelector: '.masonry-container > *', // 匹配所有固定子项
        columnWidth: props.columnWidth,
        gutter: props.gutter,
        fitWidth: props.fitWidth,
        initLayout: true, // 固定卡片直接初始化布局
    })
}

// 刷新布局（仅用于卡片内部内容高度变化）
async function refreshLayout() {
    await nextTick()
    if (masonryInstance.value) {
        masonryInstance.value.layout?.()
    }
}

// 窗口缩放节流重排（优化性能）
const handleResize = throttle(() => {
    if (masonryInstance.value) {
        masonryInstance.value.layout?.()
    }
}, 300)

// 生命周期：挂载时初始化，卸载时清理
onMounted(async () => {
    await initMasonry()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    // 销毁实例 + 释放内存
    if (masonryInstance.value) {
        masonryInstance.value.destroy?.()
        masonryInstance.value = null
    }
    // 移除监听 + 取消节流任务
    window.removeEventListener('resize', handleResize)
    handleResize.cancel()
})

// 仅暴露刷新方法（适配卡片内部内容变化）
defineExpose({ refreshLayout })
</script>

<template>
  <!-- masonry 容器：ref 绑定，接收固定插槽内容 -->
  <div ref="masonryContainer" class="masonry-container">
    <!-- 插槽：直接传入固定的卡片/组件 -->
    <slot />
  </div>
</template>

<style scoped>
.masonry-container {
  width: 100%;
  /* max-width: 1400px; */
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

/* 固定卡片基础样式 */
.masonry-container > * {
  margin-bottom: v-bind('`${gutter}px`');
  box-sizing: border-box;
  break-inside: avoid; /* 兼容 Safari */
  min-height: 100px; /* 避免内容过矮导致布局异常 */
}

/* 响应式适配：小屏调整列宽 */
/* @media (max-width: 768px) {
  .masonry-container {
    padding: 10px;
  }
  .masonry-container > * {
    width: calc(50% - v-bind('`${gutter}px`')) !important;
  }
} */
</style>
