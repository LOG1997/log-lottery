<script setup lang="ts">
import PlayMusic from '@/components/PlayMusic/index.vue'
import useStore from '@/store'
import { themeChange } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const globalConfig = useStore().globalConfig
const prizeConfig = useStore().prizeConfig
const system = useStore().system
const { getTheme: localTheme } = storeToRefs(globalConfig)
const { getPrizeConfig: prizeList } = storeToRefs(prizeConfig)

const tipDialog = ref()

// 设置当前奖列表
function setCurrentPrize() {
  if (prizeList.value.length <= 0) {
    return
  }
  for (let i = 0; i < prizeList.value.length; i++) {
    if (!prizeList.value[i].isUsed) {
      prizeConfig.setCurrentPrize(prizeList.value[i])

      break
    }
  }
}
// 判断是否手机端访问
function judgeMobile() {
  const ua = navigator.userAgent
  const isAndroid = ua.includes('Android') || ua.includes('Adr')
  const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

  system.setIsMobile(isAndroid || isIOS)

  return isAndroid || isIOS
}
// 判断是否chrome或者edge访问
function judgeChromeOrEdge() {
  const ua = navigator.userAgent
  const isChrome = ua.includes('Chrome')
  const isEdge = ua.includes('Edg')

  system.setIsChrome(isChrome)

  return isChrome || isEdge
}
onMounted(() => {
  themeChange(localTheme.value.name)
  setCurrentPrize()
  if (judgeMobile() || !judgeChromeOrEdge()) {
    tipDialog.value.showModal()
  }
})
</script>

<template>
  <dialog id="my_modal_1" ref="tipDialog" class="border-none modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ t('dialog.titleTip') }}
      </h3>
      <p v-if="judgeMobile()" class="py-4">
        {{ t('dialog.dialogPCWeb') }}
      </p>
      <p v-if=" !judgeChromeOrEdge()" class="py-4">
        {{ t('dialog.dialogLatestBrowser') }}
      </p>
      <div class="modal-action">
        <form method="dialog" class="flex justify-start w-full gap-3">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">
            {{ t('button.confirm') }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
  <router-view />
  <PlayMusic class="absolute right-0 bottom-1/2" />
</template>

<style scoped lang="scss"></style>
