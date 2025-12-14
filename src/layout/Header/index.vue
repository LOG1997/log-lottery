<script setup lang="ts">
import { navList } from './config'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore, type ITheme } from '@/store/theme'
import { useGlobalConfig } from '@/store/globalConfig'
import { usePersonConfig } from '@/store/personConfig'
import { usePrizeConfig } from '@/store/prizeConfig'
import { computed } from 'vue'

const router = useRouter()
const { t } = useI18n()
const themeStore = useThemeStore()
const globalConfig = useGlobalConfig()
const personConfig = usePersonConfig()
const prizeConfig = usePrizeConfig()

const currentTheme = computed(() => themeStore.getCurrentTheme)
const allThemes = computed(() => themeStore.getAllThemes)
const otherThemes = computed(() => allThemes.value.filter(t => t.id !== currentTheme.value?.id))

function skip(url: string) {
  window.open(url, '_self')
}

function switchTheme(theme: ITheme) {
  // 切换到新主题
  themeStore.selectTheme(theme.id)
  
  // 加载该主题的数据
  personConfig.loadFromTheme()
  prizeConfig.loadFromTheme()
  globalConfig.loadFromTheme()
  
  // 跳转到新主题的URL
  router.push(`/log-lottery/t/${theme.id}`)
  
  // 刷新页面以重新渲染
  setTimeout(() => {
    window.location.reload()
  }, 100)
}

function exitTheme() {
  themeStore.exitTheme()
  router.push('/log-lottery/entry')
}

function goToEntry() {
  router.push('/log-lottery/entry')
}

// 复制分享链接
function copyShareLink() {
  if (!currentTheme.value) return
  
  const baseUrl = window.location.origin
  const shareUrl = `${baseUrl}/log-lottery/t/${currentTheme.value.id}`
  
  navigator.clipboard.writeText(shareUrl).then(() => {
    // 显示复制成功提示
    const toast = document.createElement('div')
    toast.className = 'toast toast-top toast-center z-[9999]'
    toast.innerHTML = `<div class="alert alert-success"><span>${t('entry.linkCopied')}</span></div>`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  })
}
</script>

<template>
  <div class="h-full header-container">
    <div class="p-0 navbar bg-base-100">
      <div class="navbar-start max-lg:w-full">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-lg flex flex-col gap-2"
          >
            <li v-for="item in navList" :key="item.id" class="cursor-pointer hover:text-gray-100 hover:bg-base-200" @click="skip(item.url)">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <a class="text-xl lg:pl-12 max-lg:mx-auto" href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo">
        </a>
      </div>
      <div class="hidden navbar-center lg:flex">
        <ul class="flex gap-10 px-1 text-lg cursor-pointer menu menu-horizontal">
          <li v-for="item in navList" :key="item.id" class="hover:text-gray-100" @click="skip(item.url)">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="navbar-end max-lg:w-0 flex items-center gap-2">
        <!-- 主题切换下拉菜单 -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-sm gap-1">
            <span class="text-lg">🎯</span>
            <span class="hidden lg:inline max-w-32 truncate">{{ currentTheme?.name }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </label>
          <ul tabindex="0" class="dropdown-content z-[100] menu p-2 shadow-lg bg-base-200 rounded-box w-56 mt-2">
            <!-- 当前主题 -->
            <li class="menu-title text-xs opacity-60">{{ t('entry.currentTheme') }}</li>
            <li>
              <a class="active font-semibold">
                <span class="truncate">{{ currentTheme?.name }}</span>
                <span class="badge badge-primary badge-sm">{{ t('entry.current') }}</span>
              </a>
            </li>
            
            <!-- 其他主题 -->
            <li v-if="otherThemes.length > 0" class="menu-title text-xs opacity-60 mt-2">{{ t('entry.switchTo') }}</li>
            <li v-for="theme in otherThemes" :key="theme.id">
              <a @click="switchTheme(theme)" class="truncate">
                {{ theme.name }}
              </a>
            </li>
            
            <!-- 分隔线和操作 -->
            <div class="divider my-1"></div>
            <li>
              <a @click="copyShareLink" class="text-success">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {{ t('entry.shareLink') }}
              </a>
            </li>
            <li>
              <a @click="goToEntry" class="text-primary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ t('entry.manageThemes') }}
              </a>
            </li>
            <li>
              <a @click="exitTheme" class="text-error">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {{ t('entry.exitTheme') }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
