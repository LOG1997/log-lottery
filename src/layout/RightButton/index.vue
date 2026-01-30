<script setup lang='ts'>
import { useFullscreen } from '@vueuse/core'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { Maximize, Minimize, TabletSmartphone } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import CustomDialog from '@/components/Dialog/index.vue'
import useStore from '@/store'
import { getOriginUrl, getUniqueSignature } from '@/utils/auth'
import { usePlayMusic } from './usePlayMusic'

const serverConfig = useStore().serverConfig
const {
    getServerStatus: serverStatus,
} = storeToRefs(serverConfig)
const { playMusic, currentMusic, nextPlay } = usePlayMusic()
const { isFullscreen, toggle: toggleScreen } = useFullscreen()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const customDialogRef = ref()
const settingRef = ref()
const fullScreenRef = ref()
const mobileUrl = shallowRef<string>('')
const qrCodeImg = useQRCode(mobileUrl)
const visible = ref(true)

function enterConfig() {
    router.push('/log-lottery/config')
}
function enterHome() {
    router.push('/log-lottery')
}
async function openMobileQrCode() {
    const originUrl = getOriginUrl()
    const userSignature = await getUniqueSignature()
    mobileUrl.value = `${originUrl}/log-lottery/mobile?user_signature=${userSignature}`
    customDialogRef.value.showDialog()
}
function handleSubmit() {

}

watch(() => route, (val) => {
    const { meta } = val
    if (meta && meta.isMobile) {
        visible.value = false
    }
}, { immediate: true })
onMounted(() => {
    if (!settingRef.value) {
        return
    }
    settingRef.value.addEventListener('mouseenter', () => {
        fullScreenRef.value.style.display = 'block'
    })
    settingRef.value.addEventListener('mouseleave', () => {
        fullScreenRef.value.style.display = 'none'
    })
})
</script>

<template>
  <div v-if="visible" ref="settingRef" class="flex flex-col gap-3">
    <CustomDialog
      ref="customDialogRef"
      title=""
      :submit-func="handleSubmit"
      footer="center"
      dialog-class="h-120 p-6"
    >
      <template #content>
        <div class="flex w-full justify-center h-90">
          <img :src="qrCodeImg" alt="qr code">
        </div>
      </template>
    </CustomDialog>
    <div ref="fullScreenRef" class="tooltip tooltip-left hidden" @click="toggleScreen">
      <div
        v-if="isFullscreen"
        class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
      >
        <Minimize />
      </div>
      <div
        v-else
        class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
      >
        <Maximize />
      </div>
    </div>
    <div v-if="route.path.includes('/config')" class="tooltip tooltip-left" :data-tip="t('tooltip.toHome')">
      <div
        class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
        @click="enterHome"
      >
        <svg-icon name="home" />
      </div>
    </div>
    <div v-else class="tooltip tooltip-left" :data-tip="t('tooltip.settingConfiguration')">
      <div
        class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
        @click="enterConfig"
      >
        <svg-icon name="setting" />
      </div>
    </div>
    <div class="tooltip tooltip-left" :data-tip="currentMusic.item ? `${currentMusic.item.name}\n\r ${t('tooltip.nextSong')}` : t('tooltip.noSongPlay')">
      <div
        class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
        @click="playMusic(currentMusic.item)" @click.right.prevent="nextPlay"
      >
        <svg-icon :name="currentMusic.paused ? 'play' : 'pause'" />
      </div>
    </div>
    <div v-if="serverStatus" class="tooltip tooltip-left" data-tip="访问手机端">
      <div class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90" @click="openMobileQrCode">
        <TabletSmartphone />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
details {

    // display: none;
    summary {
        display: none;
    }
}
</style>
