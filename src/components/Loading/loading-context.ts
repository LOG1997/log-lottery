// src/contexts/loading-context.ts
import type { InjectionKey, Ref } from 'vue'
import { ref } from 'vue'

// 定义 Loading 配置类型
export interface LoadingOptions {
    visible: Ref<boolean>
    text: Ref<string>
    fullscreen: Ref<boolean>
    zIndex: Ref<number>
    count: Ref<number>
    show: (options?: Partial<{ text: string, fullscreen: boolean, zIndex: number }>) => void
    hide: () => void
}

// 注入密钥（Symbol 确保唯一性）
export const loadingKey: InjectionKey<LoadingOptions> = Symbol('loading')

// 全局状态（单例）
const visible = ref(false)
const text = ref('')
const fullscreen = ref(true)
const zIndex = ref(9999)
const count = ref(0)

// 显示 Loading
function show(options?: Partial<{ text: string, fullscreen: boolean, zIndex: number }>) {
    count.value++
    if (count.value > 1)
        return
    visible.value = true
    if (options) {
        text.value = options.text || ''
        fullscreen.value = options.fullscreen ?? true
        zIndex.value = options.zIndex || 9999
    }
}

// 隐藏 Loading
function hide() {
    if (count.value <= 0)
        return
    count.value--
    if (count.value === 0) {
        visible.value = false
        text.value = ''
        fullscreen.value = true
        zIndex.value = 9999
    }
}

// 导出全局状态（供根组件提供）
export const loadingState: LoadingOptions = {
    visible,
    text,
    fullscreen,
    zIndex,
    count,
    show,
    hide,
}
