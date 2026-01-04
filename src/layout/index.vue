<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomModal from '@/components/Dialog/index.vue'
import { Loading } from '@/components/Loading'
import ToTop from '@/components/ToTop/index.vue'
import RightButton from './RightButton/index.vue'
import { useMounted } from './useMounted'

const tipDialog = ref()
const { tipDesc } = useMounted(tipDialog)
const { t } = useI18n()
const mainContainer = ref<HTMLElement | null>(null)
const { y } = useScroll(mainContainer)

function scrollToTop() {
    mainContainer.value?.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}
</script>

<template>
  <div class="w-screen">
    <Loading />
    <ToTop v-if="y > 400" @click="scrollToTop" />
    <main ref="mainContainer" class="box-content w-screen h-screen overflow-x-hidden overflow-y-auto main-container">
      <router-view class="h-full main-container-content" />
    </main>
    <RightButton class="absolute right-0 bottom-1/2" />
    <CustomModal ref="tipDialog" :title="t('dialog.titleTip')" :desc="tipDesc" />
  </div>
</template>

<style scoped lang="scss">

</style>
