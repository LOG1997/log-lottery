<script setup lang="ts">
import { onMounted } from 'vue'
import useStore from '@/store'
import { storeToRefs } from 'pinia'
import PlayMusic from '@/components/PlayMusic/index.vue'

import { themeChange } from 'theme-change'

const globalConfig = useStore().globalConfig
const prizeConfig = useStore().prizeConfig
const { getTheme: localTheme } = storeToRefs(globalConfig)
const { getPrizeConfig: prizeList } = storeToRefs(prizeConfig)
const setLocalTheme = (theme: any) => {
    themeChange(theme.name)
}

// 设置当前奖列表
const setCurrentPrize = () => {
    if (prizeList.value.length <= 0) {
        return
    }
    for (let i = 0; i < prizeList.value.length; i++) {
        if (!prizeList.value[i].isUsed) {
            prizeConfig.setCurrentPrize(prizeList.value[i])

            break
        }
    }

    return
}
onMounted(() => {
    setLocalTheme(localTheme.value)
    setCurrentPrize()
})
</script>

<template>
    <router-view></router-view>
    <PlayMusic class="absolute right-0 bottom-1/2"></PlayMusic>
</template>

<style scoped lang="scss"></style>
