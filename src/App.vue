<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { loadingKey, loadingState } from '@/components/Loading'
// import PlayMusic from '@/components/PlayMusic/index.vue'
import useStore from '@/store'
import { themeChange } from '@/utils'

provide(loadingKey, loadingState)
const { t } = useI18n()
const globalConfig = useStore().globalConfig
const prizeConfig = useStore().prizeConfig
const system = useStore().system
const { getTheme: localTheme } = storeToRefs(globalConfig)
const { getPrizeConfig: prizeList } = storeToRefs(prizeConfig)
</script>

<template>
  <router-view />
</template>

<style scoped lang="scss"></style>
