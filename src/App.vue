<script setup lang="ts">
import { onMounted } from 'vue'
import useStore from '@/store'

import { themeChange } from 'theme-change'

const globalConfig = useStore().globalConfig
const { getTheme: localTheme } = globalConfig
const setLocalTheme=(theme: any)=>{
    themeChange(theme.name)
}
onMounted(() => {
    setLocalTheme(localTheme)
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="scss">
</style>
