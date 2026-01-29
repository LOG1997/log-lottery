<script setup lang='ts'>
import type { LoadingOptions } from './loading-context'
import { inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { loadingKey } from './loading-context'

// 注入全局状态
const loading = inject(loadingKey) as LoadingOptions
const popoverRef = ref()
const { t } = useI18n()
// 解构状态（响应式）
const { visible, text } = loading

watch(visible, (val) => {
    if (val) {
        // loading.show()
        popoverRef.value.showPopover()
    }
    else {
        loading.hide()
    }
})
</script>

<template>
  <div v-show="visible" ref="popoverRef" popover class="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] flex flex-col gap-6 justify-center items-center">
    <span v-if="visible" class="loading loading-spinner loading-xl" />
    <span>{{ text ? text : t('button.loading') }}</span>
  </div>
</template>

<style scoped>

</style>
