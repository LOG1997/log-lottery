<script setup lang="ts">
import PlayMusic from '@/components/PlayMusic/index.vue'
import useStore from '@/store'
import { themeChange } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { setupPersonConfigWatcher } from '@/store/personConfig'
import { setupPrizeConfigWatcher } from '@/store/prizeConfig'
import { setupGlobalConfigWatcher } from '@/store/globalConfig'
import { initServerStorage } from '@/store/theme'

const { t } = useI18n()
const globalConfig = useStore().globalConfig
const prizeConfig = useStore().prizeConfig
const personConfig = useStore().personConfig
const system = useStore().system
const themeStore = useStore().themeStore
const { getTheme: localTheme } = storeToRefs(globalConfig)
const { getPrizeConfig: prizeList } = storeToRefs(prizeConfig)

// 数据是否加载完成
const isDataLoaded = ref(false)

// 从URL获取主题ID
function getThemeIdFromUrl(): string | null {
  const path = window.location.pathname
  const match = path.match(/\/t\/([^/]+)/)
  if (match && match[1] && match[1] !== 'undefined') {
    return match[1]
  }
  return null
}

// 加载主题数据
async function loadThemeData() {
  // 优先从URL获取主题ID
  let themeId = getThemeIdFromUrl()
  
  // 如果URL中没有，从store获取
  if (!themeId) {
    themeId = themeStore.currentThemeId
  }
  
  // 如果store中也没有，从localStorage获取
  if (!themeId) {
    try {
      const stored = localStorage.getItem('themeStore')
      if (stored) {
        const parsed = JSON.parse(stored)
        themeId = parsed.currentThemeId
      }
    }
    catch {
      // ignore
    }
  }
  
  if (themeId && themeId !== 'undefined') {
    // 确保 store 中的 currentThemeId 已设置
    themeStore.selectTheme(themeId)
    
    await personConfig.loadFromTheme()
    await prizeConfig.loadFromTheme()
    await globalConfig.loadFromTheme()
  }
  
  // 标记数据加载完成
  isDataLoaded.value = true
}

// 监听主题切换（仅在切换时触发，不在初始化时触发）
watch(
  () => themeStore.currentThemeId,
  async (newId, oldId) => {
    // 只有在真正切换主题时才重新加载（oldId 存在且不同）
    if (newId && oldId && newId !== oldId) {
      await loadThemeData()
    }
  }
)

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
// 检查是否是抽奖页面（手机端可以正常访问）
function isLotteryPage() {
  const path = window.location.pathname
  const hash = window.location.hash
  // 同时支持 history 和 hash 路由模式
  return path.includes('/t/') || hash.includes('/t/')
}

onMounted(async () => {
  // 初始化服务器存储
  await initServerStorage()
  
  // 从服务器加载主题列表
  await themeStore.loadThemesFromServer()
  
  // 加载主题数据
  await loadThemeData()
  
  // 设置数据监听器（自动保存）
  setupPersonConfigWatcher()
  setupPrizeConfigWatcher()
  setupGlobalConfigWatcher()
  
  themeChange(localTheme.value.name)
  setCurrentPrize()
  
  // 移动端在抽奖页面不显示提示（有专门的手机端UI）
  const isMobile = judgeMobile()
  const onLotteryPage = isLotteryPage()
  
  if (isMobile && onLotteryPage) {
    // 移动端访问抽奖页面，不显示提示
    return
  }
  
  // 非Chrome/Edge浏览器显示提示（移动端不在抽奖页面也显示）
  if (!judgeChromeOrEdge()) {
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
  
  <!-- 数据加载中显示loading -->
  <div v-if="!isDataLoaded" class="fixed inset-0 flex items-center justify-center bg-base-100 z-50">
    <div class="flex flex-col items-center gap-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <span class="text-lg opacity-70">Loading...</span>
    </div>
  </div>
  
  <!-- 数据加载完成后显示内容 -->
  <template v-else>
    <router-view />
    <PlayMusic class="absolute right-0 bottom-1/2" />
  </template>
</template>

<style scoped lang="scss"></style>
